import { defineConfig } from 'vitest/config';

// 任务3 专用配置：只跑 reviews 下的审查用例
export default defineConfig({
  test: {
    include: ['reviews/**/*.test.ts'],
  },
});
