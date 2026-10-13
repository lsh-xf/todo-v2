# Todo V2.0 — 数据驱动待办应用

一个用原生 JavaScript（无任何框架）实现的待办事项应用，作为《Web 编程》第 7 周 AI 协作实验的产出。

## 功能

- 新增任务（addTodo）：用展开运算符 `[...todos, item]` 生成新数组，不修改原数组
- 删除任务（removeTodo）：用 `filter` 生成不含该 id 的新数组
- 切换完成状态（toggleTodo）：用 `map + 展开` 返回新对象，不可变更新
- 清除已完成（clearCompleted）：脱离 AI 独立完成，同样用 `filter`
- 筛选视图（全部 / 进行中 / 已完成）：`filterState` 只过滤“显示副本”，绝不改动 `todos` 本身
- 持久化（localStorage）：`save()` 写入、`load()` 在启动时恢复，刷新不丢数据

## 运行方式

直接用浏览器打开 `index.html` 即可，无需构建工具、无需服务器。

## 架构要点

- **状态唯一的家**：所有状态集中在 `todos` 数组与 `filterState` 变量里，DOM 只是数据的投影。
- **统一三步口诀**：每个操作函数都遵循「改数据 → 保存 → 重渲染」——先生成新数据（展开 / filter / map），再 `save()` 写 localStorage，最后 `render()` 重画列表。
- **不可变更新**：添加用展开、删除用 filter、切换用 map + 展开，原数组与其中对象始终不被就地修改，状态可追溯、易调试。

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `index.html` | 页面结构 + 引入脚本与样式 |
| `app.js` | V2.0 数据驱动核心逻辑（add / remove / toggle / clearCompleted / filter / 持久化） |
| `final.css` | 页面与列表样式 |
| `ai_todo.js` | 第 6 周 AI 生成的首版参考代码（保留作对比，未被页面加载） |

## AI 协作

本项目的 `app.js` 在 AI 编程助手（WorkBuddy）辅助下完成：先由 AI 生成初版，再由本人审查并修正其“就地修改状态/数组”的写法，改为不可变更新风格，最后脱离 AI 独立完成 `clearCompleted`。详细过程见课程要求的《AI 协作日志 W7》。
