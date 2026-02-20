import type { Report } from '../backend';

export function formatComplaintEmail(report: Report): string {
  const date = new Date(Number(report.createdAt) / 1000000);
  
  let body = `COMPLAINT REGARDING PHARMACIST ABSENCE / PHARMACY OPERATIONS\n\n`;
  body += `Date of Observation: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}\n\n`;
  
  body += `PHARMACY DETAILS:\n`;
  body += `Name: ${report.pharmacy.name}\n`;
  body += `Address: ${report.pharmacy.address}\n`;
  body += `State: ${report.pharmacy.state}\n`;
  if (report.pharmacy.licenseNumber) {
    body += `License Number: ${report.pharmacy.licenseNumber}\n`;
  }
  body += `GPS Coordinates: ${report.pharmacy.gpsCoordinates[0]}, ${report.pharmacy.gpsCoordinates[1]}\n\n`;
  
  body += `PHARMACIST DETAILS:\n`;
  body += `Name: ${report.pharmacist.name || 'Not available'}\n`;
  body += `Registration Number: ${report.pharmacist.registrationNumber || 'Not available'}\n`;
  body += `State of Registration: ${report.pharmacist.state}\n\n`;
  
  body += `OBSERVATIONS:\n`;
  body += `Presence Answers: ${report.observation.presenceAnswers.join(', ')}\n`;
  body += `Photos Attached: ${report.observation.photos.length}\n`;
  body += `GPS Location: ${report.observation.gps[0]}, ${report.observation.gps[1]}\n\n`;
  
  body += `ISSUES REPORTED:\n`;
  report.issues.forEach((issue) => {
    if (typeof issue === 'object' && '__kind__' in issue) {
      if (issue.__kind__ === 'pharmacistAbsent') {
        body += `- Pharmacist Absent\n`;
      } else if (issue.__kind__ === 'detailsNotDisplayed') {
        body += `- Pharmacist Details Not Displayed\n`;
      } else if (issue.__kind__ === 'suspectedFake') {
        body += `- Suspected Fake Pharmacist\n`;
      } else if (issue.__kind__ === 'other') {
        body += `- Other: ${issue.other}\n`;
      }
    }
  });
  body += `\n`;
  
  if (report.user) {
    body += `REPORTER CONTACT DETAILS:\n`;
    body += `Name: ${report.user.name}\n`;
    if (report.user.phone) {
      body += `Phone: ${report.user.phone}\n`;
    }
    if (report.user.email) {
      body += `Email: ${report.user.email}\n`;
    }
    body += `\n`;
  }
  
  body += `This complaint was generated using the Know Your Pharmacy app.\n`;
  body += `The information provided is based on citizen observation and should be verified by the appropriate authorities.\n`;
  
  return body;
}
