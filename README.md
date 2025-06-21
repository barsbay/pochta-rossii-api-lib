# Russian Post API Library

[![npm version](https://img.shields.io/npm/v/pochta-rossii-api-lib.svg)](https://www.npmjs.com/package/pochta-rossii-api-lib)
[![GitHub stars](https://img.shields.io/github/stars/barsbay/pochta-rossii-api-lib.svg?style=social)](https://github.com/barsbay/pochta-rossii-api-lib)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> **Security Notice:**
> Never publish your real API tokens or keys in public repositories, code examples, or documentation. Always use placeholders like `YOUR_TOKEN` and `YOUR_KEY`.

A TypeScript library for interacting with the [Russian Post API (otpravka.pochta.ru)](https://otpravka.pochta.ru/). This library provides a simple and type-safe way to work with the Russian Post delivery service.

- **Repository:** [github.com/barsbay/pochta-rossii-api-lib](https://github.com/barsbay/pochta-rossii-api-lib)
- **NPM:** [npmjs.com/package/pochta-rossii-api-lib](https://www.npmjs.com/package/pochta-rossii-api-lib)
- **Issues:** [github.com/barsbay/pochta-rossii-api-lib/issues](https://github.com/barsbay/pochta-rossii-api-lib/issues)
- **License:** MIT
- **Author:** barsbay

---

## 📋 Основные возможности

### 🔐 Авторизация
- Поддержка токенов доступа
- Базовая HTTP авторизация
- Автоматическая обработка заголовков

### 📮 Заказы
- Создание заказов
- Получение списка заказов
- Поиск заказа по ID
- Обновление заказов
- Удаление заказов
- Перевод в отложенные

### 📦 Партии
- Создание партий
- Получение списка партий
- Поиск партий по названию
- Обновление даты отправки
- Добавление/удаление заказов из партии

### 💰 Расчет тарифов
- Расчет стоимости доставки
- Учет веса, категории и типа отправления
- Поддержка объявленной ценности
- Расчет НДС

### 🏠 Нормализация адресов
- Проверка и нормализация адресов
- Нормализация ФИО
- Нормализация телефонных номеров

### 🏪 Поиск отделений
- Поиск по координатам
- Поиск по адресу
- Поиск по индексу
- Получение информации о режиме работы

## 📖 Подробное руководство

### 🔧 Настройка

Создайте файл `.env` в корне проекта:

```env
AUTHORIZATION=your-access-token
X_USER_AUTHORIZATION=Basic your-base64-credentials
```

### 📮 Работа с заказами

#### Создание заказа

```typescript
import { PochtaRossiiApi } from 'pochta-rossii-api-lib';

// Инициализация API клиента
const api = new PochtaRossiiApi({
  Authorization: 'your-access-token',
  'X-User-Authorization': 'Basic your-base64-credentials'
});

// Пример создания заказа
const order = {
  'address-type-to': 'DEFAULT',
  'given-name': 'Иван',
  'mail-category': 'ORDINARY',
  'mail-type': 'POSTAL_PARCEL',
  mass: 1000,
  'order-num': '12345',
  'recipient-name': 'Иванов Иван Иванович',
  'str-index-to': '101000',
  'tel-address': '+79001234567',
  'index-to': 101000,
  'region-to': 'Москва',
  'place-to': 'Москва',
  'street-to': 'Красная площадь',
  'house-to': '1'
};

const createdOrder = await api.createOrder(order);
```

#### Получение заказов

```typescript
// Получить все заказы
const orders = await api.getOrders();

// Получить заказ по ID
const order = await api.getOrderById('12345');
```

#### Обновление заказа

```typescript
const updatedOrder = await api.updateOrder('12345', {
  ...order,
  mass: 1500
});
```

#### Удаление заказа

```typescript
await api.deleteOrder('12345');
```

### 📦 Работа с партиями

#### Создание партии

```typescript
const batch = {
  'batch-name': 'Партия №1',
  'sending-date': '2024-01-15',
  'shipment-point-index': '101000'
};

const createdBatch = await api.createBatch(batch);
```

#### Получение партий

```typescript
// Получить все партии
const batches = await api.getBatches();

// Поиск партии по названию
const foundBatches = await api.searchBatchByName('Партия');
```

#### Обновление даты отправки

```typescript
await api.updateBatchSendingDate('batch-id', '2024-01-20');
```

### 💰 Расчет тарифов

```typescript
const tariffRequest = {
  'index-from': 101000, // Москва
  'index-to': 190000,   // Санкт-Петербург
  'mail-category': 'ORDINARY',
  'mail-type': 'POSTAL_PARCEL',
  mass: 1000,
  fragile: false,
  'with-order-of-notice': false,
  'with-simple-notice': false,
  'with-declared-value': false,
  'declared-value': 0
};

const tariff = await api.calculateTariff(tariffRequest);
console.log(`Стоимость доставки: ${(tariff['total-rate'] / 100).toFixed(2)} ₽`);
console.log(`Срок доставки: ${tariff['delivery-time'].min}-${tariff['delivery-time'].max} дней`);
```

**Примечание:** API возвращает стоимость в копейках, поэтому для отображения в рублях нужно разделить на 100.

#### Типы отправлений (mail-type):
- `POSTAL_PARCEL` - Посылка (до 20 кг, размеры до 120 см)
- `ONLINE_PARCEL` - Посылка онлайн (до 2 кг, доставка до двери или ПВЗ)
- `ONLINE_COURIER` - Курьер онлайн (до 30 кг, доставка курьером)
- `EMS` - EMS (до 31.5 кг, экспресс-доставка)
- `EMS_OPTIMAL` - EMS оптимальный (до 31.5 кг, экономичная экспресс-доставка)
- `LETTER` - Письмо (до 100 г, размеры до 229x324 мм)
- `BANDEROL` - Бандероль (до 2 кг, печатные издания)

#### Категории отправлений (mail-category):
- `SIMPLE` - Простое отправление (без уведомления о вручении)
- `ORDINARY` - Обыкновенное отправление (с уведомлением о вручении)
- `REGISTERED` - Заказное отправление (с уведомлением о вручении и описью вложения)
- `WITH_DECLARED_VALUE` - Отправление с объявленной ценностью

### 🏠 Нормализация адресов

```typescript
// Нормализация адреса
const addressRequest = {
  id: '1',
  'original-address': 'Москва, Красная площадь, 1'
};

const normalizedAddress = await api.normalizeAddress(addressRequest);

// Нормализация ФИО
const fioRequest = {
  id: '2',
  'original-fio': 'Иванов Иван Иванович'
};

const normalizedFio = await api.normalizeFio(fioRequest);

// Нормализация телефона
const phoneRequest = {
  id: '3',
  'original-phone': '+7 900 123 45 67'
};

const normalizedPhone = await api.normalizePhone(phoneRequest);
```

### 🏪 Поиск отделений

#### Поиск по координатам

```typescript
const coordinatesRequest = {
  latitude: 55.7558,
  longitude: 37.6176,
  radius: 2000, // 2 км
  filter: 'ALL'
};

const offices = await api.searchPostOfficesByCoordinates(coordinatesRequest);
```

#### Поиск по адресу

```typescript
const addressRequest = {
  address: 'Москва, Красная площадь',
  top: 10
};

const offices = await api.searchPostOfficesByAddress(addressRequest);
```

#### Поиск по индексу

```typescript
const indexRequest = {
  index: '101000'
};

const offices = await api.searchPostOfficesByIndex(indexRequest);
```

#### Получение всех отделений

```typescript
const offices = await api.getPostOffices(100); // ограничение 100
```

## 🔧 Типы данных

### Order (Заказ)

```typescript
interface Order {
  'address-type-to': string;
  'given-name': string;
  'mail-category': 'SIMPLE' | 'ORDINARY' | 'REGISTERED' | 'WITH_DECLARED_VALUE';
  'mail-type': 'POSTAL_PARCEL' | 'ONLINE_PARCEL' | 'ONLINE_COURIER' | 'EMS' | 'EMS_OPTIMAL' | 'LETTER' | 'BANDEROL';
  mass: number;
  'order-num': string;
  'recipient-name': string;
  'str-index-to': string;
  'tel-address': string;
  'index-to': number;
  'region-to': string;
  'place-to': string;
  'street-to': string;
  'house-to': string;
  // Опциональные поля...
}
```

### Batch (Партия)

```typescript
interface Batch {
  'batch-name': string;
  'sending-date': string;
  'shipment-point-index': string;
}
```

### TariffRequest (Запрос на расчет тарифа)

```typescript
interface TariffRequest {
  'index-from': number;
  'index-to': number;
  'mail-category': 'SIMPLE' | 'ORDINARY' | 'REGISTERED' | 'WITH_DECLARED_VALUE';
  'mail-type': 'POSTAL_PARCEL' | 'ONLINE_PARCEL' | 'ONLINE_COURIER' | 'EMS' | 'EMS_OPTIMAL' | 'LETTER' | 'BANDEROL';
  mass: number;
  fragile: boolean;
  'with-order-of-notice': boolean;
  'with-simple-notice': boolean;
  'with-declared-value': boolean;
  'declared-value': number;
}
```

### PostOffice (Отделение почты)

```typescript
interface PostOffice {
  'address-source'?: string;
  distance?: number;
  'is-closed'?: boolean;
  'is-private-category'?: boolean;
  'is-temporary-closed'?: boolean;
  latitude?: number;
  longitude?: number;
  'postal-code'?: string;
  region?: string;
  settlement?: string;
  'type-code'?: string;
  'type-id'?: number;
  'working-hours'?: Array<{
    day: number;
    hours: string;
  }>;
  'works-on-saturdays'?: boolean;
  'works-on-sundays'?: boolean;
  phones?: Array<{
    number: string;
    type: string;
  }>;
  'service-groups'?: Array<{
    name: string;
    code: string;
  }>;
}
```

## 📦 Установка

```bash
npm install pochta-rossii-api-lib
```

## 🚀 Быстрый старт

```typescript
import { PochtaRossiiApi } from 'pochta-rossii-api-lib';

// Инициализация API клиента
const api = new PochtaRossiiApi({
  Authorization: 'your-access-token',
  'X-User-Authorization': 'Basic your-base64-credentials'
});

// Пример создания заказа
const order = {
  'address-type-to': 'DEFAULT',
  'given-name': 'Иван',
  'mail-category': 'ORDINARY',
  'mail-type': 'POSTAL_PARCEL',
  mass: 1000,
  'order-num': '12345',
  'recipient-name': 'Иванов Иван Иванович',
  'str-index-to': '101000',
  'tel-address': '+79001234567',
  'index-to': 101000,
  'region-to': 'Москва',
  'place-to': 'Москва',
  'street-to': 'Красная площадь',
  'house-to': '1'
};

const createdOrder = await api.createOrder(order);
```

## 📚 Примеры использования

### Запуск примеров

```bash
# Основной пример с расчетом тарифа и нормализацией
npm run example

# Поиск отделений по координатам
npm run coordinates

# Поиск отделений по адресу и индексу
npm run postoffice

# Тестирование работы с заказами
npm run orders

# Подробный пример расчета тарифов
npm run tariff
```

### Примеры кода

Смотрите папку [examples/](examples/) для полных примеров:

- [real-usage.ts](examples/real-usage.ts) - Основной пример с расчетом тарифа и нормализацией
- [tariff-calculation.ts](examples/tariff-calculation.ts) - Подробный пример расчета тарифов с комментариями
- [coordinates-test.ts](examples/coordinates-test.ts) - Поиск отделений по координатам
- [postoffice-search.ts](examples/postoffice-search.ts) - Поиск отделений по адресу и индексу
- [orders-test.ts](examples/orders-test.ts) - Тестирование работы с заказами

## Development

### Prerequisites
- Node.js 14+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

If you encounter any issues or have questions, please open an issue in the GitHub repository. 