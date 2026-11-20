# 駿駿 · 个人数据档案

一个纯静态的个人作品与经历站点，以「数据档案」为叙事概念：纸感底色、等宽字段标签、朱红强调、可交互时间线与项目档案卡。

线上匿名版本：不展示真实姓名与手机号；邮箱以掩码显示，点击后展开并自动复制。

在线访问：

- GitHub Pages：<https://junjun-9224.github.io/wangjiajun-archive/>
- 备用：<https://wangjiajun-archive.app.workbuddy.host/?sharecode=FF2AJRV7RA>

## 特点

- **零依赖**：原生 HTML / CSS / JavaScript，无构建步骤、无 npm 包，克隆即可打开
- **双主题**：纸（浅色）/ 墨（深色），选择记忆在 `localStorage`
- **沉浸式动效**：首屏点阵画布随指针响应、入场分层动画、滚动进度条、章节渐显
- **可交互时间线**：按 学业 / 实习 / 项目 / 荣誉 筛选，节点可展开，轨道随滚动被填充
- **项目档案卡**：卡片展开为详情弹层（背景 / 职责 / 结果 / 待补充），支持 Esc 与焦点回收
- **隐私默认**：手机与邮箱默认脱敏显示，点击后才展开完整值
- **响应式**：360—1440px 全区间适配，移动端菜单为全屏抽屉，详情为底部面板
- **无障碍**：跳过导航、键盘可操作时间线、`prefers-reduced-motion` 降级

## 目录

```
.
├── index.html            # 页面结构 + 四个项目详情模板（<template>）
└── assets
    ├── css/style.css     # 设计变量、双主题、响应式、打印样式
    └── js/main.js        # 点阵画布、时间线、弹层、脱敏、主题切换
```

## 本地预览

任选其一，直接双击 `index.html` 也可以：

```bash
python -m http.server 8000
# 或
npx serve .
```

然后打开 <http://localhost:8000>。

## 部署

纯静态，无需构建。仓库已配置 GitHub Actions 自动发布：

- 推送到 `main` 即触发 `.github/workflows/pages.yml`，自动部署到 GitHub Pages
- 首次使用需在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**（工作流里的 `configure-pages` 也会尝试自动开启）
- 私有仓库在 GitHub Free 计划下无法使用 Pages，需将仓库转为 public（或升级 Pro）

也可以直接指向本目录用 Vercel / Netlify / Cloudflare Pages 托管。

## 内容说明

站内信息依据本人简历、证书与项目材料整理，未作虚构。以下位置标注为「待补充」，因材料中暂无佐证：

- 云锦黔茶项目的小程序名称 / 官网访问地址
- 多链接评测工具的安装包或商店链接、效率提升量化数据
- 实用新型专利号与授权状态
- GitHub / 作品集地址

技术栈关键词：HTML5、CSS（自定义属性、Grid、`clamp()` 流式排版）、原生 JavaScript（Canvas 2D、IntersectionObserver、`<template>`）。
