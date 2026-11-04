(function() {
  // Post list helpers for <section class="posts">:
  // 1. Posts dated within the last NEW_DAYS get a "New" pill automatically
  // 2. data-limit="5" shows the first 5 posts and a toggle to reveal the rest
  // 3. data-random="15" data-source="learn.html" fills an empty list on every load
  //    with posts picked evenly across the source page's sections

  const NEW_DAYS = 10;

  // Short names for the section tag; a section not listed here shows its full heading
  const SECTION_LABELS = {
    'Generative & Agentic AI': 'GenAI',
    'Machine Learning': 'ML',
    'Artificial Intelligence': 'AI',
    'Mathematics': 'Math',
    'Algorithm': 'Algorithms',
  };

  function markNew(list) {
    const cutoff = Date.now() - NEW_DAYS * 24 * 60 * 60 * 1000;
    list.querySelectorAll('.post').forEach(post => {
      const date = new Date(post.querySelector('.date')?.textContent.trim());
      const link = post.querySelector('a');
      if (!link || isNaN(date) || date < cutoff || link.querySelector('.pill')) return;
      link.insertAdjacentHTML('beforeend', ' <span class="pill pill-invert">New</span>');
    });
  }

  function collapse(list) {
    const limit = parseInt(list.dataset.limit, 10);
    const posts = list.querySelectorAll('.post');
    const extra = Array.from(posts).slice(limit);
    if (!limit || extra.length === 0) return;

    const toggle = document.createElement('button');
    toggle.className = 'posts-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    list.appendChild(toggle);

    function render(expanded) {
      extra.forEach(post => { post.hidden = !expanded; });
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded
        ? '− Show less'
        : '+ Show all ' + posts.length + ' posts';
    }

    toggle.addEventListener('click', () => {
      render(toggle.getAttribute('aria-expanded') !== 'true');
    });
    render(false);
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function sectionHeading(list) {
    let el = list.previousElementSibling;
    while (el && el.tagName !== 'H2') el = el.previousElementSibling;
    return el ? el.textContent.trim() : '';
  }

  async function fillRandom(list) {
    const res = await fetch(list.dataset.source);
    if (!res.ok) throw new Error(res.status);
    const source = new DOMParser().parseFromString(await res.text(), 'text/html');

    const sections = shuffle(Array.from(source.querySelectorAll('main .posts')).map(section => ({
      name: sectionHeading(section),
      posts: shuffle(Array.from(section.querySelectorAll('.post'))),
    })));

    // Take one post from each section in turn, so every section is represented
    const count = parseInt(list.dataset.random, 10);
    const picked = [];
    while (picked.length < count && sections.some(s => s.posts.length)) {
      for (const section of sections) {
        if (section.posts.length && picked.length < count) {
          picked.push({ post: section.posts.pop(), name: section.name });
        }
      }
    }

    // Newest first, like every other list
    const time = ({ post }) => new Date(post.querySelector('.date').textContent.trim());
    picked.sort((a, b) => time(b) - time(a)).forEach(({ post, name }) => {
      const row = document.importNode(post, true);
      const tag = document.createElement('span');
      tag.className = 'pill pill-section';
      tag.title = name;
      tag.textContent = SECTION_LABELS[name] || name;
      row.appendChild(tag);   // beside the link, which markNew checks for an existing pill
      list.appendChild(row);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.posts').forEach(async list => {
      if (list.dataset.random) {
        await fillRandom(list).catch(() => { /* e.g. opened from file://, where fetch is blocked */ });
      }
      markNew(list);
      if (list.dataset.limit) collapse(list);
    });
  });

})();
