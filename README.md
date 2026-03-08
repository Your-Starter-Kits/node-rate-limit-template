# API Rate Limiting Template

A production-ready Express.js boilerplate with built-in rate limiting, IP throttling, and comprehensive security middleware. This starter kit protects your APIs from abuse while maintaining scalability and ease of use.

##  Purpose

Protect your APIs from abuse, brute force attacks, and DDoS attempts with intelligent rate limiting and security measures. This template provides a solid foundation for building secure, scalable REST APIs.

##  Features

- **Request Rate Limiting**: Configurable limits per IP address
- **IP Throttling**: Gradual slowdown before blocking (soft limit)
- **Strict Limits for Sensitive Routes**: Extra protection for auth endpoints
- **Security Middleware**: Helmet, CORS, input sanitization
- **Error Handling**: Centralized error management
- **Request Logging**: Morgan for development and production
- **Response Compression**: Optimized API responses
- **Environment Configuration**: Easy setup with .env files
- **Clean Architecture**: Scalable folder structure

##  Architecture

```
api-rate-limiting-template/
├── src/
│   ├── controllers/        # Business logic layer
│   │   ├── user.controller.js
│   │   └── auth.controller.js
│   ├── middleware/         # Custom middleware
│   │   ├── rateLimit.middleware.js    # Rate limiting logic
│   │   ├── security.middleware.js     # Security headers & sanitization
│   │   └── error.middleware.js        # Global error handler
│   ├── routes/            # API route definitions
│   │   ├── index.js       # Route aggregator
│   │   ├── user.routes.js # User endpoints
│   │   └── auth.routes.js # Auth endpoints (strict limits)
│   ├── app.js             # Express app configuration
│   └── server.js          # Server entry point
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

### Architecture Explanation

**Controllers**: Handle business logic and data operations. In production, replace mock data with database calls.

**Middleware**: 
- `rateLimit.middleware.js` - Three types of limiters (global, speed, strict)
- `security.middleware.js` - Input sanitization and security headers
- `error.middleware.js` - Consistent error response formatting

**Routes**: Define API endpoints and apply appropriate middleware. Auth routes use strict limiting.

**app.js**: Configures Express with all middleware in correct order (security → rate limiting → routes → error handling)

**server.js**: Starts the HTTP server and listens on configured port

##  Installation Steps

### 1. Clone or Download

```bash
# If using git
git clone https://github.com/Your-Starter-Kits/node-rate-limit-template.git
cd api-rate-limiting-template

# Or download and extract the template
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your preferred settings
```

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:3000` (or your configured PORT)

##  Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Rate Limiting Configuration
RATE_LIMIT_MAX_REQUESTS=100        # Max requests per window
RATE_LIMIT_WINDOW_MINUTES=15       # Time window in minutes

# Slow Down Configuration
SLOWDOWN_DELAY_AFTER=50            # Start slowing after X requests
SLOWDOWN_DELAY_MS=500              # Delay increment per request (ms)

# API Configuration
API_PREFIX=/api/v1

# CORS Configuration
CORS_ORIGIN=*                      # Allowed origins (* for all)
```

### Configuration Details

- **RATE_LIMIT_MAX_REQUESTS**: Hard limit - requests blocked after this
- **RATE_LIMIT_WINDOW_MINUTES**: Time window for counting requests
- **SLOWDOWN_DELAY_AFTER**: Soft limit - responses slow down after this
- **SLOWDOWN_DELAY_MS**: Delay added per request after soft limit

##  Example API Routes

### Health Check
```bash
GET /health
```
Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-03-08T10:30:00.000Z",
  "uptime": 123.45
}
```

### API Info
```bash
GET /api/v1/
```
Response:
```json
{
  "success": true,
  "message": "API Rate Limiting Template",
  "version": "1.0.0",
  "endpoints": {
    "users": "/users",
    "auth": "/auth"
  }
}
```

### User Endpoints (Standard Rate Limiting)

**Get All Users**
```bash
GET /api/v1/users
```

**Get User by ID**
```bash
GET /api/v1/users/1
```

**Create User**
```bash
POST /api/v1/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Update User**
```bash
PUT /api/v1/users/1
Content-Type: application/json

{
  "name": "John Updated"
}
```

**Delete User**
```bash
DELETE /api/v1/users/1
```

### Auth Endpoints (Strict Rate Limiting - 5 requests per 15 minutes)

**Login**
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Register**
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "securepassword"
}
```

**Forgot Password**
```bash
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

##  Testing the Rate Limiting

### Test 1: Standard Rate Limiting

Test the global rate limiter (default: 100 requests per 15 minutes):

```bash
# Using curl (run multiple times)
for i in {1..105}; do
  curl http://localhost:3000/api/v1/users
  echo "Request $i completed"
done
```

**Expected behavior**:
- Requests 1-50: Normal speed
- Requests 51-100: Gradually slower (speed limiter)
- Requests 101+: Blocked with 429 status

Response when rate limited:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later.",
  "retryAfter": "Check Retry-After header"
}
```

### Test 2: Strict Rate Limiting (Auth Routes)

Test strict limiter on auth endpoints (5 requests per 15 minutes):

```bash
# Using curl (run 6 times)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}'
  echo "Login attempt $i"
done
```

**Expected behavior**:
- Requests 1-5: Successful
- Request 6+: Blocked with 429 status

### Test 3: Speed Throttling

Test the gradual slowdown feature:

```bash
# Make 60 requests and measure response time
for i in {1..60}; do
  time curl -s http://localhost:3000/api/v1/users > /dev/null
  echo "Request $i"
done
```

**Expected behavior**:
- Requests 1-50: Fast responses (~10-50ms)
- Requests 51-60: Progressively slower (adds 500ms per request)

### Test 4: Using Postman or Thunder Client

1. Import the following requests into your API client
2. Send multiple requests rapidly to observe rate limiting
3. Check response headers for rate limit information:
   - `RateLimit-Limit`: Maximum requests allowed
   - `RateLimit-Remaining`: Requests remaining in window
   - `RateLimit-Reset`: When the limit resets
   - `Retry-After`: Seconds to wait before retrying (when blocked)

### Test 5: Different IP Addresses

Rate limits are per IP address. To test:

```bash
# Using different proxy or VPN will reset the counter
# Or test from different machines on your network
```

### Monitoring Rate Limits

Watch the console output while testing:
```bash
npm run dev
```

You'll see Morgan logs showing:
- Request method and path
- Response status code
- Response time
- IP address (in combined format)

## Security Features

1. **Helmet**: Sets secure HTTP headers
2. **CORS**: Controls cross-origin requests
3. **Input Sanitization**: Removes dangerous characters from inputs
4. **Rate Limiting**: Prevents brute force and DDoS
5. **Request Size Limits**: Prevents payload attacks (10MB limit)
6. **Error Handling**: Doesn't expose sensitive information in production

## Customization

### Adding New Routes

1. Create controller in `src/controllers/`
2. Create route file in `src/routes/`
3. Import and mount in `src/routes/index.js`

### Adjusting Rate Limits

Edit `.env` file or modify `src/middleware/rateLimit.middleware.js` for custom logic.

### Adding Database

Replace mock data in controllers with your database calls (MongoDB, PostgreSQL, etc.)

### Whitelisting IPs

In `src/middleware/rateLimit.middleware.js`, modify the `skip` function:

```javascript
skip: (req) => {
  const whitelist = ['127.0.0.1', '192.168.1.100'];
  return whitelist.includes(req.ip);
}
```

## Production Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production` in environment
- [ ] Configure proper CORS origins (not `*`)
- [ ] Implement real authentication (JWT, sessions)
- [ ] Connect to actual database
- [ ] Set up proper logging service
- [ ] Configure HTTPS/SSL
- [ ] Review and adjust rate limits for your use case
- [ ] Set up monitoring and alerts
- [ ] Remove or secure development endpoints

## Contributing

This is a starter template. Customize it for your needs and build amazing APIs!

## License

MIT License - feel free to use this template for any project.

---

**Built with for developers who value security and scalability**
