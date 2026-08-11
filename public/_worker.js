const PROJECT_HOST = 'evtol-ols-flightsim.pages.dev';

function hostAllowed(host, env) {
  const configured = String(env.ALLOWED_HOSTS || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);
  return host === PROJECT_HOST || host.endsWith(`.${PROJECT_HOST}`) || configured.includes(host);
}

function securityHeaders(extra = {}) {
  return {
    'Cache-Control': 'private, no-store, max-age=0',
    'Content-Type': 'application/json; charset=utf-8',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, nofollow',
    ...extra,
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/service-config') {
      return new Response(JSON.stringify({
        paidAccessEnabled: env.PAID_ACCESS_ENABLED === 'true',
        paidPriceYen: 100,
        paidMinutes: 10,
        freePlan: 'bring-your-own-mapbox-token',
      }), { status: 200, headers: securityHeaders() });
    }
    if (url.pathname !== '/api/mapbox-token') {
      return env.ASSETS.fetch(request);
    }

    // Developer-funded Mapbox access stays closed until payment verification
    // is implemented. Free users provide their own public token in-browser.
    if (env.PAID_ACCESS_ENABLED !== 'true') {
      return new Response(JSON.stringify({ error: 'Paid access is not enabled' }), {
        status: 402,
        headers: securityHeaders(),
      });
    }

    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: securityHeaders({ Allow: 'GET' }),
      });
    }

    const host = url.hostname.toLowerCase();
    const origin = request.headers.get('Origin');
    const referer = request.headers.get('Referer');
    let sameOrigin = true;
    try {
      if (origin) sameOrigin = new URL(origin).hostname.toLowerCase() === host;
      if (sameOrigin && referer) sameOrigin = new URL(referer).hostname.toLowerCase() === host;
    } catch {
      sameOrigin = false;
    }

    if (!hostAllowed(host, env) || !sameOrigin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: securityHeaders(),
      });
    }

    if (!env.MAPBOX_PUBLIC_TOKEN || !String(env.MAPBOX_PUBLIC_TOKEN).startsWith('pk.')) {
      return new Response(JSON.stringify({ error: 'Map configuration unavailable' }), {
        status: 503,
        headers: securityHeaders(),
      });
    }

    return new Response(JSON.stringify({ token: env.MAPBOX_PUBLIC_TOKEN }), {
      status: 200,
      headers: securityHeaders(),
    });
  },
};
