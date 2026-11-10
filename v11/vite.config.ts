import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    // 主线单测只跑 src；materials / reviews 是任务3 的审查材料，单独用 vitest.reviews.config.ts 跑
    include: ['src/**/*.test.ts'],
  },
});
