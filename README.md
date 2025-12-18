# Product Management API

A clean, scalable RESTful API for managing products, built with **Node.js**, **Express**, and **MongoDB**, following layered architecture and best practices. The project focuses on clear separation of concerns, strong business logic, validation, role-based access control, and proper documentation.

---

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Validation:** Zod
- **API Documentation:** Swagger (OpenAPI)

---

## Project Overview
The API allows managing products with support for:
- Creating, reading, updating, and deleting products
- Role-based access (`user` / `admin`)
- Input validation using Zod
- Centralized error handling
- Pagination, filtering, and sorting
- Interactive API documentation via Swagger

The project was built starting from the database and service (business logic) layer, then extended with controllers, routes, validation, middleware, and documentation.

---

## Architecture Overview
The project follows a layered architecture:

```
Request → Middleware → Controller → Service → Model → Database
```

- **Middleware** handles validation, authorization, and errors
- **Controllers** manage HTTP concerns
- **Services** contain business logic and domain rules
- **Models** define database schemas and constraints

---

## Project Structure (Brief)

### `config/`
- `db.js` → Initializes and manages the MongoDB connection.

### `models/`
- `product.model.js` → Defines the Product schema, indexes, and database constraints.

### `services/`
- `product.service.js` → Implements core business logic and domain rules.

### `controllers/`
- `product.controller.js` → Handles HTTP requests and responses and delegates logic to services.

### `routes/`
- `product.routes.js` → Defines API endpoints and maps them to controllers.

### `validations/`
- `product.schema.js` → Zod schemas for validating request body, params, and query inputs.

### `middlewares/`
- `request.guard.js` → Applies role checks and request validation.
- `error.middleware.js` → Centralized error handling and response formatting.

### Core Files
- `app.js` → Configures Express app, middleware, and routes.
- `server.js` → Application entry point and server bootstrap.
- `.env` → Environment configuration.

---

## Authentication & Authorization
- Role is provided via HTTP header:

```
X-User-Role: user | admin
```

- `admin` can create, update, and delete products
- `user` can only access public products

---

## API Documentation (Swagger)
Interactive API documentation is available via Swagger:

```
http://localhost:5000/api-docs
```

Swagger includes:
- All endpoints
- Request and response schemas
- Query parameters
- Required headers

---

## Environment Variables
Create a `.env` file using the following format:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## Getting Started

### Install dependencies
```bash
npm install
```

### Run the server
```bash
node src/server.js
```

The server will start on:
```
http://localhost:5000
```

---

## Testing & Validation
- Business logic was tested directly at the service layer
- Database operations verified using MongoDB Atlas / Compass
- API endpoints tested using Swagger and REST clients
