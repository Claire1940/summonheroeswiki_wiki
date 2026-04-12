# SEO 检查报告

生成时间: 2026-04-12 UTC

## 检查摘要

- ✅ 通过: 31
- ❌ 失败: 0
- ⚠️ 警告: 1
- 📊 总计: 32

## 详细结果

### 阶段 1：代码结构检查

- ✅ 根 Layout 具备 `<html lang>`（位于 `src/app/[locale]/layout.tsx`）
- ✅ 已补充 `WebSite + SearchAction` JSON-LD（`src/app/[locale]/layout.tsx`）
- ✅ 动态页面 `generateMetadata` 包含 title/description/alternates/OpenGraph/robots
- ✅ sitemap 使用环境变量站点域名，并覆盖首页、静态页、内容列表页、文章页
- ✅ i18n 路由配置为 `localePrefix: as-needed`, `defaultLocale: en`, `localeDetection: true`
- ✅ 结构化数据组件 `ArticleStructuredData` 与 `ListStructuredData` 可用
- ✅ `public/robots.txt` 存在且包含 sitemap
- ✅ 页面 H1 语义检查通过（主页、列表页、详情页、静态页均单 H1）
- ✅ 图片 `alt` 属性检查通过（Next/Image 与主要组件均设置）
- ✅ 详情页存在面包屑导航，并包含 BreadcrumbList JSON-LD（ArticleStructuredData）
- ✅ 内链一致性修复：`HomePageClient` 链接按 `as-needed` 规则修正（英文不带 `/en` 前缀）
- ✅ 旧品牌残留修复：`about/terms/copyright` 旧语义已替换为 Summon Heroes 语义

### 阶段 2：构建验证

- ✅ `npm run typecheck` 通过
- ✅ `npm run lint` 通过
- ✅ `npm run build` 通过

### 阶段 3：安全检查

- ✅ `src/` 未发现硬编码 `sk-`、`API_KEY`、`password`
- ✅ `.gitignore` 包含 `.env*`

### 阶段 4：本地运行验证

- ✅ 本地 `dev` 重启成功（端口 3161）
- ✅ `curl -I /` 返回 `200`
- ✅ `curl -I /pt` 返回 `200`
- ✅ 多语言路由 `/es`、`/ja` 返回 `200`
- ✅ `/en` 返回 `307`（符合 `as-needed` 预期重定向行为）
- ✅ 旧主题占位词 `{{OLD_THEME}}` 首页命中数为 `0`

## 已修复项

1. 修复 sitemap 内容类型映射仍为旧主题的问题，并补充内容列表页入图。
2. 修复首页模块链接和 legal 内链的 locale 前缀一致性问题。
3. 补充全站 `SearchAction` 结构化数据。
4. 清理 about/terms/copyright 页面中的旧主题残留语义。
5. 执行并修复多语言翻译流程中超时兜底导致的 PT 英文残留。

## 警告项

- ⚠️ `next build` 存在 `next-intl` 相关 webpack cache 警告（非阻塞，构建成功）。
