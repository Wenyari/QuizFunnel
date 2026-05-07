# Module 3 问卷引擎与路由架构总结

本文档记录了基于《项目设计文档》以及《Module 3: 问卷引擎与路由架构》完成的具体实现，以及在过程中进行的架构重构决策与 Bug 修复。

---

## 一、 架构重构：从动态路由迁移至单路由 SPA

### 1. 重构动机

原始设计方案采用 Next.js 的 `/quiz/[step]` 动态路由架构。在参考行业顶级产品（如 BetterMe）的交互体验后，识别到其核心优势在于：问卷步骤切换**不产生路由跳转**，从而消除了 Next.js 路由切换带来的网络请求延迟与重渲染开销，达到**零延迟的丝滑组件切换**效果。

### 2. 最终采用的架构

**状态驱动的单路由 SPA（Single-Route SPA）：**
所有问卷步骤均在 `/quiz` 这一个 URL 下完成，步骤切换由 Zustand 全局状态调度，而非 URL 路径变化。

| 层级 | 文件 | 职责 |
|---|---|---|
| 状态层 | `store/useQuizStore.ts` | 维护 `currentStepId`（当前步骤 ID）和 `direction`（动画方向）|
| 配置层 | `config/quizFlow.ts` | 数组形式定义每步的 `id`、`type`、标题、选项、`nextStep`、`prevStep` |
| 调度层 | `app/quiz/page.tsx` | 监听 `currentStepId` 变化，查找配置并渲染对应业务组件，承载动画容器 |
| 导航层 | `app/quiz/NavigationButtons.tsx` | 点击时同步更新 `direction` 和 `currentStepId`，不调用 `router.push()` |

### 3. 核心优势

- **零延迟切换**：无网络请求，步骤切换完全由本地状态驱动。
- **刷新记忆**：`useQuizStore` 已启用 `zustand/persist` 中间件，`currentStepId` 自动持久化至 `localStorage`，用户刷新后可恢复到上次停留的步骤。
- **动画归一**：`AnimatePresence` 与 `currentStepId` 同处一个组件层级，以 `key={currentStepId}` 作为触发条件，动画控制更干净、优先级更高。

---

## 二、 问卷流程配置 (quizFlow)

在 `config/quizFlow.ts` 中以**配置驱动**方式定义了 Step 1–3 的全部结构：

| 步骤 | 类型 | 主题 |
|---|---|---|
| Step 1 | `single_choice` | 基础信息 - 性别选择 |
| Step 2 | `body_data` | 身体数据 - 年龄/身高/体重输入 |
| Step 3 | `single_choice` | 活动频率 - 五档选择 |

每个节点通过 `nextStep` / `prevStep` 字段串联流转，由调度器自动读取，无需在组件内部硬编码跳转逻辑。

---

## 三、 问题修复记录

### Bug 1：`params.step` 同步访问错误

- **现象**：控制台报错 `params is a Promise and must be unwrapped with await`。
- **原因**：Next.js 新版本将动态路由的 `params` 异步化（Promise 化）。
- **修复**：将 Page 组件声明为 `async function`，并使用 `await params` 解构后再访问 `.step`。

### Bug 2：`setState-in-render` React 违规

- **现象**：控制台报错 `Cannot update a component while rendering a different component`。
- **原因**：在组件函数体（渲染阶段）内直接调用 `useQuizStore.getState().reset()`，触发了同步的状态更新，违反了 React 渲染纯函数原则。
- **修复**：将 `reset()` 调用包裹进 `useEffect`，确保在渲染完成后才执行副作用。

### Bug 3：`/quiz` 页面白屏（高度链断裂）

- **现象**：访问 `/quiz` 路由，页面完全空白。
- **原因**：CSS 高度链断裂。`body` 设置了 `min-h-full`，不向子元素传递明确高度。`motion.div` 使用 `absolute inset-0` 定位，其定位参照是父元素的实际 `height`，而 `min-height` 不等于 `height`，导致父容器高度为 0，绝对定位的子元素也随之不可见。
- **修复**：将 `body` 从 `min-h-full` 改为 `h-full`，打通 `html → body → layout → page` 的完整高度链，确保 `flex-1` 和 `absolute inset-0` 都能正确计算高度。

### Bug 4：问卷内容被固定宽容器限制

- **现象**：问卷页面被约束在 `max-w-md`（448px）的固定容器中，在 PC 端和移动端均显示异常。
- **原因**：早期为了模仿 App 窗口效果引入了 `max-w-md mx-auto` 的外层容器，但这不符合漏斗页面铺满屏幕的交互诉求。
- **修复**：移除外层固定容器，改为**弹性全屏布局**。`motion.div` 占据 `absolute inset-0` 全屏，内容层使用 `max-w-2xl mx-auto` 居中限宽：移动端铺满屏幕，PC 端保持 672px 最大宽度，兼顾视觉质感与文字可读性。

---

## 四、 当前状态

- ✅ `/quiz` 路由可访问，内容正常渲染
- ✅ 点击「下一步」/「上一步」，URL 保持不变，内容左右滑动切换
- ✅ 刷新页面后，步骤进度从 localStorage 恢复
- ✅ 架构设计文档（`docs/项目设计文档.md`）已同步更新
