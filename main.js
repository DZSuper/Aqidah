document.addEventListener('DOMContentLoaded', function () {

  // =============================================
  // ELEMEN
  // =============================================
  const hamburgerBtn   = document.getElementById('hamburgerBtn');
  const sidebar        = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarClose   = document.getElementById('sidebarClose');

  const navMenuUtama   = document.getElementById('navMenuUtama');
  const navPengaturan  = document.getElementById('navPengaturan');
  const navTentang     = document.getElementById('navTentang');

  const panelPengaturan    = document.getElementById('panelPengaturan');
  const panelTentang       = document.getElementById('panelTentang');
  const backFromPengaturan = document.getElementById('backFromPengaturan');
  const backFromTentang    = document.getElementById('backFromTentang');

  const htmlEl = document.documentElement;

  // =============================================
  // SIDEBAR OPEN / CLOSE
  // =============================================
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

  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  // Tutup sidebar dengan ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSidebar();
      closeAllPanels();
    }
  });

  // =============================================
  // NAVIGASI SIDEBAR
  // =============================================
  function setActiveNav(activeBtn) {
    [navMenuUtama, navPengaturan, navTentang].forEach(btn => {
      btn && btn.classList.remove('active');
    });
    if (activeBtn) activeBtn.classList.add('active');
  }

  function closeAllPanels() {
    panelPengaturan.classList.remove('show');
    panelTentang.classList.remove('show');
  }

  navMenuUtama && navMenuUtama.addEventListener('click', function () {
    closeAllPanels();
    setActiveNav(navMenuUtama);
    closeSidebar();
  });

  navPengaturan && navPengaturan.addEventListener('click', function () {
    closeAllPanels();
    panelPengaturan.classList.add('show');
    setActiveNav(navPengaturan);
    closeSidebar();
  });

  navTentang && navTentang.addEventListener('click', function () {
    closeAllPanels();
    panelTentang.classList.add('show');
    setActiveNav(navTentang);
    closeSidebar();
  });

  backFromPengaturan && backFromPengaturan.addEventListener('click', function () {
    panelPengaturan.classList.remove('show');
    setActiveNav(navMenuUtama);
  });

  backFromTentang && backFromTentang.addEventListener('click', function () {
    panelTentang.classList.remove('show');
    setActiveNav(navMenuUtama);
  });

  // =============================================
  // PENGATURAN: TEMA
  // =============================================
  const savedTheme = localStorage.getItem('iai_theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('iai_theme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
  }

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      applyTheme(this.getAttribute('data-theme'));
    });
  });

  // =============================================
  // PENGATURAN: UKURAN TEKS
  // =============================================
  const savedSize = localStorage.getItem('iai_textsize') || 'medium';
  applyTextSize(savedSize);

  function applyTextSize(size) {
    htmlEl.setAttribute('data-textsize', size);
    localStorage.setItem('iai_textsize', size);
    document.querySelectorAll('.size-opt-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-size') === size);
    });
  }

  document.querySelectorAll('.size-opt-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      applyTextSize(this.getAttribute('data-size'));
    });
  });

});
