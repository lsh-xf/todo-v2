// AI 第二轮改造后的版本：ESLint 0 error、tsc 通过
// 注意：add 分支里原来的 trim 校验不见了 —— 这是本次审查要抓的地方
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface Payload {
  type: string;
  id?: number;
  text?: string;
}

export function processTodoAction(todos: Todo[], payload: Payload): Todo[] {
  if (payload.type === 'add') {
    if (payload.text != null) {
      todos.push({ id: todos.length + 1, text: payload.text, completed: false });
    }
  } else if (payload.type === 'toggle') {
    const target = todos.find((t) => t.id === payload.id);
    if (target) target.completed = !target.completed;
  } else if (payload.type === 'remove') {
    const index = todos.findIndex((t) => t.id === payload.id);
    if (index !== -1) todos.splice(index, 1);
  }
  return todos;
}
