(function (root) {
  'use strict';
  var C = root.FortyWeekCore, MAX = { content: 120, memory: 100, body: 24 };
  function validate(record) {
    var e = [], w = record.gestationalWeek;
    if (!record.actualDate) e.push('请填写正确的日期，例如 2026.08.31。');
    if (!C.recordModel.isValidWeek(w)) e.push('请填写正确的孕周，例如 W5+3。');
    if (record.type === 'memory' && !record.content) e.push('请写下这件事。');
    if ([...record.content].length > MAX.content) e.push('“发生了什么”最多填写 120 字。');
    if ([...record.memory].length > MAX.memory) e.push('“我想记住”最多填写 100 字。');
    if (record.type === 'status' && record.status && [...record.status.body].length > MAX.body) e.push('身体感受最多填写 24 字。');
    return { valid: !e.length, errors: e };
  }
  C.recordValidation = { max: MAX, validateRecord: validate };
}(window));
