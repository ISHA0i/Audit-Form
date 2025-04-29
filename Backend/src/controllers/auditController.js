const auditModel = require('../models/auditModel');
const { validationResult } = require('express-validator');

// Controller methods for audit operations
const auditController = {
  // Create a new audit
  createAudit: async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array(),
          message: 'Validation failed' 
        });
      }
      
      console.log('Received form data:', req.body);
      
      // Check for required fields
      const requiredFields = ['organizationName', 'contactPerson', 'email', 'contactNumber'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }
      
      const result = await auditModel.createAudit(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Audit created successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in createAudit controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create audit',
        error: error.message
      });
    }
  },

  // Get all audits
  getAllAudits: async (req, res) => {
    try {
      const audits = await auditModel.getAllAudits();
      
      res.status(200).json({
        success: true,
        count: audits.length,
        data: audits
      });
    } catch (error) {
      console.error('Error in getAllAudits controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch audits',
        error: error.message
      });
    }
  },

  // Get audit by ID
  getAuditById: async (req, res) => {
    try {
      const audit = await auditModel.getAuditById(req.params.id);
      
      if (!audit) {
        return res.status(404).json({
          success: false,
          message: 'Audit not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: audit
      });
    } catch (error) {
      console.error('Error in getAuditById controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch audit',
        error: error.message
      });
    }
  },

  // Update audit
  updateAudit: async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      // Check if audit exists
      const audit = await auditModel.getAuditById(req.params.id);
      if (!audit) {
        return res.status(404).json({
          success: false,
          message: 'Audit not found'
        });
      }
      
      const result = await auditModel.updateAudit(req.params.id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Audit updated successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in updateAudit controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update audit',
        error: error.message
      });
    }
  },

  // Delete audit
  deleteAudit: async (req, res) => {
    try {
      // Check if audit exists
      const audit = await auditModel.getAuditById(req.params.id);
      if (!audit) {
        return res.status(404).json({
          success: false,
          message: 'Audit not found'
        });
      }
      
      await auditModel.deleteAudit(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Audit deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteAudit controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete audit',
        error: error.message
      });
    }
  }
};

module.exports = auditController; 