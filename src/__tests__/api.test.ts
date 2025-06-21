import { PochtaRossiiApi } from '../index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

/**
 * Test suite for PochtaRossiiApi class
 */
describe('PochtaRossiiApi', () => {
  let api: PochtaRossiiApi;
  let mockAxiosInstance: any;

  /**
   * Setup before each test
   */
  beforeEach(() => {
    mockAxiosInstance = {
      put: jest.fn(),
      post: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    api = new PochtaRossiiApi({
      Authorization: 'test-token',
      'X-User-Authorization': 'test-key'
    });
  });

  /**
   * Test suite for order creation functionality
   */
  describe('createOrder', () => {
    /**
     * Test successful order creation
     */
    it('should create an order successfully', async () => {
      const mockOrder = {
        'order-num': '12345',
        'address-type-to': 'DEFAULT',
        'given-name': 'Иван',
        'mail-category': 'ORDINARY' as const,
        'mail-type': 'POSTAL_PARCEL' as const,
        mass: 1000,
        'recipient-name': 'Иванов Иван Иванович',
        'str-index-to': '101000',
        'tel-address': '+79001234567',
        'index-to': 101000,
        'region-to': 'Москва',
        'place-to': 'Москва',
        'street-to': 'Красная площадь',
        'house-to': '1'
      };

      mockAxiosInstance.put.mockResolvedValue({ data: [mockOrder] });

      const result = await api.createOrder(mockOrder);
      expect(result).toEqual(mockOrder);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/1.0/user/backlog', [mockOrder]);
    });
  });

  /**
   * Test suite for tariff calculation functionality
   */
  describe('calculateTariff', () => {
    /**
     * Test successful tariff calculation
     */
    it('should calculate tariff successfully', async () => {
      const mockTariffRequest = {
        'index-from': 101000,
        'index-to': 190000,
        'mail-category': 'ORDINARY' as const,
        'mail-type': 'POSTAL_PARCEL' as const,
        mass: 1000,
        fragile: false,
        'with-order-of-notice': false,
        'with-simple-notice': false,
        'with-declared-value': false,
        'declared-value': 0
      };

      const mockTariffResponse = {
        'delivery-time': {
          min: 2,
          max: 5
        },
        'total-rate': 300,
        'vat-rate': 20,
        'total-vat': 60
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockTariffResponse });

      const result = await api.calculateTariff(mockTariffRequest);
      expect(result).toEqual(mockTariffResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/1.0/tariff', mockTariffRequest);
    });
  });

  /**
   * Test suite for address normalization functionality
   */
  describe('normalizeAddress', () => {
    /**
     * Test successful address normalization
     */
    it('should normalize address successfully', async () => {
      const mockRequest = {
        id: '1',
        'original-address': 'Москва, Красная площадь, 1'
      };

      const mockResponse = {
        id: '1',
        'quality-code': 'GOOD',
        'normalized-address': {
          index: '101000',
          region: 'Москва',
          area: '',
          place: 'Москва',
          location: '',
          street: 'Красная площадь',
          house: '1',
          building: '',
          corpus: '',
          room: ''
        }
      };

      mockAxiosInstance.post.mockResolvedValue({ data: [mockResponse] });

      const result = await api.normalizeAddress(mockRequest);
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/1.0/clean/address', [mockRequest]);
    });
  });
}); 