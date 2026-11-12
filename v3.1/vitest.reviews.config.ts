import { defineConfig } from 'vitest/config';

// 实验2 Part3 的审查用例：跑 AI 第一轮代码，看它漏在哪
export default defineConfig({
  test: {
    include: ['reviews/**/*.test.ts'],
  },
});
