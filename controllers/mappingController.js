const pool = require('../config/db');

// Create a new patient-doctor mapping
const createMapping = async (req, res) => {
  try {
    const { patient_id, doctor_id } = req.body;

    // Validate input
    if (!patient_id || !doctor_id) {
      return res.status(400).json({ message: 'Please provide patient_id and doctor_id' });
    }

    // Check if patient exists
    const patient = await pool.query('SELECT * FROM patients WHERE id = $1', [patient_id]);
    if (patient.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if doctor exists
    const doctor = await pool.query('SELECT * FROM doctors WHERE id = $1', [doctor_id]);
    if (doctor.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if mapping already exists
    const existingMapping = await pool.query(
      'SELECT * FROM patient_doctor WHERE patient_id = $1 AND doctor_id = $2',
      [patient_id, doctor_id]
    );
    if (existingMapping.rows.length > 0) {
      return res.status(400).json({ message: 'Mapping already exists between this patient and doctor' });
    }

    // Create mapping
    const newMapping = await pool.query(
      'INSERT INTO patient_doctor (patient_id, doctor_id) VALUES ($1, $2) RETURNING *',
      [patient_id, doctor_id]
    );

    res.status(201).json({
      message: 'Patient-Doctor mapping created successfully',
      mapping: newMapping.rows[0]
    });
  } catch (error) {
    console.error('Create mapping error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all patient-doctor mappings
const getMappings = async (req, res) => {
  try {
    const mappings = await pool.query(`
      SELECT 
        pd.id,
        pd.patient_id,
        pd.doctor_id,
        p.name AS patient_name,
        p.age AS patient_age,
        p.disease AS patient_disease,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization
      FROM patient_doctor pd
      JOIN patients p ON pd.patient_id = p.id
      JOIN doctors d ON pd.doctor_id = d.id
      ORDER BY pd.id DESC
    `);

    res.json({
      message: 'Mappings retrieved successfully',
      mappings: mappings.rows
    });
  } catch (error) {
    console.error('Get mappings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get mappings for a specific patient
const getMappingsByPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;

    // Check if patient exists
    const patient = await pool.query('SELECT * FROM patients WHERE id = $1', [patient_id]);
    if (patient.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const mappings = await pool.query(`
      SELECT 
        pd.id,
        pd.patient_id,
        pd.doctor_id,
        p.name AS patient_name,
        p.age AS patient_age,
        p.disease AS patient_disease,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization
      FROM patient_doctor pd
      JOIN patients p ON pd.patient_id = p.id
      JOIN doctors d ON pd.doctor_id = d.id
      WHERE pd.patient_id = $1
      ORDER BY pd.id DESC
    `, [patient_id]);

    res.json({
      message: 'Patient mappings retrieved successfully',
      mappings: mappings.rows
    });
  } catch (error) {
    console.error('Get patient mappings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a patient-doctor mapping
const deleteMapping = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if mapping exists
    const existingMapping = await pool.query('SELECT * FROM patient_doctor WHERE id = $1', [id]);
    if (existingMapping.rows.length === 0) {
      return res.status(404).json({ message: 'Mapping not found' });
    }

    // Delete mapping
    await pool.query('DELETE FROM patient_doctor WHERE id = $1', [id]);

    res.json({ message: 'Mapping deleted successfully' });
  } catch (error) {
    console.error('Delete mapping error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createMapping,
  getMappings,
  getMappingsByPatient,
  deleteMapping
};
