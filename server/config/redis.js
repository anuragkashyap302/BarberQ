import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Redis connection status track karne ke liye boolean flag
let isRedisConnected = false;
let redisClient = null;

let rawRedisUrl = process.env.REDIS_URI || '';

// Agar user ne galti se REDIS_URL="..." prefix ya quotes copy paste kar diya ho to use clean karte hain
let cleanRedisUrl = rawRedisUrl.trim();
if (cleanRedisUrl.includes('REDIS_URL=')) {
    cleanRedisUrl = cleanRedisUrl.replace(/^REDIS_URL=\s*/, '');
}
cleanRedisUrl = cleanRedisUrl.replace(/^["']|["']$/g, '').trim();

if (cleanRedisUrl) {
    try {
        // ioredis client initialize kiya retry strategy ke sath
        redisClient = new Redis(cleanRedisUrl, {
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            lazyConnect: false,
            // Reconnection logic: agar connection drop hota hai toh backoff ke sath retry karega
            retryStrategy(times) {
                if (times > 5) {
                    console.warn('[Redis] Reached maximum reconnection attempts (5). Falling back to Database.');
                    return null; // Stop retrying
                }
                const delay = Math.min(times * 500, 2000);
                return delay;
            },
           // rejectunauthoirzed direclty false karna security issue de sakta hai if atter 
           // intercept network traffic between ex and cloud  Because verification is disabled, 
           // your server will trust the attacker and send all cached data, user tokens, 
           // and queries directly through them in plain text
            tls: cleanRedisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
        });

        
        redisClient.on('connect', () => {
            isRedisConnected = true;
            console.log('[Redis] Connected successfully to Redis Cache.');
        });

       
        redisClient.on('ready', () => {
            isRedisConnected = true;
        });

        // Error event listener (taaki server crash na ho agar Redis temporary disconnect ho)
        redisClient.on('error', (err) => {
            isRedisConnected = false;
            console.warn('[Redis Error]:', err.message);
        });

        
        redisClient.on('end', () => {
            isRedisConnected = false;
            console.log('[Redis] Connection closed.');
        });

    } catch (err) {
        console.warn('[Redis] Initialization failed. Running without Redis cache:', err.message);
        redisClient = null;
        isRedisConnected = false;
    }
} else {
    console.log('[Redis] No REDIS_URI provided in .env. Running in direct Database mode.');
}

/**
 * Helper: Redis se data fetch karne ke liye (GET)
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Parsed JSON object ya null
 */
export const getCache = async (key) => {
    if (!redisClient) return null;
    try {
        // Key se stringified data fetch kiya
        const data = await redisClient.get(key);
        if (!data) return null;
        // String data ko wapas JavaScript Object me parse karke return kiya
        return JSON.parse(data);
    } catch (err) {
        console.warn(`[Redis getCache Error for key "${key}"]:`, err.message);
        return null; // Error aane par fallback karke null return karenge taaki DB se fetch ho sake
    }
};

/**
 * Helper: Redis me data set karne ke liye (SET with TTL)
 * @param {string} key - Cache key
 * @param {any} value - Data jo store karna hai (JSON serializable)
 * @param {number} ttlInSeconds - Expiration time in seconds (default: 1800s = 30 mins)
 */
export const setCache = async (key, value, ttlInSeconds = 1800) => {
    if (!redisClient) return;
    try {
        // JavaScript object ko string me convert kiya Redis me store karne ke liye
        const serialized = JSON.stringify(value);
        // 'EX' use karke Time-To-Live (expiry) set kiya
        await redisClient.set(key, serialized, 'EX', ttlInSeconds);
    } catch (err) {
        console.warn(`[Redis setCache Error for key "${key}"]:`, err.message);
    }
};

/**
 * Helper: Single specific key ko delete (invalidate) karne ke liye (DEL)
 * @param {string} key - Cache key to remove
 */
export const deleteCache = async (key) => {
    if (!redisClient) return;
    try {
        await redisClient.del(key);
    } catch (err) {
        console.warn(`[Redis deleteCache Error for key "${key}"]:`, err.message);
    }
};

/**
 * Helper: Pattern ke matching saare keys ko safely delete karne ke liye (Scan & Del)
 * KEYS command block kar deta hai, isliye hum non-blocking SCAN stream use karte hain.
 * @param {string} pattern - jaise "barbers:*" ya "services:*"
 */
export const deleteKeysByPattern = async (pattern) => {
    if (!redisClient) return;
    try {
        // Non-blocking scan stream banaya
        const stream = redisClient.scanStream({
            match: pattern,
            count: 50
        });

        stream.on('data', async (keys = []) => {
            if (keys.length > 0) {
                // Pipeline use karke ek sath saare matching keys delete kiye
                const pipeline = redisClient.pipeline();
                keys.forEach(k => pipeline.del(k));
                await pipeline.exec();
            }
        });

        stream.on('error', (err) => {
            console.warn(`[Redis deleteKeysByPattern Error for "${pattern}"]:`, err.message);
        });
    } catch (err) {
        console.warn(`[Redis deleteKeysByPattern Error for "${pattern}"]:`, err.message);
    }
};

export default {
    redisClient,
    getCache,
    setCache,
    deleteCache,
    deleteKeysByPattern,
    isRedisConnected: () => isRedisConnected
};
