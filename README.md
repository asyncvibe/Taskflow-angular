# TaskFlow Angular - MEAN Stack Application

A complete MEAN stack application with Angular frontend and Express.js backend, featuring user authentication, task management, and more.

## 🏗️ Project Structure

```
taskflow-angular/
├── frontend/           # Angular application
│   ├── app/           # Angular app components
│   ├── package.json   # Frontend dependencies
│   └── ...
├── backend/           # Express.js API server
│   ├── src/           # Backend source code
│   ├── package.json   # Backend dependencies
│   └── .env           # Environment variables
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Angular CLI

### Frontend Setup (Angular)

```bash
cd frontend
npm install
ng serve
```

The frontend will be available at `http://localhost:4200`

### Backend Setup (Express.js + MongoDB)

```bash
cd backend
npm install
npm run dev
```

The backend API will be available at `http://localhost:3000`

## 🔧 Configuration

### Frontend Configuration
- Main configuration in `frontend/src/app/app.config.ts`
- API service configured to connect to backend at `http://localhost:3000/api`

### Backend Configuration
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/amisha_joshi_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_2024
JWT_EXPIRES_IN=7d

# Frontend URL for CORS
FRONTEND_URL=http://localhost:4200
```

## 📋 Features

- **Authentication**: User registration, login, logout with JWT
- **Task Management**: Create, read, update, delete tasks
- **User Management**: Admin user management
- **Product Management**: Product catalog management
- **Settings**: User preferences and configuration
- **Dashboard**: Analytics and overview

## 🔐 Default Admin User

The backend automatically seeds a demo admin user:
- **Email**: demo@example.com
- **Password**: password123

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Protected Routes (Require Authentication)
- `GET /api/users` - Get all users
- `GET /api/tasks` - Get all tasks
- `GET /api/products` - Get all products
- `GET /api/settings` - Get settings

## 🧪 Testing the API

You can test the API endpoints using:
1. The built-in test buttons in the dashboard
2. Postman or any API client
3. cURL commands

Example cURL for login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@example.com", "password": "password123"}'
```

## 🔄 Development Workflow

1. Start MongoDB service
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && ng serve`
4. Open browser to `http://localhost:4200`

## 🛡️ Security Features

- JWT token authentication
- Password hashing with bcryptjs
- CORS configuration
- Rate limiting
- Input validation with express-validator
- Security headers with Helmet

## 📦 Technologies Used

### Frontend
- Angular 18+
- TypeScript
- RxJS
- Angular Material (UI components)
- Angular Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose (ODM)
- JWT for authentication
- Bcryptjs for password hashing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.