const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, 'src', 'assets');
const PUBLIC_DIR = path.join(__dirname, 'public');
const SRC_DIR = path.join(__dirname, 'src');

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const newPath = fullPath.replace(new RegExp(`${ext}$`, 'i'), '.webp');
        try {
          await sharp(fullPath).webp({ quality: 80 }).toFile(newPath);
          fs.unlinkSync(fullPath);
          console.log(`Converted: ${fullPath} -> ${newPath}`);
        } catch (err) {
          console.error(`Error converting ${fullPath}:`, err);
        }
      }
    }
  }
}

function updateReferences(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      updateReferences(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.jsx', '.js', '.css', '.html'].includes(ext)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let newContent = content.replace(/\.(png|jpe?g)(['"])/gi, '.webp$2');
        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log(`Updated references in: ${fullPath}`);
        }
      }
    }
  }
}

async function run() {
  console.log('Optimizing images...');
  await processDirectory(ASSETS_DIR);
  await processDirectory(PUBLIC_DIR);
  
  console.log('Updating code references...');
  updateReferences(SRC_DIR);
  updateReferences(path.join(__dirname, 'index.html'));
  
  // Update vite config or other files if needed, but they rarely have direct image refs
  console.log('Done!');
}

run();
