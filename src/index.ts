import axios, { AxiosInstance } from 'axios';
import { PochtaRossiiConfig, Order, TariffRequest, TariffResponse, NormalizationRequest, NormalizationResponse, Batch, ApiError } from './types';

/**
 * Main class for interacting with Russian Post API
 * @class PochtaRossiiApi
 */
export class PochtaRossiiApi {
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;

  /**
   * Creates an instance of PochtaRossiiApi
   * @param {PochtaRossiiConfig} config - Configuration object containing authentication details
   */
  constructor(config: PochtaRossiiConfig) {
    this.baseUrl = config.baseUrl || 'https://otpravka-api.pochta.ru';
    this.client = axios.create({
      baseURL: this.baseUrl,
      auth: {
        username: `AccessToken ${config.token}`,
        password: config.key
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Creates a new order
   * @param {Order} order - Order details
   * @returns {Promise<Order>} Created order
   */
  async createOrder(order: Order): Promise<Order> {
    const response = await this.client.put('/1.0/user/backlog', [order]);
    return response.data[0];
  }

  /**
   * Retrieves all orders
   * @returns {Promise<Order[]>} Array of orders
   */
  async getOrders(): Promise<Order[]> {
    const response = await this.client.get('/1.0/backlog');
    return response.data;
  }

  /**
   * Retrieves order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Order>} Order details
   */
  async getOrderById(orderId: string): Promise<Order> {
    const response = await this.client.get(`/1.0/backlog/${orderId}`);
    return response.data;
  }

  /**
   * Deletes order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<void>}
   */
  async deleteOrder(orderId: string): Promise<void> {
    await this.client.delete(`/1.0/backlog/${orderId}`);
  }

  /**
   * Creates a new batch
   * @param {Batch} batch - Batch details
   * @returns {Promise<Batch>} Created batch
   */
  async createBatch(batch: Batch): Promise<Batch> {
    const response = await this.client.post('/1.0/user/shipment', batch);
    return response.data;
  }

  /**
   * Retrieves all batches
   * @returns {Promise<Batch[]>} Array of batches
   */
  async getBatches(): Promise<Batch[]> {
    const response = await this.client.get('/1.0/shipment');
    return response.data;
  }

  /**
   * Searches batches by name
   * @param {string} batchName - Batch name to search for
   * @returns {Promise<Batch[]>} Array of matching batches
   */
  async searchBatchByName(batchName: string): Promise<Batch[]> {
    const response = await this.client.get(`/1.0/shipment/search?query=${batchName}`);
    return response.data;
  }

  /**
   * Updates batch sending date
   * @param {string} batchId - Batch ID
   * @param {string} sendingDate - New sending date (YYYY-MM-DD)
   * @returns {Promise<void>}
   */
  async updateBatchSendingDate(batchId: string, sendingDate: string): Promise<void> {
    await this.client.post(`/1.0/shipment/${batchId}/sending-date`, { sendingDate });
  }

  /**
   * Adds orders to batch
   * @param {string} batchId - Batch ID
   * @param {string[]} orderIds - Array of order IDs to add
   * @returns {Promise<void>}
   */
  async addOrdersToBatch(batchId: string, orderIds: string[]): Promise<void> {
    await this.client.post(`/1.0/shipment/${batchId}/orders`, orderIds);
  }

  /**
   * Retrieves orders in batch
   * @param {string} batchId - Batch ID
   * @returns {Promise<Order[]>} Array of orders in batch
   */
  async getBatchOrders(batchId: string): Promise<Order[]> {
    const response = await this.client.get(`/1.0/shipment/${batchId}/orders`);
    return response.data;
  }

  /**
   * Removes orders from batch
   * @param {string} batchId - Batch ID
   * @param {string[]} orderIds - Array of order IDs to remove
   * @returns {Promise<void>}
   */
  async removeOrdersFromBatch(batchId: string, orderIds: string[]): Promise<void> {
    await this.client.delete(`/1.0/shipment/${batchId}/orders`, { data: orderIds });
  }

  /**
   * Calculates delivery tariff
   * @param {TariffRequest} request - Tariff calculation parameters
   * @returns {Promise<TariffResponse>} Calculated tariff details
   */
  async calculateTariff(request: TariffRequest): Promise<TariffResponse> {
    const response = await this.client.post('/1.0/tariff', request);
    return response.data;
  }

  /**
   * Normalizes address
   * @param {NormalizationRequest} request - Address normalization request
   * @returns {Promise<NormalizationResponse>} Normalized address details
   */
  async normalizeAddress(request: NormalizationRequest): Promise<NormalizationResponse> {
    const response = await this.client.post('/1.0/clean/address', [request]);
    return response.data[0];
  }

  /**
   * Normalizes FIO (Full Name)
   * @param {NormalizationRequest} request - FIO normalization request
   * @returns {Promise<NormalizationResponse>} Normalized FIO details
   */
  async normalizeFio(request: NormalizationRequest): Promise<NormalizationResponse> {
    const response = await this.client.post('/1.0/clean/fio', [request]);
    return response.data[0];
  }

  /**
   * Normalizes phone number
   * @param {NormalizationRequest} request - Phone normalization request
   * @returns {Promise<NormalizationResponse>} Normalized phone details
   */
  async normalizePhone(request: NormalizationRequest): Promise<NormalizationResponse> {
    const response = await this.client.post('/1.0/clean/phone', [request]);
    return response.data[0];
  }

  /**
   * Generates all documents for batch
   * @param {string} batchId - Batch ID
   * @returns {Promise<Buffer>} ZIP archive with all documents
   */
  async generateDocuments(batchId: string): Promise<Buffer> {
    const response = await this.client.get(`/1.0/forms/${batchId}/zip-all`, {
      responseType: 'arraybuffer'
    });
    return Buffer.from(response.data);
  }

  /**
   * Generates F103 form
   * @param {string} batchId - Batch ID
   * @param {'PAPER' | 'ELECTRONIC'} printType - Form type (default: 'PAPER')
   * @returns {Promise<Buffer>} Generated form as PDF
   */
  async generateF103(batchId: string, printType: 'PAPER' | 'ELECTRONIC' = 'PAPER'): Promise<Buffer> {
    const response = await this.client.get(`/1.0/forms/${batchId}/f103?print-type=${printType}`, {
      responseType: 'arraybuffer'
    });
    return Buffer.from(response.data);
  }

  /**
   * Generates F7p form
   * @param {string} batchId - Batch ID
   * @returns {Promise<Buffer>} Generated form as PDF
   */
  async generateF7p(batchId: string): Promise<Buffer> {
    const response = await this.client.get(`/1.0/forms/${batchId}/f7p`, {
      responseType: 'arraybuffer'
    });
    return Buffer.from(response.data);
  }

  /**
   * Generates F112 form
   * @param {string} batchId - Batch ID
   * @returns {Promise<Buffer>} Generated form as PDF
   */
  async generateF112(batchId: string): Promise<Buffer> {
    const response = await this.client.get(`/1.0/forms/${batchId}/f112`, {
      responseType: 'arraybuffer'
    });
    return Buffer.from(response.data);
  }
}

export * from './types'; 