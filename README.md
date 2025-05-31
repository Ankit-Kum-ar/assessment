# EV Charging Station Management System

A full-stack application for managing EV charging stations with authentication, CRUD operations, and map visualization.

## Features

- User authentication (register, login, logout)
- Charging station management (create, read, update, delete)
- Interactive map view of all charging stations
- Filtering stations by status, connector type, and power output

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Cookie-based auth persistence

### Frontend
- Vue.js 3 with Composition API
- Zustand for state management
- Tailwind CSS with DaisyUI for styling
- Leaflet for map visualization
- Vite for build tooling

## Project Structure

```
assessment/
├── client/              # Frontend Vue.js application
│   ├── public/          # Public assets
│   └── src/             # Source files
│       ├── assets/      # CSS and static assets
│       ├── components/  # Reusable Vue components
│       ├── stores/      # Zustand stores for state management
│       ├── views/       # Vue page components
│       └── router/      # Vue Router configuration
│
└── server/              # Backend Express application
    ├── config/          # Configuration files
    ├── controllers/     # Request handlers
    ├── middlewares/     # Express middlewares
    ├── models/          # Mongoose models
    ├── routes/          # Express routes
    └── utils/           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)

### Setup Environment Variables

Create a `.env` file in the server directory:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Installation and Running

1. Clone the repository
2. Install backend dependencies:
   ```
   cd server
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd client
   npm install
   ```
4. Start the backend server:
   ```
   cd server
   npm run dev
   ```
5. Start the frontend development server:
   ```
   cd client
   npm run dev
   ```

6. Access the application at `http://localhost:5173`

## API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user

### Charging Station Endpoints

- `GET /api/v1/stations` - Get all charging stations
- `GET /api/v1/stations/:id` - Get a specific charging station
- `POST /api/v1/stations` - Create a new charging station
- `PUT /api/v1/stations/:id` - Update a charging station
- `DELETE /api/v1/stations/:id` - Delete a charging station

## Deployment

### Backend Deployment
- The backend can be deployed on platforms like Heroku, Railway, or Render.
- Make sure to set the appropriate environment variables.

### Frontend Deployment
- The frontend can be deployed on Vercel, Netlify, or any static hosting service.
- Build the production version with `npm run build`.

## License

This project is licensed under the MIT License.
