# AI Collaboration Card

该文档将在后续版本中完善。

当前请按照教师要求记录：

- Prompt
- AI 输出
- 自己修改
- 最终验证

day 1

Prompt：
完整分析该项目目录结构，每层文件夹职责
解释main.ts文件的作用
解释 router 的作用
梳理本项目全套技术栈，说明每个技术的用途

AI 输出：
项目目录结构完整分析
campus-market-seed/
├── .editorconfig              # 跨编辑器代码风格统一配置
├── .git/                      # Git 版本仓库元数据
├── .gitattributes             # Git 属性配置（换行符等）
├── .gitignore                 # Git 忽略规则
├── .nvmrc                     # Node 版本锁定（供 nvm 使用）
├── .oxlintrc.json             # Oxlint 静态检测规则配置
├── .vscode/                   # VS Code 工作区配置
│   ├── extensions.json        # 推荐插件列表
│   └── settings.json          # 编辑器设置
├── CHECK_REPORT.md            # 自动检测报告（后续版本启用）
├── VERSION.md                 # 版本说明
├── docs/                      # ★ 课程文档体系
│   ├── ai/                    # AI 协作规范
│   │   └── AI_Collaboration_Card.md  # AI 协作记录卡模板
│   ├── evidence/              # 每日过程性证据
│   │   ├── Day1_Evidence.md ~ Day7_Evidence.md  # 7 天证据模板
│   └── guide/                 # 学生使用指南
│       ├── Environment_Setup.md   # 环境搭建指引
│       └── Getting_Started.md     # 快速开始指南
├── env.d.ts                   # 环境类型声明（Vite 类型补全）
├── eslint.config.ts           # ESLint 扁平化配置
├── index.html                 # Vite 入口 HTML
├── node_modules/              # 依赖包（pnpm）
├── package.json               # 项目元信息 & 依赖声明
├── pnpm-lock.yaml             # 依赖锁文件
├── public/                    # 纯静态资源（不经过构建）
│   └── favicon.ico
├── scripts/                   # 自动检测工具脚本（后续版本）
├── src/                       # ★ 项目核心源码
│   ├── api/                   # API 接口层（准备中）
│   ├── components/            # 通用可复用组件（准备中）
│   ├── router/                # Vue Router 路由配置
│   │   └── index.ts           # 路由表定义（目前仅 / 首页）
│   ├── stores/                # Pinia 状态管理（准备中）
│   ├── views/                 # 页面级组件
│   │   └── HomeView.vue       # 首页
│   ├── App.vue                # 根组件
│   └── main.ts                # 应用入口（挂载 Vue 实例）
├── tsconfig.json              # TS 项目引用（根）
├── tsconfig.app.json          # 应用代码 TS 配置
├── tsconfig.node.json         # Node 端（vite.config）TS 配置
└── vite.config.ts             # Vite 构建配置（@ 别名等）
各层级职责总结
层级	职责
根目录	项目元信息、构建/静态分析配置、版本管理
docs/	课程文档：环境搭建 → 快速上手 → AI 协作规范 → 每日证据提交
src/	Vue 3 前端源码，按职责分为 api/composables/components/router/stores/views
public/	不经 Vite 构建的纯静态资源
scripts/	后续版本的自动检测引擎
.vscode/	团队统一的编辑器配置与推荐插件
项目采用了 Vue 3 + TypeScript + Vite + Pinia + Vue Router 技术栈，当前 src/ 下的 api/、components/、stores/ 均为空（留存 .gitkeep），属于"种子项目"状态，供学生在后续课程中逐步填充。

main.ts 是 Vue 应用的入口文件，负责：
1. 创建 Vue 应用实例 — createApp(App) 以 App.vue 为根组件
2. 注册插件 — createPinia() 注入全局状态管理，router 注入路由系统
3. 挂载到 DOM — app.mount('#app') 将应用渲染到 index.html 的 <div id="app"> 中
简单说，它把组件（App）、路由、状态管理组装起来并启动应用，是整个前端应用的启动入口。

src/router/index.ts 定义了 Vue Router 路由映射表，核心作用：
1. URL 与组件的映射 — 访问 /（首页）时渲染 HomeView.vue 组件
2. 启用 History 模式 — createWebHistory 使用 HTML5 历史 API，URL 不带 # 号
3. 在 main.ts 中被注册 — app.use(router) 后，App.vue 中的 <RouterView /> 会根据当前 URL 动态渲染对应的页面组件

本项目技术栈及用途：
技术	版本	用途
Vue 3	^3.5	声明式 UI 框架，组件化构建单页应用
TypeScript	~6.0	静态类型检查，提升代码可维护性
Vite	^8.0	开发服务器（HMR 热更新）+ 生产构建打包
Vue Router	^5.1	客户端路由，实现页面间导航与 URL 同步
Pinia	^3.0	全局状态管理，跨组件共享数据（用户信息、购物车等）
ESLint	^10.5	JS/TS/Vue 代码规范检查与自动修复
Oxlint	~1.69	Rust 编写的超快速 lint 工具，与 ESLint 互补
Vue TSC	^3.3	Vue 单文件组件的 TypeScript 类型检查
npm-run-all2	^9.0	并行/串行执行 npm 脚本（如同时 running type-check 和 build）
Vite DevTools	^8.1	浏览器内 Vue 调试面板（组件树、状态、性能）
pnpm	11.9	快速、磁盘高效的包管理器


自己理解：
项目目录结构
本项目是标准 Vue3+Vite 分层工程，根目录存放配置，docs 存放实训材料，public 放静态资源，src 是核心业务代码，按接口、组件、路由、状态、页面分层。当前 api、stores 等目录为空，后续实训逐步填充，.gitkeep用于 Git 保存空文件夹。
main.ts
项目启动入口，会创建 Vue 实例、注册路由与 Pinia 全局插件，最后挂载到页面 DOM 节点，是整个应用运行的起点。
router 路由
管理页面 URL 与页面组件的映射，使用无 #的 History 模式，配合<RouterView>实现无刷新页面跳转，新增页面必须在此配置路由才能访问。
项目技术栈
核心采用 Vue3+TS+Vite，搭配 Router、Pinia 完成页面导航与全局状态管理；搭配代码校验工具规范代码，pnpm 管理依赖，辅以 JSON Server 模拟后端接口，是当下主流前端开发技术组合，适配本次实训学习目标。

最终结论：
通过 AI 对项目目录、入口文件、路由、技术栈的完整分析，我理清了校园轻集市种子项目的整体运行逻辑与分层开发思路。AI 可以快速梳理项目结构、解释各文件作用、整理全套技术栈用途，大幅降低我自主阅读代码、梳理架构的时间成本；但 AI 输出仅为基础理论说明，项目中 api、stores、业务页面都需要我手动编写实现，不能直接照搬 AI 内容。
后续开发我会遵循这套分层目录规范，分阶段完成页面、接口、状态开发，同时利用 AI 辅助排查代码报错、生成组件代码，每次使用 AI 大范围修改代码前先用 Git 提交稳定版本，出现问题及时回退，做到合理借助 AI 提升开发效率，同时保证自己完全理解每一段代码逻辑。