const fs = require('fs');

const file = 'src/AdminApp.jsx';
let content = fs.readFileSync(file, 'utf8');

const sUrl = "https://xrcypnyewxnsnjwsixot.supabase.co/storage/v1/object/public/product-images";

const importRegex = /import\s+([a-zA-Z0-9_]+)\s+from\s+['"]\.\/assets\/([^'"]+)['"];/g;

// List of files we actually uploaded
const uploadedFiles = [
  'brownies', 'cake pops', 'cake sicles', 'minicakes', 'cakes', 'cupcakes', 
  'cupcake4.webp', 'roundcake1.webp', '1.webp'
];

content = content.replace(importRegex, (match, varName, assetPath) => {
  // Only replace if it matches what we uploaded
  const shouldReplace = uploadedFiles.some(prefix => assetPath.startsWith(prefix));
  if (shouldReplace) {
    const publicPath = assetPath.replace(/ /g, '-').toLowerCase();
    return `const ${varName} = "${sUrl}/${publicPath}";`;
  }
  return match;
});

fs.writeFileSync(file, content, 'utf8');
console.log('AdminApp.jsx updated.');
