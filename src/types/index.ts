// Базовые типы
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Типы для компонентов
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Типы для навигации
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType;
  isExternal?: boolean;
}

// Типы для контента
export interface Article extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: Author;
  category: Category;
  tags: Tag[];
  publishedAt: Date;
  isPublished: boolean;
  readingTime: number;
  featuredImage?: string;
}

export interface Author extends BaseEntity {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  socialLinks?: SocialLink[];
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Tag extends BaseEntity {
  name: string;
  slug: string;
  color?: string;
}

export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'website';
  url: string;
}

// Типы для форм
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Типы для API
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Типы для состояния загрузки
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Типы для тем
export type Theme = 'light' | 'dark' | 'system';

// Утилитарные типы
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
