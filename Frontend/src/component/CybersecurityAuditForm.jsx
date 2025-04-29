import React, { useState } from "react";
import "./CybersecurityAuditForm.css";
import Button from "./Button";
import Toast from "./Toast";
import LoadingIndicator from "./LoadingIndicator";
import api from "../utils/api";

const CybersecurityAuditForm = () => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: 'success', message: 'Form submitted successfully!' });
  const [currentSection, setCurrentSection] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const totalSections = 8;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateSection = () => {
    const errors = {};
    
    // Section 1 validation - Organization details
    if (currentSection === 1) {
      if (!formData.organizationName) errors.organizationName = 'Organization name is required';
      if (!formData.contactPerson) errors.contactPerson = 'Contact person is required';
      if (!formData.contactNumber) errors.contactNumber = 'Contact number is required';
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate current section before submission
    if (!validateSection()) {
      setToastMessage({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      setShowToast(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.submitAudit(formData);
      setToastMessage({
        type: 'success',
        message: 'Audit form submitted successfully!'
      });
      console.log("Submission successful:", response);
    } catch (error) {
      setToastMessage({
        type: 'error',
        message: `Submission failed: ${error.message}`
      });
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
      setShowToast(true);
    }
  };

  const nextSection = () => {
    if (validateSection()) {
      if (currentSection < totalSections) {
        setCurrentSection(currentSection + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setToastMessage({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      setShowToast(true);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderFormProgress = () => {
    return (
      <div className="form-progress">
        {Array.from({ length: totalSections }, (_, i) => (
          <div 
            key={i} 
            className={`progress-step ${i + 1 <= currentSection ? 'active' : ''}`}
            onClick={() => setCurrentSection(i + 1)}
          >
            <div className="step-number">{i + 1}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="audit-form-container fade-in">
      <form onSubmit={handleSubmit}>
        <h2>Cybersecurity Audit Form</h2>
        
        {renderFormProgress()}

        {/* Section 1: Organization Details */}
        <div className={`section ${currentSection === 1 ? 'active-section' : 'hidden-section'}`}>
          <h3>ORGANIZATION DETAILS</h3>
          <div className={`form-group ${formErrors.organizationName ? 'has-error' : ''}`}>
            <label>Organization Name: <span className="required">*</span></label>
            <input 
              type="text" 
              name="organizationName" 
              className="input" 
              onChange={handleChange}
              value={formData.organizationName || ''}
            />
            {formErrors.organizationName && <div className="error-message">{formErrors.organizationName}</div>}
          </div>

          <div className="form-group">
            <label>Industry Type:</label>
            <div className="check-group">
              <label><input type="checkbox" name="industryType" value="Hospital" onChange={handleChange} /> Hospital</label>
              <label><input type="checkbox" name="industryType" value="Manufacturing" onChange={handleChange} /> Manufacturing</label>
              <label><input type="checkbox" name="industryType" value="IT" onChange={handleChange} /> IT</label>
              <label>
                <input type="checkbox" name="industryType" value="Other" onChange={handleChange} /> Other:
                <input type="text" name="industryOther" className="others" onChange={handleChange} />
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input 
              type="text" 
              name="address" 
              className="input" 
              onChange={handleChange}
              value={formData.address || ''}
            />
          </div>

          <div className={`form-group ${formErrors.contactPerson ? 'has-error' : ''}`}>
            <label>Contact Person: <span className="required">*</span></label>
            <input 
              type="text" 
              name="contactPerson" 
              className="input" 
              onChange={handleChange}
              value={formData.contactPerson || ''}
            />
            {formErrors.contactPerson && <div className="error-message">{formErrors.contactPerson}</div>}
          </div>

          <div className="form-group">
            <label>Designation:</label>
            <input 
              type="text" 
              name="designation" 
              className="input" 
              onChange={handleChange}
              value={formData.designation || ''}
            />
          </div>

          <div className={`form-group ${formErrors.contactNumber ? 'has-error' : ''}`}>
            <label>Contact Number: <span className="required">*</span></label>
            <input 
              type="text" 
              name="contactNumber" 
              className="input" 
              onChange={handleChange}
              value={formData.contactNumber || ''}
            />
            {formErrors.contactNumber && <div className="error-message">{formErrors.contactNumber}</div>}
          </div>

          <div className={`form-group ${formErrors.email ? 'has-error' : ''}`}>
            <label>Email: <span className="required">*</span></label>
            <input 
              type="email" 
              name="email" 
              className="input" 
              onChange={handleChange}
              value={formData.email || ''}
            />
            {formErrors.email && <div className="error-message">{formErrors.email}</div>}
          </div>

          <div className="form-group">
            <label>Total Number of Employees:</label>
            <input 
              type="number" 
              name="totalEmployees" 
              className="input" 
              onChange={handleChange}
              value={formData.totalEmployees || ''}
            />
          </div>

          <div className="form-group">
            <label>Number of Departments:</label>
            <input 
              type="number" 
              name="numDepartments" 
              className="input" 
              onChange={handleChange}
              value={formData.numDepartments || ''}
            />
          </div>

          <div className="form-group">
            <label>Number of Branches (if any):</label>
            <input 
              type="number" 
              name="numBranches" 
              className="input" 
              onChange={handleChange}
              value={formData.numBranches || ''}
            />
          </div>
        </div>

        {/* Section 2: IT Infrastructure */}
        <div className={`section ${currentSection === 2 ? 'active-section' : 'hidden-section'}`}>
          <h3>IT INFRASTRUCTURE</h3>
          <div className="form-group">
            <label>Total Number of Computers:</label>
            <input 
              type="number" 
              name="totalComputers" 
              className="input" 
              onChange={handleChange}
              value={formData.totalComputers || ''}
            />
          </div>

          <div className="form-group">
            <label>Operating Systems Used:</label>
            <div className="check-group">
              <label><input type="checkbox" name="osWindows" onChange={handleChange} /> Windows</label>
              <label><input type="checkbox" name="osMac" onChange={handleChange} /> macOS</label>
              <label><input type="checkbox" name="osLinux" onChange={handleChange} /> Linux</label>
              <label>
                <input type="checkbox" name="osOther" onChange={handleChange} /> Other:
                <input type="text" name="osOtherDetails" className="others" onChange={handleChange} />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Number of Computers with Licensed OS:</label>
            <input type="number" name="licensedOS" className="input" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Number of Computers with Unlicensed OS:</label>
            <input type="number" name="unlicensedOS" className="input" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Number of Servers:</label>
            <input type="number" name="numServers" className="input" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Type of Servers:</label>
            <div className="check-group">
              <label><input type="checkbox" name="serverOnPremises" onChange={handleChange} /> On-Premises</label>
              <label><input type="checkbox" name="serverCloud" onChange={handleChange} /> Cloud-Based</label>
              <label><input type="checkbox" name="serverHybrid" onChange={handleChange} /> Hybrid</label>
            </div>
          </div>

          <div className="form-group">
            <label>Total Number of Printers & Scanners:</label>
            <input type="number" name="numPrintersScanners" className="input" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Number of Mobile/Tablet Devices Used for Work:</label>
            <input type="number" name="numMobileDevices" className="input" onChange={handleChange} />
          </div>
        </div>

        {/* Section 3: Software & Application Security */}
        <div className={`section ${currentSection === 3 ? 'active-section' : 'hidden-section'}`}>
          <h3>SOFTWARE & APPLICATION SECURITY</h3>
          <div className="form-group">
            <label>List of Critical Software/Applications Used:</label>
            <textarea name="criticalSoftware" className="input" onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label>Do you use licensed software for business operations?</label>
            <div className="radio-group">
              <label><input type="radio" name="licensedSoftware" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="licensedSoftware" value="No" onChange={handleChange} /> No</label>
            </div>
          </div>
          <div className="form-group">
            <label>Is your antivirus/endpoint protection software up to date?</label>
            <div className="radio-group">
              <label><input type="radio" name="antivirusUpdated" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="antivirusUpdated" value="No" onChange={handleChange} /> No</label>
            </div>
          </div>
          <div className="form-group">
            <label>Do you use a firewall for network protection?</label>
            <div className="radio-group">
              <label><input type="radio" name="firewall" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="firewall" value="No" onChange={handleChange} /> No</label>
            </div>
          </div>
          <div className="form-group">
            <label>Do you have a centralized patch management system?</label>
            <div className="radio-group">
              <label><input type="radio" name="patchManagement" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="patchManagement" value="No" onChange={handleChange} /> No</label>
            </div>
          </div>
          <div className="form-group">
            <label>Are regular software updates applied?</label>
            <div className="radio-group">
              <label><input type="radio" name="softwareUpdates" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="softwareUpdates" value="No" onChange={handleChange} /> No</label>
            </div>
          </div>
        </div>

        {/* Sections 4-8 would go here with similar structure */}
        
        {/* Section 4: Network Security */}
        <div className={`section ${currentSection === 4 ? 'active-section' : 'hidden-section'}`}>
          <h3>NETWORK SECURITY</h3>
          <div className="form-group">
            <label>Do you have separate networks for guest & business use?</label>
            <div className="radio-group">
              <label><input type="radio" name="separateNetworks" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="separateNetworks" value="No" onChange={handleChange} /> No</label>
            </div>
          </div>
          {/* More fields would go here */}
        </div>

        {/* Section 5: Data Security & Backup */}
        <div className={`section ${currentSection === 5 ? 'active-section' : 'hidden-section'}`}>
          <h3>DATA SECURITY & BACKUP</h3>
          <div className="form-group">
            <label>Do you store sensitive customer/patient/employee data?</label>
            <div className="radio-group">
              <label><input type="radio" name="storeSensitiveData" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="storeSensitiveData" value="No" onChange={handleChange} /> No</label>
            </div>
          </div>
          {/* More fields would go here */}
        </div>

        {/* Section 6: User Access & Identity Management */}
        <div className={`section ${currentSection === 6 ? 'active-section' : 'hidden-section'}`}>
          <h3>USER ACCESS & IDENTITY MANAGEMENT</h3>
          <div className="form-group">
            <label>Do employees use unique login credentials?</label>
            <div className="radio-group">
              <label><input type="radio" name="uniqueLogin" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="uniqueLogin" value="No" onChange={handleChange} /> No</label>
            </div>
          </div>
          {/* More fields would go here */}
        </div>

        {/* Section 7: Incident Response & Cybersecurity Awareness */}
        <div className={`section ${currentSection === 7 ? 'active-section' : 'hidden-section'}`}>
          <h3>INCIDENT RESPONSE & CYBERSECURITY AWARENESS</h3>
          <div className="form-group">
            <label>Do you have an incident response plan?</label>
            <div className="radio-group">
              <label><input type="radio" name="incidentResponsePlan" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="incidentResponsePlan" value="No" onChange={handleChange} /> No</label>
            </div>
          </div>
          {/* More fields would go here */}
        </div>

        {/* Section 8: Physical Security & Third-Party Vendors */}
        <div className={`section ${currentSection === 8 ? 'active-section' : 'hidden-section'}`}>
          <h3>PHYSICAL SECURITY & THIRD-PARTY VENDORS</h3>
          <div className="form-group">
            <label>Do you use CCTV surveillance in critical areas?</label>
            <div className="radio-group">
              <label><input type="radio" name="cctvSurveillance" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="cctvSurveillance" value="No" onChange={handleChange} /> No</label>
            </div>
          </div>
          {/* More fields would go here */}
          
          {/* Declaration & Signature */}
          <div className="form-group signature-section">
            <h4>Declaration</h4>
            <p>I confirm that the information provided above is accurate to the best of my knowledge.</p>
            <div className="signature-area">
              <div className="signature-field">
                <label>Name:</label>
                <input type="text" name="declarerName" onChange={handleChange} className="name" />
              </div>
              <div className="signature-field">
                <label>Designation:</label>
                <input type="text" name="designation" onChange={handleChange} className="name" />
              </div>
              <div className="signature-field">
                <label>Date:</label>
                <input type="date" name="date" onChange={handleChange} className="name" />
              </div>
            </div>
          </div>
        </div>

        <div className="form-navigation">
          {currentSection > 1 && (
            <Button 
              variant="outlined" 
              onClick={prevSection} 
              type="button"
            >
              Previous
            </Button>
          )}
          
          {currentSection < totalSections ? (
            <Button 
              variant="primary" 
              onClick={nextSection} 
              type="button"
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Audit Form'}
            </Button>
          )}
        </div>
      </form>

      {isSubmitting && <div className="overlay"><LoadingIndicator size="large" /></div>}
      
      {showToast && (
        <Toast 
          type={toastMessage.type} 
          message={toastMessage.message} 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
};

export default CybersecurityAuditForm;
