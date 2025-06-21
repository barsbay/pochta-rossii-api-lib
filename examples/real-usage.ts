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
 * Real usage example with environment variables
 * Make sure you have a .env file with your actual credentials
 */
async function main() {
  log.title('🚀 Pochta Rossii API Library - Real Usage Example');
  
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
    log.section('Example 1: Calculate delivery tariff');
    log.info('Calculating delivery cost from Moscow to Saint Petersburg...');
    
    const tariffRequest = {
      'index-from': 101000, // Moscow
      'index-to': 190000,   // Saint Petersburg
      'mail-category': 'ORDINARY' as const,
      'mail-type': 'POSTAL_PARCEL' as const,
      mass: 1000, // 1 kg
      fragile: false,
      'with-order-of-notice': false,
      'with-simple-notice': false,
      'with-declared-value': false,
      'declared-value': 0
    };

    const tariffResponse = await api.calculateTariff(tariffRequest);
    log.success('Tariff calculated successfully!');
    log.data(`💰 Delivery cost: ${(tariffResponse['total-rate'] / 100).toFixed(2)} ₽`);
    log.data(`📅 Delivery time: ${tariffResponse['delivery-time']?.min} - ${tariffResponse['delivery-time']?.max} days`);
    log.data(`📦 Mass: ${tariffRequest.mass} g`);

    log.section('Example 2: Normalize address');
    log.info('Normalizing address: "Москва, Красная площадь, 1"');
    
    const normalizeRequest = {
      id: '1',
      'original-address': 'Москва, Красная площадь, 1'
    };

    const normalizeResponse = await api.normalizeAddress(normalizeRequest);
    log.success('Address normalized successfully!');
    
    if (normalizeResponse['quality-code'] === 'GOOD') {
      log.data(`📍 Quality: ${normalizeResponse['quality-code']}`);
      if (normalizeResponse['normalized-address']) {
        const addr = normalizeResponse['normalized-address'];
        log.data(`📍 Normalized: ${addr.index}, ${addr.region}, ${addr.place}, ${addr.street}, ${addr.house}`);
      }
    } else {
      log.warning(`Address quality: ${normalizeResponse['quality-code']}`);
    }

    log.section('Example 3: Find nearest post offices');
    log.info('Searching for nearest post offices by coordinates...');
    log.info(`📍 Location: 55.740000, 37.610000 (Moscow center)`);
    log.info(`🔍 Radius: 1000 meters`);
    
    const lat = 55.740000;
    const lon = 37.610000;
    const radius = 1000; // meters
    
    try {
      const nearestResp = await api['client'].get('/postoffice/1.0/nearest', {
        params: { latitude: lat, longitude: lon, radius }
      });
      
      log.success('Nearest post offices found!');
      const offices = nearestResp.data;
      
      if (Array.isArray(offices) && offices.length > 0) {
        log.data(`📋 Found ${offices.length} post offices:`);
        offices.slice(0, 3).forEach((office: any, index: number) => {
          log.data(`  ${index + 1}. ${office.name || 'Unknown'}`);
          log.data(`     📍 ${office.address || 'No address'}`);
          log.data(`     📮 ${office.index || 'No index'}`);
          log.data(`     📞 ${office.phone || 'No phone'}`);
          if (office.distance) {
            log.data(`     🚶 ${office.distance} m away`);
          }
          console.log('');
        });
        
        if (offices.length > 3) {
          log.info(`... and ${offices.length - 3} more offices`);
        }
      } else {
        log.warning('No post offices found in the specified radius');
      }
    } catch (err: any) {
      log.error('Error searching nearest post offices');
      if (err?.response?.data) {
        log.data(`Server error: ${JSON.stringify(err.response.data, null, 2)}`);
      } else {
        log.data(`Error: ${err.message || err}`);
      }
    }
  } catch (error: any) {
    log.error('Unexpected error occurred');
    log.data(`Error: ${error.message || error}`);
  }
}

// Run the example
main().catch(console.error);

export { main }; 