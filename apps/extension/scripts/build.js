const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../src');
const distBase = path.resolve(__dirname, '../dist');

function buildTarget(target) {
  const outDir = path.join(distBase, target);
  fs.mkdirSync(outDir, { recursive: true });

  // Copy HTML files
  ['blocked.html', 'popup.html'].forEach((f) => {
    fs.copyFileSync(path.join(srcDir, f), path.join(outDir, f));
  });

  // Copy manifest
  fs.copyFileSync(path.join(srcDir, 'manifest.json'), path.join(outDir, 'manifest.json'));

  // Compile TS files to JS directly
  ['background.js', 'popup.js'].forEach((f) => {
    const jsPath = path.join(distBase, f);
    if (fs.existsSync(jsPath)) {
      fs.copyFileSync(jsPath, path.join(outDir, f));
    }
  });

  console.log(`[EXTENSION] Built ${target} extension bundle at: ${outDir}`);
}

const target = process.argv[2] || 'all';
if (target === 'all') {
  buildTarget('chrome');
  buildTarget('firefox');
  buildTarget('edge');
} else {
  buildTarget(target);
}
