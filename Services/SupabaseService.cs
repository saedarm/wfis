using faultgame.Models;
using Supabase;
using Supabase.Postgrest;

namespace faultgame.Services;

public class SupabaseService
{
    private readonly Supabase.Client _client;

    public SupabaseService(string url, string anonKey)
    {
        _client = new Supabase.Client(url, anonKey, new SupabaseOptions
        {
            AutoConnectRealtime = false
        });
    }

    public Supabase.Client Client => _client;

    public async Task InitializeAsync() => await _client.InitializeAsync();

    // ── Questions ──────────────────────────────────────────────────────────

    public async Task<List<Question>> GetTodaysQuestionsAsync()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow).ToString("yyyy-MM-dd");

        var existing = await _client
            .From<Question>()
            .Filter("used_on", Constants.Operator.Equals, today)
            .Filter("active", Constants.Operator.Equals, "true")
            .Get();

        if (existing.Models.Count >= 5)
            return existing.Models;

        var regions = new[] { "americas", "europe", "africa", "asia", "oceania" };
        var assigned = new List<Question>();

        foreach (var region in regions)
        {
            var pool = await _client
                .From<Question>()
                .Filter("region", Constants.Operator.Equals, region)
                .Filter("active", Constants.Operator.Equals, "true")
                .Filter("used_on", Constants.Operator.Is, "null")
                .Limit(1)
                .Get();

            if (pool.Models.FirstOrDefault() is { } q)
            {
                q.UsedOn = DateOnly.Parse(today);
                await _client.From<Question>().Update(q);
                assigned.Add(q);
            }
        }

        return assigned;
    }

    // ── Scores ─────────────────────────────────────────────────────────────

    public async Task SaveScoreAsync(Score score)
    {
        await _client.From<Score>().Insert(score);
    }

    public async Task<List<Score>> GetTodayLeaderboardAsync()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow).ToString("yyyy-MM-dd");

        var result = await _client
            .From<Score>()
            .Filter("session_date", Constants.Operator.Equals, today)
            .Order("total_score", Constants.Ordering.Descending)
            .Limit(10)
            .Get();

        return result.Models;
    }

    public async Task<List<Score>> GetWeeklyLeaderboardAsync()
    {
        var from = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)).ToString("yyyy-MM-dd");

        var result = await _client
            .From<Score>()
            .Filter("session_date", Constants.Operator.GreaterThanOrEqual, from)
            .Order("total_score", Constants.Ordering.Descending)
            .Limit(200)
            .Get();

        return result.Models
            .GroupBy(s => s.UserId)
            .Select(g => new Score
            {
                UserId     = g.Key,
                Username   = g.First().Username,
                TotalScore = g.Sum(s => s.TotalScore)
            })
            .OrderByDescending(s => s.TotalScore)
            .Take(10)
            .ToList();
    }

    public async Task<bool> HasPlayedTodayAsync(string userId)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow).ToString("yyyy-MM-dd");

        var result = await _client
            .From<Score>()
            .Filter("user_id", Constants.Operator.Equals, userId)
            .Filter("session_date", Constants.Operator.Equals, today)
            .Limit(1)
            .Get();

        return result.Models.Count > 0;
    }
}