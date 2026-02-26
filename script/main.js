// =============================================
// INIT: Terapkan tema sebelum render (cegah flash)
// =============================================
(function () {
  try {
    var t = localStorage.getItem('iai_theme');
    if (t) document.documentElement.setAttribute('data-theme', t);
    var s = localStorage.getItem('iai_textsize');
    if (s) document.documentElement.setAttribute('data-textsize', s);
  } catch (e) { /* localStorage mungkin diblokir */ }
})();

// =============================================
// MAIN LOGIC
// =============================================
document.addEventListener('DOMContentLoaded', function () {

  var html           = document.documentElement;
  var hamburgerBtn   = document.getElementById('hamburgerBtn');
  var sidebar        = document.getElementById('sidebar');
  var sidebarOverlay = document.getElementById('sidebarOverlay');
  var sidebarClose   = document.getElementById('sidebarClose');
  var navMenuUtama   = document.getElementById('navMenuUtama');
  var navPengaturan  = document.getElementById('navPengaturan');
  var navTentang     = document.getElementById('navTentang');
  var panelPengaturan   = document.getElementById('panelPengaturan');
  var panelTentang      = document.getElementById('panelTentang');
  var backFromPengaturan= document.getElementById('backFromPengaturan');
  var backFromTentang   = document.getElementById('backFromTentang');

  // Guard: pastikan elemen utama tersedia
  if (!hamburgerBtn || !sidebar || !sidebarOverlay) {
    console.error('[main.js] Elemen sidebar tidak ditemukan di DOM.');
    return;
  }

  // ── SIDEBAR ────────────────────────────────
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
    hamburgerBtn.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
    hamburgerBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', function () {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  sidebarClose  && sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSidebar(); closeAllPanels(); }
  });

  // ── PANEL ──────────────────────────────────
  function closeAllPanels() {
    panelPengaturan && panelPengaturan.classList.remove('show');
    panelTentang    && panelTentang.classList.remove('show');
  }

  function setActiveNav(el) {
    [navMenuUtama, navPengaturan, navTentang].forEach(function (n) {
      n && n.classList.remove('active');
    });
    el && el.classList.add('active');
  }

  if (navMenuUtama) {
    navMenuUtama.addEventListener('click', function () {
      closeAllPanels();
      setActiveNav(navMenuUtama);
      closeSidebar();
    });
  }

  if (navPengaturan) {
    navPengaturan.addEventListener('click', function () {
      closeAllPanels();
      panelPengaturan && panelPengaturan.classList.add('show');
      setActiveNav(navPengaturan);
      closeSidebar();
    });
  }

  if (navTentang) {
    navTentang.addEventListener('click', function () {
      closeAllPanels();
      panelTentang && panelTentang.classList.add('show');
      setActiveNav(navTentang);
      closeSidebar();
    });
  }

  if (backFromPengaturan) {
    backFromPengaturan.addEventListener('click', function () {
      panelPengaturan && panelPengaturan.classList.remove('show');
      setActiveNav(navMenuUtama);
    });
  }

  if (backFromTentang) {
    backFromTentang.addEventListener('click', function () {
      panelTentang && panelTentang.classList.remove('show');
      setActiveNav(navMenuUtama);
    });
  }

  // ── TEMA ───────────────────────────────────
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('iai_theme', theme); } catch (e) {}
    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
  }

  applyTheme(html.getAttribute('data-theme') || 'dark');

  document.querySelectorAll('.theme-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(this.getAttribute('data-theme'));
    });
  });

  // ── UKURAN TEKS ────────────────────────────
  function applyTextSize(size) {
    html.setAttribute('data-textsize', size);
    try { localStorage.setItem('iai_textsize', size); } catch (e) {}
    document.querySelectorAll('.size-opt-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-size') === size);
    });
  }

  applyTextSize(html.getAttribute('data-textsize') || 'medium');

  document.querySelectorAll('.size-opt-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTextSize(this.getAttribute('data-size'));
    });
  });

});
