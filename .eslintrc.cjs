// 程式碼規範
/* eslint-env node */
module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', '@vue/standard', '@vue/eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'comma-dangle': 0,
    'no-unused-vars': 1,
    camelcase: 0,
    'no-control-regex': 0,
    'no-void': 'off',
  },
}
