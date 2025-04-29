const express = require('express');
const { body } = require('express-validator');
const auditController = require('../controllers/auditController');

const router = express.Router();

// Validation middleware
const validateAuditInput = [
  body('organizationName').notEmpty().withMessage('Organization name is required'),
  body('contactPerson').notEmpty().withMessage('Contact person is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('contactNumber').notEmpty().withMessage('Contact number is required')
];

// Create a new audit
router.post('/', validateAuditInput, auditController.createAudit);

// Get all audits
router.get('/', auditController.getAllAudits);

// Get a single audit by ID
router.get('/:id', auditController.getAuditById);

// Update an audit
router.put('/:id', validateAuditInput, auditController.updateAudit);

// Delete an audit
router.delete('/:id', auditController.deleteAudit);

module.exports = router; 