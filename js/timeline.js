(function() {
  // Timeline map: moves the marker on the map to the year being read.
  // The dots and rows work without this; they are plain links and anchors.

  const marker = document.getElementById('marker');
  const map = document.querySelector('.sticky-map');
  if (!marker || !map) return;

  const rows = Array.from(document.querySelectorAll('.tl-row'));
  const dots = Array.from(document.querySelectorAll('.pt'));
  const dotX = Object.fromEntries(dots.map(dot => [dot.dataset.y, dot.dataset.x]));

  function track() {
    const line = map.getBoundingClientRect().bottom + 40;
    let year = rows[0].dataset.y;
    for (const row of rows) {
      if (row.getBoundingClientRect().top > line) break;
      year = row.dataset.y;
    }
    marker.setAttribute('x1', dotX[year]);
    marker.setAttribute('x2', dotX[year]);
    dots.forEach(dot => dot.classList.toggle('on', dot.dataset.y === year));
  }

  window.addEventListener('scroll', track, { passive: true });
  window.addEventListener('resize', track);
  track();

})();
