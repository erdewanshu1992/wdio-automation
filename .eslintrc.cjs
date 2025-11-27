module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['wdio'],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'wdio/no-pause': 'off',
    'wdio/await-expect': 'error',
  },
  overrides: [
    {
      files: ['test/**/*.js', 'test/**/*.ts'],
      env: {
        browser: true,
        node: true,
        mocha: true,
      },
      globals: {
        browser: 'readonly',
        $: 'readonly',
        $$: 'readonly',
        expect: 'readonly',
        driver: 'readonly',
        allure: 'readonly',
        global: 'readonly',
      },
      rules: {
        'wdio/no-pause': 'warn',
        'no-undef': 'off', // Mocha globals are handled by env
      },
    },
  ],
};