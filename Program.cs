using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using faultgame;
using faultgame.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient
{
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)
});

// Supabase
var supabaseUrl = builder.Configuration["Supabase:Url"]
                  ?? throw new Exception("Supabase:Url not configured");
var supabaseKey = builder.Configuration["Supabase:AnonKey"]
                  ?? throw new Exception("Supabase:AnonKey not configured");

builder.Services.AddScoped<SupabaseService>(sp =>
    new SupabaseService(supabaseUrl, supabaseKey));

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<GameService>();

await builder.Build().RunAsync();