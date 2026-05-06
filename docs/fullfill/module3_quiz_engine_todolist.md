# Module 3: 问卷引擎与路由架构 (Quiz Engine)

## 详细设计
该模块是 Quiz 系统的核心调度中枢。利用配置驱动的方式解耦 UI 与业务流。它需要配合 Framer Motion 提供的 `<AnimatePresence mode="wait">` 实现丝滑的跨页过渡，并依据 Store 中的 `direction` 决定是从左向右还是从右向左滑动。

- **QuizFlow 配置 (`config/quizFlow.ts`)**: 数组形式定义每步的 ID、类型、文案和选项。
- **Layout 包装 (`app/quiz/layout.tsx`)**: 包含返回按钮、顶部 ProgressBar、以及 AnimatePresence。
- **动态分发器 (`app/quiz/[step]/page.tsx`)**: 读取 URL 参数，查找 `quizFlow` 配置，根据 `type` 渲染对应业务视图。

## ToDo List
- [ ] 1. **定义问卷配置表**
  - [ ] 在 `config/quizFlow.ts` 中定义 Step 1-3 的结构（基础信息、身体数据、频率）。
- [ ] 2. **实现路由动画容器 (Layout)**
  - [ ] 引入 `<AnimatePresence mode="wait">`。
  - [ ] 使用 `<motion.div>` 作为页面容器，接收 `custom={direction}` 决定进出场初始位置。
- [ ] 3. **处理全局前进/后退逻辑**
  - [ ] 监听组件的 Next/Prev 点击，调用 Store 设置对应的 `direction` (1 或 -1)。
  - [ ] 解决浏览器自带后退按钮的监听问题（如使用 `next/navigation` 的特性或 `popstate`）。
- [ ] 4. **实现动态分发器 (Dispatcher)**
  - [ ] 在 `[step]/page.tsx` 中解析 `params.step`。
  - [ ] 若 Step 不存在，重定向到起点。
- [ ] 5. **流转连通性测试**
  - [ ] 使用纯文本或假组件充当 Step 1-3，测试点击“下一步”、“上一步”时页面的 URL 变化和滑动方向是否符合直觉。
