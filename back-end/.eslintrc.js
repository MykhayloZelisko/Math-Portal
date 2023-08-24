module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb-typescript/base',
    'prettier',
    'plugin:prettier/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/typedef': [
      'warn',
      {
        'call-signature': true,
        parameter: true,
        'arrow-parameter': true,
        'property-declaration': true,
        'variable-declaration': true,
        'member-variable-declaration': true,
        'object-destructuring': true,
        'array-destructuring': true
      }
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'lines-between-class-members': 'off',
    'no-var': 'error',
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-duplicate-case': 'error',
    'prefer-const': 'warn',
    curly: 'warn',
    eqeqeq: ['warn', 'smart'],
    'no-magic-numbers': ['warn', { 'ignore': [-1, 0, 1, 2, 3, 4, 5, 100, 8, 32]}],
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/explicit-member-accessibility': ['warn']
  },
};
