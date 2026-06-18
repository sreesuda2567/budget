import { __awaiter } from "tslib";
import { Component, ViewChild, ViewChildren, Input, NgZone, HostListener, ChangeDetectorRef, Inject, Optional } from '@angular/core';
import { PDF_ANNOTATOR_CONFIG } from './tokens';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { timeout, retry } from 'rxjs/operators';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import * as fontkitModule from '@pdf-lib/fontkit';
import * as pdfjsLib from 'pdfjs-dist';
import { PdfManagerService } from './pdf-manager.service';
export class PdfAnnotatorModalComponent {
    constructor(modalCtrl, http, zone, toastCtrl, alertCtrl, cdr, sanitizer, pdfSvc, config) {
        var _a, _b;
        this.modalCtrl = modalCtrl;
        this.http = http;
        this.zone = zone;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.cdr = cdr;
        this.sanitizer = sanitizer;
        this.pdfSvc = pdfSvc;
        this.canManageGuide = false;
        // Context Menu state
        this.contextMenu = {
            show: false,
            x: 0,
            y: 0,
            targetId: '',
            targetType: ''
        };
        // Tool modes
        this.toolMode = 'none';
        this.shapeType = 'rect';
        this.showShapeMenu = false;
        this.showShapeDropdown = false;
        this.shapeNoStroke = false;
        // Shape-specific color settings (separate from brush)
        this.shapeStrokeColor = '#000000';
        this.shapeFillColor = '#ffffff';
        this.shapeFillEnabled = false;
        this.shapeStrokeSize = 2;
        // Mac Preview-style color swatches
        this.shapeColorSwatches = [
            '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#ffffff',
            '#ff0000', '#ff4500', '#ff9900', '#ffcc00', '#00b050', '#00b0f0', '#0070c0', '#7030a0',
            '#ff00ff', '#ff69b4', '#4169e1', '#20b2aa', '#228b22', '#8b4513', '#a0522d', '#dc143c'
        ];
        this.shapeFillSwatches = [
            '#ffffff', '#f2f2f2', '#e6e6e6', '#d9d9d9', '#cccccc', '#b7b7b7', '#999999', '#000000',
            '#ffcccc', '#ffe5cc', '#fffacc', '#ccffcc', '#ccf5ff', '#cce0ff', '#e5ccff', '#ffccf2',
            '#ff9999', '#ffcc99', '#ffff99', '#99ff99', '#99f2ff', '#99bbff', '#cc99ff', '#ff99ee'
        ];
        this.brushColor = '#0000FF';
        this.brushSize = 3;
        this.highlightColor = '#ffff00';
        this.highlightSize = 20;
        this.eraserSize = 20;
        this.pageNo = 1;
        this.pageCount = 0;
        this.PAGE_CHUNK = 10;
        this.loadedUntilPage = 0;
        this.isLoadingChunk = false;
        this.zoom = 1; // 0.5 - 3
        this.viewMode = 'single';
        this.pages = []; // Array [1, 2, ..., pageCount]
        this.isLoading = false;
        this.loadingMessage = '';
        this.saveProgress = 0;
        this.renderingPages = new Set();
        this.renderedPages = new Set();
        this.textBoxes = [];
        this.imageStamps = [];
        this.shapeStamps = [];
        this.signatureStamps = [];
        this.dateStamps = [];
        this.pdfFormFields = [];
        this.formFieldCounter = 0;
        this.activeFormFieldId = null;
        // Modal & Preview States
        this.showSignaturePad = false;
        this.showSignaturePicker = false;
        this.showPreviewOverlay = false;
        this.previewUrl = null;
        this.previewPages = []; // Array of base64 image URLs for preview
        this.previewIsFiltered = false; // true when showing annotated-pages-only preview
        this.previewTotalPages = 0;
        this.isLoadingAllPreview = false;
        this.pageThumbnails = []; // Array of base64 thumbnail images
        this.showThumbnails = true; // Toggle for thumbnails sidebar
        this.lastSavedBlob = null;
        this.lastSavedFileName = '';
        this.signatureCtx = null;
        this.isDrawingSignature = false;
        this.signaturePoints = [];
        this.signatureStrokes = [];
        this.bufferCanvas = null;
        // Signature pen settings
        this.signaturePenColor = '#000000';
        this.signaturePenSize = 2.5;
        // Quick Mark Stamp settings
        this.markType = 'check';
        this.formFieldType = 'checkbox';
        this.markColor = '#000000';
        this.markSize = 32; // px at 100% zoom (will be scaled)
        this.showMarkOptions = false;
        // Date Stamp Settings
        this.dateColor = '#000000';
        this.dateFontSize = 16;
        this.showDateOptions = false;
        // Saved Signatures (from database)
        this.savedSignatures = [];
        this.isLoadingSignatures = false;
        this.userId = '';
        this.userName = '';
        this.documentId = null;
        this.detailId = '';
        this.edocId = '';
        this.isCancelMode = false;
        // Digital ID settings
        this.showDigitalId = true;
        // Thumbnail sidebar state
        this.thumbInsertIndex = -1; // -1 = closed; 0 = before page 1; i = after page i
        this.thumbDropdownTargetIndex = -1;
        // ------------------------------------
        // User Guide Modal State
        // ------------------------------------
        this.showUserGuidePanel = false;
        this.isLoadingGuide = false;
        this.isEditingGuide = false;
        this.userGuideContent = '';
        this.tempGuideContent = '';
        this.thumbDropdownTop = 0; // Fixed-position Y coord for insert dropdown
        this.thumbInsertAtIndex = -1; // the slot index where file upload was triggered
        // ── History Panel ────────────────────────────────────────────────────────
        this.showHistoryPanel = false;
        this.historyEntries = [];
        this.isLoadingHistory = false;
        // Insert blank page
        this.showInsertMenu = false;
        this.showThumbInsertMenu = false;
        this.insertOrientation = 'portrait';
        // Page-operation undo stack (insert / delete page)
        this.pageHistoryStack = [];
        this.strokes = {};
        this.shapes = {};
        this.redoStack = {};
        this.activeStroke = null;
        this.activeShape = null;
        this.activeCanvasRect = null;
        this.activePointerId = null;
        this.activeObjectId = null;
        this.activeObjectType = null;
        this.activePointerType = '';
        this.renderRequested = false;
        this.isRenderingAll = false;
        this.renderDebounceTimer = null;
        this.isDragging = false;
        this.dragTextBoxId = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        // Resize state
        this.isResizing = false;
        this.resizeTextBoxId = null;
        // Image drag state
        this.isDraggingImage = false;
        this.dragImageId = null;
        this.isResizingImage = false;
        this.resizeImageId = null;
        // ShapeStamp drag/resize state
        this.isDraggingShape = false;
        this.dragShapeId = null;
        this.isResizingShape = false;
        this.resizeShapeId = null;
        this.resizeObserver = null;
        this.isScrollNavigating = false;
        this.basePdfBytes = null;
        /** PDF page aspect ratios (width/height) per page number, populated at load time */
        this.pdfPageAspects = new Map();
        /** PDF page rotations (0/90/180/270) per page number, populated at load time from pdf-lib */
        this.pdfPageRotations = new Map();
        this.revNo = 1;
        this.pdfDocProxy = null;
        this.currentViewport = null;
        // default text style
        this.textColor = '#0000FF';
        this.textFontSize = 16;
        this.pendingSignatureDataUrl = null;
        this.activeTextBoxId = null;
        this.SETTINGS_KEY = 'esign_pdf_annotator_settings';
        /* ================= Zoom & Resize ================= */
        this.lastParentWidth = 0;
        this.lastFitPageNo = -1;
        this.signaturesApiUrl = (_a = config === null || config === void 0 ? void 0 : config.signaturesApiUrl) !== null && _a !== void 0 ? _a : 'http://localhost:3500/api/signatures';
        this.pdfWorkerSrc = (_b = config === null || config === void 0 ? void 0 : config.pdfWorkerSrc) !== null && _b !== void 0 ? _b : '/assets/pdf.worker.min.mjs';
    }
    toggleDateOptions() {
        this.showDateOptions = !this.showDateOptions;
    }
    addDateStampAndShowOptions() {
        this.addDateStamp();
        this.showDateOptions = true;
    }
    setDateColor(color) {
        this.dateColor = color;
        this.saveSettings();
    }
    changeDateFontSize(delta) {
        const newSize = this.dateFontSize + delta;
        if (newSize >= 8 && newSize <= 100) {
            this.dateFontSize = newSize;
            this.saveSettings();
        }
    }
    /** Log an action to the ruts-pdf history API (fire-and-forget) */
    logHistory(actionType, detail = {}, pageNumber) {
        if (!this.documentId || !this.userId)
            return;
        this.pdfSvc.logAction({
            documentId: this.documentId,
            userId: this.userId,
            actionType,
            actionDetail: detail,
            pageNumber: pageNumber !== null && pageNumber !== void 0 ? pageNumber : this.pageNo,
            userName: this.userName,
        }).subscribe();
        // Also add to local panel immediately
        this.historyEntries.unshift({
            id: Date.now(),
            document_id: this.documentId,
            user_id: this.userId,
            action_type: actionType,
            action_detail: detail,
            page_number: pageNumber !== null && pageNumber !== void 0 ? pageNumber : this.pageNo,
            user_name: this.userName,
            user_position: '',
            ip_address: '',
            created_at: new Date().toISOString(),
        });
    }
    toggleHistoryPanel() {
        this.showHistoryPanel = !this.showHistoryPanel;
        if (this.showHistoryPanel && this.documentId && this.historyEntries.length === 0) {
            this.loadHistoryFromApi();
        }
    }
    loadHistoryFromApi() {
        if (!this.documentId)
            return;
        this.isLoadingHistory = true;
        this.pdfSvc.getHistory(this.documentId, 100).subscribe({
            next: (res) => {
                this.historyEntries = res.data;
                this.isLoadingHistory = false;
            },
            error: () => { this.isLoadingHistory = false; },
        });
    }
    getHistoryActionIcon(type) {
        const map = {
            sign: 'finger-print', text: 'text', draw: 'brush',
            highlight: 'color-fill-outline', shape: 'shapes-outline', image: 'image-outline',
            page_insert: 'add-circle-outline', page_delete: 'trash-outline',
            date_stamp: 'calendar', save: 'save-outline', upload: 'cloud-upload-outline', open: 'open-outline',
        };
        return map[type] || 'ellipse-outline';
    }
    getHistoryActionLabel(type) {
        const map = {
            sign: 'ลงลายเซ็น', text: 'เพิ่มข้อความ', draw: 'วาด', highlight: 'ไฮไลท์',
            shape: 'รูปทรง', image: 'รูปภาพ', page_insert: 'แทรกหน้า', page_delete: 'ลบหน้า',
            date_stamp: 'วันที่', save: 'บันทึก', upload: 'นำเข้า', open: 'เปิดเอกสาร',
        };
        return map[type] || type;
    }
    get canUndoPageOp() { return this.pageHistoryStack.length > 0; }
    savePageSnapshot() {
        if (!this.basePdfBytes)
            return;
        // Deep-clone annotation arrays and records so mutations don't affect snapshot
        const cloneArr = (a) => a.map(x => (Object.assign({}, x)));
        const cloneRec = (r) => {
            const out = {};
            for (const k of Object.keys(r))
                out[Number(k)] = [...r[Number(k)]];
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
        if (this.pageHistoryStack.length > 20)
            this.pageHistoryStack.shift();
    }
    undoPageOp() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = this.pageHistoryStack.pop();
            if (!snapshot)
                return;
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
                if (this.pdfDocProxy) {
                    this.pdfDocProxy.destroy();
                    this.pdfDocProxy = null;
                }
                const loadingTask = pdfjsLib.getDocument({ data: copy });
                this.pdfDocProxy = yield loadingTask.promise;
                this.pageCount = this.pdfDocProxy.numPages;
                this.loadedUntilPage = Math.min(this.loadedUntilPage, this.pageCount);
                this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
                this.pages.forEach(p => this.ensurePage(p));
                this.pdfPageAspects.clear();
                this.pdfPageRotations.clear();
                try {
                    const tmpDoc = yield PDFDocument.load(copy);
                    tmpDoc.getPages().forEach((pg, idx) => {
                        const { width, height } = pg.getSize();
                        this.pdfPageAspects.set(idx + 1, width / height);
                        this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                    });
                }
                catch (_) { }
                this.pageNo = Math.min(snapshot.pageNo, this.pageCount);
                this.renderedPages.clear();
                this.renderingPages.clear();
                yield this.generateThumbnails();
                yield this.renderAllPages();
                this.scrollToPage(this.pageNo);
                const toast = yield this.toastCtrl.create({
                    message: 'ย้อนกลับเรียบร้อยแล้ว',
                    duration: 2000,
                    color: 'success',
                    position: 'bottom'
                });
                yield toast.present();
            }
            catch (err) {
                console.error('undoPageOp error:', err);
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
                this.cdr.detectChanges();
            }
        });
    }
    get activeTextBox() {
        return this.textBoxes.find(t => t.id === this.activeTextBoxId) || null;
    }
    close() {
        this.unlockOrientation();
        this.modalCtrl.dismiss();
    }
    get drawMode() { return this.toolMode === 'draw' || (this.toolMode === 'none' && this.activeObjectType === 'signature'); }
    get eraserMode() { return this.toolMode === 'eraser'; }
    get highlightMode() { return this.toolMode === 'highlight'; }
    get shapeMode() { return this.toolMode === 'shape' || (this.toolMode === 'none' && this.activeObjectType === 'shape'); }
    get textPlaceMode() { return this.toolMode === 'text' || (this.toolMode === 'none' && this.activeObjectType === 'text'); }
    ngOnInit() {
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
    saveSettings() {
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
            shapeNoStroke: this.shapeNoStroke
        };
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    }
    loadSettings() {
        try {
            const saved = localStorage.getItem(this.SETTINGS_KEY);
            if (saved) {
                const settings = JSON.parse(saved);
                if (settings.brushColor)
                    this.brushColor = settings.brushColor;
                if (settings.brushSize)
                    this.brushSize = settings.brushSize;
                if (settings.highlightColor)
                    this.highlightColor = settings.highlightColor;
                if (settings.highlightSize)
                    this.highlightSize = settings.highlightSize;
                if (settings.eraserSize)
                    this.eraserSize = settings.eraserSize;
                if (settings.textColor)
                    this.textColor = settings.textColor;
                if (settings.textFontSize)
                    this.textFontSize = settings.textFontSize;
                if (settings.dateColor)
                    this.dateColor = settings.dateColor;
                if (settings.dateFontSize)
                    this.dateFontSize = settings.dateFontSize;
                if (settings.shapeType)
                    this.shapeType = settings.shapeType;
                if (settings.shapeStrokeColor)
                    this.shapeStrokeColor = settings.shapeStrokeColor;
                if (settings.shapeFillColor)
                    this.shapeFillColor = settings.shapeFillColor;
                if (settings.shapeFillEnabled !== undefined)
                    this.shapeFillEnabled = settings.shapeFillEnabled;
                if (settings.shapeStrokeSize)
                    this.shapeStrokeSize = settings.shapeStrokeSize;
                if (settings.shapeNoStroke !== undefined)
                    this.shapeNoStroke = settings.shapeNoStroke;
            }
        }
        catch (e) {
            console.warn('Failed to load settings from localStorage', e);
        }
    }
    get visibleTextBoxes() { return this.getTextBoxesForPage(this.pageNo); }
    get visibleImageStamps() { return this.getImageStampsForPage(this.pageNo); }
    get visibleSignatures() { return this.getSignatureStampsForPage(this.pageNo); }
    get visibleDateStamps() { return this.getDateStampsForPage(this.pageNo); }
    getTextBoxesForPage(p) { return this.textBoxes.filter(t => t.page === p); }
    getImageStampsForPage(p) { return this.imageStamps.filter(i => i.page === p); }
    getRegularImageStampsForPage(p) { return this.imageStamps.filter(i => i.page === p && !i.id.startsWith('mark_')); }
    getMarkStampsForPage(p) { return this.imageStamps.filter(i => i.page === p && i.id.startsWith('mark_')); }
    getShapeStampsForPage(p) { return this.shapeStamps.filter(s => s.page === p); }
    getSignatureStampsForPage(p) { return this.signatureStamps.filter(s => s.page === p); }
    getDateStampsForPage(p) { return this.dateStamps.filter(d => d.page === p); }
    getMarkSvgContent(markType, color) {
        const c = color || '#000000';
        if (markType === 'check') {
            return `<polyline points="12,52 42,82 88,18" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
        }
        else if (markType === 'cross') {
            return `<line x1="15" y1="15" x2="85" y2="85" stroke="${c}" stroke-width="10" stroke-linecap="round"/>` +
                `<line x1="85" y1="15" x2="15" y2="85" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`;
        }
        else {
            return `<circle cx="50" cy="50" r="38" fill="${c}"/>`;
        }
    }
    /** Lock screen orientation to portrait while annotating */
    lockOrientation() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orientation = screen.orientation;
                if (orientation && orientation.lock) {
                    yield orientation.lock('portrait-primary');
                }
            }
            catch (_) {
                // Screen Orientation API not supported (e.g. iOS Safari) — ignore
            }
        });
    }
    /** Unlock screen orientation when leaving the annotator */
    unlockOrientation() {
        try {
            const orientation = screen.orientation;
            if (orientation && orientation.unlock) {
                orientation.unlock();
            }
        }
        catch (_) { /* ignore */ }
    }
    ngAfterViewInit() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            pdfjsLib.GlobalWorkerOptions.workerSrc = this.pdfWorkerSrc;
            // Lock orientation to portrait so the PDF doesn't rotate during annotation
            this.lockOrientation();
            // Clear and reset canvases before loading new PDF
            (_a = this.pdfCanvases) === null || _a === void 0 ? void 0 : _a.forEach(ref => {
                const canvas = ref.nativeElement;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    canvas.width = 0;
                    canvas.height = 0;
                    canvas.style.width = '0px';
                    canvas.style.height = '0px';
                }
            });
            (_b = this.annotCanvases) === null || _b === void 0 ? void 0 : _b.forEach(ref => {
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
            yield this.loadPdfBytesAndInitPdfjs();
            this.zone.runOutsideAngular(() => {
                this.setupResizeAutoRender();
            });
            yield this.fitWidth();
            this.syncToolModeStyles();
        });
    }
    syncToolModeStyles() {
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
    ngOnDestroy() {
        if (this.resizeObserver)
            this.resizeObserver.disconnect();
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
                if (ctx)
                    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
                pdfCanvas.width = 0;
                pdfCanvas.height = 0;
            }
            if (annotCanvas) {
                const ctx = annotCanvas.getContext('2d');
                if (ctx)
                    ctx.clearRect(0, 0, annotCanvas.width, annotCanvas.height);
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
    onDocumentPointerDown(event) {
        if (this.contextMenu.show) {
            const target = event.target;
            if (!target.closest('.custom-context-menu')) {
                this.zone.run(() => {
                    this.closeContextMenu();
                    this.cdr.detectChanges();
                });
            }
        }
    }
    handleKeyboard(event) {
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
            if ((activeEl === null || activeEl === void 0 ? void 0 : activeEl.tagName) === 'TEXTAREA' || (activeEl === null || activeEl === void 0 ? void 0 : activeEl.tagName) === 'INPUT') {
                return;
            }
            if (this.activeObjectId && this.activeObjectType) {
                if (this.activeObjectType === 'text')
                    this.removeTextBox(this.activeObjectId);
                else if (this.activeObjectType === 'shape')
                    this.removeShapeStamp(this.activeObjectId);
                else if (this.activeObjectType === 'image')
                    this.removeImage(this.activeObjectId);
                else if (this.activeObjectType === 'signature')
                    this.removeSignature(this.activeObjectId);
                else if (this.activeObjectType === 'date')
                    this.removeDateStamp(this.activeObjectId);
                this.activeObjectId = null;
                this.activeObjectType = null;
            }
        }
    }
    exitAllModes() {
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
    toggleUserGuide(e) {
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
    fetchGuideData() {
        // Simulate API fetch
        this.isLoadingGuide = true;
        setTimeout(() => {
            // Logic for actual API fetch goes here (e.g. this.accessProviders.postData(...))
            this.isLoadingGuide = false;
        }, 500);
    }
    editGuide() {
        if (!this.canManageGuide)
            return;
        this.tempGuideContent = this.userGuideContent;
        this.isEditingGuide = true;
    }
    cancelEditGuide() {
        this.isEditingGuide = false;
        this.tempGuideContent = '';
    }
    saveGuide() {
        // Simulate API save
        this.userGuideContent = this.tempGuideContent;
        this.isEditingGuide = false;
        // Call API here to save permanently
        // e.g. this.accessProviders.postData({ content: this.userGuideContent }, 'save_guide.php')...
    }
    /* ================= Context Menu Methods ================= */
    closeContextMenu() {
        if (this.contextMenu.show) {
            this.contextMenu.show = false;
            this.cdr.detectChanges();
        }
    }
    onContextMenu(e, id, type) {
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
    getContextTargetObject() {
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
    getAllAnnotationsZIndices() {
        const all = [
            ...this.textBoxes, ...this.shapeStamps, ...this.imageStamps,
            ...this.signatureStamps, ...this.dateStamps
        ];
        return all.map(a => a.zIndex || 10);
    }
    contextBringToFront() {
        const obj = this.getContextTargetObject();
        if (obj) {
            const zs = this.getAllAnnotationsZIndices();
            const maxZ = zs.length ? Math.max(...zs) : 10;
            obj.zIndex = maxZ + 1;
            this.closeContextMenu();
            this.cdr.detectChanges();
        }
    }
    contextBringForward() {
        const obj = this.getContextTargetObject();
        if (obj) {
            obj.zIndex = (obj.zIndex || 10) + 1;
            this.closeContextMenu();
            this.cdr.detectChanges();
        }
    }
    contextSendBackward() {
        const obj = this.getContextTargetObject();
        if (obj) {
            obj.zIndex = (obj.zIndex || 10) - 1;
            this.closeContextMenu();
            this.cdr.detectChanges();
        }
    }
    contextSendToBack() {
        const obj = this.getContextTargetObject();
        if (obj) {
            const zs = this.getAllAnnotationsZIndices();
            const minZ = zs.length ? Math.min(...zs) : 10;
            obj.zIndex = Math.max(1, minZ - 1);
            this.closeContextMenu();
            this.cdr.detectChanges();
        }
    }
    deleteContextMenuTarget() {
        const id = this.contextMenu.targetId;
        switch (this.contextMenu.targetType) {
            case 'text':
                this.removeTextBox(id);
                break;
            case 'shape':
                this.removeShapeStamp(id);
                break;
            case 'image':
                this.removeImage(id);
                break;
            case 'signature':
                this.removeSignature(id);
                break;
            case 'date':
                this.removeDateStamp(id);
                break;
        }
        this.closeContextMenu();
    }
    /* ================= PDF load ================= */
    loadPdfBytesAndInitPdfjs() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isLoading = true;
            this.loadingMessage = 'กำลังโหลด PDF...';
            try {
                const buffer = yield this.http
                    .get(this.pdfUrl, { responseType: 'arraybuffer' })
                    .pipe(timeout(60000), retry(2))
                    .toPromise();
                if (!buffer) {
                    throw new Error('ไม่สามารถโหลดไฟล์ PDF ได้');
                }
                this.basePdfBytes = buffer;
                const loadingTask = pdfjsLib.getDocument({ data: buffer });
                this.pdfDocProxy = yield loadingTask.promise;
                this.pageCount = this.pdfDocProxy.numPages || 1;
                // Initialize annotation data for ALL pages upfront
                for (let p = 1; p <= this.pageCount; p++)
                    this.ensurePage(p);
                // Only render first chunk in the DOM
                this.loadedUntilPage = Math.min(this.PAGE_CHUNK, this.pageCount);
                this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
                // Store PDF page aspect ratios and rotations for correct rendering and stamp calculation
                try {
                    const tmpDoc = yield PDFDocument.load(buffer);
                    tmpDoc.getPages().forEach((pg, idx) => {
                        const { width, height } = pg.getSize();
                        this.pdfPageAspects.set(idx + 1, width / height);
                        // Store rotation so renderPage can force correct landscape/portrait viewport
                        this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                    });
                }
                catch (_) {
                    // Fallback: aspect ratios will be computed from canvas at placement time
                }
                // Generate thumbnails after loading PDF
                yield this.generateThumbnails();
            }
            catch (error) {
                console.error('Error loading PDF:', error);
                const isTimeout = (error === null || error === void 0 ? void 0 : error.name) === 'TimeoutError';
                const isNetwork = (error === null || error === void 0 ? void 0 : error.status) === 0;
                const is404 = (error === null || error === void 0 ? void 0 : error.status) === 404;
                let msg = 'ไม่สามารถโหลด PDF ได้ กรุณาลองใหม่อีกครั้ง';
                if (isTimeout)
                    msg = 'โหลด PDF หมดเวลา (Timeout) กรุณาตรวจสอบการเชื่อมต่อ';
                else if (isNetwork)
                    msg = 'ไม่สามารถเชื่อมต่อ Server ได้ กรุณาตรวจสอบเครือข่าย';
                else if (is404)
                    msg = 'ไม่พบไฟล์ PDF บน Server กรุณาติดต่อผู้ดูแลระบบ';
                const toast = yield this.toastCtrl.create({
                    message: msg,
                    duration: 4000,
                    color: 'danger',
                    position: 'middle'
                });
                yield toast.present();
                this.unlockOrientation();
                this.modalCtrl.dismiss({ error: true, message: msg });
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
            }
        });
    }
    generateThumbnails() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pdfDocProxy)
                return;
            this.pageThumbnails = [];
            yield this.generateThumbnailsRange(1, this.loadedUntilPage);
        });
    }
    generateThumbnailsRange(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pdfDocProxy)
                return;
            const scale = 0.2;
            for (let i = from; i <= to; i++) {
                const page = yield this.pdfDocProxy.getPage(i);
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                yield page.render({ canvasContext: ctx, viewport }).promise;
                this.pageThumbnails.push(canvas.toDataURL('image/png'));
            }
        });
    }
    loadNextChunk() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isLoadingChunk || this.loadedUntilPage >= this.pageCount)
                return;
            this.isLoadingChunk = true;
            const newEnd = Math.min(this.loadedUntilPage + this.PAGE_CHUNK, this.pageCount);
            const prevEnd = this.loadedUntilPage;
            yield this.generateThumbnailsRange(prevEnd + 1, newEnd);
            for (let p = prevEnd + 1; p <= newEnd; p++)
                this.pages.push(p);
            this.loadedUntilPage = newEnd;
            this.cdr.detectChanges();
            yield new Promise(r => setTimeout(r, 50));
            for (let p = prevEnd + 1; p <= newEnd; p++)
                yield this.renderPage(p);
            this.isLoadingChunk = false;
        });
    }
    goToPage(pageNum) {
        if (pageNum < 1 || pageNum > this.pageCount)
            return;
        this.pageNo = pageNum;
        this.scrollToPage(this.pageNo);
        // Re-fit width in case new page has different orientation (landscape vs portrait)
        this.fitWidth();
    }
    toggleThumbnails() {
        this.showThumbnails = !this.showThumbnails;
    }
    /* ================= Insert Blank Page ================= */
    insertBlankPage(where) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes)
                return;
            this.showInsertMenu = false;
            this.isLoading = true;
            this.loadingMessage = 'กำลังแทรกหน้าเปล่า...';
            this.savePageSnapshot(); // บันทึก snapshot ก่อนแก้ไข
            this.cdr.detectChanges();
            try {
                const pdfDoc = yield PDFDocument.load(this.basePdfBytes);
                const pages = pdfDoc.getPages();
                const refPage = pages[this.pageNo - 1];
                const { width, height } = refPage.getSize();
                // Determine page dimensions based on chosen orientation
                let pageW;
                let pageH;
                if (this.insertOrientation === 'landscape') {
                    pageW = Math.max(width, height);
                    pageH = Math.min(width, height);
                }
                else {
                    pageW = Math.min(width, height);
                    pageH = Math.max(width, height);
                }
                const insertIndex = where === 'before' ? this.pageNo - 1 : this.pageNo;
                pdfDoc.insertPage(insertIndex, [pageW, pageH]);
                const newBytes = yield pdfDoc.save();
                this.basePdfBytes = newBytes.buffer;
                // Shift annotations that are on pages >= insertIndex+1
                const shiftPage = insertIndex + 1; // 1-based page number of first shifted page
                const shiftAnnotations = (arr) => arr.map(a => a.page >= shiftPage ? Object.assign(Object.assign({}, a), { page: a.page + 1 }) : a);
                this.textBoxes = shiftAnnotations(this.textBoxes);
                this.imageStamps = shiftAnnotations(this.imageStamps);
                this.shapeStamps = shiftAnnotations(this.shapeStamps);
                this.signatureStamps = shiftAnnotations(this.signatureStamps);
                this.dateStamps = shiftAnnotations(this.dateStamps);
                // Shift stroke/shape records
                const shiftRecord = (rec) => {
                    const next = {};
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
                if (this.pdfDocProxy) {
                    this.pdfDocProxy.destroy();
                    this.pdfDocProxy = null;
                }
                const loadingTask = pdfjsLib.getDocument({ data: copy });
                this.pdfDocProxy = yield loadingTask.promise;
                this.pageCount = this.pdfDocProxy.numPages;
                this.loadedUntilPage = Math.min(this.loadedUntilPage, this.pageCount);
                this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
                this.pages.forEach(p => this.ensurePage(p));
                // Refresh aspect ratios & rotations
                this.pdfPageAspects.clear();
                this.pdfPageRotations.clear();
                try {
                    const tmpDoc = yield PDFDocument.load(copy);
                    tmpDoc.getPages().forEach((pg, idx) => {
                        const { width: w, height: h } = pg.getSize();
                        this.pdfPageAspects.set(idx + 1, w / h);
                        this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                    });
                }
                catch (_) { }
                // Navigate to the new blank page
                this.pageNo = insertIndex + 1;
                this.renderedPages.clear();
                this.renderingPages.clear();
                yield this.generateThumbnails();
                yield this.renderAllPages();
                this.scrollToPage(this.pageNo);
                const toast = yield this.toastCtrl.create({
                    message: `แทรกหน้าเปล่า${this.insertOrientation === 'portrait' ? 'แนวตั้ง' : 'แนวนอน'}ที่หน้า ${this.pageNo} เรียบร้อยแล้ว`,
                    duration: 2000,
                    color: 'success',
                    position: 'bottom'
                });
                yield toast.present();
                // Log to history
                this.logHistory('page_insert', { where, orientation: this.insertOrientation, insertedAt: this.pageNo }, this.pageNo);
            }
            catch (err) {
                console.error('insertBlankPage error:', err);
                const toast = yield this.toastCtrl.create({
                    message: 'เกิดข้อผิดพลาดในการแทรกหน้า',
                    duration: 2000,
                    color: 'danger',
                    position: 'bottom'
                });
                yield toast.present();
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
                this.cdr.detectChanges();
            }
        });
    }
    /* ================= Delete Current Page ================= */
    deletePage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes || this.pageCount <= 1)
                return;
            this.showInsertMenu = false;
            // Confirm before deleting
            const alert = yield this.alertCtrl.create({
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
            yield alert.present();
        });
    }
    doDeletePage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes)
                return;
            this.isLoading = true;
            this.loadingMessage = 'กำลังลบหน้า...';
            this.savePageSnapshot(); // บันทึก snapshot ก่อนลบ
            this.cdr.detectChanges();
            try {
                const pdfDoc = yield PDFDocument.load(this.basePdfBytes);
                const deleteIndex = this.pageNo - 1; // 0-based
                pdfDoc.removePage(deleteIndex);
                const newBytes = yield pdfDoc.save();
                this.basePdfBytes = newBytes.buffer;
                // Remove annotations on the deleted page; shift pages above it down
                const deletedPage = this.pageNo;
                const filterAndShift = (arr) => arr
                    .filter(a => a.page !== deletedPage)
                    .map(a => a.page > deletedPage ? Object.assign(Object.assign({}, a), { page: a.page - 1 }) : a);
                this.textBoxes = filterAndShift(this.textBoxes);
                this.imageStamps = filterAndShift(this.imageStamps);
                this.shapeStamps = filterAndShift(this.shapeStamps);
                this.signatureStamps = filterAndShift(this.signatureStamps);
                this.dateStamps = filterAndShift(this.dateStamps);
                // Shift stroke/shape records
                const shiftDeleteRecord = (rec) => {
                    const next = {};
                    for (const key of Object.keys(rec)) {
                        const p = Number(key);
                        if (p === deletedPage)
                            continue; // drop deleted page
                        next[p > deletedPage ? p - 1 : p] = rec[p];
                    }
                    return next;
                };
                this.strokes = shiftDeleteRecord(this.strokes);
                this.shapes = shiftDeleteRecord(this.shapes);
                this.redoStack = shiftDeleteRecord(this.redoStack);
                // Reload pdfjs
                const copy = this.basePdfBytes.slice(0);
                if (this.pdfDocProxy) {
                    this.pdfDocProxy.destroy();
                    this.pdfDocProxy = null;
                }
                const loadingTask = pdfjsLib.getDocument({ data: copy });
                this.pdfDocProxy = yield loadingTask.promise;
                this.pageCount = this.pdfDocProxy.numPages;
                this.loadedUntilPage = Math.min(this.loadedUntilPage, this.pageCount);
                this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
                this.pages.forEach(p => this.ensurePage(p));
                // Refresh aspect ratios & rotations
                this.pdfPageAspects.clear();
                this.pdfPageRotations.clear();
                try {
                    const tmpDoc = yield PDFDocument.load(copy);
                    tmpDoc.getPages().forEach((pg, idx) => {
                        const { width, height } = pg.getSize();
                        this.pdfPageAspects.set(idx + 1, width / height);
                        this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                    });
                }
                catch (_) { }
                // Navigate to the previous page (or page 1 if we deleted page 1)
                this.pageNo = Math.min(deletedPage, this.pageCount);
                this.renderedPages.clear();
                this.renderingPages.clear();
                yield this.generateThumbnails();
                yield this.renderAllPages();
                this.scrollToPage(this.pageNo);
                const toast = yield this.toastCtrl.create({
                    message: `ลบหน้าที่ ${deletedPage} เรียบร้อยแล้ว`,
                    duration: 2000,
                    color: 'success',
                    position: 'bottom'
                });
                yield toast.present();
            }
            catch (err) {
                console.error('deletePage error:', err);
                const toast = yield this.toastCtrl.create({
                    message: 'เกิดข้อผิดพลาดในการลบหน้า',
                    duration: 2000,
                    color: 'danger',
                    position: 'bottom'
                });
                yield toast.present();
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
                this.cdr.detectChanges();
            }
        });
    }
    /* ================= Thumbnail Sidebar Wrappers ================= */
    toggleThumbInsert(idx, event) {
        if (this.thumbInsertIndex === idx) {
            this.thumbInsertIndex = -1;
            return;
        }
        this.thumbInsertIndex = idx;
        if (event && event.currentTarget) {
            const btn = event.currentTarget;
            const rect = btn.getBoundingClientRect();
            // Center the dropdown vertically on the button
            this.thumbDropdownTop = rect.top + rect.height / 2;
        }
    }
    /** Insert a blank page at `afterIndex` (0 = before page 1, n = after page n) */
    insertAtThumb(afterIndex, orientation) {
        return __awaiter(this, void 0, void 0, function* () {
            this.thumbInsertIndex = -1;
            if (!this.basePdfBytes)
                return;
            // Navigate to the page around which we are inserting so insertBlankPage works correctly
            this.insertOrientation = orientation;
            // insertBlankPage uses this.pageNo; afterIndex=0 means before page 1
            if (afterIndex === 0) {
                this.pageNo = 1;
                yield this.insertBlankPage('before');
            }
            else {
                this.pageNo = afterIndex;
                yield this.insertBlankPage('after');
            }
        });
    }
    triggerThumbFileUpload(afterIndex) {
        this.thumbInsertIndex = -1;
        this.thumbInsertAtIndex = afterIndex;
        if (this.thumbFileInputRef) {
            this.thumbFileInputRef.nativeElement.value = '';
            this.thumbFileInputRef.nativeElement.click();
        }
    }
    onThumbFileSelected(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = event.target;
            if (!input.files || !input.files[0] || !this.basePdfBytes)
                return;
            const file = input.files[0];
            // Navigate to the correct insert position then trigger image upload
            if (this.thumbInsertAtIndex === 0) {
                this.pageNo = 1;
            }
            else {
                this.pageNo = this.thumbInsertAtIndex;
            }
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
                    const dataUrl = e.target.result;
                    // Place as full-page image stamp on the target page
                    if (this.thumbInsertAtIndex === 0) {
                        yield this.insertBlankPage('before');
                    }
                    else {
                        yield this.insertBlankPage('after');
                    }
                    // Add image stamp on the newly inserted page
                    const newPage = this.thumbInsertAtIndex === 0 ? 1 : this.thumbInsertAtIndex + 1;
                    const stamp = {
                        id: 'img_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                        page: newPage, x: 0, y: 0, width: 100, height: 100, dataUrl
                    };
                    this.imageStamps.push(stamp);
                    this.cdr.detectChanges();
                });
                reader.readAsDataURL(file);
            }
            else if (file.type === 'application/pdf') {
                this.isLoading = true;
                this.loadingMessage = 'กำลังแทรกไฟล์ PDF...';
                this.savePageSnapshot();
                this.cdr.detectChanges();
                try {
                    const arrayBuffer = yield file.arrayBuffer();
                    const importedPdf = yield PDFDocument.load(arrayBuffer);
                    const mainPdf = yield PDFDocument.load(this.basePdfBytes);
                    const importedPages = yield mainPdf.copyPages(importedPdf, importedPdf.getPageIndices());
                    // thumbInsertAtIndex is 0 to insert before page 1, or page number to insert after
                    const insertIndex = this.thumbInsertAtIndex;
                    let currentIndex = insertIndex;
                    for (const page of importedPages) {
                        mainPdf.insertPage(currentIndex, page);
                        currentIndex++;
                    }
                    const newBytes = yield mainPdf.save();
                    this.basePdfBytes = newBytes.buffer;
                    const insertedCount = importedPages.length;
                    // Shift annotations that are on pages >= insertIndex+1
                    const shiftPage = insertIndex + 1;
                    const shiftAnnotations = (arr) => arr.map(a => a.page >= shiftPage ? Object.assign(Object.assign({}, a), { page: a.page + insertedCount }) : a);
                    this.textBoxes = shiftAnnotations(this.textBoxes);
                    this.imageStamps = shiftAnnotations(this.imageStamps);
                    this.shapeStamps = shiftAnnotations(this.shapeStamps);
                    this.signatureStamps = shiftAnnotations(this.signatureStamps);
                    this.dateStamps = shiftAnnotations(this.dateStamps);
                    const shiftRecord = (rec) => {
                        const next = {};
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
                    if (this.pdfDocProxy) {
                        this.pdfDocProxy.destroy();
                        this.pdfDocProxy = null;
                    }
                    const loadingTask = pdfjsLib.getDocument({ data: copy });
                    this.pdfDocProxy = yield loadingTask.promise;
                    this.pageCount = this.pdfDocProxy.numPages;
                    this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
                    this.pages.forEach(p => this.ensurePage(p));
                    this.pdfPageAspects.clear();
                    this.pdfPageRotations.clear();
                    try {
                        const tmpDoc = yield PDFDocument.load(copy);
                        tmpDoc.getPages().forEach((pg, idx) => {
                            const { width: w, height: h } = pg.getSize();
                            this.pdfPageAspects.set(idx + 1, w / h);
                            this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                        });
                    }
                    catch (_) { }
                    this.pageNo = shiftPage;
                    this.renderedPages.clear();
                    this.renderingPages.clear();
                    yield this.generateThumbnails();
                    yield this.renderAllPages();
                    this.scrollToPage(this.pageNo);
                    const toast = yield this.toastCtrl.create({
                        message: `แทรกไฟล์ PDF จำนวน ${insertedCount} หน้าเรียบร้อยแล้ว`,
                        duration: 2000,
                        color: 'success',
                        position: 'bottom'
                    });
                    yield toast.present();
                    this.logHistory('page_insert', { where: 'pdf_file', insertedAt: shiftPage, count: insertedCount }, shiftPage);
                }
                catch (err) {
                    console.error('insert PDF error:', err);
                    const toast = yield this.toastCtrl.create({
                        message: 'เกิดข้อผิดพลาดในการแทรกไฟล์ PDF',
                        duration: 2000,
                        color: 'danger',
                        position: 'bottom'
                    });
                    yield toast.present();
                }
                finally {
                    this.isLoading = false;
                    this.loadingMessage = '';
                    if (this.thumbFileInputRef) {
                        this.thumbFileInputRef.nativeElement.value = '';
                    }
                    this.cdr.detectChanges();
                }
            }
            else {
                const toast = yield this.toastCtrl.create({
                    message: 'รองรับเฉพาะไฟล์รูปภาพและเอกสาร PDF ในขณะนี้',
                    duration: 2500, color: 'warning', position: 'bottom'
                });
                yield toast.present();
            }
        });
    }
    movePageToIndex(pageNum, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (direction === 'up' && pageNum > 1) {
                const prevPageNo = this.pageNo;
                this.pageNo = pageNum;
                yield this.swapPages(pageNum - 1, pageNum);
                this.pageNo = pageNum - 1;
                this.scrollToPage(this.pageNo);
            }
            else if (direction === 'down' && pageNum < this.pageCount) {
                this.pageNo = pageNum;
                yield this.swapPages(pageNum, pageNum + 1);
                this.pageNo = pageNum + 1;
                this.scrollToPage(this.pageNo);
            }
        });
    }
    deleteSpecificPage(pageNum) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageCount <= 1)
                return;
            this.pageNo = pageNum;
            yield this.deletePage();
        });
    }
    insertBlankPageFromThumb(where) {
        this.showThumbInsertMenu = false;
        this.insertBlankPage(where);
    }
    deletePageFromThumb() {
        this.deletePage();
    }
    /* ================= Move Page Up/Down ================= */
    movePageUp() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageNo <= 1 || !this.basePdfBytes)
                return;
            yield this.swapPages(this.pageNo - 1, this.pageNo);
            this.pageNo = this.pageNo - 1;
            this.scrollToPage(this.pageNo);
        });
    }
    movePageDown() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageNo >= this.pageCount || !this.basePdfBytes)
                return;
            yield this.swapPages(this.pageNo, this.pageNo + 1);
            this.pageNo = this.pageNo + 1;
            this.scrollToPage(this.pageNo);
        });
    }
    swapPages(pageA, pageB) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes)
                return;
            this.savePageSnapshot();
            this.isLoading = true;
            this.loadingMessage = 'กำลังย้ายหน้า...';
            this.cdr.detectChanges();
            try {
                const pdfDoc = yield PDFDocument.load(this.basePdfBytes);
                const idxA = pageA - 1;
                const idxB = pageB - 1;
                // Copy both pages then insert at swapped positions
                const [copyOfB] = yield pdfDoc.copyPages(pdfDoc, [idxB]);
                const [copyOfA] = yield pdfDoc.copyPages(pdfDoc, [idxA]);
                // Insert B at position A, then A at position B+1 (now shifted by 1)
                pdfDoc.insertPage(idxA, copyOfB);
                pdfDoc.insertPage(idxB + 1, copyOfA);
                // Remove the original A (now at idxA+1) and original B (now at idxB+2)
                pdfDoc.removePage(idxA + 1);
                pdfDoc.removePage(idxB + 1);
                const newBytes = yield pdfDoc.save();
                this.basePdfBytes = newBytes.buffer;
                // Swap annotations between the two pages
                const swapAnnot = (arr) => arr.map(a => {
                    if (a.page === pageA)
                        return Object.assign(Object.assign({}, a), { page: pageB });
                    if (a.page === pageB)
                        return Object.assign(Object.assign({}, a), { page: pageA });
                    return a;
                });
                this.textBoxes = swapAnnot(this.textBoxes);
                this.imageStamps = swapAnnot(this.imageStamps);
                this.shapeStamps = swapAnnot(this.shapeStamps);
                this.signatureStamps = swapAnnot(this.signatureStamps);
                this.dateStamps = swapAnnot(this.dateStamps);
                const swapRecord = (rec) => {
                    const next = {};
                    for (const k of Object.keys(rec)) {
                        const p = Number(k);
                        if (p === pageA)
                            next[pageB] = rec[p];
                        else if (p === pageB)
                            next[pageA] = rec[p];
                        else
                            next[p] = rec[p];
                    }
                    return next;
                };
                this.strokes = swapRecord(this.strokes);
                this.shapes = swapRecord(this.shapes);
                this.redoStack = swapRecord(this.redoStack);
                // Reload pdfjs
                const copy = this.basePdfBytes.slice(0);
                if (this.pdfDocProxy) {
                    this.pdfDocProxy.destroy();
                    this.pdfDocProxy = null;
                }
                const loadingTask = pdfjsLib.getDocument({ data: copy });
                this.pdfDocProxy = yield loadingTask.promise;
                this.pageCount = this.pdfDocProxy.numPages;
                this.loadedUntilPage = Math.min(this.loadedUntilPage, this.pageCount);
                this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
                this.pages.forEach(p => this.ensurePage(p));
                this.pdfPageAspects.clear();
                this.pdfPageRotations.clear();
                try {
                    const tmpDoc = yield PDFDocument.load(copy);
                    tmpDoc.getPages().forEach((pg, idx) => {
                        const { width, height } = pg.getSize();
                        this.pdfPageAspects.set(idx + 1, width / height);
                        this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                    });
                }
                catch (_) { }
                this.renderedPages.clear();
                this.renderingPages.clear();
                yield this.generateThumbnails();
                yield this.renderAllPages();
            }
            catch (err) {
                console.error('swapPages error:', err);
                const toast = yield this.toastCtrl.create({
                    message: 'เกิดข้อผิดพลาดในการย้ายหน้า',
                    duration: 2000, color: 'danger', position: 'bottom'
                });
                yield toast.present();
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
                this.cdr.detectChanges();
            }
        });
    }
    /* ================= Page helpers ================= */
    ensurePage(p = this.pageNo) {
        if (!this.strokes[p])
            this.strokes[p] = [];
        if (!this.shapes[p])
            this.shapes[p] = [];
        if (!this.redoStack[p])
            this.redoStack[p] = [];
    }
    getPdfCanvas(p) {
        return document.getElementById('pdfCanvas-' + p);
    }
    getAnnotCanvas(p) {
        return document.getElementById('annotCanvas-' + p);
    }
    onViewerScroll(event) {
        if (this.isScrollNavigating)
            return;
        const container = event.target;
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        // Find which page is most visible
        for (let i = 1; i <= this.loadedUntilPage; i++) {
            const pageEl = document.getElementById('page-' + i);
            if (!pageEl)
                continue;
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
                if (i >= this.loadedUntilPage - 5)
                    this.loadNextChunk();
                break;
            }
        }
    }
    prevPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageNo <= 1)
                return;
            this.pageNo -= 1;
            this.scrollToPage(this.pageNo);
            yield this.fitWidth();
        });
    }
    zoomIn() {
        return __awaiter(this, void 0, void 0, function* () {
            this.zoom = Math.min(3, this.zoom + 0.1);
            this.renderedPages.clear();
            yield this.renderAllPages();
        });
    }
    nextPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageNo >= this.pageCount)
                return;
            // If at the edge of the loaded chunk, load next chunk first
            if (this.pageNo >= this.loadedUntilPage) {
                yield this.loadNextChunk();
            }
            this.pageNo += 1;
            this.scrollToPage(this.pageNo);
            yield this.fitWidth();
        });
    }
    firstPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageNo === 1)
                return;
            this.pageNo = 1;
            this.scrollToPage(this.pageNo);
            yield this.fitWidth();
        });
    }
    lastPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageNo === this.pageCount)
                return;
            // Jump to last loaded page; pre-load next chunk in background
            this.pageNo = this.loadedUntilPage;
            this.scrollToPage(this.pageNo);
            yield this.fitWidth();
            if (this.loadedUntilPage < this.pageCount)
                this.loadNextChunk();
        });
    }
    zoomOut() {
        return __awaiter(this, void 0, void 0, function* () {
            this.zoom = Math.max(0.5, this.zoom - 0.1);
            this.renderedPages.clear();
            yield this.renderAllPages();
        });
    }
    scrollToPage(pageNum) {
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
    scrollThumbnailIntoView(pageNum) {
        const thumbEl = document.getElementById('thumb-' + pageNum);
        if (thumbEl) {
            thumbEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    debouncedRenderVisible() {
        if (this.renderDebounceTimer) {
            clearTimeout(this.renderDebounceTimer);
        }
        this.renderDebounceTimer = setTimeout(() => {
            this.renderAllPages();
        }, 200);
    }
    renderAllPages() {
        return __awaiter(this, void 0, void 0, function* () {
            // Prevent concurrent render calls
            if (this.isRenderingAll)
                return;
            this.isRenderingAll = true;
            try {
                // Render all pages (memory saved via DPR cap and cleanup on destroy)
                for (let p = 1; p <= this.pageCount; p++) {
                    yield this.renderPage(p);
                }
            }
            finally {
                this.isRenderingAll = false;
            }
        });
    }
    /** Compute zoom so the WIDEST page in the document fits within the container.
     *  This prevents landscape pages from overflowing and being clipped by overflow-x. */
    fitWidth() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.viewerContainerRef)
                return;
            const parent = this.viewerContainerRef.nativeElement;
            if (!parent || parent.clientWidth === 0) {
                yield new Promise(resolve => setTimeout(resolve, 50));
                return this.fitWidth();
            }
            const containerW = parent.clientWidth;
            const targetW = containerW - 40; // padding
            // Check if container size has changed enough, or if the current page changed
            const sameContainer = Math.abs(containerW - this.lastParentWidth) < 2;
            const samePage = this.pageNo === this.lastFitPageNo;
            if (sameContainer && samePage)
                return;
            this.lastParentWidth = containerW;
            this.lastFitPageNo = this.pageNo;
            // Wait for DOM to populate if pages are defined
            if (this.pages.length > 0) {
                yield new Promise(resolve => setTimeout(resolve, 100));
            }
            // Scan all pages to find the widest viewport (landscape pages may be wider than portrait)
            let maxVpWidth = 0;
            for (let p = 1; p <= this.pageCount; p++) {
                try {
                    const pg = yield this.pdfDocProxy.getPage(p);
                    const vp = pg.getViewport({ scale: 1 });
                    if (vp.width > maxVpWidth)
                        maxVpWidth = vp.width;
                }
                catch (_) { /* skip unavailable pages */ }
            }
            if (maxVpWidth <= 0)
                return; // safety guard
            this.zoom = targetW / maxVpWidth;
            this.renderedPages.clear();
            yield this.renderAllPages();
        });
    }
    renderPage(p = this.pageNo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pdfDocProxy || this.renderingPages.has(p) || this.renderedPages.has(p))
                return;
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
                const page = yield this.pdfDocProxy.getPage(p);
                // Store the true effective rotation from pdf.js, as it correctly handles inherited rotations
                // from the PDF page tree (which pdf-lib's getRotation() sometimes misses).
                // We will use this in saveDocument to know exactly how the user saw the page.
                this.pdfPageRotations.set(p, page.rotate || 0);
                // Use native pdf.js viewport. pdf.js smartly handles rotation including inherited ones.
                const viewport = page.getViewport({ scale: this.zoom });
                if (p === this.pageNo)
                    this.currentViewport = viewport;
                const pdfCanvas = this.getPdfCanvas(p);
                if (!pdfCanvas)
                    return;
                const pdfCtx = pdfCanvas.getContext('2d');
                // Cap DPR at 2 to reduce memory usage on high-res displays
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                pdfCanvas.width = Math.floor(viewport.width * dpr);
                pdfCanvas.height = Math.floor(viewport.height * dpr);
                pdfCanvas.style.width = viewport.width + 'px';
                pdfCanvas.style.height = viewport.height + 'px';
                pdfCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                pdfCtx.clearRect(0, 0, viewport.width, viewport.height);
                yield page.render({ canvasContext: pdfCtx, viewport }).promise;
                // Render Text Layer for native selection
                const pageWrapper = pdfCanvas.parentElement;
                if (pageWrapper) {
                    let textLayerDiv = pageWrapper.querySelector('.textLayer');
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
                        const textContent = yield page.getTextContent();
                        const textLayer = new pdfjsLib.TextLayer({
                            textContentSource: textContent,
                            container: textLayerDiv,
                            viewport
                        });
                        yield textLayer.render();
                    }
                    catch (e) {
                        console.warn('Failed to render text layer:', e);
                    }
                }
                // Small delay to ensure PDF content (fonts, text) are fully rendered
                yield new Promise(resolve => setTimeout(resolve, 100));
                this.resizeAnnotCanvasTo(p, viewport.width, viewport.height);
                const annotCanvas = this.getAnnotCanvas(p);
                if (annotCanvas) {
                    // Run events outside Angular to eliminate Change Detection lag on 120Hz/240Hz Apple Pencils
                    this.zone.runOutsideAngular(() => {
                        if (annotCanvas._hasPointerEvents)
                            return;
                        annotCanvas._hasPointerEvents = true;
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
            }
            catch (err) {
                console.error(`Error rendering page ${p}:`, err);
            }
            finally {
                this.renderingPages.delete(p);
                if (this.renderingPages.size === 0) {
                    this.isLoading = false;
                    this.loadingMessage = '';
                    this.cdr.detectChanges();
                }
            }
        });
    }
    resizeAnnotCanvasTo(p, cssW, cssH) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
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
    setupResizeAutoRender() {
        if (!this.viewerContainerRef)
            return;
        this.resizeObserver = new ResizeObserver(() => {
            this.fitWidth();
        });
        this.resizeObserver.observe(this.viewerContainerRef.nativeElement);
    }
    /* ================= Tool Mode Toggles ================= */
    setToolMode(mode) {
        this.toolMode = this.toolMode === mode ? 'none' : mode;
        this.showShapeMenu = false;
        this.syncToolModeStyles();
    }
    updateCursor() {
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
    changeBrushSize(delta) {
        this.brushSize = Math.max(1, Math.min(50, this.brushSize + delta));
        this.saveSettings();
        this.cdr.detectChanges();
    }
    setBrushColor(color) {
        this.brushColor = color;
        this.saveSettings();
        this.cdr.detectChanges();
    }
    changeHighlightSize(delta) {
        this.highlightSize = Math.max(5, Math.min(100, this.highlightSize + delta));
        this.saveSettings();
        this.cdr.detectChanges();
    }
    setHighlightColor(color) {
        this.highlightColor = color;
        this.saveSettings();
        this.cdr.detectChanges();
    }
    changeTextFontSize(delta) {
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
    toggleDraw() { this.setToolMode('draw'); }
    toggleEraser() { this.setToolMode('eraser'); }
    toggleHighlight() { this.setToolMode('highlight'); }
    enableTextPlaceMode() { this.setToolMode('text'); }
    toggleShapeMenu() {
        this.showShapeMenu = !this.showShapeMenu;
        if (this.showShapeMenu) {
            this.toolMode = 'shape';
        }
    }
    toggleShapeDropdown() {
        this.showShapeDropdown = !this.showShapeDropdown;
    }
    selectShape(type) {
        this.shapeType = type;
        this.toolMode = 'shape';
        this.showShapeMenu = false;
        this.showShapeDropdown = false;
        this.saveSettings();
        this.updateCursor();
    }
    setShapeStrokeColor(color) {
        this.shapeStrokeColor = color;
        if (this.activeObjectId && this.activeObjectType === 'shape') {
            const s = this.shapeStamps.find(x => x.id === this.activeObjectId);
            if (s)
                s.strokeColor = color;
        }
        this.saveSettings();
    }
    setShapeFillColor(color) {
        this.shapeFillColor = color;
        if (this.activeObjectId && this.activeObjectType === 'shape') {
            const s = this.shapeStamps.find(x => x.id === this.activeObjectId);
            if (s)
                s.fillColor = color;
        }
        this.saveSettings();
    }
    toggleShapeFill() {
        this.shapeFillEnabled = !this.shapeFillEnabled;
        if (this.activeObjectId && this.activeObjectType === 'shape') {
            const s = this.shapeStamps.find(x => x.id === this.activeObjectId);
            if (s)
                s.fillColor = this.shapeFillEnabled ? this.shapeFillColor : 'none';
        }
        this.saveSettings();
    }
    toggleShapeNoStroke() {
        this.shapeNoStroke = !this.shapeNoStroke;
        if (this.activeObjectId && this.activeObjectType === 'shape') {
            const s = this.shapeStamps.find(x => x.id === this.activeObjectId);
            if (s)
                s.strokeColor = this.shapeNoStroke ? 'none' : this.shapeStrokeColor;
        }
        this.saveSettings();
    }
    changeShapeStrokeSize(delta) {
        const s = this.shapeStrokeSize + delta;
        if (s >= 1 && s <= 20) {
            this.shapeStrokeSize = s;
            if (this.activeObjectId && this.activeObjectType === 'shape') {
                const shape = this.shapeStamps.find(x => x.id === this.activeObjectId);
                if (shape)
                    shape.strokeWidth = s;
            }
            this.saveSettings();
        }
    }
    /* ================= Annotation Canvas Events ================= */
    getNormPos(e, p) {
        const rect = this.activeCanvasRect || (() => {
            const canvas = this.getAnnotCanvas(p);
            return canvas ? canvas.getBoundingClientRect() : null;
        })();
        if (!rect)
            return { x: 0, y: 0, p: 0 };
        const nx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const ny = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
        const pressure = (typeof e.pressure === 'number' && e.pressure > 0) ? e.pressure : 0;
        return { x: nx, y: ny, p: pressure };
    }
    finalizeActiveStroke() {
        if (!this.activeStroke && !this.activeShape)
            return;
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
                const stamp = {
                    id: 'shs_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                    page: sh.page,
                    x: (left / cw) * 100,
                    y: (top / ch) * 100,
                    width: (bw / cw) * 100,
                    height: (bh / ch) * 100,
                    type: sh.type,
                    strokeColor: sh.color,
                    strokeWidth: sh.size,
                    viewWidth: cw,
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
    removeShapeStamp(id) {
        this.shapeStamps = this.shapeStamps.filter(s => s.id !== id);
        this.cdr.detectChanges();
    }
    startShapeDrag(e, ssid) {
        if (this.toolMode !== 'none')
            return;
        this.closeContextMenu();
        this.activeObjectId = ssid;
        this.activeObjectType = 'shape';
        const stamp = this.shapeStamps.find(s => s.id === ssid);
        if (!stamp)
            return;
        // Sync UI settings with the selected shape
        this.shapeType = stamp.type;
        if (stamp.strokeColor === 'none' || stamp.strokeColor === 'rgba(0,0,0,0)' || stamp.strokeColor === 'transparent') {
            this.shapeNoStroke = true;
        }
        else {
            this.shapeNoStroke = false;
            this.shapeStrokeColor = stamp.strokeColor;
        }
        if (!stamp.fillColor || stamp.fillColor === 'none' || stamp.fillColor === 'rgba(0,0,0,0)' || stamp.fillColor === 'transparent') {
            this.shapeFillEnabled = false;
        }
        else {
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
        const move = (ev) => {
            ev.preventDefault();
            if (!this.isDraggingShape || !this.dragShapeId)
                return;
            const s = this.shapeStamps.find(x => x.id === this.dragShapeId);
            if (!s)
                return;
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
    startShapeResize(ev, shapeId, direction = 'se') {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        ev.preventDefault();
        const stamp = this.shapeStamps.find(s => s.id === shapeId);
        if (!stamp)
            return;
        // Sync UI settings with the selected shape
        this.activeObjectId = shapeId;
        this.activeObjectType = 'shape';
        this.shapeType = stamp.type;
        if (stamp.strokeColor === 'none' || stamp.strokeColor === 'rgba(0,0,0,0)' || stamp.strokeColor === 'transparent') {
            this.shapeNoStroke = true;
        }
        else {
            this.shapeNoStroke = false;
            this.shapeStrokeColor = stamp.strokeColor;
        }
        if (!stamp.fillColor || stamp.fillColor === 'none' || stamp.fillColor === 'rgba(0,0,0,0)' || stamp.fillColor === 'transparent') {
            this.shapeFillEnabled = false;
        }
        else {
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
        const move = (e) => {
            e.preventDefault();
            if (!this.isResizingShape || !this.resizeShapeId)
                return;
            const s = this.shapeStamps.find(x => x.id === this.resizeShapeId);
            if (!s)
                return;
            const dx = ((e.clientX - startX) / canvasRect.width) * 100;
            const dy = ((e.clientY - startY) / canvasRect.height) * 100;
            let nw = startW, nh = startH, nx = startSX, ny = startSY;
            if (direction.includes('e'))
                nw = Math.max(2, startW + dx);
            if (direction.includes('w')) {
                nw = Math.max(2, startW - dx);
                nx = startSX + (startW - nw);
            }
            if (direction.includes('s'))
                nh = Math.max(2, startH + dy);
            if (direction.includes('n')) {
                nh = Math.max(2, startH - dy);
                ny = startSY + (startH - nh);
            }
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
    getArrowAngleDeg(ss) {
        return (180 / Math.PI) * Math.atan2(ss.endFracY - ss.startFracY, ss.endFracX - ss.startFracX);
    }
    onCanvasPointerDown(e, p) {
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
            }
            else if (this.activePointerType === 'pen') {
                return; // Strongly ignore touch if pen is currently active
            }
            else {
                // Trust the newest touch if no pen is involved
                this.activeStroke = null;
                this.activeShape = null;
            }
        }
        // Deselect any active element when clicking on the empty canvas
        this.zone.run(() => {
            if (this.activeTextBoxId !== null || this.activeObjectId !== null) {
                this.activeTextBoxId = null;
                this.activeObjectId = null;
                this.activeObjectType = null;
                this.cdr.detectChanges();
            }
        });
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
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
                }
                else if (this.toolMode === 'shape') {
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
    onCanvasPointerMove(e, p) {
        if (this.activePointerId !== null && e.pointerId !== this.activePointerId)
            return;
        // Prevent default touch handling during active drawing
        if (this.activeStroke || this.activeShape) {
            e.preventDefault();
        }
        if (this.activeStroke) {
            let events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
            if (!events || events.length === 0)
                events = [e];
            const startIdx = Math.max(0, this.activeStroke.points.length - 1);
            const canvasRect = this.activeCanvasRect;
            for (const ev of events) {
                let pt = this.getNormPos(ev, p);
                if (this.activeStroke.points.length > 0 && canvasRect) {
                    const lastPt = this.activeStroke.points[this.activeStroke.points.length - 1];
                    // Skip physically tiny sub-pixel movements (less than 1.5px) to drastically reduce rendering overhead/lag
                    const dx = (pt.x - lastPt.x) * canvasRect.width;
                    const dy = (pt.y - lastPt.y) * canvasRect.height;
                    if (dx * dx + dy * dy < 2.25)
                        continue; // 1.5px squared
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
                        }
                        else {
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
    onCanvasPointerUp(e, p) {
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
    placeSignatureOnPage(e, p) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const dataUrl = this.pendingSignatureDataUrl;
        // Load the image to get its real aspect ratio
        const img = new Image();
        img.onload = () => __awaiter(this, void 0, void 0, function* () {
            const sigWidthPercent = 15;
            // Calculate height using PDF page aspect ratio for accuracy.
            // If not available yet, fall back to canvas aspect ratio.
            const pdfAspect = this.pdfPageAspects.get(p); // width/height of PDF page
            const canvasAspect = rect.width / rect.height; // width/height of canvas on screen
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
            const digitalId = this.userId ? yield this.hashUserId(this.userId) : '';
            const stamp = {
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
        });
        img.src = dataUrl;
    }
    /** Generate SHA-256 based Digital ID from userId */
    hashUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const encoder = new TextEncoder();
                const data = encoder.encode(userId);
                const hashBuffer = yield crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                // Take first 10 hex chars for a shorter but still unique ID
                return `DID-${hashHex.substring(0, 10).toUpperCase()}`;
            }
            catch (e) {
                // Fallback for environments without Web Crypto
                let hash = 0;
                for (let i = 0; i < userId.length; i++) {
                    const ch = userId.charCodeAt(i);
                    hash = ((hash << 5) - hash) + ch;
                    hash = hash & hash;
                }
                return `DID-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
            }
        });
    }
    /** Log signature placement to database for reference/audit */
    logSignatureToDatabase(digitalId, signDate, pageNumber) {
        if (!this.userId || !digitalId)
            return;
        const isoDate = signDate.toISOString().replace('T', ' ').substring(0, 19);
        this.http.post(this.signaturesApiUrl, {
            aksi: 'log_signature',
            digital_id: digitalId,
            user_id: this.userId,
            sign_date: isoDate,
            document_name: this.fileName || '',
            page_number: pageNumber,
            detail_id: this.detailId || '',
            edoc_id: this.edocId || ''
        }).subscribe((res) => {
            if (res === null || res === void 0 ? void 0 : res.success) {
                console.log('Signature logged:', digitalId);
            }
            else {
                console.warn('Failed to log signature:', res === null || res === void 0 ? void 0 : res.msg);
            }
        }, (err) => console.error('Error logging signature:', err));
    }
    placeTextBoxOnPage(e, p) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
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
            bold: true,
            italic: false,
            align: 'left'
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
            const textBoxEl = document.querySelector('.text-box.active textarea');
            if (textBoxEl) {
                textBoxEl.focus();
            }
        }, 100);
    }
    /* ================= Eraser ================= */
    changeEraserSize(delta) {
        const newSize = this.eraserSize + delta;
        if (newSize >= 5 && newSize <= 200) {
            this.eraserSize = newSize;
            this.saveSettings();
        }
    }
    eraseAtPoint(e, p) {
        const pos = this.getNormPos(e, p);
        // Scale threshold based on eraser size. 
        // Default size 20 matches ~0.02 threshold roughly
        const threshold = (this.eraserSize / 1000);
        // Check strokes
        this.strokes[p] = this.strokes[p].filter(stroke => {
            return !stroke.points.some(pt => Math.abs(pt.x - pos.x) < threshold && Math.abs(pt.y - pos.y) < threshold);
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
    calcLineWidth(base, pressure) {
        if (!pressure)
            return base;
        return Math.max(1, base * (0.6 + pressure * 1.8));
    }
    redraw(p = this.pageNo, includeActive = false) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        this.ensurePage(p);
        // Draw all static annotations for this specific page
        for (const s of this.strokes[p])
            this.drawStroke(ctx, p, s);
        for (const sh of this.shapes[p])
            this.drawShape(ctx, p, sh);
        // Draw active if this is the target page
        if (includeActive && p === this.pageNo) {
            if (this.activeStroke)
                this.drawStroke(ctx, p, this.activeStroke);
            if (this.activeShape)
                this.drawShape(ctx, p, this.activeShape);
        }
    }
    drawStroke(ctx, p, s) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        if (s.points.length < 2)
            return;
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
                }
                else {
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
            }
            else if (i === s.points.length - 1) {
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(prev.x * w, prev.y * h, curr.x * w, curr.y * h);
            }
            else {
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(prev.x * w, prev.y * h, endX, endY);
            }
            ctx.stroke();
        }
    }
    drawStrokeIncremental(p, s, startIdx) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
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
            }
            else if (i === s.points.length - 1) {
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(prev.x * w, prev.y * h, curr.x * w, curr.y * h);
            }
            else {
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(prev.x * w, prev.y * h, endX, endY);
            }
            ctx.stroke();
        }
    }
    drawShape(ctx, p, sh) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
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
                if (sh.fillColor) {
                    ctx.fillStyle = sh.fillColor;
                    ctx.fill();
                }
                break;
            case 'circle': {
                const cx = (x1 + x2) / 2;
                const cy = (y1 + y2) / 2;
                const rx = Math.abs(x2 - x1) / 2;
                const ry = Math.abs(y2 - y1) / 2;
                ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                if (sh.fillColor) {
                    ctx.fillStyle = sh.fillColor;
                    ctx.fill();
                }
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
    canUndo() {
        this.ensurePage(this.pageNo);
        return this.strokes[this.pageNo].length > 0 || this.shapes[this.pageNo].length > 0;
    }
    canRedo() {
        this.ensurePage(this.pageNo);
        return this.redoStack[this.pageNo].length > 0;
    }
    undo() {
        this.ensurePage(this.pageNo);
        let item = this.strokes[this.pageNo].pop();
        if (!item)
            item = this.shapes[this.pageNo].pop();
        if (!item)
            return;
        this.redoStack[this.pageNo].push(item);
        this.redraw(this.pageNo);
    }
    redo() {
        this.ensurePage(this.pageNo);
        const item = this.redoStack[this.pageNo].pop();
        if (!item)
            return;
        if ('points' in item)
            this.strokes[this.pageNo].push(item);
        else
            this.shapes[this.pageNo].push(item);
        this.redraw(this.pageNo);
    }
    clearAnnotations() {
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
    selectTextBox(id, ev) {
        ev.stopPropagation();
        this.activeTextBoxId = id;
    }
    onTextBoxPointerDown(ev, id) {
        ev.stopPropagation();
        this.activeTextBoxId = id;
        this.startDrag(ev, id);
    }
    clearTextSelection() {
        this.activeTextBoxId = null;
    }
    getDragCanvasRect(p) {
        const canvas = this.getAnnotCanvas(p);
        return canvas ? canvas.getBoundingClientRect() : new DOMRect();
    }
    startDrag(e, textBoxId) {
        if (this.toolMode !== 'none')
            return;
        this.closeContextMenu();
        // Set both activeTextBoxId (for UI) and global active object (for Delete key)
        this.activeTextBoxId = textBoxId;
        this.activeObjectId = textBoxId;
        this.activeObjectType = 'text';
        const tb = this.textBoxes.find(t => t.id === textBoxId);
        if (!tb)
            return;
        // Sync UI settings with the selected text box
        this.textColor = tb.color || this.textColor;
        this.textFontSize = tb.fontSize || this.textFontSize;
        // If user tapped directly on textarea to type, do not initiate dragging or blurring.
        const target = e.target;
        if (target.tagName.toLowerCase() === 'textarea') {
            return;
        }
        const textBoxEl = e.currentTarget;
        // Lock touch-action during drag to prevent iPad scroll
        textBoxEl.style.touchAction = 'none';
        // Disable textarea to prevent iPadOS Scribble during drag
        const textareaEl = textBoxEl === null || textBoxEl === void 0 ? void 0 : textBoxEl.querySelector('textarea');
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
        const move = (ev) => {
            ev.preventDefault();
            if (!this.isDragging || !this.dragTextBoxId)
                return;
            const t = this.textBoxes.find(x => x.id === this.dragTextBoxId);
            if (!t)
                return;
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
    startTextBoxDrag(ev, textBoxId) {
        ev.preventDefault();
        ev.stopPropagation();
        const tb = this.textBoxes.find(t => t.id === textBoxId);
        if (!tb)
            return;
        this.activeTextBoxId = textBoxId;
        this.startDrag(ev, textBoxId);
    }
    onTextBoxInput(event, tb) {
        const textarea = event.target;
        const lines = tb.text.split('\n');
        let maxLineWidthPx = 30;
        const measureSpan = document.createElement('span');
        measureSpan.style.cssText = `position: absolute; visibility: hidden; white-space: pre; font-family: 'THSarabunNew', sans-serif; font-size: ${tb.fontSize * this.zoom}px; font-weight: ${tb.bold ? 'bold' : 'normal'}; font-style: ${tb.italic ? 'italic' : 'normal'};`;
        lines.forEach(line => {
            measureSpan.textContent = line || ' ';
            document.body.appendChild(measureSpan);
            const lineWidth = measureSpan.offsetWidth + 18; // 18px = border(2) + container padding(6) + textarea padding(6) + buffer(4)
            if (lineWidth > maxLineWidthPx)
                maxLineWidthPx = lineWidth;
            document.body.removeChild(measureSpan);
        });
        const canvasRect = this.getDragCanvasRect(tb.page);
        if (canvasRect.width > 0 && canvasRect.height > 0) {
            // Apply width first so DOM reflects correct wrapping before height measurement
            tb.width = Math.min(95, (maxLineWidthPx / canvasRect.width) * 100);
            this.cdr.detectChanges();
            // Reset height to 0 so scrollHeight reflects actual content (including any soft-wrapping)
            textarea.style.height = '0px';
            const contentHeightPx = textarea.scrollHeight;
            textarea.style.height = contentHeightPx + 'px'; // prevent scroll flicker
            const minHeightPx = (tb.fontSize * 1.4 * this.zoom) + 6;
            const finalHeightPx = Math.max(contentHeightPx, minHeightPx);
            // +6px for container top+bottom padding (3px each side)
            tb.height = Math.min(95, ((finalHeightPx + 6) / canvasRect.height) * 100);
        }
        this.cdr.detectChanges();
        // Clear inline style — container is now updated, CSS `height: 100%` takes over
        textarea.style.height = '';
    }
    onTextBoxFocus(id) {
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
    startResize(ev, textBoxId) {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        ev.preventDefault();
        const tb = this.textBoxes.find(t => t.id === textBoxId);
        if (!tb)
            return;
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
        const move = (e) => {
            e.preventDefault();
            if (!this.isResizing || !this.resizeTextBoxId)
                return;
            const t = this.textBoxes.find(x => x.id === this.resizeTextBoxId);
            if (!t)
                return;
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
    startResizeRight(ev, textBoxId) {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        ev.preventDefault();
        const tb = this.textBoxes.find(t => t.id === textBoxId);
        if (!tb)
            return;
        this.activeTextBoxId = textBoxId;
        this.activeObjectId = textBoxId;
        this.activeObjectType = 'text';
        const canvasRect = this.getDragCanvasRect(tb.page);
        const startX = ev.clientX;
        const startW = tb.width;
        const move = (e) => {
            e.preventDefault();
            const deltaX = (e.clientX - startX) / canvasRect.width * 100;
            tb.width = Math.max(5, Math.min(95 - tb.x, startW + deltaX));
            this.cdr.detectChanges();
        };
        const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    startResizeLeft(ev, textBoxId) {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        ev.preventDefault();
        const tb = this.textBoxes.find(t => t.id === textBoxId);
        if (!tb)
            return;
        this.activeTextBoxId = textBoxId;
        this.activeObjectId = textBoxId;
        this.activeObjectType = 'text';
        const canvasRect = this.getDragCanvasRect(tb.page);
        const startX = ev.clientX;
        const startTbX = tb.x;
        const startTbW = tb.width;
        const move = (e) => {
            e.preventDefault();
            const deltaX = (e.clientX - startX) / canvasRect.width * 100;
            const newX = Math.max(0, startTbX + deltaX);
            const newW = Math.max(5, startTbW - deltaX);
            if (newX + newW <= 98) {
                tb.x = newX;
                tb.width = newW;
            }
            this.cdr.detectChanges();
        };
        const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    removeTextBox(textBoxId) {
        this.textBoxes = this.textBoxes.filter(t => t.id !== textBoxId);
        if (this.activeTextBoxId === textBoxId)
            this.activeTextBoxId = null;
        this.cdr.detectChanges();
    }
    clampOneTextBox(tb) {
        // Both tb.x, tb.y, tb.width, tb.height are in 0-100 units
        tb.x = Math.max(0, Math.min(tb.x, 100 - tb.width));
        tb.y = Math.max(0, Math.min(tb.y, 100 - tb.height));
    }
    clampTextBoxesToView() {
        this.textBoxes.forEach(tb => this.clampOneTextBox(tb));
    }
    /* ================= Image Stamp Operations ================= */
    triggerImageUpload() {
        var _a, _b;
        (_b = (_a = this.fileInputRef) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.click();
    }
    normalizeImageToPng(dataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => resolve(dataUrl); // fallback: keep original
            img.src = dataUrl;
        });
    }
    onImageSelected(event) {
        const input = event.target;
        if (!input.files || !input.files[0])
            return;
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const rawDataUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            const dataUrl = yield this.normalizeImageToPng(rawDataUrl);
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
                    if (w > h) {
                        h = (h / w) * maxPx;
                        w = maxPx;
                    }
                    else {
                        w = (w / h) * maxPx;
                        h = maxPx;
                    }
                }
                this.imageStamps.push({
                    id: 'img_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                    page: this.pageNo,
                    x: ((cw / 2 - w / 2) / cw) * 100,
                    y: ((ch / 2 - h / 2) / ch) * 100,
                    width: (w / cw) * 100,
                    height: (h / ch) * 100,
                    dataUrl
                });
                this.logHistory('image', { type: 'upload' }, this.pageNo);
                this.cdr.detectChanges();
            };
            img.src = dataUrl;
        });
        reader.readAsDataURL(file);
        input.value = ''; // Reset for same file selection
    }
    startImageDrag(e, imgId) {
        if (this.toolMode !== 'none')
            return;
        this.closeContextMenu();
        this.activeObjectId = imgId;
        this.activeObjectType = 'image';
        const img = this.imageStamps.find(i => i.id === imgId);
        if (!img)
            return;
        this.isDraggingImage = true;
        this.dragImageId = imgId;
        const canvasRect = this.getDragCanvasRect(img.page);
        const startXpx = (img.x / 100) * canvasRect.width;
        const startYpx = (img.y / 100) * canvasRect.height;
        this.dragOffsetX = e.clientX - canvasRect.left - startXpx;
        this.dragOffsetY = e.clientY - canvasRect.top - startYpx;
        const move = (ev) => {
            ev.preventDefault();
            if (!this.isDraggingImage || !this.dragImageId)
                return;
            const i = this.imageStamps.find(x => x.id === this.dragImageId);
            if (!i)
                return;
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
    startImageResize(ev, imageId, direction = 'se') {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        ev.preventDefault();
        const img = this.imageStamps.find(i => i.id === imageId);
        if (!img)
            return;
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
        const move = (e) => {
            e.preventDefault();
            if (!this.isResizingImage || !this.resizeImageId)
                return;
            const i = this.imageStamps.find(x => x.id === this.resizeImageId);
            if (!i)
                return;
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
                }
                else {
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
    removeImage(imageId) {
        this.imageStamps = this.imageStamps.filter(i => i.id !== imageId);
        this.cdr.detectChanges();
    }
    /* ================= Signature Pad ================= */
    openSignaturePad() {
        this.showSignaturePad = true;
        this.signaturePoints = [];
        this.signatureStrokes = [];
        // Initialize canvas after modal is shown
        setTimeout(() => {
            this.initSignatureCanvas();
        }, 100);
    }
    closeSignaturePad() {
        this.showSignaturePad = false;
        this.signaturePoints = [];
        this.signatureStrokes = [];
    }
    setSignaturePenColor(color) {
        this.signaturePenColor = color;
    }
    changeSignaturePenSize(delta) {
        const newSize = this.signaturePenSize + delta;
        if (newSize >= 1 && newSize <= 10) {
            this.signaturePenSize = newSize;
        }
    }
    initSignatureCanvas() {
        var _a;
        const canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
        if (!canvas)
            return;
        // Responsive canvas size based on container
        const container = canvas.parentElement;
        const containerWidth = container ? container.clientWidth - 4 : 400;
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
    getSignaturePos(e) {
        const canvas = this.signatureCanvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left),
            y: (e.clientY - rect.top)
        };
    }
    onSignatureStart(e) {
        e.preventDefault();
        this.isDrawingSignature = true;
        const pos = this.getSignaturePos(e);
        this.signaturePoints = [pos];
    }
    onSignatureMove(e) {
        if (!this.isDrawingSignature || !this.signatureCtx)
            return;
        e.preventDefault();
        const pos = this.getSignaturePos(e);
        this.signaturePoints.push(pos);
        // Redraw everything for smooth Bezier rendering
        this.redrawSignatureCanvas();
    }
    onSignatureEnd(e) {
        if (!this.isDrawingSignature)
            return;
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
    redrawSignatureCanvas() {
        var _a;
        const canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
        if (!canvas || !this.signatureCtx)
            return;
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
    drawBezierStroke(ctx, points, color, size, scale = 1) {
        if (points.length < 2)
            return;
        ctx.strokeStyle = color;
        ctx.lineWidth = size * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(points[0].x * scale, points[0].y * scale);
        if (points.length === 2) {
            ctx.lineTo(points[1].x * scale, points[1].y * scale);
        }
        else {
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
    clearSignaturePad() {
        this.signaturePoints = [];
        this.signatureStrokes = [];
        this.redrawSignatureCanvas();
    }
    /** Render strokes at high resolution on an offscreen canvas and auto-crop */
    trimSignatureCanvas() {
        var _a;
        const srcCanvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
        if (!srcCanvas)
            return '';
        // Get the CSS size of the on-screen canvas
        const cssW = srcCanvas.clientWidth || 400;
        const cssH = srcCanvas.clientHeight || 200;
        // Render at 8x CSS size for crisp PDF output
        const exportScale = 8;
        const offW = Math.floor(cssW * exportScale);
        const offH = Math.floor(cssH * exportScale);
        const offCanvas = document.createElement('canvas');
        offCanvas.width = offW;
        offCanvas.height = offH;
        const ctx = offCanvas.getContext('2d');
        ctx.clearRect(0, 0, offW, offH);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Draw all strokes scaled up with their original color/size (no guide line)
        for (const stroke of this.signatureStrokes) {
            if (stroke.points.length < 2)
                continue;
            this.drawBezierStroke(ctx, stroke.points, stroke.color, stroke.size, exportScale);
        }
        // Include any active points
        if (this.signaturePoints.length >= 2) {
            this.drawBezierStroke(ctx, this.signaturePoints, this.signaturePenColor, this.signaturePenSize, exportScale);
        }
        // Auto-crop to content bounds
        const imgData = ctx.getImageData(0, 0, offW, offH);
        const { data, width, height } = imgData;
        let top = height, left = width, right = 0, bottom = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const alpha = data[(y * width + x) * 4 + 3];
                if (alpha > 10) {
                    if (y < top)
                        top = y;
                    if (y > bottom)
                        bottom = y;
                    if (x < left)
                        left = x;
                    if (x > right)
                        right = x;
                }
            }
        }
        // No content found
        if (top > bottom || left > right)
            return offCanvas.toDataURL('image/png');
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
        const trimCtx = trimCanvas.getContext('2d');
        trimCtx.drawImage(offCanvas, left, top, trimW, trimH, 0, 0, trimW, trimH);
        return trimCanvas.toDataURL('image/png');
    }
    saveSignature() {
        var _a;
        const canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
        const totalPoints = this.signatureStrokes.reduce((sum, s) => sum + s.points.length, 0);
        if (!canvas || totalPoints < 2) {
            this.closeSignaturePad();
            return;
        }
        const dataUrl = this.trimSignatureCanvas();
        this.placeSignatureOnCanvas(dataUrl);
        this.closeSignaturePad();
    }
    startSignatureDrag(e, sigId) {
        if (this.toolMode !== 'none')
            return;
        this.closeContextMenu();
        this.activeObjectId = sigId;
        this.activeObjectType = 'signature';
        const sig = this.signatureStamps.find(s => s.id === sigId);
        if (!sig)
            return;
        const canvasRect = this.getDragCanvasRect(sig.page);
        const startXpx = (sig.x / 100) * canvasRect.width;
        const startYpx = (sig.y / 100) * canvasRect.height;
        const offsetX = e.clientX - canvasRect.left - startXpx;
        const offsetY = e.clientY - canvasRect.top - startYpx;
        const move = (ev) => {
            ev.preventDefault();
            const s = this.signatureStamps.find(x => x.id === sigId);
            if (!s)
                return;
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
    startSignatureResize(ev, sigId, direction = 'se') {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        ev.preventDefault();
        const sig = this.signatureStamps.find(s => s.id === sigId);
        if (!sig)
            return;
        const canvasRect = this.getDragCanvasRect(sig.page);
        const startX = ev.clientX;
        const startY = ev.clientY;
        const startW_norm = sig.width;
        const startH_norm = sig.height;
        const startX_norm = sig.x;
        const startY_norm = sig.y;
        const aspectRatio = startW_norm / startH_norm;
        const move = (e) => {
            e.preventDefault();
            const s = this.signatureStamps.find(x => x.id === sigId);
            if (!s)
                return;
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
                }
                else {
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
    removeSignature(sigId) {
        this.signatureStamps = this.signatureStamps.filter(s => s.id !== sigId);
        this.cdr.detectChanges();
    }
    /* ================= Saved Signatures (Database) ================= */
    // Open signature picker modal
    openSignaturePickerOrPad() {
        // If user has saved signatures, show picker
        if (this.savedSignatures.length > 0) {
            this.showSignaturePicker = true;
        }
        else {
            // Otherwise, load from API first
            this.loadSavedSignatures().then(() => {
                if (this.savedSignatures.length > 0) {
                    this.showSignaturePicker = true;
                }
                else {
                    // No saved signatures, open draw pad
                    this.openSignaturePad();
                }
            });
        }
    }
    closeSignaturePicker() {
        this.showSignaturePicker = false;
    }
    // Load saved signatures from API
    loadSavedSignatures() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.userId) {
                console.warn('userId is not set, cannot load signatures');
                return;
            }
            this.isLoadingSignatures = true;
            try {
                const response = yield this.http.post(this.signaturesApiUrl, {
                    aksi: 'get_signatures',
                    user_id: this.userId
                }).toPromise();
                if (response === null || response === void 0 ? void 0 : response.success) {
                    this.savedSignatures = response.signatures || [];
                }
                else {
                    console.error('Failed to load signatures:', response === null || response === void 0 ? void 0 : response.msg);
                }
            }
            catch (err) {
                console.error('Error loading signatures:', err);
            }
            finally {
                this.isLoadingSignatures = false;
            }
        });
    }
    // Save current signature to database
    saveSignatureToDatabase(signatureName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
            const totalPoints = this.signatureStrokes.reduce((sum, s) => sum + s.points.length, 0);
            if (!canvas || totalPoints < 2) {
                return;
            }
            if (!this.userId) {
                console.warn('userId is not set, cannot save signature');
                this.saveSignature(); // Just use locally
                return;
            }
            const dataUrl = this.trimSignatureCanvas();
            this.isLoadingSignatures = true;
            try {
                const response = yield this.http.post(this.signaturesApiUrl, {
                    aksi: 'save_signature',
                    user_id: this.userId,
                    signature_name: signatureName || '',
                    signature_data: dataUrl
                }).toPromise();
                if (response === null || response === void 0 ? void 0 : response.success) {
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
                }
                else {
                    console.error('Failed to save signature:', response === null || response === void 0 ? void 0 : response.msg);
                    // Fallback: just use locally
                    this.saveSignature();
                }
            }
            catch (err) {
                console.error('Error saving signature:', err);
                this.saveSignature();
            }
            finally {
                this.isLoadingSignatures = false;
                this.closeSignaturePad();
            }
        });
    }
    // Use a saved signature from the list
    useSavedSignature(sig) {
        this.placeSignatureOnCanvas(sig.signature_data);
        this.closeSignaturePicker();
    }
    presentToast(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const toast = yield this.toastCtrl.create({
                message: msg,
                duration: 2000,
                position: 'top'
            });
            toast.present();
        });
    }
    // Place signature image on canvas (Starts placement mode)
    placeSignatureOnCanvas(dataUrl) {
        this.pendingSignatureDataUrl = dataUrl;
        this.toolMode = 'signature';
        this.updateCursor();
        this.presentToast('คลิกที่ PDF เพื่อวางลายเซ็น');
    }
    // Delete saved signature from database
    deleteSavedSignature(sig, event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event) {
                event.stopPropagation();
            }
            if (!this.userId)
                return;
            this.isLoadingSignatures = true;
            try {
                const response = yield this.http.post(this.signaturesApiUrl, {
                    aksi: 'delete_signature',
                    id: sig.id,
                    user_id: this.userId
                }).toPromise();
                if (response === null || response === void 0 ? void 0 : response.success) {
                    this.savedSignatures = this.savedSignatures.filter(s => s.id !== sig.id);
                }
                else {
                    console.error('Failed to delete signature:', response === null || response === void 0 ? void 0 : response.msg);
                }
            }
            catch (err) {
                console.error('Error deleting signature:', err);
            }
            finally {
                this.isLoadingSignatures = false;
            }
        });
    }
    // Set signature as default
    setDefaultSignature(sig, event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event) {
                event.stopPropagation();
            }
            if (!this.userId)
                return;
            try {
                const response = yield this.http.post(this.signaturesApiUrl, {
                    aksi: 'set_default',
                    id: sig.id,
                    user_id: this.userId
                }).toPromise();
                if (response === null || response === void 0 ? void 0 : response.success) {
                    // Update local list
                    this.savedSignatures.forEach(s => {
                        s.is_default = (s.id === sig.id);
                    });
                }
            }
            catch (err) {
                console.error('Error setting default:', err);
            }
        });
    }
    // Open signature pad from picker (to draw new one)
    openSignaturePadFromPicker() {
        this.closeSignaturePicker();
        this.openSignaturePad();
    }
    // Trigger file input for signature upload
    triggerSignatureUpload() {
        var _a, _b;
        (_b = (_a = this.signatureFileInputRef) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.click();
    }
    // Handle signature file selection
    onSignatureFileSelected(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = event.target;
            if (!input.files || input.files.length === 0)
                return;
            const file = input.files[0];
            // Validate file type
            if (!file.type.startsWith('image/')) {
                console.error('Invalid file type:', file.type);
                return;
            }
            // Convert to base64
            const reader = new FileReader();
            reader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                let dataUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                if (!dataUrl)
                    return;
                // Remove white background
                this.isLoadingSignatures = true;
                try {
                    dataUrl = yield this.removeWhiteBackground(dataUrl);
                }
                catch (err) {
                    console.warn('Could not remove background:', err);
                }
                // Save to database if userId is set
                if (this.userId) {
                    try {
                        const response = yield this.http.post(this.signaturesApiUrl, {
                            aksi: 'save_signature',
                            user_id: this.userId,
                            signature_name: file.name.replace(/\.[^/.]+$/, ''),
                            signature_data: dataUrl
                        }).toPromise();
                        if (response === null || response === void 0 ? void 0 : response.success) {
                            this.savedSignatures.push({
                                id: response.id,
                                user_id: this.userId,
                                signature_name: response.signature_name,
                                signature_data: dataUrl,
                                is_default: this.savedSignatures.length === 0,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            });
                        }
                    }
                    catch (err) {
                        console.error('Error uploading signature:', err);
                    }
                }
                else {
                    // No userId, just use directly
                    this.placeSignatureOnCanvas(dataUrl);
                    this.closeSignaturePicker();
                }
                this.isLoadingSignatures = false;
                // Reset input
                input.value = '';
            });
            reader.readAsDataURL(file);
        });
    }
    // Remove white/light background from image, making it transparent
    removeWhiteBackground(dataUrl) {
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
                    }
                    else if (r > softThreshold && g > softThreshold && b > softThreshold) {
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
    enableFormFieldMode(type) {
        this.formFieldType = type;
        this.toolMode = 'formfield';
        this.showMarkOptions = true;
        this.updateCursor();
        const labels = { text: 'Text Field', checkbox: 'Checkbox', radio: 'Radio Button' };
        this.presentToast(`คลิกบนเอกสารเพื่อวาง ${labels[type]}`);
    }
    getFormFieldsForPage(page) {
        return this.pdfFormFields.filter(f => f.page === page);
    }
    removeFormField(id) {
        this.pdfFormFields = this.pdfFormFields.filter(f => f.id !== id);
        this.cdr.detectChanges();
    }
    startFormFieldDrag(e, id) {
        if (e.button === 2 || e.ctrlKey)
            return;
        const target = e.target;
        if (target.closest('button') || target.classList.contains('resize-handle'))
            return;
        e.stopPropagation();
        e.preventDefault();
        this.activeFormFieldId = id;
        const ff = this.pdfFormFields.find(f => f.id === id);
        if (!ff)
            return;
        const canvasRect = this.getDragCanvasRect(ff.page);
        const startXpx = (ff.x / 100) * canvasRect.width;
        const startYpx = (ff.y / 100) * canvasRect.height;
        const offsetX = e.clientX - canvasRect.left - startXpx;
        const offsetY = e.clientY - canvasRect.top - startYpx;
        const move = (ev) => {
            ev.preventDefault();
            const f = this.pdfFormFields.find(x => x.id === id);
            if (!f)
                return;
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
    startMarkDrag(e, markId) {
        if (e.button === 2 || e.ctrlKey)
            return;
        const target = e.target;
        if (target.closest('button') || target.classList.contains('pff-resize-handle'))
            return;
        e.stopPropagation();
        e.preventDefault();
        this.activeObjectId = markId;
        this.activeObjectType = 'image';
        this.cdr.detectChanges();
        const img = this.imageStamps.find(i => i.id === markId);
        if (!img)
            return;
        const canvasRect = this.getDragCanvasRect(img.page);
        const offsetX = e.clientX - canvasRect.left - (img.x / 100) * canvasRect.width;
        const offsetY = e.clientY - canvasRect.top - (img.y / 100) * canvasRect.height;
        const move = (ev) => {
            ev.preventDefault();
            const i = this.imageStamps.find(x => x.id === markId);
            if (!i)
                return;
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
    startFormFieldResize(e, id, dir) {
        e.stopPropagation();
        e.preventDefault();
        const ff = this.pdfFormFields.find(f => f.id === id);
        if (!ff)
            return;
        const canvasRect = this.getDragCanvasRect(ff.page);
        const startX = e.clientX;
        const startY = e.clientY;
        const origX = ff.x;
        const origY = ff.y;
        const origW = ff.width;
        const origH = ff.height;
        const move = (ev) => {
            ev.preventDefault();
            const f = this.pdfFormFields.find(x => x.id === id);
            if (!f)
                return;
            const dx = ((ev.clientX - startX) / canvasRect.width) * 100;
            const dy = ((ev.clientY - startY) / canvasRect.height) * 100;
            if (dir.includes('e'))
                f.width = Math.max(2, origW + dx);
            if (dir.includes('s'))
                f.height = Math.max(2, origH + dy);
            if (dir.includes('w')) {
                f.x = origX + dx;
                f.width = Math.max(2, origW - dx);
            }
            if (dir.includes('n')) {
                f.y = origY + dy;
                f.height = Math.max(2, origH - dy);
            }
            this.cdr.detectChanges();
        };
        const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    changeFormFieldFontSize(id, delta) {
        var _a;
        const ff = this.pdfFormFields.find(f => f.id === id);
        if (!ff)
            return;
        ff.fontSize = Math.max(6, Math.min(72, ((_a = ff.fontSize) !== null && _a !== void 0 ? _a : 12) + delta));
        this.cdr.detectChanges();
    }
    changeFormFieldSize(id, delta) {
        const ff = this.pdfFormFields.find(f => f.id === id);
        if (!ff)
            return;
        if (ff.type === 'text') {
            ff.height = Math.max(1.5, Math.min(30, ff.height + delta));
        }
        else {
            const s = Math.max(1, Math.min(30, ff.width + delta));
            ff.width = s;
            ff.height = s;
        }
        this.cdr.detectChanges();
    }
    toggleFormFieldBorder(id) {
        var _a;
        const ff = this.pdfFormFields.find(f => f.id === id);
        if (!ff)
            return;
        ff.borderVisible = !((_a = ff.borderVisible) !== null && _a !== void 0 ? _a : true);
        this.cdr.detectChanges();
    }
    /* ================= Quick Mark Stamps ================= */
    enableMarkMode(type) {
        this.markType = type;
        this.toolMode = 'mark';
        this.showMarkOptions = true;
        this.updateCursor();
        const labels = {
            check: '✓ เครื่องหมายถูก', cross: '✗ เครื่องหมายผิด', dot: '● จุด',
        };
        this.presentToast(`คลิกบนเอกสารเพื่อวาง ${labels[type]}`);
    }
    setMarkColor(color) {
        this.markColor = color;
    }
    changeMarkSize(delta) {
        this.markSize = Math.max(12, Math.min(96, this.markSize + delta));
    }
    changeMarkStampSize(id, delta) {
        const img = this.imageStamps.find(i => i.id === id);
        if (!img)
            return;
        const newSize = Math.max(1, Math.min(25, img.width + delta * 0.5));
        img.width = newSize;
        img.height = newSize;
        if (img.markType && img.markColor) {
            img.dataUrl = this.generateMarkDataUrl(img.markType, img.markColor, Math.round(newSize * 10));
        }
        this.cdr.detectChanges();
    }
    generateMarkDataUrl(type, color, sizePx) {
        const s = Math.round(sizePx);
        const canvas = document.createElement('canvas');
        canvas.width = s;
        canvas.height = s;
        const ctx = canvas.getContext('2d');
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
        }
        else if (type === 'cross') {
            ctx.beginPath();
            ctx.moveTo(s * 0.15, s * 0.15);
            ctx.lineTo(s * 0.85, s * 0.85);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(s * 0.85, s * 0.15);
            ctx.lineTo(s * 0.15, s * 0.85);
            ctx.stroke();
        }
        else {
            ctx.beginPath();
            ctx.arc(s / 2, s / 2, s * 0.38, 0, Math.PI * 2);
            ctx.fill();
        }
        return canvas.toDataURL('image/png');
    }
    /* ================= Date Stamp ================= */
    addDateStamp() {
        this.toolMode = 'date';
        this.updateCursor();
        this.presentToast('คลิกบนเอกสารเพื่อวางวันที่');
    }
    startDateDrag(ev, dateId) {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        const target = ev.target;
        if (target.closest('button'))
            return;
        ev.preventDefault();
        const ds = this.dateStamps.find(d => d.id === dateId);
        if (!ds)
            return;
        const canvasRect = this.getDragCanvasRect(ds.page);
        const startXpx = (ds.x / 100) * canvasRect.width;
        const startYpx = (ds.y / 100) * canvasRect.height;
        const offsetX = ev.clientX - canvasRect.left - startXpx;
        const offsetY = ev.clientY - canvasRect.top - startYpx;
        const move = (e) => {
            e.preventDefault();
            const d = this.dateStamps.find(x => x.id === dateId);
            if (!d)
                return;
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
    removeDateStamp(dateId) {
        this.dateStamps = this.dateStamps.filter(d => d.id !== dateId);
        this.cdr.detectChanges();
    }
    /* ================= Text Style ================= */
    toggleBold() {
        if (this.activeTextBox) {
            this.activeTextBox.bold = !this.activeTextBox.bold;
            this.cdr.detectChanges();
        }
    }
    toggleItalic() {
        if (this.activeTextBox) {
            this.activeTextBox.italic = !this.activeTextBox.italic;
            this.cdr.detectChanges();
        }
    }
    setAlign(a) {
        if (this.activeTextBox) {
            this.activeTextBox.align = a;
            this.cdr.detectChanges();
        }
    }
    setTextColor(color) {
        this.textColor = color;
        if (this.activeTextBox) {
            this.activeTextBox.color = color;
            this.cdr.detectChanges();
        }
        this.saveSettings();
    }
    /* ================= Serialize JSON ================= */
    exportDrawingJson() {
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
    renderOverlayToPngBytes(pageNo, pdfW, pdfH) {
        const strokes = this.strokes[pageNo] || [];
        const shapes = this.shapes[pageNo] || [];
        const off = document.createElement('canvas');
        off.width = Math.floor(pdfW);
        off.height = Math.floor(pdfH);
        const ctx = off.getContext('2d');
        ctx.clearRect(0, 0, off.width, off.height);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        const canvas = this.getAnnotCanvas(pageNo);
        const viewWidth = canvas ? canvas.clientWidth : 800;
        const thicknessScale = (pdfW / Math.max(1, viewWidth)) * 1.5;
        // Draw strokes
        for (const s of strokes) {
            if (!s.points.length)
                continue;
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
                if (i === 0)
                    ctx.moveTo(x, y);
                else
                    ctx.lineTo(x, y);
            }
            ctx.stroke();
            if (s.isHighlight)
                ctx.restore();
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
                    if (sh.fillColor) {
                        ctx.fillStyle = sh.fillColor;
                        ctx.fill();
                    }
                    break;
                case 'circle': {
                    const cx = (x1 + x2) / 2;
                    const cy = (y1 + y2) / 2;
                    const rx = Math.abs(x2 - x1) / 2;
                    const ry = Math.abs(y2 - y1) / 2;
                    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                    if (sh.fillColor) {
                        ctx.fillStyle = sh.fillColor;
                        ctx.fill();
                    }
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
    getPdfPlacement(vxPercent, vyPercent, vwPercent, vhPercent, pageWidth, pageHeight, pageRotation) {
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
        }
        else if (pageRotation === 270 || pageRotation === -90) {
            // PDF page is rotated 90 CCW visually (270 CW). We draw elements 90 CW (-90).
            rotDeg = -90;
            px = pageWidth - (vy + vh);
            py = pageHeight - vx;
        }
        else if (pageRotation === 180 || pageRotation === -180) {
            // PDF page is upside down. We draw elements upside down (180).
            rotDeg = 180;
            px = pageWidth - vx;
            py = pageHeight - vy;
        }
        return { x: px, y: py, width: vw, height: vh, rotate: degrees(rotDeg), vW, vH };
    }
    saveDocument() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes)
                return;
            this.isLoading = true;
            this.saveProgress = 1;
            this.loadingMessage = 'กำลังเตรียมเอกสาร...';
            this.cdr.detectChanges();
            try {
                const pdfDoc = yield PDFDocument.load(this.basePdfBytes);
                const fontkit = fontkitModule.default || fontkitModule;
                pdfDoc.registerFontkit(fontkit);
                const fontBytes = yield fetch('/assets/fonts/THSarabunNew.ttf').then(r => r.arrayBuffer());
                const thaiFont = yield pdfDoc.embedFont(fontBytes);
                const boldFontBytes = yield fetch('/assets/fonts/THSarabunNew Bold.ttf').then(r => r.arrayBuffer());
                const thaiFontBold = yield pdfDoc.embedFont(boldFontBytes);
                const pdfPages = pdfDoc.getPages();
                // Pre-build a set of pages that actually have annotations to skip empty pages
                const annotatedPageNums = new Set();
                Object.keys(this.strokes).forEach(p => { var _a; if ((((_a = this.strokes[+p]) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0)
                    annotatedPageNums.add(+p); });
                Object.keys(this.shapes).forEach(p => { var _a; if ((((_a = this.shapes[+p]) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0)
                    annotatedPageNums.add(+p); });
                this.shapeStamps.forEach(ss => annotatedPageNums.add(ss.page));
                this.textBoxes.forEach(t => annotatedPageNums.add(t.page));
                this.imageStamps.forEach(img => annotatedPageNums.add(img.page));
                this.signatureStamps.forEach(s => annotatedPageNums.add(s.page));
                this.dateStamps.forEach(d => annotatedPageNums.add(d.page));
                const batchSize = pdfPages.length > 100 ? 20 : 5;
                for (let i = 0; i < pdfPages.length; i++) {
                    const pageNum = i + 1;
                    const page = pdfPages[i];
                    // Batch UI updates for large documents instead of every page
                    if (i % batchSize === 0 || i === pdfPages.length - 1) {
                        this.saveProgress = Math.round(((i + 1) / pdfPages.length) * 60);
                        this.loadingMessage = `กำลังประมวลผลหน้า ${i + 1} / ${pdfPages.length}`;
                        this.cdr.detectChanges();
                        yield new Promise(resolve => setTimeout(resolve, 0));
                    }
                    // Skip pages with no annotations entirely
                    if (!annotatedPageNums.has(pageNum))
                        continue;
                    const { width, height } = page.getSize();
                    const canvas = this.getAnnotCanvas(pageNum);
                    const cw = canvas ? canvas.clientWidth : 800;
                    const rotationAngle = (_a = this.pdfPageRotations.get(pageNum)) !== null && _a !== void 0 ? _a : page.getRotation().angle;
                    const isRot = rotationAngle === 90 || rotationAngle === 270 || rotationAngle === -90 || rotationAngle === -270;
                    const vW = isRot ? height : width;
                    const vH = isRot ? width : height;
                    // 1) Drawings (rasterized PNG overlay)
                    const hasStrokes = (((_b = this.strokes[pageNum]) === null || _b === void 0 ? void 0 : _b.length) || 0) > 0;
                    const hasShapes = (((_c = this.shapes[pageNum]) === null || _c === void 0 ? void 0 : _c.length) || 0) > 0;
                    if (hasStrokes || hasShapes) {
                        const overlayPng = this.renderOverlayToPngBytes(pageNum, vW, vH);
                        const overlayImg = yield pdfDoc.embedPng(overlayPng);
                        const placement = this.getPdfPlacement(0, 0, 100, 100, width, height, rotationAngle);
                        page.drawImage(overlayImg, { x: placement.x, y: placement.y, width: placement.width, height: placement.height, rotate: placement.rotate });
                    }
                    const toRgb = (hex) => {
                        if (!hex || hex === 'none' || hex.includes('rgba'))
                            return undefined;
                        let cleanHex = hex.replace('#', '');
                        if (cleanHex.length === 3)
                            cleanHex = cleanHex.split('').map(c => c + c).join('');
                        if (cleanHex.length !== 6)
                            return undefined;
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
                        }
                        else if (ss.type === 'circle') {
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
                        }
                        else if (ss.type === 'line' || ss.type === 'arrow') {
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
                        if (!tb.text.trim())
                            continue;
                        const fontToUse = (tb.bold || tb.italic) ? thaiFontBold : thaiFont;
                        const colorHex = tb.color || '#0000ff';
                        const txtColor = toRgb(colorHex) || rgb(0, 0, 1);
                        const lines = tb.text.split('\n');
                        const lineHeight = tb.fontSize * 1.4;
                        // Compensate for textarea CSS padding (2px top, 4px left) so PDF matches screen
                        const canvas = this.getAnnotCanvas(pageNum);
                        const canvasCW = canvas ? canvas.clientWidth : 800;
                        const canvasCH = canvas ? canvas.clientHeight : 1000;
                        const padLeftPct = (4 / canvasCW) * 100; // 4px left padding → %
                        const padTopPct = (2 / canvasCH) * 100; // 2px top padding  → %
                        const maxW = (tb.width / 100) * vW;
                        // shift X by padLeft, shift Y down by padTop
                        const textStartXPct = tb.x + padLeftPct;
                        let currentVisualY = ((tb.y + padTopPct) / 100) * vH;
                        for (const para of lines) {
                            if (!para) {
                                currentVisualY += lineHeight;
                                continue;
                            }
                            let paraWords = [];
                            if (typeof Intl !== 'undefined' && Intl.Segmenter) {
                                const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                                paraWords = Array.from(segmenter.segment(para)).map((s) => s.segment);
                            }
                            else {
                                const parts = para.split(' ');
                                for (let i = 0; i < parts.length; i++) {
                                    paraWords.push(parts[i]);
                                    if (i < parts.length - 1)
                                        paraWords.push(' ');
                                }
                            }
                            let line = '';
                            for (const word of paraWords) {
                                const testLine = line + word;
                                const textWidth = fontToUse.widthOfTextAtSize(testLine, tb.fontSize);
                                if (textWidth > maxW && line) {
                                    let alignXVisual = (textStartXPct / 100) * vW;
                                    const finalLineWidth = fontToUse.widthOfTextAtSize(line, tb.fontSize);
                                    if (tb.align === 'center')
                                        alignXVisual += (maxW / 2) - (finalLineWidth / 2);
                                    if (tb.align === 'right')
                                        alignXVisual += maxW - finalLineWidth;
                                    const baselineVisualY = currentVisualY + (tb.fontSize * 0.95);
                                    const pt = this.getPdfPlacement((alignXVisual / vW) * 100, (baselineVisualY / vH) * 100, 0, 0, width, height, rotationAngle);
                                    page.drawText(line, {
                                        x: pt.x,
                                        y: pt.y,
                                        size: tb.fontSize,
                                        font: fontToUse,
                                        color: txtColor,
                                        rotate: pt.rotate
                                    });
                                    line = word.replace(/^\s+/, '');
                                    currentVisualY += lineHeight;
                                }
                                else {
                                    line = testLine;
                                }
                            }
                            if (line) {
                                let alignXVisual = (textStartXPct / 100) * vW;
                                const finalLineWidth = fontToUse.widthOfTextAtSize(line, tb.fontSize);
                                if (tb.align === 'center')
                                    alignXVisual += (maxW / 2) - (finalLineWidth / 2);
                                if (tb.align === 'right')
                                    alignXVisual += maxW - finalLineWidth;
                                const baselineVisualY = currentVisualY + (tb.fontSize * 0.95);
                                const pt = this.getPdfPlacement((alignXVisual / vW) * 100, (baselineVisualY / vH) * 100, 0, 0, width, height, rotationAngle);
                                page.drawText(line, {
                                    x: pt.x,
                                    y: pt.y,
                                    size: tb.fontSize,
                                    font: fontToUse,
                                    color: txtColor,
                                    rotate: pt.rotate
                                });
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
                                : yield this.normalizeImageToPng(img.dataUrl);
                            const bytes = Uint8Array.from(atob(pngUrl.split(',')[1]), c => c.charCodeAt(0));
                            const embedded = yield pdfDoc.embedPng(bytes);
                            const placement = this.getPdfPlacement(img.x, img.y, img.width, img.height, width, height, rotationAngle);
                            page.drawImage(embedded, { x: placement.x, y: placement.y, width: placement.width, height: placement.height, rotate: placement.rotate });
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                    // 4) Signatures
                    const sigForPage = this.signatureStamps.filter(s => s.page === pageNum);
                    for (const sig of sigForPage) {
                        try {
                            const bytes = Uint8Array.from(atob(sig.dataUrl.split(',')[1]), c => c.charCodeAt(0));
                            const embedded = yield pdfDoc.embedPng(bytes);
                            const placement = this.getPdfPlacement(sig.x, sig.y, sig.width, sig.height, width, height, rotationAngle);
                            page.drawImage(embedded, { x: placement.x, y: placement.y, width: placement.width, height: placement.height, rotate: placement.rotate });
                            // Draw Digital ID text to the right of signature (vertically centered)
                            if (this.showDigitalId && (sig.digitalId || sig.signDate)) {
                                const idFontSize = 8;
                                const idLines = [];
                                if (sig.signDate)
                                    idLines.push(sig.signDate);
                                if (sig.signTime)
                                    idLines.push(sig.signTime);
                                if (sig.digitalId)
                                    idLines.push(sig.digitalId);
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
                        }
                        catch (e) {
                            console.error(e);
                        }
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
                        if (pgIdx < 0 || pgIdx >= pdfPages.length)
                            continue;
                        const pdfPage = pdfPages[pgIdx];
                        const { width: pgW, height: pgH } = pdfPage.getSize();
                        const rotAngle = (_d = this.pdfPageRotations.get(ff.page)) !== null && _d !== void 0 ? _d : pdfPage.getRotation().angle;
                        const isRotated = rotAngle === 90 || rotAngle === 270 || rotAngle === -90 || rotAngle === -270;
                        const vW = isRotated ? pgH : pgW;
                        const vH = isRotated ? pgW : pgH;
                        const fx = (ff.x / 100) * vW;
                        const fw = (ff.width / 100) * vW;
                        const fh = (ff.height / 100) * vH;
                        const fy = pgH - (ff.y / 100) * vH - fh;
                        const borderW = ((_e = ff.borderVisible) !== null && _e !== void 0 ? _e : true) ? 1 : 0;
                        const opts = {
                            x: fx, y: fy, width: fw, height: fh,
                            borderWidth: borderW,
                            borderColor: borderW ? rgb(0, 0, 0) : undefined,
                            backgroundColor: rgb(1, 1, 1),
                        };
                        try {
                            if (ff.type === 'text') {
                                const tf = form.createTextField(ff.fieldName);
                                tf.addToPage(pdfPage, opts);
                                if (ff.fontSize)
                                    tf.setFontSize(ff.fontSize);
                            }
                            else if (ff.type === 'checkbox') {
                                const cb = form.createCheckBox(ff.fieldName);
                                cb.addToPage(pdfPage, opts);
                            }
                            else if (ff.type === 'radio') {
                                let rg;
                                try {
                                    rg = form.getRadioGroup(ff.radioGroupName);
                                }
                                catch (_f) {
                                    rg = form.createRadioGroup(ff.radioGroupName);
                                }
                                rg.addOptionToPage(ff.id, pdfPage, opts);
                            }
                        }
                        catch (formErr) {
                            console.warn('Form field error:', formErr);
                        }
                    }
                }
                this.saveProgress = 61;
                this.loadingMessage = 'กำลัง Serialize PDF...';
                this.cdr.detectChanges();
                yield new Promise(resolve => setTimeout(resolve, 80));
                this.revNo += 1;
                const pdfBytes = yield pdfDoc.save({ objectsPerTick: 20 });
                this.lastSavedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
                // Use original filename if provided, otherwise default to "annotated_rev..."
                if (this.fileName) {
                    this.lastSavedFileName = this.fileName;
                }
                else {
                    this.lastSavedFileName = `annotated_rev${this.revNo}_${Date.now()}.pdf`;
                }
                // Create preview using pdf.js to render pages as images
                yield this.generatePreviewPages();
                this.showPreviewOverlay = true;
            }
            catch (e) {
                console.error(e);
                this.presentToast('เกิดข้อผิดพลาดในการบันทึกเอกสาร');
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
                this.saveProgress = 0;
            }
        });
    }
    generatePreviewPages() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.lastSavedBlob)
                return;
            this.previewPages = [];
            const arrayBuffer = yield this.lastSavedBlob.arrayBuffer();
            const pdfDoc = yield pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const total = pdfDoc.numPages;
            this.previewTotalPages = total;
            // For large documents render only annotated pages, not all pages
            let pagesToRender;
            if (total > 10) {
                const annotated = new Set();
                Object.keys(this.strokes).forEach(p => { var _a; if ((((_a = this.strokes[+p]) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0)
                    annotated.add(+p); });
                Object.keys(this.shapes).forEach(p => { var _a; if ((((_a = this.shapes[+p]) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0)
                    annotated.add(+p); });
                this.shapeStamps.forEach(ss => annotated.add(ss.page));
                this.textBoxes.forEach(t => annotated.add(t.page));
                this.imageStamps.forEach(img => annotated.add(img.page));
                this.signatureStamps.forEach(s => annotated.add(s.page));
                this.dateStamps.forEach(d => annotated.add(d.page));
                pagesToRender = annotated.size > 0 ? Array.from(annotated).sort((a, b) => a - b) : [1];
                this.previewIsFiltered = pagesToRender.length < total;
            }
            else {
                pagesToRender = Array.from({ length: total }, (_, i) => i + 1);
                this.previewIsFiltered = false;
            }
            for (let idx = 0; idx < pagesToRender.length; idx++) {
                const pageNum = pagesToRender[idx];
                const page = yield pdfDoc.getPage(pageNum);
                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                yield page.render({ canvasContext: ctx, viewport }).promise;
                this.previewPages.push(canvas.toDataURL('image/png'));
                // Progress phase 2: generating preview (62–100%)
                this.saveProgress = 62 + Math.round(((idx + 1) / pagesToRender.length) * 38);
                this.loadingMessage = `กำลังสร้าง Preview หน้า ${pageNum} / ${total}`;
                this.cdr.detectChanges();
            }
        });
    }
    loadAllPreviewPages() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.lastSavedBlob || this.isLoadingAllPreview)
                return;
            this.isLoadingAllPreview = true;
            this.previewPages = [];
            this.cdr.detectChanges();
            const arrayBuffer = yield this.lastSavedBlob.arrayBuffer();
            const pdfDoc = yield pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const total = pdfDoc.numPages;
            for (let i = 1; i <= total; i++) {
                const page = yield pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                yield page.render({ canvasContext: ctx, viewport }).promise;
                this.previewPages.push(canvas.toDataURL('image/png'));
                this.cdr.detectChanges();
            }
            this.previewIsFiltered = false;
            this.isLoadingAllPreview = false;
            this.cdr.detectChanges();
        });
    }
    confirmSave() {
        if (!this.lastSavedBlob)
            return;
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
        this.modalCtrl.dismiss({
            success: true,
            saved: true,
            blob: this.lastSavedBlob,
            fileName: this.lastSavedFileName,
            revNo: this.revNo
        });
    }
    backToEdit() {
        this.showPreviewOverlay = false;
        this.previewUrl = null;
        this.previewPages = [];
    }
}
PdfAnnotatorModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-pdf-annotator-modal',
                template: "<ion-header [style.display]=\"showPreviewOverlay ? 'none' : ''\">\n  <ion-toolbar>\n    <!-- <ion-title>PDF Annotator</ion-title> -->\n    <ion-buttons slot=\"end\">\n      <ion-button fill=\"clear\" (click)=\"close()\">\n        <ion-icon name=\"close\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content class=\"annotator-content\" [scrollY]=\"false\">\n\n  <!-- Loading Spinner Overlay -->\n  <div class=\"loading-overlay\" *ngIf=\"isLoading\">\n    <div class=\"loading-content\" [class.loading-content--progress]=\"saveProgress > 0\">\n\n      <!-- Normal spinner when no save progress -->\n      <ng-container *ngIf=\"saveProgress === 0\">\n        <ion-spinner name=\"crescent\"></ion-spinner>\n        <p class=\"loading-msg\">{{ loadingMessage }}</p>\n      </ng-container>\n\n      <!-- Progress bar UI during save -->\n      <ng-container *ngIf=\"saveProgress > 0\">\n        <div class=\"save-progress-icon\">\n          <ion-icon name=\"document-text-outline\"></ion-icon>\n          <span class=\"save-progress-pct\">{{ saveProgress }}%</span>\n        </div>\n        <div class=\"save-progress-bar-track\">\n          <div class=\"save-progress-bar-fill\" [style.width.%]=\"saveProgress\"\n            [class.save-progress-bar-fill--preview]=\"saveProgress > 61\"\n            [class.save-progress-bar-fill--serializing]=\"saveProgress === 61\"></div>\n        </div>\n        <div class=\"save-progress-phases\">\n          <span [class.active]=\"saveProgress > 0 && saveProgress < 61\">\n            <ion-icon name=\"layers-outline\"></ion-icon> \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01 Annotations\n          </span>\n          <span [class.active]=\"saveProgress === 61\">\n            <ion-icon name=\"archive-outline\"></ion-icon> Serialize PDF\n          </span>\n          <span [class.active]=\"saveProgress > 61\">\n            <ion-icon name=\"image-outline\"></ion-icon> \u0E2A\u0E23\u0E49\u0E32\u0E07 Preview\n          </span>\n        </div>\n        <p class=\"loading-msg\">{{ loadingMessage }}</p>\n      </ng-container>\n\n    </div>\n  </div>\n\n  <!-- New Layout: Top Toolbars + Left Thumbnails + Center Viewer -->\n  <div class=\"annotator-layout-v2\">\n\n    <!-- Top Toolbar Row 1: Zoom & Navigation -->\n    <div class=\"toolbar-row toolbar-row--nav\">\n      <div class=\"toolbar-group\">\n        <button class=\"toolbar-btn\" (click)=\"toggleThumbnails()\" title=\"\u0E41\u0E2A\u0E14\u0E07/\u0E0B\u0E48\u0E2D\u0E19 Thumbnails\">\n          <ion-icon name=\"images-outline\"></ion-icon>\n        </button>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <div class=\"toolbar-group toolbar-group--zoom\">\n        <button class=\"toolbar-btn\" (click)=\"zoomOut()\" [disabled]=\"zoom <= 0.5\">\n          <ion-icon name=\"search-outline\"></ion-icon>\n          <ion-icon name=\"remove-outline\" class=\"zoom-icon\"></ion-icon>\n        </button>\n        <span class=\"toolbar-label\">{{ (zoom * 100) | number:'1.0-0' }}%</span>\n        <button class=\"toolbar-btn\" (click)=\"zoomIn()\" [disabled]=\"zoom >= 3\">\n          <ion-icon name=\"search-outline\"></ion-icon>\n          <ion-icon name=\"add-outline\" class=\"zoom-icon\"></ion-icon>\n        </button>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <div class=\"toolbar-group toolbar-group--pager\">\n        <button class=\"toolbar-btn\" (click)=\"firstPage()\" [disabled]=\"pageNo <= 1\" title=\"\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E23\u0E01\">\n          <ion-icon name=\"play-skip-back\"></ion-icon>\n        </button>\n        <button class=\"toolbar-btn\" (click)=\"prevPage()\" [disabled]=\"pageNo <= 1\" title=\"\u0E2B\u0E19\u0E49\u0E32\u0E01\u0E48\u0E2D\u0E19\">\n          <ion-icon name=\"chevron-back\"></ion-icon>\n        </button>\n        <span class=\"toolbar-label\">\n          {{ pageNo }} / {{ pageCount || '?' }}\n          <span *ngIf=\"loadedUntilPage < pageCount\" class=\"chunk-indicator\"\n            [title]=\"'\u0E42\u0E2B\u0E25\u0E14\u0E41\u0E25\u0E49\u0E27 ' + loadedUntilPage + ' / ' + pageCount + ' \u0E2B\u0E19\u0E49\u0E32'\">\n            <ion-spinner *ngIf=\"isLoadingChunk\" name=\"crescent\" style=\"width:10px;height:10px;\"></ion-spinner>\n            <span *ngIf=\"!isLoadingChunk\">({{ loadedUntilPage }}\u2193)</span>\n          </span>\n        </span>\n        <button class=\"toolbar-btn\" (click)=\"nextPage()\" [disabled]=\"pageNo >= pageCount || isLoadingChunk\" title=\"\u0E2B\u0E19\u0E49\u0E32\u0E16\u0E31\u0E14\u0E44\u0E1B\">\n          <ion-icon name=\"chevron-forward\"></ion-icon>\n        </button>\n        <button class=\"toolbar-btn\" (click)=\"lastPage()\" [disabled]=\"pageNo >= pageCount || isLoadingChunk\" title=\"\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E38\u0E14\u0E17\u0E49\u0E32\u0E22 (\u0E42\u0E2B\u0E25\u0E14\u0E41\u0E25\u0E49\u0E27 {{ loadedUntilPage }} \u0E2B\u0E19\u0E49\u0E32)\">\n          <ion-icon name=\"play-skip-forward\"></ion-icon>\n        </button>\n      </div>\n\n      <div class=\"toolbar-spacer\"></div>\n\n      <!-- Insert Blank Page + Delete Page -->\n      <div class=\"tool-item insert-page-tool\">\n        <button class=\"toolbar-btn\" (click)=\"showInsertMenu = !showInsertMenu\" title=\"\u0E41\u0E17\u0E23\u0E01/\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\">\n          <ion-icon name=\"documents-outline\"></ion-icon>\n          <ion-icon name=\"chevron-down-outline\" class=\"shape-chevron\"></ion-icon>\n        </button>\n\n        <!-- Dropdown -->\n        <div class=\"insert-page-dropdown\" *ngIf=\"showInsertMenu\">\n          <div class=\"insert-page-backdrop\" (click)=\"showInsertMenu = false\"></div>\n          <div class=\"insert-page-menu\">\n\n            <!-- Section: \u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32 -->\n            <div class=\"insert-page-title\">\n              <ion-icon name=\"add-circle-outline\"></ion-icon> \u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32\n            </div>\n\n            <!-- Orientation Toggle -->\n            <div class=\"insert-orient-row\">\n              <span class=\"insert-orient-label\">\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A:</span>\n              <div class=\"insert-orient-group\">\n                <button class=\"insert-orient-btn\"\n                  [class.active]=\"insertOrientation === 'portrait'\"\n                  (click)=\"insertOrientation = 'portrait'\" title=\"\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07\">\n                  <ion-icon name=\"phone-portrait-outline\"></ion-icon>\n                  <span>\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07</span>\n                </button>\n                <button class=\"insert-orient-btn\"\n                  [class.active]=\"insertOrientation === 'landscape'\"\n                  (click)=\"insertOrientation = 'landscape'\" title=\"\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19\">\n                  <ion-icon name=\"phone-landscape-outline\"></ion-icon>\n                  <span>\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19</span>\n                </button>\n              </div>\n            </div>\n\n            <!-- Before / After -->\n            <button class=\"insert-page-btn\" (click)=\"insertBlankPage('before')\">\n              <ion-icon name=\"arrow-up-outline\"></ion-icon>\n              <span>\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49 <small>(\u0E2B\u0E19\u0E49\u0E32 {{ pageNo }})</small></span>\n            </button>\n            <button class=\"insert-page-btn\" (click)=\"insertBlankPage('after')\">\n              <ion-icon name=\"arrow-down-outline\"></ion-icon>\n              <span>\u0E2B\u0E25\u0E31\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49 <small>(\u0E2B\u0E19\u0E49\u0E32 {{ pageNo + 1 }})</small></span>\n            </button>\n\n            <div class=\"insert-menu-divider\"></div>\n\n            <!-- Section: \u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32 -->\n            <div class=\"insert-page-title insert-page-title--danger\">\n              <ion-icon name=\"trash-outline\"></ion-icon> \u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\n            </div>\n            <button class=\"insert-page-btn insert-page-btn--danger\"\n              [disabled]=\"pageCount <= 1\"\n              (click)=\"deletePage()\">\n              <ion-icon name=\"close-circle-outline\"></ion-icon>\n              <span>\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49 <small>(\u0E2B\u0E19\u0E49\u0E32 {{ pageNo }})</small></span>\n            </button>\n\n            <div class=\"insert-menu-divider\"></div>\n\n            <!-- Section: \u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A -->\n            <button class=\"insert-page-btn insert-page-btn--undo\"\n              [disabled]=\"!canUndoPageOp\"\n              (click)=\"undoPageOp()\">\n              <ion-icon name=\"arrow-undo-outline\"></ion-icon>\n              <span>\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E41\u0E17\u0E23\u0E01/\u0E25\u0E1A <small *ngIf=\"!canUndoPageOp\">(\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34)</small></span>\n            </button>\n\n          </div>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <div class=\"toolbar-group toolbar-group--save\">\n        <button class=\"toolbar-btn toolbar-btn--save\" (click)=\"saveDocument()\">\n          <ion-icon name=\"save-outline\"></ion-icon>\n          <span>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01</span>\n        </button>\n        <!-- User Guide Toggle -->\n        <button class=\"toolbar-btn toolbar-btn--guide\" [class.active]=\"showUserGuidePanel\" (click)=\"toggleUserGuide($event)\" title=\"\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\">\n          <ion-icon name=\"book\"></ion-icon>\n          <span style=\"font-weight: 500; font-size: 13px;\">\u0E41\u0E19\u0E30\u0E19\u0E33\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</span>\n        </button>\n        <!-- History Panel Toggle -->\n        <button class=\"toolbar-btn\" [class.active]=\"showHistoryPanel\" (click)=\"toggleHistoryPanel()\" title=\"\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02\">\n          <ion-icon name=\"time-outline\"></ion-icon>\n        </button>\n      </div>\n    </div>\n\n    <!-- Top Toolbar Row 2: Tools -->\n    <div class=\"toolbar-row toolbar-row--tools\">\n      <!-- Text Tool -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"textPlaceMode\" (click)=\"enableTextPlaceMode()\" title=\"\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\">\n          <ion-icon name=\"text\"></ion-icon>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"textPlaceMode\">\n          <button (click)=\"changeTextFontSize(-2)\" [disabled]=\"textFontSize <= 8\"><ion-icon\n              name=\"remove\"></ion-icon></button>\n          <span>{{ textFontSize }}</span>\n          <button (click)=\"changeTextFontSize(2)\" [disabled]=\"textFontSize >= 100\"><ion-icon\n              name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setTextColor('#000000')\"\n              [class.active]=\"textColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setTextColor('#0000FF')\"\n              [class.active]=\"textColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setTextColor('#FF0000')\"\n              [class.active]=\"textColor === '#FF0000'\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"textColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"textColor\" (input)=\"setTextColor($any($event.target).value)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Quick Mark Stamps + Form Fields -->\n      <div class=\"tool-item mark-tool-item\">\n        <button class=\"toolbar-btn mark-toolbar-btn\" [class.active]=\"showMarkOptions || toolMode === 'mark'\"\n          (click)=\"showMarkOptions = !showMarkOptions\" title=\"\u0E41\u0E1A\u0E1A\u0E1F\u0E2D\u0E23\u0E4C\u0E21\">\n          <!-- Fixed form icon: shows checkbox + radio + text rows -->\n          <svg width=\"22\" height=\"22\" viewBox=\"0 0 22 22\" fill=\"none\">\n            <rect x=\"1\" y=\"2\" width=\"7\" height=\"6\" rx=\"1.2\" stroke=\"currentColor\" stroke-width=\"1.6\"/>\n            <polyline points=\"2.5,5 4.2,7 7.5,3\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n            <line x1=\"10\" y1=\"5\" x2=\"21\" y2=\"5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n            <circle cx=\"4.5\" cy=\"14\" r=\"3.2\" stroke=\"currentColor\" stroke-width=\"1.6\"/>\n            <circle cx=\"4.5\" cy=\"14\" r=\"1.5\" fill=\"currentColor\"/>\n            <line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"14\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n            <line x1=\"10\" y1=\"20\" x2=\"21\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n            <line x1=\"1\" y1=\"20\" x2=\"7.5\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n            <line x1=\"1\" y1=\"17.5\" x2=\"5\" y2=\"17.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n          </svg>\n          <span class=\"mark-btn-label\">\u0E41\u0E1A\u0E1A\u0E1F\u0E2D\u0E23\u0E4C\u0E21</span>\n          <ion-icon name=\"chevron-down-outline\" class=\"mark-chevron\"></ion-icon>\n        </button>\n\n        <div class=\"mark-popup\" *ngIf=\"showMarkOptions\">\n          <!-- Quick Marks section -->\n          <div class=\"mark-popup-section-label\">\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E2B\u0E21\u0E32\u0E22\u0E14\u0E48\u0E27\u0E19</div>\n          <div class=\"mark-quick-row\">\n            <button class=\"mark-quick-btn\" [class.active]=\"toolMode === 'mark' && markType === 'check'\"\n              (click)=\"enableMarkMode('check')\" title=\"\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E2B\u0E21\u0E32\u0E22\u0E16\u0E39\u0E01\">\n              <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\"><polyline points=\"4,14 11,21 24,7\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>\n            </button>\n            <button class=\"mark-quick-btn\" [class.active]=\"toolMode === 'mark' && markType === 'cross'\"\n              (click)=\"enableMarkMode('cross')\" title=\"\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E2B\u0E21\u0E32\u0E22\u0E1C\u0E34\u0E14\">\n              <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\"><line x1=\"5\" y1=\"5\" x2=\"23\" y2=\"23\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"23\" y1=\"5\" x2=\"5\" y2=\"23\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/></svg>\n            </button>\n            <button class=\"mark-quick-btn\" [class.active]=\"toolMode === 'mark' && markType === 'dot'\"\n              (click)=\"enableMarkMode('dot')\" title=\"\u0E08\u0E38\u0E14\">\n              <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\"><circle cx=\"14\" cy=\"14\" r=\"9\" fill=\"currentColor\"/></svg>\n            </button>\n          </div>\n\n          <!-- Form Fields section -->\n          <div class=\"mark-popup-divider\"></div>\n          <div class=\"mark-popup-section-label\">\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E1F\u0E34\u0E25\u0E14\u0E4C\u0E41\u0E1A\u0E1A\u0E1F\u0E2D\u0E23\u0E4C\u0E21\u0E43\u0E2B\u0E21\u0E48</div>\n          <div class=\"mark-form-list\">\n            <button class=\"mark-form-row-btn\" [class.active]=\"toolMode === 'formfield' && formFieldType === 'text'\"\n              (click)=\"enableFormFieldMode('text')\" title=\"Text Field\">\n              <span class=\"mark-form-row-icon mark-form-row-icon--text\">Aa</span>\n              <span>Text Field</span>\n            </button>\n            <button class=\"mark-form-row-btn\" [class.active]=\"toolMode === 'formfield' && formFieldType === 'checkbox'\"\n              (click)=\"enableFormFieldMode('checkbox')\" title=\"Checkbox\">\n              <span class=\"mark-form-row-icon\">\n                <svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\"><rect x=\"1\" y=\"1\" width=\"16\" height=\"16\" rx=\"2.5\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/><polyline points=\"4,9 7,13 14,5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>\n              </span>\n              <span>Checkbox</span>\n            </button>\n            <button class=\"mark-form-row-btn\" [class.active]=\"toolMode === 'formfield' && formFieldType === 'radio'\"\n              (click)=\"enableFormFieldMode('radio')\" title=\"Radio Button\">\n              <span class=\"mark-form-row-icon\">\n                <svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\"><circle cx=\"9\" cy=\"9\" r=\"8\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"9\" cy=\"9\" r=\"4\" fill=\"currentColor\"/></svg>\n              </span>\n              <span>Radio Button</span>\n            </button>\n          </div>\n\n          <!-- Size + Color controls (compact, below fold) -->\n          <div class=\"mark-popup-divider\"></div>\n          <div class=\"mark-controls-row\">\n            <button (click)=\"changeMarkSize(-4)\" [disabled]=\"markSize <= 12\"><ion-icon name=\"remove\"></ion-icon></button>\n            <span class=\"mark-size-val\">{{ markSize }}</span>\n            <button (click)=\"changeMarkSize(4)\" [disabled]=\"markSize >= 96\"><ion-icon name=\"add\"></ion-icon></button>\n            <div class=\"color-dots\" style=\"margin-left: 6px;\">\n              <div class=\"color-dot\" style=\"background:#000\" (click)=\"setMarkColor('#000000')\" [class.active]=\"markColor === '#000000'\"></div>\n              <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setMarkColor('#0000FF')\" [class.active]=\"markColor === '#0000FF'\"></div>\n              <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setMarkColor('#FF0000')\" [class.active]=\"markColor === '#FF0000'\"></div>\n              <div class=\"color-dot\" style=\"background:#009900\" (click)=\"setMarkColor('#009900')\" [class.active]=\"markColor === '#009900'\"></div>\n              <div class=\"color-dot color-dot--custom\" [style.background]=\"markColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n                <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n                <input type=\"color\" [value]=\"markColor\" (input)=\"setMarkColor($any($event.target).value)\">\n              </div>\n            </div>\n          </div>\n\n          <!-- Cancel / close popup -->\n          <div class=\"mark-popup-divider\"></div>\n          <button class=\"mark-cancel-btn\" (click)=\"showMarkOptions = false; toolMode = 'none'; updateCursor()\">\n            <ion-icon name=\"close-outline\"></ion-icon>\n            \u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\n          </button>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Shapes \u2014 Dropdown -->\n      <div class=\"tool-item shape-tool-item\">\n        <!-- Main shape button: shows current shape icon, click to activate/toggle dropdown -->\n        <button class=\"toolbar-btn\" [class.active]=\"shapeMode\"\n          (click)=\"toolMode='shape'; showShapeDropdown=!showShapeDropdown\" title=\"\u0E23\u0E39\u0E1B\u0E17\u0E23\u0E07\">\n          <ion-icon [name]=\"shapeType === 'rect' ? 'square-outline'\n                          : shapeType === 'circle' ? 'ellipse-outline'\n                          : shapeType === 'line' ? 'remove-outline'\n                          : 'arrow-forward-outline'\"></ion-icon>\n          <ion-icon name=\"chevron-down-outline\" class=\"shape-chevron\"></ion-icon>\n        </button>\n\n        <!-- Dropdown: choose shape type -->\n        <div class=\"shape-dropdown\" *ngIf=\"showShapeDropdown\">\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'rect'\" (click)=\"selectShape('rect')\"\n            title=\"\u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21\">\n            <ion-icon name=\"square-outline\"></ion-icon>\n          </button>\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'circle'\" (click)=\"selectShape('circle')\"\n            title=\"\u0E27\u0E07\u0E01\u0E25\u0E21\">\n            <ion-icon name=\"ellipse-outline\"></ion-icon>\n          </button>\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'line'\" (click)=\"selectShape('line')\" title=\"\u0E40\u0E2A\u0E49\u0E19\">\n            <ion-icon name=\"remove-outline\"></ion-icon>\n          </button>\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'arrow'\" (click)=\"selectShape('arrow')\"\n            title=\"\u0E25\u0E39\u0E01\u0E28\u0E23\">\n            <ion-icon name=\"arrow-forward-outline\"></ion-icon>\n          </button>\n        </div>\n\n        <!-- Options panel: stroke width, stroke color, fill color -->\n        <div class=\"shape-options-panel\" *ngIf=\"shapeMode\">\n\n          <!-- Stroke width -->\n          <div class=\"shape-opt-group\">\n            <span class=\"shape-opt-label\">\u0E02\u0E19\u0E32\u0E14</span>\n            <button class=\"sopt-btn\" (click)=\"changeShapeStrokeSize(-1)\" [disabled]=\"shapeStrokeSize <= 1\">\n              <ion-icon name=\"remove\"></ion-icon>\n            </button>\n            <span class=\"sopt-val\">{{ shapeStrokeSize }}</span>\n            <button class=\"sopt-btn\" (click)=\"changeShapeStrokeSize(1)\" [disabled]=\"shapeStrokeSize >= 20\">\n              <ion-icon name=\"add\"></ion-icon>\n            </button>\n          </div>\n\n          <div class=\"sopt-divider\"></div>\n\n          <!-- Stroke color (disabled when no-stroke is on) -->\n          <div class=\"shape-opt-group\">\n            <span class=\"shape-opt-label\">\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A</span>\n            <!-- No stroke toggle -->\n            <button class=\"sopt-fill-toggle\" [class.active]=\"shapeNoStroke\" (click)=\"toggleShapeNoStroke()\"\n              title=\"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A\">\n              <ion-icon name=\"ban-outline\"></ion-icon>\n            </button>\n            <div class=\"mac-color-grid\" [class.disabled]=\"shapeNoStroke\">\n              <div class=\"mac-swatch\" *ngFor=\"let c of shapeColorSwatches\" [style.background]=\"c\"\n                [class.active]=\"shapeStrokeColor === c && !shapeNoStroke\"\n                (click)=\"!shapeNoStroke && setShapeStrokeColor(c)\" [title]=\"c\"></div>\n            </div>\n            <div class=\"mac-custom-color\" [class.disabled]=\"shapeNoStroke\">\n              <div class=\"mac-swatch mac-swatch--current\" [style.background]=\"shapeStrokeColor\"></div>\n              <input type=\"color\" [value]=\"shapeStrokeColor\" (input)=\"setShapeStrokeColor($any($event.target).value)\"\n                [disabled]=\"shapeNoStroke\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\" />\n            </div>\n          </div>\n\n          <div class=\"sopt-divider\"></div>\n\n          <!-- Fill color -->\n          <div class=\"shape-opt-group\">\n            <span class=\"shape-opt-label\">\u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19</span>\n            <button class=\"sopt-fill-toggle\" [class.active]=\"shapeFillEnabled\" (click)=\"toggleShapeFill()\"\n              title=\"\u0E40\u0E1B\u0E34\u0E14/\u0E1B\u0E34\u0E14\u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19\">\n              <ion-icon [name]=\"shapeFillEnabled ? 'color-fill' : 'color-fill-outline'\"></ion-icon>\n            </button>\n            <div class=\"mac-color-grid\" [class.disabled]=\"!shapeFillEnabled\">\n              <div class=\"mac-swatch\" *ngFor=\"let c of shapeFillSwatches\" [style.background]=\"c\"\n                [class.active]=\"shapeFillColor === c && shapeFillEnabled\"\n                (click)=\"shapeFillEnabled && setShapeFillColor(c)\" [title]=\"c\"></div>\n            </div>\n            <div class=\"mac-custom-color\" [class.disabled]=\"!shapeFillEnabled\">\n              <div class=\"mac-swatch mac-swatch--current\" [style.background]=\"shapeFillColor\"></div>\n              <input type=\"color\" [value]=\"shapeFillColor\" (input)=\"setShapeFillColor($any($event.target).value)\"\n                [disabled]=\"!shapeFillEnabled\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19\u0E40\u0E2D\u0E07\" />\n            </div>\n          </div>\n\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Draw Tool -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"drawMode\" (click)=\"toggleDraw()\" title=\"\u0E27\u0E32\u0E14\">\n          <ion-icon name=\"brush\"></ion-icon>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"drawMode\">\n          <button (click)=\"changeBrushSize(-1)\" [disabled]=\"brushSize <= 1\"><ion-icon name=\"remove\"></ion-icon></button>\n          <span>{{ brushSize }}</span>\n          <button (click)=\"changeBrushSize(1)\" [disabled]=\"brushSize >= 50\"><ion-icon name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setBrushColor('#000000')\"\n              [class.active]=\"brushColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setBrushColor('#0000FF')\"\n              [class.active]=\"brushColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setBrushColor('#FF0000')\"\n              [class.active]=\"brushColor === '#FF0000'\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"brushColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"brushColor\" (input)=\"setBrushColor($any($event.target).value)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Highlight Tool -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"highlightMode\" (click)=\"toggleHighlight()\" title=\"\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C\">\n          <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n            <!-- Marker Body -->\n            <path d=\"M18 2l4 4L9 19H5v-4L18 2z\"></path>\n            <path d=\"M14 6l4 4\"></path>\n            <!-- Highlight Line -->\n            <line x1=\"3\" y1=\"22\" x2=\"21\" y2=\"22\" stroke-width=\"3\"></line>\n          </svg>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"highlightMode\">\n          <button (click)=\"changeHighlightSize(-5)\" [disabled]=\"highlightSize <= 5\"><ion-icon\n              name=\"remove\"></ion-icon></button>\n          <span>{{ highlightSize }}</span>\n          <button (click)=\"changeHighlightSize(5)\" [disabled]=\"highlightSize >= 100\"><ion-icon\n              name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#ffff00\" (click)=\"setHighlightColor('#ffff00')\"\n              [class.active]=\"highlightColor === '#ffff00'\" title=\"\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E07\"></div>\n            <div class=\"color-dot\" style=\"background:#00ff00\" (click)=\"setHighlightColor('#00ff00')\"\n              [class.active]=\"highlightColor === '#00ff00'\" title=\"\u0E40\u0E02\u0E35\u0E22\u0E27\"></div>\n            <div class=\"color-dot\" style=\"background:#00ffff\" (click)=\"setHighlightColor('#00ffff')\"\n              [class.active]=\"highlightColor === '#00ffff'\" title=\"\u0E1F\u0E49\u0E32\"></div>\n            <div class=\"color-dot\" style=\"background:#ff99c2\" (click)=\"setHighlightColor('#ff99c2')\"\n              [class.active]=\"highlightColor === '#ff99c2'\" title=\"\u0E0A\u0E21\u0E1E\u0E39\"></div>\n            <div class=\"color-dot\" style=\"background:#ffb366\" (click)=\"setHighlightColor('#ffb366')\"\n              [class.active]=\"highlightColor === '#ffb366'\" title=\"\u0E2A\u0E49\u0E21\"></div>\n            <div class=\"color-dot\" style=\"background:#d9b3ff\" (click)=\"setHighlightColor('#d9b3ff')\"\n              [class.active]=\"highlightColor === '#d9b3ff'\" title=\"\u0E21\u0E48\u0E27\u0E07\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"highlightColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\u0E23\u0E2B\u0E31\u0E2A HEX\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"highlightColor\" (input)=\"setHighlightColor($any($event.target).value)\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Eraser -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"eraserMode\" (click)=\"toggleEraser()\" title=\"\u0E22\u0E32\u0E07\u0E25\u0E1A (\u0E25\u0E1A\u0E40\u0E2A\u0E49\u0E19\u0E41\u0E25\u0E30\u0E23\u0E39\u0E1B\u0E17\u0E23\u0E07)\">\n          <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n            <path d=\"M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4C13.5 3.5 14.5 3.5 15 4L20 9C20.5 9.5 20.5 10.5 20 11L11 20H20V20Z\"/>\n            <path d=\"M17.5 15L9 6.5\"/>\n          </svg>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"eraserMode\">\n          <button (click)=\"changeEraserSize(-5)\" [disabled]=\"eraserSize <= 5\"><ion-icon name=\"remove\"></ion-icon></button>\n          <span>{{ eraserSize }}</span>\n          <button (click)=\"changeEraserSize(5)\" [disabled]=\"eraserSize >= 200\"><ion-icon name=\"add\"></ion-icon></button>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Insert Tools -->\n      <button class=\"toolbar-btn\" (click)=\"openSignaturePickerOrPad()\" title=\"\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\">\n        <ion-icon name=\"finger-print\"></ion-icon>\n      </button>\n      <button class=\"toolbar-btn toolbar-btn--toggle\" [class.active]=\"showDigitalId\"\n        (click)=\"showDigitalId = !showDigitalId\" title=\"\u0E41\u0E2A\u0E14\u0E07/\u0E0B\u0E48\u0E2D\u0E19 Digital ID\">\n        <ion-icon [name]=\"showDigitalId ? 'shield-checkmark' : 'shield-checkmark-outline'\"></ion-icon>\n        <span class=\"toggle-label\">DID</span>\n      </button>\n\n      <!-- Date Stamp with Options -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"showDateOptions\" (click)=\"addDateStampAndShowOptions()\"\n          title=\"\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\">\n          <ion-icon name=\"calendar\"></ion-icon>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"showDateOptions\">\n          <button (click)=\"changeDateFontSize(-2)\" [disabled]=\"dateFontSize <= 8\"><ion-icon\n              name=\"remove\"></ion-icon></button>\n          <span>{{ dateFontSize }}</span>\n          <button (click)=\"changeDateFontSize(2)\" [disabled]=\"dateFontSize >= 100\"><ion-icon\n              name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setDateColor('#000000')\"\n              [class.active]=\"dateColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setDateColor('#0000FF')\"\n              [class.active]=\"dateColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setDateColor('#FF0000')\"\n              [class.active]=\"dateColor === '#FF0000'\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"dateColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"dateColor\" (input)=\"setDateColor($any($event.target).value)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <button class=\"toolbar-btn\" (click)=\"triggerImageUpload()\" title=\"\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\">\n        <ion-icon name=\"image\"></ion-icon>\n      </button>\n      <input type=\"file\" #fileInput accept=\"image/*\" style=\"display:none\" (change)=\"onImageSelected($event)\">\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Undo/Redo -->\n      <button class=\"toolbar-btn\" (click)=\"undo()\" [disabled]=\"!canUndo()\" title=\"\u0E40\u0E25\u0E34\u0E01\u0E17\u0E33\">\n        <ion-icon name=\"arrow-undo\"></ion-icon>\n      </button>\n      <button class=\"toolbar-btn\" (click)=\"redo()\" [disabled]=\"!canRedo()\" title=\"\u0E17\u0E33\u0E0B\u0E49\u0E33\">\n        <ion-icon name=\"arrow-redo\"></ion-icon>\n      </button>\n      <button class=\"toolbar-btn toolbar-btn--danger\" (click)=\"clearAnnotations()\" title=\"\u0E25\u0E49\u0E32\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\">\n        <ion-icon name=\"trash\"></ion-icon>\n      </button>\n    </div>\n\n    <!-- Main Content Area: Thumbnails + Viewer -->\n    <div class=\"main-area\">\n\n      <!-- Left Thumbnails Sidebar -->\n      <aside class=\"thumbnails-sidebar\" *ngIf=\"showThumbnails\">\n        <div class=\"thumb-list\">\n\n          <!-- Top insert button (before page 1) -->\n          <div class=\"thumb-insert-row\">\n            <button class=\"thumb-add-btn\" (click)=\"toggleThumbInsert(0, $event)\" title=\"\u0E41\u0E17\u0E23\u0E01\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32 1\">\n              <ion-icon name=\"add\"></ion-icon>\n            </button>\n          </div>\n\n          <!-- Each thumbnail + its action bar + insert button after it -->\n          <ng-container *ngFor=\"let thumb of pageThumbnails; let i = index\">\n\n            <!-- Thumbnail card wrapper -->\n            <div class=\"thumb-card-wrap\">\n              <!-- Clickable thumbnail -->\n              <div class=\"thumb-card\" [class.active]=\"pageNo === i + 1\"\n                [id]=\"'thumb-' + (i + 1)\" (click)=\"goToPage(i + 1)\">\n                <div class=\"thumb-card__img-wrap\">\n                  <img [src]=\"thumb\" [alt]=\"'Page ' + (i + 1)\">\n                </div>\n                <span class=\"thumb-card__label\">{{ i + 1 }}</span>\n              </div>\n\n              <!-- Per-page action bar -->\n              <div class=\"thumb-card__actions\" (click)=\"$event.stopPropagation()\">\n                <button class=\"thumb-action-btn\" (click)=\"movePageToIndex(i + 1, 'up')\"\n                  [disabled]=\"i === 0\" title=\"\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E02\u0E36\u0E49\u0E19\">\n                  <ion-icon name=\"chevron-up-outline\"></ion-icon>\n                </button>\n                <button class=\"thumb-action-btn\" (click)=\"movePageToIndex(i + 1, 'down')\"\n                  [disabled]=\"i === pageThumbnails.length - 1\" title=\"\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E25\u0E07\">\n                  <ion-icon name=\"chevron-down-outline\"></ion-icon>\n                </button>\n                <button class=\"thumb-action-btn\" (click)=\"undoPageOp()\"\n                  [disabled]=\"!canUndoPageOp\" title=\"\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\">\n                  <ion-icon name=\"arrow-undo-outline\"></ion-icon>\n                </button>\n                <button class=\"thumb-action-btn thumb-action-btn--danger\"\n                  (click)=\"deleteSpecificPage(i + 1)\" [disabled]=\"pageCount <= 1\" title=\"\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\">\n                  <ion-icon name=\"trash-outline\"></ion-icon>\n                </button>\n              </div>\n            </div>\n\n            <!-- Insert button after each page -->\n            <div class=\"thumb-insert-row\">\n              <button class=\"thumb-add-btn\" (click)=\"toggleThumbInsert(i + 1, $event)\" title=\"\u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\">\n                <ion-icon name=\"add\"></ion-icon>\n              </button>\n            </div>\n\n          </ng-container>\n\n        </div>\n\n        <!-- Hidden file input -->\n        <input type=\"file\" #thumbFileInput accept=\"image/*,.pdf\" style=\"display:none\"\n          (change)=\"onThumbFileSelected($event)\">\n\n      </aside>\n\n      <!-- Insert Dropdown Overlay (outside aside \u2014 fixed position, no clipping) -->\n      <div class=\"thumb-insert-overlay\" *ngIf=\"thumbInsertIndex >= 0\"\n        [style.top.px]=\"thumbDropdownTop\">\n        <div class=\"thumb-insert-backdrop\" (click)=\"thumbInsertIndex = -1\"></div>\n        <div class=\"thumb-insert-menu\">\n          <button class=\"thumb-insert-opt\" (click)=\"insertAtThumb(thumbInsertIndex, 'portrait')\">\n            <ion-icon name=\"phone-portrait-outline\"></ion-icon>\n            \u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32 \u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07\n          </button>\n          <button class=\"thumb-insert-opt\" (click)=\"insertAtThumb(thumbInsertIndex, 'landscape')\">\n            <ion-icon name=\"phone-landscape-outline\"></ion-icon>\n            \u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32 \u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19\n          </button>\n          <button class=\"thumb-insert-opt\" (click)=\"triggerThumbFileUpload(thumbInsertIndex)\">\n            <ion-icon name=\"document-outline\"></ion-icon>\n            \u0E41\u0E17\u0E23\u0E01\u0E44\u0E1F\u0E25\u0E4C PDF/\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\n          </button>\n        </div>\n      </div>\n\n      <!-- Viewer -->\n      <div class=\"viewer-wrapper\">\n        <div class=\"viewer-container\" #viewerContainer (scroll)=\"onViewerScroll($event)\">\n          <!-- Render all pages for continuous scroll -->\n          <div *ngFor=\"let p of pages\" class=\"page-container\" [attr.data-page]=\"p\" [id]=\"'page-' + p\">\n            <canvas [id]=\"'pdfCanvas-' + p\" class=\"pdf-canvas\"></canvas>\n            <canvas [id]=\"'annotCanvas-' + p\" class=\"annot-canvas\" [class.tools-active]=\"toolMode !== 'none'\"></canvas>\n\n            <!-- TextBoxes for this page -->\n            <div *ngFor=\"let tb of getTextBoxesForPage(p)\" class=\"text-box\" [class.active]=\"activeTextBoxId === tb.id\"\n              [style.left.%]=\"tb.x\" [style.top.%]=\"tb.y\" [style.width.%]=\"tb.width\" [style.height.%]=\"tb.height\"\n              [style.color]=\"tb.color\" [style.font-size.px]=\"tb.fontSize * zoom\"\n              [style.font-weight]=\"tb.bold ? 'bold' : 'normal'\" [style.font-style]=\"tb.italic ? 'italic' : 'normal'\"\n              [style.text-align]=\"tb.align\" [style.z-index]=\"tb.zIndex || 10\"\n              (pointerdown)=\"startDrag($event, tb.id)\" (contextmenu)=\"onContextMenu($event, tb.id, 'text')\">\n              <div class=\"tb-handle tb-handle--left\" (pointerdown)=\"startResizeLeft($event, tb.id)\"></div>\n              <textarea [(ngModel)]=\"tb.text\" (focus)=\"activeTextBoxId = tb.id\" (input)=\"onTextBoxInput($event, tb)\"\n                spellcheck=\"false\"></textarea>\n              <div class=\"tb-handle tb-handle--right\" (pointerdown)=\"startResizeRight($event, tb.id)\"></div>\n            </div>\n            <!-- ShapeStamps for this page (draggable/resizable SVG overlays) -->\n            <div *ngFor=\"let ss of getShapeStampsForPage(p)\" class=\"shape-stamp\" [style.left.%]=\"ss.x\"\n              [style.top.%]=\"ss.y\" [style.width.%]=\"ss.width\" [style.height.%]=\"ss.height\"\n              [style.z-index]=\"ss.zIndex || 10\" (pointerdown)=\"startShapeDrag($event, ss.id)\"\n              (contextmenu)=\"onContextMenu($event, ss.id, 'shape')\">\n              <button class=\"remove-btn\" (click)=\"removeShapeStamp(ss.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n\n              <!-- SVG renders the actual shape inside the bounding box -->\n              <svg width=\"100%\" height=\"100%\" [attr.viewBox]=\"'0 0 100 100'\" preserveAspectRatio=\"none\"\n                style=\"overflow:visible; pointer-events:none\">\n                <!-- rect -->\n                <rect *ngIf=\"ss.type === 'rect'\" x=\"0\" y=\"0\" width=\"100\" height=\"100\"\n                  [attr.stroke]=\"ss.strokeColor || 'none'\" [attr.stroke-width]=\"ss.strokeWidth\"\n                  vector-effect=\"non-scaling-stroke\" [attr.fill]=\"ss.fillColor || 'none'\"></rect>\n                <!-- circle -->\n                <ellipse *ngIf=\"ss.type === 'circle'\" cx=\"50\" cy=\"50\" rx=\"50\" ry=\"50\"\n                  [attr.stroke]=\"ss.strokeColor || 'none'\" [attr.stroke-width]=\"ss.strokeWidth\"\n                  vector-effect=\"non-scaling-stroke\" [attr.fill]=\"ss.fillColor || 'none'\"></ellipse>\n                <!-- line -->\n                <line *ngIf=\"ss.type === 'line'\" [attr.x1]=\"ss.startFracX * 100\" [attr.y1]=\"ss.startFracY * 100\"\n                  [attr.x2]=\"ss.endFracX * 100\" [attr.y2]=\"ss.endFracY * 100\" [attr.stroke]=\"ss.strokeColor || '#000'\"\n                  [attr.stroke-width]=\"ss.strokeWidth\" vector-effect=\"non-scaling-stroke\" fill=\"none\"></line>\n                <!-- arrow -->\n                <g *ngIf=\"ss.type === 'arrow'\">\n                  <line [attr.x1]=\"ss.startFracX * 100\" [attr.y1]=\"ss.startFracY * 100\" [attr.x2]=\"ss.endFracX * 100\"\n                    [attr.y2]=\"ss.endFracY * 100\" [attr.stroke]=\"ss.strokeColor || '#000'\"\n                    [attr.stroke-width]=\"ss.strokeWidth\" vector-effect=\"non-scaling-stroke\" fill=\"none\">\n                  </line>\n                  <polygon [attr.points]=\"'0,-6 12,0 0,6'\" [attr.fill]=\"ss.strokeColor || '#000'\"\n                    [attr.transform]=\"'translate(' + (ss.endFracX*100) + ',' + (ss.endFracY*100) + ') rotate(' + getArrowAngleDeg(ss) + ')'\">\n                  </polygon>\n                </g>\n              </svg>\n\n              <!-- Resize handles (corner + edge) -->\n              <div class=\"resize-handle rh-nw\" (pointerdown)=\"startShapeResize($event, ss.id, 'nw')\"></div>\n              <div class=\"resize-handle rh-n\" (pointerdown)=\"startShapeResize($event, ss.id, 'n')\"></div>\n              <div class=\"resize-handle rh-ne\" (pointerdown)=\"startShapeResize($event, ss.id, 'ne')\"></div>\n              <div class=\"resize-handle rh-e\" (pointerdown)=\"startShapeResize($event, ss.id, 'e')\"></div>\n              <div class=\"resize-handle rh-se\" (pointerdown)=\"startShapeResize($event, ss.id, 'se')\"></div>\n              <div class=\"resize-handle rh-s\" (pointerdown)=\"startShapeResize($event, ss.id, 's')\"></div>\n              <div class=\"resize-handle rh-sw\" (pointerdown)=\"startShapeResize($event, ss.id, 'sw')\"></div>\n              <div class=\"resize-handle rh-w\" (pointerdown)=\"startShapeResize($event, ss.id, 'w')\"></div>\n            </div>\n\n            <!-- Regular image stamps (uploaded images, not marks) -->\n            <div *ngFor=\"let img of getRegularImageStampsForPage(p)\" class=\"image-stamp\"\n              [style.left.%]=\"img.x\"\n              [style.top.%]=\"img.y\" [style.width.%]=\"img.width\" [style.height.%]=\"img.height\"\n              [style.z-index]=\"img.zIndex || 10\" (pointerdown)=\"startImageDrag($event, img.id)\"\n              (contextmenu)=\"onContextMenu($event, img.id, 'image')\">\n              <button class=\"remove-btn\" (click)=\"removeImage(img.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n              <img [src]=\"img.dataUrl\" />\n              <div class=\"resize-handle rh-nw\" (pointerdown)=\"startImageResize($event, img.id, 'nw')\"></div>\n              <div class=\"resize-handle rh-n\" (pointerdown)=\"startImageResize($event, img.id, 'n')\"></div>\n              <div class=\"resize-handle rh-ne\" (pointerdown)=\"startImageResize($event, img.id, 'ne')\"></div>\n              <div class=\"resize-handle rh-e\" (pointerdown)=\"startImageResize($event, img.id, 'e')\"></div>\n              <div class=\"resize-handle rh-se\" (pointerdown)=\"startImageResize($event, img.id, 'se')\"></div>\n              <div class=\"resize-handle rh-s\" (pointerdown)=\"startImageResize($event, img.id, 's')\"></div>\n              <div class=\"resize-handle rh-sw\" (pointerdown)=\"startImageResize($event, img.id, 'sw')\"></div>\n              <div class=\"resize-handle rh-w\" (pointerdown)=\"startImageResize($event, img.id, 'w')\"></div>\n            </div>\n\n            <!-- Mark stamps (check/cross/dot) \u2014 rendered as SVG, behaves like form field checkbox -->\n            <div *ngFor=\"let mk of getMarkStampsForPage(p)\" class=\"pdf-form-field pff-mark\"\n              [class.pff-active]=\"activeObjectId === mk.id\"\n              [style.left.%]=\"mk.x\" [style.top.%]=\"mk.y\"\n              [style.width.%]=\"mk.width\" [style.height.%]=\"mk.height\"\n              [style.z-index]=\"mk.zIndex || 10\"\n              (pointerdown)=\"startMarkDrag($event, mk.id)\"\n              (contextmenu)=\"onContextMenu($event, mk.id, 'image')\">\n\n              <!-- Options bar when active -->\n              <div class=\"pff-options-bar\" *ngIf=\"activeObjectId === mk.id\" (pointerdown)=\"$event.stopPropagation()\">\n                <span class=\"pff-opt-label\"><ion-icon name=\"resize-outline\"></ion-icon></span>\n                <button class=\"pff-opt-btn\" (click)=\"changeMarkStampSize(mk.id, -1)\" [disabled]=\"mk.width <= 1\" title=\"\u0E25\u0E14\u0E02\u0E19\u0E32\u0E14\">\n                  <ion-icon name=\"remove\"></ion-icon>\n                </button>\n                <span class=\"pff-opt-val\">{{ mk.width | number:'1.0-1' }}</span>\n                <button class=\"pff-opt-btn\" (click)=\"changeMarkStampSize(mk.id, 1)\" [disabled]=\"mk.width >= 25\" title=\"\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E19\u0E32\u0E14\">\n                  <ion-icon name=\"add\"></ion-icon>\n                </button>\n                <div class=\"pff-opt-sep\"></div>\n                <button class=\"pff-opt-btn pff-opt-delete\" (click)=\"removeImage(mk.id); $event.stopPropagation()\" title=\"\u0E25\u0E1A\">\n                  <ion-icon name=\"trash-outline\"></ion-icon>\n                </button>\n              </div>\n\n              <!-- SVG mark symbol fills the bounding box exactly -->\n              <div class=\"pff-inner\">\n                <svg width=\"100%\" height=\"100%\" viewBox=\"0 0 100 100\" style=\"pointer-events:none; overflow:visible\">\n                  <ng-container *ngIf=\"mk.markType === 'check'\">\n                    <polyline points=\"12,52 42,82 88,18\" [attr.stroke]=\"mk.markColor || '#000000'\" stroke-width=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/>\n                  </ng-container>\n                  <ng-container *ngIf=\"mk.markType === 'cross'\">\n                    <line x1=\"15\" y1=\"15\" x2=\"85\" y2=\"85\" [attr.stroke]=\"mk.markColor || '#000000'\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n                    <line x1=\"85\" y1=\"15\" x2=\"15\" y2=\"85\" [attr.stroke]=\"mk.markColor || '#000000'\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n                  </ng-container>\n                  <ng-container *ngIf=\"mk.markType === 'dot' || !mk.markType\">\n                    <circle cx=\"50\" cy=\"50\" r=\"38\" [attr.fill]=\"mk.markColor || '#000000'\"/>\n                  </ng-container>\n                </svg>\n              </div>\n\n              <div class=\"pff-resize-handle rh-nw\" (pointerdown)=\"startImageResize($event, mk.id, 'nw')\"></div>\n              <div class=\"pff-resize-handle rh-n\"  (pointerdown)=\"startImageResize($event, mk.id, 'n')\"></div>\n              <div class=\"pff-resize-handle rh-ne\" (pointerdown)=\"startImageResize($event, mk.id, 'ne')\"></div>\n              <div class=\"pff-resize-handle rh-e\"  (pointerdown)=\"startImageResize($event, mk.id, 'e')\"></div>\n              <div class=\"pff-resize-handle rh-se\" (pointerdown)=\"startImageResize($event, mk.id, 'se')\"></div>\n              <div class=\"pff-resize-handle rh-s\"  (pointerdown)=\"startImageResize($event, mk.id, 's')\"></div>\n              <div class=\"pff-resize-handle rh-sw\" (pointerdown)=\"startImageResize($event, mk.id, 'sw')\"></div>\n              <div class=\"pff-resize-handle rh-w\"  (pointerdown)=\"startImageResize($event, mk.id, 'w')\"></div>\n            </div>\n\n            <div *ngFor=\"let sig of getSignatureStampsForPage(p)\" class=\"signature-stamp\" [style.left.%]=\"sig.x\"\n              [style.top.%]=\"sig.y\" [style.width.%]=\"sig.width\" [style.height.%]=\"sig.height\"\n              [style.z-index]=\"sig.zIndex || 10\" (pointerdown)=\"startSignatureDrag($event, sig.id)\"\n              (contextmenu)=\"onContextMenu($event, sig.id, 'signature')\">\n              <button class=\"remove-btn\" (click)=\"removeSignature(sig.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n              <img [src]=\"sig.dataUrl\" />\n              <div class=\"digital-id-label\" *ngIf=\"showDigitalId && (sig.digitalId || sig.signDate)\">\n                <span *ngIf=\"sig.signDate\">{{ sig.signDate }}</span>\n                <span *ngIf=\"sig.signTime\">{{ sig.signTime }}</span>\n                <span *ngIf=\"sig.digitalId\" class=\"did-text\">{{ sig.digitalId }}</span>\n              </div>\n              <div class=\"resize-handle rh-nw\" (pointerdown)=\"startSignatureResize($event, sig.id, 'nw')\"></div>\n              <div class=\"resize-handle rh-n\" (pointerdown)=\"startSignatureResize($event, sig.id, 'n')\"></div>\n              <div class=\"resize-handle rh-ne\" (pointerdown)=\"startSignatureResize($event, sig.id, 'ne')\"></div>\n              <div class=\"resize-handle rh-e\" (pointerdown)=\"startSignatureResize($event, sig.id, 'e')\"></div>\n              <div class=\"resize-handle rh-se\" (pointerdown)=\"startSignatureResize($event, sig.id, 'se')\"></div>\n              <div class=\"resize-handle rh-s\" (pointerdown)=\"startSignatureResize($event, sig.id, 's')\"></div>\n              <div class=\"resize-handle rh-sw\" (pointerdown)=\"startSignatureResize($event, sig.id, 'sw')\"></div>\n              <div class=\"resize-handle rh-w\" (pointerdown)=\"startSignatureResize($event, sig.id, 'w')\"></div>\n            </div>\n\n            <!-- PDF Form Fields for this page -->\n            <div *ngFor=\"let ff of getFormFieldsForPage(p)\" class=\"pdf-form-field\"\n              [class.pff-text]=\"ff.type === 'text'\"\n              [class.pff-checkbox]=\"ff.type === 'checkbox'\"\n              [class.pff-radio]=\"ff.type === 'radio'\"\n              [class.pff-no-border]=\"ff.borderVisible === false\"\n              [class.pff-active]=\"activeFormFieldId === ff.id\"\n              [style.left.%]=\"ff.x\" [style.top.%]=\"ff.y\"\n              [style.width.%]=\"ff.width\" [style.height.%]=\"ff.height\"\n              [style.z-index]=\"ff.zIndex || 20\"\n              (pointerdown)=\"startFormFieldDrag($event, ff.id)\">\n\n              <!-- Options bar (shown when active) -->\n              <div class=\"pff-options-bar\" *ngIf=\"activeFormFieldId === ff.id\" (pointerdown)=\"$event.stopPropagation()\">\n                <!-- Element size: all 3 types -->\n                <span class=\"pff-opt-label\">\n                  <ion-icon name=\"resize-outline\"></ion-icon>\n                </span>\n                <button class=\"pff-opt-btn\" (click)=\"changeFormFieldSize(ff.id, -0.5)\" [disabled]=\"(ff.type === 'text' ? ff.height : ff.width) <= 1.5\" title=\"\u0E25\u0E14\u0E02\u0E19\u0E32\u0E14\">\n                  <ion-icon name=\"remove\"></ion-icon>\n                </button>\n                <span class=\"pff-opt-val\">{{ (ff.type === 'text' ? ff.height : ff.width) | number:'1.0-1' }}</span>\n                <button class=\"pff-opt-btn\" (click)=\"changeFormFieldSize(ff.id, 0.5)\" [disabled]=\"(ff.type === 'text' ? ff.height : ff.width) >= 30\" title=\"\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E19\u0E32\u0E14\">\n                  <ion-icon name=\"add\"></ion-icon>\n                </button>\n                <div class=\"pff-opt-sep\"></div>\n                <!-- Font size: text only -->\n                <ng-container *ngIf=\"ff.type === 'text'\">\n                  <span class=\"pff-opt-label\">A</span>\n                  <button class=\"pff-opt-btn\" (click)=\"changeFormFieldFontSize(ff.id, -2)\" [disabled]=\"(ff.fontSize || 12) <= 6\" title=\"\u0E25\u0E14\u0E02\u0E19\u0E32\u0E14\u0E2D\u0E31\u0E01\u0E29\u0E23\">\n                    <ion-icon name=\"remove\"></ion-icon>\n                  </button>\n                  <span class=\"pff-opt-val\">{{ ff.fontSize || 12 }}</span>\n                  <button class=\"pff-opt-btn\" (click)=\"changeFormFieldFontSize(ff.id, 2)\" [disabled]=\"(ff.fontSize || 12) >= 72\" title=\"\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E19\u0E32\u0E14\u0E2D\u0E31\u0E01\u0E29\u0E23\">\n                    <ion-icon name=\"add\"></ion-icon>\n                  </button>\n                  <div class=\"pff-opt-sep\"></div>\n                </ng-container>\n                <!-- Border toggle -->\n                <button class=\"pff-opt-btn\" [class.pff-opt-active]=\"ff.borderVisible !== false\"\n                  (click)=\"toggleFormFieldBorder(ff.id)\" title=\"\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A\">\n                  <ion-icon [name]=\"ff.borderVisible !== false ? 'square-outline' : 'square'\"></ion-icon>\n                </button>\n                <!-- Delete -->\n                <button class=\"pff-opt-btn pff-opt-delete\" (click)=\"removeFormField(ff.id)\" title=\"\u0E25\u0E1A\">\n                  <ion-icon name=\"trash-outline\"></ion-icon>\n                </button>\n              </div>\n\n              <div class=\"pff-inner\">\n                <span *ngIf=\"ff.type === 'text'\" class=\"pff-text-hint\">Aa {{ ff.fontSize || 12 }}pt</span>\n                <svg *ngIf=\"ff.type === 'checkbox'\" width=\"55%\" height=\"55%\" viewBox=\"0 0 18 18\" style=\"pointer-events:none\"><rect x=\"1\" y=\"1\" width=\"16\" height=\"16\" rx=\"2\" stroke=\"#3b82f6\" stroke-width=\"2\" fill=\"none\"/></svg>\n                <svg *ngIf=\"ff.type === 'radio'\" width=\"55%\" height=\"55%\" viewBox=\"0 0 18 18\" style=\"pointer-events:none\"><circle cx=\"9\" cy=\"9\" r=\"8\" stroke=\"#3b82f6\" stroke-width=\"2\" fill=\"none\"/></svg>\n              </div>\n\n              <div class=\"pff-resize-handle rh-nw\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'nw')\"></div>\n              <div class=\"pff-resize-handle rh-n\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 'n')\"></div>\n              <div class=\"pff-resize-handle rh-ne\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'ne')\"></div>\n              <div class=\"pff-resize-handle rh-e\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 'e')\"></div>\n              <div class=\"pff-resize-handle rh-se\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'se')\"></div>\n              <div class=\"pff-resize-handle rh-s\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 's')\"></div>\n              <div class=\"pff-resize-handle rh-sw\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'sw')\"></div>\n              <div class=\"pff-resize-handle rh-w\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 'w')\"></div>\n            </div>\n\n            <!-- Date Stamps for this page -->\n            <div *ngFor=\"let ds of getDateStampsForPage(p)\" class=\"date-stamp\" [style.left.%]=\"ds.x\"\n              [style.top.%]=\"ds.y\" [style.color]=\"ds.color\" [style.font-size.px]=\"ds.fontSize * zoom\"\n              [style.z-index]=\"ds.zIndex || 10\" (pointerdown)=\"startDateDrag($event, ds.id)\"\n              (contextmenu)=\"onContextMenu($event, ds.id, 'date')\">\n              <button class=\"remove-btn\" (click)=\"removeDateStamp(ds.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n              {{ ds.text }}\n            </div>\n          </div>\n        </div>\n\n        <div class=\"hint\">\n          <div>\u2022 Keyboard: Ctrl+Z (Undo), Ctrl+Y (Redo), Escape (Exit mode), Delete (Remove selected)</div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- User Guide Panel (right slide-in drawer) -->\n  <div class=\"user-guide-drawer\" [class.open]=\"showUserGuidePanel\">\n    <div class=\"user-guide-drawer__backdrop\" (click)=\"showUserGuidePanel = false\"></div>\n    <div class=\"user-guide-drawer__panel\">\n      <div class=\"user-guide-drawer__header\">\n        <span><ion-icon name=\"book-outline\"></ion-icon> \u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</span>\n        <button (click)=\"showUserGuidePanel = false\"><ion-icon name=\"close-outline\"></ion-icon></button>\n      </div>\n\n      <div class=\"user-guide-content-area\" *ngIf=\"!isLoadingGuide\">\n        <div *ngIf=\"!isEditingGuide\" class=\"guide-view-mode\">\n\n          <!-- Banner -->\n          <div class=\"guide-banner\">\n            <ion-icon name=\"rocket\"></ion-icon>\n            <div>\n              <strong>\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19\u0E07\u0E48\u0E32\u0E22\u0E21\u0E32\u0E01!</strong> \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E08\u0E32\u0E01\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19 \u0E41\u0E25\u0E49\u0E27\u0E04\u0E25\u0E34\u0E01\u0E2B\u0E23\u0E37\u0E2D\u0E25\u0E32\u0E01\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22\n              \u2014 \u0E01\u0E14 <code>Ctrl+Z</code> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E40\u0E2A\u0E21\u0E2D\u0E2B\u0E32\u0E01\u0E17\u0E33\u0E1E\u0E25\u0E32\u0E14\n            </div>\n          </div>\n\n          <!-- \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21 -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"text\" style=\"color:#60a5fa;\"></ion-icon> \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21 (Text)\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <div class=\"guide-step\">1</div>\n                <div class=\"guide-item__text\">\u0E01\u0E14\u0E44\u0E2D\u0E04\u0E2D\u0E19 <ion-icon name=\"text\" style=\"vertical-align:-2px;color:#60a5fa;\"></ion-icon> \u0E41\u0E25\u0E49\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01 <strong>\u0E02\u0E19\u0E32\u0E14\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23</strong> \u0E41\u0E25\u0E30 <strong>\u0E2A\u0E35</strong> \u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E19\u0E27\u0E32\u0E07</div>\n              </div>\n              <div class=\"guide-item\">\n                <div class=\"guide-step\">2</div>\n                <div class=\"guide-item__text\">\u0E04\u0E25\u0E34\u0E01\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23 PDF \u2014 \u0E01\u0E25\u0E48\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E08\u0E30\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E17\u0E31\u0E19\u0E17\u0E35 \u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22 <strong>\u0E01\u0E25\u0E48\u0E2D\u0E07\u0E08\u0E30\u0E02\u0E22\u0E32\u0E22\u0E15\u0E32\u0E21\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34</strong></div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"move-outline\" class=\"guide-item__icon\" style=\"color:#60a5fa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E22\u0E49\u0E32\u0E22\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07:</strong> \u0E08\u0E31\u0E1A\u0E17\u0E35\u0E48 <em>\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A</em> \u0E01\u0E25\u0E48\u0E2D\u0E07\u0E41\u0E25\u0E49\u0E27\u0E25\u0E32\u0E01\u0E44\u0E1B\u0E27\u0E32\u0E07\u0E44\u0E14\u0E49\u0E17\u0E38\u0E01\u0E17\u0E35\u0E48 (cursor \u0E08\u0E30\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E25\u0E39\u0E01\u0E28\u0E23 4 \u0E17\u0E34\u0E28)</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"contract-outline\" class=\"guide-item__icon\" style=\"color:#60a5fa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E1B\u0E23\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E01\u0E27\u0E49\u0E32\u0E07:</strong> \u0E25\u0E32\u0E01\u0E27\u0E07\u0E01\u0E25\u0E21\u0E2A\u0E35\u0E1F\u0E49\u0E32 <span class=\"guide-dot-demo\"></span> \u0E17\u0E35\u0E48\u0E0B\u0E49\u0E32\u0E22\u0E2B\u0E23\u0E37\u0E2D\u0E02\u0E27\u0E32\u0E01\u0E25\u0E48\u0E2D\u0E07 \u2014 \u0E04\u0E27\u0E32\u0E21\u0E2A\u0E39\u0E07\u0E08\u0E30\u0E1B\u0E23\u0E31\u0E1A\u0E15\u0E32\u0E21\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2D\u0E07</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"trash-outline\" class=\"guide-item__icon\" style=\"color:#f87171;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E25\u0E1A\u0E01\u0E25\u0E48\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21:</strong> \u0E04\u0E25\u0E34\u0E01\u0E17\u0E35\u0E48\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A\u0E01\u0E25\u0E48\u0E2D\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01 \u0E41\u0E25\u0E49\u0E27\u0E01\u0E14 <code>Delete</code> \u0E2B\u0E23\u0E37\u0E2D\u0E04\u0E25\u0E34\u0E01\u0E02\u0E27\u0E32\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E40\u0E21\u0E19\u0E39</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E27\u0E32\u0E14\u0E41\u0E25\u0E30\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"brush\" style=\"color:#fb7185;\"></ion-icon> \u0E27\u0E32\u0E14 / \u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C / \u0E22\u0E32\u0E07\u0E25\u0E1A\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"brush\" class=\"guide-item__icon\" style=\"color:#fb7185;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E1B\u0E32\u0E01\u0E01\u0E32 / \u0E14\u0E34\u0E19\u0E2A\u0E2D:</strong> \u0E25\u0E32\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E27\u0E32\u0E14\u0E2D\u0E34\u0E2A\u0E23\u0E30 \u2014 \u0E1B\u0E23\u0E31\u0E1A <strong>\u0E02\u0E19\u0E32\u0E14\u0E40\u0E2A\u0E49\u0E19</strong> \u0E41\u0E25\u0E30 <strong>\u0E2A\u0E35</strong> \u0E08\u0E32\u0E01\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19 \u0E40\u0E2A\u0E49\u0E19\u0E08\u0E30\u0E23\u0E27\u0E21\u0E40\u0E1B\u0E47\u0E19 object \u0E40\u0E14\u0E35\u0E22\u0E27\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E22\u0E01\u0E1B\u0E32\u0E01\u0E01\u0E32</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"color-filter-outline\" class=\"guide-item__icon\" style=\"color:#fde68a;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C:</strong> \u0E25\u0E32\u0E01\u0E17\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E19\u0E49\u0E19\u0E2A\u0E35 \u2014 \u0E21\u0E35\u0E2A\u0E35\u0E43\u0E2B\u0E49\u0E40\u0E25\u0E37\u0E2D\u0E01 6 \u0E2A\u0E35 \u0E2B\u0E23\u0E37\u0E2D\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\u0E44\u0E14\u0E49 \u0E1B\u0E23\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E19\u0E32\u0E44\u0E14\u0E49\u0E15\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"cut-outline\" class=\"guide-item__icon\" style=\"color:#94a3b8;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E22\u0E32\u0E07\u0E25\u0E1A:</strong> \u0E25\u0E32\u0E01\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E2A\u0E49\u0E19\u0E27\u0E32\u0E14\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E25\u0E1A \u2014 \u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14\u0E22\u0E32\u0E07\u0E25\u0E1A\u0E44\u0E14\u0E49\u0E08\u0E32\u0E01\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E23\u0E39\u0E1B\u0E23\u0E48\u0E32\u0E07 -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"shapes\" style=\"color:#a78bfa;\"></ion-icon> \u0E23\u0E39\u0E1B\u0E23\u0E48\u0E32\u0E07\u0E41\u0E25\u0E30\u0E40\u0E2A\u0E49\u0E19 (Shapes)\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"square-outline\" class=\"guide-item__icon\" style=\"color:#a78bfa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>4 \u0E41\u0E1A\u0E1A:</strong> \u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21 <ion-icon name=\"square-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E27\u0E07\u0E01\u0E25\u0E21 <ion-icon name=\"ellipse-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07 <ion-icon name=\"remove-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E25\u0E39\u0E01\u0E28\u0E23 <ion-icon name=\"arrow-forward-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u2014 \u0E01\u0E14\u0E25\u0E39\u0E01\u0E28\u0E23\u0E40\u0E25\u0E47\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E41\u0E1A\u0E1A \u0E41\u0E25\u0E49\u0E27<strong>\u0E25\u0E32\u0E01\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23</strong></div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"color-palette\" class=\"guide-item__icon\" style=\"color:#fbbf24;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E1B\u0E23\u0E31\u0E1A\u0E2A\u0E35\u0E41\u0E25\u0E30\u0E02\u0E19\u0E32\u0E14\u0E40\u0E2A\u0E49\u0E19:</strong> \u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E2A\u0E35\u0E02\u0E2D\u0E1A, \u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19, \u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E19\u0E32\u0E40\u0E2A\u0E49\u0E19\u0E44\u0E14\u0E49\u0E08\u0E32\u0E01\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19 \u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E1B\u0E34\u0E14\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A\u0E2B\u0E23\u0E37\u0E2D\u0E1B\u0E34\u0E14\u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19\u0E41\u0E22\u0E01\u0E01\u0E31\u0E19\u0E44\u0E14\u0E49</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"resize\" class=\"guide-item__icon\" style=\"color:#a78bfa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E22\u0E49\u0E32\u0E22\u0E41\u0E25\u0E30\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14:</strong> \u0E25\u0E32\u0E01\u0E15\u0E23\u0E07\u0E01\u0E25\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E49\u0E32\u0E22 \u2014 \u0E25\u0E32\u0E01 handle 8 \u0E08\u0E38\u0E14\u0E23\u0E2D\u0E1A\u0E23\u0E39\u0E1B\u0E23\u0E48\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14 \u2014 \u0E04\u0E25\u0E34\u0E01\u0E02\u0E27\u0E32\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E08\u0E31\u0E14\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E0A\u0E31\u0E49\u0E19</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19 -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"finger-print\" style=\"color:#34d399;\"></ion-icon> \u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19 (Signature)\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"create-outline\" class=\"guide-item__icon\" style=\"color:#34d399;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E27\u0E32\u0E14\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19:</strong> \u0E01\u0E14 <ion-icon name=\"finger-print\" style=\"vertical-align:-2px;font-size:13px;color:#34d399;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1B\u0E34\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07\u0E27\u0E32\u0E14 \u2014 \u0E1B\u0E23\u0E31\u0E1A\u0E2A\u0E35\u0E41\u0E25\u0E30\u0E02\u0E19\u0E32\u0E14\u0E1B\u0E32\u0E01\u0E01\u0E32 \u2014 \u0E01\u0E14 <strong>\"\u0E43\u0E0A\u0E49\u0E04\u0E23\u0E31\u0E49\u0E07\u0E19\u0E35\u0E49\"</strong> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E27\u0E32\u0E07\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"cloud-upload-outline\" class=\"guide-item__icon\" style=\"color:#34d399;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19:</strong> \u0E01\u0E14 <strong>\"\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49\u0E43\u0E0A\u0E49\u0E20\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E07\"</strong> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E01\u0E47\u0E1A\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E44\u0E27\u0E49\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A \u2014 \u0E04\u0E23\u0E31\u0E49\u0E07\u0E16\u0E31\u0E14\u0E44\u0E1B\u0E01\u0E14\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E44\u0E14\u0E49\u0E17\u0E31\u0E19\u0E17\u0E35</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"shield-checkmark-outline\" class=\"guide-item__icon\" style=\"color:#34d399;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>Digital ID (DID):</strong> \u0E01\u0E14\u0E1B\u0E38\u0E48\u0E21 <code>DID</code> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E41\u0E2A\u0E14\u0E07/\u0E0B\u0E48\u0E2D\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 Digital ID \u0E43\u0E15\u0E49\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19 (\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48, \u0E40\u0E27\u0E25\u0E32, \u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49)</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 \u0E41\u0E25\u0E30\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"calendar\" style=\"color:#fb923c;\"></ion-icon> \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 \u0E41\u0E25\u0E30\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"calendar-outline\" class=\"guide-item__icon\" style=\"color:#fb923c;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34:</strong> \u0E01\u0E14 <ion-icon name=\"calendar\" style=\"vertical-align:-2px;font-size:13px;color:#fb923c;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E41\u0E17\u0E23\u0E01\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 \u2014 \u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14\u0E41\u0E25\u0E30\u0E2A\u0E35\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23\u0E44\u0E14\u0E49 \u2014 \u0E25\u0E32\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E49\u0E32\u0E22\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"image-outline\" class=\"guide-item__icon\" style=\"color:#fb923c;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E41\u0E17\u0E23\u0E01\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E:</strong> \u0E01\u0E14 <ion-icon name=\"image\" style=\"vertical-align:-2px;font-size:13px;color:#fb923c;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E1F\u0E25\u0E4C\u0E23\u0E39\u0E1B\u0E08\u0E32\u0E01\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07 \u2014 \u0E25\u0E32\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E49\u0E32\u0E22 \u0E25\u0E32\u0E01 handle 8 \u0E08\u0E38\u0E14\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E2B\u0E19\u0E49\u0E32 -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"documents\" style=\"color:#f59e0b;\"></ion-icon> \u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"images-outline\" class=\"guide-item__icon\" style=\"color:#f59e0b;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>Thumbnail \u0E14\u0E49\u0E32\u0E19\u0E0B\u0E49\u0E32\u0E22:</strong> \u0E01\u0E14 <ion-icon name=\"images-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E41\u0E2A\u0E14\u0E07 \u2014 \u0E04\u0E25\u0E34\u0E01 thumbnail \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E01\u0E23\u0E30\u0E42\u0E14\u0E14\u0E44\u0E1B\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E31\u0E49\u0E19 \u2014 \u0E25\u0E32\u0E01 <ion-icon name=\"chevron-up-outline\" style=\"vertical-align:-2px;font-size:12px;\"></ion-icon><ion-icon name=\"chevron-down-outline\" style=\"vertical-align:-2px;font-size:12px;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E23\u0E35\u0E22\u0E07\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"add-circle-outline\" class=\"guide-item__icon\" style=\"color:#f59e0b;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E41\u0E17\u0E23\u0E01/\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32:</strong> \u0E01\u0E14\u0E44\u0E2D\u0E04\u0E2D\u0E19 <ion-icon name=\"documents-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E1A\u0E19\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19 \u2014 \u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07/\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19 \u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E23\u0E37\u0E2D\u0E2B\u0E25\u0E31\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 \u2014 \u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23 \u2014 \u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E44\u0E14\u0E49</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"search-outline\" class=\"guide-item__icon\" style=\"color:#f59e0b;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E0B\u0E39\u0E21:</strong> \u0E01\u0E14\u0E1B\u0E38\u0E48\u0E21 <code>+</code> / <code>\u2212</code> \u0E2B\u0E23\u0E37\u0E2D\u0E43\u0E0A\u0E49\u0E1B\u0E38\u0E48\u0E21\u0E0B\u0E39\u0E21\u0E1A\u0E19\u0E41\u0E16\u0E1A\u0E19\u0E33\u0E17\u0E32\u0E07 \u2014 \u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A\u0E15\u0E31\u0E49\u0E07\u0E41\u0E15\u0E48 50% \u0E16\u0E36\u0E07 300%</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- Keyboard Shortcuts -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"keypad\" style=\"color:#e2e8f0;\"></ion-icon> \u0E04\u0E35\u0E22\u0E4C\u0E25\u0E31\u0E14\u0E17\u0E35\u0E48\u0E04\u0E27\u0E23\u0E23\u0E39\u0E49\n            </h4>\n            <div class=\"guide-shortcuts-grid\">\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Ctrl</kbd><span>+</span><kbd>Z</kbd></div>\n                <div class=\"guide-shortcut-card__label\">\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A (Undo)</div>\n              </div>\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Ctrl</kbd><span>+</span><kbd>Y</kbd></div>\n                <div class=\"guide-shortcut-card__label\">\u0E17\u0E33\u0E0B\u0E49\u0E33 (Redo)</div>\n              </div>\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Delete</kbd></div>\n                <div class=\"guide-shortcut-card__label\">\u0E25\u0E1A object \u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01</div>\n              </div>\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Esc</kbd></div>\n                <div class=\"guide-shortcut-card__label\">\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- Pro Tips -->\n          <div class=\"guide-protip\">\n            <div class=\"guide-protip__icon\"><ion-icon name=\"bulb\"></ion-icon></div>\n            <div class=\"guide-protip__body\">\n              <div class=\"guide-protip__title\">Pro Tips</div>\n              <ul class=\"guide-protip__list\">\n                <li>\u0E04\u0E25\u0E34\u0E01\u0E02\u0E27\u0E32\u0E1A\u0E19 object \u0E43\u0E14 \u0E46 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E08\u0E31\u0E14\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E0A\u0E31\u0E49\u0E19 (Bring to Front / Send to Back)</li>\n                <li>\u0E01\u0E14 <code>Esc</code> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E41\u0E25\u0E30\u0E01\u0E25\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E42\u0E2B\u0E21\u0E14\u0E1B\u0E01\u0E15\u0E34</li>\n                <li>\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C\u0E17\u0E35\u0E48\u0E27\u0E32\u0E14\u0E14\u0E49\u0E27\u0E22 opacity \u0E15\u0E48\u0E33 \u2014 \u0E43\u0E0A\u0E49\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C\u0E0B\u0E49\u0E2D\u0E19\u0E01\u0E31\u0E19\u0E2B\u0E25\u0E32\u0E22\u0E0A\u0E31\u0E49\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E19\u0E49\u0E19\u0E2A\u0E35\u0E40\u0E02\u0E49\u0E21\u0E02\u0E36\u0E49\u0E19</li>\n                <li>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E44\u0E27\u0E49\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E0A\u0E49\u0E0B\u0E49\u0E33\u0E43\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E2D\u0E37\u0E48\u0E19 \u0E46 \u0E44\u0E14\u0E49\u0E2A\u0E30\u0E14\u0E27\u0E01</li>\n              </ul>\n            </div>\n          </div>\n\n          <div class=\"guide-section\" *ngIf=\"userGuideContent && userGuideContent.trim() !== ''\">\n            <h4 class=\"guide-section__title\"><ion-icon name=\"megaphone\" style=\"color:#10b981;\"></ion-icon> \u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21</h4>\n            <div class=\"guide-raw-content\">{{ userGuideContent }}</div>\n          </div>\n\n          <button *ngIf=\"canManageGuide\" (click)=\"editGuide()\" class=\"guide-edit-btn\">\n            <ion-icon name=\"create-outline\"></ion-icon> \u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21\n          </button>\n        </div>\n\n        <div *ngIf=\"isEditingGuide\" style=\"display: flex; flex-direction: column; height: 100%;\">\n          <div style=\"font-size: 12px; color: #94a3b8; margin-bottom: 8px;\">\u0E04\u0E38\u0E13\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E43\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E18\u0E23\u0E23\u0E21\u0E14\u0E32 \u0E2B\u0E23\u0E37\u0E2D Markdown (\u0E16\u0E49\u0E32\u0E21\u0E35\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E25\u0E07)</div>\n          <textarea [(ngModel)]=\"tempGuideContent\" style=\"flex: 1; min-height: 300px; width: 100%; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid #334155; border-radius: 6px; color: #e8eaf6; font-size: 13.5px; resize: none; line-height: 1.5; outline: none; font-family: sans-serif;\" placeholder=\"\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E17\u0E35\u0E48\u0E19\u0E35\u0E48...\"></textarea>\n          \n          <div style=\"display: flex; gap: 8px; margin-top: 16px; padding-bottom: 20px;\">\n            <button (click)=\"cancelEditGuide()\" style=\"flex: 1; padding: 10px; background: transparent; border: 1px solid #475569; color: #94a3b8; border-radius: 6px; cursor: pointer; font-weight: 500;\">\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01</button>\n            <button (click)=\"saveGuide()\" style=\"flex: 1; padding: 10px; background: #3b82f6; border: none; color: #fff; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s;\">\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- History Panel (right slide-in drawer) -->\n  <div class=\"annot-history-drawer\" [class.open]=\"showHistoryPanel\">\n    <div class=\"annot-history-drawer__backdrop\" (click)=\"showHistoryPanel = false\"></div>\n    <div class=\"annot-history-drawer__panel\">\n      <div class=\"annot-history-drawer__header\">\n        <span><ion-icon name=\"time-outline\"></ion-icon> \u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02</span>\n        <button (click)=\"showHistoryPanel = false\"><ion-icon name=\"close-outline\"></ion-icon></button>\n      </div>\n\n      <div class=\"annot-history-loading\" *ngIf=\"isLoadingHistory\">\n        <ion-spinner name=\"dots\"></ion-spinner>\n      </div>\n\n      <div class=\"annot-history-list\" *ngIf=\"!isLoadingHistory\">\n        <div class=\"annot-history-entry\" *ngFor=\"let h of historyEntries\">\n          <div class=\"annot-history-entry__icon\" [class]=\"'hi-' + h.action_type\">\n            <ion-icon [name]=\"getHistoryActionIcon(h.action_type)\"></ion-icon>\n          </div>\n          <div class=\"annot-history-entry__body\">\n            <div class=\"annot-history-entry__title\">\n              {{ getHistoryActionLabel(h.action_type) }}\n              <span class=\"annot-history-entry__page\" *ngIf=\"h.page_number > 0\">\u0E2B\u0E19\u0E49\u0E32 {{ h.page_number }}</span>\n            </div>\n            <div class=\"annot-history-entry__user\">{{ h.user_name || h.user_id || '\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49' }}</div>\n            <div class=\"annot-history-entry__time\">{{ h.created_at | date:'dd/MM/yyyy HH:mm' }}</div>\n          </div>\n        </div>\n        <div class=\"annot-history-empty\" *ngIf=\"historyEntries.length === 0\">\n          <ion-icon name=\"time-outline\"></ion-icon>\n          <p>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34</p>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Hidden file input for signature upload (always in DOM) -->\n  <input type=\"file\" #signatureFileInput accept=\"image/*\" style=\"display:none\"\n    (change)=\"onSignatureFileSelected($event)\">\n\n  <!-- Signature Pad Modal -->\n  <div class=\"signature-modal\" *ngIf=\"showSignaturePad\">\n    <div class=\"signature-modal__backdrop\" (click)=\"closeSignaturePad()\"></div>\n    <div class=\"signature-modal__content\">\n      <h3>\u0E25\u0E07\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19</h3>\n      <p class=\"signature-modal__hint\">\u0E27\u0E32\u0E14\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E43\u0E19\u0E01\u0E23\u0E2D\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07 (\u0E22\u0E01\u0E1B\u0E32\u0E01\u0E01\u0E32\u0E41\u0E25\u0E49\u0E27\u0E27\u0E32\u0E14\u0E15\u0E48\u0E2D\u0E44\u0E14\u0E49)</p>\n\n      <!-- Pen Options -->\n      <div class=\"signature-modal__pen-options\">\n        <div class=\"pen-option-group\">\n          <span class=\"pen-option-label\">\u0E2A\u0E35:</span>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setSignaturePenColor('#000000')\"\n              [class.active]=\"signaturePenColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setSignaturePenColor('#0000FF')\"\n              [class.active]=\"signaturePenColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setSignaturePenColor('#FF0000')\"\n              [class.active]=\"signaturePenColor === '#FF0000'\"></div>\n          </div>\n        </div>\n        <div class=\"pen-option-group\">\n          <span class=\"pen-option-label\">\u0E02\u0E19\u0E32\u0E14:</span>\n          <button class=\"pen-size-btn\" (click)=\"changeSignaturePenSize(-0.5)\" [disabled]=\"signaturePenSize <= 1\">\n            <ion-icon name=\"remove\"></ion-icon>\n          </button>\n          <span class=\"pen-size-val\">{{ signaturePenSize }}</span>\n          <button class=\"pen-size-btn\" (click)=\"changeSignaturePenSize(0.5)\" [disabled]=\"signaturePenSize >= 10\">\n            <ion-icon name=\"add\"></ion-icon>\n          </button>\n        </div>\n      </div>\n\n      <canvas #signatureCanvas class=\"signature-modal__canvas\"></canvas>\n\n      <div class=\"signature-modal__actions\">\n        <ion-button fill=\"outline\" color=\"medium\" (click)=\"clearSignaturePad()\">\n          <ion-icon name=\"refresh\" slot=\"start\"></ion-icon>\n          \u0E25\u0E49\u0E32\u0E07\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"danger\" (click)=\"closeSignaturePad()\">\n          <ion-icon name=\"close\" slot=\"start\"></ion-icon>\n          \u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"tertiary\" (click)=\"triggerSignatureUpload()\">\n          <ion-icon name=\"image-outline\" slot=\"start\"></ion-icon>\n          \u0E2D\u0E31\u0E1E\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E39\u0E1B\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"success\" (click)=\"saveSignatureToDatabase()\">\n          <ion-icon name=\"cloud-upload\" slot=\"start\"></ion-icon>\n          \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49\u0E43\u0E0A\u0E49\u0E20\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E07\n        </ion-button>\n        <ion-button color=\"primary\" (click)=\"saveSignature()\">\n          <ion-icon name=\"checkmark\" slot=\"start\"></ion-icon>\n          \u0E43\u0E0A\u0E49\u0E04\u0E23\u0E31\u0E49\u0E07\u0E19\u0E35\u0E49\n        </ion-button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Signature Picker Modal -->\n  <div class=\"signature-picker-modal\" *ngIf=\"showSignaturePicker\">\n    <div class=\"signature-picker-modal__backdrop\" (click)=\"closeSignaturePicker()\"></div>\n    <div class=\"signature-picker-modal__content\">\n      <h3>\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19</h3>\n      <p class=\"signature-picker-modal__hint\">\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49 \u0E2B\u0E23\u0E37\u0E2D\u0E27\u0E32\u0E14\u0E43\u0E2B\u0E21\u0E48</p>\n\n      <div class=\"signature-picker-modal__loading\" *ngIf=\"isLoadingSignatures\">\n        <ion-spinner name=\"crescent\"></ion-spinner>\n        <span>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14...</span>\n      </div>\n\n      <div class=\"signature-picker-modal__list\" *ngIf=\"!isLoadingSignatures\">\n        <div class=\"signature-item\" *ngFor=\"let sig of savedSignatures\" (click)=\"useSavedSignature(sig)\">\n          <img [src]=\"sig.signature_data\" [alt]=\"sig.signature_name\" />\n          <div class=\"signature-item__info\">\n            <span class=\"signature-item__name\">{{ sig.signature_name }}</span>\n            <span class=\"signature-item__badge\" *ngIf=\"sig.is_default\">\u0E2B\u0E25\u0E31\u0E01</span>\n          </div>\n          <div class=\"signature-item__actions\">\n            <button class=\"signature-item__btn\" (click)=\"setDefaultSignature(sig, $event)\"\n              [class.active]=\"sig.is_default\" title=\"\u0E15\u0E31\u0E49\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E2B\u0E25\u0E31\u0E01\">\n              <ion-icon name=\"star\"></ion-icon>\n            </button>\n            <button class=\"signature-item__btn signature-item__btn--delete\" (click)=\"deleteSavedSignature(sig, $event)\"\n              title=\"\u0E25\u0E1A\">\n              <ion-icon name=\"trash\"></ion-icon>\n            </button>\n          </div>\n        </div>\n\n        <div class=\"signature-picker-modal__empty\" *ngIf=\"savedSignatures.length === 0\">\n          <ion-icon name=\"create-outline\"></ion-icon>\n          <p>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49</p>\n        </div>\n      </div>\n\n      <div class=\"signature-picker-modal__actions\">\n        <ion-button fill=\"outline\" color=\"medium\" (click)=\"closeSignaturePicker()\">\n          <ion-icon name=\"close\" slot=\"start\"></ion-icon>\n          \u0E1B\u0E34\u0E14\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"secondary\" (click)=\"triggerSignatureUpload()\">\n          <ion-icon name=\"cloud-upload\" slot=\"start\"></ion-icon>\n          \u0E2D\u0E31\u0E1E\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E39\u0E1B\n        </ion-button>\n        <ion-button color=\"primary\" (click)=\"openSignaturePadFromPicker()\">\n          <ion-icon name=\"create\" slot=\"start\"></ion-icon>\n          \u0E27\u0E32\u0E14\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E43\u0E2B\u0E21\u0E48\n        </ion-button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Preview Overlay -->\n  <div class=\"preview-overlay\" *ngIf=\"showPreviewOverlay\">\n    <div class=\"preview-header\">\n      <div class=\"preview-title\">{{ isCancelMode ? '\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E19\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01' : '\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E19\u0E25\u0E07\u0E19\u0E32\u0E21' }}</div>\n      <div class=\"preview-actions\">\n        <ion-button fill=\"clear\" color=\"dark\" (click)=\"backToEdit()\">\n          <ion-icon slot=\"start\" name=\"arrow-back-outline\"></ion-icon>\n          \u0E01\u0E25\u0E31\u0E1A\u0E44\u0E1B\u0E41\u0E01\u0E49\u0E44\u0E02\n        </ion-button>\n        <ion-button color=\"success\" (click)=\"confirmSave()\">\n          <ion-icon slot=\"start\" name=\"checkmark-done-outline\"></ion-icon>\n          {{ isCancelMode ? '\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01' : '\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E41\u0E25\u0E30\u0E25\u0E07\u0E19\u0E32\u0E21' }}\n        </ion-button>\n      </div>\n    </div>\n    <div class=\"preview-scroll-area\">\n    <div class=\"preview-body\">\n      <div class=\"preview-filter-bar\" *ngIf=\"previewIsFiltered || isLoadingAllPreview\">\n        <ion-icon name=\"information-circle-outline\"></ion-icon>\n        <span>\u0E41\u0E2A\u0E14\u0E07\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E21\u0E35\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02 ({{ previewPages.length }} / {{ previewTotalPages }} \u0E2B\u0E19\u0E49\u0E32)</span>\n        <ion-button fill=\"clear\" size=\"small\" (click)=\"loadAllPreviewPages()\" [disabled]=\"isLoadingAllPreview\">\n          <ion-spinner *ngIf=\"isLoadingAllPreview\" name=\"crescent\" slot=\"start\"></ion-spinner>\n          <span *ngIf=\"!isLoadingAllPreview\">\u0E41\u0E2A\u0E14\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 {{ previewTotalPages }} \u0E2B\u0E19\u0E49\u0E32</span>\n          <span *ngIf=\"isLoadingAllPreview\">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14...</span>\n        </ion-button>\n      </div>\n      <div class=\"preview-pages\" *ngIf=\"previewPages.length > 0\">\n        <img *ngFor=\"let page of previewPages; let i = index\" [src]=\"page\" [alt]=\"'Page ' + (i + 1)\"\n          class=\"preview-page-img\">\n      </div>\n      <div *ngIf=\"previewPages.length === 0\" class=\"preview-loading\">\n        <ion-spinner name=\"crescent\"></ion-spinner>\n        <p>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14 Preview...</p>\n      </div>\n    </div>\n    </div>\n  </div>\n\n  <!-- Custom Context Menu -->\n  <div class=\"custom-context-menu\" *ngIf=\"contextMenu.show\" [style.left.px]=\"contextMenu.x\" [style.top.px]=\"contextMenu.y\">\n    <button class=\"menu-btn\" (click)=\"contextBringToFront()\">\n      <ion-icon name=\"arrow-up-circle-outline\"></ion-icon> \u0E19\u0E33\u0E44\u0E1B\u0E44\u0E27\u0E49\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E38\u0E14 (Bring to Front)\n    </button>\n    <button class=\"menu-btn\" (click)=\"contextBringForward()\">\n      <ion-icon name=\"chevron-up-outline\"></ion-icon> \u0E19\u0E33\u0E44\u0E1B\u0E02\u0E49\u0E32\u0E07\u0E2B\u0E19\u0E49\u0E32 (Bring Forward)\n    </button>\n    <button class=\"menu-btn\" (click)=\"contextSendBackward()\">\n      <ion-icon name=\"chevron-down-outline\"></ion-icon> \u0E2A\u0E48\u0E07\u0E44\u0E1B\u0E02\u0E49\u0E32\u0E07\u0E2B\u0E25\u0E31\u0E07 (Send Backward)\n    </button>\n    <button class=\"menu-btn\" (click)=\"contextSendToBack()\">\n      <ion-icon name=\"arrow-down-circle-outline\"></ion-icon> \u0E2A\u0E48\u0E07\u0E44\u0E1B\u0E44\u0E27\u0E49\u0E2B\u0E25\u0E31\u0E07\u0E2A\u0E38\u0E14 (Send to Back)\n    </button>\n    <div class=\"menu-divider\"></div>\n    <button class=\"menu-btn danger-btn\" (click)=\"deleteContextMenuTarget()\">\n      <ion-icon name=\"trash-outline\"></ion-icon> \u0E25\u0E1A (Delete)\n    </button>\n  </div>\n\n</ion-content>",
                styles: ["@charset \"UTF-8\";:host{display:block;height:100%}.annotator-content{--background: #f1f5f9;height:100%;overflow:hidden;position:relative}.annotator-content::part(scroll){display:flex;flex-direction:column;height:100%;overflow:hidden}ion-header{box-shadow:0 2px 8px #0000000d}ion-header ion-toolbar{--background: #fff;--color: #1e293b;--padding-top: 8px;--padding-bottom: 8px}.annotator-layout{display:flex;height:100%;width:100%;min-height:0;overflow:hidden;position:relative}.annotator-layout-v2{display:flex;flex-direction:column;height:100%;width:100%;min-height:0;overflow:hidden}.toolbar-row{display:flex;align-items:center;background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:6px 12px;grid-gap:8px;gap:8px;flex-shrink:0}.toolbar-row--nav{background:#fff}.toolbar-row--tools{background:#f1f5f9;flex-wrap:wrap}.toolbar-group{display:flex;align-items:center;grid-gap:4px;gap:4px}.toolbar-group--zoom,.toolbar-group--pager{grid-gap:2px;gap:2px}.toolbar-group--save{margin-left:auto}.toolbar-divider{width:1px;height:24px;background:#e2e8f0;margin:0 8px}.toolbar-spacer{flex:1}.toolbar-label{font-size:12px;color:#64748b;min-width:50px;text-align:center}.toolbar-btn{display:flex;align-items:center;justify-content:center;grid-gap:4px;gap:4px;background:transparent;border:1px solid transparent;border-radius:6px;padding:6px 10px;cursor:pointer;transition:all .15s ease;color:#475569;font-size:13px}.toolbar-btn ion-icon{font-size:18px}.toolbar-btn .zoom-icon{font-size:10px;margin-left:-4px}.toolbar-btn:hover:not(:disabled){background:#e2e8f0}.toolbar-btn:disabled{opacity:.4;cursor:not-allowed}.toolbar-btn.active{background:#3b82f6;color:#fff;border-color:#2563eb}.toolbar-btn--guide{background:rgba(14,165,233,.1);color:#0ea5e9;border:1px solid rgba(14,165,233,.3);padding:6px 12px}.toolbar-btn--guide:hover{background:rgba(14,165,233,.2)}.toolbar-btn--guide.active{background:#0ea5e9;color:#fff;border-color:#0284c7}.toolbar-btn--save{background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);color:#fff;padding:7px 16px;font-weight:700;font-size:14px;border-radius:8px;border:1px solid #16a34a;box-shadow:0 2px 8px #22c55e59;letter-spacing:.2px;transition:all .2s ease}.toolbar-btn--save ion-icon{font-size:17px}.toolbar-btn--save:hover:not(:disabled){background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);box-shadow:0 4px 14px #22c55e80;transform:translateY(-1px)}.toolbar-btn--save:active{transform:translateY(0);box-shadow:0 2px 6px #22c55e4d}.toolbar-btn--danger{color:#ef4444}.toolbar-btn--danger:hover{background:#fee2e2}.toolbar-btn--toggle{font-size:11px;padding:4px 6px;grid-gap:2px;gap:2px}.toolbar-btn--toggle ion-icon{font-size:14px}.toolbar-btn--toggle .toggle-label{font-size:9px;font-weight:600;letter-spacing:.5px}.tool-item{display:flex;align-items:center;grid-gap:4px;gap:4px}.tool-options{display:flex;align-items:center;grid-gap:4px;gap:4px;background:#f1f5f9;padding:4px 8px;border-radius:6px;border:1px solid #e2e8f0}.tool-options button{width:24px;height:24px;border:none;background:#fff;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center}.tool-options button:hover{background:#e2e8f0}.tool-options button:disabled{opacity:.4}.tool-options button ion-icon{font-size:14px}.tool-options span{font-size:11px;min-width:24px;text-align:center;color:#64748b}.color-dots{display:flex;grid-gap:4px;gap:4px;margin-left:4px}.color-dot{width:16px;height:16px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:all .15s ease;position:relative;overflow:hidden}.color-dot:hover{transform:scale(1.1)}.color-dot.active{border-color:#1e293b;box-shadow:0 0 0 2px #fff,0 0 0 4px currentColor}.color-dot--custom{box-shadow:0 0 0 1px #cbd5e1}.color-dot--custom input[type=color]{position:absolute;top:-10px;left:-10px;width:40px;height:40px;cursor:pointer;opacity:0}.color-dot--custom:hover{box-shadow:0 0 0 1.5px #94a3b8}.insert-page-tool{position:relative}.insert-page-tool .insert-badge-icon{font-size:11px!important;margin-left:-6px;margin-top:-8px;color:#22c55e}.insert-page-dropdown{position:absolute;top:calc(100% + 4px);right:0;z-index:500}.insert-page-backdrop{position:fixed;inset:0;z-index:499}.insert-page-menu{position:relative;z-index:500;background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:8px;box-shadow:0 6px 24px #00000024;min-width:220px;display:flex;flex-direction:column;grid-gap:4px;gap:4px}.insert-page-title{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;padding:2px 6px 6px;border-bottom:1px solid #f1f5f9;margin-bottom:2px}.insert-page-btn{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:9px 12px;border:1px solid transparent;border-radius:7px;background:transparent;cursor:pointer;color:#334155;font-size:13px;text-align:left;transition:all .15s}.insert-page-btn small{color:#94a3b8;font-size:11px}.insert-page-btn ion-icon{font-size:16px;color:#3b82f6;flex-shrink:0}.insert-page-btn:hover:not(:disabled){background:#eff6ff;border-color:#bfdbfe;color:#1e40af}.insert-page-btn:hover:not(:disabled) ion-icon{color:#1d4ed8}.insert-page-btn:active:not(:disabled){background:#dbeafe}.insert-page-btn:disabled{opacity:.35;cursor:not-allowed}.insert-page-btn--danger ion-icon{color:#ef4444}.insert-page-btn--danger:hover:not(:disabled){background:#fff1f2;border-color:#fecaca;color:#b91c1c}.insert-page-btn--danger:hover:not(:disabled) ion-icon{color:#dc2626}.insert-page-btn--danger:active:not(:disabled){background:#fee2e2}.insert-page-btn--undo ion-icon{color:#f59e0b}.insert-page-btn--undo:hover:not(:disabled){background:#fffbeb;border-color:#fde68a;color:#92400e}.insert-page-btn--undo:hover:not(:disabled) ion-icon{color:#d97706}.insert-page-btn--undo:active:not(:disabled){background:#fef3c7}.insert-orient-row{display:flex;align-items:center;grid-gap:8px;gap:8px;padding:4px 6px 8px}.insert-orient-label{font-size:12px;color:#64748b;white-space:nowrap;flex-shrink:0}.insert-orient-group{display:flex;grid-gap:4px;gap:4px;flex:1}.insert-orient-btn{display:flex;align-items:center;grid-gap:5px;gap:5px;flex:1;justify-content:center;padding:6px 8px;border:1.5px solid #e2e8f0;border-radius:7px;background:#f8fafc;cursor:pointer;font-size:12px;color:#475569;transition:all .15s}.insert-orient-btn ion-icon{font-size:15px}.insert-orient-btn:hover{background:#f1f5f9;border-color:#cbd5e1}.insert-orient-btn.active{background:#eff6ff;border-color:#3b82f6;color:#1e40af;font-weight:600}.insert-orient-btn.active ion-icon{color:#3b82f6}.insert-page-title--danger{color:#ef4444!important;background:#fff1f2;border-radius:5px;padding:3px 6px 6px!important}.insert-menu-divider{height:1px;background:#f1f5f9;margin:2px 0 4px}.shape-tool-item{position:relative;display:flex;align-items:flex-start;grid-gap:4px;gap:4px;flex-wrap:nowrap}.shape-chevron{font-size:10px!important;margin-left:-2px;opacity:.7}.mark-tool-item{position:relative;display:flex;align-items:flex-start}.mark-toolbar-btn{display:flex!important;flex-direction:row!important;align-items:center!important;grid-gap:4px!important;gap:4px!important;padding:0 8px!important;min-width:unset!important}.mark-btn-label{font-size:11px;font-weight:600;white-space:nowrap;letter-spacing:-.01em}.mark-chevron{font-size:10px!important;opacity:.7}.mark-popup{position:absolute;top:calc(100% + 6px);left:0;z-index:300;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 6px 24px #00000024;padding:12px 14px;min-width:210px;display:flex;flex-direction:column;grid-gap:8px;gap:8px}.mark-popup-section-label{font-size:11px;font-weight:600;color:#64748b;letter-spacing:.02em}.mark-popup-divider{height:1px;background:#f1f5f9;margin:0}.mark-quick-row{display:flex;grid-gap:8px;gap:8px;align-items:center}.mark-quick-btn{width:44px;height:44px;border:1.5px solid #e2e8f0;border-radius:8px;background:#f8fafc;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#1e293b;padding:0;transition:background .12s,border-color .12s}.mark-quick-btn:hover{background:#e2e8f0}.mark-quick-btn.active{background:#dbeafe;border-color:#3b82f6;color:#1d4ed8}.mark-form-list{display:flex;flex-direction:column;grid-gap:2px;gap:2px}.mark-form-row-btn{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:7px 8px;border:none;border-radius:7px;background:transparent;cursor:pointer;color:#1e293b;font-size:13.5px;text-align:left;transition:background .1s}.mark-form-row-btn:hover{background:#f1f5f9}.mark-form-row-btn.active{background:#dbeafe;color:#1d4ed8}.mark-form-row-icon{width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.mark-form-row-icon--text{font-size:14px;font-weight:700;color:inherit}.mark-controls-row{display:flex;align-items:center;grid-gap:4px;gap:4px}.mark-controls-row button{width:24px;height:24px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}.mark-controls-row button:hover{background:#e2e8f0}.mark-controls-row button:disabled{opacity:.4;cursor:default}.mark-size-val{min-width:22px;text-align:center;font-size:12px;font-weight:500}.mark-cancel-btn{width:100%;display:flex;align-items:center;justify-content:center;grid-gap:6px;gap:6px;padding:7px 0;border:none;border-radius:6px;background:#f1f5f9;color:#64748b;font-size:13px;font-weight:500;cursor:pointer;transition:background .15s,color .15s}.mark-cancel-btn ion-icon{font-size:16px}.mark-cancel-btn:hover{background:#fee2e2;color:#ef4444}.shape-dropdown{position:absolute;top:calc(100% + 4px);left:0;z-index:300;display:flex;flex-direction:column;grid-gap:2px;gap:2px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:6px;box-shadow:0 4px 16px #0000001f;min-width:46px}.shape-dropdown .shape-dd-btn{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid transparent;border-radius:6px;background:transparent;cursor:pointer;color:#475569;transition:all .15s}.shape-dropdown .shape-dd-btn ion-icon{font-size:18px}.shape-dropdown .shape-dd-btn:hover{background:#f1f5f9;color:#1e293b}.shape-dropdown .shape-dd-btn.active{background:#3b82f6;color:#fff;border-color:#2563eb}.shape-options-panel{display:flex;align-items:center;grid-gap:8px;gap:8px;flex-wrap:wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:5px 10px;margin-left:2px}.shape-opt-group{display:flex;align-items:center;grid-gap:5px;gap:5px}.shape-opt-label{font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap}.sopt-divider{width:1px;height:30px;background:#e2e8f0;flex-shrink:0}.sopt-btn{display:flex;align-items:center;justify-content:center;width:22px;height:22px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;color:#475569;transition:background .12s}.sopt-btn ion-icon{font-size:13px}.sopt-btn:hover:not(:disabled){background:#e2e8f0}.sopt-btn:disabled{opacity:.35;cursor:not-allowed}.sopt-val{font-size:11px;font-weight:600;color:#475569;min-width:18px;text-align:center}.sopt-fill-toggle{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border:1px solid #e2e8f0;border-radius:5px;background:#fff;cursor:pointer;color:#94a3b8;transition:all .15s}.sopt-fill-toggle ion-icon{font-size:15px}.sopt-fill-toggle:hover{background:#f1f5f9;color:#475569}.sopt-fill-toggle.active{background:#3b82f6;color:#fff;border-color:#2563eb}.mac-color-grid{display:grid;grid-template-columns:repeat(8,16px);grid-gap:2px;gap:2px;transition:opacity .15s}.mac-color-grid.disabled{opacity:.3;pointer-events:none}.mac-swatch{width:16px;height:16px;border-radius:3px;border:1.5px solid rgba(0,0,0,.18);cursor:pointer;transition:transform .1s,box-shadow .1s;flex-shrink:0}.mac-swatch:hover{transform:scale(1.25);z-index:2;box-shadow:0 2px 6px #0003}.mac-swatch.active{transform:scale(1.15);box-shadow:0 0 0 2px #fff,0 0 0 3.5px #3b82f6;z-index:3}.mac-swatch--current{width:22px;height:22px;border-radius:4px;border:2px solid #cbd5e1;cursor:default;pointer-events:none}.mac-swatch--current:hover{transform:none}.mac-custom-color{display:flex;align-items:center;grid-gap:3px;gap:3px;transition:opacity .15s}.mac-custom-color.disabled{opacity:.3;pointer-events:none}.mac-custom-color input[type=color]{width:22px;height:22px;border:2px solid #cbd5e1;border-radius:4px;padding:1px;cursor:pointer;background:none}.mac-custom-color input[type=color]::-webkit-color-swatch-wrapper{padding:0}.mac-custom-color input[type=color]::-webkit-color-swatch{border:none;border-radius:2px}@media (max-width: 767px){.shape-options-panel{padding:4px 6px;grid-gap:5px;gap:5px}.mac-color-grid{grid-template-columns:repeat(8,13px)}.mac-color-grid .mac-swatch{width:13px;height:13px}}.main-area{display:flex;flex:1;min-height:0;overflow:hidden}.thumbnails-sidebar{width:148px;min-width:148px;background:#1a2232;display:flex;flex-direction:column;overflow:visible;position:relative;z-index:10}.thumb-list{flex:1;overflow-y:auto;overflow-x:visible;display:flex;flex-direction:column;align-items:center;padding:8px 0 16px;grid-gap:0;gap:0;scrollbar-width:thin;scrollbar-color:#334155 #1a2232}.thumb-list::-webkit-scrollbar{width:5px}.thumb-list::-webkit-scrollbar-track{background:#1a2232}.thumb-list::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}.thumb-card-wrap{width:120px;display:flex;flex-direction:column;border-radius:10px;overflow:hidden;box-shadow:0 3px 12px #0000004d;flex-shrink:0}.thumb-card{width:120px;background:#243044;border-radius:0;overflow:hidden;cursor:pointer;border:2.5px solid transparent;border-bottom:none;transition:border-color .15s}.thumb-card-wrap:hover>.thumb-card{border-color:#63b3ed66}.thumb-card-wrap:has(.thumb-card.active)>.thumb-card{border-color:#3b82f6}.thumb-card.active{border-color:#3b82f6}.thumb-card__img-wrap{padding:6px 6px 0;overflow:hidden;border-radius:8px 8px 0 0}.thumb-card__img-wrap img{width:100%;border-radius:5px;display:block;box-shadow:0 2px 8px #0006}.thumb-card__label{display:block;text-align:center;color:#94a3b8;font-size:11px;font-weight:500;padding:4px 0 3px}.thumb-card__actions{display:flex;align-items:center;justify-content:space-around;padding:5px 4px;background:#0f172a;border-top:1px solid #334155;border-radius:0 0 8px 8px}.thumb-action-btn{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border:1px solid #334155;border-radius:6px;background:#1e293b;color:#94a3b8;cursor:pointer;transition:all .15s;flex-shrink:0}.thumb-action-btn ion-icon{font-size:15px}.thumb-action-btn:hover:not(:disabled){background:#334155;color:#e2e8f0;border-color:#475569}.thumb-action-btn:disabled{opacity:.25;cursor:not-allowed}.thumb-action-btn--danger{color:#f87171;border-color:#7f1d1d;background:#1c0a0a}.thumb-action-btn--danger:hover:not(:disabled){background:#450a0a;border-color:#ef4444;color:#fca5a5}.thumb-insert-row{display:flex;align-items:center;justify-content:center;width:100%;padding:6px 0;position:relative;flex-shrink:0}.thumb-insert-slot{position:relative;display:flex;align-items:center;justify-content:center}.thumb-add-btn{width:32px;height:32px;border-radius:50%;border:2px solid #3b82f6;background:#1e40af;color:#93c5fd;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;box-shadow:0 2px 8px #3b82f666}.thumb-add-btn ion-icon{font-size:18px;font-weight:700}.thumb-add-btn:hover{background:#2563eb;color:#fff;transform:scale(1.1);box-shadow:0 4px 14px #3b82f680}.thumb-add-btn:active{transform:scale(.95)}.thumb-insert-dropdown{position:fixed;left:158px;z-index:2000;transform:translateY(-50%)}.thumb-insert-backdrop{position:fixed;inset:0;z-index:698}.thumb-insert-menu{position:relative;z-index:699;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:8px;box-shadow:0 8px 32px #0000002e;min-width:210px;display:flex;flex-direction:column;grid-gap:2px;gap:2px}.thumb-insert-menu:before{content:\"\";position:absolute;left:-8px;top:50%;transform:translateY(-50%);border:8px solid transparent;border-right-color:#fff;border-left:none}.thumb-insert-opt{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:10px 14px;border:1px solid transparent;border-radius:8px;background:transparent;cursor:pointer;color:#1e293b;font-size:14px;font-family:inherit;text-align:left;transition:all .15s}.thumb-insert-opt ion-icon{font-size:18px;color:#3b82f6;flex-shrink:0}.thumb-insert-opt:hover{background:#eff6ff;border-color:#bfdbfe;color:#1e40af}.thumb-insert-opt:hover ion-icon{color:#1d4ed8}.thumb-insert-opt:active{background:#dbeafe}.viewer-wrapper{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}.viewer-container{flex:1;overflow-y:auto;overflow-x:auto;background:#f1f5f9;display:flex;flex-direction:column;align-items:center;padding:20px;grid-gap:20px;gap:20px}.page-container{position:relative;box-shadow:0 4px 12px #00000026;background:#fff;flex-shrink:0}.page-container .pdf-canvas,.page-container .annot-canvas{display:block}.page-container .annot-canvas{position:absolute;top:0;left:0;touch-action:none}@media (max-width: 767px){.toolbar-row{padding:4px 8px;grid-gap:4px;gap:4px;flex-wrap:wrap}.toolbar-row--tools{padding:6px 8px}.toolbar-btn{padding:4px 6px}.toolbar-btn ion-icon{font-size:16px}.toolbar-btn span{display:none}.toolbar-divider{margin:0 4px}.thumbnails-sidebar{width:80px;min-width:80px;padding:8px 4px}.thumbnail-item img{max-width:64px}.tool-options{display:none}.hint{display:none}}@media (max-width: 480px){.thumbnails-sidebar{display:none}.toolbar-label{min-width:30px;font-size:10px}}.sidebar{width:200px;min-width:200px;background:#1e293b;color:#fff;display:flex;flex-direction:column;padding:16px;z-index:100;box-shadow:4px 0 15px #0000001a;overflow-y:auto}.sidebar__section{margin-bottom:24px}.sidebar__section--nav{background:rgba(255,255,255,.05);padding:12px;border-radius:12px;margin-bottom:20px;display:flex;flex-direction:column;grid-gap:12px;gap:12px}.sidebar__section--save{margin-top:auto;padding-top:20px;border-top:1px solid rgba(255,255,255,.1)}.sidebar__title{font-size:11px;font-weight:700;color:#fff6;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}.sidebar__row{display:flex;grid-gap:8px;gap:8px;margin-bottom:8px}.sidebar__row--wrap{flex-wrap:wrap}.sidebar__btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;grid-gap:6px;gap:6px;padding:10px 4px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fffc;font-size:11px;cursor:pointer;transition:all .2s;box-shadow:0 2px 4px #0000001a}.sidebar__btn ion-icon{font-size:20px}.sidebar__btn:hover:not([disabled]){background:rgba(255,255,255,.15);color:#fff;transform:translateY(-1px);box-shadow:0 4px 8px #0003}.sidebar__btn.active{background:#3b82f6;color:#fff;border-color:#60a5fa;box-shadow:0 4px 12px #3b82f666}.sidebar__btn[disabled]{opacity:.3;cursor:not-allowed}.sidebar__btn--signature{background:rgba(139,92,246,.1);border-color:#8b5cf64d;color:#a78bfa}.sidebar__btn--signature.active,.sidebar__btn--signature:hover:not([disabled]){background:#8b5cf6;color:#fff}.sidebar__btn--date{background:rgba(16,185,129,.1);border-color:#10b9814d;color:#34d399}.sidebar__btn--date.active,.sidebar__btn--date:hover:not([disabled]){background:#10b981;color:#fff}.sidebar__btn--warning{background:rgba(239,68,68,.1);border-color:#ef44444d;color:#f87171}.sidebar__btn--warning:hover:not([disabled]){background:#ef4444;color:#fff}.sidebar__btn--save{background:#10b981;color:#fff;flex-direction:row;grid-gap:10px;gap:10px;font-size:14px;font-weight:600;padding:14px;box-shadow:0 4px 12px #10b98140}.sidebar__btn--save:hover:not([disabled]){background:#059669;box-shadow:0 6px 18px #10b98166}.sidebar__btn--small{flex:0 0 calc(50% - 4px);padding:8px}.sidebar__picker{display:flex;align-items:center;grid-gap:8px;gap:8px;padding:6px 8px;margin-bottom:6px;border-radius:6px;background:rgba(255,255,255,.05)}.sidebar__picker label{font-size:11px;color:#fff9;min-width:60px}.sidebar__picker input[type=color]{width:24px;height:24px;border:2px solid rgba(255,255,255,.2);border-radius:4px;cursor:pointer;padding:0}.sidebar__picker input[type=range]{flex:1;max-width:50px}.sidebar__picker span{font-size:11px;color:#ffffffb3;min-width:20px;text-align:right}.main-content{flex:1;display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;background:#cbd5e1}.topbar-desktop{display:flex;align-items:center;justify-content:center;padding:8px 20px;background:#fff;border-bottom:1px solid #e2e8f0;box-shadow:0 2px 4px #00000005;min-height:56px}.topbar-desktop__tools{display:flex;align-items:center;grid-gap:12px;gap:12px}.topbar-desktop__tool-btn{display:flex;align-items:center;grid-gap:6px;gap:6px;padding:8px 14px;border:none;border-radius:8px;background:#fff;color:#475569;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s ease;box-shadow:0 2px 5px #00000014}.topbar-desktop__tool-btn ion-icon{font-size:18px}.topbar-desktop__tool-btn:hover:not([disabled]){background:#f1f5f9;color:#1e293b;transform:translateY(-1px);box-shadow:0 4px 10px #0000001f}.topbar-desktop__tool-btn.active{background:#3b82f6;color:#fff}.topbar-desktop__tool-btn[disabled]{opacity:.4;cursor:not-allowed}.topbar-desktop .tool-option{display:flex;align-items:center;grid-gap:8px;gap:8px;background:#fff;padding:2px 8px;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 2px 5px #0000000d}.topbar-desktop .tool-option .size-controls{display:flex;align-items:center;grid-gap:4px;gap:4px;padding-left:8px;border-left:1px solid #e2e8f0}.topbar-desktop .tool-option .size-controls button{background:none;border:none;padding:4px;cursor:pointer;color:#64748b;display:flex;align-items:center}.topbar-desktop .tool-option .size-controls button:hover:not([disabled]){color:#3b82f6}.topbar-desktop .tool-option .size-controls button[disabled]{opacity:.3}.topbar-desktop .tool-option .size-controls .size-val{font-size:12px;font-weight:700;min-width:20px;text-align:center}.topbar-desktop .tool-option .size-controls .format-btn{background:none;border:none;border-radius:4px;padding:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#64748b;transition:all .2s}.topbar-desktop .tool-option .size-controls .format-btn:hover{background:#f1f5f9;color:#1e293b}.topbar-desktop .tool-option .size-controls .format-btn.active{color:#3b82f6;background:#eff6ff}.topbar-desktop .tool-option .size-controls .format-btn--text{font-family:serif;font-size:16px}.topbar-desktop .tool-option .size-controls .format-btn--text span{display:block;width:18px;text-align:center}.topbar-desktop .tool-option .size-controls .format-btn ion-icon{font-size:18px}.topbar-desktop .tool-option .size-controls .color-palette{display:flex;align-items:center;grid-gap:6px;gap:6px;margin-left:8px}.topbar-desktop .tool-option .size-controls .color-palette .color-dot{width:16px;height:16px;border-radius:50%;cursor:pointer;border:2px solid #e2e8f0;transition:transform .2s}.topbar-desktop .tool-option .size-controls .color-palette .color-dot:hover{transform:scale(1.2)}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.active{border-color:#3b82f6;transform:scale(1.1)}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.blue{background:#0000FF}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.red{background:#FF0000}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.black{background:#000000}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.green{background:#008000}.topbar-desktop__divider{width:1px;height:24px;background:#e2e8f0;margin:0 4px}.topbar-desktop__divider--small{height:16px;opacity:.6}.topbar-desktop .save-btn{background:#10b981;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-weight:600;display:flex;align-items:center;grid-gap:8px;gap:8px;cursor:pointer;box-shadow:0 2px 4px #10b98133;margin-left:20px}.topbar-desktop .save-btn:hover{background:#059669}.topbar-pager,.topbar-zoom{display:flex;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:2px 6px;grid-gap:8px;gap:8px;height:38px}.topbar-pager__btn,.topbar-zoom__btn{background:transparent;border:none;padding:6px;cursor:pointer;color:#64748b;display:flex;align-items:center;border-radius:4px;transition:all .2s}.topbar-pager__btn:hover:not([disabled]),.topbar-zoom__btn:hover:not([disabled]){background:#f1f5f9;color:#3b82f6}.topbar-pager__btn[disabled],.topbar-zoom__btn[disabled]{opacity:.3;cursor:not-allowed}.topbar-pager__btn ion-icon,.topbar-zoom__btn ion-icon{font-size:16px}.topbar-pager__info,.topbar-pager__val,.topbar-zoom__info,.topbar-zoom__val{font-size:13px;font-weight:700;color:#475569;min-width:45px;text-align:center;-webkit-user-select:none;user-select:none}.topbar-zoom .fit-btn{font-size:11px;font-weight:700;text-transform:uppercase;color:#3b82f6;background:transparent;border:none;padding:4px 10px;cursor:pointer;letter-spacing:.5px}.topbar-zoom .fit-btn:hover{color:#2563eb;text-decoration:underline}.viewer-container{flex:1;overflow:auto!important;position:relative;padding:40px 20px;background:#cbd5e1;scrollbar-width:thin;-webkit-overflow-scrolling:touch;touch-action:auto;text-align:center}.page-container{position:relative;display:inline-block;margin-bottom:30px;background:#fff;box-shadow:0 10px 30px #00000026;text-align:left}.page-container.single-page{margin-bottom:0}.pdf-canvas{display:block}.annot-canvas{position:absolute;top:0;left:0;z-index:10;touch-action:auto;pointer-events:none}.annot-canvas.tools-active{pointer-events:auto;touch-action:none!important;-webkit-touch-callout:none!important;-webkit-user-select:none!important;user-select:none!important}.text-box{position:absolute;pointer-events:auto;border-radius:2px;border:1px solid transparent;background:transparent;display:flex;flex-direction:column;z-index:20;min-width:30px;min-height:20px;box-sizing:border-box;cursor:move;padding:3px}.text-box:hover{border-color:#c0c4cb}.text-box.active{border:1px solid #c0c4cb;background:transparent}.text-box textarea{width:100%;height:100%;border:none;background:transparent;padding:0 3px;resize:none;outline:none;font-family:\"THSarabunNew\",sans-serif;font-size:inherit;font-weight:inherit;font-style:inherit;text-align:inherit;color:inherit;overflow:hidden;display:block;line-height:1.4;box-sizing:border-box;cursor:text}.text-box .tb-handle{position:absolute;width:12px;height:12px;background:#1a73e8;border:2px solid #fff;border-radius:50%;top:50%;transform:translateY(-50%);cursor:ew-resize;z-index:27;display:none;box-shadow:0 1px 3px #00000040}.text-box .tb-handle--left{left:-6px}.text-box .tb-handle--right{right:-6px}.text-box.active .tb-handle{display:block}.image-stamp,.signature-stamp{position:absolute;pointer-events:auto;cursor:move;border:1px dashed transparent;z-index:20;touch-action:none}.image-stamp:hover,.signature-stamp:hover{border-color:#3b82f6}.image-stamp:hover .remove-btn,.signature-stamp:hover .remove-btn{opacity:1}.image-stamp img,.signature-stamp img{width:100%;height:100%;display:block;-webkit-user-select:none;user-select:none;pointer-events:none}.image-stamp.mark-stamp-active{outline:2px solid #3b82f6;outline-offset:2px;border-color:#3b82f6}.image-stamp.mark-stamp-active .resize-handle{opacity:1}.image-stamp.mark-stamp-active .remove-btn{opacity:1}.image-stamp .mark-options-bar{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translate(-50%);background:#1e293b;border:1px solid #334155;border-radius:8px;display:flex;align-items:center;grid-gap:1px;gap:1px;padding:3px 5px;z-index:50;white-space:nowrap;box-shadow:0 4px 14px #00000073;pointer-events:auto}.image-stamp .mark-options-bar .pff-opt-btn{width:24px;height:24px;border:none;background:transparent;color:#e2e8f0;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;padding:0;flex-shrink:0}.image-stamp .mark-options-bar .pff-opt-btn:hover{background:rgba(255,255,255,.1)}.image-stamp .mark-options-bar .pff-opt-btn.pff-opt-delete{color:#f87171}.image-stamp .mark-options-bar .pff-opt-btn.pff-opt-delete:hover{background:rgba(239,68,68,.2)}.image-stamp .mark-options-bar .pff-opt-btn[disabled]{opacity:.3;cursor:not-allowed;pointer-events:none}.image-stamp .mark-options-bar .pff-opt-val{font-size:11px;color:#e2e8f0;min-width:22px;text-align:center;font-weight:600;line-height:1}.image-stamp .mark-options-bar .pff-opt-label{font-size:11px;color:#94a3b8;margin:0 2px;display:flex;align-items:center}.image-stamp .mark-options-bar .pff-opt-label ion-icon{font-size:13px}.image-stamp .mark-options-bar .pff-opt-sep{width:1px;height:16px;background:#334155;margin:0 3px;flex-shrink:0}.shape-stamp{position:absolute;pointer-events:auto;cursor:move;border:1px dashed transparent;z-index:20;touch-action:none;overflow:visible}.shape-stamp svg{display:block;width:100%;height:100%;overflow:visible;pointer-events:none;-webkit-user-select:none;user-select:none}.shape-stamp:hover{border-color:#3b82f699}.shape-stamp:hover .remove-btn{opacity:1}.shape-stamp:hover .resize-handle{opacity:1}.signature-stamp img{mix-blend-mode:multiply}.signature-stamp .digital-id-label{position:absolute;left:100%;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;grid-gap:0;gap:0;pointer-events:none;white-space:nowrap;margin-left:6px}.signature-stamp .digital-id-label span{font-size:8px;color:#555;font-family:\"Courier New\",monospace;letter-spacing:.3px;line-height:1.4}.signature-stamp .remove-btn{position:absolute;top:-10px;left:-10px;width:20px;height:20px;background:#ef4444;color:#fff;border:none;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .2s;z-index:26}.pdf-form-field{position:absolute;pointer-events:auto;cursor:move;box-sizing:border-box;touch-action:none;z-index:20}.pdf-form-field.pff-mark{border:1.5px solid #3b82f6;border-radius:3px;background:transparent;min-width:10px;min-height:10px}.pdf-form-field.pff-text{border:1.5px solid #3b82f6;border-radius:3px;background:rgba(219,234,254,.25);min-width:40px;min-height:14px}.pdf-form-field.pff-checkbox{border:1.5px solid #3b82f6;border-radius:3px;background:rgba(219,234,254,.2);min-width:14px;min-height:14px}.pdf-form-field.pff-radio{border:1.5px solid #3b82f6;border-radius:50%;background:rgba(219,234,254,.2);min-width:14px;min-height:14px}.pdf-form-field:hover{border-color:#1d4ed8}.pdf-form-field:hover .remove-btn{opacity:1}.pdf-form-field .pff-inner{width:100%;height:100%;display:flex;align-items:center;justify-content:center;pointer-events:none}.pdf-form-field .pff-text-hint{font-size:10px;color:#3b82f6;font-weight:600;opacity:.8;-webkit-user-select:none;user-select:none}.pdf-form-field .remove-btn{position:absolute;top:-8px;right:-8px;width:16px;height:16px;background:#ef4444;color:#fff;border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;opacity:0;transition:opacity .15s;z-index:30;pointer-events:auto}.pdf-form-field .resize-handle{opacity:0}.pdf-form-field:hover .resize-handle{opacity:1}.pdf-form-field.pff-no-border{border-color:transparent!important;background:rgba(219,234,254,.08)}.pdf-form-field.pff-active{outline:2px solid #3b82f6;outline-offset:1px}.pdf-form-field.pff-active .pff-resize-handle{opacity:1}.pdf-form-field:hover .pff-resize-handle{opacity:1}.pdf-form-field .pff-resize-handle{position:absolute;width:8px;height:8px;background:#3b82f6;border:1.5px solid #fff;border-radius:50%;z-index:25;touch-action:none;opacity:0;transition:opacity .15s}.pdf-form-field .pff-resize-handle.rh-nw{top:-4px;left:-4px;cursor:nw-resize}.pdf-form-field .pff-resize-handle.rh-n{top:-4px;left:calc(50% - 4px);cursor:n-resize}.pdf-form-field .pff-resize-handle.rh-ne{top:-4px;right:-4px;cursor:ne-resize}.pdf-form-field .pff-resize-handle.rh-e{top:calc(50% - 4px);right:-4px;cursor:e-resize}.pdf-form-field .pff-resize-handle.rh-se{bottom:-4px;right:-4px;cursor:se-resize}.pdf-form-field .pff-resize-handle.rh-s{bottom:-4px;left:calc(50% - 4px);cursor:s-resize}.pdf-form-field .pff-resize-handle.rh-sw{bottom:-4px;left:-4px;cursor:sw-resize}.pdf-form-field .pff-resize-handle.rh-w{top:calc(50% - 4px);left:-4px;cursor:w-resize}.pdf-form-field .pff-options-bar{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translate(-50%);background:#1e293b;border:1px solid #334155;border-radius:8px;display:flex;align-items:center;grid-gap:1px;gap:1px;padding:3px 5px;z-index:50;white-space:nowrap;box-shadow:0 4px 14px #00000073;pointer-events:auto}.pdf-form-field .pff-options-bar .pff-opt-btn{width:24px;height:24px;border:none;background:transparent;color:#e2e8f0;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;padding:0;flex-shrink:0}.pdf-form-field .pff-options-bar .pff-opt-btn:hover{background:rgba(255,255,255,.1)}.pdf-form-field .pff-options-bar .pff-opt-btn.pff-opt-active{background:rgba(59,130,246,.3);color:#60a5fa}.pdf-form-field .pff-options-bar .pff-opt-btn.pff-opt-delete{color:#f87171}.pdf-form-field .pff-options-bar .pff-opt-btn.pff-opt-delete:hover{background:rgba(239,68,68,.2)}.pdf-form-field .pff-options-bar .pff-opt-btn[disabled]{opacity:.3;cursor:not-allowed;pointer-events:none}.pdf-form-field .pff-options-bar .pff-opt-val{font-size:11px;color:#e2e8f0;min-width:22px;text-align:center;font-weight:600;line-height:1}.pdf-form-field .pff-options-bar .pff-opt-label{font-size:11px;color:#94a3b8;margin:0 2px;font-style:italic;font-weight:700;display:flex;align-items:center}.pdf-form-field .pff-options-bar .pff-opt-label ion-icon{font-size:13px}.pdf-form-field .pff-options-bar .pff-opt-sep{width:1px;height:16px;background:#334155;margin:0 3px;flex-shrink:0}.date-stamp{position:absolute;pointer-events:auto;cursor:move;padding:4px 8px;background:rgba(255,255,255,.8);border:1px dashed #ccc;border-radius:4px;white-space:nowrap;font-family:\"THSarabunNew\",sans-serif;z-index:20;touch-action:none}.date-stamp:hover{border-color:#3b82f6}.date-stamp:hover .remove-btn{opacity:1}.date-stamp .remove-btn{position:absolute;top:-8px;right:-8px;width:16px;height:16px;background:#ef4444;color:#fff;border:none;border-radius:50%;font-size:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .2s}.resize-handle{position:absolute;width:10px;height:10px;background:#3b82f6;border:1px solid #fff;border-radius:50%;z-index:22;touch-action:none;display:none}.resize-handle.rh-nw{top:-5px;left:-5px;cursor:nw-resize}.resize-handle.rh-n{top:-5px;left:calc(50% - 5px);cursor:n-resize}.resize-handle.rh-ne{top:-5px;right:-5px;cursor:ne-resize}.resize-handle.rh-e{top:calc(50% - 5px);right:-5px;cursor:e-resize}.resize-handle.rh-se{bottom:-5px;right:-5px;cursor:se-resize}.resize-handle.rh-s{bottom:-5px;left:calc(50% - 5px);cursor:s-resize}.resize-handle.rh-sw{bottom:-5px;left:-5px;cursor:sw-resize}.resize-handle.rh-w{top:calc(50% - 5px);left:-5px;cursor:w-resize}.image-stamp:hover .resize-handle,.signature-stamp:hover .resize-handle,.shape-stamp:hover .resize-handle{display:block}@media (max-width: 991px){.topbar-desktop__tools{display:none}}@media (max-width: 767px){.annotator-layout{flex-direction:column}.sidebar{width:100%;height:auto;max-height:140px;min-width:0;order:2;flex-direction:row;flex-wrap:wrap;overflow-x:auto;overflow-y:auto;padding:8px 12px;grid-gap:8px;gap:8px;scrollbar-width:none;-ms-overflow-style:none;justify-content:center;align-items:flex-start}.sidebar::-webkit-scrollbar{display:none}.sidebar__section{margin-bottom:0;flex-shrink:0;display:flex;flex-direction:row;justify-content:center;align-items:center}.sidebar__section--nav,.sidebar__section--save,.sidebar__section .sidebar__title{display:none}.sidebar__row{margin-bottom:0;grid-gap:6px;gap:6px;display:flex;flex-wrap:wrap;justify-content:center}.sidebar__btn{width:48px;height:48px;flex:none;font-size:9px;padding:4px}.sidebar__btn ion-icon{font-size:20px}.sidebar__btn span{display:none}.topbar-desktop{display:flex;padding:8px 12px}.topbar-desktop .save-btn,.topbar-desktop .doc-title{display:none}.topbar-desktop .topbar-desktop__left{display:none}.topbar-desktop .topbar-desktop__center{margin:0 auto}.viewer{padding:10px}}.mobile-pager{display:none}@media (max-width: 767px){.mobile-pager{display:flex;position:absolute;top:60px;right:16px;z-index:10;background:rgba(0,0,0,.6);color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;backdrop-filter:blur(4px)}}.loading-overlay{position:fixed;inset:0;z-index:20003;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)}.loading-overlay .loading-content{background:#fff;padding:32px 48px;border-radius:16px;text-align:center}.loading-overlay .loading-content ion-spinner{--color: #3b82f6;width:48px;height:48px}.loading-overlay .loading-content .loading-msg{margin-top:16px;font-size:14px;color:#334155}.loading-overlay .loading-content--progress{min-width:300px;padding:28px 32px}.loading-overlay .loading-content--progress .save-progress-icon{display:flex;align-items:center;justify-content:center;grid-gap:10px;gap:10px;margin-bottom:16px}.loading-overlay .loading-content--progress .save-progress-icon ion-icon{font-size:36px;color:#3b82f6}.loading-overlay .loading-content--progress .save-progress-icon .save-progress-pct{font-size:32px;font-weight:800;color:#1e293b;letter-spacing:-1px;line-height:1;min-width:64px;text-align:left}.loading-overlay .loading-content--progress .save-progress-bar-track{width:100%;height:10px;background:#e2e8f0;border-radius:99px;overflow:hidden;margin-bottom:14px}.loading-overlay .loading-content--progress .save-progress-bar-track .save-progress-bar-fill{height:100%;background:linear-gradient(90deg,#3b82f6 0%,#06b6d4 100%);border-radius:99px;transition:width .3s ease,background .5s ease}.loading-overlay .loading-content--progress .save-progress-bar-track .save-progress-bar-fill--preview{background:linear-gradient(90deg,#06b6d4 0%,#22c55e 100%)}.loading-overlay .loading-content--progress .save-progress-bar-track .save-progress-bar-fill--serializing{background:linear-gradient(90deg,#3b82f6 0%,#8b5cf6 50%,#3b82f6 100%);background-size:200% 100%;animation:shimmerBar 1.5s linear infinite}.loading-overlay .loading-content--progress .save-progress-phases{display:flex;justify-content:space-between;grid-gap:8px;gap:8px;margin-bottom:12px}.loading-overlay .loading-content--progress .save-progress-phases span{display:flex;align-items:center;grid-gap:4px;gap:4px;font-size:11.5px;color:#94a3b8;transition:color .3s}.loading-overlay .loading-content--progress .save-progress-phases span ion-icon{font-size:13px}.loading-overlay .loading-content--progress .save-progress-phases span.active{color:#3b82f6;font-weight:600}.loading-overlay .loading-content--progress .loading-msg{font-size:13px;color:#64748b;margin-top:4px}.signature-modal,.signature-picker-modal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center}.signature-modal__backdrop,.signature-picker-modal__backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)}.signature-modal__content,.signature-picker-modal__content{position:relative;background:#fff;padding:28px 36px;border-radius:20px;box-shadow:0 24px 60px #00000040;text-align:center;width:95%;max-width:500px}@media (max-width: 500px){.signature-modal__content,.signature-picker-modal__content{padding:20px}}.signature-modal__content h3,.signature-picker-modal__content h3{margin:0 0 8px;font-size:22px;font-weight:600;color:#1e293b}.signature-modal__hint,.signature-picker-modal__hint{margin:0 0 20px;font-size:14px;color:#64748b}.signature-modal__canvas,.signature-picker-modal__canvas{display:block;width:100%;height:auto;aspect-ratio:2/1;border:2px solid #e2e8f0;border-radius:12px;background:#fff;cursor:crosshair;touch-action:none}.signature-modal__actions,.signature-picker-modal__actions{display:flex;grid-gap:12px;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap}.signature-modal__pen-options,.signature-picker-modal__pen-options{display:flex;align-items:center;justify-content:center;grid-gap:20px;gap:20px;margin-bottom:16px;padding:8px 16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0}.signature-modal__pen-options .pen-option-group,.signature-picker-modal__pen-options .pen-option-group{display:flex;align-items:center;grid-gap:8px;gap:8px}.signature-modal__pen-options .pen-option-label,.signature-picker-modal__pen-options .pen-option-label{font-size:13px;color:#64748b;font-weight:500}.signature-modal__pen-options .pen-size-btn,.signature-picker-modal__pen-options .pen-size-btn{width:28px;height:28px;border:1px solid #e2e8f0;background:#fff;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}.signature-modal__pen-options .pen-size-btn:hover:not(:disabled),.signature-picker-modal__pen-options .pen-size-btn:hover:not(:disabled){background:#e2e8f0}.signature-modal__pen-options .pen-size-btn:disabled,.signature-picker-modal__pen-options .pen-size-btn:disabled{opacity:.4;cursor:not-allowed}.signature-modal__pen-options .pen-size-btn ion-icon,.signature-picker-modal__pen-options .pen-size-btn ion-icon{font-size:14px}.signature-modal__pen-options .pen-size-val,.signature-picker-modal__pen-options .pen-size-val{font-size:13px;font-weight:600;min-width:28px;text-align:center;color:#334155}.signature-picker-modal__list{flex:1;overflow-y:auto;max-height:40vh;padding:4px 0;margin:16px 0}.signature-item{display:flex;align-items:center;grid-gap:14px;gap:14px;padding:12px 14px;margin-bottom:8px;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;transition:all .15s}.signature-item:hover{border-color:#3b82f6;background:#f8fafc;transform:translate(4px)}.signature-item img{width:100px;height:50px;object-fit:contain;background:#fff;border-radius:6px;border:1px solid #e2e8f0}.signature-item__info{flex:1;display:flex;flex-direction:column;grid-gap:4px;gap:4px;text-align:left}.signature-item__name{font-size:14px;font-weight:500;color:#1e293b}.signature-item__badge{display:inline-block;padding:2px 8px;font-size:11px;font-weight:600;color:#3b82f6;background:#eff6ff;border-radius:10px;width:-moz-fit-content;width:fit-content}.signature-item__actions{display:flex;grid-gap:6px;gap:6px}.signature-item__btn{width:32px;height:32px;border:none;border-radius:8px;background:#f1f5f9;color:#64748b;display:flex;align-items:center;justify-content:center}.signature-item__btn:hover{background:#e2e8f0;color:#334155}.signature-item__btn.active{background:#fef3c7;color:#f59e0b}.signature-item__btn--delete:hover{background:#fee2e2;color:#ef4444}.hint{background:#f8fafc;padding:10px 20px;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0}.preview-overlay{position:fixed;top:0;left:0;width:100%;height:100dvh;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);z-index:20001;display:flex;flex-direction:column;overflow:hidden;animation:fadeIn .3s ease-out}.preview-overlay .preview-header{flex-shrink:0;position:relative;background:#fff;padding:14px 24px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 12px #0000001f;z-index:20002}.preview-overlay .preview-header .preview-title{font-size:1.1rem;font-weight:700;color:#1f2937;display:flex;align-items:center;grid-gap:8px;gap:8px}.preview-overlay .preview-header .preview-title:before{content:\"\";display:inline-block;width:4px;height:20px;background:linear-gradient(180deg,#22c55e,#16a34a);border-radius:2px}.preview-overlay .preview-header .preview-actions{display:flex;grid-gap:10px;gap:10px;align-items:center}.preview-overlay .preview-header .preview-actions ion-button[fill=clear]{--color: #64748b;font-weight:500;font-size:14px}.preview-overlay .preview-header .preview-actions ion-button[color=success]{--background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);--background-activated: #15803d;--background-hover: #16a34a;--color: #fff;--border-radius: 10px;--padding-start: 22px;--padding-end: 22px;--padding-top: 12px;--padding-bottom: 12px;--box-shadow: 0 4px 16px rgba(34, 197, 94, .45);font-weight:700;font-size:15px;letter-spacing:.3px;animation:confirmPulse 2.4s ease-in-out infinite}.preview-overlay .preview-scroll-area{flex:1;overflow-y:auto;overflow-x:hidden}.preview-overlay .preview-body{min-height:100%;padding:20px;display:flex;flex-direction:column;align-items:center}.preview-overlay .preview-body .preview-filter-bar{display:flex;align-items:center;grid-gap:8px;gap:8px;background:rgba(255,193,7,.15);border:1px solid rgba(255,193,7,.4);border-radius:8px;padding:8px 14px;margin-bottom:12px;width:100%;max-width:1100px;color:#ffe082;font-size:13px}.preview-overlay .preview-body .preview-filter-bar ion-icon{font-size:18px;flex-shrink:0}.preview-overlay .preview-body .preview-filter-bar span{flex:1}.preview-overlay .preview-body .preview-filter-bar ion-button{--color: #ffe082;--border-color: rgba(255, 193, 7, .5);border:1px solid rgba(255,193,7,.5);border-radius:6px;flex-shrink:0}.preview-overlay .preview-body iframe{width:100%;height:100%;max-width:1100px;background:white;border-radius:8px;box-shadow:0 10px 25px #0000004d}.preview-overlay .preview-body .preview-pages{display:flex;flex-direction:column;grid-gap:16px;gap:16px;max-width:1100px;width:100%}.preview-overlay .preview-body .preview-page-img{width:100%;background:white;border-radius:8px;box-shadow:0 4px 12px #00000026}.preview-overlay .preview-body .preview-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;grid-gap:16px;gap:16px}.preview-overlay .preview-body .preview-loading ion-spinner{--color: white;width:48px;height:48px}.preview-overlay .preview-body .preview-loading p{font-size:16px;margin:0}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes shimmerBar{0%{background-position:200% 0}to{background-position:-200% 0}}@keyframes confirmPulse{0%,to{box-shadow:0 4px 16px #22c55e73}50%{box-shadow:0 4px 24px #22c55ebf,0 0 0 4px #22c55e26}}::ng-deep .textLayer{position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;opacity:1;line-height:1;z-index:5;--scale-factor: 1}::ng-deep .textLayer>span,::ng-deep .textLayer>br{color:transparent!important;position:absolute;white-space:pre;cursor:text;transform-origin:0% 0%}::ng-deep .textLayer ::selection{background:rgba(59,130,246,.3);color:transparent!important}.annot-history-drawer,.user-guide-drawer{position:absolute;top:0;right:0;bottom:0;left:0;z-index:999;pointer-events:none}.annot-history-drawer.open,.user-guide-drawer.open{pointer-events:auto}.annot-history-drawer__backdrop,.user-guide-drawer__backdrop{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .3s}.annot-history-drawer.open .annot-history-drawer__backdrop,.user-guide-drawer.open .annot-history-drawer__backdrop,.annot-history-drawer.open .user-guide-drawer__backdrop,.user-guide-drawer.open .user-guide-drawer__backdrop{background:rgba(0,0,0,.45)}.annot-history-drawer__panel,.user-guide-drawer__panel{position:absolute;top:0;right:0;bottom:0;width:min(340px,92vw);background:#1e293b;border-left:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;transform:translate(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);box-shadow:-6px 0 28px #00000059}.annot-history-drawer.open .annot-history-drawer__panel,.user-guide-drawer.open .annot-history-drawer__panel,.annot-history-drawer.open .user-guide-drawer__panel,.user-guide-drawer.open .user-guide-drawer__panel{transform:translate(0)}.annot-history-drawer__header,.user-guide-drawer__header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 12px;border-bottom:1px solid rgba(255,255,255,.07);font-size:14px;font-weight:700;color:#e8eaf6}.annot-history-drawer__header ion-icon,.user-guide-drawer__header ion-icon{margin-right:6px;color:#6c8ef5;vertical-align:-2px}.annot-history-drawer__header button,.user-guide-drawer__header button{background:none;border:none;color:#8892b0;cursor:pointer;font-size:20px;display:flex;align-items:center}.annot-history-drawer__header button:hover,.user-guide-drawer__header button:hover{color:#e8eaf6}.annot-history-drawer__loading,.user-guide-drawer__loading{display:flex;align-items:center;justify-content:center;padding:40px;color:#8892b0}.annot-history-drawer__loading ion-spinner,.user-guide-drawer__loading ion-spinner{--color: #6c8ef5}.annot-history-list{flex:1;overflow-y:auto;padding:6px 0;scrollbar-width:thin;scrollbar-color:#334155 #1e293b}.annot-history-list::-webkit-scrollbar{width:5px}.annot-history-list::-webkit-scrollbar-track{background:#1e293b}.annot-history-list::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}.annot-history-entry{display:flex;align-items:flex-start;grid-gap:11px;gap:11px;padding:9px 14px;border-bottom:1px solid rgba(255,255,255,.04);transition:background .12s}.annot-history-entry:last-child{border-bottom:none}.annot-history-entry:hover{background:rgba(255,255,255,.03)}.annot-history-entry__icon{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;background:rgba(108,142,245,.15);color:#6c8ef5}.annot-history-entry__icon.hi-sign{background:rgba(74,222,128,.15);color:#4ade80}.annot-history-entry__icon.hi-save{background:rgba(251,191,36,.15);color:#fbbf24}.annot-history-entry__icon.hi-page_delete{background:rgba(255,77,109,.15);color:#ff4d6d}.annot-history-entry__icon.hi-page_insert{background:rgba(94,234,212,.15);color:#5eead4}.annot-history-entry__icon.hi-upload{background:rgba(167,139,250,.15);color:#a78bfa}.annot-history-entry__icon.hi-draw{background:rgba(251,113,133,.15);color:#fb7185}.annot-history-entry__icon.hi-highlight{background:rgba(251,191,36,.15);color:#fbbf24}.annot-history-entry__icon.hi-text{background:rgba(147,197,253,.15);color:#93c5fd}.annot-history-entry__body{flex:1;min-width:0}.annot-history-entry__title{font-size:13px;font-weight:600;color:#e8eaf6;display:flex;align-items:center;grid-gap:6px;gap:6px}.annot-history-entry__page{font-size:11px;background:rgba(108,142,245,.15);color:#6c8ef5;padding:1px 6px;border-radius:10px;font-weight:400}.annot-history-entry__user{font-size:12px;color:#8892b0;margin-top:2px}.annot-history-entry__time{font-size:11px;color:#8892b08c;margin-top:1px}.annot-history-empty{display:flex;flex-direction:column;align-items:center;padding:56px 24px;color:#8892b0;grid-gap:10px;gap:10px}.annot-history-empty ion-icon{font-size:36px;opacity:.4}.annot-history-empty p{font-size:13px;margin:0}.custom-context-backdrop{position:fixed;inset:0;z-index:99998;cursor:pointer;touch-action:none}.custom-context-menu{position:fixed;z-index:99999;background:rgba(255,255,255,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(0,0,0,.1);border-radius:8px;box-shadow:0 4px 16px #00000026;padding:4px;min-width:220px;display:flex;flex-direction:column}.custom-context-menu .menu-btn{display:flex;align-items:center;grid-gap:8px;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;cursor:pointer;font-size:13px;color:#334155;border-radius:4px;text-align:left;transition:background .1s}.custom-context-menu .menu-btn ion-icon{font-size:16px;color:#64748b}.custom-context-menu .menu-btn:hover{background:#3b82f6;color:#fff}.custom-context-menu .menu-btn:hover ion-icon{color:#fff}.custom-context-menu .menu-btn.danger-btn:hover{background:#ef4444;color:#fff}.custom-context-menu .menu-btn.danger-btn:hover ion-icon{color:#fff}.custom-context-menu .menu-divider{height:1px;background:rgba(0,0,0,.08);margin:4px 0}.user-guide-content-area{flex:1;overflow-y:auto;padding:20px;background:#0f172a}.guide-view-mode{display:flex;flex-direction:column;grid-gap:24px;gap:24px}.guide-banner{display:flex;grid-gap:12px;gap:12px;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:12px 14px;color:#eff6ff;font-size:13px;line-height:1.5}.guide-banner ion-icon{font-size:24px;color:#60a5fa;flex-shrink:0}.guide-banner code{background:rgba(255,255,255,.1);padding:2px 6px;border-radius:4px;font-size:11px;color:#93c5fd}.guide-section__title{display:flex;align-items:center;grid-gap:8px;gap:8px;font-size:15px;font-weight:600;color:#f8fafc;margin:0 0 12px}.guide-section__title ion-icon{font-size:18px}.guide-list{display:flex;flex-direction:column;grid-gap:12px;gap:12px}.guide-item{display:flex;grid-gap:10px;gap:10px;align-items:flex-start;background:rgba(255,255,255,.03);padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,.05)}.guide-item__icon{font-size:16px;color:#94a3b8;margin-top:2px;flex-shrink:0}.guide-item__text{font-size:13px;line-height:1.5;color:#cbd5e1}.guide-item__text strong{color:#f8fafc;font-weight:600}.guide-item__text code{background:rgba(0,0,0,.3);padding:2px 5px;border-radius:4px;font-size:11px;color:#cbd5e1;border:1px solid rgba(255,255,255,.1)}.guide-step{width:20px;height:20px;border-radius:50%;background:#334155;color:#fff;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;flex-shrink:0}.guide-raw-content{white-space:pre-wrap;color:#94a3b8;font-size:13px;line-height:1.6;background:rgba(0,0,0,.2);padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,.05)}.guide-edit-btn{width:100%;padding:10px;background:rgba(108,142,245,.1);color:#818cf8;border:1px solid rgba(129,140,248,.3);border-radius:8px;cursor:pointer;font-weight:500;transition:all .2s;display:flex;align-items:center;justify-content:center;grid-gap:8px;gap:8px}.guide-edit-btn:hover{background:rgba(108,142,245,.15);border-color:#818cf880}.guide-dot-demo{display:inline-block;width:10px;height:10px;background:#1a73e8;border:2px solid #fff;border-radius:50%;vertical-align:middle;box-shadow:0 1px 3px #0000004d}.guide-shortcuts-grid{display:grid;grid-template-columns:1fr 1fr;grid-gap:10px;gap:10px}.guide-shortcut-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;grid-gap:6px;gap:6px}.guide-shortcut-card__keys{display:flex;align-items:center;grid-gap:4px;gap:4px}.guide-shortcut-card__keys kbd{background:#1e293b;border:1px solid #334155;border-bottom:2px solid #475569;border-radius:5px;padding:3px 7px;font-size:11px;font-family:monospace;color:#e2e8f0;line-height:1.4}.guide-shortcut-card__keys span{color:#64748b;font-size:12px}.guide-shortcut-card__label{font-size:12px;color:#94a3b8;line-height:1.3}.guide-protip{display:flex;grid-gap:12px;gap:12px;background:linear-gradient(135deg,rgba(251,191,36,.08) 0%,rgba(245,158,11,.05) 100%);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:14px}.guide-protip__icon ion-icon{font-size:22px;color:#fbbf24;flex-shrink:0}.guide-protip__title{font-size:13px;font-weight:700;color:#fde68a;margin-bottom:8px;letter-spacing:.3px}.guide-protip__list{margin:0;padding-left:16px;display:flex;flex-direction:column;grid-gap:6px;gap:6px}.guide-protip__list li{font-size:12.5px;color:#cbd5e1;line-height:1.5}.guide-protip__list li code{background:rgba(0,0,0,.25);padding:1px 5px;border-radius:4px;font-size:11px;color:#fde68a;border:1px solid rgba(251,191,36,.2)}\n"]
            },] }
];
PdfAnnotatorModalComponent.ctorParameters = () => [
    { type: ModalController },
    { type: HttpClient },
    { type: NgZone },
    { type: ToastController },
    { type: AlertController },
    { type: ChangeDetectorRef },
    { type: DomSanitizer },
    { type: PdfManagerService },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [PDF_ANNOTATOR_CONFIG,] }] }
];
PdfAnnotatorModalComponent.propDecorators = {
    pdfUrl: [{ type: Input }],
    fileName: [{ type: Input }],
    canManageGuide: [{ type: Input }],
    pdfCanvases: [{ type: ViewChildren, args: ['pdfCanvas',] }],
    annotCanvases: [{ type: ViewChildren, args: ['annotCanvas',] }],
    fileInputRef: [{ type: ViewChild, args: ['fileInput', { static: false },] }],
    viewerContainerRef: [{ type: ViewChild, args: ['viewerContainer', { static: false },] }],
    signatureCanvasRef: [{ type: ViewChild, args: ['signatureCanvas', { static: false },] }],
    userId: [{ type: Input }],
    userName: [{ type: Input }],
    documentId: [{ type: Input }],
    detailId: [{ type: Input }],
    edocId: [{ type: Input }],
    isCancelMode: [{ type: Input }],
    signatureFileInputRef: [{ type: ViewChild, args: ['signatureFileInput', { static: false },] }],
    thumbFileInputRef: [{ type: ViewChild, args: ['thumbFileInput', { static: false },] }],
    onDocumentPointerDown: [{ type: HostListener, args: ['document:pointerdown', ['$event'],] }],
    handleKeyboard: [{ type: HostListener, args: ['window:keydown', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLWFubm90YXRvci1tb2RhbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wZGYtYW5ub3RhdG9yL3NyYy9saWIvcGRmLWFubm90YXRvci1tb2RhbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQWMsU0FBUyxFQUFFLFlBQVksRUFBYSxLQUFLLEVBQW9DLE1BQU0sRUFDMUcsWUFBWSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQ2xELE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxvQkFBb0IsRUFBc0IsTUFBTSxVQUFVLENBQUM7QUFDcEUsT0FBTyxFQUFFLFlBQVksRUFBbUIsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDcEQsT0FBTyxLQUFLLGFBQWEsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEtBQUssUUFBUSxNQUFNLFlBQVksQ0FBQztBQUN2QyxPQUFPLEVBQUUsaUJBQWlCLEVBQW1CLE1BQU0sdUJBQXVCLENBQUM7QUEwSTNFLE1BQU0sT0FBTywwQkFBMEI7SUFzYXJDLFlBQ1UsU0FBMEIsRUFDMUIsSUFBZ0IsRUFDaEIsSUFBWSxFQUNaLFNBQTBCLEVBQzFCLFNBQTBCLEVBQzFCLEdBQXNCLEVBQ3RCLFNBQXVCLEVBQ3ZCLE1BQXlCLEVBQ1MsTUFBaUM7O1FBUm5FLGNBQVMsR0FBVCxTQUFTLENBQWlC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Q0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLEtBQUssSUFBSSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNoRCxNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0QsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV6QixNQUFNLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0MsTUFBTSxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFdkMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ1YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzthQUN6QjtpQkFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ25DLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMzQixHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN2RTtpQkFBTTtnQkFDSixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDM0IsR0FBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzthQUMzRDtZQUNELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFTyxTQUFTLENBQUMsR0FBNkIsRUFBRSxDQUFTLEVBQUUsRUFBUztRQUNuRSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTztRQUNwQixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBRTlCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBRXZCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUMzQixHQUFHLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDeEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRWhCLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRTtZQUNmLEtBQUssTUFBTTtnQkFDVCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ25DLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRTtvQkFBRSxHQUFHLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUM7b0JBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUFFO2dCQUMvRCxNQUFNO1lBQ1IsS0FBSyxRQUFRLENBQUMsQ0FBQztnQkFDYixNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3pCLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDekIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFO29CQUFFLEdBQUcsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQUU7Z0JBQy9ELE1BQU07YUFDUDtZQUNELEtBQUssTUFBTTtnQkFDVCxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDbkIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ25CLE1BQU07WUFDUixLQUFLLE9BQU8sQ0FBQyxDQUFDO2dCQUNaLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNuQixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDbkIsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNiLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDbkIsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDbkIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNuQixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkcsTUFBTTthQUNQO1NBQ0Y7UUFDRCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQsNERBQTREO0lBQzVELE9BQU87UUFDTCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsSUFBSTtRQUNGLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLElBQUksSUFBSSxHQUErQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN2RSxJQUFJLENBQUMsSUFBSTtZQUFFLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFFbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLElBQUk7WUFBRSxPQUFPO1FBRWxCLElBQUksUUFBUSxJQUFJLElBQUk7WUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBYyxDQUFDLENBQUM7O1lBQ2hFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFhLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFJRCw0REFBNEQ7SUFDNUQsYUFBYSxDQUFDLEVBQVUsRUFBRSxFQUFnQjtRQUN4QyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELG9CQUFvQixDQUFDLEVBQWdCLEVBQUUsRUFBVTtRQUMvQyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRU8saUJBQWlCLENBQUMsQ0FBUztRQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRUQsU0FBUyxDQUFDLENBQWUsRUFBRSxTQUFpQjtRQUMxQyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssTUFBTTtZQUFFLE9BQU87UUFDckMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFeEIsOEVBQThFO1FBQzlFLElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7UUFFL0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTztRQUVoQiw4Q0FBOEM7UUFDOUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDNUMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7UUFFckQscUZBQXFGO1FBQ3JGLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFxQixDQUFDO1FBQ3ZDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsS0FBSyxVQUFVLEVBQUU7WUFDL0MsT0FBTztTQUNSO1FBRUQsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLGFBQTRCLENBQUM7UUFFakQsdURBQXVEO1FBQ3ZELFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUVyQywwREFBMEQ7UUFDMUQsTUFBTSxVQUFVLEdBQUcsU0FBUyxhQUFULFNBQVMsdUJBQVQsU0FBUyxDQUFFLGFBQWEsQ0FBQyxVQUFVLENBQStCLENBQUM7UUFDdEYsSUFBSSxVQUFVLEVBQUU7WUFDZCxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEIsVUFBVSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO1NBQ3pDO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUM7UUFDL0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVuRCxzRUFBc0U7UUFDdEUsTUFBTSxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDakQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFFbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQzFELElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztRQUV6RCxNQUFNLElBQUksR0FBRyxDQUFDLEVBQWdCLEVBQUUsRUFBRTtZQUNoQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTtnQkFBRSxPQUFPO1lBQ3BELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLENBQUM7Z0JBQUUsT0FBTztZQUVmLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ2pFLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBRWhFLHFCQUFxQjtZQUNyQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDMUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDO1FBRUYsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFDeEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDMUIsb0RBQW9EO1lBQ3BELFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUNqQyw4QkFBOEI7WUFDOUIsSUFBSSxVQUFVLEVBQUU7Z0JBQ2QsVUFBVSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDdkMsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO2FBQ3JDO1lBQ0QsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQztRQUVGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsRUFBZ0IsRUFBRSxTQUFpQjtRQUNsRCxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDcEIsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxTQUFTLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU87UUFDaEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELGNBQWMsQ0FBQyxLQUFZLEVBQUUsRUFBVztRQUN0QyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBNkIsQ0FBQztRQUVyRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFFeEIsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRCxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxpSEFBaUgsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxvQkFBb0IsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLGlCQUFpQixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDO1FBRXZRLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksR0FBRyxDQUFDO1lBQ3RDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLENBQUMsNEVBQTRFO1lBQzVILElBQUksU0FBUyxHQUFHLGNBQWM7Z0JBQUUsY0FBYyxHQUFHLFNBQVMsQ0FBQztZQUMzRCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsSUFBSSxVQUFVLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqRCwrRUFBK0U7WUFDL0UsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUV6QiwwRkFBMEY7WUFDMUYsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQzlCLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7WUFDOUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsZUFBZSxHQUFHLElBQUksQ0FBQyxDQUFDLHlCQUF5QjtZQUV6RSxNQUFNLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDN0Qsd0RBQXdEO1lBQ3hELEVBQUUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDM0U7UUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3pCLCtFQUErRTtRQUMvRSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELGNBQWMsQ0FBQyxFQUFVO1FBQ3ZCLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7UUFDL0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksRUFBRSxFQUFFO1lBQ04sSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDNUMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDdEQ7SUFDSCxDQUFDO0lBRUQsd0RBQXdEO0lBQ3hELFdBQVcsQ0FBQyxFQUFnQixFQUFFLFNBQWlCO1FBQzdDLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQzFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNyQixFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDcEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTztRQUVoQixtQkFBbUI7UUFDbkIsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7UUFDaEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztRQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM1QyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQztRQUVyRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztRQUNqQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7UUFDMUIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztRQUMxQixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQzdCLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFFOUIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFlLEVBQUUsRUFBRTtZQUMvQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZTtnQkFBRSxPQUFPO1lBQ3RELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLENBQUM7Z0JBQUUsT0FBTztZQUVmLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3JDLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBRXJDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxHQUFHLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMxRSxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFdBQVcsR0FBRyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDNUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUM7UUFFRixNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztZQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztZQUM1QixNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDO1FBRUYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxFQUFnQixFQUFFLFNBQWlCO1FBQ2xELElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQzFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNyQixFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDcEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTztRQUNoQixJQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztRQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztRQUNoQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO1FBQy9CLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztRQUMxQixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3hCLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBZSxFQUFFLEVBQUU7WUFDL0IsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ25CLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUM3RCxFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUM7UUFDRixNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELGVBQWUsQ0FBQyxFQUFnQixFQUFFLFNBQWlCO1FBQ2pELElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQzFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNyQixFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDcEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTztRQUNoQixJQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztRQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztRQUNoQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO1FBQy9CLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztRQUMxQixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDMUIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFlLEVBQUUsRUFBRTtZQUMvQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDbkIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQzdELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVEsR0FBRyxNQUFNLENBQUMsQ0FBQztZQUM1QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsRUFBRTtnQkFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFBQyxFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzthQUFFO1lBQ3hELElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkgsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxhQUFhLENBQUMsU0FBaUI7UUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUM7UUFDaEUsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUNwRSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFTyxlQUFlLENBQUMsRUFBVztRQUNqQywwREFBMEQ7UUFDMUQsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU8sb0JBQW9CO1FBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxnRUFBZ0U7SUFDaEUsa0JBQWtCOztRQUNoQixNQUFBLE1BQUEsSUFBSSxDQUFDLFlBQVksMENBQUUsYUFBYSwwQ0FBRSxLQUFLLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRU8sbUJBQW1CLENBQUMsT0FBZTtRQUN6QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUN4QixHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtnQkFDaEIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO2dCQUNoQyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUM7Z0JBQ2xDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLENBQUM7Z0JBQ3JDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDekIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUM7WUFDRixHQUFHLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLDBCQUEwQjtZQUNoRSxHQUFHLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxlQUFlLENBQUMsS0FBWTtRQUMxQixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBMEIsQ0FBQztRQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQUUsT0FBTztRQUU1QyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFFaEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFPLENBQUMsRUFBRSxFQUFFOztZQUMxQixNQUFNLFVBQVUsR0FBRyxNQUFBLENBQUMsQ0FBQyxNQUFNLDBDQUFFLE1BQWdCLENBQUM7WUFDOUMsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFM0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUN4QixHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQztnQkFDekIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQztnQkFDMUIsaUVBQWlFO2dCQUNqRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN2RCxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQztnQkFDbkMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7Z0JBRXBDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFO29CQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQzt3QkFBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO3FCQUFFO3lCQUNuQzt3QkFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO3dCQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7cUJBQUU7aUJBQy9DO2dCQUVELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO29CQUNwQixFQUFFLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNuRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ2pCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRztvQkFDaEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHO29CQUNoQyxLQUFLLEVBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRztvQkFDdEIsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUc7b0JBQ3RCLE9BQU87aUJBQ1IsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMzQixDQUFDLENBQUM7WUFDRixHQUFHLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUNwQixDQUFDLENBQUEsQ0FBQztRQUVGLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxnQ0FBZ0M7SUFDcEQsQ0FBQztJQUVELGNBQWMsQ0FBQyxDQUFlLEVBQUUsS0FBYTtRQUMzQyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssTUFBTTtZQUFFLE9BQU87UUFDckMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQztRQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLEdBQUc7WUFBRSxPQUFPO1FBRWpCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBRXpCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDbEQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFFbkQsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQzFELElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztRQUV6RCxNQUFNLElBQUksR0FBRyxDQUFDLEVBQWdCLEVBQUUsRUFBRTtZQUNoQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVztnQkFBRSxPQUFPO1lBQ3ZELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLENBQUM7Z0JBQUUsT0FBTztZQUVmLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ2pFLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBRWhFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUM7UUFFRixNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztZQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDO1FBRUYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxFQUFnQixFQUFFLE9BQWUsRUFBRSxZQUE2QixJQUFJO1FBQ25GLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQzFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNyQixFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFcEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLE9BQU8sQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxHQUFHO1lBQUUsT0FBTztRQUVqQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUM1QixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQztRQUU3QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7UUFDMUIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztRQUUxQixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQzlCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDL0IsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxQixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sV0FBVyxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFFOUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFlLEVBQUUsRUFBRTtZQUMvQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTtnQkFBRSxPQUFPO1lBQ3pELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLENBQUM7Z0JBQUUsT0FBTztZQUVmLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDcEUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUVyRSxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsNENBQTRDO1lBRXhFLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQztZQUN2QixJQUFJLElBQUksR0FBRyxXQUFXLENBQUM7WUFDdkIsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDO1lBQ3ZCLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQztZQUV2QixJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzNCLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxXQUFXLEdBQUcsV0FBVyxDQUFDLENBQUM7YUFDL0M7WUFDRCxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzNCLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxXQUFXLEdBQUcsV0FBVyxDQUFDLENBQUM7Z0JBQzlDLElBQUksR0FBRyxXQUFXLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDM0M7WUFDRCxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzNCLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxXQUFXLEdBQUcsV0FBVyxDQUFDLENBQUM7YUFDL0M7WUFDRCxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzNCLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxXQUFXLEdBQUcsV0FBVyxDQUFDLENBQUM7Z0JBQzlDLElBQUksR0FBRyxXQUFXLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDM0M7WUFFRCwrREFBK0Q7WUFDL0QsSUFBSSxPQUFPLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ25DLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUN0RCxJQUFJLEdBQUcsSUFBSSxHQUFHLFdBQVcsQ0FBQztvQkFDMUIsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUMzQixJQUFJLEdBQUcsV0FBVyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDO3FCQUMzQztpQkFDRjtxQkFBTTtvQkFDTCxJQUFJLEdBQUcsSUFBSSxHQUFHLFdBQVcsQ0FBQztvQkFDMUIsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUMzQixJQUFJLEdBQUcsV0FBVyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDO3FCQUMzQztpQkFDRjthQUNGO1lBRUQsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDZixDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUM7UUFFRixNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztZQUM3QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUMxQixNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDO1FBRUYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBZTtRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCx1REFBdUQ7SUFDdkQsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBRTNCLHlDQUF5QztRQUN6QyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDN0IsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsQ0FBQztJQUVELGlCQUFpQjtRQUNmLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsb0JBQW9CLENBQUMsS0FBYTtRQUNoQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxLQUFhO1FBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDOUMsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLE9BQU8sSUFBSSxFQUFFLEVBQUU7WUFDakMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQztTQUNqQztJQUNILENBQUM7SUFFTyxtQkFBbUI7O1FBQ3pCLE1BQU0sTUFBTSxHQUFHLE1BQUEsSUFBSSxDQUFDLGtCQUFrQiwwQ0FBRSxhQUFhLENBQUM7UUFDdEQsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPO1FBRXBCLDRDQUE0QztRQUM1QyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO1FBQ3ZDLE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNuRSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFdEQsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFbEQsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztZQUN2RCxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFDcEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztTQUN0QztRQUVELG1EQUFtRDtRQUNuRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNoRSxNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsbUJBQW1CLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUvRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFNTyxlQUFlLENBQUMsQ0FBZTtRQUNyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDO1FBQ3JELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzVDLE9BQU87WUFDTCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDMUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1NBQzFCLENBQUM7SUFDSixDQUFDO0lBRU8sZ0JBQWdCLENBQUMsQ0FBZTtRQUN0QyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztRQUMvQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU8sZUFBZSxDQUFDLENBQWU7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZO1lBQUUsT0FBTztRQUMzRCxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFbkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUvQixnREFBZ0Q7UUFDaEQsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVPLGNBQWMsQ0FBQyxDQUFlO1FBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCO1lBQUUsT0FBTztRQUNyQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1FBRWhDLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7Z0JBQ3pCLE1BQU0sRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztnQkFDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUI7Z0JBQzdCLElBQUksRUFBRSxJQUFJLENBQUMsZ0JBQWdCO2FBQzVCLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVPLHFCQUFxQjs7UUFDM0IsTUFBTSxNQUFNLEdBQUcsTUFBQSxJQUFJLENBQUMsa0JBQWtCLDBDQUFFLGFBQWEsQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVk7WUFBRSxPQUFPO1FBRTFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBRTlCLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTFCLGlDQUFpQztRQUNqQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsR0FBRyxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7UUFDNUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbEIsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUN4QixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNiLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVkLHlCQUF5QjtRQUN6QixLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEU7UUFFRCw2QkFBNkI7UUFDN0IsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUNqRztJQUNILENBQUM7SUFFTyxnQkFBZ0IsQ0FDdEIsR0FBNkIsRUFDN0IsTUFBa0MsRUFDbEMsS0FBYSxFQUNiLElBQVksRUFDWixRQUFnQixDQUFDO1FBRWpCLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQUUsT0FBTztRQUU5QixHQUFHLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN4QixHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDN0IsR0FBRyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdEIsR0FBRyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDdkIsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUVyRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3ZCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztTQUN0RDthQUFNO1lBQ0wsK0NBQStDO1lBQy9DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDekQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDekQsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzthQUM1RTtZQUNELHdCQUF3QjtZQUN4QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN2QyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FDNUM7UUFDRCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRUQsNkVBQTZFO0lBQ3JFLG1CQUFtQjs7UUFDekIsTUFBTSxTQUFTLEdBQUcsTUFBQSxJQUFJLENBQUMsa0JBQWtCLDBDQUFFLGFBQWEsQ0FBQztRQUN6RCxJQUFJLENBQUMsU0FBUztZQUFFLE9BQU8sRUFBRSxDQUFDO1FBRTFCLDJDQUEyQztRQUMzQyxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQztRQUMxQyxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsWUFBWSxJQUFJLEdBQUcsQ0FBQztRQUUzQyw2Q0FBNkM7UUFDN0MsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxDQUFDO1FBRTVDLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkQsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDdkIsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDeEIsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQztRQUV4QyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBRXZCLDRFQUE0RTtRQUM1RSxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQUUsU0FBUztZQUN2QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ25GO1FBQ0QsNEJBQTRCO1FBQzVCLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQzlHO1FBRUQsOEJBQThCO1FBQzlCLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkQsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRXhDLElBQUksR0FBRyxHQUFHLE1BQU0sRUFBRSxJQUFJLEdBQUcsS0FBSyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUV0RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzlCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLEtBQUssR0FBRyxFQUFFLEVBQUU7b0JBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRzt3QkFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUNyQixJQUFJLENBQUMsR0FBRyxNQUFNO3dCQUFFLE1BQU0sR0FBRyxDQUFDLENBQUM7b0JBQzNCLElBQUksQ0FBQyxHQUFHLElBQUk7d0JBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLEdBQUcsS0FBSzt3QkFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2lCQUMxQjthQUNGO1NBQ0Y7UUFFRCxtQkFBbUI7UUFDbkIsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLElBQUksR0FBRyxLQUFLO1lBQUUsT0FBTyxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTFFLGNBQWM7UUFDZCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQztRQUN4QyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDL0IsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDNUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFekMsTUFBTSxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7UUFDL0IsTUFBTSxLQUFLLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFL0IsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRCxVQUFVLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN6QixVQUFVLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUMxQixNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUxRSxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELGFBQWE7O1FBQ1gsTUFBTSxNQUFNLEdBQUcsTUFBQSxJQUFJLENBQUMsa0JBQWtCLDBDQUFFLGFBQWEsQ0FBQztRQUN0RCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxNQUFNLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRTtZQUM5QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUN6QixPQUFPO1NBQ1I7UUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELGtCQUFrQixDQUFDLENBQWUsRUFBRSxLQUFhO1FBQy9DLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxNQUFNO1lBQUUsT0FBTztRQUNyQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUV4QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDO1FBRXBDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsR0FBRztZQUFFLE9BQU87UUFFakIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwRCxNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQztRQUNsRCxNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUVuRCxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ3ZELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7UUFFdEQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxFQUFnQixFQUFFLEVBQUU7WUFDaEMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsQ0FBQztnQkFBRSxPQUFPO1lBRWYsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztZQUN4RCxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1lBRXZELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUM7UUFFRixNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUU7WUFDZCxNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDO1FBRUYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxFQUFnQixFQUFFLEtBQWEsRUFBRSxZQUE2QixJQUFJO1FBQ3JGLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQzFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNyQixFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFcEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxHQUFHO1lBQUUsT0FBTztRQUVqQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7UUFDMUIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztRQUUxQixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQzlCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDL0IsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxQixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sV0FBVyxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFFOUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFlLEVBQUUsRUFBRTtZQUMvQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDbkIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxDQUFDO2dCQUFFLE9BQU87WUFFZixNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQ3BFLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUM7WUFFckUsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUUzQixJQUFJLElBQUksR0FBRyxXQUFXLENBQUM7WUFDdkIsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDO1lBQ3ZCLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQztZQUN2QixJQUFJLElBQUksR0FBRyxXQUFXLENBQUM7WUFFdkIsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUMzQixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxHQUFHLFdBQVcsQ0FBQyxDQUFDO2FBQy9DO1lBQ0QsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUMzQixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxHQUFHLFdBQVcsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLEdBQUcsV0FBVyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDO2FBQzNDO1lBQ0QsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUMzQixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxHQUFHLFdBQVcsQ0FBQyxDQUFDO2FBQy9DO1lBQ0QsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUMzQixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxHQUFHLFdBQVcsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLEdBQUcsV0FBVyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDO2FBQzNDO1lBRUQsd0RBQXdEO1lBQ3hELElBQUksT0FBTyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNuQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDdEQsSUFBSSxHQUFHLElBQUksR0FBRyxXQUFXLENBQUM7b0JBQzFCLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDM0IsSUFBSSxHQUFHLFdBQVcsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQztxQkFDM0M7aUJBQ0Y7cUJBQU07b0JBQ0wsSUFBSSxHQUFHLElBQUksR0FBRyxXQUFXLENBQUM7b0JBQzFCLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDM0IsSUFBSSxHQUFHLFdBQVcsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQztxQkFDM0M7aUJBQ0Y7YUFDRjtZQUVELENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDO1FBRUYsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQztRQUVGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsZUFBZSxDQUFDLEtBQWE7UUFDM0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUM7UUFDeEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQscUVBQXFFO0lBRXJFLDhCQUE4QjtJQUM5Qix3QkFBd0I7UUFDdEIsNENBQTRDO1FBQzVDLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25DLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7U0FDakM7YUFBTTtZQUNMLGlDQUFpQztZQUNqQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNuQyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDbkMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztpQkFDakM7cUJBQU07b0JBQ0wscUNBQXFDO29CQUNyQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztpQkFDekI7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELG9CQUFvQjtRQUNsQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO0lBQ25DLENBQUM7SUFFRCxpQ0FBaUM7SUFDM0IsbUJBQW1COztZQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsT0FBTyxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO2dCQUMxRCxPQUFPO2FBQ1I7WUFFRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1lBRWhDLElBQUk7Z0JBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7b0JBQ2hFLElBQUksRUFBRSxnQkFBZ0I7b0JBQ3RCLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTTtpQkFDckIsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUVmLElBQUksUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLE9BQU8sRUFBRTtvQkFDckIsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztpQkFDbEQ7cUJBQU07b0JBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsRUFBRSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsR0FBRyxDQUFDLENBQUM7aUJBQzVEO2FBQ0Y7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDWixPQUFPLENBQUMsS0FBSyxDQUFDLDJCQUEyQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ2pEO29CQUFTO2dCQUNSLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7YUFDbEM7UUFDSCxDQUFDO0tBQUE7SUFFRCxxQ0FBcUM7SUFDL0IsdUJBQXVCLENBQUMsYUFBc0I7OztZQUNsRCxNQUFNLE1BQU0sR0FBRyxNQUFBLElBQUksQ0FBQyxrQkFBa0IsMENBQUUsYUFBYSxDQUFDO1lBQ3RELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkYsSUFBSSxDQUFDLE1BQU0sSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFO2dCQUM5QixPQUFPO2FBQ1I7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsT0FBTyxDQUFDLElBQUksQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO2dCQUN6RCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxtQkFBbUI7Z0JBQ3pDLE9BQU87YUFDUjtZQUVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBRTNDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFFaEMsSUFBSTtnQkFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFNLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDaEUsSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNO29CQUNwQixjQUFjLEVBQUUsYUFBYSxJQUFJLEVBQUU7b0JBQ25DLGNBQWMsRUFBRSxPQUFPO2lCQUN4QixDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBRWYsSUFBSSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsT0FBTyxFQUFFO29CQUNyQixvQkFBb0I7b0JBQ3BCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO3dCQUN4QixFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUU7d0JBQ2YsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNO3dCQUNwQixjQUFjLEVBQUUsUUFBUSxDQUFDLGNBQWM7d0JBQ3ZDLGNBQWMsRUFBRSxPQUFPO3dCQUN2QixVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEtBQUssQ0FBQzt3QkFDN0MsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO3dCQUNwQyxVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7cUJBQ3JDLENBQUMsQ0FBQztvQkFFSCxxQ0FBcUM7b0JBQ3JDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDdEM7cUJBQU07b0JBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzFELDZCQUE2QjtvQkFDN0IsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUN0QjthQUNGO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQ3RCO29CQUFTO2dCQUNSLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2FBQzFCOztLQUNGO0lBRUQsc0NBQXNDO0lBQ3RDLGlCQUFpQixDQUFDLEdBQW1CO1FBQ25DLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVLLFlBQVksQ0FBQyxHQUFXOztZQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO2dCQUN4QyxPQUFPLEVBQUUsR0FBRztnQkFDWixRQUFRLEVBQUUsSUFBSTtnQkFDZCxRQUFRLEVBQUUsS0FBSzthQUNoQixDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbEIsQ0FBQztLQUFBO0lBRUQsMERBQTBEO0lBQ2xELHNCQUFzQixDQUFDLE9BQWU7UUFDNUMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLE9BQU8sQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQztRQUM1QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCx1Q0FBdUM7SUFDakMsb0JBQW9CLENBQUMsR0FBbUIsRUFBRSxLQUFhOztZQUMzRCxJQUFJLEtBQUssRUFBRTtnQkFDVCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7YUFDekI7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07Z0JBQUUsT0FBTztZQUV6QixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1lBRWhDLElBQUk7Z0JBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7b0JBQ2hFLElBQUksRUFBRSxrQkFBa0I7b0JBQ3hCLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtvQkFDVixPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU07aUJBQ3JCLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFFZixJQUFJLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxPQUFPLEVBQUU7b0JBQ3JCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztpQkFDMUU7cUJBQU07b0JBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsR0FBRyxDQUFDLENBQUM7aUJBQzdEO2FBQ0Y7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDWixPQUFPLENBQUMsS0FBSyxDQUFDLDJCQUEyQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ2pEO29CQUFTO2dCQUNSLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7YUFDbEM7UUFDSCxDQUFDO0tBQUE7SUFFRCwyQkFBMkI7SUFDckIsbUJBQW1CLENBQUMsR0FBbUIsRUFBRSxLQUFhOztZQUMxRCxJQUFJLEtBQUssRUFBRTtnQkFDVCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7YUFDekI7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07Z0JBQUUsT0FBTztZQUV6QixJQUFJO2dCQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFO29CQUNoRSxJQUFJLEVBQUUsYUFBYTtvQkFDbkIsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO29CQUNWLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTTtpQkFDckIsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUVmLElBQUksUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLE9BQU8sRUFBRTtvQkFDckIsb0JBQW9CO29CQUNwQixJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDL0IsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNuQyxDQUFDLENBQUMsQ0FBQztpQkFDSjthQUNGO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUM5QztRQUNILENBQUM7S0FBQTtJQUVELG1EQUFtRDtJQUNuRCwwQkFBMEI7UUFDeEIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELDBDQUEwQztJQUMxQyxzQkFBc0I7O1FBQ3BCLE1BQUEsTUFBQSxJQUFJLENBQUMscUJBQXFCLDBDQUFFLGFBQWEsMENBQUUsS0FBSyxFQUFFLENBQUM7SUFDckQsQ0FBQztJQUVELGtDQUFrQztJQUM1Qix1QkFBdUIsQ0FBQyxLQUFZOztZQUN4QyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBMEIsQ0FBQztZQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDO2dCQUFFLE9BQU87WUFFckQsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU1QixxQkFBcUI7WUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNuQyxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0MsT0FBTzthQUNSO1lBRUQsb0JBQW9CO1lBQ3BCLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDaEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFPLENBQUMsRUFBRSxFQUFFOztnQkFDMUIsSUFBSSxPQUFPLEdBQUcsTUFBQSxDQUFDLENBQUMsTUFBTSwwQ0FBRSxNQUFnQixDQUFDO2dCQUN6QyxJQUFJLENBQUMsT0FBTztvQkFBRSxPQUFPO2dCQUVyQiwwQkFBMEI7Z0JBQzFCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7Z0JBQ2hDLElBQUk7b0JBQ0YsT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNyRDtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDWixPQUFPLENBQUMsSUFBSSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUNuRDtnQkFFRCxvQ0FBb0M7Z0JBQ3BDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDZixJQUFJO3dCQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFOzRCQUNoRSxJQUFJLEVBQUUsZ0JBQWdCOzRCQUN0QixPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU07NEJBQ3BCLGNBQWMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDOzRCQUNsRCxjQUFjLEVBQUUsT0FBTzt5QkFDeEIsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUVmLElBQUksUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLE9BQU8sRUFBRTs0QkFDckIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7Z0NBQ3hCLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBRTtnQ0FDZixPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0NBQ3BCLGNBQWMsRUFBRSxRQUFRLENBQUMsY0FBYztnQ0FDdkMsY0FBYyxFQUFFLE9BQU87Z0NBQ3ZCLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDO2dDQUM3QyxVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7Z0NBQ3BDLFVBQVUsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTs2QkFDckMsQ0FBQyxDQUFDO3lCQUNKO3FCQUNGO29CQUFDLE9BQU8sR0FBRyxFQUFFO3dCQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ2xEO2lCQUNGO3FCQUFNO29CQUNMLCtCQUErQjtvQkFDL0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNyQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztpQkFDN0I7Z0JBRUQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztnQkFDakMsY0FBYztnQkFDZCxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNuQixDQUFDLENBQUEsQ0FBQztZQUNGLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsQ0FBQztLQUFBO0lBRUQsa0VBQWtFO0lBQzFELHFCQUFxQixDQUFDLE9BQWU7UUFDM0MsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3hCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO2dCQUNoQixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFFM0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDUixNQUFNLENBQUMsOEJBQThCLENBQUMsQ0FBQztvQkFDdkMsT0FBTztpQkFDUjtnQkFFRCxhQUFhO2dCQUNiLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFekIsaUJBQWlCO2dCQUNqQixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RFLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBRTVCLHdGQUF3RjtnQkFDeEYsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDO2dCQUN0QixrRUFBa0U7Z0JBQ2xFLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQztnQkFFMUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDdkMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsQixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN0QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUV0QixxQ0FBcUM7b0JBQ3JDLElBQUksQ0FBQyxHQUFHLFNBQVMsSUFBSSxDQUFDLEdBQUcsU0FBUyxJQUFJLENBQUMsR0FBRyxTQUFTLEVBQUU7d0JBQ25ELHlCQUF5Qjt3QkFDekIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ2pCO3lCQUFNLElBQUksQ0FBQyxHQUFHLGFBQWEsSUFBSSxDQUFDLEdBQUcsYUFBYSxJQUFJLENBQUMsR0FBRyxhQUFhLEVBQUU7d0JBQ3RFLDJDQUEyQzt3QkFDM0MsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDNUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDN0YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7cUJBQzVDO2lCQUNGO2dCQUVELHlCQUF5QjtnQkFDekIsR0FBRyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUVsQyx3Q0FBd0M7Z0JBQ3hDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDO1lBQ0YsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUNuRCxHQUFHLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCx5REFBeUQ7SUFFekQsbUJBQW1CLENBQUMsSUFBbUM7UUFDckQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7UUFDNUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDNUIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLE1BQU0sTUFBTSxHQUFHLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsQ0FBQztRQUNuRixJQUFJLENBQUMsWUFBWSxDQUFDLHdCQUF3QixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxJQUFZO1FBQy9CLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxlQUFlLENBQUMsRUFBVTtRQUN4QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxDQUFlLEVBQUUsRUFBVTtRQUM1QyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPO1lBQUUsT0FBTztRQUN4QyxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBcUIsQ0FBQztRQUN2QyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDO1lBQUUsT0FBTztRQUNuRixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFFNUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTztRQUVoQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELE1BQU0sUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQ2pELE1BQU0sUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ2xELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDdkQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztRQUV0RCxNQUFNLElBQUksR0FBRyxDQUFDLEVBQWdCLEVBQUUsRUFBRTtZQUNoQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDcEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxDQUFDO2dCQUFFLE9BQU87WUFDZixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUMxRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUMxRSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQztRQUNGLE1BQU0sRUFBRSxHQUFHLEdBQUcsRUFBRTtZQUNkLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUM7UUFDRixNQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELGFBQWEsQ0FBQyxDQUFlLEVBQUUsTUFBYztRQUMzQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPO1lBQUUsT0FBTztRQUN4QyxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBcUIsQ0FBQztRQUN2QyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUM7WUFBRSxPQUFPO1FBQ3ZGLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFbkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUM7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQztRQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXpCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsR0FBRztZQUFFLE9BQU87UUFFakIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwRCxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDL0UsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBRS9FLE1BQU0sSUFBSSxHQUFHLENBQUMsRUFBZ0IsRUFBRSxFQUFFO1lBQ2hDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNwQixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLENBQUM7Z0JBQUUsT0FBTztZQUNmLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQzFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQzFFLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDO1FBRUYsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQztRQUVGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsb0JBQW9CLENBQUMsQ0FBZSxFQUFFLEVBQVUsRUFBRSxHQUFvQjtRQUNwRSxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ25CLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU87UUFFaEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3pCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDekIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFFaEQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxFQUFnQixFQUFFLEVBQUU7WUFDaEMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsQ0FBQztnQkFBRSxPQUFPO1lBQ2YsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUM1RCxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQzdELElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7Z0JBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDekQsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztnQkFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQztZQUMxRCxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQUU7WUFDL0UsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQzthQUFFO1lBQ2hGLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFO1lBQ2QsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsdUJBQXVCLENBQUMsRUFBVSxFQUFFLEtBQWE7O1FBQy9DLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU87UUFDaEIsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQUEsRUFBRSxDQUFDLFFBQVEsbUNBQUksRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxFQUFVLEVBQUUsS0FBYTtRQUMzQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLEVBQUU7WUFBRSxPQUFPO1FBQ2hCLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7WUFDdEIsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDNUQ7YUFBTTtZQUNMLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN0RCxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNiLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ2Y7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxFQUFVOztRQUM5QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLEVBQUU7WUFBRSxPQUFPO1FBQ2hCLEVBQUUsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLE1BQUEsRUFBRSxDQUFDLGFBQWEsbUNBQUksSUFBSSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsMkRBQTJEO0lBRTNELGNBQWMsQ0FBQyxJQUErQjtRQUM1QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUN2QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUM1QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsTUFBTSxNQUFNLEdBQTJCO1lBQ3JDLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLE9BQU87U0FDbkUsQ0FBQztRQUNGLElBQUksQ0FBQyxZQUFZLENBQUMsd0JBQXdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELFlBQVksQ0FBQyxLQUFhO1FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxjQUFjLENBQUMsS0FBYTtRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsbUJBQW1CLENBQUMsRUFBVSxFQUFFLEtBQWE7UUFDM0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxHQUFHO1lBQUUsT0FBTztRQUNqQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25FLEdBQUcsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ3JCLElBQUksR0FBRyxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFO1lBQ2pDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9GO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsbUJBQW1CLENBQUMsSUFBK0IsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUNoRixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDakIsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbEIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQztRQUNyQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDakMsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDeEIsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdEIsR0FBRyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdEIsR0FBRyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDdkIsR0FBRyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFbkIsSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQ3BCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQy9CLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDL0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMvQixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZDthQUFNLElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtZQUMzQixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMvQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQy9CLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNiLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQy9CLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDL0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Q7YUFBTTtZQUNMLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hELEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNaO1FBQ0QsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxvREFBb0Q7SUFDcEQsWUFBWTtRQUNWLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELGFBQWEsQ0FBQyxFQUFnQixFQUFFLE1BQWM7UUFDNUMsSUFBSSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTztZQUFFLE9BQU87UUFDMUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFxQixDQUFDO1FBQ3hDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFBRSxPQUFPO1FBRXJDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVwQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLEVBQUU7WUFBRSxPQUFPO1FBRWhCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDakQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFFbEQsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUN4RCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO1FBRXZELE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBZSxFQUFFLEVBQUU7WUFDL0IsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsQ0FBQztnQkFBRSxPQUFPO1lBRWYsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztZQUN2RCxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1lBRXRELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUM7UUFFRixNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUU7WUFDZCxNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDO1FBRUYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxlQUFlLENBQUMsTUFBYztRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxvREFBb0Q7SUFDcEQsVUFBVTtRQUNSLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO1lBQ25ELElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRUQsWUFBWTtRQUNWLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1lBQ3ZELElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLENBQThCO1FBQ3JDLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUMxQjtJQUNILENBQUM7SUFFRCxZQUFZLENBQUMsS0FBYTtRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDMUI7UUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELHdEQUF3RDtJQUN4RCxpQkFBaUI7UUFDZixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDcEIsT0FBTyxFQUFFLENBQUM7WUFDVixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0IsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO1lBQ3JDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUM1QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsOERBQThEO0lBQ3RELHVCQUF1QixDQUFDLE1BQWMsRUFBRSxJQUFZLEVBQUUsSUFBWTtRQUN4RSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMzQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUV6QyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFOUIsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQTZCLENBQUM7UUFDN0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXRCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDcEQsTUFBTSxjQUFjLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFN0QsZUFBZTtRQUNmLEtBQUssTUFBTSxDQUFDLElBQUksT0FBTyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU07Z0JBQUUsU0FBUztZQUMvQixJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUU7Z0JBQ2pCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDWCxHQUFHLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztnQkFDdEIsR0FBRyxDQUFDLHdCQUF3QixHQUFHLFVBQVUsQ0FBQzthQUMzQztZQUNELEdBQUcsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUMxQixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN4QyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDNUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQztnQkFDbEUsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7b0JBQ3pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3ZCO1lBQ0QsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLENBQUMsV0FBVztnQkFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDbEM7UUFFRCxjQUFjO1FBQ2QsS0FBSyxNQUFNLEVBQUUsSUFBSSxNQUFNLEVBQUU7WUFDdkIsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ2pDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNsQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDL0IsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ2hDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUMzQixHQUFHLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDO1lBQ3pDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNoQixRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2YsS0FBSyxNQUFNO29CQUNULEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFDbkMsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFO3dCQUFFLEdBQUcsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQzt3QkFBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7cUJBQUU7b0JBQy9ELE1BQU07Z0JBQ1IsS0FBSyxRQUFRLENBQUMsQ0FBQztvQkFDYixNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3pCLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDekIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2pDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDL0MsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFO3dCQUFFLEdBQUcsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQzt3QkFBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7cUJBQUU7b0JBQy9ELE1BQU07aUJBQ1A7Z0JBQ0QsS0FBSyxNQUFNO29CQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUFDLE1BQU07Z0JBQzNELEtBQUssT0FBTyxDQUFDLENBQUM7b0JBQ1osR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3ZDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDYixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO29CQUM1QyxNQUFNLE9BQU8sR0FBRyxFQUFFLEdBQUcsY0FBYyxDQUFDO29CQUNwQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNuQixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ25CLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6RyxNQUFNO2lCQUNQO2FBQ0Y7WUFDRCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZDtRQUlELE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELDBFQUEwRTtJQUNsRSxlQUFlLENBQ3JCLFNBQWlCLEVBQUUsU0FBaUIsRUFBRSxTQUFpQixFQUFFLFNBQWlCLEVBQzFFLFNBQWlCLEVBQUUsVUFBa0IsRUFBRSxZQUFvQjtRQUUzRCxNQUFNLEtBQUssR0FBRyxZQUFZLEtBQUssRUFBRSxJQUFJLFlBQVksS0FBSyxHQUFHLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRSxJQUFJLFlBQVksS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUMzRywwRUFBMEU7UUFDMUUsK0dBQStHO1FBQy9HLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDMUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUUxQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDbEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2xDLE1BQU0sRUFBRSxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNsQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFbEMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ1osSUFBSSxFQUFFLEdBQUcsVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFFOUIsMEVBQTBFO1FBQzFFLElBQUksWUFBWSxLQUFLLEVBQUUsSUFBSSxZQUFZLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDaEQsMkdBQTJHO1lBQzNHLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDWixFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNiLEVBQUUsR0FBRyxFQUFFLENBQUM7U0FDVDthQUFNLElBQUksWUFBWSxLQUFLLEdBQUcsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDdkQsOEVBQThFO1lBQzlFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNiLEVBQUUsR0FBRyxTQUFTLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDM0IsRUFBRSxHQUFHLFVBQVUsR0FBRyxFQUFFLENBQUM7U0FDdEI7YUFBTSxJQUFJLFlBQVksS0FBSyxHQUFHLElBQUksWUFBWSxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ3hELCtEQUErRDtZQUMvRCxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ2IsRUFBRSxHQUFHLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDcEIsRUFBRSxHQUFHLFVBQVUsR0FBRyxFQUFFLENBQUM7U0FDdEI7UUFFRCxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUNsRixDQUFDO0lBRUssWUFBWTs7O1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWTtnQkFBRSxPQUFPO1lBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxjQUFjLEdBQUcsc0JBQXNCLENBQUM7WUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUV6QixJQUFJO2dCQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3pELE1BQU0sT0FBTyxHQUFTLGFBQXFCLENBQUMsT0FBTyxJQUFLLGFBQXFCLENBQUM7Z0JBQzlFLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sU0FBUyxHQUFHLE1BQU0sS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7Z0JBQzNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxhQUFhLEdBQUcsTUFBTSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztnQkFDcEcsTUFBTSxZQUFZLEdBQUcsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBRW5DLDhFQUE4RTtnQkFDOUUsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO2dCQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBRyxJQUFJLENBQUMsQ0FBQSxNQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsMENBQUUsTUFBTSxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7b0JBQUUsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEgsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUcsSUFBSSxDQUFDLENBQUEsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLDBDQUFFLE1BQU0sS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUFFLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDM0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2pFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFFNUQsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVqRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDeEMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEIsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUV6Qiw2REFBNkQ7b0JBQzdELElBQUksQ0FBQyxHQUFHLFNBQVMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUNwRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQ2pFLElBQUksQ0FBQyxjQUFjLEdBQUcscUJBQXFCLENBQUMsR0FBRyxDQUFDLE1BQU0sUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO3dCQUN4RSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO3dCQUN6QixNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN0RDtvQkFFRCwwQ0FBMEM7b0JBQzFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO3dCQUFFLFNBQVM7b0JBRTlDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM1QyxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztvQkFDN0MsTUFBTSxhQUFhLEdBQUcsTUFBQSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxtQ0FBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDO29CQUVyRixNQUFNLEtBQUssR0FBRyxhQUFhLEtBQUssRUFBRSxJQUFJLGFBQWEsS0FBSyxHQUFHLElBQUksYUFBYSxLQUFLLENBQUMsRUFBRSxJQUFJLGFBQWEsS0FBSyxDQUFDLEdBQUcsQ0FBQztvQkFDL0csTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDbEMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztvQkFFbEMsdUNBQXVDO29CQUN2QyxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUEsTUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQywwQ0FBRSxNQUFNLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM1RCxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUEsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywwQ0FBRSxNQUFNLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMxRCxJQUFJLFVBQVUsSUFBSSxTQUFTLEVBQUU7d0JBQzNCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUNqRSxNQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7d0JBQ3JELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7d0JBQ3JGLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO3FCQUM1STtvQkFFRCxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFO3dCQUM1QixJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxNQUFNLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7NEJBQUUsT0FBTyxTQUFTLENBQUM7d0JBQ3JFLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUNwQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQzs0QkFBRSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNsRixJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQzs0QkFBRSxPQUFPLFNBQVMsQ0FBQzt3QkFDNUMsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDdkosQ0FBQyxDQUFDO29CQUVGLHdEQUF3RDtvQkFDeEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDO29CQUN6RSxLQUFLLE1BQU0sRUFBRSxJQUFJLGFBQWEsRUFBRTt3QkFDOUIsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQ2xGLE1BQU0sYUFBYSxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUM7d0JBQ25DLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFDO3dCQUVsRCxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7d0JBQ2pFLE1BQU0sV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsV0FBVyxLQUFLLGVBQWUsSUFBSSxFQUFFLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7d0JBRXJJLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO3dCQUV0RyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFOzRCQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDO2dDQUNqQixDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0NBQ2QsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dDQUNkLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSztnQ0FDdEIsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNO2dDQUN4QixNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU07Z0NBQ3hCLEtBQUssRUFBRSxTQUFTO2dDQUNoQixXQUFXLEVBQUUsV0FBVztnQ0FDeEIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTOzZCQUNsRCxDQUFDLENBQUM7eUJBQ0o7NkJBQU0sSUFBSSxFQUFFLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTs0QkFDL0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDOzRCQUNySCxJQUFJLENBQUMsV0FBVyxDQUFDO2dDQUNmLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQ0FDYixDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0NBQ2IsTUFBTSxFQUFFLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQztnQ0FDM0IsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQ0FDNUIsS0FBSyxFQUFFLFNBQVM7Z0NBQ2hCLFdBQVcsRUFBRSxXQUFXO2dDQUN4QixXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVM7NkJBQ2xELENBQUMsQ0FBQzt5QkFDSjs2QkFBTSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFOzRCQUNwRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQzs0QkFDeEksTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7NEJBRXBJLElBQUksQ0FBQyxRQUFRLENBQUM7Z0NBQ1osS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0NBQzdCLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFO2dDQUMzQixLQUFLLEVBQUUsV0FBVyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQ0FDbEMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUN4QyxDQUFDLENBQUM7NEJBRUgsSUFBSSxFQUFFLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtnQ0FDdkIsTUFBTSxPQUFPLEdBQUcsRUFBRSxHQUFHLGFBQWEsQ0FBQztnQ0FDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3ZELElBQUksQ0FBQyxRQUFRLENBQUM7b0NBQ1osS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0NBQzdCLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFO29DQUMvRyxLQUFLLEVBQUUsV0FBVyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQ0FDbEMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lDQUN4QyxDQUFDLENBQUM7Z0NBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQ0FDWixLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtvQ0FDN0IsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0NBQy9HLEtBQUssRUFBRSxXQUFXLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29DQUNsQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7aUNBQ3hDLENBQUMsQ0FBQzs2QkFDSjt5QkFDRjtxQkFDRjtvQkFFRCw2RUFBNkU7b0JBQzdFLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQztvQkFDbkUsS0FBSyxNQUFNLEVBQUUsSUFBSSxXQUFXLEVBQUU7d0JBQzVCLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTs0QkFBRSxTQUFTO3dCQUU5QixNQUFNLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQzt3QkFDbkUsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUM7d0JBQ3ZDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFFakQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ2xDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO3dCQUVyQyxnRkFBZ0Y7d0JBQ2hGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQzVDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUNuRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDckQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsdUJBQXVCO3dCQUNoRSxNQUFNLFNBQVMsR0FBSSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyx1QkFBdUI7d0JBRWhFLE1BQU0sSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ25DLDZDQUE2Qzt3QkFDN0MsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7d0JBQ3hDLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFFckQsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7NEJBQ3hCLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0NBQ1QsY0FBYyxJQUFJLFVBQVUsQ0FBQztnQ0FDN0IsU0FBUzs2QkFDVjs0QkFFRCxJQUFJLFNBQVMsR0FBYSxFQUFFLENBQUM7NEJBQzdCLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFLLElBQVksQ0FBQyxTQUFTLEVBQUU7Z0NBQzFELE1BQU0sU0FBUyxHQUFHLElBQUssSUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztnQ0FDN0UsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzZCQUM1RTtpQ0FBTTtnQ0FDTCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUM5QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQ0FDckMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDekIsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDO3dDQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUNBQy9DOzZCQUNGOzRCQUVELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQzs0QkFDZCxLQUFLLE1BQU0sSUFBSSxJQUFJLFNBQVMsRUFBRTtnQ0FDNUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztnQ0FDN0IsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7Z0NBQ3JFLElBQUksU0FBUyxHQUFHLElBQUksSUFBSSxJQUFJLEVBQUU7b0NBQzVCLElBQUksWUFBWSxHQUFHLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQ0FDOUMsTUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7b0NBQ3RFLElBQUksRUFBRSxDQUFDLEtBQUssS0FBSyxRQUFRO3dDQUFFLFlBQVksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQ0FDN0UsSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLE9BQU87d0NBQUUsWUFBWSxJQUFJLElBQUksR0FBRyxjQUFjLENBQUM7b0NBRWhFLE1BQU0sZUFBZSxHQUFHLGNBQWMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUM7b0NBQzlELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7b0NBRTdILElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO3dDQUNsQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7d0NBQ1AsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dDQUNQLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUTt3Q0FDakIsSUFBSSxFQUFFLFNBQVM7d0NBQ2YsS0FBSyxFQUFFLFFBQVE7d0NBQ2YsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNO3FDQUNsQixDQUFDLENBQUM7b0NBRUgsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29DQUNoQyxjQUFjLElBQUksVUFBVSxDQUFDO2lDQUM5QjtxQ0FBTTtvQ0FDTCxJQUFJLEdBQUcsUUFBUSxDQUFDO2lDQUNqQjs2QkFDRjs0QkFDRCxJQUFJLElBQUksRUFBRTtnQ0FDUixJQUFJLFlBQVksR0FBRyxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7Z0NBQzlDLE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dDQUN0RSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssUUFBUTtvQ0FBRSxZQUFZLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0NBQzdFLElBQUksRUFBRSxDQUFDLEtBQUssS0FBSyxPQUFPO29DQUFFLFlBQVksSUFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDO2dDQUVoRSxNQUFNLGVBQWUsR0FBRyxjQUFjLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDO2dDQUM5RCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dDQUU3SCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtvQ0FDbEIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29DQUNQLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQ0FDUCxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVE7b0NBQ2pCLElBQUksRUFBRSxTQUFTO29DQUNmLEtBQUssRUFBRSxRQUFRO29DQUNmLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTTtpQ0FDbEIsQ0FBQyxDQUFDO2dDQUNILGNBQWMsSUFBSSxVQUFVLENBQUM7NkJBQzlCO3lCQUNGO3FCQUNGO29CQUdELGtCQUFrQjtvQkFDbEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDO29CQUN4RSxLQUFLLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRTt3QkFDNUIsSUFBSTs0QkFDRiwwRUFBMEU7NEJBQzFFLHNFQUFzRTs0QkFDdEUsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7Z0NBQ3JELENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTztnQ0FDYixDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUNoRCxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2hGLE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFFOUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7NEJBQzFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO3lCQUMxSTt3QkFBQyxPQUFPLENBQUMsRUFBRTs0QkFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUFFO3FCQUNsQztvQkFFRCxnQkFBZ0I7b0JBQ2hCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQztvQkFDeEUsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7d0JBQzVCLElBQUk7NEJBQ0YsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDckYsTUFBTSxRQUFRLEdBQUcsTUFBTSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUU5QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQzs0QkFDMUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7NEJBRXpJLHVFQUF1RTs0QkFDdkUsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0NBQ3pELE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQztnQ0FDckIsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO2dDQUM3QixJQUFJLEdBQUcsQ0FBQyxRQUFRO29DQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dDQUM3QyxJQUFJLEdBQUcsQ0FBQyxRQUFRO29DQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dDQUM3QyxJQUFJLEdBQUcsQ0FBQyxTQUFTO29DQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dDQUUvQyxNQUFNLFVBQVUsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO2dDQUNsQyxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztnQ0FFcEQsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztnQ0FDMUQsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0NBRXBGLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO29DQUMxQyxNQUFNLGdCQUFnQixHQUFHLGFBQWEsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLFVBQVUsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7b0NBQ3JGLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxFQUFFLGdCQUFnQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztvQ0FFdEcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7d0NBQ3pCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzt3Q0FDUCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7d0NBQ1AsSUFBSSxFQUFFLFVBQVU7d0NBQ2hCLElBQUksRUFBRSxRQUFRO3dDQUNkLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7d0NBQ3pCLE9BQU8sRUFBRSxHQUFHO3dDQUNaLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTTtxQ0FDbEIsQ0FBQyxDQUFDO2lDQUNKOzZCQUNGO3lCQUNGO3dCQUFDLE9BQU8sQ0FBQyxFQUFFOzRCQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQUU7cUJBQ2xDO29CQUVELGlCQUFpQjtvQkFDakIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDO29CQUNwRSxLQUFLLE1BQU0sRUFBRSxJQUFJLFdBQVcsRUFBRTt3QkFDNUIsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUN0QyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO3dCQUNsRCxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO3dCQUNsRCxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO3dCQUVsRCxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7d0JBQ3JELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO3dCQUV4RixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUU7NEJBQ3JCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFROzRCQUNuRCxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU07eUJBQ3JELENBQUMsQ0FBQztxQkFDSjtpQkFFRjtnQkFFRCw2REFBNkQ7Z0JBQzdELElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNqQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQzlCLEtBQUssTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTt3QkFDbkMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7d0JBQzFCLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksUUFBUSxDQUFDLE1BQU07NEJBQUUsU0FBUzt3QkFDcEQsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNoQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUN0RCxNQUFNLFFBQVEsR0FBRyxNQUFBLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxtQ0FBSSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDO3dCQUNuRixNQUFNLFNBQVMsR0FBRyxRQUFRLEtBQUssRUFBRSxJQUFJLFFBQVEsS0FBSyxHQUFHLElBQUksUUFBUSxLQUFLLENBQUMsRUFBRSxJQUFJLFFBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQzt3QkFDL0YsTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzt3QkFDakMsTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzt3QkFFakMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDN0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDbEMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO3dCQUV4QyxNQUFNLE9BQU8sR0FBRyxDQUFDLE1BQUEsRUFBRSxDQUFDLGFBQWEsbUNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNuRCxNQUFNLElBQUksR0FBUTs0QkFDaEIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUU7NEJBQ25DLFdBQVcsRUFBRSxPQUFPOzRCQUNwQixXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUzs0QkFDL0MsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt5QkFDOUIsQ0FBQzt3QkFFRixJQUFJOzRCQUNGLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7Z0NBQ3RCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dDQUM5QyxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztnQ0FDNUIsSUFBSSxFQUFFLENBQUMsUUFBUTtvQ0FBRSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs2QkFDOUM7aUNBQU0sSUFBSSxFQUFFLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtnQ0FDakMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7Z0NBQzdDLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDOzZCQUM3QjtpQ0FBTSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO2dDQUM5QixJQUFJLEVBQU8sQ0FBQztnQ0FDWixJQUFJO29DQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxjQUFlLENBQUMsQ0FBQztpQ0FBRTtnQ0FBQyxXQUFNO29DQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLGNBQWUsQ0FBQyxDQUFDO2lDQUFFO2dDQUM5RyxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDOzZCQUMxQzt5QkFDRjt3QkFBQyxPQUFPLE9BQU8sRUFBRTs0QkFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDO3lCQUFFO3FCQUNsRTtpQkFDRjtnQkFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLGNBQWMsR0FBRyx3QkFBd0IsQ0FBQztnQkFDL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDekIsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFdEQsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7Z0JBQ2hCLE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUUzRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsUUFBZSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO2dCQUU5RSw2RUFBNkU7Z0JBQzdFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDakIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7aUJBQ3hDO3FCQUFNO29CQUNMLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQztpQkFDekU7Z0JBRUQsd0RBQXdEO2dCQUN4RCxNQUFNLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO2dCQUNsQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO2FBRWhDO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2FBQ3REO29CQUFTO2dCQUNSLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7YUFDdkI7O0tBQ0Y7SUFFSyxvQkFBb0I7O1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTtnQkFBRSxPQUFPO1lBRWhDLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMzRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDekUsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUU5QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO1lBRS9CLGlFQUFpRTtZQUNqRSxJQUFJLGFBQXVCLENBQUM7WUFDNUIsSUFBSSxLQUFLLEdBQUcsRUFBRSxFQUFFO2dCQUNkLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFHLElBQUksQ0FBQyxDQUFBLE1BQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQywwQ0FBRSxNQUFNLEtBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQztvQkFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUcsSUFBSSxDQUFDLENBQUEsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLDBDQUFFLE1BQU0sS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEQsYUFBYSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGFBQWEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2FBQ3ZEO2lCQUFNO2dCQUNMLGFBQWEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO2FBQ2hDO1lBRUQsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQ25ELE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkMsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7Z0JBQ2xCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUU3QyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFDO2dCQUNyQyxNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFFaEMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDNUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUV0RCxpREFBaUQ7Z0JBQ2pELElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQzdFLElBQUksQ0FBQyxjQUFjLEdBQUcsMkJBQTJCLE9BQU8sTUFBTSxLQUFLLEVBQUUsQ0FBQztnQkFDdEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUMxQjtRQUNILENBQUM7S0FBQTtJQUVLLG1CQUFtQjs7WUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLG1CQUFtQjtnQkFBRSxPQUFPO1lBQzVELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7WUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUV6QixNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDM0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3pFLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFFOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDL0IsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztnQkFDOUIsTUFBTSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUNoQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDMUI7WUFFRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO1lBQy9CLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7WUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzQixDQUFDO0tBQUE7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhO1lBQUUsT0FBTztRQUVoQyx1RkFBdUY7UUFDdkYsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtnQkFDdEMsSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFO29CQUNqQixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO29CQUN2QixJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUMzRDthQUNGO1NBQ0Y7UUFFRCxzQkFBc0I7UUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDdEIsVUFBVSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTTtZQUN2QyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO1lBQ2hDLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDNUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVOLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1lBQ3JCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsS0FBSyxFQUFFLElBQUk7WUFDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWE7WUFDeEIsUUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7WUFDaEMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1NBQ2xCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUN6QixDQUFDOzs7WUEzOUpGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUseUJBQXlCO2dCQUNuQyx3azhGQUFtRDs7YUFFcEQ7OztZQS9JUSxlQUFlO1lBQ2YsVUFBVTtZQU5tRixNQUFNO1lBS2xGLGVBQWU7WUFBRSxlQUFlO1lBSjFDLGlCQUFpQjtZQUd4QixZQUFZO1lBT1osaUJBQWlCOzRDQXlqQnJCLFFBQVEsWUFBSSxNQUFNLFNBQUMsb0JBQW9COzs7cUJBN2F6QyxLQUFLO3VCQUNMLEtBQUs7NkJBQ0wsS0FBSzswQkFFTCxZQUFZLFNBQUMsV0FBVzs0QkFDeEIsWUFBWSxTQUFDLGFBQWE7MkJBQzFCLFNBQVMsU0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2lDQUN4QyxTQUFTLFNBQUMsaUJBQWlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2lDQW1GOUMsU0FBUyxTQUFDLGlCQUFpQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtxQkFnRDlDLEtBQUs7dUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3VCQUNMLEtBQUs7cUJBQ0wsS0FBSzsyQkFDTCxLQUFLO29DQUlMLFNBQVMsU0FBQyxvQkFBb0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7Z0NBQ2pELFNBQVMsU0FBQyxnQkFBZ0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7b0NBaWhCN0MsWUFBWSxTQUFDLHNCQUFzQixFQUFFLENBQUMsUUFBUSxDQUFDOzZCQWEvQyxZQUFZLFNBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsIEVsZW1lbnRSZWYsIFZpZXdDaGlsZCwgVmlld0NoaWxkcmVuLCBRdWVyeUxpc3QsIElucHV0LCBBZnRlclZpZXdJbml0LCBPbkluaXQsIE9uRGVzdHJveSwgTmdab25lLFxuICBIb3N0TGlzdGVuZXIsIENoYW5nZURldGVjdG9yUmVmLCBJbmplY3QsIE9wdGlvbmFsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUERGX0FOTk9UQVRPUl9DT05GSUcsIFBkZkFubm90YXRvckNvbmZpZyB9IGZyb20gJy4vdG9rZW5zJztcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZVJlc291cmNlVXJsIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBNb2RhbENvbnRyb2xsZXIsIFRvYXN0Q29udHJvbGxlciwgQWxlcnRDb250cm9sbGVyIH0gZnJvbSAnQGlvbmljL2FuZ3VsYXInO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IHRpbWVvdXQsIHJldHJ5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgUERGRG9jdW1lbnQsIHJnYiwgZGVncmVlcyB9IGZyb20gJ3BkZi1saWInO1xuaW1wb3J0ICogYXMgZm9udGtpdE1vZHVsZSBmcm9tICdAcGRmLWxpYi9mb250a2l0JztcbmltcG9ydCAqIGFzIHBkZmpzTGliIGZyb20gJ3BkZmpzLWRpc3QnO1xuaW1wb3J0IHsgUGRmTWFuYWdlclNlcnZpY2UsIFBkZkhpc3RvcnlFbnRyeSB9IGZyb20gJy4vcGRmLW1hbmFnZXIuc2VydmljZSc7XG5cblxuaW50ZXJmYWNlIFRleHRCb3gge1xuICBpZDogc3RyaW5nO1xuICBwYWdlOiBudW1iZXI7XG4gIHpJbmRleD86IG51bWJlcjtcbiAgeDogbnVtYmVyOyAgICAgICAvLyBub3JtYWxpemVkIDAuLjEwMFxuICB5OiBudW1iZXI7ICAgICAgIC8vIG5vcm1hbGl6ZWQgMC4uMTAwXG4gIHdpZHRoOiBudW1iZXI7ICAgLy8gbm9ybWFsaXplZCAwLi4xMDBcbiAgaGVpZ2h0OiBudW1iZXI7ICAvLyBub3JtYWxpemVkIDAuLjEwMFxuICB0ZXh0OiBzdHJpbmc7XG4gIGNvbG9yOiBzdHJpbmc7XG4gIGZvbnRTaXplOiBudW1iZXI7IC8vIGFic29sdXRlIFBERiBwb2ludHMgKFVJIHdpbGwgc2NhbGUgYnkgem9vbSlcbiAgYm9sZDogYm9vbGVhbjtcbiAgaXRhbGljOiBib29sZWFuO1xuICBhbGlnbjogJ2xlZnQnIHwgJ2NlbnRlcicgfCAncmlnaHQnO1xufVxuXG5pbnRlcmZhY2UgU3Ryb2tlUG9pbnQge1xuICB4OiBudW1iZXI7IC8vIG5vcm1hbGl6ZWQgMC4uMVxuICB5OiBudW1iZXI7IC8vIG5vcm1hbGl6ZWQgMC4uMVxuICBwOiBudW1iZXI7IC8vIHByZXNzdXJlIDAuLjFcbn1cblxuaW50ZXJmYWNlIFN0cm9rZSB7XG4gIGlkOiBzdHJpbmc7XG4gIGNvbG9yOiBzdHJpbmc7XG4gIHNpemU6IG51bWJlcjtcbiAgcG9pbnRzOiBTdHJva2VQb2ludFtdO1xuICBpc0hpZ2hsaWdodD86IGJvb2xlYW47IC8vIGhpZ2hsaWdodGVyIHN0cm9rZXNcbn1cblxuaW50ZXJmYWNlIFNoYXBlIHtcbiAgaWQ6IHN0cmluZztcbiAgcGFnZTogbnVtYmVyO1xuICB0eXBlOiAncmVjdCcgfCAnY2lyY2xlJyB8ICdhcnJvdycgfCAnbGluZSc7XG4gIHN0YXJ0WDogbnVtYmVyOyAvLyBub3JtYWxpemVkIDAuLjFcbiAgc3RhcnRZOiBudW1iZXI7XG4gIGVuZFg6IG51bWJlcjtcbiAgZW5kWTogbnVtYmVyO1xuICBjb2xvcjogc3RyaW5nOyAgICAgIC8vIHN0cm9rZSBjb2xvclxuICBzaXplOiBudW1iZXI7ICAgICAgIC8vIHN0cm9rZSB3aWR0aFxuICBmaWxsQ29sb3I/OiBzdHJpbmc7IC8vIGZpbGwgY29sb3IgKHVuZGVmaW5lZCA9IG5vIGZpbGwpXG59XG5cbmludGVyZmFjZSBJbWFnZVN0YW1wIHtcbiAgaWQ6IHN0cmluZztcbiAgcGFnZTogbnVtYmVyO1xuICB6SW5kZXg/OiBudW1iZXI7XG4gIHg6IG51bWJlcjsgLy8gMC4uMTAwXG4gIHk6IG51bWJlcjtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGRhdGFVcmw6IHN0cmluZzsgLy8gYmFzZTY0IGltYWdlXG4gIG1hcmtUeXBlPzogJ2NoZWNrJyB8ICdjcm9zcycgfCAnZG90JztcbiAgbWFya0NvbG9yPzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgU2hhcGVTdGFtcCB7XG4gIGlkOiBzdHJpbmc7XG4gIHBhZ2U6IG51bWJlcjtcbiAgekluZGV4PzogbnVtYmVyO1xuICB4OiBudW1iZXI7ICAgIC8vIDAuLjEwMFxuICB5OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICB0eXBlOiAncmVjdCcgfCAnY2lyY2xlJyB8ICdhcnJvdycgfCAnbGluZSc7XG4gIHN0cm9rZUNvbG9yOiBzdHJpbmc7XG4gIHN0cm9rZVdpZHRoOiBudW1iZXI7IC8vIHB4IGF0IHZpZXdXaWR0aCBzY2FsZVxuICB2aWV3V2lkdGg6IG51bWJlcjsgICAvLyBjYW52YXMuY2xpZW50V2lkdGggd2hlbiBzaGFwZSB3YXMgZHJhd24gKGZvciBQREYgc2NhbGUpXG4gIGZpbGxDb2xvcj86IHN0cmluZzsgIC8vIHVuZGVmaW5lZCA9IHRyYW5zcGFyZW50IGZpbGxcbiAgLy8gRm9yIGxpbmUvYXJyb3cgd2UgYWxzbyBzdG9yZSB0aGUgcmVsYXRpdmUgZGlyZWN0aW9uIHZlY3RvclxuICBzdGFydEZyYWNYOiBudW1iZXI7IC8vIDAuLjEgd2l0aGluIGJvdW5kaW5nIGJveFxuICBzdGFydEZyYWNZOiBudW1iZXI7XG4gIGVuZEZyYWNYOiBudW1iZXI7XG4gIGVuZEZyYWNZOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBTaWduYXR1cmVTdGFtcCB7XG4gIGlkOiBzdHJpbmc7XG4gIHBhZ2U6IG51bWJlcjtcbiAgekluZGV4PzogbnVtYmVyO1xuICB4OiBudW1iZXI7IC8vIDAuLjEwMFxuICB5OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBkYXRhVXJsOiBzdHJpbmc7XG4gIGRpZ2l0YWxJZD86IHN0cmluZztcbiAgc2lnbkRhdGU/OiBzdHJpbmc7XG4gIHNpZ25UaW1lPzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgRGF0ZVN0YW1wIHtcbiAgaWQ6IHN0cmluZztcbiAgcGFnZTogbnVtYmVyO1xuICB6SW5kZXg/OiBudW1iZXI7XG4gIHg6IG51bWJlcjsgLy8gMC4uMTAwXG4gIHk6IG51bWJlcjtcbiAgdGV4dDogc3RyaW5nO1xuICBjb2xvcjogc3RyaW5nO1xuICBmb250U2l6ZTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgUGRmRm9ybUZpZWxkIHtcbiAgaWQ6IHN0cmluZztcbiAgcGFnZTogbnVtYmVyO1xuICB6SW5kZXg/OiBudW1iZXI7XG4gIHR5cGU6ICd0ZXh0JyB8ICdjaGVja2JveCcgfCAncmFkaW8nO1xuICB4OiBudW1iZXI7IC8vIDAuLjEwMFxuICB5OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBmaWVsZE5hbWU6IHN0cmluZztcbiAgcmFkaW9Hcm91cE5hbWU/OiBzdHJpbmc7XG4gIGZvbnRTaXplPzogbnVtYmVyOyAgIC8vIHRleHQgZmllbGRzIG9ubHksIGRlZmF1bHQgMTJcbiAgYm9yZGVyVmlzaWJsZT86IGJvb2xlYW47IC8vIGRlZmF1bHQgdHJ1ZVxufVxuXG4vLyBTYXZlZCBzaWduYXR1cmUgZnJvbSBkYXRhYmFzZVxuaW50ZXJmYWNlIFNhdmVkU2lnbmF0dXJlIHtcbiAgaWQ6IG51bWJlcjtcbiAgdXNlcl9pZDogc3RyaW5nO1xuICBzaWduYXR1cmVfbmFtZTogc3RyaW5nO1xuICBzaWduYXR1cmVfZGF0YTogc3RyaW5nOyAvLyBiYXNlNjQgUE5HXG4gIGlzX2RlZmF1bHQ6IGJvb2xlYW47XG4gIGNyZWF0ZWRfYXQ6IHN0cmluZztcbiAgdXBkYXRlZF9hdDogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBUb29sTW9kZSA9ICdub25lJyB8ICdkcmF3JyB8ICdlcmFzZXInIHwgJ2hpZ2hsaWdodCcgfCAnc2hhcGUnIHwgJ3RleHQnIHwgJ3NpZ25hdHVyZScgfCAnZGF0ZScgfCAnbWFyaycgfCAnZm9ybWZpZWxkJztcbmV4cG9ydCB0eXBlIFJlc2l6ZURpcmVjdGlvbiA9ICduJyB8ICdzJyB8ICdlJyB8ICd3JyB8ICduZScgfCAnbncnIHwgJ3NlJyB8ICdzdyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1wZGYtYW5ub3RhdG9yLW1vZGFsJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BkZi1hbm5vdGF0b3ItbW9kYWwuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wZGYtYW5ub3RhdG9yLW1vZGFsLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUGRmQW5ub3RhdG9yTW9kYWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgQElucHV0KCkgcHVibGljIHBkZlVybCE6IHN0cmluZztcbiAgQElucHV0KCkgcHVibGljIGZpbGVOYW1lPzogc3RyaW5nO1xuICBASW5wdXQoKSBwdWJsaWMgY2FuTWFuYWdlR3VpZGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBAVmlld0NoaWxkcmVuKCdwZGZDYW52YXMnKSBwdWJsaWMgcGRmQ2FudmFzZXMhOiBRdWVyeUxpc3Q8RWxlbWVudFJlZjxIVE1MQ2FudmFzRWxlbWVudD4+O1xuICBAVmlld0NoaWxkcmVuKCdhbm5vdENhbnZhcycpIHB1YmxpYyBhbm5vdENhbnZhc2VzITogUXVlcnlMaXN0PEVsZW1lbnRSZWY8SFRNTENhbnZhc0VsZW1lbnQ+PjtcbiAgQFZpZXdDaGlsZCgnZmlsZUlucHV0JywgeyBzdGF0aWM6IGZhbHNlIH0pIHB1YmxpYyBmaWxlSW5wdXRSZWYhOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCd2aWV3ZXJDb250YWluZXInLCB7IHN0YXRpYzogZmFsc2UgfSkgcHVibGljIHZpZXdlckNvbnRhaW5lclJlZiE6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuXG4gIC8vIENvbnRleHQgTWVudSBzdGF0ZVxuICBwdWJsaWMgY29udGV4dE1lbnUgPSB7XG4gICAgc2hvdzogZmFsc2UsXG4gICAgeDogMCxcbiAgICB5OiAwLFxuICAgIHRhcmdldElkOiAnJyxcbiAgICB0YXJnZXRUeXBlOiAnJ1xuICB9O1xuXG4gIC8vIFRvb2wgbW9kZXNcbiAgcHVibGljIHRvb2xNb2RlOiBUb29sTW9kZSA9ICdub25lJztcbiAgcHVibGljIHNoYXBlVHlwZTogJ3JlY3QnIHwgJ2NpcmNsZScgfCAnYXJyb3cnIHwgJ2xpbmUnID0gJ3JlY3QnO1xuICBwdWJsaWMgc2hvd1NoYXBlTWVudSA9IGZhbHNlO1xuICBwdWJsaWMgc2hvd1NoYXBlRHJvcGRvd24gPSBmYWxzZTtcblxuICBwdWJsaWMgc2hhcGVOb1N0cm9rZSA9IGZhbHNlO1xuXG4gIC8vIFNoYXBlLXNwZWNpZmljIGNvbG9yIHNldHRpbmdzIChzZXBhcmF0ZSBmcm9tIGJydXNoKVxuICBwdWJsaWMgc2hhcGVTdHJva2VDb2xvciA9ICcjMDAwMDAwJztcbiAgcHVibGljIHNoYXBlRmlsbENvbG9yID0gJyNmZmZmZmYnO1xuICBwdWJsaWMgc2hhcGVGaWxsRW5hYmxlZCA9IGZhbHNlO1xuICBwdWJsaWMgc2hhcGVTdHJva2VTaXplID0gMjtcblxuICAvLyBNYWMgUHJldmlldy1zdHlsZSBjb2xvciBzd2F0Y2hlc1xuICBwdWJsaWMgcmVhZG9ubHkgc2hhcGVDb2xvclN3YXRjaGVzID0gW1xuICAgICcjMDAwMDAwJywgJyM0MzQzNDMnLCAnIzY2NjY2NicsICcjOTk5OTk5JywgJyNiN2I3YjcnLCAnI2NjY2NjYycsICcjZDlkOWQ5JywgJyNmZmZmZmYnLFxuICAgICcjZmYwMDAwJywgJyNmZjQ1MDAnLCAnI2ZmOTkwMCcsICcjZmZjYzAwJywgJyMwMGIwNTAnLCAnIzAwYjBmMCcsICcjMDA3MGMwJywgJyM3MDMwYTAnLFxuICAgICcjZmYwMGZmJywgJyNmZjY5YjQnLCAnIzQxNjllMScsICcjMjBiMmFhJywgJyMyMjhiMjInLCAnIzhiNDUxMycsICcjYTA1MjJkJywgJyNkYzE0M2MnXG4gIF07XG5cbiAgcHVibGljIHJlYWRvbmx5IHNoYXBlRmlsbFN3YXRjaGVzID0gW1xuICAgICcjZmZmZmZmJywgJyNmMmYyZjInLCAnI2U2ZTZlNicsICcjZDlkOWQ5JywgJyNjY2NjY2MnLCAnI2I3YjdiNycsICcjOTk5OTk5JywgJyMwMDAwMDAnLFxuICAgICcjZmZjY2NjJywgJyNmZmU1Y2MnLCAnI2ZmZmFjYycsICcjY2NmZmNjJywgJyNjY2Y1ZmYnLCAnI2NjZTBmZicsICcjZTVjY2ZmJywgJyNmZmNjZjInLFxuICAgICcjZmY5OTk5JywgJyNmZmNjOTknLCAnI2ZmZmY5OScsICcjOTlmZjk5JywgJyM5OWYyZmYnLCAnIzk5YmJmZicsICcjY2M5OWZmJywgJyNmZjk5ZWUnXG4gIF07XG5cbiAgcHVibGljIGJydXNoQ29sb3IgPSAnIzAwMDBGRic7XG4gIHB1YmxpYyBicnVzaFNpemUgPSAzO1xuICBwdWJsaWMgaGlnaGxpZ2h0Q29sb3IgPSAnI2ZmZmYwMCc7XG4gIHB1YmxpYyBoaWdobGlnaHRTaXplID0gMjA7XG5cbiAgcHVibGljIGVyYXNlclNpemUgPSAyMDtcblxuICBwdWJsaWMgcGFnZU5vID0gMTtcbiAgcHVibGljIHBhZ2VDb3VudCA9IDA7XG4gIHByaXZhdGUgcmVhZG9ubHkgUEFHRV9DSFVOSyA9IDUwO1xuICBwdWJsaWMgbG9hZGVkVW50aWxQYWdlID0gMDtcbiAgcHVibGljIGlzTG9hZGluZ0NodW5rID0gZmFsc2U7XG4gIHB1YmxpYyB6b29tID0gMTsgLy8gMC41IC0gM1xuICBwdWJsaWMgdmlld01vZGU6ICdzaW5nbGUnIHwgJ2NvbnRpbnVvdXMnID0gJ3NpbmdsZSc7XG4gIHB1YmxpYyBwYWdlczogbnVtYmVyW10gPSBbXTsgLy8gQXJyYXkgWzEsIDIsIC4uLiwgcGFnZUNvdW50XVxuXG4gIHB1YmxpYyBpc0xvYWRpbmcgPSBmYWxzZTtcbiAgcHVibGljIGxvYWRpbmdNZXNzYWdlID0gJyc7XG4gIHB1YmxpYyBzYXZlUHJvZ3Jlc3MgPSAwO1xuICBwcml2YXRlIHJlbmRlcmluZ1BhZ2VzID0gbmV3IFNldDxudW1iZXI+KCk7XG4gIHByaXZhdGUgcmVuZGVyZWRQYWdlcyA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuXG4gIHB1YmxpYyB0ZXh0Qm94ZXM6IFRleHRCb3hbXSA9IFtdO1xuICBwdWJsaWMgaW1hZ2VTdGFtcHM6IEltYWdlU3RhbXBbXSA9IFtdO1xuICBwdWJsaWMgc2hhcGVTdGFtcHM6IFNoYXBlU3RhbXBbXSA9IFtdO1xuICBwdWJsaWMgc2lnbmF0dXJlU3RhbXBzOiBTaWduYXR1cmVTdGFtcFtdID0gW107XG4gIHB1YmxpYyBkYXRlU3RhbXBzOiBEYXRlU3RhbXBbXSA9IFtdO1xuICBwdWJsaWMgcGRmRm9ybUZpZWxkczogUGRmRm9ybUZpZWxkW10gPSBbXTtcbiAgcHJpdmF0ZSBmb3JtRmllbGRDb3VudGVyID0gMDtcbiAgcHVibGljIGFjdGl2ZUZvcm1GaWVsZElkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvLyBNb2RhbCAmIFByZXZpZXcgU3RhdGVzXG4gIHB1YmxpYyBzaG93U2lnbmF0dXJlUGFkID0gZmFsc2U7XG4gIHB1YmxpYyBzaG93U2lnbmF0dXJlUGlja2VyID0gZmFsc2U7XG4gIHB1YmxpYyBzaG93UHJldmlld092ZXJsYXkgPSBmYWxzZTtcbiAgcHVibGljIHByZXZpZXdVcmw6IFNhZmVSZXNvdXJjZVVybCB8IG51bGwgPSBudWxsO1xuICBwdWJsaWMgcHJldmlld1BhZ2VzOiBzdHJpbmdbXSA9IFtdOyAvLyBBcnJheSBvZiBiYXNlNjQgaW1hZ2UgVVJMcyBmb3IgcHJldmlld1xuICBwdWJsaWMgcHJldmlld0lzRmlsdGVyZWQgPSBmYWxzZTsgLy8gdHJ1ZSB3aGVuIHNob3dpbmcgYW5ub3RhdGVkLXBhZ2VzLW9ubHkgcHJldmlld1xuICBwdWJsaWMgcHJldmlld1RvdGFsUGFnZXMgPSAwO1xuICBwdWJsaWMgaXNMb2FkaW5nQWxsUHJldmlldyA9IGZhbHNlO1xuICBwdWJsaWMgcGFnZVRodW1ibmFpbHM6IHN0cmluZ1tdID0gW107IC8vIEFycmF5IG9mIGJhc2U2NCB0aHVtYm5haWwgaW1hZ2VzXG4gIHB1YmxpYyBzaG93VGh1bWJuYWlscyA9IHRydWU7IC8vIFRvZ2dsZSBmb3IgdGh1bWJuYWlscyBzaWRlYmFyXG4gIHByaXZhdGUgbGFzdFNhdmVkQmxvYjogQmxvYiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGxhc3RTYXZlZEZpbGVOYW1lOiBzdHJpbmcgPSAnJztcblxuICBAVmlld0NoaWxkKCdzaWduYXR1cmVDYW52YXMnLCB7IHN0YXRpYzogZmFsc2UgfSkgcHVibGljIHNpZ25hdHVyZUNhbnZhc1JlZiE6IEVsZW1lbnRSZWY8SFRNTENhbnZhc0VsZW1lbnQ+O1xuICBwcml2YXRlIHNpZ25hdHVyZUN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaXNEcmF3aW5nU2lnbmF0dXJlID0gZmFsc2U7XG4gIHByaXZhdGUgc2lnbmF0dXJlUG9pbnRzOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH1bXSA9IFtdO1xuICBwcml2YXRlIHNpZ25hdHVyZVN0cm9rZXM6IHsgcG9pbnRzOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH1bXTsgY29sb3I6IHN0cmluZzsgc2l6ZTogbnVtYmVyIH1bXSA9IFtdO1xuICBwcml2YXRlIGJ1ZmZlckNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvLyBTaWduYXR1cmUgcGVuIHNldHRpbmdzXG4gIHB1YmxpYyBzaWduYXR1cmVQZW5Db2xvciA9ICcjMDAwMDAwJztcbiAgcHVibGljIHNpZ25hdHVyZVBlblNpemUgPSAyLjU7XG5cbiAgLy8gUXVpY2sgTWFyayBTdGFtcCBzZXR0aW5nc1xuICBwdWJsaWMgbWFya1R5cGU6ICdjaGVjaycgfCAnY3Jvc3MnIHwgJ2RvdCcgPSAnY2hlY2snO1xuICBwdWJsaWMgZm9ybUZpZWxkVHlwZTogJ3RleHQnIHwgJ2NoZWNrYm94JyB8ICdyYWRpbycgPSAnY2hlY2tib3gnO1xuICBwdWJsaWMgbWFya0NvbG9yID0gJyMwMDAwMDAnO1xuICBwdWJsaWMgbWFya1NpemUgPSAzMjsgLy8gcHggYXQgMTAwJSB6b29tICh3aWxsIGJlIHNjYWxlZClcbiAgcHVibGljIHNob3dNYXJrT3B0aW9ucyA9IGZhbHNlO1xuXG4gIC8vIERhdGUgU3RhbXAgU2V0dGluZ3NcbiAgcHVibGljIGRhdGVDb2xvciA9ICcjMDAwMDAwJztcbiAgcHVibGljIGRhdGVGb250U2l6ZSA9IDE2O1xuICBwdWJsaWMgc2hvd0RhdGVPcHRpb25zID0gZmFsc2U7XG5cbiAgdG9nZ2xlRGF0ZU9wdGlvbnMoKTogdm9pZCB7XG4gICAgdGhpcy5zaG93RGF0ZU9wdGlvbnMgPSAhdGhpcy5zaG93RGF0ZU9wdGlvbnM7XG4gIH1cblxuICBhZGREYXRlU3RhbXBBbmRTaG93T3B0aW9ucygpOiB2b2lkIHtcbiAgICB0aGlzLmFkZERhdGVTdGFtcCgpO1xuICAgIHRoaXMuc2hvd0RhdGVPcHRpb25zID0gdHJ1ZTtcbiAgfVxuXG4gIHNldERhdGVDb2xvcihjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5kYXRlQ29sb3IgPSBjb2xvcjtcbiAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgY2hhbmdlRGF0ZUZvbnRTaXplKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBuZXdTaXplID0gdGhpcy5kYXRlRm9udFNpemUgKyBkZWx0YTtcbiAgICBpZiAobmV3U2l6ZSA+PSA4ICYmIG5ld1NpemUgPD0gMTAwKSB7XG4gICAgICB0aGlzLmRhdGVGb250U2l6ZSA9IG5ld1NpemU7XG4gICAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFNhdmVkIFNpZ25hdHVyZXMgKGZyb20gZGF0YWJhc2UpXG4gIHB1YmxpYyBzYXZlZFNpZ25hdHVyZXM6IFNhdmVkU2lnbmF0dXJlW10gPSBbXTtcbiAgcHVibGljIGlzTG9hZGluZ1NpZ25hdHVyZXMgPSBmYWxzZTtcbiAgQElucHV0KCkgcHVibGljIHVzZXJJZCA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgdXNlck5hbWUgPSAnJztcbiAgQElucHV0KCkgcHVibGljIGRvY3VtZW50SWQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBwdWJsaWMgZGV0YWlsSWQ6IGFueSA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgZWRvY0lkOiBhbnkgPSAnJztcbiAgQElucHV0KCkgcHVibGljIGlzQ2FuY2VsTW9kZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIERpZ2l0YWwgSUQgc2V0dGluZ3NcbiAgcHVibGljIHNob3dEaWdpdGFsSWQgPSB0cnVlO1xuICBAVmlld0NoaWxkKCdzaWduYXR1cmVGaWxlSW5wdXQnLCB7IHN0YXRpYzogZmFsc2UgfSkgcHVibGljIHNpZ25hdHVyZUZpbGVJbnB1dFJlZiE6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3RodW1iRmlsZUlucHV0JywgeyBzdGF0aWM6IGZhbHNlIH0pIHB1YmxpYyB0aHVtYkZpbGVJbnB1dFJlZiE6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG5cbiAgLy8gVGh1bWJuYWlsIHNpZGViYXIgc3RhdGVcbiAgcHVibGljIHRodW1iSW5zZXJ0SW5kZXggPSAtMTsgICAgLy8gLTEgPSBjbG9zZWQ7IDAgPSBiZWZvcmUgcGFnZSAxOyBpID0gYWZ0ZXIgcGFnZSBpXG4gIHB1YmxpYyB0aHVtYkRyb3Bkb3duVGFyZ2V0SW5kZXg6IG51bWJlciA9IC0xO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBVc2VyIEd1aWRlIE1vZGFsIFN0YXRlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBwdWJsaWMgc2hvd1VzZXJHdWlkZVBhbmVsID0gZmFsc2U7XG4gIHB1YmxpYyBpc0xvYWRpbmdHdWlkZSA9IGZhbHNlO1xuICBwdWJsaWMgaXNFZGl0aW5nR3VpZGUgPSBmYWxzZTtcbiAgcHVibGljIHVzZXJHdWlkZUNvbnRlbnQgPSAnJztcbiAgcHVibGljIHRlbXBHdWlkZUNvbnRlbnQgPSAnJztcbiAgcHVibGljIHRodW1iRHJvcGRvd25Ub3AgPSAwOyAgICAgLy8gRml4ZWQtcG9zaXRpb24gWSBjb29yZCBmb3IgaW5zZXJ0IGRyb3Bkb3duXG4gIHByaXZhdGUgdGh1bWJJbnNlcnRBdEluZGV4ID0gLTE7IC8vIHRoZSBzbG90IGluZGV4IHdoZXJlIGZpbGUgdXBsb2FkIHdhcyB0cmlnZ2VyZWRcblxuICAvLyDilIDilIAgSGlzdG9yeSBQYW5lbCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgcHVibGljIHNob3dIaXN0b3J5UGFuZWwgPSBmYWxzZTtcbiAgcHVibGljIGhpc3RvcnlFbnRyaWVzOiBQZGZIaXN0b3J5RW50cnlbXSA9IFtdO1xuICBwdWJsaWMgaXNMb2FkaW5nSGlzdG9yeSA9IGZhbHNlO1xuXG4gIC8qKiBMb2cgYW4gYWN0aW9uIHRvIHRoZSBydXRzLXBkZiBoaXN0b3J5IEFQSSAoZmlyZS1hbmQtZm9yZ2V0KSAqL1xuICBwcml2YXRlIGxvZ0hpc3RvcnkoXG4gICAgYWN0aW9uVHlwZTogUGRmSGlzdG9yeUVudHJ5WydhY3Rpb25fdHlwZSddLFxuICAgIGRldGFpbDogYW55ID0ge30sXG4gICAgcGFnZU51bWJlcj86IG51bWJlclxuICApOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZG9jdW1lbnRJZCB8fCAhdGhpcy51c2VySWQpIHJldHVybjtcbiAgICB0aGlzLnBkZlN2Yy5sb2dBY3Rpb24oe1xuICAgICAgZG9jdW1lbnRJZDogdGhpcy5kb2N1bWVudElkLFxuICAgICAgdXNlcklkOiB0aGlzLnVzZXJJZCxcbiAgICAgIGFjdGlvblR5cGUsXG4gICAgICBhY3Rpb25EZXRhaWw6IGRldGFpbCxcbiAgICAgIHBhZ2VOdW1iZXI6IHBhZ2VOdW1iZXIgPz8gdGhpcy5wYWdlTm8sXG4gICAgICB1c2VyTmFtZTogdGhpcy51c2VyTmFtZSxcbiAgICB9KS5zdWJzY3JpYmUoKTtcbiAgICAvLyBBbHNvIGFkZCB0byBsb2NhbCBwYW5lbCBpbW1lZGlhdGVseVxuICAgIHRoaXMuaGlzdG9yeUVudHJpZXMudW5zaGlmdCh7XG4gICAgICBpZDogRGF0ZS5ub3coKSxcbiAgICAgIGRvY3VtZW50X2lkOiB0aGlzLmRvY3VtZW50SWQsXG4gICAgICB1c2VyX2lkOiB0aGlzLnVzZXJJZCxcbiAgICAgIGFjdGlvbl90eXBlOiBhY3Rpb25UeXBlLFxuICAgICAgYWN0aW9uX2RldGFpbDogZGV0YWlsLFxuICAgICAgcGFnZV9udW1iZXI6IHBhZ2VOdW1iZXIgPz8gdGhpcy5wYWdlTm8sXG4gICAgICB1c2VyX25hbWU6IHRoaXMudXNlck5hbWUsXG4gICAgICB1c2VyX3Bvc2l0aW9uOiAnJyxcbiAgICAgIGlwX2FkZHJlc3M6ICcnLFxuICAgICAgY3JlYXRlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIH0gYXMgUGRmSGlzdG9yeUVudHJ5KTtcbiAgfVxuXG4gIHRvZ2dsZUhpc3RvcnlQYW5lbCgpOiB2b2lkIHtcbiAgICB0aGlzLnNob3dIaXN0b3J5UGFuZWwgPSAhdGhpcy5zaG93SGlzdG9yeVBhbmVsO1xuICAgIGlmICh0aGlzLnNob3dIaXN0b3J5UGFuZWwgJiYgdGhpcy5kb2N1bWVudElkICYmIHRoaXMuaGlzdG9yeUVudHJpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmxvYWRIaXN0b3J5RnJvbUFwaSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbG9hZEhpc3RvcnlGcm9tQXBpKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kb2N1bWVudElkKSByZXR1cm47XG4gICAgdGhpcy5pc0xvYWRpbmdIaXN0b3J5ID0gdHJ1ZTtcbiAgICB0aGlzLnBkZlN2Yy5nZXRIaXN0b3J5KHRoaXMuZG9jdW1lbnRJZCwgMTAwKS5zdWJzY3JpYmUoe1xuICAgICAgbmV4dDogKHJlcykgPT4ge1xuICAgICAgICB0aGlzLmhpc3RvcnlFbnRyaWVzID0gcmVzLmRhdGE7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nSGlzdG9yeSA9IGZhbHNlO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiAoKSA9PiB7IHRoaXMuaXNMb2FkaW5nSGlzdG9yeSA9IGZhbHNlOyB9LFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0SGlzdG9yeUFjdGlvbkljb24odHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBtYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICBzaWduOiAnZmluZ2VyLXByaW50JywgdGV4dDogJ3RleHQnLCBkcmF3OiAnYnJ1c2gnLFxuICAgICAgaGlnaGxpZ2h0OiAnY29sb3ItZmlsbC1vdXRsaW5lJywgc2hhcGU6ICdzaGFwZXMtb3V0bGluZScsIGltYWdlOiAnaW1hZ2Utb3V0bGluZScsXG4gICAgICBwYWdlX2luc2VydDogJ2FkZC1jaXJjbGUtb3V0bGluZScsIHBhZ2VfZGVsZXRlOiAndHJhc2gtb3V0bGluZScsXG4gICAgICBkYXRlX3N0YW1wOiAnY2FsZW5kYXInLCBzYXZlOiAnc2F2ZS1vdXRsaW5lJywgdXBsb2FkOiAnY2xvdWQtdXBsb2FkLW91dGxpbmUnLCBvcGVuOiAnb3Blbi1vdXRsaW5lJyxcbiAgICB9O1xuICAgIHJldHVybiBtYXBbdHlwZV0gfHwgJ2VsbGlwc2Utb3V0bGluZSc7XG4gIH1cblxuICBnZXRIaXN0b3J5QWN0aW9uTGFiZWwodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBtYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICBzaWduOiAn4Lil4LiH4Lil4Liy4Lii4LmA4LiL4LmH4LiZJywgdGV4dDogJ+C5gOC4nuC4tOC5iOC4oeC4guC5ieC4reC4hOC4p+C4suC4oScsIGRyYXc6ICfguKfguLLguJQnLCBoaWdobGlnaHQ6ICfguYTguK7guYTguKXguJfguYwnLFxuICAgICAgc2hhcGU6ICfguKPguLnguJvguJfguKPguIcnLCBpbWFnZTogJ+C4o+C4ueC4m+C4oOC4suC4nicsIHBhZ2VfaW5zZXJ0OiAn4LmB4LiX4Lij4LiB4Lir4LiZ4LmJ4LiyJywgcGFnZV9kZWxldGU6ICfguKXguJrguKvguJnguYnguLInLFxuICAgICAgZGF0ZV9zdGFtcDogJ+C4p+C4seC4meC4l+C4teC5iCcsIHNhdmU6ICfguJrguLHguJnguJfguLbguIEnLCB1cGxvYWQ6ICfguJnguLPguYDguILguYnguLInLCBvcGVuOiAn4LmA4Lib4Li04LiU4LmA4Lit4LiB4Liq4Liy4LijJyxcbiAgICB9O1xuICAgIHJldHVybiBtYXBbdHlwZV0gfHwgdHlwZTtcbiAgfVxuXG4gIC8vIEluc2VydCBibGFuayBwYWdlXG4gIHB1YmxpYyBzaG93SW5zZXJ0TWVudSA9IGZhbHNlO1xuICBwdWJsaWMgc2hvd1RodW1iSW5zZXJ0TWVudSA9IGZhbHNlO1xuICBwdWJsaWMgaW5zZXJ0T3JpZW50YXRpb246ICdwb3J0cmFpdCcgfCAnbGFuZHNjYXBlJyA9ICdwb3J0cmFpdCc7XG5cbiAgLy8gUGFnZS1vcGVyYXRpb24gdW5kbyBzdGFjayAoaW5zZXJ0IC8gZGVsZXRlIHBhZ2UpXG4gIHByaXZhdGUgcGFnZUhpc3RvcnlTdGFjazoge1xuICAgIGJ5dGVzOiBBcnJheUJ1ZmZlcjtcbiAgICBwYWdlTm86IG51bWJlcjtcbiAgICB0ZXh0Qm94ZXM6IGFueVtdO1xuICAgIGltYWdlU3RhbXBzOiBhbnlbXTtcbiAgICBzaGFwZVN0YW1wczogYW55W107XG4gICAgc2lnbmF0dXJlU3RhbXBzOiBhbnlbXTtcbiAgICBkYXRlU3RhbXBzOiBhbnlbXTtcbiAgICBwZGZGb3JtRmllbGRzOiBhbnlbXTtcbiAgICBzdHJva2VzOiBSZWNvcmQ8bnVtYmVyLCBhbnlbXT47XG4gICAgc2hhcGVzOiBSZWNvcmQ8bnVtYmVyLCBhbnlbXT47XG4gICAgcmVkb1N0YWNrOiBSZWNvcmQ8bnVtYmVyLCBhbnlbXT47XG4gIH1bXSA9IFtdO1xuXG4gIHB1YmxpYyBnZXQgY2FuVW5kb1BhZ2VPcCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucGFnZUhpc3RvcnlTdGFjay5sZW5ndGggPiAwOyB9XG5cbiAgcHJpdmF0ZSBzYXZlUGFnZVNuYXBzaG90KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5iYXNlUGRmQnl0ZXMpIHJldHVybjtcbiAgICAvLyBEZWVwLWNsb25lIGFubm90YXRpb24gYXJyYXlzIGFuZCByZWNvcmRzIHNvIG11dGF0aW9ucyBkb24ndCBhZmZlY3Qgc25hcHNob3RcbiAgICBjb25zdCBjbG9uZUFyciA9IDxUPihhOiBUW10pOiBUW10gPT4gYS5tYXAoeCA9PiAoeyAuLi54IH0pKTtcbiAgICBjb25zdCBjbG9uZVJlYyA9IChyOiBSZWNvcmQ8bnVtYmVyLCBhbnlbXT4pOiBSZWNvcmQ8bnVtYmVyLCBhbnlbXT4gPT4ge1xuICAgICAgY29uc3Qgb3V0OiBSZWNvcmQ8bnVtYmVyLCBhbnlbXT4gPSB7fTtcbiAgICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhyKSkgb3V0W051bWJlcihrKV0gPSBbLi4ucltOdW1iZXIoayldXTtcbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcbiAgICB0aGlzLnBhZ2VIaXN0b3J5U3RhY2sucHVzaCh7XG4gICAgICBieXRlczogdGhpcy5iYXNlUGRmQnl0ZXMuc2xpY2UoMCksXG4gICAgICBwYWdlTm86IHRoaXMucGFnZU5vLFxuICAgICAgdGV4dEJveGVzOiBjbG9uZUFycih0aGlzLnRleHRCb3hlcyksXG4gICAgICBpbWFnZVN0YW1wczogY2xvbmVBcnIodGhpcy5pbWFnZVN0YW1wcyksXG4gICAgICBzaGFwZVN0YW1wczogY2xvbmVBcnIodGhpcy5zaGFwZVN0YW1wcyksXG4gICAgICBzaWduYXR1cmVTdGFtcHM6IGNsb25lQXJyKHRoaXMuc2lnbmF0dXJlU3RhbXBzKSxcbiAgICAgIGRhdGVTdGFtcHM6IGNsb25lQXJyKHRoaXMuZGF0ZVN0YW1wcyksXG4gICAgICBwZGZGb3JtRmllbGRzOiBjbG9uZUFycih0aGlzLnBkZkZvcm1GaWVsZHMpLFxuICAgICAgc3Ryb2tlczogY2xvbmVSZWModGhpcy5zdHJva2VzKSxcbiAgICAgIHNoYXBlczogY2xvbmVSZWModGhpcy5zaGFwZXMpLFxuICAgICAgcmVkb1N0YWNrOiBjbG9uZVJlYyh0aGlzLnJlZG9TdGFjayksXG4gICAgfSk7XG4gICAgLy8gS2VlcCBsYXN0IDIwIHNuYXBzaG90c1xuICAgIGlmICh0aGlzLnBhZ2VIaXN0b3J5U3RhY2subGVuZ3RoID4gMjApIHRoaXMucGFnZUhpc3RvcnlTdGFjay5zaGlmdCgpO1xuICB9XG5cbiAgYXN5bmMgdW5kb1BhZ2VPcCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzbmFwc2hvdCA9IHRoaXMucGFnZUhpc3RvcnlTdGFjay5wb3AoKTtcbiAgICBpZiAoIXNuYXBzaG90KSByZXR1cm47XG4gICAgdGhpcy5zaG93SW5zZXJ0TWVudSA9IGZhbHNlO1xuICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmxvYWRpbmdNZXNzYWdlID0gJ+C4geC4s+C4peC4seC4h+C4ouC5ieC4reC4meC4geC4peC4seC4mi4uLic7XG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmJhc2VQZGZCeXRlcyA9IHNuYXBzaG90LmJ5dGVzO1xuICAgICAgdGhpcy50ZXh0Qm94ZXMgPSBzbmFwc2hvdC50ZXh0Qm94ZXM7XG4gICAgICB0aGlzLmltYWdlU3RhbXBzID0gc25hcHNob3QuaW1hZ2VTdGFtcHM7XG4gICAgICB0aGlzLnNoYXBlU3RhbXBzID0gc25hcHNob3Quc2hhcGVTdGFtcHM7XG4gICAgICB0aGlzLnNpZ25hdHVyZVN0YW1wcyA9IHNuYXBzaG90LnNpZ25hdHVyZVN0YW1wcztcbiAgICAgIHRoaXMuZGF0ZVN0YW1wcyA9IHNuYXBzaG90LmRhdGVTdGFtcHM7XG4gICAgICB0aGlzLnBkZkZvcm1GaWVsZHMgPSBzbmFwc2hvdC5wZGZGb3JtRmllbGRzIHx8IFtdO1xuICAgICAgdGhpcy5zdHJva2VzID0gc25hcHNob3Quc3Ryb2tlcztcbiAgICAgIHRoaXMuc2hhcGVzID0gc25hcHNob3Quc2hhcGVzO1xuICAgICAgdGhpcy5yZWRvU3RhY2sgPSBzbmFwc2hvdC5yZWRvU3RhY2s7XG5cbiAgICAgIGNvbnN0IGNvcHkgPSB0aGlzLmJhc2VQZGZCeXRlcy5zbGljZSgwKTtcbiAgICAgIGlmICh0aGlzLnBkZkRvY1Byb3h5KSB7IHRoaXMucGRmRG9jUHJveHkuZGVzdHJveSgpOyB0aGlzLnBkZkRvY1Byb3h5ID0gbnVsbDsgfVxuICAgICAgY29uc3QgbG9hZGluZ1Rhc2sgPSAocGRmanNMaWIgYXMgYW55KS5nZXREb2N1bWVudCh7IGRhdGE6IGNvcHkgfSk7XG4gICAgICB0aGlzLnBkZkRvY1Byb3h5ID0gYXdhaXQgbG9hZGluZ1Rhc2sucHJvbWlzZTtcbiAgICAgIHRoaXMucGFnZUNvdW50ID0gdGhpcy5wZGZEb2NQcm94eS5udW1QYWdlcztcbiAgICAgIHRoaXMubG9hZGVkVW50aWxQYWdlID0gTWF0aC5taW4odGhpcy5sb2FkZWRVbnRpbFBhZ2UsIHRoaXMucGFnZUNvdW50KTtcbiAgICAgIHRoaXMucGFnZXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiB0aGlzLmxvYWRlZFVudGlsUGFnZSB9LCAoXywgaSkgPT4gaSArIDEpO1xuICAgICAgdGhpcy5wYWdlcy5mb3JFYWNoKHAgPT4gdGhpcy5lbnN1cmVQYWdlKHApKTtcblxuICAgICAgdGhpcy5wZGZQYWdlQXNwZWN0cy5jbGVhcigpO1xuICAgICAgdGhpcy5wZGZQYWdlUm90YXRpb25zLmNsZWFyKCk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0bXBEb2MgPSBhd2FpdCBQREZEb2N1bWVudC5sb2FkKGNvcHkpO1xuICAgICAgICB0bXBEb2MuZ2V0UGFnZXMoKS5mb3JFYWNoKChwZywgaWR4KSA9PiB7XG4gICAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBwZy5nZXRTaXplKCk7XG4gICAgICAgICAgdGhpcy5wZGZQYWdlQXNwZWN0cy5zZXQoaWR4ICsgMSwgd2lkdGggLyBoZWlnaHQpO1xuICAgICAgICAgIHRoaXMucGRmUGFnZVJvdGF0aW9ucy5zZXQoaWR4ICsgMSwgcGcuZ2V0Um90YXRpb24oKS5hbmdsZSB8fCAwKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChfKSB7fVxuXG4gICAgICB0aGlzLnBhZ2VObyA9IE1hdGgubWluKHNuYXBzaG90LnBhZ2VObywgdGhpcy5wYWdlQ291bnQpO1xuICAgICAgdGhpcy5yZW5kZXJlZFBhZ2VzLmNsZWFyKCk7XG4gICAgICB0aGlzLnJlbmRlcmluZ1BhZ2VzLmNsZWFyKCk7XG4gICAgICBhd2FpdCB0aGlzLmdlbmVyYXRlVGh1bWJuYWlscygpO1xuICAgICAgYXdhaXQgdGhpcy5yZW5kZXJBbGxQYWdlcygpO1xuICAgICAgdGhpcy5zY3JvbGxUb1BhZ2UodGhpcy5wYWdlTm8pO1xuXG4gICAgICBjb25zdCB0b2FzdCA9IGF3YWl0IHRoaXMudG9hc3RDdHJsLmNyZWF0ZSh7XG4gICAgICAgIG1lc3NhZ2U6ICfguKLguYnguK3guJnguIHguKXguLHguJrguYDguKPguLXguKLguJrguKPguYnguK3guKLguYHguKXguYnguKcnLFxuICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgY29sb3I6ICdzdWNjZXNzJyxcbiAgICAgICAgcG9zaXRpb246ICdib3R0b20nXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHRvYXN0LnByZXNlbnQoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ3VuZG9QYWdlT3AgZXJyb3I6JywgZXJyKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMubG9hZGluZ01lc3NhZ2UgPSAnJztcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0cm9rZXM6IFJlY29yZDxudW1iZXIsIFN0cm9rZVtdPiA9IHt9O1xuICBwcml2YXRlIHNoYXBlczogUmVjb3JkPG51bWJlciwgU2hhcGVbXT4gPSB7fTtcbiAgcHJpdmF0ZSByZWRvU3RhY2s6IFJlY29yZDxudW1iZXIsIChTdHJva2UgfCBTaGFwZSlbXT4gPSB7fTtcbiAgcHJpdmF0ZSBhY3RpdmVTdHJva2U6IFN0cm9rZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGFjdGl2ZVNoYXBlOiBTaGFwZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGFjdGl2ZUNhbnZhc1JlY3Q6IERPTVJlY3QgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBhY3RpdmVQb2ludGVySWQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwdWJsaWMgYWN0aXZlT2JqZWN0SWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwdWJsaWMgYWN0aXZlT2JqZWN0VHlwZTogJ3RleHQnIHwgJ3NoYXBlJyB8ICdpbWFnZScgfCAnc2lnbmF0dXJlJyB8ICdkYXRlJyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGFjdGl2ZVBvaW50ZXJUeXBlOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSByZW5kZXJSZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBpc1JlbmRlcmluZ0FsbCA9IGZhbHNlO1xuICBwcml2YXRlIHJlbmRlckRlYm91bmNlVGltZXI6IGFueSA9IG51bGw7XG5cbiAgcHJpdmF0ZSBpc0RyYWdnaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgZHJhZ1RleHRCb3hJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZHJhZ09mZnNldFggPSAwO1xuICBwcml2YXRlIGRyYWdPZmZzZXRZID0gMDtcblxuICAvLyBSZXNpemUgc3RhdGVcbiAgcHJpdmF0ZSBpc1Jlc2l6aW5nID0gZmFsc2U7XG4gIHByaXZhdGUgcmVzaXplVGV4dEJveElkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvLyBJbWFnZSBkcmFnIHN0YXRlXG4gIHByaXZhdGUgaXNEcmFnZ2luZ0ltYWdlID0gZmFsc2U7XG4gIHByaXZhdGUgZHJhZ0ltYWdlSWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGlzUmVzaXppbmdJbWFnZSA9IGZhbHNlO1xuICBwcml2YXRlIHJlc2l6ZUltYWdlSWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8vIFNoYXBlU3RhbXAgZHJhZy9yZXNpemUgc3RhdGVcbiAgcHJpdmF0ZSBpc0RyYWdnaW5nU2hhcGUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBkcmFnU2hhcGVJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaXNSZXNpemluZ1NoYXBlID0gZmFsc2U7XG4gIHByaXZhdGUgcmVzaXplU2hhcGVJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSByZXNpemVPYnNlcnZlcjogUmVzaXplT2JzZXJ2ZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBpc1Njcm9sbE5hdmlnYXRpbmcgPSBmYWxzZTtcblxuICBwcml2YXRlIGJhc2VQZGZCeXRlczogQXJyYXlCdWZmZXIgfCBudWxsID0gbnVsbDtcbiAgLyoqIFBERiBwYWdlIGFzcGVjdCByYXRpb3MgKHdpZHRoL2hlaWdodCkgcGVyIHBhZ2UgbnVtYmVyLCBwb3B1bGF0ZWQgYXQgbG9hZCB0aW1lICovXG4gIHByaXZhdGUgcGRmUGFnZUFzcGVjdHM6IE1hcDxudW1iZXIsIG51bWJlcj4gPSBuZXcgTWFwKCk7XG4gIC8qKiBQREYgcGFnZSByb3RhdGlvbnMgKDAvOTAvMTgwLzI3MCkgcGVyIHBhZ2UgbnVtYmVyLCBwb3B1bGF0ZWQgYXQgbG9hZCB0aW1lIGZyb20gcGRmLWxpYiAqL1xuICBwcml2YXRlIHBkZlBhZ2VSb3RhdGlvbnM6IE1hcDxudW1iZXIsIG51bWJlcj4gPSBuZXcgTWFwKCk7XG4gIHB1YmxpYyByZXZObyA9IDE7XG5cbiAgcHJpdmF0ZSBwZGZEb2NQcm94eTogYW55ID0gbnVsbDtcbiAgcHJpdmF0ZSBjdXJyZW50Vmlld3BvcnQ6IGFueSA9IG51bGw7XG5cbiAgLy8gZGVmYXVsdCB0ZXh0IHN0eWxlXG4gIHB1YmxpYyB0ZXh0Q29sb3IgPSAnIzAwMDBGRic7XG4gIHB1YmxpYyB0ZXh0Rm9udFNpemUgPSAxNjtcbiAgcHVibGljIHBlbmRpbmdTaWduYXR1cmVEYXRhVXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBwdWJsaWMgYWN0aXZlVGV4dEJveElkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBwdWJsaWMgZ2V0IGFjdGl2ZVRleHRCb3goKTogVGV4dEJveCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnRleHRCb3hlcy5maW5kKHQgPT4gdC5pZCA9PT0gdGhpcy5hY3RpdmVUZXh0Qm94SWQpIHx8IG51bGw7XG4gIH1cblxuICBwdWJsaWMgY2xvc2UoKTogdm9pZCB7XG4gICAgdGhpcy51bmxvY2tPcmllbnRhdGlvbigpO1xuICAgIHRoaXMubW9kYWxDdHJsLmRpc21pc3MoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgZHJhd01vZGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnRvb2xNb2RlID09PSAnZHJhdycgfHwgKHRoaXMudG9vbE1vZGUgPT09ICdub25lJyAmJiB0aGlzLmFjdGl2ZU9iamVjdFR5cGUgPT09ICdzaWduYXR1cmUnKTsgfVxuICBwdWJsaWMgZ2V0IGVyYXNlck1vZGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnRvb2xNb2RlID09PSAnZXJhc2VyJzsgfVxuICBwdWJsaWMgZ2V0IGhpZ2hsaWdodE1vZGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnRvb2xNb2RlID09PSAnaGlnaGxpZ2h0JzsgfVxuICBwdWJsaWMgZ2V0IHNoYXBlTW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMudG9vbE1vZGUgPT09ICdzaGFwZScgfHwgKHRoaXMudG9vbE1vZGUgPT09ICdub25lJyAmJiB0aGlzLmFjdGl2ZU9iamVjdFR5cGUgPT09ICdzaGFwZScpOyB9XG4gIHB1YmxpYyBnZXQgdGV4dFBsYWNlTW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMudG9vbE1vZGUgPT09ICd0ZXh0JyB8fCAodGhpcy50b29sTW9kZSA9PT0gJ25vbmUnICYmIHRoaXMuYWN0aXZlT2JqZWN0VHlwZSA9PT0gJ3RleHQnKTsgfVxuICBwcml2YXRlIHNpZ25hdHVyZXNBcGlVcmw6IHN0cmluZztcbiAgcHJpdmF0ZSBwZGZXb3JrZXJTcmM6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG1vZGFsQ3RybDogTW9kYWxDb250cm9sbGVyLFxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHRvYXN0Q3RybDogVG9hc3RDb250cm9sbGVyLFxuICAgIHByaXZhdGUgYWxlcnRDdHJsOiBBbGVydENvbnRyb2xsZXIsXG4gICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgcHJpdmF0ZSBwZGZTdmM6IFBkZk1hbmFnZXJTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoUERGX0FOTk9UQVRPUl9DT05GSUcpIGNvbmZpZzogUGRmQW5ub3RhdG9yQ29uZmlnIHwgbnVsbFxuICApIHtcbiAgICB0aGlzLnNpZ25hdHVyZXNBcGlVcmwgPSBjb25maWc/LnNpZ25hdHVyZXNBcGlVcmwgPz8gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzUwMC9hcGkvc2lnbmF0dXJlcyc7XG4gICAgdGhpcy5wZGZXb3JrZXJTcmMgPSBjb25maWc/LnBkZldvcmtlclNyYyA/PyAnL2Fzc2V0cy9wZGYud29ya2VyLm1pbi5tanMnO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zdHJva2VzID0ge307XG4gICAgdGhpcy5zaGFwZXMgPSB7fTtcbiAgICB0aGlzLnJlZG9TdGFjayA9IHt9O1xuICAgIHRoaXMudGV4dEJveGVzID0gW107XG4gICAgdGhpcy5pbWFnZVN0YW1wcyA9IFtdO1xuICAgIHRoaXMuc2hhcGVTdGFtcHMgPSBbXTtcbiAgICB0aGlzLnNpZ25hdHVyZVN0YW1wcyA9IFtdO1xuICAgIHRoaXMuZGF0ZVN0YW1wcyA9IFtdO1xuICAgIHRoaXMuYWN0aXZlU3Ryb2tlID0gbnVsbDtcbiAgICB0aGlzLmFjdGl2ZVNoYXBlID0gbnVsbDtcbiAgICB0aGlzLmFjdGl2ZVRleHRCb3hJZCA9IG51bGw7XG4gICAgdGhpcy5hY3RpdmVPYmplY3RJZCA9IG51bGw7XG4gICAgdGhpcy5hY3RpdmVPYmplY3RUeXBlID0gbnVsbDtcbiAgICB0aGlzLnBlbmRpbmdTaWduYXR1cmVEYXRhVXJsID0gbnVsbDtcbiAgICB0aGlzLnRvb2xNb2RlID0gJ25vbmUnO1xuICAgIHRoaXMucGFnZU5vID0gMTtcbiAgICB0aGlzLnpvb20gPSAxO1xuXG4gICAgdGhpcy5zYXZlZFNpZ25hdHVyZXMgPSBbXTtcbiAgICB0aGlzLnNob3dTaWduYXR1cmVQYWQgPSBmYWxzZTtcbiAgICB0aGlzLnNob3dTaWduYXR1cmVQaWNrZXIgPSBmYWxzZTtcbiAgICB0aGlzLnNob3dQcmV2aWV3T3ZlcmxheSA9IGZhbHNlO1xuICAgIHRoaXMucHJldmlld1VybCA9IG51bGw7XG4gICAgdGhpcy5sYXN0U2F2ZWRCbG9iID0gbnVsbDtcbiAgICB0aGlzLmxhc3RTYXZlZEZpbGVOYW1lID0gJyc7XG4gICAgdGhpcy5pc0RyYXdpbmdTaWduYXR1cmUgPSBmYWxzZTtcbiAgICB0aGlzLnNpZ25hdHVyZVBvaW50cyA9IFtdO1xuICAgIHRoaXMuc2lnbmF0dXJlU3Ryb2tlcyA9IFtdO1xuICAgIHRoaXMuaXNMb2FkaW5nU2lnbmF0dXJlcyA9IGZhbHNlO1xuXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgdGhpcy5kcmFnVGV4dEJveElkID0gbnVsbDtcbiAgICB0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlc2l6ZVRleHRCb3hJZCA9IG51bGw7XG4gICAgdGhpcy5pc0RyYWdnaW5nSW1hZ2UgPSBmYWxzZTtcbiAgICB0aGlzLmRyYWdJbWFnZUlkID0gbnVsbDtcbiAgICB0aGlzLmlzUmVzaXppbmdJbWFnZSA9IGZhbHNlO1xuICAgIHRoaXMucmVzaXplSW1hZ2VJZCA9IG51bGw7XG5cbiAgICB0aGlzLmNvbnRleHRNZW51LnNob3cgPSBmYWxzZTtcblxuICAgIHRoaXMuc2hvd1NoYXBlTWVudSA9IGZhbHNlO1xuICAgIHRoaXMubG9hZFNldHRpbmdzKCk7IC8vIFJlc3RvcmUgdXNlciBwcmVmZXJlbmNlc1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgU0VUVElOR1NfS0VZID0gJ2VzaWduX3BkZl9hbm5vdGF0b3Jfc2V0dGluZ3MnO1xuXG4gIHByaXZhdGUgc2F2ZVNldHRpbmdzKCk6IHZvaWQge1xuICAgIGNvbnN0IHNldHRpbmdzID0ge1xuICAgICAgYnJ1c2hDb2xvcjogdGhpcy5icnVzaENvbG9yLFxuICAgICAgYnJ1c2hTaXplOiB0aGlzLmJydXNoU2l6ZSxcbiAgICAgIGhpZ2hsaWdodENvbG9yOiB0aGlzLmhpZ2hsaWdodENvbG9yLFxuICAgICAgaGlnaGxpZ2h0U2l6ZTogdGhpcy5oaWdobGlnaHRTaXplLFxuICAgICAgZXJhc2VyU2l6ZTogdGhpcy5lcmFzZXJTaXplLFxuICAgICAgdGV4dENvbG9yOiB0aGlzLnRleHRDb2xvcixcbiAgICAgIHRleHRGb250U2l6ZTogdGhpcy50ZXh0Rm9udFNpemUsXG4gICAgICBkYXRlQ29sb3I6IHRoaXMuZGF0ZUNvbG9yLFxuICAgICAgZGF0ZUZvbnRTaXplOiB0aGlzLmRhdGVGb250U2l6ZSxcbiAgICAgIHNoYXBlVHlwZTogdGhpcy5zaGFwZVR5cGUsXG4gICAgICBzaGFwZVN0cm9rZUNvbG9yOiB0aGlzLnNoYXBlU3Ryb2tlQ29sb3IsXG4gICAgICBzaGFwZUZpbGxDb2xvcjogdGhpcy5zaGFwZUZpbGxDb2xvcixcbiAgICAgIHNoYXBlRmlsbEVuYWJsZWQ6IHRoaXMuc2hhcGVGaWxsRW5hYmxlZCxcbiAgICAgIHNoYXBlU3Ryb2tlU2l6ZTogdGhpcy5zaGFwZVN0cm9rZVNpemUsXG4gICAgICBzaGFwZU5vU3Ryb2tlOiB0aGlzLnNoYXBlTm9TdHJva2VcbiAgICB9O1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuU0VUVElOR1NfS0VZLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncykpO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2FkU2V0dGluZ3MoKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNhdmVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5TRVRUSU5HU19LRVkpO1xuICAgICAgaWYgKHNhdmVkKSB7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gSlNPTi5wYXJzZShzYXZlZCk7XG4gICAgICAgIGlmIChzZXR0aW5ncy5icnVzaENvbG9yKSB0aGlzLmJydXNoQ29sb3IgPSBzZXR0aW5ncy5icnVzaENvbG9yO1xuICAgICAgICBpZiAoc2V0dGluZ3MuYnJ1c2hTaXplKSB0aGlzLmJydXNoU2l6ZSA9IHNldHRpbmdzLmJydXNoU2l6ZTtcbiAgICAgICAgaWYgKHNldHRpbmdzLmhpZ2hsaWdodENvbG9yKSB0aGlzLmhpZ2hsaWdodENvbG9yID0gc2V0dGluZ3MuaGlnaGxpZ2h0Q29sb3I7XG4gICAgICAgIGlmIChzZXR0aW5ncy5oaWdobGlnaHRTaXplKSB0aGlzLmhpZ2hsaWdodFNpemUgPSBzZXR0aW5ncy5oaWdobGlnaHRTaXplO1xuICAgICAgICBpZiAoc2V0dGluZ3MuZXJhc2VyU2l6ZSkgdGhpcy5lcmFzZXJTaXplID0gc2V0dGluZ3MuZXJhc2VyU2l6ZTtcbiAgICAgICAgaWYgKHNldHRpbmdzLnRleHRDb2xvcikgdGhpcy50ZXh0Q29sb3IgPSBzZXR0aW5ncy50ZXh0Q29sb3I7XG4gICAgICAgIGlmIChzZXR0aW5ncy50ZXh0Rm9udFNpemUpIHRoaXMudGV4dEZvbnRTaXplID0gc2V0dGluZ3MudGV4dEZvbnRTaXplO1xuICAgICAgICBpZiAoc2V0dGluZ3MuZGF0ZUNvbG9yKSB0aGlzLmRhdGVDb2xvciA9IHNldHRpbmdzLmRhdGVDb2xvcjtcbiAgICAgICAgaWYgKHNldHRpbmdzLmRhdGVGb250U2l6ZSkgdGhpcy5kYXRlRm9udFNpemUgPSBzZXR0aW5ncy5kYXRlRm9udFNpemU7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zaGFwZVR5cGUpIHRoaXMuc2hhcGVUeXBlID0gc2V0dGluZ3Muc2hhcGVUeXBlO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2hhcGVTdHJva2VDb2xvcikgdGhpcy5zaGFwZVN0cm9rZUNvbG9yID0gc2V0dGluZ3Muc2hhcGVTdHJva2VDb2xvcjtcbiAgICAgICAgaWYgKHNldHRpbmdzLnNoYXBlRmlsbENvbG9yKSB0aGlzLnNoYXBlRmlsbENvbG9yID0gc2V0dGluZ3Muc2hhcGVGaWxsQ29sb3I7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zaGFwZUZpbGxFbmFibGVkICE9PSB1bmRlZmluZWQpIHRoaXMuc2hhcGVGaWxsRW5hYmxlZCA9IHNldHRpbmdzLnNoYXBlRmlsbEVuYWJsZWQ7XG4gICAgICAgIGlmIChzZXR0aW5ncy5zaGFwZVN0cm9rZVNpemUpIHRoaXMuc2hhcGVTdHJva2VTaXplID0gc2V0dGluZ3Muc2hhcGVTdHJva2VTaXplO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2hhcGVOb1N0cm9rZSAhPT0gdW5kZWZpbmVkKSB0aGlzLnNoYXBlTm9TdHJva2UgPSBzZXR0aW5ncy5zaGFwZU5vU3Ryb2tlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIGxvYWQgc2V0dGluZ3MgZnJvbSBsb2NhbFN0b3JhZ2UnLCBlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0IHZpc2libGVUZXh0Qm94ZXMoKTogVGV4dEJveFtdIHsgcmV0dXJuIHRoaXMuZ2V0VGV4dEJveGVzRm9yUGFnZSh0aGlzLnBhZ2VObyk7IH1cbiAgcHVibGljIGdldCB2aXNpYmxlSW1hZ2VTdGFtcHMoKTogSW1hZ2VTdGFtcFtdIHsgcmV0dXJuIHRoaXMuZ2V0SW1hZ2VTdGFtcHNGb3JQYWdlKHRoaXMucGFnZU5vKTsgfVxuICBwdWJsaWMgZ2V0IHZpc2libGVTaWduYXR1cmVzKCk6IFNpZ25hdHVyZVN0YW1wW10geyByZXR1cm4gdGhpcy5nZXRTaWduYXR1cmVTdGFtcHNGb3JQYWdlKHRoaXMucGFnZU5vKTsgfVxuICBwdWJsaWMgZ2V0IHZpc2libGVEYXRlU3RhbXBzKCk6IERhdGVTdGFtcFtdIHsgcmV0dXJuIHRoaXMuZ2V0RGF0ZVN0YW1wc0ZvclBhZ2UodGhpcy5wYWdlTm8pOyB9XG5cbiAgcHVibGljIGdldFRleHRCb3hlc0ZvclBhZ2UocDogbnVtYmVyKTogVGV4dEJveFtdIHsgcmV0dXJuIHRoaXMudGV4dEJveGVzLmZpbHRlcih0ID0+IHQucGFnZSA9PT0gcCk7IH1cbiAgcHVibGljIGdldEltYWdlU3RhbXBzRm9yUGFnZShwOiBudW1iZXIpOiBJbWFnZVN0YW1wW10geyByZXR1cm4gdGhpcy5pbWFnZVN0YW1wcy5maWx0ZXIoaSA9PiBpLnBhZ2UgPT09IHApOyB9XG4gIHB1YmxpYyBnZXRSZWd1bGFySW1hZ2VTdGFtcHNGb3JQYWdlKHA6IG51bWJlcik6IEltYWdlU3RhbXBbXSB7IHJldHVybiB0aGlzLmltYWdlU3RhbXBzLmZpbHRlcihpID0+IGkucGFnZSA9PT0gcCAmJiAhaS5pZC5zdGFydHNXaXRoKCdtYXJrXycpKTsgfVxuICBwdWJsaWMgZ2V0TWFya1N0YW1wc0ZvclBhZ2UocDogbnVtYmVyKTogSW1hZ2VTdGFtcFtdIHsgcmV0dXJuIHRoaXMuaW1hZ2VTdGFtcHMuZmlsdGVyKGkgPT4gaS5wYWdlID09PSBwICYmIGkuaWQuc3RhcnRzV2l0aCgnbWFya18nKSk7IH1cbiAgcHVibGljIGdldFNoYXBlU3RhbXBzRm9yUGFnZShwOiBudW1iZXIpOiBTaGFwZVN0YW1wW10geyByZXR1cm4gdGhpcy5zaGFwZVN0YW1wcy5maWx0ZXIocyA9PiBzLnBhZ2UgPT09IHApOyB9XG4gIHB1YmxpYyBnZXRTaWduYXR1cmVTdGFtcHNGb3JQYWdlKHA6IG51bWJlcik6IFNpZ25hdHVyZVN0YW1wW10geyByZXR1cm4gdGhpcy5zaWduYXR1cmVTdGFtcHMuZmlsdGVyKHMgPT4gcy5wYWdlID09PSBwKTsgfVxuICBwdWJsaWMgZ2V0RGF0ZVN0YW1wc0ZvclBhZ2UocDogbnVtYmVyKTogRGF0ZVN0YW1wW10geyByZXR1cm4gdGhpcy5kYXRlU3RhbXBzLmZpbHRlcihkID0+IGQucGFnZSA9PT0gcCk7IH1cblxuICBwdWJsaWMgZ2V0TWFya1N2Z0NvbnRlbnQobWFya1R5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCwgY29sb3I6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gICAgY29uc3QgYyA9IGNvbG9yIHx8ICcjMDAwMDAwJztcbiAgICBpZiAobWFya1R5cGUgPT09ICdjaGVjaycpIHtcbiAgICAgIHJldHVybiBgPHBvbHlsaW5lIHBvaW50cz1cIjEyLDUyIDQyLDgyIDg4LDE4XCIgc3Ryb2tlPVwiJHtjfVwiIHN0cm9rZS13aWR0aD1cIjEwXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgZmlsbD1cIm5vbmVcIi8+YDtcbiAgICB9IGVsc2UgaWYgKG1hcmtUeXBlID09PSAnY3Jvc3MnKSB7XG4gICAgICByZXR1cm4gYDxsaW5lIHgxPVwiMTVcIiB5MT1cIjE1XCIgeDI9XCI4NVwiIHkyPVwiODVcIiBzdHJva2U9XCIke2N9XCIgc3Ryb2tlLXdpZHRoPVwiMTBcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIvPmAgK1xuICAgICAgICAgICAgIGA8bGluZSB4MT1cIjg1XCIgeTE9XCIxNVwiIHgyPVwiMTVcIiB5Mj1cIjg1XCIgc3Ryb2tlPVwiJHtjfVwiIHN0cm9rZS13aWR0aD1cIjEwXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiLz5gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiMzhcIiBmaWxsPVwiJHtjfVwiLz5gO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBMb2NrIHNjcmVlbiBvcmllbnRhdGlvbiB0byBwb3J0cmFpdCB3aGlsZSBhbm5vdGF0aW5nICovXG4gIHByaXZhdGUgYXN5bmMgbG9ja09yaWVudGF0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvcmllbnRhdGlvbiA9IChzY3JlZW4gYXMgYW55KS5vcmllbnRhdGlvbjtcbiAgICAgIGlmIChvcmllbnRhdGlvbiAmJiBvcmllbnRhdGlvbi5sb2NrKSB7XG4gICAgICAgIGF3YWl0IG9yaWVudGF0aW9uLmxvY2soJ3BvcnRyYWl0LXByaW1hcnknKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAvLyBTY3JlZW4gT3JpZW50YXRpb24gQVBJIG5vdCBzdXBwb3J0ZWQgKGUuZy4gaU9TIFNhZmFyaSkg4oCUIGlnbm9yZVxuICAgIH1cbiAgfVxuXG4gIC8qKiBVbmxvY2sgc2NyZWVuIG9yaWVudGF0aW9uIHdoZW4gbGVhdmluZyB0aGUgYW5ub3RhdG9yICovXG4gIHByaXZhdGUgdW5sb2NrT3JpZW50YXRpb24oKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9yaWVudGF0aW9uID0gKHNjcmVlbiBhcyBhbnkpLm9yaWVudGF0aW9uO1xuICAgICAgaWYgKG9yaWVudGF0aW9uICYmIG9yaWVudGF0aW9uLnVubG9jaykge1xuICAgICAgICBvcmllbnRhdGlvbi51bmxvY2soKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChfKSB7IC8qIGlnbm9yZSAqLyB9XG4gIH1cblxuICBhc3luYyBuZ0FmdGVyVmlld0luaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgKHBkZmpzTGliIGFzIGFueSkuR2xvYmFsV29ya2VyT3B0aW9ucy53b3JrZXJTcmMgPSB0aGlzLnBkZldvcmtlclNyYztcbiAgICAvLyBMb2NrIG9yaWVudGF0aW9uIHRvIHBvcnRyYWl0IHNvIHRoZSBQREYgZG9lc24ndCByb3RhdGUgZHVyaW5nIGFubm90YXRpb25cbiAgICB0aGlzLmxvY2tPcmllbnRhdGlvbigpO1xuXG4gICAgLy8gQ2xlYXIgYW5kIHJlc2V0IGNhbnZhc2VzIGJlZm9yZSBsb2FkaW5nIG5ldyBQREZcbiAgICB0aGlzLnBkZkNhbnZhc2VzPy5mb3JFYWNoKHJlZiA9PiB7XG4gICAgICBjb25zdCBjYW52YXMgPSByZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgaWYgKGN0eCkge1xuICAgICAgICBjYW52YXMud2lkdGggPSAwO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gMDtcbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gJzBweCc7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSAnMHB4JztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuYW5ub3RDYW52YXNlcz8uZm9yRWFjaChyZWYgPT4ge1xuICAgICAgY29uc3QgY2FudmFzID0gcmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgY2FudmFzLndpZHRoID0gMDtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IDA7XG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9ICcwcHgnO1xuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gJzBweCc7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBFbnN1cmUgc3RhdGUgaXMgY2xlYW5cbiAgICB0aGlzLnN0cm9rZXMgPSB7fTtcbiAgICB0aGlzLnNoYXBlcyA9IHt9O1xuICAgIHRoaXMucmVkb1N0YWNrID0ge307XG4gICAgdGhpcy5hY3RpdmVTdHJva2UgPSBudWxsO1xuICAgIHRoaXMuYWN0aXZlU2hhcGUgPSBudWxsO1xuICAgIHRoaXMuYWN0aXZlT2JqZWN0SWQgPSBudWxsO1xuICAgIHRoaXMuYWN0aXZlT2JqZWN0VHlwZSA9IG51bGw7XG5cbiAgICBhd2FpdCB0aGlzLmxvYWRQZGZCeXRlc0FuZEluaXRQZGZqcygpO1xuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0dXBSZXNpemVBdXRvUmVuZGVyKCk7XG4gICAgfSk7XG5cbiAgICBhd2FpdCB0aGlzLmZpdFdpZHRoKCk7XG4gICAgdGhpcy5zeW5jVG9vbE1vZGVTdHlsZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3luY1Rvb2xNb2RlU3R5bGVzKCk6IHZvaWQge1xuICAgIC8vIFNldCB0b3VjaC1hY3Rpb246IG5vbmUgZm9yIEFMTCBhY3RpdmUgdG9vbCBtb2RlcyB0byBwcmV2ZW50IGlQYWQgc2Nyb2xsXG4gICAgY29uc3QgaGFzQWN0aXZlVG9vbCA9IHRoaXMudG9vbE1vZGUgIT09ICdub25lJztcbiAgICB0aGlzLnBhZ2VzLmZvckVhY2gocCA9PiB7XG4gICAgICBjb25zdCBjYW52YXMgPSB0aGlzLmdldEFubm90Q2FudmFzKHApO1xuICAgICAgaWYgKGNhbnZhcykge1xuICAgICAgICBjYW52YXMuc3R5bGUudG91Y2hBY3Rpb24gPSBoYXNBY3RpdmVUb29sID8gJ25vbmUnIDogJ2F1dG8nO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlQ3Vyc29yKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZXNpemVPYnNlcnZlcikgdGhpcy5yZXNpemVPYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAvLyBDbGVhbnVwIFBERi5qcyBkb2N1bWVudCB0byBmcmVlIG1lbW9yeVxuICAgIGlmICh0aGlzLnBkZkRvY1Byb3h5KSB7XG4gICAgICB0aGlzLnBkZkRvY1Byb3h5LmRlc3Ryb3koKTtcbiAgICAgIHRoaXMucGRmRG9jUHJveHkgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIENsZWFyIGFsbCBjYW52YXNlcyB0byByZWxlYXNlIG1lbW9yeVxuICAgIHRoaXMucGFnZXMuZm9yRWFjaChwID0+IHtcbiAgICAgIGNvbnN0IHBkZkNhbnZhcyA9IHRoaXMuZ2V0UGRmQ2FudmFzKHApO1xuICAgICAgY29uc3QgYW5ub3RDYW52YXMgPSB0aGlzLmdldEFubm90Q2FudmFzKHApO1xuICAgICAgaWYgKHBkZkNhbnZhcykge1xuICAgICAgICBjb25zdCBjdHggPSBwZGZDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgaWYgKGN0eCkgY3R4LmNsZWFyUmVjdCgwLCAwLCBwZGZDYW52YXMud2lkdGgsIHBkZkNhbnZhcy5oZWlnaHQpO1xuICAgICAgICBwZGZDYW52YXMud2lkdGggPSAwO1xuICAgICAgICBwZGZDYW52YXMuaGVpZ2h0ID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChhbm5vdENhbnZhcykge1xuICAgICAgICBjb25zdCBjdHggPSBhbm5vdENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBpZiAoY3R4KSBjdHguY2xlYXJSZWN0KDAsIDAsIGFubm90Q2FudmFzLndpZHRoLCBhbm5vdENhbnZhcy5oZWlnaHQpO1xuICAgICAgICBhbm5vdENhbnZhcy53aWR0aCA9IDA7XG4gICAgICAgIGFubm90Q2FudmFzLmhlaWdodCA9IDA7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBDbGVhciBkYXRhIGFycmF5c1xuICAgIHRoaXMucGFnZVRodW1ibmFpbHMgPSBbXTtcbiAgICB0aGlzLmJhc2VQZGZCeXRlcyA9IG51bGw7XG4gICAgdGhpcy5zdHJva2VzID0ge307XG4gICAgdGhpcy5zaGFwZXMgPSB7fTtcbiAgICB0aGlzLnRleHRCb3hlcyA9IFtdO1xuICAgIHRoaXMuaW1hZ2VTdGFtcHMgPSBbXTtcbiAgICB0aGlzLnNoYXBlU3RhbXBzID0gW107XG4gICAgdGhpcy5zaWduYXR1cmVTdGFtcHMgPSBbXTtcbiAgICB0aGlzLmRhdGVTdGFtcHMgPSBbXTtcbiAgfVxuXG4gIC8qID09PT09PT09PT09PT09PT09IEtleWJvYXJkIFNob3J0Y3V0cyA9PT09PT09PT09PT09PT09PSAqL1xuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDpwb2ludGVyZG93bicsIFsnJGV2ZW50J10pXG4gIG9uRG9jdW1lbnRQb2ludGVyRG93bihldmVudDogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udGV4dE1lbnUuc2hvdykge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgaWYgKCF0YXJnZXQuY2xvc2VzdCgnLmN1c3RvbS1jb250ZXh0LW1lbnUnKSkge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNsb3NlQ29udGV4dE1lbnUoKTtcbiAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzprZXlkb3duJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlS2V5Ym9hcmQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAvLyBVbmRvOiBDdHJsK1ogb3IgQ21kK1pcbiAgICBpZiAoKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkgJiYgZXZlbnQua2V5ID09PSAneicgJiYgIWV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy51bmRvKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmVkbzogQ3RybCtZIG9yIEN0cmwrU2hpZnQrWiBvciBDbWQrU2hpZnQrWlxuICAgIGlmICgoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSAmJiAoZXZlbnQua2V5ID09PSAneScgfHwgKGV2ZW50LmtleSA9PT0gJ3onICYmIGV2ZW50LnNoaWZ0S2V5KSkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnJlZG8oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBFc2NhcGU6IGV4aXQgbW9kZXNcbiAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgdGhpcy5leGl0QWxsTW9kZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBEZWxldGU6IHJlbW92ZSBhY3RpdmUgb2JqZWN0XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0RlbGV0ZScgfHwgZXZlbnQua2V5ID09PSAnQmFja3NwYWNlJykge1xuICAgICAgY29uc3QgYWN0aXZlRWwgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgLy8gRG9uJ3QgZGVsZXRlIGlmIHVzZXIgaXMgdHlwaW5nIGluIGEgdGV4dGFyZWEgb3IgaW5wdXRcbiAgICAgIGlmIChhY3RpdmVFbD8udGFnTmFtZSA9PT0gJ1RFWFRBUkVBJyB8fCBhY3RpdmVFbD8udGFnTmFtZSA9PT0gJ0lOUFVUJykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmFjdGl2ZU9iamVjdElkICYmIHRoaXMuYWN0aXZlT2JqZWN0VHlwZSkge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVPYmplY3RUeXBlID09PSAndGV4dCcpIHRoaXMucmVtb3ZlVGV4dEJveCh0aGlzLmFjdGl2ZU9iamVjdElkKTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5hY3RpdmVPYmplY3RUeXBlID09PSAnc2hhcGUnKSB0aGlzLnJlbW92ZVNoYXBlU3RhbXAodGhpcy5hY3RpdmVPYmplY3RJZCk7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuYWN0aXZlT2JqZWN0VHlwZSA9PT0gJ2ltYWdlJykgdGhpcy5yZW1vdmVJbWFnZSh0aGlzLmFjdGl2ZU9iamVjdElkKTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5hY3RpdmVPYmplY3RUeXBlID09PSAnc2lnbmF0dXJlJykgdGhpcy5yZW1vdmVTaWduYXR1cmUodGhpcy5hY3RpdmVPYmplY3RJZCk7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuYWN0aXZlT2JqZWN0VHlwZSA9PT0gJ2RhdGUnKSB0aGlzLnJlbW92ZURhdGVTdGFtcCh0aGlzLmFjdGl2ZU9iamVjdElkKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuYWN0aXZlT2JqZWN0SWQgPSBudWxsO1xuICAgICAgICB0aGlzLmFjdGl2ZU9iamVjdFR5cGUgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGV4aXRBbGxNb2RlcygpOiB2b2lkIHtcbiAgICB0aGlzLnRvb2xNb2RlID0gJ25vbmUnO1xuICAgIHRoaXMuc2hvd1NoYXBlTWVudSA9IGZhbHNlO1xuICAgIHRoaXMuYWN0aXZlVGV4dEJveElkID0gbnVsbDtcbiAgICB0aGlzLmFjdGl2ZU9iamVjdElkID0gbnVsbDtcbiAgICB0aGlzLmFjdGl2ZU9iamVjdFR5cGUgPSBudWxsO1xuICAgIHRoaXMucGVuZGluZ1NpZ25hdHVyZURhdGFVcmwgPSBudWxsO1xuICAgIHRoaXMuY2xvc2VDb250ZXh0TWVudSgpO1xuICAgIHRoaXMuc3luY1Rvb2xNb2RlU3R5bGVzKCk7IC8vIFJlc2V0IHRvdWNoLWFjdGlvbiBzbyBpUGFkIGNhbiBzY3JvbGwvcGFuIFBERiBhZ2FpblxuICAgIHRoaXMudXBkYXRlQ3Vyc29yKCk7XG4gIH1cblxuICAvKiA9PT09PT09PT09PT09PT09PSBVc2VyIEd1aWRlIE1ldGhvZHMgPT09PT09PT09PT09PT09PT0gKi9cbiAgdG9nZ2xlVXNlckd1aWRlKGU/OiBFdmVudCk6IHZvaWQge1xuICAgIGlmIChlKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICB0aGlzLnNob3dVc2VyR3VpZGVQYW5lbCA9ICF0aGlzLnNob3dVc2VyR3VpZGVQYW5lbDtcbiAgICBpZiAodGhpcy5zaG93VXNlckd1aWRlUGFuZWwpIHtcbiAgICAgIHRoaXMuaXNFZGl0aW5nR3VpZGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZmV0Y2hHdWlkZURhdGEoKTtcbiAgICB9XG4gIH1cblxuICBmZXRjaEd1aWRlRGF0YSgpOiB2b2lkIHtcbiAgICAvLyBTaW11bGF0ZSBBUEkgZmV0Y2hcbiAgICB0aGlzLmlzTG9hZGluZ0d1aWRlID0gdHJ1ZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIExvZ2ljIGZvciBhY3R1YWwgQVBJIGZldGNoIGdvZXMgaGVyZSAoZS5nLiB0aGlzLmFjY2Vzc1Byb3ZpZGVycy5wb3N0RGF0YSguLi4pKVxuICAgICAgdGhpcy5pc0xvYWRpbmdHdWlkZSA9IGZhbHNlO1xuICAgIH0sIDUwMCk7XG4gIH1cblxuICBlZGl0R3VpZGUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNhbk1hbmFnZUd1aWRlKSByZXR1cm47XG4gICAgdGhpcy50ZW1wR3VpZGVDb250ZW50ID0gdGhpcy51c2VyR3VpZGVDb250ZW50O1xuICAgIHRoaXMuaXNFZGl0aW5nR3VpZGUgPSB0cnVlO1xuICB9XG5cbiAgY2FuY2VsRWRpdEd1aWRlKCk6IHZvaWQge1xuICAgIHRoaXMuaXNFZGl0aW5nR3VpZGUgPSBmYWxzZTtcbiAgICB0aGlzLnRlbXBHdWlkZUNvbnRlbnQgPSAnJztcbiAgfVxuXG4gIHNhdmVHdWlkZSgpOiB2b2lkIHtcbiAgICAvLyBTaW11bGF0ZSBBUEkgc2F2ZVxuICAgIHRoaXMudXNlckd1aWRlQ29udGVudCA9IHRoaXMudGVtcEd1aWRlQ29udGVudDtcbiAgICB0aGlzLmlzRWRpdGluZ0d1aWRlID0gZmFsc2U7XG4gICAgXG4gICAgLy8gQ2FsbCBBUEkgaGVyZSB0byBzYXZlIHBlcm1hbmVudGx5XG4gICAgLy8gZS5nLiB0aGlzLmFjY2Vzc1Byb3ZpZGVycy5wb3N0RGF0YSh7IGNvbnRlbnQ6IHRoaXMudXNlckd1aWRlQ29udGVudCB9LCAnc2F2ZV9ndWlkZS5waHAnKS4uLlxuICB9XG5cbiAgLyogPT09PT09PT09PT09PT09PT0gQ29udGV4dCBNZW51IE1ldGhvZHMgPT09PT09PT09PT09PT09PT0gKi9cbiAgY2xvc2VDb250ZXh0TWVudSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250ZXh0TWVudS5zaG93KSB7XG4gICAgICB0aGlzLmNvbnRleHRNZW51LnNob3cgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBvbkNvbnRleHRNZW51KGU6IE1vdXNlRXZlbnQsIGlkOiBzdHJpbmcsIHR5cGU6IHN0cmluZyk6IHZvaWQge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIFxuICAgIC8vIEF1dG8tc3dpdGNoIHRvIHNlbGVjdCBtb2RlIHdoZW4gcmlnaHQgY2xpY2tpbmcgdG8gZW5zdXJlIHNtb290aCBVWFxuICAgIGlmICh0aGlzLnRvb2xNb2RlICE9PSAnbm9uZScpIHtcbiAgICAgIHRoaXMuc2V0VG9vbE1vZGUoJ25vbmUnKTtcbiAgICB9XG4gICAgXG4gICAgLy8gUG9zaXRpb24gbWVudSBleGFjdGx5IGF0IG1vdXNlXG4gICAgdGhpcy5jb250ZXh0TWVudS54ID0gZS5jbGllbnRYO1xuICAgIHRoaXMuY29udGV4dE1lbnUueSA9IGUuY2xpZW50WTtcbiAgICB0aGlzLmNvbnRleHRNZW51LnRhcmdldElkID0gaWQ7XG4gICAgdGhpcy5jb250ZXh0TWVudS50YXJnZXRUeXBlID0gdHlwZTtcbiAgICB0aGlzLmNvbnRleHRNZW51LnNob3cgPSB0cnVlO1xuICAgIFxuICAgIC8vIEZvcmNlIFVJIHVwZGF0ZSBpbW1lZGlhdGVseSB0byBwcmV2ZW50IFwic2xvd1wiIGZlZWxpbmdcbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBwcml2YXRlIGdldENvbnRleHRUYXJnZXRPYmplY3QoKTogYW55IHtcbiAgICBjb25zdCBpZCA9IHRoaXMuY29udGV4dE1lbnUudGFyZ2V0SWQ7XG4gICAgc3dpdGNoICh0aGlzLmNvbnRleHRNZW51LnRhcmdldFR5cGUpIHtcbiAgICAgIGNhc2UgJ3RleHQnOiByZXR1cm4gdGhpcy50ZXh0Qm94ZXMuZmluZCh0ID0+IHQuaWQgPT09IGlkKTtcbiAgICAgIGNhc2UgJ3NoYXBlJzogcmV0dXJuIHRoaXMuc2hhcGVTdGFtcHMuZmluZChzID0+IHMuaWQgPT09IGlkKTtcbiAgICAgIGNhc2UgJ2ltYWdlJzogcmV0dXJuIHRoaXMuaW1hZ2VTdGFtcHMuZmluZChpID0+IGkuaWQgPT09IGlkKTtcbiAgICAgIGNhc2UgJ3NpZ25hdHVyZSc6IHJldHVybiB0aGlzLnNpZ25hdHVyZVN0YW1wcy5maW5kKHMgPT4gcy5pZCA9PT0gaWQpO1xuICAgICAgY2FzZSAnZGF0ZSc6IHJldHVybiB0aGlzLmRhdGVTdGFtcHMuZmluZChkID0+IGQuaWQgPT09IGlkKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGdldEFsbEFubm90YXRpb25zWkluZGljZXMoKTogbnVtYmVyW10ge1xuICAgIGNvbnN0IGFsbCA9IFtcbiAgICAgIC4uLnRoaXMudGV4dEJveGVzLCAuLi50aGlzLnNoYXBlU3RhbXBzLCAuLi50aGlzLmltYWdlU3RhbXBzLFxuICAgICAgLi4udGhpcy5zaWduYXR1cmVTdGFtcHMsIC4uLnRoaXMuZGF0ZVN0YW1wc1xuICAgIF07XG4gICAgcmV0dXJuIGFsbC5tYXAoYSA9PiBhLnpJbmRleCB8fCAxMCk7XG4gIH1cblxuICBjb250ZXh0QnJpbmdUb0Zyb250KCk6IHZvaWQge1xuICAgIGNvbnN0IG9iaiA9IHRoaXMuZ2V0Q29udGV4dFRhcmdldE9iamVjdCgpO1xuICAgIGlmIChvYmopIHtcbiAgICAgIGNvbnN0IHpzID0gdGhpcy5nZXRBbGxBbm5vdGF0aW9uc1pJbmRpY2VzKCk7XG4gICAgICBjb25zdCBtYXhaID0genMubGVuZ3RoID8gTWF0aC5tYXgoLi4uenMpIDogMTA7XG4gICAgICBvYmouekluZGV4ID0gbWF4WiArIDE7XG4gICAgICB0aGlzLmNsb3NlQ29udGV4dE1lbnUoKTtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBjb250ZXh0QnJpbmdGb3J3YXJkKCk6IHZvaWQge1xuICAgIGNvbnN0IG9iaiA9IHRoaXMuZ2V0Q29udGV4dFRhcmdldE9iamVjdCgpO1xuICAgIGlmIChvYmopIHtcbiAgICAgIG9iai56SW5kZXggPSAob2JqLnpJbmRleCB8fCAxMCkgKyAxO1xuICAgICAgdGhpcy5jbG9zZUNvbnRleHRNZW51KCk7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgY29udGV4dFNlbmRCYWNrd2FyZCgpOiB2b2lkIHtcbiAgICBjb25zdCBvYmogPSB0aGlzLmdldENvbnRleHRUYXJnZXRPYmplY3QoKTtcbiAgICBpZiAob2JqKSB7XG4gICAgICBvYmouekluZGV4ID0gKG9iai56SW5kZXggfHwgMTApIC0gMTtcbiAgICAgIHRoaXMuY2xvc2VDb250ZXh0TWVudSgpO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnRleHRTZW5kVG9CYWNrKCk6IHZvaWQge1xuICAgIGNvbnN0IG9iaiA9IHRoaXMuZ2V0Q29udGV4dFRhcmdldE9iamVjdCgpO1xuICAgIGlmIChvYmopIHtcbiAgICAgIGNvbnN0IHpzID0gdGhpcy5nZXRBbGxBbm5vdGF0aW9uc1pJbmRpY2VzKCk7XG4gICAgICBjb25zdCBtaW5aID0genMubGVuZ3RoID8gTWF0aC5taW4oLi4uenMpIDogMTA7XG4gICAgICBvYmouekluZGV4ID0gTWF0aC5tYXgoMSwgbWluWiAtIDEpO1xuICAgICAgdGhpcy5jbG9zZUNvbnRleHRNZW51KCk7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgZGVsZXRlQ29udGV4dE1lbnVUYXJnZXQoKTogdm9pZCB7XG4gICAgY29uc3QgaWQgPSB0aGlzLmNvbnRleHRNZW51LnRhcmdldElkO1xuICAgIHN3aXRjaCAodGhpcy5jb250ZXh0TWVudS50YXJnZXRUeXBlKSB7XG4gICAgICBjYXNlICd0ZXh0JzogdGhpcy5yZW1vdmVUZXh0Qm94KGlkKTsgYnJlYWs7XG4gICAgICBjYXNlICdzaGFwZSc6IHRoaXMucmVtb3ZlU2hhcGVTdGFtcChpZCk7IGJyZWFrO1xuICAgICAgY2FzZSAnaW1hZ2UnOiB0aGlzLnJlbW92ZUltYWdlKGlkKTsgYnJlYWs7XG4gICAgICBjYXNlICdzaWduYXR1cmUnOiB0aGlzLnJlbW92ZVNpZ25hdHVyZShpZCk7IGJyZWFrO1xuICAgICAgY2FzZSAnZGF0ZSc6IHRoaXMucmVtb3ZlRGF0ZVN0YW1wKGlkKTsgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMuY2xvc2VDb250ZXh0TWVudSgpO1xuICB9XG5cbiAgLyogPT09PT09PT09PT09PT09PT0gUERGIGxvYWQgPT09PT09PT09PT09PT09PT0gKi9cbiAgcHJpdmF0ZSBhc3luYyBsb2FkUGRmQnl0ZXNBbmRJbml0UGRmanMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMubG9hZGluZ01lc3NhZ2UgPSAn4LiB4Liz4Lil4Lix4LiH4LmC4Lir4Lil4LiUIFBERi4uLic7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgYnVmZmVyID0gYXdhaXQgdGhpcy5odHRwXG4gICAgICAgIC5nZXQodGhpcy5wZGZVcmwsIHsgcmVzcG9uc2VUeXBlOiAnYXJyYXlidWZmZXInIH0pXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIHRpbWVvdXQoNjAwMDApLFxuICAgICAgICAgIHJldHJ5KDIpXG4gICAgICAgIClcbiAgICAgICAgLnRvUHJvbWlzZSgpO1xuXG4gICAgICBpZiAoIWJ1ZmZlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ+C5hOC4oeC5iOC4quC4suC4oeC4suC4o+C4luC5guC4q+C4peC4lOC5hOC4n+C4peC5jCBQREYg4LmE4LiU4LmJJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYmFzZVBkZkJ5dGVzID0gYnVmZmVyIGFzIEFycmF5QnVmZmVyO1xuXG4gICAgICBjb25zdCBsb2FkaW5nVGFzayA9IChwZGZqc0xpYiBhcyBhbnkpLmdldERvY3VtZW50KHsgZGF0YTogYnVmZmVyIH0pO1xuICAgICAgdGhpcy5wZGZEb2NQcm94eSA9IGF3YWl0IGxvYWRpbmdUYXNrLnByb21pc2U7XG4gICAgICB0aGlzLnBhZ2VDb3VudCA9IHRoaXMucGRmRG9jUHJveHkubnVtUGFnZXMgfHwgMTtcblxuICAgICAgLy8gSW5pdGlhbGl6ZSBhbm5vdGF0aW9uIGRhdGEgZm9yIEFMTCBwYWdlcyB1cGZyb250XG4gICAgICBmb3IgKGxldCBwID0gMTsgcCA8PSB0aGlzLnBhZ2VDb3VudDsgcCsrKSB0aGlzLmVuc3VyZVBhZ2UocCk7XG5cbiAgICAgIC8vIE9ubHkgcmVuZGVyIGZpcnN0IGNodW5rIGluIHRoZSBET01cbiAgICAgIHRoaXMubG9hZGVkVW50aWxQYWdlID0gTWF0aC5taW4odGhpcy5QQUdFX0NIVU5LLCB0aGlzLnBhZ2VDb3VudCk7XG4gICAgICB0aGlzLnBhZ2VzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogdGhpcy5sb2FkZWRVbnRpbFBhZ2UgfSwgKF8sIGkpID0+IGkgKyAxKTtcblxuICAgICAgLy8gU3RvcmUgUERGIHBhZ2UgYXNwZWN0IHJhdGlvcyBhbmQgcm90YXRpb25zIGZvciBjb3JyZWN0IHJlbmRlcmluZyBhbmQgc3RhbXAgY2FsY3VsYXRpb25cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRtcERvYyA9IGF3YWl0IFBERkRvY3VtZW50LmxvYWQoYnVmZmVyIGFzIEFycmF5QnVmZmVyKTtcbiAgICAgICAgdG1wRG9jLmdldFBhZ2VzKCkuZm9yRWFjaCgocGcsIGlkeCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gcGcuZ2V0U2l6ZSgpO1xuICAgICAgICAgIHRoaXMucGRmUGFnZUFzcGVjdHMuc2V0KGlkeCArIDEsIHdpZHRoIC8gaGVpZ2h0KTtcbiAgICAgICAgICAvLyBTdG9yZSByb3RhdGlvbiBzbyByZW5kZXJQYWdlIGNhbiBmb3JjZSBjb3JyZWN0IGxhbmRzY2FwZS9wb3J0cmFpdCB2aWV3cG9ydFxuICAgICAgICAgIHRoaXMucGRmUGFnZVJvdGF0aW9ucy5zZXQoaWR4ICsgMSwgcGcuZ2V0Um90YXRpb24oKS5hbmdsZSB8fCAwKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgIC8vIEZhbGxiYWNrOiBhc3BlY3QgcmF0aW9zIHdpbGwgYmUgY29tcHV0ZWQgZnJvbSBjYW52YXMgYXQgcGxhY2VtZW50IHRpbWVcbiAgICAgIH1cblxuICAgICAgLy8gR2VuZXJhdGUgdGh1bWJuYWlscyBhZnRlciBsb2FkaW5nIFBERlxuICAgICAgYXdhaXQgdGhpcy5nZW5lcmF0ZVRodW1ibmFpbHMoKTtcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBsb2FkaW5nIFBERjonLCBlcnJvcik7XG5cbiAgICAgIGNvbnN0IGlzVGltZW91dCA9IGVycm9yPy5uYW1lID09PSAnVGltZW91dEVycm9yJztcbiAgICAgIGNvbnN0IGlzTmV0d29yayA9IGVycm9yPy5zdGF0dXMgPT09IDA7XG4gICAgICBjb25zdCBpczQwNCA9IGVycm9yPy5zdGF0dXMgPT09IDQwNDtcbiAgICAgIGxldCBtc2cgPSAn4LmE4Lih4LmI4Liq4Liy4Lih4Liy4Lij4LiW4LmC4Lir4Lil4LiUIFBERiDguYTguJTguYkg4LiB4Lij4Li44LiT4Liy4Lil4Lit4LiH4LmD4Lir4Lih4LmI4Lit4Li14LiB4LiE4Lij4Lix4LmJ4LiHJztcbiAgICAgIGlmIChpc1RpbWVvdXQpIG1zZyA9ICfguYLguKvguKXguJQgUERGIOC4q+C4oeC4lOC5gOC4p+C4peC4siAoVGltZW91dCkg4LiB4Lij4Li44LiT4Liy4LiV4Lij4Lin4LiI4Liq4Lit4Lia4LiB4Liy4Lij4LmA4LiK4Li34LmI4Lit4Lih4LiV4LmI4LitJztcbiAgICAgIGVsc2UgaWYgKGlzTmV0d29yaykgbXNnID0gJ+C5hOC4oeC5iOC4quC4suC4oeC4suC4o+C4luC5gOC4iuC4t+C5iOC4reC4oeC4leC5iOC4rSBTZXJ2ZXIg4LmE4LiU4LmJIOC4geC4o+C4uOC4k+C4suC4leC4o+C4p+C4iOC4quC4reC4muC5gOC4hOC4o+C4t+C4reC4guC5iOC4suC4oic7XG4gICAgICBlbHNlIGlmIChpczQwNCkgbXNnID0gJ+C5hOC4oeC5iOC4nuC4muC5hOC4n+C4peC5jCBQREYg4Lia4LiZIFNlcnZlciDguIHguKPguLjguJPguLLguJXguLTguJTguJXguYjguK3guJzguLnguYnguJTguLnguYHguKXguKPguLDguJrguJonO1xuXG4gICAgICBjb25zdCB0b2FzdCA9IGF3YWl0IHRoaXMudG9hc3RDdHJsLmNyZWF0ZSh7XG4gICAgICAgIG1lc3NhZ2U6IG1zZyxcbiAgICAgICAgZHVyYXRpb246IDQwMDAsXG4gICAgICAgIGNvbG9yOiAnZGFuZ2VyJyxcbiAgICAgICAgcG9zaXRpb246ICdtaWRkbGUnXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHRvYXN0LnByZXNlbnQoKTtcblxuICAgICAgdGhpcy51bmxvY2tPcmllbnRhdGlvbigpO1xuICAgICAgdGhpcy5tb2RhbEN0cmwuZGlzbWlzcyh7IGVycm9yOiB0cnVlLCBtZXNzYWdlOiBtc2cgfSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmxvYWRpbmdNZXNzYWdlID0gJyc7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2VuZXJhdGVUaHVtYm5haWxzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5wZGZEb2NQcm94eSkgcmV0dXJuO1xuICAgIHRoaXMucGFnZVRodW1ibmFpbHMgPSBbXTtcbiAgICBhd2FpdCB0aGlzLmdlbmVyYXRlVGh1bWJuYWlsc1JhbmdlKDEsIHRoaXMubG9hZGVkVW50aWxQYWdlKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgZ2VuZXJhdGVUaHVtYm5haWxzUmFuZ2UoZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnBkZkRvY1Byb3h5KSByZXR1cm47XG4gICAgY29uc3Qgc2NhbGUgPSAwLjI7XG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPD0gdG87IGkrKykge1xuICAgICAgY29uc3QgcGFnZSA9IGF3YWl0IHRoaXMucGRmRG9jUHJveHkuZ2V0UGFnZShpKTtcbiAgICAgIGNvbnN0IHZpZXdwb3J0ID0gcGFnZS5nZXRWaWV3cG9ydCh7IHNjYWxlIH0pO1xuICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG4gICAgICBjYW52YXMud2lkdGggPSB2aWV3cG9ydC53aWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB2aWV3cG9ydC5oZWlnaHQ7XG4gICAgICBhd2FpdCBwYWdlLnJlbmRlcih7IGNhbnZhc0NvbnRleHQ6IGN0eCwgdmlld3BvcnQgfSkucHJvbWlzZTtcbiAgICAgIHRoaXMucGFnZVRodW1ibmFpbHMucHVzaChjYW52YXMudG9EYXRhVVJMKCdpbWFnZS9wbmcnKSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZE5leHRDaHVuaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5pc0xvYWRpbmdDaHVuayB8fCB0aGlzLmxvYWRlZFVudGlsUGFnZSA+PSB0aGlzLnBhZ2VDb3VudCkgcmV0dXJuO1xuICAgIHRoaXMuaXNMb2FkaW5nQ2h1bmsgPSB0cnVlO1xuXG4gICAgY29uc3QgbmV3RW5kID0gTWF0aC5taW4odGhpcy5sb2FkZWRVbnRpbFBhZ2UgKyB0aGlzLlBBR0VfQ0hVTkssIHRoaXMucGFnZUNvdW50KTtcbiAgICBjb25zdCBwcmV2RW5kID0gdGhpcy5sb2FkZWRVbnRpbFBhZ2U7XG5cbiAgICBhd2FpdCB0aGlzLmdlbmVyYXRlVGh1bWJuYWlsc1JhbmdlKHByZXZFbmQgKyAxLCBuZXdFbmQpO1xuXG4gICAgZm9yIChsZXQgcCA9IHByZXZFbmQgKyAxOyBwIDw9IG5ld0VuZDsgcCsrKSB0aGlzLnBhZ2VzLnB1c2gocCk7XG4gICAgdGhpcy5sb2FkZWRVbnRpbFBhZ2UgPSBuZXdFbmQ7XG5cbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgYXdhaXQgbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHIsIDUwKSk7XG5cbiAgICBmb3IgKGxldCBwID0gcHJldkVuZCArIDE7IHAgPD0gbmV3RW5kOyBwKyspIGF3YWl0IHRoaXMucmVuZGVyUGFnZShwKTtcblxuICAgIHRoaXMuaXNMb2FkaW5nQ2h1bmsgPSBmYWxzZTtcbiAgfVxuXG4gIGdvVG9QYWdlKHBhZ2VOdW06IG51bWJlcik6IHZvaWQge1xuICAgIGlmIChwYWdlTnVtIDwgMSB8fCBwYWdlTnVtID4gdGhpcy5wYWdlQ291bnQpIHJldHVybjtcbiAgICB0aGlzLnBhZ2VObyA9IHBhZ2VOdW07XG4gICAgdGhpcy5zY3JvbGxUb1BhZ2UodGhpcy5wYWdlTm8pO1xuICAgIC8vIFJlLWZpdCB3aWR0aCBpbiBjYXNlIG5ldyBwYWdlIGhhcyBkaWZmZXJlbnQgb3JpZW50YXRpb24gKGxhbmRzY2FwZSB2cyBwb3J0cmFpdClcbiAgICB0aGlzLmZpdFdpZHRoKCk7XG4gIH1cblxuICB0b2dnbGVUaHVtYm5haWxzKCk6IHZvaWQge1xuICAgIHRoaXMuc2hvd1RodW1ibmFpbHMgPSAhdGhpcy5zaG93VGh1bWJuYWlscztcbiAgfVxuXG4gIC8qID09PT09PT09PT09PT09PT09IEluc2VydCBCbGFuayBQYWdlID09PT09PT09PT09PT09PT09ICovXG4gIGFzeW5jIGluc2VydEJsYW5rUGFnZSh3aGVyZTogJ2JlZm9yZScgfCAnYWZ0ZXInKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLmJhc2VQZGZCeXRlcykgcmV0dXJuO1xuICAgIHRoaXMuc2hvd0luc2VydE1lbnUgPSBmYWxzZTtcbiAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5sb2FkaW5nTWVzc2FnZSA9ICfguIHguLPguKXguLHguIfguYHguJfguKPguIHguKvguJnguYnguLLguYDguJvguKXguYjguLIuLi4nO1xuICAgIHRoaXMuc2F2ZVBhZ2VTbmFwc2hvdCgpOyAvLyDguJrguLHguJnguJfguLbguIEgc25hcHNob3Qg4LiB4LmI4Lit4LiZ4LmB4LiB4LmJ4LmE4LiCXG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBkZkRvYyA9IGF3YWl0IFBERkRvY3VtZW50LmxvYWQodGhpcy5iYXNlUGRmQnl0ZXMpO1xuICAgICAgY29uc3QgcGFnZXMgPSBwZGZEb2MuZ2V0UGFnZXMoKTtcbiAgICAgIGNvbnN0IHJlZlBhZ2UgPSBwYWdlc1t0aGlzLnBhZ2VObyAtIDFdO1xuICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSByZWZQYWdlLmdldFNpemUoKTtcblxuICAgICAgLy8gRGV0ZXJtaW5lIHBhZ2UgZGltZW5zaW9ucyBiYXNlZCBvbiBjaG9zZW4gb3JpZW50YXRpb25cbiAgICAgIGxldCBwYWdlVzogbnVtYmVyO1xuICAgICAgbGV0IHBhZ2VIOiBudW1iZXI7XG4gICAgICBpZiAodGhpcy5pbnNlcnRPcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZScpIHtcbiAgICAgICAgcGFnZVcgPSBNYXRoLm1heCh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcGFnZUggPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhZ2VXID0gTWF0aC5taW4od2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHBhZ2VIID0gTWF0aC5tYXgod2lkdGgsIGhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluc2VydEluZGV4ID0gd2hlcmUgPT09ICdiZWZvcmUnID8gdGhpcy5wYWdlTm8gLSAxIDogdGhpcy5wYWdlTm87XG4gICAgICBwZGZEb2MuaW5zZXJ0UGFnZShpbnNlcnRJbmRleCwgW3BhZ2VXLCBwYWdlSF0pO1xuXG4gICAgICBjb25zdCBuZXdCeXRlcyA9IGF3YWl0IHBkZkRvYy5zYXZlKCk7XG4gICAgICB0aGlzLmJhc2VQZGZCeXRlcyA9IG5ld0J5dGVzLmJ1ZmZlciBhcyBBcnJheUJ1ZmZlcjtcblxuICAgICAgLy8gU2hpZnQgYW5ub3RhdGlvbnMgdGhhdCBhcmUgb24gcGFnZXMgPj0gaW5zZXJ0SW5kZXgrMVxuICAgICAgY29uc3Qgc2hpZnRQYWdlID0gaW5zZXJ0SW5kZXggKyAxOyAvLyAxLWJhc2VkIHBhZ2UgbnVtYmVyIG9mIGZpcnN0IHNoaWZ0ZWQgcGFnZVxuICAgICAgY29uc3Qgc2hpZnRBbm5vdGF0aW9ucyA9IDxUIGV4dGVuZHMgeyBwYWdlOiBudW1iZXIgfT4oYXJyOiBUW10pOiBUW10gPT5cbiAgICAgICAgYXJyLm1hcChhID0+IGEucGFnZSA+PSBzaGlmdFBhZ2UgPyB7IC4uLmEsIHBhZ2U6IGEucGFnZSArIDEgfSA6IGEpO1xuXG4gICAgICB0aGlzLnRleHRCb3hlcyA9IHNoaWZ0QW5ub3RhdGlvbnModGhpcy50ZXh0Qm94ZXMpO1xuICAgICAgdGhpcy5pbWFnZVN0YW1wcyA9IHNoaWZ0QW5ub3RhdGlvbnModGhpcy5pbWFnZVN0YW1wcyk7XG4gICAgICB0aGlzLnNoYXBlU3RhbXBzID0gc2hpZnRBbm5vdGF0aW9ucyh0aGlzLnNoYXBlU3RhbXBzKTtcbiAgICAgIHRoaXMuc2lnbmF0dXJlU3RhbXBzID0gc2hpZnRBbm5vdGF0aW9ucyh0aGlzLnNpZ25hdHVyZVN0YW1wcyk7XG4gICAgICB0aGlzLmRhdGVTdGFtcHMgPSBzaGlmdEFubm90YXRpb25zKHRoaXMuZGF0ZVN0YW1wcyk7XG5cbiAgICAgIC8vIFNoaWZ0IHN0cm9rZS9zaGFwZSByZWNvcmRzXG4gICAgICBjb25zdCBzaGlmdFJlY29yZCA9IChyZWM6IFJlY29yZDxudW1iZXIsIGFueVtdPik6IFJlY29yZDxudW1iZXIsIGFueVtdPiA9PiB7XG4gICAgICAgIGNvbnN0IG5leHQ6IFJlY29yZDxudW1iZXIsIGFueVtdPiA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhyZWMpKSB7XG4gICAgICAgICAgY29uc3QgcCA9IE51bWJlcihrZXkpO1xuICAgICAgICAgIG5leHRbcCA+PSBzaGlmdFBhZ2UgPyBwICsgMSA6IHBdID0gcmVjW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgfTtcbiAgICAgIHRoaXMuc3Ryb2tlcyA9IHNoaWZ0UmVjb3JkKHRoaXMuc3Ryb2tlcyk7XG4gICAgICB0aGlzLnNoYXBlcyA9IHNoaWZ0UmVjb3JkKHRoaXMuc2hhcGVzKTtcbiAgICAgIHRoaXMucmVkb1N0YWNrID0gc2hpZnRSZWNvcmQodGhpcy5yZWRvU3RhY2spO1xuXG4gICAgICAvLyBSZWxvYWQgcGRmanNcbiAgICAgIGNvbnN0IGNvcHkgPSB0aGlzLmJhc2VQZGZCeXRlcy5zbGljZSgwKTtcbiAgICAgIGlmICh0aGlzLnBkZkRvY1Byb3h5KSB7IHRoaXMucGRmRG9jUHJveHkuZGVzdHJveSgpOyB0aGlzLnBkZkRvY1Byb3h5ID0gbnVsbDsgfVxuICAgICAgY29uc3QgbG9hZGluZ1Rhc2sgPSAocGRmanNMaWIgYXMgYW55KS5nZXREb2N1bWVudCh7IGRhdGE6IGNvcHkgfSk7XG4gICAgICB0aGlzLnBkZkRvY1Byb3h5ID0gYXdhaXQgbG9hZGluZ1Rhc2sucHJvbWlzZTtcbiAgICAgIHRoaXMucGFnZUNvdW50ID0gdGhpcy5wZGZEb2NQcm94eS5udW1QYWdlcztcbiAgICAgIHRoaXMubG9hZGVkVW50aWxQYWdlID0gTWF0aC5taW4odGhpcy5sb2FkZWRVbnRpbFBhZ2UsIHRoaXMucGFnZUNvdW50KTtcbiAgICAgIHRoaXMucGFnZXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiB0aGlzLmxvYWRlZFVudGlsUGFnZSB9LCAoXywgaSkgPT4gaSArIDEpO1xuICAgICAgdGhpcy5wYWdlcy5mb3JFYWNoKHAgPT4gdGhpcy5lbnN1cmVQYWdlKHApKTtcblxuICAgICAgLy8gUmVmcmVzaCBhc3BlY3QgcmF0aW9zICYgcm90YXRpb25zXG4gICAgICB0aGlzLnBkZlBhZ2VBc3BlY3RzLmNsZWFyKCk7XG4gICAgICB0aGlzLnBkZlBhZ2VSb3RhdGlvbnMuY2xlYXIoKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRtcERvYyA9IGF3YWl0IFBERkRvY3VtZW50LmxvYWQoY29weSk7XG4gICAgICAgIHRtcERvYy5nZXRQYWdlcygpLmZvckVhY2goKHBnLCBpZHgpID0+IHtcbiAgICAgICAgICBjb25zdCB7IHdpZHRoOiB3LCBoZWlnaHQ6IGggfSA9IHBnLmdldFNpemUoKTtcbiAgICAgICAgICB0aGlzLnBkZlBhZ2VBc3BlY3RzLnNldChpZHggKyAxLCB3IC8gaCk7XG4gICAgICAgICAgdGhpcy5wZGZQYWdlUm90YXRpb25zLnNldChpZHggKyAxLCBwZy5nZXRSb3RhdGlvbigpLmFuZ2xlIHx8IDApO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKF8pIHt9XG5cbiAgICAgIC8vIE5hdmlnYXRlIHRvIHRoZSBuZXcgYmxhbmsgcGFnZVxuICAgICAgdGhpcy5wYWdlTm8gPSBpbnNlcnRJbmRleCArIDE7XG4gICAgICB0aGlzLnJlbmRlcmVkUGFnZXMuY2xlYXIoKTtcbiAgICAgIHRoaXMucmVuZGVyaW5nUGFnZXMuY2xlYXIoKTtcbiAgICAgIGF3YWl0IHRoaXMuZ2VuZXJhdGVUaHVtYm5haWxzKCk7XG4gICAgICBhd2FpdCB0aGlzLnJlbmRlckFsbFBhZ2VzKCk7XG4gICAgICB0aGlzLnNjcm9sbFRvUGFnZSh0aGlzLnBhZ2VObyk7XG5cbiAgICAgIGNvbnN0IHRvYXN0ID0gYXdhaXQgdGhpcy50b2FzdEN0cmwuY3JlYXRlKHtcbiAgICAgICAgbWVzc2FnZTogYOC5geC4l+C4o+C4geC4q+C4meC5ieC4suC5gOC4m+C4peC5iOC4siR7dGhpcy5pbnNlcnRPcmllbnRhdGlvbiA9PT0gJ3BvcnRyYWl0JyA/ICfguYHguJnguKfguJXguLHguYnguIcnIDogJ+C5geC4meC4p+C4meC4reC4mSd94LiX4Li14LmI4Lir4LiZ4LmJ4LiyICR7dGhpcy5wYWdlTm99IOC5gOC4o+C4teC4ouC4muC4o+C5ieC4reC4ouC5geC4peC5ieC4p2AsXG4gICAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgICBjb2xvcjogJ3N1Y2Nlc3MnLFxuICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbSdcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgdG9hc3QucHJlc2VudCgpO1xuICAgICAgLy8gTG9nIHRvIGhpc3RvcnlcbiAgICAgIHRoaXMubG9nSGlzdG9yeSgncGFnZV9pbnNlcnQnLCB7IHdoZXJlLCBvcmllbnRhdGlvbjogdGhpcy5pbnNlcnRPcmllbnRhdGlvbiwgaW5zZXJ0ZWRBdDogdGhpcy5wYWdlTm8gfSwgdGhpcy5wYWdlTm8pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcignaW5zZXJ0QmxhbmtQYWdlIGVycm9yOicsIGVycik7XG4gICAgICBjb25zdCB0b2FzdCA9IGF3YWl0IHRoaXMudG9hc3RDdHJsLmNyZWF0ZSh7XG4gICAgICAgIG1lc3NhZ2U6ICfguYDguIHguLTguJTguILguYnguK3guJzguLTguJTguJ7guKXguLLguJTguYPguJnguIHguLLguKPguYHguJfguKPguIHguKvguJnguYnguLInLFxuICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgY29sb3I6ICdkYW5nZXInLFxuICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbSdcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgdG9hc3QucHJlc2VudCgpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5sb2FkaW5nTWVzc2FnZSA9ICcnO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qID09PT09PT09PT09PT09PT09IERlbGV0ZSBDdXJyZW50IFBhZ2UgPT09PT09PT09PT09PT09PT0gKi9cbiAgYXN5bmMgZGVsZXRlUGFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuYmFzZVBkZkJ5dGVzIHx8IHRoaXMucGFnZUNvdW50IDw9IDEpIHJldHVybjtcbiAgICB0aGlzLnNob3dJbnNlcnRNZW51ID0gZmFsc2U7XG5cbiAgICAvLyBDb25maXJtIGJlZm9yZSBkZWxldGluZ1xuICAgIGNvbnN0IGFsZXJ0ID0gYXdhaXQgdGhpcy5hbGVydEN0cmwuY3JlYXRlKHtcbiAgICAgIGhlYWRlcjogJ+C4peC4muC4q+C4meC5ieC4suC5gOC4reC4geC4quC4suC4oycsXG4gICAgICBtZXNzYWdlOiBg4LiV4LmJ4Lit4LiH4LiB4Liy4Lij4Lil4Lia4Lir4LiZ4LmJ4Liy4LiX4Li14LmIICR7dGhpcy5wYWdlTm99IOC5g+C4iuC5iOC4q+C4o+C4t+C4reC5hOC4oeC5iD8g4LiB4Liy4Lij4LiB4Lij4Liw4LiX4Liz4LiZ4Li14LmJ4LmE4Lih4LmI4Liq4Liy4Lih4Liy4Lij4LiW4LmA4Lij4Li14Lii4LiB4LiE4Li34LiZ4LmE4LiU4LmJYCxcbiAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgeyB0ZXh0OiAn4Lii4LiB4LmA4Lil4Li04LiBJywgcm9sZTogJ2NhbmNlbCcgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICfguKXguJrguKvguJnguYnguLInLFxuICAgICAgICAgIHJvbGU6ICdkZXN0cnVjdGl2ZScsXG4gICAgICAgICAgY3NzQ2xhc3M6ICdhbGVydC1idG4tZGFuZ2VyJyxcbiAgICAgICAgICBoYW5kbGVyOiAoKSA9PiB0aGlzLmRvRGVsZXRlUGFnZSgpXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgICBhd2FpdCBhbGVydC5wcmVzZW50KCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGRvRGVsZXRlUGFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuYmFzZVBkZkJ5dGVzKSByZXR1cm47XG4gICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMubG9hZGluZ01lc3NhZ2UgPSAn4LiB4Liz4Lil4Lix4LiH4Lil4Lia4Lir4LiZ4LmJ4LiyLi4uJztcbiAgICB0aGlzLnNhdmVQYWdlU25hcHNob3QoKTsgLy8g4Lia4Lix4LiZ4LiX4Li24LiBIHNuYXBzaG90IOC4geC5iOC4reC4meC4peC4mlxuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBwZGZEb2MgPSBhd2FpdCBQREZEb2N1bWVudC5sb2FkKHRoaXMuYmFzZVBkZkJ5dGVzKTtcbiAgICAgIGNvbnN0IGRlbGV0ZUluZGV4ID0gdGhpcy5wYWdlTm8gLSAxOyAgLy8gMC1iYXNlZFxuICAgICAgcGRmRG9jLnJlbW92ZVBhZ2UoZGVsZXRlSW5kZXgpO1xuXG4gICAgICBjb25zdCBuZXdCeXRlcyA9IGF3YWl0IHBkZkRvYy5zYXZlKCk7XG4gICAgICB0aGlzLmJhc2VQZGZCeXRlcyA9IG5ld0J5dGVzLmJ1ZmZlciBhcyBBcnJheUJ1ZmZlcjtcblxuICAgICAgLy8gUmVtb3ZlIGFubm90YXRpb25zIG9uIHRoZSBkZWxldGVkIHBhZ2U7IHNoaWZ0IHBhZ2VzIGFib3ZlIGl0IGRvd25cbiAgICAgIGNvbnN0IGRlbGV0ZWRQYWdlID0gdGhpcy5wYWdlTm87XG4gICAgICBjb25zdCBmaWx0ZXJBbmRTaGlmdCA9IDxUIGV4dGVuZHMgeyBwYWdlOiBudW1iZXIgfT4oYXJyOiBUW10pOiBUW10gPT5cbiAgICAgICAgYXJyXG4gICAgICAgICAgLmZpbHRlcihhID0+IGEucGFnZSAhPT0gZGVsZXRlZFBhZ2UpXG4gICAgICAgICAgLm1hcChhID0+IGEucGFnZSA+IGRlbGV0ZWRQYWdlID8geyAuLi5hLCBwYWdlOiBhLnBhZ2UgLSAxIH0gOiBhKTtcblxuICAgICAgdGhpcy50ZXh0Qm94ZXMgPSBmaWx0ZXJBbmRTaGlmdCh0aGlzLnRleHRCb3hlcyk7XG4gICAgICB0aGlzLmltYWdlU3RhbXBzID0gZmlsdGVyQW5kU2hpZnQodGhpcy5pbWFnZVN0YW1wcyk7XG4gICAgICB0aGlzLnNoYXBlU3RhbXBzID0gZmlsdGVyQW5kU2hpZnQodGhpcy5zaGFwZVN0YW1wcyk7XG4gICAgICB0aGlzLnNpZ25hdHVyZVN0YW1wcyA9IGZpbHRlckFuZFNoaWZ0KHRoaXMuc2lnbmF0dXJlU3RhbXBzKTtcbiAgICAgIHRoaXMuZGF0ZVN0YW1wcyA9IGZpbHRlckFuZFNoaWZ0KHRoaXMuZGF0ZVN0YW1wcyk7XG5cbiAgICAgIC8vIFNoaWZ0IHN0cm9rZS9zaGFwZSByZWNvcmRzXG4gICAgICBjb25zdCBzaGlmdERlbGV0ZVJlY29yZCA9IChyZWM6IFJlY29yZDxudW1iZXIsIGFueVtdPik6IFJlY29yZDxudW1iZXIsIGFueVtdPiA9PiB7XG4gICAgICAgIGNvbnN0IG5leHQ6IFJlY29yZDxudW1iZXIsIGFueVtdPiA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhyZWMpKSB7XG4gICAgICAgICAgY29uc3QgcCA9IE51bWJlcihrZXkpO1xuICAgICAgICAgIGlmIChwID09PSBkZWxldGVkUGFnZSkgY29udGludWU7ICAvLyBkcm9wIGRlbGV0ZWQgcGFnZVxuICAgICAgICAgIG5leHRbcCA+IGRlbGV0ZWRQYWdlID8gcCAtIDEgOiBwXSA9IHJlY1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgIH07XG4gICAgICB0aGlzLnN0cm9rZXMgPSBzaGlmdERlbGV0ZVJlY29yZCh0aGlzLnN0cm9rZXMpO1xuICAgICAgdGhpcy5zaGFwZXMgPSBzaGlmdERlbGV0ZVJlY29yZCh0aGlzLnNoYXBlcyk7XG4gICAgICB0aGlzLnJlZG9TdGFjayA9IHNoaWZ0RGVsZXRlUmVjb3JkKHRoaXMucmVkb1N0YWNrKTtcblxuICAgICAgLy8gUmVsb2FkIHBkZmpzXG4gICAgICBjb25zdCBjb3B5ID0gdGhpcy5iYXNlUGRmQnl0ZXMuc2xpY2UoMCk7XG4gICAgICBpZiAodGhpcy5wZGZEb2NQcm94eSkgeyB0aGlzLnBkZkRvY1Byb3h5LmRlc3Ryb3koKTsgdGhpcy5wZGZEb2NQcm94eSA9IG51bGw7IH1cbiAgICAgIGNvbnN0IGxvYWRpbmdUYXNrID0gKHBkZmpzTGliIGFzIGFueSkuZ2V0RG9jdW1lbnQoeyBkYXRhOiBjb3B5IH0pO1xuICAgICAgdGhpcy5wZGZEb2NQcm94eSA9IGF3YWl0IGxvYWRpbmdUYXNrLnByb21pc2U7XG4gICAgICB0aGlzLnBhZ2VDb3VudCA9IHRoaXMucGRmRG9jUHJveHkubnVtUGFnZXM7XG4gICAgICB0aGlzLmxvYWRlZFVudGlsUGFnZSA9IE1hdGgubWluKHRoaXMubG9hZGVkVW50aWxQYWdlLCB0aGlzLnBhZ2VDb3VudCk7XG4gICAgICB0aGlzLnBhZ2VzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogdGhpcy5sb2FkZWRVbnRpbFBhZ2UgfSwgKF8sIGkpID0+IGkgKyAxKTtcbiAgICAgIHRoaXMucGFnZXMuZm9yRWFjaChwID0+IHRoaXMuZW5zdXJlUGFnZShwKSk7XG5cbiAgICAgIC8vIFJlZnJlc2ggYXNwZWN0IHJhdGlvcyAmIHJvdGF0aW9uc1xuICAgICAgdGhpcy5wZGZQYWdlQXNwZWN0cy5jbGVhcigpO1xuICAgICAgdGhpcy5wZGZQYWdlUm90YXRpb25zLmNsZWFyKCk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB0bXBEb2MgPSBhd2FpdCBQREZEb2N1bWVudC5sb2FkKGNvcHkpO1xuICAgICAgICB0bXBEb2MuZ2V0UGFnZXMoKS5mb3JFYWNoKChwZywgaWR4KSA9PiB7XG4gICAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBwZy5nZXRTaXplKCk7XG4gICAgICAgICAgdGhpcy5wZGZQYWdlQXNwZWN0cy5zZXQoaWR4ICsgMSwgd2lkdGggLyBoZWlnaHQpO1xuICAgICAgICAgIHRoaXMucGRmUGFnZVJvdGF0aW9ucy5zZXQoaWR4ICsgMSwgcGcuZ2V0Um90YXRpb24oKS5hbmdsZSB8fCAwKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChfKSB7fVxuXG4gICAgICAvLyBOYXZpZ2F0ZSB0byB0aGUgcHJldmlvdXMgcGFnZSAob3IgcGFnZSAxIGlmIHdlIGRlbGV0ZWQgcGFnZSAxKVxuICAgICAgdGhpcy5wYWdlTm8gPSBNYXRoLm1pbihkZWxldGVkUGFnZSwgdGhpcy5wYWdlQ291bnQpO1xuICAgICAgdGhpcy5yZW5kZXJlZFBhZ2VzLmNsZWFyKCk7XG4gICAgICB0aGlzLnJlbmRlcmluZ1BhZ2VzLmNsZWFyKCk7XG4gICAgICBhd2FpdCB0aGlzLmdlbmVyYXRlVGh1bWJuYWlscygpO1xuICAgICAgYXdhaXQgdGhpcy5yZW5kZXJBbGxQYWdlcygpO1xuICAgICAgdGhpcy5zY3JvbGxUb1BhZ2UodGhpcy5wYWdlTm8pO1xuXG4gICAgICBjb25zdCB0b2FzdCA9IGF3YWl0IHRoaXMudG9hc3RDdHJsLmNyZWF0ZSh7XG4gICAgICAgIG1lc3NhZ2U6IGDguKXguJrguKvguJnguYnguLLguJfguLXguYggJHtkZWxldGVkUGFnZX0g4LmA4Lij4Li14Lii4Lia4Lij4LmJ4Lit4Lii4LmB4Lil4LmJ4LinYCxcbiAgICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICAgIGNvbG9yOiAnc3VjY2VzcycsXG4gICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJ1xuICAgICAgfSk7XG4gICAgICBhd2FpdCB0b2FzdC5wcmVzZW50KCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdkZWxldGVQYWdlIGVycm9yOicsIGVycik7XG4gICAgICBjb25zdCB0b2FzdCA9IGF3YWl0IHRoaXMudG9hc3RDdHJsLmNyZWF0ZSh7XG4gICAgICAgIG1lc3NhZ2U6ICfguYDguIHguLTguJTguILguYnguK3guJzguLTguJTguJ7guKXguLLguJTguYPguJnguIHguLLguKPguKXguJrguKvguJnguYnguLInLFxuICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgY29sb3I6ICdkYW5nZXInLFxuICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbSdcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgdG9hc3QucHJlc2VudCgpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5sb2FkaW5nTWVzc2FnZSA9ICcnO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qID09PT09PT09PT09PT09PT09IFRodW1ibmFpbCBTaWRlYmFyIFdyYXBwZXJzID09PT09PT09PT09PT09PT09ICovXG5cbiAgdG9nZ2xlVGh1bWJJbnNlcnQoaWR4OiBudW1iZXIsIGV2ZW50PzogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRodW1iSW5zZXJ0SW5kZXggPT09IGlkeCkge1xuICAgICAgdGhpcy50aHVtYkluc2VydEluZGV4ID0gLTE7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudGh1bWJJbnNlcnRJbmRleCA9IGlkeDtcbiAgICBpZiAoZXZlbnQgJiYgZXZlbnQuY3VycmVudFRhcmdldCkge1xuICAgICAgY29uc3QgYnRuID0gZXZlbnQuY3VycmVudFRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGNvbnN0IHJlY3QgPSBidG4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAvLyBDZW50ZXIgdGhlIGRyb3Bkb3duIHZlcnRpY2FsbHkgb24gdGhlIGJ1dHRvblxuICAgICAgdGhpcy50aHVtYkRyb3Bkb3duVG9wID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAvIDI7XG4gICAgfVxuICB9XG5cbiAgLyoqIEluc2VydCBhIGJsYW5rIHBhZ2UgYXQgYGFmdGVySW5kZXhgICgwID0gYmVmb3JlIHBhZ2UgMSwgbiA9IGFmdGVyIHBhZ2UgbikgKi9cbiAgYXN5bmMgaW5zZXJ0QXRUaHVtYihhZnRlckluZGV4OiBudW1iZXIsIG9yaWVudGF0aW9uOiAncG9ydHJhaXQnIHwgJ2xhbmRzY2FwZScpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnRodW1iSW5zZXJ0SW5kZXggPSAtMTtcbiAgICBpZiAoIXRoaXMuYmFzZVBkZkJ5dGVzKSByZXR1cm47XG4gICAgLy8gTmF2aWdhdGUgdG8gdGhlIHBhZ2UgYXJvdW5kIHdoaWNoIHdlIGFyZSBpbnNlcnRpbmcgc28gaW5zZXJ0QmxhbmtQYWdlIHdvcmtzIGNvcnJlY3RseVxuICAgIHRoaXMuaW5zZXJ0T3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcbiAgICAvLyBpbnNlcnRCbGFua1BhZ2UgdXNlcyB0aGlzLnBhZ2VObzsgYWZ0ZXJJbmRleD0wIG1lYW5zIGJlZm9yZSBwYWdlIDFcbiAgICBpZiAoYWZ0ZXJJbmRleCA9PT0gMCkge1xuICAgICAgdGhpcy5wYWdlTm8gPSAxO1xuICAgICAgYXdhaXQgdGhpcy5pbnNlcnRCbGFua1BhZ2UoJ2JlZm9yZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhZ2VObyA9IGFmdGVySW5kZXg7XG4gICAgICBhd2FpdCB0aGlzLmluc2VydEJsYW5rUGFnZSgnYWZ0ZXInKTtcbiAgICB9XG4gIH1cblxuICB0cmlnZ2VyVGh1bWJGaWxlVXBsb2FkKGFmdGVySW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMudGh1bWJJbnNlcnRJbmRleCA9IC0xO1xuICAgIHRoaXMudGh1bWJJbnNlcnRBdEluZGV4ID0gYWZ0ZXJJbmRleDtcbiAgICBpZiAodGhpcy50aHVtYkZpbGVJbnB1dFJlZikge1xuICAgICAgdGhpcy50aHVtYkZpbGVJbnB1dFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgICB0aGlzLnRodW1iRmlsZUlucHV0UmVmLm5hdGl2ZUVsZW1lbnQuY2xpY2soKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBvblRodW1iRmlsZVNlbGVjdGVkKGV2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGlucHV0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaWYgKCFpbnB1dC5maWxlcyB8fCAhaW5wdXQuZmlsZXNbMF0gfHwgIXRoaXMuYmFzZVBkZkJ5dGVzKSByZXR1cm47XG4gICAgY29uc3QgZmlsZSA9IGlucHV0LmZpbGVzWzBdO1xuICAgIC8vIE5hdmlnYXRlIHRvIHRoZSBjb3JyZWN0IGluc2VydCBwb3NpdGlvbiB0aGVuIHRyaWdnZXIgaW1hZ2UgdXBsb2FkXG4gICAgaWYgKHRoaXMudGh1bWJJbnNlcnRBdEluZGV4ID09PSAwKSB7XG4gICAgICB0aGlzLnBhZ2VObyA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFnZU5vID0gdGhpcy50aHVtYkluc2VydEF0SW5kZXg7XG4gICAgfVxuICAgIFxuICAgIGlmIChmaWxlLnR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJykpIHtcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByZWFkZXIub25sb2FkID0gYXN5bmMgKGUpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YVVybCA9IChlLnRhcmdldCBhcyBGaWxlUmVhZGVyKS5yZXN1bHQgYXMgc3RyaW5nO1xuICAgICAgICAvLyBQbGFjZSBhcyBmdWxsLXBhZ2UgaW1hZ2Ugc3RhbXAgb24gdGhlIHRhcmdldCBwYWdlXG4gICAgICAgIGlmICh0aGlzLnRodW1iSW5zZXJ0QXRJbmRleCA9PT0gMCkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuaW5zZXJ0QmxhbmtQYWdlKCdiZWZvcmUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmluc2VydEJsYW5rUGFnZSgnYWZ0ZXInKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgaW1hZ2Ugc3RhbXAgb24gdGhlIG5ld2x5IGluc2VydGVkIHBhZ2VcbiAgICAgICAgY29uc3QgbmV3UGFnZSA9IHRoaXMudGh1bWJJbnNlcnRBdEluZGV4ID09PSAwID8gMSA6IHRoaXMudGh1bWJJbnNlcnRBdEluZGV4ICsgMTtcbiAgICAgICAgY29uc3Qgc3RhbXAgPSB7XG4gICAgICAgICAgaWQ6ICdpbWdfJyArIERhdGUubm93KCkgKyAnXycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDE2KS5zbGljZSgyKSxcbiAgICAgICAgICBwYWdlOiBuZXdQYWdlLCB4OiAwLCB5OiAwLCB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwMCwgZGF0YVVybFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmltYWdlU3RhbXBzLnB1c2goc3RhbXApO1xuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9O1xuICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgfSBlbHNlIGlmIChmaWxlLnR5cGUgPT09ICdhcHBsaWNhdGlvbi9wZGYnKSB7XG4gICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG4gICAgICB0aGlzLmxvYWRpbmdNZXNzYWdlID0gJ+C4geC4s+C4peC4seC4h+C5geC4l+C4o+C4geC5hOC4n+C4peC5jCBQREYuLi4nO1xuICAgICAgdGhpcy5zYXZlUGFnZVNuYXBzaG90KCk7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICBcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gYXdhaXQgZmlsZS5hcnJheUJ1ZmZlcigpO1xuICAgICAgICBjb25zdCBpbXBvcnRlZFBkZiA9IGF3YWl0IFBERkRvY3VtZW50LmxvYWQoYXJyYXlCdWZmZXIpO1xuICAgICAgICBjb25zdCBtYWluUGRmID0gYXdhaXQgUERGRG9jdW1lbnQubG9hZCh0aGlzLmJhc2VQZGZCeXRlcyk7XG5cbiAgICAgICAgY29uc3QgaW1wb3J0ZWRQYWdlcyA9IGF3YWl0IG1haW5QZGYuY29weVBhZ2VzKGltcG9ydGVkUGRmLCBpbXBvcnRlZFBkZi5nZXRQYWdlSW5kaWNlcygpKTtcbiAgICAgICAgXG4gICAgICAgIC8vIHRodW1iSW5zZXJ0QXRJbmRleCBpcyAwIHRvIGluc2VydCBiZWZvcmUgcGFnZSAxLCBvciBwYWdlIG51bWJlciB0byBpbnNlcnQgYWZ0ZXJcbiAgICAgICAgY29uc3QgaW5zZXJ0SW5kZXggPSB0aGlzLnRodW1iSW5zZXJ0QXRJbmRleDsgXG4gICAgICAgIFxuICAgICAgICBsZXQgY3VycmVudEluZGV4ID0gaW5zZXJ0SW5kZXg7XG4gICAgICAgIGZvciAoY29uc3QgcGFnZSBvZiBpbXBvcnRlZFBhZ2VzKSB7XG4gICAgICAgICAgbWFpblBkZi5pbnNlcnRQYWdlKGN1cnJlbnRJbmRleCwgcGFnZSk7XG4gICAgICAgICAgY3VycmVudEluZGV4Kys7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdCeXRlcyA9IGF3YWl0IG1haW5QZGYuc2F2ZSgpO1xuICAgICAgICB0aGlzLmJhc2VQZGZCeXRlcyA9IG5ld0J5dGVzLmJ1ZmZlciBhcyBBcnJheUJ1ZmZlcjtcblxuICAgICAgICBjb25zdCBpbnNlcnRlZENvdW50ID0gaW1wb3J0ZWRQYWdlcy5sZW5ndGg7XG4gICAgICAgIFxuICAgICAgICAvLyBTaGlmdCBhbm5vdGF0aW9ucyB0aGF0IGFyZSBvbiBwYWdlcyA+PSBpbnNlcnRJbmRleCsxXG4gICAgICAgIGNvbnN0IHNoaWZ0UGFnZSA9IGluc2VydEluZGV4ICsgMTtcbiAgICAgICAgY29uc3Qgc2hpZnRBbm5vdGF0aW9ucyA9IDxUIGV4dGVuZHMgeyBwYWdlOiBudW1iZXIgfT4oYXJyOiBUW10pOiBUW10gPT5cbiAgICAgICAgICBhcnIubWFwKGEgPT4gYS5wYWdlID49IHNoaWZ0UGFnZSA/IHsgLi4uYSwgcGFnZTogYS5wYWdlICsgaW5zZXJ0ZWRDb3VudCB9IDogYSk7XG5cbiAgICAgICAgdGhpcy50ZXh0Qm94ZXMgPSBzaGlmdEFubm90YXRpb25zKHRoaXMudGV4dEJveGVzKTtcbiAgICAgICAgdGhpcy5pbWFnZVN0YW1wcyA9IHNoaWZ0QW5ub3RhdGlvbnModGhpcy5pbWFnZVN0YW1wcyk7XG4gICAgICAgIHRoaXMuc2hhcGVTdGFtcHMgPSBzaGlmdEFubm90YXRpb25zKHRoaXMuc2hhcGVTdGFtcHMpO1xuICAgICAgICB0aGlzLnNpZ25hdHVyZVN0YW1wcyA9IHNoaWZ0QW5ub3RhdGlvbnModGhpcy5zaWduYXR1cmVTdGFtcHMpO1xuICAgICAgICB0aGlzLmRhdGVTdGFtcHMgPSBzaGlmdEFubm90YXRpb25zKHRoaXMuZGF0ZVN0YW1wcyk7XG5cbiAgICAgICAgY29uc3Qgc2hpZnRSZWNvcmQgPSAocmVjOiBSZWNvcmQ8bnVtYmVyLCBhbnlbXT4pOiBSZWNvcmQ8bnVtYmVyLCBhbnlbXT4gPT4ge1xuICAgICAgICAgIGNvbnN0IG5leHQ6IFJlY29yZDxudW1iZXIsIGFueVtdPiA9IHt9O1xuICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHJlYykpIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBOdW1iZXIoa2V5KTtcbiAgICAgICAgICAgIG5leHRbcCA+PSBzaGlmdFBhZ2UgPyBwICsgaW5zZXJ0ZWRDb3VudCA6IHBdID0gcmVjW3BdO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zdHJva2VzID0gc2hpZnRSZWNvcmQodGhpcy5zdHJva2VzKTtcbiAgICAgICAgdGhpcy5zaGFwZXMgPSBzaGlmdFJlY29yZCh0aGlzLnNoYXBlcyk7XG4gICAgICAgIHRoaXMucmVkb1N0YWNrID0gc2hpZnRSZWNvcmQodGhpcy5yZWRvU3RhY2spO1xuXG4gICAgICAgIC8vIFJlbG9hZCBwZGZqc1xuICAgICAgICBjb25zdCBjb3B5ID0gdGhpcy5iYXNlUGRmQnl0ZXMuc2xpY2UoMCk7XG4gICAgICAgIGlmICh0aGlzLnBkZkRvY1Byb3h5KSB7IHRoaXMucGRmRG9jUHJveHkuZGVzdHJveSgpOyB0aGlzLnBkZkRvY1Byb3h5ID0gbnVsbDsgfVxuICAgICAgICBjb25zdCBsb2FkaW5nVGFzayA9IChwZGZqc0xpYiBhcyBhbnkpLmdldERvY3VtZW50KHsgZGF0YTogY29weSB9KTtcbiAgICAgICAgdGhpcy5wZGZEb2NQcm94eSA9IGF3YWl0IGxvYWRpbmdUYXNrLnByb21pc2U7XG4gICAgICAgIHRoaXMucGFnZUNvdW50ID0gdGhpcy5wZGZEb2NQcm94eS5udW1QYWdlcztcbiAgICAgICAgdGhpcy5wYWdlcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IHRoaXMubG9hZGVkVW50aWxQYWdlIH0sIChfLCBpKSA9PiBpICsgMSk7XG4gICAgICAgIHRoaXMucGFnZXMuZm9yRWFjaChwID0+IHRoaXMuZW5zdXJlUGFnZShwKSk7XG5cbiAgICAgICAgdGhpcy5wZGZQYWdlQXNwZWN0cy5jbGVhcigpO1xuICAgICAgICB0aGlzLnBkZlBhZ2VSb3RhdGlvbnMuY2xlYXIoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCB0bXBEb2MgPSBhd2FpdCBQREZEb2N1bWVudC5sb2FkKGNvcHkpO1xuICAgICAgICAgIHRtcERvYy5nZXRQYWdlcygpLmZvckVhY2goKHBnLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgd2lkdGg6IHcsIGhlaWdodDogaCB9ID0gcGcuZ2V0U2l6ZSgpO1xuICAgICAgICAgICAgdGhpcy5wZGZQYWdlQXNwZWN0cy5zZXQoaWR4ICsgMSwgdyAvIGgpO1xuICAgICAgICAgICAgdGhpcy5wZGZQYWdlUm90YXRpb25zLnNldChpZHggKyAxLCBwZy5nZXRSb3RhdGlvbigpLmFuZ2xlIHx8IDApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChfKSB7fVxuXG4gICAgICAgIHRoaXMucGFnZU5vID0gc2hpZnRQYWdlO1xuICAgICAgICB0aGlzLnJlbmRlcmVkUGFnZXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJpbmdQYWdlcy5jbGVhcigpO1xuICAgICAgICBhd2FpdCB0aGlzLmdlbmVyYXRlVGh1bWJuYWlscygpO1xuICAgICAgICBhd2FpdCB0aGlzLnJlbmRlckFsbFBhZ2VzKCk7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9QYWdlKHRoaXMucGFnZU5vKTtcblxuICAgICAgICBjb25zdCB0b2FzdCA9IGF3YWl0IHRoaXMudG9hc3RDdHJsLmNyZWF0ZSh7XG4gICAgICAgICAgbWVzc2FnZTogYOC5geC4l+C4o+C4geC5hOC4n+C4peC5jCBQREYg4LiI4Liz4LiZ4Lin4LiZICR7aW5zZXJ0ZWRDb3VudH0g4Lir4LiZ4LmJ4Liy4LmA4Lij4Li14Lii4Lia4Lij4LmJ4Lit4Lii4LmB4Lil4LmJ4LinYCxcbiAgICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgICBjb2xvcjogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJ1xuICAgICAgICB9KTtcbiAgICAgICAgYXdhaXQgdG9hc3QucHJlc2VudCgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5sb2dIaXN0b3J5KCdwYWdlX2luc2VydCcsIHsgd2hlcmU6ICdwZGZfZmlsZScsIGluc2VydGVkQXQ6IHNoaWZ0UGFnZSwgY291bnQ6IGluc2VydGVkQ291bnQgfSwgc2hpZnRQYWdlKTtcblxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2luc2VydCBQREYgZXJyb3I6JywgZXJyKTtcbiAgICAgICAgY29uc3QgdG9hc3QgPSBhd2FpdCB0aGlzLnRvYXN0Q3RybC5jcmVhdGUoe1xuICAgICAgICAgIG1lc3NhZ2U6ICfguYDguIHguLTguJTguILguYnguK3guJzguLTguJTguJ7guKXguLLguJTguYPguJnguIHguLLguKPguYHguJfguKPguIHguYTguJ/guKXguYwgUERGJyxcbiAgICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgICBjb2xvcjogJ2RhbmdlcicsXG4gICAgICAgICAgcG9zaXRpb246ICdib3R0b20nXG4gICAgICAgIH0pO1xuICAgICAgICBhd2FpdCB0b2FzdC5wcmVzZW50KCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxvYWRpbmdNZXNzYWdlID0gJyc7XG4gICAgICAgIGlmICh0aGlzLnRodW1iRmlsZUlucHV0UmVmKSB7XG4gICAgICAgICAgdGhpcy50aHVtYkZpbGVJbnB1dFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0b2FzdCA9IGF3YWl0IHRoaXMudG9hc3RDdHJsLmNyZWF0ZSh7XG4gICAgICAgIG1lc3NhZ2U6ICfguKPguK3guIfguKPguLHguJrguYDguInguJ7guLLguLDguYTguJ/guKXguYzguKPguLnguJvguKDguLLguJ7guYHguKXguLDguYDguK3guIHguKrguLLguKMgUERGIOC5g+C4meC4guC4k+C4sOC4meC4teC5iScsXG4gICAgICAgIGR1cmF0aW9uOiAyNTAwLCBjb2xvcjogJ3dhcm5pbmcnLCBwb3NpdGlvbjogJ2JvdHRvbSdcbiAgICAgIH0pO1xuICAgICAgYXdhaXQgdG9hc3QucHJlc2VudCgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG1vdmVQYWdlVG9JbmRleChwYWdlTnVtOiBudW1iZXIsIGRpcmVjdGlvbjogJ3VwJyB8ICdkb3duJyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChkaXJlY3Rpb24gPT09ICd1cCcgJiYgcGFnZU51bSA+IDEpIHtcbiAgICAgIGNvbnN0IHByZXZQYWdlTm8gPSB0aGlzLnBhZ2VObztcbiAgICAgIHRoaXMucGFnZU5vID0gcGFnZU51bTtcbiAgICAgIGF3YWl0IHRoaXMuc3dhcFBhZ2VzKHBhZ2VOdW0gLSAxLCBwYWdlTnVtKTtcbiAgICAgIHRoaXMucGFnZU5vID0gcGFnZU51bSAtIDE7XG4gICAgICB0aGlzLnNjcm9sbFRvUGFnZSh0aGlzLnBhZ2VObyk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJyAmJiBwYWdlTnVtIDwgdGhpcy5wYWdlQ291bnQpIHtcbiAgICAgIHRoaXMucGFnZU5vID0gcGFnZU51bTtcbiAgICAgIGF3YWl0IHRoaXMuc3dhcFBhZ2VzKHBhZ2VOdW0sIHBhZ2VOdW0gKyAxKTtcbiAgICAgIHRoaXMucGFnZU5vID0gcGFnZU51bSArIDE7XG4gICAgICB0aGlzLnNjcm9sbFRvUGFnZSh0aGlzLnBhZ2VObyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGVsZXRlU3BlY2lmaWNQYWdlKHBhZ2VOdW06IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLnBhZ2VDb3VudCA8PSAxKSByZXR1cm47XG4gICAgdGhpcy5wYWdlTm8gPSBwYWdlTnVtO1xuICAgIGF3YWl0IHRoaXMuZGVsZXRlUGFnZSgpO1xuICB9XG5cbiAgaW5zZXJ0QmxhbmtQYWdlRnJvbVRodW1iKHdoZXJlOiAnYmVmb3JlJyB8ICdhZnRlcicpOiB2b2lkIHtcbiAgICB0aGlzLnNob3dUaHVtYkluc2VydE1lbnUgPSBmYWxzZTtcbiAgICB0aGlzLmluc2VydEJsYW5rUGFnZSh3aGVyZSk7XG4gIH1cblxuICBkZWxldGVQYWdlRnJvbVRodW1iKCk6IHZvaWQge1xuICAgIHRoaXMuZGVsZXRlUGFnZSgpO1xuICB9XG5cbiAgLyogPT09PT09PT09PT09PT09PT0gTW92ZSBQYWdlIFVwL0Rvd24gPT09PT09PT09PT09PT09PT0gKi9cbiAgYXN5bmMgbW92ZVBhZ2VVcCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5wYWdlTm8gPD0gMSB8fCAhdGhpcy5iYXNlUGRmQnl0ZXMpIHJldHVybjtcbiAgICBhd2FpdCB0aGlzLnN3YXBQYWdlcyh0aGlzLnBhZ2VObyAtIDEsIHRoaXMucGFnZU5vKTtcbiAgICB0aGlzLnBhZ2VObyA9IHRoaXMucGFnZU5vIC0gMTtcbiAgICB0aGlzLnNjcm9sbFRvUGFnZSh0aGlzLnBhZ2VObyk7XG4gIH1cblxuICBhc3luYyBtb3ZlUGFnZURvd24oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMucGFnZU5vID49IHRoaXMucGFnZUNvdW50IHx8ICF0aGlzLmJhc2VQZGZCeXRlcykgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMuc3dhcFBhZ2VzKHRoaXMucGFnZU5vLCB0aGlzLnBhZ2VObyArIDEpO1xuICAgIHRoaXMucGFnZU5vID0gdGhpcy5wYWdlTm8gKyAxO1xuICAgIHRoaXMuc2Nyb2xsVG9QYWdlKHRoaXMucGFnZU5vKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc3dhcFBhZ2VzKHBhZ2VBOiBudW1iZXIsIHBhZ2VCOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuYmFzZVBkZkJ5dGVzKSByZXR1cm47XG4gICAgdGhpcy5zYXZlUGFnZVNuYXBzaG90KCk7XG4gICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMubG9hZGluZ01lc3NhZ2UgPSAn4LiB4Liz4Lil4Lix4LiH4Lii4LmJ4Liy4Lii4Lir4LiZ4LmJ4LiyLi4uJztcbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBkZkRvYyA9IGF3YWl0IFBERkRvY3VtZW50LmxvYWQodGhpcy5iYXNlUGRmQnl0ZXMpO1xuICAgICAgY29uc3QgaWR4QSA9IHBhZ2VBIC0gMTtcbiAgICAgIGNvbnN0IGlkeEIgPSBwYWdlQiAtIDE7XG5cbiAgICAgIC8vIENvcHkgYm90aCBwYWdlcyB0aGVuIGluc2VydCBhdCBzd2FwcGVkIHBvc2l0aW9uc1xuICAgICAgY29uc3QgW2NvcHlPZkJdID0gYXdhaXQgcGRmRG9jLmNvcHlQYWdlcyhwZGZEb2MsIFtpZHhCXSk7XG4gICAgICBjb25zdCBbY29weU9mQV0gPSBhd2FpdCBwZGZEb2MuY29weVBhZ2VzKHBkZkRvYywgW2lkeEFdKTtcblxuICAgICAgLy8gSW5zZXJ0IEIgYXQgcG9zaXRpb24gQSwgdGhlbiBBIGF0IHBvc2l0aW9uIEIrMSAobm93IHNoaWZ0ZWQgYnkgMSlcbiAgICAgIHBkZkRvYy5pbnNlcnRQYWdlKGlkeEEsIGNvcHlPZkIpO1xuICAgICAgcGRmRG9jLmluc2VydFBhZ2UoaWR4QiArIDEsIGNvcHlPZkEpO1xuXG4gICAgICAvLyBSZW1vdmUgdGhlIG9yaWdpbmFsIEEgKG5vdyBhdCBpZHhBKzEpIGFuZCBvcmlnaW5hbCBCIChub3cgYXQgaWR4QisyKVxuICAgICAgcGRmRG9jLnJlbW92ZVBhZ2UoaWR4QSArIDEpO1xuICAgICAgcGRmRG9jLnJlbW92ZVBhZ2UoaWR4QiArIDEpO1xuXG4gICAgICBjb25zdCBuZXdCeXRlcyA9IGF3YWl0IHBkZkRvYy5zYXZlKCk7XG4gICAgICB0aGlzLmJhc2VQZGZCeXRlcyA9IG5ld0J5dGVzLmJ1ZmZlciBhcyBBcnJheUJ1ZmZlcjtcblxuICAgICAgLy8gU3dhcCBhbm5vdGF0aW9ucyBiZXR3ZWVuIHRoZSB0d28gcGFnZXNcbiAgICAgIGNvbnN0IHN3YXBBbm5vdCA9IDxUIGV4dGVuZHMgeyBwYWdlOiBudW1iZXIgfT4oYXJyOiBUW10pOiBUW10gPT5cbiAgICAgICAgYXJyLm1hcChhID0+IHtcbiAgICAgICAgICBpZiAoYS5wYWdlID09PSBwYWdlQSkgcmV0dXJuIHsgLi4uYSwgcGFnZTogcGFnZUIgfTtcbiAgICAgICAgICBpZiAoYS5wYWdlID09PSBwYWdlQikgcmV0dXJuIHsgLi4uYSwgcGFnZTogcGFnZUEgfTtcbiAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfSk7XG4gICAgICB0aGlzLnRleHRCb3hlcyA9IHN3YXBBbm5vdCh0aGlzLnRleHRCb3hlcyk7XG4gICAgICB0aGlzLmltYWdlU3RhbXBzID0gc3dhcEFubm90KHRoaXMuaW1hZ2VTdGFtcHMpO1xuICAgICAgdGhpcy5zaGFwZVN0YW1wcyA9IHN3YXBBbm5vdCh0aGlzLnNoYXBlU3RhbXBzKTtcbiAgICAgIHRoaXMuc2lnbmF0dXJlU3RhbXBzID0gc3dhcEFubm90KHRoaXMuc2lnbmF0dXJlU3RhbXBzKTtcbiAgICAgIHRoaXMuZGF0ZVN0YW1wcyA9IHN3YXBBbm5vdCh0aGlzLmRhdGVTdGFtcHMpO1xuXG4gICAgICBjb25zdCBzd2FwUmVjb3JkID0gKHJlYzogUmVjb3JkPG51bWJlciwgYW55W10+KTogUmVjb3JkPG51bWJlciwgYW55W10+ID0+IHtcbiAgICAgICAgY29uc3QgbmV4dDogUmVjb3JkPG51bWJlciwgYW55W10+ID0ge307XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBPYmplY3Qua2V5cyhyZWMpKSB7XG4gICAgICAgICAgY29uc3QgcCA9IE51bWJlcihrKTtcbiAgICAgICAgICBpZiAocCA9PT0gcGFnZUEpIG5leHRbcGFnZUJdID0gcmVjW3BdO1xuICAgICAgICAgIGVsc2UgaWYgKHAgPT09IHBhZ2VCKSBuZXh0W3BhZ2VBXSA9IHJlY1twXTtcbiAgICAgICAgICBlbHNlIG5leHRbcF0gPSByZWNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICB9O1xuICAgICAgdGhpcy5zdHJva2VzID0gc3dhcFJlY29yZCh0aGlzLnN0cm9rZXMpO1xuICAgICAgdGhpcy5zaGFwZXMgPSBzd2FwUmVjb3JkKHRoaXMuc2hhcGVzKTtcbiAgICAgIHRoaXMucmVkb1N0YWNrID0gc3dhcFJlY29yZCh0aGlzLnJlZG9TdGFjayk7XG5cbiAgICAgIC8vIFJlbG9hZCBwZGZqc1xuICAgICAgY29uc3QgY29weSA9IHRoaXMuYmFzZVBkZkJ5dGVzLnNsaWNlKDApO1xuICAgICAgaWYgKHRoaXMucGRmRG9jUHJveHkpIHsgdGhpcy5wZGZEb2NQcm94eS5kZXN0cm95KCk7IHRoaXMucGRmRG9jUHJveHkgPSBudWxsOyB9XG4gICAgICBjb25zdCBsb2FkaW5nVGFzayA9IChwZGZqc0xpYiBhcyBhbnkpLmdldERvY3VtZW50KHsgZGF0YTogY29weSB9KTtcbiAgICAgIHRoaXMucGRmRG9jUHJveHkgPSBhd2FpdCBsb2FkaW5nVGFzay5wcm9taXNlO1xuICAgICAgdGhpcy5wYWdlQ291bnQgPSB0aGlzLnBkZkRvY1Byb3h5Lm51bVBhZ2VzO1xuICAgICAgdGhpcy5sb2FkZWRVbnRpbFBhZ2UgPSBNYXRoLm1pbih0aGlzLmxvYWRlZFVudGlsUGFnZSwgdGhpcy5wYWdlQ291bnQpO1xuICAgICAgdGhpcy5wYWdlcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IHRoaXMubG9hZGVkVW50aWxQYWdlIH0sIChfLCBpKSA9PiBpICsgMSk7XG4gICAgICB0aGlzLnBhZ2VzLmZvckVhY2gocCA9PiB0aGlzLmVuc3VyZVBhZ2UocCkpO1xuXG4gICAgICB0aGlzLnBkZlBhZ2VBc3BlY3RzLmNsZWFyKCk7XG4gICAgICB0aGlzLnBkZlBhZ2VSb3RhdGlvbnMuY2xlYXIoKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRtcERvYyA9IGF3YWl0IFBERkRvY3VtZW50LmxvYWQoY29weSk7XG4gICAgICAgIHRtcERvYy5nZXRQYWdlcygpLmZvckVhY2goKHBnLCBpZHgpID0+IHtcbiAgICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHBnLmdldFNpemUoKTtcbiAgICAgICAgICB0aGlzLnBkZlBhZ2VBc3BlY3RzLnNldChpZHggKyAxLCB3aWR0aCAvIGhlaWdodCk7XG4gICAgICAgICAgdGhpcy5wZGZQYWdlUm90YXRpb25zLnNldChpZHggKyAxLCBwZy5nZXRSb3RhdGlvbigpLmFuZ2xlIHx8IDApO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKF8pIHt9XG5cbiAgICAgIHRoaXMucmVuZGVyZWRQYWdlcy5jbGVhcigpO1xuICAgICAgdGhpcy5yZW5kZXJpbmdQYWdlcy5jbGVhcigpO1xuICAgICAgYXdhaXQgdGhpcy5nZW5lcmF0ZVRodW1ibmFpbHMoKTtcbiAgICAgIGF3YWl0IHRoaXMucmVuZGVyQWxsUGFnZXMoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ3N3YXBQYWdlcyBlcnJvcjonLCBlcnIpO1xuICAgICAgY29uc3QgdG9hc3QgPSBhd2FpdCB0aGlzLnRvYXN0Q3RybC5jcmVhdGUoe1xuICAgICAgICBtZXNzYWdlOiAn4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiU4LmD4LiZ4LiB4Liy4Lij4Lii4LmJ4Liy4Lii4Lir4LiZ4LmJ4LiyJyxcbiAgICAgICAgZHVyYXRpb246IDIwMDAsIGNvbG9yOiAnZGFuZ2VyJywgcG9zaXRpb246ICdib3R0b20nXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IHRvYXN0LnByZXNlbnQoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMubG9hZGluZ01lc3NhZ2UgPSAnJztcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiA9PT09PT09PT09PT09PT09PSBQYWdlIGhlbHBlcnMgPT09PT09PT09PT09PT09PT0gKi9cbiAgcHJpdmF0ZSBlbnN1cmVQYWdlKHA6IG51bWJlciA9IHRoaXMucGFnZU5vKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnN0cm9rZXNbcF0pIHRoaXMuc3Ryb2tlc1twXSA9IFtdO1xuICAgIGlmICghdGhpcy5zaGFwZXNbcF0pIHRoaXMuc2hhcGVzW3BdID0gW107XG4gICAgaWYgKCF0aGlzLnJlZG9TdGFja1twXSkgdGhpcy5yZWRvU3RhY2tbcF0gPSBbXTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UGRmQ2FudmFzKHA6IG51bWJlcik6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZGZDYW52YXMtJyArIHApIGFzIEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QW5ub3RDYW52YXMocDogbnVtYmVyKTogSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fubm90Q2FudmFzLScgKyBwKSBhcyBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGw7XG4gIH1cblxuICBvblZpZXdlclNjcm9sbChldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1Njcm9sbE5hdmlnYXRpbmcpIHJldHVybjtcblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBzY3JvbGxUb3AgPSBjb250YWluZXIuc2Nyb2xsVG9wO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG5cbiAgICAvLyBGaW5kIHdoaWNoIHBhZ2UgaXMgbW9zdCB2aXNpYmxlXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy5sb2FkZWRVbnRpbFBhZ2U7IGkrKykge1xuICAgICAgY29uc3QgcGFnZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2UtJyArIGkpO1xuICAgICAgaWYgKCFwYWdlRWwpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBwYWdlVG9wID0gcGFnZUVsLm9mZnNldFRvcCAtIGNvbnRhaW5lci5vZmZzZXRUb3A7XG4gICAgICBjb25zdCBwYWdlQm90dG9tID0gcGFnZVRvcCArIHBhZ2VFbC5vZmZzZXRIZWlnaHQ7XG4gICAgICBjb25zdCB2aXNpYmxlVG9wID0gTWF0aC5tYXgoc2Nyb2xsVG9wLCBwYWdlVG9wKTtcbiAgICAgIGNvbnN0IHZpc2libGVCb3R0b20gPSBNYXRoLm1pbihzY3JvbGxUb3AgKyBjb250YWluZXJIZWlnaHQsIHBhZ2VCb3R0b20pO1xuICAgICAgY29uc3QgdmlzaWJsZUhlaWdodCA9IHZpc2libGVCb3R0b20gLSB2aXNpYmxlVG9wO1xuXG4gICAgICBpZiAodmlzaWJsZUhlaWdodCA+IGNvbnRhaW5lckhlaWdodCAqIDAuNSkge1xuICAgICAgICBpZiAodGhpcy5wYWdlTm8gIT09IGkpIHtcbiAgICAgICAgICB0aGlzLnBhZ2VObyA9IGk7XG4gICAgICAgICAgdGhpcy5zY3JvbGxUaHVtYm5haWxJbnRvVmlldyhpKTtcbiAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgdGhpcy5maXRXaWR0aCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIExvYWQgbmV4dCBjaHVuayB3aGVuIGFwcHJvYWNoaW5nIHRoZSBsYXN0IGxvYWRlZCBwYWdlXG4gICAgICAgIGlmIChpID49IHRoaXMubG9hZGVkVW50aWxQYWdlIC0gNSkgdGhpcy5sb2FkTmV4dENodW5rKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHByZXZQYWdlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLnBhZ2VObyA8PSAxKSByZXR1cm47XG4gICAgdGhpcy5wYWdlTm8gLT0gMTtcbiAgICB0aGlzLnNjcm9sbFRvUGFnZSh0aGlzLnBhZ2VObyk7XG4gICAgYXdhaXQgdGhpcy5maXRXaWR0aCgpO1xuICB9XG5cbiAgYXN5bmMgem9vbUluKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuem9vbSA9IE1hdGgubWluKDMsIHRoaXMuem9vbSArIDAuMSk7XG4gICAgdGhpcy5yZW5kZXJlZFBhZ2VzLmNsZWFyKCk7XG4gICAgYXdhaXQgdGhpcy5yZW5kZXJBbGxQYWdlcygpO1xuICB9XG5cbiAgYXN5bmMgbmV4dFBhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMucGFnZU5vID49IHRoaXMucGFnZUNvdW50KSByZXR1cm47XG4gICAgLy8gSWYgYXQgdGhlIGVkZ2Ugb2YgdGhlIGxvYWRlZCBjaHVuaywgbG9hZCBuZXh0IGNodW5rIGZpcnN0XG4gICAgaWYgKHRoaXMucGFnZU5vID49IHRoaXMubG9hZGVkVW50aWxQYWdlKSB7XG4gICAgICBhd2FpdCB0aGlzLmxvYWROZXh0Q2h1bmsoKTtcbiAgICB9XG4gICAgdGhpcy5wYWdlTm8gKz0gMTtcbiAgICB0aGlzLnNjcm9sbFRvUGFnZSh0aGlzLnBhZ2VObyk7XG4gICAgYXdhaXQgdGhpcy5maXRXaWR0aCgpO1xuICB9XG5cbiAgYXN5bmMgZmlyc3RQYWdlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLnBhZ2VObyA9PT0gMSkgcmV0dXJuO1xuICAgIHRoaXMucGFnZU5vID0gMTtcbiAgICB0aGlzLnNjcm9sbFRvUGFnZSh0aGlzLnBhZ2VObyk7XG4gICAgYXdhaXQgdGhpcy5maXRXaWR0aCgpO1xuICB9XG5cbiAgYXN5bmMgbGFzdFBhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMucGFnZU5vID09PSB0aGlzLnBhZ2VDb3VudCkgcmV0dXJuO1xuICAgIC8vIEp1bXAgdG8gbGFzdCBsb2FkZWQgcGFnZTsgcHJlLWxvYWQgbmV4dCBjaHVuayBpbiBiYWNrZ3JvdW5kXG4gICAgdGhpcy5wYWdlTm8gPSB0aGlzLmxvYWRlZFVudGlsUGFnZTtcbiAgICB0aGlzLnNjcm9sbFRvUGFnZSh0aGlzLnBhZ2VObyk7XG4gICAgYXdhaXQgdGhpcy5maXRXaWR0aCgpO1xuICAgIGlmICh0aGlzLmxvYWRlZFVudGlsUGFnZSA8IHRoaXMucGFnZUNvdW50KSB0aGlzLmxvYWROZXh0Q2h1bmsoKTtcbiAgfVxuXG4gIGFzeW5jIHpvb21PdXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy56b29tID0gTWF0aC5tYXgoMC41LCB0aGlzLnpvb20gLSAwLjEpO1xuICAgIHRoaXMucmVuZGVyZWRQYWdlcy5jbGVhcigpO1xuICAgIGF3YWl0IHRoaXMucmVuZGVyQWxsUGFnZXMoKTtcbiAgfVxuXG4gIHNjcm9sbFRvUGFnZShwYWdlTnVtOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmlzU2Nyb2xsTmF2aWdhdGluZyA9IHRydWU7XG4gICAgY29uc3QgcGFnZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2UtJyArIHBhZ2VOdW0pO1xuICAgIGlmIChwYWdlRWwpIHtcbiAgICAgIHBhZ2VFbC5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdzdGFydCcgfSk7XG4gICAgfVxuICAgIC8vIEFsc28gc2Nyb2xsIHRodW1ibmFpbCBpbnRvIHZpZXdcbiAgICB0aGlzLnNjcm9sbFRodW1ibmFpbEludG9WaWV3KHBhZ2VOdW0pO1xuICAgIC8vIExvbmdlciB0aW1lb3V0IGZvciBsb25nIGRvY3VtZW50cyAtIHNtb290aCBzY3JvbGwgY2FuIHRha2UgdGltZVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5pc1Njcm9sbE5hdmlnYXRpbmcgPSBmYWxzZTtcbiAgICB9LCAxNTAwKTtcbiAgfVxuXG4gIHNjcm9sbFRodW1ibmFpbEludG9WaWV3KHBhZ2VOdW06IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHRodW1iRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGh1bWItJyArIHBhZ2VOdW0pO1xuICAgIGlmICh0aHVtYkVsKSB7XG4gICAgICB0aHVtYkVsLnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6ICdzbW9vdGgnLCBibG9jazogJ2NlbnRlcicgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkZWJvdW5jZWRSZW5kZXJWaXNpYmxlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlbmRlckRlYm91bmNlVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlbmRlckRlYm91bmNlVGltZXIpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlckRlYm91bmNlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyQWxsUGFnZXMoKTtcbiAgICB9LCAyMDApO1xuICB9XG5cbiAgYXN5bmMgcmVuZGVyQWxsUGFnZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gUHJldmVudCBjb25jdXJyZW50IHJlbmRlciBjYWxsc1xuICAgIGlmICh0aGlzLmlzUmVuZGVyaW5nQWxsKSByZXR1cm47XG4gICAgdGhpcy5pc1JlbmRlcmluZ0FsbCA9IHRydWU7XG5cbiAgICB0cnkge1xuICAgICAgLy8gUmVuZGVyIGFsbCBwYWdlcyAobWVtb3J5IHNhdmVkIHZpYSBEUFIgY2FwIGFuZCBjbGVhbnVwIG9uIGRlc3Ryb3kpXG4gICAgICBmb3IgKGxldCBwID0gMTsgcCA8PSB0aGlzLnBhZ2VDb3VudDsgcCsrKSB7XG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyUGFnZShwKTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5pc1JlbmRlcmluZ0FsbCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG5cblxuICAvKiA9PT09PT09PT09PT09PT09PSBab29tICYgUmVzaXplID09PT09PT09PT09PT09PT09ICovXG4gIHByaXZhdGUgbGFzdFBhcmVudFdpZHRoID0gMDtcbiAgcHJpdmF0ZSBsYXN0Rml0UGFnZU5vID0gLTE7XG5cbiAgLyoqIENvbXB1dGUgem9vbSBzbyB0aGUgV0lERVNUIHBhZ2UgaW4gdGhlIGRvY3VtZW50IGZpdHMgd2l0aGluIHRoZSBjb250YWluZXIuXG4gICAqICBUaGlzIHByZXZlbnRzIGxhbmRzY2FwZSBwYWdlcyBmcm9tIG92ZXJmbG93aW5nIGFuZCBiZWluZyBjbGlwcGVkIGJ5IG92ZXJmbG93LXguICovXG4gIGFzeW5jIGZpdFdpZHRoKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy52aWV3ZXJDb250YWluZXJSZWYpIHJldHVybjtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLnZpZXdlckNvbnRhaW5lclJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKCFwYXJlbnQgfHwgcGFyZW50LmNsaWVudFdpZHRoID09PSAwKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNTApKTtcbiAgICAgIHJldHVybiB0aGlzLmZpdFdpZHRoKCk7XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbmVyVyA9IHBhcmVudC5jbGllbnRXaWR0aDtcbiAgICBjb25zdCB0YXJnZXRXID0gY29udGFpbmVyVyAtIDQwOyAvLyBwYWRkaW5nXG5cbiAgICAvLyBDaGVjayBpZiBjb250YWluZXIgc2l6ZSBoYXMgY2hhbmdlZCBlbm91Z2gsIG9yIGlmIHRoZSBjdXJyZW50IHBhZ2UgY2hhbmdlZFxuICAgIGNvbnN0IHNhbWVDb250YWluZXIgPSBNYXRoLmFicyhjb250YWluZXJXIC0gdGhpcy5sYXN0UGFyZW50V2lkdGgpIDwgMjtcbiAgICBjb25zdCBzYW1lUGFnZSA9IHRoaXMucGFnZU5vID09PSB0aGlzLmxhc3RGaXRQYWdlTm87XG4gICAgaWYgKHNhbWVDb250YWluZXIgJiYgc2FtZVBhZ2UpIHJldHVybjtcblxuICAgIHRoaXMubGFzdFBhcmVudFdpZHRoID0gY29udGFpbmVyVztcbiAgICB0aGlzLmxhc3RGaXRQYWdlTm8gPSB0aGlzLnBhZ2VObztcblxuICAgIC8vIFdhaXQgZm9yIERPTSB0byBwb3B1bGF0ZSBpZiBwYWdlcyBhcmUgZGVmaW5lZFxuICAgIGlmICh0aGlzLnBhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDApKTtcbiAgICB9XG5cbiAgICAvLyBTY2FuIGFsbCBwYWdlcyB0byBmaW5kIHRoZSB3aWRlc3Qgdmlld3BvcnQgKGxhbmRzY2FwZSBwYWdlcyBtYXkgYmUgd2lkZXIgdGhhbiBwb3J0cmFpdClcbiAgICBsZXQgbWF4VnBXaWR0aCA9IDA7XG4gICAgZm9yIChsZXQgcCA9IDE7IHAgPD0gdGhpcy5wYWdlQ291bnQ7IHArKykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGcgPSBhd2FpdCB0aGlzLnBkZkRvY1Byb3h5LmdldFBhZ2UocCk7XG4gICAgICAgIGNvbnN0IHZwID0gcGcuZ2V0Vmlld3BvcnQoeyBzY2FsZTogMSB9KTtcbiAgICAgICAgaWYgKHZwLndpZHRoID4gbWF4VnBXaWR0aCkgbWF4VnBXaWR0aCA9IHZwLndpZHRoO1xuICAgICAgfSBjYXRjaCAoXykgeyAvKiBza2lwIHVuYXZhaWxhYmxlIHBhZ2VzICovIH1cbiAgICB9XG5cbiAgICBpZiAobWF4VnBXaWR0aCA8PSAwKSByZXR1cm47IC8vIHNhZmV0eSBndWFyZFxuXG4gICAgdGhpcy56b29tID0gdGFyZ2V0VyAvIG1heFZwV2lkdGg7XG5cbiAgICB0aGlzLnJlbmRlcmVkUGFnZXMuY2xlYXIoKTtcbiAgICBhd2FpdCB0aGlzLnJlbmRlckFsbFBhZ2VzKCk7XG4gIH1cblxuXG5cbiAgcHJpdmF0ZSBhc3luYyByZW5kZXJQYWdlKHA6IG51bWJlciA9IHRoaXMucGFnZU5vKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnBkZkRvY1Byb3h5IHx8IHRoaXMucmVuZGVyaW5nUGFnZXMuaGFzKHApIHx8IHRoaXMucmVuZGVyZWRQYWdlcy5oYXMocCkpIHJldHVybjtcbiAgICB0aGlzLnJlbmRlcmluZ1BhZ2VzLmFkZChwKTtcblxuICAgIC8vIE9ubHkgc2hvdyBnbG9iYWwgbG9hZGluZyBpZiBpdCdzIHRoZSBmaXJzdCByZW5kZXIgb3IgYSBtYW51YWwgc2F2ZS5cbiAgICAvLyBSZWd1bGFyIHBhZ2Uvem9vbSByZW5kZXJzIHNob3VsZG4ndCBibG9jayB0aGUgVUkgd2l0aCB0aGUgaW50cnVzaXZlIG92ZXJsYXkuXG4gICAgLy8gY29uc3Qgc2hvd0xvYWRpbmcgPSAhdGhpcy5pc0xvYWRpbmcgJiYgcCA9PT0gdGhpcy5wYWdlTm87XG4gICAgLy8gaWYgKHNob3dMb2FkaW5nKSB7XG4gICAgLy8gICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG4gICAgLy8gICB0aGlzLmxvYWRpbmdNZXNzYWdlID0gJ+C4geC4s+C4peC4seC4h+C5gOC4o+C4meC5gOC4lOC4reC4o+C5jOC5gOC4reC4geC4quC4suC4oy4uLic7XG4gICAgLy8gICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgLy8gfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhZ2UgPSBhd2FpdCB0aGlzLnBkZkRvY1Byb3h5LmdldFBhZ2UocCk7XG5cbiAgICAgIC8vIFN0b3JlIHRoZSB0cnVlIGVmZmVjdGl2ZSByb3RhdGlvbiBmcm9tIHBkZi5qcywgYXMgaXQgY29ycmVjdGx5IGhhbmRsZXMgaW5oZXJpdGVkIHJvdGF0aW9uc1xuICAgICAgLy8gZnJvbSB0aGUgUERGIHBhZ2UgdHJlZSAod2hpY2ggcGRmLWxpYidzIGdldFJvdGF0aW9uKCkgc29tZXRpbWVzIG1pc3NlcykuXG4gICAgICAvLyBXZSB3aWxsIHVzZSB0aGlzIGluIHNhdmVEb2N1bWVudCB0byBrbm93IGV4YWN0bHkgaG93IHRoZSB1c2VyIHNhdyB0aGUgcGFnZS5cbiAgICAgIHRoaXMucGRmUGFnZVJvdGF0aW9ucy5zZXQocCwgcGFnZS5yb3RhdGUgfHwgMCk7XG5cbiAgICAgIC8vIFVzZSBuYXRpdmUgcGRmLmpzIHZpZXdwb3J0LiBwZGYuanMgc21hcnRseSBoYW5kbGVzIHJvdGF0aW9uIGluY2x1ZGluZyBpbmhlcml0ZWQgb25lcy5cbiAgICAgIGNvbnN0IHZpZXdwb3J0ID0gcGFnZS5nZXRWaWV3cG9ydCh7IHNjYWxlOiB0aGlzLnpvb20gfSk7XG4gICAgICBpZiAocCA9PT0gdGhpcy5wYWdlTm8pIHRoaXMuY3VycmVudFZpZXdwb3J0ID0gdmlld3BvcnQ7XG5cbiAgICAgIGNvbnN0IHBkZkNhbnZhcyA9IHRoaXMuZ2V0UGRmQ2FudmFzKHApO1xuICAgICAgaWYgKCFwZGZDYW52YXMpIHJldHVybjtcbiAgICAgIGNvbnN0IHBkZkN0eCA9IHBkZkNhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgICAgLy8gQ2FwIERQUiBhdCAyIHRvIHJlZHVjZSBtZW1vcnkgdXNhZ2Ugb24gaGlnaC1yZXMgZGlzcGxheXNcbiAgICAgIGNvbnN0IGRwciA9IE1hdGgubWluKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsIDIpO1xuICAgICAgcGRmQ2FudmFzLndpZHRoID0gTWF0aC5mbG9vcih2aWV3cG9ydC53aWR0aCAqIGRwcik7XG4gICAgICBwZGZDYW52YXMuaGVpZ2h0ID0gTWF0aC5mbG9vcih2aWV3cG9ydC5oZWlnaHQgKiBkcHIpO1xuICAgICAgcGRmQ2FudmFzLnN0eWxlLndpZHRoID0gdmlld3BvcnQud2lkdGggKyAncHgnO1xuICAgICAgcGRmQ2FudmFzLnN0eWxlLmhlaWdodCA9IHZpZXdwb3J0LmhlaWdodCArICdweCc7XG4gICAgICBwZGZDdHguc2V0VHJhbnNmb3JtKGRwciwgMCwgMCwgZHByLCAwLCAwKTtcblxuICAgICAgcGRmQ3R4LmNsZWFyUmVjdCgwLCAwLCB2aWV3cG9ydC53aWR0aCwgdmlld3BvcnQuaGVpZ2h0KTtcbiAgICAgIGF3YWl0IHBhZ2UucmVuZGVyKHsgY2FudmFzQ29udGV4dDogcGRmQ3R4LCB2aWV3cG9ydCB9KS5wcm9taXNlO1xuXG4gICAgICAvLyBSZW5kZXIgVGV4dCBMYXllciBmb3IgbmF0aXZlIHNlbGVjdGlvblxuICAgICAgY29uc3QgcGFnZVdyYXBwZXIgPSBwZGZDYW52YXMucGFyZW50RWxlbWVudDtcbiAgICAgIGlmIChwYWdlV3JhcHBlcikge1xuICAgICAgICBsZXQgdGV4dExheWVyRGl2ID0gcGFnZVdyYXBwZXIucXVlcnlTZWxlY3RvcignLnRleHRMYXllcicpIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgICAgICBpZiAoIXRleHRMYXllckRpdikge1xuICAgICAgICAgIHRleHRMYXllckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIHRleHRMYXllckRpdi5jbGFzc05hbWUgPSAndGV4dExheWVyJztcbiAgICAgICAgICBwYWdlV3JhcHBlci5pbnNlcnRCZWZvcmUodGV4dExheWVyRGl2LCBwZGZDYW52YXMubmV4dFNpYmxpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHRleHRMYXllckRpdi5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgdGV4dExheWVyRGl2LnN0eWxlLndpZHRoID0gdmlld3BvcnQud2lkdGggKyAncHgnO1xuICAgICAgICB0ZXh0TGF5ZXJEaXYuc3R5bGUuaGVpZ2h0ID0gdmlld3BvcnQuaGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgdGV4dExheWVyRGl2LnN0eWxlLmxlZnQgPSAnMCc7XG4gICAgICAgIHRleHRMYXllckRpdi5zdHlsZS50b3AgPSAnMCc7XG5cbiAgICAgICAgLy8gRW5zdXJlIHNjYWxlIGZhY3RvciBpcyBjbGVhbmx5IGFwcGxpZWRcbiAgICAgICAgdGV4dExheWVyRGl2LnN0eWxlLnNldFByb3BlcnR5KCctLXNjYWxlLWZhY3RvcicsIHZpZXdwb3J0LnNjYWxlLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgdGV4dENvbnRlbnQgPSBhd2FpdCBwYWdlLmdldFRleHRDb250ZW50KCk7XG4gICAgICAgICAgY29uc3QgdGV4dExheWVyID0gbmV3IChwZGZqc0xpYiBhcyBhbnkpLlRleHRMYXllcih7XG4gICAgICAgICAgICB0ZXh0Q29udGVudFNvdXJjZTogdGV4dENvbnRlbnQsXG4gICAgICAgICAgICBjb250YWluZXI6IHRleHRMYXllckRpdixcbiAgICAgICAgICAgIHZpZXdwb3J0XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYXdhaXQgdGV4dExheWVyLnJlbmRlcigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdGYWlsZWQgdG8gcmVuZGVyIHRleHQgbGF5ZXI6JywgZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU21hbGwgZGVsYXkgdG8gZW5zdXJlIFBERiBjb250ZW50IChmb250cywgdGV4dCkgYXJlIGZ1bGx5IHJlbmRlcmVkXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwKSk7XG5cbiAgICAgIHRoaXMucmVzaXplQW5ub3RDYW52YXNUbyhwLCB2aWV3cG9ydC53aWR0aCwgdmlld3BvcnQuaGVpZ2h0KTtcblxuICAgICAgY29uc3QgYW5ub3RDYW52YXMgPSB0aGlzLmdldEFubm90Q2FudmFzKHApO1xuICAgICAgaWYgKGFubm90Q2FudmFzKSB7XG4gICAgICAgIC8vIFJ1biBldmVudHMgb3V0c2lkZSBBbmd1bGFyIHRvIGVsaW1pbmF0ZSBDaGFuZ2UgRGV0ZWN0aW9uIGxhZyBvbiAxMjBIei8yNDBIeiBBcHBsZSBQZW5jaWxzXG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgaWYgKChhbm5vdENhbnZhcyBhcyBhbnkpLl9oYXNQb2ludGVyRXZlbnRzKSByZXR1cm47XG4gICAgICAgICAgKGFubm90Q2FudmFzIGFzIGFueSkuX2hhc1BvaW50ZXJFdmVudHMgPSB0cnVlO1xuXG4gICAgICAgICAgYW5ub3RDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCAoZSkgPT4gdGhpcy5vbkNhbnZhc1BvaW50ZXJEb3duKGUsIHApKTtcbiAgICAgICAgICBhbm5vdENhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIChlKSA9PiB0aGlzLm9uQ2FudmFzUG9pbnRlck1vdmUoZSwgcCkpO1xuICAgICAgICAgIGFubm90Q2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIChlKSA9PiB0aGlzLm9uQ2FudmFzUG9pbnRlclVwKGUsIHApKTtcbiAgICAgICAgICBhbm5vdENhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybGVhdmUnLCAoZSkgPT4gdGhpcy5vbkNhbnZhc1BvaW50ZXJVcChlLCBwKSk7XG4gICAgICAgICAgYW5ub3RDYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmNhbmNlbCcsIChlKSA9PiB0aGlzLm9uQ2FudmFzUG9pbnRlclVwKGUsIHApKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVkcmF3KHApO1xuICAgICAgdGhpcy5jbGFtcFRleHRCb3hlc1RvVmlldygpO1xuICAgICAgdGhpcy5yZW5kZXJlZFBhZ2VzLmFkZChwKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHJlbmRlcmluZyBwYWdlICR7cH06YCwgZXJyKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5yZW5kZXJpbmdQYWdlcy5kZWxldGUocCk7XG4gICAgICBpZiAodGhpcy5yZW5kZXJpbmdQYWdlcy5zaXplID09PSAwKSB7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubG9hZGluZ01lc3NhZ2UgPSAnJztcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzaXplQW5ub3RDYW52YXNUbyhwOiBudW1iZXIsIGNzc1c6IG51bWJlciwgY3NzSDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5nZXRBbm5vdENhbnZhcyhwKTtcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICAvLyBDYXAgRFBSIGF0IDIgdG8gcmVkdWNlIG1lbW9yeSB1c2FnZVxuICAgIGNvbnN0IGRwciA9IE1hdGgubWluKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsIDIpO1xuXG4gICAgLy8gRm9yY2UgY2xlYXIgY2FudmFzIGJlZm9yZSByZXNpemluZyB0byByZW1vdmUgYW55IGFydGlmYWN0c1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblxuICAgIGNhbnZhcy53aWR0aCA9IE1hdGguZmxvb3IoY3NzVyAqIGRwcik7XG4gICAgY2FudmFzLmhlaWdodCA9IE1hdGguZmxvb3IoY3NzSCAqIGRwcik7XG4gICAgY2FudmFzLnN0eWxlLndpZHRoID0gY3NzVyArICdweCc7XG4gICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGNzc0ggKyAncHgnO1xuXG4gICAgY3R4LnNldFRyYW5zZm9ybShkcHIsIDAsIDAsIGRwciwgMCwgMCk7XG4gICAgY3R4LmxpbmVKb2luID0gJ3JvdW5kJztcbiAgICBjdHgubGluZUNhcCA9ICdyb3VuZCc7XG4gICAgY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXR1cFJlc2l6ZUF1dG9SZW5kZXIoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnZpZXdlckNvbnRhaW5lclJlZikgcmV0dXJuO1xuICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgdGhpcy5maXRXaWR0aCgpO1xuICAgIH0pO1xuICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnZpZXdlckNvbnRhaW5lclJlZi5uYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIC8qID09PT09PT09PT09PT09PT09IFRvb2wgTW9kZSBUb2dnbGVzID09PT09PT09PT09PT09PT09ICovXG4gIHNldFRvb2xNb2RlKG1vZGU6IFRvb2xNb2RlKTogdm9pZCB7XG4gICAgdGhpcy50b29sTW9kZSA9IHRoaXMudG9vbE1vZGUgPT09IG1vZGUgPyAnbm9uZScgOiBtb2RlO1xuICAgIHRoaXMuc2hvd1NoYXBlTWVudSA9IGZhbHNlO1xuICAgIHRoaXMuc3luY1Rvb2xNb2RlU3R5bGVzKCk7XG4gIH1cblxuICB1cGRhdGVDdXJzb3IoKTogdm9pZCB7XG4gICAgdGhpcy5wYWdlcy5mb3JFYWNoKHAgPT4ge1xuICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5nZXRBbm5vdENhbnZhcyhwKTtcbiAgICAgIGlmIChjYW52YXMpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnRvb2xNb2RlKSB7XG4gICAgICAgICAgY2FzZSAnZHJhdyc6XG4gICAgICAgICAgY2FzZSAnc2hhcGUnOlxuICAgICAgICAgIGNhc2UgJ2VyYXNlcic6XG4gICAgICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgICAgY2FzZSAnbWFyayc6XG4gICAgICAgICAgY2FzZSAnZm9ybWZpZWxkJzpcbiAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5jdXJzb3IgPSAnY3Jvc3NoYWlyJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2hpZ2hsaWdodCc6XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUuY3Vyc29yID0gJ2NlbGwnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUuY3Vyc29yID0gJ3RleHQnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc2lnbmF0dXJlJzpcbiAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5jdXJzb3IgPSAnY29weSc7IC8vIE9yIGN1c3RvbSBjdXJzb3IgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY2FudmFzLnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0JztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyogPT09PT09PT09PT09PT09PT0gU2l6ZSBBZGp1c3RtZW50cyA9PT09PT09PT09PT09PT09PSAqL1xuICBjaGFuZ2VCcnVzaFNpemUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuYnJ1c2hTaXplID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oNTAsIHRoaXMuYnJ1c2hTaXplICsgZGVsdGEpKTtcbiAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHNldEJydXNoQ29sb3IoY29sb3I6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuYnJ1c2hDb2xvciA9IGNvbG9yO1xuICAgIHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgY2hhbmdlSGlnaGxpZ2h0U2l6ZShkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5oaWdobGlnaHRTaXplID0gTWF0aC5tYXgoNSwgTWF0aC5taW4oMTAwLCB0aGlzLmhpZ2hsaWdodFNpemUgKyBkZWx0YSkpO1xuICAgIHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgc2V0SGlnaGxpZ2h0Q29sb3IoY29sb3I6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuaGlnaGxpZ2h0Q29sb3IgPSBjb2xvcjtcbiAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIGNoYW5nZVRleHRGb250U2l6ZShkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy50ZXh0Rm9udFNpemUgPSBNYXRoLm1heCg4LCBNYXRoLm1pbigxMDAsIHRoaXMudGV4dEZvbnRTaXplICsgZGVsdGEpKTtcbiAgICBpZiAodGhpcy5hY3RpdmVUZXh0Qm94SWQpIHtcbiAgICAgIGNvbnN0IHRiID0gdGhpcy50ZXh0Qm94ZXMuZmluZCh0ID0+IHQuaWQgPT09IHRoaXMuYWN0aXZlVGV4dEJveElkKTtcbiAgICAgIGlmICh0Yikge1xuICAgICAgICB0Yi5mb250U2l6ZSA9IHRoaXMudGV4dEZvbnRTaXplO1xuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgdG9nZ2xlRHJhdygpOiB2b2lkIHsgdGhpcy5zZXRUb29sTW9kZSgnZHJhdycpOyB9XG4gIHRvZ2dsZUVyYXNlcigpOiB2b2lkIHsgdGhpcy5zZXRUb29sTW9kZSgnZXJhc2VyJyk7IH1cbiAgdG9nZ2xlSGlnaGxpZ2h0KCk6IHZvaWQgeyB0aGlzLnNldFRvb2xNb2RlKCdoaWdobGlnaHQnKTsgfVxuICBlbmFibGVUZXh0UGxhY2VNb2RlKCk6IHZvaWQgeyB0aGlzLnNldFRvb2xNb2RlKCd0ZXh0Jyk7IH1cblxuICB0b2dnbGVTaGFwZU1lbnUoKTogdm9pZCB7XG4gICAgdGhpcy5zaG93U2hhcGVNZW51ID0gIXRoaXMuc2hvd1NoYXBlTWVudTtcbiAgICBpZiAodGhpcy5zaG93U2hhcGVNZW51KSB7XG4gICAgICB0aGlzLnRvb2xNb2RlID0gJ3NoYXBlJztcbiAgICB9XG4gIH1cblxuICB0b2dnbGVTaGFwZURyb3Bkb3duKCk6IHZvaWQge1xuICAgIHRoaXMuc2hvd1NoYXBlRHJvcGRvd24gPSAhdGhpcy5zaG93U2hhcGVEcm9wZG93bjtcbiAgfVxuXG4gIHNlbGVjdFNoYXBlKHR5cGU6ICdyZWN0JyB8ICdjaXJjbGUnIHwgJ2Fycm93JyB8ICdsaW5lJyk6IHZvaWQge1xuICAgIHRoaXMuc2hhcGVUeXBlID0gdHlwZTtcbiAgICB0aGlzLnRvb2xNb2RlID0gJ3NoYXBlJztcbiAgICB0aGlzLnNob3dTaGFwZU1lbnUgPSBmYWxzZTtcbiAgICB0aGlzLnNob3dTaGFwZURyb3Bkb3duID0gZmFsc2U7XG4gICAgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnVwZGF0ZUN1cnNvcigpO1xuICB9XG5cbiAgc2V0U2hhcGVTdHJva2VDb2xvcihjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zaGFwZVN0cm9rZUNvbG9yID0gY29sb3I7XG4gICAgaWYgKHRoaXMuYWN0aXZlT2JqZWN0SWQgJiYgdGhpcy5hY3RpdmVPYmplY3RUeXBlID09PSAnc2hhcGUnKSB7XG4gICAgICBjb25zdCBzID0gdGhpcy5zaGFwZVN0YW1wcy5maW5kKHggPT4geC5pZCA9PT0gdGhpcy5hY3RpdmVPYmplY3RJZCk7XG4gICAgICBpZiAocykgcy5zdHJva2VDb2xvciA9IGNvbG9yO1xuICAgIH1cbiAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgc2V0U2hhcGVGaWxsQ29sb3IoY29sb3I6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2hhcGVGaWxsQ29sb3IgPSBjb2xvcjtcbiAgICBpZiAodGhpcy5hY3RpdmVPYmplY3RJZCAmJiB0aGlzLmFjdGl2ZU9iamVjdFR5cGUgPT09ICdzaGFwZScpIHtcbiAgICAgIGNvbnN0IHMgPSB0aGlzLnNoYXBlU3RhbXBzLmZpbmQoeCA9PiB4LmlkID09PSB0aGlzLmFjdGl2ZU9iamVjdElkKTtcbiAgICAgIGlmIChzKSBzLmZpbGxDb2xvciA9IGNvbG9yO1xuICAgIH1cbiAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgdG9nZ2xlU2hhcGVGaWxsKCk6IHZvaWQge1xuICAgIHRoaXMuc2hhcGVGaWxsRW5hYmxlZCA9ICF0aGlzLnNoYXBlRmlsbEVuYWJsZWQ7XG4gICAgaWYgKHRoaXMuYWN0aXZlT2JqZWN0SWQgJiYgdGhpcy5hY3RpdmVPYmplY3RUeXBlID09PSAnc2hhcGUnKSB7XG4gICAgICBjb25zdCBzID0gdGhpcy5zaGFwZVN0YW1wcy5maW5kKHggPT4geC5pZCA9PT0gdGhpcy5hY3RpdmVPYmplY3RJZCk7XG4gICAgICBpZiAocykgcy5maWxsQ29sb3IgPSB0aGlzLnNoYXBlRmlsbEVuYWJsZWQgPyB0aGlzLnNoYXBlRmlsbENvbG9yIDogJ25vbmUnO1xuICAgIH1cbiAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgdG9nZ2xlU2hhcGVOb1N0cm9rZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNoYXBlTm9TdHJva2UgPSAhdGhpcy5zaGFwZU5vU3Ryb2tlO1xuICAgIGlmICh0aGlzLmFjdGl2ZU9iamVjdElkICYmIHRoaXMuYWN0aXZlT2JqZWN0VHlwZSA9PT0gJ3NoYXBlJykge1xuICAgICAgY29uc3QgcyA9IHRoaXMuc2hhcGVTdGFtcHMuZmluZCh4ID0+IHguaWQgPT09IHRoaXMuYWN0aXZlT2JqZWN0SWQpO1xuICAgICAgaWYgKHMpIHMuc3Ryb2tlQ29sb3IgPSB0aGlzLnNoYXBlTm9TdHJva2UgPyAnbm9uZScgOiB0aGlzLnNoYXBlU3Ryb2tlQ29sb3I7XG4gICAgfVxuICAgIHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICBjaGFuZ2VTaGFwZVN0cm9rZVNpemUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHMgPSB0aGlzLnNoYXBlU3Ryb2tlU2l6ZSArIGRlbHRhO1xuICAgIGlmIChzID49IDEgJiYgcyA8PSAyMCkge1xuICAgICAgdGhpcy5zaGFwZVN0cm9rZVNpemUgPSBzO1xuICAgICAgaWYgKHRoaXMuYWN0aXZlT2JqZWN0SWQgJiYgdGhpcy5hY3RpdmVPYmplY3RUeXBlID09PSAnc2hhcGUnKSB7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5zaGFwZVN0YW1wcy5maW5kKHggPT4geC5pZCA9PT0gdGhpcy5hY3RpdmVPYmplY3RJZCk7XG4gICAgICAgIGlmIChzaGFwZSkgc2hhcGUuc3Ryb2tlV2lkdGggPSBzO1xuICAgICAgfVxuICAgICAgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICB9XG4gIH1cblxuICAvKiA9PT09PT09PT09PT09PT09PSBBbm5vdGF0aW9uIENhbnZhcyBFdmVudHMgPT09PT09PT09PT09PT09PT0gKi9cbiAgcHJpdmF0ZSBnZXROb3JtUG9zKGU6IFBvaW50ZXJFdmVudCwgcDogbnVtYmVyKTogU3Ryb2tlUG9pbnQge1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLmFjdGl2ZUNhbnZhc1JlY3QgfHwgKCgpID0+IHtcbiAgICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuZ2V0QW5ub3RDYW52YXMocCk7XG4gICAgICByZXR1cm4gY2FudmFzID8gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIDogbnVsbDtcbiAgICB9KSgpO1xuXG4gICAgaWYgKCFyZWN0KSByZXR1cm4geyB4OiAwLCB5OiAwLCBwOiAwIH07XG5cbiAgICBjb25zdCBueCA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIChlLmNsaWVudFggLSByZWN0LmxlZnQpIC8gcmVjdC53aWR0aCkpO1xuICAgIGNvbnN0IG55ID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgKGUuY2xpZW50WSAtIHJlY3QudG9wKSAvIHJlY3QuaGVpZ2h0KSk7XG4gICAgY29uc3QgcHJlc3N1cmUgPSAodHlwZW9mIGUucHJlc3N1cmUgPT09ICdudW1iZXInICYmIGUucHJlc3N1cmUgPiAwKSA/IGUucHJlc3N1cmUgOiAwO1xuXG4gICAgcmV0dXJuIHsgeDogbngsIHk6IG55LCBwOiBwcmVzc3VyZSB9O1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5hbGl6ZUFjdGl2ZVN0cm9rZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlU3Ryb2tlICYmICF0aGlzLmFjdGl2ZVNoYXBlKSByZXR1cm47XG5cbiAgICBsZXQgbmVlZHNEZXRlY3Rpb24gPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLmFjdGl2ZVN0cm9rZSkge1xuICAgICAgdGhpcy5lbnN1cmVQYWdlKCk7XG4gICAgICB0aGlzLnN0cm9rZXNbdGhpcy5wYWdlTm9dLnB1c2godGhpcy5hY3RpdmVTdHJva2UpO1xuICAgICAgdGhpcy5hY3RpdmVTdHJva2UgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFjdGl2ZVNoYXBlKSB7XG4gICAgICBjb25zdCBzaCA9IHRoaXMuYWN0aXZlU2hhcGU7XG4gICAgICB0aGlzLmFjdGl2ZVNoYXBlID0gbnVsbDtcblxuICAgICAgLy8gQ29udmVydCBjYW52YXMgc2hhcGUg4oaSIGRyYWdnYWJsZSBTaGFwZVN0YW1wIG92ZXJsYXlcbiAgICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuZ2V0QW5ub3RDYW52YXMoc2gucGFnZSk7XG4gICAgICBpZiAoY2FudmFzKSB7XG4gICAgICAgIGNvbnN0IGN3ID0gY2FudmFzLmNsaWVudFdpZHRoO1xuICAgICAgICBjb25zdCBjaCA9IGNhbnZhcy5jbGllbnRIZWlnaHQ7XG5cbiAgICAgICAgY29uc3QgeDEgPSBzaC5zdGFydFggKiBjdztcbiAgICAgICAgY29uc3QgeTEgPSBzaC5zdGFydFkgKiBjaDtcbiAgICAgICAgY29uc3QgeDIgPSBzaC5lbmRYICogY3c7XG4gICAgICAgIGNvbnN0IHkyID0gc2guZW5kWSAqIGNoO1xuXG4gICAgICAgIGNvbnN0IGxlZnQgPSBNYXRoLm1pbih4MSwgeDIpO1xuICAgICAgICBjb25zdCB0b3AgPSBNYXRoLm1pbih5MSwgeTIpO1xuICAgICAgICBjb25zdCByaWdodCA9IE1hdGgubWF4KHgxLCB4Mik7XG4gICAgICAgIGNvbnN0IGJvdHRvbSA9IE1hdGgubWF4KHkxLCB5Mik7XG5cbiAgICAgICAgLy8gRm9yIGxpbmUvYXJyb3cgdGhlIGJvdW5kaW5nIGJveCBjYW4gYmUgdGlueSDigJQgZW5zdXJlIG1pbmltdW0gMjBweFxuICAgICAgICBjb25zdCBidyA9IE1hdGgubWF4KHJpZ2h0IC0gbGVmdCwgMjApO1xuICAgICAgICBjb25zdCBiaCA9IE1hdGgubWF4KGJvdHRvbSAtIHRvcCwgMjApO1xuXG4gICAgICAgIGNvbnN0IHN0YW1wOiBTaGFwZVN0YW1wID0ge1xuICAgICAgICAgIGlkOiAnc2hzXycgKyBEYXRlLm5vdygpICsgJ18nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygxNikuc2xpY2UoMiksXG4gICAgICAgICAgcGFnZTogc2gucGFnZSxcbiAgICAgICAgICB4OiAobGVmdCAvIGN3KSAqIDEwMCxcbiAgICAgICAgICB5OiAodG9wIC8gY2gpICogMTAwLFxuICAgICAgICAgIHdpZHRoOiAoYncgLyBjdykgKiAxMDAsXG4gICAgICAgICAgaGVpZ2h0OiAoYmggLyBjaCkgKiAxMDAsXG4gICAgICAgICAgdHlwZTogc2gudHlwZSxcbiAgICAgICAgICBzdHJva2VDb2xvcjogc2guY29sb3IsXG4gICAgICAgICAgc3Ryb2tlV2lkdGg6IHNoLnNpemUsXG4gICAgICAgICAgdmlld1dpZHRoOiBjdywgICAvLyByZW1lbWJlciBjYW52YXMgQ1NTIHdpZHRoIGZvciBjb3JyZWN0IFBERiBzdHJva2Ugc2NhbGluZ1xuICAgICAgICAgIGZpbGxDb2xvcjogc2guZmlsbENvbG9yLFxuICAgICAgICAgIC8vIEZyYWN0aW9uIG9mIHRoZSBiYm94IHdoZXJlIHRoZSBvcmlnaW5hbCBzdGFydC9lbmQgcG9pbnRzIHNpdFxuICAgICAgICAgIHN0YXJ0RnJhY1g6IGJ3ID4gMCA/ICh4MSAtIGxlZnQpIC8gYncgOiAwLFxuICAgICAgICAgIHN0YXJ0RnJhY1k6IGJoID4gMCA/ICh5MSAtIHRvcCkgLyBiaCA6IDAsXG4gICAgICAgICAgZW5kRnJhY1g6IGJ3ID4gMCA/ICh4MiAtIGxlZnQpIC8gYncgOiAxLFxuICAgICAgICAgIGVuZEZyYWNZOiBiaCA+IDAgPyAoeTIgLSB0b3ApIC8gYmggOiAxLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNoYXBlU3RhbXBzLnB1c2goc3RhbXApO1xuICAgICAgfVxuXG4gICAgICAvLyBTaW5nbGUtZHJhdzogZXhpdCBzaGFwZSBtb2RlIGFmdGVyIGRyYXdpbmcgb25lIHNoYXBlXG4gICAgICB0aGlzLnRvb2xNb2RlID0gJ25vbmUnO1xuICAgICAgdGhpcy51cGRhdGVDdXJzb3IoKTtcbiAgICAgIHRoaXMuc3luY1Rvb2xNb2RlU3R5bGVzKCk7XG4gICAgICBuZWVkc0RldGVjdGlvbiA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5hY3RpdmVQb2ludGVySWQgPSBudWxsO1xuICAgIHRoaXMuYWN0aXZlQ2FudmFzUmVjdCA9IG51bGw7XG4gICAgdGhpcy5yZWRyYXcodGhpcy5wYWdlTm8pO1xuXG4gICAgaWYgKG5lZWRzRGV0ZWN0aW9uKSB7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlU2hhcGVTdGFtcChpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zaGFwZVN0YW1wcyA9IHRoaXMuc2hhcGVTdGFtcHMuZmlsdGVyKHMgPT4gcy5pZCAhPT0gaWQpO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHN0YXJ0U2hhcGVEcmFnKGU6IFBvaW50ZXJFdmVudCwgc3NpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudG9vbE1vZGUgIT09ICdub25lJykgcmV0dXJuO1xuICAgIHRoaXMuY2xvc2VDb250ZXh0TWVudSgpO1xuICAgIFxuICAgIHRoaXMuYWN0aXZlT2JqZWN0SWQgPSBzc2lkO1xuICAgIHRoaXMuYWN0aXZlT2JqZWN0VHlwZSA9ICdzaGFwZSc7XG5cbiAgICBjb25zdCBzdGFtcCA9IHRoaXMuc2hhcGVTdGFtcHMuZmluZChzID0+IHMuaWQgPT09IHNzaWQpO1xuICAgIGlmICghc3RhbXApIHJldHVybjtcblxuICAgIC8vIFN5bmMgVUkgc2V0dGluZ3Mgd2l0aCB0aGUgc2VsZWN0ZWQgc2hhcGVcbiAgICB0aGlzLnNoYXBlVHlwZSA9IHN0YW1wLnR5cGU7XG4gICAgaWYgKHN0YW1wLnN0cm9rZUNvbG9yID09PSAnbm9uZScgfHwgc3RhbXAuc3Ryb2tlQ29sb3IgPT09ICdyZ2JhKDAsMCwwLDApJyB8fCBzdGFtcC5zdHJva2VDb2xvciA9PT0gJ3RyYW5zcGFyZW50Jykge1xuICAgICAgdGhpcy5zaGFwZU5vU3Ryb2tlID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaGFwZU5vU3Ryb2tlID0gZmFsc2U7XG4gICAgICB0aGlzLnNoYXBlU3Ryb2tlQ29sb3IgPSBzdGFtcC5zdHJva2VDb2xvcjtcbiAgICB9XG4gICAgaWYgKCFzdGFtcC5maWxsQ29sb3IgfHwgc3RhbXAuZmlsbENvbG9yID09PSAnbm9uZScgfHwgc3RhbXAuZmlsbENvbG9yID09PSAncmdiYSgwLDAsMCwwKScgfHwgc3RhbXAuZmlsbENvbG9yID09PSAndHJhbnNwYXJlbnQnKSB7XG4gICAgICB0aGlzLnNoYXBlRmlsbEVuYWJsZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaGFwZUZpbGxFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2hhcGVGaWxsQ29sb3IgPSBzdGFtcC5maWxsQ29sb3I7XG4gICAgfVxuICAgIHRoaXMuc2hhcGVTdHJva2VTaXplID0gc3RhbXAuc3Ryb2tlV2lkdGggfHwgdGhpcy5zaGFwZVN0cm9rZVNpemU7XG5cbiAgICB0aGlzLmlzRHJhZ2dpbmdTaGFwZSA9IHRydWU7XG4gICAgdGhpcy5kcmFnU2hhcGVJZCA9IHNzaWQ7XG5cbiAgICBjb25zdCBjYW52YXNSZWN0ID0gdGhpcy5nZXREcmFnQ2FudmFzUmVjdChzdGFtcC5wYWdlKTtcbiAgICBjb25zdCBzdGFydFhweCA9IChzdGFtcC54IC8gMTAwKSAqIGNhbnZhc1JlY3Qud2lkdGg7XG4gICAgY29uc3Qgc3RhcnRZcHggPSAoc3RhbXAueSAvIDEwMCkgKiBjYW52YXNSZWN0LmhlaWdodDtcbiAgICB0aGlzLmRyYWdPZmZzZXRYID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0IC0gc3RhcnRYcHg7XG4gICAgdGhpcy5kcmFnT2Zmc2V0WSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wIC0gc3RhcnRZcHg7XG5cbiAgICBjb25zdCBtb3ZlID0gKGV2OiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoIXRoaXMuaXNEcmFnZ2luZ1NoYXBlIHx8ICF0aGlzLmRyYWdTaGFwZUlkKSByZXR1cm47XG4gICAgICBjb25zdCBzID0gdGhpcy5zaGFwZVN0YW1wcy5maW5kKHggPT4geC5pZCA9PT0gdGhpcy5kcmFnU2hhcGVJZCk7XG4gICAgICBpZiAoIXMpIHJldHVybjtcbiAgICAgIHMueCA9ICgoZXYuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdCAtIHRoaXMuZHJhZ09mZnNldFgpIC8gY2FudmFzUmVjdC53aWR0aCkgKiAxMDA7XG4gICAgICBzLnkgPSAoKGV2LmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcCAtIHRoaXMuZHJhZ09mZnNldFkpIC8gY2FudmFzUmVjdC5oZWlnaHQpICogMTAwO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH07XG5cbiAgICBjb25zdCB1cCA9ICgpID0+IHtcbiAgICAgIHRoaXMuaXNEcmFnZ2luZ1NoYXBlID0gZmFsc2U7XG4gICAgICB0aGlzLmRyYWdTaGFwZUlkID0gbnVsbDtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG1vdmUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgbW92ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgfVxuXG4gIHN0YXJ0U2hhcGVSZXNpemUoZXY6IFBvaW50ZXJFdmVudCwgc2hhcGVJZDogc3RyaW5nLCBkaXJlY3Rpb246IFJlc2l6ZURpcmVjdGlvbiA9ICdzZScpOiB2b2lkIHtcbiAgICBpZiAoZXYuYnV0dG9uID09PSAyIHx8IGV2LmN0cmxLZXkpIHJldHVybjtcbiAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3Qgc3RhbXAgPSB0aGlzLnNoYXBlU3RhbXBzLmZpbmQocyA9PiBzLmlkID09PSBzaGFwZUlkKTtcbiAgICBpZiAoIXN0YW1wKSByZXR1cm47XG5cbiAgICAvLyBTeW5jIFVJIHNldHRpbmdzIHdpdGggdGhlIHNlbGVjdGVkIHNoYXBlXG4gICAgdGhpcy5hY3RpdmVPYmplY3RJZCA9IHNoYXBlSWQ7XG4gICAgdGhpcy5hY3RpdmVPYmplY3RUeXBlID0gJ3NoYXBlJztcbiAgICB0aGlzLnNoYXBlVHlwZSA9IHN0YW1wLnR5cGU7XG4gICAgaWYgKHN0YW1wLnN0cm9rZUNvbG9yID09PSAnbm9uZScgfHwgc3RhbXAuc3Ryb2tlQ29sb3IgPT09ICdyZ2JhKDAsMCwwLDApJyB8fCBzdGFtcC5zdHJva2VDb2xvciA9PT0gJ3RyYW5zcGFyZW50Jykge1xuICAgICAgdGhpcy5zaGFwZU5vU3Ryb2tlID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaGFwZU5vU3Ryb2tlID0gZmFsc2U7XG4gICAgICB0aGlzLnNoYXBlU3Ryb2tlQ29sb3IgPSBzdGFtcC5zdHJva2VDb2xvcjtcbiAgICB9XG4gICAgaWYgKCFzdGFtcC5maWxsQ29sb3IgfHwgc3RhbXAuZmlsbENvbG9yID09PSAnbm9uZScgfHwgc3RhbXAuZmlsbENvbG9yID09PSAncmdiYSgwLDAsMCwwKScgfHwgc3RhbXAuZmlsbENvbG9yID09PSAndHJhbnNwYXJlbnQnKSB7XG4gICAgICB0aGlzLnNoYXBlRmlsbEVuYWJsZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaGFwZUZpbGxFbmFibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2hhcGVGaWxsQ29sb3IgPSBzdGFtcC5maWxsQ29sb3I7XG4gICAgfVxuICAgIHRoaXMuc2hhcGVTdHJva2VTaXplID0gc3RhbXAuc3Ryb2tlV2lkdGggfHwgdGhpcy5zaGFwZVN0cm9rZVNpemU7XG5cbiAgICB0aGlzLmlzUmVzaXppbmdTaGFwZSA9IHRydWU7XG4gICAgdGhpcy5yZXNpemVTaGFwZUlkID0gc2hhcGVJZDtcblxuICAgIGNvbnN0IGNhbnZhc1JlY3QgPSB0aGlzLmdldERyYWdDYW52YXNSZWN0KHN0YW1wLnBhZ2UpO1xuICAgIGNvbnN0IHN0YXJ0WCA9IGV2LmNsaWVudFg7XG4gICAgY29uc3Qgc3RhcnRZID0gZXYuY2xpZW50WTtcbiAgICBjb25zdCBzdGFydFcgPSBzdGFtcC53aWR0aDtcbiAgICBjb25zdCBzdGFydEggPSBzdGFtcC5oZWlnaHQ7XG4gICAgY29uc3Qgc3RhcnRTWCA9IHN0YW1wLng7XG4gICAgY29uc3Qgc3RhcnRTWSA9IHN0YW1wLnk7XG5cbiAgICBjb25zdCBtb3ZlID0gKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKCF0aGlzLmlzUmVzaXppbmdTaGFwZSB8fCAhdGhpcy5yZXNpemVTaGFwZUlkKSByZXR1cm47XG4gICAgICBjb25zdCBzID0gdGhpcy5zaGFwZVN0YW1wcy5maW5kKHggPT4geC5pZCA9PT0gdGhpcy5yZXNpemVTaGFwZUlkKTtcbiAgICAgIGlmICghcykgcmV0dXJuO1xuXG4gICAgICBjb25zdCBkeCA9ICgoZS5jbGllbnRYIC0gc3RhcnRYKSAvIGNhbnZhc1JlY3Qud2lkdGgpICogMTAwO1xuICAgICAgY29uc3QgZHkgPSAoKGUuY2xpZW50WSAtIHN0YXJ0WSkgLyBjYW52YXNSZWN0LmhlaWdodCkgKiAxMDA7XG5cbiAgICAgIGxldCBudyA9IHN0YXJ0VywgbmggPSBzdGFydEgsIG54ID0gc3RhcnRTWCwgbnkgPSBzdGFydFNZO1xuICAgICAgaWYgKGRpcmVjdGlvbi5pbmNsdWRlcygnZScpKSBudyA9IE1hdGgubWF4KDIsIHN0YXJ0VyArIGR4KTtcbiAgICAgIGlmIChkaXJlY3Rpb24uaW5jbHVkZXMoJ3cnKSkgeyBudyA9IE1hdGgubWF4KDIsIHN0YXJ0VyAtIGR4KTsgbnggPSBzdGFydFNYICsgKHN0YXJ0VyAtIG53KTsgfVxuICAgICAgaWYgKGRpcmVjdGlvbi5pbmNsdWRlcygncycpKSBuaCA9IE1hdGgubWF4KDIsIHN0YXJ0SCArIGR5KTtcbiAgICAgIGlmIChkaXJlY3Rpb24uaW5jbHVkZXMoJ24nKSkgeyBuaCA9IE1hdGgubWF4KDIsIHN0YXJ0SCAtIGR5KTsgbnkgPSBzdGFydFNZICsgKHN0YXJ0SCAtIG5oKTsgfVxuXG4gICAgICBzLndpZHRoID0gbnc7XG4gICAgICBzLmhlaWdodCA9IG5oO1xuICAgICAgcy54ID0gbng7XG4gICAgICBzLnkgPSBueTtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgdXAgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzUmVzaXppbmdTaGFwZSA9IGZhbHNlO1xuICAgICAgdGhpcy5yZXNpemVTaGFwZUlkID0gbnVsbDtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG1vdmUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgbW92ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIGFycm93IHJvdGF0aW9uIGFuZ2xlIGluIGRlZ3JlZXMg4oCUIHVzZWQgaW4gU1ZHIHRlbXBsYXRlIHRvIGF2b2lkIE1hdGggaW4gdGVtcGxhdGUgKi9cbiAgZ2V0QXJyb3dBbmdsZURlZyhzczogYW55KTogbnVtYmVyIHtcbiAgICByZXR1cm4gKDE4MCAvIE1hdGguUEkpICogTWF0aC5hdGFuMihcbiAgICAgIHNzLmVuZEZyYWNZIC0gc3Muc3RhcnRGcmFjWSxcbiAgICAgIHNzLmVuZEZyYWNYIC0gc3Muc3RhcnRGcmFjWFxuICAgICk7XG4gIH1cblxuXG5cbiAgb25DYW52YXNQb2ludGVyRG93bihlOiBQb2ludGVyRXZlbnQsIHA6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIFByZXZlbnQgZGVmYXVsdCB0b3VjaCBiZWhhdmlvciAoc2Nyb2xsLCB6b29tKSB3aGVuIGFueSB0b29sIGlzIGFjdGl2ZVxuICAgIGlmICh0aGlzLnRvb2xNb2RlICE9PSAnbm9uZScpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICAvLyBGaW5hbGl6ZSBwcmV2aW91cyBzdHJva2UgaWYgaXQgZXhpc3RzXG4gICAgaWYgKHRoaXMuYWN0aXZlU3Ryb2tlIHx8IHRoaXMuYWN0aXZlU2hhcGUpIHtcbiAgICAgIHRoaXMuZmluYWxpemVBY3RpdmVTdHJva2UoKTtcbiAgICB9XG5cbiAgICAvLyBpUGFkIFBhbG0gUmVqZWN0aW9uIC8gTXVsdGktdG91Y2ggaGFuZGxpbmdcbiAgICBpZiAodGhpcy5hY3RpdmVQb2ludGVySWQgIT09IG51bGwpIHtcbiAgICAgIGlmIChlLnBvaW50ZXJUeXBlID09PSAncGVuJykge1xuICAgICAgICAvLyBBTFdBWVMgdHJ1c3QgYSBuZXcgcGVuIHRvdWNoLiBJZiBwb2ludGVydXAgd2FzIGRlbGF5ZWQsIGN1dCBpdCBvZmYgYW5kIHN0YXJ0IGZyZXNoLlxuICAgICAgICB0aGlzLmFjdGl2ZVN0cm9rZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYWN0aXZlU2hhcGUgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmFjdGl2ZVBvaW50ZXJUeXBlID09PSAncGVuJykge1xuICAgICAgICByZXR1cm47IC8vIFN0cm9uZ2x5IGlnbm9yZSB0b3VjaCBpZiBwZW4gaXMgY3VycmVudGx5IGFjdGl2ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVHJ1c3QgdGhlIG5ld2VzdCB0b3VjaCBpZiBubyBwZW4gaXMgaW52b2x2ZWRcbiAgICAgICAgdGhpcy5hY3RpdmVTdHJva2UgPSBudWxsO1xuICAgICAgICB0aGlzLmFjdGl2ZVNoYXBlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEZXNlbGVjdCBhbnkgYWN0aXZlIGVsZW1lbnQgd2hlbiBjbGlja2luZyBvbiB0aGUgZW1wdHkgY2FudmFzXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICBpZiAodGhpcy5hY3RpdmVUZXh0Qm94SWQgIT09IG51bGwgfHwgdGhpcy5hY3RpdmVPYmplY3RJZCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmFjdGl2ZVRleHRCb3hJZCA9IG51bGw7XG4gICAgICAgIHRoaXMuYWN0aXZlT2JqZWN0SWQgPSBudWxsO1xuICAgICAgICB0aGlzLmFjdGl2ZU9iamVjdFR5cGUgPSBudWxsO1xuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmdldEFubm90Q2FudmFzKHApO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG5cbiAgICB0aGlzLmFjdGl2ZUNhbnZhc1JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICB0aGlzLmVuc3VyZVBhZ2UocCk7XG4gICAgdGhpcy5wYWdlTm8gPSBwOyAvLyBNYXJrIHRoaXMgcGFnZSBhcyBjdXJyZW50IGZvciBtb2RlIGNvbnNpc3RlbmN5XG5cbiAgICBzd2l0Y2ggKHRoaXMudG9vbE1vZGUpIHtcbiAgICAgIGNhc2UgJ2RyYXcnOlxuICAgICAgY2FzZSAnaGlnaGxpZ2h0JzpcbiAgICAgIGNhc2UgJ3NoYXBlJzpcbiAgICAgICAgY2FudmFzLnNldFBvaW50ZXJDYXB0dXJlKGUucG9pbnRlcklkKTtcbiAgICAgICAgdGhpcy5hY3RpdmVQb2ludGVySWQgPSBlLnBvaW50ZXJJZDtcbiAgICAgICAgdGhpcy5hY3RpdmVQb2ludGVyVHlwZSA9IGUucG9pbnRlclR5cGU7XG5cbiAgICAgICAgaWYgKHRoaXMudG9vbE1vZGUgPT09ICdkcmF3JyB8fCB0aGlzLnRvb2xNb2RlID09PSAnaGlnaGxpZ2h0Jykge1xuICAgICAgICAgIGNvbnN0IGlzSGlnaGxpZ2h0ID0gdGhpcy50b29sTW9kZSA9PT0gJ2hpZ2hsaWdodCc7XG4gICAgICAgICAgdGhpcy5hY3RpdmVTdHJva2UgPSB7XG4gICAgICAgICAgICBpZDogJ3NfJyArIERhdGUubm93KCkgKyAnXycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDE2KS5zbGljZSgyKSxcbiAgICAgICAgICAgIGNvbG9yOiBpc0hpZ2hsaWdodCA/IHRoaXMuaGlnaGxpZ2h0Q29sb3IgOiB0aGlzLmJydXNoQ29sb3IsXG4gICAgICAgICAgICBzaXplOiBpc0hpZ2hsaWdodCA/IHRoaXMuaGlnaGxpZ2h0U2l6ZSA6IHRoaXMuYnJ1c2hTaXplLFxuICAgICAgICAgICAgcG9pbnRzOiBbdGhpcy5nZXROb3JtUG9zKGUsIHApXSxcbiAgICAgICAgICAgIGlzSGlnaGxpZ2h0XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnRvb2xNb2RlID09PSAnc2hhcGUnKSB7XG4gICAgICAgICAgY29uc3QgcG9zID0gdGhpcy5nZXROb3JtUG9zKGUsIHApO1xuICAgICAgICAgIHRoaXMuYWN0aXZlU2hhcGUgPSB7XG4gICAgICAgICAgICBpZDogJ3NoXycgKyBEYXRlLm5vdygpICsgJ18nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygxNikuc2xpY2UoMiksXG4gICAgICAgICAgICBwYWdlOiBwLFxuICAgICAgICAgICAgdHlwZTogdGhpcy5zaGFwZVR5cGUsXG4gICAgICAgICAgICBzdGFydFg6IHBvcy54LFxuICAgICAgICAgICAgc3RhcnRZOiBwb3MueSxcbiAgICAgICAgICAgIGVuZFg6IHBvcy54LFxuICAgICAgICAgICAgZW5kWTogcG9zLnksXG4gICAgICAgICAgICBjb2xvcjogdGhpcy5zaGFwZU5vU3Ryb2tlID8gJ3JnYmEoMCwwLDAsMCknIDogdGhpcy5zaGFwZVN0cm9rZUNvbG9yLFxuICAgICAgICAgICAgc2l6ZTogdGhpcy5zaGFwZU5vU3Ryb2tlID8gMCA6IHRoaXMuc2hhcGVTdHJva2VTaXplLFxuICAgICAgICAgICAgZmlsbENvbG9yOiB0aGlzLnNoYXBlRmlsbEVuYWJsZWQgPyB0aGlzLnNoYXBlRmlsbENvbG9yIDogdW5kZWZpbmVkXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlZG9TdGFja1twXSA9IFtdO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnZXJhc2VyJzpcbiAgICAgICAgdGhpcy5lcmFzZUF0UG9pbnQoZSwgcCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdkYXRlJzoge1xuICAgICAgICBjb25zdCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBtb3VzZVggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgIGNvbnN0IG1vdXNlWSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IGRheSA9IFN0cmluZyhub3cuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICBjb25zdCBtb250aCA9IFN0cmluZyhub3cuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICAgIGNvbnN0IHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgY29uc3QgdGhhaVllYXIgPSB5ZWFyICsgNTQzO1xuICAgICAgICBjb25zdCBkYXRlVGV4dCA9IGAke2RheX0vJHttb250aH0vJHt0aGFpWWVhcn1gO1xuXG4gICAgICAgIC8vIE5vcm1hbGl6ZSBtb3VzZSB4L3kgdG8gMC4uMTAwXG4gICAgICAgIGNvbnN0IHhOb3JtYWxpemVkID0gKG1vdXNlWCAvIHJlY3Qud2lkdGgpICogMTAwO1xuICAgICAgICBjb25zdCB5Tm9ybWFsaXplZCA9IChtb3VzZVkgLyByZWN0LmhlaWdodCkgKiAxMDA7XG5cbiAgICAgICAgdGhpcy5kYXRlU3RhbXBzLnB1c2goe1xuICAgICAgICAgIGlkOiAnZGF0ZV8nICsgRGF0ZS5ub3coKSArICdfJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMTYpLnNsaWNlKDIpLFxuICAgICAgICAgIHBhZ2U6IHAsXG4gICAgICAgICAgeDogeE5vcm1hbGl6ZWQgLSA1LFxuICAgICAgICAgIHk6IHlOb3JtYWxpemVkIC0gMSxcbiAgICAgICAgICB0ZXh0OiBkYXRlVGV4dCxcbiAgICAgICAgICBjb2xvcjogdGhpcy5kYXRlQ29sb3IsXG4gICAgICAgICAgZm9udFNpemU6IHRoaXMuZGF0ZUZvbnRTaXplXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIExvZyB0byBoaXN0b3J5XG4gICAgICAgIHRoaXMubG9nSGlzdG9yeSgnZGF0ZV9zdGFtcCcsIHsgcGFnZTogcCwgdGV4dDogZGF0ZVRleHQgfSwgcCk7XG5cbiAgICAgICAgdGhpcy50b29sTW9kZSA9ICdub25lJztcbiAgICAgICAgdGhpcy51cGRhdGVDdXJzb3IoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ21hcmsnOiB7XG4gICAgICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IG1vdXNlWCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgY29uc3QgbW91c2VZID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICAgIGNvbnN0IHNpemVQeCA9IHRoaXMubWFya1NpemU7XG4gICAgICAgIGNvbnN0IGRhdGFVcmwgPSB0aGlzLmdlbmVyYXRlTWFya0RhdGFVcmwodGhpcy5tYXJrVHlwZSwgdGhpcy5tYXJrQ29sb3IsIHNpemVQeCAqIDIpO1xuICAgICAgICBjb25zdCB4UGN0ID0gKChtb3VzZVggLSBzaXplUHggLyAyKSAvIHJlY3Qud2lkdGgpICogMTAwO1xuICAgICAgICBjb25zdCB5UGN0ID0gKChtb3VzZVkgLSBzaXplUHggLyAyKSAvIHJlY3QuaGVpZ2h0KSAqIDEwMDtcbiAgICAgICAgY29uc3Qgd1BjdCA9IChzaXplUHggLyByZWN0LndpZHRoKSAqIDEwMDtcbiAgICAgICAgY29uc3QgaFBjdCA9IChzaXplUHggLyByZWN0LmhlaWdodCkgKiAxMDA7XG4gICAgICAgIHRoaXMuaW1hZ2VTdGFtcHMucHVzaCh7XG4gICAgICAgICAgaWQ6ICdtYXJrXycgKyBEYXRlLm5vdygpICsgJ18nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygxNikuc2xpY2UoMiksXG4gICAgICAgICAgcGFnZTogcCwgeDogeFBjdCwgeTogeVBjdCwgd2lkdGg6IHdQY3QsIGhlaWdodDogaFBjdCwgZGF0YVVybCxcbiAgICAgICAgICBtYXJrVHlwZTogdGhpcy5tYXJrVHlwZSxcbiAgICAgICAgICBtYXJrQ29sb3I6IHRoaXMubWFya0NvbG9yLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sb2dIaXN0b3J5KCdpbWFnZScsIHsgdHlwZTogJ21hcmsnLCBtYXJrVHlwZTogdGhpcy5tYXJrVHlwZSB9LCBwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ2Zvcm1maWVsZCc6IHtcbiAgICAgICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgbW91c2VYID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgICBjb25zdCBtb3VzZVkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMuZm9ybUZpZWxkVHlwZTtcbiAgICAgICAgY29uc3QgZGVmYXVsdFcgPSB0eXBlID09PSAndGV4dCcgPyAyOCA6IDQuNTtcbiAgICAgICAgY29uc3QgZGVmYXVsdEggPSB0eXBlID09PSAndGV4dCcgPyA0IDogNC41O1xuICAgICAgICBjb25zdCBuZXdJZCA9ICdmZl8nICsgRGF0ZS5ub3coKSArICdfJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMTYpLnNsaWNlKDIpO1xuICAgICAgICB0aGlzLnBkZkZvcm1GaWVsZHMucHVzaCh7XG4gICAgICAgICAgaWQ6IG5ld0lkLFxuICAgICAgICAgIHBhZ2U6IHAsXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICB4OiBNYXRoLm1heCgwLCAobW91c2VYIC8gcmVjdC53aWR0aCkgKiAxMDAgLSBkZWZhdWx0VyAvIDIpLFxuICAgICAgICAgIHk6IE1hdGgubWF4KDAsIChtb3VzZVkgLyByZWN0LmhlaWdodCkgKiAxMDAgLSBkZWZhdWx0SCAvIDIpLFxuICAgICAgICAgIHdpZHRoOiBkZWZhdWx0VyxcbiAgICAgICAgICBoZWlnaHQ6IGRlZmF1bHRILFxuICAgICAgICAgIGZpZWxkTmFtZTogYCR7dHlwZX1fJHsrK3RoaXMuZm9ybUZpZWxkQ291bnRlcn1gLFxuICAgICAgICAgIHJhZGlvR3JvdXBOYW1lOiB0eXBlID09PSAncmFkaW8nID8gJ3JhZGlvR3JvdXBfMScgOiB1bmRlZmluZWQsXG4gICAgICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgICAgIGJvcmRlclZpc2libGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFjdGl2ZUZvcm1GaWVsZElkID0gbmV3SWQ7XG4gICAgICAgIHRoaXMubG9nSGlzdG9yeSgnaW1hZ2UnLCB7IHR5cGU6ICdmb3JtZmllbGQnLCBmaWVsZFR5cGU6IHR5cGUgfSwgcCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICdzaWduYXR1cmUnOlxuICAgICAgICBpZiAodGhpcy5wZW5kaW5nU2lnbmF0dXJlRGF0YVVybCkge1xuICAgICAgICAgIHRoaXMucGxhY2VTaWduYXR1cmVPblBhZ2UoZSwgcCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICB0aGlzLnBsYWNlVGV4dEJveE9uUGFnZShlLCBwKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIERvIG5vdGhpbmcgZm9yICdub25lJyBvciAnc2lnbmF0dXJlJyAoaWYgbm8gZGF0YSBVUkwpXG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIE9ubHkgcnVuIGRldGVjdENoYW5nZXMgZm9yIG1vZGVzIHRoYXQgbW9kaWZ5IHRoZSBBbmd1bGFyIHRlbXBsYXRlLlxuICAgIC8vIENhbnZhcy1vbmx5IG1vZGVzIChkcmF3L2hpZ2hsaWdodC9zaGFwZS9lcmFzZXIpIGRvbid0IG5lZWQgaXQuXG4gICAgY29uc3QgY2FudmFzT25seU1vZGUgPSB0aGlzLnRvb2xNb2RlID09PSAnZHJhdycgfHwgdGhpcy50b29sTW9kZSA9PT0gJ2hpZ2hsaWdodCdcbiAgICAgIHx8IHRoaXMudG9vbE1vZGUgPT09ICdzaGFwZScgfHwgdGhpcy50b29sTW9kZSA9PT0gJ2VyYXNlcidcbiAgICAgIHx8IHRoaXMudG9vbE1vZGUgPT09ICdtYXJrJyB8fCB0aGlzLnRvb2xNb2RlID09PSAnZm9ybWZpZWxkJztcbiAgICBpZiAoIWNhbnZhc09ubHlNb2RlKSB7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgb25DYW52YXNQb2ludGVyTW92ZShlOiBQb2ludGVyRXZlbnQsIHA6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmFjdGl2ZVBvaW50ZXJJZCAhPT0gbnVsbCAmJiBlLnBvaW50ZXJJZCAhPT0gdGhpcy5hY3RpdmVQb2ludGVySWQpIHJldHVybjtcblxuICAgIC8vIFByZXZlbnQgZGVmYXVsdCB0b3VjaCBoYW5kbGluZyBkdXJpbmcgYWN0aXZlIGRyYXdpbmdcbiAgICBpZiAodGhpcy5hY3RpdmVTdHJva2UgfHwgdGhpcy5hY3RpdmVTaGFwZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFjdGl2ZVN0cm9rZSkge1xuICAgICAgbGV0IGV2ZW50cyA9IChlIGFzIGFueSkuZ2V0Q29hbGVzY2VkRXZlbnRzID8gKGUgYXMgYW55KS5nZXRDb2FsZXNjZWRFdmVudHMoKSA6IFtlXTtcbiAgICAgIGlmICghZXZlbnRzIHx8IGV2ZW50cy5sZW5ndGggPT09IDApIGV2ZW50cyA9IFtlXTtcblxuICAgICAgY29uc3Qgc3RhcnRJZHggPSBNYXRoLm1heCgwLCB0aGlzLmFjdGl2ZVN0cm9rZS5wb2ludHMubGVuZ3RoIC0gMSk7XG4gICAgICBcbiAgICAgIGNvbnN0IGNhbnZhc1JlY3QgPSB0aGlzLmFjdGl2ZUNhbnZhc1JlY3Q7XG4gICAgICBmb3IgKGNvbnN0IGV2IG9mIGV2ZW50cykge1xuICAgICAgICBsZXQgcHQgPSB0aGlzLmdldE5vcm1Qb3MoZXYsIHApO1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVTdHJva2UucG9pbnRzLmxlbmd0aCA+IDAgJiYgY2FudmFzUmVjdCkge1xuICAgICAgICAgIGNvbnN0IGxhc3RQdCA9IHRoaXMuYWN0aXZlU3Ryb2tlLnBvaW50c1t0aGlzLmFjdGl2ZVN0cm9rZS5wb2ludHMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgLy8gU2tpcCBwaHlzaWNhbGx5IHRpbnkgc3ViLXBpeGVsIG1vdmVtZW50cyAobGVzcyB0aGFuIDEuNXB4KSB0byBkcmFzdGljYWxseSByZWR1Y2UgcmVuZGVyaW5nIG92ZXJoZWFkL2xhZ1xuICAgICAgICAgIGNvbnN0IGR4ID0gKHB0LnggLSBsYXN0UHQueCkgKiBjYW52YXNSZWN0LndpZHRoO1xuICAgICAgICAgIGNvbnN0IGR5ID0gKHB0LnkgLSBsYXN0UHQueSkgKiBjYW52YXNSZWN0LmhlaWdodDtcbiAgICAgICAgICBpZiAoZHggKiBkeCArIGR5ICogZHkgPCAyLjI1KSBjb250aW51ZTsgLy8gMS41cHggc3F1YXJlZFxuICAgICAgICAgIFxuICAgICAgICAgIC8vIEV4cG9uZW50aWFsIE1vdmluZyBBdmVyYWdlIHRvIHNtb290aCBBcHBsZSBQZW5jaWwgaGFyZHdhcmUgcHJlc3N1cmUgJiBjb29yZGluYXRlIGppdHRlclxuICAgICAgICAgIHB0LnggPSAocHQueCAqIDAuNCkgKyAobGFzdFB0LnggKiAwLjYpO1xuICAgICAgICAgIHB0LnkgPSAocHQueSAqIDAuNCkgKyAobGFzdFB0LnkgKiAwLjYpO1xuICAgICAgICAgIHB0LnAgPSAocHQucCAqIDAuMikgKyAobGFzdFB0LnAgKiAwLjgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWN0aXZlU3Ryb2tlLnBvaW50cy5wdXNoKHB0KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gSW5jcmVtZW50YWwgcmVuZGVyIGZvciB6ZXJvLWxhdGVuY3kgZHJhd2luZ1xuICAgICAgaWYgKCF0aGlzLnJlbmRlclJlcXVlc3RlZCkge1xuICAgICAgICB0aGlzLnJlbmRlclJlcXVlc3RlZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IHN0cm9rZVRvRHJhdyA9IHRoaXMuYWN0aXZlU3Ryb2tlOyAvLyBjYXB0dXJlIGxvY2FsIHJlZmVyZW5jZVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGlmIChzdHJva2VUb0RyYXcpIHtcbiAgICAgICAgICAgIGlmIChzdHJva2VUb0RyYXcuaXNIaWdobGlnaHQpIHtcbiAgICAgICAgICAgICAgLy8gSGlnaGxpZ2h0IHN0cm9rZXMgbXVzdCBiZSBmdWxseSByZWRyYXduIGVhY2ggZnJhbWUgKG5vIGluY3JlbWVudGFsIGRyYXcpXG4gICAgICAgICAgICAgIC8vIHRvIHByZXZlbnQgdGhlIGFscGhhIG9wYWNpdHkgZnJvbSBtdWx0aXBseWluZyBvbiB0b3Agb2YgaXRzZWxmIGF0IG92ZXJsYXBwaW5nIGxpbmUgam9pbnRzLlxuICAgICAgICAgICAgICB0aGlzLnJlZHJhdyhwLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZHJhd1N0cm9rZUluY3JlbWVudGFsKHAsIHN0cm9rZVRvRHJhdywgc3RhcnRJZHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlbmRlclJlcXVlc3RlZCA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5hY3RpdmVTaGFwZSkge1xuICAgICAgY29uc3QgcG9zID0gdGhpcy5nZXROb3JtUG9zKGUsIHApO1xuICAgICAgdGhpcy5hY3RpdmVTaGFwZS5lbmRYID0gcG9zLng7XG4gICAgICB0aGlzLmFjdGl2ZVNoYXBlLmVuZFkgPSBwb3MueTtcbiAgICAgIGlmICghdGhpcy5yZW5kZXJSZXF1ZXN0ZWQpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJSZXF1ZXN0ZWQgPSB0cnVlO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVkcmF3KHAsIHRydWUpO1xuICAgICAgICAgIHRoaXMucmVuZGVyUmVxdWVzdGVkID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLnRvb2xNb2RlID09PSAnZXJhc2VyJyAmJiBlLmJ1dHRvbnMgPT09IDEpIHtcbiAgICAgIHRoaXMuZXJhc2VBdFBvaW50KGUsIHApO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2FudmFzUG9pbnRlclVwKGU6IFBvaW50ZXJFdmVudCwgcDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZlUG9pbnRlcklkICE9PSBudWxsICYmIGUucG9pbnRlcklkID09PSB0aGlzLmFjdGl2ZVBvaW50ZXJJZCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5maW5hbGl6ZUFjdGl2ZVN0cm9rZSgpO1xuICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5nZXRBbm5vdENhbnZhcyhwKTtcbiAgICAgIGlmIChjYW52YXMgJiYgY2FudmFzLmhhc1BvaW50ZXJDYXB0dXJlKGUucG9pbnRlcklkKSkge1xuICAgICAgICBjYW52YXMucmVsZWFzZVBvaW50ZXJDYXB0dXJlKGUucG9pbnRlcklkKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWN0aXZlUG9pbnRlcklkID0gbnVsbDtcbiAgICAgIHRoaXMuYWN0aXZlUG9pbnRlclR5cGUgPSAnJztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBsYWNlU2lnbmF0dXJlT25QYWdlKGU6IFBvaW50ZXJFdmVudCwgcDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5nZXRBbm5vdENhbnZhcyhwKTtcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbW91c2VYID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IG1vdXNlWSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgIGNvbnN0IGRhdGFVcmwgPSB0aGlzLnBlbmRpbmdTaWduYXR1cmVEYXRhVXJsITtcblxuICAgIC8vIExvYWQgdGhlIGltYWdlIHRvIGdldCBpdHMgcmVhbCBhc3BlY3QgcmF0aW9cbiAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWcub25sb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgc2lnV2lkdGhQZXJjZW50ID0gMTU7XG4gICAgICAvLyBDYWxjdWxhdGUgaGVpZ2h0IHVzaW5nIFBERiBwYWdlIGFzcGVjdCByYXRpbyBmb3IgYWNjdXJhY3kuXG4gICAgICAvLyBJZiBub3QgYXZhaWxhYmxlIHlldCwgZmFsbCBiYWNrIHRvIGNhbnZhcyBhc3BlY3QgcmF0aW8uXG4gICAgICBjb25zdCBwZGZBc3BlY3QgPSB0aGlzLnBkZlBhZ2VBc3BlY3RzLmdldChwKTsgIC8vIHdpZHRoL2hlaWdodCBvZiBQREYgcGFnZVxuICAgICAgY29uc3QgY2FudmFzQXNwZWN0ID0gcmVjdC53aWR0aCAvIHJlY3QuaGVpZ2h0OyAgIC8vIHdpZHRoL2hlaWdodCBvZiBjYW52YXMgb24gc2NyZWVuXG4gICAgICAvLyBzaWdIZWlnaHRQZXJjZW50IG11c3QgbWF0Y2ggd2hhdCBwZGYtbGliIHdpbGwgcmVuZGVyOlxuICAgICAgLy8gSW4gcGRmLWxpYjogcHcgPSBzaWdXaWR0aFBlcmNlbnQlICogcGRmVywgcGggPSBzaWdIZWlnaHRQZXJjZW50JSAqIHBkZkhcbiAgICAgIC8vIFdlIHdhbnQgcHcvcGggPSBpbWcud2lkdGgvaW1nLmhlaWdodCAobmF0dXJhbCBhc3BlY3Qgb2Ygc2lnbmF0dXJlIGltYWdlKVxuICAgICAgLy8gPT4gc2lnSGVpZ2h0UGVyY2VudCA9IHNpZ1dpZHRoUGVyY2VudCAqIChwZGZXL3BkZkgpIC8gaW1nTmF0dXJhbEFzcGVjdFxuICAgICAgLy8gPT4gc2lnSGVpZ2h0UGVyY2VudCA9IHNpZ1dpZHRoUGVyY2VudCAqIHBkZkFzcGVjdCAvIGltZ05hdHVyYWxBc3BlY3RcbiAgICAgIGNvbnN0IGltZ05hdHVyYWxBc3BlY3QgPSBpbWcud2lkdGggLyBpbWcuaGVpZ2h0O1xuICAgICAgY29uc3Qgc2lnSGVpZ2h0UGVyY2VudCA9IHBkZkFzcGVjdFxuICAgICAgICA/IHNpZ1dpZHRoUGVyY2VudCAqIChwZGZBc3BlY3QgLyBpbWdOYXR1cmFsQXNwZWN0KVxuICAgICAgICA6IHNpZ1dpZHRoUGVyY2VudCAqIChpbWcuaGVpZ2h0IC8gaW1nLndpZHRoKSAqIGNhbnZhc0FzcGVjdDtcblxuICAgICAgY29uc3QgeCA9IChtb3VzZVggLyByZWN0LndpZHRoKSAqIDEwMCAtIChzaWdXaWR0aFBlcmNlbnQgLyAyKTtcbiAgICAgIGNvbnN0IHkgPSAobW91c2VZIC8gcmVjdC5oZWlnaHQpICogMTAwIC0gKHNpZ0hlaWdodFBlcmNlbnQgLyAyKTtcblxuICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgIGNvbnN0IHRoYWlZZWFyID0gbm93LmdldEZ1bGxZZWFyKCkgKyA1NDM7XG4gICAgICBjb25zdCBkYXRlU3RyID0gYCR7bm93LmdldERhdGUoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyl9LyR7KG5vdy5nZXRNb250aCgpICsgMSkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfS8ke3RoYWlZZWFyfWA7XG4gICAgICBjb25zdCB0aW1lU3RyID0gYCR7bm93LmdldEhvdXJzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfToke25vdy5nZXRNaW51dGVzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfToke25vdy5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfSArMDcnMDAnYDtcbiAgICAgIGNvbnN0IGRpZ2l0YWxJZCA9IHRoaXMudXNlcklkID8gYXdhaXQgdGhpcy5oYXNoVXNlcklkKHRoaXMudXNlcklkKSA6ICcnO1xuXG4gICAgICBjb25zdCBzdGFtcDogU2lnbmF0dXJlU3RhbXAgPSB7XG4gICAgICAgIGlkOiAnc2lnXycgKyBEYXRlLm5vdygpICsgJ18nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygxNikuc2xpY2UoMiksXG4gICAgICAgIHBhZ2U6IHAsXG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHksXG4gICAgICAgIHdpZHRoOiBzaWdXaWR0aFBlcmNlbnQsXG4gICAgICAgIGhlaWdodDogc2lnSGVpZ2h0UGVyY2VudCxcbiAgICAgICAgZGF0YVVybDogZGF0YVVybCxcbiAgICAgICAgZGlnaXRhbElkOiBkaWdpdGFsSWQsXG4gICAgICAgIHNpZ25EYXRlOiBkYXRlU3RyLFxuICAgICAgICBzaWduVGltZTogdGltZVN0clxuICAgICAgfTtcbiAgICAgIHRoaXMuc2lnbmF0dXJlU3RhbXBzLnB1c2goc3RhbXApO1xuXG4gICAgICAvLyBMb2cgdG8gaGlzdG9yeVxuICAgICAgdGhpcy5sb2dIaXN0b3J5KCdzaWduJywgeyBwYWdlOiBwLCB4OiBzdGFtcC54LCB5OiBzdGFtcC55LCBkaWdpdGFsSWQ6IHN0YW1wLmRpZ2l0YWxJZCB9LCBwKTtcblxuICAgICAgdGhpcy5wZW5kaW5nU2lnbmF0dXJlRGF0YVVybCA9IG51bGw7XG4gICAgICB0aGlzLnRvb2xNb2RlID0gJ25vbmUnO1xuICAgICAgdGhpcy51cGRhdGVDdXJzb3IoKTtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9O1xuICAgIGltZy5zcmMgPSBkYXRhVXJsO1xuICB9XG5cbiAgLyoqIEdlbmVyYXRlIFNIQS0yNTYgYmFzZWQgRGlnaXRhbCBJRCBmcm9tIHVzZXJJZCAqL1xuICBwcml2YXRlIGFzeW5jIGhhc2hVc2VySWQodXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG4gICAgICBjb25zdCBkYXRhID0gZW5jb2Rlci5lbmNvZGUodXNlcklkKTtcbiAgICAgIGNvbnN0IGhhc2hCdWZmZXIgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdCgnU0hBLTI1NicsIGRhdGEpO1xuICAgICAgY29uc3QgaGFzaEFycmF5ID0gQXJyYXkuZnJvbShuZXcgVWludDhBcnJheShoYXNoQnVmZmVyKSk7XG4gICAgICBjb25zdCBoYXNoSGV4ID0gaGFzaEFycmF5Lm1hcChiID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpO1xuICAgICAgLy8gVGFrZSBmaXJzdCAxMCBoZXggY2hhcnMgZm9yIGEgc2hvcnRlciBidXQgc3RpbGwgdW5pcXVlIElEXG4gICAgICByZXR1cm4gYERJRC0ke2hhc2hIZXguc3Vic3RyaW5nKDAsIDEwKS50b1VwcGVyQ2FzZSgpfWA7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gRmFsbGJhY2sgZm9yIGVudmlyb25tZW50cyB3aXRob3V0IFdlYiBDcnlwdG9cbiAgICAgIGxldCBoYXNoID0gMDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXNlcklkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNoID0gdXNlcklkLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNoO1xuICAgICAgICBoYXNoID0gaGFzaCAmIGhhc2g7XG4gICAgICB9XG4gICAgICByZXR1cm4gYERJRC0ke01hdGguYWJzKGhhc2gpLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDgsICcwJyl9YDtcbiAgICB9XG4gIH1cblxuICAvKiogTG9nIHNpZ25hdHVyZSBwbGFjZW1lbnQgdG8gZGF0YWJhc2UgZm9yIHJlZmVyZW5jZS9hdWRpdCAqL1xuICBwcml2YXRlIGxvZ1NpZ25hdHVyZVRvRGF0YWJhc2UoZGlnaXRhbElkOiBzdHJpbmcsIHNpZ25EYXRlOiBEYXRlLCBwYWdlTnVtYmVyOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudXNlcklkIHx8ICFkaWdpdGFsSWQpIHJldHVybjtcblxuICAgIGNvbnN0IGlzb0RhdGUgPSBzaWduRGF0ZS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1QnLCAnICcpLnN1YnN0cmluZygwLCAxOSk7XG5cbiAgICB0aGlzLmh0dHAucG9zdDxhbnk+KHRoaXMuc2lnbmF0dXJlc0FwaVVybCwge1xuICAgICAgYWtzaTogJ2xvZ19zaWduYXR1cmUnLFxuICAgICAgZGlnaXRhbF9pZDogZGlnaXRhbElkLFxuICAgICAgdXNlcl9pZDogdGhpcy51c2VySWQsXG4gICAgICBzaWduX2RhdGU6IGlzb0RhdGUsXG4gICAgICBkb2N1bWVudF9uYW1lOiB0aGlzLmZpbGVOYW1lIHx8ICcnLFxuICAgICAgcGFnZV9udW1iZXI6IHBhZ2VOdW1iZXIsXG4gICAgICBkZXRhaWxfaWQ6IHRoaXMuZGV0YWlsSWQgfHwgJycsXG4gICAgICBlZG9jX2lkOiB0aGlzLmVkb2NJZCB8fCAnJ1xuICAgIH0pLnN1YnNjcmliZShcbiAgICAgIChyZXMpID0+IHtcbiAgICAgICAgaWYgKHJlcz8uc3VjY2Vzcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdTaWduYXR1cmUgbG9nZ2VkOicsIGRpZ2l0YWxJZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdGYWlsZWQgdG8gbG9nIHNpZ25hdHVyZTonLCByZXM/Lm1zZyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAoZXJyKSA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBsb2dnaW5nIHNpZ25hdHVyZTonLCBlcnIpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcGxhY2VUZXh0Qm94T25QYWdlKGU6IFBvaW50ZXJFdmVudCwgcDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5nZXRBbm5vdENhbnZhcyhwKTtcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbW91c2VYID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgIGNvbnN0IG1vdXNlWSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gICAgLy8gTm9ybWFsaXplIHBvc2l0aW9uIHRvIDAuLjEwMFxuICAgIGNvbnN0IHggPSAobW91c2VYIC8gcmVjdC53aWR0aCkgKiAxMDA7XG4gICAgY29uc3QgeSA9IChtb3VzZVkgLyByZWN0LmhlaWdodCkgKiAxMDA7XG5cbiAgICAvLyBEZWZhdWx0IHNpemUgaW4gcGVyY2VudGFnZXNcbiAgICBjb25zdCB3aWR0aFBlcmNlbnQgPSA2O1xuICAgIGNvbnN0IGhlaWdodFBlcmNlbnQgPSA1OyAvLyBSZWR1Y2VkIGZyb20gMTAlXG5cbiAgICB0aGlzLnRleHRCb3hlcy5wdXNoKHtcbiAgICAgIGlkOiAndF8nICsgRGF0ZS5ub3coKSArICdfJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMTYpLnNsaWNlKDIpLFxuICAgICAgcGFnZTogcCxcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgd2lkdGg6IHdpZHRoUGVyY2VudCxcbiAgICAgIGhlaWdodDogaGVpZ2h0UGVyY2VudCxcbiAgICAgIHRleHQ6ICcnLFxuICAgICAgY29sb3I6IHRoaXMudGV4dENvbG9yLFxuICAgICAgZm9udFNpemU6IHRoaXMudGV4dEZvbnRTaXplLFxuICAgICAgYm9sZDogdHJ1ZSxcbiAgICAgIGl0YWxpYzogZmFsc2UsXG4gICAgICBhbGlnbjogJ2xlZnQnXG4gICAgfSk7XG5cbiAgICB0aGlzLmFjdGl2ZVRleHRCb3hJZCA9IHRoaXMudGV4dEJveGVzW3RoaXMudGV4dEJveGVzLmxlbmd0aCAtIDFdLmlkO1xuICAgIHRoaXMudG9vbE1vZGUgPSAnbm9uZSc7XG4gICAgdGhpcy5zeW5jVG9vbE1vZGVTdHlsZXMoKTtcbiAgICB0aGlzLnVwZGF0ZUN1cnNvcigpO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAvLyBMb2cgdG8gaGlzdG9yeVxuICAgIHRoaXMubG9nSGlzdG9yeSgndGV4dCcsIHsgcGFnZTogcCwgZm9udFNpemU6IHRoaXMudGV4dEZvbnRTaXplLCBjb2xvcjogdGhpcy50ZXh0Q29sb3IgfSwgcCk7XG5cbiAgICAvLyBBdXRvLWZvY3VzIHRoZSB0ZXh0YXJlYSB0byBzaG93IGtleWJvYXJkIGltbWVkaWF0ZWx5XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCB0ZXh0Qm94RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dC1ib3guYWN0aXZlIHRleHRhcmVhJykgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICAgIGlmICh0ZXh0Qm94RWwpIHtcbiAgICAgICAgdGV4dEJveEVsLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIC8qID09PT09PT09PT09PT09PT09IEVyYXNlciA9PT09PT09PT09PT09PT09PSAqL1xuICBjaGFuZ2VFcmFzZXJTaXplKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBuZXdTaXplID0gdGhpcy5lcmFzZXJTaXplICsgZGVsdGE7XG4gICAgaWYgKG5ld1NpemUgPj0gNSAmJiBuZXdTaXplIDw9IDIwMCkge1xuICAgICAgdGhpcy5lcmFzZXJTaXplID0gbmV3U2l6ZTtcbiAgICAgIHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlcmFzZUF0UG9pbnQoZTogUG9pbnRlckV2ZW50LCBwOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLmdldE5vcm1Qb3MoZSwgcCk7XG4gICAgXG4gICAgLy8gU2NhbGUgdGhyZXNob2xkIGJhc2VkIG9uIGVyYXNlciBzaXplLiBcbiAgICAvLyBEZWZhdWx0IHNpemUgMjAgbWF0Y2hlcyB+MC4wMiB0aHJlc2hvbGQgcm91Z2hseVxuICAgIGNvbnN0IHRocmVzaG9sZCA9ICh0aGlzLmVyYXNlclNpemUgLyAxMDAwKTsgXG5cbiAgICAvLyBDaGVjayBzdHJva2VzXG4gICAgdGhpcy5zdHJva2VzW3BdID0gdGhpcy5zdHJva2VzW3BdLmZpbHRlcihzdHJva2UgPT4ge1xuICAgICAgcmV0dXJuICFzdHJva2UucG9pbnRzLnNvbWUocHQgPT5cbiAgICAgICAgTWF0aC5hYnMocHQueCAtIHBvcy54KSA8IHRocmVzaG9sZCAmJiBNYXRoLmFicyhwdC55IC0gcG9zLnkpIDwgdGhyZXNob2xkXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgLy8gQ2hlY2sgc2hhcGVzXG4gICAgdGhpcy5zaGFwZXNbcF0gPSB0aGlzLnNoYXBlc1twXS5maWx0ZXIoc2hhcGUgPT4ge1xuICAgICAgY29uc3QgY2VudGVyWCA9IChzaGFwZS5zdGFydFggKyBzaGFwZS5lbmRYKSAvIDI7XG4gICAgICBjb25zdCBjZW50ZXJZID0gKHNoYXBlLnN0YXJ0WSArIHNoYXBlLmVuZFkpIC8gMjtcbiAgICAgIGNvbnN0IGhhbGZXID0gTWF0aC5hYnMoc2hhcGUuZW5kWCAtIHNoYXBlLnN0YXJ0WCkgLyAyO1xuICAgICAgY29uc3QgaGFsZkggPSBNYXRoLmFicyhzaGFwZS5lbmRZIC0gc2hhcGUuc3RhcnRZKSAvIDI7XG5cbiAgICAgIHJldHVybiAhKHBvcy54ID49IGNlbnRlclggLSBoYWxmVyAtIHRocmVzaG9sZCAmJlxuICAgICAgICBwb3MueCA8PSBjZW50ZXJYICsgaGFsZlcgKyB0aHJlc2hvbGQgJiZcbiAgICAgICAgcG9zLnkgPj0gY2VudGVyWSAtIGhhbGZIIC0gdGhyZXNob2xkICYmXG4gICAgICAgIHBvcy55IDw9IGNlbnRlclkgKyBoYWxmSCArIHRocmVzaG9sZCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZHJhdyhwKTtcbiAgfVxuXG5cblxuXG5cbiAgLyogPT09PT09PT09PT09PT09PT0gRHJhd2luZyA9PT09PT09PT09PT09PT09PSAqL1xuICBwcml2YXRlIGNhbGNMaW5lV2lkdGgoYmFzZTogbnVtYmVyLCBwcmVzc3VyZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAoIXByZXNzdXJlKSByZXR1cm4gYmFzZTtcbiAgICByZXR1cm4gTWF0aC5tYXgoMSwgYmFzZSAqICgwLjYgKyBwcmVzc3VyZSAqIDEuOCkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWRyYXcocDogbnVtYmVyID0gdGhpcy5wYWdlTm8sIGluY2x1ZGVBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuZ2V0QW5ub3RDYW52YXMocCk7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiB0cnVlLCBkZXN5bmNocm9uaXplZDogdHJ1ZSB9KSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY29uc3QgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcblxuICAgIGN0eC5zZXRUcmFuc2Zvcm0oZHByLCAwLCAwLCBkcHIsIDAsIDApO1xuICAgIGN0eC5saW5lSm9pbiA9ICdyb3VuZCc7XG4gICAgY3R4LmxpbmVDYXAgPSAncm91bmQnO1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoIC8gZHByLCBjYW52YXMuaGVpZ2h0IC8gZHByKTtcblxuICAgIHRoaXMuZW5zdXJlUGFnZShwKTtcblxuICAgIC8vIERyYXcgYWxsIHN0YXRpYyBhbm5vdGF0aW9ucyBmb3IgdGhpcyBzcGVjaWZpYyBwYWdlXG4gICAgZm9yIChjb25zdCBzIG9mIHRoaXMuc3Ryb2tlc1twXSkgdGhpcy5kcmF3U3Ryb2tlKGN0eCwgcCwgcyk7XG4gICAgZm9yIChjb25zdCBzaCBvZiB0aGlzLnNoYXBlc1twXSkgdGhpcy5kcmF3U2hhcGUoY3R4LCBwLCBzaCk7XG5cbiAgICAvLyBEcmF3IGFjdGl2ZSBpZiB0aGlzIGlzIHRoZSB0YXJnZXQgcGFnZVxuICAgIGlmIChpbmNsdWRlQWN0aXZlICYmIHAgPT09IHRoaXMucGFnZU5vKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmVTdHJva2UpIHRoaXMuZHJhd1N0cm9rZShjdHgsIHAsIHRoaXMuYWN0aXZlU3Ryb2tlKTtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZVNoYXBlKSB0aGlzLmRyYXdTaGFwZShjdHgsIHAsIHRoaXMuYWN0aXZlU2hhcGUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZHJhd1N0cm9rZShjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcDogbnVtYmVyLCBzOiBTdHJva2UpOiB2b2lkIHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmdldEFubm90Q2FudmFzKHApO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICBjb25zdCB3ID0gY2FudmFzLndpZHRoIC8gZHByO1xuICAgIGNvbnN0IGggPSBjYW52YXMuaGVpZ2h0IC8gZHByO1xuXG4gICAgaWYgKHMucG9pbnRzLmxlbmd0aCA8IDIpIHJldHVybjtcblxuICAgIGlmIChzLmlzSGlnaGxpZ2h0KSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMC40O1xuICAgICAgLy8gSGlnaGxpZ2h0ZXJzIG11bHRpcGx5IGFnYWluc3QgdGhlIGJhY2tncm91bmQgdG8gZmVlbCBsaWtlIHJlYWwgbWFya2Vyc1xuICAgICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdtdWx0aXBseSc7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzLmNvbG9yO1xuICAgICAgY3R4LmxpbmVDYXAgPSAncm91bmQnO1xuICAgICAgY3R4LmxpbmVKb2luID0gJ3JvdW5kJztcbiAgICAgIGN0eC5saW5lV2lkdGggPSBzLnNpemU7XG4gICAgICBcbiAgICAgIC8vIERyYXcgYXMgYSBzaW5nbGUgY29udGludW91cyBwYXRoIHdpdGhvdXQgbXVsdGlwbGUgYmVnaW5QYXRoKCkgY2FsbHNcbiAgICAgIC8vIHRvIGVuc3VyZSBvdmVybGFwcGluZyBqb2ludHMgZG8gbm90IGFtcGxpZnkgdGhlIGFscGhhIHRyYW5zcGFyZW5jeS5cbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcy5wb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgcHQgPSBzLnBvaW50c1tpXTtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICBjdHgubW92ZVRvKHB0LnggKiB3LCBwdC55ICogaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3R4LmxpbmVUbyhwdC54ICogdywgcHQueSAqIGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGN0eC5zdHJva2VTdHlsZSA9IHMuY29sb3I7XG4gICAgY3R4LmxpbmVDYXAgPSAncm91bmQnO1xuICAgIGN0eC5saW5lSm9pbiA9ICdyb3VuZCc7XG5cbiAgICAvLyBUbyBzdXBwb3J0IHByZXNzdXJlLXNlbnNpdGl2ZSB3aWR0aCBBTkQgYnV0dGVyLXNtb290aCBjdXJ2ZXMsXG4gICAgLy8gd2UgdXNlIHNlZ21lbnRlZCBxdWFkcmF0aWMgYmV6aWVyIGN1cnZlcyBwYXNzaW5nIHRocm91Z2ggbWlkcG9pbnRzXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzLnBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBwcmV2UHJldiA9IGkgPiAxID8gcy5wb2ludHNbaSAtIDJdIDogcy5wb2ludHNbaSAtIDFdO1xuICAgICAgICBjb25zdCBwcmV2ID0gcy5wb2ludHNbaSAtIDFdO1xuICAgICAgICBjb25zdCBjdXJyID0gcy5wb2ludHNbaV07XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzdGFydFggPSAocHJldlByZXYueCArIHByZXYueCkgLyAyICogdztcbiAgICAgICAgY29uc3Qgc3RhcnRZID0gKHByZXZQcmV2LnkgKyBwcmV2LnkpIC8gMiAqIGg7XG4gICAgICAgIGNvbnN0IGVuZFggPSAocHJldi54ICsgY3Vyci54KSAvIDIgKiB3O1xuICAgICAgICBjb25zdCBlbmRZID0gKHByZXYueSArIGN1cnIueSkgLyAyICogaDtcbiAgICAgICAgXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmNhbGNMaW5lV2lkdGgocy5zaXplLCBjdXJyLnApO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGlmIChpID09PSAxKSB7XG4gICAgICAgICAgIGN0eC5tb3ZlVG8ocHJldi54ICogdywgcHJldi55ICogaCk7XG4gICAgICAgICAgIGN0eC5saW5lVG8oZW5kWCwgZW5kWSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gcy5wb2ludHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICBjdHgubW92ZVRvKHN0YXJ0WCwgc3RhcnRZKTtcbiAgICAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8ocHJldi54ICogdywgcHJldi55ICogaCwgY3Vyci54ICogdywgY3Vyci55ICogaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgIGN0eC5tb3ZlVG8oc3RhcnRYLCBzdGFydFkpO1xuICAgICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhwcmV2LnggKiB3LCBwcmV2LnkgKiBoLCBlbmRYLCBlbmRZKTtcbiAgICAgICAgfVxuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkcmF3U3Ryb2tlSW5jcmVtZW50YWwocDogbnVtYmVyLCBzOiBTdHJva2UsIHN0YXJ0SWR4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmdldEFubm90Q2FudmFzKHApO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogdHJ1ZSwgZGVzeW5jaHJvbml6ZWQ6IHRydWUgfSkgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIGNvbnN0IGRwciA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgY29uc3QgdyA9IGNhbnZhcy53aWR0aCAvIGRwcjtcbiAgICBjb25zdCBoID0gY2FudmFzLmhlaWdodCAvIGRwcjtcblxuICAgIGN0eC5zZXRUcmFuc2Zvcm0oZHByLCAwLCAwLCBkcHIsIDAsIDApO1xuXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gcy5jb2xvcjtcbiAgICBjdHgubGluZUNhcCA9ICdyb3VuZCc7XG4gICAgY3R4LmxpbmVKb2luID0gJ3JvdW5kJztcblxuICAgIGNvbnN0IHJlbmRlclN0YXJ0ID0gTWF0aC5tYXgoMSwgc3RhcnRJZHgpO1xuICAgIGZvciAobGV0IGkgPSByZW5kZXJTdGFydDsgaSA8IHMucG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHByZXZQcmV2ID0gaSA+IDEgPyBzLnBvaW50c1tpIC0gMl0gOiBzLnBvaW50c1tpIC0gMV07XG4gICAgICAgIGNvbnN0IHByZXYgPSBzLnBvaW50c1tpIC0gMV07XG4gICAgICAgIGNvbnN0IGN1cnIgPSBzLnBvaW50c1tpXTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHN0YXJ0WCA9IChwcmV2UHJldi54ICsgcHJldi54KSAvIDIgKiB3O1xuICAgICAgICBjb25zdCBzdGFydFkgPSAocHJldlByZXYueSArIHByZXYueSkgLyAyICogaDtcbiAgICAgICAgY29uc3QgZW5kWCA9IChwcmV2LnggKyBjdXJyLngpIC8gMiAqIHc7XG4gICAgICAgIGNvbnN0IGVuZFkgPSAocHJldi55ICsgY3Vyci55KSAvIDIgKiBoO1xuICAgICAgICBcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMuY2FsY0xpbmVXaWR0aChzLnNpemUsIGN1cnIucCk7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICAgY3R4Lm1vdmVUbyhwcmV2LnggKiB3LCBwcmV2LnkgKiBoKTtcbiAgICAgICAgICAgY3R4LmxpbmVUbyhlbmRYLCBlbmRZKTtcbiAgICAgICAgfSBlbHNlIGlmIChpID09PSBzLnBvaW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgIGN0eC5tb3ZlVG8oc3RhcnRYLCBzdGFydFkpO1xuICAgICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhwcmV2LnggKiB3LCBwcmV2LnkgKiBoLCBjdXJyLnggKiB3LCBjdXJyLnkgKiBoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgY3R4Lm1vdmVUbyhzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHByZXYueCAqIHcsIHByZXYueSAqIGgsIGVuZFgsIGVuZFkpO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRyYXdTaGFwZShjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcDogbnVtYmVyLCBzaDogU2hhcGUpOiB2b2lkIHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmdldEFubm90Q2FudmFzKHApO1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICBjb25zdCB3ID0gY2FudmFzLndpZHRoIC8gZHByO1xuICAgIGNvbnN0IGggPSBjYW52YXMuaGVpZ2h0IC8gZHByO1xuXG4gICAgY29uc3QgeDEgPSBzaC5zdGFydFggKiB3O1xuICAgIGNvbnN0IHkxID0gc2guc3RhcnRZICogaDtcbiAgICBjb25zdCB4MiA9IHNoLmVuZFggKiB3O1xuICAgIGNvbnN0IHkyID0gc2guZW5kWSAqIGg7XG5cbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBzaC5jb2xvcjtcbiAgICBjdHgubGluZVdpZHRoID0gc2guc2l6ZTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICBzd2l0Y2ggKHNoLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3JlY3QnOlxuICAgICAgICBjdHgucmVjdCh4MSwgeTEsIHgyIC0geDEsIHkyIC0geTEpO1xuICAgICAgICBpZiAoc2guZmlsbENvbG9yKSB7IGN0eC5maWxsU3R5bGUgPSBzaC5maWxsQ29sb3I7IGN0eC5maWxsKCk7IH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjaXJjbGUnOiB7XG4gICAgICAgIGNvbnN0IGN4ID0gKHgxICsgeDIpIC8gMjtcbiAgICAgICAgY29uc3QgY3kgPSAoeTEgKyB5MikgLyAyO1xuICAgICAgICBjb25zdCByeCA9IE1hdGguYWJzKHgyIC0geDEpIC8gMjtcbiAgICAgICAgY29uc3QgcnkgPSBNYXRoLmFicyh5MiAtIHkxKSAvIDI7XG4gICAgICAgIGN0eC5lbGxpcHNlKGN4LCBjeSwgcngsIHJ5LCAwLCAwLCBNYXRoLlBJICogMik7XG4gICAgICAgIGlmIChzaC5maWxsQ29sb3IpIHsgY3R4LmZpbGxTdHlsZSA9IHNoLmZpbGxDb2xvcjsgY3R4LmZpbGwoKTsgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2xpbmUnOlxuICAgICAgICBjdHgubW92ZVRvKHgxLCB5MSk7XG4gICAgICAgIGN0eC5saW5lVG8oeDIsIHkyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcnJvdyc6IHtcbiAgICAgICAgY3R4Lm1vdmVUbyh4MSwgeTEpO1xuICAgICAgICBjdHgubGluZVRvKHgyLCB5Mik7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLmF0YW4yKHkyIC0geTEsIHgyIC0geDEpO1xuICAgICAgICBjb25zdCBoZWFkTGVuID0gMTU7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbyh4MiwgeTIpO1xuICAgICAgICBjdHgubGluZVRvKHgyIC0gaGVhZExlbiAqIE1hdGguY29zKGFuZ2xlIC0gTWF0aC5QSSAvIDYpLCB5MiAtIGhlYWRMZW4gKiBNYXRoLnNpbihhbmdsZSAtIE1hdGguUEkgLyA2KSk7XG4gICAgICAgIGN0eC5tb3ZlVG8oeDIsIHkyKTtcbiAgICAgICAgY3R4LmxpbmVUbyh4MiAtIGhlYWRMZW4gKiBNYXRoLmNvcyhhbmdsZSArIE1hdGguUEkgLyA2KSwgeTIgLSBoZWFkTGVuICogTWF0aC5zaW4oYW5nbGUgKyBNYXRoLlBJIC8gNikpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgY3R4LnN0cm9rZSgpO1xuICB9XG5cbiAgLyogPT09PT09PT09PT09PT09PT0gVW5kby9SZWRvIHBlciBwYWdlID09PT09PT09PT09PT09PT09ICovXG4gIGNhblVuZG8oKTogYm9vbGVhbiB7XG4gICAgdGhpcy5lbnN1cmVQYWdlKHRoaXMucGFnZU5vKTtcbiAgICByZXR1cm4gdGhpcy5zdHJva2VzW3RoaXMucGFnZU5vXS5sZW5ndGggPiAwIHx8IHRoaXMuc2hhcGVzW3RoaXMucGFnZU5vXS5sZW5ndGggPiAwO1xuICB9XG5cbiAgY2FuUmVkbygpOiBib29sZWFuIHtcbiAgICB0aGlzLmVuc3VyZVBhZ2UodGhpcy5wYWdlTm8pO1xuICAgIHJldHVybiB0aGlzLnJlZG9TdGFja1t0aGlzLnBhZ2VOb10ubGVuZ3RoID4gMDtcbiAgfVxuXG4gIHVuZG8oKTogdm9pZCB7XG4gICAgdGhpcy5lbnN1cmVQYWdlKHRoaXMucGFnZU5vKTtcbiAgICBsZXQgaXRlbTogU3Ryb2tlIHwgU2hhcGUgfCB1bmRlZmluZWQgPSB0aGlzLnN0cm9rZXNbdGhpcy5wYWdlTm9dLnBvcCgpO1xuICAgIGlmICghaXRlbSkgaXRlbSA9IHRoaXMuc2hhcGVzW3RoaXMucGFnZU5vXS5wb3AoKTtcbiAgICBpZiAoIWl0ZW0pIHJldHVybjtcblxuICAgIHRoaXMucmVkb1N0YWNrW3RoaXMucGFnZU5vXS5wdXNoKGl0ZW0pO1xuICAgIHRoaXMucmVkcmF3KHRoaXMucGFnZU5vKTtcbiAgfVxuXG4gIHJlZG8oKTogdm9pZCB7XG4gICAgdGhpcy5lbnN1cmVQYWdlKHRoaXMucGFnZU5vKTtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5yZWRvU3RhY2tbdGhpcy5wYWdlTm9dLnBvcCgpO1xuICAgIGlmICghaXRlbSkgcmV0dXJuO1xuXG4gICAgaWYgKCdwb2ludHMnIGluIGl0ZW0pIHRoaXMuc3Ryb2tlc1t0aGlzLnBhZ2VOb10ucHVzaChpdGVtIGFzIFN0cm9rZSk7XG4gICAgZWxzZSB0aGlzLnNoYXBlc1t0aGlzLnBhZ2VOb10ucHVzaChpdGVtIGFzIFNoYXBlKTtcbiAgICB0aGlzLnJlZHJhdyh0aGlzLnBhZ2VObyk7XG4gIH1cblxuICBjbGVhckFubm90YXRpb25zKCk6IHZvaWQge1xuICAgIHRoaXMuZW5zdXJlUGFnZSh0aGlzLnBhZ2VObyk7XG4gICAgdGhpcy5zdHJva2VzW3RoaXMucGFnZU5vXSA9IFtdO1xuICAgIHRoaXMuc2hhcGVzW3RoaXMucGFnZU5vXSA9IFtdO1xuICAgIHRoaXMucmVkb1N0YWNrW3RoaXMucGFnZU5vXSA9IFtdO1xuICAgIHRoaXMudGV4dEJveGVzID0gdGhpcy50ZXh0Qm94ZXMuZmlsdGVyKHQgPT4gdC5wYWdlICE9PSB0aGlzLnBhZ2VObyk7XG4gICAgdGhpcy5pbWFnZVN0YW1wcyA9IHRoaXMuaW1hZ2VTdGFtcHMuZmlsdGVyKGkgPT4gaS5wYWdlICE9PSB0aGlzLnBhZ2VObyk7XG4gICAgdGhpcy5zaWduYXR1cmVTdGFtcHMgPSB0aGlzLnNpZ25hdHVyZVN0YW1wcy5maWx0ZXIocyA9PiBzLnBhZ2UgIT09IHRoaXMucGFnZU5vKTtcbiAgICB0aGlzLmRhdGVTdGFtcHMgPSB0aGlzLmRhdGVTdGFtcHMuZmlsdGVyKGQgPT4gZC5wYWdlICE9PSB0aGlzLnBhZ2VObyk7XG4gICAgdGhpcy5yZWRyYXcodGhpcy5wYWdlTm8pO1xuICB9XG5cblxuXG4gIC8qID09PT09PT09PT09PT09PT09IFRleHRCb3ggT3BlcmF0aW9ucyA9PT09PT09PT09PT09PT09PSAqL1xuICBzZWxlY3RUZXh0Qm94KGlkOiBzdHJpbmcsIGV2OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLmFjdGl2ZVRleHRCb3hJZCA9IGlkO1xuICB9XG5cbiAgb25UZXh0Qm94UG9pbnRlckRvd24oZXY6IFBvaW50ZXJFdmVudCwgaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMuYWN0aXZlVGV4dEJveElkID0gaWQ7XG4gICAgdGhpcy5zdGFydERyYWcoZXYsIGlkKTtcbiAgfVxuXG4gIGNsZWFyVGV4dFNlbGVjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2ZVRleHRCb3hJZCA9IG51bGw7XG4gIH1cblxuICBwcml2YXRlIGdldERyYWdDYW52YXNSZWN0KHA6IG51bWJlcik6IERPTVJlY3Qge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuZ2V0QW5ub3RDYW52YXMocCk7XG4gICAgcmV0dXJuIGNhbnZhcyA/IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSA6IG5ldyBET01SZWN0KCk7XG4gIH1cblxuICBzdGFydERyYWcoZTogUG9pbnRlckV2ZW50LCB0ZXh0Qm94SWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRvb2xNb2RlICE9PSAnbm9uZScpIHJldHVybjtcbiAgICB0aGlzLmNsb3NlQ29udGV4dE1lbnUoKTtcbiAgICBcbiAgICAvLyBTZXQgYm90aCBhY3RpdmVUZXh0Qm94SWQgKGZvciBVSSkgYW5kIGdsb2JhbCBhY3RpdmUgb2JqZWN0IChmb3IgRGVsZXRlIGtleSlcbiAgICB0aGlzLmFjdGl2ZVRleHRCb3hJZCA9IHRleHRCb3hJZDtcbiAgICB0aGlzLmFjdGl2ZU9iamVjdElkID0gdGV4dEJveElkO1xuICAgIHRoaXMuYWN0aXZlT2JqZWN0VHlwZSA9ICd0ZXh0JztcblxuICAgIGNvbnN0IHRiID0gdGhpcy50ZXh0Qm94ZXMuZmluZCh0ID0+IHQuaWQgPT09IHRleHRCb3hJZCk7XG4gICAgaWYgKCF0YikgcmV0dXJuO1xuXG4gICAgLy8gU3luYyBVSSBzZXR0aW5ncyB3aXRoIHRoZSBzZWxlY3RlZCB0ZXh0IGJveFxuICAgIHRoaXMudGV4dENvbG9yID0gdGIuY29sb3IgfHwgdGhpcy50ZXh0Q29sb3I7XG4gICAgdGhpcy50ZXh0Rm9udFNpemUgPSB0Yi5mb250U2l6ZSB8fCB0aGlzLnRleHRGb250U2l6ZTtcblxuICAgIC8vIElmIHVzZXIgdGFwcGVkIGRpcmVjdGx5IG9uIHRleHRhcmVhIHRvIHR5cGUsIGRvIG5vdCBpbml0aWF0ZSBkcmFnZ2luZyBvciBibHVycmluZy5cbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAodGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RleHRhcmVhJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRleHRCb3hFbCA9IGUuY3VycmVudFRhcmdldCBhcyBIVE1MRWxlbWVudDtcblxuICAgIC8vIExvY2sgdG91Y2gtYWN0aW9uIGR1cmluZyBkcmFnIHRvIHByZXZlbnQgaVBhZCBzY3JvbGxcbiAgICB0ZXh0Qm94RWwuc3R5bGUudG91Y2hBY3Rpb24gPSAnbm9uZSc7XG5cbiAgICAvLyBEaXNhYmxlIHRleHRhcmVhIHRvIHByZXZlbnQgaVBhZE9TIFNjcmliYmxlIGR1cmluZyBkcmFnXG4gICAgY29uc3QgdGV4dGFyZWFFbCA9IHRleHRCb3hFbD8ucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAodGV4dGFyZWFFbCkge1xuICAgICAgdGV4dGFyZWFFbC5ibHVyKCk7XG4gICAgICB0ZXh0YXJlYUVsLnNldEF0dHJpYnV0ZSgncmVhZG9ubHknLCAndHJ1ZScpO1xuICAgICAgdGV4dGFyZWFFbC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIH1cblxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgdGhpcy5kcmFnVGV4dEJveElkID0gdGV4dEJveElkO1xuICAgIGNvbnN0IGNhbnZhc1JlY3QgPSB0aGlzLmdldERyYWdDYW52YXNSZWN0KHRiLnBhZ2UpO1xuXG4gICAgLy8gQ29udmVydCBjdXJyZW50ICUgcG9zaXRpb24gdG8gcGl4ZWxzIGZvciBpbml0aWFsIG9mZnNldCBjYWxjdWxhdGlvblxuICAgIGNvbnN0IHN0YXJ0WHB4ID0gKHRiLnggLyAxMDApICogY2FudmFzUmVjdC53aWR0aDtcbiAgICBjb25zdCBzdGFydFlweCA9ICh0Yi55IC8gMTAwKSAqIGNhbnZhc1JlY3QuaGVpZ2h0O1xuXG4gICAgdGhpcy5kcmFnT2Zmc2V0WCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdCAtIHN0YXJ0WHB4O1xuICAgIHRoaXMuZHJhZ09mZnNldFkgPSBlLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcCAtIHN0YXJ0WXB4O1xuXG4gICAgY29uc3QgbW92ZSA9IChldjogUG9pbnRlckV2ZW50KSA9PiB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKCF0aGlzLmlzRHJhZ2dpbmcgfHwgIXRoaXMuZHJhZ1RleHRCb3hJZCkgcmV0dXJuO1xuICAgICAgY29uc3QgdCA9IHRoaXMudGV4dEJveGVzLmZpbmQoeCA9PiB4LmlkID09PSB0aGlzLmRyYWdUZXh0Qm94SWQpO1xuICAgICAgaWYgKCF0KSByZXR1cm47XG5cbiAgICAgIGNvbnN0IG1vdXNlWHB4ID0gZXYuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdCAtIHRoaXMuZHJhZ09mZnNldFg7XG4gICAgICBjb25zdCBtb3VzZVlweCA9IGV2LmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcCAtIHRoaXMuZHJhZ09mZnNldFk7XG5cbiAgICAgIC8vIEJhY2sgdG8gbm9ybWFsaXplZFxuICAgICAgdC54ID0gKG1vdXNlWHB4IC8gY2FudmFzUmVjdC53aWR0aCkgKiAxMDA7XG4gICAgICB0LnkgPSAobW91c2VZcHggLyBjYW52YXNSZWN0LmhlaWdodCkgKiAxMDA7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHVwID0gKCkgPT4ge1xuICAgICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmRyYWdUZXh0Qm94SWQgPSBudWxsO1xuICAgICAgLy8gUmVzdG9yZSB0b3VjaC1hY3Rpb24gc28gaVBhZCBjYW4gc2Nyb2xsIFBERiBhZ2FpblxuICAgICAgdGV4dEJveEVsLnN0eWxlLnRvdWNoQWN0aW9uID0gJyc7XG4gICAgICAvLyBSZXN0b3JlIHRleHRhcmVhIGFmdGVyIGRyYWdcbiAgICAgIGlmICh0ZXh0YXJlYUVsKSB7XG4gICAgICAgIHRleHRhcmVhRWwucmVtb3ZlQXR0cmlidXRlKCdyZWFkb25seScpO1xuICAgICAgICB0ZXh0YXJlYUVsLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnJztcbiAgICAgIH1cbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG1vdmUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgbW92ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgfVxuXG4gIHN0YXJ0VGV4dEJveERyYWcoZXY6IFBvaW50ZXJFdmVudCwgdGV4dEJveElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IHRiID0gdGhpcy50ZXh0Qm94ZXMuZmluZCh0ID0+IHQuaWQgPT09IHRleHRCb3hJZCk7XG4gICAgaWYgKCF0YikgcmV0dXJuO1xuICAgIHRoaXMuYWN0aXZlVGV4dEJveElkID0gdGV4dEJveElkO1xuICAgIHRoaXMuc3RhcnREcmFnKGV2LCB0ZXh0Qm94SWQpO1xuICB9XG5cbiAgb25UZXh0Qm94SW5wdXQoZXZlbnQ6IEV2ZW50LCB0YjogVGV4dEJveCk6IHZvaWQge1xuICAgIGNvbnN0IHRleHRhcmVhID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG5cbiAgICBjb25zdCBsaW5lcyA9IHRiLnRleHQuc3BsaXQoJ1xcbicpO1xuICAgIGxldCBtYXhMaW5lV2lkdGhQeCA9IDMwO1xuXG4gICAgY29uc3QgbWVhc3VyZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbWVhc3VyZVNwYW4uc3R5bGUuY3NzVGV4dCA9IGBwb3NpdGlvbjogYWJzb2x1dGU7IHZpc2liaWxpdHk6IGhpZGRlbjsgd2hpdGUtc3BhY2U6IHByZTsgZm9udC1mYW1pbHk6ICdUSFNhcmFidW5OZXcnLCBzYW5zLXNlcmlmOyBmb250LXNpemU6ICR7dGIuZm9udFNpemUgKiB0aGlzLnpvb219cHg7IGZvbnQtd2VpZ2h0OiAke3RiLmJvbGQgPyAnYm9sZCcgOiAnbm9ybWFsJ307IGZvbnQtc3R5bGU6ICR7dGIuaXRhbGljID8gJ2l0YWxpYycgOiAnbm9ybWFsJ307YDtcblxuICAgIGxpbmVzLmZvckVhY2gobGluZSA9PiB7XG4gICAgICBtZWFzdXJlU3Bhbi50ZXh0Q29udGVudCA9IGxpbmUgfHwgJyAnO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtZWFzdXJlU3Bhbik7XG4gICAgICBjb25zdCBsaW5lV2lkdGggPSBtZWFzdXJlU3Bhbi5vZmZzZXRXaWR0aCArIDE4OyAvLyAxOHB4ID0gYm9yZGVyKDIpICsgY29udGFpbmVyIHBhZGRpbmcoNikgKyB0ZXh0YXJlYSBwYWRkaW5nKDYpICsgYnVmZmVyKDQpXG4gICAgICBpZiAobGluZVdpZHRoID4gbWF4TGluZVdpZHRoUHgpIG1heExpbmVXaWR0aFB4ID0gbGluZVdpZHRoO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChtZWFzdXJlU3Bhbik7XG4gICAgfSk7XG5cbiAgICBjb25zdCBjYW52YXNSZWN0ID0gdGhpcy5nZXREcmFnQ2FudmFzUmVjdCh0Yi5wYWdlKTtcbiAgICBpZiAoY2FudmFzUmVjdC53aWR0aCA+IDAgJiYgY2FudmFzUmVjdC5oZWlnaHQgPiAwKSB7XG4gICAgICAvLyBBcHBseSB3aWR0aCBmaXJzdCBzbyBET00gcmVmbGVjdHMgY29ycmVjdCB3cmFwcGluZyBiZWZvcmUgaGVpZ2h0IG1lYXN1cmVtZW50XG4gICAgICB0Yi53aWR0aCA9IE1hdGgubWluKDk1LCAobWF4TGluZVdpZHRoUHggLyBjYW52YXNSZWN0LndpZHRoKSAqIDEwMCk7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgIC8vIFJlc2V0IGhlaWdodCB0byAwIHNvIHNjcm9sbEhlaWdodCByZWZsZWN0cyBhY3R1YWwgY29udGVudCAoaW5jbHVkaW5nIGFueSBzb2Z0LXdyYXBwaW5nKVxuICAgICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzBweCc7XG4gICAgICBjb25zdCBjb250ZW50SGVpZ2h0UHggPSB0ZXh0YXJlYS5zY3JvbGxIZWlnaHQ7XG4gICAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSBjb250ZW50SGVpZ2h0UHggKyAncHgnOyAvLyBwcmV2ZW50IHNjcm9sbCBmbGlja2VyXG5cbiAgICAgIGNvbnN0IG1pbkhlaWdodFB4ID0gKHRiLmZvbnRTaXplICogMS40ICogdGhpcy56b29tKSArIDY7XG4gICAgICBjb25zdCBmaW5hbEhlaWdodFB4ID0gTWF0aC5tYXgoY29udGVudEhlaWdodFB4LCBtaW5IZWlnaHRQeCk7XG4gICAgICAvLyArNnB4IGZvciBjb250YWluZXIgdG9wK2JvdHRvbSBwYWRkaW5nICgzcHggZWFjaCBzaWRlKVxuICAgICAgdGIuaGVpZ2h0ID0gTWF0aC5taW4oOTUsICgoZmluYWxIZWlnaHRQeCArIDYpIC8gY2FudmFzUmVjdC5oZWlnaHQpICogMTAwKTtcbiAgICB9XG5cbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgLy8gQ2xlYXIgaW5saW5lIHN0eWxlIOKAlCBjb250YWluZXIgaXMgbm93IHVwZGF0ZWQsIENTUyBgaGVpZ2h0OiAxMDAlYCB0YWtlcyBvdmVyXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gIH1cblxuICBvblRleHRCb3hGb2N1cyhpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5hY3RpdmVUZXh0Qm94SWQgPSBpZDtcbiAgICB0aGlzLmFjdGl2ZU9iamVjdElkID0gaWQ7XG4gICAgdGhpcy5hY3RpdmVPYmplY3RUeXBlID0gJ3RleHQnO1xuICAgIGNvbnN0IHRiID0gdGhpcy50ZXh0Qm94ZXMuZmluZCh0ID0+IHQuaWQgPT09IGlkKTtcbiAgICBpZiAodGIpIHtcbiAgICAgIHRoaXMudGV4dENvbG9yID0gdGIuY29sb3IgfHwgdGhpcy50ZXh0Q29sb3I7XG4gICAgICB0aGlzLnRleHRGb250U2l6ZSA9IHRiLmZvbnRTaXplIHx8IHRoaXMudGV4dEZvbnRTaXplO1xuICAgIH1cbiAgfVxuXG4gIC8qID09PT09PT09PT09PT09PT09IFRleHRCb3ggUmVzaXplID09PT09PT09PT09PT09PT09ICovXG4gIHN0YXJ0UmVzaXplKGV2OiBQb2ludGVyRXZlbnQsIHRleHRCb3hJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGV2LmJ1dHRvbiA9PT0gMiB8fCBldi5jdHJsS2V5KSByZXR1cm47XG4gICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCB0YiA9IHRoaXMudGV4dEJveGVzLmZpbmQodCA9PiB0LmlkID09PSB0ZXh0Qm94SWQpO1xuICAgIGlmICghdGIpIHJldHVybjtcblxuICAgIC8vIFN5bmMgVUkgc2V0dGluZ3NcbiAgICB0aGlzLmFjdGl2ZVRleHRCb3hJZCA9IHRleHRCb3hJZDtcbiAgICB0aGlzLmFjdGl2ZU9iamVjdElkID0gdGV4dEJveElkO1xuICAgIHRoaXMuYWN0aXZlT2JqZWN0VHlwZSA9ICd0ZXh0JztcbiAgICB0aGlzLnRleHRDb2xvciA9IHRiLmNvbG9yIHx8IHRoaXMudGV4dENvbG9yO1xuICAgIHRoaXMudGV4dEZvbnRTaXplID0gdGIuZm9udFNpemUgfHwgdGhpcy50ZXh0Rm9udFNpemU7XG5cbiAgICB0aGlzLmlzUmVzaXppbmcgPSB0cnVlO1xuICAgIHRoaXMucmVzaXplVGV4dEJveElkID0gdGV4dEJveElkO1xuICAgIGNvbnN0IGNhbnZhc1JlY3QgPSB0aGlzLmdldERyYWdDYW52YXNSZWN0KHRiLnBhZ2UpO1xuICAgIGNvbnN0IHN0YXJ0WCA9IGV2LmNsaWVudFg7XG4gICAgY29uc3Qgc3RhcnRZID0gZXYuY2xpZW50WTtcbiAgICBjb25zdCBzdGFydFdfbm9ybSA9IHRiLndpZHRoO1xuICAgIGNvbnN0IHN0YXJ0SF9ub3JtID0gdGIuaGVpZ2h0O1xuXG4gICAgY29uc3QgbW92ZSA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmICghdGhpcy5pc1Jlc2l6aW5nIHx8ICF0aGlzLnJlc2l6ZVRleHRCb3hJZCkgcmV0dXJuO1xuICAgICAgY29uc3QgdCA9IHRoaXMudGV4dEJveGVzLmZpbmQoeCA9PiB4LmlkID09PSB0aGlzLnJlc2l6ZVRleHRCb3hJZCk7XG4gICAgICBpZiAoIXQpIHJldHVybjtcblxuICAgICAgY29uc3QgZGVsdGFYX3B4ID0gZS5jbGllbnRYIC0gc3RhcnRYO1xuICAgICAgY29uc3QgZGVsdGFZX3B4ID0gZS5jbGllbnRZIC0gc3RhcnRZO1xuXG4gICAgICB0LndpZHRoID0gTWF0aC5tYXgoNSwgc3RhcnRXX25vcm0gKyAoZGVsdGFYX3B4IC8gY2FudmFzUmVjdC53aWR0aCkgKiAxMDApO1xuICAgICAgdC5oZWlnaHQgPSBNYXRoLm1heCgyLCBzdGFydEhfbm9ybSArIChkZWx0YVlfcHggLyBjYW52YXNSZWN0LmhlaWdodCkgKiAxMDApO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH07XG5cbiAgICBjb25zdCB1cCA9ICgpID0+IHtcbiAgICAgIHRoaXMuaXNSZXNpemluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5yZXNpemVUZXh0Qm94SWQgPSBudWxsO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgbW92ZSk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdXApO1xuICAgIH07XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBtb3ZlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdXApO1xuICB9XG5cbiAgc3RhcnRSZXNpemVSaWdodChldjogUG9pbnRlckV2ZW50LCB0ZXh0Qm94SWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChldi5idXR0b24gPT09IDIgfHwgZXYuY3RybEtleSkgcmV0dXJuO1xuICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgdGIgPSB0aGlzLnRleHRCb3hlcy5maW5kKHQgPT4gdC5pZCA9PT0gdGV4dEJveElkKTtcbiAgICBpZiAoIXRiKSByZXR1cm47XG4gICAgdGhpcy5hY3RpdmVUZXh0Qm94SWQgPSB0ZXh0Qm94SWQ7XG4gICAgdGhpcy5hY3RpdmVPYmplY3RJZCA9IHRleHRCb3hJZDtcbiAgICB0aGlzLmFjdGl2ZU9iamVjdFR5cGUgPSAndGV4dCc7XG4gICAgY29uc3QgY2FudmFzUmVjdCA9IHRoaXMuZ2V0RHJhZ0NhbnZhc1JlY3QodGIucGFnZSk7XG4gICAgY29uc3Qgc3RhcnRYID0gZXYuY2xpZW50WDtcbiAgICBjb25zdCBzdGFydFcgPSB0Yi53aWR0aDtcbiAgICBjb25zdCBtb3ZlID0gKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgZGVsdGFYID0gKGUuY2xpZW50WCAtIHN0YXJ0WCkgLyBjYW52YXNSZWN0LndpZHRoICogMTAwO1xuICAgICAgdGIud2lkdGggPSBNYXRoLm1heCg1LCBNYXRoLm1pbig5NSAtIHRiLngsIHN0YXJ0VyArIGRlbHRhWCkpO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH07XG4gICAgY29uc3QgdXAgPSAoKSA9PiB7IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG1vdmUpOyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdXApOyB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG1vdmUpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB1cCk7XG4gIH1cblxuICBzdGFydFJlc2l6ZUxlZnQoZXY6IFBvaW50ZXJFdmVudCwgdGV4dEJveElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoZXYuYnV0dG9uID09PSAyIHx8IGV2LmN0cmxLZXkpIHJldHVybjtcbiAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHRiID0gdGhpcy50ZXh0Qm94ZXMuZmluZCh0ID0+IHQuaWQgPT09IHRleHRCb3hJZCk7XG4gICAgaWYgKCF0YikgcmV0dXJuO1xuICAgIHRoaXMuYWN0aXZlVGV4dEJveElkID0gdGV4dEJveElkO1xuICAgIHRoaXMuYWN0aXZlT2JqZWN0SWQgPSB0ZXh0Qm94SWQ7XG4gICAgdGhpcy5hY3RpdmVPYmplY3RUeXBlID0gJ3RleHQnO1xuICAgIGNvbnN0IGNhbnZhc1JlY3QgPSB0aGlzLmdldERyYWdDYW52YXNSZWN0KHRiLnBhZ2UpO1xuICAgIGNvbnN0IHN0YXJ0WCA9IGV2LmNsaWVudFg7XG4gICAgY29uc3Qgc3RhcnRUYlggPSB0Yi54O1xuICAgIGNvbnN0IHN0YXJ0VGJXID0gdGIud2lkdGg7XG4gICAgY29uc3QgbW92ZSA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IGRlbHRhWCA9IChlLmNsaWVudFggLSBzdGFydFgpIC8gY2FudmFzUmVjdC53aWR0aCAqIDEwMDtcbiAgICAgIGNvbnN0IG5ld1ggPSBNYXRoLm1heCgwLCBzdGFydFRiWCArIGRlbHRhWCk7XG4gICAgICBjb25zdCBuZXdXID0gTWF0aC5tYXgoNSwgc3RhcnRUYlcgLSBkZWx0YVgpO1xuICAgICAgaWYgKG5ld1ggKyBuZXdXIDw9IDk4KSB7IHRiLnggPSBuZXdYOyB0Yi53aWR0aCA9IG5ld1c7IH1cbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9O1xuICAgIGNvbnN0IHVwID0gKCkgPT4geyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBtb3ZlKTsgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTsgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBtb3ZlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdXApO1xuICB9XG5cbiAgcmVtb3ZlVGV4dEJveCh0ZXh0Qm94SWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMudGV4dEJveGVzID0gdGhpcy50ZXh0Qm94ZXMuZmlsdGVyKHQgPT4gdC5pZCAhPT0gdGV4dEJveElkKTtcbiAgICBpZiAodGhpcy5hY3RpdmVUZXh0Qm94SWQgPT09IHRleHRCb3hJZCkgdGhpcy5hY3RpdmVUZXh0Qm94SWQgPSBudWxsO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xhbXBPbmVUZXh0Qm94KHRiOiBUZXh0Qm94KTogdm9pZCB7XG4gICAgLy8gQm90aCB0Yi54LCB0Yi55LCB0Yi53aWR0aCwgdGIuaGVpZ2h0IGFyZSBpbiAwLTEwMCB1bml0c1xuICAgIHRiLnggPSBNYXRoLm1heCgwLCBNYXRoLm1pbih0Yi54LCAxMDAgLSB0Yi53aWR0aCkpO1xuICAgIHRiLnkgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih0Yi55LCAxMDAgLSB0Yi5oZWlnaHQpKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xhbXBUZXh0Qm94ZXNUb1ZpZXcoKTogdm9pZCB7XG4gICAgdGhpcy50ZXh0Qm94ZXMuZm9yRWFjaCh0YiA9PiB0aGlzLmNsYW1wT25lVGV4dEJveCh0YikpO1xuICB9XG5cbiAgLyogPT09PT09PT09PT09PT09PT0gSW1hZ2UgU3RhbXAgT3BlcmF0aW9ucyA9PT09PT09PT09PT09PT09PSAqL1xuICB0cmlnZ2VySW1hZ2VVcGxvYWQoKTogdm9pZCB7XG4gICAgdGhpcy5maWxlSW5wdXRSZWY/Lm5hdGl2ZUVsZW1lbnQ/LmNsaWNrKCk7XG4gIH1cblxuICBwcml2YXRlIG5vcm1hbGl6ZUltYWdlVG9QbmcoZGF0YVVybDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IGltZy5uYXR1cmFsV2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBpbWcubmF0dXJhbEhlaWdodDtcbiAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykhO1xuICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XG4gICAgICAgIHJlc29sdmUoY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJykpO1xuICAgICAgfTtcbiAgICAgIGltZy5vbmVycm9yID0gKCkgPT4gcmVzb2x2ZShkYXRhVXJsKTsgLy8gZmFsbGJhY2s6IGtlZXAgb3JpZ2luYWxcbiAgICAgIGltZy5zcmMgPSBkYXRhVXJsO1xuICAgIH0pO1xuICB9XG5cbiAgb25JbWFnZVNlbGVjdGVkKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaWYgKCFpbnB1dC5maWxlcyB8fCAhaW5wdXQuZmlsZXNbMF0pIHJldHVybjtcblxuICAgIGNvbnN0IGZpbGUgPSBpbnB1dC5maWxlc1swXTtcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgcmVhZGVyLm9ubG9hZCA9IGFzeW5jIChlKSA9PiB7XG4gICAgICBjb25zdCByYXdEYXRhVXJsID0gZS50YXJnZXQ/LnJlc3VsdCBhcyBzdHJpbmc7XG4gICAgICBjb25zdCBkYXRhVXJsID0gYXdhaXQgdGhpcy5ub3JtYWxpemVJbWFnZVRvUG5nKHJhd0RhdGFVcmwpO1xuXG4gICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGxldCB3ID0gaW1nLm5hdHVyYWxXaWR0aDtcbiAgICAgICAgbGV0IGggPSBpbWcubmF0dXJhbEhlaWdodDtcbiAgICAgICAgLy8gU2NhbGUgZGlzcGxheSBzaXplIChweCkgdG8gYXQgbW9zdCAzMCUgb2YgY2FudmFzIHdpZHRoLCBtaW4gNSVcbiAgICAgICAgY29uc3QgY2FudmFzUmVjdCA9IHRoaXMuZ2V0RHJhZ0NhbnZhc1JlY3QodGhpcy5wYWdlTm8pO1xuICAgICAgICBjb25zdCBjdyA9IGNhbnZhc1JlY3Qud2lkdGggfHwgNjAwO1xuICAgICAgICBjb25zdCBjaCA9IGNhbnZhc1JlY3QuaGVpZ2h0IHx8IDgwMDtcblxuICAgICAgICBjb25zdCBtYXhQeCA9IE1hdGgubWluKGN3ICogMC40LCBjaCAqIDAuNCk7XG4gICAgICAgIGlmICh3ID4gbWF4UHggfHwgaCA+IG1heFB4KSB7XG4gICAgICAgICAgaWYgKHcgPiBoKSB7IGggPSAoaCAvIHcpICogbWF4UHg7IHcgPSBtYXhQeDsgfVxuICAgICAgICAgIGVsc2UgICAgICAgeyB3ID0gKHcgLyBoKSAqIG1heFB4OyBoID0gbWF4UHg7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW1hZ2VTdGFtcHMucHVzaCh7XG4gICAgICAgICAgaWQ6ICdpbWdfJyArIERhdGUubm93KCkgKyAnXycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDE2KS5zbGljZSgyKSxcbiAgICAgICAgICBwYWdlOiB0aGlzLnBhZ2VObyxcbiAgICAgICAgICB4OiAoKGN3IC8gMiAtIHcgLyAyKSAvIGN3KSAqIDEwMCxcbiAgICAgICAgICB5OiAoKGNoIC8gMiAtIGggLyAyKSAvIGNoKSAqIDEwMCxcbiAgICAgICAgICB3aWR0aDogICh3IC8gY3cpICogMTAwLFxuICAgICAgICAgIGhlaWdodDogKGggLyBjaCkgKiAxMDAsXG4gICAgICAgICAgZGF0YVVybFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sb2dIaXN0b3J5KCdpbWFnZScsIHsgdHlwZTogJ3VwbG9hZCcgfSwgdGhpcy5wYWdlTm8pO1xuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9O1xuICAgICAgaW1nLnNyYyA9IGRhdGFVcmw7XG4gICAgfTtcblxuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAgIGlucHV0LnZhbHVlID0gJyc7IC8vIFJlc2V0IGZvciBzYW1lIGZpbGUgc2VsZWN0aW9uXG4gIH1cblxuICBzdGFydEltYWdlRHJhZyhlOiBQb2ludGVyRXZlbnQsIGltZ0lkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50b29sTW9kZSAhPT0gJ25vbmUnKSByZXR1cm47XG4gICAgdGhpcy5jbG9zZUNvbnRleHRNZW51KCk7XG4gICAgXG4gICAgdGhpcy5hY3RpdmVPYmplY3RJZCA9IGltZ0lkO1xuICAgIHRoaXMuYWN0aXZlT2JqZWN0VHlwZSA9ICdpbWFnZSc7XG5cbiAgICBjb25zdCBpbWcgPSB0aGlzLmltYWdlU3RhbXBzLmZpbmQoaSA9PiBpLmlkID09PSBpbWdJZCk7XG4gICAgaWYgKCFpbWcpIHJldHVybjtcblxuICAgIHRoaXMuaXNEcmFnZ2luZ0ltYWdlID0gdHJ1ZTtcbiAgICB0aGlzLmRyYWdJbWFnZUlkID0gaW1nSWQ7XG5cbiAgICBjb25zdCBjYW52YXNSZWN0ID0gdGhpcy5nZXREcmFnQ2FudmFzUmVjdChpbWcucGFnZSk7XG4gICAgY29uc3Qgc3RhcnRYcHggPSAoaW1nLnggLyAxMDApICogY2FudmFzUmVjdC53aWR0aDtcbiAgICBjb25zdCBzdGFydFlweCA9IChpbWcueSAvIDEwMCkgKiBjYW52YXNSZWN0LmhlaWdodDtcblxuICAgIHRoaXMuZHJhZ09mZnNldFggPSBlLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnQgLSBzdGFydFhweDtcbiAgICB0aGlzLmRyYWdPZmZzZXRZID0gZS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3AgLSBzdGFydFlweDtcblxuICAgIGNvbnN0IG1vdmUgPSAoZXY6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmICghdGhpcy5pc0RyYWdnaW5nSW1hZ2UgfHwgIXRoaXMuZHJhZ0ltYWdlSWQpIHJldHVybjtcbiAgICAgIGNvbnN0IGkgPSB0aGlzLmltYWdlU3RhbXBzLmZpbmQoeCA9PiB4LmlkID09PSB0aGlzLmRyYWdJbWFnZUlkKTtcbiAgICAgIGlmICghaSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBtb3VzZVhweCA9IGV2LmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnQgLSB0aGlzLmRyYWdPZmZzZXRYO1xuICAgICAgY29uc3QgbW91c2VZcHggPSBldi5jbGllbnRZIC0gY2FudmFzUmVjdC50b3AgLSB0aGlzLmRyYWdPZmZzZXRZO1xuXG4gICAgICBpLnggPSAobW91c2VYcHggLyBjYW52YXNSZWN0LndpZHRoKSAqIDEwMDtcbiAgICAgIGkueSA9IChtb3VzZVlweCAvIGNhbnZhc1JlY3QuaGVpZ2h0KSAqIDEwMDtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgdXAgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzRHJhZ2dpbmdJbWFnZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kcmFnSW1hZ2VJZCA9IG51bGw7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBtb3ZlKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB1cCk7XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG1vdmUpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB1cCk7XG4gIH1cblxuICBzdGFydEltYWdlUmVzaXplKGV2OiBQb2ludGVyRXZlbnQsIGltYWdlSWQ6IHN0cmluZywgZGlyZWN0aW9uOiBSZXNpemVEaXJlY3Rpb24gPSAnc2UnKTogdm9pZCB7XG4gICAgaWYgKGV2LmJ1dHRvbiA9PT0gMiB8fCBldi5jdHJsS2V5KSByZXR1cm47XG4gICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IGltZyA9IHRoaXMuaW1hZ2VTdGFtcHMuZmluZChpID0+IGkuaWQgPT09IGltYWdlSWQpO1xuICAgIGlmICghaW1nKSByZXR1cm47XG5cbiAgICB0aGlzLmlzUmVzaXppbmdJbWFnZSA9IHRydWU7XG4gICAgdGhpcy5yZXNpemVJbWFnZUlkID0gaW1hZ2VJZDtcblxuICAgIGNvbnN0IGNhbnZhc1JlY3QgPSB0aGlzLmdldERyYWdDYW52YXNSZWN0KGltZy5wYWdlKTtcbiAgICBjb25zdCBzdGFydFggPSBldi5jbGllbnRYO1xuICAgIGNvbnN0IHN0YXJ0WSA9IGV2LmNsaWVudFk7XG5cbiAgICBjb25zdCBzdGFydFdfbm9ybSA9IGltZy53aWR0aDtcbiAgICBjb25zdCBzdGFydEhfbm9ybSA9IGltZy5oZWlnaHQ7XG4gICAgY29uc3Qgc3RhcnRYX25vcm0gPSBpbWcueDtcbiAgICBjb25zdCBzdGFydFlfbm9ybSA9IGltZy55O1xuICAgIGNvbnN0IGFzcGVjdFJhdGlvID0gc3RhcnRXX25vcm0gLyBzdGFydEhfbm9ybTtcblxuICAgIGNvbnN0IG1vdmUgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoIXRoaXMuaXNSZXNpemluZ0ltYWdlIHx8ICF0aGlzLnJlc2l6ZUltYWdlSWQpIHJldHVybjtcbiAgICAgIGNvbnN0IGkgPSB0aGlzLmltYWdlU3RhbXBzLmZpbmQoeCA9PiB4LmlkID09PSB0aGlzLnJlc2l6ZUltYWdlSWQpO1xuICAgICAgaWYgKCFpKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGRlbHRhWF9ub3JtID0gKChlLmNsaWVudFggLSBzdGFydFgpIC8gY2FudmFzUmVjdC53aWR0aCkgKiAxMDA7XG4gICAgICBjb25zdCBkZWx0YVlfbm9ybSA9ICgoZS5jbGllbnRZIC0gc3RhcnRZKSAvIGNhbnZhc1JlY3QuaGVpZ2h0KSAqIDEwMDtcblxuICAgICAgY29uc3QgaXNTaGlmdCA9IGUuc2hpZnRLZXk7IC8vIE1haW50YWluIGFzcGVjdCByYXRpbyBpZiBzaGlmdCBpcyBwcmVzc2VkXG5cbiAgICAgIGxldCBuZXdXID0gc3RhcnRXX25vcm07XG4gICAgICBsZXQgbmV3SCA9IHN0YXJ0SF9ub3JtO1xuICAgICAgbGV0IG5ld1ggPSBzdGFydFhfbm9ybTtcbiAgICAgIGxldCBuZXdZID0gc3RhcnRZX25vcm07XG5cbiAgICAgIGlmIChkaXJlY3Rpb24uaW5jbHVkZXMoJ2UnKSkge1xuICAgICAgICBuZXdXID0gTWF0aC5tYXgoMiwgc3RhcnRXX25vcm0gKyBkZWx0YVhfbm9ybSk7XG4gICAgICB9XG4gICAgICBpZiAoZGlyZWN0aW9uLmluY2x1ZGVzKCd3JykpIHtcbiAgICAgICAgbmV3VyA9IE1hdGgubWF4KDIsIHN0YXJ0V19ub3JtIC0gZGVsdGFYX25vcm0pO1xuICAgICAgICBuZXdYID0gc3RhcnRYX25vcm0gKyAoc3RhcnRXX25vcm0gLSBuZXdXKTtcbiAgICAgIH1cbiAgICAgIGlmIChkaXJlY3Rpb24uaW5jbHVkZXMoJ3MnKSkge1xuICAgICAgICBuZXdIID0gTWF0aC5tYXgoMiwgc3RhcnRIX25vcm0gKyBkZWx0YVlfbm9ybSk7XG4gICAgICB9XG4gICAgICBpZiAoZGlyZWN0aW9uLmluY2x1ZGVzKCduJykpIHtcbiAgICAgICAgbmV3SCA9IE1hdGgubWF4KDIsIHN0YXJ0SF9ub3JtIC0gZGVsdGFZX25vcm0pO1xuICAgICAgICBuZXdZID0gc3RhcnRZX25vcm0gKyAoc3RhcnRIX25vcm0gLSBuZXdIKTtcbiAgICAgIH1cblxuICAgICAgLy8gTWFpbnRhaW4gYXNwZWN0IHJhdGlvIGZvciBjb3JuZXIgaGFuZGxlcyBvciBpZiBTaGlmdCBpcyBoZWxkXG4gICAgICBpZiAoaXNTaGlmdCB8fCBkaXJlY3Rpb24ubGVuZ3RoID4gMSkge1xuICAgICAgICBpZiAoZGlyZWN0aW9uLmluY2x1ZGVzKCdlJykgfHwgZGlyZWN0aW9uLmluY2x1ZGVzKCd3JykpIHtcbiAgICAgICAgICBuZXdIID0gbmV3VyAvIGFzcGVjdFJhdGlvO1xuICAgICAgICAgIGlmIChkaXJlY3Rpb24uaW5jbHVkZXMoJ24nKSkge1xuICAgICAgICAgICAgbmV3WSA9IHN0YXJ0WV9ub3JtICsgKHN0YXJ0SF9ub3JtIC0gbmV3SCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1cgPSBuZXdIICogYXNwZWN0UmF0aW87XG4gICAgICAgICAgaWYgKGRpcmVjdGlvbi5pbmNsdWRlcygndycpKSB7XG4gICAgICAgICAgICBuZXdYID0gc3RhcnRYX25vcm0gKyAoc3RhcnRXX25vcm0gLSBuZXdXKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaS53aWR0aCA9IG5ld1c7XG4gICAgICBpLmhlaWdodCA9IG5ld0g7XG4gICAgICBpLnggPSBuZXdYO1xuICAgICAgaS55ID0gbmV3WTtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgdXAgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlzUmVzaXppbmdJbWFnZSA9IGZhbHNlO1xuICAgICAgdGhpcy5yZXNpemVJbWFnZUlkID0gbnVsbDtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG1vdmUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgbW92ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgfVxuXG4gIHJlbW92ZUltYWdlKGltYWdlSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuaW1hZ2VTdGFtcHMgPSB0aGlzLmltYWdlU3RhbXBzLmZpbHRlcihpID0+IGkuaWQgIT09IGltYWdlSWQpO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIC8qID09PT09PT09PT09PT09PT09IFNpZ25hdHVyZSBQYWQgPT09PT09PT09PT09PT09PT0gKi9cbiAgb3BlblNpZ25hdHVyZVBhZCgpOiB2b2lkIHtcbiAgICB0aGlzLnNob3dTaWduYXR1cmVQYWQgPSB0cnVlO1xuICAgIHRoaXMuc2lnbmF0dXJlUG9pbnRzID0gW107XG4gICAgdGhpcy5zaWduYXR1cmVTdHJva2VzID0gW107XG5cbiAgICAvLyBJbml0aWFsaXplIGNhbnZhcyBhZnRlciBtb2RhbCBpcyBzaG93blxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5pbml0U2lnbmF0dXJlQ2FudmFzKCk7XG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIGNsb3NlU2lnbmF0dXJlUGFkKCk6IHZvaWQge1xuICAgIHRoaXMuc2hvd1NpZ25hdHVyZVBhZCA9IGZhbHNlO1xuICAgIHRoaXMuc2lnbmF0dXJlUG9pbnRzID0gW107XG4gICAgdGhpcy5zaWduYXR1cmVTdHJva2VzID0gW107XG4gIH1cblxuICBzZXRTaWduYXR1cmVQZW5Db2xvcihjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zaWduYXR1cmVQZW5Db2xvciA9IGNvbG9yO1xuICB9XG5cbiAgY2hhbmdlU2lnbmF0dXJlUGVuU2l6ZShkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgbmV3U2l6ZSA9IHRoaXMuc2lnbmF0dXJlUGVuU2l6ZSArIGRlbHRhO1xuICAgIGlmIChuZXdTaXplID49IDEgJiYgbmV3U2l6ZSA8PSAxMCkge1xuICAgICAgdGhpcy5zaWduYXR1cmVQZW5TaXplID0gbmV3U2l6ZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRTaWduYXR1cmVDYW52YXMoKTogdm9pZCB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5zaWduYXR1cmVDYW52YXNSZWY/Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKCFjYW52YXMpIHJldHVybjtcblxuICAgIC8vIFJlc3BvbnNpdmUgY2FudmFzIHNpemUgYmFzZWQgb24gY29udGFpbmVyXG4gICAgY29uc3QgY29udGFpbmVyID0gY2FudmFzLnBhcmVudEVsZW1lbnQ7XG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBjb250YWluZXIgPyBjb250YWluZXIuY2xpZW50V2lkdGggLSA0IDogNDAwO1xuICAgIGNvbnN0IGRwciA9IE1hdGgubWluKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsIDIpO1xuXG4gICAgY2FudmFzLndpZHRoID0gTWF0aC5mbG9vcihjb250YWluZXJXaWR0aCAqIGRwcik7XG4gICAgY2FudmFzLmhlaWdodCA9IE1hdGguZmxvb3IoKGNvbnRhaW5lcldpZHRoIC8gMikgKiBkcHIpO1xuICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IGNvbnRhaW5lcldpZHRoICsgJ3B4JztcbiAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gKGNvbnRhaW5lcldpZHRoIC8gMikgKyAncHgnO1xuXG4gICAgdGhpcy5zaWduYXR1cmVDdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAodGhpcy5zaWduYXR1cmVDdHgpIHtcbiAgICAgIHRoaXMuc2lnbmF0dXJlQ3R4LnNldFRyYW5zZm9ybShkcHIsIDAsIDAsIGRwciwgMCwgMCk7XG4gICAgICB0aGlzLnNpZ25hdHVyZUN0eC5zdHJva2VTdHlsZSA9IHRoaXMuc2lnbmF0dXJlUGVuQ29sb3I7XG4gICAgICB0aGlzLnNpZ25hdHVyZUN0eC5saW5lV2lkdGggPSB0aGlzLnNpZ25hdHVyZVBlblNpemU7XG4gICAgICB0aGlzLnNpZ25hdHVyZUN0eC5saW5lQ2FwID0gJ3JvdW5kJztcbiAgICAgIHRoaXMuc2lnbmF0dXJlQ3R4LmxpbmVKb2luID0gJ3JvdW5kJztcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgb2xkIGxpc3RlbmVycyBmaXJzdCAocHJldmVudHMgZHVwbGljYXRlcylcbiAgICBjYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB0aGlzLmJvdW5kT25TaWdTdGFydCk7XG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5ib3VuZE9uU2lnTW92ZSk7XG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuYm91bmRPblNpZ0VuZCk7XG4gICAgY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJsZWF2ZScsIHRoaXMuYm91bmRPblNpZ0VuZCk7XG5cbiAgICB0aGlzLmJvdW5kT25TaWdTdGFydCA9IHRoaXMub25TaWduYXR1cmVTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYm91bmRPblNpZ01vdmUgPSB0aGlzLm9uU2lnbmF0dXJlTW92ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYm91bmRPblNpZ0VuZCA9IHRoaXMub25TaWduYXR1cmVFbmQuYmluZCh0aGlzKTtcblxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuYm91bmRPblNpZ1N0YXJ0KTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCB0aGlzLmJvdW5kT25TaWdNb3ZlKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5ib3VuZE9uU2lnRW5kKTtcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxlYXZlJywgdGhpcy5ib3VuZE9uU2lnRW5kKTtcbiAgfVxuXG4gIHByaXZhdGUgYm91bmRPblNpZ1N0YXJ0OiBhbnk7XG4gIHByaXZhdGUgYm91bmRPblNpZ01vdmU6IGFueTtcbiAgcHJpdmF0ZSBib3VuZE9uU2lnRW5kOiBhbnk7XG5cbiAgcHJpdmF0ZSBnZXRTaWduYXR1cmVQb3MoZTogUG9pbnRlckV2ZW50KTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9IHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnNpZ25hdHVyZUNhbnZhc1JlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IChlLmNsaWVudFggLSByZWN0LmxlZnQpLFxuICAgICAgeTogKGUuY2xpZW50WSAtIHJlY3QudG9wKVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIG9uU2lnbmF0dXJlU3RhcnQoZTogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuaXNEcmF3aW5nU2lnbmF0dXJlID0gdHJ1ZTtcbiAgICBjb25zdCBwb3MgPSB0aGlzLmdldFNpZ25hdHVyZVBvcyhlKTtcbiAgICB0aGlzLnNpZ25hdHVyZVBvaW50cyA9IFtwb3NdO1xuICB9XG5cbiAgcHJpdmF0ZSBvblNpZ25hdHVyZU1vdmUoZTogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzRHJhd2luZ1NpZ25hdHVyZSB8fCAhdGhpcy5zaWduYXR1cmVDdHgpIHJldHVybjtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBwb3MgPSB0aGlzLmdldFNpZ25hdHVyZVBvcyhlKTtcbiAgICB0aGlzLnNpZ25hdHVyZVBvaW50cy5wdXNoKHBvcyk7XG5cbiAgICAvLyBSZWRyYXcgZXZlcnl0aGluZyBmb3Igc21vb3RoIEJlemllciByZW5kZXJpbmdcbiAgICB0aGlzLnJlZHJhd1NpZ25hdHVyZUNhbnZhcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBvblNpZ25hdHVyZUVuZChlOiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNEcmF3aW5nU2lnbmF0dXJlKSByZXR1cm47XG4gICAgdGhpcy5pc0RyYXdpbmdTaWduYXR1cmUgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnNpZ25hdHVyZVBvaW50cy5sZW5ndGggPj0gMikge1xuICAgICAgdGhpcy5zaWduYXR1cmVTdHJva2VzLnB1c2goe1xuICAgICAgICBwb2ludHM6IFsuLi50aGlzLnNpZ25hdHVyZVBvaW50c10sXG4gICAgICAgIGNvbG9yOiB0aGlzLnNpZ25hdHVyZVBlbkNvbG9yLFxuICAgICAgICBzaXplOiB0aGlzLnNpZ25hdHVyZVBlblNpemVcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnNpZ25hdHVyZVBvaW50cyA9IFtdO1xuICB9XG5cbiAgcHJpdmF0ZSByZWRyYXdTaWduYXR1cmVDYW52YXMoKTogdm9pZCB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5zaWduYXR1cmVDYW52YXNSZWY/Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKCFjYW52YXMgfHwgIXRoaXMuc2lnbmF0dXJlQ3R4KSByZXR1cm47XG5cbiAgICBjb25zdCBjdHggPSB0aGlzLnNpZ25hdHVyZUN0eDtcbiAgICBjb25zdCBkcHIgPSBNYXRoLm1pbih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLCAyKTtcbiAgICBjb25zdCB3ID0gY2FudmFzLndpZHRoIC8gZHByO1xuICAgIGNvbnN0IGggPSBjYW52YXMuaGVpZ2h0IC8gZHByO1xuXG4gICAgY3R4LnNldFRyYW5zZm9ybShkcHIsIDAsIDAsIGRwciwgMCwgMCk7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3LCBoKTtcblxuICAgIC8vIERyYXcgZ3VpZGUgbGluZSBhdCB+NzAlIGhlaWdodFxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnNldExpbmVEYXNoKFs2LCA0XSk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gJyNkMWQ1ZGInO1xuICAgIGN0eC5saW5lV2lkdGggPSAxO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKDIwLCBoICogMC43KTtcbiAgICBjdHgubGluZVRvKHcgLSAyMCwgaCAqIDAuNyk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICAvLyBEcmF3IGFsbCBzYXZlZCBzdHJva2VzXG4gICAgZm9yIChjb25zdCBzdHJva2Ugb2YgdGhpcy5zaWduYXR1cmVTdHJva2VzKSB7XG4gICAgICB0aGlzLmRyYXdCZXppZXJTdHJva2UoY3R4LCBzdHJva2UucG9pbnRzLCBzdHJva2UuY29sb3IsIHN0cm9rZS5zaXplKTtcbiAgICB9XG5cbiAgICAvLyBEcmF3IGN1cnJlbnQgYWN0aXZlIHN0cm9rZVxuICAgIGlmICh0aGlzLnNpZ25hdHVyZVBvaW50cy5sZW5ndGggPj0gMikge1xuICAgICAgdGhpcy5kcmF3QmV6aWVyU3Ryb2tlKGN0eCwgdGhpcy5zaWduYXR1cmVQb2ludHMsIHRoaXMuc2lnbmF0dXJlUGVuQ29sb3IsIHRoaXMuc2lnbmF0dXJlUGVuU2l6ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkcmF3QmV6aWVyU3Ryb2tlKFxuICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHBvaW50czogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9W10sXG4gICAgY29sb3I6IHN0cmluZyxcbiAgICBzaXplOiBudW1iZXIsXG4gICAgc2NhbGU6IG51bWJlciA9IDFcbiAgKTogdm9pZCB7XG4gICAgaWYgKHBvaW50cy5sZW5ndGggPCAyKSByZXR1cm47XG5cbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcbiAgICBjdHgubGluZVdpZHRoID0gc2l6ZSAqIHNjYWxlO1xuICAgIGN0eC5saW5lQ2FwID0gJ3JvdW5kJztcbiAgICBjdHgubGluZUpvaW4gPSAncm91bmQnO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKHBvaW50c1swXS54ICogc2NhbGUsIHBvaW50c1swXS55ICogc2NhbGUpO1xuXG4gICAgaWYgKHBvaW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIGN0eC5saW5lVG8ocG9pbnRzWzFdLnggKiBzY2FsZSwgcG9pbnRzWzFdLnkgKiBzY2FsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFF1YWRyYXRpYyBCZXppZXIgc21vb3RoaW5nIHRocm91Z2ggbWlkcG9pbnRzXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgY29uc3QgbWlkWCA9IChwb2ludHNbaV0ueCArIHBvaW50c1tpICsgMV0ueCkgLyAyICogc2NhbGU7XG4gICAgICAgIGNvbnN0IG1pZFkgPSAocG9pbnRzW2ldLnkgKyBwb2ludHNbaSArIDFdLnkpIC8gMiAqIHNjYWxlO1xuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhwb2ludHNbaV0ueCAqIHNjYWxlLCBwb2ludHNbaV0ueSAqIHNjYWxlLCBtaWRYLCBtaWRZKTtcbiAgICAgIH1cbiAgICAgIC8vIENvbm5lY3QgdG8gbGFzdCBwb2ludFxuICAgICAgY29uc3QgbGFzdCA9IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV07XG4gICAgICBjdHgubGluZVRvKGxhc3QueCAqIHNjYWxlLCBsYXN0LnkgKiBzY2FsZSk7XG4gICAgfVxuICAgIGN0eC5zdHJva2UoKTtcbiAgfVxuXG4gIGNsZWFyU2lnbmF0dXJlUGFkKCk6IHZvaWQge1xuICAgIHRoaXMuc2lnbmF0dXJlUG9pbnRzID0gW107XG4gICAgdGhpcy5zaWduYXR1cmVTdHJva2VzID0gW107XG4gICAgdGhpcy5yZWRyYXdTaWduYXR1cmVDYW52YXMoKTtcbiAgfVxuXG4gIC8qKiBSZW5kZXIgc3Ryb2tlcyBhdCBoaWdoIHJlc29sdXRpb24gb24gYW4gb2Zmc2NyZWVuIGNhbnZhcyBhbmQgYXV0by1jcm9wICovXG4gIHByaXZhdGUgdHJpbVNpZ25hdHVyZUNhbnZhcygpOiBzdHJpbmcge1xuICAgIGNvbnN0IHNyY0NhbnZhcyA9IHRoaXMuc2lnbmF0dXJlQ2FudmFzUmVmPy5uYXRpdmVFbGVtZW50O1xuICAgIGlmICghc3JjQ2FudmFzKSByZXR1cm4gJyc7XG5cbiAgICAvLyBHZXQgdGhlIENTUyBzaXplIG9mIHRoZSBvbi1zY3JlZW4gY2FudmFzXG4gICAgY29uc3QgY3NzVyA9IHNyY0NhbnZhcy5jbGllbnRXaWR0aCB8fCA0MDA7XG4gICAgY29uc3QgY3NzSCA9IHNyY0NhbnZhcy5jbGllbnRIZWlnaHQgfHwgMjAwO1xuXG4gICAgLy8gUmVuZGVyIGF0IDh4IENTUyBzaXplIGZvciBjcmlzcCBQREYgb3V0cHV0XG4gICAgY29uc3QgZXhwb3J0U2NhbGUgPSA4O1xuICAgIGNvbnN0IG9mZlcgPSBNYXRoLmZsb29yKGNzc1cgKiBleHBvcnRTY2FsZSk7XG4gICAgY29uc3Qgb2ZmSCA9IE1hdGguZmxvb3IoY3NzSCAqIGV4cG9ydFNjYWxlKTtcblxuICAgIGNvbnN0IG9mZkNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIG9mZkNhbnZhcy53aWR0aCA9IG9mZlc7XG4gICAgb2ZmQ2FudmFzLmhlaWdodCA9IG9mZkg7XG4gICAgY29uc3QgY3R4ID0gb2ZmQ2FudmFzLmdldENvbnRleHQoJzJkJykhO1xuXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBvZmZXLCBvZmZIKTtcbiAgICBjdHgubGluZUNhcCA9ICdyb3VuZCc7XG4gICAgY3R4LmxpbmVKb2luID0gJ3JvdW5kJztcblxuICAgIC8vIERyYXcgYWxsIHN0cm9rZXMgc2NhbGVkIHVwIHdpdGggdGhlaXIgb3JpZ2luYWwgY29sb3Ivc2l6ZSAobm8gZ3VpZGUgbGluZSlcbiAgICBmb3IgKGNvbnN0IHN0cm9rZSBvZiB0aGlzLnNpZ25hdHVyZVN0cm9rZXMpIHtcbiAgICAgIGlmIChzdHJva2UucG9pbnRzLmxlbmd0aCA8IDIpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5kcmF3QmV6aWVyU3Ryb2tlKGN0eCwgc3Ryb2tlLnBvaW50cywgc3Ryb2tlLmNvbG9yLCBzdHJva2Uuc2l6ZSwgZXhwb3J0U2NhbGUpO1xuICAgIH1cbiAgICAvLyBJbmNsdWRlIGFueSBhY3RpdmUgcG9pbnRzXG4gICAgaWYgKHRoaXMuc2lnbmF0dXJlUG9pbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICB0aGlzLmRyYXdCZXppZXJTdHJva2UoY3R4LCB0aGlzLnNpZ25hdHVyZVBvaW50cywgdGhpcy5zaWduYXR1cmVQZW5Db2xvciwgdGhpcy5zaWduYXR1cmVQZW5TaXplLCBleHBvcnRTY2FsZSk7XG4gICAgfVxuXG4gICAgLy8gQXV0by1jcm9wIHRvIGNvbnRlbnQgYm91bmRzXG4gICAgY29uc3QgaW1nRGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgb2ZmVywgb2ZmSCk7XG4gICAgY29uc3QgeyBkYXRhLCB3aWR0aCwgaGVpZ2h0IH0gPSBpbWdEYXRhO1xuXG4gICAgbGV0IHRvcCA9IGhlaWdodCwgbGVmdCA9IHdpZHRoLCByaWdodCA9IDAsIGJvdHRvbSA9IDA7XG5cbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcbiAgICAgICAgY29uc3QgYWxwaGEgPSBkYXRhWyh5ICogd2lkdGggKyB4KSAqIDQgKyAzXTtcbiAgICAgICAgaWYgKGFscGhhID4gMTApIHtcbiAgICAgICAgICBpZiAoeSA8IHRvcCkgdG9wID0geTtcbiAgICAgICAgICBpZiAoeSA+IGJvdHRvbSkgYm90dG9tID0geTtcbiAgICAgICAgICBpZiAoeCA8IGxlZnQpIGxlZnQgPSB4O1xuICAgICAgICAgIGlmICh4ID4gcmlnaHQpIHJpZ2h0ID0geDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vIGNvbnRlbnQgZm91bmRcbiAgICBpZiAodG9wID4gYm90dG9tIHx8IGxlZnQgPiByaWdodCkgcmV0dXJuIG9mZkNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xuXG4gICAgLy8gQWRkIHBhZGRpbmdcbiAgICBjb25zdCBwYWQgPSBNYXRoLnJvdW5kKDQgKiBleHBvcnRTY2FsZSk7XG4gICAgdG9wID0gTWF0aC5tYXgoMCwgdG9wIC0gcGFkKTtcbiAgICBsZWZ0ID0gTWF0aC5tYXgoMCwgbGVmdCAtIHBhZCk7XG4gICAgYm90dG9tID0gTWF0aC5taW4oaGVpZ2h0IC0gMSwgYm90dG9tICsgcGFkKTtcbiAgICByaWdodCA9IE1hdGgubWluKHdpZHRoIC0gMSwgcmlnaHQgKyBwYWQpO1xuXG4gICAgY29uc3QgdHJpbVcgPSByaWdodCAtIGxlZnQgKyAxO1xuICAgIGNvbnN0IHRyaW1IID0gYm90dG9tIC0gdG9wICsgMTtcblxuICAgIGNvbnN0IHRyaW1DYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0cmltQ2FudmFzLndpZHRoID0gdHJpbVc7XG4gICAgdHJpbUNhbnZhcy5oZWlnaHQgPSB0cmltSDtcbiAgICBjb25zdCB0cmltQ3R4ID0gdHJpbUNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcbiAgICB0cmltQ3R4LmRyYXdJbWFnZShvZmZDYW52YXMsIGxlZnQsIHRvcCwgdHJpbVcsIHRyaW1ILCAwLCAwLCB0cmltVywgdHJpbUgpO1xuXG4gICAgcmV0dXJuIHRyaW1DYW52YXMudG9EYXRhVVJMKCdpbWFnZS9wbmcnKTtcbiAgfVxuXG4gIHNhdmVTaWduYXR1cmUoKTogdm9pZCB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5zaWduYXR1cmVDYW52YXNSZWY/Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgdG90YWxQb2ludHMgPSB0aGlzLnNpZ25hdHVyZVN0cm9rZXMucmVkdWNlKChzdW0sIHMpID0+IHN1bSArIHMucG9pbnRzLmxlbmd0aCwgMCk7XG4gICAgaWYgKCFjYW52YXMgfHwgdG90YWxQb2ludHMgPCAyKSB7XG4gICAgICB0aGlzLmNsb3NlU2lnbmF0dXJlUGFkKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YVVybCA9IHRoaXMudHJpbVNpZ25hdHVyZUNhbnZhcygpO1xuICAgIHRoaXMucGxhY2VTaWduYXR1cmVPbkNhbnZhcyhkYXRhVXJsKTtcbiAgICB0aGlzLmNsb3NlU2lnbmF0dXJlUGFkKCk7XG4gIH1cblxuICBzdGFydFNpZ25hdHVyZURyYWcoZTogUG9pbnRlckV2ZW50LCBzaWdJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudG9vbE1vZGUgIT09ICdub25lJykgcmV0dXJuO1xuICAgIHRoaXMuY2xvc2VDb250ZXh0TWVudSgpO1xuXG4gICAgdGhpcy5hY3RpdmVPYmplY3RJZCA9IHNpZ0lkO1xuICAgIHRoaXMuYWN0aXZlT2JqZWN0VHlwZSA9ICdzaWduYXR1cmUnO1xuXG4gICAgY29uc3Qgc2lnID0gdGhpcy5zaWduYXR1cmVTdGFtcHMuZmluZChzID0+IHMuaWQgPT09IHNpZ0lkKTtcbiAgICBpZiAoIXNpZykgcmV0dXJuO1xuXG4gICAgY29uc3QgY2FudmFzUmVjdCA9IHRoaXMuZ2V0RHJhZ0NhbnZhc1JlY3Qoc2lnLnBhZ2UpO1xuICAgIGNvbnN0IHN0YXJ0WHB4ID0gKHNpZy54IC8gMTAwKSAqIGNhbnZhc1JlY3Qud2lkdGg7XG4gICAgY29uc3Qgc3RhcnRZcHggPSAoc2lnLnkgLyAxMDApICogY2FudmFzUmVjdC5oZWlnaHQ7XG5cbiAgICBjb25zdCBvZmZzZXRYID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0IC0gc3RhcnRYcHg7XG4gICAgY29uc3Qgb2Zmc2V0WSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wIC0gc3RhcnRZcHg7XG5cbiAgICBjb25zdCBtb3ZlID0gKGV2OiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBzID0gdGhpcy5zaWduYXR1cmVTdGFtcHMuZmluZCh4ID0+IHguaWQgPT09IHNpZ0lkKTtcbiAgICAgIGlmICghcykgcmV0dXJuO1xuXG4gICAgICBjb25zdCBtb3VzZVhweCA9IGV2LmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnQgLSBvZmZzZXRYO1xuICAgICAgY29uc3QgbW91c2VZcHggPSBldi5jbGllbnRZIC0gY2FudmFzUmVjdC50b3AgLSBvZmZzZXRZO1xuXG4gICAgICBzLnggPSAobW91c2VYcHggLyBjYW52YXNSZWN0LndpZHRoKSAqIDEwMDtcbiAgICAgIHMueSA9IChtb3VzZVlweCAvIGNhbnZhc1JlY3QuaGVpZ2h0KSAqIDEwMDtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgdXAgPSAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBtb3ZlKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB1cCk7XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG1vdmUpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB1cCk7XG4gIH1cblxuICBzdGFydFNpZ25hdHVyZVJlc2l6ZShldjogUG9pbnRlckV2ZW50LCBzaWdJZDogc3RyaW5nLCBkaXJlY3Rpb246IFJlc2l6ZURpcmVjdGlvbiA9ICdzZScpOiB2b2lkIHtcbiAgICBpZiAoZXYuYnV0dG9uID09PSAyIHx8IGV2LmN0cmxLZXkpIHJldHVybjtcbiAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3Qgc2lnID0gdGhpcy5zaWduYXR1cmVTdGFtcHMuZmluZChzID0+IHMuaWQgPT09IHNpZ0lkKTtcbiAgICBpZiAoIXNpZykgcmV0dXJuO1xuXG4gICAgY29uc3QgY2FudmFzUmVjdCA9IHRoaXMuZ2V0RHJhZ0NhbnZhc1JlY3Qoc2lnLnBhZ2UpO1xuICAgIGNvbnN0IHN0YXJ0WCA9IGV2LmNsaWVudFg7XG4gICAgY29uc3Qgc3RhcnRZID0gZXYuY2xpZW50WTtcblxuICAgIGNvbnN0IHN0YXJ0V19ub3JtID0gc2lnLndpZHRoO1xuICAgIGNvbnN0IHN0YXJ0SF9ub3JtID0gc2lnLmhlaWdodDtcbiAgICBjb25zdCBzdGFydFhfbm9ybSA9IHNpZy54O1xuICAgIGNvbnN0IHN0YXJ0WV9ub3JtID0gc2lnLnk7XG4gICAgY29uc3QgYXNwZWN0UmF0aW8gPSBzdGFydFdfbm9ybSAvIHN0YXJ0SF9ub3JtO1xuXG4gICAgY29uc3QgbW92ZSA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IHMgPSB0aGlzLnNpZ25hdHVyZVN0YW1wcy5maW5kKHggPT4geC5pZCA9PT0gc2lnSWQpO1xuICAgICAgaWYgKCFzKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGRlbHRhWF9ub3JtID0gKChlLmNsaWVudFggLSBzdGFydFgpIC8gY2FudmFzUmVjdC53aWR0aCkgKiAxMDA7XG4gICAgICBjb25zdCBkZWx0YVlfbm9ybSA9ICgoZS5jbGllbnRZIC0gc3RhcnRZKSAvIGNhbnZhc1JlY3QuaGVpZ2h0KSAqIDEwMDtcblxuICAgICAgY29uc3QgaXNTaGlmdCA9IGUuc2hpZnRLZXk7XG5cbiAgICAgIGxldCBuZXdXID0gc3RhcnRXX25vcm07XG4gICAgICBsZXQgbmV3SCA9IHN0YXJ0SF9ub3JtO1xuICAgICAgbGV0IG5ld1ggPSBzdGFydFhfbm9ybTtcbiAgICAgIGxldCBuZXdZID0gc3RhcnRZX25vcm07XG5cbiAgICAgIGlmIChkaXJlY3Rpb24uaW5jbHVkZXMoJ2UnKSkge1xuICAgICAgICBuZXdXID0gTWF0aC5tYXgoMiwgc3RhcnRXX25vcm0gKyBkZWx0YVhfbm9ybSk7XG4gICAgICB9XG4gICAgICBpZiAoZGlyZWN0aW9uLmluY2x1ZGVzKCd3JykpIHtcbiAgICAgICAgbmV3VyA9IE1hdGgubWF4KDIsIHN0YXJ0V19ub3JtIC0gZGVsdGFYX25vcm0pO1xuICAgICAgICBuZXdYID0gc3RhcnRYX25vcm0gKyAoc3RhcnRXX25vcm0gLSBuZXdXKTtcbiAgICAgIH1cbiAgICAgIGlmIChkaXJlY3Rpb24uaW5jbHVkZXMoJ3MnKSkge1xuICAgICAgICBuZXdIID0gTWF0aC5tYXgoMiwgc3RhcnRIX25vcm0gKyBkZWx0YVlfbm9ybSk7XG4gICAgICB9XG4gICAgICBpZiAoZGlyZWN0aW9uLmluY2x1ZGVzKCduJykpIHtcbiAgICAgICAgbmV3SCA9IE1hdGgubWF4KDIsIHN0YXJ0SF9ub3JtIC0gZGVsdGFZX25vcm0pO1xuICAgICAgICBuZXdZID0gc3RhcnRZX25vcm0gKyAoc3RhcnRIX25vcm0gLSBuZXdIKTtcbiAgICAgIH1cblxuICAgICAgLy8gTWFpbnRhaW4gYXNwZWN0IHJhdGlvIGZvciBjb3JuZXJzIG9yIGlmIFNoaWZ0IGlzIGhlbGRcbiAgICAgIGlmIChpc1NoaWZ0IHx8IGRpcmVjdGlvbi5sZW5ndGggPiAxKSB7XG4gICAgICAgIGlmIChkaXJlY3Rpb24uaW5jbHVkZXMoJ2UnKSB8fCBkaXJlY3Rpb24uaW5jbHVkZXMoJ3cnKSkge1xuICAgICAgICAgIG5ld0ggPSBuZXdXIC8gYXNwZWN0UmF0aW87XG4gICAgICAgICAgaWYgKGRpcmVjdGlvbi5pbmNsdWRlcygnbicpKSB7XG4gICAgICAgICAgICBuZXdZID0gc3RhcnRZX25vcm0gKyAoc3RhcnRIX25vcm0gLSBuZXdIKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VyA9IG5ld0ggKiBhc3BlY3RSYXRpbztcbiAgICAgICAgICBpZiAoZGlyZWN0aW9uLmluY2x1ZGVzKCd3JykpIHtcbiAgICAgICAgICAgIG5ld1ggPSBzdGFydFhfbm9ybSArIChzdGFydFdfbm9ybSAtIG5ld1cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzLndpZHRoID0gbmV3VztcbiAgICAgIHMuaGVpZ2h0ID0gbmV3SDtcbiAgICAgIHMueCA9IG5ld1g7XG4gICAgICBzLnkgPSBuZXdZO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH07XG5cbiAgICBjb25zdCB1cCA9ICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG1vdmUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgbW92ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgfVxuXG4gIHJlbW92ZVNpZ25hdHVyZShzaWdJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zaWduYXR1cmVTdGFtcHMgPSB0aGlzLnNpZ25hdHVyZVN0YW1wcy5maWx0ZXIocyA9PiBzLmlkICE9PSBzaWdJZCk7XG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyogPT09PT09PT09PT09PT09PT0gU2F2ZWQgU2lnbmF0dXJlcyAoRGF0YWJhc2UpID09PT09PT09PT09PT09PT09ICovXG5cbiAgLy8gT3BlbiBzaWduYXR1cmUgcGlja2VyIG1vZGFsXG4gIG9wZW5TaWduYXR1cmVQaWNrZXJPclBhZCgpOiB2b2lkIHtcbiAgICAvLyBJZiB1c2VyIGhhcyBzYXZlZCBzaWduYXR1cmVzLCBzaG93IHBpY2tlclxuICAgIGlmICh0aGlzLnNhdmVkU2lnbmF0dXJlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnNob3dTaWduYXR1cmVQaWNrZXIgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UsIGxvYWQgZnJvbSBBUEkgZmlyc3RcbiAgICAgIHRoaXMubG9hZFNhdmVkU2lnbmF0dXJlcygpLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5zYXZlZFNpZ25hdHVyZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuc2hvd1NpZ25hdHVyZVBpY2tlciA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTm8gc2F2ZWQgc2lnbmF0dXJlcywgb3BlbiBkcmF3IHBhZFxuICAgICAgICAgIHRoaXMub3BlblNpZ25hdHVyZVBhZCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjbG9zZVNpZ25hdHVyZVBpY2tlcigpOiB2b2lkIHtcbiAgICB0aGlzLnNob3dTaWduYXR1cmVQaWNrZXIgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIExvYWQgc2F2ZWQgc2lnbmF0dXJlcyBmcm9tIEFQSVxuICBhc3luYyBsb2FkU2F2ZWRTaWduYXR1cmVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIGNvbnNvbGUud2FybigndXNlcklkIGlzIG5vdCBzZXQsIGNhbm5vdCBsb2FkIHNpZ25hdHVyZXMnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmlzTG9hZGluZ1NpZ25hdHVyZXMgPSB0cnVlO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5odHRwLnBvc3Q8YW55Pih0aGlzLnNpZ25hdHVyZXNBcGlVcmwsIHtcbiAgICAgICAgYWtzaTogJ2dldF9zaWduYXR1cmVzJyxcbiAgICAgICAgdXNlcl9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pLnRvUHJvbWlzZSgpO1xuXG4gICAgICBpZiAocmVzcG9uc2U/LnN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy5zYXZlZFNpZ25hdHVyZXMgPSByZXNwb25zZS5zaWduYXR1cmVzIHx8IFtdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvYWQgc2lnbmF0dXJlczonLCByZXNwb25zZT8ubXNnKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGxvYWRpbmcgc2lnbmF0dXJlczonLCBlcnIpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLmlzTG9hZGluZ1NpZ25hdHVyZXMgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBTYXZlIGN1cnJlbnQgc2lnbmF0dXJlIHRvIGRhdGFiYXNlXG4gIGFzeW5jIHNhdmVTaWduYXR1cmVUb0RhdGFiYXNlKHNpZ25hdHVyZU5hbWU/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLnNpZ25hdHVyZUNhbnZhc1JlZj8ubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCB0b3RhbFBvaW50cyA9IHRoaXMuc2lnbmF0dXJlU3Ryb2tlcy5yZWR1Y2UoKHN1bSwgcykgPT4gc3VtICsgcy5wb2ludHMubGVuZ3RoLCAwKTtcbiAgICBpZiAoIWNhbnZhcyB8fCB0b3RhbFBvaW50cyA8IDIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ3VzZXJJZCBpcyBub3Qgc2V0LCBjYW5ub3Qgc2F2ZSBzaWduYXR1cmUnKTtcbiAgICAgIHRoaXMuc2F2ZVNpZ25hdHVyZSgpOyAvLyBKdXN0IHVzZSBsb2NhbGx5XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YVVybCA9IHRoaXMudHJpbVNpZ25hdHVyZUNhbnZhcygpO1xuXG4gICAgdGhpcy5pc0xvYWRpbmdTaWduYXR1cmVzID0gdHJ1ZTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuaHR0cC5wb3N0PGFueT4odGhpcy5zaWduYXR1cmVzQXBpVXJsLCB7XG4gICAgICAgIGFrc2k6ICdzYXZlX3NpZ25hdHVyZScsXG4gICAgICAgIHVzZXJfaWQ6IHRoaXMudXNlcklkLFxuICAgICAgICBzaWduYXR1cmVfbmFtZTogc2lnbmF0dXJlTmFtZSB8fCAnJyxcbiAgICAgICAgc2lnbmF0dXJlX2RhdGE6IGRhdGFVcmxcbiAgICAgIH0pLnRvUHJvbWlzZSgpO1xuXG4gICAgICBpZiAocmVzcG9uc2U/LnN1Y2Nlc3MpIHtcbiAgICAgICAgLy8gQWRkIHRvIGxvY2FsIGxpc3RcbiAgICAgICAgdGhpcy5zYXZlZFNpZ25hdHVyZXMucHVzaCh7XG4gICAgICAgICAgaWQ6IHJlc3BvbnNlLmlkLFxuICAgICAgICAgIHVzZXJfaWQ6IHRoaXMudXNlcklkLFxuICAgICAgICAgIHNpZ25hdHVyZV9uYW1lOiByZXNwb25zZS5zaWduYXR1cmVfbmFtZSxcbiAgICAgICAgICBzaWduYXR1cmVfZGF0YTogZGF0YVVybCxcbiAgICAgICAgICBpc19kZWZhdWx0OiB0aGlzLnNhdmVkU2lnbmF0dXJlcy5sZW5ndGggPT09IDAsXG4gICAgICAgICAgY3JlYXRlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgIHVwZGF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBbHNvIHBsYWNlIHRoZSBzaWduYXR1cmUgb24gY2FudmFzXG4gICAgICAgIHRoaXMucGxhY2VTaWduYXR1cmVPbkNhbnZhcyhkYXRhVXJsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzYXZlIHNpZ25hdHVyZTonLCByZXNwb25zZT8ubXNnKTtcbiAgICAgICAgLy8gRmFsbGJhY2s6IGp1c3QgdXNlIGxvY2FsbHlcbiAgICAgICAgdGhpcy5zYXZlU2lnbmF0dXJlKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzYXZpbmcgc2lnbmF0dXJlOicsIGVycik7XG4gICAgICB0aGlzLnNhdmVTaWduYXR1cmUoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5pc0xvYWRpbmdTaWduYXR1cmVzID0gZmFsc2U7XG4gICAgICB0aGlzLmNsb3NlU2lnbmF0dXJlUGFkKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gVXNlIGEgc2F2ZWQgc2lnbmF0dXJlIGZyb20gdGhlIGxpc3RcbiAgdXNlU2F2ZWRTaWduYXR1cmUoc2lnOiBTYXZlZFNpZ25hdHVyZSk6IHZvaWQge1xuICAgIHRoaXMucGxhY2VTaWduYXR1cmVPbkNhbnZhcyhzaWcuc2lnbmF0dXJlX2RhdGEpO1xuICAgIHRoaXMuY2xvc2VTaWduYXR1cmVQaWNrZXIoKTtcbiAgfVxuXG4gIGFzeW5jIHByZXNlbnRUb2FzdChtc2c6IHN0cmluZykge1xuICAgIGNvbnN0IHRvYXN0ID0gYXdhaXQgdGhpcy50b2FzdEN0cmwuY3JlYXRlKHtcbiAgICAgIG1lc3NhZ2U6IG1zZyxcbiAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgcG9zaXRpb246ICd0b3AnXG4gICAgfSk7XG4gICAgdG9hc3QucHJlc2VudCgpO1xuICB9XG5cbiAgLy8gUGxhY2Ugc2lnbmF0dXJlIGltYWdlIG9uIGNhbnZhcyAoU3RhcnRzIHBsYWNlbWVudCBtb2RlKVxuICBwcml2YXRlIHBsYWNlU2lnbmF0dXJlT25DYW52YXMoZGF0YVVybDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5wZW5kaW5nU2lnbmF0dXJlRGF0YVVybCA9IGRhdGFVcmw7XG4gICAgdGhpcy50b29sTW9kZSA9ICdzaWduYXR1cmUnO1xuICAgIHRoaXMudXBkYXRlQ3Vyc29yKCk7XG4gICAgdGhpcy5wcmVzZW50VG9hc3QoJ+C4hOC4peC4tOC4geC4l+C4teC5iCBQREYg4LmA4Lie4Li34LmI4Lit4Lin4Liy4LiH4Lil4Liy4Lii4LmA4LiL4LmH4LiZJyk7XG4gIH1cblxuICAvLyBEZWxldGUgc2F2ZWQgc2lnbmF0dXJlIGZyb20gZGF0YWJhc2VcbiAgYXN5bmMgZGVsZXRlU2F2ZWRTaWduYXR1cmUoc2lnOiBTYXZlZFNpZ25hdHVyZSwgZXZlbnQ/OiBFdmVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnVzZXJJZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5pc0xvYWRpbmdTaWduYXR1cmVzID0gdHJ1ZTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuaHR0cC5wb3N0PGFueT4odGhpcy5zaWduYXR1cmVzQXBpVXJsLCB7XG4gICAgICAgIGFrc2k6ICdkZWxldGVfc2lnbmF0dXJlJyxcbiAgICAgICAgaWQ6IHNpZy5pZCxcbiAgICAgICAgdXNlcl9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pLnRvUHJvbWlzZSgpO1xuXG4gICAgICBpZiAocmVzcG9uc2U/LnN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy5zYXZlZFNpZ25hdHVyZXMgPSB0aGlzLnNhdmVkU2lnbmF0dXJlcy5maWx0ZXIocyA9PiBzLmlkICE9PSBzaWcuaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGRlbGV0ZSBzaWduYXR1cmU6JywgcmVzcG9uc2U/Lm1zZyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkZWxldGluZyBzaWduYXR1cmU6JywgZXJyKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5pc0xvYWRpbmdTaWduYXR1cmVzID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gU2V0IHNpZ25hdHVyZSBhcyBkZWZhdWx0XG4gIGFzeW5jIHNldERlZmF1bHRTaWduYXR1cmUoc2lnOiBTYXZlZFNpZ25hdHVyZSwgZXZlbnQ/OiBFdmVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnVzZXJJZCkgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5odHRwLnBvc3Q8YW55Pih0aGlzLnNpZ25hdHVyZXNBcGlVcmwsIHtcbiAgICAgICAgYWtzaTogJ3NldF9kZWZhdWx0JyxcbiAgICAgICAgaWQ6IHNpZy5pZCxcbiAgICAgICAgdXNlcl9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pLnRvUHJvbWlzZSgpO1xuXG4gICAgICBpZiAocmVzcG9uc2U/LnN1Y2Nlc3MpIHtcbiAgICAgICAgLy8gVXBkYXRlIGxvY2FsIGxpc3RcbiAgICAgICAgdGhpcy5zYXZlZFNpZ25hdHVyZXMuZm9yRWFjaChzID0+IHtcbiAgICAgICAgICBzLmlzX2RlZmF1bHQgPSAocy5pZCA9PT0gc2lnLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzZXR0aW5nIGRlZmF1bHQ6JywgZXJyKTtcbiAgICB9XG4gIH1cblxuICAvLyBPcGVuIHNpZ25hdHVyZSBwYWQgZnJvbSBwaWNrZXIgKHRvIGRyYXcgbmV3IG9uZSlcbiAgb3BlblNpZ25hdHVyZVBhZEZyb21QaWNrZXIoKTogdm9pZCB7XG4gICAgdGhpcy5jbG9zZVNpZ25hdHVyZVBpY2tlcigpO1xuICAgIHRoaXMub3BlblNpZ25hdHVyZVBhZCgpO1xuICB9XG5cbiAgLy8gVHJpZ2dlciBmaWxlIGlucHV0IGZvciBzaWduYXR1cmUgdXBsb2FkXG4gIHRyaWdnZXJTaWduYXR1cmVVcGxvYWQoKTogdm9pZCB7XG4gICAgdGhpcy5zaWduYXR1cmVGaWxlSW5wdXRSZWY/Lm5hdGl2ZUVsZW1lbnQ/LmNsaWNrKCk7XG4gIH1cblxuICAvLyBIYW5kbGUgc2lnbmF0dXJlIGZpbGUgc2VsZWN0aW9uXG4gIGFzeW5jIG9uU2lnbmF0dXJlRmlsZVNlbGVjdGVkKGV2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGlucHV0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaWYgKCFpbnB1dC5maWxlcyB8fCBpbnB1dC5maWxlcy5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIGNvbnN0IGZpbGUgPSBpbnB1dC5maWxlc1swXTtcblxuICAgIC8vIFZhbGlkYXRlIGZpbGUgdHlwZVxuICAgIGlmICghZmlsZS50eXBlLnN0YXJ0c1dpdGgoJ2ltYWdlLycpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIGZpbGUgdHlwZTonLCBmaWxlLnR5cGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgdG8gYmFzZTY0XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkID0gYXN5bmMgKGUpID0+IHtcbiAgICAgIGxldCBkYXRhVXJsID0gZS50YXJnZXQ/LnJlc3VsdCBhcyBzdHJpbmc7XG4gICAgICBpZiAoIWRhdGFVcmwpIHJldHVybjtcblxuICAgICAgLy8gUmVtb3ZlIHdoaXRlIGJhY2tncm91bmRcbiAgICAgIHRoaXMuaXNMb2FkaW5nU2lnbmF0dXJlcyA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhVXJsID0gYXdhaXQgdGhpcy5yZW1vdmVXaGl0ZUJhY2tncm91bmQoZGF0YVVybCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdDb3VsZCBub3QgcmVtb3ZlIGJhY2tncm91bmQ6JywgZXJyKTtcbiAgICAgIH1cblxuICAgICAgLy8gU2F2ZSB0byBkYXRhYmFzZSBpZiB1c2VySWQgaXMgc2V0XG4gICAgICBpZiAodGhpcy51c2VySWQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuaHR0cC5wb3N0PGFueT4odGhpcy5zaWduYXR1cmVzQXBpVXJsLCB7XG4gICAgICAgICAgICBha3NpOiAnc2F2ZV9zaWduYXR1cmUnLFxuICAgICAgICAgICAgdXNlcl9pZDogdGhpcy51c2VySWQsXG4gICAgICAgICAgICBzaWduYXR1cmVfbmFtZTogZmlsZS5uYW1lLnJlcGxhY2UoL1xcLlteLy5dKyQvLCAnJyksIC8vIFJlbW92ZSBleHRlbnNpb25cbiAgICAgICAgICAgIHNpZ25hdHVyZV9kYXRhOiBkYXRhVXJsXG4gICAgICAgICAgfSkudG9Qcm9taXNlKCk7XG5cbiAgICAgICAgICBpZiAocmVzcG9uc2U/LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZWRTaWduYXR1cmVzLnB1c2goe1xuICAgICAgICAgICAgICBpZDogcmVzcG9uc2UuaWQsXG4gICAgICAgICAgICAgIHVzZXJfaWQ6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgICBzaWduYXR1cmVfbmFtZTogcmVzcG9uc2Uuc2lnbmF0dXJlX25hbWUsXG4gICAgICAgICAgICAgIHNpZ25hdHVyZV9kYXRhOiBkYXRhVXJsLFxuICAgICAgICAgICAgICBpc19kZWZhdWx0OiB0aGlzLnNhdmVkU2lnbmF0dXJlcy5sZW5ndGggPT09IDAsXG4gICAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgICAgdXBkYXRlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwbG9hZGluZyBzaWduYXR1cmU6JywgZXJyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm8gdXNlcklkLCBqdXN0IHVzZSBkaXJlY3RseVxuICAgICAgICB0aGlzLnBsYWNlU2lnbmF0dXJlT25DYW52YXMoZGF0YVVybCk7XG4gICAgICAgIHRoaXMuY2xvc2VTaWduYXR1cmVQaWNrZXIoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pc0xvYWRpbmdTaWduYXR1cmVzID0gZmFsc2U7XG4gICAgICAvLyBSZXNldCBpbnB1dFxuICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICB9O1xuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICB9XG5cbiAgLy8gUmVtb3ZlIHdoaXRlL2xpZ2h0IGJhY2tncm91bmQgZnJvbSBpbWFnZSwgbWFraW5nIGl0IHRyYW5zcGFyZW50XG4gIHByaXZhdGUgcmVtb3ZlV2hpdGVCYWNrZ3JvdW5kKGRhdGFVcmw6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIGlmICghY3R4KSB7XG4gICAgICAgICAgcmVqZWN0KCdDb3VsZCBub3QgZ2V0IGNhbnZhcyBjb250ZXh0Jyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRHJhdyBpbWFnZVxuICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XG5cbiAgICAgICAgLy8gR2V0IHBpeGVsIGRhdGFcbiAgICAgICAgY29uc3QgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICBjb25zdCBkYXRhID0gaW1hZ2VEYXRhLmRhdGE7XG5cbiAgICAgICAgLy8gVGhyZXNob2xkIGZvciBcIndoaXRlXCIgLSBwaXhlbHMgd2l0aCBSR0IgYWxsIGFib3ZlIHRoaXMgdmFsdWUgd2lsbCBiZSBtYWRlIHRyYW5zcGFyZW50XG4gICAgICAgIGNvbnN0IHRocmVzaG9sZCA9IDI0MDtcbiAgICAgICAgLy8gQWxzbyBtYWtlIG5lYXItd2hpdGUgcGl4ZWxzIHNlbWktdHJhbnNwYXJlbnQgZm9yIHNtb290aGVyIGVkZ2VzXG4gICAgICAgIGNvbnN0IHNvZnRUaHJlc2hvbGQgPSAyMDA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSArPSA0KSB7XG4gICAgICAgICAgY29uc3QgciA9IGRhdGFbaV07XG4gICAgICAgICAgY29uc3QgZyA9IGRhdGFbaSArIDFdO1xuICAgICAgICAgIGNvbnN0IGIgPSBkYXRhW2kgKyAyXTtcblxuICAgICAgICAgIC8vIENoZWNrIGlmIHBpeGVsIGlzIHdoaXRlL25lYXItd2hpdGVcbiAgICAgICAgICBpZiAociA+IHRocmVzaG9sZCAmJiBnID4gdGhyZXNob2xkICYmIGIgPiB0aHJlc2hvbGQpIHtcbiAgICAgICAgICAgIC8vIE1ha2UgZnVsbHkgdHJhbnNwYXJlbnRcbiAgICAgICAgICAgIGRhdGFbaSArIDNdID0gMDtcbiAgICAgICAgICB9IGVsc2UgaWYgKHIgPiBzb2Z0VGhyZXNob2xkICYmIGcgPiBzb2Z0VGhyZXNob2xkICYmIGIgPiBzb2Z0VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAvLyBNYWtlIHNlbWktdHJhbnNwYXJlbnQgZm9yIHNtb290aGVyIGVkZ2VzXG4gICAgICAgICAgICBjb25zdCBhdmcgPSAociArIGcgKyBiKSAvIDM7XG4gICAgICAgICAgICBjb25zdCBhbHBoYSA9IE1hdGgubWF4KDAsIDI1NSAtIChhdmcgLSBzb2Z0VGhyZXNob2xkKSAqICgyNTUgLyAodGhyZXNob2xkIC0gc29mdFRocmVzaG9sZCkpKTtcbiAgICAgICAgICAgIGRhdGFbaSArIDNdID0gTWF0aC5taW4oZGF0YVtpICsgM10sIGFscGhhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQdXQgbW9kaWZpZWQgZGF0YSBiYWNrXG4gICAgICAgIGN0eC5wdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcblxuICAgICAgICAvLyBSZXR1cm4gYXMgUE5HIChzdXBwb3J0cyB0cmFuc3BhcmVuY3kpXG4gICAgICAgIHJlc29sdmUoY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJykpO1xuICAgICAgfTtcbiAgICAgIGltZy5vbmVycm9yID0gKCkgPT4gcmVqZWN0KCdGYWlsZWQgdG8gbG9hZCBpbWFnZScpO1xuICAgICAgaW1nLnNyYyA9IGRhdGFVcmw7XG4gICAgfSk7XG4gIH1cblxuICAvKiA9PT09PT09PT09PT09PT09PSBQREYgRm9ybSBGaWVsZHMgPT09PT09PT09PT09PT09PT0gKi9cblxuICBlbmFibGVGb3JtRmllbGRNb2RlKHR5cGU6ICd0ZXh0JyB8ICdjaGVja2JveCcgfCAncmFkaW8nKTogdm9pZCB7XG4gICAgdGhpcy5mb3JtRmllbGRUeXBlID0gdHlwZTtcbiAgICB0aGlzLnRvb2xNb2RlID0gJ2Zvcm1maWVsZCc7XG4gICAgdGhpcy5zaG93TWFya09wdGlvbnMgPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlQ3Vyc29yKCk7XG4gICAgY29uc3QgbGFiZWxzID0geyB0ZXh0OiAnVGV4dCBGaWVsZCcsIGNoZWNrYm94OiAnQ2hlY2tib3gnLCByYWRpbzogJ1JhZGlvIEJ1dHRvbicgfTtcbiAgICB0aGlzLnByZXNlbnRUb2FzdChg4LiE4Lil4Li04LiB4Lia4LiZ4LmA4Lit4LiB4Liq4Liy4Lij4LmA4Lie4Li34LmI4Lit4Lin4Liy4LiHICR7bGFiZWxzW3R5cGVdfWApO1xuICB9XG5cbiAgZ2V0Rm9ybUZpZWxkc0ZvclBhZ2UocGFnZTogbnVtYmVyKTogUGRmRm9ybUZpZWxkW10ge1xuICAgIHJldHVybiB0aGlzLnBkZkZvcm1GaWVsZHMuZmlsdGVyKGYgPT4gZi5wYWdlID09PSBwYWdlKTtcbiAgfVxuXG4gIHJlbW92ZUZvcm1GaWVsZChpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5wZGZGb3JtRmllbGRzID0gdGhpcy5wZGZGb3JtRmllbGRzLmZpbHRlcihmID0+IGYuaWQgIT09IGlkKTtcbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBzdGFydEZvcm1GaWVsZERyYWcoZTogUG9pbnRlckV2ZW50LCBpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGUuYnV0dG9uID09PSAyIHx8IGUuY3RybEtleSkgcmV0dXJuO1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgIGlmICh0YXJnZXQuY2xvc2VzdCgnYnV0dG9uJykgfHwgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncmVzaXplLWhhbmRsZScpKSByZXR1cm47XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5hY3RpdmVGb3JtRmllbGRJZCA9IGlkO1xuXG4gICAgY29uc3QgZmYgPSB0aGlzLnBkZkZvcm1GaWVsZHMuZmluZChmID0+IGYuaWQgPT09IGlkKTtcbiAgICBpZiAoIWZmKSByZXR1cm47XG5cbiAgICBjb25zdCBjYW52YXNSZWN0ID0gdGhpcy5nZXREcmFnQ2FudmFzUmVjdChmZi5wYWdlKTtcbiAgICBjb25zdCBzdGFydFhweCA9IChmZi54IC8gMTAwKSAqIGNhbnZhc1JlY3Qud2lkdGg7XG4gICAgY29uc3Qgc3RhcnRZcHggPSAoZmYueSAvIDEwMCkgKiBjYW52YXNSZWN0LmhlaWdodDtcbiAgICBjb25zdCBvZmZzZXRYID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0IC0gc3RhcnRYcHg7XG4gICAgY29uc3Qgb2Zmc2V0WSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wIC0gc3RhcnRZcHg7XG5cbiAgICBjb25zdCBtb3ZlID0gKGV2OiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBmID0gdGhpcy5wZGZGb3JtRmllbGRzLmZpbmQoeCA9PiB4LmlkID09PSBpZCk7XG4gICAgICBpZiAoIWYpIHJldHVybjtcbiAgICAgIGYueCA9ICgoZXYuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdCAtIG9mZnNldFgpIC8gY2FudmFzUmVjdC53aWR0aCkgKiAxMDA7XG4gICAgICBmLnkgPSAoKGV2LmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcCAtIG9mZnNldFkpIC8gY2FudmFzUmVjdC5oZWlnaHQpICogMTAwO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH07XG4gICAgY29uc3QgdXAgPSAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBtb3ZlKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB1cCk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBtb3ZlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdXApO1xuICB9XG5cbiAgc3RhcnRNYXJrRHJhZyhlOiBQb2ludGVyRXZlbnQsIG1hcmtJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGUuYnV0dG9uID09PSAyIHx8IGUuY3RybEtleSkgcmV0dXJuO1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgIGlmICh0YXJnZXQuY2xvc2VzdCgnYnV0dG9uJykgfHwgdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncGZmLXJlc2l6ZS1oYW5kbGUnKSkgcmV0dXJuO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy5hY3RpdmVPYmplY3RJZCA9IG1hcmtJZDtcbiAgICB0aGlzLmFjdGl2ZU9iamVjdFR5cGUgPSAnaW1hZ2UnO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcblxuICAgIGNvbnN0IGltZyA9IHRoaXMuaW1hZ2VTdGFtcHMuZmluZChpID0+IGkuaWQgPT09IG1hcmtJZCk7XG4gICAgaWYgKCFpbWcpIHJldHVybjtcblxuICAgIGNvbnN0IGNhbnZhc1JlY3QgPSB0aGlzLmdldERyYWdDYW52YXNSZWN0KGltZy5wYWdlKTtcbiAgICBjb25zdCBvZmZzZXRYID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0IC0gKGltZy54IC8gMTAwKSAqIGNhbnZhc1JlY3Qud2lkdGg7XG4gICAgY29uc3Qgb2Zmc2V0WSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wIC0gKGltZy55IC8gMTAwKSAqIGNhbnZhc1JlY3QuaGVpZ2h0O1xuXG4gICAgY29uc3QgbW92ZSA9IChldjogUG9pbnRlckV2ZW50KSA9PiB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgaSA9IHRoaXMuaW1hZ2VTdGFtcHMuZmluZCh4ID0+IHguaWQgPT09IG1hcmtJZCk7XG4gICAgICBpZiAoIWkpIHJldHVybjtcbiAgICAgIGkueCA9ICgoZXYuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdCAtIG9mZnNldFgpIC8gY2FudmFzUmVjdC53aWR0aCkgKiAxMDA7XG4gICAgICBpLnkgPSAoKGV2LmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcCAtIG9mZnNldFkpIC8gY2FudmFzUmVjdC5oZWlnaHQpICogMTAwO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH07XG5cbiAgICBjb25zdCB1cCA9ICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIG1vdmUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgbW92ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHVwKTtcbiAgfVxuXG4gIHN0YXJ0Rm9ybUZpZWxkUmVzaXplKGU6IFBvaW50ZXJFdmVudCwgaWQ6IHN0cmluZywgZGlyOiBSZXNpemVEaXJlY3Rpb24pOiB2b2lkIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBmZiA9IHRoaXMucGRmRm9ybUZpZWxkcy5maW5kKGYgPT4gZi5pZCA9PT0gaWQpO1xuICAgIGlmICghZmYpIHJldHVybjtcblxuICAgIGNvbnN0IGNhbnZhc1JlY3QgPSB0aGlzLmdldERyYWdDYW52YXNSZWN0KGZmLnBhZ2UpO1xuICAgIGNvbnN0IHN0YXJ0WCA9IGUuY2xpZW50WDtcbiAgICBjb25zdCBzdGFydFkgPSBlLmNsaWVudFk7XG4gICAgY29uc3Qgb3JpZ1ggPSBmZi54OyBjb25zdCBvcmlnWSA9IGZmLnk7XG4gICAgY29uc3Qgb3JpZ1cgPSBmZi53aWR0aDsgY29uc3Qgb3JpZ0ggPSBmZi5oZWlnaHQ7XG5cbiAgICBjb25zdCBtb3ZlID0gKGV2OiBQb2ludGVyRXZlbnQpID0+IHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBmID0gdGhpcy5wZGZGb3JtRmllbGRzLmZpbmQoeCA9PiB4LmlkID09PSBpZCk7XG4gICAgICBpZiAoIWYpIHJldHVybjtcbiAgICAgIGNvbnN0IGR4ID0gKChldi5jbGllbnRYIC0gc3RhcnRYKSAvIGNhbnZhc1JlY3Qud2lkdGgpICogMTAwO1xuICAgICAgY29uc3QgZHkgPSAoKGV2LmNsaWVudFkgLSBzdGFydFkpIC8gY2FudmFzUmVjdC5oZWlnaHQpICogMTAwO1xuICAgICAgaWYgKGRpci5pbmNsdWRlcygnZScpKSBmLndpZHRoID0gTWF0aC5tYXgoMiwgb3JpZ1cgKyBkeCk7XG4gICAgICBpZiAoZGlyLmluY2x1ZGVzKCdzJykpIGYuaGVpZ2h0ID0gTWF0aC5tYXgoMiwgb3JpZ0ggKyBkeSk7XG4gICAgICBpZiAoZGlyLmluY2x1ZGVzKCd3JykpIHsgZi54ID0gb3JpZ1ggKyBkeDsgZi53aWR0aCA9IE1hdGgubWF4KDIsIG9yaWdXIC0gZHgpOyB9XG4gICAgICBpZiAoZGlyLmluY2x1ZGVzKCduJykpIHsgZi55ID0gb3JpZ1kgKyBkeTsgZi5oZWlnaHQgPSBNYXRoLm1heCgyLCBvcmlnSCAtIGR5KTsgfVxuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH07XG4gICAgY29uc3QgdXAgPSAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBtb3ZlKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB1cCk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBtb3ZlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdXApO1xuICB9XG5cbiAgY2hhbmdlRm9ybUZpZWxkRm9udFNpemUoaWQ6IHN0cmluZywgZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGZmID0gdGhpcy5wZGZGb3JtRmllbGRzLmZpbmQoZiA9PiBmLmlkID09PSBpZCk7XG4gICAgaWYgKCFmZikgcmV0dXJuO1xuICAgIGZmLmZvbnRTaXplID0gTWF0aC5tYXgoNiwgTWF0aC5taW4oNzIsIChmZi5mb250U2l6ZSA/PyAxMikgKyBkZWx0YSkpO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIGNoYW5nZUZvcm1GaWVsZFNpemUoaWQ6IHN0cmluZywgZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGZmID0gdGhpcy5wZGZGb3JtRmllbGRzLmZpbmQoZiA9PiBmLmlkID09PSBpZCk7XG4gICAgaWYgKCFmZikgcmV0dXJuO1xuICAgIGlmIChmZi50eXBlID09PSAndGV4dCcpIHtcbiAgICAgIGZmLmhlaWdodCA9IE1hdGgubWF4KDEuNSwgTWF0aC5taW4oMzAsIGZmLmhlaWdodCArIGRlbHRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHMgPSBNYXRoLm1heCgxLCBNYXRoLm1pbigzMCwgZmYud2lkdGggKyBkZWx0YSkpO1xuICAgICAgZmYud2lkdGggPSBzO1xuICAgICAgZmYuaGVpZ2h0ID0gcztcbiAgICB9XG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgdG9nZ2xlRm9ybUZpZWxkQm9yZGVyKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBmZiA9IHRoaXMucGRmRm9ybUZpZWxkcy5maW5kKGYgPT4gZi5pZCA9PT0gaWQpO1xuICAgIGlmICghZmYpIHJldHVybjtcbiAgICBmZi5ib3JkZXJWaXNpYmxlID0gIShmZi5ib3JkZXJWaXNpYmxlID8/IHRydWUpO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIC8qID09PT09PT09PT09PT09PT09IFF1aWNrIE1hcmsgU3RhbXBzID09PT09PT09PT09PT09PT09ICovXG5cbiAgZW5hYmxlTWFya01vZGUodHlwZTogJ2NoZWNrJyB8ICdjcm9zcycgfCAnZG90Jyk6IHZvaWQge1xuICAgIHRoaXMubWFya1R5cGUgPSB0eXBlO1xuICAgIHRoaXMudG9vbE1vZGUgPSAnbWFyayc7XG4gICAgdGhpcy5zaG93TWFya09wdGlvbnMgPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlQ3Vyc29yKCk7XG4gICAgY29uc3QgbGFiZWxzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgY2hlY2s6ICfinJMg4LmA4LiE4Lij4Li34LmI4Lit4LiH4Lir4Lih4Liy4Lii4LiW4Li54LiBJywgY3Jvc3M6ICfinJcg4LmA4LiE4Lij4Li34LmI4Lit4LiH4Lir4Lih4Liy4Lii4Lic4Li04LiUJywgZG90OiAn4pePIOC4iOC4uOC4lCcsXG4gICAgfTtcbiAgICB0aGlzLnByZXNlbnRUb2FzdChg4LiE4Lil4Li04LiB4Lia4LiZ4LmA4Lit4LiB4Liq4Liy4Lij4LmA4Lie4Li34LmI4Lit4Lin4Liy4LiHICR7bGFiZWxzW3R5cGVdfWApO1xuICB9XG5cbiAgc2V0TWFya0NvbG9yKGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLm1hcmtDb2xvciA9IGNvbG9yO1xuICB9XG5cbiAgY2hhbmdlTWFya1NpemUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMubWFya1NpemUgPSBNYXRoLm1heCgxMiwgTWF0aC5taW4oOTYsIHRoaXMubWFya1NpemUgKyBkZWx0YSkpO1xuICB9XG5cbiAgY2hhbmdlTWFya1N0YW1wU2l6ZShpZDogc3RyaW5nLCBkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgaW1nID0gdGhpcy5pbWFnZVN0YW1wcy5maW5kKGkgPT4gaS5pZCA9PT0gaWQpO1xuICAgIGlmICghaW1nKSByZXR1cm47XG4gICAgY29uc3QgbmV3U2l6ZSA9IE1hdGgubWF4KDEsIE1hdGgubWluKDI1LCBpbWcud2lkdGggKyBkZWx0YSAqIDAuNSkpO1xuICAgIGltZy53aWR0aCA9IG5ld1NpemU7XG4gICAgaW1nLmhlaWdodCA9IG5ld1NpemU7XG4gICAgaWYgKGltZy5tYXJrVHlwZSAmJiBpbWcubWFya0NvbG9yKSB7XG4gICAgICBpbWcuZGF0YVVybCA9IHRoaXMuZ2VuZXJhdGVNYXJrRGF0YVVybChpbWcubWFya1R5cGUsIGltZy5tYXJrQ29sb3IsIE1hdGgucm91bmQobmV3U2l6ZSAqIDEwKSk7XG4gICAgfVxuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIGdlbmVyYXRlTWFya0RhdGFVcmwodHlwZTogJ2NoZWNrJyB8ICdjcm9zcycgfCAnZG90JywgY29sb3I6IHN0cmluZywgc2l6ZVB4OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGNvbnN0IHMgPSBNYXRoLnJvdW5kKHNpemVQeCk7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY2FudmFzLndpZHRoID0gcztcbiAgICBjYW52YXMuaGVpZ2h0ID0gcztcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XG4gICAgY29uc3Qgc3cgPSBNYXRoLm1heCgyLCBzICogMC4xMCk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5saW5lQ2FwID0gJ3JvdW5kJztcbiAgICBjdHgubGluZUpvaW4gPSAncm91bmQnO1xuICAgIGN0eC5saW5lV2lkdGggPSBzdztcblxuICAgIGlmICh0eXBlID09PSAnY2hlY2snKSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKHMgKiAwLjEyLCBzICogMC41Mik7XG4gICAgICBjdHgubGluZVRvKHMgKiAwLjQyLCBzICogMC44Mik7XG4gICAgICBjdHgubGluZVRvKHMgKiAwLjg4LCBzICogMC4xOCk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnY3Jvc3MnKSB7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKHMgKiAwLjE1LCBzICogMC4xNSk7XG4gICAgICBjdHgubGluZVRvKHMgKiAwLjg1LCBzICogMC44NSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKHMgKiAwLjg1LCBzICogMC4xNSk7XG4gICAgICBjdHgubGluZVRvKHMgKiAwLjE1LCBzICogMC44NSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5hcmMocyAvIDIsIHMgLyAyLCBzICogMC4zOCwgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xuICB9XG5cbiAgLyogPT09PT09PT09PT09PT09PT0gRGF0ZSBTdGFtcCA9PT09PT09PT09PT09PT09PSAqL1xuICBhZGREYXRlU3RhbXAoKTogdm9pZCB7XG4gICAgdGhpcy50b29sTW9kZSA9ICdkYXRlJztcbiAgICB0aGlzLnVwZGF0ZUN1cnNvcigpO1xuICAgIHRoaXMucHJlc2VudFRvYXN0KCfguITguKXguLTguIHguJrguJnguYDguK3guIHguKrguLLguKPguYDguJ7guLfguYjguK3guKfguLLguIfguKfguLHguJnguJfguLXguYgnKTtcbiAgfVxuXG4gIHN0YXJ0RGF0ZURyYWcoZXY6IFBvaW50ZXJFdmVudCwgZGF0ZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoZXYuYnV0dG9uID09PSAyIHx8IGV2LmN0cmxLZXkpIHJldHVybjtcbiAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCB0YXJnZXQgPSBldi50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKHRhcmdldC5jbG9zZXN0KCdidXR0b24nKSkgcmV0dXJuO1xuXG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnN0IGRzID0gdGhpcy5kYXRlU3RhbXBzLmZpbmQoZCA9PiBkLmlkID09PSBkYXRlSWQpO1xuICAgIGlmICghZHMpIHJldHVybjtcblxuICAgIGNvbnN0IGNhbnZhc1JlY3QgPSB0aGlzLmdldERyYWdDYW52YXNSZWN0KGRzLnBhZ2UpO1xuICAgIGNvbnN0IHN0YXJ0WHB4ID0gKGRzLnggLyAxMDApICogY2FudmFzUmVjdC53aWR0aDtcbiAgICBjb25zdCBzdGFydFlweCA9IChkcy55IC8gMTAwKSAqIGNhbnZhc1JlY3QuaGVpZ2h0O1xuXG4gICAgY29uc3Qgb2Zmc2V0WCA9IGV2LmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnQgLSBzdGFydFhweDtcbiAgICBjb25zdCBvZmZzZXRZID0gZXYuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wIC0gc3RhcnRZcHg7XG5cbiAgICBjb25zdCBtb3ZlID0gKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgZCA9IHRoaXMuZGF0ZVN0YW1wcy5maW5kKHggPT4geC5pZCA9PT0gZGF0ZUlkKTtcbiAgICAgIGlmICghZCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBtb3VzZVhweCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdCAtIG9mZnNldFg7XG4gICAgICBjb25zdCBtb3VzZVlweCA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wIC0gb2Zmc2V0WTtcblxuICAgICAgZC54ID0gKG1vdXNlWHB4IC8gY2FudmFzUmVjdC53aWR0aCkgKiAxMDA7XG4gICAgICBkLnkgPSAobW91c2VZcHggLyBjYW52YXNSZWN0LmhlaWdodCkgKiAxMDA7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHVwID0gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgbW92ZSk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdXApO1xuICAgIH07XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCBtb3ZlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdXApO1xuICB9XG5cbiAgcmVtb3ZlRGF0ZVN0YW1wKGRhdGVJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5kYXRlU3RhbXBzID0gdGhpcy5kYXRlU3RhbXBzLmZpbHRlcihkID0+IGQuaWQgIT09IGRhdGVJZCk7XG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyogPT09PT09PT09PT09PT09PT0gVGV4dCBTdHlsZSA9PT09PT09PT09PT09PT09PSAqL1xuICB0b2dnbGVCb2xkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFjdGl2ZVRleHRCb3gpIHtcbiAgICAgIHRoaXMuYWN0aXZlVGV4dEJveC5ib2xkID0gIXRoaXMuYWN0aXZlVGV4dEJveC5ib2xkO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZUl0YWxpYygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hY3RpdmVUZXh0Qm94KSB7XG4gICAgICB0aGlzLmFjdGl2ZVRleHRCb3guaXRhbGljID0gIXRoaXMuYWN0aXZlVGV4dEJveC5pdGFsaWM7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0QWxpZ24oYTogJ2xlZnQnIHwgJ2NlbnRlcicgfCAncmlnaHQnKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZlVGV4dEJveCkge1xuICAgICAgdGhpcy5hY3RpdmVUZXh0Qm94LmFsaWduID0gYTtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBzZXRUZXh0Q29sb3IoY29sb3I6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMudGV4dENvbG9yID0gY29sb3I7XG4gICAgaWYgKHRoaXMuYWN0aXZlVGV4dEJveCkge1xuICAgICAgdGhpcy5hY3RpdmVUZXh0Qm94LmNvbG9yID0gY29sb3I7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICAgIHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICAvKiA9PT09PT09PT09PT09PT09PSBTZXJpYWxpemUgSlNPTiA9PT09PT09PT09PT09PT09PSAqL1xuICBleHBvcnREcmF3aW5nSnNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB2ZXJzaW9uOiAzLFxuICAgICAgc3Ryb2tlczogdGhpcy5zdHJva2VzLFxuICAgICAgc2hhcGVzOiB0aGlzLnNoYXBlcyxcbiAgICAgIHRleHRCb3hlczogdGhpcy50ZXh0Qm94ZXMsXG4gICAgICBpbWFnZVN0YW1wczogdGhpcy5pbWFnZVN0YW1wcyxcbiAgICAgIHNpZ25hdHVyZVN0YW1wczogdGhpcy5zaWduYXR1cmVTdGFtcHMsXG4gICAgICBkYXRlU3RhbXBzOiB0aGlzLmRhdGVTdGFtcHNcbiAgICB9KTtcbiAgfVxuXG4gIC8qID09PT09PT09PT09PT09PT09IFNhdmUgUERGIChBTEwgUEFHRVMpID09PT09PT09PT09PT09PT09ICovXG4gIHByaXZhdGUgcmVuZGVyT3ZlcmxheVRvUG5nQnl0ZXMocGFnZU5vOiBudW1iZXIsIHBkZlc6IG51bWJlciwgcGRmSDogbnVtYmVyKTogVWludDhBcnJheSB7XG4gICAgY29uc3Qgc3Ryb2tlcyA9IHRoaXMuc3Ryb2tlc1twYWdlTm9dIHx8IFtdO1xuICAgIGNvbnN0IHNoYXBlcyA9IHRoaXMuc2hhcGVzW3BhZ2VOb10gfHwgW107XG5cbiAgICBjb25zdCBvZmYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBvZmYud2lkdGggPSBNYXRoLmZsb29yKHBkZlcpO1xuICAgIG9mZi5oZWlnaHQgPSBNYXRoLmZsb29yKHBkZkgpO1xuXG4gICAgY29uc3QgY3R4ID0gb2ZmLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgb2ZmLndpZHRoLCBvZmYuaGVpZ2h0KTtcbiAgICBjdHgubGluZUpvaW4gPSAncm91bmQnO1xuICAgIGN0eC5saW5lQ2FwID0gJ3JvdW5kJztcblxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuZ2V0QW5ub3RDYW52YXMocGFnZU5vKTtcbiAgICBjb25zdCB2aWV3V2lkdGggPSBjYW52YXMgPyBjYW52YXMuY2xpZW50V2lkdGggOiA4MDA7XG4gICAgY29uc3QgdGhpY2tuZXNzU2NhbGUgPSAocGRmVyAvIE1hdGgubWF4KDEsIHZpZXdXaWR0aCkpICogMS41O1xuXG4gICAgLy8gRHJhdyBzdHJva2VzXG4gICAgZm9yIChjb25zdCBzIG9mIHN0cm9rZXMpIHtcbiAgICAgIGlmICghcy5wb2ludHMubGVuZ3RoKSBjb250aW51ZTtcbiAgICAgIGlmIChzLmlzSGlnaGxpZ2h0KSB7XG4gICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDAuNDtcbiAgICAgICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdtdWx0aXBseSc7XG4gICAgICB9XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzLmNvbG9yO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLnBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBwdCA9IHMucG9pbnRzW2ldO1xuICAgICAgICBjb25zdCB4ID0gcHQueCAqIG9mZi53aWR0aDtcbiAgICAgICAgY29uc3QgeSA9IHB0LnkgKiBvZmYuaGVpZ2h0O1xuICAgICAgICBjdHgubGluZVdpZHRoID0gdGhpcy5jYWxjTGluZVdpZHRoKHMuc2l6ZSwgcHQucCkgKiB0aGlja25lc3NTY2FsZTtcbiAgICAgICAgaWYgKGkgPT09IDApIGN0eC5tb3ZlVG8oeCwgeSk7XG4gICAgICAgIGVsc2UgY3R4LmxpbmVUbyh4LCB5KTtcbiAgICAgIH1cbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIGlmIChzLmlzSGlnaGxpZ2h0KSBjdHgucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIC8vIERyYXcgc2hhcGVzXG4gICAgZm9yIChjb25zdCBzaCBvZiBzaGFwZXMpIHtcbiAgICAgIGNvbnN0IHgxID0gc2guc3RhcnRYICogb2ZmLndpZHRoO1xuICAgICAgY29uc3QgeTEgPSBzaC5zdGFydFkgKiBvZmYuaGVpZ2h0O1xuICAgICAgY29uc3QgeDIgPSBzaC5lbmRYICogb2ZmLndpZHRoO1xuICAgICAgY29uc3QgeTIgPSBzaC5lbmRZICogb2ZmLmhlaWdodDtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHNoLmNvbG9yO1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IHNoLnNpemUgKiB0aGlja25lc3NTY2FsZTtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIHN3aXRjaCAoc2gudHlwZSkge1xuICAgICAgICBjYXNlICdyZWN0JzpcbiAgICAgICAgICBjdHgucmVjdCh4MSwgeTEsIHgyIC0geDEsIHkyIC0geTEpO1xuICAgICAgICAgIGlmIChzaC5maWxsQ29sb3IpIHsgY3R4LmZpbGxTdHlsZSA9IHNoLmZpbGxDb2xvcjsgY3R4LmZpbGwoKTsgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjaXJjbGUnOiB7XG4gICAgICAgICAgY29uc3QgY3ggPSAoeDEgKyB4MikgLyAyO1xuICAgICAgICAgIGNvbnN0IGN5ID0gKHkxICsgeTIpIC8gMjtcbiAgICAgICAgICBjb25zdCByeCA9IE1hdGguYWJzKHgyIC0geDEpIC8gMjtcbiAgICAgICAgICBjb25zdCByeSA9IE1hdGguYWJzKHkyIC0geTEpIC8gMjtcbiAgICAgICAgICBjdHguZWxsaXBzZShjeCwgY3ksIHJ4LCByeSwgMCwgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgICAgIGlmIChzaC5maWxsQ29sb3IpIHsgY3R4LmZpbGxTdHlsZSA9IHNoLmZpbGxDb2xvcjsgY3R4LmZpbGwoKTsgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2xpbmUnOiBjdHgubW92ZVRvKHgxLCB5MSk7IGN0eC5saW5lVG8oeDIsIHkyKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Fycm93Jzoge1xuICAgICAgICAgIGN0eC5tb3ZlVG8oeDEsIHkxKTsgY3R4LmxpbmVUbyh4MiwgeTIpO1xuICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICBjb25zdCBhbmdsZTIgPSBNYXRoLmF0YW4yKHkyIC0geTEsIHgyIC0geDEpO1xuICAgICAgICAgIGNvbnN0IGhlYWRMZW4gPSAxNSAqIHRoaWNrbmVzc1NjYWxlO1xuICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICBjdHgubW92ZVRvKHgyLCB5Mik7XG4gICAgICAgICAgY3R4LmxpbmVUbyh4MiAtIGhlYWRMZW4gKiBNYXRoLmNvcyhhbmdsZTIgLSBNYXRoLlBJIC8gNiksIHkyIC0gaGVhZExlbiAqIE1hdGguc2luKGFuZ2xlMiAtIE1hdGguUEkgLyA2KSk7XG4gICAgICAgICAgY3R4Lm1vdmVUbyh4MiwgeTIpO1xuICAgICAgICAgIGN0eC5saW5lVG8oeDIgLSBoZWFkTGVuICogTWF0aC5jb3MoYW5nbGUyICsgTWF0aC5QSSAvIDYpLCB5MiAtIGhlYWRMZW4gKiBNYXRoLnNpbihhbmdsZTIgKyBNYXRoLlBJIC8gNikpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG5cblxuICAgIGNvbnN0IGI2NCA9IG9mZi50b0RhdGFVUkwoJ2ltYWdlL3BuZycpLnNwbGl0KCcsJylbMV07XG4gICAgcmV0dXJuIFVpbnQ4QXJyYXkuZnJvbShhdG9iKGI2NCksIGMgPT4gYy5jaGFyQ29kZUF0KDApKTtcbiAgfVxuXG4gIC8vIEhlbHBlciB0byBtYXAgdmlzdWFsIHBlcmNlbnRhZ2UgY29vcmRpbmF0ZXMgdG8gcGh5c2ljYWwgUERGIGNvb3JkaW5hdGVzXG4gIHByaXZhdGUgZ2V0UGRmUGxhY2VtZW50KFxuICAgIHZ4UGVyY2VudDogbnVtYmVyLCB2eVBlcmNlbnQ6IG51bWJlciwgdndQZXJjZW50OiBudW1iZXIsIHZoUGVyY2VudDogbnVtYmVyLFxuICAgIHBhZ2VXaWR0aDogbnVtYmVyLCBwYWdlSGVpZ2h0OiBudW1iZXIsIHBhZ2VSb3RhdGlvbjogbnVtYmVyXG4gICkge1xuICAgIGNvbnN0IGlzUm90ID0gcGFnZVJvdGF0aW9uID09PSA5MCB8fCBwYWdlUm90YXRpb24gPT09IDI3MCB8fCBwYWdlUm90YXRpb24gPT09IC05MCB8fCBwYWdlUm90YXRpb24gPT09IC0yNzA7XG4gICAgLy8gdlcgYW5kIHZIIGFyZSB0aGUgZGltZW5zaW9ucyBvZiB0aGUgdmlzdWFsIGNhbnZhcyBwcmVzZW50ZWQgdG8gdGhlIHVzZXJcbiAgICAvLyBwZGYtbGliJ3MgZ2V0U2l6ZSgpIGdpdmVzIHVucm90YXRlZCBkaW1lbnNpb25zLiBJZiBpdCdzIHJvdGF0ZWQsIHRoZSB2aXN1YWwgd2lkdGggaXMgdGhlIHBhZ2UncyBIZWlnaHQsIGV0Yy5cbiAgICBjb25zdCB2VyA9IGlzUm90ID8gcGFnZUhlaWdodCA6IHBhZ2VXaWR0aDtcbiAgICBjb25zdCB2SCA9IGlzUm90ID8gcGFnZVdpZHRoIDogcGFnZUhlaWdodDtcblxuICAgIGNvbnN0IHZ4ID0gKHZ4UGVyY2VudCAvIDEwMCkgKiB2VztcbiAgICBjb25zdCB2eSA9ICh2eVBlcmNlbnQgLyAxMDApICogdkg7XG4gICAgY29uc3QgdncgPSAodndQZXJjZW50IC8gMTAwKSAqIHZXO1xuICAgIGNvbnN0IHZoID0gKHZoUGVyY2VudCAvIDEwMCkgKiB2SDtcblxuICAgIGxldCByb3REZWcgPSAwO1xuICAgIGxldCBweCA9IHZ4O1xuICAgIGxldCBweSA9IHBhZ2VIZWlnaHQgLSB2eSAtIHZoO1xuXG4gICAgLy8gVGhlIG1hcHBpbmcgaGFuZGxlcyBkcmF3aW5nIG9udG8gcGRmLWxpYiB3aGljaCB1c2VzIGJvdHRvbS1sZWZ0IG9yaWdpbi5cbiAgICBpZiAocGFnZVJvdGF0aW9uID09PSA5MCB8fCBwYWdlUm90YXRpb24gPT09IC0yNzApIHtcbiAgICAgIC8vIFBERiBwYWdlIGlzIHJvdGF0ZWQgOTAgQ1cgdmlzdWFsbHkuIFdlIGRyYXcgZWxlbWVudHMgOTAgQ0NXIHRvIGNvbXBlbnNhdGUgZm9yIHZpZXdlcnMgcm90YXRpbmcgaXQgbGF0ZXIuXG4gICAgICByb3REZWcgPSA5MDtcbiAgICAgIHB4ID0gdnkgKyB2aDtcbiAgICAgIHB5ID0gdng7XG4gICAgfSBlbHNlIGlmIChwYWdlUm90YXRpb24gPT09IDI3MCB8fCBwYWdlUm90YXRpb24gPT09IC05MCkge1xuICAgICAgLy8gUERGIHBhZ2UgaXMgcm90YXRlZCA5MCBDQ1cgdmlzdWFsbHkgKDI3MCBDVykuIFdlIGRyYXcgZWxlbWVudHMgOTAgQ1cgKC05MCkuXG4gICAgICByb3REZWcgPSAtOTA7XG4gICAgICBweCA9IHBhZ2VXaWR0aCAtICh2eSArIHZoKTtcbiAgICAgIHB5ID0gcGFnZUhlaWdodCAtIHZ4O1xuICAgIH0gZWxzZSBpZiAocGFnZVJvdGF0aW9uID09PSAxODAgfHwgcGFnZVJvdGF0aW9uID09PSAtMTgwKSB7XG4gICAgICAvLyBQREYgcGFnZSBpcyB1cHNpZGUgZG93bi4gV2UgZHJhdyBlbGVtZW50cyB1cHNpZGUgZG93biAoMTgwKS5cbiAgICAgIHJvdERlZyA9IDE4MDtcbiAgICAgIHB4ID0gcGFnZVdpZHRoIC0gdng7XG4gICAgICBweSA9IHBhZ2VIZWlnaHQgLSB2eTtcbiAgICB9XG5cbiAgICByZXR1cm4geyB4OiBweCwgeTogcHksIHdpZHRoOiB2dywgaGVpZ2h0OiB2aCwgcm90YXRlOiBkZWdyZWVzKHJvdERlZyksIHZXLCB2SCB9O1xuICB9XG5cbiAgYXN5bmMgc2F2ZURvY3VtZW50KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5iYXNlUGRmQnl0ZXMpIHJldHVybjtcbiAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5zYXZlUHJvZ3Jlc3MgPSAxO1xuICAgIHRoaXMubG9hZGluZ01lc3NhZ2UgPSAn4LiB4Liz4Lil4Lix4LiH4LmA4LiV4Lij4Li14Lii4Lih4LmA4Lit4LiB4Liq4Liy4LijLi4uJztcbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcGRmRG9jID0gYXdhaXQgUERGRG9jdW1lbnQubG9hZCh0aGlzLmJhc2VQZGZCeXRlcyk7XG4gICAgICBjb25zdCBmb250a2l0OiBhbnkgPSAoZm9udGtpdE1vZHVsZSBhcyBhbnkpLmRlZmF1bHQgfHwgKGZvbnRraXRNb2R1bGUgYXMgYW55KTtcbiAgICAgIHBkZkRvYy5yZWdpc3RlckZvbnRraXQoZm9udGtpdCk7XG4gICAgICBjb25zdCBmb250Qnl0ZXMgPSBhd2FpdCBmZXRjaCgnL2Fzc2V0cy9mb250cy9USFNhcmFidW5OZXcudHRmJykudGhlbihyID0+IHIuYXJyYXlCdWZmZXIoKSk7XG4gICAgICBjb25zdCB0aGFpRm9udCA9IGF3YWl0IHBkZkRvYy5lbWJlZEZvbnQoZm9udEJ5dGVzKTtcbiAgICAgIGNvbnN0IGJvbGRGb250Qnl0ZXMgPSBhd2FpdCBmZXRjaCgnL2Fzc2V0cy9mb250cy9USFNhcmFidW5OZXcgQm9sZC50dGYnKS50aGVuKHIgPT4gci5hcnJheUJ1ZmZlcigpKTtcbiAgICAgIGNvbnN0IHRoYWlGb250Qm9sZCA9IGF3YWl0IHBkZkRvYy5lbWJlZEZvbnQoYm9sZEZvbnRCeXRlcyk7XG4gICAgICBjb25zdCBwZGZQYWdlcyA9IHBkZkRvYy5nZXRQYWdlcygpO1xuXG4gICAgICAvLyBQcmUtYnVpbGQgYSBzZXQgb2YgcGFnZXMgdGhhdCBhY3R1YWxseSBoYXZlIGFubm90YXRpb25zIHRvIHNraXAgZW1wdHkgcGFnZXNcbiAgICAgIGNvbnN0IGFubm90YXRlZFBhZ2VOdW1zID0gbmV3IFNldDxudW1iZXI+KCk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnN0cm9rZXMpLmZvckVhY2gocCA9PiB7IGlmICgodGhpcy5zdHJva2VzWytwXT8ubGVuZ3RoIHx8IDApID4gMCkgYW5ub3RhdGVkUGFnZU51bXMuYWRkKCtwKTsgfSk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnNoYXBlcykuZm9yRWFjaChwID0+IHsgaWYgKCh0aGlzLnNoYXBlc1srcF0/Lmxlbmd0aCB8fCAwKSA+IDApIGFubm90YXRlZFBhZ2VOdW1zLmFkZCgrcCk7IH0pO1xuICAgICAgdGhpcy5zaGFwZVN0YW1wcy5mb3JFYWNoKHNzID0+IGFubm90YXRlZFBhZ2VOdW1zLmFkZChzcy5wYWdlKSk7XG4gICAgICB0aGlzLnRleHRCb3hlcy5mb3JFYWNoKHQgPT4gYW5ub3RhdGVkUGFnZU51bXMuYWRkKHQucGFnZSkpO1xuICAgICAgdGhpcy5pbWFnZVN0YW1wcy5mb3JFYWNoKGltZyA9PiBhbm5vdGF0ZWRQYWdlTnVtcy5hZGQoaW1nLnBhZ2UpKTtcbiAgICAgIHRoaXMuc2lnbmF0dXJlU3RhbXBzLmZvckVhY2gocyA9PiBhbm5vdGF0ZWRQYWdlTnVtcy5hZGQocy5wYWdlKSk7XG4gICAgICB0aGlzLmRhdGVTdGFtcHMuZm9yRWFjaChkID0+IGFubm90YXRlZFBhZ2VOdW1zLmFkZChkLnBhZ2UpKTtcblxuICAgICAgY29uc3QgYmF0Y2hTaXplID0gcGRmUGFnZXMubGVuZ3RoID4gMTAwID8gMjAgOiA1O1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBkZlBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHBhZ2VOdW0gPSBpICsgMTtcbiAgICAgICAgY29uc3QgcGFnZSA9IHBkZlBhZ2VzW2ldO1xuXG4gICAgICAgIC8vIEJhdGNoIFVJIHVwZGF0ZXMgZm9yIGxhcmdlIGRvY3VtZW50cyBpbnN0ZWFkIG9mIGV2ZXJ5IHBhZ2VcbiAgICAgICAgaWYgKGkgJSBiYXRjaFNpemUgPT09IDAgfHwgaSA9PT0gcGRmUGFnZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIHRoaXMuc2F2ZVByb2dyZXNzID0gTWF0aC5yb3VuZCgoKGkgKyAxKSAvIHBkZlBhZ2VzLmxlbmd0aCkgKiA2MCk7XG4gICAgICAgICAgdGhpcy5sb2FkaW5nTWVzc2FnZSA9IGDguIHguLPguKXguLHguIfguJvguKPguLDguKHguKfguKXguJzguKXguKvguJnguYnguLIgJHtpICsgMX0gLyAke3BkZlBhZ2VzLmxlbmd0aH1gO1xuICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2tpcCBwYWdlcyB3aXRoIG5vIGFubm90YXRpb25zIGVudGlyZWx5XG4gICAgICAgIGlmICghYW5ub3RhdGVkUGFnZU51bXMuaGFzKHBhZ2VOdW0pKSBjb250aW51ZTtcblxuICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHBhZ2UuZ2V0U2l6ZSgpO1xuICAgICAgICBjb25zdCBjYW52YXMgPSB0aGlzLmdldEFubm90Q2FudmFzKHBhZ2VOdW0pO1xuICAgICAgICBjb25zdCBjdyA9IGNhbnZhcyA/IGNhbnZhcy5jbGllbnRXaWR0aCA6IDgwMDtcbiAgICAgICAgY29uc3Qgcm90YXRpb25BbmdsZSA9IHRoaXMucGRmUGFnZVJvdGF0aW9ucy5nZXQocGFnZU51bSkgPz8gcGFnZS5nZXRSb3RhdGlvbigpLmFuZ2xlO1xuXG4gICAgICAgIGNvbnN0IGlzUm90ID0gcm90YXRpb25BbmdsZSA9PT0gOTAgfHwgcm90YXRpb25BbmdsZSA9PT0gMjcwIHx8IHJvdGF0aW9uQW5nbGUgPT09IC05MCB8fCByb3RhdGlvbkFuZ2xlID09PSAtMjcwO1xuICAgICAgICBjb25zdCB2VyA9IGlzUm90ID8gaGVpZ2h0IDogd2lkdGg7XG4gICAgICAgIGNvbnN0IHZIID0gaXNSb3QgPyB3aWR0aCA6IGhlaWdodDtcblxuICAgICAgICAvLyAxKSBEcmF3aW5ncyAocmFzdGVyaXplZCBQTkcgb3ZlcmxheSlcbiAgICAgICAgY29uc3QgaGFzU3Ryb2tlcyA9ICh0aGlzLnN0cm9rZXNbcGFnZU51bV0/Lmxlbmd0aCB8fCAwKSA+IDA7XG4gICAgICAgIGNvbnN0IGhhc1NoYXBlcyA9ICh0aGlzLnNoYXBlc1twYWdlTnVtXT8ubGVuZ3RoIHx8IDApID4gMDtcbiAgICAgICAgaWYgKGhhc1N0cm9rZXMgfHwgaGFzU2hhcGVzKSB7XG4gICAgICAgICAgY29uc3Qgb3ZlcmxheVBuZyA9IHRoaXMucmVuZGVyT3ZlcmxheVRvUG5nQnl0ZXMocGFnZU51bSwgdlcsIHZIKTtcbiAgICAgICAgICBjb25zdCBvdmVybGF5SW1nID0gYXdhaXQgcGRmRG9jLmVtYmVkUG5nKG92ZXJsYXlQbmcpO1xuICAgICAgICAgIGNvbnN0IHBsYWNlbWVudCA9IHRoaXMuZ2V0UGRmUGxhY2VtZW50KDAsIDAsIDEwMCwgMTAwLCB3aWR0aCwgaGVpZ2h0LCByb3RhdGlvbkFuZ2xlKTtcbiAgICAgICAgICBwYWdlLmRyYXdJbWFnZShvdmVybGF5SW1nLCB7IHg6IHBsYWNlbWVudC54LCB5OiBwbGFjZW1lbnQueSwgd2lkdGg6IHBsYWNlbWVudC53aWR0aCwgaGVpZ2h0OiBwbGFjZW1lbnQuaGVpZ2h0LCByb3RhdGU6IHBsYWNlbWVudC5yb3RhdGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0b1JnYiA9IChoZXg6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGlmICghaGV4IHx8IGhleCA9PT0gJ25vbmUnIHx8IGhleC5pbmNsdWRlcygncmdiYScpKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIGxldCBjbGVhbkhleCA9IGhleC5yZXBsYWNlKCcjJywgJycpO1xuICAgICAgICAgIGlmIChjbGVhbkhleC5sZW5ndGggPT09IDMpIGNsZWFuSGV4ID0gY2xlYW5IZXguc3BsaXQoJycpLm1hcChjID0+IGMgKyBjKS5qb2luKCcnKTtcbiAgICAgICAgICBpZiAoY2xlYW5IZXgubGVuZ3RoICE9PSA2KSByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIHJldHVybiByZ2IocGFyc2VJbnQoY2xlYW5IZXguc3Vic3RyaW5nKDAsIDIpLCAxNikgLyAyNTUsIHBhcnNlSW50KGNsZWFuSGV4LnN1YnN0cmluZygyLCA0KSwgMTYpIC8gMjU1LCBwYXJzZUludChjbGVhbkhleC5zdWJzdHJpbmcoNCwgNiksIDE2KSAvIDI1NSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gMS41KSBTaGFwZVN0YW1wcyDigJQgRHJhdyBuYXRpdmVseSBhcyBjcmlzcCBQREYgdmVjdG9yc1xuICAgICAgICBjb25zdCBzdGFtcHNGb3JQYWdlID0gdGhpcy5zaGFwZVN0YW1wcy5maWx0ZXIoc3MgPT4gc3MucGFnZSA9PT0gcGFnZU51bSk7XG4gICAgICAgIGZvciAoY29uc3Qgc3Mgb2Ygc3RhbXBzRm9yUGFnZSkge1xuICAgICAgICAgIGNvbnN0IHNzVmlld1cgPSBzcy52aWV3V2lkdGggJiYgc3Mudmlld1dpZHRoID4gMCA/IHNzLnZpZXdXaWR0aCA6IE1hdGgubWF4KDEsIGN3KTtcbiAgICAgICAgICBjb25zdCBzc1N0cm9rZVNjYWxlID0gdlcgLyBzc1ZpZXdXO1xuICAgICAgICAgIGNvbnN0IHBkZlN0cm9rZVcgPSBzcy5zdHJva2VXaWR0aCAqIHNzU3Ryb2tlU2NhbGU7XG5cbiAgICAgICAgICBjb25zdCBmaWxsQ29sb3IgPSBzcy5maWxsQ29sb3IgPyB0b1JnYihzcy5maWxsQ29sb3IpIDogdW5kZWZpbmVkO1xuICAgICAgICAgIGNvbnN0IHN0cm9rZUNvbG9yID0gKHNzLnN0cm9rZUNvbG9yICYmIHNzLnN0cm9rZUNvbG9yICE9PSAncmdiYSgwLDAsMCwwKScgJiYgc3Muc3Ryb2tlV2lkdGggPiAwKSA/IHRvUmdiKHNzLnN0cm9rZUNvbG9yKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGNvbnN0IHBsYWNlbWVudCA9IHRoaXMuZ2V0UGRmUGxhY2VtZW50KHNzLngsIHNzLnksIHNzLndpZHRoLCBzcy5oZWlnaHQsIHdpZHRoLCBoZWlnaHQsIHJvdGF0aW9uQW5nbGUpO1xuXG4gICAgICAgICAgaWYgKHNzLnR5cGUgPT09ICdyZWN0Jykge1xuICAgICAgICAgICAgcGFnZS5kcmF3UmVjdGFuZ2xlKHtcbiAgICAgICAgICAgICAgeDogcGxhY2VtZW50LngsXG4gICAgICAgICAgICAgIHk6IHBsYWNlbWVudC55LFxuICAgICAgICAgICAgICB3aWR0aDogcGxhY2VtZW50LndpZHRoLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHBsYWNlbWVudC5oZWlnaHQsXG4gICAgICAgICAgICAgIHJvdGF0ZTogcGxhY2VtZW50LnJvdGF0ZSxcbiAgICAgICAgICAgICAgY29sb3I6IGZpbGxDb2xvcixcbiAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IHN0cm9rZUNvbG9yLFxuICAgICAgICAgICAgICBib3JkZXJXaWR0aDogc3Ryb2tlQ29sb3IgPyBwZGZTdHJva2VXIDogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNzLnR5cGUgPT09ICdjaXJjbGUnKSB7XG4gICAgICAgICAgICBjb25zdCBjZW50ZXJQdCA9IHRoaXMuZ2V0UGRmUGxhY2VtZW50KHNzLnggKyBzcy53aWR0aCAvIDIsIHNzLnkgKyBzcy5oZWlnaHQgLyAyLCAwLCAwLCB3aWR0aCwgaGVpZ2h0LCByb3RhdGlvbkFuZ2xlKTtcbiAgICAgICAgICAgIHBhZ2UuZHJhd0VsbGlwc2Uoe1xuICAgICAgICAgICAgICB4OiBjZW50ZXJQdC54LFxuICAgICAgICAgICAgICB5OiBjZW50ZXJQdC55LFxuICAgICAgICAgICAgICB4U2NhbGU6IHBsYWNlbWVudC53aWR0aCAvIDIsXG4gICAgICAgICAgICAgIHlTY2FsZTogcGxhY2VtZW50LmhlaWdodCAvIDIsXG4gICAgICAgICAgICAgIGNvbG9yOiBmaWxsQ29sb3IsXG4gICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBzdHJva2VDb2xvcixcbiAgICAgICAgICAgICAgYm9yZGVyV2lkdGg6IHN0cm9rZUNvbG9yID8gcGRmU3Ryb2tlVyA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcy50eXBlID09PSAnbGluZScgfHwgc3MudHlwZSA9PT0gJ2Fycm93Jykge1xuICAgICAgICAgICAgY29uc3QgcHQxID0gdGhpcy5nZXRQZGZQbGFjZW1lbnQoc3MueCArIHNzLnN0YXJ0RnJhY1ggKiBzcy53aWR0aCwgc3MueSArIHNzLnN0YXJ0RnJhY1kgKiBzcy5oZWlnaHQsIDAsIDAsIHdpZHRoLCBoZWlnaHQsIHJvdGF0aW9uQW5nbGUpO1xuICAgICAgICAgICAgY29uc3QgcHQyID0gdGhpcy5nZXRQZGZQbGFjZW1lbnQoc3MueCArIHNzLmVuZEZyYWNYICogc3Mud2lkdGgsIHNzLnkgKyBzcy5lbmRGcmFjWSAqIHNzLmhlaWdodCwgMCwgMCwgd2lkdGgsIGhlaWdodCwgcm90YXRpb25BbmdsZSk7XG5cbiAgICAgICAgICAgIHBhZ2UuZHJhd0xpbmUoe1xuICAgICAgICAgICAgICBzdGFydDogeyB4OiBwdDEueCwgeTogcHQxLnkgfSxcbiAgICAgICAgICAgICAgZW5kOiB7IHg6IHB0Mi54LCB5OiBwdDIueSB9LFxuICAgICAgICAgICAgICBjb2xvcjogc3Ryb2tlQ29sb3IgfHwgcmdiKDAsIDAsIDApLFxuICAgICAgICAgICAgICB0aGlja25lc3M6IHN0cm9rZUNvbG9yID8gcGRmU3Ryb2tlVyA6IDFcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoc3MudHlwZSA9PT0gJ2Fycm93Jykge1xuICAgICAgICAgICAgICBjb25zdCBoZWFkTGVuID0gMTUgKiBzc1N0cm9rZVNjYWxlO1xuICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguYXRhbjIocHQyLnkgLSBwdDEueSwgcHQyLnggLSBwdDEueCk7XG4gICAgICAgICAgICAgIHBhZ2UuZHJhd0xpbmUoe1xuICAgICAgICAgICAgICAgIHN0YXJ0OiB7IHg6IHB0Mi54LCB5OiBwdDIueSB9LFxuICAgICAgICAgICAgICAgIGVuZDogeyB4OiBwdDIueCAtIGhlYWRMZW4gKiBNYXRoLmNvcyhhbmdsZSAtIE1hdGguUEkgLyA2KSwgeTogcHQyLnkgLSBoZWFkTGVuICogTWF0aC5zaW4oYW5nbGUgLSBNYXRoLlBJIC8gNikgfSxcbiAgICAgICAgICAgICAgICBjb2xvcjogc3Ryb2tlQ29sb3IgfHwgcmdiKDAsIDAsIDApLFxuICAgICAgICAgICAgICAgIHRoaWNrbmVzczogc3Ryb2tlQ29sb3IgPyBwZGZTdHJva2VXIDogMVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcGFnZS5kcmF3TGluZSh7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IHsgeDogcHQyLngsIHk6IHB0Mi55IH0sXG4gICAgICAgICAgICAgICAgZW5kOiB7IHg6IHB0Mi54IC0gaGVhZExlbiAqIE1hdGguY29zKGFuZ2xlICsgTWF0aC5QSSAvIDYpLCB5OiBwdDIueSAtIGhlYWRMZW4gKiBNYXRoLnNpbihhbmdsZSArIE1hdGguUEkgLyA2KSB9LFxuICAgICAgICAgICAgICAgIGNvbG9yOiBzdHJva2VDb2xvciB8fCByZ2IoMCwgMCwgMCksXG4gICAgICAgICAgICAgICAgdGhpY2tuZXNzOiBzdHJva2VDb2xvciA/IHBkZlN0cm9rZVcgOiAxXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDIpIFRleHRCb3hlcyDigJQgcmVuZGVyIG5hdGl2ZWx5IHNvIHRleHQgcmVtYWlucyBzZWxlY3RhYmxlIGluIHRoZSBmaW5hbCBQREZcbiAgICAgICAgY29uc3QgdGV4dEZvclBhZ2UgPSB0aGlzLnRleHRCb3hlcy5maWx0ZXIodCA9PiB0LnBhZ2UgPT09IHBhZ2VOdW0pO1xuICAgICAgICBmb3IgKGNvbnN0IHRiIG9mIHRleHRGb3JQYWdlKSB7XG4gICAgICAgICAgaWYgKCF0Yi50ZXh0LnRyaW0oKSkgY29udGludWU7XG5cbiAgICAgICAgICBjb25zdCBmb250VG9Vc2UgPSAodGIuYm9sZCB8fCB0Yi5pdGFsaWMpID8gdGhhaUZvbnRCb2xkIDogdGhhaUZvbnQ7XG4gICAgICAgICAgY29uc3QgY29sb3JIZXggPSB0Yi5jb2xvciB8fCAnIzAwMDBmZic7XG4gICAgICAgICAgY29uc3QgdHh0Q29sb3IgPSB0b1JnYihjb2xvckhleCkgfHwgcmdiKDAsIDAsIDEpO1xuXG4gICAgICAgICAgY29uc3QgbGluZXMgPSB0Yi50ZXh0LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICBjb25zdCBsaW5lSGVpZ2h0ID0gdGIuZm9udFNpemUgKiAxLjQ7XG5cbiAgICAgICAgICAvLyBDb21wZW5zYXRlIGZvciB0ZXh0YXJlYSBDU1MgcGFkZGluZyAoMnB4IHRvcCwgNHB4IGxlZnQpIHNvIFBERiBtYXRjaGVzIHNjcmVlblxuICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuZ2V0QW5ub3RDYW52YXMocGFnZU51bSk7XG4gICAgICAgICAgY29uc3QgY2FudmFzQ1cgPSBjYW52YXMgPyBjYW52YXMuY2xpZW50V2lkdGggOiA4MDA7XG4gICAgICAgICAgY29uc3QgY2FudmFzQ0ggPSBjYW52YXMgPyBjYW52YXMuY2xpZW50SGVpZ2h0IDogMTAwMDtcbiAgICAgICAgICBjb25zdCBwYWRMZWZ0UGN0ID0gKDQgLyBjYW52YXNDVykgKiAxMDA7IC8vIDRweCBsZWZ0IHBhZGRpbmcg4oaSICVcbiAgICAgICAgICBjb25zdCBwYWRUb3BQY3QgID0gKDIgLyBjYW52YXNDSCkgKiAxMDA7IC8vIDJweCB0b3AgcGFkZGluZyAg4oaSICVcblxuICAgICAgICAgIGNvbnN0IG1heFcgPSAodGIud2lkdGggLyAxMDApICogdlc7XG4gICAgICAgICAgLy8gc2hpZnQgWCBieSBwYWRMZWZ0LCBzaGlmdCBZIGRvd24gYnkgcGFkVG9wXG4gICAgICAgICAgY29uc3QgdGV4dFN0YXJ0WFBjdCA9IHRiLnggKyBwYWRMZWZ0UGN0O1xuICAgICAgICAgIGxldCBjdXJyZW50VmlzdWFsWSA9ICgodGIueSArIHBhZFRvcFBjdCkgLyAxMDApICogdkg7XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IHBhcmEgb2YgbGluZXMpIHtcbiAgICAgICAgICAgIGlmICghcGFyYSkge1xuICAgICAgICAgICAgICBjdXJyZW50VmlzdWFsWSArPSBsaW5lSGVpZ2h0O1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHBhcmFXb3Jkczogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgSW50bCAhPT0gJ3VuZGVmaW5lZCcgJiYgKEludGwgYXMgYW55KS5TZWdtZW50ZXIpIHtcbiAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudGVyID0gbmV3IChJbnRsIGFzIGFueSkuU2VnbWVudGVyKCd0aCcsIHsgZ3JhbnVsYXJpdHk6ICd3b3JkJyB9KTtcbiAgICAgICAgICAgICAgcGFyYVdvcmRzID0gQXJyYXkuZnJvbShzZWdtZW50ZXIuc2VnbWVudChwYXJhKSkubWFwKChzOiBhbnkpID0+IHMuc2VnbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBwYXJ0cyA9IHBhcmEuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBhcmFXb3Jkcy5wdXNoKHBhcnRzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IHBhcnRzLmxlbmd0aCAtIDEpIHBhcmFXb3Jkcy5wdXNoKCcgJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGxpbmUgPSAnJztcbiAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBwYXJhV29yZHMpIHtcbiAgICAgICAgICAgICAgY29uc3QgdGVzdExpbmUgPSBsaW5lICsgd29yZDtcbiAgICAgICAgICAgICAgY29uc3QgdGV4dFdpZHRoID0gZm9udFRvVXNlLndpZHRoT2ZUZXh0QXRTaXplKHRlc3RMaW5lLCB0Yi5mb250U2l6ZSk7XG4gICAgICAgICAgICAgIGlmICh0ZXh0V2lkdGggPiBtYXhXICYmIGxpbmUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYWxpZ25YVmlzdWFsID0gKHRleHRTdGFydFhQY3QgLyAxMDApICogdlc7XG4gICAgICAgICAgICAgICAgY29uc3QgZmluYWxMaW5lV2lkdGggPSBmb250VG9Vc2Uud2lkdGhPZlRleHRBdFNpemUobGluZSwgdGIuZm9udFNpemUpO1xuICAgICAgICAgICAgICAgIGlmICh0Yi5hbGlnbiA9PT0gJ2NlbnRlcicpIGFsaWduWFZpc3VhbCArPSAobWF4VyAvIDIpIC0gKGZpbmFsTGluZVdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgaWYgKHRiLmFsaWduID09PSAncmlnaHQnKSBhbGlnblhWaXN1YWwgKz0gbWF4VyAtIGZpbmFsTGluZVdpZHRoO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYmFzZWxpbmVWaXN1YWxZID0gY3VycmVudFZpc3VhbFkgKyAodGIuZm9udFNpemUgKiAwLjk1KTtcbiAgICAgICAgICAgICAgICBjb25zdCBwdCA9IHRoaXMuZ2V0UGRmUGxhY2VtZW50KChhbGlnblhWaXN1YWwgLyB2VykgKiAxMDAsIChiYXNlbGluZVZpc3VhbFkgLyB2SCkgKiAxMDAsIDAsIDAsIHdpZHRoLCBoZWlnaHQsIHJvdGF0aW9uQW5nbGUpO1xuXG4gICAgICAgICAgICAgICAgcGFnZS5kcmF3VGV4dChsaW5lLCB7XG4gICAgICAgICAgICAgICAgICB4OiBwdC54LFxuICAgICAgICAgICAgICAgICAgeTogcHQueSxcbiAgICAgICAgICAgICAgICAgIHNpemU6IHRiLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgICAgZm9udDogZm9udFRvVXNlLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IHR4dENvbG9yLFxuICAgICAgICAgICAgICAgICAgcm90YXRlOiBwdC5yb3RhdGVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGxpbmUgPSB3b3JkLnJlcGxhY2UoL15cXHMrLywgJycpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRWaXN1YWxZICs9IGxpbmVIZWlnaHQ7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGluZSA9IHRlc3RMaW5lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGluZSkge1xuICAgICAgICAgICAgICBsZXQgYWxpZ25YVmlzdWFsID0gKHRleHRTdGFydFhQY3QgLyAxMDApICogdlc7XG4gICAgICAgICAgICAgIGNvbnN0IGZpbmFsTGluZVdpZHRoID0gZm9udFRvVXNlLndpZHRoT2ZUZXh0QXRTaXplKGxpbmUsIHRiLmZvbnRTaXplKTtcbiAgICAgICAgICAgICAgaWYgKHRiLmFsaWduID09PSAnY2VudGVyJykgYWxpZ25YVmlzdWFsICs9IChtYXhXIC8gMikgLSAoZmluYWxMaW5lV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgaWYgKHRiLmFsaWduID09PSAncmlnaHQnKSBhbGlnblhWaXN1YWwgKz0gbWF4VyAtIGZpbmFsTGluZVdpZHRoO1xuXG4gICAgICAgICAgICAgIGNvbnN0IGJhc2VsaW5lVmlzdWFsWSA9IGN1cnJlbnRWaXN1YWxZICsgKHRiLmZvbnRTaXplICogMC45NSk7XG4gICAgICAgICAgICAgIGNvbnN0IHB0ID0gdGhpcy5nZXRQZGZQbGFjZW1lbnQoKGFsaWduWFZpc3VhbCAvIHZXKSAqIDEwMCwgKGJhc2VsaW5lVmlzdWFsWSAvIHZIKSAqIDEwMCwgMCwgMCwgd2lkdGgsIGhlaWdodCwgcm90YXRpb25BbmdsZSk7XG5cbiAgICAgICAgICAgICAgcGFnZS5kcmF3VGV4dChsaW5lLCB7XG4gICAgICAgICAgICAgICAgeDogcHQueCxcbiAgICAgICAgICAgICAgICB5OiBwdC55LFxuICAgICAgICAgICAgICAgIHNpemU6IHRiLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgIGZvbnQ6IGZvbnRUb1VzZSxcbiAgICAgICAgICAgICAgICBjb2xvcjogdHh0Q29sb3IsXG4gICAgICAgICAgICAgICAgcm90YXRlOiBwdC5yb3RhdGVcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGN1cnJlbnRWaXN1YWxZICs9IGxpbmVIZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICAvLyAzKSBJbWFnZSBTdGFtcHNcbiAgICAgICAgY29uc3QgaW1nRm9yUGFnZSA9IHRoaXMuaW1hZ2VTdGFtcHMuZmlsdGVyKGltZyA9PiBpbWcucGFnZSA9PT0gcGFnZU51bSk7XG4gICAgICAgIGZvciAoY29uc3QgaW1nIG9mIGltZ0ZvclBhZ2UpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gRW5zdXJlIFBORyAobm9ybWFsaXplSW1hZ2VUb1BuZyBndWFyYW50ZWVzIHRoaXMgZm9yIG5ld2x5IGFkZGVkIHN0YW1wcztcbiAgICAgICAgICAgIC8vIGZhbGwgYmFjayB0byBjYW52YXMgY29udmVyc2lvbiBmb3IgYW55IGxlZ2FjeSBzdGFtcHMgc2F2ZWQgYXMgSlBFRylcbiAgICAgICAgICAgIGNvbnN0IHBuZ1VybCA9IGltZy5kYXRhVXJsLnN0YXJ0c1dpdGgoJ2RhdGE6aW1hZ2UvcG5nJylcbiAgICAgICAgICAgICAgPyBpbWcuZGF0YVVybFxuICAgICAgICAgICAgICA6IGF3YWl0IHRoaXMubm9ybWFsaXplSW1hZ2VUb1BuZyhpbWcuZGF0YVVybCk7XG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IFVpbnQ4QXJyYXkuZnJvbShhdG9iKHBuZ1VybC5zcGxpdCgnLCcpWzFdKSwgYyA9PiBjLmNoYXJDb2RlQXQoMCkpO1xuICAgICAgICAgICAgY29uc3QgZW1iZWRkZWQgPSBhd2FpdCBwZGZEb2MuZW1iZWRQbmcoYnl0ZXMpO1xuXG4gICAgICAgICAgICBjb25zdCBwbGFjZW1lbnQgPSB0aGlzLmdldFBkZlBsYWNlbWVudChpbWcueCwgaW1nLnksIGltZy53aWR0aCwgaW1nLmhlaWdodCwgd2lkdGgsIGhlaWdodCwgcm90YXRpb25BbmdsZSk7XG4gICAgICAgICAgICBwYWdlLmRyYXdJbWFnZShlbWJlZGRlZCwgeyB4OiBwbGFjZW1lbnQueCwgeTogcGxhY2VtZW50LnksIHdpZHRoOiBwbGFjZW1lbnQud2lkdGgsIGhlaWdodDogcGxhY2VtZW50LmhlaWdodCwgcm90YXRlOiBwbGFjZW1lbnQucm90YXRlIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgY29uc29sZS5lcnJvcihlKTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gNCkgU2lnbmF0dXJlc1xuICAgICAgICBjb25zdCBzaWdGb3JQYWdlID0gdGhpcy5zaWduYXR1cmVTdGFtcHMuZmlsdGVyKHMgPT4gcy5wYWdlID09PSBwYWdlTnVtKTtcbiAgICAgICAgZm9yIChjb25zdCBzaWcgb2Ygc2lnRm9yUGFnZSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IFVpbnQ4QXJyYXkuZnJvbShhdG9iKHNpZy5kYXRhVXJsLnNwbGl0KCcsJylbMV0pLCBjID0+IGMuY2hhckNvZGVBdCgwKSk7XG4gICAgICAgICAgICBjb25zdCBlbWJlZGRlZCA9IGF3YWl0IHBkZkRvYy5lbWJlZFBuZyhieXRlcyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBsYWNlbWVudCA9IHRoaXMuZ2V0UGRmUGxhY2VtZW50KHNpZy54LCBzaWcueSwgc2lnLndpZHRoLCBzaWcuaGVpZ2h0LCB3aWR0aCwgaGVpZ2h0LCByb3RhdGlvbkFuZ2xlKTtcbiAgICAgICAgICAgIHBhZ2UuZHJhd0ltYWdlKGVtYmVkZGVkLCB7IHg6IHBsYWNlbWVudC54LCB5OiBwbGFjZW1lbnQueSwgd2lkdGg6IHBsYWNlbWVudC53aWR0aCwgaGVpZ2h0OiBwbGFjZW1lbnQuaGVpZ2h0LCByb3RhdGU6IHBsYWNlbWVudC5yb3RhdGUgfSk7XG5cbiAgICAgICAgICAgIC8vIERyYXcgRGlnaXRhbCBJRCB0ZXh0IHRvIHRoZSByaWdodCBvZiBzaWduYXR1cmUgKHZlcnRpY2FsbHkgY2VudGVyZWQpXG4gICAgICAgICAgICBpZiAodGhpcy5zaG93RGlnaXRhbElkICYmIChzaWcuZGlnaXRhbElkIHx8IHNpZy5zaWduRGF0ZSkpIHtcbiAgICAgICAgICAgICAgY29uc3QgaWRGb250U2l6ZSA9IDg7XG4gICAgICAgICAgICAgIGNvbnN0IGlkTGluZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICAgIGlmIChzaWcuc2lnbkRhdGUpIGlkTGluZXMucHVzaChzaWcuc2lnbkRhdGUpO1xuICAgICAgICAgICAgICBpZiAoc2lnLnNpZ25UaW1lKSBpZExpbmVzLnB1c2goc2lnLnNpZ25UaW1lKTtcbiAgICAgICAgICAgICAgaWYgKHNpZy5kaWdpdGFsSWQpIGlkTGluZXMucHVzaChzaWcuZGlnaXRhbElkKTtcblxuICAgICAgICAgICAgICBjb25zdCBsaW5lSGVpZ2h0ID0gaWRGb250U2l6ZSArIDI7XG4gICAgICAgICAgICAgIGNvbnN0IHRvdGFsVGV4dEhlaWdodCA9IGlkTGluZXMubGVuZ3RoICogbGluZUhlaWdodDtcblxuICAgICAgICAgICAgICBjb25zdCB0ZXh0VmlzdWFsWFBjdCA9IHNpZy54ICsgc2lnLndpZHRoICsgKDQgLyB2VyAqIDEwMCk7XG4gICAgICAgICAgICAgIGNvbnN0IHRleHRTdGFydFlQY3QgPSBzaWcueSArIChzaWcuaGVpZ2h0IC8gMikgLSAoKHRvdGFsVGV4dEhlaWdodCAvIDIpIC8gdkggKiAxMDApO1xuXG4gICAgICAgICAgICAgIGZvciAobGV0IGxpID0gMDsgbGkgPCBpZExpbmVzLmxlbmd0aDsgbGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVCYXNlbGluZVZQY3QgPSB0ZXh0U3RhcnRZUGN0ICsgKChsaSAqIGxpbmVIZWlnaHQgKyBpZEZvbnRTaXplKSAvIHZIICogMTAwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwdCA9IHRoaXMuZ2V0UGRmUGxhY2VtZW50KHRleHRWaXN1YWxYUGN0LCBsaW5lQmFzZWxpbmVWUGN0LCAwLCAwLCB3aWR0aCwgaGVpZ2h0LCByb3RhdGlvbkFuZ2xlKTtcblxuICAgICAgICAgICAgICAgIHBhZ2UuZHJhd1RleHQoaWRMaW5lc1tsaV0sIHtcbiAgICAgICAgICAgICAgICAgIHg6IHB0LngsXG4gICAgICAgICAgICAgICAgICB5OiBwdC55LFxuICAgICAgICAgICAgICAgICAgc2l6ZTogaWRGb250U2l6ZSxcbiAgICAgICAgICAgICAgICAgIGZvbnQ6IHRoYWlGb250LFxuICAgICAgICAgICAgICAgICAgY29sb3I6IHJnYigwLjIsIDAuMiwgMC4yKSxcbiAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEuMCxcbiAgICAgICAgICAgICAgICAgIHJvdGF0ZTogcHQucm90YXRlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoZSk7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDUpIERhdGUgU3RhbXBzXG4gICAgICAgIGNvbnN0IGRhdGVGb3JQYWdlID0gdGhpcy5kYXRlU3RhbXBzLmZpbHRlcihkID0+IGQucGFnZSA9PT0gcGFnZU51bSk7XG4gICAgICAgIGZvciAoY29uc3QgZHMgb2YgZGF0ZUZvclBhZ2UpIHtcbiAgICAgICAgICBjb25zdCBoZXggPSBkcy5jb2xvci5yZXBsYWNlKCcjJywgJycpO1xuICAgICAgICAgIGNvbnN0IHIgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDAsIDIpLCAxNikgLyAyNTU7XG4gICAgICAgICAgY29uc3QgZyA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMiwgNCksIDE2KSAvIDI1NTtcbiAgICAgICAgICBjb25zdCBiID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg0LCA2KSwgMTYpIC8gMjU1O1xuXG4gICAgICAgICAgY29uc3QgYmFzZWxpbmVWUGN0ID0gZHMueSArIChkcy5mb250U2l6ZSAvIHZIICogMTAwKTtcbiAgICAgICAgICBjb25zdCBwdCA9IHRoaXMuZ2V0UGRmUGxhY2VtZW50KGRzLngsIGJhc2VsaW5lVlBjdCwgMCwgMCwgd2lkdGgsIGhlaWdodCwgcm90YXRpb25BbmdsZSk7XG5cbiAgICAgICAgICBwYWdlLmRyYXdUZXh0KGRzLnRleHQsIHtcbiAgICAgICAgICAgIHg6IHB0LngsIHk6IHB0LnksIHNpemU6IGRzLmZvbnRTaXplLCBmb250OiB0aGFpRm9udCxcbiAgICAgICAgICAgIGNvbG9yOiByZ2IociwgZywgYiksIG9wYWNpdHk6IDEuMCwgcm90YXRlOiBwdC5yb3RhdGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICAgIC8vIEJha2UgUERGIEFjcm9Gb3JtIGZpZWxkcyAoaW50ZXJhY3RpdmUgdGV4dC9jaGVja2JveC9yYWRpbylcbiAgICAgIGlmICh0aGlzLnBkZkZvcm1GaWVsZHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBmb3JtID0gcGRmRG9jLmdldEZvcm0oKTtcbiAgICAgICAgZm9yIChjb25zdCBmZiBvZiB0aGlzLnBkZkZvcm1GaWVsZHMpIHtcbiAgICAgICAgICBjb25zdCBwZ0lkeCA9IGZmLnBhZ2UgLSAxO1xuICAgICAgICAgIGlmIChwZ0lkeCA8IDAgfHwgcGdJZHggPj0gcGRmUGFnZXMubGVuZ3RoKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBwZGZQYWdlID0gcGRmUGFnZXNbcGdJZHhdO1xuICAgICAgICAgIGNvbnN0IHsgd2lkdGg6IHBnVywgaGVpZ2h0OiBwZ0ggfSA9IHBkZlBhZ2UuZ2V0U2l6ZSgpO1xuICAgICAgICAgIGNvbnN0IHJvdEFuZ2xlID0gdGhpcy5wZGZQYWdlUm90YXRpb25zLmdldChmZi5wYWdlKSA/PyBwZGZQYWdlLmdldFJvdGF0aW9uKCkuYW5nbGU7XG4gICAgICAgICAgY29uc3QgaXNSb3RhdGVkID0gcm90QW5nbGUgPT09IDkwIHx8IHJvdEFuZ2xlID09PSAyNzAgfHwgcm90QW5nbGUgPT09IC05MCB8fCByb3RBbmdsZSA9PT0gLTI3MDtcbiAgICAgICAgICBjb25zdCB2VyA9IGlzUm90YXRlZCA/IHBnSCA6IHBnVztcbiAgICAgICAgICBjb25zdCB2SCA9IGlzUm90YXRlZCA/IHBnVyA6IHBnSDtcblxuICAgICAgICAgIGNvbnN0IGZ4ID0gKGZmLnggLyAxMDApICogdlc7XG4gICAgICAgICAgY29uc3QgZncgPSAoZmYud2lkdGggLyAxMDApICogdlc7XG4gICAgICAgICAgY29uc3QgZmggPSAoZmYuaGVpZ2h0IC8gMTAwKSAqIHZIO1xuICAgICAgICAgIGNvbnN0IGZ5ID0gcGdIIC0gKGZmLnkgLyAxMDApICogdkggLSBmaDtcblxuICAgICAgICAgIGNvbnN0IGJvcmRlclcgPSAoZmYuYm9yZGVyVmlzaWJsZSA/PyB0cnVlKSA/IDEgOiAwO1xuICAgICAgICAgIGNvbnN0IG9wdHM6IGFueSA9IHtcbiAgICAgICAgICAgIHg6IGZ4LCB5OiBmeSwgd2lkdGg6IGZ3LCBoZWlnaHQ6IGZoLFxuICAgICAgICAgICAgYm9yZGVyV2lkdGg6IGJvcmRlclcsXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogYm9yZGVyVyA/IHJnYigwLCAwLCAwKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogcmdiKDEsIDEsIDEpLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGZmLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICBjb25zdCB0ZiA9IGZvcm0uY3JlYXRlVGV4dEZpZWxkKGZmLmZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgIHRmLmFkZFRvUGFnZShwZGZQYWdlLCBvcHRzKTtcbiAgICAgICAgICAgICAgaWYgKGZmLmZvbnRTaXplKSB0Zi5zZXRGb250U2l6ZShmZi5mb250U2l6ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZmLnR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgICAgY29uc3QgY2IgPSBmb3JtLmNyZWF0ZUNoZWNrQm94KGZmLmZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgIGNiLmFkZFRvUGFnZShwZGZQYWdlLCBvcHRzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmYudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgICBsZXQgcmc6IGFueTtcbiAgICAgICAgICAgICAgdHJ5IHsgcmcgPSBmb3JtLmdldFJhZGlvR3JvdXAoZmYucmFkaW9Hcm91cE5hbWUhKTsgfSBjYXRjaCB7IHJnID0gZm9ybS5jcmVhdGVSYWRpb0dyb3VwKGZmLnJhZGlvR3JvdXBOYW1lISk7IH1cbiAgICAgICAgICAgICAgcmcuYWRkT3B0aW9uVG9QYWdlKGZmLmlkLCBwZGZQYWdlLCBvcHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChmb3JtRXJyKSB7IGNvbnNvbGUud2FybignRm9ybSBmaWVsZCBlcnJvcjonLCBmb3JtRXJyKTsgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2F2ZVByb2dyZXNzID0gNjE7XG4gICAgICB0aGlzLmxvYWRpbmdNZXNzYWdlID0gJ+C4geC4s+C4peC4seC4hyBTZXJpYWxpemUgUERGLi4uJztcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCA4MCkpO1xuXG4gICAgICB0aGlzLnJldk5vICs9IDE7XG4gICAgICBjb25zdCBwZGZCeXRlcyA9IGF3YWl0IHBkZkRvYy5zYXZlKHsgb2JqZWN0c1BlclRpY2s6IDIwIH0pO1xuXG4gICAgICB0aGlzLmxhc3RTYXZlZEJsb2IgPSBuZXcgQmxvYihbcGRmQnl0ZXMgYXMgYW55XSwgeyB0eXBlOiAnYXBwbGljYXRpb24vcGRmJyB9KTtcblxuICAgICAgLy8gVXNlIG9yaWdpbmFsIGZpbGVuYW1lIGlmIHByb3ZpZGVkLCBvdGhlcndpc2UgZGVmYXVsdCB0byBcImFubm90YXRlZF9yZXYuLi5cIlxuICAgICAgaWYgKHRoaXMuZmlsZU5hbWUpIHtcbiAgICAgICAgdGhpcy5sYXN0U2F2ZWRGaWxlTmFtZSA9IHRoaXMuZmlsZU5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxhc3RTYXZlZEZpbGVOYW1lID0gYGFubm90YXRlZF9yZXYke3RoaXMucmV2Tm99XyR7RGF0ZS5ub3coKX0ucGRmYDtcbiAgICAgIH1cblxuICAgICAgLy8gQ3JlYXRlIHByZXZpZXcgdXNpbmcgcGRmLmpzIHRvIHJlbmRlciBwYWdlcyBhcyBpbWFnZXNcbiAgICAgIGF3YWl0IHRoaXMuZ2VuZXJhdGVQcmV2aWV3UGFnZXMoKTtcbiAgICAgIHRoaXMuc2hvd1ByZXZpZXdPdmVybGF5ID0gdHJ1ZTtcblxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB0aGlzLnByZXNlbnRUb2FzdCgn4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiU4LmD4LiZ4LiB4Liy4Lij4Lia4Lix4LiZ4LiX4Li24LiB4LmA4Lit4LiB4Liq4Liy4LijJyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmxvYWRpbmdNZXNzYWdlID0gJyc7XG4gICAgICB0aGlzLnNhdmVQcm9ncmVzcyA9IDA7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2VuZXJhdGVQcmV2aWV3UGFnZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLmxhc3RTYXZlZEJsb2IpIHJldHVybjtcblxuICAgIHRoaXMucHJldmlld1BhZ2VzID0gW107XG4gICAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCB0aGlzLmxhc3RTYXZlZEJsb2IuYXJyYXlCdWZmZXIoKTtcbiAgICBjb25zdCBwZGZEb2MgPSBhd2FpdCBwZGZqc0xpYi5nZXREb2N1bWVudCh7IGRhdGE6IGFycmF5QnVmZmVyIH0pLnByb21pc2U7XG4gICAgY29uc3QgdG90YWwgPSBwZGZEb2MubnVtUGFnZXM7XG5cbiAgICB0aGlzLnByZXZpZXdUb3RhbFBhZ2VzID0gdG90YWw7XG5cbiAgICAvLyBGb3IgbGFyZ2UgZG9jdW1lbnRzIHJlbmRlciBvbmx5IGFubm90YXRlZCBwYWdlcywgbm90IGFsbCBwYWdlc1xuICAgIGxldCBwYWdlc1RvUmVuZGVyOiBudW1iZXJbXTtcbiAgICBpZiAodG90YWwgPiA1MCkge1xuICAgICAgY29uc3QgYW5ub3RhdGVkID0gbmV3IFNldDxudW1iZXI+KCk7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnN0cm9rZXMpLmZvckVhY2gocCA9PiB7IGlmICgodGhpcy5zdHJva2VzWytwXT8ubGVuZ3RoIHx8IDApID4gMCkgYW5ub3RhdGVkLmFkZCgrcCk7IH0pO1xuICAgICAgT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmZvckVhY2gocCA9PiB7IGlmICgodGhpcy5zaGFwZXNbK3BdPy5sZW5ndGggfHwgMCkgPiAwKSBhbm5vdGF0ZWQuYWRkKCtwKTsgfSk7XG4gICAgICB0aGlzLnNoYXBlU3RhbXBzLmZvckVhY2goc3MgPT4gYW5ub3RhdGVkLmFkZChzcy5wYWdlKSk7XG4gICAgICB0aGlzLnRleHRCb3hlcy5mb3JFYWNoKHQgPT4gYW5ub3RhdGVkLmFkZCh0LnBhZ2UpKTtcbiAgICAgIHRoaXMuaW1hZ2VTdGFtcHMuZm9yRWFjaChpbWcgPT4gYW5ub3RhdGVkLmFkZChpbWcucGFnZSkpO1xuICAgICAgdGhpcy5zaWduYXR1cmVTdGFtcHMuZm9yRWFjaChzID0+IGFubm90YXRlZC5hZGQocy5wYWdlKSk7XG4gICAgICB0aGlzLmRhdGVTdGFtcHMuZm9yRWFjaChkID0+IGFubm90YXRlZC5hZGQoZC5wYWdlKSk7XG4gICAgICBwYWdlc1RvUmVuZGVyID0gYW5ub3RhdGVkLnNpemUgPiAwID8gQXJyYXkuZnJvbShhbm5vdGF0ZWQpLnNvcnQoKGEsIGIpID0+IGEgLSBiKSA6IFsxXTtcbiAgICAgIHRoaXMucHJldmlld0lzRmlsdGVyZWQgPSBwYWdlc1RvUmVuZGVyLmxlbmd0aCA8IHRvdGFsO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYWdlc1RvUmVuZGVyID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogdG90YWwgfSwgKF8sIGkpID0+IGkgKyAxKTtcbiAgICAgIHRoaXMucHJldmlld0lzRmlsdGVyZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBwYWdlc1RvUmVuZGVyLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGNvbnN0IHBhZ2VOdW0gPSBwYWdlc1RvUmVuZGVyW2lkeF07XG4gICAgICBjb25zdCBwYWdlID0gYXdhaXQgcGRmRG9jLmdldFBhZ2UocGFnZU51bSk7XG4gICAgICBjb25zdCBzY2FsZSA9IDEuNTtcbiAgICAgIGNvbnN0IHZpZXdwb3J0ID0gcGFnZS5nZXRWaWV3cG9ydCh7IHNjYWxlIH0pO1xuXG4gICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHZpZXdwb3J0LndpZHRoO1xuICAgICAgY2FudmFzLmhlaWdodCA9IHZpZXdwb3J0LmhlaWdodDtcblxuICAgICAgYXdhaXQgcGFnZS5yZW5kZXIoeyBjYW52YXNDb250ZXh0OiBjdHgsIHZpZXdwb3J0IH0pLnByb21pc2U7XG4gICAgICB0aGlzLnByZXZpZXdQYWdlcy5wdXNoKGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL3BuZycpKTtcblxuICAgICAgLy8gUHJvZ3Jlc3MgcGhhc2UgMjogZ2VuZXJhdGluZyBwcmV2aWV3ICg2MuKAkzEwMCUpXG4gICAgICB0aGlzLnNhdmVQcm9ncmVzcyA9IDYyICsgTWF0aC5yb3VuZCgoKGlkeCArIDEpIC8gcGFnZXNUb1JlbmRlci5sZW5ndGgpICogMzgpO1xuICAgICAgdGhpcy5sb2FkaW5nTWVzc2FnZSA9IGDguIHguLPguKXguLHguIfguKrguKPguYnguLLguIcgUHJldmlldyDguKvguJnguYnguLIgJHtwYWdlTnVtfSAvICR7dG90YWx9YDtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBsb2FkQWxsUHJldmlld1BhZ2VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5sYXN0U2F2ZWRCbG9iIHx8IHRoaXMuaXNMb2FkaW5nQWxsUHJldmlldykgcmV0dXJuO1xuICAgIHRoaXMuaXNMb2FkaW5nQWxsUHJldmlldyA9IHRydWU7XG4gICAgdGhpcy5wcmV2aWV3UGFnZXMgPSBbXTtcbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICBjb25zdCBhcnJheUJ1ZmZlciA9IGF3YWl0IHRoaXMubGFzdFNhdmVkQmxvYi5hcnJheUJ1ZmZlcigpO1xuICAgIGNvbnN0IHBkZkRvYyA9IGF3YWl0IHBkZmpzTGliLmdldERvY3VtZW50KHsgZGF0YTogYXJyYXlCdWZmZXIgfSkucHJvbWlzZTtcbiAgICBjb25zdCB0b3RhbCA9IHBkZkRvYy5udW1QYWdlcztcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHRvdGFsOyBpKyspIHtcbiAgICAgIGNvbnN0IHBhZ2UgPSBhd2FpdCBwZGZEb2MuZ2V0UGFnZShpKTtcbiAgICAgIGNvbnN0IHZpZXdwb3J0ID0gcGFnZS5nZXRWaWV3cG9ydCh7IHNjYWxlOiAxLjUgfSk7XG4gICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpITtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHZpZXdwb3J0LndpZHRoO1xuICAgICAgY2FudmFzLmhlaWdodCA9IHZpZXdwb3J0LmhlaWdodDtcbiAgICAgIGF3YWl0IHBhZ2UucmVuZGVyKHsgY2FudmFzQ29udGV4dDogY3R4LCB2aWV3cG9ydCB9KS5wcm9taXNlO1xuICAgICAgdGhpcy5wcmV2aWV3UGFnZXMucHVzaChjYW52YXMudG9EYXRhVVJMKCdpbWFnZS9wbmcnKSk7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2aWV3SXNGaWx0ZXJlZCA9IGZhbHNlO1xuICAgIHRoaXMuaXNMb2FkaW5nQWxsUHJldmlldyA9IGZhbHNlO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIGNvbmZpcm1TYXZlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5sYXN0U2F2ZWRCbG9iKSByZXR1cm47XG5cbiAgICAvLyBMb2cgYWxsIHNpZ25hdHVyZSBzdGFtcHMgd2l0aCBEaWdpdGFsIElEIHdoZW4gY29uZmlybWVkIGFuZCBzaG93RGlnaXRhbElkIGlzIGVuYWJsZWRcbiAgICBpZiAodGhpcy5zaG93RGlnaXRhbElkKSB7XG4gICAgICBmb3IgKGNvbnN0IHNpZyBvZiB0aGlzLnNpZ25hdHVyZVN0YW1wcykge1xuICAgICAgICBpZiAoc2lnLmRpZ2l0YWxJZCkge1xuICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgdGhpcy5sb2dTaWduYXR1cmVUb0RhdGFiYXNlKHNpZy5kaWdpdGFsSWQsIG5vdywgc2lnLnBhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTG9nIHNhdmUgdG8gaGlzdG9yeVxuICAgIHRoaXMubG9nSGlzdG9yeSgnc2F2ZScsIHtcbiAgICAgIHNpZ25hdHVyZXM6IHRoaXMuc2lnbmF0dXJlU3RhbXBzLmxlbmd0aCxcbiAgICAgIHRleHRCb3hlczogdGhpcy50ZXh0Qm94ZXMubGVuZ3RoLFxuICAgICAgZHJhd2luZ3M6IE9iamVjdC52YWx1ZXModGhpcy5zdHJva2VzKS5yZWR1Y2UoKHMsIGFycikgPT4gcyArIGFyci5sZW5ndGgsIDApLFxuICAgIH0sIDApO1xuXG4gICAgdGhpcy51bmxvY2tPcmllbnRhdGlvbigpO1xuICAgIHRoaXMubW9kYWxDdHJsLmRpc21pc3Moe1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIHNhdmVkOiB0cnVlLFxuICAgICAgYmxvYjogdGhpcy5sYXN0U2F2ZWRCbG9iLFxuICAgICAgZmlsZU5hbWU6IHRoaXMubGFzdFNhdmVkRmlsZU5hbWUsXG4gICAgICByZXZObzogdGhpcy5yZXZOb1xuICAgIH0pO1xuICB9XG5cbiAgYmFja1RvRWRpdCgpOiB2b2lkIHtcbiAgICB0aGlzLnNob3dQcmV2aWV3T3ZlcmxheSA9IGZhbHNlO1xuICAgIHRoaXMucHJldmlld1VybCA9IG51bGw7XG4gICAgdGhpcy5wcmV2aWV3UGFnZXMgPSBbXTtcbiAgfVxufVxuXG4iXX0=
