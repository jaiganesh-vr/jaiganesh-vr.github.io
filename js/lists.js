(function() {
  // Post list helpers for <section class="posts">:
  // 1. Posts dated within the last NEW_DAYS get a "New" pill automatically
  // 2. data-limit="5" shows the first 5 posts and a toggle to reveal the rest

  const NEW_DAYS = 10;

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

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.posts').forEach(list => {
      markNew(list);
      if (list.dataset.limit) collapse(list);
    });
  });

})();
