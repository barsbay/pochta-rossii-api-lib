import axios, { AxiosInstance, AxiosError } from 'axios';
import { PochtaRossiiConfig, Order, TariffRequest, TariffResponse, NormalizationRequest, NormalizationResponse, Batch, ApiError, PostOfficeAddressRequest, PostOfficeIndexRequest, PostOfficeCoordinatesRequest, PostOffice, CountRequestResponse } from './types';

class PochtaRossiiApiError extends Error {
  public status?: number;
  public data?: any;
  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'PochtaRossiiApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Main class for interacting with Russian Post API
 * @class PochtaRossiiApi
 */
export class PochtaRossiiApi {
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;
  private readonly debug: boolean;

  /**
   * Creates an instance of PochtaRossiiApi
   * @param {PochtaRossiiConfig} config - Configuration object containing authentication details
   */
  constructor(config: PochtaRossiiConfig) {
    this.baseUrl = config.baseUrl || 'https://otpravka-api.pochta.ru';
    this.debug = process.env.DEBUG === 'true';
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': config.Authorization,
        'X-User-Authorization': `Basic ${config['X-User-Authorization']}`,
        'Accept-Encoding': 'gzip,deflate',
        'User-Agent': 'Apache-HttpClient/4.5.5 (Java/17.0.12)'
      }
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        if (this.debug) {
          console.log('🚀 Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            headers: {
              ...config.headers,
              'Authorization': config.headers.Authorization ? config.headers.Authorization : undefined,
              'X-User-Authorization': config.headers['X-User-Authorization'] ? '***' : undefined
            },
            data: config.data
          });
        }
        return config;
      },
      (error) => {
        if (this.debug) {
          console.error('❌ Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        if (this.debug) {
          console.log('✅ Response:', {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
          });
        }
        return response;
      },
      (error) => {
        if (this.debug) {
          console.error('❌ Response Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            headers: error.response?.headers,
            data: error.response?.data,
            message: error.message
          });
        }
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      const apiMessage = data?.errorCodes?.[0]?.description || error.message;
      throw new PochtaRossiiApiError(`API Error: ${apiMessage}`, status, data);
    }
    throw new PochtaRossiiApiError(error.message);
  }

  private validateOrder(order: Order) {
    if (!order['order-num'] || !order['given-name'] || !order['mail-category'] || !order['mail-type'] || !order.mass || !order['recipient-name'] || !order['str-index-to'] || !order['tel-address'] || !order['index-to'] || !order['region-to'] || !order['place-to'] || !order['street-to'] || !order['house-to']) {
      throw new PochtaRossiiApiError('Order validation failed: required fields are missing');
    }
  }

  private validateTariffRequest(request: TariffRequest) {
    if (!request['index-from'] || !request['index-to'] || !request['mail-category'] || !request['mail-type'] || !request.mass) {
      throw new PochtaRossiiApiError('TariffRequest validation failed: required fields are missing');
    }
  }

  private validateNormalizationRequest(request: NormalizationRequest) {
    if (!request.id || (!request['original-address'] && !request['original-fio'] && !request['original-phone'])) {
      throw new PochtaRossiiApiError('NormalizationRequest validation failed: id and at least one field (original-address, original-fio, original-phone) are required');
    }
  }

  private validateBatch(batch: Batch) {
    if (!batch['batch-name'] || !batch['sending-date'] || !batch['shipment-point-index']) {
      throw new PochtaRossiiApiError('Batch validation failed: required fields are missing');
    }
  }

  /**
   * Creates a new order
   * @param {Order} order - Order details
   * @returns {Promise<Order>} Created order
   */
  async createOrder(order: Order): Promise<Order> {
    this.validateOrder(order);
    try {
      const response = await this.client.put('/1.0/user/backlog', [order]);
      return response.data[0];
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Retrieves all orders
   * @returns {Promise<Order[]>} Array of orders
   */
  async getOrders(): Promise<Order[]> {
    try {
      const response = await this.client.get('/1.0/backlog');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Retrieves order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Order>} Order details
   */
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await this.client.get(`/1.0/backlog/${orderId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Deletes order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<void>}
   */
  async deleteOrder(orderId: string): Promise<void> {
    try {
      await this.client.delete(`/1.0/backlog/${orderId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Updates order by ID
   * @param {string} orderId - Order ID
   * @param {Order} order - Updated order details
   * @returns {Promise<Order>} Updated order
   */
  async updateOrder(orderId: string, order: Order): Promise<Order> {
    this.validateOrder(order);
    try {
      const response = await this.client.put(`/1.0/backlog/${orderId}`, order);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Moves order to backlog (shipment to backlog)
   * @param {string} orderId - Order ID
   * @returns {Promise<void>}
   */
  async moveOrderToBacklog(orderId: string): Promise<void> {
    try {
      await this.client.post(`/1.0/backlog/${orderId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Creates a new batch
   * @param {Batch} batch - Batch details
   * @returns {Promise<Batch>} Created batch
   */
  async createBatch(batch: Batch): Promise<Batch> {
    this.validateBatch(batch);
    try {
      const response = await this.client.post('/1.0/user/shipment', batch);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Retrieves all batches
   * @returns {Promise<Batch[]>} Array of batches
   */
  async getBatches(): Promise<Batch[]> {
    try {
      const response = await this.client.get('/1.0/shipment');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Searches batches by name
   * @param {string} batchName - Batch name to search for
   * @returns {Promise<Batch[]>} Array of matching batches
   */
  async searchBatchByName(batchName: string): Promise<Batch[]> {
    try {
      const response = await this.client.get(`/1.0/shipment/search?query=${batchName}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Updates batch sending date
   * @param {string} batchId - Batch ID
   * @param {string} sendingDate - New sending date (YYYY-MM-DD)
   * @returns {Promise<void>}
   */
  async updateBatchSendingDate(batchId: string, sendingDate: string): Promise<void> {
    try {
      await this.client.post(`/1.0/shipment/${batchId}/sending-date`, { 'sending-date': sendingDate });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Adds orders to batch
   * @param {string} batchId - Batch ID
   * @param {string[]} orderIds - Array of order IDs to add
   * @returns {Promise<void>}
   */
  async addOrdersToBatch(batchId: string, orderIds: string[]): Promise<void> {
    try {
      await this.client.post(`/1.0/shipment/${batchId}/orders`, orderIds);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Retrieves orders in batch
   * @param {string} batchId - Batch ID
   * @returns {Promise<Order[]>} Array of orders in batch
   */
  async getBatchOrders(batchId: string): Promise<Order[]> {
    try {
      const response = await this.client.get(`/1.0/shipment/${batchId}/orders`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Removes orders from batch
   * @param {string} batchId - Batch ID
   * @param {string[]} orderIds - Array of order IDs to remove
   * @returns {Promise<void>}
   */
  async removeOrdersFromBatch(batchId: string, orderIds: string[]): Promise<void> {
    try {
      await this.client.delete(`/1.0/shipment/${batchId}/orders`, { data: orderIds });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Calculates delivery tariff
   * @param {TariffRequest} request - Tariff calculation parameters
   * @returns {Promise<TariffResponse>} Calculated tariff details
   */
  async calculateTariff(request: TariffRequest): Promise<TariffResponse> {
    this.validateTariffRequest(request);
    try {
      const response = await this.client.post('/1.0/tariff', request);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Normalizes address
   * @param {NormalizationRequest} request - Address normalization request
   * @returns {Promise<NormalizationResponse>} Normalized address details
   */
  async normalizeAddress(request: NormalizationRequest): Promise<NormalizationResponse> {
    this.validateNormalizationRequest(request);
    try {
      const response = await this.client.post('/1.0/clean/address', [request]);
      return response.data[0];
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Normalizes FIO (Full Name)
   * @param {NormalizationRequest} request - FIO normalization request
   * @returns {Promise<NormalizationResponse>} Normalized FIO details
   */
  async normalizeFio(request: NormalizationRequest): Promise<NormalizationResponse> {
    this.validateNormalizationRequest(request);
    try {
      const response = await this.client.post('/1.0/clean/fio', [request]);
      return response.data[0];
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Normalizes phone number
   * @param {NormalizationRequest} request - Phone normalization request
   * @returns {Promise<NormalizationResponse>} Normalized phone details
   */
  async normalizePhone(request: NormalizationRequest): Promise<NormalizationResponse> {
    this.validateNormalizationRequest(request);
    try {
      const response = await this.client.post('/1.0/clean/phone', [request]);
      return response.data[0];
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Generates all documents for batch
   * @param {string} batchId - Batch ID
   * @returns {Promise<Buffer>} ZIP archive with all documents
   */
  async generateDocuments(batchId: string): Promise<Buffer> {
    try {
      const response = await this.client.get(`/1.0/forms/${batchId}/zip-all`, {
        responseType: 'arraybuffer'
      });
      return Buffer.from(response.data);
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Generates F103 form
   * @param {string} batchId - Batch ID
   * @param {'PAPER' | 'ELECTRONIC'} printType - Form type (default: 'PAPER')
   * @returns {Promise<Buffer>} Generated form as PDF
   */
  async generateF103(batchId: string, printType: 'PAPER' | 'ELECTRONIC' = 'PAPER'): Promise<Buffer> {
    try {
      const response = await this.client.get(`/1.0/forms/${batchId}/f103?print-type=${printType}`, {
        responseType: 'arraybuffer'
      });
      return Buffer.from(response.data);
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Generates F7p form
   * @param {string} batchId - Batch ID
   * @returns {Promise<Buffer>} Generated form as PDF
   */
  async generateF7p(batchId: string): Promise<Buffer> {
    try {
      const response = await this.client.get(`/1.0/forms/${batchId}/f7p`, {
        responseType: 'arraybuffer'
      });
      return Buffer.from(response.data);
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Generates F112 form
   * @param {string} batchId - Batch ID
   * @returns {Promise<Buffer>} Generated form as PDF
   */
  async generateF112(batchId: string): Promise<Buffer> {
    try {
      const response = await this.client.get(`/1.0/forms/${batchId}/f112`, {
        responseType: 'arraybuffer'
      });
      return Buffer.from(response.data);
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }

  /**
   * Search post offices by address
   * @param {PostOfficeAddressRequest} request - Address search parameters
   * @returns {Promise<PostOffice[]>} Array of post offices
   */
  async searchPostOfficesByAddress(request: PostOfficeAddressRequest): Promise<PostOffice[]> {
    try {
      const response = await this.client.get('/postoffice/1.0/by-address', {
        params: {
          address: request.address,
          top: request.top || 10
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
    return [];
  }

  /**
   * Search post offices by postal index
   * @param {PostOfficeIndexRequest} request - Index search parameters
   * @returns {Promise<PostOffice[]>} Array of post offices
   */
  async searchPostOfficesByIndex(request: PostOfficeIndexRequest): Promise<PostOffice[]> {
    try {
      const response = await this.client.get(`/postoffice/1.0/${request.index}`);
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      this.handleError(error);
    }
    return [];
  }

  /**
   * Search post offices by coordinates
   * @param {PostOfficeCoordinatesRequest} request - Coordinates search parameters
   * @returns {Promise<PostOffice[]>} Array of post offices
   */
  async searchPostOfficesByCoordinates(request: PostOfficeCoordinatesRequest): Promise<PostOffice[]> {
    try {
      const response = await this.client.get('/postoffice/1.0/nearby', {
        params: {
          latitude: request.latitude,
          longitude: request.longitude,
          radius: request.radius || 1000,
          filter: request.filter || 'ALL'
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
    return [];
  }

  /**
   * Get all post offices (with optional filters)
   * @param {number} top - Maximum number of results (default: 100)
   * @returns {Promise<PostOffice[]>} Array of post offices
   */
  async getAllPostOffices(top: number = 100): Promise<PostOffice[]> {
    try {
      const response = await this.client.get('/1.0/postoffice', {
        params: { top }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
    return [];
  }

  /**
   * Get API request count statistics
   * @returns {Promise<CountRequestResponse>} Request count information
   */
  async countRequest(): Promise<CountRequestResponse> {
    try {
      const response = await this.client.get('/1.0/counter');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
    return undefined as any;
  }
}

export * from './types'; 