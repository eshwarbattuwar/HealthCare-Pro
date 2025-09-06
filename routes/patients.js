const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
} = require('../controllers/patientController');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// @route   POST /api/patients
// @desc    Create a new patient
// @access  Private
router.post('/', createPatient);

// @route   GET /api/patients
// @desc    Get all patients for authenticated user
// @access  Private
router.get('/', getPatients);

// @route   GET /api/patients/:id
// @desc    Get a single patient by ID
// @access  Private
router.get('/:id', getPatientById);

// @route   PUT /api/patients/:id
// @desc    Update a patient
// @access  Private
router.put('/:id', updatePatient);

// @route   DELETE /api/patients/:id
// @desc    Delete a patient
// @access  Private
router.delete('/:id', deletePatient);

module.exports = router;
