# E-Learning System Project

A full-stack e-learning platform built with React, Node.js, and MongoDB. Features include course management, video streaming, payment processing, and progress tracking.

## 🚀 Features

- **User Authentication** with Clerk
- **Payment Processing** with Stripe
- **Course Management** for educators
- **Video Streaming** with YouTube integration
- **Progress Tracking** and certificates
- **Responsive Design** with Tailwind CSS
- **Cross-Platform** support (Windows, macOS, Linux)

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- React Router
- Clerk (Authentication)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Stripe (Payments)
- Cloudinary (File Storage)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git
- Stripe Account
- Clerk Account
- Cloudinary Account

## ⚡ Quick Start

### For Windows Users:
1. **Easy Setup**: Run `setup-windows.bat`
2. **Easy Start**: Run `start-windows.bat`
3. **Manual Setup**: Follow the [Windows Setup Guide](README-WINDOWS.md)

### For Linux/macOS Users:

1. **Clone the repository**
   ```bash
   git clone https://github.com/SameerKhairul/E-learning-system-project.git
   cd E-learning-system-project
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   ```

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables**
   
   Create `.env` in server folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   STRIPE_SECRET_KEY=your_stripe_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   CURRENCY=USD
   ```
   
   Create `.env` in client folder:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   VITE_CURRENCY=USD
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   ```

5. **Start the application**
   ```bash
   # Terminal 1 - Server
   cd server
   npm start
   
   # Terminal 2 - Client
   cd client
   npm run dev
   ```

## 🖥️ Platform-Specific Scripts

### Windows:
- `npm run start:windows` - Start with Windows optimizations
- `npm run dev:windows` - Development mode for Windows

### Cross-Platform:
- `npm start` - Production start
- `npm run dev` - Development mode
- `npm run build` - Build for production

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/api

## 📁 Project Structure

```
E-learning-system-project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── assets/         # Static files
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # API controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middleware
│   └── configs/           # Configuration files
├── README-WINDOWS.md      # Windows setup guide
├── setup-windows.bat      # Windows setup script
└── start-windows.bat      # Windows start script
```

## 🔧 API Endpoints

### Authentication
- `POST /clerk` - Clerk webhook
- `GET /api/user/data` - Get user data

### Courses
- `GET /api/course/all` - Get all courses
- `GET /api/course/:id` - Get course by ID
- `POST /api/user/purchase` - Purchase course

### Payment
- `POST /stripe` - Stripe webhook

## 🐳 Docker Support

```bash
# Build and run with Docker
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple platforms
5. Submit a pull request

## 🐛 Troubleshooting

### Windows Issues:
- See [Windows Setup Guide](README-WINDOWS.md)
- Run Command Prompt as Administrator
- Check Windows Firewall settings

### General Issues:
- Ensure all environment variables are set
- Check Node.js version compatibility
- Verify MongoDB connection
- Test Stripe webhook endpoints

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the fast build tool
- Stripe for payment processing
- Clerk for authentication
- All contributors and testers

## 📞 Support

For issues and questions:
- Check the [Windows Setup Guide](README-WINDOWS.md) for Windows-specific help
- Create an issue on GitHub
- Check existing issues for solutions

---

**Built with ❤️ for cross-platform compatibility**