import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import boundaries from 'eslint-plugin-boundaries';
import prettier from 'eslint-config-prettier/flat';

// Слои FSD. Слой pages физически лежит в src/views
// (каталог src/pages зарезервирован Next.js под Pages Router).
// Элемент — отдельный слайс (mode: folder), а не слой целиком: так линтер
// ловит и импорт вверх, и импорт вбок между слайсами одного слоя.
const FSD_ELEMENTS = [
  { type: 'app', pattern: 'src/app/**', mode: 'full' },
  { type: 'pages', pattern: 'src/views/*', mode: 'folder', capture: ['slice'] },
  {
    type: 'widgets',
    pattern: 'src/widgets/*',
    mode: 'folder',
    capture: ['slice'],
  },
  {
    type: 'features',
    pattern: 'src/features/*',
    mode: 'folder',
    capture: ['slice'],
  },
  {
    type: 'entities',
    pattern: 'src/entities/*',
    mode: 'folder',
    capture: ['slice'],
  },
  {
    type: 'shared',
    pattern: 'src/shared/*',
    mode: 'folder',
    capture: ['segment'],
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { boundaries },
    settings: {
      'boundaries/elements': FSD_ELEMENTS,
      'import/resolver': { typescript: { alwaysTryTypes: true } },
    },
    rules: {
      // Правило зависимостей FSD: слой импортирует только из нижележащих.
      // Импорт вверх или вбок (слайс из слайса того же слоя) — ошибка,
      // сигнал, что код лежит не на своём месте.
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: { type: 'app' },
              allow: [
                {
                  to: {
                    type: [
                      'app',
                      'pages',
                      'widgets',
                      'features',
                      'entities',
                      'shared',
                    ],
                  },
                },
              ],
            },
            {
              from: { type: 'pages' },
              allow: [
                { to: { type: ['widgets', 'features', 'entities', 'shared'] } },
              ],
            },
            {
              from: { type: 'widgets' },
              allow: [{ to: { type: ['features', 'entities', 'shared'] } }],
            },
            {
              from: { type: 'features' },
              allow: [{ to: { type: ['entities', 'shared'] } }],
            },
            {
              from: { type: 'entities' },
              allow: [{ to: { type: ['shared'] } }],
            },
            // Сегменты shared могут использовать друг друга (ui → lib и т.п.).
            {
              from: { type: 'shared' },
              allow: [{ to: { type: ['shared'] } }],
            },
          ],
        },
      ],
    },
  },
  // Отключает стилистические правила ESLint, конфликтующие с Prettier.
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
