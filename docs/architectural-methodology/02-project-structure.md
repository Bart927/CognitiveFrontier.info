# 📁 Структура проекта

[◀️ Назад к содержанию](./README.md) | [◀️ Предыдущая: Принципы](./01-principles.md) | [▶️ Следующая: Практики Next.js](./03-nextjs-practices.md)

---

## Введение

Правильная организация файловой структуры критически важна для поддерживаемости проекта. Она должна быть интуитивно понятной, масштабируемой и соответствовать архитектурным принципам.

---

## 2.1 Общая структура проекта

```
cognitivefrontier-info/
├── 📁 src/                           # Исходный код приложения
│   ├── 📁 app/                       # Next.js App Router (роутинг)
│   ├── 📁 components/                # React компоненты
│   ├── 📁 lib/                       # Библиотеки и утилиты
│   ├── 📁 hooks/                     # Кастомные React хуки
│   ├── 📁 stores/                    # Zustand stores (глобальное состояние)
│   ├── 📁 types/                     # TypeScript типы
│   └── 📁 assets/                    # Статические ресурсы
├── 📁 docs/                          # Документация проекта
├── 📁 public/                        # Публичные статические файлы
├── 📁 tests/                         # Тесты (если отдельно от src)
├── 📄 next.config.js                 # Конфигурация Next.js
├── 📄 tailwind.config.js             # Конфигурация Tailwind (если используется)
├── 📄 tsconfig.json                  # Конфигурация TypeScript
└── 📄 package.json                   # Зависимости и скрипты
```

---

## 2.2 Детальная структура `/src`

### 📁 `/src/app` - Роутинг Next.js

```
app/
├── 📁 (auth)/                        # Группировка роутов авторизации
│   ├── 📁 login/
│   │   ├── 📄 page.tsx               # /login
│   │   └── 📄 loading.tsx            # Загрузка для /login
│   ├── 📁 register/
│   │   └── 📄 page.tsx               # /register
│   └── 📄 layout.tsx                 # Layout для auth роутов
├── 📁 (main)/                        # Основные роуты (публичные)
│   ├── 📁 articles/
│   │   ├── 📁 [slug]/
│   │   │   ├── 📄 page.tsx           # /articles/[slug]
│   │   │   └── 📄 loading.tsx
│   │   ├── 📄 page.tsx               # /articles
│   │   └── 📄 loading.tsx
│   ├── 📁 research/
│   │   └── 📄 page.tsx               # /research
│   ├── 📁 about/
│   │   └── 📄 page.tsx               # /about
│   └── 📄 layout.tsx                 # Layout для основных роутов
├── 📁 (admin)/                       # Админ панель (защищенные роуты)
│   ├── 📁 dashboard/
│   │   └── 📄 page.tsx               # /admin/dashboard
│   ├── 📁 articles/
│   │   ├── 📁 create/
│   │   │   └── 📄 page.tsx           # /admin/articles/create
│   │   └── 📄 page.tsx               # /admin/articles
│   └── 📄 layout.tsx                 # Layout для админ роутов
├── 📁 api/                           # API Routes
│   ├── 📁 auth/
│   │   ├── 📄 login/route.ts         # POST /api/auth/login
│   │   └── 📄 register/route.ts      # POST /api/auth/register
│   ├── 📁 articles/
│   │   ├── 📁 [id]/
│   │   │   └── 📄 route.ts           # GET/PUT/DELETE /api/articles/[id]
│   │   └── 📄 route.ts               # GET/POST /api/articles
│   └── 📁 research/
│       └── 📄 route.ts               # GET/POST /api/research
├── 📄 layout.tsx                     # Root layout
├── 📄 page.tsx                       # Home page (/)
├── 📄 loading.tsx                    # Global loading
├── 📄 error.tsx                      # Global error
├── 📄 not-found.tsx                  # 404 page
└── 📄 globals.css                    # Глобальные стили
```

### 📁 `/src/components` - React компоненты

```
components/
├── 📁 common/                        # Переиспользуемые компоненты
│   ├── 📁 button/
│   │   ├── 📄 Button.tsx
│   │   ├── 📄 Button.scss
│   │   ├── 📄 Button.stories.tsx     # Storybook
│   │   ├── 📄 Button.test.tsx        # Тесты
│   │   ├── 📄 Button.types.ts        # Типы
│   │   └── 📄 index.ts               # Экспорт
│   ├── 📁 modal/
│   │   ├── 📄 Modal.tsx
│   │   ├── 📄 Modal.scss
│   │   └── 📄 index.ts
│   ├── 📁 loading/
│   │   ├── 📄 LoadingSpinner.tsx
│   │   ├── 📄 LoadingSkeleton.tsx
│   │   └── 📄 index.ts
│   └── 📄 index.ts                   # Экспорт всех common компонентов
├── 📁 features/                      # Функциональные компоненты
│   ├── 📁 auth/
│   │   ├── 📁 login-form/
│   │   │   ├── 📄 LoginForm.tsx
│   │   │   ├── 📄 LoginForm.scss
│   │   │   └── 📄 index.ts
│   │   ├── 📁 register-form/
│   │   │   ├── 📄 RegisterForm.tsx
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts
│   ├── 📁 articles/
│   │   ├── 📁 article-list/
│   │   │   ├── 📄 ArticleList.tsx
│   │   │   ├── 📄 ArticleList.scss
│   │   │   └── 📄 index.ts
│   │   ├── 📁 article-card/
│   │   │   ├── 📄 ArticleCard.tsx
│   │   │   ├── 📄 ArticleCard.scss
│   │   │   └── 📄 index.ts
│   │   ├── 📁 article-search/
│   │   │   ├── 📄 ArticleSearch.tsx
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts
│   └── 📁 research/
│       ├── 📁 research-grid/
│       │   ├── 📄 ResearchGrid.tsx
│       │   └── 📄 index.ts
│       └── 📄 index.ts
├── 📁 layout/                        # Компоненты макета
│   ├── 📁 header/
│   │   ├── 📄 Header.tsx
│   │   ├── 📄 Header.scss
│   │   └── 📄 index.ts
│   ├── 📁 footer/
│   │   ├── 📄 Footer.tsx
│   │   ├── 📄 Footer.scss
│   │   └── 📄 index.ts
│   ├── 📁 sidebar/
│   │   ├── 📄 Sidebar.tsx
│   │   ├── 📄 Sidebar.scss
│   │   └── 📄 index.ts
│   └── 📄 index.ts
└── 📄 index.ts                       # Главный экспорт компонентов
```

### 📁 `/src/lib` - Библиотеки и утилиты

```
lib/
├── 📁 api/                           # API клиенты
│   ├── 📄 client.ts                  # Базовый API клиент
│   ├── 📄 articles.ts                # API для статей
│   ├── 📄 auth.ts                    # API для авторизации
│   └── 📄 research.ts                # API для исследований
├── 📁 auth/                          # Логика авторизации
│   ├── 📄 jwt.ts                     # Работа с JWT токенами
│   ├── 📄 session.ts                 # Управление сессиями
│   └── 📄 middleware.ts              # Middleware для защиты роутов
├── 📁 database/                      # Работа с базой данных
│   ├── 📄 client.ts                  # Подключение к БД (Prisma/другая ORM)
│   ├── 📁 repositories/              # Repository паттерн
│   │   ├── 📄 ArticleRepository.ts
│   │   ├── 📄 UserRepository.ts
│   │   └── 📄 index.ts
│   └── 📁 migrations/                # Миграции БД (если нужно)
├── 📁 services/                      # Бизнес-логика
│   ├── 📄 ArticleService.ts
│   ├── 📄 AuthService.ts
│   ├── 📄 EmailService.ts
│   └── 📄 index.ts
├── 📁 utils/                         # Вспомогательные функции
│   ├── 📄 formatters.ts              # Форматирование данных
│   ├── 📄 validators.ts              # Валидация (без схем Zod)
│   ├── 📄 constants.ts               # Константы
│   ├── 📄 helpers.ts                 # Общие хелперы
│   └── 📄 index.ts
├── 📁 validations/                   # Схемы валидации Zod
│   ├── 📄 article.ts                 # Схемы для статей
│   ├── 📄 user.ts                    # Схемы для пользователей
│   ├── 📄 auth.ts                    # Схемы для авторизации
│   └── 📄 index.ts
├── 📁 cache/                         # Кэширование
│   ├── 📄 redis.ts                   # Redis клиент
│   ├── 📄 memory.ts                  # In-memory кэш
│   └── 📄 index.ts
└── 📁 config/                        # Конфигурация
    ├── 📄 database.ts                # Настройки БД
    ├── 📄 auth.ts                    # Настройки авторизации
    └── 📄 env.ts                     # Валидация env переменных
```

---

## 2.3 Соглашения по именованию

### 📋 Файлы и директории

| Тип                   | Формат                   | Пример                               |
| --------------------- | ------------------------ | ------------------------------------ |
| **Папки компонентов** | `kebab-case`             | `article-card`, `user-profile`       |
| **Компоненты**        | `PascalCase`             | `ArticleCard.tsx`, `UserProfile.tsx` |
| **Стили**             | `PascalCase + .scss`     | `ArticleCard.scss`                   |
| **Типы**              | `PascalCase + .types.ts` | `ArticleCard.types.ts`               |
| **Хуки**              | `camelCase + use prefix` | `useAuth.ts`, `useArticles.ts`       |
| **Сервисы**           | `PascalCase + Service`   | `ArticleService.ts`                  |
| **Утилиты**           | `camelCase`              | `formatters.ts`, `helpers.ts`        |
| **API routes**        | `route.ts`               | `app/api/articles/route.ts`          |

### 📋 Классы CSS (BEM)

```scss
// Блок
.article-card {
}

// Элементы
.article-card__title {
}
.article-card__content {
}
.article-card__meta {
}

// Модификаторы
.article-card--featured {
}
.article-card--large {
}

// Утилиты (короткие имена)
.flex {
  display: flex;
}
.p-2 {
  padding: 0.5rem;
}
.text-lg {
  font-size: 1.125rem;
}
```

---

## 2.4 Модульная организация компонентов

### 🟢 Структура компонента

```
button/
├── 📄 Button.tsx                     # Основной компонент
├── 📄 Button.scss                    # Стили
├── 📄 Button.stories.tsx             # Storybook истории
├── 📄 Button.test.tsx                # Unit тесты
├── 📄 Button.types.ts                # TypeScript типы
└── 📄 index.ts                       # Экспорт
```

### 📄 Пример `Button/index.ts`

```typescript
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';
```

### 📄 Пример `Button/Button.types.ts`

```typescript
export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
```

### 📄 Пример `Button/Button.tsx`

```tsx
import React from 'react';
import { clsx } from 'clsx';
import type { ButtonProps } from './Button.types';
import './Button.scss';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  ...rest
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  return (
    <button
      className={clsx('btn', `btn--${variant}`, `btn--${size}`, {
        'btn--disabled': disabled,
        'btn--loading': loading,
      })}
      disabled={disabled || loading}
      onClick={handleClick}
      {...rest}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
};
```

---

## 2.5 Экспорт и импорт

### 📋 Правила экспорта

1. **Именованный экспорт** для компонентов: `export const Button = ...`
2. **Default экспорт** только для страниц Next.js
3. **Barrel exports** через `index.ts` файлы
4. **Типы экспортируются отдельно**: `export type { ButtonProps }`

### 🟢 Примеры импорта

```typescript
// ✅ Хорошо - именованные импорты
import { Button, Modal } from '@/components/common';
import { ArticleCard } from '@/components/features/articles';
import { useAuth } from '@/hooks/useAuth';
import { ArticleService } from '@/lib/services';

// ✅ Хорошо - типы
import type { ButtonProps } from '@/components/common/button';
import type { Article } from '@/types/article';

// ❌ Плохо - слишком глубокие пути
import { Button } from '@/components/common/button/Button';
import { ArticleCard } from '@/components/features/articles/article-card/ArticleCard';
```

### 📄 Пример корневого `components/index.ts`

```typescript
// Экспорт общих компонентов
export * from './common';

// Экспорт функциональных компонентов
export * from './features';

// Экспорт компонентов макета
export * from './layout';
```

---

## 2.6 Организация стилей

### 📁 Структура `/src/assets/styles`

```
assets/styles/
├── 📁 themes/                        # Темы (светлая/темная)
│   ├── 📄 _light.scss
│   └── 📄 _dark.scss
├── 📁 utils/                         # Специальные утилиты
│   ├── 📄 _animations.scss
│   └── 📄 _utilities.scss
├── 📄 _variables.scss                # Основные переменные
├── 📄 _mixins.scss                   # SCSS миксины
├── 📄 _typography.scss               # Типографика
├── 📄 _colors.scss                   # Цветовая палитра
├── 📄 _spacing.scss                  # Переменные отступов
├── 📄 _breakpoints.scss              # Медиа брейкпоинты
├── 📄 _scrollbar.scss                # Стили скроллбара
└── 📄 global.scss                    # Глобальные стили
```

---

## 📋 Чек-лист структуры проекта

### ✅ Общая организация

- [ ] Четкое разделение по типам файлов (`components`, `lib`, `hooks`, etc.)
- [ ] Логическая группировка функций (auth, articles, research)
- [ ] Соблюдение соглашений по именованию
- [ ] Использование barrel exports (`index.ts`)

### ✅ Компоненты

- [ ] Каждый компонент в своей папке
- [ ] Сопутствующие файлы рядом (стили, тесты, типы)
- [ ] Именованные экспорты для переиспользуемых компонентов
- [ ] Разделение на `common`, `features`, `layout`

### ✅ API и логика

- [ ] API routes организованы по ресурсам
- [ ] Бизнес-логика в сервисах
- [ ] Repository паттерн для работы с данными
- [ ] Валидация в отдельных модулях

---

## 💡 Советы по поддержке структуры

1. **Регулярно рефакторите**: Перемещайте компоненты при изменении их назначения
2. **Используйте линтеры**: Настройте правила для импортов и структуры
3. **Документируйте нестандартные решения**: Объясняйте отклонения от структуры
4. **Код-ревью структуры**: Проверяйте правильность размещения новых файлов

---

## ⚠️ Частые ошибки

- **Слишком глубокая вложенность**: Избегайте папок глубже 3-4 уровней
- **Смешивание типов файлов**: Не храните компоненты в `lib/` или утилиты в `components/`
- **Нарушение конвенций**: Непоследовательное именование файлов и папок
- **Отсутствие группировки**: Складывание всех компонентов в одну папку

---

[Следующая глава: Практики Next.js →](./03-nextjs-practices.md)
