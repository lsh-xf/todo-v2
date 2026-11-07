// 材料 A：改造前的「能跑但很烂」版本（仅用于 ESLint 靶子演示，改造完成后已移除）
// 病症：满屏 any、四层嵌套、死变量 snapshot
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function processTodoAction(todos: any[], action: string, payload: any): any[] {
  const snapshot = todos.slice();

  if (action === 'add') {
    if (payload && payload.text) {
      if (payload.text.trim() !== '') {
        if (!payload.id) {
          const newTodo = {
            id: Date.now(),
            text: payload.text,
            completed: false,
          };
          todos.push(newTodo);
          return todos;
        } else {
          return todos;
        }
      } else {
        return todos;
      }
    } else {
      return todos;
    }
  } else if (action === 'delete') {
    if (payload && payload.id) {
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === payload.id) {
          todos.splice(i, 1);
          return todos;
        }
      }
      return todos;
    } else {
      return todos;
    }
  } else if (action === 'toggle') {
    if (payload && payload.id) {
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === payload.id) {
          todos[i].completed = !todos[i].completed;
          return todos;
        }
      }
      return todos;
    } else {
      return todos;
    }
  } else {
    return todos;
  }
}
