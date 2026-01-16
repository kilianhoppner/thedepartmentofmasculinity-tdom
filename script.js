// ==========================
//  Live London UTC Time
// ==========================
const londonTimeEl = document.getElementById('londonTime');

function updateLondonTime() {
  if (!londonTimeEl) return;

  const now = new Date();
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');

  londonTimeEl.textContent = `London UTC ${hours}:${minutes}:${seconds}`;
}

updateLondonTime();
setInterval(updateLondonTime, 1000);






// ==========================
//  Floating Bottom Card Clicks
// ==========================
const card = document.getElementById('floatingCard');

if (card) {

  // Toggle when clicking the card itself
  card.addEventListener('click', (e) => {
    e.stopPropagation();

    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;

    card.classList.toggle('expanded');
  });

  // Close when clicking "background" (including empty nav spaces)
  document.addEventListener('click', (e) => {

    if (!card.classList.contains('expanded')) return;

    // Ignore clicks inside the card
    if (card.contains(e.target)) return;

    // Ignore clicks on actual controls
    if (
      e.target.closest('.nav-item') ||
      e.target.closest('.font-slider-container') ||
      e.target.closest('.font-slider-track') ||
      e.target.closest('.font-slider-thumb') ||
      e.target.closest('.info-button') ||
      e.target.closest('.logo-container')
    ) {
      return;
    }

    // Everything else = background
    card.classList.remove('expanded');
  });
}





// ==========================
//  Table Row Clicks 
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  const tableRows = document.querySelectorAll('.content-table tbody tr');

  tableRows.forEach(row => {
    const targetUrl = row.getAttribute('data-href') || row.getAttribute('onclick')?.match(/'(.*?)'/)?.[1];
    if (!targetUrl) return;

    row.addEventListener('click', (e) => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return; // user is highlighting text
      window.location.href = targetUrl;
    });
  });
});




// ==========================
//  Font Slider
// ==========================
document.addEventListener('DOMContentLoaded', () => {

  const sliderThumb = document.querySelector('.font-slider-thumb');
  const sliderTrack = document.querySelector('.font-slider-track');
  const bodyEl = document.body;
  const infoBtn = document.querySelector('.info-button');
  const articleWrapper = document.querySelector('.article-wrapper');
  const articleTitle = document.querySelector('.article-title');
  const logo = document.querySelector('.logo');
  const floatingCardImg = document.querySelector('.floating-card img'); // ✅ NEW

  if (!sliderThumb || !sliderTrack || !bodyEl || !infoBtn) return;

  const minFont = 14;       
  const maxFont = 18;       
  const titleDefault = 23;  
  const maxLogoChange = 0.15;

  let isDragging = false;

  // Store original logo height
  const logoOriginalHeight = logo ? logo.offsetHeight : 50;

  // ✅ Store original floating image width
  const floatingImgOriginalWidth = floatingCardImg
    ? floatingCardImg.offsetWidth
    : null;

  // Load saved ratio
  let savedRatio = parseFloat(localStorage.getItem('fontSliderRatio'));
  if (isNaN(savedRatio)) savedRatio = 0.33;

  function applyFontSize(ratio) {

    // Move thumb
    sliderThumb.style.left = `${ratio * 100}%`;

    // Compute body font size
    const fontSize = minFont + ratio * (maxFont - minFont);
    bodyEl.style.fontSize = `${fontSize}pt`;

    // Article text
    if (articleWrapper) {
      const articleTextEls = articleWrapper.querySelectorAll('p, .article-author, .article-date-black, a');
      articleTextEls.forEach(el => el.style.fontSize = `${fontSize}pt`);
    }

    // Title scaling
    if (articleTitle) {
      const titleScale = 1 + (fontSize - minFont) / (maxFont - minFont) * 0.3;
      articleTitle.style.fontSize = `${titleDefault * titleScale}pt`;
    }

    // Info button scaling (light)
    const infoBtnScaleFactor = 0.3;
    infoBtn.style.fontSize = `${1.5 + (fontSize - 15) * infoBtnScaleFactor / 15}em`;

    // Logo scaling (subtle)
    if (logo) {
      const logoScale = 1 + (ratio - 0.33) * maxLogoChange / 0.67;
      logo.style.height = `${logoOriginalHeight * logoScale}px`;
    }

    // ==========================
    // Floating card image scaling (VERY subtle)
    // ==========================
    if (floatingCardImg && floatingImgOriginalWidth) {
      const imgScaleRange = 0.08; // 8% max change
      const imgScale =
        1 + (ratio - 0.33) * imgScaleRange / 0.67;

      floatingCardImg.style.width =
        `${floatingImgOriginalWidth * imgScale}px`;
    }
  }

  // Apply saved ratio
  applyFontSize(savedRatio);

  // --- Drag ---
  sliderThumb.addEventListener('mousedown', () => isDragging = true);
  document.addEventListener('mouseup', () => isDragging = false);

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const trackRect = sliderTrack.getBoundingClientRect();
    let x = e.clientX - trackRect.left;
    x = Math.max(0, Math.min(x, trackRect.width));
    const ratio = x / trackRect.width;
    applyFontSize(ratio);
    localStorage.setItem('fontSliderRatio', ratio);
  });

  // --- Click track ---
  sliderTrack.addEventListener('click', (e) => {
    const trackRect = sliderTrack.getBoundingClientRect();
    let x = e.clientX - trackRect.left;
    x = Math.max(0, Math.min(x, trackRect.width));
    const ratio = x / trackRect.width;
    applyFontSize(ratio);
    localStorage.setItem('fontSliderRatio', ratio);
  });

});