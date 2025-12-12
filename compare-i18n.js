const fs = require('fs');
const path = require('path');

const enDir = path.join(__dirname, 'src', 'services', 'i18n', 'locales', 'en');
const frDir = path.join(__dirname, 'src', 'services', 'i18n', 'locales', 'fr');

function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keys.push(fullKey);
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    }
  }
  
  return keys;
}

function compareFiles(enFile, frFile) {
  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf8'));
  const frContent = JSON.parse(fs.readFileSync(frFile, 'utf8'));
  
  const enKeys = getAllKeys(enContent);
  const frKeys = getAllKeys(frContent);
  
  const missingInFr = enKeys.filter(key => !frKeys.includes(key));
  const extraInFr = frKeys.filter(key => !enKeys.includes(key));
  
  return { missingInFr, extraInFr };
}

console.log('Comparing English and French i18n files...\n');

const files = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));

let totalIssues = 0;

files.forEach(file => {
  const enFile = path.join(enDir, file);
  const frFile = path.join(frDir, file);
  
  const { missingInFr, extraInFr } = compareFiles(enFile, frFile);
  
  if (missingInFr.length > 0 || extraInFr.length > 0) {
    console.log(`\n📄 ${file}`);
    console.log('─'.repeat(50));
    
    if (missingInFr.length > 0) {
      console.log(`\n❌ Missing in French (${missingInFr.length} keys):`);
      missingInFr.forEach(key => console.log(`   - ${key}`));
      totalIssues += missingInFr.length;
    }
    
    if (extraInFr.length > 0) {
      console.log(`\n⚠️  Extra in French (${extraInFr.length} keys):`);
      extraInFr.forEach(key => console.log(`   - ${key}`));
      totalIssues += extraInFr.length;
    }
  }
});

if (totalIssues === 0) {
  console.log('\n✅ All files are in sync!');
} else {
  console.log(`\n\n📊 Total issues found: ${totalIssues}`);
}
