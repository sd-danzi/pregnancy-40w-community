(function (root) {
  'use strict';
  function pad(n) { return String(n).padStart(2, '0'); }
  function normalizeDate(value) {
    var raw = String(value || '').trim().replace(/\./g, '-');
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(raw);
    if (!m) return '';
    var date = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    if (date.getUTCFullYear() !== Number(m[1]) || date.getUTCMonth() !== Number(m[2]) - 1 || date.getUTCDate() !== Number(m[3])) return '';
    return m[1] + '-' + pad(m[2]) + '-' + pad(m[3]);
  }
  function displayDate(value) { var normalized = normalizeDate(value); return normalized ? normalized.replace(/-/g, '.') : ''; }
  function parseGestationalWeek(value) {
    if (value && typeof value === 'object') return { weeks: Number(value.weeks), days: Number(value.days) };
    var m = /^W?(\d{1,2})\+(\d)$/.exec(String(value || '').trim());
    return m ? { weeks: Number(m[1]), days: Number(m[2]) } : { weeks: NaN, days: NaN };
  }
  function validWeek(week) { return Number.isInteger(week.weeks) && Number.isInteger(week.days) && week.weeks >= 1 && week.weeks <= 40 && week.days >= 0 && week.days <= 6; }
  function formatWeek(value) { var w = parseGestationalWeek(value); return validWeek(w) ? 'W' + w.weeks + '+' + w.days : ''; }
  function createRecord(input) {
    var source = input || {}, type = source.type === 'status' ? 'status' : 'memory', week = parseGestationalWeek(source.gestationalWeek);
    return { id: source.id || 'record-' + Date.now(), type: type, actualDate: normalizeDate(source.actualDate), gestationalWeek: week, timePrecision: source.timePrecision || 'day', content: String(source.content || '').trim(), status: type === 'status' && source.status ? { energy: String(source.status.energy || '').trim(), sleep: String(source.status.sleep || '').trim(), body: String(source.status.body || '').trim(), appetite: String(source.status.appetite || '').trim(), activity: String(source.status.activity || '').trim(), mood: String(source.status.mood || '').trim() } : null, memory: String(source.memory || '').trim(), createdAt: source.createdAt || new Date().toISOString() };
  }
  root.FortyWeekCore = root.FortyWeekCore || {};
  root.FortyWeekCore.recordModel = { normalizeDate: normalizeDate, displayDate: displayDate, parseGestationalWeek: parseGestationalWeek, isValidWeek: validWeek, formatGestationalWeek: formatWeek, createRecord: createRecord };
}(window));
