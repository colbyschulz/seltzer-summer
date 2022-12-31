module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  env: {
    es6: true,
    node: true,
  },
  rules: {},
};
