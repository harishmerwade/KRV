
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
  FileText,
  Menu,
  X,
  LogOut,
  Upload,
  FileJson,
  FileUp
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { TextItem, PhotoItem, CertificateData } from './types';
import './styles.css';

const STORAGE_KEY = 'krv_cert_layout_v4';

/** 
 * UPDATE YOUR TEMPLATE HERE 
 * Using the raw image URL from GitHub for proper loading.
 */
const CERTIFICATE_TEMPLATE_SRC = 'https://raw.githubusercontent.com/harishmerwade/KRV/e671e13c8edd1fc3bcb466ab8f0e979edb9fa0a6/template.png';

const INITIAL_TEXT_ITEMS: TextItem[] = [
  {
    id: "pledge_text_1",
    text: "ಹೆಚ್. ಶಿವರಾಮೇಗೌಡರ ಕರ್ನಾಟಕ ರಕ್ಷಣಾ ವೇದಿಕೆಯ ರಾಜ್ಯಾಧ್ಯಕ್ಷರ ನೇತೃತ್ವದಲ್ಲಿ ಸತ್ಯ-ನ್ಯಾಯ-ಧರ್ಮವನ್ನು ಪಾಲಿಸಿಕೊಂಡು, ಧರ್ಮಸ್ಥಳದ ಶ್ರೀ ಮಂಜuನಾಥಸ್ವಾಮಿ ಮೇಲೆ ಆತ್ಮಪೂರ್ವಕವಾಗಿ ಈ ಕೆಳಕಂಡ ಪ್ರತಿಜ್ಞಾವಿಧಿಯ ಪ್ರಮಾಣವಚನ ಸ್ವೀಕರಿಸುತ್ತಿದ್ದೇವೆ.",
    x: 258.2835820895522,
    y: 524.6746268656716,
    fontSize: 18,
    color: "#000000",
    isBold: true,
    isLocked: false,
    width: 674,
    lineHeight: 1.6,
    isVisible: true
  },
  {
    id: "pledge_text_2",
    text: "ಕನ್ನಡ ನಾಡು, ನುಡಿ, ನೆಲ, ಜಲ, ಗಡಿ, ಭಾಷೆ ಸಂಸ್ಕೃತಿಯನ್ನು ಉಳಿಸಿ ಬೆಳೆಸುವ ಮಹತ್ತರ ಕಾರ್ಯದಲ್ಲಿ ನಾವಲ್ಲರೂ ಕನ್ನಡಾಂಬೆಯ ಸುಪುತ್ರ / ಸುಪುತ್ರಿಯರಾಗಿ ಒಮ್ಮತದಿಂದ ಶ್ರಮಿಸುತ್ತೇವೆ ಎಂದು ಈ ಮೂಲಕ ಪ್ರತಿಜ್ಞೆ ಮಾಡಿ ಕೆಳಗೆ ಸಹಿ ಹಾಕಿರುತ್ತೇನೆ.",
    x: 118.9940298507463,
    y: 640,
    fontSize: 18,
    color: "#000000",
    isBold: true,
    isLocked: false,
    width: 804,
    lineHeight: 1.6,
    isVisible: true
  },
  {
    id: "appointment_block",
    text: "ಶ್ರೀಯುತ {name} ರವರನ್ನು ರಾಜ್ಯಾಧ್ಯಕ್ಷರ ಸರ್ವಸಮಿತಿಯ ಮೇರೆಗೆ {post} ರನ್ನಾಗಿ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದ್ದು. ಶ್ರೀಯುತರು ಇಂದಿನಿಂದ ತಮ್ಮ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಸಂಘಟನೆಯನ್ನು ಕ್ರಿಯಾಶೀಲರಾಗಿ ಮುನ್ನಡೆಸಿಕೊಂಡು ಹಾಗೂ ಯಾವುದೇ ಕಾನೂನುಬಾಹಿರ ಚಟುವಟಿಕೆಗಳಲ್ಲಿ ಭಾಗಿಯಾಗದೇ ತಮ್ಮ ಜವಾಬ್ದಾರಿಯನ್ನು ದುರುಪಯೋಗಪಡಿಸಿಕೊಳ್ಳದಂತೆ ಮುಂದುವರೆಯಬೇಕೆಂದು ಆದೇಶಿಸುತ್ತೇನೆ.",
    x: 102.11044776119402,
    y: 887.1791044776119,
    fontSize: 18,
    color: "#000000",
    isBold: true,
    isLocked: true,
    width: 830,
    lineHeight: 1.75,
    isVisible: true
  },
  {
    id: "left_date_office",
    text: "ದಿನಾಂಕ : {date}\nಬೆಂಗಳೂರು ನಗರ ಕೇಂದ್ರ ಕಛೇರಿ",
    x: 0.8089552238805879,
    y: 1127.4358208955223,
    fontSize: 18,
    color: "#000000",
    isBold: true,
    isLocked: false,
    width: 350,
    lineHeight: 1.5,
    isVisible: true
  },
  {
    id: "validity_label",
    text: "ಸಿಂಧುತ್ವ: {validity}",
    x: 21.913432835820878,
    y: 1182.110447761194,
    fontSize: 16,
    color: "#666666",
    isBold: true,
    isLocked: false,
    width: 300,
    lineHeight: 1.2,
    isVisible: true
  },
  {
    id: "right_president_block",
    text: "ರಾಜ್ಯಾಧ್ಯಕ್ಷರು\nಹೆಚ್. ಶಿವರಾಮೇಗೌಡ",
    x: 687.179104477612,
    y: 1146.4298507462686,
    fontSize: 18,
    color: "#000000",
    isBold: true,
    isLocked: false,
    width: 350,
    lineHeight: 1.5,
    isVisible: true
  },
  {
    id: "signature_label",
    text: "ಪ್ರತಿಜ್ಞಾವಿಧಿ ಸ್ವೀಕರಿಸಿದವರ ಸಹಿ",
    x: 639.4477611940298,
    y: 789.9223880597015,
    fontSize: 16,
    color: "#000000",
    isBold: true,
    isLocked: false,
    width: 300,
    lineHeight: 1.2,
    isVisible: true
  }
];

const INITIAL_PHOTO: PhotoItem = {
  id: "member_photo",
  x: 761.8835820895523,
  y: 304.7432835820896,
  width: 158,
  height: 190,
  isLocked: true,
  imageData: undefined,
  objectFit: "cover",
  borderRadius: 0,
  imageScale: 0.92,
  imageOffsetX: 0,
  imageOffsetY: -2.2939649578195973
};

const App: React.FC = () => {
  const [certificateData, setCertificateData] = useState<CertificateData>({
    memberName: "ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    memberPost: "ಹುದ್ದೆಯನ್ನು ನಮೂದಿಸಿ",
    issueDate: "2026-02-16",
    highlightColor: "#c53030",
    validityText: "15 ತಿಂಗಳು",
    isValidityEnabled: true
  });

  const [photo, setPhoto] = useState<PhotoItem>(INITIAL_PHOTO);
  const [textItems, setTextItems] = useState<TextItem[]>(INITIAL_TEXT_ITEMS);
  const [isGlobalLocked, setIsGlobalLocked] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasScale, setCanvasScale] = useState(0.5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [customTemplate, setCustomTemplate] = useState<string | null>(null);
  const [templateSize, setTemplateSize] = useState({ width: 1000, height: 1414 });
  
  const certificateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const targetWidth = templateSize.width;
    const targetHeight = templateSize.height;
    
    const padding = window.innerWidth < 768 ? 40 : 100;
    const scaleW = (containerWidth - padding) / targetWidth;
    const scaleH = (containerHeight - padding) / targetHeight;
    setCanvasScale(Math.min(scaleW, scaleH));
  }, [templateSize]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => updateScale());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    updateScale();
    return () => resizeObserver.disconnect();
  }, [updateScale]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.textItems) setTextItems(parsed.textItems);
        if (parsed.photo) setPhoto(prev => ({ ...prev, ...parsed.photo, imageData: prev.imageData }));
        if (parsed.certificateData) setCertificateData(prev => ({ ...prev, ...parsed.certificateData }));
      } catch (e) { console.error(e); }
    }
  }, []);

  const saveLayout = useCallback(() => {
    const layout = { textItems, photo: { ...photo, imageData: undefined }, certificateData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    alert("Layout Saved Locally!");
  }, [textItems, photo, certificateData]);

  const exportLayout = useCallback(() => {
    const layout = { textItems, photo: { ...photo, imageData: undefined }, certificateData };
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `krv_layout_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [textItems, photo, certificateData]);

  const importLayout = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.textItems) setTextItems(parsed.textItems);
          if (parsed.certificateData) setCertificateData(parsed.certificateData);
          if (parsed.photo) setPhoto(prev => ({ ...prev, ...parsed.photo }));
        } catch (err) { alert("Invalid JSON file"); }
      };
      reader.readAsText(file);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPhoto(prev => ({ ...prev, imageData: event.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setTemplateSize({ width: img.width, height: img.height });
          setCustomTemplate(dataUrl);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const getHighResCanvas = async () => {
    if (!certificateRef.current) return null;
    const originalSelectedId = selectedId;
    setSelectedId(null);
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    try {
      const orig = certificateRef.current!;
      const clone = orig.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.width = `${templateSize.width}px`;
      clone.style.height = `${templateSize.height}px`;
      const wrapper = document.createElement('div');
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);
      const canvas = await html2canvas(clone, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      document.body.removeChild(wrapper);
      setSelectedId(originalSelectedId);
      return canvas;
    } catch (error) {
      setSelectedId(originalSelectedId);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadJPG = async () => {
    const canvas = await getHighResCanvas();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `KRV_Certificate_${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  const downloadPDF = async () => {
    const canvas = await getHighResCanvas();
    if (!canvas) return;
    const orientation = templateSize.width > templateSize.height ? 'l' : 'p';
    const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    pdf.save(`KRV_Certificate_${Date.now()}.pdf`);
  };

  const updateTextItem = (id: string, updates: Partial<TextItem>) => {
    setTextItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const updatePhoto = (updates: Partial<PhotoItem>) => {
    setPhoto(prev => ({ ...prev, ...updates }));
  };

  const handleDrag = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    if (isGlobalLocked) return;
    const isPhoto = id === 'member_photo';
    const item = isPhoto ? photo : textItems.find(i => i.id === id);
    if (!item || item.isLocked) return;

    const isTouch = 'touches' in e;
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;
    const initialX = item.x;
    const initialY = item.y;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const deltaX = (currentX - startX) / canvasScale;
      const deltaY = (currentY - startY) / canvasScale;
      if (isPhoto) setPhoto(prev => ({ ...prev, x: initialX + deltaX, y: initialY + deltaY }));
      else updateTextItem(id, { x: initialX + deltaX, y: initialY + deltaY });
    };

    const onEnd = () => {
      window.removeEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
      window.removeEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
    };

    window.addEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
    window.addEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
  };

  const selectedTextItem = textItems.find(i => i.id === selectedId);

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-slate-100 font-sans overflow-hidden text-slate-800">
      
      {/* Sidebar - Control Panel */}
      <div className={`
        fixed inset-0 z-[60] lg:relative lg:inset-auto 
        w-full lg:w-[420px] bg-white border-r border-slate-200
        transition-transform duration-500 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-full shrink-0 shadow-xl
      `}>
        {/* Header */}
        <div className="p-6 bg-red-600 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl border border-white/30 backdrop-blur-sm">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase">KRV <span className="font-normal opacity-80">Studio</span></h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
          
          {/* File Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={saveLayout} className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all group">
              <Save size={18} className="mb-1 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase text-slate-500">Save</span>
            </button>
            <button onClick={exportLayout} className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all group">
              <FileJson size={18} className="mb-1 text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase text-slate-500">Export JSON</span>
            </button>
            <label className="cursor-pointer flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all group">
              <FileUp size={18} className="mb-1 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase text-slate-500">Import JSON</span>
              <input type="file" className="hidden" accept="application/json" onChange={importLayout} />
            </label>
            <label className="cursor-pointer flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all group">
              <Upload size={18} className="mb-1 text-red-600 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase text-slate-500">Template</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleTemplateUpload} />
            </label>
          </div>

          {/* Recipient Details */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User size={14} className="text-red-600" />
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recipient Info</h2>
            </div>
            <div className="space-y-3">
              <input 
                type="text" 
                value={certificateData.memberName}
                onChange={(e) => setCertificateData(prev => ({ ...prev, memberName: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all"
                placeholder="Member Name"
              />
              <input 
                type="text" 
                value={certificateData.memberPost}
                onChange={(e) => setCertificateData(prev => ({ ...prev, memberPost: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all"
                placeholder="Designation"
              />
              <div className="flex gap-4">
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Issue Date</span>
                  <input type="date" value={certificateData.issueDate} onChange={e => setCertificateData(p => ({...p, issueDate: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Theme Color</span>
                  <input type="color" value={certificateData.highlightColor} onChange={e => setCertificateData(p => ({...p, highlightColor: e.target.value}))} className="w-14 h-10 border border-slate-200 rounded-xl cursor-pointer bg-white p-1" />
                </div>
              </div>
            </div>
          </section>

          {/* Validity Settings */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Settings size={14} className="text-red-600" />
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Validity Settings</h2>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="text" 
                value={certificateData.validityText}
                onChange={(e) => setCertificateData(prev => ({ ...prev, validityText: e.target.value }))}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                placeholder="Validity (e.g. 15 ತಿಂಗಳು)"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={certificateData.isValidityEnabled}
                  onChange={(e) => setCertificateData(prev => ({ ...prev, isValidityEnabled: e.target.checked }))}
                  className="w-4 h-4 accent-red-600"
                />
                <span className="text-xs font-bold text-slate-500 uppercase">Show</span>
              </label>
            </div>
          </section>

          {/* Image & Photo */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon size={14} className="text-red-600" />
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Portrait Photo</h2>
            </div>
            <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 p-5 rounded-2xl border-2 border-dashed border-slate-200 text-center transition-all block group">
              <ImageIcon className="mx-auto mb-2 text-slate-300 group-hover:text-red-600 transition-colors" size={24} />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Upload Member Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </label>
          </section>

          {/* Editor Controls */}
          {selectedId && (
            <section className="bg-red-50 border border-red-100 p-5 rounded-2xl space-y-5 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                  {selectedId === 'member_photo' ? 'Image Editor' : 'Text Editor'}
                </h3>
                <button 
                  onClick={() => selectedId === 'member_photo' ? updatePhoto({isLocked: !photo.isLocked}) : updateTextItem(selectedId as string, {isLocked: !selectedTextItem?.isLocked})}
                  className={`p-2 rounded-lg transition-all ${ (selectedId === 'member_photo' ? photo.isLocked : selectedTextItem?.isLocked) ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-white text-slate-400 border border-slate-200' }`}
                >
                  {(selectedId === 'member_photo' ? photo.isLocked : selectedTextItem?.isLocked) ? <Lock size={14}/> : <Unlock size={14}/>} 
                </button>
              </div>

              {selectedId === 'member_photo' ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                      <span>Scaling</span>
                      <span>{Math.round(photo.imageScale * 100)}%</span>
                    </div>
                    <input type="range" min="0.1" max="5" step="0.01" value={photo.imageScale} onChange={e => updatePhoto({imageScale: +e.target.value})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                      <span>Offset Y</span>
                      <span>{Math.round(photo.imageOffsetY)}px</span>
                    </div>
                    <input type="range" min="-100" max="100" value={photo.imageOffsetY} onChange={e => updatePhoto({imageOffsetY: +e.target.value})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updatePhoto({objectFit: 'cover'})} className={`text-[10px] font-bold py-2 rounded-lg border transition-all ${photo.objectFit === 'cover' ? 'bg-red-600 text-white border-red-600' : 'bg-white border-slate-200 text-slate-400'}`}>COVER</button>
                    <button onClick={() => updatePhoto({objectFit: 'contain'})} className={`text-[10px] font-bold py-2 rounded-lg border transition-all ${photo.objectFit === 'contain' ? 'bg-red-600 text-white border-red-600' : 'bg-white border-slate-200 text-slate-400'}`}>CONTAIN</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                      <span>Font Size</span>
                      <span>{selectedTextItem?.fontSize}px</span>
                    </div>
                    <input type="range" min="8" max="150" value={selectedTextItem?.fontSize} onChange={e => updateTextItem(selectedId as string, {fontSize: +e.target.value})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateTextItem(selectedId as string, {isBold: !selectedTextItem?.isBold})} 
                      className={`flex-1 py-2 rounded-lg font-bold text-[10px] border tracking-widest transition-all ${selectedTextItem?.isBold ? 'bg-red-600 text-white border-red-600' : 'bg-white border-slate-200 text-slate-400'}`}
                    >
                      BOLD
                    </button>
                    <input type="color" value={selectedTextItem?.color} onChange={e => updateTextItem(selectedId as string, {color: e.target.value})} className="w-12 h-9 border border-slate-200 rounded-lg bg-white p-1 cursor-pointer" />
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4 shrink-0 shadow-inner">
          <button 
            onClick={() => setIsGlobalLocked(!isGlobalLocked)}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-[11px] uppercase tracking-widest transition-all border ${
              isGlobalLocked ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isGlobalLocked ? <Lock size={16} /> : <Unlock size={16} />} 
            {isGlobalLocked ? 'Workspace Locked' : 'Workspace Unlocked'}
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button onClick={downloadJPG} className="bg-slate-700 hover:bg-slate-800 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-[10px] tracking-widest transition-all shadow-md active:scale-95">
              <ImageIcon size={16} /> JPG
            </button>
            <button onClick={downloadPDF} className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-[10px] tracking-widest transition-all shadow-md active:scale-95">
              <FileText size={16} /> PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div ref={containerRef} className="flex-1 bg-slate-100 flex items-center justify-center relative overflow-hidden p-6">
        
        {/* Mobile Navbar */}
        <div className="absolute top-0 left-0 w-full p-4 flex lg:hidden items-center justify-between z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
           <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-red-600" />
            <h1 className="text-sm font-bold uppercase text-slate-800 tracking-tight">KRV Studio</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-slate-100 rounded-lg border border-slate-200">
            <Menu size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Floating Sign Out */}
        <div className="absolute top-6 right-6 z-[70] hidden lg:block">
          <button 
            onClick={() => { localStorage.removeItem('krv_auth'); window.location.reload(); }} 
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-500 hover:text-red-600 px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-all text-xs font-bold uppercase tracking-tight"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="p-10 rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col items-center gap-6 animate-in zoom-in duration-300">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
                <ShieldCheck className="absolute inset-0 m-auto text-red-600" size={24} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800 uppercase">Exporting Asset</h3>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">Generating High Quality File...</p>
              </div>
            </div>
          </div>
        )}

        {/* Scaled Workspace Container */}
        <div 
          className="relative flex items-center justify-center transition-all duration-700 ease-out"
          style={{ transform: `scale(${canvasScale})`, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.12))' }}
        >
          <div 
            ref={certificateRef}
            className="relative bg-white shadow-2xl shrink-0 canvas-container select-none overflow-hidden"
            style={{ 
              width: `${templateSize.width}px`, 
              height: `${templateSize.height}px`, 
              backgroundImage: `url(${customTemplate || CERTIFICATE_TEMPLATE_SRC})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#fff'
            }}
            onMouseDown={(e) => { if (e.target === certificateRef.current) setSelectedId(null); }}
          >
            {/* Member Photo */}
            {photo.imageData && (
              <div 
                onMouseDown={(e) => { setSelectedId('member_photo'); if (!photo.isLocked && !isGlobalLocked) handleDrag('member_photo', e); }}
                onTouchStart={(e) => { setSelectedId('member_photo'); if (!photo.isLocked && !isGlobalLocked) handleDrag('member_photo', e); }}
                className={`absolute overflow-hidden group transition-all ${photo.isLocked || isGlobalLocked ? 'cursor-not-allowed' : 'cursor-move'} ${selectedId === 'member_photo' ? 'ring-8 ring-red-600/30 z-40' : 'z-10 shadow-lg'}`}
                style={{
                  left: `${photo.x}px`,
                  top: `${photo.y}px`,
                  width: `${photo.width}px`,
                  height: `${photo.height}px`,
                  borderRadius: `${photo.borderRadius}px`,
                }}
              >
                <img 
                  src={photo.imageData} 
                  alt="Member" 
                  className="w-full h-full pointer-events-none"
                  style={{ 
                    objectFit: photo.objectFit,
                    transform: `scale(${photo.imageScale}) translate(${photo.imageOffsetX}px, ${photo.imageOffsetY}px)`,
                    transformOrigin: 'center'
                  }}
                />
              </div>
            )}

            {/* Text Layers */}
            {textItems.map((item) => item.isVisible && (
              <div 
                key={item.id}
                onMouseDown={(e) => { setSelectedId(item.id); handleDrag(item.id, e); }}
                onTouchStart={(e) => { setSelectedId(item.id); handleDrag(item.id, e); }}
                className={`absolute p-2 flex items-center justify-center text-center transition-all ${item.isLocked || isGlobalLocked ? 'cursor-not-allowed' : 'cursor-move hover:bg-red-500/5'} ${selectedId === item.id ? 'bg-red-500/10 ring-4 ring-red-600/20 z-50' : 'z-20'}`}
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  width: `${item.width}px`,
                }}
              >
                <div 
                  className="kannada-font w-full whitespace-pre-wrap select-none"
                  style={{ 
                    fontSize: `${item.fontSize}px`, 
                    color: item.color, 
                    fontWeight: item.isBold ? '900' : 'normal',
                    lineHeight: item.lineHeight
                  }}
                >
                  {item.id === 'appointment_block' ? (
                     item.text.split(/({name}|{post})/).map((part, i) => {
                      if (part === '{name}') return <span key={i} className="font-bold" style={{ color: certificateData.highlightColor }}>{certificateData.memberName}</span>;
                      if (part === '{post}') return <span key={i} className="font-bold" style={{ color: certificateData.highlightColor }}>{certificateData.memberPost}</span>;
                      return part;
                    })
                  ) : item.id === 'left_date_office' ? (
                     item.text.replace('{date}', certificateData.issueDate)
                   ) : item.id === 'validity_label' ? (
                     item.text.replace('{validity}', certificateData.validityText)
                   ) : item.text}
                </div>
                {(item.isLocked || isGlobalLocked) && selectedId === item.id && (
                  <div className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 shadow-lg ring-2 ring-white">
                    <Lock size={10} />
                  </div>
                )}
              </div>
            ))}

            {/* Guides */}
            {!isGlobalLocked && (
              <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute top-0 left-1/2 w-px h-full bg-red-600/30" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-red-600/30" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
