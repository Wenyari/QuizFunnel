根据提供的上下文构建新的图表工具

新增工具请严格遵循现有 bar.ts 与 bar3D.ts 的设计与风格：工具入口使用 zod 定义 inputSchema、run 仅转发到 ChartFactoryEngine.generate 返回 Phase 1 配置 JSON，元数据与工具实现在同一文件中管理，按 src/taxonomy/categories.ts 选择分类，并在 registry 中确保 '<tool>_chart' 与 'generate_<tool>_chart' 一致。

需要新增的文件：
- src/tools/charts/<tool>.ts：工具入口，包含元数据和实现
  - 元数据：`export const <tool>ChartMetadata = { name: 'generate_<tool>_chart', description: '...', tags: [...], categories: [...] };`
  - 工具：`metadata: <tool>ChartMetadata, name: <tool>ChartMetadata.name, description: <tool>ChartMetadata.description`
- src/factory/recipes/<tool>.ts：业务配方；将 {data, encoding, theme, width, height} 映射为 ChartConfig（主视图、layer.encoding、必要样式可放入 layer.style）。
- 如需新图层：src/types/core-layer.ts 新增 Layer 类型并扩展 ChartLayer 联合类型。

需要修改的文件：
- src/factory/registry.ts：注册 '<tool>_chart' → <recipe>，与引擎从 'generate_<tool>_chart' 解析的键一致。
- src/tools/index.ts：将新工具加入 chartTools 数组导出，供 Router 动态注册与服务端使用。
- src/taxonomy/service.ts：导入新工具的元数据 `import { <tool>ChartMetadata } from '../tools/charts/<tool>';` 并将其添加到 ALL_TOOLS_METADATA 数组中。
- 可选：src/tools/shared/schemas.ts 抽取通用 dataPoint/schema 以复用（如多个工具使用相同输入结构）。

命名与约束：
- 工具名使用 'generate_<tool>_chart'；配方键使用 '<tool>_chart'；保持与引擎解析一致。
- 元数据包含 name、description、tags、categories，**!IMPORTANT: 严格遵循/docs/chartMetadata编写指南.md**，直接在工具文件中定义。
- description 使用 <tool>ChartMetadata.description；分类从 src/taxonomy/categories.ts 选择（可多选）。
- Phase 1 仅返回配置 JSON（options）；不渲染、不生成源码；忽略非主视图的扩展（如 secondary）。

架构说明：
- 元数据现在与工具实现绑定在同一个文件中，提高了内聚性并支持按需打包。
- metadata-collector.ts 会动态从各工具文件收集元数据，TaxonomyService 通过此收集器获取所有工具信息。