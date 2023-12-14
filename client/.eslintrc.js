module.exports = {
  root: true,
  ignorePatterns: [
    'projects/**/*'
  ],
	env: {
		browser: true,
		es2021: true
	},
	extends: [],
	overrides: [
    {
      files: [
        '*.ts'
      ],
      parserOptions: {
        project: [
          'tsconfig.json'
        ],
        createDefaultProgram: true
      },
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/stylistic',
        'airbnb-typescript/base',
        'prettier',
        'plugin:prettier/recommended'
      ],
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase'
          }
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case'
          }
        ],
        '@typescript-eslint/explicit-member-accessibility': ['warn'],
        '@typescript-eslint/no-duplicate-enum-values': 'off',
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-duplicate-type-constituents': 'error',
        '@typescript-eslint/no-for-in-array': 'error',
        '@typescript-eslint/no-implied-eval': 'error',
        '@typescript-eslint/no-mixed-enums': 'error',
        '@typescript-eslint/prefer-includes': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
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
        quotes: ['warn', 'single', { 'allowTemplateLiterals': true }],
        curly: 'warn',
        eqeqeq: ['warn', 'smart'],
        'no-magic-numbers': ['warn', { 'ignore': [-1, 0, 1, 2, 3, 8, 32, 10, 20, 50, 100, 1000, 1e-10, 4, 0.5, 5, 9, 6, -2, 10000, 20000, 0.1, 60, 61, 124, -3, -5, 1.5, 4.5]}],
      }
    },
    {
      files: [
        '*.html'
      ],
      extends: [
        'plugin:@angular-eslint/template/recommended',
        'prettier',
        'plugin:prettier/recommended'
      ],
      rules: {
        'prettier/prettier': ['warn']
      }
    }
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		'ecmaVersion': 'latest'
	},
	plugins: [
		'@typescript-eslint'
	],
	rules: {}
};
