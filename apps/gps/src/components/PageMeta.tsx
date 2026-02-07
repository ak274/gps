import { useEffect } from 'react';

type PageMetaProps = {
  title: string;
  description: string;
  /** Optional canonical URL. If omitted, canonical is not set. */
  canonicalUrl?: string;
};

function upsertMetaByName(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const selector = `meta[name="${CSS.escape(name)}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string) {
  if (typeof document === 'undefined') return;
  const selector = `meta[property="${CSS.escape(property)}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLinkRel(rel: string, href: string) {
  if (typeof document === 'undefined') return;
  const selector = `link[rel="${CSS.escape(rel)}"]`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function PageMeta({ title, description, canonicalUrl }: PageMetaProps) {
  useEffect(() => {
    document.title = title;

    upsertMetaByName('description', description);

    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:type', 'website');

    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', title);
    upsertMetaByName('twitter:description', description);

    // Helpful for crawlers and sharing; safe default.
    upsertMetaByProperty('og:url', window.location.href);

    if (canonicalUrl) {
      upsertLinkRel('canonical', canonicalUrl);
    }
  }, [title, description, canonicalUrl]);

  return null;
}
