import { getCache, setCache } from '../config/redis.js';

/**
 * Express Middleware: Routes ko automatically Redis cache karne ke liye
 * @param {number} ttlInSeconds - Kitne seconds tak cache valid rahega (Default: 1800s = 30 mins)
 * @param {string} customPrefix - Cache key ka prefix (e.g. 'barbers_list', 'services_list')
 */
export const cacheMiddleware = (ttlInSeconds = 1800, customPrefix = '') => {
    return async (req, res, next) => {
        // Caching sirf GET requests ke liye apply hoti hai (POST, PUT, DELETE ko direct controller handle karega)
        if (req.method !== 'GET') {
            return next();
        }

        try {
            // Unique cache key generate kiya: prefix + URL (query params ke sath)
            const cacheKey = customPrefix 
                ? `${customPrefix}:${req.originalUrl || req.url}` 
                : `cache:${req.originalUrl || req.url}`;

            // Redis me check kiya ki data pehle se cached hai ya nahi
            const cachedResponse = await getCache(cacheKey);

            if (cachedResponse) {
                // Cache HIT: Fast response RAM se direct return kar diya (~2ms)
                res.setHeader('X-Cache', 'HIT');
                res.setHeader('X-Cache-Key', cacheKey);
                return res.json(cachedResponse);
            }

            // Cache MISS: Data Redis me nahi mila, response ko intercept karke store karenge
            res.setHeader('X-Cache', 'MISS');

            // Original res.json function ka reference save kiya
            const originalJson = res.json.bind(res);

            // res.json ko override kiya taaki response send hone se pehle Redis me save ho sake
            res.json = (body) => {
                // Sirf successful responses (success: true ya HTTP 200) ko hi cache karenge
                if (body && (body.success === true || !body.success && res.statusCode === 200)) {
                    // Asynchronously Redis me data save kiya bina response ko slow kiye
                    setCache(cacheKey, body, ttlInSeconds).catch((err) => {
                        console.warn(`[CacheMiddleware Error saving to Redis]:`, err.message);
                    });
                }

                // Client ko actual data send kiya
                return originalJson(body);
            };

            // Request ko controller ke paas aage bhej diya
            next();
        } catch (error) {
            // Agar Redis me koi issue aaye toh request fail nahi hogi, direct DB query chalegi
            console.warn('[CacheMiddleware Exception]:', error.message);
            next();
        }
    };
};

export default cacheMiddleware;
