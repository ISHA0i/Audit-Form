import React, { useState } from "react";
import "./CybersecurityAuditForm.css";

const CybersecurityAuditForm = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="container">
      <h2>Cybersecurity Audit Form</h2>

      {/* Section 1: Organization Details */}
      <div className="section">
        <h3>SECTION 1: ORGANIZATION DETAILS</h3>
        <div className="form-group">
          <label>Organization Name:</label>
          <input type="text" name="organizationName" className="input" onChange={handleChange} />
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
          <input type="text" name="address" className="input" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Contact Person:</label>
          <input type="text" name="contactPerson" className="input" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Designation:</label>
          <input type="text" name="designation" className="input" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Contact Number:</label>
          <input type="text" name="contactNumber" className="input" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" className="input" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Total Number of Employees:</label>
          <input type="number" name="totalEmployees" className="input" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Number of Departments:</label>
          <input type="number" name="numDepartments" className="input" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Number of Branches (if any):</label>
          <input type="number" name="numBranches" className="input" onChange={handleChange} />
        </div>
      </div>

      {/* Section 2: IT Infrastructure */}
      <div className="section">
        <h3>SECTION 2: IT INFRASTRUCTURE</h3>
        <div className="form-group">
          <label>Total Number of Computers (Desktops/Laptops):</label>
          <input type="number" name="totalComputers" className="input" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Operating Systems Used:</label>
          <div className="checkbox-group">
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
          <div className="checkbox-group">
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
      <div className="section">
        <h3>SECTION 3: SOFTWARE & APPLICATION SECURITY</h3>
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

      {/* Section 4: Network Security */}
      <div className="section">
        <h3>SECTION 4: NETWORK SECURITY</h3>
        <div className="form-group">
          <label>Do you have separate networks for guest & business use?</label>
          <div className="radio-group">
            <label><input type="radio" name="separateNetworks" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="separateNetworks" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Is your Wi-Fi network encrypted & secured?</label>
          <div className="radio-group">
            <label><input type="radio" name="wifiSecured" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="wifiSecured" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Type of Encryption Used:</label>
          <div className="radio-group">
            <label><input type="radio" name="encryptionType" value="WPA2" onChange={handleChange} /> WPA2</label>
            <label><input type="radio" name="encryptionType" value="WPA3" onChange={handleChange} /> WPA3</label>
            <label><input type="radio" name="encryptionType" value="WEP" onChange={handleChange} /> WEP</label>
            <label>
              <input type="radio" name="encryptionType" value="Other" onChange={handleChange} /> Other:
              <input type="text" name="encryptionOther" className="others" onChange={handleChange} />
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Do you have Intrusion Detection/Prevention Systems (IDS/IPS)?</label>
          <div className="radio-group">
            <label><input type="radio" name="idsIps" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="idsIps" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Are employees allowed to use personal devices on the business network?</label>
          <div className="radio-group">
            <label><input type="radio" name="personalDevicesAllowed" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="personalDevicesAllowed" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
      </div>

      {/* Section 5: Data Security & Backup */}
      <div className="section">
        <h3>SECTION 5: DATA SECURITY & BACKUP</h3>
        <div className="form-group">
          <label>Do you store sensitive customer/patient/employee data?</label>
          <div className="radio-group">
            <label><input type="radio" name="storeSensitiveData" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="storeSensitiveData" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Where is the data stored?</label>
          <div className="radio-group">
            <label><input type="radio" name="dataStorage" value="Local Server" onChange={handleChange} /> Local Server</label>
            <label><input type="radio" name="dataStorage" value="Cloud" onChange={handleChange} /> Cloud</label>
            <label><input type="radio" name="dataStorage" value="Hybrid" onChange={handleChange} /> Hybrid</label>
          </div>
        </div>
        <div className="form-group">
          <label>Do you have a data backup policy?</label>
          <div className="radio-group">
            <label><input type="radio" name="backupPolicy" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="backupPolicy" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>How frequently is data backed up?</label>
          <div className="radio-group">
            <label><input type="radio" name="backupFrequency" value="Daily" onChange={handleChange} /> Daily</label>
            <label><input type="radio" name="backupFrequency" value="Weekly" onChange={handleChange} /> Weekly</label>
            <label><input type="radio" name="backupFrequency" value="Monthly" onChange={handleChange} /> Monthly</label>
            <label>
              <input type="radio" name="backupFrequency" value="Other" onChange={handleChange} /> Other:
              <input type="text" name="backupOther" className="others" onChange={handleChange} />
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Is backup data encrypted?</label>
          <div className="radio-group">
            <label><input type="radio" name="backupEncrypted" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="backupEncrypted" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Do you have a Disaster Recovery Plan (DRP)?</label>
          <div className="radio-group">
            <label><input type="radio" name="drp" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="drp" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
      </div>

      {/* Section 6: User Access & Identity Management */}
      <div className="section">
        <h3>SECTION 6: USER ACCESS & IDENTITY MANAGEMENT</h3>
        <div className="form-group">
          <label>Do employees use unique login credentials?</label>
          <div className="radio-group">
            <label><input type="radio" name="uniqueLogin" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="uniqueLogin" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Is Multi-Factor Authentication (MFA) enabled?</label>
          <div className="radio-group">
            <label><input type="radio" name="mfaEnabled" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="mfaEnabled" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Are inactive user accounts regularly reviewed & removed?</label>
          <div className="radio-group">
            <label><input type="radio" name="inactiveAccountsReviewed" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="inactiveAccountsReviewed" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Do you have a password policy in place?</label>
          <div className="radio-group">
            <label><input type="radio" name="passwordPolicy" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="passwordPolicy" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Minimum password length required:</label>
          <input type="number" name="passwordLength" onChange={handleChange} className="others" /> characters
        </div>
        <div className="form-group">
          <label>Are privileged accounts monitored?</label>
          <div className="radio-group">
            <label><input type="radio" name="privilegedAccountsMonitored" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="privilegedAccountsMonitored" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
      </div>

      {/* Section 7: Incident Response & Cybersecurity Awareness */}
      <div className="section">
        <h3>SECTION 7: INCIDENT RESPONSE & CYBERSECURITY AWARENESS</h3>
        <div className="form-group">
          <label>Do you have an incident response plan?</label>
          <div className="radio-group">
            <label><input type="radio" name="incidentResponsePlan" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="incidentResponsePlan" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Have you faced any cybersecurity incidents in the last year?</label>
          <div className="radio-group">
            <label><input type="radio" name="cyberIncidents" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="cyberIncidents" value="No" onChange={handleChange} /> No</label>
          </div>
          <label> If yes, please provide details:</label>
          <textarea name="incidentDetails" onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Do you conduct cybersecurity awareness training for employees?</label>
          <div className="radio-group">
            <label><input type="radio" name="cyberTraining" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="cyberTraining" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Frequency of cybersecurity training:</label>
          <div className="radio-group">
            <label><input type="radio" name="training" value="Monthly" onChange={handleChange} /> Monthly</label>
            <label><input type="radio" name="training" value="Quatarly" onChange={handleChange} /> Quatarly</label>
            <label><input type="radio" name="training" value="Annually" onChange={handleChange} /> Annually</label>
          </div>
        </div>
      </div>

      {/* Section 8: Physical Security & Third-Party Vendors */}
      <div className="section">
        <h3>SECTION 8: PHYSICAL SECURITY & THIRD-PARTY VENDORS</h3>
        <div className="form-group">
          <label>Do you use CCTV surveillance in critical areas?</label>
          <div className="radio-group">
            <label><input type="radio" name="cctvSurveillance" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="cctvSurveillance" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Do you have biometric/card-based access control?</label>
          <div className="radio-group">
            <label><input type="radio" name="accessControl" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="accessControl" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Are visitor logs maintained?</label>
          <div className="radio-group">
            <label><input type="radio" name="visitorLogs" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="visitorLogs" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Do you work with third-party vendors handling sensitive data?</label>
          <div className="radio-group">
            <label><input type="radio" name="thirdPartyVendors" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="thirdPartyVendors" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
        <div className="form-group">
          <label>Do vendors undergo security assessments?</label>
          <div className="radio-group">
            <label><input type="radio" name="vendorAssessments" value="Yes" onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="vendorAssessments" value="No" onChange={handleChange} /> No</label>
          </div>
        </div>
      </div>

      {/* Declaration & Signature */}
      <div className="section">
        <h3>DECLARATION & SIGNATURE</h3>
        <div className="form-group">
          <h4>I, </h4>
          <input type="text" name="declarerName" onChange={handleChange} placeholder="Name" className="name" />
          <h4> (Designation: </h4>
          <input type="text" name="designation" onChange={handleChange} placeholder="Designation" className="name" />
          <label>)confirm that the information provided above is accurate to the best of my knowledge.</label>
        </div>
        <div className="form-group">
          <label>Signature:</label>
          <input type="text" name="signature" onChange={handleChange} placeholder="Your Signature" className="input"/>
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="date" onChange={handleChange} />
        </div>
      </div>
      {/* For Internal Use Only */}
      <div className="section">
        <h3>FOR INTERNAL USE ONLY</h3>
        <div className="form-group">
          <label>Auditor Name:</label>
          <input type="text" name="auditorName" onChange={handleChange} placeholder="Auditor Name"  className="input"/>
        </div>
        <div className="form-group">
          <label>Audit Date:</label>
          <input type="date" name="auditDate" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Remarks:</label>
          <textarea name="remarks" onChange={handleChange} placeholder="Remarks"></textarea>
        </div>
      </div>

      <button className="submit-button">SUBMIT</button>
      <p className="footer-text">For any queries, contact us at: contact@endsecure.in | www.endsecure.in</p>
    </div>
  );
};

export default CybersecurityAuditForm;
