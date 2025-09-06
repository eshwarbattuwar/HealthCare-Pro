const pool = require("../config/db");

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Patients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        age INT,
        disease VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Doctors table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        specialization VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Patient_Doctor mapping
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patient_doctor (
        id SERIAL PRIMARY KEY,
        patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id INT REFERENCES doctors(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(patient_id, doctor_id)
      );
    `);

    // Insert sample doctors if they don't exist
    await pool.query(`
      INSERT INTO doctors (name, specialization) VALUES
      ('John Smith', 'Cardiology'),
      ('Sarah Johnson', 'Pediatrics'),
      ('Michael Brown', 'Orthopedics'),
      ('Emily Davis', 'Neurology'),
      ('David Wilson', 'Dermatology')
      ON CONFLICT DO NOTHING;
    `);

    console.log("✅ Tables created successfully (if not already present)");
  } catch (err) {
    console.error("❌ Error creating tables", err);
  }
};

module.exports = createTables;
