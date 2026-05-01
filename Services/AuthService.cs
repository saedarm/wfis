using Supabase.Gotrue;

namespace faultgame.Services;

public class AuthService
{
    private readonly SupabaseService _supabase;

    public event Action? OnAuthStateChanged;

    public AuthService(SupabaseService supabase)
    {
        _supabase = supabase;
    }

    public Session? CurrentSession => _supabase.Client.Auth.CurrentSession;
    public User? CurrentUser => _supabase.Client.Auth.CurrentUser;
    public bool IsLoggedIn => CurrentUser != null;

    public string? Username =>
        CurrentUser?.UserMetadata?.GetValueOrDefault("username")?.ToString();

    public async Task<(bool Success, string? Error)> SignUpAsync(string email, string password, string username)
    {
        try
        {
            var session = await _supabase.Client.Auth.SignUp(email, password, new SignUpOptions
            {
                Data = new Dictionary<string, object> { ["username"] = username }
            });

            OnAuthStateChanged?.Invoke();
            return (session != null, null);
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public async Task<(bool Success, string? Error)> SignInAsync(string email, string password)
    {
        try
        {
            var session = await _supabase.Client.Auth.SignIn(email, password);
            OnAuthStateChanged?.Invoke();
            return (session != null, null);
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    public async Task SignOutAsync()
    {
        await _supabase.Client.Auth.SignOut();
        OnAuthStateChanged?.Invoke();
    }
}