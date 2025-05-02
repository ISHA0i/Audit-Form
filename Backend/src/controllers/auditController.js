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