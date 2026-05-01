using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace faultgame.Models;

[Table("scores")]
public class Score : BaseModel
{
    [PrimaryKey("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("user_id")]
    public string UserId { get; set; } = "";

    [Column("username")]
    public string Username { get; set; } = "";

    [Column("session_date")]
    public DateOnly SessionDate { get; set; }

    [Column("results")]
    public List<QuestionResult> Results { get; set; } = new();

    [Column("total_score")]
    public int TotalScore { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class QuestionResult
{
    public int    QuestionId      { get; set; }
    public string Region          { get; set; } = "";
    public string CityName        { get; set; } = "";
    public bool   Phase1Correct   { get; set; }
    public string ClickedCountry  { get; set; } = "";
    public double CityDistanceKm  { get; set; }
    public string CityTier        { get; set; } = "";
    public int    Phase1Score     { get; set; }
    public int    Phase2Score     { get; set; }
    public int    Score           { get; set; } // Phase1Score + Phase2Score
}