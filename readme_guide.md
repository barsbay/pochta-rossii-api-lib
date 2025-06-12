# PochtaRossiiApiLib

Библиотека для работы с API Почты России (otpravka.pochta.ru) на TypeScript.

## Установка

```bash
npm install pochta-rossii-api-lib
```

## Начало работы

```typescript
import { PochtaRossiiApi } from 'pochta-rossii-api-lib';

const api = new PochtaRossiiApi({
  token: 'YOUR_TOKEN',
  key: 'YOUR_KEY'
});
```

## Основные возможности

- Создание и управление заказами
- Работа с партиями отправлений
- Генерация документов (Ф103, Ф7п, Ф112ЭК)
- Расчет тарифов доставки
- Нормализация адресов, ФИО и телефонов
- Работа с архивом отправлений
- Управление возвратами

## Примеры использования

### Создание заказа

```typescript
const order = await api.orders.create({
  addressTypeTo: 'DEFAULT',
  givenName: 'Иван',
  mailCategory: 'ORDINARY',
  mailType: 'POSTAL_PARCEL',
  mass: 1000,
  orderNum: '12345',
  recipientName: 'Иванов Иван Иванович',
  strIndexTo: '101000',
  telAddress: '+79001234567',
  indexTo: 101000,
  regionTo: 'Москва',
  placeTo: 'Москва',
  streetTo: 'Красная площадь',
  houseTo: '1'
});
```

### Расчет тарифа

```typescript
const tariff = await api.tariff.calculate({
  indexFrom: 101000,
  indexTo: 190000,
  mailCategory: 'ORDINARY',
  mailType: 'POSTAL_PARCEL',
  mass: 1000,
  fragile: false,
  withOrderOfNotice: false,
  withSimpleNotice: false,
  withDeclaredValue: false,
  declaredValue: 0
});
```

### Нормализация адреса

```typescript
const normalizedAddress = await api.normalization.normalizeAddress({
  id: '1',
  originalAddress: 'Москва, Красная площадь, 1'
});
```

## Документация

Полная документация доступна в директории `docs/`.

## Требования

- Node.js >= 14
- TypeScript >= 4.0

## Лицензия

MIT