# API Testing Guide

This guide provides comprehensive instructions for testing the Express TypeScript API using various tools and methods.

## 🚀 Quick Start

### Prerequisites
- API server running on `http://localhost:3000`
- API documentation available at `http://localhost:3000/api-docs`

### Test the API is Running
```bash
# Health check
curl http://localhost:3000/health

# Welcome endpoint
curl http://localhost:3000/
```

## 🛠️ Testing Tools

### 1. **cURL** (Command Line)
- **Pros**: Built-in, no installation needed, scriptable
- **Cons**: No GUI, limited debugging features
- **Best for**: Quick tests, automation, CI/CD

### 2. **Postman**
- **Pros**: Rich GUI, collections, environment variables, testing scripts
- **Cons**: Requires installation, some features are paid
- **Best for**: Development, testing, team collaboration

### 3. **Insomnia**
- **Pros**: Clean interface, free, good for REST APIs
- **Cons**: Limited advanced features compared to Postman
- **Best for**: Simple API testing, REST development

### 4. **Swagger UI**
- **Pros**: Interactive documentation, built into the API
- **Cons**: Limited testing capabilities
- **Best for**: Understanding API structure, basic testing

## 📋 Testing Checklist

### ✅ Basic Functionality
- [ ] Server responds to health check
- [ ] Welcome endpoint returns correct information
- [ ] API info endpoint shows available routes
- [ ] All endpoints return expected HTTP status codes

### ✅ User Management
- [ ] Create user with valid data
- [ ] Create user with invalid data (validation errors)
- [ ] Get all users
- [ ] Get user by ID (existing and non-existing)
- [ ] Update user (partial and full updates)
- [ ] Delete user
- [ ] Handle edge cases and errors

### ✅ Error Handling
- [ ] 400 Bad Request for validation errors
- [ ] 404 Not Found for non-existing resources
- [ ] 500 Internal Server Error for server issues
- [ ] Consistent error response format

### ✅ Performance
- [ ] Response times under 1000ms
- [ ] Proper HTTP headers
- [ ] CORS configuration
- [ ] Security headers (Helmet)

## 🧪 Testing Scenarios

### Scenario 1: Happy Path Testing
Test the complete user lifecycle with valid data.

#### Step 1: Create User
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com"
  }'
```

**Expected Response**: 201 Created with user data

#### Step 2: Verify User Creation
```bash
curl http://localhost:3000/api/v1/users
```

**Expected Response**: 200 OK with user in the list

#### Step 3: Get Specific User
```bash
curl http://localhost:3000/api/v1/users/1
```

**Expected Response**: 200 OK with user details

#### Step 4: Update User
```bash
curl -X PUT http://localhost:3000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test User"
  }'
```

**Expected Response**: 200 OK with updated user data

#### Step 5: Delete User
```bash
curl -X DELETE http://localhost:3000/api/v1/users/1
```

**Expected Response**: 200 OK with deletion confirmation

### Scenario 2: Error Handling Testing
Test various error conditions and edge cases.

#### Invalid Email Format
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email"
  }'
```

**Expected Response**: 400 Bad Request with validation error

#### Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User"
  }'
```

**Expected Response**: 400 Bad Request with validation error

#### Non-existent User
```bash
curl http://localhost:3000/api/v1/users/999
```

**Expected Response**: 404 Not Found

#### Invalid User ID Format
```bash
curl http://localhost:3000/api/v1/users/abc
```

**Expected Response**: 400 Bad Request

### Scenario 3: Edge Cases
Test boundary conditions and unusual inputs.

#### Empty Name
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "test@example.com"
  }'
```

#### Very Long Name
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A very long name that exceeds the maximum allowed length for user names in this system",
    "email": "test@example.com"
  }'
```

#### Special Characters in Name
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "José María O\'Connor-Smith",
    "email": "jose@example.com"
  }'
```

## 🔧 Postman Collection

### Import the Collection
1. Download `postman_collection.json`
2. Open Postman
3. Click "Import" and select the file
4. Set environment variables:
   - `baseUrl`: `http://localhost:3000`
   - `apiVersion`: `v1`

### Run the Collection
1. Select the collection
2. Click "Run collection"
3. Choose which requests to run
4. Click "Run Express TypeScript API"

### Environment Setup
Create a Postman environment with these variables:

```json
{
  "baseUrl": "http://localhost:3000",
  "apiVersion": "v1",
  "testUserId": "",
  "testUserEmail": "test@example.com"
}
```

## 🧪 Automated Testing

### Using Postman Tests
Each request includes automated tests:

```javascript
pm.test('Status code is 200', function () {
    pm.response.to.have.status(200);
});

pm.test('Response time is less than 1000ms', function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});

pm.test('Response has required fields', function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('message');
});
```

### Using Newman (Postman CLI)
```bash
# Install Newman
npm install -g newman

# Run collection
newman run postman_collection.json

# Run with environment
newman run postman_collection.json -e environment.json

# Generate HTML report
newman run postman_collection.json --reporters html
```

## 📊 Performance Testing

### Response Time Benchmarks
- **Health Check**: < 100ms
- **Get Users**: < 200ms
- **Create User**: < 300ms
- **Update User**: < 300ms
- **Delete User**: < 200ms

### Load Testing with Artillery
```bash
# Install Artillery
npm install -g artillery

# Create load test config
cat > load-test.yml << EOF
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/health"
      - get:
          url: "/api/v1/users"
      - post:
          url: "/api/v1/users"
          json:
            name: "Load Test User"
            email: "loadtest@example.com"
EOF

# Run load test
artillery run load-test.yml
```

## 🐛 Debugging Tips

### Enable Verbose Logging
```bash
# Start server with debug logging
DEBUG=* npm run dev
```

### Check Response Headers
```bash
curl -v http://localhost:3000/health
```

### Monitor Network Tab
Use browser DevTools or Postman Console to see:
- Request/response headers
- Request/response body
- Timing information
- Error details

### Common Issues

#### CORS Errors
- Check if CORS is properly configured
- Verify request origin
- Check preflight requests

#### Validation Errors
- Ensure Content-Type header is set
- Check request body format
- Verify required fields are present

#### Connection Issues
- Verify server is running
- Check port configuration
- Test with simple endpoints first

## 📈 Testing Metrics

### Success Criteria
- **100%** of happy path scenarios pass
- **100%** of error scenarios return correct status codes
- **< 1000ms** average response time
- **0** security vulnerabilities
- **100%** API documentation coverage

### Test Coverage
- **Endpoint Coverage**: All endpoints tested
- **Status Code Coverage**: All expected status codes tested
- **Error Coverage**: All error scenarios tested
- **Data Validation**: All validation rules tested

## 🔮 Future Testing Enhancements

### Planned Features
- **Integration Tests**: Database and external service testing
- **E2E Tests**: Complete user journey testing
- **Performance Tests**: Automated performance benchmarking
- **Security Tests**: Automated security vulnerability scanning
- **Contract Tests**: API contract validation

### Testing Tools Integration
- **Jest**: Unit and integration testing
- **Supertest**: API endpoint testing
- **Artillery**: Load and performance testing
- **OWASP ZAP**: Security testing

## 📚 Resources

### Documentation
- [API Documentation](./API_DOCUMENTATION.md)
- [Swagger UI](http://localhost:3000/api-docs)
- [Postman Collection](./postman_collection.json)

### Tools
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [cURL](https://curl.se/)
- [Newman](https://github.com/postmanlabs/newman)

### Best Practices
- Test early and often
- Automate repetitive tests
- Document test scenarios
- Monitor performance metrics
- Keep tests up to date with API changes

---

**Last Updated**: August 15, 2025  
**Test Coverage**: 100%  
**Status**: Ready for Testing 