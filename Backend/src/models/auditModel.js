const { pool } = require('../config/db');

class AuditModel {
  // Create a new audit record
  async createAudit(auditData) {
    try {
      // Handle undefined values by replacing them with null
      const [result] = await pool.execute(
        `INSERT INTO audits (
          organization_name, industry_type, address, contact_person, 
          designation, contact_number, email, total_employees, 
          num_departments, num_branches, form_data, submission_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          auditData.organizationName || null,
          auditData.industryType || null,
          auditData.address || null,
          auditData.contactPerson || null,
          auditData.designation || null,
          auditData.contactNumber || null,
          auditData.email || null,
          auditData.totalEmployees || null,
          auditData.numDepartments || null,
          auditData.numBranches || null,
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

  // Get all audits with detailed data for export
  async getAllAuditsDetailed() {
    try {
      const [rows] = await pool.query(`
        SELECT 
          id, 
          organization_name, 
          industry_type, 
          address, 
          contact_person, 
          designation, 
          contact_number, 
          email, 
          total_employees, 
          num_departments, 
          num_branches, 
          submission_date,
          updated_at
        FROM audits 
        ORDER BY submission_date DESC
      `);
      
      return rows;
    } catch (error) {
      console.error('Error fetching detailed audits for export:', error);
      throw error;
    }
  }

  // Get audit by ID
  async getAuditById(id) {
    try {
      if (!id) {
        throw new Error('No ID provided');
      }
      
      console.log(`Fetching audit with ID: ${id}`);
      const [rows] = await pool.execute(
        'SELECT * FROM audits WHERE id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        console.log(`No audit found with ID: ${id}`);
        return null;
      }
      
      const audit = rows[0];
      console.log(`Found audit with ID: ${id}, parsing form_data...`);
      
      // Safely parse the JSON data
      if (audit.form_data) {
        try {
          // If form_data is already an object, no need to parse
          if (typeof audit.form_data === 'object' && audit.form_data !== null) {
            console.log('form_data is already an object');
            audit.formData = audit.form_data;
          } 
          // If it's a string, parse it
          else if (typeof audit.form_data === 'string') {
            console.log('form_data is a string, parsing...');
            audit.formData = JSON.parse(audit.form_data);
          }
        } catch (jsonError) {
          console.error(`Error parsing form_data for audit ID: ${id}:`, jsonError);
          // Set to empty object to prevent client-side errors
          audit.formData = {};
        }
      } else {
        console.log(`form_data is null/undefined for audit ID: ${id}`);
        audit.formData = {};
      }
      
      console.log(`Successfully processed audit ID: ${id}`);
      return audit;
    } catch (error) {
      console.error(`Error fetching audit by ID: ${id}:`, error);
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
          auditData.organizationName || null,
          auditData.industryType || null,
          auditData.address || null,
          auditData.contactPerson || null,
          auditData.designation || null,
          auditData.contactNumber || null,
          auditData.email || null,
          auditData.totalEmployees || null,
          auditData.numDepartments || null,
          auditData.numBranches || null,
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
      if (!id) {
        throw new Error('No ID provided for deletion');
      }
      
      console.log(`Executing DELETE query for audit ID: ${id}`);
      
      // First verify if the record exists
      const [checkRows] = await pool.execute(
        'SELECT id FROM audits WHERE id = ?',
        [id]
      );
      
      if (checkRows.length === 0) {
        console.log(`Audit with ID ${id} not found in database`);
        return { affected: 0, message: 'Record not found' };
      }
      
      // Proceed with deletion
      const [result] = await pool.execute(
        'DELETE FROM audits WHERE id = ?',
        [id]
      );
      
      console.log(`Delete result: ${result.affectedRows} row(s) affected`);
      
      return { affected: result.affectedRows };
    } catch (error) {
      console.error(`Error in deleteAudit model for ID ${id}:`, error);
      throw error;
    }
  }

  // Check if audits table exists and create it if not
  async checkTable() {
    try {
      console.log('Checking if audits table exists...');
      
      // Check if table exists
      const [tables] = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = 'audits'
      `);
      
      if (tables.length === 0) {
        console.log('Audits table does not exist, creating...');
        
        // Create table
        await pool.query(`
          CREATE TABLE audits (
            id INT AUTO_INCREMENT PRIMARY KEY,
            organization_name VARCHAR(255) NOT NULL,
            industry_type VARCHAR(100),
            address TEXT,
            contact_person VARCHAR(255) NOT NULL,
            designation VARCHAR(100),
            contact_number VARCHAR(50) NOT NULL,
            email VARCHAR(255) NOT NULL,
            total_employees INT,
            num_departments INT,
            num_branches INT,
            form_data JSON,
            submission_date DATETIME NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);
        
        console.log('Audits table created successfully');
        return { success: true, message: 'Table created' };
      }
      
      console.log('Audits table exists');
      return { success: true, message: 'Table exists' };
    } catch (error) {
      console.error('Error checking/creating audits table:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new AuditModel(); 