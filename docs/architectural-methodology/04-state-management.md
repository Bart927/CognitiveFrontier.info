# 🔄 Управление состоянием

[◀️ Назад к содержанию](./README.md) | [◀️ Предыдущая: Практики Next.js](./03-nextjs-practices.md) | [▶️ Следующая: Валидация данных](./05-validation.md)

---

## Введение

Эффективное управление состоянием критически важно для React приложений. В Next.js 14+ с App Router мы используем комбинацию Zustand для глобального состояния и кастомных хуков для локальной логики.

---

## 4.1 Zustand Stores

### 📋 Основные принципы

- **Атомарные stores**: Отдельный store для каждого домена
- **Типизация**: Полная типизация состояния и действий
- **Селекторы**: Эффективная подписка на изменения
- **Middleware**: Persist, devtools для разработки

### 🟢 Базовая структура store

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { AuthService } from '@/lib/services/AuthService';
import type { User, LoginCredentials } from '@/types/auth';

interface AuthState {
  // Состояние
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Действия
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;

  // Приватные действия (не экспортируются)
  _setUser: (user: User | null) => void;
  _setLoading: (loading: boolean) => void;
  _setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Начальное состояние
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Публичные действия
        login: async (credentials: LoginCredentials) => {
          const { _setLoading, _setError, _setUser } = get();

          _setLoading(true);
          _setError(null);

          try {
            const authService = new AuthService();
            const user = await authService.login(credentials);

            _setUser(user);
            set({ isAuthenticated: true });
          } catch (error) {
            _setError(
              error instanceof Error ? error.message : 'Ошибка авторизации'
            );
          } finally {
            _setLoading(false);
          }
        },

        logout: () => {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });

          // Очищаем токены
          const authService = new AuthService();
          authService.logout();
        },

        refreshUser: async () => {
          const { _setLoading, _setError, _setUser } = get();

          _setLoading(true);

          try {
            const authService = new AuthService();
            const user = await authService.getCurrentUser();

            if (user) {
              _setUser(user);
              set({ isAuthenticated: true });
            } else {
              set({ user: null, isAuthenticated: false });
            }
          } catch (error) {
            _setError('Ошибка обновления данных пользователя');
            set({ user: null, isAuthenticated: false });
          } finally {
            _setLoading(false);
          }
        },

        clearError: () => set({ error: null }),

        // Приватные действия
        _setUser: (user: User | null) => set({ user }),
        _setLoading: (isLoading: boolean) => set({ isLoading }),
        _setError: (error: string | null) => set({ error }),
      }),
      {
        name: 'auth-storage',
        // Сохраняем только нужные поля
        partialize: state => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'AuthStore',
    }
  )
);

// Селекторы для оптимизации подписок
export const useAuthUser = () => useAuthStore(state => state.user);
export const useAuthStatus = () =>
  useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));
```

### 🟢 Store для статей

```typescript
// stores/articlesStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ArticleService } from '@/lib/services/ArticleService';
import type { Article, ArticleFilters, PaginatedResult } from '@/types/article';

interface ArticlesState {
  // Состояние списка статей
  articles: Article[];
  totalArticles: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  filters: ArticleFilters;

  // Состояние конкретной статьи
  currentArticle: Article | null;
  isLoadingArticle: boolean;

  // Действия
  fetchArticles: (
    page?: number,
    filters?: Partial<ArticleFilters>
  ) => Promise<void>;
  fetchArticleBySlug: (slug: string) => Promise<void>;
  createArticle: (data: CreateArticleInput) => Promise<Article>;
  updateArticle: (id: string, data: UpdateArticleInput) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ArticleFilters>) => void;
  clearError: () => void;
  reset: () => void;
}

export const useArticlesStore = create<ArticlesState>()(
  devtools(
    (set, get) => ({
      // Начальное состояние
      articles: [],
      totalArticles: 0,
      currentPage: 1,
      isLoading: false,
      error: null,
      filters: {
        category: null,
        search: '',
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      },
      currentArticle: null,
      isLoadingArticle: false,

      fetchArticles: async (page = 1, newFilters = {}) => {
        set({ isLoading: true, error: null });

        try {
          const { filters } = get();
          const mergedFilters = { ...filters, ...newFilters };

          const articleService = new ArticleService();
          const result = await articleService.getArticles({
            page,
            limit: 10,
            ...mergedFilters,
          });

          set({
            articles: result.articles,
            totalArticles: result.total,
            currentPage: page,
            filters: mergedFilters,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : 'Ошибка загрузки статей',
          });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchArticleBySlug: async (slug: string) => {
        set({ isLoadingArticle: true, error: null });

        try {
          const articleService = new ArticleService();
          const article = await articleService.getArticleBySlug(slug);

          set({ currentArticle: article });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Статья не найдена',
          });
        } finally {
          set({ isLoadingArticle: false });
        }
      },

      createArticle: async (data: CreateArticleInput) => {
        const articleService = new ArticleService();
        const article = await articleService.createArticle(data);

        // Обновляем список статей
        const { articles } = get();
        set({ articles: [article, ...articles] });

        return article;
      },

      updateArticle: async (id: string, data: UpdateArticleInput) => {
        const articleService = new ArticleService();
        const updatedArticle = await articleService.updateArticle(id, data);

        // Обновляем в списке
        const { articles, currentArticle } = get();
        set({
          articles: articles.map(article =>
            article.id === id ? updatedArticle : article
          ),
          ...(currentArticle?.id === id && { currentArticle: updatedArticle }),
        });
      },

      deleteArticle: async (id: string) => {
        const articleService = new ArticleService();
        await articleService.deleteArticle(id);

        // Убираем из списка
        const { articles } = get();
        set({
          articles: articles.filter(article => article.id !== id),
        });
      },

      setFilters: (newFilters: Partial<ArticleFilters>) => {
        const { filters } = get();
        set({ filters: { ...filters, ...newFilters } });
      },

      clearError: () => set({ error: null }),

      reset: () =>
        set({
          articles: [],
          totalArticles: 0,
          currentPage: 1,
          error: null,
          currentArticle: null,
        }),
    }),
    {
      name: 'ArticlesStore',
    }
  )
);

// Селекторы
export const useArticlesList = () =>
  useArticlesStore(state => ({
    articles: state.articles,
    totalArticles: state.totalArticles,
    currentPage: state.currentPage,
    isLoading: state.isLoading,
    error: state.error,
  }));

export const useCurrentArticle = () =>
  useArticlesStore(state => ({
    article: state.currentArticle,
    isLoading: state.isLoadingArticle,
    error: state.error,
  }));
```

---

## 4.2 Кастомные React хуки

### 🟢 Хук для авторизации

```typescript
// hooks/useAuth.ts
import { useCallback } from 'react';
import { useAuthStore, useAuthUser, useAuthStatus } from '@/stores/authStore';
import type { LoginCredentials, RegisterCredentials } from '@/types/auth';

export function useAuth() {
  const user = useAuthUser();
  const { isAuthenticated, isLoading, error } = useAuthStatus();
  const { login, logout, refreshUser, clearError } = useAuthStore();

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      await login(credentials);
    },
    [login]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleRefresh = useCallback(async () => {
    await refreshUser();
  }, [refreshUser]);

  return {
    // Состояние
    user,
    isAuthenticated,
    isLoading,
    error,

    // Действия
    login: handleLogin,
    logout: handleLogout,
    refresh: handleRefresh,
    clearError,

    // Вычисляемые значения
    isAdmin: user?.role === 'admin',
    isAuthor: user?.role === 'author' || user?.role === 'admin',
  };
}
```

### 🟢 Хук для работы со статьями

```typescript
// hooks/useArticles.ts
import { useEffect, useCallback } from 'react';
import { useArticlesStore, useArticlesList } from '@/stores/articlesStore';
import type { ArticleFilters, CreateArticleInput } from '@/types/article';

interface UseArticlesOptions {
  autoFetch?: boolean;
  initialFilters?: Partial<ArticleFilters>;
}

export function useArticles(options: UseArticlesOptions = {}) {
  const { autoFetch = true, initialFilters = {} } = options;

  const { articles, totalArticles, currentPage, isLoading, error } =
    useArticlesList();
  const { fetchArticles, setFilters, clearError, reset } = useArticlesStore();

  // Автоматическая загрузка при монтировании
  useEffect(() => {
    if (autoFetch) {
      fetchArticles(1, initialFilters);
    }

    return () => {
      if (!autoFetch) {
        reset();
      }
    };
  }, [autoFetch, initialFilters, fetchArticles, reset]);

  const loadPage = useCallback(
    (page: number) => {
      fetchArticles(page);
    },
    [fetchArticles]
  );

  const applyFilters = useCallback(
    (filters: Partial<ArticleFilters>) => {
      setFilters(filters);
      fetchArticles(1, filters);
    },
    [setFilters, fetchArticles]
  );

  const refresh = useCallback(() => {
    fetchArticles(currentPage);
  }, [fetchArticles, currentPage]);

  return {
    // Данные
    articles,
    totalArticles,
    currentPage,
    isLoading,
    error,

    // Действия
    loadPage,
    applyFilters,
    refresh,
    clearError,

    // Вычисляемые значения
    hasArticles: articles.length > 0,
    totalPages: Math.ceil(totalArticles / 10),
    hasNextPage: currentPage < Math.ceil(totalArticles / 10),
    hasPrevPage: currentPage > 1,
  };
}
```

### 🟢 Хук для конкретной статьи

```typescript
// hooks/useArticle.ts
import { useEffect } from 'react';
import { useArticlesStore, useCurrentArticle } from '@/stores/articlesStore';

export function useArticle(slug: string) {
  const { article, isLoading, error } = useCurrentArticle();
  const { fetchArticleBySlug, clearError } = useArticlesStore();

  useEffect(() => {
    if (slug) {
      fetchArticleBySlug(slug);
    }

    return () => clearError();
  }, [slug, fetchArticleBySlug, clearError]);

  return {
    article,
    isLoading,
    error,
    clearError,

    // Вычисляемые значения
    isFound: !!article,
    isPublished: article?.publishedAt != null,
    readingTime: article ? calculateReadingTime(article.content) : 0,
  };
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
```

### 🟢 Хук для управления формами

```typescript
// hooks/useForm.ts
import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setValue = useCallback(
    (name: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [name]: value }));

      // Очищаем ошибку для поля при изменении
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return true;

    const validationErrors = validate(values);
    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  }, [validate, values]);

  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();

      setSubmitError(null);

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'Ошибка отправки'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, onSubmit, values]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setSubmitError(null);
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    // Состояние
    values,
    errors,
    isSubmitting,
    submitError,

    // Действия
    setValue,
    setFieldError,
    handleSubmit,
    reset,

    // Вычисляемые значения
    isValid: Object.keys(errors).length === 0,
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
  };
}
```

---

## 4.3 Паттерны управления состоянием

### 📋 Оптимизация перерендеров

```typescript
// hooks/useOptimizedSelector.ts
import { useMemo } from 'react';
import { useArticlesStore } from '@/stores/articlesStore';

// ❌ Плохо - перерендер при любом изменении store
export function BadArticleSelector() {
  const store = useArticlesStore();
  return store.articles.filter(article => article.featured);
}

// ✅ Хорошо - селектор с мемоизацией
export function useOptimizedArticleSelector() {
  return useArticlesStore(
    state => state.articles.filter(article => article.featured),
    // Кастомная функция сравнения
    (a, b) =>
      a.length === b.length && a.every((item, i) => item.id === b[i]?.id)
  );
}

// ✅ Еще лучше - мемоизированный селектор
export function useFeaturedArticles() {
  const articles = useArticlesStore(state => state.articles);

  return useMemo(
    () => articles.filter(article => article.featured),
    [articles]
  );
}
```

### 📋 Композиция хуков

```typescript
// hooks/useArticleManagement.ts
import { useAuth } from './useAuth';
import { useArticles } from './useArticles';
import { useNotifications } from './useNotifications';

export function useArticleManagement() {
  const { isAuthor, isAdmin } = useAuth();
  const { createArticle, updateArticle, deleteArticle } = useArticlesStore();
  const { showNotification } = useNotifications();

  const handleCreateArticle = useCallback(
    async (data: CreateArticleInput) => {
      if (!isAuthor) {
        throw new Error('Недостаточно прав');
      }

      try {
        const article = await createArticle(data);
        showNotification('Статья создана успешно', 'success');
        return article;
      } catch (error) {
        showNotification('Ошибка создания статьи', 'error');
        throw error;
      }
    },
    [isAuthor, createArticle, showNotification]
  );

  const handleDeleteArticle = useCallback(
    async (id: string) => {
      if (!isAdmin) {
        throw new Error('Недостаточно прав');
      }

      try {
        await deleteArticle(id);
        showNotification('Статья удалена', 'success');
      } catch (error) {
        showNotification('Ошибка удаления статьи', 'error');
        throw error;
      }
    },
    [isAdmin, deleteArticle, showNotification]
  );

  return {
    createArticle: handleCreateArticle,
    deleteArticle: handleDeleteArticle,
    canCreate: isAuthor,
    canDelete: isAdmin,
  };
}
```

---

## 📋 Чек-лист управления состоянием

### ✅ Zustand Stores

- [ ] Атомарная структура stores по доменам
- [ ] Полная типизация состояния и действий
- [ ] Использование селекторов для оптимизации
- [ ] Persist middleware для важных данных

### ✅ Кастомные хуки

- [ ] Инкапсуляция логики в переиспользуемые хуки
- [ ] Правильные зависимости в useCallback/useMemo
- [ ] Композиция простых хуков в сложные
- [ ] Обработка ошибок и загрузочных состояний

### ✅ Оптимизация

- [ ] Мемоизация селекторов и вычислений
- [ ] Минимизация перерендеров компонентов
- [ ] Lazy loading данных при необходимости
- [ ] Правильная очистка состояния при размонтировании

---

## 💡 Советы по оптимизации

1. **Разделяйте глобальное и локальное состояние**: Не все в Zustand
2. **Используйте селекторы**: Подписывайтесь только на нужные части state
3. **Мемоизируйте вычисления**: useMemo для тяжелых операций
4. **Очищайте состояние**: Избегайте утечек памяти

---

## ⚠️ Частые ошибки

- **Избыточное глобальное состояние**: Локальное состояние в Zustand
- **Отсутствие селекторов**: Подписка на весь store
- **Мутации состояния**: Прямое изменение объектов
- **Неправильная очистка**: Накопление данных в памяти

---

[Следующая глава: Валидация данных →](./05-validation.md)
