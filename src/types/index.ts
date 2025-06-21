/**
 * Configuration interface for PochtaRossiiApi
 */
export interface PochtaRossiiConfig {
  /** Authentication token (Authorization header) */
  Authorization: string;
  /** Ready-to-use X-User-Authorization header (e.g. 'Basic ...') */
  'X-User-Authorization': string;
  /** Optional base URL for API requests */
  baseUrl?: string;
}

/**
 * Interface representing a postal order
 */
export interface Order {
  /** Type of address (DEFAULT, PO_BOX, etc.) */
  'address-type-to': string;
  /** Recipient's first name */
  'given-name': string;
  /** Mail category (SIMPLE, ORDINARY, REGISTERED, WITH_DECLARED_VALUE) */
  'mail-category': 'SIMPLE' | 'ORDINARY' | 'REGISTERED' | 'WITH_DECLARED_VALUE';
  /** Type of mail (POSTAL_PARCEL, ONLINE_PARCEL, etc.) */
  'mail-type': 'POSTAL_PARCEL' | 'ONLINE_PARCEL' | 'ONLINE_COURIER' | 'EMS' | 'EMS_OPTIMAL' | 'LETTER' | 'BANDEROL';
  /** Weight in grams */
  mass: number;
  /** Unique order number */
  'order-num': string;
  /** Full recipient name */
  'recipient-name': string;
  /** Postal code as string */
  'str-index-to': string;
  /** Recipient's phone number */
  'tel-address': string;
  /** Postal code as number */
  'index-to': number;
  /** Region/State */
  'region-to': string;
  /** Area (optional) */
  'area-to'?: string;
  /** City/Town */
  'place-to': string;
  /** Location (optional) */
  'location-to'?: string;
  /** Street name */
  'street-to': string;
  /** House number */
  'house-to': string;
  /** Room number (optional) */
  'room-to'?: string;
  /** Building number (optional) */
  'corpus-to'?: string;
  /** Additional building info (optional) */
  'building-to'?: string;
  /** Hotel name (optional) */
  'hotel-to'?: string;
  /** Address type number (optional) */
  'num-address-type-to'?: string;
  /** Without mail rank flag (optional) */
  'wo-mail-rank'?: boolean;
  /** Declared value (optional) */
  'declared-value'?: number;
  /** Fragile flag (optional) */
  fragile?: boolean;
  /** Order of notice flag (optional) */
  'with-order-of-notice'?: boolean;
  /** Simple notice flag (optional) */
  'with-simple-notice'?: boolean;
  /** Declared value flag (optional) */
  'with-declared-value'?: boolean;
  /** Sender's postal code (optional) */
  'index-from'?: number;
  /** Sender's region (optional) */
  'region-from'?: string;
  /** Sender's city (optional) */
  'place-from'?: string;
  /** Sender's street (optional) */
  'street-from'?: string;
  /** Sender's house (optional) */
  'house-from'?: string;
  /** Sender's building (optional) */
  'building-from'?: string;
  /** Sender's corpus (optional) */
  'corpus-from'?: string;
  /** Sender's room (optional) */
  'room-from'?: string;
  /** Sender's name (optional) */
  'sender-name'?: string;
  /** Sender's phone (optional) */
  'sender-phone'?: string;
}

/**
 * Interface for tariff calculation request
 */
export interface TariffRequest {
  /** Sender's postal code */
  'index-from': number;
  /** Recipient's postal code */
  'index-to': number;
  /** Mail category */
  'mail-category': 'SIMPLE' | 'ORDINARY' | 'REGISTERED' | 'WITH_DECLARED_VALUE' | 'ORDERED';
  /** Type of mail */
  'mail-type': 'POSTAL_PARCEL' | 'ONLINE_PARCEL' | 'ONLINE_COURIER' | 'EMS' | 'EMS_OPTIMAL' | 'LETTER' | 'BANDEROL';
  /** Weight in grams */
  mass: number;
  /** Fragile flag */
  fragile: boolean;
  /** Order of notice flag */
  'with-order-of-notice': boolean;
  /** Simple notice flag */
  'with-simple-notice': boolean;
  /** Declared value flag */
  'with-declared-value': boolean;
  /** Declared value amount */
  'declared-value': number;
}

/**
 * Interface for tariff calculation response
 */
export interface TariffResponse {
  /** Delivery time range in days */
  'delivery-time': {
    /** Minimum delivery time */
    min: number;
    /** Maximum delivery time */
    max: number;
  };
  /** Total rate amount (in kopecks) */
  'total-rate': number;
  /** VAT rate percentage */
  'vat-rate': number;
  /** Total VAT amount (in kopecks) */
  'total-vat': number;
  /** Weight in grams */
  weight: number;
  /** Delivery cost (in kopecks) */
  'delivery-cost': number;
  /** Insurance cost (in kopecks) */
  'insurance-cost': number;
  /** Notice cost (in kopecks) */
  'notice-cost': number;
  /** Total cost (in kopecks) */
  'total-cost': number;
}

/**
 * Interface for address/FIO/phone normalization request
 */
export interface NormalizationRequest {
  /** Unique identifier for the request */
  id: string;
  /** Original address to normalize (optional) */
  'original-address'?: string;
  /** Original FIO to normalize (optional) */
  'original-fio'?: string;
  /** Original phone to normalize (optional) */
  'original-phone'?: string;
}

/**
 * Interface for address/FIO/phone normalization response
 */
export interface NormalizationResponse {
  /** Request identifier */
  id: string;
  /** Quality code of normalization */
  'quality-code': string;
  /** Original address (if provided) */
  'original-address'?: string;
  /** Normalized address details */
  'normalized-address'?: {
    /** Postal code */
    index: string;
    /** Region/State */
    region: string;
    /** Area */
    area: string;
    /** City/Town */
    place: string;
    /** Location */
    location: string;
    /** Street name */
    street: string;
    /** House number */
    house: string;
    /** Building number */
    building: string;
    /** Corpus number */
    corpus: string;
    /** Room number */
    room: string;
  };
  /** Original FIO (if provided) */
  'original-fio'?: string;
  /** Normalized FIO details */
  'normalized-fio'?: {
    /** First name */
    name: string;
    /** Last name */
    surname: string;
    /** Middle name */
    patronymic: string;
  };
  /** Original phone (if provided) */
  'original-phone'?: string;
  /** Normalized phone number */
  'normalized-phone'?: string;
}

/**
 * Interface representing a batch of orders
 */
export interface Batch {
  /** Batch name */
  'batch-name': string;
  /** Planned sending date (YYYY-MM-DD) */
  'sending-date': string;
  /** Postal office index */
  'shipment-point-index': string;
  /** Optional batch description */
  description?: string;
  /** Optional batch notes */
  notes?: string;
}

/**
 * Interface for API error response
 */
export interface ApiError {
  /** Array of error codes and descriptions */
  errorCodes: Array<{
    /** Error code */
    errorCode: string;
    /** Error description */
    description: string;
  }>;
}

/**
 * Interface for post office search by address request
 */
export interface PostOfficeAddressRequest {
  /** Address to search for */
  address: string;
  /** Maximum number of results (optional) */
  top?: number;
}

/**
 * Interface for post office search by index request
 */
export interface PostOfficeIndexRequest {
  /** Postal index to search for */
  index: string;
}

/**
 * Interface for post office search by coordinates request
 */
export interface PostOfficeCoordinatesRequest {
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
  /** Search radius in meters (optional) */
  radius?: number;
  /** Filter type (optional) */
  filter?: string;
}

/**
 * Interface representing a post office
 */
export interface PostOffice {
  /** Post office address source */
  'address-source'?: string;
  /** Distance from search point in meters */
  distance?: number;
  /** Is closed flag */
  'is-closed'?: boolean;
  /** Is private category flag */
  'is-private-category'?: boolean;
  /** Is temporarily closed flag */
  'is-temporary-closed'?: boolean;
  /** Latitude coordinate */
  latitude?: number;
  /** Longitude coordinate */
  longitude?: number;
  /** Postal code */
  'postal-code'?: string;
  /** Region */
  region?: string;
  /** Settlement */
  settlement?: string;
  /** Type code */
  'type-code'?: string;
  /** Type ID */
  'type-id'?: number;
  /** Working hours */
  'working-hours'?: Array<{
    /** Day of week */
    day: number;
    /** Working hours string */
    hours: string;
  }>;
  /** Works on Saturdays flag */
  'works-on-saturdays'?: boolean;
  /** Works on Sundays flag */
  'works-on-sundays'?: boolean;
  /** Phone numbers */
  phones?: Array<{
    /** Phone number */
    number: string;
    /** Phone type */
    type: string;
  }>;
  /** Service groups */
  'service-groups'?: Array<{
    /** Service group name */
    name: string;
    /** Service group code */
    code: string;
  }>;
  
  // Legacy fields for backward compatibility
  /** Post office name (legacy) */
  name?: string;
  /** Post office address (legacy) */
  address?: string;
  /** Postal index (legacy) */
  index?: string;
  /** Phone number (legacy) */
  phone?: string;
  /** Working hours (legacy) */
  workHours?: string;
  /** Post office type (legacy) */
  type?: string;
  /** City (legacy) */
  city?: string;
  /** Street (legacy) */
  street?: string;
  /** House number (legacy) */
  house?: string;
  /** Building number (legacy) */
  building?: string;
  /** Corpus number (legacy) */
  corpus?: string;
  /** Room number (legacy) */
  room?: string;
}

/**
 * Interface for API request count response
 */
export interface CountRequestResponse {
  /** Total number of requests */
  total: number;
  /** Number of requests in current period */
  current: number;
  /** Request limit */
  limit: number;
  /** Period start date */
  periodStart?: string;
  /** Period end date */
  periodEnd?: string;
} 