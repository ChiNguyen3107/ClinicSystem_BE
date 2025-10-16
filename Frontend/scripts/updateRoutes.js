import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the router file
const routerPath = path.join(__dirname, '../src/router/index.tsx');
let content = fs.readFileSync(routerPath, 'utf8');

// Replace all Suspense with OptimizedSuspense and LoadingSpinner with OptimizedLoadingSpinner
content = content.replace(
  /<Suspense fallback={<LoadingSpinner \/>}>/g,
  '<OptimizedSuspense fallback={<OptimizedLoadingSpinner />}>'
);

content = content.replace(
  /<\/Suspense>/g,
  '</OptimizedSuspense>'
);

// Write back the updated content
fs.writeFileSync(routerPath, content);

console.log('Routes updated successfully!');
