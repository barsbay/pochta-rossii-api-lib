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

function displayPostOffices(offices: any[], title: string) {
  if (Array.isArray(offices) && offices.length > 0) {
    log.data(`📋 ${title} (${offices.length} отделений):`);
    
    offices.forEach((office: any, index: number) => {
      log.data(`\n  ${index + 1}. ${office.name || 'Неизвестное отделение'}`);
      log.data(`     📍 Адрес: ${office.address || 'Адрес не указан'}`);
      log.data(`     📮 Индекс: ${office.index || 'Индекс не указан'}`);
      log.data(`     📞 Телефон: ${office.phone || 'Телефон не указан'}`);
      
      if (office.distance) {
        log.data(`     🚶 Расстояние: ${office.distance} м`);
      }
      
      if (office.workHours) {
        log.data(`     🕒 Часы работы: ${office.workHours}`);
      }
    });
  } else {
    log.warning(`${title}: отделения не найдены`);
  }
}

async function testPostOfficeSearch() {
  log.title('🏛️ Поиск отделений Почты России');
  
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
    // Test 1: Search by coordinates
    log.section('Test 1: Поиск по координатам');
    log.info('Координаты: 55.740000, 37.610000 (центр Москвы)');
    log.info('Радиус: 5000 метров');
    
    try {
      const coordinatesOffices = await api.searchPostOfficesByCoordinates({
        latitude: 55.740000,
        longitude: 37.610000,
        radius: 5000,
        filter: 'ALL'
      });
      
      displayPostOffices(coordinatesOffices, 'Найдено по координатам');
    } catch (error: any) {
      log.error('Ошибка поиска по координатам');
      log.data(`Ошибка: ${error.message || error}`);
    }

    // Test 2: Search by address
    log.section('Test 2: Поиск по адресу');
    log.info('Адрес: "Москва, Красная площадь"');
    
    try {
      const addressOffices = await api.searchPostOfficesByAddress({
        address: 'Москва, Красная площадь',
        top: 5
      });
      
      displayPostOffices(addressOffices, 'Найдено по адресу');
    } catch (error: any) {
      log.error('Ошибка поиска по адресу');
      log.data(`Ошибка: ${error.message || error}`);
    }

    // Test 3: Search by index
    log.section('Test 3: Поиск по индексу');
    log.info('Индекс: 101000 (центр Москвы)');
    
    try {
      const indexOffices = await api.searchPostOfficesByIndex({
        index: '101000'
      });
      
      displayPostOffices(indexOffices, 'Найдено по индексу');
    } catch (error: any) {
      log.error('Ошибка поиска по индексу');
      log.data(`Ошибка: ${error.message || error}`);
    }

    // Test 4: Get all post offices (limited)
    log.section('Test 4: Получение всех отделений (ограниченно)');
    log.info('Получаем первые 10 отделений');
    
    try {
      const allOffices = await api.getAllPostOffices(10);
      
      displayPostOffices(allOffices, 'Все отделения (первые 10)');
    } catch (error: any) {
      log.error('Ошибка получения всех отделений');
      log.data(`Ошибка: ${error.message || error}`);
    }

  } catch (error: any) {
    log.error('Общая ошибка');
    log.data(`Ошибка: ${error.message || error}`);
  }
}

// Run the test
testPostOfficeSearch().catch(console.error); 