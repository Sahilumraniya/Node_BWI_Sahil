# Node.js API for User Management

## Description

This is a Node.js API for user management. It allows users to register, login, and modify their own information. Admins can view, modify, and delete all user details.

## Table of Contents

-   [User Management](#user-management)
-   [Admin Management](#admin-management)
-   [End Points](#end-points)
-   [Authentication and Security](#authentication-and-security)
-   [Image Storage](#image-storage)
-   [Database and Framework](#database-and-framework)
-   [Data Validation](#data-validation)
-   [Project Structure](#project-structure)
-   [How to Use](#how-to-use)

## User Management

-   **Signup:** Endpoint for user registration.
-   **Login:** Endpoint for user login.
-   **Modify User Details:** Allowing users to modify their own information.
-   **Delete User:** Endpoint for user account deletion.

### Admin Management

-   **Create Admin:** API to create admin accounts.

### End Points

-   **POST /api/v1/user/signup** Endpoint for user registration.
-   **POST /api/v1/user/login** Endpoint for user login.
-   **POST /api/v1/user/logout** Endpoint for user logout.
-   **GET /api/v1/user/me** Endpoint for getting user details.
-   **PATCH /api/v1/user/update** Endpoint for updating user details (username or role).
-   **DELETE /api/v1/user/delete** Endpoint for deleting user account.
-   **PATCH /api/v1/user/update-profile-image** Endpoint for updating user profile image.
-   **PATCH /api/v1/user/update-password** Endpoint for updating user password.

-   **POST /api/v1/admin/getAllUser** Endpoint for getting all user details.
-   **PATCH /api/v1/admin/update/:id** Endpoint for updating user details (username or role).
-   **PATCH /api/v1/admin/updateProfileImage/:id** Endpoint for updating user profile image.
-   **DELETE /api/v1/admin/deleteUser/:id** Endpoint for deleting user account.
-   **DELETE /api/v1/admin/deleteAllUsers** Endpoint for deleting all user account.

## Roles and Access Control

-   Define two roles: Admin and User.
-   Admins can view, modify, and delete all user details.
-   Users can only view, modify, and delete their own details.

## Authentication and Security

-   Implement an authentication system using JSON Web Tokens (JWT).
-   Use bcrypt to securely encrypt user passwords.

## Image Storage

-   Save profile images in the local system for temporary use and integrate with cloudinary service to save.

## Database and Framework

-   Utilize Express.js for API development.
-   Use Mongoose to create models, connect to the database, and perform CRUD operations.
-   Use MongoDB Atlas for cloud database.
-   Use Multer for image upload.
-   Use Cloudinary for image storage.

## Data Validation

-   Implement thorough data validation to ensure the correctness and integrity of input data.

## Project Structure

-   `/public`: Contains static files (images).
-   `/src/controllers`: Contains controllers for handling different functionalities.
-   `/src/middlewares`: Includes middleware functions for authentication and validation.
-   `/src/models`: Defines database models (User, Admin).
-   `/scr/db` : Contains database connection file
-   `/src/routes`: Defines API routes for users and admins.
-   `/src/utils`: Utility functions for encryption and validation.
-   `/src/index.js`: Main entry point for the application.
-   `/src/app.js` : express app configuration file

## How to Use

```bash
# Clone the repository
git clone https://github.com/Sahilumraniya/Node_BWI_Sahil.git
```

```javascript
// Install dependencies
npm install
npm run start
```
