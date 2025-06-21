import { PochtaRossiiApi } from '../src';

/**
 * Example of using PochtaRossiiApi
 * Demonstrates basic operations with orders, tariffs, and batches
 */
async function main() {
  // Initialize API client
  const api = new PochtaRossiiApi({
    Authorization: 'YOUR_TOKEN',
    'X-User-Authorization': 'YOUR_BASE64',
  });

  try {
    // Example: Create an order
    const order = await api.createOrder({
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

    console.log('Created order:', order);

    // Example: Calculate delivery tariff
    const tariff = await api.calculateTariff({
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
    console.log('Tariff:', tariff);

    // Example: Normalize address
    const normalizedAddress = await api.normalizeAddress({
      id: '1',
      originalAddress: 'Москва, Красная площадь, 1'
    });

    console.log('Normalized address:', normalizedAddress);

    // Example: Create a batch
    const batch = await api.createBatch({
      batchName: 'Партия №1',
      sendingDate: '2024-01-15',
      shipmentPointIndex: '101000'
    });

    console.log('Created batch:', batch);

    // Add order to batch
    await api.addOrdersToBatch(batch.batchName, [order.orderNum]);

    // Generate documents
    const documents = await api.generateDocuments(batch.batchName);
    console.log('Documents package size:', documents.length, 'bytes');

  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 