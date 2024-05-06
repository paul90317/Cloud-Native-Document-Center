module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['vue'],
  rules: {
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-debugger': 'off',

    'vue/multi-word-component-names': 'off',

    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 2,
        multiline: {
          max: 1,
        }
      }
    ],
  }
}
