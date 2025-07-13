module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // TypeScript rules (using default CRA setup)
    'no-unused-vars': 'off', // Handled by TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
    
    // React specific rules
    'react/prop-types': 'off', // TypeScriptで型チェックするため
    'react/react-in-jsx-scope': 'off', // React 17+ では不要
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    
    // General code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    
    // Import/Export rules
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'import/no-default-export': 'off', // React components で default export を使用
    
    // Naming conventions
    'camelcase': ['error', { properties: 'never' }],
    
    // Code style (Prettierと重複しないもの)
    'jsx-quotes': ['error', 'prefer-double'],
    'object-shorthand': ['error', 'always'],
    'prefer-template': 'error'
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: {
        // テストファイルでは一部ルールを緩和
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-console': 'off'
      }
    }
  ]
};