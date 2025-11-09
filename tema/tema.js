// Interaktivitas untuk halaman tema dengan 3 halaman (Default, Editing, Catatan)
document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // AMBIL ELEMEN-ELEMEN
  // ===================================
  const pageButtons = document.querySelectorAll('.page-btn');
  const pageContainers = document.querySelectorAll('.page-container');
  const defaultBtn = document.getElementById('defaultBtn');
  const editBtn = document.getElementById('editBtn');
  const catatanContent = document.getElementById('catatanContent');
  const catatanModeBtn = document.getElementById('catatanModeBtn');
  const catatanToolbar = document.getElementById('catatanToolbar');
  
  // Dapatkan nama halaman untuk key localStorage yang unik
  const pageName = document.title.split('|')[0].trim();
  const storageKeyEditing = `aqidah_editing_${pageName.toLowerCase().replace(/\s+/g, '_')}`;
  const storageKeyCatatan = `aqidah_catatan_${pageName.toLowerCase().replace(/\s+/g, '_')}`;
  
  // State management
  let currentPage = 1;
  let isEditing = false;
  let isCatatanEditMode = false;
  let currentKelompok = {1: 'ahlussunnah', 2: 'ahlussunnah'};
  
  // ===================================
  // BUAT INDIKATOR TERSIMPAN
  // ===================================
  const saveIndicator = document.createElement('div');
  saveIndicator.className = 'save-indicator';
  saveIndicator.textContent = '✓ Tersimpan';
  document.body.appendChild(saveIndicator);
  
  // Fungsi untuk menampilkan indikator tersimpan
  function showSaveIndicator() {
    saveIndicator.classList.add('show');
    setTimeout(() => {
      saveIndicator.classList.remove('show');
    }, 2000);
  }
  
  // ===================================
  // SIMPAN KONTEN ORIGINAL
  // ===================================
  const originalContent = {};
  document.querySelectorAll('#page2 .penjelasan-item').forEach(item => {
    const kelompok = item.getAttribute('data-kelompok');
    originalContent[kelompok] = item.innerHTML;
  });
  
  // ===================================
  // FUNGSI: Load dari localStorage
  // ===================================
  function loadFromStorage() {
    // Load editing content (Halaman 2)
    const savedEditing = localStorage.getItem(storageKeyEditing);
    if (savedEditing) {
      try {
        const data = JSON.parse(savedEditing);
        document.querySelectorAll('#page2 .penjelasan-item').forEach(item => {
          const kelompok = item.getAttribute('data-kelompok');
          if (data[kelompok]) {
            item.innerHTML = data[kelompok];
          }
        });
      } catch (e) {
        console.error('Error loading editing content:', e);
      }
    }
    
    // Load catatan content (Halaman 3)
    const savedCatatan = localStorage.getItem(storageKeyCatatan);
    if (savedCatatan && catatanContent) {
      catatanContent.innerHTML = savedCatatan;
    }
  }
  
  // ===================================
  // FUNGSI: Simpan ke localStorage
  // ===================================
  function saveEditingToStorage() {
    const data = {};
    document.querySelectorAll('#page2 .penjelasan-item').forEach(item => {
      const kelompok = item.getAttribute('data-kelompok');
      data[kelompok] = item.innerHTML;
    });
    localStorage.setItem(storageKeyEditing, JSON.stringify(data));
    showSaveIndicator();
  }
  
  function saveCatatanToStorage() {
    if (catatanContent) {
      localStorage.setItem(storageKeyCatatan, catatanContent.innerHTML);
      showSaveIndicator();
    }
  }
  
  // ===================================
  // FUNGSI: Reset ke default
  // ===================================
  function resetToDefault() {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua penjelasan ke kondisi awal? Semua perubahan yang Anda buat akan hilang.')) {
      document.querySelectorAll('#page2 .penjelasan-item').forEach(item => {
        const kelompok = item.getAttribute('data-kelompok');
        item.innerHTML = originalContent[kelompok];
        item.contentEditable = false;
      });
      localStorage.removeItem(storageKeyEditing);
      isEditing = false;
      editBtn.textContent = 'EDIT';
      editBtn.classList.remove('editing');
      alert('Semua penjelasan telah dikembalikan ke kondisi awal!');
    }
  }
  
  // ===================================
  // FUNGSI: Toggle Edit Mode (Halaman 2)
  // ===================================
  function toggleEditMode() {
    isEditing = !isEditing;
    
    if (isEditing) {
      editBtn.textContent = 'SAVE';
      editBtn.classList.add('editing');
      
      const activeItem = document.querySelector('#page2 .penjelasan-item.active');
      if (activeItem) {
        activeItem.contentEditable = true;
        activeItem.focus();
      }
    } else {
      editBtn.textContent = 'EDIT';
      editBtn.classList.remove('editing');
      
      document.querySelectorAll('#page2 .penjelasan-item').forEach(item => {
        item.contentEditable = false;
      });
      
      saveEditingToStorage();
    }
  }
  
  // ===================================
  // FUNGSI: Toggle Mode Catatan (Halaman 3)
  // ===================================
  function toggleCatatanMode() {
    if (!catatanModeBtn || !catatanContent) return;
    
    isCatatanEditMode = !isCatatanEditMode;
    
    if (isCatatanEditMode) {
      // Mode Edit
      catatanModeBtn.textContent = 'MODE: EDIT';
      catatanModeBtn.classList.add('active');
      catatanContent.contentEditable = true;
      catatanToolbar.classList.add('show');
      catatanContent.focus();
    } else {
      // Mode Baca
      catatanModeBtn.textContent = 'MODE: BACA';
      catatanModeBtn.classList.remove('active');
      catatanContent.contentEditable = false;
      catatanToolbar.classList.remove('show');
      saveCatatanToStorage();
    }
  }
  
  // ===================================
  // FUNGSI: Apply Style ke Catatan
  // ===================================
  function applyNoteStyle(styleType) {
    if (!isCatatanEditMode) return;
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    
    // Jika tidak ada teks yang dipilih, buat elemen baru
    if (range.collapsed) {
      const newElement = document.createElement('div');
      newElement.className = `catatan-${styleType}`;
      
      // Teks placeholder berdasarkan jenis
      const placeholders = {
        'judul': 'Judul Catatan',
        'bab': 'BAB I - Nama Bab',
        'subbab': 'Sub-bab',
        'biasa': 'Tulis catatan biasa di sini...',
        'penting': '⚠ Catatan penting'
      };
      
      newElement.textContent = placeholders[styleType] || 'Teks';
      
      // Insert element
      range.insertNode(newElement);
      
      // Pindahkan kursor ke dalam elemen baru
      range.selectNodeContents(newElement);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Jika ada teks yang dipilih, wrap dengan style
      const selectedText = range.toString();
      const wrapper = document.createElement('div');
      wrapper.className = `catatan-${styleType}`;
      wrapper.textContent = selectedText;
      
      range.deleteContents();
      range.insertNode(wrapper);
    }
    
    catatanContent.focus();
  }
  
  // ===================================
  // FUNGSI: Ganti Halaman
  // ===================================
  function gantiHalaman(pageNum) {
    currentPage = pageNum;
    
    pageContainers.forEach(container => {
      container.classList.remove('active');
    });
    document.getElementById(`page${pageNum}`).classList.add('active');
    
    pageButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`.page-btn[data-page="${pageNum}"]`).classList.add('active');
    
    // Show/hide default button (hanya tampil di halaman 2)
    if (pageNum === 2) {
      defaultBtn.style.display = 'inline-block';
    } else {
      defaultBtn.style.display = 'none';
    }
    
    // Reset edit mode jika pindah dari halaman 2
    if (pageNum !== 2 && isEditing) {
      isEditing = false;
      editBtn.textContent = 'EDIT';
      editBtn.classList.remove('editing');
      document.querySelectorAll('#page2 .penjelasan-item').forEach(item => {
        item.contentEditable = false;
      });
    }
    
    // Reset mode catatan ke "Baca" saat masuk ke halaman 3
    if (pageNum === 3 && isCatatanEditMode) {
      isCatatanEditMode = true; // Set true dulu agar toggle berhasil
      toggleCatatanMode(); // Akan toggle ke mode baca
    }
  }
  
  // ===================================
  // FUNGSI: Ganti Penjelasan
  // ===================================
  function gantiPenjelasan(kelompok, pageNum) {
    currentKelompok[pageNum] = kelompok;
    
    const container = document.getElementById(`page${pageNum}`);
    const items = container.querySelectorAll('.penjelasan-item');
    const buttons = container.querySelectorAll('.kelompok-btn');
    const dropdown = container.querySelector('.kelompok-dropdown');
    
    items.forEach(item => {
      item.classList.remove('active');
      item.contentEditable = false;
    });
    
    buttons.forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeItem = container.querySelector(`.penjelasan-item[data-kelompok="${kelompok}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
      
      if (pageNum === 2 && isEditing) {
        activeItem.contentEditable = true;
      }
    }
    
    const activeButton = container.querySelector(`.kelompok-btn[data-kelompok="${kelompok}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
    
    if (dropdown) {
      dropdown.value = kelompok;
    }
    
    if (window.innerWidth <= 768) {
      const penjelasanSection = container.querySelector('.penjelasan-section');
      if (penjelasanSection) {
        penjelasanSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  }
  
  // ===================================
  // EVENT LISTENER: Page Buttons
  // ===================================
  pageButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const pageNum = parseInt(this.getAttribute('data-page'));
      gantiHalaman(pageNum);
    });
  });
  
  // ===================================
  // EVENT LISTENER: Kelompok Buttons
  // ===================================
  document.querySelectorAll('.kelompok-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const kelompok = this.getAttribute('data-kelompok');
      const pageNum = parseInt(this.getAttribute('data-page'));
      gantiPenjelasan(kelompok, pageNum);
    });
  });
  
  // ===================================
  // EVENT LISTENER: Dropdowns (Mobile)
  // ===================================
  document.querySelectorAll('.kelompok-dropdown').forEach(dropdown => {
    dropdown.addEventListener('change', function() {
      const kelompok = this.value;
      const pageNum = parseInt(this.id.replace('kelompokSelect', ''));
      gantiPenjelasan(kelompok, pageNum);
    });
  });
  
  // ===================================
  // EVENT LISTENER: Tombol Edit (Halaman 2)
  // ===================================
  if (editBtn) {
    editBtn.addEventListener('click', toggleEditMode);
  }
  
  // ===================================
  // EVENT LISTENER: Tombol Default
  // ===================================
  if (defaultBtn) {
    defaultBtn.addEventListener('click', resetToDefault);
  }
  
  // ===================================
  // EVENT LISTENER: Mode Catatan (Halaman 3)
  // ===================================
  if (catatanModeBtn) {
    catatanModeBtn.addEventListener('click', toggleCatatanMode);
  }
  
  // ===================================
  // EVENT LISTENER: Style Buttons (Halaman 3)
  // ===================================
  const styleButtons = {
    'judulBtn': 'judul',
    'babBtn': 'bab',
    'subbabBtn': 'subbab',
    'biasaBtn': 'biasa',
    'pentingBtn': 'penting'
  };
  
  Object.keys(styleButtons).forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', function() {
        applyNoteStyle(styleButtons[btnId]);
      });
    }
  });
  
  // ===================================
  // KEYBOARD NAVIGATION (Accessibility)
  // ===================================
  document.querySelectorAll('.kelompok-btn').forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const kelompok = this.getAttribute('data-kelompok');
        const pageNum = parseInt(this.getAttribute('data-page'));
        gantiPenjelasan(kelompok, pageNum);
      }
    });
  });
  
  // ===================================
  // AUTO-SAVE untuk Halaman 2 (saat edit)
  // ===================================
  let autoSaveTimeout;
  document.querySelectorAll('#page2 .penjelasan-item').forEach(item => {
    item.addEventListener('input', function() {
      if (isEditing) {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
          saveEditingToStorage();
        }, 2000);
      }
    });
  });
  
  // ===================================
  // AUTO-SAVE untuk Halaman 3 (Catatan)
  // ===================================
  let catatanSaveTimeout;
  if (catatanContent) {
    catatanContent.addEventListener('input', function() {
      if (isCatatanEditMode) {
        clearTimeout(catatanSaveTimeout);
        catatanSaveTimeout = setTimeout(() => {
          saveCatatanToStorage();
        }, 2000);
      }
    });
  }
  
  // ===================================
  // KEYBOARD SHORTCUTS untuk Catatan
  // ===================================
  if (catatanContent) {
    catatanContent.addEventListener('keydown', function(e) {
      if (!isCatatanEditMode) return;
      
      // Ctrl + 1 = Judul
      if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        applyNoteStyle('judul');
      }
      // Ctrl + 2 = BAB
      else if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        applyNoteStyle('bab');
      }
      // Ctrl + 3 = Sub-bab
      else if (e.ctrlKey && e.key === '3') {
        e.preventDefault();
        applyNoteStyle('subbab');
      }
      // Ctrl + 4 = Biasa
      else if (e.ctrlKey && e.key === '4') {
        e.preventDefault();
        applyNoteStyle('biasa');
      }
      // Ctrl + 5 = Penting
      else if (e.ctrlKey && e.key === '5') {
        e.preventDefault();
        applyNoteStyle('penting');
      }
    });
  }
  
  // ===================================
  // INISIALISASI: Load dari storage & Set halaman awal
  // ===================================
  loadFromStorage();
  gantiHalaman(1); // Mulai dari halaman 1 (Default)
  
});