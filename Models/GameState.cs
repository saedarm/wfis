namespace faultgame.Models;

public class GameState
{
    public List<Question> TodaysQuestions { get; set; } = new();
    public int CurrentQuestionIndex { get; set; } = 0;
    public List<QuestionResult> Results { get; set; } = new();

    // Phase tracking
    public int Phase { get; set; } = 1; // 1 = country click, 2 = city click
    public bool Phase1Complete { get; set; } = false;
    public bool Phase1Correct { get; set; } = false;
    public bool Phase2Complete { get; set; } = false;
    public bool RoundComplete { get; set; } = false;
    public bool GameComplete { get; set; } = false;

    // Reaction
    public string? ReactionText { get; set; }
    public string? DistanceTier { get; set; }
    public double? LastDistanceKm { get; set; }
    public int? LastScore { get; set; }

    // What the player clicked
    public string? ClickedCountryCode { get; set; }
    public string? ClickedCountryName { get; set; }

    public Question? CurrentQuestion =>
        CurrentQuestionIndex < TodaysQuestions.Count
            ? TodaysQuestions[CurrentQuestionIndex]
            : null;

    public int TotalScore => Results.Sum(r => r.Score);

    public string RegionEmoji(string region) => region switch
    {
        "americas" => "🌎",
        "europe"   => "🌍",
        "africa"   => "🌍",
        "asia"     => "🌏",
        "oceania"  => "🌏",
        _          => "🌐"
    };

    // ── Scoring ────────────────────────────────────────────────────────────

    public static double HaversineKm(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2)
              + Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180)
              * Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        return R * 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
    }

    /// <summary>
    /// Phase 1: correct country = 400 pts flat, wrong = 0
    /// Phase 2: 0-600 pts by distance from city
    /// If Phase 1 wrong, Phase 2 capped at 200 pts
    /// </summary>
    public static int CalcPhase2Score(double distanceKm, bool phase1Correct)
    {
        const double maxDist = 2000;
        var raw = (int)Math.Max(0, Math.Round(600 * (1 - Math.Min(distanceKm, maxDist) / maxDist)));
        return phase1Correct ? raw : Math.Min(raw, 200);
    }

    public static string GetDistanceTier(double distanceKm) => distanceKm switch
    {
        <= 100  => "nail",
        <= 500  => "close",
        <= 1500 => "medium",
        _       => "far"
    };

    // ── Share Image ────────────────────────────────────────────────────────

    public ShareImageData BuildShareImageData(string username, string url) => new()
    {
        Username   = username,
        Date       = DateTime.UtcNow.ToString("MMMM d, yyyy"),
        TotalScore = TotalScore,
        Url        = url,
        Results    = Results.Select(r => new ShareResultRow
        {
            Region         = r.Region,
            RegionEmoji    = RegionEmoji(r.Region),
            Score          = r.Score,
            DistanceKm     = r.CityDistanceKm,
            Phase1Correct  = r.Phase1Correct,
            CityName       = r.CityName
        }).ToList()
    };
}

public class ShareImageData
{
    public string Username   { get; set; } = "";
    public string Date       { get; set; } = "";
    public int    TotalScore { get; set; }
    public string Url        { get; set; } = "";
    public List<ShareResultRow> Results { get; set; } = new();
}

public class ShareResultRow
{
    public string Region        { get; set; } = "";
    public string RegionEmoji   { get; set; } = "";
    public int    Score         { get; set; }
    public double DistanceKm    { get; set; }
    public bool   Phase1Correct { get; set; }
    public string CityName      { get; set; } = "";
}