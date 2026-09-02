# 有喜记 · Web / 小红书离线版

最终版 Web / 小红书轻体验：用户首次设置昵称、头像和当前孕周，然后只用一个入口记录今天，生成一张可保存的游戏风格孕期记录卡。

## 当前范围

- 只有“记录今天”主流程：六项状态 + 可选的“今天有什么值得留下的吗？”
- `actualDate` 是真实日期锚点，`gestationalWeek` 是这条记录采用的孕周标记；V0.1 不自动根据预产期修正。
- 数据只保留在当前设备的 `localStorage`：资料、未完成草稿和最近记录。没有登录、云同步、数据库、社区、连续打卡或医学判断。
- 普通 Web 提供保存图片；小红书小工具检测到 `window.xhs.miniTool` 时额外提供发布入口。

## 本地运行

```bash
python3 -m http.server 4173
```

打开 `http://127.0.0.1:4173/`。不要直接双击 HTML；使用本地 HTTP 服务可以正确加载脚本和图片。

## 目录

- `core/`：平台无关的 Record 模型、日期/孕周工具、状态选项、校验、卡片内容规则、匿名行为事件接口。
- `platform/`：小红书 JSBridge 适配；普通 Web 不显示不可用的发布按钮。
- `app.js`：Web 表单、视图切换、草稿、Canvas 预览与保存/发布调用。
- `assets/`：当前项目已确认的像素背景、图标和头像素材。

## Record V1

```js
{
  schemaVersion: 1,
  id,
  type: "daily_log",
  actualDate: "YYYY-MM-DD",
  gestationalWeek: { weeks, days },
  timePrecision: "day",
  profile: { nickname, avatarId },
  status: { energy, sleep, body, appetite, activity, mood },
  moments: [{ title, detail, isFirst }],
  createdAt,
  updatedAt
}
```

`timePrecision` 暂不做选择 UI；新记录固定为 `day`。读取旧结构时会迁移为 V1 结构并保留可用内容，不覆盖未知字段的原始数据。

## 测试清单

1. 清理当前站点的本地资料后打开页面：应先看到首次设置。
2. 填写昵称、选头像和孕周，点击“开始记录”。
3. 进入“记录今天”，修改日期和孕周，填写六项状态；精神只显示文字选项，生成卡上显示绿色进度条，不显示百分比。
4. 不填写事件模块也应成功生成；填写标题、勾选第一次发现、填写 100 字以内细节也应成功。
5. 生成结果后确认卡片同时显示日期和孕周、头像、六项状态和品牌署名。
6. 普通网页只显示“保存图片”，小红书容器可用时才显示“发布到小红书”。
7. 刷新页面，确认资料恢复；在填写中刷新，确认草稿可恢复；确认页面始终提示记录只在当前设备处理、不上传。
8. 在 iPhone Safari、Android Chrome、微信内置浏览器和常见手机宽度检查文本换行与卡片无溢出。

## 状态

V0.1 已进入 Maintenance Mode。完成验收后不继续开发 V0.2 功能。
