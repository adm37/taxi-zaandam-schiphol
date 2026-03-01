import type { APIRoute } from 'astro';
import { locationsData } from '../../src/constants/locations';

const airportSlugs = [
  'rotterdam-airport',
  'rotterdam-the-hague-airport',
  'eindhoven-airport',
  'brussel-airport',
  'brussels-airport',
  'zaventem-airport',
  'dusseldorf-airport',
];

export const GET: APIRoute = ({ site }) => {
  const baseUrl = (site?.toString() || 'https://www.zaantaxischiphol.nl').replace(/\/$/, '');
  const locationSlugs = Object.keys(locationsData);

  const withTrailingSlash = (route: string): string => {
    if (route === '/') return '/';
    return `${route.replace(/\/+$/, '')}/`;
  };

  const routes = [
    '/',
    '/tarieven',
    '/over-ons',
    '/contact',
    ...locationSlugs.map((location) => `/taxi-${location}-schiphol`),
    ...locationSlugs.flatMap((location) =>
      airportSlugs.map((airport) => `/taxi-${location}-${airport}`),
    ),
  ];

  const uniqueRoutes = Array.from(new Set(routes));
  const lastMod = new Date().toISOString();

  const urlset = uniqueRoutes
    .map((route) => {
      return `<url><loc>${baseUrl}${withTrailingSlash(route)}</loc><lastmod>${lastMod}</lastmod></url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
