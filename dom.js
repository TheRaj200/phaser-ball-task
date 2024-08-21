import { sessionID, countdown, startTime, endTime, sessionActive, startPhaserSession } from './game.js';

const sessionData = [];

document.getElementById('startSessionBtn').addEventListener('click', () => {
  if (!sessionActive) {
    startPhaserSession();
    updateDOMSessionInfo();
  }
});

function updateDOMSessionInfo() {
  document.getElementById('sessionId').innerText = sessionID;
  document.getElementById('startTime').innerText = startTime;
  document.getElementById('counterValue').innerText = countdown;
}

export function updateSessionList() {
  const sessionList = document.getElementById('sessionList');
  sessionList.innerHTML = '';
  sessionData.push({ sessionID, startTime, endTime });
  sessionData.forEach(session => {
    const li = document.createElement('li');
    li.textContent = `Session ID: ${session.sessionID}, Start: ${session.startTime}, End: ${session.endTime}`;
    sessionList.appendChild(li);
  });
}
