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

async function testCoordinatesSearch() {
  log.title('📍 Поиск отделений по координатам');
  
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
    log.section('Test 1: Поиск отделений по координатам');
    log.info('Ищем отделения в центре Москвы...');
    
    const coordinatesRequest = {
      latitude: 55.7558,
      longitude: 37.6176,
      radius: 2000, // 2 км
      filter: 'ALL' // все типы отделений
    };

    const offices = await api.searchPostOfficesByCoordinates(coordinatesRequest);
    log.success(`Найдено ${offices.length} отделений!`);
    
    if (offices.length > 0) {
      log.data('Ближайшие отделения:');
      offices.slice(0, 5).forEach((office: any, index: number) => {
        log.data(`  ${index + 1}. ${office.name || 'Отделение Почты России'}`);
        log.data(`     📍 ${office.address || 'Адрес не указан'}`);
        log.data(`     📮 ${office.index || 'Индекс не указан'}`);
        log.data(`     📞 ${office.phone || 'Телефон не указан'}`);
        if (office.distance) {
          log.data(`     🚶 ${office.distance} м`);
        }
        if (office['working-hours']) {
          log.data(`     🕒 Режим работы: ${office['working-hours'].map((wh: any) => `${wh.day}: ${wh.hours}`).join(', ')}`);
        }
        console.log('');
      });
      
      if (offices.length > 5) {
        log.info(`... и еще ${offices.length - 5} отделений`);
      }
    } else {
      log.warning('Отделения не найдены в указанном радиусе');
    }
  } catch (error: any) {
    log.error('Ошибка поиска отделений по координатам');
    log.data(`Ошибка: ${error.message || error}`);
  }
}

// Run the test
testCoordinatesSearch().catch(console.error); 