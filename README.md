# Russian Post API Library

A TypeScript library for interacting with the Russian Post API (otpravka.pochta.ru). This library provides a simple and type-safe way to work with the Russian Post delivery service.

## Features

- 📦 Create and manage postal orders
- 📊 Calculate delivery tariffs
- 📝 Generate shipping documents
- 📮 Work with shipping batches
- 🏠 Address normalization
- 📱 Phone number normalization
- 👤 FIO (Full Name) normalization
- 🔍 Search in archive
- 📋 Get post office information

## Installation

```bash
npm install pochta-rossii-api-lib
```

## Quick Start

```typescript
import { PochtaRossiiApi } from 'pochta-rossii-api-lib';

// Initialize the API client
const api = new PochtaRossiiApi({
  token: 'YOUR_TOKEN',
  key: 'YOUR_KEY'
});

// Create an order
const order = await api.createOrder({
  addressTypeTo: 'DEFAULT',
  givenName: 'John',
  mailCategory: 'ORDINARY',
  mailType: 'POSTAL_PARCEL',
  mass: 1000,
  orderNum: '12345',
  recipientName: 'John Doe',
  strIndexTo: '101000',
  telAddress: '+79001234567',
  indexTo: 101000,
  regionTo: 'Moscow',
  placeTo: 'Moscow',
  streetTo: 'Red Square',
  houseTo: '1'
});

// Calculate delivery tariff
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
```

## API Documentation

### Authentication

To use the library, you need to:
1. Register at https://otpravka.pochta.ru/
2. Get your authentication token
3. Generate your authentication key

**Important Note About Access Token:**
When using the access token in API requests, you must always prefix it with "AccessToken". For example:
- If your token is `sDBaa9XNfFargSyQ8KIEM40GB_ndPmLu`
- You should use it as `AccessToken sDBaa9XNfFargSyQ8KIEM40GB_ndPmLu`

The library handles this automatically, but it's important to be aware of this requirement when working with the API directly.

### Main Features

#### Orders
- Create orders
- Get order information
- Delete orders
- Search orders

#### Batches
- Create shipping batches
- Add orders to batches
- Remove orders from batches
- Generate shipping documents

#### Tariffs
- Calculate delivery costs
- Get delivery time estimates

#### Address Normalization
- Normalize addresses
- Normalize phone numbers
- Normalize FIO (Full Names)

## Examples

### Creating a Batch and Generating Documents

```typescript
// Create a batch
const batch = await api.createBatch({
  batchName: 'Batch #1',
  sendingDate: '2024-01-15',
  shipmentPointIndex: '101000'
});

// Add orders to batch
await api.addOrdersToBatch(batch.batchName, [order.orderNum]);

// Generate documents
const documents = await api.generateDocuments(batch.batchName);
```

### Address Normalization

```typescript
const normalizedAddress = await api.normalizeAddress({
  id: '1',
  originalAddress: 'Moscow, Red Square, 1'
});
```

## Development

### Prerequisites
- Node.js 14+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

If you encounter any issues or have questions, please open an issue in the GitHub repository. 