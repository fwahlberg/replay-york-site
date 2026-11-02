import {readFile, writeFile} from 'node:fs/promises';
import {load} from 'cheerio';

const root = new URL('../', import.meta.url);
const defaults = JSON.parse(await readFile(new URL('site/content.defaults.json', root), 'utf8'));
const query = `*[_id == "website" && _type == "website"][0]{...,
  hero{...,photo{...,asset->}},story{...,photo{...,asset->}},
  nights{...,first{...,photo{...,asset->}},second{...,photo{...,asset->}},celebration{...,photo{...,asset->}}},
  settings{...,logo{...,asset->}},seo{...,shareImage{...,asset->}}}`;
let published;
if (!process.argv.includes('--defaults')) {
  const api = new URL('https://7i0l1smd.api.sanity.io/v2025-02-19/data/query/production');
  api.searchParams.set('query', query);
  api.searchParams.set('perspective', 'published');
  const response = await fetch(api, {signal: AbortSignal.timeout(30000)});
  if (!response.ok) throw new Error(`Sanity content request failed (${response.status}). Keeping the existing deployment.`);
  published = (await response.json()).result;
}
// Missing optional fields use the original design; empty strings deliberately clear optional copy.
function merge(base, value) {
  if (value === undefined || value === null) return base;
  if (Array.isArray(value) || typeof value !== 'object') return value;
  return Object.fromEntries([...new Set([...Object.keys(base || {}), ...Object.keys(value)])]
    .map(key => [key, merge(base?.[key], value[key])]));
}
const c = merge(defaults, published);
if (published?.story && !('photoNote' in published.story)) c.story.photoNote = '';
if (published?.nights?.second && !('caption' in published.nights.second)) c.nights.second.caption = '';
const $ = load(await readFile(new URL('site/template.html', root), 'utf8'));
const set = (selector, value) => $(selector).text(value ?? '');
const escape = value => $('<span>').text(String(value ?? '')).html();
const multiline = (selector, value) => $(selector).html(escape(value).replace(/\n/g, '<br>'));
const https = value => {
  const u = new URL(value);
  if (u.protocol !== 'https:') throw new Error('Website links must use HTTPS.');
  return u;
};
const tracked = (value, placement) => {
  const u = https(value);
  u.searchParams.set('utm_source', 'replayyork.co.uk');
  u.searchParams.set('utm_medium', 'website');
  u.searchParams.set('utm_campaign', 'website');
  u.searchParams.set('utm_content', placement);
  return u.href;
};
const imageUrl = (image, width = 2200) => {
  if (!image?.asset?.url) return null;
  const u = https(image.asset.url);
  if (u.hostname !== 'cdn.sanity.io') throw new Error('Unexpected image host.');
  u.searchParams.set('auto', 'format');
  u.searchParams.set('w', String(width));
  u.searchParams.set('fit', 'max');
  return u.href;
};
function photo(selector, image, alt, width) {
  const url = imageUrl(image, width);
  $(selector).attr('alt', alt || 'Replay York');
  if (url) {
    $(selector).attr('src', url);
    const size = image.asset.metadata?.dimensions;
    if (size) $(selector).attr({width:size.width, height:size.height});
    else $(selector).removeAttr('width height');
    if (image.hotspot) $(selector).css('object-position', `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`);
  }
  return url;
}

multiline('#hero-title', c.hero.title);
$('#hero-title').attr('aria-label', `Replay York nightclub. ${c.hero.title.replace(/\n/g, ' ')}`);
multiline('.hero-description', c.hero.description);
set('.replay-moment p', c.hero.momentIntro);
multiline('.replay-moment div', c.hero.momentTitle);
set('.replay-moment span', c.hero.momentCaption);
const hero = photo('.hero-photo', c.hero.photo, c.hero.photoAlt);
if (hero) {
  $('.play-portal image').attr('href', hero);
  $('link[as="image"]').attr('href', hero);
}
multiline('#nights-title', c.nights.title);
multiline('.section-heading-aside p', c.nights.description);
['first', 'second', 'celebration'].forEach((key, index) => {
  const item = c.nights[key];
  const card = $('.night-card').eq(index);
  card.find('h3').text(item.title);
  card.find('.night-info p').text(item.description);
  card.find('.art-tag').text(item.tag);
  if (index === 1) {
    card.find('.saturday-type').html(item.posterTitle.split('\n').map(line => `<span>${escape(line)}</span>`).join(''));
    card.find('.saturday-caption').text(item.caption || '');
  } else {
    const star = index === 0 ? '<span class="poster-star" aria-hidden="true">✳</span>' : '';
    card.find('.poster-title').html(escape(item.posterTitle).replace(/\n/g, '<br>') + star);
  }
  photo(`.night-card:nth-child(${index + 1}) .night-art > img`, item.photo, item.photoAlt, 1200);
  if (index < 2) {
    card.find('.night-art').attr('aria-label', `${item.title} Events and tickets`);
    if (item.ticketUrl) card.find('[data-conversion="events_and_tickets_click"]').attr('data-ticket-url', https(item.ticketUrl).href);
  }
});
multiline('#feeling-title', c.story.title);
const storyParagraphs = [c.story.intro, ...c.story.body.split(/\n\s*\n/)].filter(Boolean);
$('.feeling-copy > p').remove();
$('.feeling-copy h2').after(storyParagraphs.map(p => `<p>${escape(p)}</p>`).join(''));
photo('.feeling-photo img', c.story.photo, c.story.photoAlt);
set('.stock-note', c.story.photoNote || '');
if (!c.story.photoNote) $('.stock-note').remove();
multiline('#member-title', c.membership.title);
set('.membership-panel p', c.membership.description);
set('.membership-small', c.membership.note);
set('.visit-description', c.visit.description);
multiline('.closing-inner h2', c.footer.title);
set('.closing-inner > div > p', c.footer.intro);
set('.footer-top p', c.footer.tagline);

// Keep placements and conversion tracking when editors change a booking destination.
$('[data-conversion]').each((_, el) => {
  const link = $(el);
  const old = new URL(link.attr('href'));
  const destination = link.attr('data-ticket-url') || (link.attr('data-conversion') === 'membership_click' ? c.settings.membershipUrl : c.settings.ticketsUrl);
  link.attr('href', tracked(destination, old.searchParams.get('utm_content') || 'website')).removeAttr('data-ticket-url');
});
const linkReplacements = [
  [defaults.settings.instagramUrl,c.settings.instagramUrl], [defaults.settings.facebookUrl,c.settings.facebookUrl],
  [defaults.settings.lostPropertyUrl,c.settings.lostPropertyUrl], [defaults.settings.giftCardsUrl,c.settings.giftCardsUrl],
];
linkReplacements.forEach(([before,after]) => $(`a[href="${before}"]`).attr('href', https(after).href));
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.settings.email)) throw new Error('Invalid enquiry email.');
$('body').attr('data-contact-email', c.settings.email);
$('a[href^="mailto:"]').each((_, el) => {
  const a = $(el); a.attr('href', `mailto:${c.settings.email}`);
  a.text(a.text().replaceAll(defaults.settings.email, c.settings.email));
});
const instagramHandle = new URL(c.settings.instagramUrl).pathname.split('/').filter(Boolean)[0];
if (instagramHandle) set('.closing-social strong', `@${instagramHandle}`);
const logo = imageUrl(c.settings.logo, 800);
if (logo) {$('.brand').addClass('has-custom-logo'); $('.brand img').attr('src', logo).removeAttr('width height');}

const hours = c.visit.openingHours || [];
if (hours.length) {
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  if (hours.some(h => !days.includes(h.day) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(h.opens) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(h.closes))) throw new Error('Invalid regular opening hours.');
  $('.visit-description').after(`<div class="opening-hours"><h3>Regular opening hours</h3>${hours.map(h=>`<p>${escape(h.day)} <span>${escape(h.opens)}–${escape(h.closes)}</span></p>`).join('')}</div>`);
}
$('.faq details').remove();
for (const [index, item] of c.visit.faqs.entries()) {
  const details = $('<details>');
  details.append($('<summary>').text(item.question).append('<span aria-hidden="true"></span>'));
  const p = $('<p>');
  const hasLink = item.linkLabel && (item.action === 'enquiry' || item.linkUrl);
  let link;
  if (hasLink) {
    if (item.action === 'enquiry') link = $('<button class="inline-link" data-enquiry="Celebration">').text(item.linkLabel);
    else {
      let href = item.linkUrl.replace(`mailto:${defaults.settings.email}`, `mailto:${c.settings.email}`);
      for (const [before, after] of linkReplacements) if (href === before) href = https(after).href;
      const u = new URL(href);
      if (!['https:', 'mailto:'].includes(u.protocol)) throw new Error('Unsupported FAQ link protocol.');
      link = $('<a target="_blank" rel="noopener noreferrer">').attr('href', href).text(item.linkLabel.replaceAll(defaults.settings.email,c.settings.email));
      const originalTickets = new URL(defaults.settings.ticketsUrl);
      if (u.hostname === originalTickets.hostname) {
        const destination = u.pathname === originalTickets.pathname ? c.settings.ticketsUrl : href;
        link.attr({'href':tracked(destination,index === 1 ? 'opening_times' : `faq_${index + 1}`),'data-conversion':'events_and_tickets_click'});
      }
    }
  }
  const answer = item.answer.replaceAll(defaults.settings.email, c.settings.email);
  const marker = answer.indexOf('{{link}}');
  if (link && marker >= 0) p.append(escape(answer.slice(0, marker)), link, escape(answer.slice(marker + 8)));
  else {p.text(answer.replaceAll('{{link}}', '')); if (link) p.append(' ', link);}
  details.append(p); $('.faq').append(details);
}
set('title', c.seo.title);
$('meta[name="description"]').attr('content', c.seo.description);
$('meta[property="og:title"]').attr('content', c.seo.title);
$('meta[property="og:description"]').attr('content', c.seo.description);
const share = imageUrl(c.seo.shareImage, 1600);
if (share) {
  $('meta[property="og:image"]').attr('content', share);
  $('meta[property="og:image:width"],meta[property="og:image:height"]').remove();
  $('meta[property="og:image:alt"]').attr('content', 'Replay York');
}
const structured = JSON.parse($('script[type="application/ld+json"]').text());
const venue = structured['@graph'].find(x => x['@type'] === 'NightClub');
venue.email = c.settings.email;
venue.sameAs = [https(c.settings.instagramUrl).href, https(c.settings.facebookUrl).href];
venue.description = c.seo.description;
if (share) venue.image = share;
if (hours.length) venue.openingHoursSpecification = hours.map(h=>({'@type':'OpeningHoursSpecification',dayOfWeek:`https://schema.org/${h.day}`,opens:h.opens,closes:h.closes}));
$('script[type="application/ld+json"]').text(JSON.stringify(structured).replaceAll('<', '\\u003c'));
await writeFile(new URL('dist/index.html', root), $.html().replace(/[\t ]+$/gm, ''));
console.log(`Built public website from ${published ? `published Sanity content (${published._rev})` : 'original content'}.`);
