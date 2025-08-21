# E-Learning System - Windows Setup Guide

This guide will help you set up and run the E-Learning System on Windows.

## Prerequisites

1. **Node.js** (v16 or higher) - Download from [nodejs.org](https://nodejs.org/)
2. **Git** - Download from [git-scm.com](https://git-scm.com/)
3. **MongoDB** - Either local installation or MongoDB Atlas account
4. **Stripe Account** - For payment processing
5. **Clerk Account** - For authentication

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/SameerKhairul/E-learning-system-project.git
cd E-learning-system-project
```

### 2. Server Setup
```bash
cd server
npm install
```

#### Create `.env` file in the server folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CURRENCY=USD
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Client Setup
```bash
cd ../client
npm install
```

#### Create `.env` file in the client folder:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=USD
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Running the Application

### Method 1: Using Windows-specific scripts
```bash
# Terminal 1 - Start the server
cd server
npm run start:windows

# Terminal 2 - Start the client  
cd client
npm run start:windows
```

### Method 2: Using regular scripts
```bash
# Terminal 1 - Start the server
cd server
npm start

# Terminal 2 - Start the client
cd client
npm run dev
```

## Windows-Specific Notes

1. **Path Separators**: The application automatically handles Windows path separators (`\` vs `/`)
2. **Environment Variables**: Use `set` command if needed:
   ```bash
   set NODE_ENV=development
   npm start
   ```
3. **Port Issues**: If port 5000 is busy on Windows, change the PORT in server `.env` file

## Troubleshooting

### Common Windows Issues:

1. **Permission Errors**:
   - Run Command Prompt or PowerShell as Administrator
   - Or use `npm config set registry https://registry.npmjs.org/`

2. **Node Modules Issues**:
   ```bash
   # Delete node_modules and reinstall
   rmdir /s node_modules
   del package-lock.json
   npm install
   ```

3. **MongoDB Connection**:
   - Use MongoDB Compass to test connection strings
   - Ensure MongoDB service is running (if using local installation)

4. **Firewall Issues**:
   - Allow Node.js through Windows Firewall
   - Check antivirus software isn't blocking the ports

## Development Scripts

### Server Scripts:
- `npm start` - Production start
- `npm run dev` - Development with nodemon
- `npm run start:windows` - Windows-specific start
- `npm run dev:windows` - Windows-specific development

### Client Scripts:
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start:windows` - Windows-specific start
- `npm run build:windows` - Windows-specific build

## Browser Support

- Chrome (recommended)
- Firefox
- Edge
- Safari

## Additional Tools

For the best development experience on Windows:
- **VS Code** - Recommended editor
- **Windows Terminal** - Better terminal experience
- **Git Bash** - Unix-like commands on Windows

## Support

If you encounter any Windows-specific issues, please check:
1. Node.js version compatibility
2. Windows path handling
3. Firewall and antivirus settings
4. Environment variable setup

Happy coding! 🚀