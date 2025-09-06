-- Healthcare Management System Database Schema
-- Run these commands in your PostgreSQL database

-- Create the database (run this first if the database doesn't exist)
-- CREATE DATABASE healthcare_db;

-- Connect to the healthcare_db database before running the following commands
-- \c healthcare_db;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS patient_doctor CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create patients table
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 150),
    disease VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctors table
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create patient_doctor mapping table
CREATE TABLE patient_doctor (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, doctor_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patient_doctor_patient_id ON patient_doctor(patient_id);
CREATE INDEX idx_patient_doctor_doctor_id ON patient_doctor(doctor_id);

-- Add triggers to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at 
    BEFORE UPDATE ON doctors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
-- Sample doctors
INSERT INTO doctors (name, specialization) VALUES
('John Smith', 'Cardiology'),
('Sarah Johnson', 'Pediatrics'),
('Michael Brown', 'Orthopedics'),
('Emily Davis', 'Neurology'),
('David Wilson', 'Dermatology');

-- Note: Users and patients will be created through the application
-- Sample user (password is 'password123' hashed with bcrypt)
-- You can create users through the registration form in the application

-- Display table information
\dt

-- Display table structures
\d users
\d patients
\d doctors
\d patient_doctor

-- Display sample data
SELECT * FROM doctors;

COMMENT ON DATABASE healthcare_db IS 'Healthcare Management System Database';
COMMENT ON TABLE users IS 'Stores user authentication information';
COMMENT ON TABLE patients IS 'Stores patient information linked to users';
COMMENT ON TABLE doctors IS 'Stores doctor information';
COMMENT ON TABLE patient_doctor IS 'Maps patients to their assigned doctors';

-- Grant permissions (adjust as needed for your environment)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
