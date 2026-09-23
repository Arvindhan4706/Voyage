const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace extreme colors with softer ones
  content = content.replace(/#fcfcfc/g, '#faf9f6');
  content = content.replace(/#0a0a0a/g, '#18181b');
  content = content.replace(/#1a1a1a/g, '#2a2a2a');
  content = content.replace(/#111111/g, '#222222');

  fs.writeFileSync(filePath, content);
}
console.log("Colors softened.");
