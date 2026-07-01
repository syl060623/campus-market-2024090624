# Day5 Evidence - 状态管理与用户中心

# 一、今日完成开发内容
新建两套 Pinia 全局状态仓库：userStore 用户仓库、favoriteStore 收藏仓库
userStore：维护模拟登录用户信息，暂未对接后端真实登录接口；提供登录、登出、修改资料方法
favoriteStore：封装收藏完整逻辑，支持新增收藏、移除收藏、重复判断、一键切换收藏状态
二手交易列表页接入收藏交互按钮，点击实时切换收藏状态
全部发布页面统一从 userStore 读取当前登录用户，自动填充发布者名称、头像、ID 信息
个人中心页面完成开发，分为用户资料展示、我的收藏列表两大模块

# 二、Pinia Store 设计规划
表格
文件路径	管理业务	核心状态	提供方法
src/stores/user.ts	全局用户信息	isLoggedIn、currentUser	login、logout、updateProfile
src/stores/favorite.ts	全局收藏数据	favorites	addFavorite、removeFavorite、toggleFavorite、isFavorite

# 三、全局 / 页面状态划分边界（规范设计思路）
存入 Pinia 全局状态（多页面共用）
用户信息：导航栏、发布页、个人中心、账号设置、我的发布均需读取，全局共享
收藏列表：交易列表、商品详情、个人收藏页统一读写，操作后全页面同步更新
消息会话：独立拆分messageStore，属于独立业务模块，解耦用户与收藏逻辑
不存入 Pinia（页面局部临时状态）
发布页表单校验报错：仅当前页面使用，无需全局共享
搜索关键词、筛选条件：页面销毁数据即清空，属于临时视图状态

# 四、各页面仓库调用使用清单
AppHeader.vue：读取当前用户昵称、头像渲染顶部导航
Publish 系列页面（4 类发布）：从 userStore 获取发布者 ID、名称、头像自动填充
TradeView.vue 交易列表：收藏按钮调用收藏判断与切换接口
ItemDetailView.vue 商品详情：支持收藏 / 取消收藏操作
UserCenterView.vue 个人中心：展示用户基础资料 + 全部收藏商品
FavoritesView.vue 收藏专属页面：统一管理全部收藏内容
ProfileView.vue、SettingsView.vue：读取用户学院、头像、积分、注册时间等资料
MyPostsView.vue：根据当前用户 ID 筛选本人发布内容

# 五、AI 辅助开发记录
使用工具：opencode (DeepSeek-v4-flash-free)
辅助需求：创建用户仓库、导航栏渲染用户信息、列表收藏功能、个人中心页面开发
AI 产出内容：user.ts、favorite.ts、UserCenterView 完整代码；交易页收藏按钮；发布页发布者数据替换、静态消息卡片
AI 代码缺陷：生成代码沿用旧属性命名 userStore.user.nickname，与新版仓库currentUser字段不兼容，需人工批量修正

# 六、人工手动修改优化工作
批量修正四类发布页面：将 userStore.user.xxx 统一改为 userStore.currentUser.xxx
修复个人资料、设置页面用户信息读取字段不匹配问题
重构收藏页面逻辑，适配新版 favoriteStore 数据结构
统一收藏方法调用：isFavorited() → isFavorite()，入参格式同步调整
导航栏、我的发布页面统一用户 ID、头像读取语法
删除个人资料页废弃无用 CSS 样式代码

# 七、功能测试结果
二手交易商品卡片正常显示收藏按钮，点击可切换收藏 / 已收藏状态
顶部导航栏正常渲染模拟用户名称与头像
个人中心可完整展示用户资料，我的收藏区域实时同步收藏商品
收藏列表支持取消收藏，商品即时从列表移除
所有发布页面自动填充当前登录用户作为发布人
页面刷新后收藏数据清空，符合仅内存存储、无持久化的预期效果

# 八、开发问题与解决方案
问题
旧视图文件均采用早期用户、收藏仓库 API 命名，与本次新建标准 Pinia 仓库字段、方法名不兼容，页面大量报错。
解决
全局检索所有 Vue 文件内 请求接口，不仅产生大量冗余代码，还极易出现页面数据更userStore、favoriteStore 相关调用，统一替换为规范的 currentUser、isFavorite、toggleFavorite 新接口，完成全页面适配。

# 九、当日开发总结反思
Pinia 核心作用是实现跨组件、多页面的响应式全局数据共享。本次项目搭建 userStore 与 favoriteStore 两套仓库，userStore 供导航栏、发布页、个人中心等 7 个页面读取用户信息，favoriteStore 支撑交易列表、商品详情、收藏页等 4 个页面同步操作收藏数据。若不使用 Pinia，只能依靠多层 props 传值，或每个页面单独定义数据、重复新不同步、一处修改多处同步维护的麻烦，后续迭代修改成本极高。借助 Pinia 统一托管全局状态，只需在仓库内修改数据，所有引用该状态的页面会自动响应更新，无需手动传递、同步数据，简化多页面项目的数据流转逻辑，降低代码维护难度，是 Vue 项目高效管理全局状态的优选方案。