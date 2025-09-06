const pool = require('../config/db');

// Create a new patient
const createPatient = async (req, res) => {
  try {
    const { name, age, disease } = req.body;
    const userId = req.user.user.id;

    // Validate input
    if (!name || !age || !disease) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create patient
    const newPatient = await pool.query(
      'INSERT INTO patients (user_id, name, age, disease) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, age, disease]
    );

    res.status(201).json({
      message: 'Patient created successfully',
      patient: newPatient.rows[0]
    });
  } catch (error) {
    console.error('Create patient error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all patients for the authenticated user
const getPatients = async (req, res) => {
  try {
    const userId = req.user.user.id;

    const patients = await pool.query(
      'SELECT * FROM patients WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );

    res.json({
      message: 'Patients retrieved successfully',
      patients: patients.rows
    });
  } catch (error) {
    console.error('Get patients error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single patient by ID
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user.id;

    const patient = await pool.query(
      'SELECT * FROM patients WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (patient.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      message: 'Patient retrieved successfully',
      patient: patient.rows[0]
    });
  } catch (error) {
    console.error('Get patient by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a patient
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, disease } = req.body;
    const userId = req.user.user.id;

    // Check if patient exists and belongs to the user
    const existingPatient = await pool.query(
      'SELECT * FROM patients WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingPatient.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update patient
    const updatedPatient = await pool.query(
      'UPDATE patients SET name = $1, age = $2, disease = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [name || existingPatient.rows[0].name, 
       age || existingPatient.rows[0].age, 
       disease || existingPatient.rows[0].disease, 
       id, 
       userId]
    );

    res.json({
      message: 'Patient updated successfully',
      patient: updatedPatient.rows[0]
    });
  } catch (error) {
    console.error('Update patient error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a patient
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user.id;

    // Check if patient exists and belongs to the user
    const existingPatient = await pool.query(
      'SELECT * FROM patients WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingPatient.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Delete related mappings first
    await pool.query('DELETE FROM patient_doctor WHERE patient_id = $1', [id]);

    // Delete patient
    await pool.query('DELETE FROM patients WHERE id = $1 AND user_id = $2', [id, userId]);

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Delete patient error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
};
