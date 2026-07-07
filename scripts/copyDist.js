import fs from 'fs';
import path from 'path';

const src = path.resolve(process.cwd(), 'frontend', 'dist');
const dest = path.resolve(process.cwd(), 'backend', 'dist');

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.error(`Source not found: ${srcDir}`);
    process.exit(1);
  }
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyRecursive(src, dest);
  console.log(`Copied ${src} -> ${dest}`);
} catch (err) {
  console.error('Copy failed:', err);
  process.exit(1);
}
