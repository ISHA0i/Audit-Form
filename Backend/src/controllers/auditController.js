const auditModel = require('../models/auditModel');
const { validationResult } = require('express-validator');
const ExcelJS = require('exceljs');

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
      console.log(`GET request received for audit ID: ${req.params.id}`);
      
      if (!req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Audit ID is required'
        });
      }
      
      // Verify database connection first
      const { pool } = require('../config/db');
      if (!pool) {
        console.error('Database pool is not initialized');
        return res.status(500).json({
          success: false,
          message: 'Database connection is not available'
        });
      }
      
      // Try to get a connection from the pool
      let connection;
      try {
        connection = await pool.getConnection();
        console.log('Successfully got connection from pool');
      } catch (connError) {
        console.error('Failed to get connection from pool:', connError);
        return res.status(500).json({
          success: false,
          message: 'Failed to connect to database',
          error: connError.message
        });
      }
      
      try {
        const audit = await auditModel.getAuditById(req.params.id);
        
        if (!audit) {
          connection.release();
          return res.status(404).json({
            success: false,
            message: 'Audit not found'
          });
        }
        
        connection.release();
        res.status(200).json({
          success: true,
          data: audit
        });
      } catch (queryError) {
        if (connection) connection.release();
        throw queryError; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      console.error(`Error in getAuditById controller for ID ${req.params.id}:`, error);
      
      // Determine if it's a database connection issue
      const errorMessage = error.message || '';
      if (
        errorMessage.includes('ECONNREFUSED') || 
        errorMessage.includes('ER_ACCESS_DENIED_ERROR') ||
        errorMessage.includes('ER_BAD_DB_ERROR')
      ) {
        return res.status(500).json({
          success: false,
          message: 'Database connection error',
          details: 'There is a problem connecting to the database. Please check your database configuration.',
          error: error.message
        });
      }
      
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
      console.log(`DELETE request received for audit ID: ${req.params.id}`);
      
      if (!req.params.id) {
        console.log('No ID provided in delete request');
        return res.status(400).json({
          success: false,
          message: 'Audit ID is required'
        });
      }
      
      // Check if audit exists
      const audit = await auditModel.getAuditById(req.params.id);
      
      if (!audit) {
        console.log(`Audit with ID ${req.params.id} not found for deletion`);
        return res.status(404).json({
          success: false,
          message: 'Audit not found'
        });
      }
      
      console.log(`Deleting audit with ID: ${req.params.id}`);
      const result = await auditModel.deleteAudit(req.params.id);
      console.log('Delete result:', result);
      
      res.status(200).json({
        success: true,
        message: 'Audit deleted successfully'
      });
    } catch (error) {
      console.error(`Error in deleteAudit controller for ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete audit',
        error: error.message
      });
    }
  },

  // Download all audits as XLSX
  downloadAudits: async (req, res) => {
    try {
      // Get all detailed audit data
      const audits = await auditModel.getAllAuditsDetailed();
      
      if (!audits || audits.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No audit data found'
        });
      }
      
      // Create a new workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Cybersecurity Audits');
      
      // Define columns
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 5 },
        { header: 'Organization', key: 'organization_name', width: 30 },
        { header: 'Industry Type', key: 'industry_type', width: 20 },
        { header: 'Contact Person', key: 'contact_person', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'contact_number', width: 20 },
        { header: 'Address', key: 'address', width: 30 },
        { header: 'Total Employees', key: 'total_employees', width: 15 },
        { header: 'Departments', key: 'num_departments', width: 15 },
        { header: 'Branches', key: 'num_branches', width: 15 },
        { header: 'Submission Date', key: 'submission_date', width: 20 }
      ];
      
      // Style the header row
      worksheet.getRow(1).font = { bold: true, size: 12 };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      // Add rows
      audits.forEach(audit => {
        const rowData = {
          id: audit.id,
          organization_name: audit.organization_name,
          industry_type: audit.industry_type,
          contact_person: audit.contact_person,
          email: audit.email,
          contact_number: audit.contact_number,
          address: audit.address,
          total_employees: audit.total_employees,
          num_departments: audit.num_departments,
          num_branches: audit.num_branches,
          submission_date: audit.submission_date ? new Date(audit.submission_date).toLocaleString() : ''
        };
        worksheet.addRow(rowData);
      });
      
      // Format data
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber > 1) { // Skip header row
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        }
      });
      
      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=cybersecurity_audits.xlsx');
      
      // Write to response
      await workbook.xlsx.write(res);
      
      // End the response
      res.end();
      
    } catch (error) {
      console.error('Error in downloadAudits controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download audits',
        error: error.message
      });
    }
  }
};

module.exports = auditController; 