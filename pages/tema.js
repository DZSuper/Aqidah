// Interaktivitas untuk halaman tema
document.addEventListener('DOMContentLoaded', function() {
  
  // Ambil elemen-elemen yang diperlukan
  const kelompokButtons = document.querySelectorAll('.kelompok-btn');
  const kelompokDropdown = document.getElementById('kelompokSelect');
  const penjelasanItems = document.querySelectorAll('.penjelasan-item');
  
  // ===================================
  // FUNGSI UTAMA: Ganti Penjelasan
  // ===================================
  function gantiPenjelasan(kelompok) {
    // Hapus class active dari semua button
    kelompokButtons.forEach(btn => btn.classList.remove('active'));
    
    // Tambah class active ke button yang dipilih
    const activeButton = document.querySelector(`.kelompok-btn[data-kelompok="${kelompok}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
    
    // Hapus class active dari semua penjelasan
    penjelasanItems.forEach(item => item.classList.remove('active'));
    
    // Tambah class active ke penjelasan yang sesuai
    const activePenjelasan = document.querySelector(`.penjelasan-item[data-kelompok="${kelompok}"]`);
    if (activePenjelasan) {
      activePenjelasan.classList.add('active');
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
    button.addEventListener('click', function() {
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
  // KEYBOARD NAVIGATION (Accessibility)
  // ===================================
  kelompokButtons.forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
});