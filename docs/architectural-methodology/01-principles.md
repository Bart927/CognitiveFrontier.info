# 🏗️ Архитектурные принципы

[◀️ Назад к содержанию](./README.md)

---

## Введение

Архитектурные принципы являются основой для построения масштабируемого, поддерживаемого и надежного приложения. Эти принципы помогают принимать правильные архитектурные решения на каждом этапе разработки.

---

## 1.1 Разделение ответственности (Separation of Concerns)

### 📋 Основные слои архитектуры

- **🌐 Роутинг**: Next.js App Router для навигации и маршрутизации
- **🎨 Компоненты**: Чистые UI компоненты без бизнес-логики
- **⚙️ Логика**: Бизнес-логика в отдельных модулях и сервисах
- **💾 Состояние**: Zustand stores для глобального состояния
- **📡 Данные**: API routes и server actions для работы с данными

### 🟢 Практический пример

```tsx
// ❌ Плохо - смешанная ответственность
export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    const response = await fetch('/api/user');
    const userData = await response.json();
    // Валидация и обработка данных прямо в компоненте
    if (userData.email && userData.name) {
      setUser(userData);
    }
    setLoading(false);
  };

  return <div>{/* UI код вперемешку с логикой */}</div>;
}
```

```tsx
// ✅ Хорошо - разделенная ответственность
// Компонент только отображает данные
export default function UserProfile() {
  const { user, loading, fetchUser } = useUser(); // Хук с логикой

  return (
    <div className="user-profile">
      {loading ? <LoadingSpinner /> : <UserCard user={user} />}
    </div>
  );
}

// Логика в отдельном хуке
function useUser() {
  const { user, loading, fetchUser } = useUserStore(); // Store для состояния
  return { user, loading, fetchUser };
}

// Сервис для работы с API
export class UserService {
  async getUser(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return userSchema.parse(response.data); // Валидация в сервисе
  }
}
```

---

## 1.2 Принцип единственной ответственности (SRP)

### 📋 Ключевые правила

- **Один модуль = одна задача**: Каждый файл/класс/функция должен иметь одну причину для изменения
- **Функции выполняют одну операцию**: Избегайте многофункциональных методов
- **Компоненты имеют одну цель**: Отображение конкретной части UI

### 🟢 Практические примеры

#### Компоненты

```tsx
// ❌ Плохо - компонент делает слишком много
function UserDashboard() {
  return (
    <div>
      {/* Навигация */}
      <nav>
        <Link href="/profile">Профиль</Link>
        <Link href="/settings">Настройки</Link>
      </nav>

      {/* Статистика */}
      <div className="stats">
        <div>Статьи: {articlesCount}</div>
        <div>Просмотры: {viewsCount}</div>
      </div>

      {/* Список статей */}
      <div className="articles">
        {articles.map(article => (
          <div key={article.id}>{article.title}</div>
        ))}
      </div>
    </div>
  );
}
```

```tsx
// ✅ Хорошо - разделенные компоненты
function UserDashboard() {
  return (
    <div className="user-dashboard">
      <DashboardNavigation />
      <UserStats />
      <ArticlesList />
    </div>
  );
}

// Каждый компонент имеет одну ответственность
function DashboardNavigation() {
  return (
    <nav className="dashboard-nav">
      <NavLink href="/profile">Профиль</NavLink>
      <NavLink href="/settings">Настройки</NavLink>
    </nav>
  );
}

function UserStats() {
  const { articlesCount, viewsCount } = useUserStats();

  return (
    <div className="user-stats">
      <StatCard label="Статьи" value={articlesCount} />
      <StatCard label="Просмотры" value={viewsCount} />
    </div>
  );
}
```

#### Функции и сервисы

```typescript
// ❌ Плохо - функция делает слишком много
async function processUserData(userData: any) {
  // Валидация
  if (!userData.email || !userData.name) {
    throw new Error('Invalid data');
  }

  // Сохранение в БД
  await db.user.create({ data: userData });

  // Отправка email
  await sendWelcomeEmail(userData.email);

  // Логирование
  logger.info(`User created: ${userData.email}`);

  return userData;
}
```

```typescript
// ✅ Хорошо - разделенные функции
class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
    private logger: Logger
  ) {}

  async createUser(userData: CreateUserInput): Promise<User> {
    const validatedData = this.validateUserData(userData);
    const user = await this.userRepository.create(validatedData);

    // Асинхронные операции в фоне
    this.sendWelcomeEmail(user.email);
    this.logUserCreation(user);

    return user;
  }

  private validateUserData(data: any): CreateUserInput {
    return createUserSchema.parse(data);
  }

  private async sendWelcomeEmail(email: string): Promise<void> {
    await this.emailService.sendWelcome(email);
  }

  private logUserCreation(user: User): void {
    this.logger.info(`User created: ${user.email}`);
  }
}
```

---

## 1.3 Инверсия зависимостей (Dependency Inversion)

### 📋 Ключевые концепции

- **Высокоуровневые модули не зависят от низкоуровневых**: Используйте абстракции
- **Зависимости инжектируются**: Через пропсы, контекст или DI контейнер
- **Программирование к интерфейсам**: Не к конкретным реализациям

### 🟢 Практические примеры

#### Инъекция зависимостей в компонентах

```tsx
// ❌ Плохо - жесткая зависимость
function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Прямая зависимость от конкретной реализации
    fetch('/api/articles')
      .then(res => res.json())
      .then(setArticles);
  }, []);

  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
}
```

```tsx
// ✅ Хорошо - инъекция зависимостей
interface ArticleListProps {
  articleService: ArticleService; // Абстракция
}

function ArticleList({ articleService }: ArticleListProps) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    articleService.getArticles().then(setArticles);
  }, [articleService]);

  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

// Использование с конкретной реализацией
function App() {
  const articleService = new ApiArticleService(); // или MockArticleService для тестов

  return <ArticleList articleService={articleService} />;
}
```

#### Абстракции для сервисов

```typescript
// Абстракция
interface ArticleRepository {
  findAll(): Promise<Article[]>;
  findById(id: string): Promise<Article | null>;
  create(data: CreateArticleInput): Promise<Article>;
  update(id: string, data: UpdateArticleInput): Promise<Article>;
  delete(id: string): Promise<void>;
}

// Конкретные реализации
class PrismaArticleRepository implements ArticleRepository {
  async findAll(): Promise<Article[]> {
    return prisma.article.findMany();
  }

  async findById(id: string): Promise<Article | null> {
    return prisma.article.findUnique({ where: { id } });
  }

  // ... остальные методы
}

class InMemoryArticleRepository implements ArticleRepository {
  private articles: Article[] = [];

  async findAll(): Promise<Article[]> {
    return [...this.articles];
  }

  // ... остальные методы для тестирования
}

// Сервис зависит от абстракции
class ArticleService {
  constructor(private repository: ArticleRepository) {}

  async getArticles(): Promise<Article[]> {
    return this.repository.findAll();
  }

  async createArticle(data: CreateArticleInput): Promise<Article> {
    const processedData = this.processArticleData(data);
    return this.repository.create(processedData);
  }
}
```

---

## 📋 Чек-лист соответствия принципам

### ✅ Разделение ответственности

- [ ] Компоненты содержат только UI логику
- [ ] Бизнес-логика вынесена в сервисы
- [ ] API логика отделена от компонентов
- [ ] Валидация данных происходит в отдельном слое

### ✅ Единственная ответственность

- [ ] Каждый компонент имеет одну цель
- [ ] Функции выполняют одну операцию
- [ ] Файлы содержат связанную функциональность
- [ ] Классы имеют одну причину для изменения

### ✅ Инверсия зависимостей

- [ ] Используются интерфейсы/абстракции
- [ ] Зависимости инжектируются, а не создаются внутри
- [ ] Тестируемые компоненты с мок-зависимостями
- [ ] Слабая связанность между модулями

---

## 💡 Советы по применению

1. **Начинайте с малого**: Не переусложняйте простые компоненты
2. **Рефакторинг по мере роста**: Выделяйте абстракции при появлении дублирования
3. **Тестируемость как индикатор**: Если сложно тестировать - нарушены принципы
4. **Документируйте архитектурные решения**: Объясняйте почему выбрали такой подход

---

## ⚠️ Частые ошибки

- **Преждевременная абстракция**: Создание интерфейсов без реальной необходимости
- **Слишком много слоев**: Излишняя сложность для простых задач
- **Нарушение границ**: Компоненты получают доступ к БД напрямую
- **Циклические зависимости**: Модули ссылаются друг на друга

---

[Следующая глава: Структура проекта →](./02-project-structure.md)
