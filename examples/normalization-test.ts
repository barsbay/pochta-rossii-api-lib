import { PochtaRossiiApi } from '../src';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

async function testNormalization() {
  console.log('🔍 Тестирование методов нормализации...\n');

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

    // ========================================
    // 1. НОРМАЛИЗАЦИЯ АДРЕСОВ
    // ========================================
    console.log('📍 ТЕСТИРОВАНИЕ НОРМАЛИЗАЦИИ АДРЕСОВ');
    console.log('=' .repeat(50));

    const addressTests = [
      {
        id: '1',
        'original-address': 'Москва, Красная площадь, 1'
      },
      {
        id: '2', 
        'original-address': 'Санкт-Петербург, Невский проспект, 28'
      },
      {
        id: '3',
        'original-address': 'г. Екатеринбург, ул. Ленина, д. 50, кв. 15'
      },
      {
        id: '4',
        'original-address': 'Новосибирск, Красный проспект, 1/1'
      },
      {
        id: '5',
        'original-address': 'Казань, ул. Баумана, 10, офис 5'
      }
    ];

    for (const test of addressTests) {
      try {
        console.log(`\n📮 Нормализация адреса: "${test['original-address']}"`);
        const result = await api.normalizeAddress(test);
        
        console.log('✅ Результат:');
        console.log(`   Качество: ${result['quality-code']}`);
        
        if (result['normalized-address']) {
          const addr = result['normalized-address'];
          console.log(`   Индекс: ${addr.index}`);
          console.log(`   Регион: ${addr.region}`);
          console.log(`   Город: ${addr.place}`);
          console.log(`   Улица: ${addr.street}`);
          console.log(`   Дом: ${addr.house}`);
          if (addr.building) console.log(`   Строение: ${addr.building}`);
          if (addr.corpus) console.log(`   Корпус: ${addr.corpus}`);
          if (addr.room) console.log(`   Квартира: ${addr.room}`);
        }
      } catch (error: any) {
        console.error(`❌ Ошибка: ${error.message}`);
      }
    }

    // ========================================
    // 2. НОРМАЛИЗАЦИЯ ФИО
    // ========================================
    console.log('\n\n👤 ТЕСТИРОВАНИЕ НОРМАЛИЗАЦИИ ФИО');
    console.log('=' .repeat(50));

    const fioTests = [
      {
        id: '1',
        'original-fio': 'Иванов Иван Иванович'
      },
      {
        id: '2',
        'original-fio': 'Петрова Анна Сергеевна'
      },
      {
        id: '3',
        'original-fio': 'Сидоров А.П.'
      },
      {
        id: '4',
        'original-fio': 'Козлова Елена'
      },
      {
        id: '5',
        'original-fio': 'Смирнов В.В.'
      }
    ];

    for (const test of fioTests) {
      try {
        console.log(`\n👤 Нормализация ФИО: "${test['original-fio']}"`);
        const result = await api.normalizeFio(test);
        
        console.log('✅ Результат:');
        console.log(`   Качество: ${result['quality-code']}`);
        
        if (result['normalized-fio']) {
          const fio = result['normalized-fio'];
          console.log(`   Фамилия: ${fio.surname}`);
          console.log(`   Имя: ${fio.name}`);
          console.log(`   Отчество: ${fio.patronymic}`);
        }
      } catch (error: any) {
        console.error(`❌ Ошибка: ${error.message}`);
      }
    }

    // ========================================
    // 3. НОРМАЛИЗАЦИЯ ТЕЛЕФОНОВ
    // ========================================
    console.log('\n\n📞 ТЕСТИРОВАНИЕ НОРМАЛИЗАЦИИ ТЕЛЕФОНОВ');
    console.log('=' .repeat(50));

    const phoneTests = [
      {
        id: '1',
        'original-phone': '+7 900 123 45 67'
      },
      {
        id: '2',
        'original-phone': '8-800-555-35-35'
      },
      {
        id: '3',
        'original-phone': '495 123 45 67'
      },
      {
        id: '4',
        'original-phone': '+7 (812) 123-45-67'
      },
      {
        id: '5',
        'original-phone': '9001234567'
      }
    ];

    for (const test of phoneTests) {
      try {
        console.log(`\n📞 Нормализация телефона: "${test['original-phone']}"`);
        const result = await api.normalizePhone(test);
        
        console.log('✅ Результат:');
        console.log(`   Качество: ${result['quality-code']}`);
        
        if (result['normalized-phone']) {
          console.log(`   Нормализованный: ${result['normalized-phone']}`);
        }
      } catch (error: any) {
        console.error(`❌ Ошибка: ${error.message}`);
      }
    }

    // ========================================
    // 4. ПАКЕТНАЯ НОРМАЛИЗАЦИЯ
    // ========================================
    console.log('\n\n📦 ТЕСТИРОВАНИЕ ПАКЕТНОЙ НОРМАЛИЗАЦИИ');
    console.log('=' .repeat(50));

    console.log('\n📮 Пакетная нормализация адресов:');
    try {
      const batchAddressResult = await api.normalizeAddress({
        id: 'batch-1',
        'original-address': 'Москва, Тверская ул., 1'
      });
      console.log('✅ Пакетная нормализация адреса выполнена');
      console.log(`   Качество: ${batchAddressResult['quality-code']}`);
    } catch (error: any) {
      console.error(`❌ Ошибка пакетной нормализации: ${error.message}`);
    }

    console.log('\n👤 Пакетная нормализация ФИО:');
    try {
      const batchFioResult = await api.normalizeFio({
        id: 'batch-2',
        'original-fio': 'Сидоров Петр Александрович'
      });
      console.log('✅ Пакетная нормализация ФИО выполнена');
      console.log(`   Качество: ${batchFioResult['quality-code']}`);
    } catch (error: any) {
      console.error(`❌ Ошибка пакетной нормализации: ${error.message}`);
    }

    console.log('\n📞 Пакетная нормализация телефона:');
    try {
      const batchPhoneResult = await api.normalizePhone({
        id: 'batch-3',
        'original-phone': '+7 495 123 45 67'
      });
      console.log('✅ Пакетная нормализация телефона выполнена');
      console.log(`   Качество: ${batchPhoneResult['quality-code']}`);
    } catch (error: any) {
      console.error(`❌ Ошибка пакетной нормализации: ${error.message}`);
    }

    console.log('\n🎉 Тестирование методов нормализации завершено!');

  } catch (error: any) {
    console.error('❌ Общая ошибка:');
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
testNormalization().catch(console.error); 