// utils.js

export function parseCookies(cookieHeader) {
    if (!cookieHeader) return {};
    return cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, ...rest] = cookie.trim().split('=');
      acc[name] = rest.join('=');
      return acc;
    }, {});
  }

  export function handleOptions(request , env) {
    const headers = request.headers;
    const origin = headers.get('Origin');
    if (
      origin !== null &&
      headers.get('Access-Control-Request-Method') !== null &&
      headers.get('Access-Control-Request-Headers') !== null
    ) {
      // Handle CORS preflight request
      let allowedOrigins = env.YOUR_DOMAIN.split(',');
      allowedOrigins.push("https://design.webtuyo.com");
      allowedOrigins.push("https://edit.webtuyo.com");
      allowedOrigins.push("https://app.webtuyo.com");
      allowedOrigins.push("https://preview.webtuyo.com");
      const respHeaders = {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': headers.get('Access-Control-Request-Headers'),
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400', // Cache preflight response for 1 day
      };
      return new Response(null, { status: 204, headers: respHeaders });
    } else {
      // Handle standard OPTIONS request
      return new Response(null, {
        headers: {
          Allow: 'GET, PUT, POST, OPTIONS',
        },
      });
    }
  }

  export function createResponse(body, options = {}, request, env) {
    const response = new Response(body, options);
    const origin = request.headers.get('Origin');
    // Ensure YOUR_DOMAIN is a string and split it, or default to an empty array
    const allowedOrigins = (env.YOUR_DOMAIN && typeof env.YOUR_DOMAIN === 'string') ? env.YOUR_DOMAIN.split(',') : [];

    if (allowedOrigins.includes(origin) ) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    return response;
  }



/**
 * @typedef {Object} Env
 * @property {string} YOUR_DOMAIN
 */
