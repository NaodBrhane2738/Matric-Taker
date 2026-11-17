const toggle = document.getElementById('blockToggle') as HTMLInputElement;
const statusBadge = document.getElementById('statusBadge') as HTMLDivElement;
const btnEmergency = document.getElementById('btnEmergency') as HTMLButtonElement;
const domainList = document.getElementById('domainList') as HTMLDivElement;
const addForm = document.getElementById('addForm') as HTMLFormElement;
const domainInput = document.getElementById('domainInput') as HTMLInputElement;

function refreshUI() {
  chrome.storage.local.get(['isEnabled', 'blockedDomains', 'emergencyPauseUntil'], (data) => {
    const isEnabled = data.isEnabled ?? true;
    const domains: string[] = data.blockedDomains ?? [];
    const pauseUntil: number | null = data.emergencyPauseUntil ?? null;

    const isPaused = pauseUntil !== null && pauseUntil > Date.now();

    toggle.checked = isEnabled;
    if (isPaused) {
      const remainingMins = Math.ceil((pauseUntil! - Date.now()) / 60000);
      statusBadge.textContent = `Paused (${remainingMins}m)`;
      statusBadge.className = 'status-badge status-paused';
    } else if (isEnabled) {
      statusBadge.textContent = 'Active';
      statusBadge.className = 'status-badge status-active';
    } else {
      statusBadge.textContent = 'Disabled';
      statusBadge.className = 'status-badge status-paused';
    }

    // Render domains
    domainList.innerHTML = '';
    domains.forEach((dom) => {
      const row = document.createElement('div');
      row.className = 'domain-item';
      row.textContent = dom;
      domainList.appendChild(row);
    });
  });
}

toggle.addEventListener('change', () => {
  chrome.storage.local.set({ isEnabled: toggle.checked }, () => {
    refreshUI();
  });
});

btnEmergency.addEventListener('click', () => {
  const pauseUntil = Date.now() + 10 * 60 * 1000; // 10 minutes
  chrome.storage.local.set({ emergencyPauseUntil: pauseUntil }, () => {
    refreshUI();
  });
});

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = domainInput.value.trim().toLowerCase();
  if (val) {
    chrome.storage.local.get(['blockedDomains'], (data) => {
      const domains: string[] = data.blockedDomains ?? [];
      if (!domains.includes(val)) {
        domains.push(val);
        chrome.storage.local.set({ blockedDomains: domains }, () => {
          domainInput.value = '';
          refreshUI();
        });
      }
    });
  }
});

refreshUI();
