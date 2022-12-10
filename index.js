const fs = require('fs');
const path = require('path');

// Replace `/path/to/vue/project` with the actual path to your Vue.js project
const projectPath = process.argv[2]
const baseURL = process.argv[3]
console.log(`🔎 Looking for .vue files in ${projectPath}, with a base URL of ${baseURL}`)


// Recursively get all the files in the project
const getFiles = dir =>
  fs
    .readdirSync(dir)
    .reduce((files, file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        // If the file is a directory, recursively get the files in the directory
        return [...files, ...getFiles(fullPath)];
      } else {
        // Otherwise, add the file to the list
        return [...files, fullPath];
      }
    }, []);

// Get all the files in the project
const files = getFiles(projectPath);

// Filter out any files that are not part of the Vue.js project
const vueFiles = files.filter(file => file.endsWith('.vue'));

console.log(`🔢 Found ${vueFiles.length} routes`)

// Create the sitemap
const sitemap = vueFiles.map(file => {
  // Extract the component name from the file path
  const componentName = file.split('.')[0].replace(/[^ ]*pages/, '').replaceAll('\\', '/' ).replaceAll('index', '')
  // Use the component name as the URL
  return baseURL + componentName;
});

// Generate the XML for the sitemap
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

// Write the sitemap to a file
fs.writeFileSync('sitemap.xml', xml);
console.log(`🎉 Wrote sitemap.xml`)