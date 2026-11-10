module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    // W10 遗留的三条规则，W11 继续生效
    '@typescript-eslint/no-explicit-any': 'error',
    complexity: ['error', 10],
    'max-depth': ['error', 3],
  },
};
