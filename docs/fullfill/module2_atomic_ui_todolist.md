# Module 2: 原子 UI 组件模块 (Atomic UI)

## 详细设计
本模块负责基础的视图组件。组件需要具备无状态 (Stateless)、高可复用性，并严格遵循“欧美高级感”的设计规范（如：Framer Motion 微交互、高对比度、圆角、阴影）。

- **Button (`components/ui/Button.tsx`)**: 支持主按钮、次级按钮，需内置 `hover:scale` 和 `active:scale` 物理反馈。
- **Card/Option (`components/ui/Card.tsx`)**: 作为单选题的选项，支持选中高亮态（Primary Ring 边框 + 浅色背景）。
- **Input (`components/ui/Input.tsx`)**: 包含浮动 Label、输入限制，并能接收 Zod 的 `error` 状态变红并震动（Framer Motion 关键帧）。
- **ProgressBar (`components/ui/ProgressBar.tsx`)**: 顶部步骤进度指示器。

## ToDo List
- [x] 1. **实现 Button 组件**
  - [x] 定义 `variant` (primary, secondary)。
  - [x] 使用 Framer Motion 的 `<motion.button>` 实现按压反馈 (`whileHover`, `whileTap`)。
- [x] 2. **实现 Option Card 组件**
  - [x] 支持传入 `selected` 状态，并动态附加对应的 Tailwind Classes (通过 `clsx` / `tailwind-merge`)。
- [x] 3. **实现 Input 组件**
  - [x] 添加错误状态 `hasError` 及下方的错误提示信息文案。
  - [x] 结合 Framer Motion 对 `hasError` 为 `true` 时触发水平震动 (`x: [-5, 5, -5, 5, 0]`)。
- [x] 4. **实现 ProgressBar 组件**
  - [x] 接收当前进度百分比 `value`。
  - [x] 使用 `<motion.div>` 使得进度条增长时具有平滑的过渡效果。
- [x] 5. **UI 走查与测试**
  - [x] 在单独的测试页面 (如 `/test-ui`) 挂载所有组件。
  - [x] 测试响应式尺寸和深浅模式（若需要）的 Tailwind 表现。
