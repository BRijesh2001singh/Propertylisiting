# Property Listing API

A backend API for a property listing platform built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**. It supports user authentication, property management, recommendations, and uses Redis for caching.

---

## Features

* 🔐 JWT-based User Authentication
* 🏘 Property Listing with Pagination and Filtering
* ✅ Property Recommendations
* 📂 Redis Caching for Optimized Property Search
* 📄 RESTful API Design

---

## Project Structure

```
Propertylisiting/
├── src/
│   ├── controllers/         # Route logic
│   ├── connection/          # Database and Redis config
│   ├── models/              # Mongoose models
│   ├── routes/              # Route declarations
│   ├── middleware/          # Authentication and caching
|   ├── types/               # exporting ts interface
│   └── utils/               # Helper functions
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/BRijesh2001singh/Propertylisiting.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=JWT_expiry_time
REDIS_CLIENT=redis://localhost:6379
```

### 4. Start the Server

```bash
npm run dev
```

---

## API Endpoints

### 🔐 Auth

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/signup` | Register a new user |
| POST   | `/api/signin`    | Login and get token |

### 🏘 Property

| Method | Endpoint              | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| GET    | `/api/properties?queries` | Get all properties (paginated & filtered)|
| POST   | `/api/properties`     | Create a property                         |
| GET    | `/api/properties/:id` | Get a property by ID                      |
| PUT    | `/api/properties/:id` | Update a property                         |
| DELETE | `/api/properties/:id` | Delete a property                         |

### 🔍 Search and filter
**Description:**  
Fetch all properties with optional filters and pagination.

**Query Parameters:**

| Parameter     | Type    | Description                             |
|---------------|---------|-----------------------------------------|
| `city`        | string  | Filter by city                          |
| `state`       | string  | Filter by state                         |
| `type`        | string  | Property type (e.g., Apartment)         |
| `listingType` | string  | Rent or Sale                            |
| `minPrice`    | number  | Minimum price                           |
| `maxPrice`    | number  | Maximum price                           |
| `bedrooms`    | number  | Minimum number of bedrooms              |
| `bathrooms`   | number  | Minimum number of bathrooms             |
| `furnished`   | string  | Furnished, Semi-Furnished, etc.         |
| `listedBy`    | string  | Owner, Builder, etc.                    |
| `rating`      | number  | Minimum rating                          |
| `page`        | number  | Page number for pagination              |
| `limit`       | number  | Number of results per page              |

 **Example query**
 ```bash
GET /api/properties?city=Delhi&listingType=Rent&minPrice=10000&maxPrice=30000&page=1&limit=10
 ```
### ⭐Favourites

| Method | Endpoint              | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| GET    | `api/favourites/property` | Get all favourites properties|
| POST   | `/api/favourites/property` |Add property to favourites                |
| DELETE | `/api/favourites/property` | Delete property from favourites               |

### 📢 Recommendation

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| POST   | `/api/recommend` | Recommend a property to a user |
| DELETE | `/api/recommend` | Remove a recommended property  |

---

## 🧚‍♂️ Testing the API

### 🔐 Protected Routes

Most routes require authentication using a **Bearer Token**.

1. Login via `/api/signin`
2. Copy the token from the response cookies
3. Use it in the `Authorization` header like:

#### Postman:

* Authorization Type: **Bearer Token**
* Token: `your_jwt_token`

#### cURL:

```bash
curl -H "Authorization: Bearer your_token_here" http://localhost:5000/api/properties
```

---

## Sample JSON Payloads

### Registration

```json
{
  "email": "test@example.com",
  "password": "strongpassword"
}
```

### Login

```json
{
  "email": "test@example.com",
  "password": "strongpassword"
}
```
### Add property to favourites

```json
{
"propertyId":"68347b7ce0fee5f6ce42c293"
}
```
### Recommend a Property

```json
{
  "email": "friend@example.com",
  "propertyId": "your_property_id_here"
}
```

---

## Notes

* Make sure MongoDB and Redis are running.
* Environment variables must be set correctly.
---

## 📄 License

MIT License

---

> Made with ❤️ by [@BRijesh2001singh](https://github.com/BRijesh2001singh)
