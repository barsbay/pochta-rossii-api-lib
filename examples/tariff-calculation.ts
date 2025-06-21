import dotenv from 'dotenv';
import { PochtaRossiiApi } from '../src';

// Load environment variables from .env file
dotenv.config();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const log = {
  info: (msg: string) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  title: (msg: string) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}`),
  section: (msg: string) => console.log(`\n${colors.magenta}📋 ${msg}${colors.reset}`),
  data: (msg: string) => console.log(`${colors.white}${msg}${colors.reset}`)
};

/**
 * Пример расчета тарифа доставки с подробными комментариями
 * 
 * Возможные значения mail-category:
 * - 'SIMPLE' - Простое отправление (без уведомления о вручении)
 * - 'ORDINARY' - Обыкновенное отправление (с уведомлением о вручении)
 * - 'REGISTERED' - Заказное отправление (с уведомлением о вручении и описью вложения)
 * - 'WITH_DECLARED_VALUE' - Отправление с объявленной ценностью
 * 
 * Возможные значения mail-type:
 * - 'POSTAL_PARCEL' - Посылка (до 20 кг, размеры до 120 см)
 * - 'ONLINE_PARCEL' - Посылка онлайн (до 2 кг, доставка до двери или ПВЗ)
 * - 'ONLINE_COURIER' - Курьер онлайн (до 30 кг, доставка курьером)
 * - 'EMS' - EMS (до 31.5 кг, экспресс-доставка)
 * - 'EMS_OPTIMAL' - EMS оптимальный (до 31.5 кг, экономичная экспресс-доставка)
 * - 'LETTER' - Письмо (до 100 г, размеры до 229x324 мм)
 * - 'BANDEROL' - Бандероль (до 2 кг, печатные издания)
 */
async function main() {
  log.title('💰 Расчет тарифа доставки - Подробный пример');
  
  // Check environment variables
  if (!process.env.AUTHORIZATION || !process.env.X_USER_AUTHORIZATION) {
    log.error('Missing required environment variables!');
    log.info('Please check your .env file contains:');
    log.info('- AUTHORIZATION (your access token)');
    log.info('- X_USER_AUTHORIZATION (your base64 encoded credentials)');
    return;
  }

  // Initialize API client
  const api = new PochtaRossiiApi({
    Authorization: process.env.AUTHORIZATION,
    'X-User-Authorization': process.env.X_USER_AUTHORIZATION
  });

  try {
    log.section('Пример 1: Посылка обыкновенная (Москва → Санкт-Петербург)');
    
    const tariffRequest1 = {
      'index-from': 101000, // Москва, Центральный почтамт
      'index-to': 190000,   // Санкт-Петербург, Центральный почтамт
      'mail-category': 'ORDINARY' as const, // Обыкновенное отправление
      'mail-type': 'ONLINE_PARCEL' as const, // Посылка
      mass: 1500, // 1.5 кг
      fragile: false, // Не хрупкое
      'with-order-of-notice': false, // Без уведомления о вручении
      'with-simple-notice': false, // Без простого уведомления
      'with-declared-value': false, // Без объявленной ценности
      'declared-value': 0 // Сумма объявленной ценности
    };

    log.info('Отправляем запрос на расчет тарифа...');
    const tariffResponse1 = await api.calculateTariff(tariffRequest1);
    
    log.success('Тариф рассчитан успешно!');
    log.data(`📦 Тип отправления: ${tariffRequest1['mail-type']}`);
    log.data(`📋 Категория: ${tariffRequest1['mail-category']}`);
    log.data(`⚖️  Вес: ${tariffRequest1.mass} г`);
    log.data(`💰 Общая стоимость: ${(tariffResponse1['total-rate'] / 100).toFixed(2)} ₽`);
    log.data(`📅 Срок доставки: ${tariffResponse1['delivery-time']?.min ?? 'не указан'} - ${tariffResponse1['delivery-time']?.max ?? 'не указан'} дней`);
    log.data(`🏷️  НДС: ${(tariffResponse1['total-vat'] / 100).toFixed(2)} ₽`);
    log.data(`📊 Стоимость доставки: ${(tariffResponse1['delivery-cost'] / 100).toFixed(2)} ₽`);
    log.data(`🛡️  Стоимость страхования: ${(tariffResponse1['insurance-cost'] / 100).toFixed(2)} ₽`);
    log.data(`📝 Стоимость уведомления: ${(tariffResponse1['notice-cost'] / 100).toFixed(2)} ₽`);

    log.section('Пример 2: EMS отправление с объявленной ценностью');
    
    const tariffRequest2 = {
      'index-from': 101000, // Москва
      'index-to': 630000,   // Новосибирск
      'mail-category': 'WITH_DECLARED_VALUE' as const, // С объявленной ценностью
      'mail-type': 'EMS' as const, // EMS экспресс
      mass: 2500, // 2.5 кг
      fragile: false, // EMS не поддерживает отметку "Хрупкое"
      'with-order-of-notice': true, // С уведомлением о вручении
      'with-simple-notice': false, // Без простого уведомления
      'with-declared-value': true, // С объявленной ценностью
      'declared-value': 50000 // 50000 копеек = 500 рублей
    };

    log.info('Рассчитываем EMS отправление...');
    const tariffResponse2 = await api.calculateTariff(tariffRequest2);
    
    log.success('EMS тариф рассчитан!');
    log.data(`📦 Тип отправления: ${tariffRequest2['mail-type']}`);
    log.data(`📋 Категория: ${tariffRequest2['mail-category']}`);
    log.data(`⚖️  Вес: ${tariffRequest2.mass} г`);
    log.data(`💎 Объявленная ценность: ${tariffRequest2['declared-value'] / 100} ₽`);
    log.data(`💰 Общая стоимость: ${(tariffResponse2['total-rate'] / 100).toFixed(2)} ₽`);
    log.data(`📅 Срок доставки: ${tariffResponse2['delivery-time']?.min ?? 'не указан'} - ${tariffResponse2['delivery-time']?.max ?? 'не указан'} дней`);

    log.section('Пример 3: Онлайн посылка (доставка до двери)');
    
    const tariffRequest3 = {
      'index-from': 101000, // Москва
      'index-to': 190000,   // Санкт-Петербург
      'mail-category': 'ORDINARY' as const,
      'mail-type': 'ONLINE_PARCEL' as const, // Онлайн посылка
      mass: 800, // 800 г
      fragile: false,
      'with-order-of-notice': false,
      'with-simple-notice': false,
      'with-declared-value': false,
      'declared-value': 0
    };

    log.info('Рассчитываем онлайн посылку...');
    const tariffResponse3 = await api.calculateTariff(tariffRequest3);
    
    log.success('Онлайн посылка рассчитана!');
    log.data(`📦 Тип отправления: ${tariffRequest3['mail-type']}`);
    log.data(`⚖️  Вес: ${tariffRequest3.mass} г`);
    log.data(`💰 Общая стоимость: ${(tariffResponse3['total-rate'] / 100).toFixed(2)} ₽`);
    log.data(`📅 Срок доставки: ${tariffResponse3['delivery-time']?.min ?? 'не указан'} - ${tariffResponse3['delivery-time']?.max ?? 'не указан'} дней`);

    log.section('Пример 4: Письмо заказное');
    
    const tariffRequest4 = {
      'index-from': 101000, // Москва
      'index-to': 190000,   // Санкт-Петербург
      'mail-category': 'ORDERED' as const, // Заказное (корректное значение для API)
      'mail-type': 'LETTER' as const, // Письмо
      mass: 50, // 50 г
      fragile: false,
      'with-order-of-notice': true, // С уведомлением о вручении
      'with-simple-notice': false,
      'with-declared-value': false,
      'declared-value': 0
    };

    log.info('Рассчитываем заказное письмо...');
    const tariffResponse4 = await api.calculateTariff(tariffRequest4);
    
    log.success('Заказное письмо рассчитано!');
    log.data(`📦 Тип отправления: ${tariffRequest4['mail-type']}`);
    log.data(`📋 Категория: ${tariffRequest4['mail-category']}`);
    log.data(`⚖️  Вес: ${tariffRequest4.mass} г`);
    log.data(`💰 Общая стоимость: ${(tariffResponse4['total-rate'] / 100).toFixed(2)} ₽`);
    log.data(`📅 Срок доставки: ${tariffResponse4['delivery-time']?.min ?? 'не указан'} - ${tariffResponse4['delivery-time']?.max ?? 'не указан'} дней`);

    log.section('Сравнение тарифов');
    log.data('📊 Сравнительная таблица:');
    log.data(`   Посылка обыкновенная: ${(tariffResponse1['total-rate'] / 100).toFixed(2)} ₽`);
    log.data(`   EMS с ценностью: ${(tariffResponse2['total-rate'] / 100).toFixed(2)} ₽`);
    log.data(`   Онлайн посылка: ${(tariffResponse3['total-rate'] / 100).toFixed(2)} ₽`);
    log.data(`   Заказное письмо: ${(tariffResponse4['total-rate'] / 100).toFixed(2)} ₽`);

  } catch (error: any) {
    log.error('Ошибка при расчете тарифа');
    if (error?.response?.data) {
      log.data(`Ошибка сервера: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      log.data(`Ошибка: ${error.message || error}`);
    }
  }
}

// Run the example
main().catch(console.error);

export { main }; 