const activeTimeEl = document.getElementById('active-time');
const recoveryTimeEl = document.getElementById('recovery-time');
const toggleButton = document.getElementById('toggle-button');
const stopButton = document.getElementById('stop-button');
const splitsList = document.getElementById('splits-list');

let activeTime = 0;
let recoveryTime = 0;
let currentMode = null; // 'active' or 'recovery'
let lastTimestamp = null;
let rafId = null;
let splitCounter = 0;

function formatTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor(ms / 60000) % 60;
  const seconds = Math.floor(ms / 1000) % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  return (
    String(hours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0') + '.' +
    String(centiseconds).padStart(2, '0')
  );
}

function update(now) {
  if (lastTimestamp !== null) {
    const delta = now - lastTimestamp;
    if (currentMode === 'active') {
      activeTime += delta;
    } else if (currentMode === 'recovery') {
      recoveryTime += delta;
    }
    activeTimeEl.textContent = formatTime(activeTime);
    recoveryTimeEl.textContent = formatTime(recoveryTime);
  }
  lastTimestamp = now;
  rafId = requestAnimationFrame(update);
}

function addSplit(label, time) {
  splitCounter += 1;
  const li = document.createElement('li');
  li.textContent = `${splitCounter}. ${label} Split: ${formatTime(time)}`;
  splitsList.appendChild(li);
}

function startMode(mode) {
  currentMode = mode;
  lastTimestamp = null;
  rafId = requestAnimationFrame(update);
  toggleButton.textContent = mode === 'active' ? 'Recovery' : 'Active';
  stopButton.disabled = false;
}

function stopMode(mode) {
  cancelAnimationFrame(rafId);
  lastTimestamp = null;
  const label = mode.charAt(0).toUpperCase() + mode.slice(1);
  const time = mode === 'active' ? activeTime : recoveryTime;
  addSplit(label, time);
}

toggleButton.addEventListener('click', () => {
  if (!currentMode) {
    startMode('active');
  } else if (currentMode === 'active') {
    stopMode('active');
    startMode('recovery');
  } else if (currentMode === 'recovery') {
    stopMode('recovery');
    startMode('active');
  }
});

stopButton.addEventListener('click', () => {
  if (currentMode) {
    stopMode(currentMode);
    currentMode = null;
    toggleButton.disabled = true;
    stopButton.disabled = true;
  }
});