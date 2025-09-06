const express = require('express');
const router = express.Router();
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');

// @route   POST /api/doctors
// @desc    Create a new doctor
// @access  Public
router.post('/', createDoctor);

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', getDoctors);

// @route   GET /api/doctors/:id
// @desc    Get a single doctor by ID
// @access  Public
router.get('/:id', getDoctorById);

// @route   PUT /api/doctors/:id
// @desc    Update a doctor
// @access  Public
router.put('/:id', updateDoctor);

// @route   DELETE /api/doctors/:id
// @desc    Delete a doctor
// @access  Public
router.delete('/:id', deleteDoctor);

module.exports = router;
