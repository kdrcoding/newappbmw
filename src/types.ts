export type HeadunitType = 
  | 'HU_NBT2'      // NBTevo (ID4/ID5/ID6)
  | 'HU_MGU'       // MGU ID7 Live Cockpit
  | 'HU_ENTRYNAV2' // ENTRYNAV2 WAY/ROUTE
  | 'HU_NBT'       // NBT ID3
  | 'HU_CIC';      // CIC Legacy

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'flashing' | 'error';

export interface VehicleData {
  vin: string;
  model: string;
  chassisCode: string; // F30, F80, F90, G20, G30
  year: number;
  headunitType: HeadunitType;
  headunitName: string;
  iStepCurrent: string;
  iStepTarget: string;
  ipAddress: string;
  doipPort: number;
  interfaceType: 'enet_cable' | 'enet_wifi' | 'enet_modem';
  voltage: number;
  ecuAddress: string; // 0x63, 0x60
  wifiMac: string;
  fscStoreStatusCount: {
    total: number;
    approved: number;
    loaded: number;
    cancelled: number;
  };
}

export interface FSCFeature {
  id: string;
  featureCode: string; // e.g. "00E5", "0143", "00F0", "009C"
  appId: string;       // e.g. "0x00E5"
  upgradeIndex: string; // "0x0001"
  title: string;
  category: 'CarPlay & Auto' | 'Multimedia & Video' | 'Navigation & Maps' | 'Performance & Gauges' | 'Connectivity & Voice';
  description: string;
  requiredHeadunit: HeadunitType[];
  minIStep?: string;
  iconName: string;
  isUnlocked: boolean;
  isSelected: boolean;
  fdlParameters: { parameter: string; current: string; unlockValue: string; description: string }[];
  fscHexPayload?: string;
}

export interface FSCStatusItem {
  appId: string;
  name: string;
  status: 'Approved (02)' | 'Loaded (01)' | 'Cancelled (03)' | 'Not Loaded (00)' | 'Rejected (04)';
  valid: boolean;
  featureCode: string;
}

export interface DiagnosticDTC {
  code: string;
  ecu: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'Stored' | 'Active' | 'Passive';
}

export interface FlashingProgressStep {
  stepNumber: number;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  details: string;
  hexDump?: string;
  progressPercent: number;
}

export interface DoIPPacket {
  id: string;
  timestamp: string;
  direction: 'TX' | 'RX';
  channel: string; // 'DoIP Port 13400'
  headerHex: string;
  payloadHex: string;
  decodedMsg: string;
}

export interface IDriveScreenState {
  activeView: 'home' | 'carplay' | 'android_auto' | 'navigation' | 'sport_gauges' | 'vim_player' | 'settings';
  carPlayMode: 'fullscreen' | 'standard';
  isCarPlayUnlocked: boolean;
  isVimUnlocked: boolean;
  isAndroidAutoUnlocked: boolean;
  isMLaptimerUnlocked: boolean;
  isMap3DUnlocked: boolean;
  isSliUnlocked: boolean;
  mediaTrackPlaying?: string;
  vehicleSpeed: number; // km/h
}

export interface FSCPackageInfo {
  vin: string;
  featureCode: string;
  featureName: string;
  appId: string;
  upgradeIndex: string;
  creationDate: string;
  hexPayload: string;
  base64Cert: string;
  signature: string;
  fileContent: string;
}
