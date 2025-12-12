import json
import os
from pathlib import Path

en_dir = Path('src/services/i18n/locales/en')
fr_dir = Path('src/services/i18n/locales/fr')

def get_all_keys(obj, parent=''):
    """Recursively get all keys from a nested dict"""
    keys = set()
    if isinstance(obj, dict):
        for key, value in obj.items():
            full_key = f"{parent}.{key}" if parent else key
            keys.add(full_key)
            if isinstance(value, dict):
                keys.update(get_all_keys(value, full_key))
    return keys

def compare_files(en_file, fr_file):
    """Compare two JSON files and return missing keys"""
    with open(en_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    with open(fr_file, 'r', encoding='utf-8') as f:
        fr_data = json.load(f)
    
    en_keys = get_all_keys(en_data)
    fr_keys = get_all_keys(fr_data)
    
    missing_in_fr = en_keys - fr_keys
    extra_in_fr = fr_keys - en_keys
    
    return sorted(missing_in_fr), sorted(extra_in_fr)

print("=" * 70)
print("COMPARING ENGLISH AND FRENCH I18N FILES")
print("=" * 70)

files = sorted([f.name for f in en_dir.glob('*.json')])

total_missing = 0
total_extra = 0
files_with_issues = []

for filename in files:
    en_file = en_dir / filename
    fr_file = fr_dir / filename
    
    missing, extra = compare_files(en_file, fr_file)
    
    if missing or extra:
        files_with_issues.append(filename)
        print(f"\n📄 {filename}")
        print("-" * 70)
        
        if missing:
            print(f"\n❌ MISSING in French ({len(missing)} keys):")
            for key in missing:
                print(f"   • {key}")
            total_missing += len(missing)
        
        if extra:
            print(f"\n⚠️  EXTRA in French ({len(extra)} keys):")
            for key in extra:
                print(f"   • {key}")
            total_extra += len(extra)

print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)
print(f"Files checked: {len(files)}")
print(f"Files with issues: {len(files_with_issues)}")
print(f"Total missing keys: {total_missing}")
print(f"Total extra keys: {total_extra}")

if files_with_issues:
    print(f"\nFiles needing updates:")
    for f in files_with_issues:
        print(f"  • {f}")
else:
    print("\n✅ All files are synchronized!")
