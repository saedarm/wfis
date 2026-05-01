using faultgame.Models;
using Microsoft.JSInterop;

namespace faultgame.Services;

public class GameService
{
    private readonly SupabaseService _supabase;
    private readonly AuthService _auth;
    private readonly IJSRuntime _js;

    public GameState State { get; private set; } = new();
    public event Action? OnStateChanged;

    public GameService(SupabaseService supabase, AuthService auth, IJSRuntime js)
    {
        _supabase = supabase;
        _auth = auth;
        _js = js;
    }

    public async Task LoadTodaysGameAsync()
    {
        State = new GameState();
        State.TodaysQuestions = await _supabase.GetTodaysQuestionsAsync();
        NotifyStateChanged();
    }

    // ── Phase 1 — Country Click ────────────────────────────────────────────

    public async Task SubmitPhase1Async(string countryCode, string countryName, double lat, double lon)
    {
        var q = State.CurrentQuestion;
        if (q == null || State.Phase1Complete) return;

        State.Phase1Complete = true;
        State.ClickedCountryCode = countryCode;
        State.ClickedCountryName = countryName;
        State.Phase1Correct = countryCode.Equals(q.CountryCode, StringComparison.OrdinalIgnoreCase);

        if (State.Phase1Correct)
        {
            State.ReactionText = $"✅ {q.CountryName}! Now find the city.";
        }
        else
        {
            State.ReactionText = $"❌ That's {countryName}. The country was {q.CountryName}. {q.CountryWrongRoast} Now find the city anyway.";
        }

        // Fly map to correct country regardless
        await _js.InvokeVoidAsync("flyToCountry", q.CountryLat, q.CountryLon, q.CountryName);

        State.Phase = 2;
        NotifyStateChanged();
    }

    // ── Phase 2 — City Click ───────────────────────────────────────────────

    public async Task SubmitPhase2Async(double clickedLat, double clickedLon)
    {
        var q = State.CurrentQuestion;
        if (q == null || State.Phase2Complete) return;

        await _js.InvokeVoidAsync("lockMap");

        State.Phase2Complete = true;

        var distKm    = GameState.HaversineKm(clickedLat, clickedLon, q.CityLat, q.CityLon);
        var tier      = GameState.GetDistanceTier(distKm);
        var p1Score   = State.Phase1Correct ? 400 : 0;
        var p2Score   = GameState.CalcPhase2Score(distKm, State.Phase1Correct);
        var total     = p1Score + p2Score;

        State.LastDistanceKm = distKm;
        State.LastScore      = total;
        State.DistanceTier   = tier;
        State.ReactionText   = q.GetCityRoast(distKm);

        await _js.InvokeVoidAsync("playSound", tier);
        await _js.InvokeVoidAsync("revealAnswer", q.CityLat, q.CityLon, q.CityName);

        State.Results.Add(new QuestionResult
        {
            QuestionId     = q.Id,
            Region         = q.Region,
            CityName       = q.CityName,
            Phase1Correct  = State.Phase1Correct,
            ClickedCountry = State.ClickedCountryCode ?? "",
            CityDistanceKm = distKm,
            CityTier       = tier,
            Phase1Score    = p1Score,
            Phase2Score    = p2Score,
            Score          = total
        });

        State.RoundComplete = true;
        NotifyStateChanged();
    }

    // ── Advance ────────────────────────────────────────────────────────────

    public async Task AdvanceToNextQuestionAsync()
    {
        State.CurrentQuestionIndex++;
        State.Phase           = 1;
        State.Phase1Complete  = false;
        State.Phase1Correct   = false;
        State.Phase2Complete  = false;
        State.RoundComplete   = false;
        State.ReactionText    = null;
        State.DistanceTier    = null;
        State.ClickedCountryCode = null;
        State.ClickedCountryName = null;

        if (State.CurrentQuestionIndex >= State.TodaysQuestions.Count)
        {
            State.GameComplete = true;
            await _js.InvokeVoidAsync("playSound", "fanfare");
        }
        else
        {
            await _js.InvokeVoidAsync("resetMapToWorld");
            await _js.InvokeVoidAsync("unlockMap");
        }

        NotifyStateChanged();
    }

    // ── Save + Leaderboard ─────────────────────────────────────────────────

    public async Task SaveResultsAsync()
    {
        if (!_auth.IsLoggedIn) return;

        var score = new Score
        {
            UserId      = _auth.CurrentUser!.Id!,
            Username    = _auth.Username ?? "anonymous",
            SessionDate = DateOnly.FromDateTime(DateTime.UtcNow),
            Results     = State.Results,
            TotalScore  = State.TotalScore
        };

        await _supabase.SaveScoreAsync(score);
    }

    public async Task<List<Score>> GetLeaderboardForTodayAsync() =>
        await _supabase.GetTodayLeaderboardAsync();

    public async Task<string> GenerateShareImageAsync(string username, string url)
    {
        var data = State.BuildShareImageData(username, url);
        return await _js.InvokeAsync<string>("generateShareImage", data);
    }

    public async Task<bool> CopyShareImageAsync(string dataUrl) =>
        await _js.InvokeAsync<bool>("copyImageToClipboard", dataUrl);

    private void NotifyStateChanged() => OnStateChanged?.Invoke();
}