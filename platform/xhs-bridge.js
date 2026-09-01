(function (root) {
  'use strict';
  function api() { return root.xhs && root.xhs.miniTool ? root.xhs.miniTool : null; }
  function available() { return !!api(); }
  function writeTempFile(data) { var bridge = api(); if (!bridge || typeof bridge.writeTempFile !== 'function') return Promise.reject(new Error('XHS bridge unavailable')); return bridge.writeTempFile({ data: data }); }
  function saveImage(data) { var bridge = api(); if (!bridge || typeof bridge.saveImageToPhotosAlbum !== 'function') return Promise.reject(new Error('XHS save API unavailable')); return writeTempFile(data).then(function (result) { return bridge.saveImageToPhotosAlbum({ filePath: result.filePath }); }); }
  function postNote(options) { var bridge = api(); if (!bridge || typeof bridge.postNote !== 'function') return Promise.reject(new Error('XHS post API unavailable')); return bridge.postNote(options); }
  root.FortyWeekPlatform = root.FortyWeekPlatform || {};
  root.FortyWeekPlatform.xhs = { available: available, writeTempFile: writeTempFile, saveImage: saveImage, postNote: postNote };
  function bindPostButton() {
    var saveButton = document.getElementById('download-button'), canvas = document.getElementById('status-canvas');
    if (!saveButton || !canvas || document.getElementById('post-button')) return !!saveButton;
    var button = document.createElement('button'); button.id = 'post-button'; button.type = 'button'; button.className = 'primary-button'; button.textContent = '发布到小红书'; saveButton.parentNode.insertBefore(button, saveButton.nextSibling);
    button.addEventListener('click', function () {
      var status = document.getElementById('download-status');
      if (!available()) { status.textContent = '当前不是小红书小工具环境，请先保存图片；进入小红书小工具后可直接发布。'; return; }
      button.disabled = true; status.textContent = '正在打开小红书发布页……';
      writeTempFile(canvas.toDataURL('image/png')).then(function (result) { return postNote({ title: '40周小记', content: '用40周小记记录今天的身体和心情。', tags: '孕期记录', mediaInfo: { image_resources: [{ url: result.filePath }] } }); }).then(function () { status.textContent = '已打开小红书发布页，请确认后发布。'; }).catch(function () { status.textContent = '发布失败，请先保存图片后重试。'; }).then(function () { button.disabled = false; });
    });
    return true;
  }
  var tries = 0; (function waitForApp() { if (!bindPostButton() && tries++ < 60) root.setTimeout(waitForApp, 50); }());
}(window));
