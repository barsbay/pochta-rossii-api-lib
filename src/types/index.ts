/**
 * Configuration interface for PochtaRossiiApi
 */
export interface PochtaRossiiConfig {
  /** Authentication token */
  token: string;
  /** Authentication key */
  key: string;
  /** Optional base URL for API requests */
  baseUrl?: string;
}

/**
 * Interface representing a postal order
 */
export interface Order {
  /** Type of address (DEFAULT, PO_BOX, etc.) */
  addressTypeTo: string;
  /** Recipient's first name */
  givenName: string;
  /** Mail category (SIMPLE, ORDINARY, REGISTERED, WITH_DECLARED_VALUE) */
  mailCategory: 'SIMPLE' | 'ORDINARY' | 'REGISTERED' | 'WITH_DECLARED_VALUE';
  /** Type of mail (POSTAL_PARCEL, ONLINE_PARCEL, etc.) */
  mailType: 'POSTAL_PARCEL' | 'ONLINE_PARCEL' | 'ONLINE_COURIER' | 'EMS' | 'EMS_OPTIMAL' | 'LETTER' | 'BANDEROL';
  /** Weight in grams */
  mass: number;
  /** Unique order number */
  orderNum: string;
  /** Full recipient name */
  recipientName: string;
  /** Postal code as string */
  strIndexTo: string;
  /** Recipient's phone number */
  telAddress: string;
  /** Postal code as number */
  indexTo: number;
  /** Region/State */
  regionTo: string;
  /** City/Town */
  placeTo: string;
  /** Street name */
  streetTo: string;
  /** House number */
  houseTo: string;
  /** Room number (optional) */
  roomTo?: string;
  /** Building number (optional) */
  corpusTo?: string;
  /** Additional building info (optional) */
  buildingTo?: string;
  /** Hotel name (optional) */
  hotelTo?: string;
  /** Address type number (optional) */
  numAddressTypeTo?: string;
  /** Without mail rank flag (optional) */
  woMailRank?: boolean;
}

/**
 * Interface for tariff calculation request
 */
export interface TariffRequest {
  /** Sender's postal code */
  indexFrom: number;
  /** Recipient's postal code */
  indexTo: number;
  /** Mail category */
  mailCategory: 'SIMPLE' | 'ORDINARY' | 'REGISTERED' | 'WITH_DECLARED_VALUE';
  /** Type of mail */
  mailType: 'POSTAL_PARCEL' | 'ONLINE_PARCEL' | 'ONLINE_COURIER' | 'EMS' | 'EMS_OPTIMAL' | 'LETTER' | 'BANDEROL';
  /** Weight in grams */
  mass: number;
  /** Fragile flag */
  fragile: boolean;
  /** Order of notice flag */
  withOrderOfNotice: boolean;
  /** Simple notice flag */
  withSimpleNotice: boolean;
  /** Declared value flag */
  withDeclaredValue: boolean;
  /** Declared value amount */
  declaredValue: number;
}

/**
 * Interface for tariff calculation response
 */
export interface TariffResponse {
  /** Delivery time range in days */
  deliveryTime: {
    /** Minimum delivery time */
    min: number;
    /** Maximum delivery time */
    max: number;
  };
  /** Total rate amount */
  totalRate: number;
  /** VAT rate percentage */
  vatRate: number;
  /** Total VAT amount */
  totalVat: number;
}

/**
 * Interface for address/FIO/phone normalization request
 */
export interface NormalizationRequest {
  /** Unique identifier for the request */
  id: string;
  /** Original address to normalize (optional) */
  originalAddress?: string;
  /** Original FIO to normalize (optional) */
  originalFio?: string;
  /** Original phone to normalize (optional) */
  originalPhone?: string;
}

/**
 * Interface for address/FIO/phone normalization response
 */
export interface NormalizationResponse {
  /** Request identifier */
  id: string;
  /** Quality code of normalization */
  qualityCode: string;
  /** Original address (if provided) */
  originalAddress?: string;
  /** Normalized address details */
  normalizedAddress?: {
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
  originalFio?: string;
  /** Normalized FIO details */
  normalizedFio?: {
    /** First name */
    name: string;
    /** Last name */
    surname: string;
    /** Middle name */
    patronymic: string;
  };
  /** Original phone (if provided) */
  originalPhone?: string;
  /** Normalized phone number */
  normalizedPhone?: string;
}

/**
 * Interface representing a batch of orders
 */
export interface Batch {
  /** Batch name */
  batchName: string;
  /** Planned sending date (YYYY-MM-DD) */
  sendingDate: string;
  /** Postal office index */
  shipmentPointIndex: string;
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