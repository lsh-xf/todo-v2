import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: { port: 5174 },
  test: {
    // 主线单测只跑 src；reviews 下是实验 2 的 AI 第一轮审查材料，单独跑
    include: ['src/**/*.test.ts'],
  },
});
