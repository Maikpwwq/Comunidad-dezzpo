import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.resolve(__dirname, '../pages');

function migrateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const propsRegex = /export const documentProps\s*=\s*({[\s\S]*?})/;
    const match = content.match(propsRegex);

    if (match) {
        // Extract the props object string
        let propsString = match[1];

        // Simple parsing to extract title and description safely 
        // (eval is dangerous but for this limited extracted string it might be okay-ish, but regex is safer)
        const titleMatch = propsString.match(/title:\s*['"](.*?)['"]/);
        const descMatch = propsString.match(/description:\s*['"](.*?)['"]/);

        const title = titleMatch ? titleMatch[1] : '';
        const description = descMatch ? descMatch[1] : '';

        if (!title && !description) {
            console.log(`Skipping ${filePath}: Could not extract title/description`);
            return;
        }

        const dir = path.dirname(filePath);
        const configPath = path.join(dir, '+config.ts');

        const configContent = `export default {
  title: '${title}',
  description: '${description}'
}
`;

        fs.writeFileSync(configPath, configContent);
        console.log(`Created ${configPath}`);

        // Remove the export block from content
        // This is a bit tricky to get the balanced braces, but given the structure is usually simple:
        // We find the start index, and then find the closing brace.

        // Alternative: use the matched string and replace it with empty type definition if needed or just empty
        // But we need to handle the semi-colon if present.

        // Let's try to replace the Match[0]
        const newContent = content.replace(match[0], '').replace(/^\s*[\r\n]/gm, ''); // remove empty lines potentially

        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${filePath}`);
    }
}

// Find all +Page.tsx files
const files = glob.sync('**/*+Page.tsx', { cwd: PAGES_DIR, absolute: true });

files.forEach(file => {
    // Skip if config already exists (optional check)
    if (file.includes('perfil')) return; // Already done
    migrateFile(file);
});
