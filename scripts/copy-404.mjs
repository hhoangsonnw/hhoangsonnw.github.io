import fs from 'node:fs/promises';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

try {
  await fs.copyFile(indexPath, notFoundPath);
  console.log('Created dist/404.html for static SPA fallback.');
} catch (error) {
  console.warn(`Skipped 404 fallback: ${error.message}`);
}
