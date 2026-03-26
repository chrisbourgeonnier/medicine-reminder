const STORAGE_KEY = 'medicineData';

function loadData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    medicineName: '',
    takenDays: {},
    newBoxDays: {}
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

let data = loadData();
let viewYear, viewMonth;

const today = new Date();
viewYear = today.getFullYear();
viewMonth = today.getMonth();
const todayKey = toKey(today);

// Medicine name
const nameInput = document.getElementById('medicine-name');
nameInput.value = data.medicineName || '';
nameInput.addEventListener('input', () => {
  data.medicineName = nameInput.value;
  saveData(data);
});

// Status banner + button
const banner = document.getElementById('status-banner');
const takeBtn = document.getElementById('take-btn');
const undoBtn = document.getElementById('undo-btn');

function updateBanner() {
  if (data.takenDays[todayKey]) {
    banner.textContent = '✅ You already took your medicine today!';
    banner.className = 'taken';
    takeBtn.disabled = true;
    undoBtn.disabled = false;
  } else {
    banner.textContent = "⚠️ You haven't taken your medicine today";
    banner.className = 'not-taken';
    takeBtn.disabled = false;
    undoBtn.disabled = true;
  }
}

takeBtn.addEventListener('click', () => {
  data.takenDays[todayKey] = true;
  saveData(data);
  updateBanner();
  renderCalendar();
});

undoBtn.addEventListener('click', () => {
  delete data.takenDays[todayKey];
  saveData(data);
  updateBanner();
  renderCalendar();
});

// New box checkbox
const newboxCb = document.getElementById('newbox-cb');
newboxCb.checked = !!data.newBoxDays[todayKey];
newboxCb.addEventListener('change', () => {
  data.newBoxDays[todayKey] = newboxCb.checked;
  saveData(data);
  renderCalendar();
});

// Calendar
function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  const label = document.getElementById('month-label');

  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
  label.textContent = `${monthNames[viewMonth]} ${viewYear}`;

  grid.innerHTML = '';

  // Day labels
  ['M','T','W','T','F','S','S'].forEach(d => {
    const el = document.createElement('div');
    el.className = 'day-label';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'day-cell empty';
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    const key = toKey(date);
    const el = document.createElement('div');
    el.textContent = d;

    let classes = 'day-cell';
    if (data.takenDays[key]) classes += ' taken';
    else classes += ' not-taken';
    if (key === todayKey) classes += ' today';
    if (data.newBoxDays[key]) classes += ' new-box';

    el.className = classes;
    grid.appendChild(el);
  }
}

document.getElementById('prev-month').addEventListener('click', () => {
  viewMonth--;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  viewMonth++;
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderCalendar();
});

updateBanner();
renderCalendar();

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

function scheduleNotification() {
  if (!('Notification' in window)) return;

  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') return;

    const now = new Date();
    const remind = new Date();
    remind.setHours(10, 0, 0, 0);

    // If 10am already passed today, schedule for tomorrow
    if (now > remind) remind.setDate(remind.getDate() + 1);

    const delay = remind - now;

    setTimeout(() => {
      // Only notify if not taken
      const stored = loadData();
      const key = toKey(new Date());
      if (!stored.takenDays[key]) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification('💊 Medicine Reminder', {
            body: "Don't forget to take your medicine today!",
            icon: './icon.png',
            badge: './icon.png'
          });
        });
      }
      // Reschedule for next day
      scheduleNotification();
    }, delay);
  });
}

scheduleNotification();
