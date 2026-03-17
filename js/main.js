// =============================================
// Scroll-based fade-in for non-novel pages
// =============================================
if (!document.body.classList.contains('page-novel')) {
  const fadeEls = document.querySelectorAll(
    '.hero-content, .achievement-card, .timeline-item, .work-card, .page-header'
  );
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => observer.observe(el));
}

// =============================================
// Works filter
// =============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    workCards.forEach(card => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// =============================================
// Novel: horizontal scroll via wheel + drag
// =============================================
const novelContainer = document.getElementById('novelContainer');
const progressBar = document.getElementById('progressBar');

if (novelContainer) {
  // Start at the rightmost position (beginning of Japanese text)
  novelContainer.scrollLeft = novelContainer.scrollWidth;

  // Wheel → horizontal scroll (scroll left = read forward in rl text)
  novelContainer.addEventListener('wheel', e => {
    e.preventDefault();
    novelContainer.scrollLeft -= e.deltaY * 2.5;
    updateProgress();
  }, { passive: false });

  // Track scroll progress (scrollLeft=max → beginning, scrollLeft=0 → end)
  function updateProgress() {
    const maxScroll = novelContainer.scrollWidth - novelContainer.clientWidth;
    // Progress increases as we scroll left (toward 0)
    const pct = maxScroll > 0 ? ((maxScroll - novelContainer.scrollLeft) / maxScroll) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';

    // Hide scroll hint once user starts reading
    const hint = document.querySelector('.scroll-hint');
    if (hint && pct > 2) hint.style.opacity = '0';
  }

  novelContainer.addEventListener('scroll', updateProgress);

  // Drag to scroll
  let isDragging = false;
  let startX, scrollStart;

  novelContainer.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX;
    scrollStart = novelContainer.scrollLeft;
    novelContainer.style.cursor = 'grabbing';
    novelContainer.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.pageX - startX;
    novelContainer.scrollLeft = scrollStart + dx; // drag right = scroll right = go back
    updateProgress();
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    novelContainer.style.cursor = 'grab';
    novelContainer.style.userSelect = '';
  });

  // Touch support
  let touchStartX, touchScrollStart;

  novelContainer.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].pageX;
    touchScrollStart = novelContainer.scrollLeft;
  }, { passive: true });

  novelContainer.addEventListener('touchmove', e => {
    const dx = e.touches[0].pageX - touchStartX;
    novelContainer.scrollLeft = touchScrollStart + dx;
    updateProgress();
  }, { passive: true });

  // Font size controls
  const novelText = document.getElementById('novelText');
  let fontSize = 1.0;

  document.getElementById('fontSizeDown')?.addEventListener('click', () => {
    fontSize = Math.max(0.7, fontSize - 0.1);
    novelText.style.fontSize = fontSize + 'rem';
  });

  document.getElementById('fontSizeUp')?.addEventListener('click', () => {
    fontSize = Math.min(1.6, fontSize + 0.1);
    novelText.style.fontSize = fontSize + 'rem';
  });

  // Keyboard: ArrowLeft = read forward, ArrowRight = go back
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      novelContainer.scrollLeft -= 200;
    } else if (e.key === 'ArrowRight') {
      novelContainer.scrollLeft += 200;
    }
    updateProgress();
  });
}

// =============================================
// Nav scroll behavior
// =============================================
const nav = document.querySelector('.nav');
if (nav && !document.body.classList.contains('page-novel')) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.style.boxShadow = '0 1px 16px rgba(0,0,0,0.06)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });
}
