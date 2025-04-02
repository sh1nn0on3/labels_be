Authentication API
A secure authentication API built with Node.js, Express, MySQL, and Sequelize. Features include user registration, login, logout, and JWT-based authentication with refresh tokens.

Features
User registration and login
JWT-based authentication with access and refresh tokens
Role-based authorization (admin/user)
Secure password hashing with bcrypt
MySQL database with Sequelize ORM
Token refresh mechanism
Protected routes
Prerequisites
Node.js (v14 or higher)
MySQL (v5.7 or higher)
npm or yarn
Installation
Clone the repository:
git clone <repository-url>
cd <repository-name>
Install dependencies:
npm install
Create a .env file in the root directory with the following variables:
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=auth_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
Create a MySQL database named auth_db

Start the server:

npm run dev
API Documentation
Base URL
http://localhost:3000/api
Authentication
All protected routes require a JWT token in the Authorization header:

Authorization: Bearer <your_jwt_token>
API Endpoints
Health Check
GET /health
Description: Check API health status
Response:
{
  "status": "ok",
  "timestamp": "2024-03-21T10:00:00.000Z"
}
Authentication
Register
POST /auth/register
Description: Register a new user
Body:
{
  "username": "string",
  "email": "string",
  "password": "string"
}
Response:
{
  "success": true,
  "data": {
    "id": "number",
    "username": "string",
    "email": "string",
    "role": "user"
  },
  "message": "User registered successfully"
}
Login
POST /auth/login
Description: Login user and get access token
Body:
{
  "email": "string",
  "password": "string"
}
Response:
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "number",
      "username": "string",
      "email": "string",
      "role": "string"
    }
  },
  "message": "Login successful"
}
Logout
POST /auth/logout
Description: Logout user and invalidate tokens
Headers: Authorization: Bearer <access_token>
Response:
{
  "success": true,
  "message": "Logged out successfully"
}
User Routes (Protected)
Get Profile
GET /user/profile
Description: Get current user's profile
Headers: Authorization: Bearer <access_token>
Response:
{
  "success": true,
  "data": {
    "id": "number",
    "username": "string",
    "email": "string",
    "role": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
Change Password
PUT /user/change-password
Description: Change user's password
Headers: Authorization: Bearer <access_token>
Body:
{
  "currentPassword": "string",
  "newPassword": "string"
}
Response:
{
  "success": true,
  "message": "Password changed successfully"
}
Shipment Management
Create Shipment
POST /user/shipments
Description: Create a new shipment
Headers: Authorization: Bearer <access_token>
Body (multipart/form-data):
{
  "senderName": "string",
  "senderPhone": "string",
  "senderAddress": "string",
  "receiverName": "string",
  "receiverPhone": "string",
  "receiverAddress": "string",
  "packageType": "string",
  "weight": "number",
  "dimensions": "string",
  "description": "string",
  "images": "file[]"
}
Response:
{
  "success": true,
  "data": {
    "id": "number",
    "trackingNumber": "string",
    "status": "string",
    "createdAt": "datetime"
  },
  "message": "Shipment created successfully"
}
Get Shipment by ID
GET /user/shipment/:id
Description: Get shipment details by ID
Headers: Authorization: Bearer <access_token>
Response:
{
  "success": true,
  "data": {
    "id": "number",
    "trackingNumber": "string",
    "status": "string",
    "senderDetails": {},
    "receiverDetails": {},
    "packageDetails": {},
    "images": ["string"],
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
Delete Shipment
DELETE /user/shipment/:id
Description: Delete a shipment
Headers: Authorization: Bearer <access_token>
Response:
{
  "success": true,
  "message": "Shipment deleted successfully"
}
Get Shipments by Status
GET /user/shipment/status/:status
Description: Get all shipments with specific status
Headers: Authorization: Bearer <access_token>
Response:
{
  "success": true,
  "data": [
    {
      "id": "number",
      "trackingNumber": "string",
      "status": "string",
      "createdAt": "datetime"
    }
  ]
}
Admin Routes (Protected, Admin Only)
User Management
Update User
PUT /admin/users/:id
Description: Update user details
Headers: Authorization: Bearer <access_token>
Body:
{
  "username": "string",
  "email": "string",
  "role": "string"
}
Response:
{
  "success": true,
  "data": {
    "id": "number",
    "username": "string",
    "email": "string",
    "role": "string",
    "updatedAt": "datetime"
  },
  "message": "User updated successfully"
}
Delete User
DELETE /admin/users/:id
Description: Delete a user
Headers: Authorization: Bearer <access_token>
Response:
{
  "success": true,
  "message": "User deleted successfully"
}
Price Management
Get Price by ID
GET /admin/price/:id
Description: Get price details by ID
Headers: Authorization: Bearer <access_token>
Response:
{
  "success": true,
  "data": {
    "id": "number",
    "serviceType": "string",
    "price": "number",
    "description": "string"
  }
}
Create Price
POST /admin/price
Description: Create a new price entry
Headers: Authorization: Bearer <access_token>
Body:
{
  "serviceType": "string",
  "price": "number",
  "description": "string"
}
Response:
{
  "success": true,
  "data": {
    "id": "number",
    "serviceType": "string",
    "price": "number",
    "description": "string",
    "createdAt": "datetime"
  },
  "message": "Price created successfully"
}
Update Price
PUT /admin/price/:id
Description: Update price details
Headers: Authorization: Bearer <access_token>
Body:
{
  "serviceType": "string",
  "price": "number",
  "description": "string"
}
Response:
{
  "success": true,
  "data": {
    "id": "number",
    "serviceType": "string",
    "price": "number",
    "description": "string",
    "updatedAt": "datetime"
  },
  "message": "Price updated successfully"
}
Delete Price
DELETE /admin/price/:id
Description: Delete a price entry
Headers: Authorization: Bearer <access_token>
Response:
{
  "success": true,
  "message": "Price deleted successfully"
}
Shipment Management
Get All Shipments
GET /admin/shipment
Description: Get all shipments
Headers: Authorization: Bearer <access_token>
Response:
{
  "success": true,
  "data": [
    {
      "id": "number",
      "trackingNumber": "string",
      "status": "string",
      "senderName": "string",
      "receiverName": "string",
      "createdAt": "datetime"
    }
  ]
}
Delete Shipment (Admin)
DELETE /admin/shipment/:id
Description: Delete a shipment (admin only)
Headers: Authorization: Bearer <access_token>
Response:
{
  "success": true,
  "message": "Shipment deleted successfully"
}
Update Shipment Status
PUT /admin/shipment/:id
Description: Update shipment status
Headers: Authorization: Bearer <access_token>
Body:
{
  "status": "string"
}
Response:
{
  "success": true,
  "data": {
    "id": "number",
    "status": "string",
    "updatedAt": "datetime"
  },
  "message": "Shipment status updated successfully"
}
Notification Management
Update Notification
PUT /admin/notifications/:id
Description: Update notification details
Headers: Authorization: Bearer <access_token>
Body:
{
  "title": "string",
  "message": "string",
  "type": "string",
  "isActive": "boolean"
}
Response:
{
  "success": true,
  "data": {
    "id": "number",
    "title": "string",
    "message": "string",
    "type": "string",
    "isActive": "boolean",
    "updatedAt": "datetime"
  },
  "message": "Notification updated successfully"
}
Delete Notification
DELETE /admin/notifications/:id
Description: Delete a notification
Headers: Authorization: Bearer <access_token>
Response:
{
  "success": true,
  "message": "Notification deleted successfully"
}
Settings Management
Update Setting
PUT /admin/settings/:id
Description: Update system settings
Headers: Authorization: Bearer <access_token>
Body:
{
  "key": "string",
  "value": "string",
  "description": "string"
}
Response:
{
  "success": true,
  "data": {
    "id": "number",
    "key": "string",
    "value": "string",
    "description": "string",
    "updatedAt": "datetime"
  },
  "message": "Setting updated successfully"
}
Delete Setting
DELETE /admin/settings/:id
Description: Delete a system setting
Headers: Authorization: Bearer <access_token>
Response:
{
  "success": true,
  "message": "Setting deleted successfully"
}
Error Responses
The API uses standard HTTP response codes:

200: Success
201: Created
400: Bad Request
401: Unauthorized
403: Forbidden
404: Not Found
500: Internal Server Error
Response Format
All responses are in JSON format:

{
  "success": true/false,
  "data": {}, // Response data
  "message": "Success/Error message"
}
Security Features
Passwords are hashed using bcrypt
JWT tokens for authentication
Refresh token mechanism
Role-based access control
Token expiration
Secure password storage
Error Handling
The API returns appropriate HTTP status codes and error messages:

200: Success
201: Created
400: Bad Request
401: Unauthorized
403: Forbidden
404: Not Found
500: Internal Server Error
Development
To run the server in development mode:

npm run dev
The server will automatically sync the database schema in development mode.

Production
For production deployment:

Set NODE_ENV=production in your .env file
Use a secure JWT secret
Configure proper CORS settings
Use HTTPS
Set up proper database backups
Use environment variables for sensitive data