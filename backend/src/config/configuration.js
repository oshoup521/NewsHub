"use strict";
exports.__esModule = true;
exports["default"] = (function () { return ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        type: 'sqlite',
        database: process.env.NEWSHUB_DATABASE_PATH || 'newshub.sqlite',
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development'
    },
    jwt: {
        secret: process.env.NEWSHUB_JWT_SECRET || 'newshub-super-secret-key',
        expiresIn: process.env.NEWSHUB_JWT_EXPIRES_IN || '7d'
    },
    cors: {
        origin: process.env.NEWSHUB_FRONTEND_URL || 'http://localhost:5173'
    },
    rss: {
        intervalMinutes: parseInt(process.env.NEWSHUB_RSS_INTERVAL_MINUTES, 10) || 30,
        maxArticlesPerFeed: parseInt(process.env.NEWSHUB_MAX_ARTICLES_PER_FEED, 10) || 100
    },
    rateLimit: {
        ttl: parseInt(process.env.NEWSHUB_RATE_LIMIT_TTL, 10) || 60000,
        limit: parseInt(process.env.NEWSHUB_RATE_LIMIT_MAX, 10) || 100
    }
}); });
