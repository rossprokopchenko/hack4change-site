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

const files = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));

console.log('Checking synchronization...\n');

let allSynced = true;

files.forEach(file => {
  const enFile = path.join(enDir, file);
  const frFile = path.join(frDir, file);
  
  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf8'));
  const frContent = JSON.parse(fs.readFileSync(frFile, 'utf8'));
  
  const enKeys = getAllKeys(enContent);
  const frKeys = getAllKeys(frContent);
  
  const missingInFr = enKeys.filter(key => !frKeys.includes(key));
  const extraInFr = frKeys.filter(key => !enKeys.includes(key));
  
  if (missingInFr.length > 0 || extraInFr.length > 0) {
    allSynced = false;
    console.log(`❌ ${file}`);
    if (missingInFr.length > 0) {
      console.log(`   Missing ${missingInFr.length} keys in French`);
    }
    if (extraInFr.length > 0) {
      console.log(`   Extra ${extraInFr.length} keys in French`);
    }
  } else {
    console.log(`✅ ${file}`);
  }
});

if (allSynced) {
  console.log('\n✅ All files are synchronized!');
  process.exit(0);
} else {
  console.log('\n❌ Some files still need synchronization');
  process.exit(1);
}
