# Day3 Evidence — Mock 数据建模与列表渲染

## 1. 今日完成内容

今天完成了四大业务模块的 Mock 数据建模、API 接口封装以及列表页面渲染工作，具体包括：

- **Mock 数据（db.json）**：为二手交易（trades）、失物招领（lostFounds）、拼单搭子（groupBuys）、跑腿委托（errands）四个数据集合编写了完整的 JSON 示例数据，每个集合包含 10–12 条贴近校园场景的模拟数据。
- **API 封装（src/api/）**：基于 Axios 封装了 HTTP 请求模块（http.ts），并为每个业务模块创建独立的接口文件（trade.ts、lostFound.ts、groupBuy.ts、errand.ts），导出获取列表和获取详情的函数。
- **TypeScript 类型定义（src/types/）**：为每个数据模型定义接口，约束字段类型，确保前后端数据一致。
- **列表页面渲染**：完成了 TradeView、LostFoundView、GroupBuyView、ErrandView 四个列表页，包含搜索、分类筛选、排序、分页等功能，使用 Element Plus 组件库构建 UI。
- **Pinia 状态管理（src/stores/item.ts）**：创建 item store，集成 Mock 数据作为 JSON Server 请求失败时的降级方案。

## 2. Mock 数据结构说明

| 数据集合 | 对应业务 | 主要字段 | 页面用途 |
|---|---|---|---|
| trades | 二手交易 | title、price、category、condition、location、status | 展示二手商品列表 |
| lostFounds | 失物招领 | type、itemName、location、happenedAt、status | 展示失物和招领信息 |
| groupBuys | 拼单搭子 | title、type、targetCount、currentCount、deadline、meetLocation | 展示拼单和搭子信息 |
| errands | 跑腿委托 | title、type、reward、deliveryLocation、expectedTime、status | 展示跑腿任务列表 |

## 3. 我的设计

### 二手交易字段设计

之所以为二手交易设计 `price` 字段，是因为买卖双方最关心的核心信息就是价格，学生在二手交易时习惯通过价格快速筛选商品；同时加上 `originalPrice` 用于对比展示折扣力度，增强购买意愿。`condition`（成色）字段是二手交易特有的属性，不同于全新商品，二手商品需要通过成色描述（全新/九成新/七成新等）来传递物品的使用程度，这是买家做决策的重要依据。`category` 字段用于分类筛选，方便用户按教材、电子产品等快速定位。

### 失物招领字段设计

`type` 字段取值为"丢失"或"拾到"，这是失物招领业务最核心的二分类维度。用户在失物招领页面首先需要区分是看丢失信息还是拾到信息，因此必须通过 type 做 Tab 切换或筛选。`itemName` 描述具体物品名称（如"校园卡""充电宝"），`happenedAt` 记录丢失/拾到的时间，`location` 记录地点，这些字段帮助失主快速匹配自己的物品。不设计 `price` 字段，因为失物招领不涉及交易。

### 拼单搭子字段设计

`targetCount` 和 `currentCount` 是拼单业务的核心配套字段。拼单的本质是凑够一定人数才能成团：`targetCount` 表示目标人数，`currentCount` 表示已参与人数。页面通过 Progress 进度条直观展示"3/5人"的拼单进度，并计算"还差 X 人"的提示文案，驱动用户参与。`deadline` 字段用于显示截止时间倒计时，增强紧迫感。`meetLocation` 记录线下碰头地点。

### 跑腿委托字段设计

跑腿委托的核心要素是"谁从哪送到哪、给多少报酬"——`from` 和 `to` 在实际数据中对应了任务的内容描述和 `deliveryLocation`，以及 `type`（取快递/送东西/代购）来区分任务种类。`reward`（报酬金额）是所有跑腿任务最重要的筛选和排序维度，用户通常优先关注高报酬任务。`status` 字段包含"待接单/已接单/已完成/已取消"四种状态，用于区分任务的生命周期，列表页也根据状态显示不同的操作按钮（如待接单才显示"接单"按钮）。

## 4. AI 设计

AI 工具在本项目中完成了以下内容的生成：

- **db.json**：AI 根据需求生成了完整的 JSON Server 数据文件，包含 trades、lostFounds、groupBuys、errands 四个集合，每个集合包含多条示例数据，覆盖了主校区、东校区、西校区等校园地点，数据内容（如"出闲置教材《软件工程导论》""拼单买水果""代购烧鸭饭"）均贴合校园场景。
- **API 模块**：AI 生成了 http.ts（Axios 实例配置）、trade.ts、lostFound.ts、groupBuy.ts、errand.ts，定义了完整的接口函数和 TypeScript 类型定义。
- **页面列表代码**：AI 生成了四个列表页面的框架代码，包括 Element Plus 组件集成、筛选逻辑、分页逻辑、路由跳转、收藏功能等。
- **额外生成内容**：AI 还生成了 Pinia store、mock/data.ts 降级数据、format.ts 工具函数、constants.ts 常量定义等辅助模块。

AI 生成内容中存在的不合理之处：

1. **字段命名不一致**：AI 在 db.json 中使用 `eventTime`，但在 TypeScript 接口中使用 `happenedAt`，导致列表渲染时字段匹配不上，页面显示空白。
2. **图片链接格式**：AI 直接硬编码了完整的 Unsplash URL，没有做可维护性处理。我后续统一提取为模板字符串变量，方便批量替换。
3. **缺失图片兜底**：AI 在 ErrandView 中没有处理图片为空的情况，当 `images` 数组为空时会导致页面展示异常图片。
4. **价格过滤逻辑不完善**：AI 初始生成的筛选逻辑没有考虑空值情况，导致 `priceMin` 为 0 时也会参与过滤，误筛掉所有价格大于 0 的商品。

## 5. 最终调整

在 AI 生成代码的基础上，我做了以下手工调整：

- **修正字段名不一致问题**：将 db.json 中的 `eventTime` 统一改为 `happenedAt`，与 TypeScript 接口定义保持一致。同时在 errands 中将 `from`、`to` 字段改为 `deliveryLocation`，因为跑腿的送达地更符合实际业务语义。
- **优化图片处理**：为跑腿任务列表添加了图片兜底逻辑 `item.images?.[0] || 'https://images.unsplash.com/photo-...'`，避免图片字段为空时页面错乱。
- **修复价格过滤 Bug**：将 `priceMin` 和 `priceMax` 的类型改为 `number | null`，在过滤条件中增加 `!== null` 判断，确保用户未输入时不参与过滤。
- **补充筛选字段**：在 TradeView 中补充了 `conditionFilter` 成色筛选和价格区间筛选，在 ErrandView 中补充了报酬范围筛选，让列表页功能更完整。
- **调整排序默认值**：将排序方式默认值设为 `latest`（最新发布）而非 `price-asc`，因为用户浏览二手商品时通常优先看最新发布的商品。
- **提取常量**：将分类、成色、校区、排序选项等硬编码字符串抽取到 `constants.ts` 中统一管理，便于后续维护和拓展。

## 6. 遇到的问题与解决方法

### 问题：字段名不一致导致列表渲染空白

**现象**：JSON Server 启动后，TradeView 页面能正常显示数据，但 LostFoundView 页面始终渲染不出内容，控制台打印 `items.value` 为空数组。

**排查过程**：
1. 首先在浏览器控制台用 `fetch('http://localhost:3001/lostFounds')` 直接请求 JSON Server，发现数据能正常返回，排除 JSON Server 自身问题。
2. 检查 Axios 请求日志，发现请求成功且状态码 200，但返回数据的字段名与页面模板中引用的字段名不一致。
3. 对比 `db.json` 和 `src/types/lost.ts`，发现 db.json 中失物招领数据使用的字段名是 `eventTime`，而 TypeScript 接口定义的是 `happenedAt`；同理，页面模板中使用的 `item.location` 在数据中实际是 `location`（这个侥幸一致），但 `happenedAt` 字段完全匹配不上，导致 `formatTime(item.happenedAt)` 返回"Invalid Date"。

**解决方法**：
- 打开 `db.json`，搜索 `eventTime` 全局替换为 `happenedAt`，确保与类型定义一致。
- 同时检查 errands 数据，将原来 AI 生成的不合理字段名（如 `from`、`to`）统一改为语义更清晰的 `deliveryLocation`。
- 更新完成后重启 JSON Server，页面数据正常渲染。

**反思**：AI 生成的代码中，db.json 的字段名与 TypeScript 接口的字段名没有对齐，这是一个容易被忽略但影响致命的细节。人工校对是必不可少的环节。

## 7. 今日反思

Mock 数据建模是前端开发中极为关键的基础工作，它在后端接口尚未就绪时就为前端提供了独立开发和调试的能力。通过本次实践，我对 Mock 数据、JSON Server 和列表渲染三者之间的关系有了更深入的理解。

第一，Mock 数据决定了整个项目的开发起点。在本次项目中，我使用 JSON Server 搭建了一套完整的 RESTful API 后端模拟环境，通过 db.json 文件为四大业务模块提供了结构化的测试数据。Mock 数据的字段设计直接影响到后续所有页面的展示效果和交互逻辑——如果字段设计不合理，比如失物招领缺少 type 字段，那么"丢失"和"拾到"的筛选逻辑就无法实现；如果拼单搭子缺少 targetCount 和 currentCount，进度条展示就无从谈起。因此，Mock 数据建模不是简单地堆砌 JSON 字段，而需要深入理解业务需求，提前规划好每个字段的语义和用途。

第二，JSON Server 的引入大大简化了前后端联调的成本。只需一个 db.json 文件和一行 `json-server --watch db.json --port 3001` 命令，就能获得完整的 CRUD API，支持分页、筛选、排序等常用查询能力。在本项目中，前端页面通过 Axios 向 JSON Server 发送 HTTP 请求获取数据，完整模拟了真实后端接口的调用流程。当 JSON Server 不可用时，还可以通过 Pinia store 中内置的 Mock 数据降级到本地渲染，确保页面不会完全白屏——这种"在线优先、离线降级"的设计思路对提升用户体验非常重要。

第三，列表渲染是将 Mock 数据转化为用户可见界面的关键环节。从我的设计角度看，TradeView 需要展示价格、成色标签、发布者头像等丰富信息，因此采用了卡片式布局（ElCard）；LostFoundView 更强调类型区分（丢失/拾到），所以用不同颜色 ElTag 区分；GroupBuyView 的核心是拼单进度，因此引入 ElProgress 进度条组件；ErrandView 则需要突出报酬和接单按钮。这些差异化的列表渲染策略，都源自对四大业务本质的思考——我的设计决定了每个页面展示什么数据，AI 设计则帮助生成模板框架代码，但字段筛选、UI 布局、交互细节必须人工反复调试才能达到可用状态。

在整个过程中，我深刻体会到人工修改和判断的必要性。AI 可以快速生成大量的代码框架和数据模板，但在字段命名一致性、边缘情况处理（如空图片兜底、空值过滤）、业务语义贴合度（如将 from/to 改为 deliveryLocation）等方面都存在明显不足。例如，AI 生成的 db.json 中使用 eventTime 而接口使用 happenedAt，这种不一致要是在真实项目中会导致线上 bug；AI 没有为图片字段做空值处理，可能导致页面展示断裂图。这些都需要通过人工审查和测试发现并修复。如果只依赖 AI 而不做人工判断，最终交付的代码将充满隐患。

总而言之，Mock 数据建模、JSON Server 搭建和列表页面渲染三者构成了一条完整的前端独立开发链路。Mock 数据提供内容，JSON Server 提供服务接口，列表渲染呈现给用户。掌握这三者之间的配合关系，对于后续接入真实后端、实现复杂的业务逻辑（如发布商品、订单管理、消息通信）有着直接的帮助和借鉴意义。这次实践让我认识到，前端开发不仅是写 UI 组件，更需要具备数据建模能力和接口设计思维。
