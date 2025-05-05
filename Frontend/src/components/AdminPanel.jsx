import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './AdminPanel.css';
import Button from './Button';
import Toast from './Toast';
import LoadingIndicator from './LoadingIndicator';
import { FaEye, FaTrashAlt, FaEdit, FaDownload, FaSync } from 'react-icons/fa';

const AdminPanel = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [targetAuditId, setTargetAuditId] = useState(null);

  // Fetch audits on component mount
  useEffect(() => {
    fetchAudits();
  }, []);

  // Function to fetch all audits
  const fetchAudits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting to fetch audits...');
      const response = await api.getAudits();
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      console.log('Fetched audits successfully:', response.data.length);
      setAudits(response.data || []);
    } catch (err) {
      console.error('Error fetching audits:', err);
      setError('Failed to fetch audits: ' + (err.message || 'Unknown error'));
      showToast('Failed to fetch audits: ' + (err.message || 'Unknown error'), 'error');
      // Set to empty array to prevent undefined errors in rendering
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to download audits as XLSX
  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);
      await api.downloadAuditsXlsx();
      showToast('Excel file download started', 'success');
    } catch (err) {
      showToast('Failed to download Excel file: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setDownloadingExcel(false);
    }
  };

  // Function to prepare for deleting audit
  const confirmDelete = (id) => {
    setTargetAuditId(id);
    setShowDeleteConfirm(true);
  };

  // Function to handle audit deletion after confirmation
  const handleDelete = async () => {
    try {
      console.log('Attempting to delete audit with ID:', targetAuditId);
      
      if (!targetAuditId) {
        showToast('Delete failed: No audit ID specified', 'error');
        return;
      }
      
      const result = await api.deleteAudit(targetAuditId);
      console.log('Delete result:', result);
      
      // Refresh the list
      fetchAudits();
      showToast('Audit deleted successfully', 'success');
    } catch (err) {
      console.error('Delete error details:', err);
      showToast('Failed to delete audit: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setShowDeleteConfirm(false);
      setTargetAuditId(null);
    }
  };

  // Function to cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setTargetAuditId(null);
  };

  // Function to view audit details
  const handleViewDetails = async (id) => {
    try {
      const response = await api.getAuditById(id);
      setSelectedAudit(response.data);
      setShowDetailModal(true);
    } catch (err) {
      showToast('Failed to load audit details: ' + (err.message || 'Unknown error'), 'error');
    }
  };

  // Function to prepare edit form
  const handleEditInit = async (id) => {
    try {
      const response = await api.getAuditById(id);
      setSelectedAudit(response.data);
      // Set initial form data from the audit details
      setEditFormData({
        organizationName: response.data.organization_name,
        industryType: response.data.industry_type,
        address: response.data.address,
        contactPerson: response.data.contact_person,
        designation: response.data.designation,
        contactNumber: response.data.contact_number,
        email: response.data.email,
        totalEmployees: response.data.total_employees,
        numDepartments: response.data.num_departments,
        numBranches: response.data.num_branches,
      });
      setShowEditModal(true);
    } catch (err) {
      showToast('Failed to load audit for editing: ' + (err.message || 'Unknown error'), 'error');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Save edited audit
  const handleSaveEdit = async () => {
    try {
      await api.updateAudit(selectedAudit.id, editFormData);
      showToast('Audit updated successfully', 'success');
      // Refresh audits list
      fetchAudits();
      // Close modal
      setShowEditModal(false);
      setSelectedAudit(null);
      setEditFormData(null);
    } catch (err) {
      showToast('Failed to update audit: ' + (err.message || 'Unknown error'), 'error');
    }
  };

  // Close detail modal
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedAudit(null);
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedAudit(null);
    setEditFormData(null);
  };

  // Show toast message
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to render field value with fallback
  const renderValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Cybersecurity Audit Admin Panel</h1>
        <div className="admin-actions">
          <Button 
            onClick={handleDownloadExcel}
            disabled={downloadingExcel || audits.length === 0}
            className="icon-button download-button"
            title="Download Excel"
          >
            <FaDownload />
          </Button>
          <Button 
            onClick={fetchAudits}
            disabled={loading}
            className="icon-button refresh-button"
            title="Refresh"
          >
            <FaSync />
          </Button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <LoadingIndicator />
          <p>Loading audits...</p>
        </div>
      ) : audits.length > 0 ? (
        <div className="audits-table-container">
          <table className="audits-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Organization</th>
                <th>Industry</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Submission Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((audit) => (
                <tr key={audit.id}>
                  <td>{audit.id}</td>
                  <td>{audit.organization_name}</td>
                  <td>{audit.industry_type || 'N/A'}</td>
                  <td>{audit.contact_person}</td>
                  <td>{audit.email}</td>
                  <td>{formatDate(audit.submission_date)}</td>
                  <td className="action-buttons">
                    <Button
                      onClick={() => handleViewDetails(audit.id)}
                      className="icon-button view-button"
                      title="View Details"
                      aria-label="View audit details"
                      size="small"
                      variant="text"
                      style={{ 
                        width: '34px', 
                        height: '34px', 
                        minWidth: '34px', 
                        padding: '0',
                        margin: '0 2px',
                        borderRadius: '50%'
                      }}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      onClick={() => handleEditInit(audit.id)}
                      className="icon-button edit-button"
                      title="Edit Audit"
                      aria-label="Edit audit"
                      size="small"
                      variant="text"
                      style={{ 
                        width: '34px', 
                        height: '34px', 
                        minWidth: '34px', 
                        padding: '0',
                        margin: '0 2px',
                        borderRadius: '50%'
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      onClick={() => confirmDelete(audit.id)}
                      className="icon-button delete-button"
                      title="Delete Audit"
                      aria-label="Delete audit"
                      size="small"
                      variant="text"
                      style={{ 
                        width: '34px', 
                        height: '34px', 
                        minWidth: '34px', 
                        padding: '0',
                        margin: '0 2px',
                        borderRadius: '50%'
                      }}
                    >
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-audits">
          <p>No audit records found</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAudit && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedAudit.organization_name} - Audit Details</h2>
              <button className="modal-close" onClick={closeDetailModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="audit-detail-section">
                <h3>Organization Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">Organization Name:</div>
                    <div className="detail-value">{renderValue(selectedAudit.organization_name)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Industry Type:</div>
                    <div className="detail-value">{renderValue(selectedAudit.industry_type)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Address:</div>
                    <div className="detail-value">{renderValue(selectedAudit.address)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Total Employees:</div>
                    <div className="detail-value">{renderValue(selectedAudit.total_employees)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Number of Departments:</div>
                    <div className="detail-value">{renderValue(selectedAudit.num_departments)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Number of Branches:</div>
                    <div className="detail-value">{renderValue(selectedAudit.num_branches)}</div>
                  </div>
                </div>
              </div>

              <div className="audit-detail-section">
                <h3>Contact Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">Contact Person:</div>
                    <div className="detail-value">{renderValue(selectedAudit.contact_person)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Designation:</div>
                    <div className="detail-value">{renderValue(selectedAudit.designation)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Email:</div>
                    <div className="detail-value">{renderValue(selectedAudit.email)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Contact Number:</div>
                    <div className="detail-value">{renderValue(selectedAudit.contact_number)}</div>
                  </div>
                </div>
              </div>

              {/* Complete Form Data Section */}
              <div className="audit-detail-section">
                <h3>Complete Form Data</h3>
                <div className="complete-form-data">
                  {selectedAudit.formData && Object.entries(selectedAudit.formData).map(([key, value]) => (
                    <div className="detail-item" key={key}>
                      <div className="detail-label">{key}:</div>
                      <div className="detail-value">{renderValue(value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="audit-detail-section">
                <h3>Submission Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">Submission Date:</div>
                    <div className="detail-value">{formatDate(selectedAudit.submission_date)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Last Updated:</div>
                    <div className="detail-value">{formatDate(selectedAudit.updated_at)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button onClick={closeDetailModal}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAudit && editFormData && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Audit - {selectedAudit.organization_name}</h2>
              <button className="modal-close" onClick={closeEditModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="organizationName">Organization Name</label>
                  <input
                    type="text"
                    id="organizationName"
                    name="organizationName"
                    value={editFormData.organizationName || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="industryType">Industry Type</label>
                  <input
                    type="text"
                    id="industryType"
                    name="industryType"
                    value={editFormData.industryType || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={editFormData.address || ''}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactPerson">Contact Person</label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={editFormData.contactPerson || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="designation">Designation</label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={editFormData.designation || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactNumber">Contact Number</label>
                  <input
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    value={editFormData.contactNumber || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData.email || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="totalEmployees">Total Employees</label>
                  <input
                    type="number"
                    id="totalEmployees"
                    name="totalEmployees"
                    value={editFormData.totalEmployees || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="numDepartments">Number of Departments</label>
                  <input
                    type="number"
                    id="numDepartments"
                    name="numDepartments"
                    value={editFormData.numDepartments || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="numBranches">Number of Branches</label>
                  <input
                    type="number"
                    id="numBranches"
                    name="numBranches"
                    value={editFormData.numBranches || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button onClick={closeEditModal} className="cancel-button">Cancel</Button>
              <Button onClick={handleSaveEdit} className="save-button">Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this audit record? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <Button onClick={cancelDelete} className="cancel-button">Cancel</Button>
              <Button onClick={handleDelete} className="delete-confirm-button">Delete</Button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default AdminPanel;