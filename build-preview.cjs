const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const mime = {'.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2','.webm':'video/webm','.mp4':'video/mp4'};
function embed(file) {
  const type = mime[path.extname(file)];
  assert(type, `Unknown asset type: ${file}`);
  return `data:${type};base64,${fs.readFileSync(path.join(__dirname,file)).toString('base64')}`;
}
const css = read('styles.css').replace(/url\(['"]?(assets\/[^)'"\s]+)['"]?\)/g, (_,file)=>`url("${embed(file)}")`);
let html = read('index.html')
  .replace('<link rel="stylesheet" href="styles.css">', () => `<style>${css}</style>`)
  .replace(/(data-webm|data-mp4|src|poster)="(assets\/[^"]+)"/g, (_,attribute,file)=>`${attribute}="${embed(file)}"`)
  .replace(/href="(assets\/[^"]+)"/g, (_,file)=>`href="${embed(file)}"`)
  .replace(/<script src="(materials|script)\.js"><\/script>/g, (_,name) => `<script>${read(name+'.js').replace(/<\/script/gi,'<\\/script')}</script>`);
html += `\n<!-- Bundled font licenses\n${read('assets/space-grotesk-OFL.txt')}\n${read('assets/barlow-condensed-OFL.txt')}\n-->\n`;
assert(!html.includes('href="styles.css"') && !html.includes('src="script.js"') && !html.includes('src="materials.js"'));
assert(!/(?:data-webm|data-mp4|src|poster)="assets\/|url\(['"]?assets\//.test(html), 'Every used asset must be embedded');
fs.writeFileSync(path.join(__dirname,'portfolio-preview.html'),html);
console.log(`Built offline preview (${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MB).`);
