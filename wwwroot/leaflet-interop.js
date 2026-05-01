// leaflet-interop.js
// Two-phase map: world view (country click) → zoomed view (city click)

const MAPTILER_KEY = 'pvbPvKOk0WT01KTWvQdX';

let _map = null;
let _dotNetHelper = null;
let _phase = 1;
let _geojsonData = null;
let _clickMarker = null;
let _correctMarker = null;

// ── Init ───────────────────────────────────────────────────────────────────

window.mapLeafletInit = async function (dotNetHelper) {
    _dotNetHelper = dotNetHelper;

    // Remove existing map if any
    if (_map) {
        _map.remove();
        _map = null;
    }

    // Load GeoJSON country boundaries
    if (!_geojsonData) {
        const res = await fetch('/countries.geojson');
        console.log('GeoJSON status:', res.status, res.ok);
        if (!res.ok) {
            console.error('countries.geojson not found');
            return;
        }
        const text = await res.text();
        console.log('GeoJSON size:', text.length, 'chars');
        try {
            _geojsonData = JSON.parse(text);
            console.log('GeoJSON loaded:', _geojsonData.features?.length, 'countries');
            console.log('Sample feature properties:', JSON.stringify(_geojsonData.features[0].properties));
        } catch (e) {
            console.error('GeoJSON parse error:', e.message);
            return;
        }
    }

    // Get map element and ensure it has height
    const mapEl = document.getElementById('leaflet-map');
    if (!mapEl) {
        console.error('leaflet-map element not found');
        return;
    }

    console.log('Map element dimensions:', mapEl.offsetWidth, 'x', mapEl.offsetHeight);

    // Force height if flex hasn't given it one
    if (mapEl.offsetHeight < 100) {
        mapEl.style.height = '500px';
        console.log('Forced map height to 500px');
    }

    // Create Leaflet map
    try {
        _map = L.map('leaflet-map', {
            center: [20, 0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 12,
            zoomControl: true,
            attributionControl: false
        });
        console.log('Map created successfully');
    } catch (e) {
        console.error('L.map() failed:', e.message);
        return;
    }

    // MapTiler dataviz tiles
    try {
        L.tileLayer(
            `https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
            {
                tileSize: 256,
                crossOrigin: true,
                maxZoom: 12
            }
        ).addTo(_map);
        console.log('Tile layer added');
    } catch (e) {
        console.error('Tile layer failed:', e.message);
    }

    // Click handler
    _map.on('click', onMapClick);
    _phase = 1;

    console.log('Map fully initialized');
};

// ── Click Handler ──────────────────────────────────────────────────────────

async function onMapClick(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    if (_phase === 1) {
        const country = getCountryFromLatLon(lat, lon);

        if (!country) {
            console.log('Clicked ocean or unrecognized area');
            return;
        }

        console.log('Phase 1 click:', country.code, country.name);
        placeClickMarker(lat, lon, country.name);

        await _dotNetHelper.invokeMethodAsync(
            'OnPhase1Click',
            country.code,
            country.name,
            lat,
            lon
        );

    } else if (_phase === 2) {
        console.log('Phase 2 click:', lat, lon);
        placeClickMarker(lat, lon, '📍 Your guess');

        await _dotNetHelper.invokeMethodAsync(
            'OnPhase2Click',
            lat,
            lon
        );
    }
}

// ── Phase Transition ───────────────────────────────────────────────────────

window.flyToCountry = function (lat, lon, countryName) {
    _phase = 2;
    clearMarkers();
    console.log('Flying to', countryName, lat, lon);

    _map.flyTo([lat, lon], 5, {
        duration: 1.5
    });
};

window.revealAnswer = function (cityLat, cityLon, cityName) {
    if (_correctMarker) _map.removeLayer(_correctMarker);

    _correctMarker = L.marker([cityLat, cityLon], {
        icon: L.divIcon({
            className: '',
            html: `<div class="answer-marker">✅ ${cityName}</div>`,
            iconAnchor: [0, 0]
        })
    }).addTo(_map);

    _map.flyTo([cityLat, cityLon], 7, { duration: 1.2 });
};

window.resetMapToWorld = function () {
    _phase = 1;
    clearMarkers();
    if (_map) {
        _map.flyTo([20, 0], 2, { duration: 1.0 });
    }
};

window.lockMap = function () {
    if (_map) _map.off('click', onMapClick);
};

window.unlockMap = function () {
    if (_map) {
        _map.off('click', onMapClick);
        _map.on('click', onMapClick);
    }
};

// ── Country Detection ──────────────────────────────────────────────────────
function getCountryFromLatLon(lat, lon) {
    if (!_geojsonData) return null;

    for (const feature of _geojsonData.features) {
        if (pointInFeature(lat, lon, feature)) {
            const code = feature.properties['ISO3166-1-Alpha-2']
                || feature.properties['ISO_A2']
                || feature.properties['iso_a2']
                || '';
            const name = feature.properties.name
                || feature.properties.ADMIN
                || '';
            if (name) return { code: code.toUpperCase(), name };
        }
    }
    return null;
}
function pointInFeature(lat, lon, feature) {
    const geom = feature.geometry;
    if (!geom) return false;

    if (geom.type === 'Polygon') {
        return pointInPolygon(lon, lat, geom.coordinates[0]);
    } else if (geom.type === 'MultiPolygon') {
        return geom.coordinates.some(poly => pointInPolygon(lon, lat, poly[0]));
    }
    return false;
}

// Ray casting algorithm
function pointInPolygon(x, y, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// ── Markers ────────────────────────────────────────────────────────────────

function placeClickMarker(lat, lon, label) {
    if (_clickMarker) _map.removeLayer(_clickMarker);

    _clickMarker = L.marker([lat, lon], {
        icon: L.divIcon({
            className: '',
            html: `<div class="click-marker">${label}</div>`,
            iconAnchor: [0, 0]
        })
    }).addTo(_map);
}

function clearMarkers() {
    if (_clickMarker)   { _map.removeLayer(_clickMarker);   _clickMarker   = null; }
    if (_correctMarker) { _map.removeLayer(_correctMarker); _correctMarker = null; }
}

// ── Tooltip ────────────────────────────────────────────────────────────────

let _tooltip = null;

function showTooltip(text) {
    if (!text) return;
    if (!_tooltip) {
        _tooltip = document.createElement('div');
        _tooltip.style.cssText = `
            position: fixed; pointer-events: none; z-index: 50;
            background: #0d0d0d; color: #f5f0e8;
            font-family: 'IBM Plex Mono', monospace; font-size: 11px;
            padding: 4px 8px; border: 1px solid #c0392b;
            text-transform: uppercase; letter-spacing: 0.08em;
        `;
        document.body.appendChild(_tooltip);
    }
    _tooltip.textContent = text;
    _tooltip.style.display = 'block';
    document.addEventListener('mousemove', moveTooltip);
}

function hideTooltip() {
    if (_tooltip) _tooltip.style.display = 'none';
    document.removeEventListener('mousemove', moveTooltip);
}

function moveTooltip(e) {
    if (_tooltip) {
        _tooltip.style.left = (e.clientX + 12) + 'px';
        _tooltip.style.top  = (e.clientY + 12) + 'px';
    }
}