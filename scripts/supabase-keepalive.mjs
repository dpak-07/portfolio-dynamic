const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("Missing Supabase URL. Set SUPABASE_URL or VITE_SUPABASE_URL.");
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error("Missing Supabase anon key. Set SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY.");
  process.exit(1);
}

const baseUrl = supabaseUrl.replace(/\/+$/, "");

async function ping(name, endpoint, headers = {}) {
  const started = Date.now();
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "GET",
    headers,
  });
  const elapsedMs = Date.now() - started;

  console.log(`${name}: status=${response.status} time=${elapsedMs}ms`);
  return response.status;
}

async function main() {
  try {
    const authStatus = await ping("auth.health", "/auth/v1/health");
    const restStatus = await ping("rest.root", "/rest/v1/", {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    });

    const authOk = authStatus === 200 || authStatus === 401;
    const restOk = restStatus >= 200 && restStatus < 300;

    if (!authOk || !restOk) {
      console.error("Supabase keep-alive check failed.");
      process.exit(1);
    }

    console.log("Supabase keep-alive check passed.");
  } catch (error) {
    console.error("Supabase keep-alive request failed:", error?.message || error);
    process.exit(1);
  }
}

main();
