# Module 1: 数据流与工具链模块 (Data & Utilities)

## 详细设计
本模块是整个应用的基础，负责全局状态存储、数据校验规则和纯计算逻辑。优先实现本模块可以确保后续 UI 和业务组件能够基于稳定的数据层进行开发。

- **Zustand Store (`store/useQuizStore.ts`)**: 需要包含所有问卷收集字段，以及动画方向 `direction`。
- **Zod Schema (`utils/validation.ts`)**: 定义基础信息和身体数据的校验规则，如年龄 (18-100)，身高，体重等。
- **纯函数计算 (`utils/calculation.ts`)**: 包含 BMI 计算、基于目标的预测耗时（如：每周减重 0.5kg，计算达到 targetWeight 的周数）。

## ToDo List
- [x] 1. **实现 Zustand Store**
  - [x] 定义 State 接口 (包含性别, 目标, 单位, 年龄, 身高, 体重, 目标体重, 频率, 动画方向等)。
  - [x] 定义 Actions (如 `setField`, `setDirection`)。
  - [x] 引入并配置 `persist` 中间件，存储到 `localStorage`。
- [x] 2. **实现 Zod Schema**
  - [x] 创建 `bodyDataSchema` 包含年龄、身高、体重、目标体重的校验。
  - [x] 针对公制/英制（Metric/Imperial）考虑校验范围的转换或分离 Schema。
- [x] 3. **实现计算工具函数**
  - [x] 编写 `calculateBMI(weight, height, unit)` 并附带边界测试。
  - [x] 编写 `calculateTargetDate(currentWeight, targetWeight, goal)` 函数推算目标日期。
- [x] 4. **模块独立测试**
  - [x] 编写简单的单元测试 (Jest/Vitest) 或在控制台验证 `calculation` 与 `validation` 逻辑。
  - [x] 验证 Store 在本地浏览器控制台挂载后持久化功能是否正常。
