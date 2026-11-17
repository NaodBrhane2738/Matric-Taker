const DEFAULT_BLOCKED_DOMAINS = [
  'youtube.com',
  'instagram.com',
  'tiktok.com',
  'facebook.com',
  'twitter.com',
  'x.com',
  'reddit.com',
  'netflix.com',
];

interface BlockerConfig {
  isEnabled: boolean;
  blockedDomains: string[];
  emergencyPauseUntil: number | null;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['isEnabled', 'blockedDomains'], (result) => {
    if (result.isEnabled === undefined) {
      chrome.storage.local.set({
        isEnabled: true,
        blockedDomains: DEFAULT_BLOCKED_DOMAINS,
        emergencyPauseUntil: null,
      });
    }
    updateBlockingRules();
  });
});

async function updateBlockingRules() {
  const data = await chrome.storage.local.get(['isEnabled', 'blockedDomains', 'emergencyPauseUntil']);
  const isEnabled = data.isEnabled ?? true;
  const domains: string[] = data.blockedDomains ?? DEFAULT_BLOCKED_DOMAINS;
  const pauseUntil: number | null = data.emergencyPauseUntil ?? null;

  const now = Date.now();
  const isPaused = pauseUntil !== null && pauseUntil > now;

  // Clear existing dynamic rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existingRules.map((r) => r.id);

  if (!isEnabled || isPaused) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules: [],
    });
    return;
  }

  // Construct new rules redirecting to blocked.html
  const newRules: chrome.declarativeNetRequest.Rule[] = domains.map((domain, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
      redirect: {
        extensionPath: '/blocked.html',
      },
    },
    condition: {
      urlFilter: `*://${domain}/*`,
      resourceTypes: [
        chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
      ],
    },
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules: newRules,
  });
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.isEnabled || changes.blockedDomains || changes.emergencyPauseUntil) {
    updateBlockingRules();
  }
});

// Periodic alarm to clear emergency pauses
chrome.alarms.create('checkPauseExpiration', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkPauseExpiration') {
    updateBlockingRules();
  }
});
