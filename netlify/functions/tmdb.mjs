// Proxies GET requests to TMDB and attaches the API key server-side.
// Reachable at /api/tmdb/* (see config.path below).

const ALLOWED = [
  /^configuration\/countries$/,
  /^genre\/movie\/list$/,
  /^discover\/movie$/,
  /^movie\/\d+(\/(credits|external_ids))?$/,
  /^person\/\d+$/,
];

export default async (req) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const key =
    Netlify.env.get("TMDB_API_KEY") ?? Netlify.env.get("VITE_TMDB_API_KEY");
  if (!key) {
    return new Response("Server is missing the TMDB API key", { status: 500 });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/tmdb\//, "");
  if (!ALLOWED.some((re) => re.test(path))) {
    return new Response("Not found", { status: 404 });
  }

  const upstream = await fetch(
    `https://api.themoviedb.org/3/${path}${url.search}`,
    { headers: { accept: "application/json", Authorization: `Bearer ${key}` } },
  );

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
};

export const config = { path: "/api/tmdb/*" };
