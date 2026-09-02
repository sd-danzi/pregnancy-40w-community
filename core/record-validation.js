(function (root) {
  'use strict';
  var C = root.FortyWeekCore, options = C.statusOptions;
  var MAX = { nickname: 16, body: 200, momentTitle: 20, momentDetail: 100 };
  function inList(value, list) { return list.indexOf(value) !== -1; }
  function validate(record, setup) {
    var errors = [], week = record.gestationalWeek, profile = record.profile || {}, status = record.status || {}, moment = record.moments && record.moments[0];
    if (setup || !profile.nickname) errors.push('请先写一个昵称。');
    if (!profile.avatarId) errors.push('请选择一个头像。');
    if (!record.actualDate) errors.push('请填写正确的日期，例如 2026.08.31。');
    if (!C.recordModel.isValidWeek(week)) errors.push('请填写正确的孕周，例如 W5+3。');
    if (!inList(status.energy, options.energy) || !inList(status.sleep, options.sleep) || !inList(status.appetite, options.appetite) || !inList(status.activity, options.activity) || !inList(status.mood, options.mood)) errors.push('请把今天的状态填写完整。');
    if (C.recordModel.charLength(status.body) > MAX.body) errors.push('身体感受最多填写 200 字。');
    if (moment && (moment.detail || moment.isFirst) && !moment.title) errors.push('写了细节或勾选“第一次发现”时，请先填写标题。');
    if (moment && C.recordModel.charLength(moment.title) > MAX.momentTitle) errors.push('这件事的标题最多填写 20 字。');
    if (moment && C.recordModel.charLength(moment.detail) > MAX.momentDetail) errors.push('补充细节最多填写 100 字。');
    if (C.recordModel.charLength(profile.nickname) > MAX.nickname) errors.push('昵称最多填写 16 字。');
    return { valid: errors.length === 0, errors: errors };
  }
  C.recordValidation = { max: MAX, validateRecord: validate };
}(window));
