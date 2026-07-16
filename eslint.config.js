import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import globals from 'globals'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    }
  },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    }
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/attributes-order': 'off',
      'vue/require-default-prop': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/first-attribute-linebreak': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      'vue/no-bare-strings-in-template': ['error', {
        'allowlist': [
          '（', '）', '：', '；', '，', '。', '、', '—', '～', '・',
          '(', ')', ':', ';', ',', '.', '&', '+', '-', '=', '*', '/', '\\', '|',
          '?', '!', '@', '#', '$', '%', '^', '_', '<', '>', '~', '`', '\'', '"',
          ' ', '\n', '\t', '\r',
          '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'px', 'em', 'rem',
          'A', 'I', 'U', 'E', 'O', '-row', '→', '&rarr;'
        ],
        'attributes': {
          'input': ['placeholder'],
          'textarea': ['placeholder'],
          'img': ['alt'],
          'a': ['title'],
          'button': ['title']
        }
      }]
    }
  },
  {
    files: ['src/components/ui/**/*.vue'],
    rules: {
      'vue/no-bare-strings-in-template': 'off'
    }
  }
)
