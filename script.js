// =============================================
//  SAMSUNG GALAXY – script.js
// =============================================

// --- Time & Clock ---
function updateTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  const timeStr = `${h}:${m}`;
  const days = ['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota'];
  const months = ['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'];
  const dateStr = `${days[now.getDay()]}, ${now.getDate()}. ${months[now.getMonth()]}`;

  const lt = document.getElementById('lockTime');
  const ld = document.getElementById('lockDate');
  const ht = document.getElementById('homeTime');
  const hd = document.getElementById('homeDate');
  const st = document.getElementById('statusTime');
  const dt = document.getElementById('digitalTime');

  if(lt) lt.textContent = timeStr;
  if(ld) ld.textContent = dateStr;
  if(ht) ht.textContent = timeStr;
  if(hd) hd.textContent = dateStr;
  if(st) st.textContent = timeStr;
  if(dt) dt.textContent = `${h}:${m}:${s}`;

  // Analog clock
  const secDeg = s * 6;
  const minDeg = now.getMinutes() * 6 + now.getSeconds() * 0.1;
  const hrDeg  = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;
  const sec  = document.getElementById('secondHand');
  const min  = document.getElementById('minuteHand');
  const hour = document.getElementById('hourHand');
  if(sec)  sec.style.transform  = `rotate(${secDeg}deg)`;
  if(min)  min.style.transform  = `rotate(${minDeg}deg)`;
  if(hour) hour.style.transform = `rotate(${hrDeg}deg)`;

  // Alarm check
  checkAlarms(h, m, s);

  // Music progress
  updateMusicProgress();
}
setInterval(updateTime, 1000);
updateTime();

// --- Lock / Unlock ---
function unlockPhone() {
  document.getElementById('lockScreen').classList.add('hidden');
  document.getElementById('lockScreen').classList.remove('active');
  document.getElementById('homeScreen').classList.remove('hidden');
  document.getElementById('statusBar').classList.remove('hidden');
}

// --- App Navigation ---
function openApp(app) {
  document.getElementById('homeScreen').classList.add('hidden');
  const el = document.getElementById('app-' + app);
  if(el) {
    el.classList.remove('hidden');
    document.getElementById('statusBar').classList.remove('hidden');
  }
}
function closeApp(app) {
  const el = document.getElementById('app-' + app);
  if(el) el.classList.add('hidden');
  document.getElementById('homeScreen').classList.remove('hidden');
}

// --- Notification ---
function showNotif(msg, duration=2500) {
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.classList.remove('hidden');
  clearTimeout(window._notifTimer);
  window._notifTimer = setTimeout(() => n.classList.add('hidden'), duration);
}

// =============================================
// PHONE
// =============================================
let dialNum = '';
function dialPress(d) {
  dialNum += d;
  document.getElementById('dialNumber').textContent = dialNum;
  playTone('beep');
}
function dialDelete() {
  dialNum = dialNum.slice(0,-1);
  document.getElementById('dialNumber').textContent = dialNum;
}
function makeCall() {
  if(!dialNum) { showNotif('Zadejte číslo'); return; }
  document.getElementById('callingNumber').textContent = dialNum;
  document.getElementById('callingOverlay').classList.remove('hidden');
  playTone('ring');
}
function endCall() {
  document.getElementById('callingOverlay').classList.add('hidden');
  stopSound();
  showNotif('Hovor ukončen');
  dialNum = '';
  document.getElementById('dialNumber').textContent = '';
}

// =============================================
// EMAIL
// =============================================
const emails = [
  { from:'Adam Novák', subject:'Schůzka zítra v 10:00', body:'Ahoj,\n\nnezapomeň na schůzku zítra v 10:00 v konferenční místnosti B.\n\nS pozdravem,\nAdam', time:'10:30' },
  { from:'Google', subject:'Bezpečnostní upozornění', body:'Detekovali jsme přihlášení z nového zařízení na váš účet.\n\nPokud jste to nebyli vy, okamžitě změňte heslo.', time:'9:15' },
  { from:'Samsung', subject:'Aktualizace One UI 7.0', body:'Vaše zařízení Samsung Galaxy S25 je připraveno k aktualizaci na One UI 7.0.\n\nAktualizace přináší nové funkce AI a vylepšený výkon.', time:'8:00' },
  { from:'Pavel Dvořák', subject:'Re: Projekt alfa', body:'Výborně!\n\nPošli mi soubory do pátku do 17:00.\n\nDíky,\nPavel', time:'včera' }
];

function openEmail(i) {
  const e = emails[i];
  document.getElementById('emailList').classList.add('hidden');
  const detail = document.getElementById('emailDetail');
  detail.classList.remove('hidden');
  document.getElementById('emailDetailContent').innerHTML = `
    <div class="email-detail-head">
      <h3>${e.subject}</h3>
      <p>Od: ${e.from} · ${e.time}</p>
    </div>
    <div class="email-detail-body">${e.body.replace(/\n/g,'<br/>')}</div>
    <div class="email-actions">
      <button class="email-action-btn" onclick="showNotif('Odpověď odeslána ✓')">↩ Odpovědět</button>
      <button class="email-action-btn" onclick="showNotif('Email přeposlán ✓')">→ Přeposlat</button>
    </div>
  `;
}
function closeEmail() {
  document.getElementById('emailDetail').classList.add('hidden');
  document.getElementById('emailList').classList.remove('hidden');
}
function showCompose() {
  document.getElementById('emailList').classList.add('hidden');
  document.getElementById('emailCompose').classList.remove('hidden');
}
function hideCompose() {
  document.getElementById('emailCompose').classList.add('hidden');
  document.getElementById('emailList').classList.remove('hidden');
}
function sendEmail() {
  hideCompose();
  showNotif('✉️ Email odeslán!');
}
function switchEmailTab(tab, btn) {
  document.querySelectorAll('.etab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if(tab === 'sent' || tab === 'spam') {
    document.getElementById('emailList').innerHTML = `<div style="text-align:center;padding:40px;color:var(--text3)">${tab==='spam'?'Žádný spam 🎉':'Odeslaná pošta prázdná'}</div>`;
  } else {
    location.reload(); // reset (simple demo)
  }
}

// =============================================
// BROWSER
// =============================================
function navigate() {
  const url = document.getElementById('urlBar').value;
  goTo(url);
}
function goTo(url) {
  document.getElementById('urlBar').value = url;
  const home = document.getElementById('browserHome');
  const page = document.getElementById('browserPage');
  const content = document.getElementById('browserContent');
  home.classList.add('hidden');
  page.classList.remove('hidden');
  content.innerHTML = `
    <div style="text-align:center;padding:20px 0 10px;">
      <div style="font-size:40px;margin-bottom:10px">🌐</div>
      <div style="font-size:18px;font-weight:600;color:var(--text);margin-bottom:6px">${url}</div>
      <div style="font-size:13px;color:var(--text3);margin-bottom:20px">Toto je ukázkový prohlížeč</div>
      <div style="background:var(--surface2);border-radius:12px;padding:16px;text-align:left;line-height:1.8;font-size:14px;">
        <b style="color:var(--accent2)">Vítejte na ${url}</b><br/>
        Samsung Internet Browser – rychlý a bezpečný prohlížeč pro Android.<br/><br/>
        Funkce: blokování reklam, ochrana soukromí, synchronizace s ostatními zařízeními Samsung.
      </div>
    </div>
  `;
}
function browserBack() {
  document.getElementById('browserHome').classList.remove('hidden');
  document.getElementById('browserPage').classList.add('hidden');
  document.getElementById('urlBar').value = '';
}

// =============================================
// APPS SCREEN
// =============================================
function filterApps(query) {
  document.querySelectorAll('.grid-app').forEach(el => {
    const name = el.querySelector('span').textContent.toLowerCase();
    el.style.display = name.includes(query.toLowerCase()) ? 'flex' : 'none';
  });
}
function filterCat(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.grid-app').forEach(el => {
    el.style.display = (cat === 'all' || el.dataset.cat === cat) ? 'flex' : 'none';
  });
}

// =============================================
// ALARM
// =============================================
const userAlarms = [
  { time:'07:00', label:'Vstávání', enabled:true },
  { time:'08:30', label:'Práce', enabled:false },
  { time:'10:00', label:'Víkend', enabled:true }
];
function checkAlarms(h, m, s) {
  if(s !== '00') return;
  const curr = `${h}:${m}`;
  userAlarms.forEach(al => {
    if(al.enabled && al.time === curr) {
      showNotif(`⏰ Budík: ${al.label} – ${al.time}`, 5000);
      playTone('alarm');
    }
  });
}
function toggleAlarm(el) {
  showNotif(el.checked ? '🔔 Budík zapnut' : '🔕 Budík vypnut');
}
function showAddAlarm() {
  document.getElementById('addAlarmForm').classList.remove('hidden');
}
function hideAddAlarm() {
  document.getElementById('addAlarmForm').classList.add('hidden');
}
function saveAlarm() {
  const t = document.getElementById('newAlarmTime').value;
  const l = document.getElementById('newAlarmLabel').value || 'Budík';
  userAlarms.push({ time:t, label:l, enabled:true });
  const list = document.getElementById('alarmItems');
  const div = document.createElement('div');
  div.className = 'alarm-item';
  div.innerHTML = `
    <div class="alarm-info">
      <div class="alarm-time-text">${t}</div>
      <div class="alarm-label">${l}</div>
      <div class="alarm-days">Jednou</div>
    </div>
    <label class="toggle-switch">
      <input type="checkbox" checked onchange="toggleAlarm(this)"/>
      <span class="slider"></span>
    </label>
  `;
  list.appendChild(div);
  hideAddAlarm();
  showNotif(`⏰ Budík nastaven na ${t}`);
}

// =============================================
// MUSIC
// =============================================
const songs = [
  { title:'Summer Breeze', artist:'Demo Track', color:'#ff6d00', emoji:'☀️', freq:440 },
  { title:'Night Drive',   artist:'Demo Track', color:'#311b92', emoji:'🌙', freq:330 },
  { title:'Mountain Echo', artist:'Demo Track', color:'#1b5e20', emoji:'⛰️', freq:550 },
  { title:'City Lights',   artist:'Demo Track', color:'#0d47a1', emoji:'🏙️', freq:494 },
  { title:'Ocean Waves',   artist:'Ambient',    color:'#006064', emoji:'🌊', freq:220 }
];
let currentSong = null;
let isPlaying = false;
let audioCtx = null;
let gainNode = null;
let currentOscillator = null;
let progressInterval = null;
let songProgress = 0;
let songDuration = 200; // seconds (demo)

function getAudioCtx() {
  if(!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.8;
    gainNode.connect(audioCtx.destination);
  }
  return audioCtx;
}

function playSong(i) {
  const s = songs[i];
  currentSong = i;
  document.getElementById('songTitle').textContent = s.title;
  document.getElementById('songArtist').textContent = s.artist;
  document.getElementById('albumArt').textContent = s.emoji;
  document.getElementById('albumArt').style.background = `linear-gradient(135deg, ${s.color}, ${s.color}88)`;
  document.querySelectorAll('.song-item').forEach((el,idx) => {
    el.classList.toggle('active', idx === i);
  });
  isPlaying = true;
  document.getElementById('playBtn').textContent = '⏸';
  document.getElementById('albumArt').classList.add('playing');
  songProgress = 0;
  playBeep(s.freq, 0.3);
  startProgress();
}
function togglePlay() {
  if(currentSong === null) { playSong(0); return; }
  isPlaying = !isPlaying;
  document.getElementById('playBtn').textContent = isPlaying ? '⏸' : '▶';
  document.getElementById('albumArt').classList.toggle('playing', isPlaying);
  if(isPlaying) {
    playBeep(songs[currentSong].freq, 0.15);
    startProgress();
  } else {
    clearInterval(progressInterval);
    stopOscillator();
  }
}
function nextSong() {
  const next = currentSong !== null ? (currentSong + 1) % songs.length : 0;
  playSong(next);
}
function prevSong() {
  const prev = currentSong !== null ? (currentSong - 1 + songs.length) % songs.length : 0;
  playSong(prev);
}
function startProgress() {
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if(isPlaying) {
      songProgress++;
      if(songProgress >= songDuration) { songProgress = 0; nextSong(); }
    }
  }, 1000);
}
function updateMusicProgress() {
  const bar = document.getElementById('progressBar');
  const ct  = document.getElementById('currentTime');
  const tt  = document.getElementById('totalTime');
  if(!bar) return;
  const pct = (songProgress / songDuration) * 100;
  bar.value = pct;
  ct.textContent = fmtTime(songProgress);
  tt.textContent = fmtTime(songDuration);
}
function seekAudio(val) {
  songProgress = Math.floor((val / 100) * songDuration);
}
function fmtTime(s) {
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
}
function setVolume(v) {
  if(gainNode) gainNode.gain.value = v / 100;
}
function switchPlaylistTab(tab, btn) {
  document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('songList').classList.toggle('hidden', tab !== 'songs');
  document.getElementById('soundList').classList.toggle('hidden', tab !== 'sounds');
  document.getElementById('ringtoneList').classList.toggle('hidden', tab !== 'ringtones');
}
function playSound(type) {
  const freqs = { rain:80, ocean:60, forest:220, fire:150, wind:40 };
  playBeep(freqs[type] || 200, 0.3);
  showNotif(`🎵 Přehrává se: ${type}`);
}

// =============================================
// AUDIO ENGINE
// =============================================
function playBeep(freq, dur=0.2) {
  try {
    const ctx = getAudioCtx();
    stopOscillator();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.connect(g);
    g.connect(gainNode);
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start();
    osc.stop(ctx.currentTime + dur);
    currentOscillator = osc;
  } catch(e) {}
}
function playTone(type) {
  const map = { beep:880, ring:440, alarm:660, tone1:523, tone2:440, tone3:392 };
  playBeep(map[type] || 440, type === 'ring' ? 1.5 : 0.15);
}
function stopOscillator() {
  try { if(currentOscillator) { currentOscillator.stop(); currentOscillator = null; } } catch(e) {}
}
function stopSound() { stopOscillator(); }

// =============================================
// SETTINGS
// =============================================
function toggleDarkMode(el) {
  document.body.classList.toggle('light-mode', !el.checked);
  showNotif(el.checked ? '🌙 Tmavý režim' : '☀️ Světlý režim');
}
