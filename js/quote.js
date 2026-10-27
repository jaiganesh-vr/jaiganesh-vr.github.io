(function() {
  // Reading highlight on the home page: plays a random entrance animation
  // on every load, never the same one twice in a row.
  //   <div class="reading-quote">
  //     <p class="muted quote-text">"..."</p>
  //     <p class="quote-source">— Book · Author</p>
  //   </div>
  // To shortlist, delete names from ANIMATIONS.

  const ANIMATIONS = [
    'typewriter', 'highlighter', 'decode', 'words', 'underline',
    'shine', 'focus', 'rise', 'neon',
  ];

  const GLYPHS = 'abcdefghijklmnopqrstuvwxyz#%&*+=<>/\\[]{}01';
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // Wrap the quote in a span carrying an animation class, start it on the next frame
  async function cssAnimation(q, cls, ms) {
    q.innerHTML = `<span class="${cls}">${q.innerHTML}</span>`;
    void q.offsetWidth;   // apply the start state before switching it on
    await wait(250);
    q.firstChild.classList.add('on');
    await wait(ms);
  }

  const play = {
    async typewriter(q, text) {
      for (let i = 0; i <= text.length; i++) {
        q.innerHTML = '';
        q.append(text.slice(0, i));
        q.insertAdjacentHTML('beforeend', '<span class="rq-cursor">&nbsp;</span>');
        await wait(28 + Math.random() * 40);
      }
      await wait(300);
      q.textContent = text;
    },
    highlighter: q => cssAnimation(q, 'rq-marker', 2200),
    underline:   q => cssAnimation(q, 'rq-uline', 2000),
    shine:       q => cssAnimation(q, 'rq-shine', 2200),
    focus:       q => cssAnimation(q, 'rq-focus', 1600),
    neon:        q => cssAnimation(q, 'rq-neon', 1800),
    async decode(q, text) {
      const frames = 45;
      for (let f = 0; f <= frames; f++) {
        const settled = Math.floor((f / frames) * text.length);
        q.textContent = [...text].map((c, i) =>
          i < settled || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('');
        await wait(35);
      }
      q.textContent = text;
    },
    async words(q, text) {
      q.innerHTML = '';
      const spans = text.split(' ').map(w => {
        const s = document.createElement('span');
        s.className = 'rq-w';
        s.textContent = w;
        return s;
      });
      spans.forEach((s, i) => q.append(s, i < spans.length - 1 ? ' ' : ''));
      for (const s of spans) { await wait(90); s.classList.add('on'); }
      await wait(500);
      q.textContent = text;   // back to plain text once settled
    },
    async rise(q, text) {
      q.innerHTML = '';
      const words = text.split(' ').map(w => {
        const outer = document.createElement('span');
        outer.className = 'rq-lw';
        const inner = document.createElement('span');
        inner.className = 'rq-li';
        inner.textContent = w;
        outer.append(inner);
        return outer;
      });
      words.forEach((w, i) => q.append(w, i < words.length - 1 ? ' ' : ''));
      const tops = [...new Set(words.map(w => w.offsetTop))];
      await wait(200);
      for (const top of tops) {
        words.filter(w => w.offsetTop === top).forEach(w => w.firstChild.classList.add('on'));
        await wait(180);
      }
      await wait(700);
      q.textContent = text;
    },
  };

  function pickAnimation() {
    let last = null;
    try { last = localStorage.getItem('quote-animation'); } catch (e) {}
    const choices = ANIMATIONS.length > 1 ? ANIMATIONS.filter(a => a !== last) : ANIMATIONS;
    const name = choices[Math.floor(Math.random() * choices.length)];
    try { localStorage.setItem('quote-animation', name); } catch (e) {}
    return name;
  }

  // Include this script right after the quote markup: the quote is hidden
  // before the first paint, then plays once it scrolls into view.
  (() => {
    const box = document.querySelector('.reading-quote');
    if (!box) return;
    const q = box.querySelector('.quote-text');
    const source = box.querySelector('.quote-source');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const text = q.textContent.trim().replace(/\s+/g, ' ');
    const name = pickAnimation();
    box.dataset.animation = name;   // handy for checking which one played
    if (source) source.classList.add('rq-hidden');

    // Hold the quote at its final height so nothing around it moves
    q.style.minHeight = q.offsetHeight + 'px';
    q.style.visibility = 'hidden';

    async function start() {
      q.style.visibility = '';
      await play[name](q, text, box);
      if (source) source.classList.remove('rq-hidden');
      q.style.minHeight = '';
    }

    if (!('IntersectionObserver' in window)) return start();
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      start();
    }, { threshold: 0.5 });
    io.observe(q);
  })();

})();
