// Análisis estático básico de JavaScript. JSX usa referencias a componentes
// que la regla base no-unused-vars no reconoce sin un plugin de React.
export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**'] },
  {
    files: ['**/*.{js,cjs,mjs,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-debugger': 'error',
      'no-constant-condition': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // Evita falsos positivos para componentes usados como etiquetas JSX.
    files: ['frontend/**/*.jsx'],
    rules: { 'no-unused-vars': 'off' },
  },
];
