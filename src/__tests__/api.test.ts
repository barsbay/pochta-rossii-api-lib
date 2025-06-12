import { PochtaRossiiApi } from '../index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

/**
 * Test suite for PochtaRossiiApi class
 */
describe('PochtaRossiiApi', () => {
  let api: PochtaRossiiApi;

  /**
   * Setup before each test
   */
  beforeEach(() => {
    api = new PochtaRossiiApi({
      token: 'test-token',
      key: 'test-key'
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
        orderNum: '12345',
        addressTypeTo: 'DEFAULT',
        givenName: 'Иван',
        mailCategory: 'ORDINARY' as const,
        mailType: 'POSTAL_PARCEL' as const,
        mass: 1000,
        recipientName: 'Иванов Иван Иванович',
        strIndexTo: '101000',
        telAddress: '+79001234567',
        indexTo: 101000,
        regionTo: 'Москва',
        placeTo: 'Москва',
        streetTo: 'Красная площадь',
        houseTo: '1'
      };

      mockedAxios.create.mockReturnValue({
        put: jest.fn().mockResolvedValue({ data: [mockOrder] })
      } as any);

      const result = await api.createOrder(mockOrder);
      expect(result).toEqual(mockOrder);
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
        indexFrom: 101000,
        indexTo: 190000,
        mailCategory: 'ORDINARY' as const,
        mailType: 'POSTAL_PARCEL' as const,
        mass: 1000,
        fragile: false,
        withOrderOfNotice: false,
        withSimpleNotice: false,
        withDeclaredValue: false,
        declaredValue: 0
      };

      const mockTariffResponse = {
        deliveryTime: {
          min: 2,
          max: 5
        },
        totalRate: 300,
        vatRate: 20,
        totalVat: 60
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({ data: mockTariffResponse })
      } as any);

      const result = await api.calculateTariff(mockTariffRequest);
      expect(result).toEqual(mockTariffResponse);
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
        originalAddress: 'Москва, Красная площадь, 1'
      };

      const mockResponse = {
        id: '1',
        qualityCode: 'GOOD',
        normalizedAddress: {
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

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({ data: [mockResponse] })
      } as any);

      const result = await api.normalizeAddress(mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });
}); 