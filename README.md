# CCWeb - Website with Admin Panel

A full-stack web application with a React frontend and Node.js backend.

## Project Structure

```
CCWeb/
├── frontend/          # React application (Vite)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── backend/           # Express API server
    ├── server.js
    └── package.json
```

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:5000`

## Development

1. **Frontend**: Built with React and Vite for fast development
   - Navigate to `/frontend` directory
   - Run `npm run dev` to start the development server
   - Access at http://localhost:5173

2. **Backend**: Built with Express.js
   - Navigate to `/backend` directory
   - Run `npm run dev` to start the development server with hot-reload
   - Access at http://localhost:5000

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Features

- ✅ React frontend with Vite
- ✅ Express backend with CORS support
- ✅ Environment configuration
- ✅ Admin panel ready structure
- ⏳ Authentication (to be implemented)
- ⏳ Database integration (to be implemented)
- ⏳ Admin dashboard UI (to be implemented)

## Next Steps

1. Set up database (MongoDB/PostgreSQL/MySQL)
2. Implement authentication system
3. Create admin panel UI components
4. Build REST API endpoints
5. Add user management features
