(function() {
  // Collapse long post lists: <section class="posts" data-limit="5">
  // shows the first 5 posts and a toggle to reveal the rest

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.posts[data-limit]').forEach(list => {
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
    });
  });

})();
