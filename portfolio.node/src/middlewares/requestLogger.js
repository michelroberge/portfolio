const requestLogger = (req, res, next) => {
    const startTime = Date.now();

    // Log request details
    console.log('\ud83d\udcdd [Request] Incoming request', {
        method: req.method,
        url: req.url,
        origin: req.get('origin'),
        userAgent: req.get('user-agent'),
        referer: req.get('referer'),
        host: req.get('host'),
        cookies: req.cookies,
        timestamp: new Date().toISOString()
    });

    // Intercept the response to log its status
    const originalSend = res.send;
    res.send = function(body) {
        const duration = Date.now() - startTime;
        
        // Log response details
        console.log('\ud83d\udcdd [Response]', {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            bodyLength: body ? body.length : 0
        });

        // If there's an error status, log more details
        if (res.statusCode >= 400) {
            console.error('\u274c [Error Response]', {
                method: req.method,
                url: req.url,
                status: res.statusCode,
                body: typeof body === 'string' ? body : JSON.stringify(body),
                timestamp: new Date().toISOString()
            });
        }

        originalSend.call(this, body);
    };

    next();
};

module.exports = requestLogger;
