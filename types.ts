
export type TemplateType = 'cert1' | 'cert2' | 'id_card';

export interface TextItem {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  isBold: boolean;
  isLocked: boolean;
  width: number;
  lineHeight: number;
  isVisible?: boolean;
}

export interface PhotoItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isLocked: boolean;
  imageData?: string;
  objectFit: 'cover' | 'contain' | 'fill';
  borderRadius: number;
  imageScale: number;
  imageOffsetX: number;
  imageOffsetY: number;
}

export interface CertificateData {
  memberName: string;
  memberPost: string;
  issueDate: string;
  accentColor: string; // Shared color for Name and Post
  mainTextColor: string;
  validityText: string;
  isValidityEnabled: boolean;
  phoneNumber: string;
  bloodGroup: string;
}

export interface SideLayout {
  textItems: TextItem[];
  photo: PhotoItem;
  canvasWidth: number;
  canvasHeight: number;
  backgroundImage: string;
}

export interface FullLayout {
  sides: SideLayout[];
}
