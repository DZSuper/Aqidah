// Interaktivitas untuk halaman tema dengan sistem numbering otomatis global
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
  // FUNGSI: Load & Save localStorage
  // ===================================
  function loadFromStorage() {
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
    
    const savedCatatan = localStorage.getItem(storageKeyCatatan);
    if (savedCatatan && catatanContent) {
      catatanContent.innerHTML = savedCatatan;
    }
  }
  
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
      catatanModeBtn.textContent = 'MODE: EDIT';
      catatanModeBtn.classList.add('active');
      catatanContent.contentEditable = true;
      catatanToolbar.classList.add('show');
      catatanContent.focus();
    } else {
      catatanModeBtn.textContent = 'MODE: BACA';
      catatanModeBtn.classList.remove('active');
      catatanContent.contentEditable = false;
      catatanToolbar.classList.remove('show');
      saveCatatanToStorage();
      showSaveIndicator(); // Tampilkan hanya saat kembali ke mode baca
    }
  }
  
  // ===================================
  // FUNGSI: Hitung Nomor Global Otomatis
  // ===================================
  function getNextNumber(styleType) {
    if (styleType === 'judul') {
      // Hitung semua judul yang ada
      const allJudul = catatanContent.querySelectorAll('.catatan-judul');
      const count = allJudul.length;
      return String.fromCharCode(65 + count) + '. ';
    } 
    else if (styleType === 'bab') {
      // Hitung semua BAB yang ada secara global
      const allBab = catatanContent.querySelectorAll('.catatan-bab');
      const count = allBab.length;
      return (count + 1) + '. ';
    } 
    else if (styleType === 'subbab') {
      // Hitung semua sub-bab yang ada secara global
      const allSubbab = catatanContent.querySelectorAll('.catatan-subbab');
      const count = allSubbab.length;
      return (count + 1) + '.) ';
    }
    
    return '';
  }
  
  // ===================================
  // FUNGSI: Cek Apakah dalam Judul/BAB/Sub-bab
  // ===================================
  function getCurrentElement() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;
    
    let node = selection.getRangeAt(0).startContainer;
    
    // Traverse up untuk cari parent dengan class catatan-*
    while (node && node !== catatanContent) {
      if (node.classList) {
        if (node.classList.contains('catatan-judul') ||
            node.classList.contains('catatan-bab') ||
            node.classList.contains('catatan-subbab') ||
            node.classList.contains('catatan-biasa') ||
            node.classList.contains('catatan-penting')) {
          return node;
        }
      }
      node = node.parentNode;
    }
    
    return null;
  }
  
  // ===================================
  // FUNGSI: Apply Style ke Catatan
  // ===================================
  function applyNoteStyle(styleType) {
    if (!isCatatanEditMode) return;
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const currentElement = getCurrentElement();
    
    // Jika ada elemen saat ini
    if (currentElement) {
      const currentType = currentElement.className.replace('catatan-', '');
      
      // Jika ingin mengubah judul/bab/subbab ke tipe lain
      if ((currentType === 'judul' || currentType === 'bab' || currentType === 'subbab') &&
          (styleType === 'judul' || styleType === 'bab' || styleType === 'subbab')) {
        // Ubah class element yang ada
        currentElement.className = `catatan-${styleType}`;
        
        // Update nomor
        const number = getNextNumber(styleType);
        const textWithoutNumber = currentElement.textContent.replace(/^[A-Z]\.\s|^\d+\.\s|^\d+\.\)\s/, '');
        currentElement.textContent = number + textWithoutNumber;
        
        // Pindahkan kursor ke akhir
        range.selectNodeContents(currentElement);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        
        return;
      }
      
      // Jika ingin membuat biasa/penting dan sedang di judul/bab/sub-bab
      if ((styleType === 'biasa' || styleType === 'penting') &&
          (currentType === 'judul' || currentType === 'bab' || currentType === 'subbab')) {
        // Buat baris baru setelah elemen struktural
        const newElement = document.createElement('div');
        newElement.className = `catatan-${styleType}`;
        newElement.innerHTML = '<br>'; // Kosongkan tapi tetap bisa fokus
        
        currentElement.parentNode.insertBefore(newElement, currentElement.nextSibling);
        
        // Pindahkan kursor ke elemen baru
        range.setStart(newElement, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        return;
      }
    }
    
    // Buat elemen baru
    const newElement = document.createElement('div');
    newElement.className = `catatan-${styleType}`;
    
    // Tambahkan nomor otomatis untuk judul/bab/sub-bab
    if (styleType === 'judul' || styleType === 'bab' || styleType === 'subbab') {
      const number = getNextNumber(styleType);
      newElement.textContent = number;
    } else {
      // Kosongkan untuk biasa dan penting
      newElement.innerHTML = '<br>';
    }
    
    // Insert element
    range.insertNode(newElement);
    
    // Pindahkan kursor ke akhir elemen baru
    range.setStart(newElement, newElement.childNodes.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    
    catatanContent.focus();
  }
  
  // ===================================
  // EVENT LISTENER: Enter Key Handler
  // ===================================
  if (catatanContent) {
    catatanContent.addEventListener('keydown', function(e) {
      if (!isCatatanEditMode) return;
      
      if (e.key === 'Enter') {
        e.preventDefault();
        
        const currentElement = getCurrentElement();
        
        if (currentElement) {
          const currentType = currentElement.className.replace('catatan-', '');
          
          // Jika di judul, buat judul baru
          if (currentType === 'judul') {
            const newElement = document.createElement('div');
            newElement.className = 'catatan-judul';
            const number = getNextNumber('judul');
            newElement.textContent = number;
            
            currentElement.parentNode.insertBefore(newElement, currentElement.nextSibling);
            
            // Pindahkan kursor
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStart(newElement, newElement.childNodes.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            
            return;
          }
          
          // Jika di bab, buat bab baru
          if (currentType === 'bab') {
            const newElement = document.createElement('div');
            newElement.className = 'catatan-bab';
            const number = getNextNumber('bab');
            newElement.textContent = number;
            
            currentElement.parentNode.insertBefore(newElement, currentElement.nextSibling);
            
            // Pindahkan kursor
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStart(newElement, newElement.childNodes.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            
            return;
          }
          
          // Jika di sub-bab, buat sub-bab baru
          if (currentType === 'subbab') {
            const newElement = document.createElement('div');
            newElement.className = 'catatan-subbab';
            const number = getNextNumber('subbab');
            newElement.textContent = number;
            
            currentElement.parentNode.insertBefore(newElement, currentElement.nextSibling);
            
            // Pindahkan kursor
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStart(newElement, newElement.childNodes.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            
            return;
          }
          
          // Jika di penting, tetap di penting (biarkan default)
          if (currentType === 'penting') {
            return; // Biarkan browser handle (buat baris baru dalam penting)
          }
          
          // Jika di biasa, buat biasa baru
          if (currentType === 'biasa') {
            const newElement = document.createElement('div');
            newElement.className = 'catatan-biasa';
            newElement.innerHTML = '<br>';
            
            currentElement.parentNode.insertBefore(newElement, currentElement.nextSibling);
            
            // Pindahkan kursor
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStart(newElement, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            
            return;
          }
        }
      }
      
      // Keyboard shortcuts
      if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        applyNoteStyle('judul');
      } else if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        applyNoteStyle('bab');
      } else if (e.ctrlKey && e.key === '3') {
        e.preventDefault();
        applyNoteStyle('subbab');
      } else if (e.ctrlKey && e.key === '4') {
        e.preventDefault();
        applyNoteStyle('biasa');
      } else if (e.ctrlKey && e.key === '5') {
        e.preventDefault();
        applyNoteStyle('penting');
      }
    });
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
    
    if (pageNum === 2) {
      defaultBtn.style.display = 'inline-block';
    } else {
      defaultBtn.style.display = 'none';
    }
    
    if (pageNum !== 2 && isEditing) {
      isEditing = false;
      editBtn.textContent = 'EDIT';
      editBtn.classList.remove('editing');
      document.querySelectorAll('#page2 .penjelasan-item').forEach(item => {
        item.contentEditable = false;
      });
    }
    
    if (pageNum === 3 && isCatatanEditMode) {
      isCatatanEditMode = true;
      toggleCatatanMode();
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
        penjelasanSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
  
  // ===================================
  // EVENT LISTENERS
  // ===================================
  pageButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const pageNum = parseInt(this.getAttribute('data-page'));
      gantiHalaman(pageNum);
    });
  });
  
  document.querySelectorAll('.kelompok-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const kelompok = this.getAttribute('data-kelompok');
      const pageNum = parseInt(this.getAttribute('data-page'));
      gantiPenjelasan(kelompok, pageNum);
    });
  });
  
  document.querySelectorAll('.kelompok-dropdown').forEach(dropdown => {
    dropdown.addEventListener('change', function() {
      const kelompok = this.value;
      const pageNum = parseInt(this.id.replace('kelompokSelect', ''));
      gantiPenjelasan(kelompok, pageNum);
    });
  });
  
  if (editBtn) {
    editBtn.addEventListener('click', toggleEditMode);
  }
  
  if (defaultBtn) {
    defaultBtn.addEventListener('click', resetToDefault);
  }
  
  if (catatanModeBtn) {
    catatanModeBtn.addEventListener('click', toggleCatatanMode);
  }
  
  // Style Buttons
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
  
  // AUTO-SAVE untuk Halaman 2
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
  
  // AUTO-SAVE untuk Halaman 3 (TANPA INDIKATOR)
  let catatanSaveTimeout;
  if (catatanContent) {
    catatanContent.addEventListener('input', function() {
      if (isCatatanEditMode) {
        clearTimeout(catatanSaveTimeout);
        catatanSaveTimeout = setTimeout(() => {
          saveCatatanToStorage();
          // TIDAK ADA showSaveIndicator() di sini
        }, 2000);
      }
    });
  }
  
  // INISIALISASI
  loadFromStorage();
  gantiHalaman(1);
  
});