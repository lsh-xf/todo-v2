import { useState } from 'react';

interface TodoFormProps {
  onAdd: (text: string) => void;
}

function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (trimmed === '') return;
    onAdd(trimmed);
    setText('');
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="输入任务后回车"
        aria-label="新任务"
      />
      <button type="submit" className="btn-add">
        添加
      </button>
    </form>
  );
}

export default TodoForm;
