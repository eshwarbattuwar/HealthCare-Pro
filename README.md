# HealthCare Pro

A complete full-stack Healthcare Management System built with Node.js, Express, PostgreSQL, and vanilla JavaScript.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 👥 **Patient Management** - Full CRUD operations for patients (protected by JWT)
- 👨‍⚕️ **Doctor Management** - Complete doctor information management
- 🔗 **Patient-Doctor Mapping** - Link patients to their assigned doctors
- 🎨 **Responsive UI** - Clean, modern interface that works on all devices
- 🛡️ **Secure** - Password hashing with bcrypt, JWT token validation
- 📱 **Real-time Feedback** - Toast notifications for all user actions

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **dotenv** - Environment variables management

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **Vanilla JavaScript** - No frameworks, pure JS with Fetch API
- **Responsive Design** - Mobile-first approach

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.0.0 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/download/) (v12.0 or later)

## Installation & Setup

### 1. Clone or Download the Project

```bash
# If you have the project files, navigate to the project directory
cd healthcare
```

### 2. Install Dependencies

```bash
npm install
```

This will install all the required dependencies:
- express
- pg (PostgreSQL client)
- bcrypt (password hashing)
- jsonwebtoken (JWT handling)
- dotenv (environment variables)
- cors (Cross-Origin Resource Sharing)
- nodemon (development tool)

### 3. Set Up PostgreSQL Database

#### Option A: Using PostgreSQL Command Line (psql)

1. **Start PostgreSQL service** (if not already running)
   
2. **Connect to PostgreSQL**:
   ```bash
   psql -U postgres
   ```

3. **Create the database**:
   ```sql
   CREATE DATABASE healthcare_db;
   ```

4. **Connect to the new database**:
   ```sql
   \c healthcare_db;
   ```

5. **Run the database schema**:
   ```bash
   \i database-schema.sql
   ```

#### Option B: Using pgAdmin (GUI)

1. Open pgAdmin
2. Create a new database named `healthcare_db`
3. Open the Query Tool
4. Copy and paste the contents of `database-schema.sql`
5. Execute the script

### 4. Configure Environment Variables

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your actual database credentials:
   ```env
   # Server Configuration
   PORT=5000
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=healthcare_db
   DB_USER=postgres
   DB_PASSWORD=your_actual_password_here
   
   # JWT Configuration
   JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here_make_it_at_least_32_characters
   
   # Environment
   NODE_ENV=development
   ```

   **Important**: Replace `your_actual_password_here` with your PostgreSQL password and create a strong JWT secret.

### 5. Verify Database Connection

Test if your database connection works:

```bash
node -e "require('./config/db').query('SELECT NOW()', (err, res) => { console.log(err ? err : 'Database connected successfully!'); process.exit(); })"
```

## Running the Application

### Development Mode

```bash
npm run dev
```

This starts the server with nodemon, which automatically restarts when you make changes.

### Production Mode

```bash
npm start
```

### Access the Application

Once the server is running, you can access the application at:

**http://localhost:5000**

You should see:
```
Server running on port 5000
Environment: development
Access the application at: http://localhost:5000
Connected to PostgreSQL database
```

## Usage Guide

### 1. Register a New Account

1. Navigate to **http://localhost:5000**
2. Click "Register here" link
3. Fill in your details:
   - Full Name
   - Email
   - Password (minimum 6 characters)
   - Confirm Password
4. Click "Register"

### 2. Login

1. Go to **http://localhost:5000**
2. Enter your email and password
3. Click "Login"

### 3. Dashboard Features

Once logged in, you'll have access to three main sections:

#### Patient Management
- **Add Patient**: Click "Add Patient" button
- **View Patients**: All your patients are displayed as cards
- **Edit Patient**: Click "Edit" on any patient card
- **Delete Patient**: Click "Delete" on any patient card

#### Doctor Management
- **Add Doctor**: Click "Add Doctor" button
- **View Doctors**: All doctors are displayed as cards
- **Edit Doctor**: Click "Edit" on any doctor card
- **Delete Doctor**: Click "Delete" on any doctor card

#### Patient-Doctor Mappings
- **Create Mapping**: Click "Add Mapping" button
- **View Mappings**: All patient-doctor relationships are shown
- **Remove Mapping**: Click "Remove" to delete a mapping

### 4. Logout

Click the "Logout" button in the header to end your session.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Patients (Protected - Requires JWT)
- `GET /api/patients` - Get all patients for authenticated user
- `POST /api/patients` - Create a new patient
- `GET /api/patients/:id` - Get a specific patient
- `PUT /api/patients/:id` - Update a patient
- `DELETE /api/patients/:id` - Delete a patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create a new doctor
- `GET /api/doctors/:id` - Get a specific doctor
- `PUT /api/doctors/:id` - Update a doctor
- `DELETE /api/doctors/:id` - Delete a doctor

### Patient-Doctor Mappings
- `GET /api/mappings` - Get all mappings
- `POST /api/mappings` - Create a new mapping
- `GET /api/mappings/:patient_id` - Get mappings for a specific patient
- `DELETE /api/mappings/:id` - Delete a mapping

### Health Check
- `GET /api/health` - Check API status

## Project Structure

```
healthcare-management-system/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── patientController.js  # Patient CRUD operations
│   ├── doctorController.js   # Doctor CRUD operations
│   └── mappingController.js  # Mapping operations
├── middleware/
│   └── authMiddleware.js     # JWT authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── patients.js          # Patient routes
│   ├── doctors.js           # Doctor routes
│   └── mappings.js          # Mapping routes
├── frontend/
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   ├── dashboard.html       # Main dashboard
│   ├── style.css           # All styles
│   └── scripts.js          # Frontend JavaScript
├── server.js               # Main server file
├── package.json           # Dependencies and scripts
├── database-schema.sql    # Database setup script
├── .env.example          # Environment variables template
└── README.md            # This file
```

## Testing the Application

### Manual Testing Checklist

1. **Authentication**
   - [ ] Register a new user
   - [ ] Login with correct credentials
   - [ ] Try login with wrong credentials
   - [ ] Logout functionality

2. **Patient Management**
   - [ ] Add a new patient
   - [ ] View all patients
   - [ ] Edit patient information
   - [ ] Delete a patient

3. **Doctor Management**
   - [ ] Add a new doctor
   - [ ] View all doctors
   - [ ] Edit doctor information
   - [ ] Delete a doctor

4. **Mapping Management**
   - [ ] Create patient-doctor mapping
   - [ ] View all mappings
   - [ ] Delete a mapping

5. **Security**
   - [ ] Try accessing dashboard without login
   - [ ] Verify JWT token expiration
   - [ ] Test protected routes

### Sample Test Data

After setting up, you can use this sample data:

**Sample User:**
- Name: John Doe
- Email: john@example.com
- Password: password123

**Sample Patient:**
- Name: Jane Smith
- Age: 30
- Disease: Hypertension

**Sample Doctor:**
- Name: Dr. Robert Wilson
- Specialization: Cardiology

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:5432
   ```
   **Solution**: Make sure PostgreSQL is running and credentials in `.env` are correct.

2. **JWT Secret Error**
   ```
   Error: secretOrPrivateKey has a value but it is not a string or buffer
   ```
   **Solution**: Make sure `JWT_SECRET` is set in your `.env` file.

3. **Port Already in Use**
   ```
   Error: listen EADDRINUSE :::5000
   ```
   **Solution**: Change the PORT in `.env` file or kill the process using port 5000.

4. **Module Not Found**
   ```
   Error: Cannot find module 'express'
   ```
   **Solution**: Run `npm install` to install all dependencies.

5. **Database Tables Don't Exist**
   ```
   Error: relation "users" does not exist
   ```
   **Solution**: Make sure you ran the `database-schema.sql` script.

### Debug Mode

To run with more verbose logging:

```bash
NODE_ENV=development npm run dev
```

### Database Reset

To reset the database and start fresh:

```sql
-- Connect to your database
\c healthcare_db;

-- Run the schema script again
\i database-schema.sql
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- Protected routes require valid JWT tokens
- SQL injection protection through parameterized queries
- CORS is enabled for cross-origin requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the console for error messages
4. Verify your environment configuration

---

**Happy coding! 🚀**
