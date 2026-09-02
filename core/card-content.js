(function (root) {
  'use strict'; var C = root.FortyWeekCore;
  function build(record) {
    var status = record.status || {}, moment = record.moments && record.moments[0];
    return { shell: { title: '我的孕期记录', eyebrow: 'MY PREGNANCY LOG', nickname: record.profile.nickname || '我的记录', avatarId: record.profile.avatarId || 'avatar-01', date: C.recordModel.displayDate(record.actualDate), week: C.recordModel.formatGestationalWeek(record.gestationalWeek) }, template: { kind: 'daily_log', heading: '今天的状态', rows: [{key:'energy',label:'精神',value:status.energy,icon:'energy'},{key:'sleep',label:'睡眠',value:status.sleep,icon:'sleep'},{key:'body',label:'身体感受',value:status.body || '今天没什么特别感觉',icon:'body'},{key:'appetite',label:'食欲',value:status.appetite,icon:'appetite'},{key:'activity',label:'活动',value:status.activity,icon:'activity'},{key:'mood',label:'心情',value:status.mood,icon:'mood'}], moment: moment || null } };
  }
  C.cardContent = { buildCardModel: build };
}(window));
