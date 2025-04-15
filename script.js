let currentYear, currentMonth;
const calendarTitle = document.getElementById('calendar-title');
const calendarDays = document.getElementById('calendar-days');
const selectedDateDisplay = document.getElementById('selected-date');
const noteText = document.getElementById('note-text');
const noteSection = document.getElementById('note-section');
const savedNote = document.getElementById('saved-note');
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function initCalendar(year, month) {
  currentYear = year;
  currentMonth = month;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  calendarTitle.textContent = `${monthNames[month]} ${year}`;
  calendarDays.innerHTML = '';
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    calendarDays.appendChild(empty);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const div = document.createElement('div');
    const dateKey = `${year}-${month + 1}-${day}`;
    div.className = 'day';
    div.textContent = day;
    div.onclick = () => showNoteSection(day);
    if (localStorage.getItem(dateKey)) {
      div.dataset.hasNote = "true";
    }
    calendarDays.appendChild(div);
  }
}

function showNoteSection(day) {
  const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
  selectedDateDisplay.textContent = dateKey;
  const existingNote = localStorage.getItem(dateKey) || '';
  noteText.value = existingNote;
  savedNote.textContent = existingNote ? `📝 Saved Note:\n${existingNote}` : '';
  noteSection.style.display = 'block';
}

function saveNote() {
  const date = selectedDateDisplay.textContent;
  const text = noteText.value;
  localStorage.setItem(date, text);
  savedNote.textContent = text ? `📝 Saved Note:\n${text}` : '';
  initCalendar(currentYear, currentMonth);
}

function changeMonth(delta) {
  let newMonth = currentMonth + delta;
  let newYear = currentYear;
  if (newMonth < 0) { newMonth = 11; newYear--; }
  else if (newMonth > 11) { newMonth = 0; newYear++; }
  initCalendar(newYear, newMonth);
  noteSection.style.display = 'none';
}

function exportAllNotes() {
  const notes = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    if (/\d{4}-\d{1,2}-\d{1,2}/.test(key)) {
      notes[key] = value;
    }
  }
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'calendar-notes.json';
  a.click();
  URL.revokeObjectURL(url);
}

const today = new Date();
initCalendar(today.getFullYear(), today.getMonth());
