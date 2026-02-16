
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
  highlightColor: string;
  validityText: string;
  isValidityEnabled: boolean;
}
