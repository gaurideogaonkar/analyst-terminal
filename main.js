const stocks = ['AAPL', 'TSLA', 'BTC', 'ETH', 'GOLD'];
const data = stocks.map(symbol => {
  const price = 100 + Math.random() * 500;
  return { symbol, price, history: Array(20).fill(price) };
});

init();

function init() {
  updateFeed();
  reorderPanels();
  setInterval(reorderPanels, 10000);
  setInterval(updateFeed, 400);
  setInterval(() => addEvent('signal-content', `SIG_${stocks[Math.floor(Math.random() * stocks.length)]}_MOVE`), 2500);
  setInterval(() => addEvent('log-content', 'DATA_PACKET_SYNC'), 3000);
}

function updateFeed() {
  data.forEach(entry => {
    const change = (Math.random() - 0.5) * 4;
    entry.price += change;
    entry.history.push(entry.price);
    entry.history.shift();
  });

  const feedElement = document.getElementById('feed-content');
  feedElement.innerHTML = data.map(entry => renderCard(entry)).join('');

  const jump = data.find(entry => Math.abs(entry.history.at(-1) - entry.history.at(-2)) > 1.5);
  document.getElementById('whisper').textContent = jump ? `ALERT: UNUSUAL ACTIVITY IN ${jump.symbol}` : '';
  document.getElementById('ticker').textContent = 'MARKET STATUS: ACTIVE | ' + data.map(entry => `${entry.symbol}: ${entry.price.toFixed(1)}`).join(' | ');
}

function renderCard(entry) {
  const min = Math.min(...entry.history);
  const max = Math.max(...entry.history);
  const range = max - min || 1;
  const isUp = entry.history.at(-1) >= entry.history[0];
  const color = isUp ? '#34d399' : '#fb7185';
  const coords = entry.history.map((value, index) => {
    const x = (index / (entry.history.length - 1)) * 100;
    const y = 30 - ((value - min) / range) * 30;
    return { x: x.toFixed(2), y: y.toFixed(2) };
  });
  const linePath = coords
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
  const areaPath = `${linePath} L ${coords.at(-1).x} 30 L ${coords[0].x} 30 Z`;
  const gradientId = `spark-grad-${entry.symbol}`;

  return `
    <div class="item">
      <div class="row"><span>${entry.symbol}</span><span>$${entry.price.toFixed(2)}</span></div>
      <svg class="spark" viewBox="0 0 100 30" preserveAspectRatio="none">
        <defs>
          <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.5" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="${areaPath}" fill="url(#${gradientId})" stroke="none" />
        <path d="${linePath}" stroke="${color}" fill="none" />
      </svg>
    </div>
  `;
}

function addEvent(id, text) {
  const div = document.createElement('div');
  div.className = 'log-entry';
  div.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  const container = document.getElementById(id);
  container.prepend(div);
  if (container.childNodes.length > 20) container.lastChild.remove();
}

function reorderPanels() {
  const panels = Array.from(document.querySelectorAll('.panel'));
  if (!panels.length) return;
  panels[0].style.order = 0;

  const rest = panels.slice(1);
  const slots = rest.map((_, index) => index + 1);
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  rest.forEach((panel, index) => {
    panel.style.order = slots[index];
  });
}
