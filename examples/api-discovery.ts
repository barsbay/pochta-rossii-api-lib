import { PochtaRossiiApi } from '../src';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

async function discoverApiMethods() {
  console.log('🔍 Обнаружение доступных методов API...\n');

  // Проверяем наличие необходимых переменных окружения
  const token = process.env.AUTHORIZATION;
  const key = process.env.X_USER_AUTHORIZATION;

  if (!token || !key) {
    console.error('❌ Ошибка: Не найдены переменные окружения AUTHORIZATION или X_USER_AUTHORIZATION');
    return;
  }

  try {
    // Создаем экземпляр API клиента
    const api = new PochtaRossiiApi({
      Authorization: token,
      'X-User-Authorization': key,
      baseUrl: 'https://otpravka-api.pochta.ru'
    });

    // Список методов для проверки
    const methodsToTest = [
      '/1.0/user/token',
      '/1.0/backlog',
      '/1.0/shipment',
      '/1.0/tariff',
      '/1.0/clean/address',
      '/1.0/clean/fio',
      '/1.0/clean/phone',
      '/1.0/forms',
      '/1.0/postoffice',
      '/1.0/settings',
      '/1.0/counter',
      '/1.0/archive',
      '/postoffice/1.0/by-address',
      '/postoffice/1.0/nearby',
      '/postoffice/1.0/nearest'
    ];

    console.log('📋 Проверка доступности методов API:\n');

    for (const method of methodsToTest) {
      try {
        console.log(`🔍 Проверка: ${method}`);
        
        // Пробуем GET запрос
        const response = await api['client'].get(method);
        console.log(`✅ GET ${method} - Доступен (${response.status})`);
        
        // Если это POST метод, пробуем и POST
        if (method.includes('/clean/') || method.includes('/tariff')) {
          try {
            const postResponse = await api['client'].post(method, []);
            console.log(`✅ POST ${method} - Доступен (${postResponse.status})`);
          } catch (postError: any) {
            if (postError.response?.status === 400) {
              console.log(`✅ POST ${method} - Доступен (требует данные)`);
            } else {
              console.log(`❌ POST ${method} - Ошибка: ${postError.response?.status || postError.message}`);
            }
          }
        }
        
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        
        if (status === 404) {
          console.log(`❌ ${method} - Не найден (404)`);
        } else if (status === 407) {
          console.log(`❌ ${method} - Недоступен (407: ${message})`);
        } else if (status === 401) {
          console.log(`❌ ${method} - Требует авторизацию (401)`);
        } else {
          console.log(`❌ ${method} - Ошибка: ${status || message}`);
        }
      }
      
      console.log(''); // Пустая строка для разделения
    }

    // Проверяем рабочие методы
    console.log('🎯 Тестирование рабочих методов:\n');

    // 1. Проверяем получение токена
    console.log('1️⃣ Тест получения токена:');
    try {
      const tokenResponse = await api['client'].get('/1.0/user/token');
      console.log('✅ Токен получен:', tokenResponse.data);
    } catch (error: any) {
      console.log('❌ Ошибка получения токена:', error.response?.status || error.message);
    }

    // 2. Проверяем расчет тарифа
    console.log('\n2️⃣ Тест расчета тарифа:');
    try {
      const tariffResponse = await api['client'].post('/1.0/tariff', {
        'index-from': 101000,
        'index-to': 190000,
        'mail-category': 'ORDINARY',
        'mail-type': 'POSTAL_PARCEL',
        mass: 1000,
        fragile: false,
        'with-order-of-notice': false,
        'with-simple-notice': false,
        'with-declared-value': false,
        'declared-value': 0
      });
      console.log('✅ Тариф рассчитан:', tariffResponse.data);
    } catch (error: any) {
      console.log('❌ Ошибка расчета тарифа:', error.response?.status || error.message);
    }

    // 3. Проверяем нормализацию адреса
    console.log('\n3️⃣ Тест нормализации адреса:');
    try {
      const addressResponse = await api['client'].post('/1.0/clean/address', [{
        id: '1',
        'original-address': 'Москва, Красная площадь, 1'
      }]);
      console.log('✅ Адрес нормализован:', addressResponse.data);
    } catch (error: any) {
      console.log('❌ Ошибка нормализации адреса:', error.response?.status || error.message);
    }

    console.log('\n🎉 Обнаружение методов завершено!');

  } catch (error: any) {
    console.error('❌ Общая ошибка:', error.message);
  }
}

// Запускаем тест
discoverApiMethods().catch(console.error); 