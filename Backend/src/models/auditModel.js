const { pool } = require('../config/db');

class AuditModel {
  // Create a new audit record
  async createAudit(auditData) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO audits (
          organization_name, industry_type, address, contact_person, 
          designation, contact_number, email, total_employees, 
          num_departments, num_branches, form_data, submission_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          auditData.organizationName,
          auditData.industryType,
          auditData.address,
          auditData.contactPerson,
          auditData.designation,
          auditData.contactNumber,
          auditData.email,
          auditData.totalEmployees,
          auditData.numDepartments,
          auditData.numBranches,
          JSON.stringify(auditData) // Store the entire form data as JSON
        ]
      );
      
      return { id: result.insertId };
    } catch (error) {
      console.error('Error creating audit:', error);
      throw error;
    }
  }

  // Get all audits
  async getAllAudits() {
    try {
      const [rows] = await pool.query(`
        SELECT id, organization_name, industry_type, contact_person, 
        email, submission_date FROM audits ORDER BY submission_date DESC
      `);
      
      return rows;
    } catch (error) {
      console.error('Error fetching audits:', error);
      throw error;
    }
  }

  // Get audit by ID
  async getAuditById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM audits WHERE id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      // Parse the JSON data
      const audit = rows[0];
      if (audit.form_data) {
        audit.formData = JSON.parse(audit.form_data);
      }
      
      return audit;
    } catch (error) {
      console.error('Error fetching audit by ID:', error);
      throw error;
    }
  }

  // Update audit
  async updateAudit(id, auditData) {
    try {
      const [result] = await pool.execute(
        `UPDATE audits SET 
          organization_name = ?, 
          industry_type = ?, 
          address = ?, 
          contact_person = ?, 
          designation = ?, 
          contact_number = ?, 
          email = ?, 
          total_employees = ?, 
          num_departments = ?, 
          num_branches = ?,
          form_data = ?
        WHERE id = ?`,
        [
          auditData.organizationName,
          auditData.industryType,
          auditData.address,
          auditData.contactPerson,
          auditData.designation,
          auditData.contactNumber,
          auditData.email,
          auditData.totalEmployees,
          auditData.numDepartments,
          auditData.numBranches,
          JSON.stringify(auditData),
          id
        ]
      );
      
      return { affected: result.affectedRows };
    } catch (error) {
      console.error('Error updating audit:', error);
      throw error;
    }
  }

  // Delete audit
  async deleteAudit(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM audits WHERE id = ?',
        [id]
      );
      
      return { affected: result.affectedRows };
    } catch (error) {
      console.error('Error deleting audit:', error);
      throw error;
    }
  }
}

module.exports = new AuditModel(); 