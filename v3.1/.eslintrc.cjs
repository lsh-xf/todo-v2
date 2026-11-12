module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    // 规则 1：禁止显式 any（类型逃逸）
    '@typescript-eslint/no-explicit-any': 'error',
    // 规则 2：圈复杂度上限 10（分支堆叠）
    complexity: ['error', 10],
    // 规则 3：嵌套深度上限 3（箭头型代码）
    'max-depth': ['error', 3],
  },
};
