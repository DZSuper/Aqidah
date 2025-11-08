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
  
  // Dapatkan nama halaman untuk key localStorage yang unik
  const pageName = document.title.split('|')[0].trim();
  const storageKeyEditing = `aqidah_editing_${pageName.toLowerCase().replace(/\s+/g, '_')}`;
  const storageKeyCatatan = `aqidah_catatan_${pageName.toLowerCase().replace(/\s+/g, '_')}`;
  
  // State management
  let currentPage = 1;
  let isEditing = false;
  let currentKelompok = {1: 'ahlussunnah', 2: 'ahlussunnah'}; // Tracking untuk page 1 & 2
  
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
    if (savedCatatan) {
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
  }
  
  function saveCatatanToStorage() {
    localStorage.setItem(storageKeyCatatan, catatanContent.innerHTML);
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
  // FUNGSI: Toggle Edit Mode
  // ===================================
  function toggleEditMode() {
    isEditing = !isEditing;
    
    if (isEditing) {
      // Masuk mode edit
      editBtn.textContent = 'SAVE';
      editBtn.classList.add('editing');
      
      // Aktifkan contenteditable pada item yang sedang aktif
      const activeItem = document.querySelector('#page2 .penjelasan-item.active');
      if (activeItem) {
        activeItem.contentEditable = true;
        activeItem.focus();
      }
    } else {
      // Keluar dari mode edit dan simpan
      editBtn.textContent = 'EDIT';
      editBtn.classList.remove('editing');
      
      // Nonaktifkan contenteditable
      document.querySelectorAll('#page2 .penjelasan-item').forEach(item => {
        item.contentEditable = false;
      });
      
      // Simpan ke localStorage
      saveEditingToStorage();
      alert('Perubahan telah disimpan!');
    }
  }
  
  // ===================================
  // FUNGSI: Ganti Halaman
  // ===================================
  function gantiHalaman(pageNum) {
    currentPage = pageNum;
    
    // Update page containers
    pageContainers.forEach(container => {
      container.classList.remove('active');
    });
    document.getElementById(`page${pageNum}`).classList.add('active');
    
    // Update page buttons
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
    
    // Sembunyikan semua penjelasan terlebih dahulu
    items.forEach(item => {
      item.classList.remove('active');
      item.contentEditable = false;
    });
    
    // Hapus class active dari semua button
    buttons.forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Tampilkan penjelasan yang sesuai
    const activeItem = container.querySelector(`.penjelasan-item[data-kelompok="${kelompok}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
      
      // Jika di halaman 2 dan sedang dalam mode edit, aktifkan contenteditable
      if (pageNum === 2 && isEditing) {
        activeItem.contentEditable = true;
      }
    }
    
    // Aktifkan button yang sesuai
    const activeButton = container.querySelector(`.kelompok-btn[data-kelompok="${kelompok}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
    
    // Update dropdown value (untuk sinkronisasi)
    if (dropdown) {
      dropdown.value = kelompok;
    }
    
    // Smooth scroll ke bagian penjelasan (khusus mobile)
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
  // EVENT LISTENER: Tombol Edit
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
        // Debounce auto-save
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
          saveEditingToStorage();
          console.log('Auto-saved editing content!');
        }, 2000); // Simpan otomatis setelah 2 detik tidak ada perubahan
      }
    });
  });
  
  // ===================================
  // AUTO-SAVE untuk Halaman 3 (Catatan)
  // ===================================
  let catatanSaveTimeout;
  if (catatanContent) {
    catatanContent.addEventListener('input', function() {
      clearTimeout(catatanSaveTimeout);
      catatanSaveTimeout = setTimeout(() => {
        saveCatatanToStorage();
        console.log('Auto-saved catatan!');
      }, 2000); // Simpan otomatis setelah 2 detik tidak ada perubahan
    });
  }
  
  // ===================================
  // INISIALISASI: Load dari storage & Set halaman awal
  // ===================================
  loadFromStorage();
  gantiHalaman(1); // Mulai dari halaman 1 (Default)
  
});