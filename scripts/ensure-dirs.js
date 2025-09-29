import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ensureDirs = async () => {
  const buildDir = join(__dirname, '..', 'public', 'build');
  const sharedDir = join(buildDir, '_shared');
  
  try {
    await mkdir(sharedDir, { recursive: true });
    console.log('Ensured build directories exist');
  } catch (error) {
    console.error('Error creating build directories:', error);
    process.exit(1);
  }
};

ensureDirs();
