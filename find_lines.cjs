const fs = require('fs');
const file = 'src/AdminApp.jsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

console.log('Searching for editing/product keywords:');
lines.forEach((line, idx) => {
  if (line.includes('edit') || line.includes('Product') || line.includes('product')) {
    if (line.includes('update') || line.includes('setEdit') || line.includes('state') || line.includes('Dialog') || line.includes('Modal') || line.includes('Form')) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
