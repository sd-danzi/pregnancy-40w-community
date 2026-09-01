(function (root) {
  'use strict'; var C = root.FortyWeekCore;
  function shell(r) { return { title: '我的孕期记录', eyebrow: 'MY PREGNANCY LOG', date: C.recordModel.displayDate(r.actualDate), week: C.recordModel.formatGestationalWeek(r.gestationalWeek), brand: '40周孕期实验 · COMMUNITY LOG' }; }
  function build(r) { var base = shell(r); if (r.type === 'status') return { shell: base, template: { kind: 'status', heading: '今天的状态', memory: r.memory, rows: [{key:'energy',label:'精神',value:r.status.energy,icon:'energy'},{key:'sleep',label:'睡眠',value:r.status.sleep,icon:'sleep'},{key:'body',label:'身体感受',value:r.status.body || '今天没什么特别感觉',icon:'body'},{key:'appetite',label:'食欲',value:r.status.appetite,icon:'appetite'},{key:'activity',label:'活动',value:r.status.activity,icon:'activity'},{key:'mood',label:'心情',value:r.status.mood,icon:'mood'}] } }; return { shell: base, template: { kind: 'memory', heading: '今天想留下的事', content: r.content, memory: r.memory } }; }
  C.cardContent = { buildCardModel: build };
}(window));
