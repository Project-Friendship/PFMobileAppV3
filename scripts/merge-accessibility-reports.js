// simple script to combine all axe-core accessibility reports
// made by me to test merging reports together

const fs = require('fs');
const path = require('path');

// where all the json reports are saved
const reportsDir = path.join(process.cwd(), 'test-results', 'accessibility-reports');
const summaryPath = path.join(reportsDir, 'summary-report.json');

// make sure the folder exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// get all json files except the summary
const reportFiles = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json') && f !== 'summary-report.json');

let allResults = [];

for (const file of reportFiles) {
  const filePath = path.join(reportsDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    allResults.push({
      file,
      violations: data.violations ? data.violations.length : 0,
    });
  } catch (err) {
    console.log('Error reading file:', file, err.message);
  }
}

// save everything in one summary file
fs.writeFileSync(summaryPath, JSON.stringify(allResults, null, 2));

console.log('Merged reports saved to:', summaryPath);
