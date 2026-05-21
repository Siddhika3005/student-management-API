# School Management API

Node.js + Express API for managing schools with a MySQL database. It supports adding schools and listing them sorted by distance from a user location.

## Features
- Add schools with basic validation
- List schools sorted by proximity (Haversine distance)
- Simple, dependency-light Express setup

## Tech Stack
- Node.js
- Express.js
- MySQL (mysql2)
- dotenv, cors

## Requirements
- Node.js 18+
- MySQL 8+

## Getting Started
1. Install dependencies:
   - npm install
2. Create an environment file:
   - copy .env.example to .env and update values
3. Create the database and table (see SQL below)
4. Start the server:
   - npm run dev

## Environment Variables
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
DB_PORT=3306
```

## Database SQL
```
CREATE DATABASE school_management;

USE school_management;

CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
```

## API Reference

### POST /addSchool
Adds a school to the database.

Body:
```
{
  "name": "Green Valley High",
  "address": "12 Lake Road, City Center",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

Example:
```bash
curl -X POST http://localhost:5000/addSchool \
  -H "Content-Type: application/json" \
  -d '{"name":"Green Valley High","address":"12 Lake Road, City Center","latitude":12.9716,"longitude":77.5946}'
```

### GET /listSchools?latitude=...&longitude=...
Returns all schools sorted by distance from the provided coordinates.

Example:
```bash
curl "http://localhost:5000/listSchools?latitude=12.9716&longitude=77.5946"
```

## Distance Calculation
The API uses the Haversine formula to compute distance in kilometers between two coordinates.

## Project Structure
```
School Management API/
  controllers/
    schoolController.js
  routes/
    schoolRoutes.js
  db.js
  server.js
  .env.example
  README.md
```

## Postman Collection
Import the JSON file: postman_collection.json

## Deployment (Render)
- Root directory: School Management API
- Build command: npm install
- Start command: npm start

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License
This project is licensed under the MIT License.
