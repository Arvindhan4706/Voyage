const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if we shouldn't touch it
  if (file === 'ThemeToggle.tsx' || file === 'ThemeProvider.tsx') continue;

  // Replace bg-[#fcfcfc] -> bg-[#fcfcfc] dark:bg-[#0a0a0a]
  content = content.replace(/bg-\[#fcfcfc\](?!(\/| dark:))/g, 'bg-[#fcfcfc] dark:bg-[#0a0a0a]');
  content = content.replace(/bg-\[#fcfcfc\]\/90(?! dark:)/g, 'bg-[#fcfcfc]/90 dark:bg-[#0a0a0a]/90');
  
  // Replace border-[#eaeaea] -> border-[#eaeaea] dark:border-[#333333]
  content = content.replace(/border-\[#eaeaea\](?! dark:)/g, 'border-[#eaeaea] dark:border-[#333333]');
  
  // Replace text-[#111111] -> text-[#111111] dark:text-[#fcfcfc]
  content = content.replace(/text-\[#111111\](?! dark:)/g, 'text-[#111111] dark:text-[#fcfcfc]');
  
  // Replace text-[#1a1a1a] -> text-[#1a1a1a] dark:text-[#fcfcfc]
  content = content.replace(/text-\[#1a1a1a\](?! dark:)/g, 'text-[#1a1a1a] dark:text-[#fcfcfc]');

  // Replace text-[#888888] -> text-[#888888] dark:text-[#a3a3a3]
  content = content.replace(/text-\[#888888\](?! dark:)/g, 'text-[#888888] dark:text-[#a3a3a3]');
  
  // Replace border-[#111111] -> border-[#111111] dark:border-[#fcfcfc]
  content = content.replace(/border-\[#111111\](?! dark:)/g, 'border-[#111111] dark:border-[#fcfcfc]');

  fs.writeFileSync(filePath, content);
}
console.log("Done");
