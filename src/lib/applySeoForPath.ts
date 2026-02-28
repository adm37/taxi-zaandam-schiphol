import { getSeoForPath } from '../constants/seo';

function setMeta(name: string, content: string | undefined) {
  if (!content) return;

  let tag = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

export function applySeoForPath(pathname: string) {
  const seo = getSeoForPath(pathname);
  document.title = seo.title;
  setMeta('description', seo.description);
  setMeta('keywords', seo.keywords);
}
