
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Download, 
  User, 
  Lock, 
  Unlock, 
  Image as ImageIcon, 
  Settings,
  Save,
  ShieldCheck,
  Menu,
  X,
  FileJson,
  Award,
  CreditCard,
  Eye,
  EyeOff,
  LogOut,
  Palette,
  Plus
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { TextItem, PhotoItem, CertificateData, TemplateType, FullLayout } from './types';
import './styles.css';

const STORAGE_KEY_PREFIX = 'krv_studio_v21';

const TEMPLATE_URLS = {
  cert1: 'https://raw.githubusercontent.com/harishmerwade/KRV/b9f76749d456c87a092ffdf8b9ffae6986ac435f/Img/temp%201.png',
  cert2: 'https://raw.githubusercontent.com/harishmerwade/KRV/b9f76749d456c87a092ffdf8b9ffae6986ac435f/Img/temp%202.png',
  id_front: 'https://raw.githubusercontent.com/harishmerwade/KRV/478b190782e2b5c7a7ae830647cd63b26b8b38fc/Img/1.png',
  id_back: 'https://raw.githubusercontent.com/harishmerwade/KRV/478b190782e2b5c7a7ae830647cd63b26b8b38fc/Img/2.png'
};

const INITIAL_LAYOUT_CERT1: FullLayout = {
  sides: [{
    canvasWidth: 1000,
    canvasHeight: 1414,
    backgroundImage: TEMPLATE_URLS.cert1,
    textItems: [
      { id: "pledge_text_1", text: "ಹೆಚ್. ಶಿವರಾಮೇಗೌಡರ ಕರ್ನಾಟಕ ರಕ್ಷಣಾ ವೇದಿಕೆಯ ರಾಜ್ಯಾಧ್ಯಕ್ಷರ ನೇತೃತ್ವದಲ್ಲಿ ಸತ್ಯ, ನ್ಯಾಯ-ಧರ್ಮವನ್ನು ಪಾಲಿಸಿಕೊಂಡು, ಆತ್ಮಪೂರ್ವಕವಾಗಿ ಈ ಕೆಳಕಂಡ ಪ್ರತಿಜ್ಞಾವಿಧಿಯ ಪ್ರಮಾಣವಚನ ಸ್ವೀಕರಿಸುತ್ತಿದ್ದೇನೆ.", x: 258, y: 524, fontSize: 20, color: "#000000", isBold: true, isLocked: false, width: 674, lineHeight: 1.6, isVisible: true },
      { id: "pledge_text_2", text: "ಕನ್ನಡ ನಾಡು, ನುಡಿ, ನೆಲ, ಜಲ, ಗಡಿ, ಭಾಷೆ ಸಂಸ್ಕೃತಿಯನ್ನು ಉಳಿಸಿ ಬೆಳೆಸುವ ಮಹತ್ತರ ಕಾರ್ಯದಲ್ಲಿ ನಾವೆಲ್ಲರೂ ಕನ್ನಡಾಂಬೆಯ ಸುಪುತ್ರ / ಸುಪುತ್ರಿಯರಾಗಿ ಒಮ್ಮತದಿಂದ ಶ್ರಮಿಸುತ್ತೇವೆ ಎಂದು ಈ ಮೂಲಕ ಪ್ರತಿಜ್ಞೆ ಮಾಡಿ ಕೆಳಗೆ ಸಹಿ ಹಾಕಿರುತ್ತೇನೆ.", x: 41.25, y: 622.99, fontSize: 20, color: "#000000", isBold: true, isLocked: false, width: 912, lineHeight: 1.6, isVisible: true },
      { id: "recipient_sig_label", text: "ಪ್ರತಿಜ್ಞಾವಿಧಿ ಸ್ವೀಕರಿಸಿದವರ ಸಹಿ", x: 651.26, y: 780.81, fontSize: 18, color: "#000000", isBold: true, isLocked: false, width: 300, lineHeight: 1.2, isVisible: true },
      { id: "appointment_block", text: "ಶ್ರೀಮತಿ/ಶ್ರೀಯುತ {name} ರವರನ್ನು ರಾಜ್ಯಾಧ್ಯಕ್ಷರ ಹಾಗೂ ಸರ್ವಸಮಿತಿಯ ಆದೇಶದ ಮೇರೆಗೆ {post} ರನ್ನಾಗಿ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದ್ದು, ಶ್ರೀಯುತರು ಇಂದಿನಿಂದ ತಮ್ಮ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಸಂಘಟನೆಯನ್ನು ಕ್ರಿಯಾಶೀಲರಾಗಿ ಮುನ್ನಡೆಸಿಕೊಂಡು ಹಾಗೂ ಯಾವುದೇ ಕಾನೂನುಬಾಹಿರ ಚಟುವಟಿಕೆಗಳಲ್ಲಿ ಭಾಗಿಯಾಗದೇ ತಮ್ಮ ಜವಾಬ್ದಾರಿಯನ್ನು ದುರುಪಯೋಗಪಡಿಸಿಕೊಳ್ಳದಂತೆ ಮುಂದುವರೆಯಬೇಕೆಂದು ಆದೇಶಿಸುತ್ತೇನೆ.", x: 48.55, y: 872.42, fontSize: 20, color: "#000000", isBold: true, isLocked: false, width: 897, lineHeight: 1.75, isVisible: true },
      { id: "left_date_office", text: "ದಿನಾಂಕ : {date}\nಬೆಂಗಳೂರು ನಗರ ಕೇಂದ್ರ ಕಛೇರಿ", x: 32.99, y: 1119.71, fontSize: 20, color: "#000000", isBold: true, isLocked: false, width: 350, lineHeight: 1.5, isVisible: true },
      { id: "validity_label", text: "ಸಿಂಧುತ್ವ: {validity}", x: 50, y: 1182, fontSize: 20, color: "#000000", isBold: true, isLocked: false, width: 300, lineHeight: 1.2, isVisible: true },
      { id: "right_president_block", text: "ಹೆಚ್. ಶಿವರಾಮೇಗೌಡ\nರಾಜ್ಯಾಧ್ಯಕ್ಷರು", x: 600, y: 1146, fontSize: 20, color: "#000000", isBold: true, isLocked: false, width: 350, lineHeight: 1.5, isVisible: true }
    ],
      photo: { id: "member_photo", x: 395, y: -84, width: 892, height: 939, isLocked: true, objectFit: "cover", borderRadius: 0, imageScale: 0.27, imageOffsetX: 0, imageOffsetY: -2 }
  }]
};

const INITIAL_LAYOUT_CERT2: FullLayout = {
  sides: [{
    canvasWidth: 1000,
    canvasHeight: 1414,
    backgroundImage: TEMPLATE_URLS.cert2,
    textItems: [
      { id: "pledge_text_1", text: "ಹೆಚ್. ಶಿವರಾಮೇಗೌಡರ ಕರ್ನಾಟಕ ರಕ್ಷಣಾ ವೇದಿಕೆಯ ರಾಜ್ಯಾಧ್ಯಕ್ಷರ ನೇತೃತ್ವದಲ್ಲಿ ಸತ್ಯ, ನ್ಯಾಯ-ಧರ್ಮವನ್ನು ಪಾಲಿಸಿಕೊಂಡು, ಆತ್ಮಪೂರ್ವಕವಾಗಿ ಈ ಕೆಳಕಂಡ ಪ್ರತಿಜ್ಞಾವಿಧಿಯ ಪ್ರಮಾಣವಚನ ಸ್ವೀಕರಿಸುತ್ತಿದ್ದೇನೆ", x: 19.9, y: 506.99, fontSize: 20, color: "#000000", isBold: true, isLocked: false, width: 965, lineHeight: 1.6, isVisible: true },
      { id: "pledge_text_2", text: "ಕನ್ನಡ ನಾಡು, ನುಡಿ, ನೆಲ, ಜಲ, ಗಡಿ, ಭಾಷೆ ಸಂಸ್ಕೃತಿಯನ್ನು ಉಳಿಸಿ ಬೆಳೆಸುವ ಮಹತ್ತರ ಕಾರ್ಯದಲ್ಲಿ ನಾವೆಲ್ಲರೂ ಕನ್ನಡಾಂಬೆಯ ಸುಪುತ್ರ / ಸುಪುತ್ರಿಯರಾಗಿ ಒಮ್ಮತದಿಂದ ಶ್ರಮಿಸುತ್ತೇವೆ ಎಂದು ಈ ಮೂಲಕ ಪ್ರತಿಜ್ಞೆ ಮಾಡಿ ಕೆಳಗೆ ಸಹಿ ಹಾಕಿರುತ್ತೇನೆ.", x: 48.54, y: 574.4, fontSize: 20, color: "#000000", isBold: true, isLocked: false, width: 907, lineHeight: 1.6, isVisible: true },
      { id: "recipient_sig_label", text: "ಪ್ರತಿಜ್ಞಾವಿಧಿ ಸ್ವೀಕರಿಸಿದವರ ಸಹಿ", x: 651.26, y: 734.65, fontSize: 18, color: "#000000", isBold: true, isLocked: false, width: 300, lineHeight: 1.2, isVisible: true },
      { id: "appointment_block", text: "ಶ್ರೀಮತಿ/ಶ್ರೀಯುತ {name} ರವರನ್ನು ರಾಜ್ಯಾಧ್ಯಕ್ಷರ ಹಾಗೂ ಸರ್ವಸಮಿತಿಯ ಆದೇಶದ ಮೇರೆಗೆ {post} ರನ್ನಾಗಿ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದ್ದು, ಶ್ರೀಯುತರು ಇಂದಿನಿಂದ ತಮ್ಮ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಸಂಘಟನೆಯನ್ನು ಕ್ರಿಯಾಶೀಲರಾಗಿ ಮುನ್ನಡೆಸಿಕೊಂಡು ಹಾಗೂ ಯಾವುದೇ ಕಾನೂನುಬಾಹಿರ ಚಟುವಟಿಕೆಗಳಲ್ಲಿ ಭಾಗಿಯಾಗದೇ ತಮ್ಮ ಜವಾಬ್ದಾರಿಯನ್ನು ದುರುಪಯೋಗಪಡಿಸಿಕೊಳ್ಳದಂತೆ ಮುಂದುವರೆಯಬೇಕೆಂದು ಆದೇಶಿಸುತ್ತೇನೆ.", x: 48.23, y: 825.54, fontSize: 20, color: "#000000", isBold: true, isLocked: false, width: 872, lineHeight: 1.8, isVisible: true },
      { id: "left_date_office", text: "ದಿನಾಂಕ : {date}\nಬೆಂಗಳೂರು ನಗರ ಕೇಂದ್ರ ಕಛೇರಿ", x: 50, y: 1127, fontSize: 20, color: "#000000", isBold: true, isLocked: false, width: 350, lineHeight: 1.5, isVisible: true },
      { id: "validity_label", text: "ಸಿಂಧುತ್ವ: {validity}", x: 84.01, y: 1184.42, fontSize: 20, color: "#000000", isBold: true, isLocked: false, width: 300, lineHeight: 1.2, isVisible: true },
      { id: "right_president_block", text: "ಹೆಚ್. ಶಿವರಾಮೇಗೌಡ\nರಾಜ್ಯಾಧ್ಯಕ್ಷರು", x: 626.72, y: 1146, fontSize: 20, color: "#000000", isBold: true, isLocked: false, width: 350, lineHeight: 1.5, isVisible: true }
    ],
    photo: { id: "member_photo", x: 347, y: -275, width: 904, height: 1321, isLocked: false, objectFit: "cover", borderRadius: 12, imageScale: 0.24, imageOffsetX: 0, imageOffsetY: -2 }
  }]
};

const INITIAL_LAYOUT_ID: FullLayout = {
  sides: [
    {
      canvasWidth: 1000,
      canvasHeight: 638,
      backgroundImage: TEMPLATE_URLS.id_front,
      textItems: [
        { id: "id_name", text: "{name}", x: 238.27567164179106, y: 262.51, fontSize: 36, color: "#000000", isBold: true, isLocked: false, width: 500, lineHeight: 1.2, isVisible: true },
        { id: "id_post", text: "{post}", x: 238.27567164179106, y: 314.05, fontSize: 24, color: "#c53030", isBold: true, isLocked: false, width: 500, lineHeight: 1.2, isVisible: true },
        { id: "id_contact", text: "{city}\nನೊಂದಣಿ ಸಂಖ್ಯೆ : {employeeId}\n{phone}", x: 245.8307462686567, y: 351.8858208955224, fontSize: 18, color: "#000000", isBold: true, isLocked: false, width: 500, lineHeight: 1.8, isVisible: true }
      ],
      photo: { id: "member_photo", x: 180, y: -84, width: 1285, height: 880, isLocked: false, objectFit: "cover", borderRadius: 8, imageScale: 0.35, imageOffsetX: 5, imageOffsetY: -5 }
    },
    {
      canvasWidth: 1000,
      canvasHeight: 638,
      backgroundImage: TEMPLATE_URLS.id_back,
      textItems: [
        { id: "id_back_date", text: "ದಿನಾಂಕ : {date}", x: 61.52, y: 515.76, fontSize: 22, color: "#000000", isBold: true, isLocked: false, width: 350, lineHeight: 1.2, isVisible: true },
        { id: "validity_label_back", text: "ಸಿಂಧುತ್ವ: {validity}", x: 355.61, y: 515.56, fontSize: 22, color: "#000000", isBold: true, isLocked: false, width: 350, lineHeight: 1.2, isVisible: true }
      ],
      photo: { id: "member_photo_hidden", x: -2000, y: 0, width: 1, height: 1, isLocked: true, objectFit: "cover", borderRadius: 0, imageScale: 0, imageOffsetX: 0, imageOffsetY: 0 }
    }
  ]
};

interface AppProps {
  onLogout?: () => void;
}

const App: React.FC<AppProps> = ({ onLogout }) => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('cert1');
  const [certificateData, setCertificateData] = useState<CertificateData>({
    memberName: "ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    memberPost: "ಹುದ್ದೆಯನ್ನು ನಮೂದಿಸಿ",
    issueDate: new Date().toISOString().split('T')[0],
    accentColor: "#c53030",
    mainTextColor: "#000000",
    validityText: "15 ತಿಂಗಳು",
    isValidityEnabled: true,
    phoneNumber: "+91 98442 12155",
    bloodGroup: "O +ve",
    city: "ಬೆಂಗಳೂರು ನಗರ ಜಿಲ್ಲೆ",
    employeeId: "1529"
  });

  const [layouts, setLayouts] = useState<{ [key in TemplateType]: FullLayout }>({
    cert1: INITIAL_LAYOUT_CERT1,
    cert2: INITIAL_LAYOUT_CERT2,
    id_card: INITIAL_LAYOUT_ID
  });
  
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [savedColors, setSavedColors] = useState<string[]>(["#c53030", "#000000", "#1e293b", "#d97706", "#2563eb", "#059669"]);
  const [photoData, setPhotoData] = useState<string | undefined>(undefined);
  const [isGlobalLocked, setIsGlobalLocked] = useState(true);
  const [selectedElement, setSelectedElement] = useState<{sideIdx: number, id: string} | null>(null);
  const [canvasScale, setCanvasScale] = useState(0.5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const currentLayout = layouts[activeTemplate] || INITIAL_LAYOUT_CERT1;

  const getCleanMemberName = () => {
    const raw = certificateData.memberName.trim();
    return raw && raw !== "ಹೆಸರನ್ನು ನಮೂದಿಸಿ" ? raw.replace(/[<>:"/\\|?*]/g, '').toUpperCase() : "MEMBER";
  };

  const updateScale = useCallback(() => {
    if (!containerRef.current || !currentLayout || !currentLayout.sides) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const padding = 60; 
    
    const maxSideWidth = Math.max(...currentLayout.sides.map(s => s.canvasWidth || 1000));
    const totalContentHeight = currentLayout.sides.reduce((acc, s) => acc + (s.canvasHeight || 0), 0) + (currentLayout.sides.length > 1 ? 40 : 0);
    
    const scaleW = (containerWidth - padding) / maxSideWidth;
    const scaleH = (containerHeight - padding) / (totalContentHeight || 1);
    
    setCanvasScale(Math.min(scaleW, scaleH, 1));
  }, [currentLayout]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => updateScale());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    updateScale();
    return () => resizeObserver.disconnect();
  }, [updateScale, activeTemplate]);

  useEffect(() => {
    const savedL = localStorage.getItem(`${STORAGE_KEY_PREFIX}_layouts`);
    if (savedL) {
      try {
        const parsed = JSON.parse(savedL);
        if (parsed && typeof parsed === 'object') {
          setLayouts(prev => {
            const next = { ...prev };
            Object.keys(parsed).forEach((key) => {
              if (parsed[key]?.sides) {
                next[key as TemplateType] = parsed[key];
              }
            });
            return next;
          });
        }
      } catch (e) { console.error("Load Error", e); }
    }
  }, []);

  const saveToLocal = () => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_layouts`, JSON.stringify(layouts));
    alert("Project saved locally!");
  };

  const handleColorChange = (key: 'accentColor' | 'mainTextColor', color: string) => {
    setCertificateData(p => ({...p, [key]: color}));
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== color);
      return [color, ...filtered].slice(0, 8);
    });
  };

  const toggleSaveColor = (color: string) => {
    if (savedColors.includes(color)) {
      setSavedColors(prev => prev.filter(c => c !== color));
    } else {
      setSavedColors(prev => [color, ...prev].slice(0, 15));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPhotoData(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const captureSides = async (): Promise<HTMLCanvasElement[]> => {
    const originalSelected = selectedElement;
    setSelectedElement(null);
    setIsGenerating(true);
    
    if (document.fonts) await document.fonts.ready;
    // Critical wait for all background images and fonts to settle
    await new Promise(r => setTimeout(r, 2500)); 
    
    const sideElements = workspaceRef.current?.querySelectorAll('.side-canvas') as NodeListOf<HTMLElement>;
    const canvases: HTMLCanvasElement[] = [];
    
    if (sideElements && currentLayout?.sides) {
      for (let i = 0; i < sideElements.length; i++) {
        const sideLayout = currentLayout.sides[i];
        const targetElement = sideElements[i];
        if (!sideLayout || !targetElement) continue;

        // CANVA-STYLE PERFECT RENDER: Strictly isolated, fixed dimensions, no layout leak
        const canvas = await html2canvas(targetElement, {
          scale: 4, 
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: sideLayout.canvasWidth,
          height: sideLayout.canvasHeight,
          windowWidth: sideLayout.canvasWidth,
          windowHeight: sideLayout.canvasHeight,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
            const clonedTarget = clonedDoc.querySelector(`[data-side-idx="${i}"]`) as HTMLElement;
            if (clonedTarget) {
                // Wipe the cloned body to remove any margins, paddings or responsive behavior
                clonedDoc.body.innerHTML = '';
                clonedDoc.body.style.margin = '0';
                clonedDoc.body.style.padding = '0';
                clonedDoc.body.style.width = `${sideLayout.canvasWidth}px`;
                clonedDoc.body.style.height = `${sideLayout.canvasHeight}px`;
                clonedDoc.body.style.overflow = 'hidden';
                clonedDoc.body.style.display = 'block';
                clonedDoc.body.style.backgroundColor = '#ffffff';

                // Ensure internal coordinates are exactly 1:1 with design
                clonedTarget.style.transform = 'none';
                clonedTarget.style.scale = '1';
                clonedTarget.style.position = 'absolute';
                clonedTarget.style.top = '0';
                clonedTarget.style.left = '0';
                clonedTarget.style.margin = '0';
                clonedTarget.style.width = `${sideLayout.canvasWidth}px`;
                clonedTarget.style.height = `${sideLayout.canvasHeight}px`;
                clonedTarget.style.boxShadow = 'none';
                clonedTarget.style.visibility = 'visible';
                clonedTarget.style.display = 'block';
                
                // Shift text elements up slightly for the final output as requested (very little up)
                const textWrappers = clonedTarget.querySelectorAll('.kannada-font');
                textWrappers.forEach((wrapper) => {
                  const container = (wrapper as HTMLElement).parentElement;
                  if (container && container.style.top) {
                    const currentTop = parseFloat(container.style.top);
                    if (!isNaN(currentTop)) {
                      container.style.top = `${currentTop - 10}px`;
                    }
                  }
                });

                clonedDoc.body.appendChild(clonedTarget);
            }
          }
        });
        canvases.push(canvas);
      }
    }
    
    setSelectedElement(originalSelected);
    setIsGenerating(false);
    return canvases;
  };

  const downloadJPG = async () => {
    const canvases = await captureSides();
    if (canvases.length === 0) return;
    
    const fileName = getCleanMemberName();
    
    if (canvases.length === 1) {
      const link = document.createElement('a');
      link.download = `${fileName}.jpg`;
      link.href = canvases[0].toDataURL('image/jpeg', 0.98);
      link.click();
    } else {
      const combined = document.createElement('canvas');
      const ctx = combined.getContext('2d');
      const totalWidth = Math.max(...canvases.map(c => c.width));
      const totalHeight = canvases.reduce((acc, c) => acc + c.height + 100, 0);
      
      combined.width = totalWidth;
      combined.height = totalHeight;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, totalWidth, totalHeight);
        let y = 0;
        canvases.forEach(c => {
          ctx.drawImage(c, (totalWidth - c.width) / 2, y);
          y += c.height + 100;
        });
      }
      
      const link = document.createElement('a');
      link.download = `${fileName}.jpg`;
      link.href = combined.toDataURL('image/jpeg', 0.98);
      link.click();
    }
  };

  const downloadPDF = async () => {
    const canvases = await captureSides();
    if (canvases.length === 0 || !currentLayout?.sides) return;
    
    const fileName = getCleanMemberName();
    const firstSide = currentLayout.sides[0];
    const orientation = (firstSide.canvasWidth || 1000) > (firstSide.canvasHeight || 1000) ? 'l' : 'p';
    const pdf = new jsPDF({ 
      orientation, 
      unit: 'px', 
      format: [firstSide.canvasWidth || 1000, firstSide.canvasHeight || 1000] 
    });
    
    canvases.forEach((c, idx) => {
      const side = currentLayout.sides[idx];
      if (!side) return;
      if (idx > 0) pdf.addPage([side.canvasWidth, side.canvasHeight], side.canvasWidth > side.canvasHeight ? 'l' : 'p');
      pdf.addImage(c.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, side.canvasWidth, side.canvasHeight, undefined, 'FAST');
    });
    
    pdf.save(`${fileName}.pdf`);
  };

  const updateItem = (sideIdx: number, id: string, updates: any) => {
    setLayouts(prev => {
      const next = { ...prev };
      if (!next[activeTemplate]) return prev;
      const newLayout = { ...next[activeTemplate] };
      const newSides = [...newLayout.sides];
      const side = { ...newSides[sideIdx] };
      
      if (id === 'member_photo') {
        side.photo = { ...side.photo, ...updates };
      } else {
        side.textItems = side.textItems.map(item => item.id === id ? { ...item, ...updates } : item);
      }
      
      newSides[sideIdx] = side;
      newLayout.sides = newSides;
      next[activeTemplate] = newLayout;
      return next;
    });
  };

  const handleDrag = (sideIdx: number, id: string, e: any) => {
    if (isGlobalLocked || !currentLayout?.sides) return;
    const side = currentLayout.sides[sideIdx];
    if (!side) return;
    const item = id === 'member_photo' ? side.photo : side.textItems.find(i => i.id === id);
    if (!item || item.isLocked) return;

    const startX = e.touches ? e.touches[0].clientX : e.clientX;
    const startY = e.touches ? e.touches[0].clientY : e.clientY;
    const initX = item.x;
    const initY = item.y;

    const onMove = (mv: any) => {
      const curX = mv.touches ? mv.touches[0].clientX : mv.clientX;
      const curY = mv.touches ? mv.touches[0].clientY : mv.clientY;
      const dx = (curX - startX) / canvasScale;
      const dy = (curY - startY) / canvasScale;
      updateItem(sideIdx, id, { x: initX + dx, y: initY + dy });
    };

    const onEnd = () => {
      window.removeEventListener(e.touches ? 'touchmove' : 'mousemove', onMove);
      window.removeEventListener(e.touches ? 'touchend' : 'mouseup', onEnd);
    };

    window.addEventListener(e.touches ? 'touchmove' : 'mousemove', onMove);
    window.addEventListener(e.touches ? 'touchend' : 'mouseup', onEnd);
  };

  const selectedItemData = selectedElement ? (
    selectedElement.id === 'member_photo' 
    ? currentLayout.sides[selectedElement.sideIdx]?.photo 
    : currentLayout.sides[selectedElement.sideIdx]?.textItems.find(i => i.id === selectedElement.id)
  ) : null;

  const ColorSelector = ({ label, activeColor, onChange }: { label: string, activeColor: string, onChange: (c: string) => void }) => (
    <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        <div className="relative group">
          <input type="color" value={activeColor} onChange={e => onChange(e.target.value)} className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer border-none p-0 bg-transparent ring-2 ring-slate-100 ring-offset-1" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[7px] font-black text-slate-300 uppercase mr-1">Saved:</span>
          {savedColors.map((c, i) => (
            <button key={i} onClick={() => onChange(c)} className={`w-4 h-4 rounded-full border border-slate-200 transition-all ${activeColor === c ? 'ring-2 ring-red-500 ring-offset-1 scale-110' : 'hover:scale-110'}`} style={{ backgroundColor: c }} />
          ))}
          <button onClick={() => toggleSaveColor(activeColor)} className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-200 hover:text-red-600"><Plus size={10} /></button>
        </div>
        
        {recentColors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[7px] font-black text-slate-300 uppercase mr-1">Recent:</span>
            {recentColors.map((c, i) => (
              <button key={i} onClick={() => onChange(c)} className={`w-4 h-4 rounded-full border border-slate-200 transition-all ${activeColor === c ? 'ring-2 ring-red-500 ring-offset-1 scale-110' : 'hover:scale-110'}`} style={{ backgroundColor: c }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-slate-100 font-sans overflow-hidden">
      
      {/* Sidebar Control Panel */}
      <div className={`fixed inset-0 z-[60] lg:relative lg:inset-auto w-full lg:w-[400px] bg-white border-r border-slate-200 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col h-full shrink-0 shadow-2xl lg:shadow-none`}>
        <div className="p-6 bg-red-600 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3 text-white">
            <ShieldCheck size={28} />
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight">KRV Studio</h1>
              <p className="text-[10px] font-bold uppercase opacity-80">4K Print Output Engine</p>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-white"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400"><Award size={14} /><h2 className="text-[10px] font-black uppercase tracking-widest">Layout Selection</h2></div>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button onClick={() => setActiveTemplate('cert1')} className={`flex flex-col items-center py-3 rounded-xl transition-all text-[9px] font-black uppercase ${activeTemplate === 'cert1' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}><Award size={16} /> Cert 1</button>
              <button onClick={() => setActiveTemplate('cert2')} className={`flex flex-col items-center py-3 rounded-xl transition-all text-[9px] font-black uppercase ${activeTemplate === 'cert2' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}><Award size={16} /> Cert 2</button>
              <button onClick={() => setActiveTemplate('id_card')} className={`flex flex-col items-center py-3 rounded-xl transition-all text-[9px] font-black uppercase ${activeTemplate === 'id_card' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}><CreditCard size={16} /> ID Card</button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2 text-slate-400"><User size={14} /><h2 className="text-[10px] font-black uppercase tracking-widest">Content & Typography</h2></div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Member Name</label>
                <input type="text" value={certificateData.memberName} onChange={e => setCertificateData(p => ({...p, memberName: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-red-600 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Designation (Post)</label>
                <input type="text" value={certificateData.memberPost} onChange={e => setCertificateData(p => ({...p, memberPost: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-red-600 transition-all" />
              </div>

              {activeTemplate === 'id_card' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase ml-1">City</label>
                    <input type="text" value={certificateData.city} onChange={e => setCertificateData(p => ({...p, city: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-red-600 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Employee ID</label>
                    <input type="text" value={certificateData.employeeId} onChange={e => setCertificateData(p => ({...p, employeeId: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-red-600 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Phone Number</label>
                    <input type="text" value={certificateData.phoneNumber} onChange={e => setCertificateData(p => ({...p, phoneNumber: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-red-600 transition-all" />
                  </div>
                </>
              )}

              <ColorSelector label="Name & Post Color" activeColor={certificateData.accentColor} onChange={c => handleColorChange('accentColor', c)} />
              <ColorSelector label="Body Text Color" activeColor={certificateData.mainTextColor} onChange={c => handleColorChange('mainTextColor', c)} />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Issue Date</label>
                <input type="date" value={certificateData.issueDate} onChange={e => setCertificateData(p => ({...p, issueDate: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-xs font-bold text-slate-900" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Validity</label>
                <input type="text" value={certificateData.validityText} onChange={e => setCertificateData(p => ({...p, validityText: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-xs font-bold text-slate-900" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer" onClick={() => setCertificateData(p => ({...p, isValidityEnabled: !p.isValidityEnabled}))}>
              <div className="flex items-center gap-3">{certificateData.isValidityEnabled ? <Eye size={18} className="text-emerald-500"/> : <EyeOff size={18} className="text-slate-400"/>}<span className="text-[10px] font-black uppercase text-slate-600">Validity Badge</span></div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${certificateData.isValidityEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${certificateData.isValidityEnabled ? 'left-6' : 'left-1'}`} /></div>
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-400"><ImageIcon size={14} /><h2 className="text-[10px] font-black uppercase tracking-widest">Profile Image</h2></div>
            <label className="cursor-pointer p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center transition-all block group">
              <ImageIcon className="mx-auto mb-2 text-slate-300 group-hover:text-red-600 transition-colors" size={24} /><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Update Photo</p>
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </label>
          </section>

          {selectedElement && selectedItemData && (
            <section className="bg-slate-900 p-5 rounded-2xl space-y-4 animate-in">
              <div className="flex justify-between items-center text-white text-[9px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2"><Settings size={14} className="text-red-500"/> Properties</div>
                <button onClick={() => updateItem(selectedElement.sideIdx, selectedElement.id, {isLocked: !selectedItemData.isLocked})} className={`p-1.5 rounded-lg transition-colors ${selectedItemData.isLocked ? 'bg-red-600' : 'bg-slate-800 text-slate-500'}`}>{selectedItemData.isLocked ? <Lock size={12}/> : <Unlock size={12}/>}</button>
              </div>
              
              {selectedElement.id === 'member_photo' ? (
                <div className="space-y-4">
                  <div className="space-y-1"><div className="flex justify-between text-[8px] font-black text-slate-500 uppercase"><span>Zoom</span><span className="text-white">{(selectedItemData as PhotoItem).imageScale.toFixed(2)}x</span></div><input type="range" min="0.1" max="3" step="0.01" value={(selectedItemData as PhotoItem).imageScale} onChange={e => updateItem(selectedElement.sideIdx, 'member_photo', {imageScale: +e.target.value})} className="w-full accent-red-600" /></div>
                  <div className="space-y-1"><div className="flex justify-between text-[8px] font-black text-slate-500 uppercase"><span>Horizontal Pos</span><span className="text-white">{(selectedItemData as PhotoItem).imageOffsetX}px</span></div><input type="range" min="-500" max="500" value={(selectedItemData as PhotoItem).imageOffsetX} onChange={e => updateItem(selectedElement.sideIdx, 'member_photo', {imageOffsetX: +e.target.value})} className="w-full accent-red-600" /></div>
                  <div className="space-y-1"><div className="flex justify-between text-[8px] font-black text-slate-500 uppercase"><span>Vertical Pos</span><span className="text-white">{(selectedItemData as PhotoItem).imageOffsetY}px</span></div><input type="range" min="-500" max="500" value={(selectedItemData as PhotoItem).imageOffsetY} onChange={e => updateItem(selectedElement.sideIdx, 'member_photo', {imageOffsetY: +e.target.value})} className="w-full accent-red-600" /></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1"><div className="flex justify-between text-[8px] font-black text-slate-500 uppercase"><span>Font Size</span><span className="text-white">{(selectedItemData as TextItem).fontSize}px</span></div><input type="range" min="8" max="150" value={(selectedItemData as TextItem).fontSize} onChange={e => updateItem(selectedElement.sideIdx, selectedElement.id, {fontSize: +e.target.value})} className="w-full accent-red-600" /></div>
                  <div className="space-y-1"><div className="flex justify-between text-[8px] font-black text-slate-500 uppercase"><span>Width</span><span className="text-white">{(selectedItemData as TextItem).width}px</span></div><input type="range" min="50" max="1000" value={(selectedItemData as TextItem).width} onChange={e => updateItem(selectedElement.sideIdx, selectedElement.id, {width: +e.target.value})} className="w-full accent-red-600" /></div>
                  <div className="flex gap-2"><button onClick={() => updateItem(selectedElement.sideIdx, selectedElement.id, {isBold: !(selectedItemData as TextItem).isBold})} className={`flex-1 py-2 rounded-lg font-black text-[9px] uppercase ${ (selectedItemData as TextItem).isBold ? 'bg-white text-black' : 'bg-slate-800 text-slate-500' }`}>Bold Font</button><input type="color" value={(selectedItemData as TextItem).color} onChange={e => updateItem(selectedElement.sideIdx, selectedElement.id, {color: e.target.value})} className="w-12 h-10 border border-slate-700 rounded-lg bg-slate-800 p-1" /></div>
                </div>
              )}
            </section>
          )}

          <section className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
            <button onClick={saveToLocal} className="flex flex-col items-center py-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"><Save size={16} className="text-slate-600"/><span className="text-[8px] font-black uppercase text-slate-500 mt-1">Quick Save</span></button>
            <button onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(layouts));
              const dl = document.createElement('a');
              dl.href = dataStr;
              dl.download = `KRV_LAYOUT_CONFIG.json`;
              dl.click();
            }} className="flex flex-col items-center py-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"><FileJson size={16} className="text-slate-600"/><span className="text-[8px] font-black uppercase text-slate-500 mt-1">Export Config</span></button>
          </section>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
          <button onClick={() => setIsGlobalLocked(!isGlobalLocked)} className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${isGlobalLocked ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-500 border-slate-200'}`}>{isGlobalLocked ? <Lock size={16}/> : <Unlock size={16}/>} {isGlobalLocked ? 'Design Locked' : 'Unlock Elements'}</button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={downloadJPG} className="bg-white border border-slate-200 text-slate-900 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase transition-all hover:bg-slate-100"><ImageIcon size={16} className="text-red-600"/> 4K JPG</button>
            <button onClick={downloadPDF} className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase transition-all shadow-lg shadow-red-100"><Download size={16}/> Print PDF</button>
          </div>
        </div>
      </div>

      {/* Main Preview Workspace */}
      <div ref={containerRef} className="flex-1 bg-slate-300 flex flex-col items-center justify-center relative overflow-hidden p-4 md:p-8">
        
        {onLogout && (
          <div className="absolute top-4 right-4 z-50 hidden lg:block">
            <button onClick={onLogout} className="bg-white/90 backdrop-blur shadow-sm border border-slate-200 px-5 py-2.5 rounded-full text-slate-600 hover:text-red-600 hover:bg-white font-black text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95">
              <LogOut size={14} /> Log Out
            </button>
          </div>
        )}

        <div className="absolute top-0 left-0 w-full p-4 flex lg:hidden items-center justify-between z-50 bg-red-600 shadow-xl">
          <div className="flex items-center gap-2 text-white"><ShieldCheck size={20}/><h1 className="text-xs font-black uppercase tracking-tight">KRV Designer</h1></div>
          <div className="flex items-center gap-2">
            {onLogout && <button onClick={onLogout} className="p-2 bg-white/10 rounded-lg text-white"><LogOut size={20}/></button>}
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-white/10 rounded-lg text-white"><Menu size={20}/></button>
          </div>
        </div>

        {isGenerating && (
          <div className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-in">
            <div className="w-14 h-14 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-6" />
            <p className="text-xl font-black text-slate-900 uppercase tracking-tighter text-center">Exporting 4K Print-Ready Asset...</p>
          </div>
        )}

        {/* Scaled Render Container */}
        <div ref={workspaceRef} className="flex flex-col gap-10 transition-transform duration-500 items-center justify-center origin-center" style={{ transform: `scale(${canvasScale})` }}>
          {currentLayout?.sides?.map((side, sIdx) => (
            <div 
              key={sIdx} 
              data-side-idx={sIdx}
              className="side-canvas relative bg-white shadow-[0_40px_100px_rgba(0,0,0,0.35)] shrink-0 overflow-hidden" 
              style={{ 
                width: `${side.canvasWidth}px`, 
                height: `${side.canvasHeight}px`, 
                backgroundImage: `url(${side.backgroundImage})`, 
                backgroundSize: '100% 100%', 
                backgroundColor: '#fff',
                position: 'relative',
                display: 'block'
              }}
              onMouseDown={e => e.target === e.currentTarget && setSelectedElement(null)}
            >
              {photoData && side.photo && side.photo.width > 1 && (
                <div 
                  onMouseDown={e => { setSelectedElement({sideIdx: sIdx, id: 'member_photo'}); if(!isGlobalLocked && !side.photo.isLocked) handleDrag(sIdx, 'member_photo', e); }}
                  className={`absolute overflow-hidden ${selectedElement?.sideIdx === sIdx && selectedElement?.id === 'member_photo' ? 'ring-8 ring-red-600/50 z-40' : 'z-10'}`}
                  style={{ 
                    left: `${side.photo.x}px`, 
                    top: `${side.photo.y}px`, 
                    width: `${side.photo.width}px`, 
                    height: `${side.photo.height}px`, 
                    borderRadius: `${side.photo.borderRadius}px`, 
                    cursor: isGlobalLocked ? 'default' : (side.photo.isLocked ? 'not-allowed' : 'move'),
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img 
                    src={photoData}
                    alt="member"
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: side.photo.objectFit === 'cover' ? 'cover' : 'contain',
                      transform: `scale(${side.photo.imageScale}) translate(${side.photo.imageOffsetX}px, ${side.photo.imageOffsetY}px)`,
                      pointerEvents: 'none'
                    }} 
                  />
                </div>
              )}

              {side.textItems && side.textItems.map(item => {
                const isVisible = (item.id.includes('validity') ? certificateData.isValidityEnabled : true);
                if (!isVisible) return null;

                const isCert = activeTemplate.startsWith('cert');
                let baseColor = certificateData.mainTextColor;

                return (
                  <div 
                    key={item.id}
                    onMouseDown={e => { setSelectedElement({sideIdx: sIdx, id: item.id}); handleDrag(sIdx, item.id, e); }}
                    className={`absolute flex items-center justify-center text-center ${selectedElement?.sideIdx === sIdx && selectedElement?.id === item.id ? 'bg-red-500/15 ring-4 ring-red-600/40 z-50' : 'z-20'} ${!isGlobalLocked && !item.isLocked ? 'cursor-move' : ''}`}
                    style={{ 
                      left: `${item.x}px`, 
                      top: `${item.y}px`, 
                      width: `${item.width}px`, 
                      minHeight: '1em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div className="kannada-font w-full whitespace-pre-wrap select-none" style={{ fontSize: `${item.fontSize}px`, color: baseColor, fontWeight: item.isBold ? '900' : 'normal', lineHeight: item.lineHeight }}>
                      {item.text.split(/({name}|{post}|{date}|{validity}|{phone}|{blood}|{city}|{employeeId})/).map((part, i) => {
                        const isPrimary = ['{name}', '{post}'].includes(part);
                        const dynamicSize = (isCert && isPrimary) ? '105%' : undefined;
                        
                        if (part === '{name}') return <span key={i} style={{ color: certificateData.accentColor, fontSize: dynamicSize, fontWeight: '900' }}>{certificateData.memberName}</span>;
                        if (part === '{post}') return <span key={i} style={{ color: certificateData.accentColor, fontSize: dynamicSize, fontWeight: '900' }}>{certificateData.memberPost}</span>;
                        if (part === '{date}') return <span key={i}>{certificateData.issueDate}</span>;
                        if (part === '{validity}') return <span key={i}>{certificateData.validityText}</span>;
                        if (part === '{phone}') return <span key={i}>{certificateData.phoneNumber}</span>;
                        if (part === '{blood}') return <span key={i} style={{ color: certificateData.accentColor, fontWeight: '900' }}>{certificateData.bloodGroup}</span>;
                        if (part === '{city}') return <span key={i}>{certificateData.city}</span>;
                        if (part === '{employeeId}') return <span key={i}>{certificateData.employeeId}</span>;
                        return part;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
