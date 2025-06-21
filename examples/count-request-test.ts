import { PochtaRossiiApi } from '../src';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

async function testCountRequest() {
  console.log('🔍 Тестирование метода countRequest...\n');

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

    console.log('📊 Получение статистики запросов к API...');

    // Получаем статистику запросов
    const countInfo = await api.countRequest();

    console.log('✅ Статистика запросов получена:');
    console.log('┌─────────────────────────────────────┐');
    console.log('│           СТАТИСТИКА API            │');
    console.log('├─────────────────────────────────────┤');
    console.log(`│ Всего запросов: ${countInfo.total?.toString().padEnd(20)} │`);
    console.log(`│ Запросов в периоде: ${countInfo.current?.toString().padEnd(15)} │`);
    console.log(`│ Лимит запросов: ${countInfo.limit?.toString().padEnd(20)} │`);
    
    if (countInfo.periodStart) {
      console.log(`│ Начало периода: ${countInfo.periodStart.padEnd(18)} │`);
    }
    if (countInfo.periodEnd) {
      console.log(`│ Конец периода: ${countInfo.periodEnd.padEnd(20)} │`);
    }
    
    // Вычисляем процент использования
    if (countInfo.limit && countInfo.current) {
      const usagePercent = Math.round((countInfo.current / countInfo.limit) * 100);
      const usageBar = '█'.repeat(Math.floor(usagePercent / 5)) + '░'.repeat(20 - Math.floor(usagePercent / 5));
      console.log(`│ Использование: ${usagePercent.toString().padEnd(2)}% ${usageBar} │`);
    }
    
    console.log('└─────────────────────────────────────┘');

  } catch (error: any) {
    console.error('❌ Ошибка при получении статистики запросов:');
    if (error.status) {
      console.error(`   Статус: ${error.status}`);
    }
    if (error.data) {
      console.error(`   Данные: ${JSON.stringify(error.data, null, 2)}`);
    }
    console.error(`   Сообщение: ${error.message}`);
  }
}

// Запускаем тест
testCountRequest().catch(console.error); 