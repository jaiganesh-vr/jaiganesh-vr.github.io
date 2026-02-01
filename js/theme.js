(function() {
  // 1. Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let currentTheme = 'dark'; // Default
  if (savedTheme) {
    currentTheme = savedTheme;
  } else if (!systemPrefersDark) {
    // If system prefers light, could default to light, but site default is dark.
    // Let's stick to site default (dark) unless explicitly switched?
    // Or user asked for toggle. Let's respect saved, otherwise default dark.
    currentTheme = 'dark';
  }

  // 2. Apply theme immediately
  document.documentElement.setAttribute('data-theme', currentTheme);

  // 3. Toggle Function
  window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  };

  function updateIcon(theme) {
    const sunIcon = document.getElementById('icon-sun');
    const moonIcon = document.getElementById('icon-moon');
    if (!sunIcon || !moonIcon) return;

    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  // 4. Initialize Icon on load
  document.addEventListener('DOMContentLoaded', () => {
    updateIcon(currentTheme);
    
    // Attach event listener if button exists (in case not inline onClick)
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.addEventListener('click', window.toggleTheme);
    }
  });

})();
