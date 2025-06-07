# ✅ Валидация данных

[◀️ Назад к содержанию](./README.md) | [◀️ Предыдущая: Управление состоянием](./04-state-management.md) | [▶️ Следующая: Обработка ошибок](./06-error-handling.md)

---

## Введение

Валидация данных - критически важный аспект безопасности и надежности приложения. Мы используем Zod для создания типобезопасных схем валидации, которые работают как на клиенте, так и на сервере.

---

## 5.1 Схемы валидации с Zod

### 🟢 Базовые схемы

```typescript
// lib/validations/article.ts
import { z } from 'zod';

export const articleSchema = z.object({
  title: z
    .string()
    .min(1, 'Заголовок обязателен')
    .max(200, 'Заголовок слишком длинный'),
  content: z.string().min(10, 'Содержание должно быть не менее 10 символов'),
  categoryId: z.string().uuid('Некорректный ID категории'),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
});

export type CreateArticleInput = z.infer<typeof articleSchema>;
export type UpdateArticleInput = Partial<CreateArticleInput>;
```

---

## 📋 Чек-лист валидации

### ✅ Схемы Zod

- [ ] Валидация на клиенте и сервере
- [ ] Типобезопасность с TypeScript
- [ ] Понятные сообщения об ошибках
- [ ] Валидация вложенных объектов

---

_Подробное содержание этой главы будет добавлено позже..._

---

[Следующая глава: Обработка ошибок →](./06-error-handling.md)
