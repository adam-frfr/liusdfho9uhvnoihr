const fs = require('fs');

const file = 'src/data/menuData.js';
let content = fs.readFileSync(file, 'utf8');

const sUrl = "https://xrcypnyewxnsnjwsixot.supabase.co/storage/v1/object/public/product-images";

// We want to replace lines like: import brownie_new from '../assets/brownies/brownie.webp';
// with: const brownie_new = `https://.../brownies/brownie.webp`;

const importRegex = /import\s+([a-zA-Z0-9_]+)\s+from\s+['"]\.\.\/assets\/([^'"]+)['"];/g;

content = content.replace(importRegex, (match, varName, assetPath) => {
  // Fix spaces in the URL
  const publicPath = assetPath.replace(/ /g, '-').toLowerCase();
  return `const ${varName} = "${sUrl}/${publicPath}";`;
});

fs.writeFileSync(file, content, 'utf8');
console.log('menuData.js updated.');
