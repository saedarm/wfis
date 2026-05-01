using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace faultgame.Models;

[Table("questions")]
public class Question : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }

    // Phase 1 — country level
    [Column("phase1_clue")]
    public string Phase1Clue { get; set; } = "";

    [Column("country_code")]
    public string CountryCode { get; set; } = ""; // ISO 3166-1 alpha-2

    [Column("country_name")]
    public string CountryName { get; set; } = "";

    [Column("country_lat")]
    public double CountryLat { get; set; }

    [Column("country_lon")]
    public double CountryLon { get; set; }

    [Column("country_wrong_roast")]
    public string CountryWrongRoast { get; set; } = "";

    // Phase 2 — city level
    [Column("phase2_clue")]
    public string Phase2Clue { get; set; } = "";

    [Column("city_name")]
    public string CityName { get; set; } = "";

    [Column("city_lat")]
    public double CityLat { get; set; }

    [Column("city_lon")]
    public double CityLon { get; set; }

    [Column("city_roast_close")]
    public string CityRoastClose { get; set; } = "";

    [Column("city_roast_medium")]
    public string CityRoastMedium { get; set; } = "";

    [Column("city_roast_far")]
    public string CityRoastFar { get; set; } = "";

    // Meta
    [Column("region")]
    public string Region { get; set; } = "";

    [Column("difficulty")]
    public string Difficulty { get; set; } = "medium";

    [Column("used_on")]
    public DateOnly? UsedOn { get; set; }

    [Column("active")]
    public bool Active { get; set; } = true;

    // Helper — pick roast based on distance
    public string GetCityRoast(double distanceKm) => distanceKm switch
    {
        <= 100  => CityRoastClose,
        <= 500  => CityRoastMedium,
        _       => CityRoastFar
    };
}