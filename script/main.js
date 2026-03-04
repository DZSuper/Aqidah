// =============================================
// INIT: Terapkan tema sebelum render (cegah flash)
// =============================================
(function () {
  try {
    var t = localStorage.getItem('iai_theme');
    if (t) document.documentElement.setAttribute('data-theme', t);
    var s = localStorage.getItem('iai_textsize');
    if (s) document.documentElement.setAttribute('data-textsize', s);
  } catch (e) {}
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

  var navMenuUtama  = document.getElementById('navMenuUtama');
  var navPengaturan = document.getElementById('navPengaturan');
  var navTentang    = document.getElementById('navTentang');
  var navMasukan    = document.getElementById('navMasukan');
  var navComingSoon = document.getElementById('navComingSoon');

  var panelPengaturan = document.getElementById('panelPengaturan');
  var panelTentang    = document.getElementById('panelTentang');
  var panelMasukan    = document.getElementById('panelMasukan');
  var panelComingSoon = document.getElementById('panelComingSoon');

  var backFromPengaturan = document.getElementById('backFromPengaturan');
  var backFromTentang    = document.getElementById('backFromTentang');
  var backFromMasukan    = document.getElementById('backFromMasukan');
  var backFromComingSoon = document.getElementById('backFromComingSoon');

  if (!hamburgerBtn || !sidebar || !sidebarOverlay) return;

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
  sidebarClose   && sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSidebar(); closeAllPanels(); }
  });

  // ── PANEL SYSTEM ───────────────────────────
  var allPanels = [panelPengaturan, panelTentang, panelMasukan, panelComingSoon];
  var allNavs   = [navMenuUtama, navPengaturan, navTentang, navMasukan, navComingSoon];

  function closeAllPanels() {
    allPanels.forEach(function (p) { p && p.classList.remove('show'); });
  }

  function setActiveNav(el) {
    allNavs.forEach(function (n) { n && n.classList.remove('active'); });
    el && el.classList.add('active');
  }

  function openPanel(panel, nav) {
    closeAllPanels();
    panel && panel.classList.add('show');
    setActiveNav(nav);
    closeSidebar();
  }

  // ── NAV EVENTS ─────────────────────────────
  if (navMenuUtama) {
    navMenuUtama.addEventListener('click', function () {
      closeAllPanels();
      setActiveNav(navMenuUtama);
      closeSidebar();
    });
  }

  if (navPengaturan) {
    navPengaturan.addEventListener('click', function () {
      openPanel(panelPengaturan, navPengaturan);
    });
  }

  if (navTentang) {
    navTentang.addEventListener('click', function () {
      openPanel(panelTentang, navTentang);
    });
  }

  if (navMasukan) {
    navMasukan.addEventListener('click', function () {
      openPanel(panelMasukan, navMasukan);
    });
  }

  if (navComingSoon) {
    navComingSoon.addEventListener('click', function () {
      openPanel(panelComingSoon, navComingSoon);
      var badge = document.getElementById('comingSoonBadge');
      if (badge) badge.style.display = 'none';
      try { localStorage.setItem('cs_visited', '1'); } catch(e) {}
      if (!comingSoonLoaded) loadComingSoon();
    });
  }

  // ── BACK BUTTONS ───────────────────────────
  [
    [backFromPengaturan, navMenuUtama],
    [backFromTentang,    navMenuUtama],
    [backFromMasukan,    navMenuUtama],
    [backFromComingSoon, navMenuUtama]
  ].forEach(function(pair) {
    if (pair[0]) {
      pair[0].addEventListener('click', function () {
        closeAllPanels();
        setActiveNav(pair[1]);
      });
    }
  });


  // ── TAB BAR ────────────────────────────────
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.getAttribute('data-tab');
      tabBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      tabContents.forEach(function(t) { t.classList.remove('active'); });
      var el = document.getElementById('tab-' + target);
      if (el) el.classList.add('active');
      try { localStorage.setItem('iai_active_tab', target); } catch(e) {}
    });
  });

  // Pulihkan tab terakhir
  try {
    var lastTab = localStorage.getItem('iai_active_tab');
    if (lastTab) {
      var lastBtn = document.querySelector('.tab-btn[data-tab="' + lastTab + '"]');
      var lastEl  = document.getElementById('tab-' + lastTab);
      if (lastBtn && lastEl) {
        tabBtns.forEach(function(b) { b.classList.remove('active'); });
        tabContents.forEach(function(t) { t.classList.remove('active'); });
        lastBtn.classList.add('active');
        lastEl.classList.add('active');
      }
    }
  } catch(e) {}

  // ── AUTO BUKA PANEL DARI URL HASH ──────────
  // Digunakan tombol "kembali" dari halaman berita (index.html#coming-soon)
  function checkHash() {
    if (window.location.hash === '#coming-soon') {
      openPanel(panelComingSoon, navComingSoon);
      if (!comingSoonLoaded) loadComingSoon();
      // Bersihkan hash dari URL
      history.replaceState(null, '', window.location.pathname);
    }
  }
  checkHash();
  window.addEventListener('hashchange', checkHash);

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
    btn.addEventListener('click', function () { applyTheme(this.getAttribute('data-theme')); });
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
    btn.addEventListener('click', function () { applyTextSize(this.getAttribute('data-size')); });
  });

  // ── BADGE COMING SOON ──────────────────────
  try {
    var badge = document.getElementById('comingSoonBadge');
    if (badge && localStorage.getItem('cs_visited')) badge.style.display = 'none';
  } catch(e) {}

  // =============================================
  // COMING SOON — KARTU + LOAD
  // =============================================
  var comingSoonLoaded = false;
  var comingSoonBody   = document.getElementById('comingSoonBody');
  var CS_CACHE_KEY     = 'cs_html_cache';

  // Pre-render dari cache SEGERA saat halaman dimuat
  // Sehingga saat panel dibuka, konten sudah siap (tidak ada "Memuat...")
  (function preRender() {
    try {
      var cached = localStorage.getItem(CS_CACHE_KEY);
      if (cached && comingSoonBody) {
        comingSoonBody.innerHTML = cached;
        comingSoonLoaded = true;
      }
    } catch(e) {}
  })();

  function buildComingSoonHtml(data) {
    var out = '<p class="cs-desc">' + data.deskripsi + '</p>';
    out += '<div class="cs-cards">';
    data.berita.forEach(function(berita) {
      var statusHtml = '';
      if (berita.status === 'voting')
        statusHtml = '<span class="cs-status-badge voting">🗳 Voting</span>';
      else if (berita.status === 'selesai')
        statusHtml = '<span class="cs-status-badge done">✓ Selesai</span>';
      else
        statusHtml = '<span class="cs-status-badge">📌 Aktif</span>';

      out += '<a class="cs-news-card" href="' + berita.link + '">' +
        '<div class="cs-news-card-content">' +
          '<div class="cs-news-title">' + berita.judul + '</div>' +
          '<div class="cs-news-desc">'  + berita.deskripsi + '</div>' +
        '</div>' +
        '<div class="cs-news-right">' +
          statusHtml +
          '<span class="cs-news-arrow">›</span>' +
        '</div>' +
      '</a>';
    });
    out += '</div>';
    return out;
  }

  function loadComingSoon() {
    if (!comingSoonBody) return;

    // Cek cache localStorage — persisten lintas halaman & reload
    try {
      var cached = localStorage.getItem(CS_CACHE_KEY);
      if (cached) {
        comingSoonBody.innerHTML = cached;
        comingSoonLoaded = true;
        return; // Langsung tampil, tanpa "Memuat"
      }
    } catch(e) {}

    // Belum ada cache sama sekali — fetch pertama kali
    comingSoonBody.innerHTML = '<div class="cs-loading">Memuat...</div>';

    fetch('konten/coming-soon.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        comingSoonLoaded = true;
        var html = buildComingSoonHtml(data);
        comingSoonBody.innerHTML = html;
        // Simpan ke localStorage agar kembali dari berita langsung tampil
        try { localStorage.setItem(CS_CACHE_KEY, html); } catch(e) {}
      })
      .catch(function() {
        if (comingSoonBody)
          comingSoonBody.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">Gagal memuat konten.</p>';
      });
  }

  // =============================================
  // CATATAN
  // =============================================
  var NOTES_KEY = 'iai_catatan';

  function getNotes() {
    try { return JSON.parse(localStorage.getItem(NOTES_KEY)) || []; } catch(e) { return []; }
  }

  function saveNotes(notes) {
    try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch(e) {}
  }

  function stripHtml(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function formatTanggal(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
  }

  // Warna background kartu
  var CARD_COLORS = [
    { key: 'default', hex: null,      label: 'Default' },
    { key: 'green',   hex: '#0d2b1e', label: 'Hijau' },
    { key: 'navy',    hex: '#0d1b2b', label: 'Biru' },
    { key: 'purple',  hex: '#1e0d2b', label: 'Ungu' },
    { key: 'maroon',  hex: '#2b0d0d', label: 'Merah' },
    { key: 'gold',    hex: '#2b220d', label: 'Emas' },
  ];

  // ── STATE AKSI KARTU ──────────────────────
  var activeActionId = null;

  // Buat bg-popup (singleton color picker)
  var bgPopup = document.createElement('div');
  bgPopup.className = 'catatan-bg-popup';
  bgPopup.id = 'catatanBgPopup';
  var colorStrip = document.createElement('div');
  colorStrip.className = 'catatan-color-strip';
  CARD_COLORS.forEach(function(c) {
    var dot = document.createElement('button');
    dot.className = 'catatan-color-dot';
    dot.setAttribute('data-color', c.key);
    dot.style.background = c.hex || 'rgba(255,255,255,0.06)';
    dot.title = c.label;
    colorStrip.appendChild(dot);
  });
  bgPopup.appendChild(colorStrip);
  document.body.appendChild(bgPopup);

  function closeBgPopup() { bgPopup.classList.remove('show'); }
  document.addEventListener('click', closeBgPopup);
  bgPopup.addEventListener('click', function(e) { e.stopPropagation(); });

  colorStrip.addEventListener('click', function(e) {
    var dot = e.target.closest('.catatan-color-dot');
    if (!dot) return;
    var notes = getNotes();
    var idx = notes.findIndex(function(n) { return n.id === activeActionId; });
    if (idx === -1) return;
    notes[idx].warna = dot.getAttribute('data-color');
    saveNotes(notes);
    closeBgPopup();
    renderCatatanGrid();
  });

  // Dialog rename
  var dlgRename = document.createElement('div');
  dlgRename.className = 'catatan-dialog-overlay';
  dlgRename.innerHTML =
    '<div class="catatan-dialog-box">' +
      '<div class="catatan-dialog-title">Rename Catatan</div>' +
      '<input class="catatan-dialog-input" id="dlgRenameInput" type="text" maxlength="100" placeholder="Judul baru…">' +
      '<div class="catatan-dialog-btns">' +
        '<button class="catatan-dialog-btn cancel" id="dlgRenameCancel">Batal</button>' +
        '<button class="catatan-dialog-btn confirm" id="dlgRenameOk">Simpan</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(dlgRename);

  document.getElementById('dlgRenameCancel').addEventListener('click', function() { dlgRename.classList.remove('show'); });
  document.getElementById('dlgRenameOk').addEventListener('click', function() {
    var notes = getNotes();
    var idx = notes.findIndex(function(n) { return n.id === activeActionId; });
    if (idx !== -1) {
      notes[idx].judul  = document.getElementById('dlgRenameInput').value.trim();
      notes[idx].diubah = Date.now();
      saveNotes(notes);
    }
    dlgRename.classList.remove('show');
    renderCatatanGrid();
  });
  document.getElementById('dlgRenameInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') document.getElementById('dlgRenameOk').click();
  });
  dlgRename.addEventListener('click', function(e) { if (e.target === dlgRename) dlgRename.classList.remove('show'); });

  // Dialog hapus
  var dlgHapus = document.createElement('div');
  dlgHapus.className = 'catatan-dialog-overlay';
  dlgHapus.innerHTML =
    '<div class="catatan-dialog-box">' +
      '<div class="catatan-dialog-title">Hapus Catatan?</div>' +
      '<div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:18px;line-height:1.5">Catatan ini akan dihapus permanen dan tidak bisa dikembalikan.</div>' +
      '<div class="catatan-dialog-btns">' +
        '<button class="catatan-dialog-btn cancel" id="dlgHapusCancel">Batal</button>' +
        '<button class="catatan-dialog-btn danger" id="dlgHapusOk">Hapus</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(dlgHapus);

  document.getElementById('dlgHapusCancel').addEventListener('click', function() { dlgHapus.classList.remove('show'); });
  document.getElementById('dlgHapusOk').addEventListener('click', function() {
    saveNotes(getNotes().filter(function(n) { return n.id !== activeActionId; }));
    dlgHapus.classList.remove('show');
    renderCatatanGrid();
  });
  dlgHapus.addEventListener('click', function(e) { if (e.target === dlgHapus) dlgHapus.classList.remove('show'); });

  // Dialog duplikat
  var dlgDuplikat = document.createElement('div');
  dlgDuplikat.className = 'catatan-dialog-overlay';
  dlgDuplikat.innerHTML =
    '<div class="catatan-dialog-box">' +
      '<div class="catatan-dialog-title">Duplikat Catatan?</div>' +
      '<div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:18px;line-height:1.5">Catatan ini akan diduplikat dengan isi yang sama.</div>' +
      '<div class="catatan-dialog-btns">' +
        '<button class="catatan-dialog-btn cancel" id="dlgDuplikatCancel">Batal</button>' +
        '<button class="catatan-dialog-btn confirm" id="dlgDuplikatOk">Duplikat</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(dlgDuplikat);

  document.getElementById('dlgDuplikatCancel').addEventListener('click', function() { dlgDuplikat.classList.remove('show'); });
  document.getElementById('dlgDuplikatOk').addEventListener('click', function() {
    var notes = getNotes();
    var src = notes.find(function(n) { return n.id === activeActionId; });
    if (src) {
      var newNote = {
        id: 'note_' + Date.now(),
        judul: src.judul ? src.judul + ' (Salinan)' : 'Salinan',
        isi: src.isi,
        warna: src.warna,
        dibuat: Date.now(),
        diubah: Date.now(),
        pernahDisimpan: true
      };
      notes.unshift(newNote);
      saveNotes(notes);
    }
    dlgDuplikat.classList.remove('show');
    renderCatatanGrid();
  });
  dlgDuplikat.addEventListener('click', function(e) { if (e.target === dlgDuplikat) dlgDuplikat.classList.remove('show'); });

  function renderCatatanGrid() {
    var notes = getNotes();
    var grid  = document.getElementById('catatanGrid');
    var empty = document.getElementById('catatanEmptyState');
    if (!grid || !empty) return;

    if (notes.length === 0) {
      empty.style.display = '';
      grid.innerHTML = '';
      return;
    }
    empty.style.display = 'none';

    function getBgColor(key) {
      var c = CARD_COLORS.find(function(x) { return x.key === key; });
      return (c && c.hex) ? c.hex : null;
    }

    grid.innerHTML = notes.map(function(n) {
      var preview = stripHtml(n.isi).trim().slice(0, 120);
      if (!preview) preview = '(kosong)';
      var bgStyle   = n.warna && n.warna !== 'default' ? getBgColor(n.warna) : null;
      var styleAttr = bgStyle ? ' style="background:' + bgStyle + '"' : '';
      var favClass  = n.favorit ? ' favorit' : '';
      var id = n.id;
      return '<div class="catatan-card' + favClass + '" data-id="' + id + '"' + styleAttr + '>' +
        '<span class="catatan-star" title="Favorit">⭐</span>' +
        '<div class="catatan-card-judul">' + (n.judul || 'Tanpa Judul') + '</div>' +
        '<div class="catatan-card-preview">' + preview + '</div>' +
        '<div class="catatan-card-footer">' +
          '<span class="catatan-card-meta">' + formatTanggal(n.diubah) + '</span>' +
          '<div class="catatan-card-actions">' +
            '<button class="catatan-act-btn act-hapus"    data-id="' + id + '" title="Hapus">🗑</button>' +
            '<button class="catatan-act-btn act-rename"   data-id="' + id + '" title="Rename">✏️</button>' +
            '<button class="catatan-act-btn act-bg"       data-id="' + id + '" title="Warna">🎨</button>' +
            '<button class="catatan-act-btn act-duplikat" data-id="' + id + '" title="Duplikat">⧉</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    grid.querySelectorAll('.catatan-card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (e.target.closest('.catatan-card-actions') || e.target.closest('.catatan-star')) return;
        window.location.href = 'catatan/editor.html?id=' + card.getAttribute('data-id');
      });
    });

    grid.querySelectorAll('.catatan-star').forEach(function(star) {
      star.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = star.closest('.catatan-card').getAttribute('data-id');
        var notes = getNotes();
        var idx = notes.findIndex(function(n) { return n.id === id; });
        if (idx === -1) return;
        notes[idx].favorit = !notes[idx].favorit;
        notes.sort(function(a, b) { return (b.favorit ? 1 : 0) - (a.favorit ? 1 : 0); });
        saveNotes(notes);
        renderCatatanGrid();
      });
    });

    grid.querySelectorAll('.act-hapus').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        activeActionId = btn.getAttribute('data-id');
        dlgHapus.classList.add('show');
      });
    });

    grid.querySelectorAll('.act-rename').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        activeActionId = btn.getAttribute('data-id');
        var note = getNotes().find(function(n) { return n.id === activeActionId; });
        var input = document.getElementById('dlgRenameInput');
        input.value = note ? (note.judul || '') : '';
        dlgRename.classList.add('show');
        setTimeout(function() { input.focus(); input.select(); }, 100);
      });
    });

    grid.querySelectorAll('.act-bg').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        activeActionId = btn.getAttribute('data-id');
        var note = getNotes().find(function(n) { return n.id === activeActionId; });
        colorStrip.querySelectorAll('.catatan-color-dot').forEach(function(dot) {
          dot.classList.toggle('active', dot.getAttribute('data-color') === (note && note.warna || 'default'));
        });
        var rect = btn.getBoundingClientRect();
        bgPopup.classList.add('show');
        var popW = bgPopup.offsetWidth || 220;
        var left = Math.min(rect.left, window.innerWidth - popW - 8);
        var top  = rect.bottom + 6;
        if (top + 80 > window.innerHeight) top = rect.top - 70;
        bgPopup.style.left = left + 'px';
        bgPopup.style.top  = top  + 'px';
      });
    });

    grid.querySelectorAll('.act-duplikat').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        activeActionId = btn.getAttribute('data-id');
        dlgDuplikat.classList.add('show');
      });
    });
  }

  // FAB: hanya tampil di tab catatan
  var fabWrap = document.getElementById('catatanFab');
  var fabBtn  = document.getElementById('catatanFabBtn');
  var fabMenu = document.getElementById('catatanFabMenu');
  var fabOpen = false;

  function updateFabVisibility() {
    var activeTab = document.querySelector('.tab-btn.active');
    if (fabWrap) {
      fabWrap.style.display = (activeTab && activeTab.getAttribute('data-tab') === 'catatan') ? '' : 'none';
    }
  }

  function closeFabMenu() {
    fabOpen = false;
    if (fabMenu) fabMenu.classList.remove('open');
    if (fabBtn)  fabBtn.classList.remove('open');
  }

  if (fabBtn) {
    fabBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      fabOpen = !fabOpen;
      fabMenu.classList.toggle('open', fabOpen);
      fabBtn.classList.toggle('open', fabOpen);
    });
  }

  document.addEventListener('click', function() { closeFabMenu(); });
  if (fabMenu) fabMenu.addEventListener('click', function(e) { e.stopPropagation(); });

  var btnTambah = document.getElementById('btnTambahCatatan');
  if (btnTambah) {
    btnTambah.addEventListener('click', function() {
      var id = 'note_' + Date.now();
      var notes = getNotes();
      notes.unshift({ id: id, judul: '', isi: '', dibuat: Date.now(), diubah: Date.now(), pernahDisimpan: false });
      saveNotes(notes);
      window.location.href = 'catatan/editor.html?id=' + id;
    });
  }

  // Hook tab switching untuk update FAB & render grid
  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      setTimeout(function() {
        updateFabVisibility();
        var active = document.querySelector('.tab-btn.active');
        if (active && active.getAttribute('data-tab') === 'catatan') {
          renderCatatanGrid();
        }
      }, 10);
    });
  });

  // Init
  updateFabVisibility();
  renderCatatanGrid();

  // Handle bfcache: re-run tab restoration & grid render tanpa reload.
  // Reload loop di WebView (SPCK) bisa terjadi jika pakai window.location.reload().
  window.addEventListener('pageshow', function(e) {
    if (!e.persisted) return;
    // Restore tab aktif
    try {
      var t = localStorage.getItem('iai_active_tab');
      if (t) {
        var tBtn = document.querySelector('.tab-btn[data-tab="' + t + '"]');
        var tEl  = document.getElementById('tab-' + t);
        if (tBtn && tEl) {
          tabBtns.forEach(function(b) { b.classList.remove('active'); });
          tabContents.forEach(function(c) { c.classList.remove('active'); });
          tBtn.classList.add('active');
          tEl.classList.add('active');
        }
      }
    } catch(e) {}
    updateFabVisibility();
    renderCatatanGrid();
  });

});
