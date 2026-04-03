const API = "https://bible-api.com/";
const versesEl = document.getElementById("verses");
const dailyVerseEl = document.getElementById("dailyVerse");
let currentText = "";

/* ================= DAILY VERSE ================= */
const dailyList = [
  "Psalm 23:1",
  "John 3:16",
  "Romans 8:28",
  "Proverbs 3:5",
  "Isaiah 41:10"
];
dailyVerseEl.textContent =
  "Daily Verse: " + dailyList[new Date().getDate() % dailyList.length];

/* ================= LOAD VERSE ================= */
async function loadVerse() {
  const ref = document.getElementById("reference").value;
  const trans = document.getElementById("translation").value;
  if (!ref) return;

  versesEl.innerHTML = "Loading...";
  const res = await fetch(`${API}${ref}?translation=${trans}`);
  const data = await res.json();

  versesEl.innerHTML = "";
  currentText = "";

  data.verses.forEach(v => {
    currentText += v.text;

    versesEl.innerHTML += `
      <div class="verse" id="${v.book_name}-${v.chapter}-${v.verse}">
        <span>${v.book_name} ${v.chapter}:${v.verse}</span>
        <p>${v.text}</p>
        <div class="actions">
          <button onclick="bookmark('${v.book_name} ${v.chapter}:${v.verse}', \`${v.text}\`)">⭐</button>
          <button onclick="highlight(this,'yellow')">🟨</button>
          <button onclick="highlight(this,'blue')">🟦</button>
          <button onclick="highlight(this,'green')">🟩</button>
          <button onclick="addNote('${v.book_name} ${v.chapter}:${v.verse}')">📝</button>
        </div>
      </div>
    `;
  });
}

/* ================= SEARCH ================= */
document.getElementById("search").addEventListener("keypress", e => {
  if (e.key === "Enter") {
    document.getElementById("reference").value = e.target.value;
    loadVerse();
  }
});

/* ================= BOOKMARK ================= */
function bookmark(ref, text) {
  const data = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  data.push({ ref, text });
  localStorage.setItem("bookmarks", JSON.stringify(data));
  alert("Bookmarked");
}

function showBookmarks() {
  const data = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  versesEl.innerHTML = "<h2>⭐ Bookmarks</h2>";
  data.forEach(v => {
    versesEl.innerHTML += `<div class="verse"><span>${v.ref}</span>${v.text}</div>`;
  });
}

/* ================= HIGHLIGHT ================= */
function highlight(btn, color) {
  btn.closest(".verse").classList.add(`highlight-${color}`);
}

/* ================= NOTES ================= */
function addNote(ref) {
  const note = prompt("Write note:");
  if (!note) return;
  const notes = JSON.parse(localStorage.getItem("notes") || "{}");
  notes[ref] = note;
  localStorage.setItem("notes", JSON.stringify(notes));
  alert("Note saved");
}

/* ================= AUDIO ================= */
function readAloud() {
  if (!currentText) return;
  const speech = new SpeechSynthesisUtterance(currentText);
  speech.rate = 0.9;
  speechSynthesis.speak(speech);
}

/* ================= DEVOTIONAL ================= */
function showDevotional() {
  versesEl.innerHTML = `
    <h2>📘 Daily Devotional</h2>
    <p><strong>Theme:</strong> Trust God Completely</p>
    <p>God’s promises never fail. Even when life feels uncertain,
    His Word remains true. Trust Him fully today.</p>
    <p><em>Proverbs 3:5</em></p>
  `;
}

/* ================= PWA ================= */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}