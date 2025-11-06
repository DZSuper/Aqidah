// Minimal JS for future interactive features
document.addEventListener('DOMContentLoaded', function(){
  // placeholder: enable keyboard focus styling for cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(c => {
    c.addEventListener('keydown', e => {
      if(e.key === 'Enter') {
        const a = c.querySelector('a');
        if(a) a.click();
      }
    });
  });
});
