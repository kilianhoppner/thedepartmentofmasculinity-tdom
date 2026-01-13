// --- Live London UTC time ---
const londonTimeEl = document.getElementById('londonTime');

function updateLondonTime() {
  const now = new Date();

  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');

  londonTimeEl.textContent = `London UTC ${hours}:${minutes}:${seconds}`;
}

updateLondonTime();
setInterval(updateLondonTime, 1000);




//Floating bottom card

const card = document.getElementById('floatingCard');

card.addEventListener('click', () => {
  // If user is selecting text, don't toggle
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) {
    return;
  }

  card.classList.toggle('expanded');
});

