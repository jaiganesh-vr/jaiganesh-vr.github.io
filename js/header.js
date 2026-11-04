(function() {
  // Shared site header. Each page includes it as:
  //   <header><script src="js/header.js"></script></header>
  // (with ../ on pages inside a folder). Edit the nav here, once.

  // Pages with a French version under fr/. Add a post here once it's translated.
  const FRENCH_PAGES = ['', 'index', 'learn', 'books', 'projects', 'research', 'timeline'];

  const script = document.currentScript;
  const root = new URL('..', script.src);   // site root, from this file's location
  const isFrench = document.documentElement.lang.startsWith('fr');
  const fullPath = location.href.startsWith(root.href)
    ? location.pathname.slice(root.pathname.length)
    : '';
  const page = isFrench ? fullPath.replace(/^fr\//, '') : fullPath;
  const hasFrench = FRENCH_PAGES.includes(page.replace(/\.html$/, ''));

  // Remember the language of pages that exist in both. A reader on an English-only
  // post keeps that choice, so the nav can still bring them back to the French pages.
  let savedLang = null;
  try {
    if (hasFrench) localStorage.setItem('lang', isFrench ? 'fr' : 'en');
    savedLang = localStorage.getItem('lang');
  } catch (e) {}
  const useFrench = isFrench || (!hasFrench && savedLang === 'fr');
  const navRoot = useFrench ? new URL('fr/', root) : root;

  // 1. Work out which section the current page belongs to
  let section = '';
  if (page === '' || page === 'index.html') {
    section = 'blog';
  } else if (/^(learn|books|projects|research|notes|blog|timeline)(\.html|\/)/.test(page)) {
    section = 'learn';
  } else if (/^life(\.html|\/)/.test(page)) {
    section = 'life';
  }

  const links = [
    { id: 'blog', label: useFrench ? 'Blogue' : 'Blog', href: new URL('index.html', navRoot).href },
    { id: 'learn', label: useFrench ? 'Apprendre' : 'Learn', href: new URL('learn.html', navRoot).href },
  ];
  // Life is only listed while you're in that section
  if (section === 'life') links.push({ id: 'life', label: 'Life', href: new URL('life.html', root).href });

  // 2. Build the nav
  const nav = links.map(link =>
    `<a href="${link.href}"${link.id === section ? ' class="active"' : ''}>${link.label}</a>`
  ).join('\n');

  // EN | FR: the other language is a link only when that version exists
  const target = page || 'index.html';
  const en = isFrench
    ? `<a href="${new URL(target, root).href}${location.hash}" lang="en">EN</a>`
    : '<span class="lang-current" aria-current="true">EN</span>';
  const fr = isFrench
    ? '<span class="lang-current" aria-current="true">FR</span>'
    : hasFrench
      ? `<a href="${new URL(target, new URL('fr/', root)).href}${location.hash}" lang="fr-CA">FR</a>`
      : '<span class="lang-off" lang="fr-CA" title="Version française à venir">FR</span>';

  script.parentElement.innerHTML = `
    <nav>
      ${nav}
      <span class="lang-switch" role="group" aria-label="Language">${en}<span aria-hidden="true">|</span>${fr}</span>
      <button class="theme-toggle" aria-label="Toggle theme">
        <svg id="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 114.5 4.5A4.5 4.5 0 017.5 12zM2.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM12 18.75a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zM18.75 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75zM5.636 5.636a.75.75 0 011.06 0l1.591 1.591a.75.75 0 01-1.06 1.06L5.637 6.697a.75.75 0 010-1.061zM15.713 15.713a.75.75 0 011.06 0l1.591 1.591a.75.75 0 01-1.06 1.06l-1.59-1.591a.75.75 0 010-1.06zM5.636 18.364a.75.75 0 010-1.06l1.591-1.591a.75.75 0 011.06 1.06L6.697 18.363a.75.75 0 01-1.06 0zM15.713 8.288a.75.75 0 010-1.06l1.591-1.591a.75.75 0 011.06 1.06l-1.59 1.591a.75.75 0 01-1.061 0z" />
        </svg>
        <svg id="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="display: none;">
          <path
            d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
        </svg>
      </button>
    </nav>`;

  // 3. On phones the page tabs scroll sideways; bring the current one into view
  document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('menu.menu-highlight');
    const current = menu && menu.querySelector('[aria-current]');
    if (!current) return;
    menu.scrollLeft += current.getBoundingClientRect().right - menu.getBoundingClientRect().right;
  });

})();
