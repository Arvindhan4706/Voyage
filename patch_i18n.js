const fs = require('fs');
const path = require('path');

const patchFile = (file, componentName, replacements) => {
  const filePath = path.join(__dirname, 'src/components', file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.includes('next-intl')) {
    content = content.replace(/import \{.*\} from (['"])framer-motion(['"]);/, `$&
import { useTranslations } from 'next-intl';`);
    
    // Some don't import framer-motion first, just append below 'use client'
    if (!content.includes('useTranslations')) {
       content = content.replace(/'use client';|("use client";)/, `$&\nimport { useTranslations } from 'next-intl';`);
    }

    content = content.replace(/export default function \w+\(\) \{/, `$&
  const t = useTranslations('${componentName}');`);
  }

  for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Patched ${file}`);
};

patchFile('AISearch.tsx', 'Search', [
  [/placeholder="Where would you like to go\?"/, 'placeholder={t("placeholder")}'],
  [/>\s*Discover\s*<\/button>/, '>{t("button")}</button>']
]);

patchFile('TravelCategories.tsx', 'Categories', [
  [/>\s*Curated For You\s*<\/p>/, '>{t("subtitle")}</p>'],
  [/>Explore Experiences<\/h2>/, '>{t("title")}</h2>']
]);

patchFile('DestinationCards.tsx', 'Destinations', [
  [/>\s*Handpicked Locales\s*<\/p>/, '>{t("subtitle")}</p>'],
  [/>\s*Trending Destinations\s*<\/h2>/, '>{t("title")}</h2>'],
  [/>\s*Explore All\s*<\/button>/, '>{t("explore")}</button>'],
  [/>From<\/p>/, '>{t("from")}</p>']
]);

patchFile('AITripGenerator.tsx', 'AITrip', [
  [/>\s*AI Trip Planner\s*<\/p>/, '>{t("title")}</p>'],
  [/>\s*Design Your Perfect Journey\s*<\/h2>/, '>{t("subtitle")}</h2>'],
  [/>\s*Generate Itinerary\s*<\/button>/, '>{t("button")}</button>']
]);

console.log('All patched');
