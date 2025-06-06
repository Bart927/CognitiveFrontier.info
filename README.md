# CognitiveFrontier.info

> Exploring the frontier between human cognition and artificial intelligence

## 🧠 О проекте

CognitiveFrontier.info — это платформа, посвященная исследованию границ между человеческим познанием и искусственным интеллектом. Мы изучаем когнитивные науки, нейротехнологии, машинное обучение и их влияние на будущее человечества.

## 🎯 Features

- **Interactive Brain vs AI Comparison Table** — Visual comparison of cognitive capabilities
- **Research Articles** — Regular insights on AI evolution, biological intelligence, and consciousness philosophy
- **AI Benchmarks Catalog** — Curated collection of interesting AI tests and challenges
- **Open Source** — Fully transparent development process

## 🚀 Технологический стек

### Основные технологии:

- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - Типизированный JavaScript
- **SASS/SCSS** - Препроцессор CSS с BEM методологией
- **Zustand** - Управление состоянием
- **Framer Motion** - Анимации
- **React Icons** - Иконки

### Инструменты разработки:

- **ESLint** - Линтинг кода
- **Prettier** - Форматирование кода
- **Husky** - Git hooks
- **Jest + Testing Library** - Тестирование
- **PWA** - Progressive Web App возможности

## 📁 Структура проекта

```
cognitivefrontier-info/
├── .husky/                      # Git hooks
├── public/                      # Статические файлы
│   ├── icons/                   # PWA иконки
│   ├── images/                  # Изображения
│   └── manifest.json            # Web App Manifest
├── src/                         # Исходный код
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # Корневой layout
│   │   └── page.tsx            # Главная страница
│   ├── assets/                  # Ресурсы
│   │   └── styles/              # Глобальные стили
│   │       ├── _variables.scss  # SCSS переменные
│   │       ├── _mixins.scss     # SCSS миксины
│   │       └── global.scss      # Глобальные стили
│   ├── components/              # React компоненты
│   │   ├── common/              # Общие компоненты
│   │   └── layout/              # Компоненты макета
│   ├── hooks/                   # Кастомные хуки
│   ├── stores/                  # Zustand stores
│   ├── types/                   # TypeScript типы
│   └── utils/                   # Утилиты
├── .eslintrc.js                # Конфигурация ESLint
├── .prettierrc                 # Конфигурация Prettier
├── jest.config.js              # Конфигурация Jest
├── next.config.js              # Конфигурация Next.js
└── tsconfig.json               # Конфигурация TypeScript
```

## 🛠 Установка и запуск

### Требования

- **Bun 1.2+** (рекомендуется) или Node.js 18+
- Установка Bun: `curl -fsSL https://bun.sh/install | bash`

### Установка зависимостей

```bash
# С Bun (рекомендуется - в 6 раз быстрее)
bun install

# Или с npm
npm install
```

### Команды разработки

```bash
# Основные команды (через Bun - быстрее)
bun run dev          # Запуск в режиме разработки
bun run build        # Сборка для продакшена
bun run start        # Запуск продакшен сервера
bun run lint         # Линтинг кода
bun run format       # Форматирование кода
bun run test         # Запуск тестов
bun run type-check   # Проверка типов TypeScript

# Fallback команды (через npm)
bun run dev:npm      # Если нужен npm
bun run build:npm    # Для сравнения производительности

# Управление пакетами
bun add <package>    # Добавление пакета
bun remove <package> # Удаление пакета
bun update          # Обновление пакетов
```

## 🎨 Стилизация

Проект использует гибридную методологию стилизации:

### BEM для сложных компонентов:

```scss
.c-modal {
  &__header {
    /* заголовок */
  }
  &__body {
    /* тело */
  }
  &__footer {
    /* подвал */
  }
  &--lg {
    /* большой размер */
  }
}
```

### Простые классы для базовых компонентов:

```scss
.btn {
  /* базовые стили */
}
.btn--primary {
  /* основной вариант */
}
```

### Утилитарные классы:

```tsx
<div className="flex flex-center p-4 m-2">
  <span className="text-lg text-primary">Текст</span>
</div>
```

## 🧪 Тестирование

Проект настроен для тестирования с Jest и React Testing Library:

```bash
# Запуск всех тестов
npm run test

# Запуск тестов с покрытием
npm run test -- --coverage

# Запуск тестов в watch режиме
npm run test:watch
```

## 📱 PWA возможности

Проект поддерживает Progressive Web App функциональность:

- Офлайн доступ через Service Worker
- Установка как нативное приложение
- Кэширование ресурсов
- Адаптивный дизайн

## 🔧 Конфигурация

### ESLint

Настроен для React, TypeScript и Next.js с правилами:

- Проверка хуков React
- TypeScript строгая типизация
- Next.js best practices

### Prettier

Автоматическое форматирование с настройками:

- Одинарные кавычки
- Точка с запятой
- 80 символов в строке

### Husky

Pre-commit hooks для:

- Линтинга кода
- Проверки форматирования
- Проверки типов TypeScript

## 🚧 Статус разработки

Проект находится в стадии активной разработки. Текущая версия содержит:

- ✅ Базовую архитектуру проекта
- ✅ Настройку инструментов разработки
- ✅ Систему компонентов
- ✅ Управление состоянием
- ✅ PWA функциональность
- ✅ **Миграцию на Bun** (6x ускорение разработки)
- 🔄 Контентную часть (в разработке)
- 🔄 Storybook интеграцию (требует Node.js 20+)

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! Пожалуйста, ознакомьтесь с нашими правилами разработки и создайте Pull Request.

## 📞 Контакты

- Website: [cognitivefrontier.info](https://cognitivefrontier.info)
- Email: info@cognitivefrontier.info

---

_Исследуем границы между человеческим разумом и искусственным интеллектом_ 🧠🤖
