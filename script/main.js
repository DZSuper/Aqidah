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
  var navMasukan        = document.getElementById('navMasukan');
  var panelMasukan      = document.getElementById('panelMasukan');
  var backFromMasukan   = document.getElementById('backFromMasukan');

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
    panelMasukan    && panelMasukan.classList.remove('show');
  }

  function setActiveNav(el) {
    [navMenuUtama, navPengaturan, navTentang, navMasukan].forEach(function (n) {
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

  if (navMasukan) {
    navMasukan.addEventListener('click', function () {
      closeAllPanels();
      panelMasukan && panelMasukan.classList.add('show');
      setActiveNav(navMasukan);
      closeSidebar();
    });
  }

  if (backFromMasukan) {
    backFromMasukan.addEventListener('click', function () {
      panelMasukan && panelMasukan.classList.remove('show');
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

// =============================================
// COMING SOON
// =============================================
(function() {
  var navComingSoon      = document.getElementById('navComingSoon');
  var panelComingSoon    = document.getElementById('panelComingSoon');
  var backFromComingSoon = document.getElementById('backFromComingSoon');
  var comingSoonBody     = document.getElementById('comingSoonBody');
  var comingSoonLoaded   = false;

  // Sembunyikan badge setelah pernah dibuka
  var badgeEl = document.getElementById('comingSoonBadge');
  try {
    if (localStorage.getItem('cs_visited')) {
      if (badgeEl) badgeEl.style.display = 'none';
    }
  } catch(e) {}

  function closeAllPanelsCS() {
    document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('show'); });
  }

  function setActiveNavCS(el) {
    document.querySelectorAll('.sidebar-item').forEach(function(n) { n.classList.remove('active'); });
    if (el) el.classList.add('active');
  }

  if (navComingSoon) {
    navComingSoon.addEventListener('click', function() {
      closeAllPanelsCS();
      panelComingSoon && panelComingSoon.classList.add('show');
      setActiveNavCS(navComingSoon);
      // Sembunyikan badge
      try { localStorage.setItem('cs_visited', '1'); } catch(e) {}
      if (badgeEl) badgeEl.style.display = 'none';
      // Sidebar harus ditutup dulu
      var sidebar = document.getElementById('sidebar');
      var sidebarOverlay = document.getElementById('sidebarOverlay');
      var hamburgerBtn = document.getElementById('hamburgerBtn');
      if (sidebar) sidebar.classList.remove('open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('show');
      if (hamburgerBtn) hamburgerBtn.classList.remove('open');
      document.body.style.overflow = '';
      // Load konten
      if (!comingSoonLoaded) loadComingSoon();
    });
  }

  if (backFromComingSoon) {
    backFromComingSoon.addEventListener('click', function() {
      panelComingSoon && panelComingSoon.classList.remove('show');
      var navMenuUtama = document.getElementById('navMenuUtama');
      setActiveNavCS(navMenuUtama);
    });
  }

  function getVotes() {
    try { return JSON.parse(localStorage.getItem('cs_votes') || '{}'); } catch(e) { return {}; }
  }

  function saveVotes(votes) {
    try { localStorage.setItem('cs_votes', JSON.stringify(votes)); } catch(e) {}
  }

  function getVoteCounts() {
    try { return JSON.parse(localStorage.getItem('cs_vote_counts') || '{}'); } catch(e) { return {}; }
  }

  function saveVoteCounts(counts) {
    try { localStorage.setItem('cs_vote_counts', JSON.stringify(counts)); } catch(e) {}
  }

  function submitToNetlify(templateId, voteType) {
    var formData = new FormData();
    formData.append('form-name', 'template-vote');
    formData.append('template_id', templateId);
    formData.append('vote_type', voteType);
    fetch('/', { method: 'POST', body: formData }).catch(function() {});
  }

  function renderVoteButtons(itemId, container) {
    var votes = getVotes();
    var counts = getVoteCounts();
    var userVote = votes[itemId] || null;
    var likeCount = counts[itemId + '_like'] || 0;
    var dislikeCount = counts[itemId + '_dislike'] || 0;

    var html = '<div class="cs-vote-row">';
    html += '<button class="cs-vote-btn cs-like' + (userVote === 'like' ? ' voted' : '') + '" data-id="' + itemId + '" data-type="like">';
    html += '<span class="cs-vote-icon">👍</span> <span class="cs-vote-count">' + likeCount + '</span></button>';
    html += '<button class="cs-vote-btn cs-dislike' + (userVote === 'dislike' ? ' voted' : '') + '" data-id="' + itemId + '" data-type="dislike">';
    html += '<span class="cs-vote-icon">👎</span> <span class="cs-vote-count">' + dislikeCount + '</span></button>';
    if (userVote) {
      html += '<span class="cs-voted-label">Suaramu tersimpan ✓</span>';
    }
    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('.cs-vote-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        var type = this.getAttribute('data-type');
        var currentVote = getVotes()[id];
        var currentCounts = getVoteCounts();

        // Cabut vote lama jika ada
        if (currentVote) {
          currentCounts[id + '_' + currentVote] = Math.max(0, (currentCounts[id + '_' + currentVote] || 0) - 1);
        }

        if (currentVote === type) {
          // Klik sama = batalkan vote
          var newVotes = getVotes();
          delete newVotes[id];
          saveVotes(newVotes);
        } else {
          // Vote baru
          var newVotes2 = getVotes();
          newVotes2[id] = type;
          saveVotes(newVotes2);
          currentCounts[id + '_' + type] = (currentCounts[id + '_' + type] || 0) + 1;
          submitToNetlify(id, type);
        }

        saveVoteCounts(currentCounts);
        renderVoteButtons(id, container);
      });
    });
  }

  function loadComingSoon() {
    fetch('konten/coming-soon.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        comingSoonLoaded = true;
        var html = '<div class="cs-header">';
        html += '<p class="cs-desc">' + data.deskripsi + '</p></div>';

        data.berita.forEach(function(berita) {
          html += '<div class="cs-berita">';
          html += '<h3 class="cs-berita-judul">' + berita.judul + '</h3>';
          html += '<p class="cs-berita-desc">' + berita.deskripsi + '</p>';

          if (berita.status === 'voting') {
            html += '<div class="cs-vote-hint">👆 Tap template untuk melihat • Beri suaramu!</div>';
          }

          if (berita.items) {
            berita.items.forEach(function(item) {
              html += '<div class="cs-item" id="cs-item-' + item.id + '">';
              html += '<div class="cs-item-header">';
              html += '<a class="cs-item-link" href="' + item.link + '" target="_blank">';
              html += '<div class="cs-item-name">' + item.nama + ' <span class="cs-link-icon">↗</span></div>';
              html += '<div class="cs-item-sub">' + item.subjudul + '</div></a>';
              html += '</div>';
              html += '<p class="cs-item-desc">' + item.deskripsi + '</p>';
              html += '<div class="cs-vote-wrap" id="vote-' + item.id + '"></div>';
              html += '</div>';
            });
          }
          html += '</div>';
        });

        comingSoonBody.innerHTML = html;

        // Render vote buttons untuk setiap item
        data.berita.forEach(function(berita) {
          if (berita.items) {
            berita.items.forEach(function(item) {
              var voteWrap = document.getElementById('vote-' + item.id);
              if (voteWrap) renderVoteButtons(item.id, voteWrap);
            });
          }
        });
      })
      .catch(function() {
        comingSoonBody.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">Gagal memuat konten.</p>';
      });
  }
})();
