// One-off build helper: replace Material Symbols icon-font spans with inline SVGs.
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const svgDir = path.join(__dirname, '..', 'node_modules', '@material-symbols', 'svg-400', 'outlined');

let html = fs.readFileSync(htmlPath, 'utf8');

function pathFor(name) {
  const file = path.join(svgDir, name + '.svg');
  const svg = fs.readFileSync(file, 'utf8');
  const m = svg.match(/<path d="([^"]+)"/);
  if (!m) throw new Error('No path in ' + name);
  return m[1];
}

const re = /<span([^>]*?)class="material-symbols-outlined([^"]*)"([^>]*?)>\s*([a-z_]+)\s*<\/span>/g;
let count = 0;
html = html.replace(re, (full, pre, extra, post, name) => {
  count++;
  const d = pathFor(name);
  const attrs = (pre + post).trim();
  const attrStr = attrs ? ' ' + attrs : '';
  return `<svg${attrStr} class="ms-icon${extra}" viewBox="0 -960 960 960" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
});

fs.writeFileSync(htmlPath, html);
console.log('Replaced ' + count + ' icon spans with inline SVG.');
