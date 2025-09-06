const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createMapping,
  getMappings,
  getMappingsByPatient,
  deleteMapping
} = require('../controllers/mappingController');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// @route   POST /api/mappings
// @desc    Create a new patient-doctor mapping
// @access  Private
router.post('/', createMapping);

// @route   GET /api/mappings
// @desc    Get all patient-doctor mappings
// @access  Private
router.get('/', getMappings);

// @route   GET /api/mappings/:patient_id
// @desc    Get mappings for a specific patient
// @access  Private
router.get('/:patient_id', getMappingsByPatient);

// @route   DELETE /api/mappings/:id
// @desc    Delete a patient-doctor mapping
// @access  Private
router.delete('/:id', deleteMapping);

module.exports = router;
