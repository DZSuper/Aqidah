// Interaktivitas untuk halaman tema dengan fitur edit dan localStorage
document.addEventListener('DOMContentLoaded', function() {
  
  // Ambil elemen-elemen yang diperlukan
  const kelompokButtons = document.querySelectorAll('.kelompok-btn');
  const kelompokDropdown = document.getElementById('kelompokSelect');
  const penjelasanItems = document.querySelectorAll('.penjelasan-item');
  const editBtn = document.getElementById('editBtn');
  const defaultBtn = document.getElementById('defaultBtn');
  
  // Dapatkan nama halaman untuk key localStorage yang unik
  const pageName = document.title.split('|')[0].trim();
  const storageKey = `aqidah_${pageName.toLowerCase().replace(/\s+/g, '_')}`;
  
  let isEditing = false;
  let currentKelompok = 'ahlussunnah';
  
  // Simpan konten original untuk reset
  const originalContent = {};
  penjelasanItems.forEach(item => {
    const kelompok = item.getAttribute('data-kelompok');
    originalContent[kelompok] = item.innerHTML;
  });
  
  // ===================================
  // FUNGSI: Load dari localStorage
  // ===================================
  function loadFromStorage() {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        penjelasanItems.forEach(item => {
          const kelompok = item.getAttribute('data-kelompok');
          if (data[kelompok]) {
            item.innerHTML = data[kelompok];
          }
        });
      } catch (e) {
        console.error('Error loading from storage:', e);
      }
    }
  }
  
  // ===================================
  // FUNGSI: Simpan ke localStorage
  // ===================================
  function saveToStorage() {
    const data = {};
    penjelasanItems.forEach(item => {
      const kelompok = item.getAttribute('data-kelompok');
      data[kelompok] = item.innerHTML;
    });
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
  
  // ===================================
  // FUNGSI: Reset ke default
  // ===================================
  function resetToDefault() {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua penjelasan ke kondisi awal? Semua perubahan yang Anda buat akan hilang.')) {
      penjelasanItems.forEach(item => {
        const kelompok = item.getAttribute('data-kelompok');
        item.innerHTML = originalContent[kelompok];
        item.contentEditable = false;
      });
      localStorage.removeItem(storageKey);
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
      const activeItem = document.querySelector('.penjelasan-item.active');
      if (activeItem) {
        activeItem.contentEditable = true;
        activeItem.focus();
      }
    } else {
      // Keluar dari mode edit dan simpan
      editBtn.textContent = 'EDIT';
      editBtn.classList.remove('editing');
      
      // Nonaktifkan contenteditable
      penjelasanItems.forEach(item => {
        item.contentEditable = false;
      });
      
      // Simpan ke localStorage
      saveToStorage();
      alert('Perubahan telah disimpan!');
    }
  }
  
  // ===================================
  // FUNGSI UTAMA: Ganti Penjelasan
  // ===================================
  function gantiPenjelasan(kelompok) {
    currentKelompok = kelompok;
    
    // Sembunyikan semua penjelasan terlebih dahulu
    penjelasanItems.forEach(item => {
      item.classList.remove('active');
      item.contentEditable = false;
    });
    
    // Hapus class active dari semua button
    kelompokButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Tampilkan penjelasan yang sesuai
    const activePenjelasan = document.querySelector(`.penjelasan-item[data-kelompok="${kelompok}"]`);
    if (activePenjelasan) {
      activePenjelasan.classList.add('active');
      
      // Jika sedang dalam mode edit, aktifkan contenteditable
      if (isEditing) {
        activePenjelasan.contentEditable = true;
      }
    }
    
    // Aktifkan button yang sesuai
    const activeButton = document.querySelector(`.kelompok-btn[data-kelompok="${kelompok}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
    
    // Update dropdown value (untuk sinkronisasi)
    if (kelompokDropdown) {
      kelompokDropdown.value = kelompok;
    }
    
    // Smooth scroll ke bagian penjelasan (khusus mobile)
    if (window.innerWidth <= 768) {
      const penjelasanSection = document.querySelector('.penjelasan-section');
      if (penjelasanSection) {
        penjelasanSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  }
  
  // ===================================
  // EVENT LISTENER: Button (Desktop & Tablet)
  // ===================================
  kelompokButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const kelompok = this.getAttribute('data-kelompok');
      gantiPenjelasan(kelompok);
    });
  });
  
  // ===================================
  // EVENT LISTENER: Dropdown (Mobile)
  // ===================================
  if (kelompokDropdown) {
    kelompokDropdown.addEventListener('change', function() {
      const kelompok = this.value;
      gantiPenjelasan(kelompok);
    });
  }
  
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
  kelompokButtons.forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const kelompok = this.getAttribute('data-kelompok');
        gantiPenjelasan(kelompok);
      }
    });
  });
  
  // ===================================
  // AUTO-SAVE saat edit (optional)
  // ===================================
  let autoSaveTimeout;
  penjelasanItems.forEach(item => {
    item.addEventListener('input', function() {
      if (isEditing) {
        // Debounce auto-save
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
          saveToStorage();
          console.log('Auto-saved!');
        }, 2000); // Simpan otomatis setelah 2 detik tidak ada perubahan
      }
    });
  });
  
  // ===================================
  // INISIALISASI: Load dari storage
  // ===================================
  loadFromStorage();
  
});