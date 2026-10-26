(function() {
  // Shared site header. Each page includes it as:
  //   <header><script src="js/header.js"></script></header>
  // (with ../ on pages inside a folder). Edit the nav here, once.

  const script = document.currentScript;
  const root = new URL('..', script.src);   // site root, from this file's location
  const page = location.href.startsWith(root.href)
    ? location.pathname.slice(root.pathname.length)
    : '';

  // 1. Work out which section the current page belongs to
  let section = '';
  if (page === '' || page === 'index.html' || page.startsWith('blog/')) {
    section = 'blog';
  } else if (/^(learn|books|projects|research)(\.html|\/)/.test(page)) {
    section = 'learn';
  } else if (/^life(\.html|\/)/.test(page)) {
    section = 'life';
  }

  const links = [
    { id: 'blog', label: 'Blog', href: 'index.html' },
    { id: 'learn', label: 'Learn', href: 'learn.html' },
  ];
  // Life is only listed while you're in that section
  if (section === 'life') links.push({ id: 'life', label: 'Life', href: 'life.html' });

  // 2. Build the nav
  const nav = links.map(link =>
    `<a href="${new URL(link.href, root).href}"${link.id === section ? ' class="active"' : ''}>${link.label}</a>`
  ).join('\n');

  script.parentElement.innerHTML = `
    <nav>
      ${nav}
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

})();
