import { useState, type FormEvent } from 'react';

export interface TodoFormProps {
  /** 事件向上：输入框只管收集文本并通知父组件，不自己存列表 */
  onAdd: (text: string) => void;
}

// 职责单一：只收输入。text 是表单自己的内部 State，父组件不需要知道
export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onAdd(text);
    setText('');
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        className="input"
        value={text}
        placeholder="要做什么？"
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn primary" type="submit">
        添加
      </button>
    </form>
  );
}
