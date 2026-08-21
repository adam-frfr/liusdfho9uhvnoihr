const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDirs = [
  path.join(__dirname, 'src', 'assets', 'cake sicles'),
  path.join(__dirname, 'src', 'assets')
];

async function convertImages() {
  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) continue;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const fullPath = path.join(dir, file);
        // Only process files, not directories
        if (fs.statSync(fullPath).isDirectory()) continue;

        const outPath = fullPath.replace(/\.(png|jpe?g)$/i, '.webp');
        
        console.log(`Converting ${file}...`);
        try {
          await sharp(fullPath)
            .webp({ quality: 85 })
            .toFile(outPath);
            
          console.log(`Successfully created ${path.basename(outPath)}`);
          fs.unlinkSync(fullPath);
          console.log(`Deleted original ${file}`);
        } catch (err) {
          console.error(`Failed to convert ${file}:`, err);
        }
      }
    }
  }
}

convertImages();
