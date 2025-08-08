# TaskFlow Backend API

Express.js backend with MongoDB for the TaskFlow MEAN stack project.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation & Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Start production server
npm start
```

The API will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/            # Configuration files
│   │   └── seed.js        # Database seeding
│   ├── middleware/        # Express middleware
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/            # Mongoose models
│   │   ├── user.model.js
│   │   ├── task.model.js
│   │   └── product.model.js
│   ├── routes/            # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── task.routes.js
│   │   ├── product.routes.js
│   │   └── settings.routes.js
│   └── server.js          # Main server file
├── uploads/               # File upload directory
├── .env                   # Environment variables
└── package.json           # Dependencies
```

## 🔧 Configuration

### Environment Variables (.env)

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

## 📋 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user (protected)
- `POST /logout` - User logout (protected)
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Reset password

### Protected Routes (Require Authentication)

#### Users (`/api/users`)
- `GET /` - Get all users
- `GET /:id` - Get user by ID
- `POST /` - Create new user
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user

#### Tasks (`/api/tasks`)
- `GET /` - Get all tasks
- `GET /:id` - Get task by ID
- `POST /` - Create new task
- `PUT /:id` - Update task
- `DELETE /:id` - Delete task

#### Products (`/api/products`)
- `GET /` - Get all products
- `GET /:id` - Get product by ID
- `POST /` - Create new product
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product

#### Settings (`/api/settings`)
- `GET /` - Get user settings
- `PUT /` - Update user settings

### Health Check
- `GET /health` - Server health status

## 🔐 Authentication & Security

- **JWT Tokens**: Secure authentication
- **Password Hashing**: bcryptjs for password security
- **CORS**: Configured for frontend communication
- **Rate Limiting**: Protection against abuse
- **Input Validation**: express-validator for request validation
- **Security Headers**: Helmet middleware

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (required, hashed),
  firstName: String,
  lastName: String,
  role: String (default: 'user'),
  isActive: Boolean (default: true),
  preferences: Object,
  timestamps: true
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String,
  status: String (enum: pending, in-progress, completed),
  priority: String (enum: low, medium, high),
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  dueDate: Date,
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String (required),
  description: String,
  sku: String (unique, required),
  price: Number (required),
  category: String,
  inStock: Boolean (default: true),
  inventory: Number (default: 0),
  images: [String],
  timestamps: true
}
```

## 🌱 Database Seeding

The application automatically seeds a demo admin user on startup:
- **Email**: demo@example.com
- **Password**: password123
- **Role**: admin

## 🛠️ Available Scripts

```bash
# Development with auto-restart
npm run dev

# Production server
npm start

# Run tests (if configured)
npm test
```

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@example.com", "password": "password123"}'

# Get users (with token)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using the Frontend
The frontend application provides test buttons in the dashboard to quickly test all API endpoints.

## 📦 Dependencies

### Production Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **cors**: Cross-origin resource sharing
- **helmet**: Security middleware
- **morgan**: HTTP request logger
- **express-validator**: Input validation
- **express-rate-limit**: Rate limiting
- **multer**: File upload handling
- **dotenv**: Environment variables

### Development Dependencies
- **nodemon**: Auto-restart development server

## 🚨 Error Handling

The API includes comprehensive error handling:
- Mongoose validation errors
- JWT authentication errors
- File upload errors
- Custom business logic errors
- 404 for unknown routes

## 🤝 Contributing

1. Follow Node.js best practices
2. Use async/await for asynchronous operations
3. Validate all inputs
4. Write comprehensive error handling
5. Follow the established project structure
6. Use meaningful commit messages
