import { locationsData } from './locations';

type JsonLdObject = Record<string, unknown>;

export interface SeoMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogType: string;
  ogImage: string;
  localBusinessJsonLd?: JsonLdObject;
  breadcrumbJsonLd?: JsonLdObject;
}

type SeoMetadataOverride = Partial<SeoMetadata> & Pick<SeoMetadata, 'title' | 'description'>;

const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'https://zaantaxischiphol.nl').replace(/\/$/, '');

function absoluteUrl(pathname: string): string {
  if (!pathname || pathname === '/') {
    return `${siteUrl}/`;
  }

  const normalized = `/${pathname.replace(/^\/+|\/+$/g, '')}/`;
  return `${siteUrl}${normalized}`;
}

const defaultSeo: SeoMetadata = {
  title: 'Taxi Zaandam Schiphol | Vaste Prijs Luchthavenvervoer',
  description: 'Betrouwbare taxi vanuit de Zaanstreek naar Schiphol en andere luchthavens. 24/7 service met vaste tarieven.',
  keywords: 'taxi zaandam schiphol, taxi zaanstreek, luchthavenvervoer, taxi schiphol vaste prijs',
  canonicalUrl: `${siteUrl}/`,
  ogTitle: 'Taxi Zaandam Schiphol | Vaste Prijs Luchthavenvervoer',
  ogDescription: 'Betrouwbare taxi vanuit de Zaanstreek naar Schiphol en andere luchthavens. 24/7 service met vaste tarieven.',
  ogUrl: `${siteUrl}/`,
  ogType: 'website',
  ogImage: `${siteUrl}/og-image.jpg`,
  localBusinessJsonLd: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ZaanTaxi Schiphol',
    url: `${siteUrl}/`,
    telephone: '+31752340037',
    areaServed: 'Zaanstreek',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Zaanstad',
      addressCountry: 'NL',
    },
  },
  breadcrumbJsonLd: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`,
      },
    ],
  },
};

function createBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

const routeSeoOverrides: Record<string, SeoMetadataOverride> = {
  '/': {
    title: 'Taxi Zaandam Schiphol | Vaste Prijs Luchthavenvervoer',
    description: 'Taxi vanuit Zaandam, Krommenie, Assendelft, Wormer en omgeving naar Schiphol met vaste tarieven en 24/7 service.',
    keywords: 'taxi zaandam schiphol, taxi zaanstad, taxi luchthavenvervoer, taxi vaste prijs',
    breadcrumbJsonLd: createBreadcrumbJsonLd([
      { name: 'Home', url: `${siteUrl}/` },
    ]),
  },
  '/tarieven': {
    title: 'Taxi Tarieven | Zaandam, Schiphol en Andere Luchthavens',
    description: 'Bekijk alle vaste taxitarieven vanuit de Zaanstreek naar Schiphol, Rotterdam, Eindhoven, Brussel en Düsseldorf.',
    keywords: 'taxi tarieven schiphol, taxi prijzen zaandam, luchthaven taxi kosten',
    breadcrumbJsonLd: createBreadcrumbJsonLd([
      { name: 'Home', url: `${siteUrl}/` },
      { name: 'Tarieven', url: `${siteUrl}/tarieven/` },
    ]),
  },
  '/over-ons': {
    title: 'Over Ons | Taxi Zaandam Schiphol Service',
    description: 'Lees meer over onze taxidienst, onze chauffeurs en onze focus op betrouwbare luchthavenritten vanuit de Zaanstreek.',
    keywords: 'over taxi zaandam schiphol, taxibedrijf zaanstreek',
    breadcrumbJsonLd: createBreadcrumbJsonLd([
      { name: 'Home', url: `${siteUrl}/` },
      { name: 'Over Ons', url: `${siteUrl}/over-ons/` },
    ]),
  },
  '/contact': {
    title: 'Contact | Taxi Zaandam Schiphol Boeken',
    description: 'Neem direct contact op voor een taxi-reservering naar Schiphol of een andere luchthaven vanuit de Zaanstreek.',
    keywords: 'contact taxi zaandam schiphol, taxi reserveren zaanstreek',
    breadcrumbJsonLd: createBreadcrumbJsonLd([
      { name: 'Home', url: `${siteUrl}/` },
      { name: 'Contact', url: `${siteUrl}/contact/` },
    ]),
  },
};

Object.values(locationsData).forEach((location) => {
  const route = `/taxi-${location.slug}-schiphol`;
  routeSeoOverrides[route] = {
    title: location.title,
    description: location.description,
    keywords: `taxi ${location.name.toLowerCase()} schiphol, taxi ${location.name.toLowerCase()}, luchthavenvervoer ${location.name.toLowerCase()}`,
    breadcrumbJsonLd: createBreadcrumbJsonLd([
      { name: 'Home', url: `${siteUrl}/` },
      { name: `Taxi ${location.name} Schiphol`, url: absoluteUrl(route) },
    ]),
  };
});

const airportMeta: Record<string, { label: string; keywords: string }> = {
  'rotterdam-airport': { label: 'Rotterdam Airport', keywords: 'rotterdam airport taxi' },
  'rotterdam-the-hague-airport': { label: 'Rotterdam The Hague Airport', keywords: 'rotterdam the hague airport taxi' },
  'eindhoven-airport': { label: 'Eindhoven Airport', keywords: 'eindhoven airport taxi' },
  'brussel-airport': { label: 'Brussel Airport', keywords: 'brussel airport taxi' },
  'brussels-airport': { label: 'Brussels Airport', keywords: 'brussels airport taxi' },
  'zaventem-airport': { label: 'Zaventem Airport', keywords: 'zaventem airport taxi' },
  'dusseldorf-airport': { label: 'Dusseldorf Airport', keywords: 'dusseldorf airport taxi' },
};

Object.values(locationsData).forEach((location) => {
  Object.entries(airportMeta).forEach(([airportSlug, airport]) => {
    const route = `/taxi-${location.slug}-${airportSlug}`;
    routeSeoOverrides[route] = {
      title: `Taxi ${location.name} ${airport.label} | Vaste Prijs & 24/7 Service`,
      description: `Reserveer uw taxi van ${location.name} naar ${airport.label}. Betrouwbaar luchthavenvervoer met vaste tarieven en 24/7 beschikbaarheid.`,
      keywords: `taxi ${location.name.toLowerCase()} ${airport.label.toLowerCase()}, ${airport.keywords}, luchthavenvervoer ${location.name.toLowerCase()}`,
      breadcrumbJsonLd: createBreadcrumbJsonLd([
        { name: 'Home', url: `${siteUrl}/` },
        { name: `Taxi ${location.name} Schiphol`, url: absoluteUrl(`/taxi-${location.slug}-schiphol`) },
        { name: `Taxi ${location.name} ${airport.label}`, url: absoluteUrl(route) },
      ]),
    };
  });
});

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return `/${pathname.replace(/^\/+|\/+$/g, '')}`;
}

export function getSeoForPath(pathname: string): SeoMetadata {
  const normalizedPath = normalizePath(pathname);
  const override = routeSeoOverrides[normalizedPath];
  const pageUrl = absoluteUrl(normalizedPath);

  const title = override?.title ?? defaultSeo.title;
  const description = override?.description ?? defaultSeo.description;

  return {
    ...defaultSeo,
    ...override,
    title,
    description,
    canonicalUrl: override?.canonicalUrl ?? pageUrl,
    ogTitle: override?.ogTitle ?? title,
    ogDescription: override?.ogDescription ?? description,
    ogUrl: override?.ogUrl ?? pageUrl,
    ogType: override?.ogType ?? defaultSeo.ogType,
    ogImage: override?.ogImage ?? defaultSeo.ogImage,
  };
}
