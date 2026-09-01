const canvas = document.querySelector('#status-canvas');
const ctx = canvas.getContext('2d');
const form = document.querySelector('#status-form');
const body = document.querySelector('#body');
const memory = document.querySelector('#memory');
const memoryCount = document.querySelector('#memory-count');
const downloadButton = document.querySelector('#download-button');
const downloadStatus = document.querySelector('#download-status');
const generatedImage = document.querySelector('#generated-image');
const dateInput = document.querySelector('#date');

const colors = {
  ink: '#17372B',
  forest: '#315A40',
  sage: '#7DA954',
  cream: '#FFF8E9',
  paper: '#F6EEDC',
  paperDeep: '#ECE3D2',
  gold: '#D3A14B',
  coral: '#DD6C61',
  muted: '#708174',
};

const leaf = new Image();
const sparkle = new Image();
const background = new Image();
const activityIcon = new Image();
const appetiteIcon = new Image();
const diary = new Image();
const statusIcons = Object.fromEntries(['energy', 'sleep', 'body', 'mood'].map(name => [name, new Image()]));
leaf.src = './assets/status/title-leaf.png';
sparkle.src = './assets/status/title-sparkle.png';
background.src = './assets/status/status-bg.png';
activityIcon.src = './assets/activity.png';
appetiteIcon.src = './assets/appetite.png';
diary.src = './assets/diary.png';
Object.entries(statusIcons).forEach(([name, image]) => { image.src = `./assets/status/${name}.png`; });

function value(id) { return document.querySelector(`#${id}`).value.trim(); }
function todayString() {
  const now = new Date();
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
}
function dateValue() {
  const raw = value('date').replace(/-/g, '.').replace(/[^0-9.]/g, '');
  const parts = raw.split('.').filter(Boolean);
  if (parts.length === 3) return `${parts[0].padStart(4, '0')}.${parts[1].padStart(2, '0')}.${parts[2].padStart(2, '0')}`;
  return todayString();
}
function week() {
  const major = Math.max(1, Math.min(40, Number(value('week-major')) || 1));
  const minor = Math.max(0, Math.min(6, Number(value('week-minor')) || 0));
  return `W${major}+${minor}`;
}
function snapshot() {
  return { date: dateValue(), week: week(), energy: value('energy'), sleep: value('sleep'), body: value('body'), appetite: value('appetite'), activity: value('activity'), mood: value('mood'), memory: value('memory') || '今天也值得被记住。' };
}

function font(size, weight = 500, family = 'Source Han Sans CN, PingFang SC, sans-serif') {
  return `${weight} ${size}px ${family}`;
}
function roundRect(x, y, w, h, r, fill, stroke, line = 1) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.lineWidth = line; ctx.strokeStyle = stroke; ctx.stroke(); }
}
function drawText(text, x, y, options = {}) {
  ctx.save();
  ctx.font = options.font || font(32);
  ctx.fillStyle = options.color || colors.ink;
  ctx.textAlign = options.align || 'left';
  ctx.textBaseline = options.baseline || 'alphabetic';
  if (options.maxWidth) ctx.fillText(text, x, y, options.maxWidth);
  else ctx.fillText(text, x, y);
  ctx.restore();
}
function wrapText(text, maxChars) {
  const chars = [...text];
  const lines = [];
  for (let i = 0; i < chars.length; i += maxChars) lines.push(chars.slice(i, i + maxChars).join(''));
  return lines.length ? lines : [''];
}
function drawIcon(image, x, y, size, alpha = 1) {
  if (!image.complete || !image.naturalWidth) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.imageSmoothingEnabled = false; ctx.drawImage(image, x, y, size, size); ctx.restore();
}
function drawPixelDivider(y) {
  ctx.save(); ctx.strokeStyle = 'rgba(49,90,64,.20)'; ctx.lineWidth = 2; ctx.setLineDash([3, 9]);
  ctx.beginPath(); ctx.moveTo(84, y); ctx.lineTo(940, y); ctx.stroke(); ctx.restore();
  drawIcon(sparkle, 58, y - 12, 22, .75); drawIcon(sparkle, 944, y - 12, 22, .75);
}

function render() {
  const data = snapshot();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Use the approved STATUS environment as a full-page background layer.
  if (background.complete && background.naturalWidth) ctx.drawImage(background, 0, 0, 1024, 1536);
  else { ctx.fillStyle = colors.cream; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  drawIcon(leaf, 40, 45, 52, .78);
  drawText('MY PREGNANCY LOG', 112, 76, { font: font(28, 500, 'VT323, Courier New, monospace'), color: colors.forest });
  drawText('我的孕期状态', 512, 160, { font: font(58, 700), color: colors.ink, align: 'center' });
  drawIcon(sparkle, 286, 134, 34, .9); drawIcon(sparkle, 704, 134, 34, .9);
  drawPixelDivider(252);

  // A single, substantial status panel: closer to the approved share-card language,
  // while remaining a distinct COMMUNITY layout and keeping all community fields.
  roundRect(58, 292, 908, 690, 14, 'rgba(255,253,245,.78)', 'rgba(211,161,75,.52)', 3);
  drawText('TODAY STATUS', 92, 338, { font: font(27, 500, 'VT323, Courier New, monospace'), color: colors.gold });
  drawText(`${data.date} · ${data.week}`, 930, 344, { font: font(28, 500, 'VT323, Courier New, monospace'), color: colors.forest, align: 'right' });
  drawText('今天的状态', 512, 390, { font: font(32, 700), color: colors.ink, align: 'center' });
  const rows = [
    ['energy', '精神', data.energy], ['sleep', '睡眠', data.sleep], ['body', '身体感受', data.body],
    ['appetite', '食欲', data.appetite], ['activity', '活动', data.activity], ['mood', '心情', data.mood],
  ];
  const startY = 474; const rowH = 82; const left = 168; const right = 892;
  rows.forEach(([iconName, label, val], index) => {
    const y = startY + index * rowH;
    if (index) { ctx.strokeStyle = 'rgba(211,161,75,.34)'; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(92, y - 48); ctx.lineTo(932, y - 48); ctx.stroke(); ctx.setLineDash([]); }
    const icon = iconName === 'appetite' ? appetiteIcon : iconName === 'activity' ? activityIcon : statusIcons[iconName];
    drawIcon(icon, 96, y - 38, 52, .92);
    drawText(label, left, y, { font: font(27, 700), color: colors.ink });
    if (label === '精神') {
      roundRect(352, y - 18, 410, 26, 6, colors.paperDeep, null);
      const energyWidth = Math.round(410 * ({'很没精神': .2, '有点累': .4, '还可以': .65, '不错': .85, '很有精神': .95}[val] || .65));
      roundRect(352, y - 18, energyWidth, 26, 6, colors.sage, null);
      drawText(val, right, y + 2, { font: font(26, 700), color: colors.ink, align: 'right' });
    } else {
      drawText(val, right, y, { font: font(label === '身体感受' ? 23 : 26, 500), color: colors.ink, align: 'right', maxWidth: 700 });
    }
  });

  drawPixelDivider(1036);
  drawText('TODAY I WANT TO REMEMBER', 78, 1094, { font: font(25, 500, 'VT323, Courier New, monospace'), color: colors.gold });
  roundRect(78, 1120, 868, 260, 12, '#FFFDF5', 'rgba(49,90,64,.25)', 2);
  drawIcon(diary, 708, 1136, 228, .94); drawIcon(sparkle, 118, 1160, 24, .72);
  const lines = wrapText(data.memory, 20);
  lines.slice(0, 5).forEach((line, i) => drawText(line, 178, 1184 + i * 36, { font: font(26, 500), color: colors.ink }));
  drawText(`记录日期：${data.date}`, 178, 1360, { font: font(21, 500), color: colors.muted });

  drawText('留住今天，等以后回头看看。', 512, 1408, { font: font(28, 700), color: colors.forest, align: 'center' });
  drawText('40周孕期实验 · COMMUNITY LOG', 512, 1495, { font: font(22, 500, 'VT323, Courier New, monospace'), color: colors.forest, align: 'center' });
}

function updateCount() {
  memoryCount.textContent = [...memory.value].length;
}
form.addEventListener('input', () => { updateCount(); render(); });
form.addEventListener('change', render);
downloadButton.addEventListener('click', async () => {
  const dataUri = canvas.toDataURL('image/png');
  const miniTool = window.xhs && window.xhs.miniTool;
  try {
    if (miniTool && typeof miniTool.writeTempFile === 'function' && typeof miniTool.saveImageToPhotosAlbum === 'function') {
      const result = await miniTool.writeTempFile({ data: dataUri });
      await miniTool.saveImageToPhotosAlbum({ filePath: result.filePath });
      downloadStatus.textContent = '状态卡已保存到相册。';
      return;
    }
    generatedImage.src = dataUri;
    generatedImage.hidden = false;
    downloadStatus.textContent = '状态卡已生成；长按图片即可保存。';
  } catch (error) {
    downloadStatus.textContent = '状态卡已生成；请长按下方图片保存。';
    generatedImage.src = dataUri;
    generatedImage.hidden = false;
  }
});

Promise.all([
  new Promise(resolve => { leaf.onload = resolve; leaf.onerror = resolve; }),
  new Promise(resolve => { sparkle.onload = resolve; sparkle.onerror = resolve; }),
  new Promise(resolve => { background.onload = resolve; background.onerror = resolve; }),
  new Promise(resolve => { activityIcon.onload = resolve; activityIcon.onerror = resolve; }),
  new Promise(resolve => { appetiteIcon.onload = resolve; appetiteIcon.onerror = resolve; }),
  new Promise(resolve => { diary.onload = resolve; diary.onerror = resolve; }),
  ...Object.values(statusIcons).map(image => new Promise(resolve => { image.onload = resolve; image.onerror = resolve; })),
]).then(render);
updateCount();
if (!dateInput.value) dateInput.value = todayString();
render();
