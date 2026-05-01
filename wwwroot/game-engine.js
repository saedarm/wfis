// game-engine.js

// ── Country Lat/Lon Lookup ─────────────────────────────────────────────────
// [lat, lon] center points for proximity scoring

window.countryCoords = {
    "AF": [33.93911, 67.709953],
    "AL": [41.153332, 20.168331],
    "DZ": [28.033886, 1.659626],
    "AD": [42.546245, 1.601554],
    "AO": [-11.202692, 17.873887],
    "AG": [17.060816, -61.796428],
    "AR": [-38.416097, -63.616672],
    "AM": [40.069099, 45.038189],
    "AU": [-25.274398, 133.775136],
    "AT": [47.516231, 14.550072],
    "AZ": [40.143105, 47.576927],
    "BS": [25.03428, -77.39628],
    "BH": [25.930414, 50.637772],
    "BD": [23.684994, 90.356331],
    "BB": [13.193887, -59.543198],
    "BY": [53.709807, 27.953389],
    "BE": [50.503887, 4.469936],
    "BZ": [17.189877, -88.49765],
    "BJ": [9.30769, 2.315834],
    "BT": [27.514162, 90.433601],
    "BO": [-16.290154, -63.588653],
    "BA": [43.915886, 17.679076],
    "BW": [-22.328474, 24.684866],
    "BR": [-14.235004, -51.92528],
    "BN": [4.535277, 114.727669],
    "BG": [42.733883, 25.48583],
    "BF": [12.364566, -1.561593],
    "BI": [-3.373056, 29.918886],
    "CV": [16.002082, -24.013197],
    "KH": [12.565679, 104.990963],
    "CM": [3.848033, 11.502075],
    "CA": [56.130366, -106.346771],
    "CF": [6.611111, 20.939444],
    "TD": [15.454166, 18.732207],
    "CL": [-35.675147, -71.542969],
    "CN": [35.86166, 104.195397],
    "CO": [4.570868, -74.297333],
    "KM": [-11.875001, 43.872219],
    "CG": [-0.228021, 15.827659],
    "CD": [-4.038333, 21.758664],
    "CR": [9.748917, -83.753428],
    "CI": [7.539989, -5.54708],
    "HR": [45.1, 15.2],
    "CU": [21.521757, -77.781167],
    "CY": [35.126413, 33.429859],
    "CZ": [49.817492, 15.472962],
    "DK": [56.26392, 9.501785],
    "DJ": [11.825138, 42.590275],
    "DM": [15.414999, -61.370976],
    "DO": [18.735693, -70.162651],
    "EC": [-1.831239, -78.183406],
    "EG": [26.820553, 30.802498],
    "SV": [13.794185, -88.89653],
    "GQ": [1.650801, 10.267895],
    "ER": [15.179384, 39.782334],
    "EE": [58.595272, 25.013607],
    "SZ": [-26.522503, 31.465866],
    "ET": [9.145, 40.489673],
    "FJ": [-16.578193, 179.414413],
    "FI": [61.92411, 25.748151],
    "FR": [46.227638, 2.213749],
    "GA": [-0.803689, 11.609444],
    "GM": [13.443182, -15.310139],
    "GE": [42.315407, 43.356892],
    "DE": [51.165691, 10.451526],
    "GH": [7.946527, -1.023194],
    "GR": [39.074208, 21.824312],
    "GD": [12.262776, -61.604171],
    "GT": [15.783471, -90.230759],
    "GN": [9.945587, -9.696645],
    "GW": [11.803749, -15.180413],
    "GY": [4.860416, -58.93018],
    "HT": [18.971187, -72.285215],
    "HN": [15.199999, -86.241905],
    "HU": [47.162494, 19.503304],
    "IS": [64.963051, -19.020835],
    "IN": [20.593684, 78.96288],
    "ID": [-0.789275, 113.921327],
    "IR": [32.427908, 53.688046],
    "IQ": [33.223191, 43.679291],
    "IE": [53.41291, -8.24389],
    "IL": [31.046051, 34.851612],
    "IT": [41.87194, 12.56738],
    "JM": [18.109581, -77.297508],
    "JP": [36.204824, 138.252924],
    "JO": [30.585164, 36.238414],
    "KZ": [48.019573, 66.923684],
    "KE": [-0.023559, 37.906193],
    "KI": [-3.370417, -168.734039],
    "KP": [40.339852, 127.510093],
    "KR": [35.907757, 127.766922],
    "KW": [29.31166, 47.481766],
    "KG": [41.20438, 74.766098],
    "LA": [19.85627, 102.495496],
    "LV": [56.879635, 24.603189],
    "LB": [33.854721, 35.862285],
    "LS": [-29.609988, 28.233608],
    "LR": [6.428055, -9.429499],
    "LY": [26.3351, 17.228331],
    "LI": [47.166, 9.555373],
    "LT": [55.169438, 23.881275],
    "LU": [49.815273, 6.129583],
    "MG": [-18.766947, 46.869107],
    "MW": [-13.254308, 34.301525],
    "MY": [4.210484, 101.975766],
    "MV": [3.202778, 73.22068],
    "ML": [17.570692, -3.996166],
    "MT": [35.937496, 14.375416],
    "MH": [7.131474, 171.184478],
    "MR": [21.00789, -10.940835],
    "MU": [-20.348404, 57.552152],
    "MX": [23.634501, -102.552784],
    "FM": [7.425554, 150.550812],
    "MD": [47.411631, 28.369885],
    "MC": [43.750298, 7.412841],
    "MN": [46.862496, 103.846656],
    "ME": [42.708678, 19.37439],
    "MA": [31.791702, -7.09262],
    "MZ": [-18.665695, 35.529562],
    "MM": [21.913965, 95.956223],
    "NA": [-22.95764, 18.49041],
    "NR": [-0.522778, 166.931503],
    "NP": [28.394857, 84.124008],
    "NL": [52.132633, 5.291266],
    "NZ": [-40.900557, 174.885971],
    "NI": [12.865416, -85.207229],
    "NE": [17.607789, 8.081666],
    "NG": [9.081999, 8.675277],
    "MK": [41.608635, 21.745275],
    "NO": [60.472024, 8.468946],
    "OM": [21.512583, 55.923255],
    "PK": [30.375321, 69.345116],
    "PW": [7.51498, 134.58252],
    "PS": [31.952162, 35.233154],
    "PA": [8.537981, -80.782127],
    "PG": [-6.314993, 143.95555],
    "PY": [-23.442503, -58.443832],
    "PE": [-9.189967, -75.015152],
    "PH": [12.879721, 121.774017],
    "PL": [51.919438, 19.145136],
    "PT": [39.399872, -8.224454],
    "QA": [25.354826, 51.183884],
    "RO": [45.943161, 24.96676],
    "RU": [61.52401, 105.318756],
    "RW": [-1.940278, 29.873888],
    "KN": [17.357822, -62.782998],
    "LC": [13.909444, -60.978893],
    "VC": [12.984305, -61.287228],
    "WS": [-13.759029, -172.104629],
    "SM": [43.94236, 12.457777],
    "ST": [0.18636, 6.613081],
    "SA": [23.885942, 45.079162],
    "SN": [14.497401, -14.452362],
    "RS": [44.016521, 21.005859],
    "SC": [-4.679574, 55.491977],
    "SL": [8.460555, -11.779889],
    "SG": [1.352083, 103.819836],
    "SK": [48.669026, 19.699024],
    "SI": [46.151241, 14.995463],
    "SB": [-9.64571, 160.156194],
    "SO": [5.152149, 46.199616],
    "ZA": [-30.559482, 22.937506],
    "SS": [4.885057, 31.571251],
    "ES": [40.463667, -3.74922],
    "LK": [7.873054, 80.771797],
    "SD": [12.862807, 30.217636],
    "SR": [3.919305, -56.027783],
    "SE": [60.128161, 18.643501],
    "CH": [46.818188, 8.227512],
    "SY": [34.802075, 38.996815],
    "TW": [23.69781, 120.960515],
    "TJ": [38.861034, 71.276093],
    "TZ": [-6.369028, 34.888822],
    "TH": [15.870032, 100.992541],
    "TL": [-8.874217, 125.727539],
    "TG": [8.619543, 0.824782],
    "TO": [-21.178986, -175.198242],
    "TT": [10.691803, -61.222503],
    "TN": [33.886917, 9.537499],
    "TR": [38.963745, 35.243322],
    "TM": [38.969719, 59.556278],
    "TV": [-7.109535, 177.64933],
    "UG": [1.373333, 32.290275],
    "UA": [48.379433, 31.16558],
    "AE": [23.424076, 53.847818],
    "GB": [55.378051, -3.435973],
    "US": [37.09024, -95.712891],
    "UY": [-32.522779, -55.765835],
    "UZ": [41.377491, 64.585262],
    "VU": [-15.376706, 166.959158],
    "VE": [6.42375, -66.58973],
    "VN": [14.058324, 108.277199],
    "YE": [15.552727, 48.516388],
    "ZM": [-13.133897, 27.849332],
    "ZW": [-19.015438, 29.154857]
};

// ── Sound System ───────────────────────────────────────────────────────────

const _sounds = {};
let _muted = false;
let _soundsLoaded = false;

window.loadSounds = function () {
    if (_soundsLoaded) return;
    ['nail', 'close', 'medium', 'fart', 'tick', 'fanfare', 'timeout'].forEach(name => {
        const audio = new Audio(`/sounds/${name}.wav`);
        audio.preload = 'auto';
        _sounds[name] = audio;
    });
    _soundsLoaded = true;

    document.addEventListener('click', function unlockAudio() {
        Object.values(_sounds).forEach(s => {
            s.play().then(() => s.pause()).catch(() => {});
        });
        document.removeEventListener('click', unlockAudio);
    }, { once: true });
};

window.setMuted = function (muted) {
    _muted = muted;
};

window.playSound = function (tier) {
    if (_muted) return;
    if (!_soundsLoaded) window.loadSounds();
    const s = _sounds[tier];
    if (!s) return;
    s.currentTime = 0;
    s.play().catch(() => {});
};

// ── Timer ──────────────────────────────────────────────────────────────────

let _timerInterval = null;

window.startTimer = function (seconds, dotNetHelper) {
    clearInterval(_timerInterval);
    let remaining = seconds;

    _timerInterval = setInterval(() => {
        remaining--;
        if (remaining <= 5 && remaining > 0) {
            window.playSound('tick');
        }
        dotNetHelper.invokeMethodAsync('OnTimerTick', remaining);
        if (remaining <= 0) {
            clearInterval(_timerInterval);
            window.playSound('timeout');
            dotNetHelper.invokeMethodAsync('OnTimerExpired');
        }
    }, 1000);
};

window.stopTimer = function () {
    clearInterval(_timerInterval);
};

// ── Canvas Share Image ─────────────────────────────────────────────────────

window.generateShareImage = function (data) {
    const W = 600, H = 420;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    ctx.fillStyle = '#c0392b';
    ctx.fillRect(0, 0, W, 5);

    ctx.fillStyle = '#f5f0e8';
    ctx.font = 'bold 26px Georgia, serif';
    ctx.fillText('🗺️ WHOSE FAULT IS THIS?', 28, 46);

    ctx.font = '12px monospace';
    ctx.fillStyle = '#c0392b';
    ctx.fillText((data.date || '').toUpperCase(), 28, 66);

    const uLabel = '@' + (data.username || 'player');
    ctx.fillStyle = '#888';
    ctx.fillText(uLabel, W - 28 - ctx.measureText(uLabel).width, 66);

    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(28, 76, W - 56, 1);

    const rowH = 50;
    const startY = 90;
    const barX = 135;
    const barW = W - barX - 28;

    (data.results || []).forEach((r, i) => {
        const y = startY + i * rowH;

        ctx.font = '18px serif';
        ctx.fillStyle = '#f5f0e8';
        ctx.fillText(r.regionEmoji || '🌍', 28, y + 22);

        ctx.font = '10px monospace';
        ctx.fillStyle = '#888';
        ctx.fillText((r.region || '').toUpperCase(), 54, y + 22);

        if (r.timedOut) {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(barX, y + 8, barW, 20);
            ctx.font = '11px monospace';
            ctx.fillStyle = '#c0392b';
            ctx.fillText('⏱  TIMED OUT  —  0 pts', barX + 8, y + 22);
        } else {
            const pct = Math.min((r.score || 0) / 1000, 1);
            const barColor = pct >= 0.8 ? '#1a6b3c'
                : pct >= 0.5 ? '#b7a01a'
                    : '#c0392b';

            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(barX, y + 8, barW, 20);
            ctx.fillStyle = barColor;
            ctx.fillRect(barX, y + 8, Math.round(barW * pct), 20);

            ctx.font = 'bold 11px monospace';
            ctx.fillStyle = '#f5f0e8';
            ctx.fillText((r.score || 0) + ' pts', barX + 8, y + 22);

            const distStr = r.distanceKm < 200
                ? '< 200km ✓'
                : Math.round(r.distanceKm) + 'km off';
            ctx.font = '10px monospace';
            ctx.fillStyle = '#666';
            ctx.fillText(distStr, barX + barW - ctx.measureText(distStr).width - 4, y + 22);
        }
    });

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(28, H - 68, W - 56, 1);

    ctx.font = 'bold 20px Georgia, serif';
    ctx.fillStyle = '#f5f0e8';
    ctx.fillText('TOTAL: ' + (data.totalScore || 0).toLocaleString() + ' / 5,000', 28, H - 40);

    const urlStr = data.url || 'whosefaultisthis.com';
    ctx.font = '10px monospace';
    ctx.fillStyle = '#444';
    ctx.fillText(urlStr, W - 28 - ctx.measureText(urlStr).width, H - 14);

    return canvas.toDataURL('image/png');
};

window.copyImageToClipboard = async function (dataUrl) {
    try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
        return true;
    } catch (e) {
        console.warn('Clipboard write failed:', e);
        return false;
    }
};

window.downloadImage = function (dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename || 'whose-fault.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};