import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = (site?.toString() || 'https://www.zaantaxischiphol.nl').replace(/\/$/, '');
  const content = [
    'User-agent: *',
    'Disallow: /admin/',
    'Allow: /',
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
