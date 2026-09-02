(function (root) {
  'use strict';
  function api() { return root.xhs && root.xhs.miniTool ? root.xhs.miniTool : null; }
  function available() { return !!api(); }
  function writeTempFile(data) { var bridge=api(); if(!bridge||typeof bridge.writeTempFile!=='function') return Promise.reject(new Error('XHS bridge unavailable')); return bridge.writeTempFile({data:data}); }
  function saveImage(data) { var bridge=api(); if(!bridge||typeof bridge.saveImageToPhotosAlbum!=='function') return Promise.reject(new Error('XHS save API unavailable')); return writeTempFile(data).then(function(result){return bridge.saveImageToPhotosAlbum({filePath:result.filePath});}); }
  function postNote(options) { var bridge=api(); if(!bridge||typeof bridge.postNote!=='function') return Promise.reject(new Error('XHS post API unavailable')); return bridge.postNote(options); }
  function postCard(record,data) {
    var moment=record&&record.moments&&record.moments[0], title='有喜记｜'+(record&&record.profile&&record.profile.nickname||'我的记录');
    var content='用有喜记记录今天的孕期状态。\n'+(record&&record.gestationalWeek?'孕周：W'+record.gestationalWeek.weeks+'+'+record.gestationalWeek.days:'')+(moment&&moment.title?'\n今天想留下：'+moment.title:'')+'\n\n#孕期记录 #有喜记';
    return writeTempFile(data).then(function(result){return postNote({title:title.slice(0,20),content:content.slice(0,1000),tags:'孕期记录,有喜记',mediaInfo:{image_resources:[{url:result.filePath}]}});});
  }
  root.FortyWeekPlatform=root.FortyWeekPlatform||{};
  root.FortyWeekPlatform.xhs={available:available,writeTempFile:writeTempFile,saveImage:saveImage,postNote:postNote,postCard:postCard};
}(window));
