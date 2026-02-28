import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, HelpCircle } from 'lucide-react';
import { locationsData } from '../constants/locations';

interface SchipholFaqProps {
  pathname: string;
}

const excludedAirportKeywords = [
  'zaventem airport',
  'zaventem-airport',
  'brussel airport',
  'brussel-airport',
  'brussels airport',
  'brussels-airport',
  'düsseldorf airport',
  'dusseldorf airport',
  'dusseldorf-airport',
  'eindhoven airport',
  'eindhoven-airport',
  'rotterdam airport',
  'rotterdam-airport',
  'rotterdam the hague airport',
  'rotterdam-the-hague-airport',
];

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function humanizeSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
    .trim();
}

function extractLocation(pathname: string, title: string, h1Text: string) {
  const pathMatch = pathname.match(/\/taxi-(.+)-schiphol\/?$/i);
  if (pathMatch?.[1]) {
    const slug = pathMatch[1].toLowerCase();
    return {
      slug,
      name: locationsData[slug]?.name || humanizeSlug(slug),
    };
  }

  const content = `${title} ${h1Text}`;
  const taxiMatch = content.match(/taxi\s+(.+?)\s+(?:naar\s+)?schiphol/i);
  if (taxiMatch?.[1]) {
    const guessedName = taxiMatch[1].trim().replace(/[|,-]+$/g, '');
    const guessedSlug = guessedName.toLowerCase().replace(/\s+/g, '-');
    return {
      slug: guessedSlug,
      name: guessedName,
    };
  }

  const vanNaarMatch = content.match(/van\s+(.+?)\s+naar\s+schiphol/i);
  if (vanNaarMatch?.[1]) {
    const guessedName = vanNaarMatch[1].trim().replace(/[|,-]+$/g, '');
    const guessedSlug = guessedName.toLowerCase().replace(/\s+/g, '-');
    return {
      slug: guessedSlug,
      name: guessedName,
    };
  }

  return null;
}

export default function SchipholFaq({ pathname }: SchipholFaqProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [locationSlug, setLocationSlug] = useState('');

  useEffect(() => {
    const evaluate = () => {
      const pathnameLower = pathname.toLowerCase();
      const titleLower = document.title.toLowerCase();
      const h1Lower = (document.querySelector('h1')?.textContent || '').toLowerCase();
      const combined = `${pathnameLower} ${titleLower} ${h1Lower}`;

      const isNonSchipholAirportRoute = /\/taxi-.+-(?:rotterdam-airport|rotterdam-the-hague-airport|eindhoven-airport|brussel-airport|brussels-airport|zaventem-airport|dusseldorf-airport)\/?$/i.test(pathnameLower);

      const hasSchipholSignal =
        pathnameLower.includes('schiphol') ||
        titleLower.includes('schiphol') ||
        h1Lower.includes('schiphol');

      const hasExcludedAirportSignal = includesAny(combined, excludedAirportKeywords);
      const location = extractLocation(pathname, document.title, document.querySelector('h1')?.textContent || '');

      const shouldShowFaq = hasSchipholSignal && !hasExcludedAirportSignal && !isNonSchipholAirportRoute && Boolean(location?.name);

      setIsVisible(shouldShowFaq);
      setLocationName(location?.name || '');
      setLocationSlug(location?.slug || '');
    };

    evaluate();
    const timeout = window.setTimeout(evaluate, 100);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  const variationIndex = useMemo(() => {
    if (!locationSlug) return 0;
    return locationSlug.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 3;
  }, [locationSlug]);

  const locationVariants = [
    `Vanuit ${locationName} boek je eenvoudig online een taxi naar Schiphol met heldere voorwaarden.`,
    `Voor reizigers uit ${locationName} is dit een populaire keuze voor een taxi naar Schiphol zonder overstappen.`,
    `Klanten uit ${locationName} kiezen vaak voor onze service vanwege de combinatie van comfort en vaste prijs taxi Schiphol.`,
  ];

  const faqs = [
    {
      question: `Wat kost een taxi van ${locationName} naar Schiphol?`,
      answer: `De prijs van een taxi van ${locationName} naar Schiphol hangt af van de afstand en het type voertuig. Wij werken met vaste, vooraf afgesproken tarieven zodat je nooit voor verrassingen komt te staan. Vraag eenvoudig online een prijsopgave aan en ontvang direct een scherpe vaste prijs voor jouw rit naar Schiphol. Zo weet je precies wat jouw taxi ${locationName} Schiphol kost.`,
    },
    {
      question: 'Hoeveel kost een taxi naar Schiphol?',
      answer: 'De kosten van een taxi naar Schiphol verschillen per vertrekplaats. In tegenstelling tot reguliere straattaxi’s rekenen wij vaste tarieven. Hierdoor weet je vooraf precies wat je betaalt, ongeacht files of vertragingen onderweg. Met onze vaste prijs taxi Schiphol reis je zonder onverwachte extra kosten.',
    },
    {
      question: 'Wat is de goedkoopste manier om naar Schiphol te gaan?',
      answer: `De goedkoopste manier hangt af van je situatie. Reis je alleen met weinig bagage, dan kan het openbaar vervoer voordelig zijn. Reis je met meerdere personen of veel koffers, dan is een taxi vaak voordeliger én comfortabeler. Met onze vaste lage tarieven ben je verzekerd van een betaalbare en directe rit zonder overstappen. ${locationVariants[variationIndex]}`,
    },
    {
      question: 'Wat is goedkoper, Uber of taxi?',
      answer: 'Hoewel Uber soms goedkoper lijkt, kunnen prijzen sterk stijgen door dynamische tarieven (surge pricing). Wij hanteren vaste prijzen zonder onverwachte verhogingen. Daarnaast ben je bij ons 100% verzekerd dat wij op de afgesproken tijd aanwezig zijn. Bij Uber is er geen garantie dat er een chauffeur beschikbaar is of dat een rit niet wordt geannuleerd. Kies je voor onze taxiservice, dan kies je voor zekerheid, betrouwbaarheid en een scherpe vaste prijs. Wie zoekt naar de goedkoopste taxi Schiphol kiest vaak voor ons vaste tariefmodel.',
    },
  ];

  if (!isVisible || !locationName) {
    return null;
  }

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Veelgestelde Vragen (FAQ)</h2>
          <p className="text-stone-600">Alles wat u moet weten over uw taxi van {locationName} naar Schiphol.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="font-bold text-stone-900 flex items-center gap-3">
                  <HelpCircle size={20} className="text-emerald-600" />
                  {faq.question}
                </span>
                <span className="transition-transform group-open:rotate-180">
                  <ChevronRight size={20} />
                </span>
              </summary>
              <div className="px-6 pb-6 text-stone-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}