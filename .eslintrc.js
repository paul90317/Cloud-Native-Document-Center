module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
  ],
  parserOptions: {
    emcaVersion: 2020,
  },
  rules: {
    'vue/html-indent': ['error', 'tab', {
      'alignAttributesVertically': true
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1
    }],
  }
}