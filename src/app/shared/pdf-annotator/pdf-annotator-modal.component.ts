import {
  Component, ElementRef, ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter, AfterViewInit, OnInit, OnDestroy, NgZone,
  HostListener, ChangeDetectorRef, Inject, Optional
} from '@angular/core';
import { PDF_ANNOTATOR_CONFIG, PdfAnnotatorConfig } from './tokens';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { timeout, retry } from 'rxjs/operators';
import { PDFDocument, rgb, degrees, setCharacterSpacing } from 'pdf-lib';
import * as fontkitModule from '@pdf-lib/fontkit';
import * as pdfjsLib from 'pdfjs-dist';
import { PdfManagerService, PdfHistoryEntry } from './pdf-manager.service';


interface TextBox {
  id: string;
  page: number;
  zIndex?: number;
  x: number;       // normalized 0..100
  y: number;       // normalized 0..100
  width: number;   // normalized 0..100
  height: number;  // normalized 0..100
  text: string;
  color: string;
  fontSize: number; // absolute PDF points (UI will scale by zoom)
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  fontFamily?: string;      // CSS font-family for screen display (PDF baking always uses THSarabunNew)
  opacity?: number;         // 0..1
  rotation?: number;        // degrees
  letterSpacing?: number;   // px, CSS letter-spacing
  lineHeight?: number;      // unitless multiplier, CSS line-height
}

interface StrokePoint {
  x: number; // normalized 0..1
  y: number; // normalized 0..1
  p: number; // pressure 0..1
}

interface Stroke {
  id: string;
  color: string;
  size: number;
  points: StrokePoint[];
  isHighlight?: boolean; // highlighter strokes
}

interface Shape {
  id: string;
  page: number;
  type: 'rect' | 'circle' | 'arrow' | 'line';
  startX: number; // normalized 0..1
  startY: number;
  endX: number;
  endY: number;
  color: string;      // stroke color
  size: number;       // stroke width
  fillColor?: string; // fill color (undefined = no fill)
}

interface ImageStamp {
  id: string;
  page: number;
  zIndex?: number;
  x: number; // 0..100
  y: number;
  width: number;
  height: number;
  dataUrl: string; // base64 image
  markType?: 'check' | 'cross' | 'dot';
  markColor?: string;
}

interface ShapeStamp {
  id: string;
  page: number;
  zIndex?: number;
  x: number;    // 0..100
  y: number;
  width: number;
  height: number;
  type: 'rect' | 'circle' | 'arrow' | 'line';
  strokeColor: string;
  strokeWidth: number; // px at viewWidth scale
  viewWidth: number;   // canvas.clientWidth when shape was drawn (for PDF scale)
  fillColor?: string;  // undefined = transparent fill
  // For line/arrow we also store the relative direction vector
  startFracX: number; // 0..1 within bounding box
  startFracY: number;
  endFracX: number;
  endFracY: number;
}

interface SignatureStamp {
  id: string;
  page: number;
  zIndex?: number;
  x: number; // 0..100
  y: number;
  width: number;
  height: number;
  dataUrl: string;
  digitalId?: string;
  signDate?: string;
  signTime?: string;
}

interface DateStamp {
  id: string;
  page: number;
  zIndex?: number;
  x: number; // 0..100
  y: number;
  text: string;
  color: string;
  fontSize: number;
}

interface PdfFormField {
  id: string;
  page: number;
  zIndex?: number;
  type: 'text' | 'checkbox' | 'radio';
  x: number; // 0..100
  y: number;
  width: number;
  height: number;
  fieldName: string;
  radioGroupName?: string;
  fontSize?: number;   // text fields only, default 12
  borderVisible?: boolean; // default true
}

// Saved signature from database
interface SavedSignature {
  id: number;
  user_id: string;
  signature_name: string;
  signature_data: string; // base64 PNG
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type ToolMode = 'none' | 'draw' | 'eraser' | 'highlight' | 'shape' | 'text' | 'signature' | 'date' | 'mark' | 'formfield';
export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

@Component({
  selector: 'app-pdf-annotator-modal',
  templateUrl: './pdf-annotator-modal.component.html',
  styleUrls: ['./pdf-annotator-modal.component.scss']
})
export class PdfAnnotatorModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() public pdfUrl!: string;
  @Input() public fileName?: string;
  @Input() public canManageGuide: boolean = false;

  @ViewChildren('pdfCanvas') public pdfCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChildren('annotCanvas') public annotCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChild('fileInput', { static: false }) public fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('stampFileInput', { static: false }) public stampFileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('viewerContainer', { static: false }) public viewerContainerRef!: ElementRef<HTMLDivElement>;

  // Context Menu state
  public contextMenu = {
    show: false,
    x: 0,
    y: 0,
    targetId: '',
    targetType: ''
  };

  // Tool modes
  public toolMode: ToolMode = 'none';
  public shapeType: 'rect' | 'circle' | 'arrow' | 'line' = 'rect';
  public showShapeMenu = false;
  public showShapeDropdown = false;

  public shapeNoStroke = false;

  // Shape-specific color settings (separate from brush)
  public shapeStrokeColor = '#000000';
  public shapeFillColor = '#ffffff';
  public shapeFillEnabled = false;
  public shapeStrokeSize = 2;

  // Mac Preview-style color swatches
  public readonly shapeColorSwatches = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#ffffff',
    '#ff0000', '#ff4500', '#ff9900', '#ffcc00', '#00b050', '#00b0f0', '#0070c0', '#7030a0',
    '#ff00ff', '#ff69b4', '#4169e1', '#20b2aa', '#228b22', '#8b4513', '#a0522d', '#dc143c'
  ];

  public readonly shapeFillSwatches = [
    '#ffffff', '#f2f2f2', '#e6e6e6', '#d9d9d9', '#cccccc', '#b7b7b7', '#999999', '#000000',
    '#ffcccc', '#ffe5cc', '#fffacc', '#ccffcc', '#ccf5ff', '#cce0ff', '#e5ccff', '#ffccf2',
    '#ff9999', '#ffcc99', '#ffff99', '#99ff99', '#99f2ff', '#99bbff', '#cc99ff', '#ff99ee'
  ];

  public brushColor = '#0000FF';
  public brushSize = 3;
  public highlightColor = '#ffff00';
  public highlightSize = 20;

  public eraserSize = 20;

  public pageNo = 1;
  public pageCount = 0;
  public pagesPerChunk = 10;
  public loadedUntilPage = 0;
  public isLoadingChunk = false;
  public zoom = 1; // 0.5 - 3
  public viewMode: 'single' | 'continuous' = 'single';
  public pages: number[] = []; // Array [1, 2, ..., pageCount]

  public isLoading = false;
  public loadingMessage = '';
  public saveProgress = 0;
  private renderingPages = new Set<number>();
  private renderedPages = new Set<number>();

  public textBoxes: TextBox[] = [];
  public imageStamps: ImageStamp[] = [];
  public shapeStamps: ShapeStamp[] = [];
  public signatureStamps: SignatureStamp[] = [];
  public dateStamps: DateStamp[] = [];
  public pdfFormFields: PdfFormField[] = [];
  private formFieldCounter = 0;
  public activeFormFieldId: string | null = null;

  // Modal & Preview States
  public showSignaturePad = false;
  public showSignaturePicker = false;
  public showPreviewOverlay = false;
  public previewUrl: SafeResourceUrl | null = null;
  public previewPages: string[] = []; // Array of base64 image URLs for preview
  public previewIsFiltered = false; // true when showing annotated-pages-only preview
  public previewTotalPages = 0;
  public isLoadingAllPreview = false;
  public pageThumbnails: string[] = []; // Array of base64 thumbnail images
  public showThumbnails = true; // Toggle for thumbnails sidebar
  private lastSavedBlob: Blob | null = null;
  private lastSavedFileName: string = '';

  @ViewChild('signatureCanvas', { static: false }) public signatureCanvasRef!: ElementRef<HTMLCanvasElement>;
  private signatureCtx: CanvasRenderingContext2D | null = null;
  private isDrawingSignature = false;
  private signaturePoints: { x: number; y: number }[] = [];
  private signatureStrokes: { points: { x: number; y: number }[]; color: string; size: number }[] = [];
  private bufferCanvas: HTMLCanvasElement | null = null;

  // Signature pen settings
  public signaturePenColor = '#000000';
  public signaturePenSize = 2.5;

  // Stamp Picker
  public showStampPickerModal = false;
  public showStampGenerator = false;
  public savedStamps: { id: any; name: string; type: string; dataUrl: string }[] = [];
  public stampGenType: 'receive' | 'custom' = 'receive';
  public stampGenText1 = '';
  public stampGenText2 = '';
  public stampGenText3 = '';
  public stampGenDocNo = '';
  public stampGenDate = '';
  public stampGenTime = '';
  public stampGenShowDocNo = true;
  public stampGenShowDate = true;
  public stampGenShowTime = true;
  public stampGenNoBorder = false;
  public stampGenColor = '#ef4444';
  public stampEditingId: any = null;
  public stampEditingName = '';
  public pendingStamp: { dataUrl: string; defaultWidth: number } | null = null;
  public stampGhostX = 0;
  public stampGhostY = 0;
  public stampGhostPage = 0;

  // Signature mode (draw vs type)
  public sigMode: 'draw' | 'type' = 'draw';
  public typedText = '';
  public typedFontIndex = 0;
  public readonly typedFontOptions = [
    { family: 'THSarabunNew, sans-serif', weight: '400', style: 'normal', label: 'ธรรมดา' },
    { family: 'THSarabunNew, sans-serif', weight: '700', style: 'normal', label: 'ตัวหนา' },
    { family: 'THSarabunNew, sans-serif', weight: '400', style: 'italic', label: 'เอียง' },
    { family: 'THSarabunNew, sans-serif', weight: '700', style: 'italic', label: 'หนา+เอียง' },
    { family: 'Georgia, serif', weight: '400', style: 'italic', label: 'Serif' },
  ];

  // Quick Mark Stamp settings
  public markType: 'check' | 'cross' | 'dot' = 'check';
  public formFieldType: 'text' | 'checkbox' | 'radio' = 'checkbox';
  public markColor = '#000000';
  public markSize = 32; // px at 100% zoom (will be scaled)
  public showMarkOptions = false;

  // Date Stamp Settings
  public dateColor = '#000000';
  public dateFontSize = 16;
  public showDateOptions = false;

  toggleDateOptions(): void {
    this.showDateOptions = !this.showDateOptions;
  }

  addDateStampAndShowOptions(): void {
    this.addDateStamp();
    this.showDateOptions = true;
  }

  setDateColor(color: string): void {
    this.dateColor = color;
    this.saveSettings();
  }

  changeDateFontSize(delta: number): void {
    const newSize = this.dateFontSize + delta;
    if (newSize >= 8 && newSize <= 100) {
      this.dateFontSize = newSize;
      this.saveSettings();
    }
  }

  // Saved Signatures (from database)
  public savedSignatures: SavedSignature[] = [];
  public isLoadingSignatures = false;
  @Input() public userId = '';
  @Input() public userName = '';
  @Input() public documentId: number | null = null;
  @Input() public detailId: any = '';
  @Input() public edocId: any = '';
  @Input() public isCancelMode: boolean = false;

  // Digital ID settings
  public showDigitalId = true;
  @ViewChild('signatureFileInput', { static: false }) public signatureFileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('thumbFileInput', { static: false }) public thumbFileInputRef!: ElementRef<HTMLInputElement>;

  // Thumbnail sidebar state
  public thumbInsertIndex = -1;    // -1 = closed; 0 = before page 1; i = after page i
  public thumbDropdownTargetIndex: number = -1;

  // ------------------------------------
  // User Guide Modal State
  // ------------------------------------
  public showUserGuidePanel = false;
  public isLoadingGuide = false;
  public isEditingGuide = false;
  public userGuideContent = '';
  public tempGuideContent = '';
  public thumbDropdownTop = 0;     // Fixed-position Y coord for insert dropdown
  private thumbInsertAtIndex = -1; // the slot index where file upload was triggered

  // ── History Panel ────────────────────────────────────────────────────────
  public showHistoryPanel = false;
  public historyEntries: PdfHistoryEntry[] = [];
  public isLoadingHistory = false;

  /** Log an action to the ruts-pdf history API (fire-and-forget) */
  private logHistory(
    actionType: PdfHistoryEntry['action_type'],
    detail: any = {},
    pageNumber?: number
  ): void {
    if (!this.documentId || !this.userId) return;
    this.pdfSvc.logAction({
      documentId: this.documentId,
      userId: this.userId,
      actionType,
      actionDetail: detail,
      pageNumber: pageNumber ?? this.pageNo,
      userName: this.userName,
    }).subscribe();
    // Also add to local panel immediately
    this.historyEntries.unshift({
      id: Date.now(),
      document_id: this.documentId,
      user_id: this.userId,
      action_type: actionType,
      action_detail: detail,
      page_number: pageNumber ?? this.pageNo,
      user_name: this.userName,
      user_position: '',
      ip_address: '',
      created_at: new Date().toISOString(),
    } as PdfHistoryEntry);
  }

  toggleHistoryPanel(): void {
    this.showHistoryPanel = !this.showHistoryPanel;
    if (this.showHistoryPanel && this.documentId && this.historyEntries.length === 0) {
      this.loadHistoryFromApi();
    }
  }

  // ── Page Flip (90° increments) ───────────────────────────────────────────
  // Visual rotation is applied as a CSS transform on each .page-container; the
  // angle is baked into the PDF (via setRotation) inside saveDocument().
  public pageFlips: { [page: number]: number } = {}; // 0, 90, 180, 270
  public showFlipPanel = false;
  public flipScope: 'current' | 'all' = 'current';

  /** Close all floating tool panels so only one is visible at a time */
  public closeAllPanels(except?: string): void {
    if (except !== 'flip') this.showFlipPanel = false;
    if (except !== 'watermark') this.showWatermarkPanel = false;
    if (except !== 'pageNumber') this.showPageNumberPanel = false;
    if (except !== 'deskew') this.showDeskewPanel = false;
    if (except !== 'split') this.showSplitPanel = false;
  }

  public toggleFlipPanel(): void {
    this.showFlipPanel = !this.showFlipPanel;
    if (this.showFlipPanel) {
      this.closeAllPanels('flip');
      this.showFlipPanel = true;
      this.toolMode = 'none';
      this.updateCursor();
    }
    this.cdr.detectChanges();
  }

  public closeFlipPanel(): void {
    this.showFlipPanel = false;
    this.cdr.detectChanges();
  }

  public getPageFlip(p: number): number {
    return this.pageFlips[p] || 0;
  }

  /** Rotate target page(s) by +90° (clockwise) */
  public flipPageCW(): void {
    this.applyFlipDelta(90);
  }

  /** Rotate target page(s) by -90° (counter-clockwise) */
  public flipPageCCW(): void {
    this.applyFlipDelta(270);
  }

  private applyFlipDelta(delta: number): void {
    if (this.flipScope === 'all') {
      for (const p of this.pages) this.pageFlips[p] = ((this.pageFlips[p] || 0) + delta) % 360;
    } else {
      this.pageFlips[this.pageNo] = ((this.pageFlips[this.pageNo] || 0) + delta) % 360;
    }
    this.cdr.detectChanges();
  }

  /** Set an absolute rotation angle (0/90/180/270) */
  public setFlipAngle(angle: number): void {
    if (this.flipScope === 'all') {
      for (const p of this.pages) this.pageFlips[p] = angle;
    } else {
      this.pageFlips[this.pageNo] = angle;
    }
    this.cdr.detectChanges();
  }

  // ============== Deskew (Page Straightening) ==============
  public pageRotations: { [page: number]: number } = {}; // fine-angle deskew, degrees
  public showDeskewPanel = false;

  /** Combined visual rotation = deskew + flip (used by the page-container CSS transform) */
  public getPageRotation(p: number): number {
    return (this.pageRotations[p] || 0) + (this.pageFlips[p] || 0);
  }

  public setPageRotation(p: number, angle: number): void {
    this.pageRotations[p] = angle;
    this.cdr.detectChanges();
  }

  public resetPageRotation(p: number): void {
    this.pageRotations[p] = 0;
    this.cdr.detectChanges();
  }

  public toggleDeskewPanel(): void {
    this.showDeskewPanel = !this.showDeskewPanel;
    if (this.showDeskewPanel) {
      this.closeAllPanels('deskew');
      this.showDeskewPanel = true;
      this.toolMode = 'none';
      this.activeTextBoxId = null;
    }
    this.cdr.detectChanges();
  }

  public closeDeskewPanel(): void {
    this.showDeskewPanel = false;
    this.cdr.detectChanges();
  }

  /**
   * Bake the in-progress deskew (pageRotations) into basePdfBytes immediately and
   * reload the viewer, so the user sees straightened content. 90° multiples use
   * setRotation; fine angles embed the page rotated (content tilts, annotations stay upright).
   */
  public async applyDeskew(): Promise<void> {
    if (!this.basePdfBytes) return;
    this.isLoading = true;
    this.loadingMessage = 'กำลังปรับหน้ากระดาษให้ตรง...';
    try {
      const pdfDoc = await PDFDocument.load(this.basePdfBytes);
      let modified = false;
      const totalPages = pdfDoc.getPageCount();

      for (let i = totalPages - 1; i >= 0; i--) {
        const pNum = i + 1;
        const rot = this.pageRotations[pNum];
        if (rot && rot !== 0) {
          modified = true;
          const oldPage = pdfDoc.getPage(i);
          if (rot % 90 === 0) {
            oldPage.setRotation(degrees(oldPage.getRotation().angle + rot));
          } else {
            const { width, height } = oldPage.getSize();
            const embeddedPage = await pdfDoc.embedPage(oldPage);
            const newPage = pdfDoc.insertPage(i + 1, [width, height]);
            const cropBox = oldPage.getCropBox();
            if (cropBox) newPage.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
            const rad = (rot * Math.PI) / 180;
            const cosVal = Math.cos(rad);
            const sinVal = Math.sin(rad);
            const dx = (-width / 2) * cosVal - (-height / 2) * sinVal;
            const dy = (-width / 2) * sinVal + (-height / 2) * cosVal;
            newPage.drawPage(embeddedPage, { x: (width / 2) + dx, y: (height / 2) + dy, rotate: degrees(rot) });
            pdfDoc.removePage(i);
          }
          this.pageRotations[pNum] = 0;
        }
      }

      if (modified) {
        const outBytes = await pdfDoc.save();
        this.basePdfBytes = outBytes.buffer.slice(outBytes.byteOffset, outBytes.byteOffset + outBytes.byteLength) as ArrayBuffer;

        // Pass a copy — pdf.js >=4 detaches the ArrayBuffer it receives.
        const loadingTask = (pdfjsLib as any).getDocument({ data: this.basePdfBytes.slice(0) });
        this.pdfDocProxy = await loadingTask.promise;
        this.pageCount = this.pdfDocProxy.numPages || 1;
        this.pages = Array.from({ length: this.pageCount }, (_, idx) => idx + 1);
        this.pages.forEach(p => this.ensurePage(p));

        const tmpDoc = await PDFDocument.load(this.basePdfBytes);
        tmpDoc.getPages().forEach((pg, idx) => {
          this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
          const cropBox = pg.getCropBox();
          const mediaBox = pg.getMediaBox();
          const effectiveBox = (cropBox.width > 0 && cropBox.height > 0 &&
            (cropBox.x !== mediaBox.x || cropBox.y !== mediaBox.y ||
             cropBox.width !== mediaBox.width || cropBox.height !== mediaBox.height))
            ? cropBox : mediaBox;
          this.pdfPageAspects.set(idx + 1, effectiveBox.width / effectiveBox.height);
        });

        this.renderedPages.clear();
        await this.renderAllPages();
      }
    } catch (e) {
      console.error('Error deskewing', e);
    } finally {
      this.isLoading = false;
      this.loadingMessage = '';
      this.closeDeskewPanel();
      this.cdr.detectChanges();
    }
  }

  // ============== Split PDF (export selected pages) ==============
  public showSplitPanel = false;
  public splitPageRange = '';

  public toggleSplitPanel(): void {
    this.showSplitPanel = !this.showSplitPanel;
    if (this.showSplitPanel) {
      this.closeAllPanels('split');
      this.showSplitPanel = true;
      this.splitPageRange = `1-${this.pageCount}`;
    }
    this.cdr.detectChanges();
  }

  /** Export the pages listed in splitPageRange (e.g. "1, 3, 5-10") as a new PDF download */
  public async executeSplitPdf(): Promise<void> {
    if (!this.basePdfBytes || !this.splitPageRange.trim()) return;

    const pagesToKeep = new Set<number>();
    const parts = this.splitPageRange.split(',');
    for (const p of parts) {
      const trimmed = p.trim();
      if (!trimmed) continue;
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        let start = parseInt(startStr, 10);
        let end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          if (start > end) { const tmp = start; start = end; end = tmp; }
          start = Math.max(1, start);
          end = Math.min(this.pageCount, end);
          for (let i = start; i <= end; i++) pagesToKeep.add(i);
        }
      } else {
        const page = parseInt(trimmed, 10);
        if (!isNaN(page) && page >= 1 && page <= this.pageCount) pagesToKeep.add(page);
      }
    }

    if (pagesToKeep.size === 0) {
      const toast = await this.toastCtrl.create({ message: 'รูปแบบหน้าไม่ถูกต้อง', duration: 2000, color: 'danger' });
      await toast.present();
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'กำลังแยกเอกสาร PDF...';
    try {
      const sourceDoc = await PDFDocument.load(this.basePdfBytes);
      const newDoc = await PDFDocument.create();
      const sortedPages = Array.from(pagesToKeep).sort((a, b) => a - b);
      const indicesToCopy = sortedPages.map(p => p - 1);
      const copiedPages = await newDoc.copyPages(sourceDoc, indicesToCopy);
      copiedPages.forEach(p => newDoc.addPage(p));

      const splitBytes = await newDoc.save();
      const blob = new Blob([splitBytes as any], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `split_${this.fileName || 'document'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      this.showSplitPanel = false;
      const toast = await this.toastCtrl.create({ message: `แยกเอกสารสำเร็จ (${sortedPages.length} หน้า)`, duration: 2000, color: 'success' });
      await toast.present();
    } catch (e) {
      console.error('Split PDF failed', e);
      const toast = await this.toastCtrl.create({ message: 'เกิดข้อผิดพลาดในการแยก PDF', duration: 3000, color: 'danger' });
      await toast.present();
    } finally {
      this.isLoading = false;
      this.loadingMessage = '';
      this.cdr.detectChanges();
    }
  }

  // ============== Watermark ==============
  public showWatermarkPanel = false;
  public watermark = {
    enabled: false,
    type: 'text' as 'text' | 'image',
    text: 'สำเนา',
    fontFamily: 'TH Sarabun New',
    fontSize: 40,
    color: '#999999',
    opacity: 30,        // 0-100
    rotation: 45,       // 0-360 degrees
    mode: 'tiled' as 'center' | 'tiled',
    spacingX: 200,      // px between repeats
    spacingY: 150,
    scope: 'all' as 'all' | 'current',
    imageDataUrl: ''    // for image watermark
  };

  public toggleWatermarkPanel(): void {
    this.showWatermarkPanel = !this.showWatermarkPanel;
    if (this.showWatermarkPanel) {
      this.closeAllPanels('watermark');
      this.showWatermarkPanel = true;
      this.toolMode = 'none';
    }
    this.cdr.detectChanges();
  }

  public closeWatermarkPanel(): void {
    this.showWatermarkPanel = false;
    this.cdr.detectChanges();
  }

  public applyWatermark(): void {
    this.watermark.enabled = true;
    this.showWatermarkPanel = false;
    this.cdr.detectChanges();
  }

  public removeWatermark(): void {
    this.watermark.enabled = false;
    this.cdr.detectChanges();
  }

  public onWatermarkImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.watermark.imageDataUrl = reader.result as string;
      this.watermark.type = 'image';
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  public getWatermarkPreviewStyle(pageNum: number): any {
    if (!this.watermark.enabled) return { display: 'none' };
    if (this.watermark.scope === 'current' && pageNum !== this.pageNo) return { display: 'none' };
    return { display: 'block' };
  }

  // ============== Page Numbers ==============
  public showPageNumberPanel = false;
  public pageNumber = {
    enabled: false,
    format: 'arabic' as 'arabic' | 'thai' | 'roman' | 'roman-upper',
    position: 'bottom-right' as 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right',
    mirror: false,            // สลับซ้าย-ขวาตามหน้าคี่/คู่ (สำหรับพิมพ์สองหน้า)
    showPrefix: true,
    prefixText: 'หน้า ',
    suffixText: '',
    fontFamily: 'TH Sarabun New',
    fontSize: 14,
    color: '#000000',
    startFrom: 1,
    startAtPage: 1,
    skipFirstPage: false,
    pageScope: 'all' as 'all' | 'odd' | 'even' | 'custom',
    customPages: '',
    // ── Header / Footer ──────────────────────
    headerText: '',
    headerPosition: 'top-center' as 'top-left' | 'top-center' | 'top-right',
    footerText: '',
    footerPosition: 'bottom-center' as 'bottom-left' | 'bottom-center' | 'bottom-right',
  };

  /** Parse custom page range like "1,3,5-10" into a Set */
  private parseCustomPageSet(input: string, maxPage: number): Set<number> {
    const pages = new Set<number>();
    if (!input || !input.trim()) return pages;
    const parts = input.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.includes('-')) {
        const [s, e] = trimmed.split('-');
        const start = parseInt(s.trim(), 10);
        const end = parseInt(e.trim(), 10);
        if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= maxPage && start <= end) {
          for (let i = start; i <= end; i++) pages.add(i);
        }
      } else {
        const num = parseInt(trimmed, 10);
        if (!isNaN(num) && num >= 1 && num <= maxPage) pages.add(num);
      }
    }
    return pages;
  }

  /** ตรวจสอบว่าหน้านี้ควรแสดงเลขหน้าหรือไม่ (p = physical page 1-based) */
  public shouldShowPageNum(p: number): boolean {
    if (!this.pageNumber.enabled) return false;
    const startAt = Number(this.pageNumber.startAtPage) || 1;
    const startFrom = Number(this.pageNumber.startFrom) || 1;
    if (p < startAt) return false;
    if (this.pageNumber.skipFirstPage && p === startAt) return false;
    const logicalPage = p - startAt + startFrom;
    switch (this.pageNumber.pageScope) {
      case 'odd':  return logicalPage % 2 !== 0;
      case 'even': return logicalPage % 2 === 0;
      case 'custom': {
        const customSet = this.parseCustomPageSet(this.pageNumber.customPages, this.pageCount);
        return customSet.has(p);
      }
      default: return true;
    }
  }

  private toRoman(n: number, upper: boolean): string {
    if (n <= 0 || n > 3999) return String(n);
    const vals  = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const romUp = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
    const romLo = ['m','cm','d','cd','c','xc','l','xl','x','ix','v','iv','i'];
    const syms = upper ? romUp : romLo;
    let result = '';
    for (let i = 0; i < vals.length; i++) {
      while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
    }
    return result;
  }

  private toThaiNumber(n: number): string {
    const thaiDigits = ['๐','๑','๒','๓','๔','๕','๖','๗','๘','๙'];
    return String(n).split('').map(d => thaiDigits[parseInt(d)] || d).join('');
  }

  public formatPageNum(p: number): string {
    const startAt = Number(this.pageNumber.startAtPage) || 1;
    const startFrom = Number(this.pageNumber.startFrom) || 1;
    const num = p - startAt + startFrom;
    let numStr: string;
    switch (this.pageNumber.format) {
      case 'thai':        numStr = this.toThaiNumber(num); break;
      case 'roman':       numStr = this.toRoman(num, false); break;
      case 'roman-upper': numStr = this.toRoman(num, true); break;
      default:            numStr = String(num);
    }
    const prefix = this.pageNumber.showPrefix ? (this.pageNumber.prefixText || '') : '';
    const suffix = this.pageNumber.suffixText || '';
    return prefix + numStr + suffix;
  }

  /** คำนวณตำแหน่ง — รองรับ mirror (สลับซ้าย-ขวาตามคี่/คู่) */
  public getEffectivePosition(p: number): string {
    let pos = this.pageNumber.position;
    if (this.pageNumber.mirror) {
      const startAt = Number(this.pageNumber.startAtPage) || 1;
      const startFrom = Number(this.pageNumber.startFrom) || 1;
      const logicalPage = p - startAt + startFrom;
      const isEven = logicalPage % 2 === 0;
      if (isEven) {
        if (pos.endsWith('right')) pos = pos.replace('right', 'left') as any;
        else if (pos.endsWith('left')) pos = pos.replace('left', 'right') as any;
      }
    }
    return pos;
  }

  public togglePageNumberPanel(): void {
    this.showPageNumberPanel = !this.showPageNumberPanel;
    if (this.showPageNumberPanel) {
      this.closeAllPanels('pageNumber');
      this.showPageNumberPanel = true;
      this.toolMode = 'none';
    }
    this.cdr.detectChanges();
  }

  public closePageNumberPanel(): void {
    this.showPageNumberPanel = false;
    this.cdr.detectChanges();
  }

  public applyPageNumbers(): void {
    this.pageNumber.enabled = true;
    this.showPageNumberPanel = false;
    this.cdr.detectChanges();
  }

  public removePageNumbers(): void {
    this.pageNumber.enabled = false;
    this.cdr.detectChanges();
  }

  public getPageNumPositionStyle(page?: number): any {
    const pos = page ? this.getEffectivePosition(page) : this.pageNumber.position;
    const style: any = { position: 'absolute', padding: '8px 14px', zIndex: 6, pointerEvents: 'none' };
    if (pos.startsWith('top')) style.top = '0';
    if (pos.startsWith('bottom')) style.bottom = '0';
    if (pos.endsWith('left')) { style.left = '0'; style.textAlign = 'left'; }
    if (pos.endsWith('center')) { style.left = '0'; style.right = '0'; style.textAlign = 'center'; }
    if (pos.endsWith('right')) { style.right = '0'; style.textAlign = 'right'; }
    return style;
  }

  private loadHistoryFromApi(): void {
    if (!this.documentId) return;
    this.isLoadingHistory = true;
    this.pdfSvc.getHistory(this.documentId, 100).subscribe({
      next: (res) => {
        this.historyEntries = res.data;
        this.isLoadingHistory = false;
      },
      error: () => { this.isLoadingHistory = false; },
    });
  }

  getHistoryActionIcon(type: string): string {
    const map: Record<string, string> = {
      sign: 'finger-print', text: 'text', draw: 'brush',
      highlight: 'color-fill-outline', shape: 'shapes-outline', image: 'image-outline',
      page_insert: 'add-circle-outline', page_delete: 'trash-outline',
      date_stamp: 'calendar', save: 'save-outline', upload: 'cloud-upload-outline', open: 'open-outline',
    };
    return map[type] || 'ellipse-outline';
  }

  getHistoryActionLabel(type: string): string {
    const map: Record<string, string> = {
      sign: 'ลงลายเซ็น', text: 'เพิ่มข้อความ', draw: 'วาด', highlight: 'ไฮไลท์',
      shape: 'รูปทรง', image: 'รูปภาพ', page_insert: 'แทรกหน้า', page_delete: 'ลบหน้า',
      date_stamp: 'วันที่', save: 'บันทึก', upload: 'นำเข้า', open: 'เปิดเอกสาร',
    };
    return map[type] || type;
  }

  // Insert blank page
  public showInsertMenu = false;
  public showThumbInsertMenu = false;
  public insertOrientation: 'portrait' | 'landscape' = 'portrait';

  // Page-operation undo stack (insert / delete page)
  private pageHistoryStack: {
    bytes: ArrayBuffer;
    pageNo: number;
    textBoxes: any[];
    imageStamps: any[];
    shapeStamps: any[];
    signatureStamps: any[];
    dateStamps: any[];
    pdfFormFields: any[];
    strokes: Record<number, any[]>;
    shapes: Record<number, any[]>;
    redoStack: Record<number, any[]>;
  }[] = [];

  public get canUndoPageOp(): boolean { return this.pageHistoryStack.length > 0; }

  private savePageSnapshot(): void {
    if (!this.basePdfBytes) return;
    // Deep-clone annotation arrays and records so mutations don't affect snapshot
    const cloneArr = <T>(a: T[]): T[] => a.map(x => ({ ...x }));
    const cloneRec = (r: Record<number, any[]>): Record<number, any[]> => {
      const out: Record<number, any[]> = {};
      for (const k of Object.keys(r)) out[Number(k)] = [...r[Number(k)]];
      return out;
    };
    this.pageHistoryStack.push({
      bytes: this.basePdfBytes.slice(0),
      pageNo: this.pageNo,
      textBoxes: cloneArr(this.textBoxes),
      imageStamps: cloneArr(this.imageStamps),
      shapeStamps: cloneArr(this.shapeStamps),
      signatureStamps: cloneArr(this.signatureStamps),
      dateStamps: cloneArr(this.dateStamps),
      pdfFormFields: cloneArr(this.pdfFormFields),
      strokes: cloneRec(this.strokes),
      shapes: cloneRec(this.shapes),
      redoStack: cloneRec(this.redoStack),
    });
    // Keep last 20 snapshots
    if (this.pageHistoryStack.length > 20) this.pageHistoryStack.shift();
  }

  async undoPageOp(): Promise<void> {
    const snapshot = this.pageHistoryStack.pop();
    if (!snapshot) return;
    this.showInsertMenu = false;
    this.isLoading = true;
    this.loadingMessage = 'กำลังย้อนกลับ...';
    this.cdr.detectChanges();
    try {
      this.basePdfBytes = snapshot.bytes;
      this.textBoxes = snapshot.textBoxes;
      this.imageStamps = snapshot.imageStamps;
      this.shapeStamps = snapshot.shapeStamps;
      this.signatureStamps = snapshot.signatureStamps;
      this.dateStamps = snapshot.dateStamps;
      this.pdfFormFields = snapshot.pdfFormFields || [];
      this.strokes = snapshot.strokes;
      this.shapes = snapshot.shapes;
      this.redoStack = snapshot.redoStack;

      const copy = this.basePdfBytes.slice(0);
      if (this.pdfDocProxy) { this.pdfDocProxy.destroy(); this.pdfDocProxy = null; }
      const loadingTask = (pdfjsLib as any).getDocument({ data: copy.slice(0) });
      this.pdfDocProxy = await loadingTask.promise;
      const prevCount = this.pageCount;
      this.pageCount = this.pdfDocProxy.numPages;
      this.syncLoadedWindow(prevCount);

      this.pdfPageAspects.clear();
      this.pdfPageRotations.clear();
      try {
        const tmpDoc = await PDFDocument.load(copy);
        tmpDoc.getPages().forEach((pg, idx) => {
          const { width, height } = pg.getSize();
          this.pdfPageAspects.set(idx + 1, width / height);
          this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
        });
      } catch (_) {}

      this.pageNo = Math.min(snapshot.pageNo, this.pageCount);
      this.renderedPages.clear();
      this.renderingPages.clear();
      await this.generateThumbnails();
      await this.renderAllPages();
      this.scrollToPage(this.pageNo);

      const toast = await this.toastCtrl.create({
        message: 'ย้อนกลับเรียบร้อยแล้ว',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    } catch (err) {
      console.error('undoPageOp error:', err);
    } finally {
      this.isLoading = false;
      this.loadingMessage = '';
      this.cdr.detectChanges();
    }
  }

  private strokes: Record<number, Stroke[]> = {};
  private shapes: Record<number, Shape[]> = {};
  private redoStack: Record<number, (Stroke | Shape)[]> = {};
  private activeStroke: Stroke | null = null;
  private activeShape: Shape | null = null;
  private activeCanvasRect: DOMRect | null = null;
  private activePointerId: number | null = null;
  public activeObjectId: string | null = null;
  public activeObjectType: 'text' | 'shape' | 'image' | 'signature' | 'date' | null = null;
  private activePointerType: string = '';
  private renderRequested = false;
  private isRenderingAll = false;
  private renderDebounceTimer: any = null;

  private isDragging = false;
  private dragTextBoxId: string | null = null;
  private dragOffsetX = 0;
  private dragOffsetY = 0;

  // Resize state
  private isResizing = false;
  private resizeTextBoxId: string | null = null;

  // Image drag state
  private isDraggingImage = false;
  private dragImageId: string | null = null;
  private isResizingImage = false;
  private resizeImageId: string | null = null;

  // ShapeStamp drag/resize state
  private isDraggingShape = false;
  private dragShapeId: string | null = null;
  private isResizingShape = false;
  private resizeShapeId: string | null = null;

  private resizeObserver: ResizeObserver | null = null;
  private isScrollNavigating = false;

  private basePdfBytes: ArrayBuffer | null = null;
  /** PDF page aspect ratios (width/height) per page number, populated at load time */
  private pdfPageAspects: Map<number, number> = new Map();
  /** PDF page rotations (0/90/180/270) per page number, populated at load time from pdf-lib */
  private pdfPageRotations: Map<number, number> = new Map();
  public revNo = 1;

  private pdfDocProxy: any = null;
  private currentViewport: any = null;

  // default text style
  public textColor = '#0000FF';
  public textFontSize = 16;
  public tbDefaultFontFamily = 'THSarabunNew';
  public tbDefaultBold = true;
  public tbDefaultItalic = false;
  public tbDefaultAlign: 'left' | 'center' | 'right' = 'left';
  public tbDefaultLetterSpacing = 0;
  public tbDefaultLineHeight = 1.4;
  public pendingSignatureDataUrl: string | null = null;

  public activeTextBoxId: string | null = null;
  lsDropOpenId: string | null = null;
  readonly lsPresets = [-3, -2, -1, 0, 1, 2, 3, 5, 8, 10];

  public get activeTextBox(): TextBox | null {
    return this.textBoxes.find(t => t.id === this.activeTextBoxId) || null;
  }

  public close(): void {
    this.unlockOrientation();
    this.closed.emit();
    this.dismissModal();
  }

  public get drawMode(): boolean { return this.toolMode === 'draw' || (this.toolMode === 'none' && this.activeObjectType === 'signature'); }
  public get eraserMode(): boolean { return this.toolMode === 'eraser'; }
  public get highlightMode(): boolean { return this.toolMode === 'highlight'; }
  public get shapeMode(): boolean { return this.toolMode === 'shape' || (this.toolMode === 'none' && this.activeObjectType === 'shape'); }
  public get textPlaceMode(): boolean { return this.toolMode === 'text' || (this.toolMode === 'none' && this.activeObjectType === 'text'); }
  private signaturesApiUrl: string;
  private stampsApiUrl: string;
  private pdfWorkerSrc: string;
  private fontUrl: string;
  private fontBoldUrl: string;

  // ── Outputs (for inline / non-modal usage) ───────────────────────────────
  // These fire alongside the legacy ModalController.dismiss(), so the component
  // works both as an Ionic modal and embedded directly in a host template.
  @Output() public closed = new EventEmitter<void>();
  @Output() public saved = new EventEmitter<{ blob: Blob | null; fileName: string; revNo: number }>();
  @Output() public loadError = new EventEmitter<{ message: string }>();

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private zone: NgZone,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private pdfSvc: PdfManagerService,
    @Optional() @Inject(PDF_ANNOTATOR_CONFIG) config: PdfAnnotatorConfig | null
  ) {
    this.signaturesApiUrl = config?.signaturesApiUrl ?? 'http://localhost:3500/api/signatures';
    this.stampsApiUrl = config?.stampsApiUrl ?? 'http://localhost:3500/api/stamps';
    this.pdfWorkerSrc = config?.pdfWorkerSrc ?? '/assets/pdf.worker.min.mjs';
    this.fontUrl = config?.fontUrl ?? '/assets/fonts/THSarabunNew.ttf';
    this.fontBoldUrl = config?.fontBoldUrl ?? '/assets/fonts/THSarabunNew Bold.ttf';
  }

  /** Dismiss the host Ionic modal if present; never throws when used inline. */
  private dismissModal(data?: any): void {
    this.modalCtrl.dismiss(data).catch(() => { /* not in a modal — inline usage */ });
  }

  ngOnInit(): void {
    this.strokes = {};
    this.shapes = {};
    this.redoStack = {};
    this.textBoxes = [];
    this.imageStamps = [];
    this.shapeStamps = [];
    this.signatureStamps = [];
    this.dateStamps = [];
    this.activeStroke = null;
    this.activeShape = null;
    this.activeTextBoxId = null;
    this.activeObjectId = null;
    this.activeObjectType = null;
    this.pendingSignatureDataUrl = null;
    this.toolMode = 'none';
    this.pageNo = 1;
    this.zoom = 1;

    this.savedSignatures = [];
    this.showSignaturePad = false;
    this.showSignaturePicker = false;
    this.showPreviewOverlay = false;
    this.previewUrl = null;
    this.lastSavedBlob = null;
    this.lastSavedFileName = '';
    this.isDrawingSignature = false;
    this.signaturePoints = [];
    this.signatureStrokes = [];
    this.isLoadingSignatures = false;

    this.isDragging = false;
    this.dragTextBoxId = null;
    this.isResizing = false;
    this.resizeTextBoxId = null;
    this.isDraggingImage = false;
    this.dragImageId = null;
    this.isResizingImage = false;
    this.resizeImageId = null;

    this.contextMenu.show = false;

    this.showShapeMenu = false;
    this.loadSettings(); // Restore user preferences
    this.cdr.detectChanges();
  }

  private readonly SETTINGS_KEY = 'esign_pdf_annotator_settings';

  private saveSettings(): void {
    const settings = {
      brushColor: this.brushColor,
      brushSize: this.brushSize,
      highlightColor: this.highlightColor,
      highlightSize: this.highlightSize,
      eraserSize: this.eraserSize,
      textColor: this.textColor,
      textFontSize: this.textFontSize,
      dateColor: this.dateColor,
      dateFontSize: this.dateFontSize,
      shapeType: this.shapeType,
      shapeStrokeColor: this.shapeStrokeColor,
      shapeFillColor: this.shapeFillColor,
      shapeFillEnabled: this.shapeFillEnabled,
      shapeStrokeSize: this.shapeStrokeSize,
      shapeNoStroke: this.shapeNoStroke,
      pagesPerChunk: this.pagesPerChunk,
      tbDefaultFontFamily: this.tbDefaultFontFamily,
      tbDefaultBold: this.tbDefaultBold,
      tbDefaultItalic: this.tbDefaultItalic,
      tbDefaultAlign: this.tbDefaultAlign,
      tbDefaultLetterSpacing: this.tbDefaultLetterSpacing,
      tbDefaultLineHeight: this.tbDefaultLineHeight,
    };
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem(this.SETTINGS_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        if (settings.brushColor) this.brushColor = settings.brushColor;
        if (settings.brushSize) this.brushSize = settings.brushSize;
        if (settings.highlightColor) this.highlightColor = settings.highlightColor;
        if (settings.highlightSize) this.highlightSize = settings.highlightSize;
        if (settings.eraserSize) this.eraserSize = settings.eraserSize;
        if (settings.textColor) this.textColor = settings.textColor;
        if (settings.textFontSize) this.textFontSize = settings.textFontSize;
        if (settings.dateColor) this.dateColor = settings.dateColor;
        if (settings.dateFontSize) this.dateFontSize = settings.dateFontSize;
        if (settings.shapeType) this.shapeType = settings.shapeType;
        if (settings.shapeStrokeColor) this.shapeStrokeColor = settings.shapeStrokeColor;
        if (settings.shapeFillColor) this.shapeFillColor = settings.shapeFillColor;
        if (settings.shapeFillEnabled !== undefined) this.shapeFillEnabled = settings.shapeFillEnabled;
        if (settings.shapeStrokeSize) this.shapeStrokeSize = settings.shapeStrokeSize;
        if (settings.shapeNoStroke !== undefined) this.shapeNoStroke = settings.shapeNoStroke;
        if (settings.pagesPerChunk) this.pagesPerChunk = settings.pagesPerChunk;
        if (settings.tbDefaultFontFamily) this.tbDefaultFontFamily = settings.tbDefaultFontFamily;
        if (settings.tbDefaultBold !== undefined) this.tbDefaultBold = settings.tbDefaultBold;
        if (settings.tbDefaultItalic !== undefined) this.tbDefaultItalic = settings.tbDefaultItalic;
        if (settings.tbDefaultAlign) this.tbDefaultAlign = settings.tbDefaultAlign;
        if (settings.tbDefaultLetterSpacing !== undefined) this.tbDefaultLetterSpacing = settings.tbDefaultLetterSpacing;
        if (settings.tbDefaultLineHeight !== undefined) this.tbDefaultLineHeight = settings.tbDefaultLineHeight;
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }
  }

  public get visibleTextBoxes(): TextBox[] { return this.getTextBoxesForPage(this.pageNo); }
  public get visibleImageStamps(): ImageStamp[] { return this.getImageStampsForPage(this.pageNo); }
  public get visibleSignatures(): SignatureStamp[] { return this.getSignatureStampsForPage(this.pageNo); }
  public get visibleDateStamps(): DateStamp[] { return this.getDateStampsForPage(this.pageNo); }

  public getTextBoxesForPage(p: number): TextBox[] { return this.textBoxes.filter(t => t.page === p); }
  public getImageStampsForPage(p: number): ImageStamp[] { return this.imageStamps.filter(i => i.page === p); }
  public getRegularImageStampsForPage(p: number): ImageStamp[] { return this.imageStamps.filter(i => i.page === p && !i.id.startsWith('mark_')); }
  public getMarkStampsForPage(p: number): ImageStamp[] { return this.imageStamps.filter(i => i.page === p && i.id.startsWith('mark_')); }
  public getShapeStampsForPage(p: number): ShapeStamp[] { return this.shapeStamps.filter(s => s.page === p); }
  public getSignatureStampsForPage(p: number): SignatureStamp[] { return this.signatureStamps.filter(s => s.page === p); }
  public getDateStampsForPage(p: number): DateStamp[] { return this.dateStamps.filter(d => d.page === p); }

  public getMarkSvgContent(markType: string | undefined, color: string | undefined): string {
    const c = color || '#000000';
    if (markType === 'check') {
      return `<polyline points="12,52 42,82 88,18" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    } else if (markType === 'cross') {
      return `<line x1="15" y1="15" x2="85" y2="85" stroke="${c}" stroke-width="10" stroke-linecap="round"/>` +
             `<line x1="85" y1="15" x2="15" y2="85" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`;
    } else {
      return `<circle cx="50" cy="50" r="38" fill="${c}"/>`;
    }
  }

  /** Lock screen orientation to portrait while annotating */
  private async lockOrientation(): Promise<void> {
    try {
      const orientation = (screen as any).orientation;
      if (orientation && orientation.lock) {
        await orientation.lock('portrait-primary');
      }
    } catch (_) {
      // Screen Orientation API not supported (e.g. iOS Safari) — ignore
    }
  }

  /** Unlock screen orientation when leaving the annotator */
  private unlockOrientation(): void {
    try {
      const orientation = (screen as any).orientation;
      if (orientation && orientation.unlock) {
        orientation.unlock();
      }
    } catch (_) { /* ignore */ }
  }

  async ngAfterViewInit(): Promise<void> {
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = this.pdfWorkerSrc;
    // Lock orientation to portrait so the PDF doesn't rotate during annotation
    this.lockOrientation();

    // Clear and reset canvases before loading new PDF
    this.pdfCanvases?.forEach(ref => {
      const canvas = ref.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 0;
        canvas.height = 0;
        canvas.style.width = '0px';
        canvas.style.height = '0px';
      }
    });

    this.annotCanvases?.forEach(ref => {
      const canvas = ref.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 0;
        canvas.height = 0;
        canvas.style.width = '0px';
        canvas.style.height = '0px';
      }
    });

    // Ensure state is clean
    this.strokes = {};
    this.shapes = {};
    this.redoStack = {};
    this.activeStroke = null;
    this.activeShape = null;
    this.activeObjectId = null;
    this.activeObjectType = null;

    await this.loadPdfBytesAndInitPdfjs();

    this.zone.runOutsideAngular(() => {
      this.setupResizeAutoRender();
    });

    await this.fitWidth();
    this.syncToolModeStyles();
  }

  private syncToolModeStyles(): void {
    // Set touch-action: none for ALL active tool modes to prevent iPad scroll
    const hasActiveTool = this.toolMode !== 'none';
    this.pages.forEach(p => {
      const canvas = this.getAnnotCanvas(p);
      if (canvas) {
        canvas.style.touchAction = hasActiveTool ? 'none' : 'auto';
      }
    });
    this.updateCursor();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) this.resizeObserver.disconnect();

    // Cleanup PDF.js document to free memory
    if (this.pdfDocProxy) {
      this.pdfDocProxy.destroy();
      this.pdfDocProxy = null;
    }

    // Clear all canvases to release memory
    this.pages.forEach(p => {
      const pdfCanvas = this.getPdfCanvas(p);
      const annotCanvas = this.getAnnotCanvas(p);
      if (pdfCanvas) {
        const ctx = pdfCanvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
        pdfCanvas.width = 0;
        pdfCanvas.height = 0;
      }
      if (annotCanvas) {
        const ctx = annotCanvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, annotCanvas.width, annotCanvas.height);
        annotCanvas.width = 0;
        annotCanvas.height = 0;
      }
    });

    // Clear data arrays
    this.pageThumbnails = [];
    this.basePdfBytes = null;
    this.strokes = {};
    this.shapes = {};
    this.textBoxes = [];
    this.imageStamps = [];
    this.shapeStamps = [];
    this.signatureStamps = [];
    this.dateStamps = [];
  }

  /* ================= Keyboard Shortcuts ================= */
  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: any): void {
    if (this.contextMenu.show) {
      const target = event.target as HTMLElement;
      if (!target.closest('.custom-context-menu')) {
        this.zone.run(() => {
          this.closeContextMenu();
          this.cdr.detectChanges();
        });
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    // Undo: Ctrl+Z or Cmd+Z
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.undo();
      return;
    }

    // Redo: Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z
    if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
      event.preventDefault();
      this.redo();
      return;
    }

    // Escape: exit modes
    if (event.key === 'Escape') {
      this.exitAllModes();
      return;
    }

    // Delete: remove active object
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const activeEl = document.activeElement;
      // Don't delete if user is typing in a textarea or input
      if (activeEl?.tagName === 'TEXTAREA' || activeEl?.tagName === 'INPUT') {
        return;
      }

      if (this.activeObjectId && this.activeObjectType) {
        if (this.activeObjectType === 'text') this.removeTextBox(this.activeObjectId);
        else if (this.activeObjectType === 'shape') this.removeShapeStamp(this.activeObjectId);
        else if (this.activeObjectType === 'image') this.removeImage(this.activeObjectId);
        else if (this.activeObjectType === 'signature') this.removeSignature(this.activeObjectId);
        else if (this.activeObjectType === 'date') this.removeDateStamp(this.activeObjectId);
        
        this.activeObjectId = null;
        this.activeObjectType = null;
      }
    }
  }

  exitAllModes(): void {
    this.toolMode = 'none';
    this.showShapeMenu = false;
    this.activeTextBoxId = null;
    this.activeObjectId = null;
    this.activeObjectType = null;
    this.pendingSignatureDataUrl = null;
    this.closeContextMenu();
    this.syncToolModeStyles(); // Reset touch-action so iPad can scroll/pan PDF again
    this.updateCursor();
  }

  /* ================= User Guide Methods ================= */
  toggleUserGuide(e?: Event): void {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.showUserGuidePanel = !this.showUserGuidePanel;
    if (this.showUserGuidePanel) {
      this.isEditingGuide = false;
      this.fetchGuideData();
    }
  }

  fetchGuideData(): void {
    // Simulate API fetch
    this.isLoadingGuide = true;
    setTimeout(() => {
      // Logic for actual API fetch goes here (e.g. this.accessProviders.postData(...))
      this.isLoadingGuide = false;
    }, 500);
  }

  editGuide(): void {
    if (!this.canManageGuide) return;
    this.tempGuideContent = this.userGuideContent;
    this.isEditingGuide = true;
  }

  cancelEditGuide(): void {
    this.isEditingGuide = false;
    this.tempGuideContent = '';
  }

  saveGuide(): void {
    // Simulate API save
    this.userGuideContent = this.tempGuideContent;
    this.isEditingGuide = false;
    
    // Call API here to save permanently
    // e.g. this.accessProviders.postData({ content: this.userGuideContent }, 'save_guide.php')...
  }

  /* ================= Context Menu Methods ================= */
  closeContextMenu(): void {
    if (this.contextMenu.show) {
      this.contextMenu.show = false;
      this.cdr.detectChanges();
    }
  }

  onContextMenu(e: MouseEvent, id: string, type: string): void {
    e.preventDefault();
    e.stopPropagation();
    
    // Auto-switch to select mode when right clicking to ensure smooth UX
    if (this.toolMode !== 'none') {
      this.setToolMode('none');
    }
    
    // Position menu exactly at mouse
    this.contextMenu.x = e.clientX;
    this.contextMenu.y = e.clientY;
    this.contextMenu.targetId = id;
    this.contextMenu.targetType = type;
    this.contextMenu.show = true;
    
    // Force UI update immediately to prevent "slow" feeling
    this.cdr.detectChanges();
  }

  private getContextTargetObject(): any {
    const id = this.contextMenu.targetId;
    switch (this.contextMenu.targetType) {
      case 'text': return this.textBoxes.find(t => t.id === id);
      case 'shape': return this.shapeStamps.find(s => s.id === id);
      case 'image': return this.imageStamps.find(i => i.id === id);
      case 'signature': return this.signatureStamps.find(s => s.id === id);
      case 'date': return this.dateStamps.find(d => d.id === id);
    }
    return null;
  }

  private getAllAnnotationsZIndices(): number[] {
    const all = [
      ...this.textBoxes, ...this.shapeStamps, ...this.imageStamps,
      ...this.signatureStamps, ...this.dateStamps
    ];
    return all.map(a => a.zIndex || 10);
  }

  contextBringToFront(): void {
    const obj = this.getContextTargetObject();
    if (obj) {
      const zs = this.getAllAnnotationsZIndices();
      const maxZ = zs.length ? Math.max(...zs) : 10;
      obj.zIndex = maxZ + 1;
      this.closeContextMenu();
      this.cdr.detectChanges();
    }
  }

  contextBringForward(): void {
    const obj = this.getContextTargetObject();
    if (obj) {
      obj.zIndex = (obj.zIndex || 10) + 1;
      this.closeContextMenu();
      this.cdr.detectChanges();
    }
  }

  contextSendBackward(): void {
    const obj = this.getContextTargetObject();
    if (obj) {
      obj.zIndex = (obj.zIndex || 10) - 1;
      this.closeContextMenu();
      this.cdr.detectChanges();
    }
  }

  contextSendToBack(): void {
    const obj = this.getContextTargetObject();
    if (obj) {
      const zs = this.getAllAnnotationsZIndices();
      const minZ = zs.length ? Math.min(...zs) : 10;
      obj.zIndex = Math.max(1, minZ - 1);
      this.closeContextMenu();
      this.cdr.detectChanges();
    }
  }

  deleteContextMenuTarget(): void {
    const id = this.contextMenu.targetId;
    switch (this.contextMenu.targetType) {
      case 'text': this.removeTextBox(id); break;
      case 'shape': this.removeShapeStamp(id); break;
      case 'image': this.removeImage(id); break;
      case 'signature': this.removeSignature(id); break;
      case 'date': this.removeDateStamp(id); break;
    }
    this.closeContextMenu();
  }

  /* ================= PDF load ================= */
  private async loadPdfBytesAndInitPdfjs(): Promise<void> {
    this.isLoading = true;
    this.loadingMessage = 'กำลังโหลด PDF...';

    try {
      const buffer = await this.http
        .get(this.pdfUrl, { responseType: 'arraybuffer' })
        .pipe(
          timeout(60000),
          retry(2)
        )
        .toPromise();

      if (!buffer) {
        throw new Error('ไม่สามารถโหลดไฟล์ PDF ได้');
      }

      this.basePdfBytes = buffer as ArrayBuffer;

      // pdf.js >=4 transfers (detaches) the ArrayBuffer passed as `data`.
      // Pass a copy so basePdfBytes stays usable for later edits/snapshots.
      const loadingTask = (pdfjsLib as any).getDocument({ data: (buffer as ArrayBuffer).slice(0) });
      this.pdfDocProxy = await loadingTask.promise;
      this.pageCount = this.pdfDocProxy.numPages || 1;

      // Initialize annotation data for ALL pages upfront
      for (let p = 1; p <= this.pageCount; p++) this.ensurePage(p);

      // Only render first chunk in the DOM
      this.loadedUntilPage = Math.min(this.pagesPerChunk, this.pageCount);
      this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);

      // Store PDF page aspect ratios and rotations for correct rendering and stamp calculation
      try {
        const tmpDoc = await PDFDocument.load(buffer as ArrayBuffer);
        tmpDoc.getPages().forEach((pg, idx) => {
          const { width, height } = pg.getSize();
          this.pdfPageAspects.set(idx + 1, width / height);
          // Store rotation so renderPage can force correct landscape/portrait viewport
          this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
        });
      } catch (_) {
        // Fallback: aspect ratios will be computed from canvas at placement time
      }

      // Generate thumbnails after loading PDF
      await this.generateThumbnails();
    } catch (error: any) {
      console.error('Error loading PDF:', error);

      const isTimeout = error?.name === 'TimeoutError';
      const isNetwork = error?.status === 0;
      const is404 = error?.status === 404;
      let msg = 'ไม่สามารถโหลด PDF ได้ กรุณาลองใหม่อีกครั้ง';
      if (isTimeout) msg = 'โหลด PDF หมดเวลา (Timeout) กรุณาตรวจสอบการเชื่อมต่อ';
      else if (isNetwork) msg = 'ไม่สามารถเชื่อมต่อ Server ได้ กรุณาตรวจสอบเครือข่าย';
      else if (is404) msg = 'ไม่พบไฟล์ PDF บน Server กรุณาติดต่อผู้ดูแลระบบ';

      const toast = await this.toastCtrl.create({
        message: msg,
        duration: 4000,
        color: 'danger',
        position: 'middle'
      });
      await toast.present();

      this.unlockOrientation();
      this.loadError.emit({ message: msg });
      this.dismissModal({ error: true, message: msg });
    } finally {
      this.isLoading = false;
      this.loadingMessage = '';
    }
  }

  async generateThumbnails(): Promise<void> {
    if (!this.pdfDocProxy) return;
    // กัน loadNextChunk/setPagesPerChunk วิ่งแทรกระหว่าง rebuild — ไม่งั้นมันจะ append ลง
    // pageThumbnails กลางคันทำให้ index เพี้ยน (thumbnail โชว์คนละหน้ากับ viewer หลังแทรก/ลบหน้า)
    const wasLoadingChunk = this.isLoadingChunk;
    this.isLoadingChunk = true;
    try {
      this.pageThumbnails = [];
      await this.generateThumbnailsRange(1, this.loadedUntilPage);
    } finally {
      this.isLoadingChunk = wasLoadingChunk;
    }
  }

  private async generateThumbnailsRange(from: number, to: number): Promise<void> {
    if (!this.pdfDocProxy) return;
    const scale = 0.2;
    for (let i = from; i <= to; i++) {
      const page = await this.pdfDocProxy.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      this.pageThumbnails.push(canvas.toDataURL('image/png'));
    }
  }

  /**
   * ปรับขอบเขตหน้าที่โหลด (loadedUntilPage) หลังจำนวนหน้าเปลี่ยน (แทรก/ลบ)
   * ขยับ window ตาม delta เพื่อให้หน้าที่แทรกใหม่อยู่ในช่วงที่แสดง และครอบคลุมหน้าปัจจุบันเสมอ
   * แต่ "จำกัดไม่ให้ขยายเกิน 1 chunk เหนือหน้าปัจจุบัน" — ไม่งั้นการแทรกไฟล์ใหญ่ (หลายสิบหน้า)
   * จะทำให้ renderAllPages เรนเดอร์ทุกหน้าพร้อมกันจนค้าง หน้าที่เหลือจะ lazy-load ตอนเลื่อน
   * แล้วสร้าง DOM ของหน้าใหม่ก่อน (detectChanges) เพื่อให้ renderAllPages หา canvas เจอ
   */
  private syncLoadedWindow(prevCount: number): void {
    const delta = this.pageCount - prevCount;
    let next = this.loadedUntilPage + delta;
    next = Math.min(next, this.pageCount);
    next = Math.max(next, Math.min(this.pageNo, this.pageCount), 1);
    // เพดาน: หน้าปัจจุบัน + 1 chunk (เมื่อเลือก "ทั้งหมด" pagesPerChunk = pageCount จึงโหลดครบตามตั้งใจ)
    const cap = Math.min(this.pageCount, Math.max(this.pageNo, 1) + this.pagesPerChunk);
    next = Math.min(next, cap);
    this.loadedUntilPage = next;
    this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
    this.pages.forEach(p => this.ensurePage(p));
    this.cdr.detectChanges();
  }

  async setPagesPerChunk(n: number): Promise<void> {
    if (this.isLoadingChunk || !this.pdfDocProxy) return;
    this.pagesPerChunk = n === 0 ? this.pageCount : n;
    this.isLoadingChunk = true;

    const newEnd = Math.min(this.pagesPerChunk, this.pageCount);
    const prevEnd = this.loadedUntilPage;

    if (newEnd > prevEnd) {
      await this.generateThumbnailsRange(prevEnd + 1, newEnd);
      for (let p = prevEnd + 1; p <= newEnd; p++) this.pages.push(p);
    } else if (newEnd < prevEnd) {
      this.pages = Array.from({ length: newEnd }, (_, i) => i + 1);
      this.renderedPages = new Set([...this.renderedPages].filter(p => p <= newEnd));
    }

    this.loadedUntilPage = newEnd;
    this.isLoadingChunk = false;
    this.saveSettings();
    this.cdr.detectChanges();

    for (let p = Math.max(prevEnd + 1, 1); p <= newEnd; p++) await this.renderPage(p);
  }

  async loadNextChunk(): Promise<void> {
    // หยุดโหลด chunk ระหว่างมี page operation ค้างอยู่ (แทรก/ลบ/ย้อนกลับ/สลับหน้า) — กัน race กับ rebuild thumbnail
    if (this.isLoadingChunk || this.isLoading || this.loadedUntilPage >= this.pageCount) return;
    this.isLoadingChunk = true;

    const newEnd = Math.min(this.loadedUntilPage + this.pagesPerChunk, this.pageCount);
    const prevEnd = this.loadedUntilPage;

    await this.generateThumbnailsRange(prevEnd + 1, newEnd);

    for (let p = prevEnd + 1; p <= newEnd; p++) this.pages.push(p);
    this.loadedUntilPage = newEnd;

    this.cdr.detectChanges();
    await new Promise(r => setTimeout(r, 50));

    for (let p = prevEnd + 1; p <= newEnd; p++) await this.renderPage(p);

    this.isLoadingChunk = false;
  }

  goToPage(pageNum: number): void {
    if (pageNum < 1 || pageNum > this.pageCount) return;
    this.pageNo = pageNum;
    this.scrollToPage(this.pageNo);
    // Re-fit width in case new page has different orientation (landscape vs portrait)
    this.fitWidth();
  }

  toggleThumbnails(): void {
    this.showThumbnails = !this.showThumbnails;
    this.cdr.detectChanges();
  }

  /* ================= Insert Blank Page ================= */
  async insertBlankPage(where: 'before' | 'after'): Promise<void> {
    if (!this.basePdfBytes) return;
    this.showInsertMenu = false;
    this.isLoading = true;
    this.loadingMessage = 'กำลังแทรกหน้าเปล่า...';
    this.savePageSnapshot(); // บันทึก snapshot ก่อนแก้ไข
    this.cdr.detectChanges();

    try {
      const pdfDoc = await PDFDocument.load(this.basePdfBytes);
      const pages = pdfDoc.getPages();
      const refPage = pages[this.pageNo - 1];
      const { width, height } = refPage.getSize();

      // Determine page dimensions based on chosen orientation
      let pageW: number;
      let pageH: number;
      if (this.insertOrientation === 'landscape') {
        pageW = Math.max(width, height);
        pageH = Math.min(width, height);
      } else {
        pageW = Math.min(width, height);
        pageH = Math.max(width, height);
      }

      const insertIndex = where === 'before' ? this.pageNo - 1 : this.pageNo;
      pdfDoc.insertPage(insertIndex, [pageW, pageH]);

      const newBytes = await pdfDoc.save();
      this.basePdfBytes = newBytes.buffer as ArrayBuffer;

      // Shift annotations that are on pages >= insertIndex+1
      const shiftPage = insertIndex + 1; // 1-based page number of first shifted page
      const shiftAnnotations = <T extends { page: number }>(arr: T[]): T[] =>
        arr.map(a => a.page >= shiftPage ? { ...a, page: a.page + 1 } : a);

      this.textBoxes = shiftAnnotations(this.textBoxes);
      this.imageStamps = shiftAnnotations(this.imageStamps);
      this.shapeStamps = shiftAnnotations(this.shapeStamps);
      this.signatureStamps = shiftAnnotations(this.signatureStamps);
      this.dateStamps = shiftAnnotations(this.dateStamps);
      this.pdfFormFields = shiftAnnotations(this.pdfFormFields);

      // Shift stroke/shape records
      const shiftRecord = (rec: Record<number, any[]>): Record<number, any[]> => {
        const next: Record<number, any[]> = {};
        for (const key of Object.keys(rec)) {
          const p = Number(key);
          next[p >= shiftPage ? p + 1 : p] = rec[p];
        }
        return next;
      };
      this.strokes = shiftRecord(this.strokes);
      this.shapes = shiftRecord(this.shapes);
      this.redoStack = shiftRecord(this.redoStack);

      // Reload pdfjs
      const copy = this.basePdfBytes.slice(0);
      if (this.pdfDocProxy) { this.pdfDocProxy.destroy(); this.pdfDocProxy = null; }
      const loadingTask = (pdfjsLib as any).getDocument({ data: copy.slice(0) });
      this.pdfDocProxy = await loadingTask.promise;
      const prevCount = this.pageCount;
      this.pageCount = this.pdfDocProxy.numPages;
      this.syncLoadedWindow(prevCount);

      // Refresh aspect ratios & rotations
      this.pdfPageAspects.clear();
      this.pdfPageRotations.clear();
      try {
        const tmpDoc = await PDFDocument.load(copy);
        tmpDoc.getPages().forEach((pg, idx) => {
          const { width: w, height: h } = pg.getSize();
          this.pdfPageAspects.set(idx + 1, w / h);
          this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
        });
      } catch (_) {}

      // Navigate to the new blank page
      this.pageNo = insertIndex + 1;
      this.renderedPages.clear();
      this.renderingPages.clear();
      await this.generateThumbnails();
      await this.renderAllPages();
      this.scrollToPage(this.pageNo);

      const toast = await this.toastCtrl.create({
        message: `แทรกหน้าเปล่า${this.insertOrientation === 'portrait' ? 'แนวตั้ง' : 'แนวนอน'}ที่หน้า ${this.pageNo} เรียบร้อยแล้ว`,
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
      // Log to history
      this.logHistory('page_insert', { where, orientation: this.insertOrientation, insertedAt: this.pageNo }, this.pageNo);
    } catch (err) {
      console.error('insertBlankPage error:', err);
      const toast = await this.toastCtrl.create({
        message: 'เกิดข้อผิดพลาดในการแทรกหน้า',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    } finally {
      this.isLoading = false;
      this.loadingMessage = '';
      this.cdr.detectChanges();
    }
  }

  /* ================= Delete Current Page ================= */
  async deletePage(): Promise<void> {
    if (!this.basePdfBytes || this.pageCount <= 1) return;
    this.showInsertMenu = false;

    // Confirm before deleting
    const alert = await this.alertCtrl.create({
      header: 'ลบหน้าเอกสาร',
      message: `ต้องการลบหน้าที่ ${this.pageNo} ใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้`,
      buttons: [
        { text: 'ยกเลิก', role: 'cancel' },
        {
          text: 'ลบหน้า',
          role: 'destructive',
          cssClass: 'alert-btn-danger',
          handler: () => this.doDeletePage()
        }
      ]
    });
    await alert.present();
  }

  private async doDeletePage(): Promise<void> {
    if (!this.basePdfBytes) return;
    this.isLoading = true;
    this.loadingMessage = 'กำลังลบหน้า...';
    this.savePageSnapshot(); // บันทึก snapshot ก่อนลบ
    this.cdr.detectChanges();

    try {
      const pdfDoc = await PDFDocument.load(this.basePdfBytes);
      const deleteIndex = this.pageNo - 1;  // 0-based
      pdfDoc.removePage(deleteIndex);

      const newBytes = await pdfDoc.save();
      this.basePdfBytes = newBytes.buffer as ArrayBuffer;

      // Remove annotations on the deleted page; shift pages above it down
      const deletedPage = this.pageNo;
      const filterAndShift = <T extends { page: number }>(arr: T[]): T[] =>
        arr
          .filter(a => a.page !== deletedPage)
          .map(a => a.page > deletedPage ? { ...a, page: a.page - 1 } : a);

      this.textBoxes = filterAndShift(this.textBoxes);
      this.imageStamps = filterAndShift(this.imageStamps);
      this.shapeStamps = filterAndShift(this.shapeStamps);
      this.signatureStamps = filterAndShift(this.signatureStamps);
      this.dateStamps = filterAndShift(this.dateStamps);
      this.pdfFormFields = filterAndShift(this.pdfFormFields);

      // Shift stroke/shape records
      const shiftDeleteRecord = (rec: Record<number, any[]>): Record<number, any[]> => {
        const next: Record<number, any[]> = {};
        for (const key of Object.keys(rec)) {
          const p = Number(key);
          if (p === deletedPage) continue;  // drop deleted page
          next[p > deletedPage ? p - 1 : p] = rec[p];
        }
        return next;
      };
      this.strokes = shiftDeleteRecord(this.strokes);
      this.shapes = shiftDeleteRecord(this.shapes);
      this.redoStack = shiftDeleteRecord(this.redoStack);

      // Reload pdfjs
      const copy = this.basePdfBytes.slice(0);
      if (this.pdfDocProxy) { this.pdfDocProxy.destroy(); this.pdfDocProxy = null; }
      const loadingTask = (pdfjsLib as any).getDocument({ data: copy.slice(0) });
      this.pdfDocProxy = await loadingTask.promise;
      const prevCount = this.pageCount;
      this.pageCount = this.pdfDocProxy.numPages;
      this.syncLoadedWindow(prevCount);

      // Refresh aspect ratios & rotations
      this.pdfPageAspects.clear();
      this.pdfPageRotations.clear();
      try {
        const tmpDoc = await PDFDocument.load(copy);
        tmpDoc.getPages().forEach((pg, idx) => {
          const { width, height } = pg.getSize();
          this.pdfPageAspects.set(idx + 1, width / height);
          this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
        });
      } catch (_) {}

      // Navigate to the previous page (or page 1 if we deleted page 1)
      this.pageNo = Math.min(deletedPage, this.pageCount);
      this.renderedPages.clear();
      this.renderingPages.clear();
      await this.generateThumbnails();
      await this.renderAllPages();
      this.scrollToPage(this.pageNo);

      const toast = await this.toastCtrl.create({
        message: `ลบหน้าที่ ${deletedPage} เรียบร้อยแล้ว`,
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    } catch (err) {
      console.error('deletePage error:', err);
      const toast = await this.toastCtrl.create({
        message: 'เกิดข้อผิดพลาดในการลบหน้า',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    } finally {
      this.isLoading = false;
      this.loadingMessage = '';
      this.cdr.detectChanges();
    }
  }

  /* ================= Thumbnail Sidebar Wrappers ================= */

  toggleThumbInsert(idx: number, event?: MouseEvent): void {
    if (this.thumbInsertIndex === idx) {
      this.thumbInsertIndex = -1;
      this.cdr.detectChanges();
      return;
    }
    this.thumbInsertIndex = idx;
    if (event && event.currentTarget) {
      const btn = event.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      // Center the dropdown vertically on the button
      this.thumbDropdownTop = rect.top + rect.height / 2;
    }
    this.cdr.detectChanges();
  }

  /** Insert a blank page at `afterIndex` (0 = before page 1, n = after page n) */
  async insertAtThumb(afterIndex: number, orientation: 'portrait' | 'landscape'): Promise<void> {
    this.thumbInsertIndex = -1;
    if (!this.basePdfBytes) return;
    // Navigate to the page around which we are inserting so insertBlankPage works correctly
    this.insertOrientation = orientation;
    // insertBlankPage uses this.pageNo; afterIndex=0 means before page 1
    if (afterIndex === 0) {
      this.pageNo = 1;
      await this.insertBlankPage('before');
    } else {
      this.pageNo = afterIndex;
      await this.insertBlankPage('after');
    }
  }

  triggerThumbFileUpload(afterIndex: number): void {
    this.thumbInsertIndex = -1;
    this.thumbInsertAtIndex = afterIndex;
    this.cdr.detectChanges();
    if (this.thumbFileInputRef) {
      this.thumbFileInputRef.nativeElement.value = '';
      this.thumbFileInputRef.nativeElement.click();
    }
  }

  async onThumbFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0] || !this.basePdfBytes) return;
    const file = input.files[0];
    // Navigate to the correct insert position then trigger image upload
    if (this.thumbInsertAtIndex === 0) {
      this.pageNo = 1;
    } else {
      this.pageNo = this.thumbInsertAtIndex;
    }
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = (e.target as FileReader).result as string;
        // Place as full-page image stamp on the target page
        if (this.thumbInsertAtIndex === 0) {
          await this.insertBlankPage('before');
        } else {
          await this.insertBlankPage('after');
        }
        // Add image stamp on the newly inserted page
        const newPage = this.thumbInsertAtIndex === 0 ? 1 : this.thumbInsertAtIndex + 1;
        const stamp = {
          id: 'img_' + Date.now() + '_' + Math.random().toString(16).slice(2),
          page: newPage, x: 0, y: 0, width: 100, height: 100, dataUrl
        };
        this.imageStamps.push(stamp);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      this.isLoading = true;
      this.loadingMessage = 'กำลังแทรกไฟล์ PDF...';
      this.savePageSnapshot();
      this.cdr.detectChanges();
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const importedPdf = await PDFDocument.load(arrayBuffer);
        const mainPdf = await PDFDocument.load(this.basePdfBytes);

        const importedPages = await mainPdf.copyPages(importedPdf, importedPdf.getPageIndices());
        
        // thumbInsertAtIndex is 0 to insert before page 1, or page number to insert after
        const insertIndex = this.thumbInsertAtIndex; 
        
        let currentIndex = insertIndex;
        for (const page of importedPages) {
          mainPdf.insertPage(currentIndex, page);
          currentIndex++;
        }

        const newBytes = await mainPdf.save();
        this.basePdfBytes = newBytes.buffer as ArrayBuffer;

        const insertedCount = importedPages.length;
        
        // Shift annotations that are on pages >= insertIndex+1
        const shiftPage = insertIndex + 1;
        const shiftAnnotations = <T extends { page: number }>(arr: T[]): T[] =>
          arr.map(a => a.page >= shiftPage ? { ...a, page: a.page + insertedCount } : a);

        this.textBoxes = shiftAnnotations(this.textBoxes);
        this.imageStamps = shiftAnnotations(this.imageStamps);
        this.shapeStamps = shiftAnnotations(this.shapeStamps);
        this.signatureStamps = shiftAnnotations(this.signatureStamps);
        this.dateStamps = shiftAnnotations(this.dateStamps);
        this.pdfFormFields = shiftAnnotations(this.pdfFormFields);

        const shiftRecord = (rec: Record<number, any[]>): Record<number, any[]> => {
          const next: Record<number, any[]> = {};
          for (const key of Object.keys(rec)) {
            const p = Number(key);
            next[p >= shiftPage ? p + insertedCount : p] = rec[p];
          }
          return next;
        };
        this.strokes = shiftRecord(this.strokes);
        this.shapes = shiftRecord(this.shapes);
        this.redoStack = shiftRecord(this.redoStack);

        // Reload pdfjs
        const copy = this.basePdfBytes.slice(0);
        if (this.pdfDocProxy) { this.pdfDocProxy.destroy(); this.pdfDocProxy = null; }
        const loadingTask = (pdfjsLib as any).getDocument({ data: copy.slice(0) });
        this.pdfDocProxy = await loadingTask.promise;
        const prevCount = this.pageCount;
        this.pageCount = this.pdfDocProxy.numPages;
        this.syncLoadedWindow(prevCount);

        this.pdfPageAspects.clear();
        this.pdfPageRotations.clear();
        try {
          const tmpDoc = await PDFDocument.load(copy);
          tmpDoc.getPages().forEach((pg, idx) => {
            const { width: w, height: h } = pg.getSize();
            this.pdfPageAspects.set(idx + 1, w / h);
            this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
          });
        } catch (_) {}

        this.pageNo = shiftPage;
        this.renderedPages.clear();
        this.renderingPages.clear();
        await this.generateThumbnails();
        await this.renderAllPages();
        this.scrollToPage(this.pageNo);

        const toast = await this.toastCtrl.create({
          message: `แทรกไฟล์ PDF จำนวน ${insertedCount} หน้าเรียบร้อยแล้ว`,
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
        
        this.logHistory('page_insert', { where: 'pdf_file', insertedAt: shiftPage, count: insertedCount }, shiftPage);

      } catch (err) {
        console.error('insert PDF error:', err);
        const toast = await this.toastCtrl.create({
          message: 'เกิดข้อผิดพลาดในการแทรกไฟล์ PDF',
          duration: 2000,
          color: 'danger',
          position: 'bottom'
        });
        await toast.present();
      } finally {
        this.isLoading = false;
        this.loadingMessage = '';
        if (this.thumbFileInputRef) {
          this.thumbFileInputRef.nativeElement.value = '';
        }
        this.cdr.detectChanges();
      }
    } else {
      const toast = await this.toastCtrl.create({
        message: 'รองรับเฉพาะไฟล์รูปภาพและเอกสาร PDF ในขณะนี้',
        duration: 2500, color: 'warning', position: 'bottom'
      });
      await toast.present();
    }
  }

  // ── Drag-to-reorder state ──────────────────────────────────────────
  thumbDragFromIndex: number | null = null;
  thumbDragOverIndex: number | null = null;

  onThumbDragStart(i: number): void {
    this.thumbDragFromIndex = i;
    this.cdr.detectChanges();
  }

  onThumbDragOver(i: number): void {
    if (this.thumbDragFromIndex === null || i === this.thumbDragFromIndex) return;
    this.thumbDragOverIndex = i;
    this.cdr.detectChanges();
  }

  onThumbDragLeave(): void {
    this.thumbDragOverIndex = null;
    this.cdr.detectChanges();
  }

  async onThumbDrop(i: number): Promise<void> {
    const from = this.thumbDragFromIndex;
    this.thumbDragFromIndex = null;
    this.thumbDragOverIndex = null;
    if (from === null || from === i) { this.cdr.detectChanges(); return; }
    await this.reorderPage(from + 1, i + 1);
  }

  onThumbDragEnd(): void {
    this.thumbDragFromIndex = null;
    this.thumbDragOverIndex = null;
    this.cdr.detectChanges();
  }

  async reorderPage(fromPage: number, toPage: number): Promise<void> {
    if (!this.basePdfBytes || fromPage === toPage) return;
    this.savePageSnapshot();
    this.isLoading = true;
    this.loadingMessage = 'กำลังย้ายหน้า...';
    this.cdr.detectChanges();
    try {
      const pdfDoc = await PDFDocument.load(this.basePdfBytes);
      const fromIdx = fromPage - 1;
      const toIdx = toPage - 1;

      const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [fromIdx]);
      pdfDoc.removePage(fromIdx);
      const insertAt = fromIdx < toIdx ? toIdx : toIdx;
      pdfDoc.insertPage(insertAt, copiedPage);

      const newBytes = await pdfDoc.save();
      this.basePdfBytes = newBytes.buffer as ArrayBuffer;

      // Shift annotation page numbers between fromPage and toPage
      const shiftAnnot = <T extends { page: number }>(arr: T[]): T[] =>
        arr.map(a => {
          if (a.page === fromPage) return { ...a, page: toPage };
          if (fromPage < toPage && a.page > fromPage && a.page <= toPage)
            return { ...a, page: a.page - 1 };
          if (fromPage > toPage && a.page >= toPage && a.page < fromPage)
            return { ...a, page: a.page + 1 };
          return a;
        });
      this.textBoxes      = shiftAnnot(this.textBoxes);
      this.imageStamps    = shiftAnnot(this.imageStamps);
      this.shapeStamps    = shiftAnnot(this.shapeStamps);
      this.signatureStamps = shiftAnnot(this.signatureStamps);
      this.dateStamps     = shiftAnnot(this.dateStamps);
      this.pdfFormFields  = shiftAnnot(this.pdfFormFields);

      const shiftRecord = (rec: Record<number, any[]>): Record<number, any[]> => {
        const next: Record<number, any[]> = {};
        for (const k of Object.keys(rec)) {
          const p = Number(k);
          if (p === fromPage) next[toPage] = rec[p];
          else if (fromPage < toPage && p > fromPage && p <= toPage) next[p - 1] = rec[p];
          else if (fromPage > toPage && p >= toPage && p < fromPage) next[p + 1] = rec[p];
          else next[p] = rec[p];
        }
        return next;
      };
      this.strokes   = shiftRecord(this.strokes);
      this.shapes    = shiftRecord(this.shapes);
      this.redoStack = shiftRecord(this.redoStack);

      const copy = this.basePdfBytes.slice(0);
      if (this.pdfDocProxy) { this.pdfDocProxy.destroy(); this.pdfDocProxy = null; }
      const loadingTask = (pdfjsLib as any).getDocument({ data: copy.slice(0) });
      this.pdfDocProxy = await loadingTask.promise;
      const prevCount = this.pageCount;
      this.pageCount = this.pdfDocProxy.numPages;
      this.syncLoadedWindow(prevCount);

      this.pdfPageAspects.clear();
      this.pdfPageRotations.clear();
      const tmpDoc = await PDFDocument.load(copy);
      tmpDoc.getPages().forEach((pg, idx) => {
        const { width, height } = pg.getSize();
        this.pdfPageAspects.set(idx + 1, width / height);
        this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
      });

      this.renderedPages.clear();
      this.pageThumbnails = [];
      await this.generateThumbnailsRange(1, this.loadedUntilPage);
      this.pageNo = toPage;
      this.scrollToPage(this.pageNo);
    } catch (err) {
      console.error('reorderPage error', err);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
      await this.renderAllPages();
    }
  }

  /** ถาม dialog หน้าปลายทาง แล้วย้ายหน้า fromPage ไปยังตำแหน่งใหม่ */
  async promptMovePage(fromPage: number): Promise<void> {
    if (!this.basePdfBytes || this.pageCount <= 1) return;
    const alert = await this.alertCtrl.create({
      header: `ย้ายหน้า ${fromPage}`,
      message: `ระบุหน้าปลายทาง (1 - ${this.pageCount})`,
      inputs: [{ name: 'target', type: 'number', min: 1, max: this.pageCount, value: fromPage }],
      buttons: [
        { text: 'ยกเลิก', role: 'cancel' },
        {
          text: 'ย้าย',
          handler: (data) => {
            const to = parseInt(data?.target, 10);
            if (isNaN(to) || to < 1 || to > this.pageCount) {
              this.toastCtrl.create({ message: `กรุณาระบุหน้าระหว่าง 1 - ${this.pageCount}`, duration: 2000, color: 'danger' })
                .then(t => t.present());
              return false; // คงหน้าต่างไว้ให้แก้ใหม่
            }
            if (to !== fromPage) this.moveToPage(fromPage, to);
            return true;
          },
        },
      ],
    });
    await alert.present();
    this.cdr.detectChanges();
  }

  private async moveToPage(fromPage: number, toPage: number): Promise<void> {
    await this.reorderPage(fromPage, toPage);
    this.pageNo = toPage;
    this.scrollToPage(toPage);
    this.cdr.detectChanges();
  }
  // ──────────────────────────────────────────────────────────────────

  async movePageToIndex(pageNum: number, direction: 'up' | 'down'): Promise<void> {
    if (direction === 'up' && pageNum > 1) {
      const prevPageNo = this.pageNo;
      this.pageNo = pageNum;
      await this.swapPages(pageNum - 1, pageNum);
      this.pageNo = pageNum - 1;
      this.scrollToPage(this.pageNo);
    } else if (direction === 'down' && pageNum < this.pageCount) {
      this.pageNo = pageNum;
      await this.swapPages(pageNum, pageNum + 1);
      this.pageNo = pageNum + 1;
      this.scrollToPage(this.pageNo);
    }
  }

  async deleteSpecificPage(pageNum: number): Promise<void> {
    if (this.pageCount <= 1) return;
    this.pageNo = pageNum;
    await this.deletePage();
  }

  insertBlankPageFromThumb(where: 'before' | 'after'): void {
    this.showThumbInsertMenu = false;
    this.insertBlankPage(where);
  }

  deletePageFromThumb(): void {
    this.deletePage();
  }

  /* ================= Move Page Up/Down ================= */
  async movePageUp(): Promise<void> {
    if (this.pageNo <= 1 || !this.basePdfBytes) return;
    await this.swapPages(this.pageNo - 1, this.pageNo);
    this.pageNo = this.pageNo - 1;
    this.scrollToPage(this.pageNo);
  }

  async movePageDown(): Promise<void> {
    if (this.pageNo >= this.pageCount || !this.basePdfBytes) return;
    await this.swapPages(this.pageNo, this.pageNo + 1);
    this.pageNo = this.pageNo + 1;
    this.scrollToPage(this.pageNo);
  }

  private async swapPages(pageA: number, pageB: number): Promise<void> {
    if (!this.basePdfBytes) return;
    this.savePageSnapshot();
    this.isLoading = true;
    this.loadingMessage = 'กำลังย้ายหน้า...';
    this.cdr.detectChanges();
    try {
      const pdfDoc = await PDFDocument.load(this.basePdfBytes);
      const idxA = pageA - 1;
      const idxB = pageB - 1;

      // Copy both pages then insert at swapped positions
      const [copyOfB] = await pdfDoc.copyPages(pdfDoc, [idxB]);
      const [copyOfA] = await pdfDoc.copyPages(pdfDoc, [idxA]);

      // Insert B at position A, then A at position B+1 (now shifted by 1)
      pdfDoc.insertPage(idxA, copyOfB);
      pdfDoc.insertPage(idxB + 1, copyOfA);

      // Remove the original A (now at idxA+1) and original B (now at idxB+2)
      pdfDoc.removePage(idxA + 1);
      pdfDoc.removePage(idxB + 1);

      const newBytes = await pdfDoc.save();
      this.basePdfBytes = newBytes.buffer as ArrayBuffer;

      // Swap annotations between the two pages
      const swapAnnot = <T extends { page: number }>(arr: T[]): T[] =>
        arr.map(a => {
          if (a.page === pageA) return { ...a, page: pageB };
          if (a.page === pageB) return { ...a, page: pageA };
          return a;
        });
      this.textBoxes = swapAnnot(this.textBoxes);
      this.imageStamps = swapAnnot(this.imageStamps);
      this.shapeStamps = swapAnnot(this.shapeStamps);
      this.signatureStamps = swapAnnot(this.signatureStamps);
      this.dateStamps = swapAnnot(this.dateStamps);
      this.pdfFormFields = swapAnnot(this.pdfFormFields);

      const swapRecord = (rec: Record<number, any[]>): Record<number, any[]> => {
        const next: Record<number, any[]> = {};
        for (const k of Object.keys(rec)) {
          const p = Number(k);
          if (p === pageA) next[pageB] = rec[p];
          else if (p === pageB) next[pageA] = rec[p];
          else next[p] = rec[p];
        }
        return next;
      };
      this.strokes = swapRecord(this.strokes);
      this.shapes = swapRecord(this.shapes);
      this.redoStack = swapRecord(this.redoStack);

      // Reload pdfjs
      const copy = this.basePdfBytes.slice(0);
      if (this.pdfDocProxy) { this.pdfDocProxy.destroy(); this.pdfDocProxy = null; }
      const loadingTask = (pdfjsLib as any).getDocument({ data: copy.slice(0) });
      this.pdfDocProxy = await loadingTask.promise;
      const prevCount = this.pageCount;
      this.pageCount = this.pdfDocProxy.numPages;
      this.syncLoadedWindow(prevCount);

      this.pdfPageAspects.clear();
      this.pdfPageRotations.clear();
      try {
        const tmpDoc = await PDFDocument.load(copy);
        tmpDoc.getPages().forEach((pg, idx) => {
          const { width, height } = pg.getSize();
          this.pdfPageAspects.set(idx + 1, width / height);
          this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
        });
      } catch (_) {}

      this.renderedPages.clear();
      this.renderingPages.clear();
      await this.generateThumbnails();
      await this.renderAllPages();
    } catch (err) {
      console.error('swapPages error:', err);
      const toast = await this.toastCtrl.create({
        message: 'เกิดข้อผิดพลาดในการย้ายหน้า',
        duration: 2000, color: 'danger', position: 'bottom'
      });
      await toast.present();
    } finally {
      this.isLoading = false;
      this.loadingMessage = '';
      this.cdr.detectChanges();
    }
  }

  /* ================= Page helpers ================= */
  private ensurePage(p: number = this.pageNo): void {
    if (!this.strokes[p]) this.strokes[p] = [];
    if (!this.shapes[p]) this.shapes[p] = [];
    if (!this.redoStack[p]) this.redoStack[p] = [];
  }

  private getPdfCanvas(p: number): HTMLCanvasElement | null {
    return document.getElementById('pdfCanvas-' + p) as HTMLCanvasElement | null;
  }

  private getAnnotCanvas(p: number): HTMLCanvasElement | null {
    return document.getElementById('annotCanvas-' + p) as HTMLCanvasElement | null;
  }

  onViewerScroll(event: Event): void {
    if (this.isScrollNavigating) return;

    const container = event.target as HTMLElement;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    // Find which page is most visible
    for (let i = 1; i <= this.loadedUntilPage; i++) {
      const pageEl = document.getElementById('page-' + i);
      if (!pageEl) continue;

      const pageTop = pageEl.offsetTop - container.offsetTop;
      const pageBottom = pageTop + pageEl.offsetHeight;
      const visibleTop = Math.max(scrollTop, pageTop);
      const visibleBottom = Math.min(scrollTop + containerHeight, pageBottom);
      const visibleHeight = visibleBottom - visibleTop;

      if (visibleHeight > containerHeight * 0.5) {
        if (this.pageNo !== i) {
          this.pageNo = i;
          this.scrollThumbnailIntoView(i);
          this.cdr.detectChanges();
          this.fitWidth();
        }
        // Load next chunk when approaching the last loaded page
        if (i >= this.loadedUntilPage - 5) this.loadNextChunk();
        break;
      }
    }
  }

  // เลื่อน sidebar thumbnail ใกล้ล่างสุด → โหลด chunk หน้าถัดไป
  // (ก่อนหน้านี้มีแต่ onViewerScroll ของ viewer หลัก เลื่อน thumbnail เลยไม่โหลดต่อ)
  onThumbScroll(event: Event): void {
    const el = event.target as HTMLElement;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) {
      this.loadNextChunk();
    }
  }

  async prevPage(): Promise<void> {
    if (this.pageNo <= 1) return;
    this.pageNo -= 1;
    this.scrollToPage(this.pageNo);
    await this.fitWidth();
  }

  async zoomIn(): Promise<void> {
    this.zoom = Math.min(3, this.zoom + 0.1);
    this.renderedPages.clear();
    await this.renderAllPages();
  }

  async nextPage(): Promise<void> {
    if (this.pageNo >= this.pageCount) return;
    // If at the edge of the loaded chunk, load next chunk first
    if (this.pageNo >= this.loadedUntilPage) {
      await this.loadNextChunk();
    }
    this.pageNo += 1;
    this.scrollToPage(this.pageNo);
    await this.fitWidth();
  }

  async firstPage(): Promise<void> {
    if (this.pageNo === 1) return;
    this.pageNo = 1;
    this.scrollToPage(this.pageNo);
    await this.fitWidth();
  }

  async lastPage(): Promise<void> {
    if (this.pageNo === this.pageCount) return;
    // Jump to last loaded page; pre-load next chunk in background
    this.pageNo = this.loadedUntilPage;
    this.scrollToPage(this.pageNo);
    await this.fitWidth();
    if (this.loadedUntilPage < this.pageCount) this.loadNextChunk();
  }

  async zoomOut(): Promise<void> {
    this.zoom = Math.max(0.5, this.zoom - 0.1);
    this.renderedPages.clear();
    await this.renderAllPages();
  }

  scrollToPage(pageNum: number): void {
    this.isScrollNavigating = true;
    const pageEl = document.getElementById('page-' + pageNum);
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Also scroll thumbnail into view
    this.scrollThumbnailIntoView(pageNum);
    // Longer timeout for long documents - smooth scroll can take time
    setTimeout(() => {
      this.isScrollNavigating = false;
    }, 1500);
  }

  scrollThumbnailIntoView(pageNum: number): void {
    const thumbEl = document.getElementById('thumb-' + pageNum);
    if (thumbEl) {
      thumbEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private debouncedRenderVisible(): void {
    if (this.renderDebounceTimer) {
      clearTimeout(this.renderDebounceTimer);
    }
    this.renderDebounceTimer = setTimeout(() => {
      this.renderAllPages();
    }, 200);
  }

  async renderAllPages(): Promise<void> {
    // Prevent concurrent render calls
    if (this.isRenderingAll) return;
    this.isRenderingAll = true;

    try {
      // Render all pages (memory saved via DPR cap and cleanup on destroy)
      for (let p = 1; p <= this.pageCount; p++) {
        await this.renderPage(p);
      }
    } finally {
      this.isRenderingAll = false;
    }
  }



  /* ================= Zoom & Resize ================= */
  private lastParentWidth = 0;
  private lastFitPageNo = -1;

  /** Compute zoom so the WIDEST page in the document fits within the container.
   *  This prevents landscape pages from overflowing and being clipped by overflow-x. */
  async fitWidth(): Promise<void> {
    if (!this.viewerContainerRef) return;
    const parent = this.viewerContainerRef.nativeElement;

    if (!parent || parent.clientWidth === 0) {
      await new Promise(resolve => setTimeout(resolve, 50));
      return this.fitWidth();
    }

    const containerW = parent.clientWidth;
    const targetW = containerW - 40; // padding

    // Check if container size has changed enough, or if the current page changed
    const sameContainer = Math.abs(containerW - this.lastParentWidth) < 2;
    const samePage = this.pageNo === this.lastFitPageNo;
    if (sameContainer && samePage) return;

    this.lastParentWidth = containerW;
    this.lastFitPageNo = this.pageNo;

    // Wait for DOM to populate if pages are defined
    if (this.pages.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Scan all pages to find the widest viewport (landscape pages may be wider than portrait)
    let maxVpWidth = 0;
    for (let p = 1; p <= this.pageCount; p++) {
      try {
        const pg = await this.pdfDocProxy.getPage(p);
        const vp = pg.getViewport({ scale: 1 });
        if (vp.width > maxVpWidth) maxVpWidth = vp.width;
      } catch (_) { /* skip unavailable pages */ }
    }

    if (maxVpWidth <= 0) return; // safety guard

    this.zoom = targetW / maxVpWidth;

    this.renderedPages.clear();
    await this.renderAllPages();
  }



  private async renderPage(p: number = this.pageNo): Promise<void> {
    if (!this.pdfDocProxy || this.renderingPages.has(p) || this.renderedPages.has(p)) return;
    this.renderingPages.add(p);

    // Only show global loading if it's the first render or a manual save.
    // Regular page/zoom renders shouldn't block the UI with the intrusive overlay.
    // const showLoading = !this.isLoading && p === this.pageNo;
    // if (showLoading) {
    //   this.isLoading = true;
    //   this.loadingMessage = 'กำลังเรนเดอร์เอกสาร...';
    //   this.cdr.detectChanges();
    // }

    try {
      const page = await this.pdfDocProxy.getPage(p);

      // Store the true effective rotation from pdf.js, as it correctly handles inherited rotations
      // from the PDF page tree (which pdf-lib's getRotation() sometimes misses).
      // We will use this in saveDocument to know exactly how the user saw the page.
      this.pdfPageRotations.set(p, page.rotate || 0);

      // Use native pdf.js viewport. pdf.js smartly handles rotation including inherited ones.
      const viewport = page.getViewport({ scale: this.zoom });
      if (p === this.pageNo) this.currentViewport = viewport;

      const pdfCanvas = this.getPdfCanvas(p);
      if (!pdfCanvas) return;
      const pdfCtx = pdfCanvas.getContext('2d') as CanvasRenderingContext2D;

      // Cap DPR at 2 to reduce memory usage on high-res displays
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      pdfCanvas.width = Math.floor(viewport.width * dpr);
      pdfCanvas.height = Math.floor(viewport.height * dpr);
      pdfCanvas.style.width = viewport.width + 'px';
      pdfCanvas.style.height = viewport.height + 'px';
      pdfCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      pdfCtx.clearRect(0, 0, viewport.width, viewport.height);
      await page.render({ canvasContext: pdfCtx, viewport }).promise;

      // Render Text Layer for native selection
      const pageWrapper = pdfCanvas.parentElement;
      if (pageWrapper) {
        let textLayerDiv = pageWrapper.querySelector('.textLayer') as HTMLDivElement;
        if (!textLayerDiv) {
          textLayerDiv = document.createElement('div');
          textLayerDiv.className = 'textLayer';
          pageWrapper.insertBefore(textLayerDiv, pdfCanvas.nextSibling);
        }
        textLayerDiv.innerHTML = '';
        textLayerDiv.style.width = viewport.width + 'px';
        textLayerDiv.style.height = viewport.height + 'px';
        textLayerDiv.style.left = '0';
        textLayerDiv.style.top = '0';

        // Ensure scale factor is cleanly applied
        textLayerDiv.style.setProperty('--scale-factor', viewport.scale.toString());

        try {
          const textContent = await page.getTextContent();
          const textLayer = new (pdfjsLib as any).TextLayer({
            textContentSource: textContent,
            container: textLayerDiv,
            viewport
          });
          await textLayer.render();
        } catch (e) {
          console.warn('Failed to render text layer:', e);
        }
      }

      // Small delay to ensure PDF content (fonts, text) are fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      this.resizeAnnotCanvasTo(p, viewport.width, viewport.height);

      const annotCanvas = this.getAnnotCanvas(p);
      if (annotCanvas) {
        // Run events outside Angular to eliminate Change Detection lag on 120Hz/240Hz Apple Pencils
        this.zone.runOutsideAngular(() => {
          if ((annotCanvas as any)._hasPointerEvents) return;
          (annotCanvas as any)._hasPointerEvents = true;

          annotCanvas.addEventListener('pointerdown', (e) => this.onCanvasPointerDown(e, p));
          annotCanvas.addEventListener('pointermove', (e) => this.onCanvasPointerMove(e, p));
          annotCanvas.addEventListener('pointerup', (e) => this.onCanvasPointerUp(e, p));
          annotCanvas.addEventListener('pointerleave', (e) => this.onCanvasPointerUp(e, p));
          annotCanvas.addEventListener('pointercancel', (e) => this.onCanvasPointerUp(e, p));
        });
      }

      this.redraw(p);
      this.clampTextBoxesToView();
      this.renderedPages.add(p);
    } catch (err) {
      console.error(`Error rendering page ${p}:`, err);
    } finally {
      this.renderingPages.delete(p);
      if (this.renderingPages.size === 0) {
        this.isLoading = false;
        this.loadingMessage = '';
        this.cdr.detectChanges();
      }
    }
  }

  private resizeAnnotCanvasTo(p: number, cssW: number, cssH: number): void {
    const canvas = this.getAnnotCanvas(p);
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // Cap DPR at 2 to reduce memory usage
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Force clear canvas before resizing to remove any artifacts
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.imageSmoothingEnabled = false;
  }

  private setupResizeAutoRender(): void {
    if (!this.viewerContainerRef) return;
    this.resizeObserver = new ResizeObserver(() => {
      this.fitWidth();
    });
    this.resizeObserver.observe(this.viewerContainerRef.nativeElement);
  }

  /* ================= Tool Mode Toggles ================= */
  setToolMode(mode: ToolMode): void {
    this.toolMode = this.toolMode === mode ? 'none' : mode;
    this.showShapeMenu = false;
    this.syncToolModeStyles();
  }

  updateCursor(): void {
    this.pages.forEach(p => {
      const canvas = this.getAnnotCanvas(p);
      if (canvas) {
        switch (this.toolMode) {
          case 'draw':
          case 'shape':
          case 'eraser':
          case 'date':
          case 'mark':
          case 'formfield':
            canvas.style.cursor = 'crosshair';
            break;
          case 'highlight':
            canvas.style.cursor = 'cell';
            break;
          case 'text':
            canvas.style.cursor = 'text';
            break;
          case 'signature':
            canvas.style.cursor = 'copy'; // Or custom cursor if available
            break;
          default:
            canvas.style.cursor = 'default';
        }
      }
    });
  }

  /* ================= Size Adjustments ================= */
  changeBrushSize(delta: number): void {
    this.brushSize = Math.max(1, Math.min(50, this.brushSize + delta));
    this.saveSettings();
    this.cdr.detectChanges();
  }

  setBrushColor(color: string): void {
    this.brushColor = color;
    this.saveSettings();
    this.cdr.detectChanges();
  }

  changeHighlightSize(delta: number): void {
    this.highlightSize = Math.max(5, Math.min(100, this.highlightSize + delta));
    this.saveSettings();
    this.cdr.detectChanges();
  }

  setHighlightColor(color: string): void {
    this.highlightColor = color;
    this.saveSettings();
    this.cdr.detectChanges();
  }

  changeTextFontSize(delta: number): void {
    this.textFontSize = Math.max(8, Math.min(100, this.textFontSize + delta));
    if (this.activeTextBoxId) {
      const tb = this.textBoxes.find(t => t.id === this.activeTextBoxId);
      if (tb) {
        tb.fontSize = this.textFontSize;
        this.cdr.detectChanges();
      }
    }
    this.saveSettings();
    this.cdr.detectChanges();
  }

  toggleDraw(): void { this.setToolMode('draw'); }
  toggleEraser(): void { this.setToolMode('eraser'); }
  toggleHighlight(): void { this.setToolMode('highlight'); }
  enableTextPlaceMode(): void { this.setToolMode('text'); }

  toggleShapeMenu(): void {
    this.showShapeMenu = !this.showShapeMenu;
    if (this.showShapeMenu) {
      this.toolMode = 'shape';
    }
  }

  toggleShapeDropdown(): void {
    this.showShapeDropdown = !this.showShapeDropdown;
  }

  selectShape(type: 'rect' | 'circle' | 'arrow' | 'line'): void {
    this.shapeType = type;
    this.toolMode = 'shape';
    this.showShapeMenu = false;
    this.showShapeDropdown = false;
    this.saveSettings();
    this.updateCursor();
  }

  setShapeStrokeColor(color: string): void {
    this.shapeStrokeColor = color;
    if (this.activeObjectId && this.activeObjectType === 'shape') {
      const s = this.shapeStamps.find(x => x.id === this.activeObjectId);
      if (s) s.strokeColor = color;
    }
    this.saveSettings();
  }

  setShapeFillColor(color: string): void {
    this.shapeFillColor = color;
    if (this.activeObjectId && this.activeObjectType === 'shape') {
      const s = this.shapeStamps.find(x => x.id === this.activeObjectId);
      if (s) s.fillColor = color;
    }
    this.saveSettings();
  }

  toggleShapeFill(): void {
    this.shapeFillEnabled = !this.shapeFillEnabled;
    if (this.activeObjectId && this.activeObjectType === 'shape') {
      const s = this.shapeStamps.find(x => x.id === this.activeObjectId);
      if (s) s.fillColor = this.shapeFillEnabled ? this.shapeFillColor : 'none';
    }
    this.saveSettings();
  }

  toggleShapeNoStroke(): void {
    this.shapeNoStroke = !this.shapeNoStroke;
    if (this.activeObjectId && this.activeObjectType === 'shape') {
      const s = this.shapeStamps.find(x => x.id === this.activeObjectId);
      if (s) s.strokeColor = this.shapeNoStroke ? 'none' : this.shapeStrokeColor;
    }
    this.saveSettings();
  }

  changeShapeStrokeSize(delta: number): void {
    const s = this.shapeStrokeSize + delta;
    if (s >= 1 && s <= 20) {
      this.shapeStrokeSize = s;
      if (this.activeObjectId && this.activeObjectType === 'shape') {
        const shape = this.shapeStamps.find(x => x.id === this.activeObjectId);
        if (shape) shape.strokeWidth = s;
      }
      this.saveSettings();
    }
  }

  /* ================= Annotation Canvas Events ================= */
  private getNormPos(e: PointerEvent, p: number): StrokePoint {
    const rect = this.activeCanvasRect || (() => {
      const canvas = this.getAnnotCanvas(p);
      return canvas ? canvas.getBoundingClientRect() : null;
    })();

    if (!rect) return { x: 0, y: 0, p: 0 };

    const nx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const ny = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    const pressure = (typeof e.pressure === 'number' && e.pressure > 0) ? e.pressure : 0;

    return { x: nx, y: ny, p: pressure };
  }

  private finalizeActiveStroke(): void {
    if (!this.activeStroke && !this.activeShape) return;

    let needsDetection = false;

    if (this.activeStroke) {
      this.ensurePage();
      this.strokes[this.pageNo].push(this.activeStroke);
      this.activeStroke = null;
    }

    if (this.activeShape) {
      const sh = this.activeShape;
      this.activeShape = null;

      // Convert canvas shape → draggable ShapeStamp overlay
      const canvas = this.getAnnotCanvas(sh.page);
      if (canvas) {
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;

        const x1 = sh.startX * cw;
        const y1 = sh.startY * ch;
        const x2 = sh.endX * cw;
        const y2 = sh.endY * ch;

        const left = Math.min(x1, x2);
        const top = Math.min(y1, y2);
        const right = Math.max(x1, x2);
        const bottom = Math.max(y1, y2);

        // For line/arrow the bounding box can be tiny — ensure minimum 20px
        const bw = Math.max(right - left, 20);
        const bh = Math.max(bottom - top, 20);

        const stamp: ShapeStamp = {
          id: 'shs_' + Date.now() + '_' + Math.random().toString(16).slice(2),
          page: sh.page,
          x: (left / cw) * 100,
          y: (top / ch) * 100,
          width: (bw / cw) * 100,
          height: (bh / ch) * 100,
          type: sh.type,
          strokeColor: sh.color,
          strokeWidth: sh.size,
          viewWidth: cw,   // remember canvas CSS width for correct PDF stroke scaling
          fillColor: sh.fillColor,
          // Fraction of the bbox where the original start/end points sit
          startFracX: bw > 0 ? (x1 - left) / bw : 0,
          startFracY: bh > 0 ? (y1 - top) / bh : 0,
          endFracX: bw > 0 ? (x2 - left) / bw : 1,
          endFracY: bh > 0 ? (y2 - top) / bh : 1,
        };
        this.shapeStamps.push(stamp);
      }

      // Single-draw: exit shape mode after drawing one shape
      this.toolMode = 'none';
      this.updateCursor();
      this.syncToolModeStyles();
      needsDetection = true;
    }

    this.activePointerId = null;
    this.activeCanvasRect = null;
    this.redraw(this.pageNo);

    if (needsDetection) {
      this.cdr.detectChanges();
    }
  }

  removeShapeStamp(id: string): void {
    this.shapeStamps = this.shapeStamps.filter(s => s.id !== id);
    this.cdr.detectChanges();
  }

  startShapeDrag(e: PointerEvent, ssid: string): void {
    if (this.toolMode !== 'none') return;
    this.closeContextMenu();
    
    this.activeObjectId = ssid;
    this.activeObjectType = 'shape';

    const stamp = this.shapeStamps.find(s => s.id === ssid);
    if (!stamp) return;

    // Sync UI settings with the selected shape
    this.shapeType = stamp.type;
    if (stamp.strokeColor === 'none' || stamp.strokeColor === 'rgba(0,0,0,0)' || stamp.strokeColor === 'transparent') {
      this.shapeNoStroke = true;
    } else {
      this.shapeNoStroke = false;
      this.shapeStrokeColor = stamp.strokeColor;
    }
    if (!stamp.fillColor || stamp.fillColor === 'none' || stamp.fillColor === 'rgba(0,0,0,0)' || stamp.fillColor === 'transparent') {
      this.shapeFillEnabled = false;
    } else {
      this.shapeFillEnabled = true;
      this.shapeFillColor = stamp.fillColor;
    }
    this.shapeStrokeSize = stamp.strokeWidth || this.shapeStrokeSize;

    this.isDraggingShape = true;
    this.dragShapeId = ssid;

    const canvasRect = this.getDragCanvasRect(stamp.page);
    const startXpx = (stamp.x / 100) * canvasRect.width;
    const startYpx = (stamp.y / 100) * canvasRect.height;
    this.dragOffsetX = e.clientX - canvasRect.left - startXpx;
    this.dragOffsetY = e.clientY - canvasRect.top - startYpx;

    const move = (ev: PointerEvent) => {
      ev.preventDefault();
      if (!this.isDraggingShape || !this.dragShapeId) return;
      const s = this.shapeStamps.find(x => x.id === this.dragShapeId);
      if (!s) return;
      s.x = ((ev.clientX - canvasRect.left - this.dragOffsetX) / canvasRect.width) * 100;
      s.y = ((ev.clientY - canvasRect.top - this.dragOffsetY) / canvasRect.height) * 100;
      this.cdr.detectChanges();
    };

    const up = () => {
      this.isDraggingShape = false;
      this.dragShapeId = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  startShapeResize(ev: PointerEvent, shapeId: string, direction: ResizeDirection = 'se'): void {
    if (ev.button === 2 || ev.ctrlKey) return;
    ev.stopPropagation();
    ev.preventDefault();

    const stamp = this.shapeStamps.find(s => s.id === shapeId);
    if (!stamp) return;

    // Sync UI settings with the selected shape
    this.activeObjectId = shapeId;
    this.activeObjectType = 'shape';
    this.shapeType = stamp.type;
    if (stamp.strokeColor === 'none' || stamp.strokeColor === 'rgba(0,0,0,0)' || stamp.strokeColor === 'transparent') {
      this.shapeNoStroke = true;
    } else {
      this.shapeNoStroke = false;
      this.shapeStrokeColor = stamp.strokeColor;
    }
    if (!stamp.fillColor || stamp.fillColor === 'none' || stamp.fillColor === 'rgba(0,0,0,0)' || stamp.fillColor === 'transparent') {
      this.shapeFillEnabled = false;
    } else {
      this.shapeFillEnabled = true;
      this.shapeFillColor = stamp.fillColor;
    }
    this.shapeStrokeSize = stamp.strokeWidth || this.shapeStrokeSize;

    this.isResizingShape = true;
    this.resizeShapeId = shapeId;

    const canvasRect = this.getDragCanvasRect(stamp.page);
    const startX = ev.clientX;
    const startY = ev.clientY;
    const startW = stamp.width;
    const startH = stamp.height;
    const startSX = stamp.x;
    const startSY = stamp.y;

    const move = (e: PointerEvent) => {
      e.preventDefault();
      if (!this.isResizingShape || !this.resizeShapeId) return;
      const s = this.shapeStamps.find(x => x.id === this.resizeShapeId);
      if (!s) return;

      const dx = ((e.clientX - startX) / canvasRect.width) * 100;
      const dy = ((e.clientY - startY) / canvasRect.height) * 100;

      let nw = startW, nh = startH, nx = startSX, ny = startSY;
      if (direction.includes('e')) nw = Math.max(2, startW + dx);
      if (direction.includes('w')) { nw = Math.max(2, startW - dx); nx = startSX + (startW - nw); }
      if (direction.includes('s')) nh = Math.max(2, startH + dy);
      if (direction.includes('n')) { nh = Math.max(2, startH - dy); ny = startSY + (startH - nh); }

      s.width = nw;
      s.height = nh;
      s.x = nx;
      s.y = ny;
      this.cdr.detectChanges();
    };

    const up = () => {
      this.isResizingShape = false;
      this.resizeShapeId = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  /** Returns arrow rotation angle in degrees — used in SVG template to avoid Math in template */
  getArrowAngleDeg(ss: any): number {
    return (180 / Math.PI) * Math.atan2(
      ss.endFracY - ss.startFracY,
      ss.endFracX - ss.startFracX
    );
  }



  onCanvasPointerDown(e: PointerEvent, p: number): void {
    // Prevent default touch behavior (scroll, zoom) when any tool is active
    if (this.toolMode !== 'none') {
      e.preventDefault();
    }

    // Finalize previous stroke if it exists
    if (this.activeStroke || this.activeShape) {
      this.finalizeActiveStroke();
    }

    // iPad Palm Rejection / Multi-touch handling
    if (this.activePointerId !== null) {
      if (e.pointerType === 'pen') {
        // ALWAYS trust a new pen touch. If pointerup was delayed, cut it off and start fresh.
        this.activeStroke = null;
        this.activeShape = null;
      } else if (this.activePointerType === 'pen') {
        return; // Strongly ignore touch if pen is currently active
      } else {
        // Trust the newest touch if no pen is involved
        this.activeStroke = null;
        this.activeShape = null;
      }
    }

    // Deselect any active element when clicking on the empty canvas
    this.zone.run(() => {
      if (this.activeTextBoxId !== null || this.activeObjectId !== null || this.activeFormFieldId !== null) {
        this.activeTextBoxId = null;
        this.activeObjectId = null;
        this.activeObjectType = null;
        this.activeFormFieldId = null;
        this.cdr.detectChanges();
      }
    });

    const canvas = this.getAnnotCanvas(p);
    if (!canvas) return;

    this.activeCanvasRect = canvas.getBoundingClientRect();

    this.ensurePage(p);
    this.pageNo = p; // Mark this page as current for mode consistency

    switch (this.toolMode) {
      case 'draw':
      case 'highlight':
      case 'shape':
        canvas.setPointerCapture(e.pointerId);
        this.activePointerId = e.pointerId;
        this.activePointerType = e.pointerType;

        if (this.toolMode === 'draw' || this.toolMode === 'highlight') {
          const isHighlight = this.toolMode === 'highlight';
          this.activeStroke = {
            id: 's_' + Date.now() + '_' + Math.random().toString(16).slice(2),
            color: isHighlight ? this.highlightColor : this.brushColor,
            size: isHighlight ? this.highlightSize : this.brushSize,
            points: [this.getNormPos(e, p)],
            isHighlight
          };
        } else if (this.toolMode === 'shape') {
          const pos = this.getNormPos(e, p);
          this.activeShape = {
            id: 'sh_' + Date.now() + '_' + Math.random().toString(16).slice(2),
            page: p,
            type: this.shapeType,
            startX: pos.x,
            startY: pos.y,
            endX: pos.x,
            endY: pos.y,
            color: this.shapeNoStroke ? 'rgba(0,0,0,0)' : this.shapeStrokeColor,
            size: this.shapeNoStroke ? 0 : this.shapeStrokeSize,
            fillColor: this.shapeFillEnabled ? this.shapeFillColor : undefined
          };
        }
        this.redoStack[p] = [];
        break;

      case 'eraser':
        this.eraseAtPoint(e, p);
        break;

      case 'date': {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const thaiYear = year + 543;
        const dateText = `${day}/${month}/${thaiYear}`;

        // Normalize mouse x/y to 0..100
        const xNormalized = (mouseX / rect.width) * 100;
        const yNormalized = (mouseY / rect.height) * 100;

        this.dateStamps.push({
          id: 'date_' + Date.now() + '_' + Math.random().toString(16).slice(2),
          page: p,
          x: xNormalized - 5,
          y: yNormalized - 1,
          text: dateText,
          color: this.dateColor,
          fontSize: this.dateFontSize
        });

        // Log to history
        this.logHistory('date_stamp', { page: p, text: dateText }, p);

        this.toolMode = 'none';
        this.updateCursor();
        break;
      }

      case 'mark': {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const sizePx = this.markSize;
        const dataUrl = this.generateMarkDataUrl(this.markType, this.markColor, sizePx * 2);
        const xPct = ((mouseX - sizePx / 2) / rect.width) * 100;
        const yPct = ((mouseY - sizePx / 2) / rect.height) * 100;
        const wPct = (sizePx / rect.width) * 100;
        const hPct = (sizePx / rect.height) * 100;
        this.imageStamps.push({
          id: 'mark_' + Date.now() + '_' + Math.random().toString(16).slice(2),
          page: p, x: xPct, y: yPct, width: wPct, height: hPct, dataUrl,
          markType: this.markType,
          markColor: this.markColor,
        });
        this.logHistory('image', { type: 'mark', markType: this.markType }, p);
        break;
      }

      case 'formfield': {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const type = this.formFieldType;
        const defaultW = type === 'text' ? 28 : 4.5;
        const defaultH = type === 'text' ? 4 : 4.5;
        const newId = 'ff_' + Date.now() + '_' + Math.random().toString(16).slice(2);
        this.pdfFormFields.push({
          id: newId,
          page: p,
          type,
          x: Math.max(0, (mouseX / rect.width) * 100 - defaultW / 2),
          y: Math.max(0, (mouseY / rect.height) * 100 - defaultH / 2),
          width: defaultW,
          height: defaultH,
          fieldName: `${type}_${++this.formFieldCounter}`,
          radioGroupName: type === 'radio' ? 'radioGroup_1' : undefined,
          fontSize: 12,
          borderVisible: true,
        });
        this.activeFormFieldId = newId;
        this.activeTextBoxId = null;
        this.activeObjectId = null;
        this.activeObjectType = null;
        this.logHistory('image', { type: 'formfield', fieldType: type }, p);
        break;
      }

      case 'signature':
        if (this.pendingSignatureDataUrl) {
          this.placeSignatureOnPage(e, p);
        }
        break;

      case 'text':
        this.placeTextBoxOnPage(e, p);
        break;

      default:
        // Do nothing for 'none' or 'signature' (if no data URL)
        break;
    }

    // Only run detectChanges for modes that modify the Angular template.
    // Canvas-only modes (draw/highlight/shape/eraser) don't need it.
    const canvasOnlyMode = this.toolMode === 'draw' || this.toolMode === 'highlight'
      || this.toolMode === 'shape' || this.toolMode === 'eraser'
      || this.toolMode === 'mark' || this.toolMode === 'formfield';
    if (!canvasOnlyMode) {
      this.cdr.detectChanges();
    }
  }

  onCanvasPointerMove(e: PointerEvent, p: number): void {
    if (this.activePointerId !== null && e.pointerId !== this.activePointerId) return;

    // Prevent default touch handling during active drawing
    if (this.activeStroke || this.activeShape) {
      e.preventDefault();
    }

    if (this.activeStroke) {
      let events = (e as any).getCoalescedEvents ? (e as any).getCoalescedEvents() : [e];
      if (!events || events.length === 0) events = [e];

      const startIdx = Math.max(0, this.activeStroke.points.length - 1);
      
      const canvasRect = this.activeCanvasRect;
      for (const ev of events) {
        let pt = this.getNormPos(ev, p);
        if (this.activeStroke.points.length > 0 && canvasRect) {
          const lastPt = this.activeStroke.points[this.activeStroke.points.length - 1];
          // Skip physically tiny sub-pixel movements (less than 1.5px) to drastically reduce rendering overhead/lag
          const dx = (pt.x - lastPt.x) * canvasRect.width;
          const dy = (pt.y - lastPt.y) * canvasRect.height;
          if (dx * dx + dy * dy < 2.25) continue; // 1.5px squared
          
          // Exponential Moving Average to smooth Apple Pencil hardware pressure & coordinate jitter
          pt.x = (pt.x * 0.4) + (lastPt.x * 0.6);
          pt.y = (pt.y * 0.4) + (lastPt.y * 0.6);
          pt.p = (pt.p * 0.2) + (lastPt.p * 0.8);
        }
        this.activeStroke.points.push(pt);
      }
      
      // Incremental render for zero-latency drawing
      if (!this.renderRequested) {
        this.renderRequested = true;
        const strokeToDraw = this.activeStroke; // capture local reference
        requestAnimationFrame(() => {
          if (strokeToDraw) {
            if (strokeToDraw.isHighlight) {
              // Highlight strokes must be fully redrawn each frame (no incremental draw)
              // to prevent the alpha opacity from multiplying on top of itself at overlapping line joints.
              this.redraw(p, true);
            } else {
              this.drawStrokeIncremental(p, strokeToDraw, startIdx);
            }
          }
          this.renderRequested = false;
        });
      }
    }
    else if (this.activeShape) {
      const pos = this.getNormPos(e, p);
      this.activeShape.endX = pos.x;
      this.activeShape.endY = pos.y;
      if (!this.renderRequested) {
        this.renderRequested = true;
        requestAnimationFrame(() => {
          this.redraw(p, true);
          this.renderRequested = false;
        });
      }
    }
    else if (this.toolMode === 'eraser' && e.buttons === 1) {
      this.eraseAtPoint(e, p);
    }
  }

  onCanvasPointerUp(e: PointerEvent, p: number): void {
    if (this.activePointerId !== null && e.pointerId === this.activePointerId) {
      e.preventDefault();
      this.finalizeActiveStroke();
      const canvas = this.getAnnotCanvas(p);
      if (canvas && canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
      this.activePointerId = null;
      this.activePointerType = '';
    }
  }

  private placeSignatureOnPage(e: PointerEvent, p: number): void {
    const canvas = this.getAnnotCanvas(p);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const dataUrl = this.pendingSignatureDataUrl!;

    // Load the image to get its real aspect ratio
    const img = new Image();
    img.onload = async () => {
      const sigWidthPercent = 15;
      // Calculate height using PDF page aspect ratio for accuracy.
      // If not available yet, fall back to canvas aspect ratio.
      const pdfAspect = this.pdfPageAspects.get(p);  // width/height of PDF page
      const canvasAspect = rect.width / rect.height;   // width/height of canvas on screen
      // sigHeightPercent must match what pdf-lib will render:
      // In pdf-lib: pw = sigWidthPercent% * pdfW, ph = sigHeightPercent% * pdfH
      // We want pw/ph = img.width/img.height (natural aspect of signature image)
      // => sigHeightPercent = sigWidthPercent * (pdfW/pdfH) / imgNaturalAspect
      // => sigHeightPercent = sigWidthPercent * pdfAspect / imgNaturalAspect
      const imgNaturalAspect = img.width / img.height;
      const sigHeightPercent = pdfAspect
        ? sigWidthPercent * (pdfAspect / imgNaturalAspect)
        : sigWidthPercent * (img.height / img.width) * canvasAspect;

      const x = (mouseX / rect.width) * 100 - (sigWidthPercent / 2);
      const y = (mouseY / rect.height) * 100 - (sigHeightPercent / 2);

      const now = new Date();
      const thaiYear = now.getFullYear() + 543;
      const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${thaiYear}`;
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} +07'00'`;
      const digitalId = this.userId ? await this.hashUserId(this.userId) : '';

      const stamp: SignatureStamp = {
        id: 'sig_' + Date.now() + '_' + Math.random().toString(16).slice(2),
        page: p,
        x: x,
        y: y,
        width: sigWidthPercent,
        height: sigHeightPercent,
        dataUrl: dataUrl,
        digitalId: digitalId,
        signDate: dateStr,
        signTime: timeStr
      };
      this.signatureStamps.push(stamp);

      // Log to history
      this.logHistory('sign', { page: p, x: stamp.x, y: stamp.y, digitalId: stamp.digitalId }, p);

      this.pendingSignatureDataUrl = null;
      this.toolMode = 'none';
      this.updateCursor();
      this.cdr.detectChanges();
    };
    img.src = dataUrl;
  }

  /** Generate SHA-256 based Digital ID from userId */
  private async hashUserId(userId: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(userId);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      // Take first 10 hex chars for a shorter but still unique ID
      return `DID-${hashHex.substring(0, 10).toUpperCase()}`;
    } catch (e) {
      // Fallback for environments without Web Crypto
      let hash = 0;
      for (let i = 0; i < userId.length; i++) {
        const ch = userId.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash = hash & hash;
      }
      return `DID-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
    }
  }

  /** Log signature placement to database for reference/audit */
  private logSignatureToDatabase(digitalId: string, signDate: Date, pageNumber: number): void {
    if (!this.userId || !digitalId) return;

    const isoDate = signDate.toISOString().replace('T', ' ').substring(0, 19);

    this.http.post<any>(this.signaturesApiUrl, {
      aksi: 'log_signature',
      digital_id: digitalId,
      user_id: this.userId,
      sign_date: isoDate,
      document_name: this.fileName || '',
      page_number: pageNumber,
      detail_id: this.detailId || '',
      edoc_id: this.edocId || ''
    }).subscribe(
      (res) => {
        if (res?.success) {
          console.log('Signature logged:', digitalId);
        } else {
          console.warn('Failed to log signature:', res?.msg);
        }
      },
      (err) => console.error('Error logging signature:', err)
    );
  }

  private placeTextBoxOnPage(e: PointerEvent, p: number): void {
    const canvas = this.getAnnotCanvas(p);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize position to 0..100
    const x = (mouseX / rect.width) * 100;
    const y = (mouseY / rect.height) * 100;

    // Default size in percentages
    const widthPercent = 6;
    const heightPercent = 5; // Reduced from 10%

    this.textBoxes.push({
      id: 't_' + Date.now() + '_' + Math.random().toString(16).slice(2),
      page: p,
      x,
      y,
      width: widthPercent,
      height: heightPercent,
      text: '',
      color: this.textColor,
      fontSize: this.textFontSize,
      bold: this.tbDefaultBold,
      italic: this.tbDefaultItalic,
      align: this.tbDefaultAlign,
      fontFamily: this.tbDefaultFontFamily,
      opacity: 1,
      rotation: 0,
      letterSpacing: this.tbDefaultLetterSpacing,
      lineHeight: this.tbDefaultLineHeight,
    });

    this.activeTextBoxId = this.textBoxes[this.textBoxes.length - 1].id;
    this.toolMode = 'none';
    this.syncToolModeStyles();
    this.updateCursor();
    this.cdr.detectChanges();
    // Log to history
    this.logHistory('text', { page: p, fontSize: this.textFontSize, color: this.textColor }, p);

    // Auto-focus the textarea to show keyboard immediately
    setTimeout(() => {
      const textBoxEl = document.querySelector('.text-box.active textarea') as HTMLTextAreaElement;
      if (textBoxEl) {
        textBoxEl.focus();
      }
    }, 100);
  }

  /* ================= Eraser ================= */
  changeEraserSize(delta: number): void {
    const newSize = this.eraserSize + delta;
    if (newSize >= 5 && newSize <= 200) {
      this.eraserSize = newSize;
      this.saveSettings();
    }
  }

  private eraseAtPoint(e: PointerEvent, p: number): void {
    const pos = this.getNormPos(e, p);
    
    // Scale threshold based on eraser size. 
    // Default size 20 matches ~0.02 threshold roughly
    const threshold = (this.eraserSize / 1000); 

    // Check strokes
    this.strokes[p] = this.strokes[p].filter(stroke => {
      return !stroke.points.some(pt =>
        Math.abs(pt.x - pos.x) < threshold && Math.abs(pt.y - pos.y) < threshold
      );
    });

    // Check shapes
    this.shapes[p] = this.shapes[p].filter(shape => {
      const centerX = (shape.startX + shape.endX) / 2;
      const centerY = (shape.startY + shape.endY) / 2;
      const halfW = Math.abs(shape.endX - shape.startX) / 2;
      const halfH = Math.abs(shape.endY - shape.startY) / 2;

      return !(pos.x >= centerX - halfW - threshold &&
        pos.x <= centerX + halfW + threshold &&
        pos.y >= centerY - halfH - threshold &&
        pos.y <= centerY + halfH + threshold);
    });

    this.redraw(p);
  }





  /* ================= Drawing ================= */
  private calcLineWidth(base: number, pressure: number): number {
    if (!pressure) return base;
    return Math.max(1, base * (0.6 + pressure * 1.8));
  }

  private redraw(p: number = this.pageNo, includeActive: boolean = false): void {
    const canvas = this.getAnnotCanvas(p);
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true }) as CanvasRenderingContext2D;
    const dpr = window.devicePixelRatio || 1;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    this.ensurePage(p);

    // Draw all static annotations for this specific page
    for (const s of this.strokes[p]) this.drawStroke(ctx, p, s);
    for (const sh of this.shapes[p]) this.drawShape(ctx, p, sh);

    // Draw active if this is the target page
    if (includeActive && p === this.pageNo) {
      if (this.activeStroke) this.drawStroke(ctx, p, this.activeStroke);
      if (this.activeShape) this.drawShape(ctx, p, this.activeShape);
    }
  }

  private drawStroke(ctx: CanvasRenderingContext2D, p: number, s: Stroke): void {
    const canvas = this.getAnnotCanvas(p);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    if (s.points.length < 2) return;

    if (s.isHighlight) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      // Highlighters multiply against the background to feel like real markers
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = s.color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = s.size;
      
      // Draw as a single continuous path without multiple beginPath() calls
      // to ensure overlapping joints do not amplify the alpha transparency.
      ctx.beginPath();
      for (let i = 0; i < s.points.length; i++) {
        const pt = s.points[i];
        if (i === 0) {
          ctx.moveTo(pt.x * w, pt.y * h);
        } else {
          ctx.lineTo(pt.x * w, pt.y * h);
        }
      }
      ctx.stroke();
      ctx.restore();
      return;
    }

    ctx.strokeStyle = s.color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // To support pressure-sensitive width AND butter-smooth curves,
    // we use segmented quadratic bezier curves passing through midpoints
    for (let i = 1; i < s.points.length; i++) {
        const prevPrev = i > 1 ? s.points[i - 2] : s.points[i - 1];
        const prev = s.points[i - 1];
        const curr = s.points[i];
        
        const startX = (prevPrev.x + prev.x) / 2 * w;
        const startY = (prevPrev.y + prev.y) / 2 * h;
        const endX = (prev.x + curr.x) / 2 * w;
        const endY = (prev.y + curr.y) / 2 * h;
        
        ctx.lineWidth = this.calcLineWidth(s.size, curr.p);
        ctx.beginPath();
        if (i === 1) {
           ctx.moveTo(prev.x * w, prev.y * h);
           ctx.lineTo(endX, endY);
        } else if (i === s.points.length - 1) {
           ctx.moveTo(startX, startY);
           ctx.quadraticCurveTo(prev.x * w, prev.y * h, curr.x * w, curr.y * h);
        } else {
           ctx.moveTo(startX, startY);
           ctx.quadraticCurveTo(prev.x * w, prev.y * h, endX, endY);
        }
        ctx.stroke();
    }
  }

  private drawStrokeIncremental(p: number, s: Stroke, startIdx: number): void {
    const canvas = this.getAnnotCanvas(p);
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true }) as CanvasRenderingContext2D;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.strokeStyle = s.color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const renderStart = Math.max(1, startIdx);
    for (let i = renderStart; i < s.points.length; i++) {
        const prevPrev = i > 1 ? s.points[i - 2] : s.points[i - 1];
        const prev = s.points[i - 1];
        const curr = s.points[i];
        
        const startX = (prevPrev.x + prev.x) / 2 * w;
        const startY = (prevPrev.y + prev.y) / 2 * h;
        const endX = (prev.x + curr.x) / 2 * w;
        const endY = (prev.y + curr.y) / 2 * h;
        
        ctx.lineWidth = this.calcLineWidth(s.size, curr.p);
        ctx.beginPath();
        if (i === 1) {
           ctx.moveTo(prev.x * w, prev.y * h);
           ctx.lineTo(endX, endY);
        } else if (i === s.points.length - 1) {
           ctx.moveTo(startX, startY);
           ctx.quadraticCurveTo(prev.x * w, prev.y * h, curr.x * w, curr.y * h);
        } else {
           ctx.moveTo(startX, startY);
           ctx.quadraticCurveTo(prev.x * w, prev.y * h, endX, endY);
        }
        ctx.stroke();
    }
  }

  private drawShape(ctx: CanvasRenderingContext2D, p: number, sh: Shape): void {
    const canvas = this.getAnnotCanvas(p);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    const x1 = sh.startX * w;
    const y1 = sh.startY * h;
    const x2 = sh.endX * w;
    const y2 = sh.endY * h;

    ctx.strokeStyle = sh.color;
    ctx.lineWidth = sh.size;
    ctx.beginPath();

    switch (sh.type) {
      case 'rect':
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        if (sh.fillColor) { ctx.fillStyle = sh.fillColor; ctx.fill(); }
        break;
      case 'circle': {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const rx = Math.abs(x2 - x1) / 2;
        const ry = Math.abs(y2 - y1) / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        if (sh.fillColor) { ctx.fillStyle = sh.fillColor; ctx.fill(); }
        break;
      }
      case 'line':
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        break;
      case 'arrow': {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLen = 15;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
        break;
      }
    }
    ctx.stroke();
  }

  /* ================= Undo/Redo per page ================= */
  canUndo(): boolean {
    this.ensurePage(this.pageNo);
    return this.strokes[this.pageNo].length > 0 || this.shapes[this.pageNo].length > 0;
  }

  canRedo(): boolean {
    this.ensurePage(this.pageNo);
    return this.redoStack[this.pageNo].length > 0;
  }

  undo(): void {
    this.ensurePage(this.pageNo);
    let item: Stroke | Shape | undefined = this.strokes[this.pageNo].pop();
    if (!item) item = this.shapes[this.pageNo].pop();
    if (!item) return;

    this.redoStack[this.pageNo].push(item);
    this.redraw(this.pageNo);
  }

  redo(): void {
    this.ensurePage(this.pageNo);
    const item = this.redoStack[this.pageNo].pop();
    if (!item) return;

    if ('points' in item) this.strokes[this.pageNo].push(item as Stroke);
    else this.shapes[this.pageNo].push(item as Shape);
    this.redraw(this.pageNo);
  }

  clearAnnotations(): void {
    this.ensurePage(this.pageNo);
    this.strokes[this.pageNo] = [];
    this.shapes[this.pageNo] = [];
    this.redoStack[this.pageNo] = [];
    this.textBoxes = this.textBoxes.filter(t => t.page !== this.pageNo);
    this.imageStamps = this.imageStamps.filter(i => i.page !== this.pageNo);
    this.signatureStamps = this.signatureStamps.filter(s => s.page !== this.pageNo);
    this.dateStamps = this.dateStamps.filter(d => d.page !== this.pageNo);
    this.redraw(this.pageNo);
  }



  /* ================= TextBox Operations ================= */
  selectTextBox(id: string, ev: PointerEvent): void {
    ev.stopPropagation();
    this.activeTextBoxId = id;
  }

  onTextBoxPointerDown(ev: PointerEvent, id: string): void {
    ev.stopPropagation();
    this.activeTextBoxId = id;
    this.startDrag(ev, id);
  }

  clearTextSelection(): void {
    this.activeTextBoxId = null;
  }

  private getDragCanvasRect(p: number): DOMRect {
    const canvas = this.getAnnotCanvas(p);
    return canvas ? canvas.getBoundingClientRect() : new DOMRect();
  }

  startDrag(e: PointerEvent, textBoxId: string): void {
    if (this.toolMode !== 'none') return;
    this.closeContextMenu();
    
    // Set both activeTextBoxId (for UI) and global active object (for Delete key)
    this.activeTextBoxId = textBoxId;
    this.activeObjectId = textBoxId;
    this.activeObjectType = 'text';
    this.activeFormFieldId = null; // ปิดแถบฟอร์มเมื่อสลับมาแก้กล่องข้อความ

    const tb = this.textBoxes.find(t => t.id === textBoxId);
    if (!tb) return;

    // Sync UI settings with the selected text box
    this.textColor = tb.color || this.textColor;
    this.textFontSize = tb.fontSize || this.textFontSize;

    // If user tapped directly on textarea to type, do not initiate dragging or blurring.
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'textarea') {
      return;
    }

    const textBoxEl = e.currentTarget as HTMLElement;

    // Lock touch-action during drag to prevent iPad scroll
    textBoxEl.style.touchAction = 'none';

    // Disable textarea to prevent iPadOS Scribble during drag
    const textareaEl = textBoxEl?.querySelector('textarea') as HTMLTextAreaElement | null;
    if (textareaEl) {
      textareaEl.blur();
      textareaEl.setAttribute('readonly', 'true');
      textareaEl.style.pointerEvents = 'none';
    }

    this.isDragging = true;
    this.dragTextBoxId = textBoxId;
    const canvasRect = this.getDragCanvasRect(tb.page);

    // Convert current % position to pixels for initial offset calculation
    const startXpx = (tb.x / 100) * canvasRect.width;
    const startYpx = (tb.y / 100) * canvasRect.height;

    this.dragOffsetX = e.clientX - canvasRect.left - startXpx;
    this.dragOffsetY = e.clientY - canvasRect.top - startYpx;

    const move = (ev: PointerEvent) => {
      ev.preventDefault();
      if (!this.isDragging || !this.dragTextBoxId) return;
      const t = this.textBoxes.find(x => x.id === this.dragTextBoxId);
      if (!t) return;

      const mouseXpx = ev.clientX - canvasRect.left - this.dragOffsetX;
      const mouseYpx = ev.clientY - canvasRect.top - this.dragOffsetY;

      // Back to normalized
      t.x = (mouseXpx / canvasRect.width) * 100;
      t.y = (mouseYpx / canvasRect.height) * 100;
      this.cdr.detectChanges();
    };

    const up = () => {
      this.isDragging = false;
      this.dragTextBoxId = null;
      // Restore touch-action so iPad can scroll PDF again
      textBoxEl.style.touchAction = '';
      // Restore textarea after drag
      if (textareaEl) {
        textareaEl.removeAttribute('readonly');
        textareaEl.style.pointerEvents = '';
      }
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  startTextBoxDrag(ev: PointerEvent, textBoxId: string): void {
    ev.preventDefault();
    ev.stopPropagation();
    const tb = this.textBoxes.find(t => t.id === textBoxId);
    if (!tb) return;
    this.activeTextBoxId = textBoxId;
    this.startDrag(ev, textBoxId);
  }

  onTextBoxInput(event: Event, tb: TextBox): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.resizeTextBox(tb, textarea);
  }

  resizeTextBox(tb: TextBox, textarea?: HTMLTextAreaElement): void {
    if (!textarea) {
      const el = document.querySelector(`[data-tbid="${tb.id}"] textarea`) as HTMLTextAreaElement;
      if (!el) return;
      textarea = el;
    }

    const lines = tb.text.split('\n');
    let maxLineWidthPx = 30;

    const measureSpan = document.createElement('span');
    measureSpan.style.cssText = `position: absolute; visibility: hidden; white-space: pre; font-family: '${tb.fontFamily || 'THSarabunNew'}', sans-serif; font-size: ${tb.fontSize * this.zoom}px; font-weight: ${tb.bold ? 'bold' : 'normal'}; font-style: ${tb.italic ? 'italic' : 'normal'}; letter-spacing: ${tb.letterSpacing ?? 0}px;`;

    lines.forEach(line => {
      measureSpan.textContent = line || ' ';
      document.body.appendChild(measureSpan);
      const lineWidth = measureSpan.offsetWidth + 18;
      if (lineWidth > maxLineWidthPx) maxLineWidthPx = lineWidth;
      document.body.removeChild(measureSpan);
    });

    const canvasRect = this.getDragCanvasRect(tb.page);
    if (canvasRect.width > 0 && canvasRect.height > 0) {
      tb.width = Math.min(95, (maxLineWidthPx / canvasRect.width) * 100);
      this.cdr.detectChanges();

      textarea.style.height = '0px';
      const contentHeightPx = textarea.scrollHeight;
      textarea.style.height = contentHeightPx + 'px';

      const minHeightPx = (tb.fontSize * 1.4 * this.zoom) + 6;
      const finalHeightPx = Math.max(contentHeightPx, minHeightPx);
      tb.height = Math.min(95, ((finalHeightPx + 10) / canvasRect.height) * 100);
    }

    this.cdr.detectChanges();
    textarea.style.height = '';
  }

  onTextBoxFocus(id: string): void {
    this.activeTextBoxId = id;
    this.activeObjectId = id;
    this.activeObjectType = 'text';
    const tb = this.textBoxes.find(t => t.id === id);
    if (tb) {
      this.textColor = tb.color || this.textColor;
      this.textFontSize = tb.fontSize || this.textFontSize;
    }
  }

  /* ================= TextBox Resize ================= */
  startResize(ev: PointerEvent, textBoxId: string): void {
    if (ev.button === 2 || ev.ctrlKey) return;
    ev.stopPropagation();
    ev.preventDefault();
    const tb = this.textBoxes.find(t => t.id === textBoxId);
    if (!tb) return;

    // Sync UI settings
    this.activeTextBoxId = textBoxId;
    this.activeObjectId = textBoxId;
    this.activeObjectType = 'text';
    this.textColor = tb.color || this.textColor;
    this.textFontSize = tb.fontSize || this.textFontSize;

    this.isResizing = true;
    this.resizeTextBoxId = textBoxId;
    const canvasRect = this.getDragCanvasRect(tb.page);
    const startX = ev.clientX;
    const startY = ev.clientY;
    const startW_norm = tb.width;
    const startH_norm = tb.height;

    const move = (e: PointerEvent) => {
      e.preventDefault();
      if (!this.isResizing || !this.resizeTextBoxId) return;
      const t = this.textBoxes.find(x => x.id === this.resizeTextBoxId);
      if (!t) return;

      const deltaX_px = e.clientX - startX;
      const deltaY_px = e.clientY - startY;

      t.width = Math.max(5, startW_norm + (deltaX_px / canvasRect.width) * 100);
      t.height = Math.max(2, startH_norm + (deltaY_px / canvasRect.height) * 100);
      this.cdr.detectChanges();
    };

    const up = () => {
      this.isResizing = false;
      this.resizeTextBoxId = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  startResizeRight(ev: PointerEvent, textBoxId: string): void {
    if (ev.button === 2 || ev.ctrlKey) return;
    ev.stopPropagation();
    ev.preventDefault();
    const tb = this.textBoxes.find(t => t.id === textBoxId);
    if (!tb) return;
    this.activeTextBoxId = textBoxId;
    this.activeObjectId = textBoxId;
    this.activeObjectType = 'text';
    const canvasRect = this.getDragCanvasRect(tb.page);
    const startX = ev.clientX;
    const startW = tb.width;
    const move = (e: PointerEvent) => {
      e.preventDefault();
      const deltaX = (e.clientX - startX) / canvasRect.width * 100;
      tb.width = Math.max(5, Math.min(95 - tb.x, startW + deltaX));
      this.cdr.detectChanges();
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  startResizeLeft(ev: PointerEvent, textBoxId: string): void {
    if (ev.button === 2 || ev.ctrlKey) return;
    ev.stopPropagation();
    ev.preventDefault();
    const tb = this.textBoxes.find(t => t.id === textBoxId);
    if (!tb) return;
    this.activeTextBoxId = textBoxId;
    this.activeObjectId = textBoxId;
    this.activeObjectType = 'text';
    const canvasRect = this.getDragCanvasRect(tb.page);
    const startX = ev.clientX;
    const startTbX = tb.x;
    const startTbW = tb.width;
    const move = (e: PointerEvent) => {
      e.preventDefault();
      const deltaX = (e.clientX - startX) / canvasRect.width * 100;
      const newX = Math.max(0, startTbX + deltaX);
      const newW = Math.max(5, startTbW - deltaX);
      if (newX + newW <= 98) { tb.x = newX; tb.width = newW; }
      this.cdr.detectChanges();
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  removeTextBox(textBoxId: string): void {
    this.textBoxes = this.textBoxes.filter(t => t.id !== textBoxId);
    if (this.activeTextBoxId === textBoxId) this.activeTextBoxId = null;
    this.cdr.detectChanges();
  }

  private clampOneTextBox(tb: TextBox): void {
    // Both tb.x, tb.y, tb.width, tb.height are in 0-100 units
    tb.x = Math.max(0, Math.min(tb.x, 100 - tb.width));
    tb.y = Math.max(0, Math.min(tb.y, 100 - tb.height));
  }

  private clampTextBoxesToView(): void {
    this.textBoxes.forEach(tb => this.clampOneTextBox(tb));
  }

  /* ================= Image Stamp Operations ================= */
  triggerImageUpload(): void {
    this.fileInputRef?.nativeElement?.click();
  }

  private normalizeImageToPng(dataUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(dataUrl); // fallback: keep original
      img.src = dataUrl;
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const rawDataUrl = e.target?.result as string;
      const dataUrl = await this.normalizeImageToPng(rawDataUrl);

      const img = new Image();
      img.onload = () => {
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        // Scale display size (px) to at most 30% of canvas width, min 5%
        const canvasRect = this.getDragCanvasRect(this.pageNo);
        const cw = canvasRect.width || 600;
        const ch = canvasRect.height || 800;

        const maxPx = Math.min(cw * 0.4, ch * 0.4);
        if (w > maxPx || h > maxPx) {
          if (w > h) { h = (h / w) * maxPx; w = maxPx; }
          else       { w = (w / h) * maxPx; h = maxPx; }
        }

        this.imageStamps.push({
          id: 'img_' + Date.now() + '_' + Math.random().toString(16).slice(2),
          page: this.pageNo,
          x: ((cw / 2 - w / 2) / cw) * 100,
          y: ((ch / 2 - h / 2) / ch) * 100,
          width:  (w / cw) * 100,
          height: (h / ch) * 100,
          dataUrl
        });
        this.logHistory('image', { type: 'upload' }, this.pageNo);
        this.cdr.detectChanges();
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
    input.value = ''; // Reset for same file selection
  }

  startImageDrag(e: PointerEvent, imgId: string): void {
    if (this.toolMode !== 'none') return;
    this.closeContextMenu();
    
    this.activeObjectId = imgId;
    this.activeObjectType = 'image';

    const img = this.imageStamps.find(i => i.id === imgId);
    if (!img) return;

    this.isDraggingImage = true;
    this.dragImageId = imgId;

    const canvasRect = this.getDragCanvasRect(img.page);
    const startXpx = (img.x / 100) * canvasRect.width;
    const startYpx = (img.y / 100) * canvasRect.height;

    this.dragOffsetX = e.clientX - canvasRect.left - startXpx;
    this.dragOffsetY = e.clientY - canvasRect.top - startYpx;

    const move = (ev: PointerEvent) => {
      ev.preventDefault();
      if (!this.isDraggingImage || !this.dragImageId) return;
      const i = this.imageStamps.find(x => x.id === this.dragImageId);
      if (!i) return;

      const mouseXpx = ev.clientX - canvasRect.left - this.dragOffsetX;
      const mouseYpx = ev.clientY - canvasRect.top - this.dragOffsetY;

      i.x = (mouseXpx / canvasRect.width) * 100;
      i.y = (mouseYpx / canvasRect.height) * 100;
      this.cdr.detectChanges();
    };

    const up = () => {
      this.isDraggingImage = false;
      this.dragImageId = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  startImageResize(ev: PointerEvent, imageId: string, direction: ResizeDirection = 'se'): void {
    if (ev.button === 2 || ev.ctrlKey) return;
    ev.stopPropagation();
    ev.preventDefault();

    const img = this.imageStamps.find(i => i.id === imageId);
    if (!img) return;

    this.isResizingImage = true;
    this.resizeImageId = imageId;

    const canvasRect = this.getDragCanvasRect(img.page);
    const startX = ev.clientX;
    const startY = ev.clientY;

    const startW_norm = img.width;
    const startH_norm = img.height;
    const startX_norm = img.x;
    const startY_norm = img.y;
    const aspectRatio = startW_norm / startH_norm;

    const move = (e: PointerEvent) => {
      e.preventDefault();
      if (!this.isResizingImage || !this.resizeImageId) return;
      const i = this.imageStamps.find(x => x.id === this.resizeImageId);
      if (!i) return;

      const deltaX_norm = ((e.clientX - startX) / canvasRect.width) * 100;
      const deltaY_norm = ((e.clientY - startY) / canvasRect.height) * 100;

      const isShift = e.shiftKey; // Maintain aspect ratio if shift is pressed

      let newW = startW_norm;
      let newH = startH_norm;
      let newX = startX_norm;
      let newY = startY_norm;

      if (direction.includes('e')) {
        newW = Math.max(2, startW_norm + deltaX_norm);
      }
      if (direction.includes('w')) {
        newW = Math.max(2, startW_norm - deltaX_norm);
        newX = startX_norm + (startW_norm - newW);
      }
      if (direction.includes('s')) {
        newH = Math.max(2, startH_norm + deltaY_norm);
      }
      if (direction.includes('n')) {
        newH = Math.max(2, startH_norm - deltaY_norm);
        newY = startY_norm + (startH_norm - newH);
      }

      // Maintain aspect ratio for corner handles or if Shift is held
      if (isShift || direction.length > 1) {
        if (direction.includes('e') || direction.includes('w')) {
          newH = newW / aspectRatio;
          if (direction.includes('n')) {
            newY = startY_norm + (startH_norm - newH);
          }
        } else {
          newW = newH * aspectRatio;
          if (direction.includes('w')) {
            newX = startX_norm + (startW_norm - newW);
          }
        }
      }

      i.width = newW;
      i.height = newH;
      i.x = newX;
      i.y = newY;
      this.cdr.detectChanges();
    };

    const up = () => {
      this.isResizingImage = false;
      this.resizeImageId = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  removeImage(imageId: string): void {
    this.imageStamps = this.imageStamps.filter(i => i.id !== imageId);
    this.cdr.detectChanges();
  }

  /* ================= Stamp Picker ================= */

  async openStampPicker(): Promise<void> {
    this.showStampGenerator = false;
    this.showStampPickerModal = true;
    this.cdr.detectChanges();
    if (!this.userId) return;

    this.isLoadingSignatures = true;
    try {
      const response = await this.http.post<any>(this.stampsApiUrl, {
        aksi: 'load_stamps', userId: this.userId
      }).toPromise();
      if (response?.success) {
        this.savedStamps = response.data.map((row: any) => ({
          id: row.id,
          name: row.stamp_name,
          type: row.stamp_type,
          dataUrl: row.stamp_data
        }));
      }
    } catch (err) {
      console.error('Error loading stamps', err);
    } finally {
      this.isLoadingSignatures = false;
      this.cdr.detectChanges();
    }
  }

  closeStampPicker(): void {
    this.showStampPickerModal = false;
    this.showStampGenerator = false;
    this.cdr.detectChanges();
  }

  openStampGenerator(): void {
    this.stampGenDocNo = '';
    this.stampGenDate = '';
    this.stampGenTime = '';
    this.stampGenShowDocNo = true;
    this.stampGenShowDate = true;
    this.stampGenShowTime = true;
    this.stampGenNoBorder = false;
    this.showStampGenerator = true;
    this.cdr.detectChanges();
  }

  cancelStampGenerator(): void {
    this.showStampGenerator = false;
    this.cdr.detectChanges();
  }

  triggerStampUpload(): void {
    this.stampFileInputRef?.nativeElement?.click();
  }

  onStampFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const newStamp = { id: 'stamp_' + Date.now() as any, name: file.name.replace(/\.[^/.]+$/, '') || 'ตรายาง', type: 'custom', dataUrl };

      this.isLoadingSignatures = true;
      try {
        if (this.userId) {
          const res = await this.http.post<any>(this.stampsApiUrl, {
            aksi: 'save_stamp', userId: this.userId, stampName: newStamp.name, stampType: newStamp.type, stampData: dataUrl
          }).toPromise();
          if (res?.success) newStamp.id = res.data.id;
        }
        this.savedStamps.unshift(newStamp);
        this.useSavedStamp(newStamp);
      } catch (err) {
        console.error('Error uploading stamp', err);
      } finally {
        this.isLoadingSignatures = false;
        input.value = '';
        this.cdr.detectChanges();
      }
    };
    reader.readAsDataURL(file);
  }

  useSavedStamp(stamp: { id: any; name: string; type: string; dataUrl: string }): void {
    this.pendingStamp = {
      dataUrl: stamp.dataUrl,
      defaultWidth: stamp.type === 'receive' ? 350 : 250
    };
    this.closeStampPicker();
  }

  onStampGhostMove(ev: PointerEvent, pageNum: number): void {
    if (!this.pendingStamp) return;
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    this.stampGhostX = ev.clientX - rect.left;
    this.stampGhostY = ev.clientY - rect.top;
    this.stampGhostPage = pageNum;
    this.cdr.detectChanges();
  }

  onStampGhostClick(ev: PointerEvent, pageNum: number): void {
    if (!this.pendingStamp) return;
    ev.stopPropagation();
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = ev.clientX - rect.left;
    const clickY = ev.clientY - rect.top;

    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      const maxSize = this.pendingStamp!.defaultWidth;
      if (w > maxSize || h > maxSize) {
        if (w > h) { h = (h / w) * maxSize; w = maxSize; }
        else { w = (w / h) * maxSize; h = maxSize; }
      }
      const wPct = (w / rect.width) * 100;
      const hPct = (h / rect.height) * 100;
      this.imageStamps.push({
        id: 'img_' + Date.now() + '_' + Math.random().toString(16).slice(2),
        page: pageNum,
        x: Math.max(0, (clickX / rect.width) * 100 - wPct / 2),
        y: Math.max(0, (clickY / rect.height) * 100 - hPct / 2),
        width: wPct,
        height: hPct,
        dataUrl: this.pendingStamp!.dataUrl
      });
      this.logHistory('image', { type: 'stamp' }, pageNum);
      this.pendingStamp = null;
      this.cdr.detectChanges();
    };
    img.src = this.pendingStamp.dataUrl;
  }

  cancelPendingStamp(): void {
    this.pendingStamp = null;
    this.cdr.detectChanges();
  }

  startStampRename(stamp: any, event: Event): void {
    event.stopPropagation();
    this.stampEditingId = stamp.id;
    this.stampEditingName = stamp.name;
    this.cdr.detectChanges();
    setTimeout(() => {
      const input = document.querySelector('.stamp-name-input') as HTMLInputElement;
      input?.select();
    }, 30);
  }

  async saveStampRename(stamp: any): Promise<void> {
    const name = this.stampEditingName.trim();
    this.stampEditingId = null;
    this.cdr.detectChanges();
    if (!name || name === stamp.name) return;
    stamp.name = name;
    if (!this.userId || (typeof stamp.id === 'string' && stamp.id.startsWith('stamp_'))) return;
    try {
      await this.http.post<any>(this.stampsApiUrl, {
        aksi: 'rename_stamp', id: stamp.id, stampName: name
      }).toPromise();
    } catch (err) {
      console.error('Error renaming stamp', err);
    }
  }

  async deleteSavedStamp(stamp: any, event: Event): Promise<void> {
    event.stopPropagation();
    if (typeof stamp.id === 'string' && stamp.id.startsWith('stamp_')) {
      this.savedStamps = this.savedStamps.filter(s => s.id !== stamp.id);
      this.cdr.detectChanges();
      return;
    }
    try {
      const res = await this.http.post<any>(this.stampsApiUrl, {
        aksi: 'delete_stamp', id: stamp.id
      }).toPromise();
      if (res?.success) {
        this.savedStamps = this.savedStamps.filter(s => s.id !== stamp.id);
        this.cdr.detectChanges();
      }
    } catch (err) {
      console.error('Error deleting stamp', err);
    }
  }

  private drawDottedLine(ctx: CanvasRenderingContext2D, x1: number, y: number, x2: number, color: string): void {
    ctx.save();
    ctx.setLineDash([4, 8]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    ctx.restore();
  }

  saveGeneratedStamp(): void {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // จำนวนแถว (เลขรับ/วันที่/เวลา) ที่เลือกแสดง — ใช้คำนวณความสูงให้พอดี
    const receiveRows = this.stampGenType === 'receive'
      ? [this.stampGenShowDocNo, this.stampGenShowDate, this.stampGenShowTime].filter(Boolean).length
      : 0;
    if (this.stampGenType === 'receive') {
      canvas.width = 800;
      canvas.height = receiveRows > 0 ? 320 + (receiveRows - 1) * 70 : 200;
    } else {
      canvas.width = 800; canvas.height = this.stampGenText3 ? 320 : 260;
    }

    const c = this.stampGenColor;

    // วาดเส้นขอบ (เว้นเมื่อผู้ใช้เลือก "ไม่แสดงเส้นขอบ")
    if (!this.stampGenNoBorder) {
      ctx.strokeStyle = c;
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    }

    const innerTop = 20;
    const innerRight = canvas.width - 20;
    const padX = 40;
    const maxTextW = innerRight - 20 - padX * 2;
    const textCX = canvas.width / 2;

    ctx.fillStyle = c;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    ctx.font = 'bold 50px "THSarabunNew", "Sarabun", Tahoma, sans-serif';
    ctx.fillText(this.stampGenText1 || ' ', textCX, innerTop + 30, maxTextW);

    ctx.font = 'bold 44px "THSarabunNew", "Sarabun", Tahoma, sans-serif';
    ctx.fillText(this.stampGenText2 || ' ', textCX, innerTop + 30 + 60, maxTextW);

    if (this.stampGenType === 'receive') {
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.font = '40px "THSarabunNew", "Sarabun", Tahoma, sans-serif';
      const lx = 20 + padX;
      const lineX1 = lx + 100;
      const lineX2 = innerRight - padX;
      // วาดเฉพาะแถวที่เลือกแสดง แล้วเลื่อนตำแหน่งต่อเนื่อง (ไม่เว้นช่องว่าง)
      const rows: { label: string; value: string; isTime?: boolean }[] = [];
      if (this.stampGenShowDocNo) rows.push({ label: 'เลขรับ', value: this.stampGenDocNo });
      if (this.stampGenShowDate) rows.push({ label: 'วันที่', value: this.stampGenDate });
      if (this.stampGenShowTime) rows.push({ label: 'เวลา', value: this.stampGenTime, isTime: true });
      let ry = 280;
      for (const r of rows) {
        const endX = r.isTime ? lineX2 - 60 : lineX2;
        ctx.textAlign = 'left';
        ctx.fillText(r.label, lx, ry);
        this.drawDottedLine(ctx, lineX1, ry, endX, c);
        if (r.value) { ctx.fillStyle = '#000000'; ctx.fillText(r.value, lineX1 + 20, ry); ctx.fillStyle = c; }
        if (r.isTime) { ctx.textAlign = 'right'; ctx.fillText('น.', lineX2, ry); }
        ry += 70;
      }
    } else if (this.stampGenText3) {
      ctx.font = 'bold 40px "THSarabunNew", "Sarabun", Tahoma, sans-serif';
      ctx.fillText(this.stampGenText3, textCX, innerTop + 30 + 130, maxTextW);
    }

    const dataUrl = canvas.toDataURL('image/png');
    const newStamp = { id: 'stamp_' + Date.now() as any, name: this.stampGenText1 || 'ตราประทับ', type: this.stampGenType, dataUrl };

    if (!this.userId) {
      this.savedStamps.unshift(newStamp);
      this.useSavedStamp(newStamp);
      return;
    }

    this.isLoadingSignatures = true;
    this.http.post<any>(this.stampsApiUrl, {
      aksi: 'save_stamp', userId: this.userId, stampName: newStamp.name, stampType: newStamp.type, stampData: dataUrl
    }).toPromise().then((res: any) => {
      if (res?.success) newStamp.id = res.data.id;
      this.savedStamps.unshift(newStamp);
      this.useSavedStamp(newStamp);
    }).catch((err: any) => {
      console.error('Error saving stamp', err);
    }).finally(() => {
      this.isLoadingSignatures = false;
      this.cdr.detectChanges();
    });
  }

  /* ================= Signature Pad ================= */
  openSignaturePad(): void {
    this.showSignaturePad = true;
    this.signaturePoints = [];
    this.signatureStrokes = [];
    this.sigMode = 'draw';
    this.typedText = '';

    setTimeout(() => {
      this.initSignatureCanvas();
    }, 100);
  }

  closeSignaturePad(): void {
    this.showSignaturePad = false;
    this.signaturePoints = [];
    this.signatureStrokes = [];
    this.sigMode = 'draw';
    this.typedText = '';
  }

  setSignaturePenColor(color: string): void {
    this.signaturePenColor = color;
  }

  changeSignaturePenSize(delta: number): void {
    const newSize = this.signaturePenSize + delta;
    if (newSize >= 1 && newSize <= 10) {
      this.signaturePenSize = newSize;
    }
  }

  switchSigMode(mode: 'draw' | 'type'): void {
    this.sigMode = mode;
    if (mode === 'draw') {
      this.typedText = '';
      this.signatureStrokes = [];
      this.signaturePoints = [];
      setTimeout(() => this.initSignatureCanvas(), 50);
    } else {
      setTimeout(() => this.renderTypedCanvas(), 50);
    }
    this.cdr.detectChanges();
  }

  onTypedInput(): void {
    this.renderTypedCanvas();
    this.cdr.detectChanges();
  }

  pickTypedFont(index: number): void {
    this.typedFontIndex = index;
    this.renderTypedCanvas();
    this.cdr.detectChanges();
  }

  renderTypedCanvas(): void {
    const canvas = this.signatureCanvasRef?.nativeElement;
    if (!canvas) return;

    if (canvas.width <= 1) {
      const container = canvas.parentElement;
      const cStyle = container ? getComputedStyle(container) : null;
      const padH = cStyle ? parseFloat(cStyle.paddingLeft) + parseFloat(cStyle.paddingRight) : 0;
      const w = container ? Math.max(200, container.clientWidth - padH - 4) : 400;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor((w / 2) * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = (w / 2) + 'px';
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, h * 0.7);
    ctx.lineTo(w - 20, h * 0.7);
    ctx.stroke();
    ctx.restore();

    if (!this.typedText) return;

    const font = this.typedFontOptions[this.typedFontIndex];
    const fontSize = Math.round(h * 0.4);
    ctx.font = `${font.style} ${font.weight} ${fontSize}px ${font.family}`;
    ctx.fillStyle = this.signaturePenColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(this.typedText, w / 2, h * 0.65);
  }

  private initSignatureCanvas(): void {
    const canvas = this.signatureCanvasRef?.nativeElement;
    if (!canvas) return;

    const container = canvas.parentElement;
    const cStyle = container ? getComputedStyle(container) : null;
    const padH = cStyle ? parseFloat(cStyle.paddingLeft) + parseFloat(cStyle.paddingRight) : 0;
    const containerWidth = container ? Math.max(200, container.clientWidth - padH - 4) : 400;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(containerWidth * dpr);
    canvas.height = Math.floor((containerWidth / 2) * dpr);
    canvas.style.width = containerWidth + 'px';
    canvas.style.height = (containerWidth / 2) + 'px';

    this.signatureCtx = canvas.getContext('2d');
    if (this.signatureCtx) {
      this.signatureCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.signatureCtx.strokeStyle = this.signaturePenColor;
      this.signatureCtx.lineWidth = this.signaturePenSize;
      this.signatureCtx.lineCap = 'round';
      this.signatureCtx.lineJoin = 'round';
    }

    // Remove old listeners first (prevents duplicates)
    canvas.removeEventListener('pointerdown', this.boundOnSigStart);
    canvas.removeEventListener('pointermove', this.boundOnSigMove);
    canvas.removeEventListener('pointerup', this.boundOnSigEnd);
    canvas.removeEventListener('pointerleave', this.boundOnSigEnd);

    this.boundOnSigStart = this.onSignatureStart.bind(this);
    this.boundOnSigMove = this.onSignatureMove.bind(this);
    this.boundOnSigEnd = this.onSignatureEnd.bind(this);

    canvas.addEventListener('pointerdown', this.boundOnSigStart);
    canvas.addEventListener('pointermove', this.boundOnSigMove);
    canvas.addEventListener('pointerup', this.boundOnSigEnd);
    canvas.addEventListener('pointerleave', this.boundOnSigEnd);
  }

  private boundOnSigStart: any;
  private boundOnSigMove: any;
  private boundOnSigEnd: any;

  private getSignaturePos(e: PointerEvent): { x: number; y: number } {
    const canvas = this.signatureCanvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left),
      y: (e.clientY - rect.top)
    };
  }

  private onSignatureStart(e: PointerEvent): void {
    e.preventDefault();
    this.isDrawingSignature = true;
    const pos = this.getSignaturePos(e);
    this.signaturePoints = [pos];
  }

  private onSignatureMove(e: PointerEvent): void {
    if (!this.isDrawingSignature || !this.signatureCtx) return;
    e.preventDefault();

    const pos = this.getSignaturePos(e);
    this.signaturePoints.push(pos);

    // Redraw everything for smooth Bezier rendering
    this.redrawSignatureCanvas();
  }

  private onSignatureEnd(e: PointerEvent): void {
    if (!this.isDrawingSignature) return;
    this.isDrawingSignature = false;

    if (this.signaturePoints.length >= 2) {
      this.signatureStrokes.push({
        points: [...this.signaturePoints],
        color: this.signaturePenColor,
        size: this.signaturePenSize
      });
    }
    this.signaturePoints = [];
  }

  private redrawSignatureCanvas(): void {
    const canvas = this.signatureCanvasRef?.nativeElement;
    if (!canvas || !this.signatureCtx) return;

    const ctx = this.signatureCtx;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Draw guide line at ~70% height
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, h * 0.7);
    ctx.lineTo(w - 20, h * 0.7);
    ctx.stroke();
    ctx.restore();

    // Draw all saved strokes
    for (const stroke of this.signatureStrokes) {
      this.drawBezierStroke(ctx, stroke.points, stroke.color, stroke.size);
    }

    // Draw current active stroke
    if (this.signaturePoints.length >= 2) {
      this.drawBezierStroke(ctx, this.signaturePoints, this.signaturePenColor, this.signaturePenSize);
    }
  }

  private drawBezierStroke(
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[],
    color: string,
    size: number,
    scale: number = 1
  ): void {
    if (points.length < 2) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = size * scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x * scale, points[0].y * scale);

    if (points.length === 2) {
      ctx.lineTo(points[1].x * scale, points[1].y * scale);
    } else {
      // Quadratic Bezier smoothing through midpoints
      for (let i = 1; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2 * scale;
        const midY = (points[i].y + points[i + 1].y) / 2 * scale;
        ctx.quadraticCurveTo(points[i].x * scale, points[i].y * scale, midX, midY);
      }
      // Connect to last point
      const last = points[points.length - 1];
      ctx.lineTo(last.x * scale, last.y * scale);
    }
    ctx.stroke();
  }

  clearSignaturePad(): void {
    this.signaturePoints = [];
    this.signatureStrokes = [];
    this.redrawSignatureCanvas();
  }

  /** Render strokes at high resolution on an offscreen canvas and auto-crop */
  private trimSignatureCanvas(): string {
    const srcCanvas = this.signatureCanvasRef?.nativeElement;
    if (!srcCanvas) return '';

    const cssW = srcCanvas.clientWidth || 400;
    const cssH = srcCanvas.clientHeight || 200;

    const exportScale = 8;
    const offW = Math.floor(cssW * exportScale);
    const offH = Math.floor(cssH * exportScale);

    const offCanvas = document.createElement('canvas');
    offCanvas.width = offW;
    offCanvas.height = offH;
    const ctx = offCanvas.getContext('2d')!;

    ctx.clearRect(0, 0, offW, offH);

    if (this.sigMode === 'type') {
      // Render typed text at high resolution
      const font = this.typedFontOptions[this.typedFontIndex];
      const fontSize = Math.round(cssH * 0.4 * exportScale);
      ctx.font = `${font.style} ${font.weight} ${fontSize}px ${font.family}`;
      ctx.fillStyle = this.signaturePenColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(this.typedText, offW / 2, offH * 0.65);
    } else {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (const stroke of this.signatureStrokes) {
        if (stroke.points.length < 2) continue;
        this.drawBezierStroke(ctx, stroke.points, stroke.color, stroke.size, exportScale);
      }
      if (this.signaturePoints.length >= 2) {
        this.drawBezierStroke(ctx, this.signaturePoints, this.signaturePenColor, this.signaturePenSize, exportScale);
      }
    }

    // Auto-crop to content bounds
    const imgData = ctx.getImageData(0, 0, offW, offH);
    const { data, width, height } = imgData;

    let top = height, left = width, right = 0, bottom = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha > 10) {
          if (y < top) top = y;
          if (y > bottom) bottom = y;
          if (x < left) left = x;
          if (x > right) right = x;
        }
      }
    }

    // No content found
    if (top > bottom || left > right) return offCanvas.toDataURL('image/png');

    // Add padding
    const pad = Math.round(4 * exportScale);
    top = Math.max(0, top - pad);
    left = Math.max(0, left - pad);
    bottom = Math.min(height - 1, bottom + pad);
    right = Math.min(width - 1, right + pad);

    const trimW = right - left + 1;
    const trimH = bottom - top + 1;

    const trimCanvas = document.createElement('canvas');
    trimCanvas.width = trimW;
    trimCanvas.height = trimH;
    const trimCtx = trimCanvas.getContext('2d')!;
    trimCtx.drawImage(offCanvas, left, top, trimW, trimH, 0, 0, trimW, trimH);

    return trimCanvas.toDataURL('image/png');
  }

  saveSignature(): void {
    if (this.sigMode === 'type') {
      if (!this.typedText.trim()) {
        this.closeSignaturePad();
        return;
      }
      this.renderTypedCanvas();
      const dataUrl = this.trimSignatureCanvas();
      this.placeSignatureOnCanvas(dataUrl);
      this.closeSignaturePad();
      return;
    }

    const canvas = this.signatureCanvasRef?.nativeElement;
    const totalPoints = this.signatureStrokes.reduce((sum, s) => sum + s.points.length, 0);
    if (!canvas || totalPoints < 2) {
      this.closeSignaturePad();
      return;
    }

    const dataUrl = this.trimSignatureCanvas();
    this.placeSignatureOnCanvas(dataUrl);
    this.closeSignaturePad();
  }

  startSignatureDrag(e: PointerEvent, sigId: string): void {
    if (this.toolMode !== 'none') return;
    this.closeContextMenu();

    this.activeObjectId = sigId;
    this.activeObjectType = 'signature';

    const sig = this.signatureStamps.find(s => s.id === sigId);
    if (!sig) return;

    const canvasRect = this.getDragCanvasRect(sig.page);
    const startXpx = (sig.x / 100) * canvasRect.width;
    const startYpx = (sig.y / 100) * canvasRect.height;

    const offsetX = e.clientX - canvasRect.left - startXpx;
    const offsetY = e.clientY - canvasRect.top - startYpx;

    const move = (ev: PointerEvent) => {
      ev.preventDefault();
      const s = this.signatureStamps.find(x => x.id === sigId);
      if (!s) return;

      const mouseXpx = ev.clientX - canvasRect.left - offsetX;
      const mouseYpx = ev.clientY - canvasRect.top - offsetY;

      s.x = (mouseXpx / canvasRect.width) * 100;
      s.y = (mouseYpx / canvasRect.height) * 100;
      this.cdr.detectChanges();
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  startSignatureResize(ev: PointerEvent, sigId: string, direction: ResizeDirection = 'se'): void {
    if (ev.button === 2 || ev.ctrlKey) return;
    ev.stopPropagation();
    ev.preventDefault();

    const sig = this.signatureStamps.find(s => s.id === sigId);
    if (!sig) return;

    const canvasRect = this.getDragCanvasRect(sig.page);
    const startX = ev.clientX;
    const startY = ev.clientY;

    const startW_norm = sig.width;
    const startH_norm = sig.height;
    const startX_norm = sig.x;
    const startY_norm = sig.y;
    const aspectRatio = startW_norm / startH_norm;

    const move = (e: PointerEvent) => {
      e.preventDefault();
      const s = this.signatureStamps.find(x => x.id === sigId);
      if (!s) return;

      const deltaX_norm = ((e.clientX - startX) / canvasRect.width) * 100;
      const deltaY_norm = ((e.clientY - startY) / canvasRect.height) * 100;

      const isShift = e.shiftKey;

      let newW = startW_norm;
      let newH = startH_norm;
      let newX = startX_norm;
      let newY = startY_norm;

      if (direction.includes('e')) {
        newW = Math.max(2, startW_norm + deltaX_norm);
      }
      if (direction.includes('w')) {
        newW = Math.max(2, startW_norm - deltaX_norm);
        newX = startX_norm + (startW_norm - newW);
      }
      if (direction.includes('s')) {
        newH = Math.max(2, startH_norm + deltaY_norm);
      }
      if (direction.includes('n')) {
        newH = Math.max(2, startH_norm - deltaY_norm);
        newY = startY_norm + (startH_norm - newH);
      }

      // Maintain aspect ratio for corners or if Shift is held
      if (isShift || direction.length > 1) {
        if (direction.includes('e') || direction.includes('w')) {
          newH = newW / aspectRatio;
          if (direction.includes('n')) {
            newY = startY_norm + (startH_norm - newH);
          }
        } else {
          newW = newH * aspectRatio;
          if (direction.includes('w')) {
            newX = startX_norm + (startW_norm - newW);
          }
        }
      }

      s.width = newW;
      s.height = newH;
      s.x = newX;
      s.y = newY;
      this.cdr.detectChanges();
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  removeSignature(sigId: string): void {
    this.signatureStamps = this.signatureStamps.filter(s => s.id !== sigId);
    this.cdr.detectChanges();
  }

  /* ================= Saved Signatures (Database) ================= */

  // Open signature picker modal
  openSignaturePickerOrPad(): void {
    // If user has saved signatures, show picker
    if (this.savedSignatures.length > 0) {
      this.showSignaturePicker = true;
    } else {
      // Otherwise, load from API first
      this.loadSavedSignatures().then(() => {
        if (this.savedSignatures.length > 0) {
          this.showSignaturePicker = true;
        } else {
          // No saved signatures, open draw pad
          this.openSignaturePad();
        }
      });
    }
  }

  closeSignaturePicker(): void {
    this.showSignaturePicker = false;
  }

  // Load saved signatures from API
  async loadSavedSignatures(): Promise<void> {
    if (!this.userId) {
      console.warn('userId is not set, cannot load signatures');
      return;
    }

    this.isLoadingSignatures = true;

    try {
      const response = await this.http.post<any>(this.signaturesApiUrl, {
        aksi: 'get_signatures',
        user_id: this.userId
      }).toPromise();

      if (response?.success) {
        let sigs = response.signatures;
        if (sigs && typeof sigs === 'object' && !Array.isArray(sigs)) {
          sigs = Object.keys(sigs).length === 0 ? [] : Object.values(sigs);
        }
        this.savedSignatures = sigs || [];
      } else {
        console.error('Failed to load signatures:', response?.msg);
      }
    } catch (err) {
      console.error('Error loading signatures:', err);
    } finally {
      this.isLoadingSignatures = false;
    }
  }

  // Save current signature to database
  async saveSignatureToDatabase(signatureName?: string): Promise<void> {
    if (this.sigMode === 'type') {
      if (!this.typedText.trim()) return;
      this.renderTypedCanvas();
    } else {
      const canvas = this.signatureCanvasRef?.nativeElement;
      const totalPoints = this.signatureStrokes.reduce((sum, s) => sum + s.points.length, 0);
      if (!canvas || totalPoints < 2) return;
    }

    if (!this.userId) {
      console.warn('userId is not set, cannot save signature');
      this.saveSignature();
      return;
    }

    const dataUrl = this.trimSignatureCanvas();

    this.isLoadingSignatures = true;

    try {
      const response = await this.http.post<any>(this.signaturesApiUrl, {
        aksi: 'save_signature',
        user_id: this.userId,
        signature_name: signatureName || '',
        signature_data: dataUrl
      }).toPromise();

      if (response?.success) {
        // Add to local list
        this.savedSignatures.push({
          id: response.id,
          user_id: this.userId,
          signature_name: response.signature_name,
          signature_data: dataUrl,
          is_default: this.savedSignatures.length === 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        // Also place the signature on canvas
        this.placeSignatureOnCanvas(dataUrl);
      } else {
        console.error('Failed to save signature:', response?.msg);
        // Fallback: just use locally
        this.saveSignature();
      }
    } catch (err) {
      console.error('Error saving signature:', err);
      this.saveSignature();
    } finally {
      this.isLoadingSignatures = false;
      this.closeSignaturePad();
    }
  }

  // Use a saved signature from the list
  useSavedSignature(sig: SavedSignature): void {
    this.placeSignatureOnCanvas(sig.signature_data);
    this.closeSignaturePicker();
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  // Place signature image on canvas (Starts placement mode)
  private placeSignatureOnCanvas(dataUrl: string): void {
    this.pendingSignatureDataUrl = dataUrl;
    this.toolMode = 'signature';
    this.updateCursor();
    this.presentToast('คลิกที่ PDF เพื่อวางลายเซ็น');
  }

  // Delete saved signature from database
  async deleteSavedSignature(sig: SavedSignature, event?: Event): Promise<void> {
    if (event) {
      event.stopPropagation();
    }

    if (!this.userId) return;

    this.isLoadingSignatures = true;

    try {
      const response = await this.http.post<any>(this.signaturesApiUrl, {
        aksi: 'delete_signature',
        id: sig.id,
        user_id: this.userId
      }).toPromise();

      if (response?.success) {
        this.savedSignatures = this.savedSignatures.filter(s => s.id !== sig.id);
      } else {
        console.error('Failed to delete signature:', response?.msg);
      }
    } catch (err) {
      console.error('Error deleting signature:', err);
    } finally {
      this.isLoadingSignatures = false;
    }
  }

  // Set signature as default
  async setDefaultSignature(sig: SavedSignature, event?: Event): Promise<void> {
    if (event) {
      event.stopPropagation();
    }

    if (!this.userId) return;

    try {
      const response = await this.http.post<any>(this.signaturesApiUrl, {
        aksi: 'set_default',
        id: sig.id,
        user_id: this.userId
      }).toPromise();

      if (response?.success) {
        // Update local list
        this.savedSignatures.forEach(s => {
          s.is_default = (s.id === sig.id);
        });
      }
    } catch (err) {
      console.error('Error setting default:', err);
    }
  }

  // Open signature pad from picker (to draw new one)
  openSignaturePadFromPicker(): void {
    this.closeSignaturePicker();
    this.openSignaturePad();
  }

  // Trigger file input for signature upload
  triggerSignatureUpload(): void {
    this.signatureFileInputRef?.nativeElement?.click();
  }

  // Handle signature file selection
  async onSignatureFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      let dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      // Remove white background
      this.isLoadingSignatures = true;
      try {
        dataUrl = await this.removeWhiteBackground(dataUrl);
      } catch (err) {
        console.warn('Could not remove background:', err);
      }

      // Save to database if userId is set
      if (this.userId) {
        try {
          const response = await this.http.post<any>(this.signaturesApiUrl, {
            aksi: 'save_signature',
            user_id: this.userId,
            signature_name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            signature_data: dataUrl
          }).toPromise();

          if (response?.success) {
            if (!Array.isArray(this.savedSignatures)) {
              this.savedSignatures = [];
            }
            this.savedSignatures.push({
              id: response.id,
              user_id: this.userId,
              signature_name: response.signature_name,
              signature_data: dataUrl,
              is_default: this.savedSignatures.length === 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            this.placeSignatureOnCanvas(dataUrl);
            this.closeSignaturePicker();
            this.closeSignaturePad();
          }
        } catch (err) {
          console.error('Error uploading signature:', err);
        }
      } else {
        // No userId, just use directly
        this.placeSignatureOnCanvas(dataUrl);
        this.closeSignaturePicker();
        this.closeSignaturePad();
      }

      this.isLoadingSignatures = false;
      // Reset input
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  // Remove white/light background from image, making it transparent
  private removeWhiteBackground(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Could not get canvas context');
          return;
        }

        // Draw image
        ctx.drawImage(img, 0, 0);

        // Get pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Threshold for "white" - pixels with RGB all above this value will be made transparent
        const threshold = 240;
        // Also make near-white pixels semi-transparent for smoother edges
        const softThreshold = 200;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Check if pixel is white/near-white
          if (r > threshold && g > threshold && b > threshold) {
            // Make fully transparent
            data[i + 3] = 0;
          } else if (r > softThreshold && g > softThreshold && b > softThreshold) {
            // Make semi-transparent for smoother edges
            const avg = (r + g + b) / 3;
            const alpha = Math.max(0, 255 - (avg - softThreshold) * (255 / (threshold - softThreshold)));
            data[i + 3] = Math.min(data[i + 3], alpha);
          }
        }

        // Put modified data back
        ctx.putImageData(imageData, 0, 0);

        // Return as PNG (supports transparency)
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject('Failed to load image');
      img.src = dataUrl;
    });
  }

  /* ================= PDF Form Fields ================= */

  enableFormFieldMode(type: 'text' | 'checkbox' | 'radio'): void {
    this.formFieldType = type;
    this.toolMode = 'formfield';
    this.showMarkOptions = true;
    this.updateCursor();
    const labels = { text: 'Text Field', checkbox: 'Checkbox', radio: 'Radio Button' };
    this.presentToast(`คลิกบนเอกสารเพื่อวาง ${labels[type]}`);
  }

  getFormFieldsForPage(page: number): PdfFormField[] {
    return this.pdfFormFields.filter(f => f.page === page);
  }

  removeFormField(id: string): void {
    this.pdfFormFields = this.pdfFormFields.filter(f => f.id !== id);
    this.cdr.detectChanges();
  }

  startFormFieldDrag(e: PointerEvent, id: string): void {
    if (e.button === 2 || e.ctrlKey) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.classList.contains('resize-handle')) return;
    e.stopPropagation();
    e.preventDefault();
    this.activeFormFieldId = id;
    this.activeTextBoxId = null; // ปิดแถบกล่องข้อความเมื่อสลับมาแก้ฟอร์ม
    this.activeObjectId = null;
    this.activeObjectType = null;

    const ff = this.pdfFormFields.find(f => f.id === id);
    if (!ff) return;

    const canvasRect = this.getDragCanvasRect(ff.page);
    const startXpx = (ff.x / 100) * canvasRect.width;
    const startYpx = (ff.y / 100) * canvasRect.height;
    const offsetX = e.clientX - canvasRect.left - startXpx;
    const offsetY = e.clientY - canvasRect.top - startYpx;

    const move = (ev: PointerEvent) => {
      ev.preventDefault();
      const f = this.pdfFormFields.find(x => x.id === id);
      if (!f) return;
      f.x = ((ev.clientX - canvasRect.left - offsetX) / canvasRect.width) * 100;
      f.y = ((ev.clientY - canvasRect.top - offsetY) / canvasRect.height) * 100;
      this.cdr.detectChanges();
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  startMarkDrag(e: PointerEvent, markId: string): void {
    if (e.button === 2 || e.ctrlKey) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.classList.contains('pff-resize-handle')) return;
    e.stopPropagation();
    e.preventDefault();

    this.activeObjectId = markId;
    this.activeObjectType = 'image';
    this.cdr.detectChanges();

    const img = this.imageStamps.find(i => i.id === markId);
    if (!img) return;

    const canvasRect = this.getDragCanvasRect(img.page);
    const offsetX = e.clientX - canvasRect.left - (img.x / 100) * canvasRect.width;
    const offsetY = e.clientY - canvasRect.top - (img.y / 100) * canvasRect.height;

    const move = (ev: PointerEvent) => {
      ev.preventDefault();
      const i = this.imageStamps.find(x => x.id === markId);
      if (!i) return;
      i.x = ((ev.clientX - canvasRect.left - offsetX) / canvasRect.width) * 100;
      i.y = ((ev.clientY - canvasRect.top - offsetY) / canvasRect.height) * 100;
      this.cdr.detectChanges();
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  startFormFieldResize(e: PointerEvent, id: string, dir: ResizeDirection): void {
    e.stopPropagation();
    e.preventDefault();
    const ff = this.pdfFormFields.find(f => f.id === id);
    if (!ff) return;

    const canvasRect = this.getDragCanvasRect(ff.page);
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = ff.x; const origY = ff.y;
    const origW = ff.width; const origH = ff.height;

    const move = (ev: PointerEvent) => {
      ev.preventDefault();
      const f = this.pdfFormFields.find(x => x.id === id);
      if (!f) return;
      const dx = ((ev.clientX - startX) / canvasRect.width) * 100;
      const dy = ((ev.clientY - startY) / canvasRect.height) * 100;
      if (dir.includes('e')) f.width = Math.max(2, origW + dx);
      if (dir.includes('s')) f.height = Math.max(2, origH + dy);
      if (dir.includes('w')) { f.x = origX + dx; f.width = Math.max(2, origW - dx); }
      if (dir.includes('n')) { f.y = origY + dy; f.height = Math.max(2, origH - dy); }
      this.cdr.detectChanges();
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  changeFormFieldFontSize(id: string, delta: number): void {
    const ff = this.pdfFormFields.find(f => f.id === id);
    if (!ff) return;
    ff.fontSize = Math.max(6, Math.min(72, (ff.fontSize ?? 12) + delta));
    this.cdr.detectChanges();
  }

  changeFormFieldSize(id: string, delta: number): void {
    const ff = this.pdfFormFields.find(f => f.id === id);
    if (!ff) return;
    if (ff.type === 'text') {
      ff.height = Math.max(1.5, Math.min(30, ff.height + delta));
    } else {
      const s = Math.max(1, Math.min(30, ff.width + delta));
      ff.width = s;
      ff.height = s;
    }
    this.cdr.detectChanges();
  }

  toggleFormFieldBorder(id: string): void {
    const ff = this.pdfFormFields.find(f => f.id === id);
    if (!ff) return;
    ff.borderVisible = !(ff.borderVisible ?? true);
    this.cdr.detectChanges();
  }

  /* ================= Quick Mark Stamps ================= */

  enableMarkMode(type: 'check' | 'cross' | 'dot'): void {
    this.markType = type;
    this.toolMode = 'mark';
    this.showMarkOptions = true;
    this.updateCursor();
    const labels: Record<string, string> = {
      check: '✓ เครื่องหมายถูก', cross: '✗ เครื่องหมายผิด', dot: '● จุด',
    };
    this.presentToast(`คลิกบนเอกสารเพื่อวาง ${labels[type]}`);
  }

  setMarkColor(color: string): void {
    this.markColor = color;
  }

  changeMarkSize(delta: number): void {
    this.markSize = Math.max(12, Math.min(96, this.markSize + delta));
  }

  changeMarkStampSize(id: string, delta: number): void {
    const img = this.imageStamps.find(i => i.id === id);
    if (!img) return;
    const newSize = Math.max(1, Math.min(25, img.width + delta * 0.5));
    img.width = newSize;
    img.height = newSize;
    if (img.markType && img.markColor) {
      img.dataUrl = this.generateMarkDataUrl(img.markType, img.markColor, Math.round(newSize * 10));
    }
    this.cdr.detectChanges();
  }

  generateMarkDataUrl(type: 'check' | 'cross' | 'dot', color: string, sizePx: number): string {
    const s = Math.round(sizePx);
    const canvas = document.createElement('canvas');
    canvas.width = s;
    canvas.height = s;
    const ctx = canvas.getContext('2d')!;
    const sw = Math.max(2, s * 0.10);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = sw;

    if (type === 'check') {
      ctx.beginPath();
      ctx.moveTo(s * 0.12, s * 0.52);
      ctx.lineTo(s * 0.42, s * 0.82);
      ctx.lineTo(s * 0.88, s * 0.18);
      ctx.stroke();
    } else if (type === 'cross') {
      ctx.beginPath();
      ctx.moveTo(s * 0.15, s * 0.15);
      ctx.lineTo(s * 0.85, s * 0.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.85, s * 0.15);
      ctx.lineTo(s * 0.15, s * 0.85);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(s / 2, s / 2, s * 0.38, 0, Math.PI * 2);
      ctx.fill();
    }
    return canvas.toDataURL('image/png');
  }

  /* ================= Date Stamp ================= */
  addDateStamp(): void {
    this.toolMode = 'date';
    this.updateCursor();
    this.presentToast('คลิกบนเอกสารเพื่อวางวันที่');
  }

  startDateDrag(ev: PointerEvent, dateId: string): void {
    if (ev.button === 2 || ev.ctrlKey) return;
    ev.stopPropagation();
    const target = ev.target as HTMLElement;
    if (target.closest('button')) return;

    ev.preventDefault();

    const ds = this.dateStamps.find(d => d.id === dateId);
    if (!ds) return;

    const canvasRect = this.getDragCanvasRect(ds.page);
    const startXpx = (ds.x / 100) * canvasRect.width;
    const startYpx = (ds.y / 100) * canvasRect.height;

    const offsetX = ev.clientX - canvasRect.left - startXpx;
    const offsetY = ev.clientY - canvasRect.top - startYpx;

    const move = (e: PointerEvent) => {
      e.preventDefault();
      const d = this.dateStamps.find(x => x.id === dateId);
      if (!d) return;

      const mouseXpx = e.clientX - canvasRect.left - offsetX;
      const mouseYpx = e.clientY - canvasRect.top - offsetY;

      d.x = (mouseXpx / canvasRect.width) * 100;
      d.y = (mouseYpx / canvasRect.height) * 100;
      this.cdr.detectChanges();
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  removeDateStamp(dateId: string): void {
    this.dateStamps = this.dateStamps.filter(d => d.id !== dateId);
    this.cdr.detectChanges();
  }

  /* ================= Text Style ================= */
  toggleBold(): void {
    if (this.activeTextBox) {
      this.activeTextBox.bold = !this.activeTextBox.bold;
      this.tbDefaultBold = this.activeTextBox.bold;
      this.cdr.detectChanges();
      this.saveSettings();
    }
  }

  toggleItalic(): void {
    if (this.activeTextBox) {
      this.activeTextBox.italic = !this.activeTextBox.italic;
      this.tbDefaultItalic = this.activeTextBox.italic;
      this.cdr.detectChanges();
      this.saveSettings();
    }
  }

  setAlign(a: 'left' | 'center' | 'right'): void {
    if (this.activeTextBox) {
      this.activeTextBox.align = a;
      this.tbDefaultAlign = a;
      this.cdr.detectChanges();
      this.saveSettings();
    }
  }

  setTextColor(color: string): void {
    this.textColor = color;
    if (this.activeTextBox) {
      this.activeTextBox.color = color;
      this.cdr.detectChanges();
    }
    this.saveSettings();
  }

  setTbFontFamily(tb: TextBox, family: string): void {
    tb.fontFamily = family;
    this.tbDefaultFontFamily = family;
    this.cdr.detectChanges();
    this.saveSettings();
  }

  setTbOpacity(tb: TextBox, val: number): void {
    tb.opacity = Math.max(0, Math.min(1, +val || 1));
    this.cdr.detectChanges();
  }

  setTbRotation(tb: TextBox, val: number): void {
    tb.rotation = +val || 0;
    this.cdr.detectChanges();
  }

  setTbLetterSpacing(tb: TextBox, val: number): void {
    tb.letterSpacing = +val || 0;
    this.cdr.detectChanges();
  }

  changeTbLetterSpacing(tb: TextBox, delta: number): void {
    const cur = +(tb.letterSpacing ?? 0);
    tb.letterSpacing = Math.max(-5, Math.min(30, Math.round((cur + delta) * 10) / 10));
    this.cdr.detectChanges();
  }

  toggleLsDrop(id: string): void {
    this.lsDropOpenId = this.lsDropOpenId === id ? null : id;
    this.cdr.detectChanges();
  }

  pickLetterSpacing(tb: TextBox, val: number): void {
    tb.letterSpacing = val;
    this.tbDefaultLetterSpacing = val;
    this.lsDropOpenId = null;
    this.cdr.detectChanges();
    this.resizeTextBox(tb);
    this.saveSettings();
  }

  changeTbLineHeight(tb: TextBox, delta: number): void {
    const cur = +(tb.lineHeight ?? 1.4);
    tb.lineHeight = Math.max(1, Math.min(4, Math.round((cur + delta) * 10) / 10));
    this.tbDefaultLineHeight = tb.lineHeight;
    this.cdr.detectChanges();
    this.saveSettings();
  }

  /* ================= Serialize JSON ================= */
  exportDrawingJson(): string {
    return JSON.stringify({
      version: 3,
      strokes: this.strokes,
      shapes: this.shapes,
      textBoxes: this.textBoxes,
      imageStamps: this.imageStamps,
      signatureStamps: this.signatureStamps,
      dateStamps: this.dateStamps
    });
  }

  /* ================= Save PDF (ALL PAGES) ================= */
  private renderOverlayToPngBytes(pageNo: number, pdfW: number, pdfH: number): Uint8Array {
    const strokes = this.strokes[pageNo] || [];
    const shapes = this.shapes[pageNo] || [];

    const off = document.createElement('canvas');
    off.width = Math.floor(pdfW);
    off.height = Math.floor(pdfH);

    const ctx = off.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, off.width, off.height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const canvas = this.getAnnotCanvas(pageNo);
    const viewWidth = canvas ? canvas.clientWidth : 800;
    const thicknessScale = (pdfW / Math.max(1, viewWidth)) * 1.5;

    // Draw strokes
    for (const s of strokes) {
      if (!s.points.length) continue;
      if (s.isHighlight) {
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.globalCompositeOperation = 'multiply';
      }
      ctx.strokeStyle = s.color;
      ctx.beginPath();
      for (let i = 0; i < s.points.length; i++) {
        const pt = s.points[i];
        const x = pt.x * off.width;
        const y = pt.y * off.height;
        ctx.lineWidth = this.calcLineWidth(s.size, pt.p) * thicknessScale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      if (s.isHighlight) ctx.restore();
    }

    // Draw shapes
    for (const sh of shapes) {
      const x1 = sh.startX * off.width;
      const y1 = sh.startY * off.height;
      const x2 = sh.endX * off.width;
      const y2 = sh.endY * off.height;
      ctx.strokeStyle = sh.color;
      ctx.lineWidth = sh.size * thicknessScale;
      ctx.beginPath();
      switch (sh.type) {
        case 'rect':
          ctx.rect(x1, y1, x2 - x1, y2 - y1);
          if (sh.fillColor) { ctx.fillStyle = sh.fillColor; ctx.fill(); }
          break;
        case 'circle': {
          const cx = (x1 + x2) / 2;
          const cy = (y1 + y2) / 2;
          const rx = Math.abs(x2 - x1) / 2;
          const ry = Math.abs(y2 - y1) / 2;
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          if (sh.fillColor) { ctx.fillStyle = sh.fillColor; ctx.fill(); }
          break;
        }
        case 'line': ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); break;
        case 'arrow': {
          ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.stroke();
          const angle2 = Math.atan2(y2 - y1, x2 - x1);
          const headLen = 15 * thicknessScale;
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(x2 - headLen * Math.cos(angle2 - Math.PI / 6), y2 - headLen * Math.sin(angle2 - Math.PI / 6));
          ctx.moveTo(x2, y2);
          ctx.lineTo(x2 - headLen * Math.cos(angle2 + Math.PI / 6), y2 - headLen * Math.sin(angle2 + Math.PI / 6));
          break;
        }
      }
      ctx.stroke();
    }



    const b64 = off.toDataURL('image/png').split(',')[1];
    return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  }

  // Helper to map visual percentage coordinates to physical PDF coordinates
  private getPdfPlacement(
    vxPercent: number, vyPercent: number, vwPercent: number, vhPercent: number,
    pageWidth: number, pageHeight: number, pageRotation: number
  ) {
    const isRot = pageRotation === 90 || pageRotation === 270 || pageRotation === -90 || pageRotation === -270;
    // vW and vH are the dimensions of the visual canvas presented to the user
    // pdf-lib's getSize() gives unrotated dimensions. If it's rotated, the visual width is the page's Height, etc.
    const vW = isRot ? pageHeight : pageWidth;
    const vH = isRot ? pageWidth : pageHeight;

    const vx = (vxPercent / 100) * vW;
    const vy = (vyPercent / 100) * vH;
    const vw = (vwPercent / 100) * vW;
    const vh = (vhPercent / 100) * vH;

    let rotDeg = 0;
    let px = vx;
    let py = pageHeight - vy - vh;

    // The mapping handles drawing onto pdf-lib which uses bottom-left origin.
    if (pageRotation === 90 || pageRotation === -270) {
      // PDF page is rotated 90 CW visually. We draw elements 90 CCW to compensate for viewers rotating it later.
      rotDeg = 90;
      px = vy + vh;
      py = vx;
    } else if (pageRotation === 270 || pageRotation === -90) {
      // PDF page is rotated 90 CCW visually (270 CW). We draw elements 90 CW (-90).
      rotDeg = -90;
      px = pageWidth - (vy + vh);
      py = pageHeight - vx;
    } else if (pageRotation === 180 || pageRotation === -180) {
      // PDF page is upside down. We draw elements upside down (180).
      rotDeg = 180;
      px = pageWidth - vx;
      py = pageHeight - vy;
    }

    return { x: px, y: py, width: vw, height: vh, rotate: degrees(rotDeg), vW, vH };
  }

  async saveDocument(): Promise<void> {
    if (!this.basePdfBytes) return;
    this.isLoading = true;
    this.saveProgress = 1;
    this.loadingMessage = 'กำลังเตรียมเอกสาร...';
    this.cdr.detectChanges();

    try {
      const pdfDoc = await PDFDocument.load(this.basePdfBytes);
      const fontkit: any = (fontkitModule as any).default || (fontkitModule as any);
      pdfDoc.registerFontkit(fontkit);
      const fontBytes = await fetch(this.fontUrl).then(r => r.arrayBuffer());
      const thaiFont = await pdfDoc.embedFont(fontBytes);
      const boldFontBytes = await fetch(this.fontBoldUrl).then(r => r.arrayBuffer());
      const thaiFontBold = await pdfDoc.embedFont(boldFontBytes);
      const pdfPages = pdfDoc.getPages();

      // ── Apply page flips BEFORE placing annotations ──
      // Structurally rotates pages (90° increments) so the exported file matches
      // what the user sees after flipping. We also update pdfPageRotations so the
      // annotation-placement loop below maps coordinates into the rotated space.
      // basePdfBytes stays pristine, so re-baking the same flip on every save is
      // idempotent (each save reloads the original rotation from the fresh doc).
      for (let i = 0; i < pdfPages.length; i++) {
        const pNum = i + 1;
        const flip = this.pageFlips[pNum] || 0;
        if (flip !== 0) {
          const pg = pdfPages[i];
          const newAngle = (pg.getRotation().angle + flip) % 360;
          pg.setRotation(degrees(newAngle));
          this.pdfPageRotations.set(pNum, newAngle);
        }
      }

      // Pre-build a set of pages that actually have annotations to skip empty pages
      const annotatedPageNums = new Set<number>();
      Object.keys(this.strokes).forEach(p => { if ((this.strokes[+p]?.length || 0) > 0) annotatedPageNums.add(+p); });
      Object.keys(this.shapes).forEach(p => { if ((this.shapes[+p]?.length || 0) > 0) annotatedPageNums.add(+p); });
      this.shapeStamps.forEach(ss => annotatedPageNums.add(ss.page));
      this.textBoxes.forEach(t => annotatedPageNums.add(t.page));
      this.imageStamps.forEach(img => annotatedPageNums.add(img.page));
      this.signatureStamps.forEach(s => annotatedPageNums.add(s.page));
      this.dateStamps.forEach(d => annotatedPageNums.add(d.page));

      // Watermark-enabled pages must be processed even if they have no annotations
      if (this.watermark.enabled) {
        const wmPages = this.watermark.scope === 'all' ? this.pages : [this.pageNo];
        wmPages.forEach(p => annotatedPageNums.add(p));
      }

      // Page-number / header-footer pages must also be processed even if empty
      if (this.pageNumber.enabled) {
        this.pages.forEach(p => { if (this.shouldShowPageNum(p)) annotatedPageNums.add(p); });
      }

      const batchSize = pdfPages.length > 100 ? 20 : 5;

      for (let i = 0; i < pdfPages.length; i++) {
        const pageNum = i + 1;
        const page = pdfPages[i];

        // Batch UI updates for large documents instead of every page
        if (i % batchSize === 0 || i === pdfPages.length - 1) {
          this.saveProgress = Math.round(((i + 1) / pdfPages.length) * 60);
          this.loadingMessage = `กำลังประมวลผลหน้า ${i + 1} / ${pdfPages.length}`;
          this.cdr.detectChanges();
          await new Promise(resolve => setTimeout(resolve, 0));
        }

        // Skip pages with no annotations entirely
        if (!annotatedPageNums.has(pageNum)) continue;

        const { width, height } = page.getSize();
        const canvas = this.getAnnotCanvas(pageNum);
        const cw = canvas ? canvas.clientWidth : 800;
        const rotationAngle = this.pdfPageRotations.get(pageNum) ?? page.getRotation().angle;

        const isRot = rotationAngle === 90 || rotationAngle === 270 || rotationAngle === -90 || rotationAngle === -270;
        const vW = isRot ? height : width;
        const vH = isRot ? width : height;

        // 0) Watermark (rendered first so it sits behind all annotations)
        if (this.watermark.enabled && (this.watermark.scope === 'all' || pageNum === this.pageNo)) {
          const wmOpacity = this.watermark.opacity / 100;
          const wmRotation = this.watermark.rotation;

          if (this.watermark.type === 'text' && this.watermark.text) {
            const wmFontSize = this.watermark.fontSize || 40;
            const hexColor = this.watermark.color || '#999999';
            const r2 = parseInt(hexColor.slice(1, 3), 16) / 255;
            const g2 = parseInt(hexColor.slice(3, 5), 16) / 255;
            const b2 = parseInt(hexColor.slice(5, 7), 16) / 255;

            if (this.watermark.mode === 'center') {
              const textWidth = thaiFont.widthOfTextAtSize(this.watermark.text, wmFontSize);
              page.drawText(this.watermark.text, {
                x: width / 2 - textWidth / 2, y: height / 2, size: wmFontSize, font: thaiFont,
                color: rgb(r2, g2, b2), opacity: wmOpacity, rotate: degrees(-wmRotation)
              });
            } else {
              const sX = this.watermark.spacingX || 200;
              const sY = this.watermark.spacingY || 150;
              for (let ty = -height; ty < height * 2; ty += sY) {
                for (let tx = -width; tx < width * 2; tx += sX) {
                  page.drawText(this.watermark.text, {
                    x: tx, y: height - ty, size: wmFontSize, font: thaiFont,
                    color: rgb(r2, g2, b2), opacity: wmOpacity, rotate: degrees(-wmRotation)
                  });
                }
              }
            }
          } else if (this.watermark.type === 'image' && this.watermark.imageDataUrl) {
            try {
              const wmBytes = Uint8Array.from(atob(this.watermark.imageDataUrl.split(',')[1]), c => c.charCodeAt(0));
              const wmImg = this.watermark.imageDataUrl.includes('png')
                ? await pdfDoc.embedPng(wmBytes) : await pdfDoc.embedJpg(wmBytes);
              const imgW = Math.min(wmImg.width, width * 0.4);
              const imgH = (wmImg.height / wmImg.width) * imgW;

              if (this.watermark.mode === 'center') {
                page.drawImage(wmImg, {
                  x: width / 2 - imgW / 2, y: height / 2 - imgH / 2,
                  width: imgW, height: imgH, opacity: wmOpacity, rotate: degrees(-wmRotation)
                });
              } else {
                const sX = this.watermark.spacingX || 200;
                const sY = this.watermark.spacingY || 150;
                for (let ty = 0; ty < height; ty += sY) {
                  for (let tx = 0; tx < width; tx += sX) {
                    page.drawImage(wmImg, {
                      x: tx, y: height - ty - imgH,
                      width: imgW, height: imgH, opacity: wmOpacity, rotate: degrees(-wmRotation)
                    });
                  }
                }
              }
            } catch (wmErr) { console.warn('Watermark image error', wmErr); }
          }
        }

        // 0b) Page Numbers
        if (this.shouldShowPageNum(pageNum)) {
          const pnSize = this.pageNumber.fontSize || 14;
          const pnHex = this.pageNumber.color || '#000000';
          const pnR = parseInt(pnHex.slice(1, 3), 16) / 255;
          const pnG = parseInt(pnHex.slice(3, 5), 16) / 255;
          const pnB = parseInt(pnHex.slice(5, 7), 16) / 255;

          const pnText = this.formatPageNum(pageNum);
          const pnTextWidth = thaiFont.widthOfTextAtSize(pnText, pnSize);
          const margin = 30;
          let pnX = margin;
          let pnY = margin;

          const pos = this.getEffectivePosition(pageNum);
          if (pos.endsWith('right')) pnX = width - pnTextWidth - margin;
          if (pos.endsWith('center')) pnX = (width - pnTextWidth) / 2;
          if (pos.startsWith('top')) pnY = height - pnSize - margin;
          if (pos.startsWith('bottom')) pnY = margin;

          page.drawText(pnText, {
            x: pnX, y: pnY, size: pnSize, font: thaiFont,
            color: rgb(pnR, pnG, pnB), opacity: 1.0
          });
        }

        // 0c) Header / Footer Text (shown only on pages that have a page number)
        if (this.pageNumber.enabled && this.shouldShowPageNum(pageNum) && (this.pageNumber.headerText || this.pageNumber.footerText)) {
          const hfSize = Math.max(this.pageNumber.fontSize - 2, 10);
          const hfHex = this.pageNumber.color || '#000000';
          const hfR = parseInt(hfHex.slice(1, 3), 16) / 255;
          const hfG = parseInt(hfHex.slice(3, 5), 16) / 255;
          const hfB = parseInt(hfHex.slice(5, 7), 16) / 255;
          const hfMargin = 30;

          if (this.pageNumber.headerText) {
            const hText = this.pageNumber.headerText;
            const hWidth = thaiFont.widthOfTextAtSize(hText, hfSize);
            let hX = hfMargin;
            const hPos = this.pageNumber.headerPosition;
            if (hPos.endsWith('right')) hX = width - hWidth - hfMargin;
            if (hPos.endsWith('center')) hX = (width - hWidth) / 2;
            const hY = height - hfSize - hfMargin;
            page.drawText(hText, {
              x: hX, y: hY, size: hfSize, font: thaiFont,
              color: rgb(hfR, hfG, hfB), opacity: 0.7
            });
          }

          if (this.pageNumber.footerText) {
            const fText = this.pageNumber.footerText;
            const fWidth = thaiFont.widthOfTextAtSize(fText, hfSize);
            let fX = hfMargin;
            const fPos = this.pageNumber.footerPosition;
            if (fPos.endsWith('right')) fX = width - fWidth - hfMargin;
            if (fPos.endsWith('center')) fX = (width - fWidth) / 2;
            const fY = hfMargin;
            page.drawText(fText, {
              x: fX, y: fY, size: hfSize, font: thaiFont,
              color: rgb(hfR, hfG, hfB), opacity: 0.7
            });
          }
        }

        // 1) Drawings (rasterized PNG overlay)
        const hasStrokes = (this.strokes[pageNum]?.length || 0) > 0;
        const hasShapes = (this.shapes[pageNum]?.length || 0) > 0;
        if (hasStrokes || hasShapes) {
          const overlayPng = this.renderOverlayToPngBytes(pageNum, vW, vH);
          const overlayImg = await pdfDoc.embedPng(overlayPng);
          const placement = this.getPdfPlacement(0, 0, 100, 100, width, height, rotationAngle);
          page.drawImage(overlayImg, { x: placement.x, y: placement.y, width: placement.width, height: placement.height, rotate: placement.rotate });
        }

        const toRgb = (hex: string) => {
          if (!hex || hex === 'none' || hex.includes('rgba')) return undefined;
          let cleanHex = hex.replace('#', '');
          if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
          if (cleanHex.length !== 6) return undefined;
          return rgb(parseInt(cleanHex.substring(0, 2), 16) / 255, parseInt(cleanHex.substring(2, 4), 16) / 255, parseInt(cleanHex.substring(4, 6), 16) / 255);
        };

        // 1.5) ShapeStamps — Draw natively as crisp PDF vectors
        const stampsForPage = this.shapeStamps.filter(ss => ss.page === pageNum);
        for (const ss of stampsForPage) {
          const ssViewW = ss.viewWidth && ss.viewWidth > 0 ? ss.viewWidth : Math.max(1, cw);
          const ssStrokeScale = vW / ssViewW;
          const pdfStrokeW = ss.strokeWidth * ssStrokeScale;

          const fillColor = ss.fillColor ? toRgb(ss.fillColor) : undefined;
          const strokeColor = (ss.strokeColor && ss.strokeColor !== 'rgba(0,0,0,0)' && ss.strokeWidth > 0) ? toRgb(ss.strokeColor) : undefined;

          const placement = this.getPdfPlacement(ss.x, ss.y, ss.width, ss.height, width, height, rotationAngle);

          if (ss.type === 'rect') {
            page.drawRectangle({
              x: placement.x,
              y: placement.y,
              width: placement.width,
              height: placement.height,
              rotate: placement.rotate,
              color: fillColor,
              borderColor: strokeColor,
              borderWidth: strokeColor ? pdfStrokeW : undefined
            });
          } else if (ss.type === 'circle') {
            const centerPt = this.getPdfPlacement(ss.x + ss.width / 2, ss.y + ss.height / 2, 0, 0, width, height, rotationAngle);
            page.drawEllipse({
              x: centerPt.x,
              y: centerPt.y,
              xScale: placement.width / 2,
              yScale: placement.height / 2,
              color: fillColor,
              borderColor: strokeColor,
              borderWidth: strokeColor ? pdfStrokeW : undefined
            });
          } else if (ss.type === 'line' || ss.type === 'arrow') {
            const pt1 = this.getPdfPlacement(ss.x + ss.startFracX * ss.width, ss.y + ss.startFracY * ss.height, 0, 0, width, height, rotationAngle);
            const pt2 = this.getPdfPlacement(ss.x + ss.endFracX * ss.width, ss.y + ss.endFracY * ss.height, 0, 0, width, height, rotationAngle);

            page.drawLine({
              start: { x: pt1.x, y: pt1.y },
              end: { x: pt2.x, y: pt2.y },
              color: strokeColor || rgb(0, 0, 0),
              thickness: strokeColor ? pdfStrokeW : 1
            });

            if (ss.type === 'arrow') {
              const headLen = 15 * ssStrokeScale;
              const angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
              page.drawLine({
                start: { x: pt2.x, y: pt2.y },
                end: { x: pt2.x - headLen * Math.cos(angle - Math.PI / 6), y: pt2.y - headLen * Math.sin(angle - Math.PI / 6) },
                color: strokeColor || rgb(0, 0, 0),
                thickness: strokeColor ? pdfStrokeW : 1
              });
              page.drawLine({
                start: { x: pt2.x, y: pt2.y },
                end: { x: pt2.x - headLen * Math.cos(angle + Math.PI / 6), y: pt2.y - headLen * Math.sin(angle + Math.PI / 6) },
                color: strokeColor || rgb(0, 0, 0),
                thickness: strokeColor ? pdfStrokeW : 1
              });
            }
          }
        }

        // 2) TextBoxes — render natively so text remains selectable in the final PDF
        const textForPage = this.textBoxes.filter(t => t.page === pageNum);
        for (const tb of textForPage) {
          if (!tb.text.trim()) continue;

          const fontToUse = (tb.bold || tb.italic) ? thaiFontBold : thaiFont;
          const colorHex = tb.color || '#0000ff';
          const txtColor = toRgb(colorHex) || rgb(0, 0, 1);

          const lines = tb.text.split('\n');
          const lineHeight = tb.fontSize * (tb.lineHeight ?? 1.4);

          // Compensate for textarea CSS padding (2px top, 4px left) so PDF matches screen
          const canvas = this.getAnnotCanvas(pageNum);
          const canvasCW = canvas ? canvas.clientWidth : 800;
          const canvasCH = canvas ? canvas.clientHeight : 1000;
          const padLeftPct = (4 / canvasCW) * 100; // 4px left padding → %
          const padTopPct  = (2 / canvasCH) * 100; // 2px top padding  → %

          // Convert CSS letter-spacing (px on canvas) → PDF points: px * (PDF_pt / canvas_px)
          const charSpacing = (tb.letterSpacing ?? 0) * (vW / canvasCW);

          const maxW = (tb.width / 100) * vW;
          // shift X by padLeft, shift Y down by padTop
          const textStartXPct = tb.x + padLeftPct;
          let currentVisualY = ((tb.y + padTopPct) / 100) * vH;

          for (const para of lines) {
            if (!para) {
              currentVisualY += lineHeight;
              continue;
            }

            let paraWords: string[] = [];
            if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
              const segmenter = new (Intl as any).Segmenter('th', { granularity: 'word' });
              paraWords = Array.from(segmenter.segment(para)).map((s: any) => s.segment);
            } else {
              const parts = para.split(' ');
              for (let i = 0; i < parts.length; i++) {
                paraWords.push(parts[i]);
                if (i < parts.length - 1) paraWords.push(' ');
              }
            }

            const lineWidthWithSpacing = (text: string) =>
              fontToUse.widthOfTextAtSize(text, tb.fontSize) + charSpacing * text.length;

            const drawLineText = (text: string, pt: { x: number; y: number; rotate: any }) => {
              if (charSpacing !== 0) page.pushOperators(setCharacterSpacing(charSpacing));
              page.drawText(text, { x: pt.x, y: pt.y, size: tb.fontSize, font: fontToUse, color: txtColor, rotate: pt.rotate });
              if (charSpacing !== 0) page.pushOperators(setCharacterSpacing(0));
            };

            let line = '';
            for (const word of paraWords) {
              const testLine = line + word;
              const textWidth = lineWidthWithSpacing(testLine);
              if (textWidth > maxW && line) {
                let alignXVisual = (textStartXPct / 100) * vW;
                const finalLineWidth = lineWidthWithSpacing(line);
                if (tb.align === 'center') alignXVisual += (maxW / 2) - (finalLineWidth / 2);
                if (tb.align === 'right') alignXVisual += maxW - finalLineWidth;

                const baselineVisualY = currentVisualY + (tb.fontSize * 0.95);
                drawLineText(line, this.getPdfPlacement((alignXVisual / vW) * 100, (baselineVisualY / vH) * 100, 0, 0, width, height, rotationAngle));
                line = word.replace(/^\s+/, '');
                currentVisualY += lineHeight;
              } else {
                line = testLine;
              }
            }
            if (line) {
              let alignXVisual = (textStartXPct / 100) * vW;
              const finalLineWidth = lineWidthWithSpacing(line);
              if (tb.align === 'center') alignXVisual += (maxW / 2) - (finalLineWidth / 2);
              if (tb.align === 'right') alignXVisual += maxW - finalLineWidth;

              const baselineVisualY = currentVisualY + (tb.fontSize * 0.95);
              drawLineText(line, this.getPdfPlacement((alignXVisual / vW) * 100, (baselineVisualY / vH) * 100, 0, 0, width, height, rotationAngle));
              currentVisualY += lineHeight;
            }
          }
        }


        // 3) Image Stamps
        const imgForPage = this.imageStamps.filter(img => img.page === pageNum);
        for (const img of imgForPage) {
          try {
            // Ensure PNG (normalizeImageToPng guarantees this for newly added stamps;
            // fall back to canvas conversion for any legacy stamps saved as JPEG)
            const pngUrl = img.dataUrl.startsWith('data:image/png')
              ? img.dataUrl
              : await this.normalizeImageToPng(img.dataUrl);
            const bytes = Uint8Array.from(atob(pngUrl.split(',')[1]), c => c.charCodeAt(0));
            const embedded = await pdfDoc.embedPng(bytes);

            const placement = this.getPdfPlacement(img.x, img.y, img.width, img.height, width, height, rotationAngle);
            page.drawImage(embedded, { x: placement.x, y: placement.y, width: placement.width, height: placement.height, rotate: placement.rotate });
          } catch (e) { console.error(e); }
        }

        // 4) Signatures
        const sigForPage = this.signatureStamps.filter(s => s.page === pageNum);
        for (const sig of sigForPage) {
          try {
            const bytes = Uint8Array.from(atob(sig.dataUrl.split(',')[1]), c => c.charCodeAt(0));
            const embedded = await pdfDoc.embedPng(bytes);

            const placement = this.getPdfPlacement(sig.x, sig.y, sig.width, sig.height, width, height, rotationAngle);
            page.drawImage(embedded, { x: placement.x, y: placement.y, width: placement.width, height: placement.height, rotate: placement.rotate });

            // Draw Digital ID text to the right of signature (vertically centered)
            if (this.showDigitalId && (sig.digitalId || sig.signDate)) {
              const idFontSize = 8;
              const idLines: string[] = [];
              if (sig.signDate) idLines.push(sig.signDate);
              if (sig.signTime) idLines.push(sig.signTime);
              if (sig.digitalId) idLines.push(sig.digitalId);

              const lineHeight = idFontSize + 2;
              const totalTextHeight = idLines.length * lineHeight;

              const textVisualXPct = sig.x + sig.width + (4 / vW * 100);
              const textStartYPct = sig.y + (sig.height / 2) - ((totalTextHeight / 2) / vH * 100);

              for (let li = 0; li < idLines.length; li++) {
                const lineBaselineVPct = textStartYPct + ((li * lineHeight + idFontSize) / vH * 100);
                const pt = this.getPdfPlacement(textVisualXPct, lineBaselineVPct, 0, 0, width, height, rotationAngle);

                page.drawText(idLines[li], {
                  x: pt.x,
                  y: pt.y,
                  size: idFontSize,
                  font: thaiFont,
                  color: rgb(0.2, 0.2, 0.2),
                  opacity: 1.0,
                  rotate: pt.rotate
                });
              }
            }
          } catch (e) { console.error(e); }
        }

        // 5) Date Stamps
        const dateForPage = this.dateStamps.filter(d => d.page === pageNum);
        for (const ds of dateForPage) {
          const hex = ds.color.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16) / 255;
          const g = parseInt(hex.substring(2, 4), 16) / 255;
          const b = parseInt(hex.substring(4, 6), 16) / 255;

          const baselineVPct = ds.y + (ds.fontSize / vH * 100);
          const pt = this.getPdfPlacement(ds.x, baselineVPct, 0, 0, width, height, rotationAngle);

          page.drawText(ds.text, {
            x: pt.x, y: pt.y, size: ds.fontSize, font: thaiFont,
            color: rgb(r, g, b), opacity: 1.0, rotate: pt.rotate
          });
        }

      }

      // Bake PDF AcroForm fields (interactive text/checkbox/radio)
      if (this.pdfFormFields.length > 0) {
        const form = pdfDoc.getForm();
        for (const ff of this.pdfFormFields) {
          const pgIdx = ff.page - 1;
          if (pgIdx < 0 || pgIdx >= pdfPages.length) continue;
          const pdfPage = pdfPages[pgIdx];
          const { width: pgW, height: pgH } = pdfPage.getSize();
          const rotAngle = this.pdfPageRotations.get(ff.page) ?? pdfPage.getRotation().angle;
          const isRotated = rotAngle === 90 || rotAngle === 270 || rotAngle === -90 || rotAngle === -270;
          const vW = isRotated ? pgH : pgW;
          const vH = isRotated ? pgW : pgH;

          const fx = (ff.x / 100) * vW;
          const fw = (ff.width / 100) * vW;
          const fh = (ff.height / 100) * vH;
          const fy = pgH - (ff.y / 100) * vH - fh;

          const borderW = (ff.borderVisible ?? true) ? 1 : 0;
          const opts: any = {
            x: fx, y: fy, width: fw, height: fh,
            borderWidth: borderW,
            borderColor: borderW ? rgb(0, 0, 0) : undefined,
            backgroundColor: rgb(1, 1, 1),
          };

          try {
            if (ff.type === 'text') {
              const tf = form.createTextField(ff.fieldName);
              tf.addToPage(pdfPage, opts);
              if (ff.fontSize) tf.setFontSize(ff.fontSize);
            } else if (ff.type === 'checkbox') {
              const cb = form.createCheckBox(ff.fieldName);
              cb.addToPage(pdfPage, opts);
            } else if (ff.type === 'radio') {
              let rg: any;
              try { rg = form.getRadioGroup(ff.radioGroupName!); } catch { rg = form.createRadioGroup(ff.radioGroupName!); }
              rg.addOptionToPage(ff.id, pdfPage, opts);
            }
          } catch (formErr) { console.warn('Form field error:', formErr); }
        }
      }

      this.saveProgress = 61;
      this.loadingMessage = 'กำลัง Serialize PDF...';
      this.cdr.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 80));

      this.revNo += 1;
      const pdfBytes = await pdfDoc.save({ objectsPerTick: 20 });

      this.lastSavedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });

      // Use original filename if provided, otherwise default to "annotated_rev..."
      if (this.fileName) {
        this.lastSavedFileName = this.fileName;
      } else {
        this.lastSavedFileName = `annotated_rev${this.revNo}_${Date.now()}.pdf`;
      }

      // Create preview using pdf.js to render pages as images
      await this.generatePreviewPages();
      this.showPreviewOverlay = true;

    } catch (e) {
      console.error(e);
      this.presentToast('เกิดข้อผิดพลาดในการบันทึกเอกสาร');
    } finally {
      this.isLoading = false;
      this.loadingMessage = '';
      this.saveProgress = 0;
    }
  }

  async generatePreviewPages(): Promise<void> {
    if (!this.lastSavedBlob) return;

    this.previewPages = [];
    const arrayBuffer = await this.lastSavedBlob.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const total = pdfDoc.numPages;

    this.previewTotalPages = total;

    // For large documents render only annotated pages, not all pages
    let pagesToRender: number[];
    if (total > 50) {
      const annotated = new Set<number>();
      Object.keys(this.strokes).forEach(p => { if ((this.strokes[+p]?.length || 0) > 0) annotated.add(+p); });
      Object.keys(this.shapes).forEach(p => { if ((this.shapes[+p]?.length || 0) > 0) annotated.add(+p); });
      this.shapeStamps.forEach(ss => annotated.add(ss.page));
      this.textBoxes.forEach(t => annotated.add(t.page));
      this.imageStamps.forEach(img => annotated.add(img.page));
      this.signatureStamps.forEach(s => annotated.add(s.page));
      this.dateStamps.forEach(d => annotated.add(d.page));
      pagesToRender = annotated.size > 0 ? Array.from(annotated).sort((a, b) => a - b) : [1];
      this.previewIsFiltered = pagesToRender.length < total;
    } else {
      pagesToRender = Array.from({ length: total }, (_, i) => i + 1);
      this.previewIsFiltered = false;
    }

    for (let idx = 0; idx < pagesToRender.length; idx++) {
      const pageNum = pagesToRender[idx];
      const page = await pdfDoc.getPage(pageNum);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;
      this.previewPages.push(canvas.toDataURL('image/png'));

      // Progress phase 2: generating preview (62–100%)
      this.saveProgress = 62 + Math.round(((idx + 1) / pagesToRender.length) * 38);
      this.loadingMessage = `กำลังสร้าง Preview หน้า ${pageNum} / ${total}`;
      this.cdr.detectChanges();
    }
  }

  async loadAllPreviewPages(): Promise<void> {
    if (!this.lastSavedBlob || this.isLoadingAllPreview) return;
    this.isLoadingAllPreview = true;
    this.previewPages = [];
    this.cdr.detectChanges();

    const arrayBuffer = await this.lastSavedBlob.arrayBuffer();
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const total = pdfDoc.numPages;

    for (let i = 1; i <= total; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      this.previewPages.push(canvas.toDataURL('image/png'));
      this.cdr.detectChanges();
    }

    this.previewIsFiltered = false;
    this.isLoadingAllPreview = false;
    this.cdr.detectChanges();
  }

  confirmSave(): void {
    if (!this.lastSavedBlob) return;

    // Log all signature stamps with Digital ID when confirmed and showDigitalId is enabled
    if (this.showDigitalId) {
      for (const sig of this.signatureStamps) {
        if (sig.digitalId) {
          const now = new Date();
          this.logSignatureToDatabase(sig.digitalId, now, sig.page);
        }
      }
    }

    // Log save to history
    this.logHistory('save', {
      signatures: this.signatureStamps.length,
      textBoxes: this.textBoxes.length,
      drawings: Object.values(this.strokes).reduce((s, arr) => s + arr.length, 0),
    }, 0);

    this.unlockOrientation();
    this.saved.emit({ blob: this.lastSavedBlob, fileName: this.lastSavedFileName, revNo: this.revNo });
    this.dismissModal({
      success: true,
      saved: true,
      blob: this.lastSavedBlob,
      fileName: this.lastSavedFileName,
      revNo: this.revNo
    });
  }

  backToEdit(): void {
    this.showPreviewOverlay = false;
    this.previewUrl = null;
    this.previewPages = [];
  }
}

