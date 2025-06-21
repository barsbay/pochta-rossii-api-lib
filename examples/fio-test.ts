import { PochtaRossiiApi } from '../src';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

async function testFioNormalization() {
  console.log('🔍 Тестирование нормализации ФИО...\n');

  // Проверяем наличие необходимых переменных окружения
  const token = process.env.AUTHORIZATION;
  const key = process.env.X_USER_AUTHORIZATION;

  if (!token || !key) {
    console.error('❌ Ошибка: Не найдены переменные окружения AUTHORIZATION или X_USER_AUTHORIZATION');
    console.log('Создайте файл .env на основе env.example и добавьте ваши учетные данные');
    return;
  }

  try {
    // Создаем экземпляр API клиента
    const api = new PochtaRossiiApi({
      Authorization: token,
      'X-User-Authorization': key,
      baseUrl: 'https://otpravka-api.pochta.ru'
    });

    // Тест 1: Стандартный метод normalizeFio
    console.log('📝 Тест 1: Стандартный метод normalizeFio');
    try {
      const result = await api.normalizeFio({
        id: '1',
        'original-fio': 'Иванов Иван Иванович'
      });
      console.log('✅ Успешно:', result);
    } catch (error: any) {
      console.error('❌ Ошибка:', error.message);
      if (error.status) console.error('   Статус:', error.status);
      if (error.data) console.error('   Данные:', error.data);
    }

    // Тест 2: Прямой запрос к API
    console.log('\n📝 Тест 2: Прямой запрос к /1.0/clean/fio');
    try {
      const response = await api['client'].post('/1.0/clean/fio', [{
        id: '2',
        'original-fio': 'Петрова Анна Сергеевна'
      }]);
      console.log('✅ Успешно:', response.data);
    } catch (error: any) {
      console.error('❌ Ошибка:', error.message);
      if (error.response?.status) console.error('   Статус:', error.response.status);
      if (error.response?.data) console.error('   Данные:', error.response.data);
    }

    // Тест 3: Альтернативный URL
    console.log('\n📝 Тест 3: Альтернативный URL /1.0/clean/fio/');
    try {
      const response = await api['client'].post('/1.0/clean/fio/', [{
        id: '3',
        'original-fio': 'Сидоров Петр Александрович'
      }]);
      console.log('✅ Успешно:', response.data);
    } catch (error: any) {
      console.error('❌ Ошибка:', error.message);
      if (error.response?.status) console.error('   Статус:', error.response.status);
      if (error.response?.data) console.error('   Данные:', error.response.data);
    }

    // Тест 4: Проверка доступности метода через GET
    console.log('\n📝 Тест 4: Проверка доступности метода (GET)');
    try {
      const response = await api['client'].get('/1.0/clean/fio');
      console.log('✅ Метод доступен:', response.data);
    } catch (error: any) {
      console.error('❌ Метод недоступен:', error.message);
      if (error.response?.status) console.error('   Статус:', error.response.status);
    }

    // Тест 5: Проверка документации API
    console.log('\n📝 Тест 5: Проверка документации API');
    try {
      const response = await api['client'].get('/1.0/');
      console.log('✅ API доступен:', response.data);
    } catch (error: any) {
      console.error('❌ API недоступен:', error.message);
    }

    console.log('\n🎯 Тестирование завершено!');

  } catch (error: any) {
    console.error('❌ Общая ошибка:', error.message);
  }
}

// Запускаем тест
testFioNormalization().catch(console.error); 