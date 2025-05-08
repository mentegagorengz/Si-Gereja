module.exports = {
    root: true,
    env: {
      node: true,
      browser: true
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      'prettier'
    ],
    rules: {
      'no-console': 'off',
      'no-debugger': 'off'
    }
  }