(function() {
  // Post page helpers:
  // 1. Reading progress bar fixed to the top
  // 2. Older/newer links at the end, taken from the section's listing page

  // Listing page for each post folder; links there are ordered newest first
  const LISTINGS = {
    blog: 'index.html',
    books: 'books.html',
    projects: 'projects.html',
    research: 'research.html',
    notes: 'learn.html',
  };

  function addProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'progress';
    document.body.appendChild(bar);

    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      bar.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  async function fetchPage(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    return new DOMParser().parseFromString(await res.text(), 'text/html');
  }

  // Walk the list from index i in direction step, skipping empty placeholder pages
  async function findNeighbour(urls, i, step) {
    for (let j = i + step; j >= 0 && j < urls.length; j += step) {
      try {
        const title = (await fetchPage(urls[j])).querySelector('h1')?.textContent.trim();
        if (title) return { url: urls[j], title };
      } catch (e) { /* missing page: keep looking */ }
    }
    return null;
  }

  async function addPostNav() {
    const here = new URL(location.href);
    const folder = here.pathname.split('/').slice(-2, -1)[0];
    if (!LISTINGS[folder]) return;

    const listingUrl = new URL('../' + LISTINGS[folder], here);
    const listing = await fetchPage(listingUrl);

    // GitHub Pages serves /blog/post.html at /blog/post too
    const key = url => url.split('#')[0].replace(/\.html$/, '');
    const resolve = a => new URL(a.getAttribute('href'), listingUrl).href;

    // Stay within this post's own list, e.g. one topic on the Notes page
    const own = Array.from(listing.querySelectorAll('main a[href]')).find(a => key(resolve(a)) === key(here.href));
    if (!own) return;
    const scope = own.closest('.posts') || listing.querySelector('main');

    // Unique post links in the listing's order
    const urls = [];
    scope.querySelectorAll('a[href]').forEach(a => {
      const url = key(resolve(a)) + '.html';
      if (url.includes('/' + folder + '/') && !urls.includes(url)) urls.push(url);
    });

    const i = urls.map(key).indexOf(key(here.href));
    if (i === -1) return;

    // Previous/next follow the listing page's order, top to bottom
    const [prev, next] = await Promise.all([findNeighbour(urls, i, -1), findNeighbour(urls, i, 1)]);
    if (!prev && !next) return;

    const nav = document.createElement('nav');
    nav.className = 'post-nav';
    nav.setAttribute('aria-label', 'More posts');
    [[prev, 'prev', '← Previous'], [next, 'next', 'Next →']].forEach(([post, cls, label]) => {
      if (!post) return;
      const a = document.createElement('a');
      a.className = cls;
      a.href = post.url;
      a.title = post.title;
      a.textContent = label;
      nav.appendChild(a);
    });

    // Sit above the closing divider and footnote, if the post has them
    const main = document.querySelector('main');
    const dividers = main.querySelectorAll(':scope > .divider');
    const lastDivider = dividers[dividers.length - 1];
    if (lastDivider && lastDivider.nextElementSibling?.matches('p.muted')) {
      lastDivider.before(nav);
    } else {
      main.appendChild(nav);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    addProgressBar();
    addPostNav().catch(() => { /* e.g. opened from file://, where fetch is blocked */ });
  });

})();
