// worker.js
import {
    createResponse,
} from "./utils.js";
// UPDATED imports from auth.js (which now includes database functions)

// Removed: parseCookiesFromUtils, as we'll use parseCookies from auth.js or utils.js

export default {
    async fetch(request, env) {
        const getCache = (key) => env.WEBTUYOKV.get(key);

        const requiredEnv = [
            'WEBTUYOKV'
        ];

        for (const varName of requiredEnv) {
            if (!env[varName]) {
                console.error(`Missing critical environment variable: ${varName}`);
                return new Response(`Server configuration error: Missing ${varName}`, { status: 500 });
            }
        }
        
        const url = new URL(request.url);

    	//GET value from KV (Authenticating not required)
        if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/site.json')) {
            const key = url.searchParams.get('key') || 'live';
            const cacheKey = new Request(url.toString(), request);
            const cachedResponse = await caches.default.match(cacheKey);
        
            if (cachedResponse) {
                console.log(`Serving from edge cache for key: ${key}`);
                return cachedResponse;
            }
            console.log(`Cache miss for key: ${key}, fetching from KV.`);
            const kvData = await getCache(key); // Renamed to avoid confusion with edge cache
            
            let response;
            if (kvData) {
                response = createResponse(kvData, { status: 200 }, request, env);
            } else {
                response = createResponse('No data found', { status: 404 }, request, env);
            }
            
            // Cache the response from KV for future requests if it's a success
            // You might want to customize TTL (Cache-Control max-age)
            if (response.status === 200) {
                response.headers.set('Cache-Control', 'public, max-age=120'); // Cache for 60 seconds at edge
                // Note: `caches.default.put` should be called in a non-blocking way if possible,
                // or ensure it doesn't significantly delay the response.
                // For workers, you can use `event.waitUntil()` if `event` is passed from the main handler,
                // but here we'll just await it for simplicity.
                try {
                    await caches.default.put(cacheKey, response.clone()); // Store a clone in cache
                    console.log(`Stored KV response for key: ${key} in edge cache.`);
                } catch (cacheErr) {
                    console.error(`Error storing response in edge cache for key ${key}:`, cacheErr);
                }
            }
            return response;
        }
        
        return createResponse(JSON.stringify({message:`Method not allowed or path not found. Current path: ${url.pathname}`}), { status: 405, headers: {'Content-Type': 'application/json'} }, request, env);
    },
};
