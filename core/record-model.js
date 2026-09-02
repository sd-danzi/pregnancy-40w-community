(function (root) {
  'use strict';
  var C = root.FortyWeekCore = root.FortyWeekCore || {};
  var SCHEMA_VERSION = 1;
  function pad(n) { return String(n).padStart(2, '0'); }
  function chars(value) { return Array.from(String(value || '')); }
  function normalizeDate(value) {
    var raw = String(value || '').trim().replace(/\./g, '-');
    var match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(raw);
    if (!match) return '';
    var date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
    if (date.getUTCFullYear() !== +match[1] || date.getUTCMonth() !== +match[2] - 1 || date.getUTCDate() !== +match[3]) return '';
    return match[1] + '-' + pad(match[2]) + '-' + pad(match[3]);
  }
  function displayDate(value) { var date = normalizeDate(value); return date ? date.replace(/-/g, '.') : ''; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseGestationalWeek(value) {
    if (value && typeof value === 'object') return { weeks: Number(value.weeks), days: Number(value.days) };
    var match = /^W?(\d{1,2})\+(\d)$/.exec(String(value || '').trim());
    return match ? { weeks: Number(match[1]), days: Number(match[2]) } : { weeks: NaN, days: NaN };
  }
  function validWeek(week) { return week && Number.isInteger(week.weeks) && Number.isInteger(week.days) && week.weeks >= 1 && week.weeks <= 40 && week.days >= 0 && week.days <= 6; }
  function formatWeek(value) { var week = parseGestationalWeek(value); return validWeek(week) ? 'W' + week.weeks + '+' + week.days : ''; }
  function clean(value) { return String(value == null ? '' : value).trim(); }
  function createRecord(input) {
    var source = input || {}, profile = source.profile || {}, status = source.status || {}, moments = Array.isArray(source.moments) ? source.moments : [];
    return { schemaVersion: SCHEMA_VERSION, id: source.id || 'record-' + Date.now(), type: source.type || 'daily_log', actualDate: normalizeDate(source.actualDate) || today(), gestationalWeek: parseGestationalWeek(source.gestationalWeek), timePrecision: source.timePrecision || 'day', profile: { nickname: clean(profile.nickname), avatarId: clean(profile.avatarId) || 'avatar-01' }, status: { energy: clean(status.energy), sleep: clean(status.sleep), body: clean(status.body), appetite: clean(status.appetite), activity: clean(status.activity), mood: clean(status.mood) }, moments: moments.slice(0, 1).map(function (moment) { return { title: clean(moment.title), detail: clean(moment.detail), isFirst: moment.isFirst === true }; }), createdAt: source.createdAt || new Date().toISOString(), updatedAt: source.updatedAt || new Date().toISOString() };
  }
  function migrate(source) {
    if (!source) return null;
    if (source.schemaVersion === SCHEMA_VERSION && source.profile && source.status && Array.isArray(source.moments)) return createRecord(source);
    var legacyStatus = source.status && typeof source.status === 'object' ? source.status : {};
    var legacyMemory = clean(source.memory || source.content);
    return createRecord({ id: source.id, type: 'daily_log', actualDate: source.actualDate, gestationalWeek: source.gestationalWeek, timePrecision: source.timePrecision || 'day', profile: source.profile, status: legacyStatus, moments: legacyMemory ? [{ title: legacyMemory.slice(0, 20), detail: legacyMemory, isFirst: false }] : [], createdAt: source.createdAt });
  }
  C.recordModel = { schemaVersion: SCHEMA_VERSION, charLength: function (v) { return chars(v).length; }, today: today, normalizeDate: normalizeDate, displayDate: displayDate, parseGestationalWeek: parseGestationalWeek, isValidWeek: validWeek, formatGestationalWeek: formatWeek, createRecord: createRecord, migrateRecord: migrate };
}(window));
