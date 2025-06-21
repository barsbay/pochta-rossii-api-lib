import { PochtaRossiiApi } from '../src';
import dotenv from 'dotenv';

// Load environment variables
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

async function testOrdersMethods() {
  log.title('📦 Тестирование методов работы с заказами');
  
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

  let createdOrderId: string | null = null;

  try {
    // Test 1: Create Order
    log.section('Test 1: Создание заказа');
    log.info('Создаем тестовый заказ...');
    
    const testOrder = {
      'address-type-to': 'DEFAULT',
      'given-name': 'Иван',
      'mail-category': 'ORDINARY' as const,
      'mail-type': 'POSTAL_PARCEL' as const,
      mass: 1000,
      'order-num': `TEST-${Date.now()}`, // уникальный номер
      'recipient-name': 'Иванов Иван Иванович',
      'str-index-to': '101000',
      'tel-address': '+79001234567',
      'index-to': 101000,
      'region-to': 'Москва',
      'place-to': 'Москва',
      'street-to': 'Красная площадь',
      'house-to': '1'
    };

    try {
      const createdOrder = await api.createOrder(testOrder);
      log.success('Заказ создан успешно!');
      log.data(`ID заказа: ${createdOrder['order-num'] || 'Не указан'}`);
      createdOrderId = createdOrder['order-num'] || testOrder['order-num'];
      
      // Сохраняем ID для последующих тестов
      log.data('Данные созданного заказа:');
      log.data(JSON.stringify(createdOrder, null, 2));
    } catch (error: any) {
      log.error('Ошибка создания заказа');
      log.data(`Ошибка: ${error.message || error}`);
    }

    // Test 2: Get All Orders
    log.section('Test 2: Получение всех заказов');
    log.info('Получаем список всех заказов...');
    
    try {
      const allOrders = await api.getOrders();
      log.success(`Получено ${allOrders.length} заказов`);
      
      if (allOrders.length > 0) {
        log.data('Первые 3 заказа:');
        allOrders.slice(0, 3).forEach((order: any, index: number) => {
          log.data(`  ${index + 1}. Заказ ${order['order-num'] || 'Без номера'}`);
          log.data(`     Получатель: ${order['recipient-name'] || 'Не указан'}`);
          log.data(`     Адрес: ${order['place-to'] || ''}, ${order['street-to'] || ''}, ${order['house-to'] || ''}`);
          log.data(`     Вес: ${order.mass || 0} г`);
        });
      }
    } catch (error: any) {
      log.error('Ошибка получения заказов');
      log.data(`Ошибка: ${error.message || error}`);
    }

    // Test 3: Get Order by ID (если заказ был создан)
    if (createdOrderId) {
      log.section('Test 3: Получение заказа по ID');
      log.info(`Получаем заказ с ID: ${createdOrderId}`);
      
      try {
        const orderById = await api.getOrderById(createdOrderId);
        log.success('Заказ найден!');
        log.data('Данные заказа:');
        log.data(JSON.stringify(orderById, null, 2));
      } catch (error: any) {
        log.error('Ошибка получения заказа по ID');
        log.data(`Ошибка: ${error.message || error}`);
      }
    }

    // Test 4: Create Batch
    log.section('Test 4: Создание партии');
    log.info('Создаем тестовую партию...');
    
    const testBatch = {
      'batch-name': `Test Batch ${Date.now()}`,
      'sending-date': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // через неделю
      'shipment-point-index': '101000'
    };

    try {
      const createdBatch = await api.createBatch(testBatch);
      log.success('Партия создана успешно!');
      log.data(`ID партии: ${createdBatch['batch-name'] || 'Не указан'}`);
      log.data('Данные созданной партии:');
      log.data(JSON.stringify(createdBatch, null, 2));
    } catch (error: any) {
      log.error('Ошибка создания партии');
      log.data(`Ошибка: ${error.message || error}`);
    }

    // Test 5: Get All Batches
    log.section('Test 5: Получение всех партий');
    log.info('Получаем список всех партий...');
    
    try {
      const allBatches = await api.getBatches();
      log.success(`Получено ${allBatches.length} партий`);
      
      if (allBatches.length > 0) {
        log.data('Первые 3 партии:');
        allBatches.slice(0, 3).forEach((batch: any, index: number) => {
          log.data(`  ${index + 1}. Партия: ${batch['batch-name'] || 'Без названия'}`);
          log.data(`     Дата отправки: ${batch['sending-date'] || 'Не указана'}`);
          log.data(`     Индекс ОПС: ${batch['shipment-point-index'] || 'Не указан'}`);
        });
      }
    } catch (error: any) {
      log.error('Ошибка получения партий');
      log.data(`Ошибка: ${error.message || error}`);
    }

    // Test 6: Search Orders (если есть заказы)
    log.section('Test 6: Поиск заказов');
    log.info('Проверяем поиск заказов...');
    
    try {
      // Попробуем найти заказ по номеру, если он был создан
      if (createdOrderId) {
        const searchResult = await api.getOrderById(createdOrderId);
        log.success('Поиск заказа выполнен!');
        log.data(`Найден заказ: ${searchResult['order-num'] || 'Без номера'}`);
      } else {
        log.warning('Нет созданного заказа для поиска');
      }
    } catch (error: any) {
      log.error('Ошибка поиска заказов');
      log.data(`Ошибка: ${error.message || error}`);
    }

    // Test 7: Update Order (если заказ был создан)
    if (createdOrderId) {
      log.section('Test 7: Обновление заказа');
      log.info(`Обновляем заказ с ID: ${createdOrderId}`);
      
      const updatedOrder = {
        ...testOrder,
        recipientName: 'Петров Петр Петрович (обновлено)',
        mass: 1500 // увеличиваем вес
      };

      try {
        const result = await api.updateOrder(createdOrderId, updatedOrder);
        log.success('Заказ обновлен успешно!');
        log.data('Обновленные данные заказа:');
        log.data(JSON.stringify(result, null, 2));
      } catch (error: any) {
        log.error('Ошибка обновления заказа');
        log.data(`Ошибка: ${error.message || error}`);
      }
    }

    // Test 8: Move Order to Backlog (если заказ был создан)
    if (createdOrderId) {
      log.section('Test 8: Перевод заказа в отложенные');
      log.info(`Переводим заказ ${createdOrderId} в отложенные...`);
      
      try {
        await api.moveOrderToBacklog(createdOrderId);
        log.success('Заказ успешно переведен в отложенные!');
      } catch (error: any) {
        log.error('Ошибка перевода заказа в отложенные');
        log.data(`Ошибка: ${error.message || error}`);
      }
    }

  } catch (error: any) {
    log.error('Общая ошибка');
    log.data(`Ошибка: ${error.message || error}`);
  }

  // Cleanup: Delete created order if exists
  if (createdOrderId) {
    log.section('Cleanup: Удаление тестового заказа');
    log.info(`Удаляем заказ с ID: ${createdOrderId}`);
    
    try {
      await api.deleteOrder(createdOrderId);
      log.success('Тестовый заказ удален');
    } catch (error: any) {
      log.warning('Не удалось удалить тестовый заказ');
      log.data(`Ошибка: ${error.message || error}`);
    }
  }
}

// Run the test
testOrdersMethods().catch(console.error); 