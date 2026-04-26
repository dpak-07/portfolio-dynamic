function resolveEnv(primaryKey, fallbackKey) {
  if (process.env[primaryKey]) {
    return { value: process.env[primaryKey], source: primaryKey };
  }

  if (process.env[fallbackKey]) {
    return { value: process.env[fallbackKey], source: fallbackKey };
  }

  return { value: "", source: null };
}

const {
  value: supabaseUrl,
  source: supabaseUrlSource,
} = resolveEnv("VITE_SUPABASE_URL", "SUPABASE_URL");
const {
  value: supabaseAnonKey,
  source: supabaseAnonKeySource,
} = resolveEnv("VITE_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY");

if (!supabaseUrl) {
  console.error("Missing Supabase URL. Set VITE_SUPABASE_URL or SUPABASE_URL.");
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error("Missing Supabase anon key. Set VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY.");
  process.exit(1);
}

let baseUrl = "";

try {
  baseUrl = new URL(supabaseUrl).toString().replace(/\/+$/, "");
} catch {
  console.error(`Invalid Supabase URL: ${supabaseUrl}`);
  process.exit(1);
}

function isHealthyStatus(status) {
  if (status >= 200 && status < 400) {
    return true;
  }

  return status === 401 || status === 403;
}

async function ping(name, endpoint, headers = {}) {
  const started = Date.now();
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "GET",
    headers,
  });
  const elapsedMs = Date.now() - started;

  console.log(`${name}: status=${response.status} time=${elapsedMs}ms`);
  return response;
}

async function main() {
  try {
    console.log(`Supabase URL source: ${supabaseUrlSource}`);
    console.log(`Supabase anon key source: ${supabaseAnonKeySource}`);

    const authResponse = await ping("auth.health", "/auth/v1/health");
    const restResponse = await ping("rest.root", "/rest/v1/", {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    });

    const authOk = isHealthyStatus(authResponse.status);
    const restOk = isHealthyStatus(restResponse.status);

    if (!authOk || !restOk) {
      console.error("Supabase keep-alive check failed.");
      process.exit(1);
    }

    if (restResponse.status === 401 || restResponse.status === 403) {
      console.warn(
        "Supabase REST responded with an auth barrier. The project is awake, but this probe is not authorized for a full data request."
      );
    }

    console.log("Supabase keep-alive check passed.");
  } catch (error) {
    console.error("Supabase keep-alive request failed:", error?.message || error);
    process.exit(1);
  }
}

main();
