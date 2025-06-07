# ⚛️ Практики Next.js

[◀️ Назад к содержанию](./README.md) | [◀️ Предыдущая: Структура проекта](./02-project-structure.md) | [▶️ Следующая: Управление состоянием](./04-state-management.md)

---

## Введение

Next.js 14+ с App Router представляет новые возможности для разделения серверной и клиентской логики. Правильное применение этих возможностей критически важно для производительности и поддерживаемости приложения.

---

## 3.1 Server Components vs Client Components

### 📋 Основные принципы

- **По умолчанию все Server Components**: Рендеринг на сервере
- **Client Components только при необходимости**: Интерактивность, состояние, browser API
- **Правильная граница разделения**: Минимизация клиентского бандла

### 🟢 Server Components (по умолчанию)

```tsx
// app/articles/page.tsx
import { getArticles } from '@/lib/api/articles';
import { ArticlesList } from '@/components/features/articles';

// Server Component - рендерится на сервере
export default async function ArticlesPage() {
  // Серверная логика - доступ к БД, секреты, и т.д.
  const articles = await getArticles();

  return (
    <main className="articles-page">
      <h1>Статьи по когнитивным наукам</h1>
      <ArticlesList articles={articles} />
    </main>
  );
}

// Можно использовать async/await
export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map(article => ({
    slug: article.slug,
  }));
}
```

### 🟢 Client Components (с директивой 'use client')

```tsx
// components/features/articles/ArticleSearch.tsx
'use client';

import { useState, useCallback } from 'react';
import { useSearchArticles } from '@/hooks/useSearchArticles';
import { SearchInput } from '@/components/common';

export function ArticleSearch() {
  const [query, setQuery] = useState('');
  const { articles, isLoading, search } = useSearchArticles();

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      search(value);
    },
    [search]
  );

  return (
    <div className="article-search">
      <SearchInput
        value={query}
        onChange={handleSearch}
        placeholder="Поиск статей..."
        loading={isLoading}
      />

      {articles.length > 0 && (
        <div className="search-results">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 📋 Когда использовать Client Components

- **Интерактивность**: onClick, onChange, useState
- **Browser API**: localStorage, geolocation, window
- **React хуки**: useEffect, useState, useContext
- **Сторонние библиотеки**: Требующие browser environment

---

## 3.2 API Routes и Server Actions

### 🟢 API Routes для внешних запросов

```tsx
// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ArticleService } from '@/lib/services/ArticleService';
import { articleSchema } from '@/lib/validations/article';
import { handleApiError } from '@/lib/utils/errorHandler';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');

    const articleService = new ArticleService();
    const result = await articleService.getArticles({
      page,
      limit,
      category,
    });

    return NextResponse.json(result);
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = articleSchema.parse(body);

    const articleService = new ArticleService();
    const article = await articleService.createArticle(validatedData);

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
```

### 🟢 Server Actions для форм

```tsx
// app/articles/create/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ArticleService } from '@/lib/services/ArticleService';
import { articleSchema } from '@/lib/validations/article';

export async function createArticleAction(formData: FormData) {
  try {
    const rawData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      categoryId: formData.get('categoryId') as string,
      tags: formData.getAll('tags') as string[],
    };

    const validatedData = articleSchema.parse(rawData);

    const articleService = new ArticleService();
    const article = await articleService.createArticle(validatedData);

    // Обновляем кэш для страницы статей
    revalidatePath('/articles');

    // Перенаправляем на созданную статью
    redirect(`/articles/${article.slug}`);
  } catch (error) {
    // В Server Actions ошибки можно возвращать как результат
    return {
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
}

export async function updateArticleAction(id: string, formData: FormData) {
  try {
    const rawData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      categoryId: formData.get('categoryId') as string,
    };

    const validatedData = articleSchema.partial().parse(rawData);

    const articleService = new ArticleService();
    await articleService.updateArticle(id, validatedData);

    revalidatePath(`/articles/${id}`);
    revalidatePath('/articles');

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Ошибка обновления',
    };
  }
}
```

### 🟢 Использование Server Actions в компонентах

```tsx
// app/articles/create/page.tsx
import { createArticleAction } from './actions';
import { CreateArticleForm } from '@/components/features/articles';

export default function CreateArticlePage() {
  return (
    <div className="create-article-page">
      <h1>Создать статью</h1>
      <CreateArticleForm action={createArticleAction} />
    </div>
  );
}
```

```tsx
// components/features/articles/CreateArticleForm.tsx
'use client';

import { useFormState } from 'react-dom';
import { Button, Input, Textarea } from '@/components/common';

interface CreateArticleFormProps {
  action: (formData: FormData) => Promise<{ error?: string }>;
}

export function CreateArticleForm({ action }: CreateArticleFormProps) {
  const [state, formAction] = useFormState(action, { error: '' });

  return (
    <form action={formAction} className="create-article-form">
      {state.error && <div className="error-message">{state.error}</div>}

      <Input name="title" label="Заголовок" required className="mb-4" />

      <Textarea
        name="content"
        label="Содержание"
        required
        rows={10}
        className="mb-4"
      />

      <Button type="submit" variant="primary">
        Создать статью
      </Button>
    </form>
  );
}
```

---

## 3.3 Работа с базой данных

### 🟢 Подключение к БД (Prisma)

```typescript
// lib/database/client.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

### 🟢 Repository паттерн

```typescript
// lib/database/repositories/ArticleRepository.ts
import { prisma } from '@/lib/database/client';
import type {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
} from '@/types/article';

export class ArticleRepository {
  async findMany(
    options: {
      page?: number;
      limit?: number;
      category?: string;
      published?: boolean;
    } = {}
  ): Promise<{ articles: Article[]; total: number }> {
    const { page = 1, limit = 10, category, published = true } = options;

    const where = {
      ...(published && { publishedAt: { not: null } }),
      ...(category && { category: { slug: category } }),
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          _count: {
            select: { comments: true },
          },
        },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.article.count({ where }),
    ]);

    return { articles, total };
  }

  async findBySlug(slug: string): Promise<Article | null> {
    return prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, email: true, bio: true },
        },
        category: true,
        tags: true,
        comments: {
          where: { approved: true },
          include: {
            author: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async create(data: CreateArticleInput): Promise<Article> {
    return prisma.article.create({
      data: {
        ...data,
        slug: this.generateSlug(data.title),
        publishedAt: data.published ? new Date() : null,
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });
  }

  async update(id: string, data: UpdateArticleInput): Promise<Article> {
    return prisma.article.update({
      where: { id },
      data: {
        ...data,
        ...(data.title && { slug: this.generateSlug(data.title) }),
        ...(data.published && { publishedAt: new Date() }),
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.article.delete({
      where: { id },
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export const articleRepository = new ArticleRepository();
```

---

## 3.4 Сервисный слой

```typescript
// lib/services/ArticleService.ts
import { ArticleRepository } from '@/lib/database/repositories/ArticleRepository';
import { EmailService } from './EmailService';
import { CacheService } from './CacheService';
import type {
  CreateArticleInput,
  UpdateArticleInput,
  Article,
} from '@/types/article';

export class ArticleService {
  constructor(
    private articleRepository: ArticleRepository = new ArticleRepository(),
    private emailService: EmailService = new EmailService(),
    private cacheService: CacheService = new CacheService()
  ) {}

  async getArticles(
    options: {
      page?: number;
      limit?: number;
      category?: string;
    } = {}
  ) {
    const cacheKey = `articles:${JSON.stringify(options)}`;

    // Проверяем кэш
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Получаем из БД
    const result = await this.articleRepository.findMany(options);

    // Кэшируем результат
    await this.cacheService.set(cacheKey, result, 300); // 5 минут

    return result;
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const cacheKey = `article:${slug}`;

    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const article = await this.articleRepository.findBySlug(slug);

    if (article) {
      await this.cacheService.set(cacheKey, article, 600); // 10 минут
    }

    return article;
  }

  async createArticle(data: CreateArticleInput): Promise<Article> {
    // Дополнительная бизнес-логика
    const processedData = {
      ...data,
      content: this.processContent(data.content),
      excerpt: this.generateExcerpt(data.content),
    };

    const article = await this.articleRepository.create(processedData);

    // Очищаем связанные кэши
    await this.invalidateArticleCaches();

    // Уведомляем подписчиков
    if (article.publishedAt) {
      await this.notifySubscribers(article);
    }

    return article;
  }

  async updateArticle(id: string, data: UpdateArticleInput): Promise<Article> {
    const article = await this.articleRepository.update(id, data);

    // Очищаем кэш для конкретной статьи
    await this.cacheService.delete(`article:${article.slug}`);
    await this.invalidateArticleCaches();

    return article;
  }

  private processContent(content: string): string {
    // Обработка содержимого (санитизация, форматирование и т.д.)
    return content.trim();
  }

  private generateExcerpt(content: string, maxLength: number = 200): string {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  }

  private async invalidateArticleCaches(): Promise<void> {
    await this.cacheService.deletePattern('articles:*');
  }

  private async notifySubscribers(article: Article): Promise<void> {
    // Асинхронная отправка уведомлений
    this.emailService.sendNewArticleNotification(article).catch(error => {
      console.error('Failed to send notifications:', error);
    });
  }
}

export const articleService = new ArticleService();
```

---

## 📋 Чек-лист Next.js практик

### ✅ Server/Client Components

- [ ] По умолчанию используются Server Components
- [ ] Client Components только для интерактивности
- [ ] Правильная граница между серверной и клиентской логикой
- [ ] Минимизация клиентского JavaScript

### ✅ API Routes и Server Actions

- [ ] API Routes для внешних интеграций
- [ ] Server Actions для форм и мутаций
- [ ] Правильная валидация входных данных
- [ ] Обработка ошибок и возврат результатов

### ✅ Работа с данными

- [ ] Repository паттерн для доступа к БД
- [ ] Сервисный слой для бизнес-логики
- [ ] Кэширование часто запрашиваемых данных
- [ ] Правильное использование revalidatePath

---

## 💡 Советы по оптимизации

1. **Максимизируйте Server Components**: Меньше JavaScript на клиенте
2. **Используйте Streaming**: loading.tsx для улучшения UX
3. **Кэшируйте агрессивно**: Redis/Memory cache для частых запросов
4. **Минимизируйте API Routes**: Предпочитайте Server Actions

---

## ⚠️ Частые ошибки

- **Излишнее использование Client Components**: 'use client' везде
- **Смешивание логики**: Бизнес-логика в компонентах
- **Игнорирование кэширования**: Повторные запросы к БД
- **Неправильная обработка ошибок**: Отсутствие error boundaries

---

[Следующая глава: Управление состоянием →](./04-state-management.md)
