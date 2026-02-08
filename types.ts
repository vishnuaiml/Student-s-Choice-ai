
export enum Category {
  OC = 'OC',
  BC = 'BC',
  BCM = 'BCM',
  MBC = 'MBC',
  SC = 'SC',
  SCA = 'SCA',
  ST = 'ST'
}

export enum Quota {
  GENERAL = 'General',
  GOVT_SCHOOL_7_5 = '7.5% Govt School Reservation',
  SPORTS = 'Sports',
  EX_SERVICEMEN = 'Ex-Servicemen',
  DIFFERENTLY_ABLED = 'Differently Abled'
}

export interface StudentData {
  cutoff: number;
  category: Category;
  quota: Quota;
  preferredCourse: string;
  district?: string;
  targetYear: number;
}

export interface CollegePrediction {
  collegeName: string;
  collegeCode: string;
  course: string;
  lastYearCutoff: number; // Previous year data
  expectedCutoff: number; // Target year prediction
  probability: number; // 0 to 100
  tier: 'Safe' | 'Moderate' | 'Reach';
  location: string;
  officialLink?: string;
}

export interface PredictionResult {
  predictions: CollegePrediction[];
  insights: string;
  sources: { title: string; uri: string }[];
}