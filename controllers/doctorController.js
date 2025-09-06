const pool = require('../config/db');

// Create a new doctor
const createDoctor = async (req, res) => {
  try {
    const { name, specialization } = req.body;

    // Validate input
    if (!name || !specialization) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create doctor
    const newDoctor = await pool.query(
      'INSERT INTO doctors (name, specialization) VALUES ($1, $2) RETURNING *',
      [name, specialization]
    );

    res.status(201).json({
      message: 'Doctor created successfully',
      doctor: newDoctor.rows[0]
    });
  } catch (error) {
    console.error('Create doctor error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await pool.query('SELECT * FROM doctors ORDER BY id DESC');

    res.json({
      message: 'Doctors retrieved successfully',
      doctors: doctors.rows
    });
  } catch (error) {
    console.error('Get doctors error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);

    if (doctor.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      message: 'Doctor retrieved successfully',
      doctor: doctor.rows[0]
    });
  } catch (error) {
    console.error('Get doctor by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a doctor
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization } = req.body;

    // Check if doctor exists
    const existingDoctor = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);

    if (existingDoctor.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update doctor
    const updatedDoctor = await pool.query(
      'UPDATE doctors SET name = $1, specialization = $2 WHERE id = $3 RETURNING *',
      [name || existingDoctor.rows[0].name, 
       specialization || existingDoctor.rows[0].specialization, 
       id]
    );

    res.json({
      message: 'Doctor updated successfully',
      doctor: updatedDoctor.rows[0]
    });
  } catch (error) {
    console.error('Update doctor error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if doctor exists
    const existingDoctor = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);

    if (existingDoctor.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Delete related mappings first
    await pool.query('DELETE FROM patient_doctor WHERE doctor_id = $1', [id]);

    // Delete doctor
    await pool.query('DELETE FROM doctors WHERE id = $1', [id]);

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Delete doctor error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
};
