import { InjectionToken, Injectable, Optional, Inject, EventEmitter, Component, NgZone, ChangeDetectorRef, Input, ViewChildren, ViewChild, Output, HostListener, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { __awaiter } from 'tslib';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, ToastController, AlertController, IonicModule } from '@ionic/angular';
import { timeout, retry } from 'rxjs/operators';
import { PDFDocument, degrees, rgb, setCharacterSpacing } from 'pdf-lib';
import * as fontkitModule from '@pdf-lib/fontkit';
import * as pdfjsLib from 'pdfjs-dist';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

const PDF_ANNOTATOR_CONFIG = new InjectionToken('PDF_ANNOTATOR_CONFIG');

class PdfManagerService {
    constructor(http, config) {
        var _a;
        this.http = http;
        this.base = (_a = config === null || config === void 0 ? void 0 : config.pdfApiUrl) !== null && _a !== void 0 ? _a : 'http://localhost:3500/api';
    }
    listDocuments(userId, search) {
        let params = new HttpParams().set('userId', userId);
        if (search)
            params = params.set('search', search);
        return this.http.get(`${this.base}/pdf/list`, { params });
    }
    uploadDocument(file, userId, userName) {
        const form = new FormData();
        form.append('pdf', file);
        form.append('userId', userId);
        if (userName)
            form.append('userName', userName);
        return this.http.post(`${this.base}/pdf/upload`, form);
    }
    getPdfUrl(docId) {
        return `${this.base}/pdf/${docId}`;
    }
    saveAnnotatedPdf(docId, pdfBlob, userId, fileName, annotationSummary, userName) {
        const form = new FormData();
        form.append('pdf', pdfBlob, fileName);
        form.append('userId', userId);
        if (userName)
            form.append('userName', userName);
        if (annotationSummary)
            form.append('annotationSummary', JSON.stringify(annotationSummary));
        return this.http.post(`${this.base}/pdf/${docId}/save`, form);
    }
    getDocumentInfo(docId) {
        return this.http.get(`${this.base}/pdf/${docId}/info`);
    }
    deleteDocument(docId) {
        return this.http.delete(`${this.base}/pdf/${docId}`);
    }
    logAction(payload) {
        return this.http.post(`${this.base}/history`, payload);
    }
    getHistory(docId, limit = 100, offset = 0) {
        const params = new HttpParams().set('limit', limit).set('offset', offset);
        return this.http.get(`${this.base}/history/${docId}`, { params });
    }
    getHistorySummary(docId) {
        return this.http.get(`${this.base}/history/${docId}/summary`);
    }
    getSignatures(userId) {
        return this.http.get(`${this.base}/signatures/${userId}`);
    }
    saveSignature(userId, signatureData, signatureName, isDefault) {
        return this.http.post(`${this.base}/signatures`, {
            userId, signatureData, signatureName, isDefault,
        });
    }
    setDefaultSignature(sigId) {
        return this.http.put(`${this.base}/signatures/${sigId}/default`, {});
    }
    deleteSignature(sigId) {
        return this.http.delete(`${this.base}/signatures/${sigId}`);
    }
}
PdfManagerService.decorators = [
    { type: Injectable }
];
PdfManagerService.ctorParameters = () => [
    { type: HttpClient },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [PDF_ANNOTATOR_CONFIG,] }] }
];

class PdfAnnotatorModalComponent {
    constructor(modalCtrl, http, zone, toastCtrl, alertCtrl, cdr, sanitizer, pdfSvc, config) {
        var _a, _b, _c, _d, _e;
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
        this.pagesPerChunk = 10;
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
        // Stamp Picker
        this.showStampPickerModal = false;
        this.showStampGenerator = false;
        this.savedStamps = [];
        this.stampGenType = 'receive';
        this.stampGenText1 = '';
        this.stampGenText2 = '';
        this.stampGenText3 = '';
        this.stampGenDocNo = '';
        this.stampGenDate = '';
        this.stampGenTime = '';
        this.stampGenNoBorder = false;
        this.stampGenColor = '#ef4444';
        this.stampEditingId = null;
        this.stampEditingName = '';
        this.pendingStamp = null;
        this.stampGhostX = 0;
        this.stampGhostY = 0;
        this.stampGhostPage = 0;
        // Signature mode (draw vs type)
        this.sigMode = 'draw';
        this.typedText = '';
        this.typedFontIndex = 0;
        this.typedFontOptions = [
            { family: 'THSarabunNew, sans-serif', weight: '400', style: 'normal', label: 'ธรรมดา' },
            { family: 'THSarabunNew, sans-serif', weight: '700', style: 'normal', label: 'ตัวหนา' },
            { family: 'THSarabunNew, sans-serif', weight: '400', style: 'italic', label: 'เอียง' },
            { family: 'THSarabunNew, sans-serif', weight: '700', style: 'italic', label: 'หนา+เอียง' },
            { family: 'Georgia, serif', weight: '400', style: 'italic', label: 'Serif' },
        ];
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
        // ── Page Flip (90° increments) ───────────────────────────────────────────
        // Visual rotation is applied as a CSS transform on each .page-container; the
        // angle is baked into the PDF (via setRotation) inside saveDocument().
        this.pageFlips = {}; // 0, 90, 180, 270
        this.showFlipPanel = false;
        this.flipScope = 'current';
        // ============== Deskew (Page Straightening) ==============
        this.pageRotations = {}; // fine-angle deskew, degrees
        this.showDeskewPanel = false;
        // ============== Split PDF (export selected pages) ==============
        this.showSplitPanel = false;
        this.splitPageRange = '';
        // ============== Watermark ==============
        this.showWatermarkPanel = false;
        this.watermark = {
            enabled: false,
            type: 'text',
            text: 'สำเนา',
            fontFamily: 'TH Sarabun New',
            fontSize: 40,
            color: '#999999',
            opacity: 30,
            rotation: 45,
            mode: 'tiled',
            spacingX: 200,
            spacingY: 150,
            scope: 'all',
            imageDataUrl: '' // for image watermark
        };
        // ============== Page Numbers ==============
        this.showPageNumberPanel = false;
        this.pageNumber = {
            enabled: false,
            format: 'arabic',
            position: 'bottom-right',
            mirror: false,
            showPrefix: true,
            prefixText: 'หน้า ',
            suffixText: '',
            fontFamily: 'TH Sarabun New',
            fontSize: 14,
            color: '#000000',
            startFrom: 1,
            startAtPage: 1,
            skipFirstPage: false,
            pageScope: 'all',
            customPages: '',
            // ── Header / Footer ──────────────────────
            headerText: '',
            headerPosition: 'top-center',
            footerText: '',
            footerPosition: 'bottom-center',
        };
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
        this.tbDefaultFontFamily = 'THSarabunNew';
        this.tbDefaultBold = true;
        this.tbDefaultItalic = false;
        this.tbDefaultAlign = 'left';
        this.tbDefaultLetterSpacing = 0;
        this.tbDefaultLineHeight = 1.4;
        this.pendingSignatureDataUrl = null;
        this.activeTextBoxId = null;
        this.lsDropOpenId = null;
        this.lsPresets = [-3, -2, -1, 0, 1, 2, 3, 5, 8, 10];
        // ── Outputs (for inline / non-modal usage) ───────────────────────────────
        // These fire alongside the legacy ModalController.dismiss(), so the component
        // works both as an Ionic modal and embedded directly in a host template.
        this.closed = new EventEmitter();
        this.saved = new EventEmitter();
        this.loadError = new EventEmitter();
        this.SETTINGS_KEY = 'esign_pdf_annotator_settings';
        // ── Drag-to-reorder state ──────────────────────────────────────────
        this.thumbDragFromIndex = null;
        this.thumbDragOverIndex = null;
        /* ================= Zoom & Resize ================= */
        this.lastParentWidth = 0;
        this.lastFitPageNo = -1;
        this.signaturesApiUrl = (_a = config === null || config === void 0 ? void 0 : config.signaturesApiUrl) !== null && _a !== void 0 ? _a : 'http://localhost:3500/api/signatures';
        this.stampsApiUrl = (_b = config === null || config === void 0 ? void 0 : config.stampsApiUrl) !== null && _b !== void 0 ? _b : 'http://localhost:3500/api/stamps';
        this.pdfWorkerSrc = (_c = config === null || config === void 0 ? void 0 : config.pdfWorkerSrc) !== null && _c !== void 0 ? _c : '/assets/pdf.worker.min.mjs';
        this.fontUrl = (_d = config === null || config === void 0 ? void 0 : config.fontUrl) !== null && _d !== void 0 ? _d : '/assets/fonts/THSarabunNew.ttf';
        this.fontBoldUrl = (_e = config === null || config === void 0 ? void 0 : config.fontBoldUrl) !== null && _e !== void 0 ? _e : '/assets/fonts/THSarabunNew Bold.ttf';
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
    /** Close all floating tool panels so only one is visible at a time */
    closeAllPanels(except) {
        if (except !== 'flip')
            this.showFlipPanel = false;
        if (except !== 'watermark')
            this.showWatermarkPanel = false;
        if (except !== 'pageNumber')
            this.showPageNumberPanel = false;
        if (except !== 'deskew')
            this.showDeskewPanel = false;
        if (except !== 'split')
            this.showSplitPanel = false;
    }
    toggleFlipPanel() {
        this.showFlipPanel = !this.showFlipPanel;
        if (this.showFlipPanel) {
            this.closeAllPanels('flip');
            this.showFlipPanel = true;
            this.toolMode = 'none';
            this.updateCursor();
        }
        this.cdr.detectChanges();
    }
    closeFlipPanel() {
        this.showFlipPanel = false;
        this.cdr.detectChanges();
    }
    getPageFlip(p) {
        return this.pageFlips[p] || 0;
    }
    /** Rotate target page(s) by +90° (clockwise) */
    flipPageCW() {
        this.applyFlipDelta(90);
    }
    /** Rotate target page(s) by -90° (counter-clockwise) */
    flipPageCCW() {
        this.applyFlipDelta(270);
    }
    applyFlipDelta(delta) {
        if (this.flipScope === 'all') {
            for (const p of this.pages)
                this.pageFlips[p] = ((this.pageFlips[p] || 0) + delta) % 360;
        }
        else {
            this.pageFlips[this.pageNo] = ((this.pageFlips[this.pageNo] || 0) + delta) % 360;
        }
        this.cdr.detectChanges();
    }
    /** Set an absolute rotation angle (0/90/180/270) */
    setFlipAngle(angle) {
        if (this.flipScope === 'all') {
            for (const p of this.pages)
                this.pageFlips[p] = angle;
        }
        else {
            this.pageFlips[this.pageNo] = angle;
        }
        this.cdr.detectChanges();
    }
    /** Combined visual rotation = deskew + flip (used by the page-container CSS transform) */
    getPageRotation(p) {
        return (this.pageRotations[p] || 0) + (this.pageFlips[p] || 0);
    }
    setPageRotation(p, angle) {
        this.pageRotations[p] = angle;
        this.cdr.detectChanges();
    }
    resetPageRotation(p) {
        this.pageRotations[p] = 0;
        this.cdr.detectChanges();
    }
    toggleDeskewPanel() {
        this.showDeskewPanel = !this.showDeskewPanel;
        if (this.showDeskewPanel) {
            this.closeAllPanels('deskew');
            this.showDeskewPanel = true;
            this.toolMode = 'none';
            this.activeTextBoxId = null;
        }
        this.cdr.detectChanges();
    }
    closeDeskewPanel() {
        this.showDeskewPanel = false;
        this.cdr.detectChanges();
    }
    /**
     * Bake the in-progress deskew (pageRotations) into basePdfBytes immediately and
     * reload the viewer, so the user sees straightened content. 90° multiples use
     * setRotation; fine angles embed the page rotated (content tilts, annotations stay upright).
     */
    applyDeskew() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes)
                return;
            this.isLoading = true;
            this.loadingMessage = 'กำลังปรับหน้ากระดาษให้ตรง...';
            try {
                const pdfDoc = yield PDFDocument.load(this.basePdfBytes);
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
                        }
                        else {
                            const { width, height } = oldPage.getSize();
                            const embeddedPage = yield pdfDoc.embedPage(oldPage);
                            const newPage = pdfDoc.insertPage(i + 1, [width, height]);
                            const cropBox = oldPage.getCropBox();
                            if (cropBox)
                                newPage.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
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
                    const outBytes = yield pdfDoc.save();
                    this.basePdfBytes = outBytes.buffer.slice(outBytes.byteOffset, outBytes.byteOffset + outBytes.byteLength);
                    const loadingTask = pdfjsLib.getDocument({ data: this.basePdfBytes.slice(0) });
                    this.pdfDocProxy = yield loadingTask.promise;
                    this.pageCount = this.pdfDocProxy.numPages || 1;
                    this.pages = Array.from({ length: this.pageCount }, (_, idx) => idx + 1);
                    this.pages.forEach(p => this.ensurePage(p));
                    const tmpDoc = yield PDFDocument.load(this.basePdfBytes);
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
                    yield this.renderAllPages();
                }
            }
            catch (e) {
                console.error('Error deskewing', e);
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
                this.closeDeskewPanel();
                this.cdr.detectChanges();
            }
        });
    }
    toggleSplitPanel() {
        this.showSplitPanel = !this.showSplitPanel;
        if (this.showSplitPanel) {
            this.closeAllPanels('split');
            this.showSplitPanel = true;
            this.splitPageRange = `1-${this.pageCount}`;
        }
        this.cdr.detectChanges();
    }
    /** Export the pages listed in splitPageRange (e.g. "1, 3, 5-10") as a new PDF download */
    executeSplitPdf() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes || !this.splitPageRange.trim())
                return;
            const pagesToKeep = new Set();
            const parts = this.splitPageRange.split(',');
            for (const p of parts) {
                const trimmed = p.trim();
                if (!trimmed)
                    continue;
                if (trimmed.includes('-')) {
                    const [startStr, endStr] = trimmed.split('-');
                    let start = parseInt(startStr, 10);
                    let end = parseInt(endStr, 10);
                    if (!isNaN(start) && !isNaN(end)) {
                        if (start > end) {
                            const tmp = start;
                            start = end;
                            end = tmp;
                        }
                        start = Math.max(1, start);
                        end = Math.min(this.pageCount, end);
                        for (let i = start; i <= end; i++)
                            pagesToKeep.add(i);
                    }
                }
                else {
                    const page = parseInt(trimmed, 10);
                    if (!isNaN(page) && page >= 1 && page <= this.pageCount)
                        pagesToKeep.add(page);
                }
            }
            if (pagesToKeep.size === 0) {
                const toast = yield this.toastCtrl.create({ message: 'รูปแบบหน้าไม่ถูกต้อง', duration: 2000, color: 'danger' });
                yield toast.present();
                return;
            }
            this.isLoading = true;
            this.loadingMessage = 'กำลังแยกเอกสาร PDF...';
            try {
                const sourceDoc = yield PDFDocument.load(this.basePdfBytes);
                const newDoc = yield PDFDocument.create();
                const sortedPages = Array.from(pagesToKeep).sort((a, b) => a - b);
                const indicesToCopy = sortedPages.map(p => p - 1);
                const copiedPages = yield newDoc.copyPages(sourceDoc, indicesToCopy);
                copiedPages.forEach(p => newDoc.addPage(p));
                const splitBytes = yield newDoc.save();
                const blob = new Blob([splitBytes], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `split_${this.fileName || 'document'}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                this.showSplitPanel = false;
                const toast = yield this.toastCtrl.create({ message: `แยกเอกสารสำเร็จ (${sortedPages.length} หน้า)`, duration: 2000, color: 'success' });
                yield toast.present();
            }
            catch (e) {
                console.error('Split PDF failed', e);
                const toast = yield this.toastCtrl.create({ message: 'เกิดข้อผิดพลาดในการแยก PDF', duration: 3000, color: 'danger' });
                yield toast.present();
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
                this.cdr.detectChanges();
            }
        });
    }
    toggleWatermarkPanel() {
        this.showWatermarkPanel = !this.showWatermarkPanel;
        if (this.showWatermarkPanel) {
            this.closeAllPanels('watermark');
            this.showWatermarkPanel = true;
            this.toolMode = 'none';
        }
        this.cdr.detectChanges();
    }
    closeWatermarkPanel() {
        this.showWatermarkPanel = false;
        this.cdr.detectChanges();
    }
    applyWatermark() {
        this.watermark.enabled = true;
        this.showWatermarkPanel = false;
        this.cdr.detectChanges();
    }
    removeWatermark() {
        this.watermark.enabled = false;
        this.cdr.detectChanges();
    }
    onWatermarkImageSelected(event) {
        var _a;
        const input = event.target;
        if (!((_a = input.files) === null || _a === void 0 ? void 0 : _a.length))
            return;
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            this.watermark.imageDataUrl = reader.result;
            this.watermark.type = 'image';
            this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
    }
    getWatermarkPreviewStyle(pageNum) {
        if (!this.watermark.enabled)
            return { display: 'none' };
        if (this.watermark.scope === 'current' && pageNum !== this.pageNo)
            return { display: 'none' };
        return { display: 'block' };
    }
    /** Parse custom page range like "1,3,5-10" into a Set */
    parseCustomPageSet(input, maxPage) {
        const pages = new Set();
        if (!input || !input.trim())
            return pages;
        const parts = input.split(',');
        for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed)
                continue;
            if (trimmed.includes('-')) {
                const [s, e] = trimmed.split('-');
                const start = parseInt(s.trim(), 10);
                const end = parseInt(e.trim(), 10);
                if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= maxPage && start <= end) {
                    for (let i = start; i <= end; i++)
                        pages.add(i);
                }
            }
            else {
                const num = parseInt(trimmed, 10);
                if (!isNaN(num) && num >= 1 && num <= maxPage)
                    pages.add(num);
            }
        }
        return pages;
    }
    /** ตรวจสอบว่าหน้านี้ควรแสดงเลขหน้าหรือไม่ (p = physical page 1-based) */
    shouldShowPageNum(p) {
        if (!this.pageNumber.enabled)
            return false;
        const startAt = Number(this.pageNumber.startAtPage) || 1;
        const startFrom = Number(this.pageNumber.startFrom) || 1;
        if (p < startAt)
            return false;
        if (this.pageNumber.skipFirstPage && p === startAt)
            return false;
        const logicalPage = p - startAt + startFrom;
        switch (this.pageNumber.pageScope) {
            case 'odd': return logicalPage % 2 !== 0;
            case 'even': return logicalPage % 2 === 0;
            case 'custom': {
                const customSet = this.parseCustomPageSet(this.pageNumber.customPages, this.pageCount);
                return customSet.has(p);
            }
            default: return true;
        }
    }
    toRoman(n, upper) {
        if (n <= 0 || n > 3999)
            return String(n);
        const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        const romUp = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
        const romLo = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i'];
        const syms = upper ? romUp : romLo;
        let result = '';
        for (let i = 0; i < vals.length; i++) {
            while (n >= vals[i]) {
                result += syms[i];
                n -= vals[i];
            }
        }
        return result;
    }
    toThaiNumber(n) {
        const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
        return String(n).split('').map(d => thaiDigits[parseInt(d)] || d).join('');
    }
    formatPageNum(p) {
        const startAt = Number(this.pageNumber.startAtPage) || 1;
        const startFrom = Number(this.pageNumber.startFrom) || 1;
        const num = p - startAt + startFrom;
        let numStr;
        switch (this.pageNumber.format) {
            case 'thai':
                numStr = this.toThaiNumber(num);
                break;
            case 'roman':
                numStr = this.toRoman(num, false);
                break;
            case 'roman-upper':
                numStr = this.toRoman(num, true);
                break;
            default: numStr = String(num);
        }
        const prefix = this.pageNumber.showPrefix ? (this.pageNumber.prefixText || '') : '';
        const suffix = this.pageNumber.suffixText || '';
        return prefix + numStr + suffix;
    }
    /** คำนวณตำแหน่ง — รองรับ mirror (สลับซ้าย-ขวาตามคี่/คู่) */
    getEffectivePosition(p) {
        let pos = this.pageNumber.position;
        if (this.pageNumber.mirror) {
            const startAt = Number(this.pageNumber.startAtPage) || 1;
            const startFrom = Number(this.pageNumber.startFrom) || 1;
            const logicalPage = p - startAt + startFrom;
            const isEven = logicalPage % 2 === 0;
            if (isEven) {
                if (pos.endsWith('right'))
                    pos = pos.replace('right', 'left');
                else if (pos.endsWith('left'))
                    pos = pos.replace('left', 'right');
            }
        }
        return pos;
    }
    togglePageNumberPanel() {
        this.showPageNumberPanel = !this.showPageNumberPanel;
        if (this.showPageNumberPanel) {
            this.closeAllPanels('pageNumber');
            this.showPageNumberPanel = true;
            this.toolMode = 'none';
        }
        this.cdr.detectChanges();
    }
    closePageNumberPanel() {
        this.showPageNumberPanel = false;
        this.cdr.detectChanges();
    }
    applyPageNumbers() {
        this.pageNumber.enabled = true;
        this.showPageNumberPanel = false;
        this.cdr.detectChanges();
    }
    removePageNumbers() {
        this.pageNumber.enabled = false;
        this.cdr.detectChanges();
    }
    getPageNumPositionStyle(page) {
        const pos = page ? this.getEffectivePosition(page) : this.pageNumber.position;
        const style = { position: 'absolute', padding: '8px 14px', zIndex: 6, pointerEvents: 'none' };
        if (pos.startsWith('top'))
            style.top = '0';
        if (pos.startsWith('bottom'))
            style.bottom = '0';
        if (pos.endsWith('left')) {
            style.left = '0';
            style.textAlign = 'left';
        }
        if (pos.endsWith('center')) {
            style.left = '0';
            style.right = '0';
            style.textAlign = 'center';
        }
        if (pos.endsWith('right')) {
            style.right = '0';
            style.textAlign = 'right';
        }
        return style;
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
        this.closed.emit();
        this.dismissModal();
    }
    get drawMode() { return this.toolMode === 'draw' || (this.toolMode === 'none' && this.activeObjectType === 'signature'); }
    get eraserMode() { return this.toolMode === 'eraser'; }
    get highlightMode() { return this.toolMode === 'highlight'; }
    get shapeMode() { return this.toolMode === 'shape' || (this.toolMode === 'none' && this.activeObjectType === 'shape'); }
    get textPlaceMode() { return this.toolMode === 'text' || (this.toolMode === 'none' && this.activeObjectType === 'text'); }
    /** Dismiss the host Ionic modal if present; never throws when used inline. */
    dismissModal(data) {
        this.modalCtrl.dismiss(data).catch(() => { });
    }
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
                if (settings.pagesPerChunk)
                    this.pagesPerChunk = settings.pagesPerChunk;
                if (settings.tbDefaultFontFamily)
                    this.tbDefaultFontFamily = settings.tbDefaultFontFamily;
                if (settings.tbDefaultBold !== undefined)
                    this.tbDefaultBold = settings.tbDefaultBold;
                if (settings.tbDefaultItalic !== undefined)
                    this.tbDefaultItalic = settings.tbDefaultItalic;
                if (settings.tbDefaultAlign)
                    this.tbDefaultAlign = settings.tbDefaultAlign;
                if (settings.tbDefaultLetterSpacing !== undefined)
                    this.tbDefaultLetterSpacing = settings.tbDefaultLetterSpacing;
                if (settings.tbDefaultLineHeight !== undefined)
                    this.tbDefaultLineHeight = settings.tbDefaultLineHeight;
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
                const loadingTask = pdfjsLib.getDocument({ data: buffer.slice(0) });
                this.pdfDocProxy = yield loadingTask.promise;
                this.pageCount = this.pdfDocProxy.numPages || 1;
                // Initialize annotation data for ALL pages upfront
                for (let p = 1; p <= this.pageCount; p++)
                    this.ensurePage(p);
                // Only render first chunk in the DOM
                this.loadedUntilPage = Math.min(this.pagesPerChunk, this.pageCount);
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
                this.loadError.emit({ message: msg });
                this.dismissModal({ error: true, message: msg });
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
    setPagesPerChunk(n) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isLoadingChunk || !this.pdfDocProxy)
                return;
            this.pagesPerChunk = n === 0 ? this.pageCount : n;
            this.isLoadingChunk = true;
            const newEnd = Math.min(this.pagesPerChunk, this.pageCount);
            const prevEnd = this.loadedUntilPage;
            if (newEnd > prevEnd) {
                yield this.generateThumbnailsRange(prevEnd + 1, newEnd);
                for (let p = prevEnd + 1; p <= newEnd; p++)
                    this.pages.push(p);
            }
            else if (newEnd < prevEnd) {
                this.pages = Array.from({ length: newEnd }, (_, i) => i + 1);
                this.renderedPages = new Set([...this.renderedPages].filter(p => p <= newEnd));
            }
            this.loadedUntilPage = newEnd;
            this.isLoadingChunk = false;
            this.saveSettings();
            this.cdr.detectChanges();
            for (let p = Math.max(prevEnd + 1, 1); p <= newEnd; p++)
                yield this.renderPage(p);
        });
    }
    loadNextChunk() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isLoadingChunk || this.loadedUntilPage >= this.pageCount)
                return;
            this.isLoadingChunk = true;
            const newEnd = Math.min(this.loadedUntilPage + this.pagesPerChunk, this.pageCount);
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
        this.cdr.detectChanges();
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
            this.cdr.detectChanges();
            return;
        }
        this.thumbInsertIndex = idx;
        if (event && event.currentTarget) {
            const btn = event.currentTarget;
            const rect = btn.getBoundingClientRect();
            // Center the dropdown vertically on the button
            this.thumbDropdownTop = rect.top + rect.height / 2;
        }
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
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
    onThumbDragStart(i) {
        this.thumbDragFromIndex = i;
        this.cdr.detectChanges();
    }
    onThumbDragOver(i) {
        if (this.thumbDragFromIndex === null || i === this.thumbDragFromIndex)
            return;
        this.thumbDragOverIndex = i;
        this.cdr.detectChanges();
    }
    onThumbDragLeave() {
        this.thumbDragOverIndex = null;
        this.cdr.detectChanges();
    }
    onThumbDrop(i) {
        return __awaiter(this, void 0, void 0, function* () {
            const from = this.thumbDragFromIndex;
            this.thumbDragFromIndex = null;
            this.thumbDragOverIndex = null;
            if (from === null || from === i) {
                this.cdr.detectChanges();
                return;
            }
            yield this.reorderPage(from + 1, i + 1);
        });
    }
    onThumbDragEnd() {
        this.thumbDragFromIndex = null;
        this.thumbDragOverIndex = null;
        this.cdr.detectChanges();
    }
    reorderPage(fromPage, toPage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes || fromPage === toPage)
                return;
            this.savePageSnapshot();
            this.isLoading = true;
            this.loadingMessage = 'กำลังย้ายหน้า...';
            this.cdr.detectChanges();
            try {
                const pdfDoc = yield PDFDocument.load(this.basePdfBytes);
                const fromIdx = fromPage - 1;
                const toIdx = toPage - 1;
                const [copiedPage] = yield pdfDoc.copyPages(pdfDoc, [fromIdx]);
                pdfDoc.removePage(fromIdx);
                const insertAt = fromIdx < toIdx ? toIdx : toIdx;
                pdfDoc.insertPage(insertAt, copiedPage);
                const newBytes = yield pdfDoc.save();
                this.basePdfBytes = newBytes.buffer;
                // Shift annotation page numbers between fromPage and toPage
                const shiftAnnot = (arr) => arr.map(a => {
                    if (a.page === fromPage)
                        return Object.assign(Object.assign({}, a), { page: toPage });
                    if (fromPage < toPage && a.page > fromPage && a.page <= toPage)
                        return Object.assign(Object.assign({}, a), { page: a.page - 1 });
                    if (fromPage > toPage && a.page >= toPage && a.page < fromPage)
                        return Object.assign(Object.assign({}, a), { page: a.page + 1 });
                    return a;
                });
                this.textBoxes = shiftAnnot(this.textBoxes);
                this.imageStamps = shiftAnnot(this.imageStamps);
                this.shapeStamps = shiftAnnot(this.shapeStamps);
                this.signatureStamps = shiftAnnot(this.signatureStamps);
                this.dateStamps = shiftAnnot(this.dateStamps);
                const shiftRecord = (rec) => {
                    const next = {};
                    for (const k of Object.keys(rec)) {
                        const p = Number(k);
                        if (p === fromPage)
                            next[toPage] = rec[p];
                        else if (fromPage < toPage && p > fromPage && p <= toPage)
                            next[p - 1] = rec[p];
                        else if (fromPage > toPage && p >= toPage && p < fromPage)
                            next[p + 1] = rec[p];
                        else
                            next[p] = rec[p];
                    }
                    return next;
                };
                this.strokes = shiftRecord(this.strokes);
                this.shapes = shiftRecord(this.shapes);
                this.redoStack = shiftRecord(this.redoStack);
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
                const tmpDoc = yield PDFDocument.load(copy);
                tmpDoc.getPages().forEach((pg, idx) => {
                    const { width, height } = pg.getSize();
                    this.pdfPageAspects.set(idx + 1, width / height);
                    this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                });
                this.renderedPages.clear();
                this.pageThumbnails = [];
                yield this.generateThumbnailsRange(1, this.loadedUntilPage);
                this.pageNo = toPage;
                this.scrollToPage(this.pageNo);
            }
            catch (err) {
                console.error('reorderPage error', err);
            }
            finally {
                this.isLoading = false;
                this.cdr.detectChanges();
                yield this.renderAllPages();
            }
        });
    }
    // ──────────────────────────────────────────────────────────────────
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
    // เลื่อน sidebar thumbnail ใกล้ล่างสุด → โหลด chunk หน้าถัดไป
    // (ก่อนหน้านี้มีแต่ onViewerScroll ของ viewer หลัก เลื่อน thumbnail เลยไม่โหลดต่อ)
    onThumbScroll(event) {
        const el = event.target;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) {
            this.loadNextChunk();
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
        this.resizeTextBox(tb, textarea);
    }
    resizeTextBox(tb, textarea) {
        var _a;
        if (!textarea) {
            const el = document.querySelector(`[data-tbid="${tb.id}"] textarea`);
            if (!el)
                return;
            textarea = el;
        }
        const lines = tb.text.split('\n');
        let maxLineWidthPx = 30;
        const measureSpan = document.createElement('span');
        measureSpan.style.cssText = `position: absolute; visibility: hidden; white-space: pre; font-family: '${tb.fontFamily || 'THSarabunNew'}', sans-serif; font-size: ${tb.fontSize * this.zoom}px; font-weight: ${tb.bold ? 'bold' : 'normal'}; font-style: ${tb.italic ? 'italic' : 'normal'}; letter-spacing: ${(_a = tb.letterSpacing) !== null && _a !== void 0 ? _a : 0}px;`;
        lines.forEach(line => {
            measureSpan.textContent = line || ' ';
            document.body.appendChild(measureSpan);
            const lineWidth = measureSpan.offsetWidth + 18;
            if (lineWidth > maxLineWidthPx)
                maxLineWidthPx = lineWidth;
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
    /* ================= Stamp Picker ================= */
    openStampPicker() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showStampGenerator = false;
            this.showStampPickerModal = true;
            this.cdr.detectChanges();
            if (!this.userId)
                return;
            this.isLoadingSignatures = true;
            try {
                const response = yield this.http.post(this.stampsApiUrl, {
                    aksi: 'load_stamps', userId: this.userId
                }).toPromise();
                if (response === null || response === void 0 ? void 0 : response.success) {
                    this.savedStamps = response.data.map((row) => ({
                        id: row.id,
                        name: row.stamp_name,
                        type: row.stamp_type,
                        dataUrl: row.stamp_data
                    }));
                }
            }
            catch (err) {
                console.error('Error loading stamps', err);
            }
            finally {
                this.isLoadingSignatures = false;
                this.cdr.detectChanges();
            }
        });
    }
    closeStampPicker() {
        this.showStampPickerModal = false;
        this.showStampGenerator = false;
        this.cdr.detectChanges();
    }
    openStampGenerator() {
        this.stampGenDocNo = '';
        this.stampGenDate = '';
        this.stampGenTime = '';
        this.stampGenNoBorder = false;
        this.showStampGenerator = true;
        this.cdr.detectChanges();
    }
    cancelStampGenerator() {
        this.showStampGenerator = false;
        this.cdr.detectChanges();
    }
    triggerStampUpload() {
        var _a, _b;
        (_b = (_a = this.stampFileInputRef) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.click();
    }
    onStampFileSelected(event) {
        const input = event.target;
        if (!input.files || !input.files[0])
            return;
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dataUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            const newStamp = { id: 'stamp_' + Date.now(), name: file.name.replace(/\.[^/.]+$/, '') || 'ตรายาง', type: 'custom', dataUrl };
            this.isLoadingSignatures = true;
            try {
                if (this.userId) {
                    const res = yield this.http.post(this.stampsApiUrl, {
                        aksi: 'save_stamp', userId: this.userId, stampName: newStamp.name, stampType: newStamp.type, stampData: dataUrl
                    }).toPromise();
                    if (res === null || res === void 0 ? void 0 : res.success)
                        newStamp.id = res.data.id;
                }
                this.savedStamps.unshift(newStamp);
                this.useSavedStamp(newStamp);
            }
            catch (err) {
                console.error('Error uploading stamp', err);
            }
            finally {
                this.isLoadingSignatures = false;
                input.value = '';
                this.cdr.detectChanges();
            }
        });
        reader.readAsDataURL(file);
    }
    useSavedStamp(stamp) {
        this.pendingStamp = {
            dataUrl: stamp.dataUrl,
            defaultWidth: stamp.type === 'receive' ? 350 : 250
        };
        this.closeStampPicker();
    }
    onStampGhostMove(ev, pageNum) {
        if (!this.pendingStamp)
            return;
        const rect = ev.currentTarget.getBoundingClientRect();
        this.stampGhostX = ev.clientX - rect.left;
        this.stampGhostY = ev.clientY - rect.top;
        this.stampGhostPage = pageNum;
        this.cdr.detectChanges();
    }
    onStampGhostClick(ev, pageNum) {
        if (!this.pendingStamp)
            return;
        ev.stopPropagation();
        const rect = ev.currentTarget.getBoundingClientRect();
        const clickX = ev.clientX - rect.left;
        const clickY = ev.clientY - rect.top;
        const img = new Image();
        img.onload = () => {
            let w = img.width;
            let h = img.height;
            const maxSize = this.pendingStamp.defaultWidth;
            if (w > maxSize || h > maxSize) {
                if (w > h) {
                    h = (h / w) * maxSize;
                    w = maxSize;
                }
                else {
                    w = (w / h) * maxSize;
                    h = maxSize;
                }
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
                dataUrl: this.pendingStamp.dataUrl
            });
            this.logHistory('image', { type: 'stamp' }, pageNum);
            this.pendingStamp = null;
            this.cdr.detectChanges();
        };
        img.src = this.pendingStamp.dataUrl;
    }
    cancelPendingStamp() {
        this.pendingStamp = null;
        this.cdr.detectChanges();
    }
    startStampRename(stamp, event) {
        event.stopPropagation();
        this.stampEditingId = stamp.id;
        this.stampEditingName = stamp.name;
        this.cdr.detectChanges();
        setTimeout(() => {
            const input = document.querySelector('.stamp-name-input');
            input === null || input === void 0 ? void 0 : input.select();
        }, 30);
    }
    saveStampRename(stamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = this.stampEditingName.trim();
            this.stampEditingId = null;
            this.cdr.detectChanges();
            if (!name || name === stamp.name)
                return;
            stamp.name = name;
            if (!this.userId || (typeof stamp.id === 'string' && stamp.id.startsWith('stamp_')))
                return;
            try {
                yield this.http.post(this.stampsApiUrl, {
                    aksi: 'rename_stamp', id: stamp.id, stampName: name
                }).toPromise();
            }
            catch (err) {
                console.error('Error renaming stamp', err);
            }
        });
    }
    deleteSavedStamp(stamp, event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.stopPropagation();
            if (typeof stamp.id === 'string' && stamp.id.startsWith('stamp_')) {
                this.savedStamps = this.savedStamps.filter(s => s.id !== stamp.id);
                this.cdr.detectChanges();
                return;
            }
            try {
                const res = yield this.http.post(this.stampsApiUrl, {
                    aksi: 'delete_stamp', id: stamp.id
                }).toPromise();
                if (res === null || res === void 0 ? void 0 : res.success) {
                    this.savedStamps = this.savedStamps.filter(s => s.id !== stamp.id);
                    this.cdr.detectChanges();
                }
            }
            catch (err) {
                console.error('Error deleting stamp', err);
            }
        });
    }
    drawDottedLine(ctx, x1, y, x2, color) {
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
    saveGeneratedStamp() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        if (this.stampGenType === 'receive') {
            canvas.width = 800;
            canvas.height = 460;
        }
        else {
            canvas.width = 800;
            canvas.height = this.stampGenText3 ? 320 : 260;
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
            const row1 = 280;
            const row2 = row1 + 70;
            const row3 = row2 + 70;
            ctx.fillText('เลขรับ', lx, row1);
            this.drawDottedLine(ctx, lineX1, row1, lineX2, c);
            if (this.stampGenDocNo) {
                ctx.fillStyle = '#000000';
                ctx.fillText(this.stampGenDocNo, lineX1 + 20, row1);
                ctx.fillStyle = c;
            }
            ctx.fillText('วันที่', lx, row2);
            this.drawDottedLine(ctx, lineX1, row2, lineX2, c);
            if (this.stampGenDate) {
                ctx.fillStyle = '#000000';
                ctx.fillText(this.stampGenDate, lineX1 + 20, row2);
                ctx.fillStyle = c;
            }
            ctx.fillText('เวลา', lx, row3);
            this.drawDottedLine(ctx, lineX1, row3, lineX2 - 60, c);
            if (this.stampGenTime) {
                ctx.fillStyle = '#000000';
                ctx.fillText(this.stampGenTime, lineX1 + 20, row3);
                ctx.fillStyle = c;
            }
            ctx.textAlign = 'right';
            ctx.fillText('น.', lineX2, row3);
        }
        else if (this.stampGenText3) {
            ctx.font = 'bold 40px "THSarabunNew", "Sarabun", Tahoma, sans-serif';
            ctx.fillText(this.stampGenText3, textCX, innerTop + 30 + 130, maxTextW);
        }
        const dataUrl = canvas.toDataURL('image/png');
        const newStamp = { id: 'stamp_' + Date.now(), name: this.stampGenText1 || 'ตราประทับ', type: this.stampGenType, dataUrl };
        if (!this.userId) {
            this.savedStamps.unshift(newStamp);
            this.useSavedStamp(newStamp);
            return;
        }
        this.isLoadingSignatures = true;
        this.http.post(this.stampsApiUrl, {
            aksi: 'save_stamp', userId: this.userId, stampName: newStamp.name, stampType: newStamp.type, stampData: dataUrl
        }).toPromise().then((res) => {
            if (res === null || res === void 0 ? void 0 : res.success)
                newStamp.id = res.data.id;
            this.savedStamps.unshift(newStamp);
            this.useSavedStamp(newStamp);
        }).catch((err) => {
            console.error('Error saving stamp', err);
        }).finally(() => {
            this.isLoadingSignatures = false;
            this.cdr.detectChanges();
        });
    }
    /* ================= Signature Pad ================= */
    openSignaturePad() {
        this.showSignaturePad = true;
        this.signaturePoints = [];
        this.signatureStrokes = [];
        this.sigMode = 'draw';
        this.typedText = '';
        setTimeout(() => {
            this.initSignatureCanvas();
        }, 100);
    }
    closeSignaturePad() {
        this.showSignaturePad = false;
        this.signaturePoints = [];
        this.signatureStrokes = [];
        this.sigMode = 'draw';
        this.typedText = '';
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
    switchSigMode(mode) {
        this.sigMode = mode;
        if (mode === 'draw') {
            this.typedText = '';
            this.signatureStrokes = [];
            this.signaturePoints = [];
            setTimeout(() => this.initSignatureCanvas(), 50);
        }
        else {
            setTimeout(() => this.renderTypedCanvas(), 50);
        }
        this.cdr.detectChanges();
    }
    onTypedInput() {
        this.renderTypedCanvas();
        this.cdr.detectChanges();
    }
    pickTypedFont(index) {
        this.typedFontIndex = index;
        this.renderTypedCanvas();
        this.cdr.detectChanges();
    }
    renderTypedCanvas() {
        var _a;
        const canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
        if (!canvas)
            return;
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
        if (!ctx)
            return;
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
        if (!this.typedText)
            return;
        const font = this.typedFontOptions[this.typedFontIndex];
        const fontSize = Math.round(h * 0.4);
        ctx.font = `${font.style} ${font.weight} ${fontSize}px ${font.family}`;
        ctx.fillStyle = this.signaturePenColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(this.typedText, w / 2, h * 0.65);
    }
    initSignatureCanvas() {
        var _a;
        const canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
        if (!canvas)
            return;
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
        const cssW = srcCanvas.clientWidth || 400;
        const cssH = srcCanvas.clientHeight || 200;
        const exportScale = 8;
        const offW = Math.floor(cssW * exportScale);
        const offH = Math.floor(cssH * exportScale);
        const offCanvas = document.createElement('canvas');
        offCanvas.width = offW;
        offCanvas.height = offH;
        const ctx = offCanvas.getContext('2d');
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
        }
        else {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            for (const stroke of this.signatureStrokes) {
                if (stroke.points.length < 2)
                    continue;
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
            if (this.sigMode === 'type') {
                if (!this.typedText.trim())
                    return;
                this.renderTypedCanvas();
            }
            else {
                const canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
                const totalPoints = this.signatureStrokes.reduce((sum, s) => sum + s.points.length, 0);
                if (!canvas || totalPoints < 2)
                    return;
            }
            if (!this.userId) {
                console.warn('userId is not set, cannot save signature');
                this.saveSignature();
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
            this.tbDefaultBold = this.activeTextBox.bold;
            this.cdr.detectChanges();
            this.saveSettings();
        }
    }
    toggleItalic() {
        if (this.activeTextBox) {
            this.activeTextBox.italic = !this.activeTextBox.italic;
            this.tbDefaultItalic = this.activeTextBox.italic;
            this.cdr.detectChanges();
            this.saveSettings();
        }
    }
    setAlign(a) {
        if (this.activeTextBox) {
            this.activeTextBox.align = a;
            this.tbDefaultAlign = a;
            this.cdr.detectChanges();
            this.saveSettings();
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
    setTbFontFamily(tb, family) {
        tb.fontFamily = family;
        this.tbDefaultFontFamily = family;
        this.cdr.detectChanges();
        this.saveSettings();
    }
    setTbOpacity(tb, val) {
        tb.opacity = Math.max(0, Math.min(1, +val || 1));
        this.cdr.detectChanges();
    }
    setTbRotation(tb, val) {
        tb.rotation = +val || 0;
        this.cdr.detectChanges();
    }
    setTbLetterSpacing(tb, val) {
        tb.letterSpacing = +val || 0;
        this.cdr.detectChanges();
    }
    changeTbLetterSpacing(tb, delta) {
        var _a;
        const cur = +((_a = tb.letterSpacing) !== null && _a !== void 0 ? _a : 0);
        tb.letterSpacing = Math.max(-5, Math.min(30, Math.round((cur + delta) * 10) / 10));
        this.cdr.detectChanges();
    }
    toggleLsDrop(id) {
        this.lsDropOpenId = this.lsDropOpenId === id ? null : id;
        this.cdr.detectChanges();
    }
    pickLetterSpacing(tb, val) {
        tb.letterSpacing = val;
        this.tbDefaultLetterSpacing = val;
        this.lsDropOpenId = null;
        this.cdr.detectChanges();
        this.resizeTextBox(tb);
        this.saveSettings();
    }
    changeTbLineHeight(tb, delta) {
        var _a;
        const cur = +((_a = tb.lineHeight) !== null && _a !== void 0 ? _a : 1.4);
        tb.lineHeight = Math.max(1, Math.min(4, Math.round((cur + delta) * 10) / 10));
        this.tbDefaultLineHeight = tb.lineHeight;
        this.cdr.detectChanges();
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
        var _a, _b, _c, _d, _e, _f, _g;
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
                const fontBytes = yield fetch(this.fontUrl).then(r => r.arrayBuffer());
                const thaiFont = yield pdfDoc.embedFont(fontBytes);
                const boldFontBytes = yield fetch(this.fontBoldUrl).then(r => r.arrayBuffer());
                const thaiFontBold = yield pdfDoc.embedFont(boldFontBytes);
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
                // Watermark-enabled pages must be processed even if they have no annotations
                if (this.watermark.enabled) {
                    const wmPages = this.watermark.scope === 'all' ? this.pages : [this.pageNo];
                    wmPages.forEach(p => annotatedPageNums.add(p));
                }
                // Page-number / header-footer pages must also be processed even if empty
                if (this.pageNumber.enabled) {
                    this.pages.forEach(p => { if (this.shouldShowPageNum(p))
                        annotatedPageNums.add(p); });
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
                            }
                            else {
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
                        }
                        else if (this.watermark.type === 'image' && this.watermark.imageDataUrl) {
                            try {
                                const wmBytes = Uint8Array.from(atob(this.watermark.imageDataUrl.split(',')[1]), c => c.charCodeAt(0));
                                const wmImg = this.watermark.imageDataUrl.includes('png')
                                    ? yield pdfDoc.embedPng(wmBytes) : yield pdfDoc.embedJpg(wmBytes);
                                const imgW = Math.min(wmImg.width, width * 0.4);
                                const imgH = (wmImg.height / wmImg.width) * imgW;
                                if (this.watermark.mode === 'center') {
                                    page.drawImage(wmImg, {
                                        x: width / 2 - imgW / 2, y: height / 2 - imgH / 2,
                                        width: imgW, height: imgH, opacity: wmOpacity, rotate: degrees(-wmRotation)
                                    });
                                }
                                else {
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
                            }
                            catch (wmErr) {
                                console.warn('Watermark image error', wmErr);
                            }
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
                        if (pos.endsWith('right'))
                            pnX = width - pnTextWidth - margin;
                        if (pos.endsWith('center'))
                            pnX = (width - pnTextWidth) / 2;
                        if (pos.startsWith('top'))
                            pnY = height - pnSize - margin;
                        if (pos.startsWith('bottom'))
                            pnY = margin;
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
                            if (hPos.endsWith('right'))
                                hX = width - hWidth - hfMargin;
                            if (hPos.endsWith('center'))
                                hX = (width - hWidth) / 2;
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
                            if (fPos.endsWith('right'))
                                fX = width - fWidth - hfMargin;
                            if (fPos.endsWith('center'))
                                fX = (width - fWidth) / 2;
                            const fY = hfMargin;
                            page.drawText(fText, {
                                x: fX, y: fY, size: hfSize, font: thaiFont,
                                color: rgb(hfR, hfG, hfB), opacity: 0.7
                            });
                        }
                    }
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
                        const lineHeight = tb.fontSize * ((_d = tb.lineHeight) !== null && _d !== void 0 ? _d : 1.4);
                        // Compensate for textarea CSS padding (2px top, 4px left) so PDF matches screen
                        const canvas = this.getAnnotCanvas(pageNum);
                        const canvasCW = canvas ? canvas.clientWidth : 800;
                        const canvasCH = canvas ? canvas.clientHeight : 1000;
                        const padLeftPct = (4 / canvasCW) * 100; // 4px left padding → %
                        const padTopPct = (2 / canvasCH) * 100; // 2px top padding  → %
                        // Convert CSS letter-spacing (px on canvas) → PDF points: px * (PDF_pt / canvas_px)
                        const charSpacing = ((_e = tb.letterSpacing) !== null && _e !== void 0 ? _e : 0) * (vW / canvasCW);
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
                            const lineWidthWithSpacing = (text) => fontToUse.widthOfTextAtSize(text, tb.fontSize) + charSpacing * text.length;
                            const drawLineText = (text, pt) => {
                                if (charSpacing !== 0)
                                    page.pushOperators(setCharacterSpacing(charSpacing));
                                page.drawText(text, { x: pt.x, y: pt.y, size: tb.fontSize, font: fontToUse, color: txtColor, rotate: pt.rotate });
                                if (charSpacing !== 0)
                                    page.pushOperators(setCharacterSpacing(0));
                            };
                            let line = '';
                            for (const word of paraWords) {
                                const testLine = line + word;
                                const textWidth = lineWidthWithSpacing(testLine);
                                if (textWidth > maxW && line) {
                                    let alignXVisual = (textStartXPct / 100) * vW;
                                    const finalLineWidth = lineWidthWithSpacing(line);
                                    if (tb.align === 'center')
                                        alignXVisual += (maxW / 2) - (finalLineWidth / 2);
                                    if (tb.align === 'right')
                                        alignXVisual += maxW - finalLineWidth;
                                    const baselineVisualY = currentVisualY + (tb.fontSize * 0.95);
                                    drawLineText(line, this.getPdfPlacement((alignXVisual / vW) * 100, (baselineVisualY / vH) * 100, 0, 0, width, height, rotationAngle));
                                    line = word.replace(/^\s+/, '');
                                    currentVisualY += lineHeight;
                                }
                                else {
                                    line = testLine;
                                }
                            }
                            if (line) {
                                let alignXVisual = (textStartXPct / 100) * vW;
                                const finalLineWidth = lineWidthWithSpacing(line);
                                if (tb.align === 'center')
                                    alignXVisual += (maxW / 2) - (finalLineWidth / 2);
                                if (tb.align === 'right')
                                    alignXVisual += maxW - finalLineWidth;
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
                        const rotAngle = (_f = this.pdfPageRotations.get(ff.page)) !== null && _f !== void 0 ? _f : pdfPage.getRotation().angle;
                        const isRotated = rotAngle === 90 || rotAngle === 270 || rotAngle === -90 || rotAngle === -270;
                        const vW = isRotated ? pgH : pgW;
                        const vH = isRotated ? pgW : pgH;
                        const fx = (ff.x / 100) * vW;
                        const fw = (ff.width / 100) * vW;
                        const fh = (ff.height / 100) * vH;
                        const fy = pgH - (ff.y / 100) * vH - fh;
                        const borderW = ((_g = ff.borderVisible) !== null && _g !== void 0 ? _g : true) ? 1 : 0;
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
                                catch (_h) {
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
            const pdfDoc = yield pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
            const total = pdfDoc.numPages;
            this.previewTotalPages = total;
            // For large documents render only annotated pages, not all pages
            let pagesToRender;
            if (total > 50) {
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
            const pdfDoc = yield pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
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
        this.saved.emit({ blob: this.lastSavedBlob, fileName: this.lastSavedFileName, revNo: this.revNo });
        this.dismissModal({
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
                template: "<ion-header [style.display]=\"showPreviewOverlay ? 'none' : ''\">\n  <ion-toolbar>\n    <!-- <ion-title>PDF Annotator</ion-title> -->\n    <ion-buttons slot=\"end\">\n      <ion-button fill=\"clear\" (click)=\"close()\">\n        <ion-icon name=\"close\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content class=\"annotator-content\" [scrollY]=\"false\">\n\n  <!-- Loading Spinner Overlay -->\n  <div class=\"loading-overlay\" *ngIf=\"isLoading\">\n    <div class=\"loading-content\" [class.loading-content--progress]=\"saveProgress > 0\">\n\n      <!-- Normal spinner when no save progress -->\n      <ng-container *ngIf=\"saveProgress === 0\">\n        <ion-spinner name=\"crescent\"></ion-spinner>\n        <p class=\"loading-msg\">{{ loadingMessage }}</p>\n      </ng-container>\n\n      <!-- Progress bar UI during save -->\n      <ng-container *ngIf=\"saveProgress > 0\">\n        <div class=\"save-progress-icon\">\n          <ion-icon name=\"document-text-outline\"></ion-icon>\n          <span class=\"save-progress-pct\">{{ saveProgress }}%</span>\n        </div>\n        <div class=\"save-progress-bar-track\">\n          <div class=\"save-progress-bar-fill\" [style.width.%]=\"saveProgress\"\n            [class.save-progress-bar-fill--preview]=\"saveProgress > 61\"\n            [class.save-progress-bar-fill--serializing]=\"saveProgress === 61\"></div>\n        </div>\n        <div class=\"save-progress-phases\">\n          <span [class.active]=\"saveProgress > 0 && saveProgress < 61\">\n            <ion-icon name=\"layers-outline\"></ion-icon> \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01 Annotations\n          </span>\n          <span [class.active]=\"saveProgress === 61\">\n            <ion-icon name=\"archive-outline\"></ion-icon> Serialize PDF\n          </span>\n          <span [class.active]=\"saveProgress > 61\">\n            <ion-icon name=\"image-outline\"></ion-icon> \u0E2A\u0E23\u0E49\u0E32\u0E07 Preview\n          </span>\n        </div>\n        <p class=\"loading-msg\">{{ loadingMessage }}</p>\n      </ng-container>\n\n    </div>\n  </div>\n\n  <!-- New Layout: Top Toolbars + Left Thumbnails + Center Viewer -->\n  <div class=\"annotator-layout-v2\">\n\n    <!-- Top Toolbar Row 1: Zoom & Navigation -->\n    <div class=\"toolbar-row toolbar-row--nav\">\n      <div class=\"toolbar-group\">\n        <button class=\"toolbar-btn\" (click)=\"toggleThumbnails()\" title=\"\u0E41\u0E2A\u0E14\u0E07/\u0E0B\u0E48\u0E2D\u0E19 Thumbnails\">\n          <ion-icon name=\"images-outline\"></ion-icon>\n        </button>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <div class=\"toolbar-group toolbar-group--zoom\">\n        <button class=\"toolbar-btn\" (click)=\"zoomOut()\" [disabled]=\"zoom <= 0.5\">\n          <ion-icon name=\"search-outline\"></ion-icon>\n          <ion-icon name=\"remove-outline\" class=\"zoom-icon\"></ion-icon>\n        </button>\n        <span class=\"toolbar-label\">{{ (zoom * 100) | number:'1.0-0' }}%</span>\n        <button class=\"toolbar-btn\" (click)=\"zoomIn()\" [disabled]=\"zoom >= 3\">\n          <ion-icon name=\"search-outline\"></ion-icon>\n          <ion-icon name=\"add-outline\" class=\"zoom-icon\"></ion-icon>\n        </button>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <div class=\"toolbar-group toolbar-group--pager\">\n        <button class=\"toolbar-btn\" (click)=\"firstPage()\" [disabled]=\"pageNo <= 1\" title=\"\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E23\u0E01\">\n          <ion-icon name=\"play-skip-back\"></ion-icon>\n        </button>\n        <button class=\"toolbar-btn\" (click)=\"prevPage()\" [disabled]=\"pageNo <= 1\" title=\"\u0E2B\u0E19\u0E49\u0E32\u0E01\u0E48\u0E2D\u0E19\">\n          <ion-icon name=\"chevron-back\"></ion-icon>\n        </button>\n        <span class=\"toolbar-label\">\n          {{ pageNo }} / {{ pageCount || '?' }}\n          <span *ngIf=\"loadedUntilPage < pageCount\" class=\"chunk-indicator\"\n            [title]=\"'\u0E42\u0E2B\u0E25\u0E14\u0E41\u0E25\u0E49\u0E27 ' + loadedUntilPage + ' / ' + pageCount + ' \u0E2B\u0E19\u0E49\u0E32'\">\n            <ion-spinner *ngIf=\"isLoadingChunk\" name=\"crescent\" style=\"width:10px;height:10px;\"></ion-spinner>\n            <span *ngIf=\"!isLoadingChunk\">({{ loadedUntilPage }}\u2193)</span>\n          </span>\n        </span>\n        <button class=\"toolbar-btn\" (click)=\"nextPage()\" [disabled]=\"pageNo >= pageCount || isLoadingChunk\" title=\"\u0E2B\u0E19\u0E49\u0E32\u0E16\u0E31\u0E14\u0E44\u0E1B\">\n          <ion-icon name=\"chevron-forward\"></ion-icon>\n        </button>\n        <button class=\"toolbar-btn\" (click)=\"lastPage()\" [disabled]=\"pageNo >= pageCount || isLoadingChunk\" title=\"\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E38\u0E14\u0E17\u0E49\u0E32\u0E22 (\u0E42\u0E2B\u0E25\u0E14\u0E41\u0E25\u0E49\u0E27 {{ loadedUntilPage }} \u0E2B\u0E19\u0E49\u0E32)\">\n          <ion-icon name=\"play-skip-forward\"></ion-icon>\n        </button>\n      </div>\n\n      <!-- Pages per view selector -->\n      <div class=\"toolbar-group toolbar-group--ppv\" title=\"\u0E08\u0E33\u0E19\u0E27\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E41\u0E2A\u0E14\u0E07\">\n        <ion-icon name=\"layers-outline\" style=\"font-size:15px;color:#64748b;flex-shrink:0\"></ion-icon>\n        <select class=\"ppv-select\" [value]=\"pagesPerChunk\" (change)=\"setPagesPerChunk(+$any($event.target).value)\">\n          <option value=\"5\">5 \u0E2B\u0E19\u0E49\u0E32</option>\n          <option value=\"10\" selected>10 \u0E2B\u0E19\u0E49\u0E32</option>\n          <option value=\"20\">20 \u0E2B\u0E19\u0E49\u0E32</option>\n          <option value=\"50\">50 \u0E2B\u0E19\u0E49\u0E32</option>\n          <option value=\"0\">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</option>\n        </select>\n      </div>\n\n      <div class=\"toolbar-spacer\"></div>\n\n      <!-- Insert Blank Page + Delete Page -->\n      <div class=\"tool-item insert-page-tool\">\n        <button class=\"toolbar-btn\" (click)=\"showInsertMenu = !showInsertMenu\" title=\"\u0E41\u0E17\u0E23\u0E01/\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\">\n          <ion-icon name=\"documents-outline\"></ion-icon>\n          <ion-icon name=\"chevron-down-outline\" class=\"shape-chevron\"></ion-icon>\n        </button>\n\n        <!-- Dropdown -->\n        <div class=\"insert-page-dropdown\" *ngIf=\"showInsertMenu\">\n          <div class=\"insert-page-backdrop\" (click)=\"showInsertMenu = false\"></div>\n          <div class=\"insert-page-menu\">\n\n            <!-- Section: \u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32 -->\n            <div class=\"insert-page-title\">\n              <ion-icon name=\"add-circle-outline\"></ion-icon> \u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32\n            </div>\n\n            <!-- Orientation Toggle -->\n            <div class=\"insert-orient-row\">\n              <span class=\"insert-orient-label\">\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A:</span>\n              <div class=\"insert-orient-group\">\n                <button class=\"insert-orient-btn\"\n                  [class.active]=\"insertOrientation === 'portrait'\"\n                  (click)=\"insertOrientation = 'portrait'\" title=\"\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07\">\n                  <ion-icon name=\"phone-portrait-outline\"></ion-icon>\n                  <span>\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07</span>\n                </button>\n                <button class=\"insert-orient-btn\"\n                  [class.active]=\"insertOrientation === 'landscape'\"\n                  (click)=\"insertOrientation = 'landscape'\" title=\"\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19\">\n                  <ion-icon name=\"phone-landscape-outline\"></ion-icon>\n                  <span>\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19</span>\n                </button>\n              </div>\n            </div>\n\n            <!-- Before / After -->\n            <button class=\"insert-page-btn\" (click)=\"insertBlankPage('before')\">\n              <ion-icon name=\"arrow-up-outline\"></ion-icon>\n              <span>\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49 <small>(\u0E2B\u0E19\u0E49\u0E32 {{ pageNo }})</small></span>\n            </button>\n            <button class=\"insert-page-btn\" (click)=\"insertBlankPage('after')\">\n              <ion-icon name=\"arrow-down-outline\"></ion-icon>\n              <span>\u0E2B\u0E25\u0E31\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49 <small>(\u0E2B\u0E19\u0E49\u0E32 {{ pageNo + 1 }})</small></span>\n            </button>\n\n            <div class=\"insert-menu-divider\"></div>\n\n            <!-- Section: \u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32 -->\n            <div class=\"insert-page-title insert-page-title--danger\">\n              <ion-icon name=\"trash-outline\"></ion-icon> \u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\n            </div>\n            <button class=\"insert-page-btn insert-page-btn--danger\"\n              [disabled]=\"pageCount <= 1\"\n              (click)=\"deletePage()\">\n              <ion-icon name=\"close-circle-outline\"></ion-icon>\n              <span>\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49 <small>(\u0E2B\u0E19\u0E49\u0E32 {{ pageNo }})</small></span>\n            </button>\n\n            <div class=\"insert-menu-divider\"></div>\n\n            <!-- Section: \u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A -->\n            <button class=\"insert-page-btn insert-page-btn--undo\"\n              [disabled]=\"!canUndoPageOp\"\n              (click)=\"undoPageOp()\">\n              <ion-icon name=\"arrow-undo-outline\"></ion-icon>\n              <span>\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E41\u0E17\u0E23\u0E01/\u0E25\u0E1A <small *ngIf=\"!canUndoPageOp\">(\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34)</small></span>\n            </button>\n\n          </div>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <div class=\"toolbar-group toolbar-group--save\">\n        <button class=\"toolbar-btn toolbar-btn--save\" (click)=\"saveDocument()\">\n          <ion-icon name=\"save-outline\"></ion-icon>\n          <span>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01</span>\n        </button>\n        <!-- User Guide Toggle -->\n        <button class=\"toolbar-btn toolbar-btn--guide\" [class.active]=\"showUserGuidePanel\" (click)=\"toggleUserGuide($event)\" title=\"\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\">\n          <ion-icon name=\"book\"></ion-icon>\n          <span style=\"font-weight: 500; font-size: 13px;\">\u0E41\u0E19\u0E30\u0E19\u0E33\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</span>\n        </button>\n        <!-- History Panel Toggle -->\n        <button class=\"toolbar-btn\" [class.active]=\"showHistoryPanel\" (click)=\"toggleHistoryPanel()\" title=\"\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02\">\n          <ion-icon name=\"time-outline\"></ion-icon>\n        </button>\n      </div>\n    </div>\n\n    <!-- Top Toolbar Row 2: Tools -->\n    <div class=\"toolbar-row toolbar-row--tools\">\n      <!-- Text Tool -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"textPlaceMode\" (click)=\"enableTextPlaceMode()\" title=\"\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\">\n          <ion-icon name=\"text\"></ion-icon>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"textPlaceMode\">\n          <button (click)=\"changeTextFontSize(-2)\" [disabled]=\"textFontSize <= 8\"><ion-icon\n              name=\"remove\"></ion-icon></button>\n          <span>{{ textFontSize }}</span>\n          <button (click)=\"changeTextFontSize(2)\" [disabled]=\"textFontSize >= 100\"><ion-icon\n              name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setTextColor('#000000')\"\n              [class.active]=\"textColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setTextColor('#0000FF')\"\n              [class.active]=\"textColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setTextColor('#FF0000')\"\n              [class.active]=\"textColor === '#FF0000'\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"textColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"textColor\" (input)=\"setTextColor($any($event.target).value)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Quick Mark Stamps + Form Fields -->\n      <div class=\"tool-item mark-tool-item\">\n        <button class=\"toolbar-btn mark-toolbar-btn\" [class.active]=\"showMarkOptions || toolMode === 'mark'\"\n          (click)=\"showMarkOptions = !showMarkOptions\" title=\"\u0E41\u0E1A\u0E1A\u0E1F\u0E2D\u0E23\u0E4C\u0E21\">\n          <!-- Fixed form icon: shows checkbox + radio + text rows -->\n          <svg width=\"22\" height=\"22\" viewBox=\"0 0 22 22\" fill=\"none\">\n            <rect x=\"1\" y=\"2\" width=\"7\" height=\"6\" rx=\"1.2\" stroke=\"currentColor\" stroke-width=\"1.6\"/>\n            <polyline points=\"2.5,5 4.2,7 7.5,3\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n            <line x1=\"10\" y1=\"5\" x2=\"21\" y2=\"5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n            <circle cx=\"4.5\" cy=\"14\" r=\"3.2\" stroke=\"currentColor\" stroke-width=\"1.6\"/>\n            <circle cx=\"4.5\" cy=\"14\" r=\"1.5\" fill=\"currentColor\"/>\n            <line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"14\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n            <line x1=\"10\" y1=\"20\" x2=\"21\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n            <line x1=\"1\" y1=\"20\" x2=\"7.5\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n            <line x1=\"1\" y1=\"17.5\" x2=\"5\" y2=\"17.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n          </svg>\n          <span class=\"mark-btn-label\">\u0E41\u0E1A\u0E1A\u0E1F\u0E2D\u0E23\u0E4C\u0E21</span>\n          <ion-icon name=\"chevron-down-outline\" class=\"mark-chevron\"></ion-icon>\n        </button>\n\n        <div class=\"mark-popup\" *ngIf=\"showMarkOptions\">\n          <!-- Quick Marks section -->\n          <div class=\"mark-popup-section-label\">\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E2B\u0E21\u0E32\u0E22\u0E14\u0E48\u0E27\u0E19</div>\n          <div class=\"mark-quick-row\">\n            <button class=\"mark-quick-btn\" [class.active]=\"toolMode === 'mark' && markType === 'check'\"\n              (click)=\"enableMarkMode('check')\" title=\"\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E2B\u0E21\u0E32\u0E22\u0E16\u0E39\u0E01\">\n              <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\"><polyline points=\"4,14 11,21 24,7\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>\n            </button>\n            <button class=\"mark-quick-btn\" [class.active]=\"toolMode === 'mark' && markType === 'cross'\"\n              (click)=\"enableMarkMode('cross')\" title=\"\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E2B\u0E21\u0E32\u0E22\u0E1C\u0E34\u0E14\">\n              <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\"><line x1=\"5\" y1=\"5\" x2=\"23\" y2=\"23\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"23\" y1=\"5\" x2=\"5\" y2=\"23\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/></svg>\n            </button>\n            <button class=\"mark-quick-btn\" [class.active]=\"toolMode === 'mark' && markType === 'dot'\"\n              (click)=\"enableMarkMode('dot')\" title=\"\u0E08\u0E38\u0E14\">\n              <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\"><circle cx=\"14\" cy=\"14\" r=\"9\" fill=\"currentColor\"/></svg>\n            </button>\n          </div>\n\n          <!-- Form Fields section -->\n          <div class=\"mark-popup-divider\"></div>\n          <div class=\"mark-popup-section-label\">\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E1F\u0E34\u0E25\u0E14\u0E4C\u0E41\u0E1A\u0E1A\u0E1F\u0E2D\u0E23\u0E4C\u0E21\u0E43\u0E2B\u0E21\u0E48</div>\n          <div class=\"mark-form-list\">\n            <button class=\"mark-form-row-btn\" [class.active]=\"toolMode === 'formfield' && formFieldType === 'text'\"\n              (click)=\"enableFormFieldMode('text')\" title=\"Text Field\">\n              <span class=\"mark-form-row-icon mark-form-row-icon--text\">Aa</span>\n              <span>Text Field</span>\n            </button>\n            <button class=\"mark-form-row-btn\" [class.active]=\"toolMode === 'formfield' && formFieldType === 'checkbox'\"\n              (click)=\"enableFormFieldMode('checkbox')\" title=\"Checkbox\">\n              <span class=\"mark-form-row-icon\">\n                <svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\"><rect x=\"1\" y=\"1\" width=\"16\" height=\"16\" rx=\"2.5\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/><polyline points=\"4,9 7,13 14,5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>\n              </span>\n              <span>Checkbox</span>\n            </button>\n            <button class=\"mark-form-row-btn\" [class.active]=\"toolMode === 'formfield' && formFieldType === 'radio'\"\n              (click)=\"enableFormFieldMode('radio')\" title=\"Radio Button\">\n              <span class=\"mark-form-row-icon\">\n                <svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\"><circle cx=\"9\" cy=\"9\" r=\"8\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"9\" cy=\"9\" r=\"4\" fill=\"currentColor\"/></svg>\n              </span>\n              <span>Radio Button</span>\n            </button>\n          </div>\n\n          <!-- Size + Color controls (compact, below fold) -->\n          <div class=\"mark-popup-divider\"></div>\n          <div class=\"mark-controls-row\">\n            <button (click)=\"changeMarkSize(-4)\" [disabled]=\"markSize <= 12\"><ion-icon name=\"remove\"></ion-icon></button>\n            <span class=\"mark-size-val\">{{ markSize }}</span>\n            <button (click)=\"changeMarkSize(4)\" [disabled]=\"markSize >= 96\"><ion-icon name=\"add\"></ion-icon></button>\n            <div class=\"color-dots\" style=\"margin-left: 6px;\">\n              <div class=\"color-dot\" style=\"background:#000\" (click)=\"setMarkColor('#000000')\" [class.active]=\"markColor === '#000000'\"></div>\n              <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setMarkColor('#0000FF')\" [class.active]=\"markColor === '#0000FF'\"></div>\n              <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setMarkColor('#FF0000')\" [class.active]=\"markColor === '#FF0000'\"></div>\n              <div class=\"color-dot\" style=\"background:#009900\" (click)=\"setMarkColor('#009900')\" [class.active]=\"markColor === '#009900'\"></div>\n              <div class=\"color-dot color-dot--custom\" [style.background]=\"markColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n                <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n                <input type=\"color\" [value]=\"markColor\" (input)=\"setMarkColor($any($event.target).value)\">\n              </div>\n            </div>\n          </div>\n\n          <!-- Cancel / close popup -->\n          <div class=\"mark-popup-divider\"></div>\n          <button class=\"mark-cancel-btn\" (click)=\"showMarkOptions = false; toolMode = 'none'; updateCursor()\">\n            <ion-icon name=\"close-outline\"></ion-icon>\n            \u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\n          </button>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Shapes \u2014 Dropdown -->\n      <div class=\"tool-item shape-tool-item\">\n        <!-- Main shape button: shows current shape icon, click to activate/toggle dropdown -->\n        <button class=\"toolbar-btn\" [class.active]=\"shapeMode\"\n          (click)=\"toolMode='shape'; showShapeDropdown=!showShapeDropdown\" title=\"\u0E23\u0E39\u0E1B\u0E17\u0E23\u0E07\">\n          <ion-icon [name]=\"shapeType === 'rect' ? 'square-outline'\n                          : shapeType === 'circle' ? 'ellipse-outline'\n                          : shapeType === 'line' ? 'remove-outline'\n                          : 'arrow-forward-outline'\"></ion-icon>\n          <ion-icon name=\"chevron-down-outline\" class=\"shape-chevron\"></ion-icon>\n        </button>\n\n        <!-- Dropdown: choose shape type -->\n        <div class=\"shape-dropdown\" *ngIf=\"showShapeDropdown\">\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'rect'\" (click)=\"selectShape('rect')\"\n            title=\"\u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21\">\n            <ion-icon name=\"square-outline\"></ion-icon>\n          </button>\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'circle'\" (click)=\"selectShape('circle')\"\n            title=\"\u0E27\u0E07\u0E01\u0E25\u0E21\">\n            <ion-icon name=\"ellipse-outline\"></ion-icon>\n          </button>\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'line'\" (click)=\"selectShape('line')\" title=\"\u0E40\u0E2A\u0E49\u0E19\">\n            <ion-icon name=\"remove-outline\"></ion-icon>\n          </button>\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'arrow'\" (click)=\"selectShape('arrow')\"\n            title=\"\u0E25\u0E39\u0E01\u0E28\u0E23\">\n            <ion-icon name=\"arrow-forward-outline\"></ion-icon>\n          </button>\n        </div>\n\n        <!-- Options panel: stroke width, stroke color, fill color -->\n        <div class=\"shape-options-panel\" *ngIf=\"shapeMode\">\n\n          <!-- Stroke width -->\n          <div class=\"shape-opt-group\">\n            <span class=\"shape-opt-label\">\u0E02\u0E19\u0E32\u0E14</span>\n            <button class=\"sopt-btn\" (click)=\"changeShapeStrokeSize(-1)\" [disabled]=\"shapeStrokeSize <= 1\">\n              <ion-icon name=\"remove\"></ion-icon>\n            </button>\n            <span class=\"sopt-val\">{{ shapeStrokeSize }}</span>\n            <button class=\"sopt-btn\" (click)=\"changeShapeStrokeSize(1)\" [disabled]=\"shapeStrokeSize >= 20\">\n              <ion-icon name=\"add\"></ion-icon>\n            </button>\n          </div>\n\n          <div class=\"sopt-divider\"></div>\n\n          <!-- Stroke color (disabled when no-stroke is on) -->\n          <div class=\"shape-opt-group\">\n            <span class=\"shape-opt-label\">\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A</span>\n            <!-- No stroke toggle -->\n            <button class=\"sopt-fill-toggle\" [class.active]=\"shapeNoStroke\" (click)=\"toggleShapeNoStroke()\"\n              title=\"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A\">\n              <ion-icon name=\"ban-outline\"></ion-icon>\n            </button>\n            <div class=\"mac-color-grid\" [class.disabled]=\"shapeNoStroke\">\n              <div class=\"mac-swatch\" *ngFor=\"let c of shapeColorSwatches\" [style.background]=\"c\"\n                [class.active]=\"shapeStrokeColor === c && !shapeNoStroke\"\n                (click)=\"!shapeNoStroke && setShapeStrokeColor(c)\" [title]=\"c\"></div>\n            </div>\n            <div class=\"mac-custom-color\" [class.disabled]=\"shapeNoStroke\">\n              <div class=\"mac-swatch mac-swatch--current\" [style.background]=\"shapeStrokeColor\"></div>\n              <input type=\"color\" [value]=\"shapeStrokeColor\" (input)=\"setShapeStrokeColor($any($event.target).value)\"\n                [disabled]=\"shapeNoStroke\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\" />\n            </div>\n          </div>\n\n          <div class=\"sopt-divider\"></div>\n\n          <!-- Fill color -->\n          <div class=\"shape-opt-group\">\n            <span class=\"shape-opt-label\">\u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19</span>\n            <button class=\"sopt-fill-toggle\" [class.active]=\"shapeFillEnabled\" (click)=\"toggleShapeFill()\"\n              title=\"\u0E40\u0E1B\u0E34\u0E14/\u0E1B\u0E34\u0E14\u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19\">\n              <ion-icon [name]=\"shapeFillEnabled ? 'color-fill' : 'color-fill-outline'\"></ion-icon>\n            </button>\n            <div class=\"mac-color-grid\" [class.disabled]=\"!shapeFillEnabled\">\n              <div class=\"mac-swatch\" *ngFor=\"let c of shapeFillSwatches\" [style.background]=\"c\"\n                [class.active]=\"shapeFillColor === c && shapeFillEnabled\"\n                (click)=\"shapeFillEnabled && setShapeFillColor(c)\" [title]=\"c\"></div>\n            </div>\n            <div class=\"mac-custom-color\" [class.disabled]=\"!shapeFillEnabled\">\n              <div class=\"mac-swatch mac-swatch--current\" [style.background]=\"shapeFillColor\"></div>\n              <input type=\"color\" [value]=\"shapeFillColor\" (input)=\"setShapeFillColor($any($event.target).value)\"\n                [disabled]=\"!shapeFillEnabled\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19\u0E40\u0E2D\u0E07\" />\n            </div>\n          </div>\n\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Draw Tool -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"drawMode\" (click)=\"toggleDraw()\" title=\"\u0E27\u0E32\u0E14\">\n          <ion-icon name=\"brush\"></ion-icon>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"drawMode\">\n          <button (click)=\"changeBrushSize(-1)\" [disabled]=\"brushSize <= 1\"><ion-icon name=\"remove\"></ion-icon></button>\n          <span>{{ brushSize }}</span>\n          <button (click)=\"changeBrushSize(1)\" [disabled]=\"brushSize >= 50\"><ion-icon name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setBrushColor('#000000')\"\n              [class.active]=\"brushColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setBrushColor('#0000FF')\"\n              [class.active]=\"brushColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setBrushColor('#FF0000')\"\n              [class.active]=\"brushColor === '#FF0000'\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"brushColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"brushColor\" (input)=\"setBrushColor($any($event.target).value)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Highlight Tool -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"highlightMode\" (click)=\"toggleHighlight()\" title=\"\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C\">\n          <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n            <!-- Marker Body -->\n            <path d=\"M18 2l4 4L9 19H5v-4L18 2z\"></path>\n            <path d=\"M14 6l4 4\"></path>\n            <!-- Highlight Line -->\n            <line x1=\"3\" y1=\"22\" x2=\"21\" y2=\"22\" stroke-width=\"3\"></line>\n          </svg>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"highlightMode\">\n          <button (click)=\"changeHighlightSize(-5)\" [disabled]=\"highlightSize <= 5\"><ion-icon\n              name=\"remove\"></ion-icon></button>\n          <span>{{ highlightSize }}</span>\n          <button (click)=\"changeHighlightSize(5)\" [disabled]=\"highlightSize >= 100\"><ion-icon\n              name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#ffff00\" (click)=\"setHighlightColor('#ffff00')\"\n              [class.active]=\"highlightColor === '#ffff00'\" title=\"\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E07\"></div>\n            <div class=\"color-dot\" style=\"background:#00ff00\" (click)=\"setHighlightColor('#00ff00')\"\n              [class.active]=\"highlightColor === '#00ff00'\" title=\"\u0E40\u0E02\u0E35\u0E22\u0E27\"></div>\n            <div class=\"color-dot\" style=\"background:#00ffff\" (click)=\"setHighlightColor('#00ffff')\"\n              [class.active]=\"highlightColor === '#00ffff'\" title=\"\u0E1F\u0E49\u0E32\"></div>\n            <div class=\"color-dot\" style=\"background:#ff99c2\" (click)=\"setHighlightColor('#ff99c2')\"\n              [class.active]=\"highlightColor === '#ff99c2'\" title=\"\u0E0A\u0E21\u0E1E\u0E39\"></div>\n            <div class=\"color-dot\" style=\"background:#ffb366\" (click)=\"setHighlightColor('#ffb366')\"\n              [class.active]=\"highlightColor === '#ffb366'\" title=\"\u0E2A\u0E49\u0E21\"></div>\n            <div class=\"color-dot\" style=\"background:#d9b3ff\" (click)=\"setHighlightColor('#d9b3ff')\"\n              [class.active]=\"highlightColor === '#d9b3ff'\" title=\"\u0E21\u0E48\u0E27\u0E07\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"highlightColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\u0E23\u0E2B\u0E31\u0E2A HEX\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"highlightColor\" (input)=\"setHighlightColor($any($event.target).value)\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Eraser -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"eraserMode\" (click)=\"toggleEraser()\" title=\"\u0E22\u0E32\u0E07\u0E25\u0E1A (\u0E25\u0E1A\u0E40\u0E2A\u0E49\u0E19\u0E41\u0E25\u0E30\u0E23\u0E39\u0E1B\u0E17\u0E23\u0E07)\">\n          <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n            <path d=\"M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4C13.5 3.5 14.5 3.5 15 4L20 9C20.5 9.5 20.5 10.5 20 11L11 20H20V20Z\"/>\n            <path d=\"M17.5 15L9 6.5\"/>\n          </svg>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"eraserMode\">\n          <button (click)=\"changeEraserSize(-5)\" [disabled]=\"eraserSize <= 5\"><ion-icon name=\"remove\"></ion-icon></button>\n          <span>{{ eraserSize }}</span>\n          <button (click)=\"changeEraserSize(5)\" [disabled]=\"eraserSize >= 200\"><ion-icon name=\"add\"></ion-icon></button>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Insert Tools -->\n      <button class=\"toolbar-btn\" (click)=\"openSignaturePickerOrPad()\" title=\"\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\">\n        <ion-icon name=\"finger-print\"></ion-icon>\n      </button>\n      <button class=\"toolbar-btn toolbar-btn--toggle\" [class.active]=\"showDigitalId\"\n        (click)=\"showDigitalId = !showDigitalId\" title=\"\u0E41\u0E2A\u0E14\u0E07/\u0E0B\u0E48\u0E2D\u0E19 Digital ID\">\n        <ion-icon [name]=\"showDigitalId ? 'shield-checkmark' : 'shield-checkmark-outline'\"></ion-icon>\n        <span class=\"toggle-label\">DID</span>\n      </button>\n\n      <!-- Date Stamp with Options -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"showDateOptions\" (click)=\"addDateStampAndShowOptions()\"\n          title=\"\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\">\n          <ion-icon name=\"calendar\"></ion-icon>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"showDateOptions\">\n          <button (click)=\"changeDateFontSize(-2)\" [disabled]=\"dateFontSize <= 8\"><ion-icon\n              name=\"remove\"></ion-icon></button>\n          <span>{{ dateFontSize }}</span>\n          <button (click)=\"changeDateFontSize(2)\" [disabled]=\"dateFontSize >= 100\"><ion-icon\n              name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setDateColor('#000000')\"\n              [class.active]=\"dateColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setDateColor('#0000FF')\"\n              [class.active]=\"dateColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setDateColor('#FF0000')\"\n              [class.active]=\"dateColor === '#FF0000'\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"dateColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"dateColor\" (input)=\"setDateColor($any($event.target).value)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <button class=\"toolbar-btn\" (click)=\"triggerImageUpload()\" title=\"\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\">\n        <ion-icon name=\"image\"></ion-icon>\n      </button>\n      <input type=\"file\" #fileInput accept=\"image/*\" style=\"display:none\" (change)=\"onImageSelected($event)\">\n\n      <!-- Stamp Tool -->\n      <button class=\"toolbar-btn toolbar-btn--labeled\" (click)=\"openStampPicker()\" title=\"\u0E15\u0E23\u0E32\u0E22\u0E32\u0E07/\u0E15\u0E23\u0E32\u0E1B\u0E23\u0E30\u0E17\u0E31\u0E1A\">\n        <ion-icon name=\"business-outline\"></ion-icon>\n        <small>\u0E15\u0E23\u0E32\u0E22\u0E32\u0E07</small>\n      </button>\n      <input type=\"file\" #stampFileInput accept=\"image/*\" style=\"display:none\" (change)=\"onStampFileSelected($event)\">\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Page Flip -->\n      <div class=\"tool-item flip-tool-item\">\n        <button class=\"toolbar-btn toolbar-btn--labeled\" [class.active]=\"showFlipPanel\" (click)=\"toggleFlipPanel()\" title=\"\u0E1E\u0E25\u0E34\u0E01\u0E01\u0E23\u0E30\u0E14\u0E32\u0E29\">\n          <ion-icon name=\"swap-horizontal-outline\"></ion-icon>\n          <small>\u0E1E\u0E25\u0E34\u0E01\u0E01\u0E23\u0E30\u0E14\u0E32\u0E29</small>\n        </button>\n\n        <!-- Flip Panel (floating) -->\n        <div class=\"flip-panel\" *ngIf=\"showFlipPanel\">\n          <div class=\"flip-panel__header\">\n            <ion-icon name=\"swap-horizontal-outline\"></ion-icon> \u0E1E\u0E25\u0E34\u0E01\u0E01\u0E23\u0E30\u0E14\u0E32\u0E29\n            <button class=\"flip-panel__close\" (click)=\"closeFlipPanel()\">\u2715</button>\n          </div>\n          <div class=\"flip-panel__body\">\n            <div class=\"flip-scope\">\n              <label [class.active]=\"flipScope === 'current'\" (click)=\"flipScope = 'current'\">\n                <ion-icon name=\"document-outline\"></ion-icon> \u0E2B\u0E19\u0E49\u0E32\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 ({{ pageNo }})\n              </label>\n              <label [class.active]=\"flipScope === 'all'\" (click)=\"flipScope = 'all'\">\n                <ion-icon name=\"documents-outline\"></ion-icon> \u0E17\u0E38\u0E01\u0E2B\u0E19\u0E49\u0E32\n              </label>\n            </div>\n            <div class=\"flip-current-label\">\n              \u0E21\u0E38\u0E21\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19: <strong>{{ getPageFlip(pageNo) }}\u00B0</strong>\n            </div>\n            <div class=\"flip-angle-btns\">\n              <button class=\"flip-btn\" [class.active]=\"getPageFlip(pageNo) === 0\" (click)=\"setFlipAngle(0)\" title=\"0\u00B0 (\u0E1B\u0E01\u0E15\u0E34)\">0\u00B0</button>\n              <button class=\"flip-btn\" [class.active]=\"getPageFlip(pageNo) === 90\" (click)=\"setFlipAngle(90)\" title=\"90\u00B0 (\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19\u0E02\u0E27\u0E32)\">90\u00B0</button>\n              <button class=\"flip-btn\" [class.active]=\"getPageFlip(pageNo) === 180\" (click)=\"setFlipAngle(180)\" title=\"180\u00B0 (\u0E01\u0E25\u0E31\u0E1A\u0E2B\u0E31\u0E27)\">180\u00B0</button>\n              <button class=\"flip-btn\" [class.active]=\"getPageFlip(pageNo) === 270\" (click)=\"setFlipAngle(270)\" title=\"270\u00B0 (\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19\u0E0B\u0E49\u0E32\u0E22)\">270\u00B0</button>\n            </div>\n            <div class=\"flip-rotate-btns\">\n              <button class=\"flip-action-btn\" (click)=\"flipPageCCW()\" title=\"\u0E2B\u0E21\u0E38\u0E19\u0E17\u0E27\u0E19\u0E40\u0E02\u0E47\u0E21\">\n                <ion-icon name=\"return-up-back-outline\"></ion-icon> \u0E2B\u0E21\u0E38\u0E19\u0E0B\u0E49\u0E32\u0E22\n              </button>\n              <button class=\"flip-action-btn\" (click)=\"flipPageCW()\" title=\"\u0E2B\u0E21\u0E38\u0E19\u0E15\u0E32\u0E21\u0E40\u0E02\u0E47\u0E21\">\n                \u0E2B\u0E21\u0E38\u0E19\u0E02\u0E27\u0E32 <ion-icon name=\"return-up-forward-outline\"></ion-icon>\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Deskew (Page Straightening) -->\n      <button class=\"toolbar-btn toolbar-btn--labeled\" [class.active]=\"showDeskewPanel\" (click)=\"toggleDeskewPanel()\" title=\"\u0E2B\u0E21\u0E38\u0E19\u0E2B\u0E19\u0E49\u0E32/\u0E08\u0E31\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E23\u0E07\">\n        <ion-icon name=\"sync-outline\"></ion-icon>\n        <small>\u0E08\u0E31\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E23\u0E07</small>\n      </button>\n\n      <!-- Watermark -->\n      <div class=\"tool-item wm-tool-item\">\n        <button class=\"toolbar-btn toolbar-btn--labeled\" [class.active]=\"showWatermarkPanel || watermark.enabled\" (click)=\"toggleWatermarkPanel()\" title=\"\u0E25\u0E32\u0E22\u0E19\u0E49\u0E33\">\n          <ion-icon name=\"water-outline\"></ion-icon>\n          <small>\u0E25\u0E32\u0E22\u0E19\u0E49\u0E33</small>\n        </button>\n\n        <!-- Watermark Settings Panel -->\n        <div class=\"wm-panel\" *ngIf=\"showWatermarkPanel\">\n          <div class=\"wm-panel__header\">\n            <ion-icon name=\"water-outline\"></ion-icon> \u0E25\u0E32\u0E22\u0E19\u0E49\u0E33 (Watermark)\n            <button class=\"wm-panel__close\" (click)=\"closeWatermarkPanel()\">\u2715</button>\n          </div>\n          <div class=\"wm-panel__body\">\n            <div class=\"wm-row\">\n              <label>\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17</label>\n              <select [(ngModel)]=\"watermark.type\" class=\"wm-input\">\n                <option value=\"text\">\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21</option>\n                <option value=\"image\">\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E</option>\n              </select>\n            </div>\n            <div *ngIf=\"watermark.type === 'text'\">\n              <div class=\"wm-row\">\n                <label>\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21</label>\n                <input type=\"text\" [(ngModel)]=\"watermark.text\" class=\"wm-input\" placeholder=\"\u0E2A\u0E33\u0E40\u0E19\u0E32\" />\n              </div>\n              <div class=\"wm-row\">\n                <label>\u0E1F\u0E2D\u0E19\u0E15\u0E4C</label>\n                <select [(ngModel)]=\"watermark.fontFamily\" class=\"wm-input\">\n                  <option value=\"TH Sarabun New\">TH Sarabun New</option>\n                  <option value=\"TH Sarabun IT9\">TH Sarabun IT9</option>\n                  <option value=\"Noto Sans Thai\">Noto Sans Thai</option>\n                </select>\n              </div>\n              <div class=\"wm-row\">\n                <label>\u0E02\u0E19\u0E32\u0E14</label>\n                <input type=\"number\" [(ngModel)]=\"watermark.fontSize\" min=\"10\" max=\"120\" class=\"wm-input wm-input--sm\" />\n              </div>\n              <div class=\"wm-row\">\n                <label>\u0E2A\u0E35</label>\n                <div class=\"wm-color-wrap\">\n                  <div class=\"wm-color-swatch\" [style.background]=\"watermark.color\"></div>\n                  <input type=\"color\" [(ngModel)]=\"watermark.color\" />\n                </div>\n              </div>\n            </div>\n            <div *ngIf=\"watermark.type === 'image'\">\n              <div class=\"wm-row\">\n                <label>\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E23\u0E39\u0E1B</label>\n                <input type=\"file\" accept=\"image/*\" (change)=\"onWatermarkImageSelected($event)\" class=\"wm-file-input\" />\n              </div>\n              <div *ngIf=\"watermark.imageDataUrl\" class=\"wm-img-preview\">\n                <img [src]=\"watermark.imageDataUrl\" />\n              </div>\n            </div>\n            <div class=\"wm-section-title\">\u0E01\u0E32\u0E23\u0E41\u0E2A\u0E14\u0E07\u0E1C\u0E25</div>\n            <div class=\"wm-row\">\n              <label>\u0E04\u0E27\u0E32\u0E21\u0E42\u0E1B\u0E23\u0E48\u0E07\u0E43\u0E2A</label>\n              <input type=\"range\" min=\"5\" max=\"100\" [(ngModel)]=\"watermark.opacity\" class=\"wm-slider\" />\n              <span class=\"wm-val\">{{ watermark.opacity }}%</span>\n            </div>\n            <div class=\"wm-row\">\n              <label>\u0E21\u0E38\u0E21\u0E2B\u0E21\u0E38\u0E19</label>\n              <input type=\"range\" min=\"0\" max=\"360\" [(ngModel)]=\"watermark.rotation\" class=\"wm-slider\" />\n              <span class=\"wm-val\">{{ watermark.rotation }}\u00B0</span>\n            </div>\n            <div class=\"wm-row\">\n              <label>\u0E42\u0E2B\u0E21\u0E14</label>\n              <div class=\"wm-radio-group\">\n                <label><input type=\"radio\" [(ngModel)]=\"watermark.mode\" value=\"center\" /> \u0E01\u0E36\u0E48\u0E07\u0E01\u0E25\u0E32\u0E07</label>\n                <label><input type=\"radio\" [(ngModel)]=\"watermark.mode\" value=\"tiled\" /> \u0E01\u0E23\u0E30\u0E08\u0E32\u0E22\u0E40\u0E15\u0E47\u0E21\u0E2B\u0E19\u0E49\u0E32</label>\n              </div>\n            </div>\n            <div *ngIf=\"watermark.mode === 'tiled'\" class=\"wm-row\">\n              <label>\u0E23\u0E30\u0E22\u0E30\u0E2B\u0E48\u0E32\u0E07</label>\n              <div class=\"wm-spacing-group\">\n                <span>X</span>\n                <input type=\"number\" [(ngModel)]=\"watermark.spacingX\" min=\"50\" max=\"500\" class=\"wm-input wm-input--xs\" />\n                <span>Y</span>\n                <input type=\"number\" [(ngModel)]=\"watermark.spacingY\" min=\"50\" max=\"500\" class=\"wm-input wm-input--xs\" />\n              </div>\n            </div>\n            <div class=\"wm-row\">\n              <label>\u0E02\u0E2D\u0E1A\u0E40\u0E02\u0E15</label>\n              <div class=\"wm-radio-group\">\n                <label><input type=\"radio\" [(ngModel)]=\"watermark.scope\" value=\"all\" /> \u0E17\u0E38\u0E01\u0E2B\u0E19\u0E49\u0E32</label>\n                <label><input type=\"radio\" [(ngModel)]=\"watermark.scope\" value=\"current\" /> \u0E2B\u0E19\u0E49\u0E32\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19</label>\n              </div>\n            </div>\n          </div>\n          <div class=\"wm-panel__footer\">\n            <button class=\"wm-btn wm-btn--cancel\" (click)=\"removeWatermark(); closeWatermarkPanel()\">\n              <ion-icon name=\"close-outline\"></ion-icon> \u0E25\u0E1A\u0E25\u0E32\u0E22\u0E19\u0E49\u0E33\n            </button>\n            <button class=\"wm-btn wm-btn--apply\" (click)=\"applyWatermark()\">\n              <ion-icon name=\"checkmark-outline\"></ion-icon> \u0E43\u0E2A\u0E48\u0E25\u0E32\u0E22\u0E19\u0E49\u0E33\n            </button>\n          </div>\n        </div>\n      </div>\n\n      <!-- Page Numbers -->\n      <div class=\"tool-item pn-tool-item\">\n        <button class=\"toolbar-btn toolbar-btn--labeled\" [class.active]=\"showPageNumberPanel || pageNumber.enabled\" (click)=\"togglePageNumberPanel()\" title=\"\u0E40\u0E25\u0E02\u0E2B\u0E19\u0E49\u0E32\">\n          <ion-icon name=\"list-outline\"></ion-icon>\n          <small>\u0E40\u0E25\u0E02\u0E2B\u0E19\u0E49\u0E32</small>\n        </button>\n\n        <!-- Page Number Panel -->\n        <div class=\"pn-panel\" *ngIf=\"showPageNumberPanel\">\n          <div class=\"pn-panel__header\">\n            <ion-icon name=\"list-outline\"></ion-icon> \u0E40\u0E25\u0E02\u0E2B\u0E19\u0E49\u0E32\n            <button class=\"pn-panel__close\" (click)=\"closePageNumberPanel()\">\u2715</button>\n          </div>\n          <div class=\"pn-panel__body\" style=\"max-height: 60vh; overflow-y: auto;\">\n            <div class=\"pn-section-title\">\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02</div>\n            <div class=\"pn-format-btns\" style=\"flex-wrap: wrap;\">\n              <button class=\"pn-format-btn\" [class.active]=\"pageNumber.format === 'arabic'\" (click)=\"pageNumber.format = 'arabic'\" style=\"flex:1; min-width:70px;\">123 (\u0E2D\u0E32\u0E23\u0E32\u0E1A\u0E34\u0E01)</button>\n              <button class=\"pn-format-btn\" [class.active]=\"pageNumber.format === 'thai'\" (click)=\"pageNumber.format = 'thai'\" style=\"flex:1; min-width:70px;\">\u0E51\u0E52\u0E53 (\u0E44\u0E17\u0E22)</button>\n              <button class=\"pn-format-btn\" [class.active]=\"pageNumber.format === 'roman'\" (click)=\"pageNumber.format = 'roman'\" style=\"flex:1; min-width:70px;\">i, ii, iii</button>\n              <button class=\"pn-format-btn\" [class.active]=\"pageNumber.format === 'roman-upper'\" (click)=\"pageNumber.format = 'roman-upper'\" style=\"flex:1; min-width:70px;\">I, II, III</button>\n            </div>\n\n            <div class=\"pn-section-title\">\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07</div>\n            <div class=\"pn-pos-grid\">\n              <button class=\"pn-pos-btn\" [class.active]=\"pageNumber.position === 'top-left'\" (click)=\"pageNumber.position = 'top-left'\" title=\"\u0E1A\u0E19\u0E0B\u0E49\u0E32\u0E22\"><ion-icon name=\"arrow-up-outline\"></ion-icon> \u0E1A\u0E19\u0E0B\u0E49\u0E32\u0E22</button>\n              <button class=\"pn-pos-btn\" [class.active]=\"pageNumber.position === 'top-center'\" (click)=\"pageNumber.position = 'top-center'\" title=\"\u0E1A\u0E19\u0E01\u0E25\u0E32\u0E07\"><ion-icon name=\"remove-outline\"></ion-icon> \u0E1A\u0E19\u0E01\u0E25\u0E32\u0E07</button>\n              <button class=\"pn-pos-btn\" [class.active]=\"pageNumber.position === 'top-right'\" (click)=\"pageNumber.position = 'top-right'\" title=\"\u0E1A\u0E19\u0E02\u0E27\u0E32\"><ion-icon name=\"arrow-up-outline\"></ion-icon> \u0E1A\u0E19\u0E02\u0E27\u0E32</button>\n              <button class=\"pn-pos-btn\" [class.active]=\"pageNumber.position === 'bottom-left'\" (click)=\"pageNumber.position = 'bottom-left'\" title=\"\u0E25\u0E48\u0E32\u0E07\u0E0B\u0E49\u0E32\u0E22\"><ion-icon name=\"arrow-down-outline\"></ion-icon> \u0E25\u0E48\u0E32\u0E07\u0E0B\u0E49\u0E32\u0E22</button>\n              <button class=\"pn-pos-btn\" [class.active]=\"pageNumber.position === 'bottom-center'\" (click)=\"pageNumber.position = 'bottom-center'\" title=\"\u0E25\u0E48\u0E32\u0E07\u0E01\u0E25\u0E32\u0E07\"><ion-icon name=\"remove-outline\"></ion-icon> \u0E25\u0E48\u0E32\u0E07\u0E01\u0E25\u0E32\u0E07</button>\n              <button class=\"pn-pos-btn\" [class.active]=\"pageNumber.position === 'bottom-right'\" (click)=\"pageNumber.position = 'bottom-right'\" title=\"\u0E25\u0E48\u0E32\u0E07\u0E02\u0E27\u0E32\"><ion-icon name=\"arrow-down-outline\"></ion-icon> \u0E25\u0E48\u0E32\u0E07\u0E02\u0E27\u0E32</button>\n            </div>\n\n            <div class=\"pn-row\" style=\"margin-top: 6px;\">\n              <label class=\"pn-checkbox\">\n                <input type=\"checkbox\" [(ngModel)]=\"pageNumber.mirror\" /> \u0E2A\u0E25\u0E31\u0E1A\u0E0B\u0E49\u0E32\u0E22-\u0E02\u0E27\u0E32 (\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E2A\u0E2D\u0E07\u0E2B\u0E19\u0E49\u0E32)\n              </label>\n            </div>\n\n            <div class=\"pn-section-title\" style=\"margin-top: 10px;\">\u0E0A\u0E48\u0E27\u0E07\u0E2B\u0E19\u0E49\u0E32</div>\n            <div class=\"pn-row\">\n              <label>\u0E40\u0E23\u0E34\u0E48\u0E21\u0E19\u0E31\u0E1A\u0E17\u0E35\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E08\u0E23\u0E34\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48</label>\n              <input type=\"number\" [(ngModel)]=\"pageNumber.startAtPage\" min=\"1\" [max]=\"pageCount\" class=\"pn-input pn-input--sm\" />\n            </div>\n            <div class=\"pn-row\">\n              <label>\u0E40\u0E25\u0E02\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19</label>\n              <input type=\"number\" [(ngModel)]=\"pageNumber.startFrom\" min=\"1\" class=\"pn-input pn-input--sm\" />\n            </div>\n            <div class=\"pn-row\">\n              <label class=\"pn-checkbox\">\n                <input type=\"checkbox\" [(ngModel)]=\"pageNumber.skipFirstPage\" /> \u0E44\u0E21\u0E48\u0E41\u0E2A\u0E14\u0E07\u0E17\u0E35\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E23\u0E01 (\u0E2B\u0E19\u0E49\u0E32\u0E1B\u0E01)\n              </label>\n            </div>\n\n            <div class=\"pn-section-title\" style=\"margin-top: 10px;\">\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E41\u0E2A\u0E14\u0E07</div>\n            <div class=\"pn-format-btns\" style=\"flex-wrap: wrap;\">\n              <button class=\"pn-format-btn\" [class.active]=\"pageNumber.pageScope === 'all'\" (click)=\"pageNumber.pageScope = 'all'\" style=\"flex:1; min-width:60px;\">\u0E17\u0E38\u0E01\u0E2B\u0E19\u0E49\u0E32</button>\n              <button class=\"pn-format-btn\" [class.active]=\"pageNumber.pageScope === 'odd'\" (click)=\"pageNumber.pageScope = 'odd'\" style=\"flex:1; min-width:60px;\">\u0E2B\u0E19\u0E49\u0E32\u0E04\u0E35\u0E48</button>\n              <button class=\"pn-format-btn\" [class.active]=\"pageNumber.pageScope === 'even'\" (click)=\"pageNumber.pageScope = 'even'\" style=\"flex:1; min-width:60px;\">\u0E2B\u0E19\u0E49\u0E32\u0E04\u0E39\u0E48</button>\n              <button class=\"pn-format-btn\" [class.active]=\"pageNumber.pageScope === 'custom'\" (click)=\"pageNumber.pageScope = 'custom'\" style=\"flex:1; min-width:60px;\">\u0E23\u0E30\u0E1A\u0E38\u0E40\u0E2D\u0E07</button>\n            </div>\n            <div class=\"pn-row\" *ngIf=\"pageNumber.pageScope === 'custom'\">\n              <label>\u0E23\u0E30\u0E1A\u0E38\u0E2B\u0E19\u0E49\u0E32</label>\n              <input type=\"text\" [(ngModel)]=\"pageNumber.customPages\" class=\"pn-input\" placeholder=\"\u0E40\u0E0A\u0E48\u0E19 1,3,5-10\" style=\"font-size: 13px;\" />\n            </div>\n\n            <div class=\"pn-section-title\" style=\"margin-top: 10px;\">\u0E04\u0E33\u0E19\u0E33\u0E2B\u0E19\u0E49\u0E32 / \u0E04\u0E33\u0E15\u0E48\u0E2D\u0E17\u0E49\u0E32\u0E22</div>\n            <div class=\"pn-row\">\n              <label class=\"pn-checkbox\">\n                <input type=\"checkbox\" [(ngModel)]=\"pageNumber.showPrefix\" /> \u0E41\u0E2A\u0E14\u0E07\u0E04\u0E33\u0E19\u0E33\u0E2B\u0E19\u0E49\u0E32\n              </label>\n            </div>\n            <div class=\"pn-row\" *ngIf=\"pageNumber.showPrefix\">\n              <label>\u0E04\u0E33\u0E19\u0E33\u0E2B\u0E19\u0E49\u0E32</label>\n              <input type=\"text\" [(ngModel)]=\"pageNumber.prefixText\" class=\"pn-input\" placeholder=\"\u0E2B\u0E19\u0E49\u0E32 \" style=\"font-size: 13px;\" />\n            </div>\n            <div class=\"pn-row\">\n              <label>\u0E04\u0E33\u0E15\u0E48\u0E2D\u0E17\u0E49\u0E32\u0E22</label>\n              <input type=\"text\" [(ngModel)]=\"pageNumber.suffixText\" class=\"pn-input\" placeholder=\"\u0E40\u0E0A\u0E48\u0E19 /{{ pageCount }}\" style=\"font-size: 13px;\" />\n            </div>\n\n            <div class=\"pn-section-title\" style=\"margin-top: 10px;\">\u0E2A\u0E48\u0E27\u0E19\u0E2B\u0E31\u0E27 / \u0E2A\u0E48\u0E27\u0E19\u0E17\u0E49\u0E32\u0E22</div>\n            <div class=\"pn-row\">\n              <label>\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E48\u0E27\u0E19\u0E2B\u0E31\u0E27</label>\n              <input type=\"text\" [(ngModel)]=\"pageNumber.headerText\" class=\"pn-input\" placeholder=\"\u0E40\u0E0A\u0E48\u0E19 \u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\" style=\"font-size: 13px;\" />\n            </div>\n            <div class=\"pn-row\" *ngIf=\"pageNumber.headerText\">\n              <label>\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E2B\u0E31\u0E27</label>\n              <div class=\"pn-format-btns\" style=\"flex-wrap: wrap;\">\n                <button class=\"pn-format-btn\" [class.active]=\"pageNumber.headerPosition === 'top-left'\" (click)=\"pageNumber.headerPosition = 'top-left'\" style=\"flex:1; min-width:50px; font-size: 11px;\">\u0E0B\u0E49\u0E32\u0E22</button>\n                <button class=\"pn-format-btn\" [class.active]=\"pageNumber.headerPosition === 'top-center'\" (click)=\"pageNumber.headerPosition = 'top-center'\" style=\"flex:1; min-width:50px; font-size: 11px;\">\u0E01\u0E25\u0E32\u0E07</button>\n                <button class=\"pn-format-btn\" [class.active]=\"pageNumber.headerPosition === 'top-right'\" (click)=\"pageNumber.headerPosition = 'top-right'\" style=\"flex:1; min-width:50px; font-size: 11px;\">\u0E02\u0E27\u0E32</button>\n              </div>\n            </div>\n            <div class=\"pn-row\">\n              <label>\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E48\u0E27\u0E19\u0E17\u0E49\u0E32\u0E22</label>\n              <input type=\"text\" [(ngModel)]=\"pageNumber.footerText\" class=\"pn-input\" placeholder=\"\u0E40\u0E0A\u0E48\u0E19 \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E1E\u0E34\u0E21\u0E1E\u0E4C\" style=\"font-size: 13px;\" />\n            </div>\n            <div class=\"pn-row\" *ngIf=\"pageNumber.footerText\">\n              <label>\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E17\u0E49\u0E32\u0E22</label>\n              <div class=\"pn-format-btns\" style=\"flex-wrap: wrap;\">\n                <button class=\"pn-format-btn\" [class.active]=\"pageNumber.footerPosition === 'bottom-left'\" (click)=\"pageNumber.footerPosition = 'bottom-left'\" style=\"flex:1; min-width:50px; font-size: 11px;\">\u0E0B\u0E49\u0E32\u0E22</button>\n                <button class=\"pn-format-btn\" [class.active]=\"pageNumber.footerPosition === 'bottom-center'\" (click)=\"pageNumber.footerPosition = 'bottom-center'\" style=\"flex:1; min-width:50px; font-size: 11px;\">\u0E01\u0E25\u0E32\u0E07</button>\n                <button class=\"pn-format-btn\" [class.active]=\"pageNumber.footerPosition === 'bottom-right'\" (click)=\"pageNumber.footerPosition = 'bottom-right'\" style=\"flex:1; min-width:50px; font-size: 11px;\">\u0E02\u0E27\u0E32</button>\n              </div>\n            </div>\n\n            <div class=\"pn-section-title\" style=\"margin-top: 10px;\">\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23</div>\n            <div class=\"pn-row\">\n              <label>\u0E1F\u0E2D\u0E19\u0E15\u0E4C</label>\n              <select [(ngModel)]=\"pageNumber.fontFamily\" class=\"pn-input\">\n                <option value=\"TH Sarabun New\">TH Sarabun New</option>\n                <option value=\"TH Sarabun IT9\">TH Sarabun IT9</option>\n                <option value=\"Noto Sans Thai\">Noto Sans Thai</option>\n              </select>\n            </div>\n            <div class=\"pn-row\">\n              <label>\u0E02\u0E19\u0E32\u0E14</label>\n              <input type=\"number\" [(ngModel)]=\"pageNumber.fontSize\" min=\"8\" max=\"36\" class=\"pn-input pn-input--sm\" />\n            </div>\n            <div class=\"pn-row\">\n              <label>\u0E2A\u0E35</label>\n              <div class=\"wm-color-wrap\">\n                <div class=\"wm-color-swatch\" [style.background]=\"pageNumber.color\"></div>\n                <input type=\"color\" [(ngModel)]=\"pageNumber.color\" />\n              </div>\n            </div>\n\n            <div class=\"pn-preview-box\" style=\"margin-top: 8px;\">\n              \u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07: <strong [style.font-family]=\"pageNumber.fontFamily\" [style.font-size.px]=\"pageNumber.fontSize\" [style.color]=\"pageNumber.color\">{{ formatPageNum(pageNumber.startAtPage) }}</strong>\n            </div>\n          </div>\n          <div class=\"pn-panel__footer\">\n            <button class=\"wm-btn wm-btn--cancel\" (click)=\"removePageNumbers(); closePageNumberPanel()\">\n              <ion-icon name=\"trash-outline\"></ion-icon> \u0E25\u0E1A\n            </button>\n            <button class=\"wm-btn wm-btn--apply\" (click)=\"applyPageNumbers()\">\n              <ion-icon name=\"checkmark-outline\"></ion-icon> \u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E15\u0E32\u0E21\u0E19\u0E35\u0E49\n            </button>\n          </div>\n        </div>\n      </div>\n\n      <!-- Split PDF -->\n      <div class=\"tool-item split-tool-item\" style=\"position: relative;\">\n        <button class=\"toolbar-btn toolbar-btn--labeled\" [class.active]=\"showSplitPanel\" (click)=\"toggleSplitPanel()\" title=\"\u0E41\u0E22\u0E01 PDF (\u0E14\u0E32\u0E27\u0E19\u0E4C\u0E42\u0E2B\u0E25\u0E14\u0E1A\u0E32\u0E07\u0E2B\u0E19\u0E49\u0E32)\">\n          <ion-icon name=\"cut-outline\"></ion-icon>\n          <small>\u0E41\u0E22\u0E01 PDF</small>\n        </button>\n\n        <div class=\"split-panel\" *ngIf=\"showSplitPanel\" style=\"position: absolute; top: calc(100% + 6px); right: 0; z-index: 1000; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 280px; padding: 16px;\">\n          <div style=\"display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:8px; margin-bottom:12px;\">\n            <strong style=\"color:#1e293b; display:flex; align-items:center; gap:6px;\">\n              <ion-icon name=\"cut-outline\"></ion-icon> \u0E41\u0E22\u0E01 PDF\n            </strong>\n            <button (click)=\"showSplitPanel = false\" style=\"background:none; border:none; cursor:pointer; font-size:18px;\">&times;</button>\n          </div>\n          <div style=\"margin-bottom:12px;\">\n            <label style=\"display:block; font-size:13px; color:#64748b; margin-bottom:6px;\">\u0E23\u0E30\u0E1A\u0E38\u0E2B\u0E19\u0E49\u0E32 (\u0E40\u0E0A\u0E48\u0E19 1, 3, 5-10):</label>\n            <input type=\"text\" [(ngModel)]=\"splitPageRange\" placeholder=\"1-{{ pageCount }}\" style=\"width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:4px;\">\n          </div>\n          <button class=\"toolbar-btn toolbar-btn--save\" (click)=\"executeSplitPdf()\" style=\"width:100%; background:#10b981; color:#fff; border:none; border-radius:6px; padding:8px; font-weight:bold; justify-content:center;\">\n            \u0E14\u0E32\u0E27\u0E19\u0E4C\u0E42\u0E2B\u0E25\u0E14\n          </button>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Undo/Redo -->\n      <button class=\"toolbar-btn\" (click)=\"undo()\" [disabled]=\"!canUndo()\" title=\"\u0E40\u0E25\u0E34\u0E01\u0E17\u0E33\">\n        <ion-icon name=\"arrow-undo\"></ion-icon>\n      </button>\n      <button class=\"toolbar-btn\" (click)=\"redo()\" [disabled]=\"!canRedo()\" title=\"\u0E17\u0E33\u0E0B\u0E49\u0E33\">\n        <ion-icon name=\"arrow-redo\"></ion-icon>\n      </button>\n      <button class=\"toolbar-btn toolbar-btn--danger\" (click)=\"clearAnnotations()\" title=\"\u0E25\u0E49\u0E32\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\">\n        <ion-icon name=\"trash\"></ion-icon>\n      </button>\n    </div>\n\n    <!-- Main Content Area: Thumbnails + Viewer -->\n    <div class=\"main-area\">\n\n      <!-- Left Thumbnails Sidebar -->\n      <aside class=\"thumbnails-sidebar\" *ngIf=\"showThumbnails\">\n        <div class=\"thumb-list\" (scroll)=\"onThumbScroll($event)\">\n\n          <!-- Top insert button (before page 1) -->\n          <div class=\"thumb-insert-row\">\n            <button class=\"thumb-add-btn\" (click)=\"toggleThumbInsert(0, $event)\" title=\"\u0E41\u0E17\u0E23\u0E01\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32 1\">\n              <ion-icon name=\"add\"></ion-icon>\n            </button>\n          </div>\n\n          <!-- Each thumbnail + its action bar + insert button after it -->\n          <ng-container *ngFor=\"let thumb of pageThumbnails; let i = index\">\n\n            <!-- Thumbnail card wrapper -->\n            <div class=\"thumb-card-wrap\"\n              draggable=\"true\"\n              [class.thumb-card-wrap--dragging]=\"thumbDragFromIndex === i\"\n              [class.thumb-card-wrap--drop-top]=\"thumbDragOverIndex === i && thumbDragFromIndex !== null && thumbDragFromIndex > i\"\n              [class.thumb-card-wrap--drop-bot]=\"thumbDragOverIndex === i && thumbDragFromIndex !== null && thumbDragFromIndex < i\"\n              (dragstart)=\"onThumbDragStart(i)\"\n              (dragover)=\"$event.preventDefault(); onThumbDragOver(i)\"\n              (dragleave)=\"onThumbDragLeave()\"\n              (drop)=\"$event.preventDefault(); onThumbDrop(i)\"\n              (dragend)=\"onThumbDragEnd()\">\n              <!-- Clickable thumbnail -->\n              <div class=\"thumb-card\" [class.active]=\"pageNo === i + 1\"\n                [id]=\"'thumb-' + (i + 1)\" (click)=\"goToPage(i + 1)\">\n                <div class=\"thumb-card__img-wrap\">\n                  <img [src]=\"thumb\" [alt]=\"'Page ' + (i + 1)\">\n                </div>\n                <span class=\"thumb-card__label\">{{ i + 1 }}</span>\n              </div>\n\n              <!-- Per-page action bar -->\n              <div class=\"thumb-card__actions\" (click)=\"$event.stopPropagation()\">\n                <button class=\"thumb-action-btn\" (click)=\"movePageToIndex(i + 1, 'up')\"\n                  [disabled]=\"i === 0\" title=\"\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E02\u0E36\u0E49\u0E19\">\n                  <ion-icon name=\"chevron-up-outline\"></ion-icon>\n                </button>\n                <button class=\"thumb-action-btn\" (click)=\"movePageToIndex(i + 1, 'down')\"\n                  [disabled]=\"i === pageThumbnails.length - 1\" title=\"\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E25\u0E07\">\n                  <ion-icon name=\"chevron-down-outline\"></ion-icon>\n                </button>\n                <button class=\"thumb-action-btn\" (click)=\"undoPageOp()\"\n                  [disabled]=\"!canUndoPageOp\" title=\"\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\">\n                  <ion-icon name=\"arrow-undo-outline\"></ion-icon>\n                </button>\n                <button class=\"thumb-action-btn thumb-action-btn--danger\"\n                  (click)=\"deleteSpecificPage(i + 1)\" [disabled]=\"pageCount <= 1\" title=\"\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\">\n                  <ion-icon name=\"trash-outline\"></ion-icon>\n                </button>\n              </div>\n            </div>\n\n            <!-- Insert button after each page -->\n            <div class=\"thumb-insert-row\">\n              <button class=\"thumb-add-btn\" (click)=\"toggleThumbInsert(i + 1, $event)\" title=\"\u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\">\n                <ion-icon name=\"add\"></ion-icon>\n              </button>\n            </div>\n\n          </ng-container>\n\n        </div>\n\n        <!-- Hidden file input -->\n        <input type=\"file\" #thumbFileInput accept=\"image/*,.pdf\" style=\"display:none\"\n          (change)=\"onThumbFileSelected($event)\">\n\n      </aside>\n\n      <!-- Insert Dropdown Overlay (outside aside \u2014 fixed position, no clipping) -->\n      <div class=\"thumb-insert-overlay\" *ngIf=\"thumbInsertIndex >= 0\"\n        [style.top.px]=\"thumbDropdownTop\">\n        <div class=\"thumb-insert-backdrop\" (click)=\"thumbInsertIndex = -1\"></div>\n        <div class=\"thumb-insert-menu\">\n          <button class=\"thumb-insert-opt\" (click)=\"insertAtThumb(thumbInsertIndex, 'portrait')\">\n            <ion-icon name=\"phone-portrait-outline\"></ion-icon>\n            \u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32 \u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07\n          </button>\n          <button class=\"thumb-insert-opt\" (click)=\"insertAtThumb(thumbInsertIndex, 'landscape')\">\n            <ion-icon name=\"phone-landscape-outline\"></ion-icon>\n            \u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32 \u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19\n          </button>\n          <button class=\"thumb-insert-opt\" (click)=\"triggerThumbFileUpload(thumbInsertIndex)\">\n            <ion-icon name=\"document-outline\"></ion-icon>\n            \u0E41\u0E17\u0E23\u0E01\u0E44\u0E1F\u0E25\u0E4C PDF/\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\n          </button>\n        </div>\n      </div>\n\n      <!-- Viewer -->\n      <div class=\"viewer-wrapper\">\n        <!-- Stamp placement banner -->\n        <div class=\"stamp-place-banner\" *ngIf=\"pendingStamp\">\n          <span><ion-icon name=\"business-outline\"></ion-icon> \u0E04\u0E25\u0E34\u0E01\u0E1A\u0E19 PDF \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E27\u0E32\u0E07\u0E15\u0E23\u0E32\u0E22\u0E32\u0E07</span>\n          <button (click)=\"cancelPendingStamp()\"><ion-icon name=\"close-outline\"></ion-icon> \u0E22\u0E01\u0E40\u0E25\u0E34\u0E01 (ESC)</button>\n        </div>\n\n        <!-- Deskew Panel Overlay -->\n        <div class=\"deskew-panel\" *ngIf=\"showDeskewPanel\">\n          <div class=\"deskew-panel__header\">\n            <ion-icon name=\"sync-outline\"></ion-icon> \u0E2B\u0E21\u0E38\u0E19\u0E08\u0E31\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E23\u0E07 (\u0E2B\u0E19\u0E49\u0E32 {{ pageNo }})\n          </div>\n          <div class=\"deskew-panel__body\">\n            <button class=\"toolbar-btn\" (click)=\"setPageRotation(pageNo, (pageRotations[pageNo] || 0) - 90)\" title=\"\u0E2B\u0E21\u0E38\u0E19\u0E0B\u0E49\u0E32\u0E22 90\u00B0\">\n              <ion-icon name=\"refresh-outline\" style=\"transform: scaleX(-1);\"></ion-icon>\n            </button>\n\n            <div class=\"deskew-slider-container\">\n              <span class=\"deskew-angle\">{{ (pageRotations[pageNo] || 0) | number:'1.1-1' }}\u00B0</span>\n              <input type=\"range\" min=\"-15\" max=\"15\" step=\"0.1\"\n                     [ngModel]=\"pageRotations[pageNo] || 0\"\n                     (ngModelChange)=\"setPageRotation(pageNo, $event)\"\n                     class=\"deskew-slider\">\n              <div class=\"deskew-slider-ticks\">\n                <span>-15</span><span>0</span><span>+15</span>\n              </div>\n            </div>\n\n            <button class=\"toolbar-btn\" (click)=\"setPageRotation(pageNo, (pageRotations[pageNo] || 0) + 90)\" title=\"\u0E2B\u0E21\u0E38\u0E19\u0E02\u0E27\u0E32 90\u00B0\">\n              <ion-icon name=\"refresh-outline\"></ion-icon>\n            </button>\n          </div>\n          <div class=\"deskew-panel__footer\">\n            <button class=\"toolbar-btn toolbar-btn--danger\" (click)=\"resetPageRotation(pageNo)\">\u0E04\u0E37\u0E19\u0E04\u0E48\u0E32\u0E40\u0E14\u0E34\u0E21</button>\n            <button class=\"toolbar-btn toolbar-btn--save\" (click)=\"applyDeskew()\">\u0E15\u0E01\u0E25\u0E07</button>\n          </div>\n        </div>\n\n        <div class=\"viewer-container\" #viewerContainer (scroll)=\"onViewerScroll($event)\">\n          <!-- Render all pages for continuous scroll -->\n          <div *ngFor=\"let p of pages\" class=\"page-container\" [attr.data-page]=\"p\" [id]=\"'page-' + p\"\n            [class.stamp-place-mode]=\"!!pendingStamp\"\n            [class.flip-mode]=\"!!getPageFlip(p)\"\n            [class.deskew-mode]=\"showDeskewPanel\"\n            [style.transform]=\"getPageRotation(p) ? 'rotate(' + getPageRotation(p) + 'deg)' : null\"\n            (pointermove)=\"onStampGhostMove($event, p)\"\n            (pointerdown)=\"onStampGhostClick($event, p)\">\n            <canvas [id]=\"'pdfCanvas-' + p\" class=\"pdf-canvas\"></canvas>\n            <canvas [id]=\"'annotCanvas-' + p\" class=\"annot-canvas\" [class.tools-active]=\"toolMode !== 'none'\"></canvas>\n\n            <!-- Watermark Preview Overlay -->\n            <div class=\"wm-preview-overlay\" [ngStyle]=\"getWatermarkPreviewStyle(p)\">\n              <div class=\"wm-preview-content\"\n                [style.opacity]=\"watermark.opacity / 100\"\n                [style.transform]=\"'rotate(-' + watermark.rotation + 'deg)'\"\n                [style.color]=\"watermark.color\"\n                [style.font-size.px]=\"watermark.type === 'text' ? watermark.fontSize * zoom : 0\"\n                [style.font-family]=\"watermark.fontFamily\">\n                <ng-container *ngIf=\"watermark.type === 'text'\">\n                  <ng-container *ngIf=\"watermark.mode === 'center'\">\n                    <span class=\"wm-text-center\">{{ watermark.text }}</span>\n                  </ng-container>\n                  <ng-container *ngIf=\"watermark.mode === 'tiled'\">\n                    <span class=\"wm-text-tiled\">{{ watermark.text }}</span>\n                  </ng-container>\n                </ng-container>\n                <ng-container *ngIf=\"watermark.type === 'image' && watermark.imageDataUrl\">\n                  <img [src]=\"watermark.imageDataUrl\" class=\"wm-preview-img\" />\n                </ng-container>\n              </div>\n            </div>\n\n            <!-- Page Number Preview -->\n            <div class=\"pn-preview\" *ngIf=\"pageNumber.enabled && shouldShowPageNum(p)\" [ngStyle]=\"getPageNumPositionStyle(p)\">\n              <span [style.font-family]=\"pageNumber.fontFamily\"\n                [style.font-size.px]=\"pageNumber.fontSize * zoom\"\n                [style.color]=\"pageNumber.color\">{{ formatPageNum(p) }}</span>\n            </div>\n\n            <!-- TextBoxes for this page -->\n            <div *ngFor=\"let tb of getTextBoxesForPage(p)\" class=\"text-box\" [attr.data-tbid]=\"tb.id\" [class.active]=\"activeTextBoxId === tb.id\"\n              [style.left.%]=\"tb.x\" [style.top.%]=\"tb.y\" [style.width.%]=\"tb.width\" [style.height.%]=\"tb.height\"\n              [style.color]=\"tb.color\" [style.font-size.px]=\"tb.fontSize * zoom\"\n              [style.font-weight]=\"tb.bold ? 'bold' : 'normal'\" [style.font-style]=\"tb.italic ? 'italic' : 'normal'\"\n              [style.text-align]=\"tb.align\" [style.z-index]=\"tb.zIndex || 10\"\n              [style.font-family]=\"(tb.fontFamily || 'THSarabunNew') + ', sans-serif'\"\n              [style.opacity]=\"tb.opacity !== undefined ? tb.opacity : 1\"\n              [style.transform]=\"tb.rotation ? 'rotate(' + tb.rotation + 'deg)' : null\"\n              [style.letter-spacing.px]=\"tb.letterSpacing || 0\"\n              [style.line-height]=\"tb.lineHeight || 1.4\"\n              (pointerdown)=\"startDrag($event, tb.id)\" (contextmenu)=\"onContextMenu($event, tb.id, 'text')\">\n\n              <!-- Floating toolbar \u2014 shown above the text box when active -->\n              <div class=\"tb-floating-bar\" *ngIf=\"activeTextBoxId === tb.id\" (pointerdown)=\"$event.stopPropagation()\" (click)=\"lsDropOpenId = null; $event.stopPropagation()\">\n                <!-- Bold / Italic -->\n                <button class=\"tb-bar-btn\" [class.tb-bar-btn--active]=\"tb.bold\" (click)=\"toggleBold()\" title=\"\u0E15\u0E31\u0E27\u0E2B\u0E19\u0E32\"><b>B</b></button>\n                <button class=\"tb-bar-btn tb-bar-btn--italic\" [class.tb-bar-btn--active]=\"tb.italic\" (click)=\"toggleItalic()\" title=\"\u0E15\u0E31\u0E27\u0E40\u0E2D\u0E35\u0E22\u0E07\"><i>I</i></button>\n                <span class=\"tb-bar-sep\"></span>\n                <!-- Alignment -->\n                <button class=\"tb-bar-btn\" [class.tb-bar-btn--active]=\"tb.align === 'left'\" (click)=\"setAlign('left')\" title=\"\u0E0A\u0E34\u0E14\u0E0B\u0E49\u0E32\u0E22\">\n                  <svg width=\"15\" height=\"13\" viewBox=\"0 0 15 13\"><line x1=\"0\" y1=\"1.5\" x2=\"15\" y2=\"1.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"0\" y1=\"6.5\" x2=\"10\" y2=\"6.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"0\" y1=\"11.5\" x2=\"13\" y2=\"11.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>\n                </button>\n                <button class=\"tb-bar-btn\" [class.tb-bar-btn--active]=\"tb.align === 'center'\" (click)=\"setAlign('center')\" title=\"\u0E01\u0E36\u0E48\u0E07\u0E01\u0E25\u0E32\u0E07\">\n                  <svg width=\"15\" height=\"13\" viewBox=\"0 0 15 13\"><line x1=\"0\" y1=\"1.5\" x2=\"15\" y2=\"1.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"2.5\" y1=\"6.5\" x2=\"12.5\" y2=\"6.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"1\" y1=\"11.5\" x2=\"14\" y2=\"11.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>\n                </button>\n                <button class=\"tb-bar-btn\" [class.tb-bar-btn--active]=\"tb.align === 'right'\" (click)=\"setAlign('right')\" title=\"\u0E0A\u0E34\u0E14\u0E02\u0E27\u0E32\">\n                  <svg width=\"15\" height=\"13\" viewBox=\"0 0 15 13\"><line x1=\"0\" y1=\"1.5\" x2=\"15\" y2=\"1.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"5\" y1=\"6.5\" x2=\"15\" y2=\"6.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"2\" y1=\"11.5\" x2=\"15\" y2=\"11.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>\n                </button>\n                <span class=\"tb-bar-sep\"></span>\n                <!-- Font family -->\n                <select class=\"tb-bar-select\" [ngModel]=\"tb.fontFamily || 'THSarabunNew'\" (ngModelChange)=\"setTbFontFamily(tb, $event)\">\n                  <option value=\"THSarabunNew\">TH Sarabun New</option>\n                  <option value=\"Noto Sans Thai Looped\">Noto Sans Thai</option>\n                  <option value=\"Arial\">Arial</option>\n                  <option value=\"sans-serif\">Sans-serif</option>\n                </select>\n                <span class=\"tb-bar-sep\"></span>\n                <!-- Font size -->\n                <button class=\"tb-bar-btn\" (click)=\"changeTextFontSize(-2)\" [disabled]=\"tb.fontSize <= 8\" title=\"\u0E25\u0E14\u0E02\u0E19\u0E32\u0E14\"><ion-icon name=\"remove\"></ion-icon></button>\n                <span class=\"tb-bar-val\">{{ tb.fontSize }}</span>\n                <button class=\"tb-bar-btn\" (click)=\"changeTextFontSize(2)\" [disabled]=\"tb.fontSize >= 100\" title=\"\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E19\u0E32\u0E14\"><ion-icon name=\"add\"></ion-icon></button>\n                <span class=\"tb-bar-sep\"></span>\n                <!-- Letter spacing -->\n                <span class=\"tb-bar-lbl\" title=\"\u0E23\u0E30\u0E22\u0E30\u0E2B\u0E48\u0E32\u0E07\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23\">AZ</span>\n                <div class=\"tb-ls-wrap\" (click)=\"$event.stopPropagation()\">\n                  <button class=\"tb-ls-trigger\" (click)=\"toggleLsDrop(tb.id)\" title=\"\u0E23\u0E30\u0E22\u0E30\u0E2B\u0E48\u0E32\u0E07\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23\">\n                    <span>{{ (tb.letterSpacing ?? 0) >= 0 ? '+' : '' }}{{ tb.letterSpacing ?? 0 }}</span>\n                    <svg width=\"8\" height=\"5\" viewBox=\"0 0 8 5\"><polyline points=\"0.5,0.5 4,4.5 7.5,0.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></svg>\n                  </button>\n                  <div class=\"tb-ls-drop\" *ngIf=\"lsDropOpenId === tb.id\">\n                    <button class=\"tb-ls-opt\" *ngFor=\"let v of lsPresets\"\n                            [class.tb-ls-opt--checked]=\"(tb.letterSpacing ?? 0) === v\"\n                            (click)=\"pickLetterSpacing(tb, v)\">\n                      <ion-icon name=\"checkmark\" *ngIf=\"(tb.letterSpacing ?? 0) === v\"></ion-icon>\n                      <span *ngIf=\"(tb.letterSpacing ?? 0) !== v\" class=\"tb-ls-spacer\"></span>\n                      <span>{{ v >= 0 ? '+' + v : v }}</span>\n                    </button>\n                  </div>\n                </div>\n                <span class=\"tb-bar-sep\"></span>\n                <!-- Line height -->\n                <span class=\"tb-bar-lbl\" title=\"\u0E23\u0E30\u0E22\u0E30\u0E2B\u0E48\u0E32\u0E07\u0E1A\u0E23\u0E23\u0E17\u0E31\u0E14\">\n                  <svg width=\"16\" height=\"14\" viewBox=\"0 0 16 14\" style=\"display:block\">\n                    <line x1=\"5\" y1=\"1.5\" x2=\"16\" y2=\"1.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n                    <line x1=\"5\" y1=\"7\"   x2=\"16\" y2=\"7\"   stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n                    <line x1=\"5\" y1=\"12.5\" x2=\"16\" y2=\"12.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n                    <line x1=\"2\" y1=\"1.5\" x2=\"2\" y2=\"12.5\" stroke=\"currentColor\" stroke-width=\"1.2\"/>\n                    <polyline points=\"0.5,4 2,1.5 3.5,4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/>\n                    <polyline points=\"0.5,10 2,12.5 3.5,10\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/>\n                  </svg>\n                </span>\n                <div class=\"tb-bar-stepper\">\n                  <span class=\"tb-bar-stepper-val\">{{ (tb.lineHeight ?? 1.4) | number:'1.1-1' }}</span>\n                  <div class=\"tb-bar-stepper-arrows\">\n                    <button class=\"tb-bar-stepper-up\" (click)=\"changeTbLineHeight(tb, 0.1)\" [disabled]=\"(tb.lineHeight ?? 1.4) >= 4\">\n                      <svg width=\"8\" height=\"5\" viewBox=\"0 0 8 5\"><polyline points=\"0.5,4.5 4,0.5 7.5,4.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></svg>\n                    </button>\n                    <button class=\"tb-bar-stepper-dn\" (click)=\"changeTbLineHeight(tb, -0.1)\" [disabled]=\"(tb.lineHeight ?? 1.4) <= 1\">\n                      <svg width=\"8\" height=\"5\" viewBox=\"0 0 8 5\"><polyline points=\"0.5,0.5 4,4.5 7.5,0.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></svg>\n                    </button>\n                  </div>\n                </div>\n                <span class=\"tb-bar-sep\"></span>\n                <!-- Color -->\n                <div class=\"tb-bar-color\" [style.background]=\"tb.color\" title=\"\u0E2A\u0E35\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\">\n                  <input type=\"color\" [value]=\"tb.color\" (input)=\"setTextColor($any($event.target).value)\" />\n                </div>\n                <span class=\"tb-bar-sep\"></span>\n                <!-- Delete -->\n                <button class=\"tb-bar-btn tb-bar-btn--delete\" (click)=\"removeTextBox(tb.id)\" title=\"\u0E25\u0E1A\">\n                  <ion-icon name=\"trash\"></ion-icon>\n                </button>\n              </div>\n\n              <div class=\"tb-handle tb-handle--left\" (pointerdown)=\"startResizeLeft($event, tb.id)\"></div>\n              <textarea [(ngModel)]=\"tb.text\" (focus)=\"activeTextBoxId = tb.id\" (input)=\"onTextBoxInput($event, tb)\"\n                spellcheck=\"false\"></textarea>\n              <div class=\"tb-handle tb-handle--right\" (pointerdown)=\"startResizeRight($event, tb.id)\"></div>\n              <!-- BR corner: resize width + height -->\n              <div class=\"tb-handle tb-handle--br\" (pointerdown)=\"startResize($event, tb.id)\" title=\"\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14\"></div>\n            </div>\n            <!-- ShapeStamps for this page (draggable/resizable SVG overlays) -->\n            <div *ngFor=\"let ss of getShapeStampsForPage(p)\" class=\"shape-stamp\" [style.left.%]=\"ss.x\"\n              [style.top.%]=\"ss.y\" [style.width.%]=\"ss.width\" [style.height.%]=\"ss.height\"\n              [style.z-index]=\"ss.zIndex || 10\" (pointerdown)=\"startShapeDrag($event, ss.id)\"\n              (contextmenu)=\"onContextMenu($event, ss.id, 'shape')\">\n              <button class=\"remove-btn\" (click)=\"removeShapeStamp(ss.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n\n              <!-- SVG renders the actual shape inside the bounding box -->\n              <svg width=\"100%\" height=\"100%\" [attr.viewBox]=\"'0 0 100 100'\" preserveAspectRatio=\"none\"\n                style=\"overflow:visible; pointer-events:none\">\n                <!-- rect -->\n                <rect *ngIf=\"ss.type === 'rect'\" x=\"0\" y=\"0\" width=\"100\" height=\"100\"\n                  [attr.stroke]=\"ss.strokeColor || 'none'\" [attr.stroke-width]=\"ss.strokeWidth\"\n                  vector-effect=\"non-scaling-stroke\" [attr.fill]=\"ss.fillColor || 'none'\"></rect>\n                <!-- circle -->\n                <ellipse *ngIf=\"ss.type === 'circle'\" cx=\"50\" cy=\"50\" rx=\"50\" ry=\"50\"\n                  [attr.stroke]=\"ss.strokeColor || 'none'\" [attr.stroke-width]=\"ss.strokeWidth\"\n                  vector-effect=\"non-scaling-stroke\" [attr.fill]=\"ss.fillColor || 'none'\"></ellipse>\n                <!-- line -->\n                <line *ngIf=\"ss.type === 'line'\" [attr.x1]=\"ss.startFracX * 100\" [attr.y1]=\"ss.startFracY * 100\"\n                  [attr.x2]=\"ss.endFracX * 100\" [attr.y2]=\"ss.endFracY * 100\" [attr.stroke]=\"ss.strokeColor || '#000'\"\n                  [attr.stroke-width]=\"ss.strokeWidth\" vector-effect=\"non-scaling-stroke\" fill=\"none\"></line>\n                <!-- arrow -->\n                <g *ngIf=\"ss.type === 'arrow'\">\n                  <line [attr.x1]=\"ss.startFracX * 100\" [attr.y1]=\"ss.startFracY * 100\" [attr.x2]=\"ss.endFracX * 100\"\n                    [attr.y2]=\"ss.endFracY * 100\" [attr.stroke]=\"ss.strokeColor || '#000'\"\n                    [attr.stroke-width]=\"ss.strokeWidth\" vector-effect=\"non-scaling-stroke\" fill=\"none\">\n                  </line>\n                  <polygon [attr.points]=\"'0,-6 12,0 0,6'\" [attr.fill]=\"ss.strokeColor || '#000'\"\n                    [attr.transform]=\"'translate(' + (ss.endFracX*100) + ',' + (ss.endFracY*100) + ') rotate(' + getArrowAngleDeg(ss) + ')'\">\n                  </polygon>\n                </g>\n              </svg>\n\n              <!-- Resize handles (corner + edge) -->\n              <div class=\"resize-handle rh-nw\" (pointerdown)=\"startShapeResize($event, ss.id, 'nw')\"></div>\n              <div class=\"resize-handle rh-n\" (pointerdown)=\"startShapeResize($event, ss.id, 'n')\"></div>\n              <div class=\"resize-handle rh-ne\" (pointerdown)=\"startShapeResize($event, ss.id, 'ne')\"></div>\n              <div class=\"resize-handle rh-e\" (pointerdown)=\"startShapeResize($event, ss.id, 'e')\"></div>\n              <div class=\"resize-handle rh-se\" (pointerdown)=\"startShapeResize($event, ss.id, 'se')\"></div>\n              <div class=\"resize-handle rh-s\" (pointerdown)=\"startShapeResize($event, ss.id, 's')\"></div>\n              <div class=\"resize-handle rh-sw\" (pointerdown)=\"startShapeResize($event, ss.id, 'sw')\"></div>\n              <div class=\"resize-handle rh-w\" (pointerdown)=\"startShapeResize($event, ss.id, 'w')\"></div>\n            </div>\n\n            <!-- Regular image stamps (uploaded images, not marks) -->\n            <div *ngFor=\"let img of getRegularImageStampsForPage(p)\" class=\"image-stamp\"\n              [style.left.%]=\"img.x\"\n              [style.top.%]=\"img.y\" [style.width.%]=\"img.width\" [style.height.%]=\"img.height\"\n              [style.z-index]=\"img.zIndex || 10\" (pointerdown)=\"startImageDrag($event, img.id)\"\n              (contextmenu)=\"onContextMenu($event, img.id, 'image')\">\n              <button class=\"remove-btn\" (click)=\"removeImage(img.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n              <img [src]=\"img.dataUrl\" />\n              <div class=\"resize-handle rh-nw\" (pointerdown)=\"startImageResize($event, img.id, 'nw')\"></div>\n              <div class=\"resize-handle rh-n\" (pointerdown)=\"startImageResize($event, img.id, 'n')\"></div>\n              <div class=\"resize-handle rh-ne\" (pointerdown)=\"startImageResize($event, img.id, 'ne')\"></div>\n              <div class=\"resize-handle rh-e\" (pointerdown)=\"startImageResize($event, img.id, 'e')\"></div>\n              <div class=\"resize-handle rh-se\" (pointerdown)=\"startImageResize($event, img.id, 'se')\"></div>\n              <div class=\"resize-handle rh-s\" (pointerdown)=\"startImageResize($event, img.id, 's')\"></div>\n              <div class=\"resize-handle rh-sw\" (pointerdown)=\"startImageResize($event, img.id, 'sw')\"></div>\n              <div class=\"resize-handle rh-w\" (pointerdown)=\"startImageResize($event, img.id, 'w')\"></div>\n            </div>\n\n            <!-- Mark stamps (check/cross/dot) \u2014 rendered as SVG, behaves like form field checkbox -->\n            <div *ngFor=\"let mk of getMarkStampsForPage(p)\" class=\"pdf-form-field pff-mark\"\n              [class.pff-active]=\"activeObjectId === mk.id\"\n              [style.left.%]=\"mk.x\" [style.top.%]=\"mk.y\"\n              [style.width.%]=\"mk.width\" [style.height.%]=\"mk.height\"\n              [style.z-index]=\"mk.zIndex || 10\"\n              (pointerdown)=\"startMarkDrag($event, mk.id)\"\n              (contextmenu)=\"onContextMenu($event, mk.id, 'image')\">\n\n              <!-- Options bar when active -->\n              <div class=\"pff-options-bar\" *ngIf=\"activeObjectId === mk.id\" (pointerdown)=\"$event.stopPropagation()\">\n                <span class=\"pff-opt-label\"><ion-icon name=\"resize-outline\"></ion-icon></span>\n                <button class=\"pff-opt-btn\" (click)=\"changeMarkStampSize(mk.id, -1)\" [disabled]=\"mk.width <= 1\" title=\"\u0E25\u0E14\u0E02\u0E19\u0E32\u0E14\">\n                  <ion-icon name=\"remove\"></ion-icon>\n                </button>\n                <span class=\"pff-opt-val\">{{ mk.width | number:'1.0-1' }}</span>\n                <button class=\"pff-opt-btn\" (click)=\"changeMarkStampSize(mk.id, 1)\" [disabled]=\"mk.width >= 25\" title=\"\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E19\u0E32\u0E14\">\n                  <ion-icon name=\"add\"></ion-icon>\n                </button>\n                <div class=\"pff-opt-sep\"></div>\n                <button class=\"pff-opt-btn pff-opt-delete\" (click)=\"removeImage(mk.id); $event.stopPropagation()\" title=\"\u0E25\u0E1A\">\n                  <ion-icon name=\"trash-outline\"></ion-icon>\n                </button>\n              </div>\n\n              <!-- SVG mark symbol fills the bounding box exactly -->\n              <div class=\"pff-inner\">\n                <svg width=\"100%\" height=\"100%\" viewBox=\"0 0 100 100\" style=\"pointer-events:none; overflow:visible\">\n                  <ng-container *ngIf=\"mk.markType === 'check'\">\n                    <polyline points=\"12,52 42,82 88,18\" [attr.stroke]=\"mk.markColor || '#000000'\" stroke-width=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/>\n                  </ng-container>\n                  <ng-container *ngIf=\"mk.markType === 'cross'\">\n                    <line x1=\"15\" y1=\"15\" x2=\"85\" y2=\"85\" [attr.stroke]=\"mk.markColor || '#000000'\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n                    <line x1=\"85\" y1=\"15\" x2=\"15\" y2=\"85\" [attr.stroke]=\"mk.markColor || '#000000'\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n                  </ng-container>\n                  <ng-container *ngIf=\"mk.markType === 'dot' || !mk.markType\">\n                    <circle cx=\"50\" cy=\"50\" r=\"38\" [attr.fill]=\"mk.markColor || '#000000'\"/>\n                  </ng-container>\n                </svg>\n              </div>\n\n              <div class=\"pff-resize-handle rh-nw\" (pointerdown)=\"startImageResize($event, mk.id, 'nw')\"></div>\n              <div class=\"pff-resize-handle rh-n\"  (pointerdown)=\"startImageResize($event, mk.id, 'n')\"></div>\n              <div class=\"pff-resize-handle rh-ne\" (pointerdown)=\"startImageResize($event, mk.id, 'ne')\"></div>\n              <div class=\"pff-resize-handle rh-e\"  (pointerdown)=\"startImageResize($event, mk.id, 'e')\"></div>\n              <div class=\"pff-resize-handle rh-se\" (pointerdown)=\"startImageResize($event, mk.id, 'se')\"></div>\n              <div class=\"pff-resize-handle rh-s\"  (pointerdown)=\"startImageResize($event, mk.id, 's')\"></div>\n              <div class=\"pff-resize-handle rh-sw\" (pointerdown)=\"startImageResize($event, mk.id, 'sw')\"></div>\n              <div class=\"pff-resize-handle rh-w\"  (pointerdown)=\"startImageResize($event, mk.id, 'w')\"></div>\n            </div>\n\n            <div *ngFor=\"let sig of getSignatureStampsForPage(p)\" class=\"signature-stamp\" [style.left.%]=\"sig.x\"\n              [style.top.%]=\"sig.y\" [style.width.%]=\"sig.width\" [style.height.%]=\"sig.height\"\n              [style.z-index]=\"sig.zIndex || 10\" (pointerdown)=\"startSignatureDrag($event, sig.id)\"\n              (contextmenu)=\"onContextMenu($event, sig.id, 'signature')\">\n              <button class=\"remove-btn\" (click)=\"removeSignature(sig.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n              <img [src]=\"sig.dataUrl\" />\n              <div class=\"digital-id-label\" *ngIf=\"showDigitalId && (sig.digitalId || sig.signDate)\">\n                <span *ngIf=\"sig.signDate\">{{ sig.signDate }}</span>\n                <span *ngIf=\"sig.signTime\">{{ sig.signTime }}</span>\n                <span *ngIf=\"sig.digitalId\" class=\"did-text\">{{ sig.digitalId }}</span>\n              </div>\n              <div class=\"resize-handle rh-nw\" (pointerdown)=\"startSignatureResize($event, sig.id, 'nw')\"></div>\n              <div class=\"resize-handle rh-n\" (pointerdown)=\"startSignatureResize($event, sig.id, 'n')\"></div>\n              <div class=\"resize-handle rh-ne\" (pointerdown)=\"startSignatureResize($event, sig.id, 'ne')\"></div>\n              <div class=\"resize-handle rh-e\" (pointerdown)=\"startSignatureResize($event, sig.id, 'e')\"></div>\n              <div class=\"resize-handle rh-se\" (pointerdown)=\"startSignatureResize($event, sig.id, 'se')\"></div>\n              <div class=\"resize-handle rh-s\" (pointerdown)=\"startSignatureResize($event, sig.id, 's')\"></div>\n              <div class=\"resize-handle rh-sw\" (pointerdown)=\"startSignatureResize($event, sig.id, 'sw')\"></div>\n              <div class=\"resize-handle rh-w\" (pointerdown)=\"startSignatureResize($event, sig.id, 'w')\"></div>\n            </div>\n\n            <!-- PDF Form Fields for this page -->\n            <div *ngFor=\"let ff of getFormFieldsForPage(p)\" class=\"pdf-form-field\"\n              [class.pff-text]=\"ff.type === 'text'\"\n              [class.pff-checkbox]=\"ff.type === 'checkbox'\"\n              [class.pff-radio]=\"ff.type === 'radio'\"\n              [class.pff-no-border]=\"ff.borderVisible === false\"\n              [class.pff-active]=\"activeFormFieldId === ff.id\"\n              [style.left.%]=\"ff.x\" [style.top.%]=\"ff.y\"\n              [style.width.%]=\"ff.width\" [style.height.%]=\"ff.height\"\n              [style.z-index]=\"ff.zIndex || 20\"\n              (pointerdown)=\"startFormFieldDrag($event, ff.id)\">\n\n              <!-- Options bar (shown when active) -->\n              <div class=\"pff-options-bar\" *ngIf=\"activeFormFieldId === ff.id\" (pointerdown)=\"$event.stopPropagation()\">\n                <!-- Element size: all 3 types -->\n                <span class=\"pff-opt-label\">\n                  <ion-icon name=\"resize-outline\"></ion-icon>\n                </span>\n                <button class=\"pff-opt-btn\" (click)=\"changeFormFieldSize(ff.id, -0.5)\" [disabled]=\"(ff.type === 'text' ? ff.height : ff.width) <= 1.5\" title=\"\u0E25\u0E14\u0E02\u0E19\u0E32\u0E14\">\n                  <ion-icon name=\"remove\"></ion-icon>\n                </button>\n                <span class=\"pff-opt-val\">{{ (ff.type === 'text' ? ff.height : ff.width) | number:'1.0-1' }}</span>\n                <button class=\"pff-opt-btn\" (click)=\"changeFormFieldSize(ff.id, 0.5)\" [disabled]=\"(ff.type === 'text' ? ff.height : ff.width) >= 30\" title=\"\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E19\u0E32\u0E14\">\n                  <ion-icon name=\"add\"></ion-icon>\n                </button>\n                <div class=\"pff-opt-sep\"></div>\n                <!-- Font size: text only -->\n                <ng-container *ngIf=\"ff.type === 'text'\">\n                  <span class=\"pff-opt-label\">A</span>\n                  <button class=\"pff-opt-btn\" (click)=\"changeFormFieldFontSize(ff.id, -2)\" [disabled]=\"(ff.fontSize || 12) <= 6\" title=\"\u0E25\u0E14\u0E02\u0E19\u0E32\u0E14\u0E2D\u0E31\u0E01\u0E29\u0E23\">\n                    <ion-icon name=\"remove\"></ion-icon>\n                  </button>\n                  <span class=\"pff-opt-val\">{{ ff.fontSize || 12 }}</span>\n                  <button class=\"pff-opt-btn\" (click)=\"changeFormFieldFontSize(ff.id, 2)\" [disabled]=\"(ff.fontSize || 12) >= 72\" title=\"\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E19\u0E32\u0E14\u0E2D\u0E31\u0E01\u0E29\u0E23\">\n                    <ion-icon name=\"add\"></ion-icon>\n                  </button>\n                  <div class=\"pff-opt-sep\"></div>\n                </ng-container>\n                <!-- Border toggle -->\n                <button class=\"pff-opt-btn\" [class.pff-opt-active]=\"ff.borderVisible !== false\"\n                  (click)=\"toggleFormFieldBorder(ff.id)\" title=\"\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A\">\n                  <ion-icon [name]=\"ff.borderVisible !== false ? 'square-outline' : 'square'\"></ion-icon>\n                </button>\n                <!-- Delete -->\n                <button class=\"pff-opt-btn pff-opt-delete\" (click)=\"removeFormField(ff.id)\" title=\"\u0E25\u0E1A\">\n                  <ion-icon name=\"trash-outline\"></ion-icon>\n                </button>\n              </div>\n\n              <div class=\"pff-inner\">\n                <span *ngIf=\"ff.type === 'text'\" class=\"pff-text-hint\">Aa {{ ff.fontSize || 12 }}pt</span>\n                <svg *ngIf=\"ff.type === 'checkbox'\" width=\"55%\" height=\"55%\" viewBox=\"0 0 18 18\" style=\"pointer-events:none\"><rect x=\"1\" y=\"1\" width=\"16\" height=\"16\" rx=\"2\" stroke=\"#3b82f6\" stroke-width=\"2\" fill=\"none\"/></svg>\n                <svg *ngIf=\"ff.type === 'radio'\" width=\"55%\" height=\"55%\" viewBox=\"0 0 18 18\" style=\"pointer-events:none\"><circle cx=\"9\" cy=\"9\" r=\"8\" stroke=\"#3b82f6\" stroke-width=\"2\" fill=\"none\"/></svg>\n              </div>\n\n              <div class=\"pff-resize-handle rh-nw\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'nw')\"></div>\n              <div class=\"pff-resize-handle rh-n\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 'n')\"></div>\n              <div class=\"pff-resize-handle rh-ne\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'ne')\"></div>\n              <div class=\"pff-resize-handle rh-e\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 'e')\"></div>\n              <div class=\"pff-resize-handle rh-se\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'se')\"></div>\n              <div class=\"pff-resize-handle rh-s\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 's')\"></div>\n              <div class=\"pff-resize-handle rh-sw\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'sw')\"></div>\n              <div class=\"pff-resize-handle rh-w\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 'w')\"></div>\n            </div>\n\n            <!-- Date Stamps for this page -->\n            <div *ngFor=\"let ds of getDateStampsForPage(p)\" class=\"date-stamp\" [style.left.%]=\"ds.x\"\n              [style.top.%]=\"ds.y\" [style.color]=\"ds.color\" [style.font-size.px]=\"ds.fontSize * zoom\"\n              [style.z-index]=\"ds.zIndex || 10\" (pointerdown)=\"startDateDrag($event, ds.id)\"\n              (contextmenu)=\"onContextMenu($event, ds.id, 'date')\">\n              <button class=\"remove-btn\" (click)=\"removeDateStamp(ds.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n              {{ ds.text }}\n            </div>\n\n            <!-- Ghost stamp preview when placement mode active -->\n            <img *ngIf=\"pendingStamp && stampGhostPage === p\"\n              [src]=\"pendingStamp.dataUrl\"\n              class=\"stamp-ghost-img\"\n              [style.left.px]=\"stampGhostX - pendingStamp.defaultWidth / 2\"\n              [style.top.px]=\"stampGhostY - (pendingStamp.defaultWidth * 0.5) / 2\"\n              [style.width.px]=\"pendingStamp.defaultWidth\"\n              draggable=\"false\" />\n          </div>\n        </div>\n\n        <div class=\"hint\">\n          <div>\u2022 Keyboard: Ctrl+Z (Undo), Ctrl+Y (Redo), Escape (Exit mode), Delete (Remove selected)</div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- User Guide Panel (right slide-in drawer) -->\n  <div class=\"user-guide-drawer\" [class.open]=\"showUserGuidePanel\">\n    <div class=\"user-guide-drawer__backdrop\" (click)=\"showUserGuidePanel = false\"></div>\n    <div class=\"user-guide-drawer__panel\">\n      <div class=\"user-guide-drawer__header\">\n        <span><ion-icon name=\"book-outline\"></ion-icon> \u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</span>\n        <button (click)=\"showUserGuidePanel = false\"><ion-icon name=\"close-outline\"></ion-icon></button>\n      </div>\n\n      <div class=\"user-guide-content-area\" *ngIf=\"!isLoadingGuide\">\n        <div *ngIf=\"!isEditingGuide\" class=\"guide-view-mode\">\n\n          <!-- Banner -->\n          <div class=\"guide-banner\">\n            <ion-icon name=\"rocket\"></ion-icon>\n            <div>\n              <strong>\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19\u0E07\u0E48\u0E32\u0E22\u0E21\u0E32\u0E01!</strong> \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E08\u0E32\u0E01\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19 \u0E41\u0E25\u0E49\u0E27\u0E04\u0E25\u0E34\u0E01\u0E2B\u0E23\u0E37\u0E2D\u0E25\u0E32\u0E01\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22\n              \u2014 \u0E01\u0E14 <code>Ctrl+Z</code> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E40\u0E2A\u0E21\u0E2D\u0E2B\u0E32\u0E01\u0E17\u0E33\u0E1E\u0E25\u0E32\u0E14\n            </div>\n          </div>\n\n          <!-- \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21 -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"text\" style=\"color:#60a5fa;\"></ion-icon> \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21 (Text)\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <div class=\"guide-step\">1</div>\n                <div class=\"guide-item__text\">\u0E01\u0E14\u0E44\u0E2D\u0E04\u0E2D\u0E19 <ion-icon name=\"text\" style=\"vertical-align:-2px;color:#60a5fa;\"></ion-icon> \u0E41\u0E25\u0E49\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01 <strong>\u0E02\u0E19\u0E32\u0E14\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23</strong> \u0E41\u0E25\u0E30 <strong>\u0E2A\u0E35</strong> \u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E19\u0E27\u0E32\u0E07</div>\n              </div>\n              <div class=\"guide-item\">\n                <div class=\"guide-step\">2</div>\n                <div class=\"guide-item__text\">\u0E04\u0E25\u0E34\u0E01\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23 PDF \u2014 \u0E01\u0E25\u0E48\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E08\u0E30\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E17\u0E31\u0E19\u0E17\u0E35 \u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22 <strong>\u0E01\u0E25\u0E48\u0E2D\u0E07\u0E08\u0E30\u0E02\u0E22\u0E32\u0E22\u0E15\u0E32\u0E21\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34</strong></div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"move-outline\" class=\"guide-item__icon\" style=\"color:#60a5fa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E22\u0E49\u0E32\u0E22\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07:</strong> \u0E08\u0E31\u0E1A\u0E17\u0E35\u0E48 <em>\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A</em> \u0E01\u0E25\u0E48\u0E2D\u0E07\u0E41\u0E25\u0E49\u0E27\u0E25\u0E32\u0E01\u0E44\u0E1B\u0E27\u0E32\u0E07\u0E44\u0E14\u0E49\u0E17\u0E38\u0E01\u0E17\u0E35\u0E48 (cursor \u0E08\u0E30\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E25\u0E39\u0E01\u0E28\u0E23 4 \u0E17\u0E34\u0E28)</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"contract-outline\" class=\"guide-item__icon\" style=\"color:#60a5fa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E1B\u0E23\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E01\u0E27\u0E49\u0E32\u0E07:</strong> \u0E25\u0E32\u0E01\u0E27\u0E07\u0E01\u0E25\u0E21\u0E2A\u0E35\u0E1F\u0E49\u0E32 <span class=\"guide-dot-demo\"></span> \u0E17\u0E35\u0E48\u0E0B\u0E49\u0E32\u0E22\u0E2B\u0E23\u0E37\u0E2D\u0E02\u0E27\u0E32\u0E01\u0E25\u0E48\u0E2D\u0E07 \u2014 \u0E04\u0E27\u0E32\u0E21\u0E2A\u0E39\u0E07\u0E08\u0E30\u0E1B\u0E23\u0E31\u0E1A\u0E15\u0E32\u0E21\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2D\u0E07</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"trash-outline\" class=\"guide-item__icon\" style=\"color:#f87171;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E25\u0E1A\u0E01\u0E25\u0E48\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21:</strong> \u0E04\u0E25\u0E34\u0E01\u0E17\u0E35\u0E48\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A\u0E01\u0E25\u0E48\u0E2D\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01 \u0E41\u0E25\u0E49\u0E27\u0E01\u0E14 <code>Delete</code> \u0E2B\u0E23\u0E37\u0E2D\u0E04\u0E25\u0E34\u0E01\u0E02\u0E27\u0E32\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E40\u0E21\u0E19\u0E39</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E27\u0E32\u0E14\u0E41\u0E25\u0E30\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"brush\" style=\"color:#fb7185;\"></ion-icon> \u0E27\u0E32\u0E14 / \u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C / \u0E22\u0E32\u0E07\u0E25\u0E1A\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"brush\" class=\"guide-item__icon\" style=\"color:#fb7185;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E1B\u0E32\u0E01\u0E01\u0E32 / \u0E14\u0E34\u0E19\u0E2A\u0E2D:</strong> \u0E25\u0E32\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E27\u0E32\u0E14\u0E2D\u0E34\u0E2A\u0E23\u0E30 \u2014 \u0E1B\u0E23\u0E31\u0E1A <strong>\u0E02\u0E19\u0E32\u0E14\u0E40\u0E2A\u0E49\u0E19</strong> \u0E41\u0E25\u0E30 <strong>\u0E2A\u0E35</strong> \u0E08\u0E32\u0E01\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19 \u0E40\u0E2A\u0E49\u0E19\u0E08\u0E30\u0E23\u0E27\u0E21\u0E40\u0E1B\u0E47\u0E19 object \u0E40\u0E14\u0E35\u0E22\u0E27\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E22\u0E01\u0E1B\u0E32\u0E01\u0E01\u0E32</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"color-filter-outline\" class=\"guide-item__icon\" style=\"color:#fde68a;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C:</strong> \u0E25\u0E32\u0E01\u0E17\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E19\u0E49\u0E19\u0E2A\u0E35 \u2014 \u0E21\u0E35\u0E2A\u0E35\u0E43\u0E2B\u0E49\u0E40\u0E25\u0E37\u0E2D\u0E01 6 \u0E2A\u0E35 \u0E2B\u0E23\u0E37\u0E2D\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\u0E44\u0E14\u0E49 \u0E1B\u0E23\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E19\u0E32\u0E44\u0E14\u0E49\u0E15\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"cut-outline\" class=\"guide-item__icon\" style=\"color:#94a3b8;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E22\u0E32\u0E07\u0E25\u0E1A:</strong> \u0E25\u0E32\u0E01\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E2A\u0E49\u0E19\u0E27\u0E32\u0E14\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E25\u0E1A \u2014 \u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14\u0E22\u0E32\u0E07\u0E25\u0E1A\u0E44\u0E14\u0E49\u0E08\u0E32\u0E01\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E23\u0E39\u0E1B\u0E23\u0E48\u0E32\u0E07 -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"shapes\" style=\"color:#a78bfa;\"></ion-icon> \u0E23\u0E39\u0E1B\u0E23\u0E48\u0E32\u0E07\u0E41\u0E25\u0E30\u0E40\u0E2A\u0E49\u0E19 (Shapes)\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"square-outline\" class=\"guide-item__icon\" style=\"color:#a78bfa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>4 \u0E41\u0E1A\u0E1A:</strong> \u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21 <ion-icon name=\"square-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E27\u0E07\u0E01\u0E25\u0E21 <ion-icon name=\"ellipse-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07 <ion-icon name=\"remove-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E25\u0E39\u0E01\u0E28\u0E23 <ion-icon name=\"arrow-forward-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u2014 \u0E01\u0E14\u0E25\u0E39\u0E01\u0E28\u0E23\u0E40\u0E25\u0E47\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E41\u0E1A\u0E1A \u0E41\u0E25\u0E49\u0E27<strong>\u0E25\u0E32\u0E01\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23</strong></div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"color-palette\" class=\"guide-item__icon\" style=\"color:#fbbf24;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E1B\u0E23\u0E31\u0E1A\u0E2A\u0E35\u0E41\u0E25\u0E30\u0E02\u0E19\u0E32\u0E14\u0E40\u0E2A\u0E49\u0E19:</strong> \u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E2A\u0E35\u0E02\u0E2D\u0E1A, \u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19, \u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E19\u0E32\u0E40\u0E2A\u0E49\u0E19\u0E44\u0E14\u0E49\u0E08\u0E32\u0E01\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19 \u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E1B\u0E34\u0E14\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A\u0E2B\u0E23\u0E37\u0E2D\u0E1B\u0E34\u0E14\u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19\u0E41\u0E22\u0E01\u0E01\u0E31\u0E19\u0E44\u0E14\u0E49</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"resize\" class=\"guide-item__icon\" style=\"color:#a78bfa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E22\u0E49\u0E32\u0E22\u0E41\u0E25\u0E30\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14:</strong> \u0E25\u0E32\u0E01\u0E15\u0E23\u0E07\u0E01\u0E25\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E49\u0E32\u0E22 \u2014 \u0E25\u0E32\u0E01 handle 8 \u0E08\u0E38\u0E14\u0E23\u0E2D\u0E1A\u0E23\u0E39\u0E1B\u0E23\u0E48\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14 \u2014 \u0E04\u0E25\u0E34\u0E01\u0E02\u0E27\u0E32\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E08\u0E31\u0E14\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E0A\u0E31\u0E49\u0E19</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19 -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"finger-print\" style=\"color:#34d399;\"></ion-icon> \u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19 (Signature)\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"create-outline\" class=\"guide-item__icon\" style=\"color:#34d399;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E27\u0E32\u0E14\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19:</strong> \u0E01\u0E14 <ion-icon name=\"finger-print\" style=\"vertical-align:-2px;font-size:13px;color:#34d399;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1B\u0E34\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07\u0E27\u0E32\u0E14 \u2014 \u0E1B\u0E23\u0E31\u0E1A\u0E2A\u0E35\u0E41\u0E25\u0E30\u0E02\u0E19\u0E32\u0E14\u0E1B\u0E32\u0E01\u0E01\u0E32 \u2014 \u0E01\u0E14 <strong>\"\u0E43\u0E0A\u0E49\u0E04\u0E23\u0E31\u0E49\u0E07\u0E19\u0E35\u0E49\"</strong> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E27\u0E32\u0E07\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"cloud-upload-outline\" class=\"guide-item__icon\" style=\"color:#34d399;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19:</strong> \u0E01\u0E14 <strong>\"\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49\u0E43\u0E0A\u0E49\u0E20\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E07\"</strong> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E01\u0E47\u0E1A\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E44\u0E27\u0E49\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A \u2014 \u0E04\u0E23\u0E31\u0E49\u0E07\u0E16\u0E31\u0E14\u0E44\u0E1B\u0E01\u0E14\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E44\u0E14\u0E49\u0E17\u0E31\u0E19\u0E17\u0E35</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"shield-checkmark-outline\" class=\"guide-item__icon\" style=\"color:#34d399;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>Digital ID (DID):</strong> \u0E01\u0E14\u0E1B\u0E38\u0E48\u0E21 <code>DID</code> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E41\u0E2A\u0E14\u0E07/\u0E0B\u0E48\u0E2D\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 Digital ID \u0E43\u0E15\u0E49\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19 (\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48, \u0E40\u0E27\u0E25\u0E32, \u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49)</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 \u0E41\u0E25\u0E30\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"calendar\" style=\"color:#fb923c;\"></ion-icon> \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 \u0E41\u0E25\u0E30\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"calendar-outline\" class=\"guide-item__icon\" style=\"color:#fb923c;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34:</strong> \u0E01\u0E14 <ion-icon name=\"calendar\" style=\"vertical-align:-2px;font-size:13px;color:#fb923c;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E41\u0E17\u0E23\u0E01\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 \u2014 \u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14\u0E41\u0E25\u0E30\u0E2A\u0E35\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23\u0E44\u0E14\u0E49 \u2014 \u0E25\u0E32\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E49\u0E32\u0E22\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"image-outline\" class=\"guide-item__icon\" style=\"color:#fb923c;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E41\u0E17\u0E23\u0E01\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E:</strong> \u0E01\u0E14 <ion-icon name=\"image\" style=\"vertical-align:-2px;font-size:13px;color:#fb923c;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E1F\u0E25\u0E4C\u0E23\u0E39\u0E1B\u0E08\u0E32\u0E01\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07 \u2014 \u0E25\u0E32\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E49\u0E32\u0E22 \u0E25\u0E32\u0E01 handle 8 \u0E08\u0E38\u0E14\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E2B\u0E19\u0E49\u0E32 -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"documents\" style=\"color:#f59e0b;\"></ion-icon> \u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"images-outline\" class=\"guide-item__icon\" style=\"color:#f59e0b;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>Thumbnail \u0E14\u0E49\u0E32\u0E19\u0E0B\u0E49\u0E32\u0E22:</strong> \u0E01\u0E14 <ion-icon name=\"images-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E41\u0E2A\u0E14\u0E07 \u2014 \u0E04\u0E25\u0E34\u0E01 thumbnail \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E01\u0E23\u0E30\u0E42\u0E14\u0E14\u0E44\u0E1B\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E31\u0E49\u0E19 \u2014 \u0E25\u0E32\u0E01 <ion-icon name=\"chevron-up-outline\" style=\"vertical-align:-2px;font-size:12px;\"></ion-icon><ion-icon name=\"chevron-down-outline\" style=\"vertical-align:-2px;font-size:12px;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E23\u0E35\u0E22\u0E07\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"add-circle-outline\" class=\"guide-item__icon\" style=\"color:#f59e0b;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E41\u0E17\u0E23\u0E01/\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32:</strong> \u0E01\u0E14\u0E44\u0E2D\u0E04\u0E2D\u0E19 <ion-icon name=\"documents-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E1A\u0E19\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19 \u2014 \u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07/\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19 \u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E23\u0E37\u0E2D\u0E2B\u0E25\u0E31\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 \u2014 \u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23 \u2014 \u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E44\u0E14\u0E49</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"search-outline\" class=\"guide-item__icon\" style=\"color:#f59e0b;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E0B\u0E39\u0E21:</strong> \u0E01\u0E14\u0E1B\u0E38\u0E48\u0E21 <code>+</code> / <code>\u2212</code> \u0E2B\u0E23\u0E37\u0E2D\u0E43\u0E0A\u0E49\u0E1B\u0E38\u0E48\u0E21\u0E0B\u0E39\u0E21\u0E1A\u0E19\u0E41\u0E16\u0E1A\u0E19\u0E33\u0E17\u0E32\u0E07 \u2014 \u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A\u0E15\u0E31\u0E49\u0E07\u0E41\u0E15\u0E48 50% \u0E16\u0E36\u0E07 300%</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- Keyboard Shortcuts -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"keypad\" style=\"color:#e2e8f0;\"></ion-icon> \u0E04\u0E35\u0E22\u0E4C\u0E25\u0E31\u0E14\u0E17\u0E35\u0E48\u0E04\u0E27\u0E23\u0E23\u0E39\u0E49\n            </h4>\n            <div class=\"guide-shortcuts-grid\">\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Ctrl</kbd><span>+</span><kbd>Z</kbd></div>\n                <div class=\"guide-shortcut-card__label\">\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A (Undo)</div>\n              </div>\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Ctrl</kbd><span>+</span><kbd>Y</kbd></div>\n                <div class=\"guide-shortcut-card__label\">\u0E17\u0E33\u0E0B\u0E49\u0E33 (Redo)</div>\n              </div>\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Delete</kbd></div>\n                <div class=\"guide-shortcut-card__label\">\u0E25\u0E1A object \u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01</div>\n              </div>\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Esc</kbd></div>\n                <div class=\"guide-shortcut-card__label\">\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- Pro Tips -->\n          <div class=\"guide-protip\">\n            <div class=\"guide-protip__icon\"><ion-icon name=\"bulb\"></ion-icon></div>\n            <div class=\"guide-protip__body\">\n              <div class=\"guide-protip__title\">Pro Tips</div>\n              <ul class=\"guide-protip__list\">\n                <li>\u0E04\u0E25\u0E34\u0E01\u0E02\u0E27\u0E32\u0E1A\u0E19 object \u0E43\u0E14 \u0E46 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E08\u0E31\u0E14\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E0A\u0E31\u0E49\u0E19 (Bring to Front / Send to Back)</li>\n                <li>\u0E01\u0E14 <code>Esc</code> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E41\u0E25\u0E30\u0E01\u0E25\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E42\u0E2B\u0E21\u0E14\u0E1B\u0E01\u0E15\u0E34</li>\n                <li>\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C\u0E17\u0E35\u0E48\u0E27\u0E32\u0E14\u0E14\u0E49\u0E27\u0E22 opacity \u0E15\u0E48\u0E33 \u2014 \u0E43\u0E0A\u0E49\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C\u0E0B\u0E49\u0E2D\u0E19\u0E01\u0E31\u0E19\u0E2B\u0E25\u0E32\u0E22\u0E0A\u0E31\u0E49\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E19\u0E49\u0E19\u0E2A\u0E35\u0E40\u0E02\u0E49\u0E21\u0E02\u0E36\u0E49\u0E19</li>\n                <li>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E44\u0E27\u0E49\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E0A\u0E49\u0E0B\u0E49\u0E33\u0E43\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E2D\u0E37\u0E48\u0E19 \u0E46 \u0E44\u0E14\u0E49\u0E2A\u0E30\u0E14\u0E27\u0E01</li>\n              </ul>\n            </div>\n          </div>\n\n          <div class=\"guide-section\" *ngIf=\"userGuideContent && userGuideContent.trim() !== ''\">\n            <h4 class=\"guide-section__title\"><ion-icon name=\"megaphone\" style=\"color:#10b981;\"></ion-icon> \u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21</h4>\n            <div class=\"guide-raw-content\">{{ userGuideContent }}</div>\n          </div>\n\n          <button *ngIf=\"canManageGuide\" (click)=\"editGuide()\" class=\"guide-edit-btn\">\n            <ion-icon name=\"create-outline\"></ion-icon> \u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21\n          </button>\n        </div>\n\n        <div *ngIf=\"isEditingGuide\" style=\"display: flex; flex-direction: column; height: 100%;\">\n          <div style=\"font-size: 12px; color: #94a3b8; margin-bottom: 8px;\">\u0E04\u0E38\u0E13\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E43\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E18\u0E23\u0E23\u0E21\u0E14\u0E32 \u0E2B\u0E23\u0E37\u0E2D Markdown (\u0E16\u0E49\u0E32\u0E21\u0E35\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E25\u0E07)</div>\n          <textarea [(ngModel)]=\"tempGuideContent\" style=\"flex: 1; min-height: 300px; width: 100%; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid #334155; border-radius: 6px; color: #e8eaf6; font-size: 13.5px; resize: none; line-height: 1.5; outline: none; font-family: sans-serif;\" placeholder=\"\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E17\u0E35\u0E48\u0E19\u0E35\u0E48...\"></textarea>\n          \n          <div style=\"display: flex; gap: 8px; margin-top: 16px; padding-bottom: 20px;\">\n            <button (click)=\"cancelEditGuide()\" style=\"flex: 1; padding: 10px; background: transparent; border: 1px solid #475569; color: #94a3b8; border-radius: 6px; cursor: pointer; font-weight: 500;\">\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01</button>\n            <button (click)=\"saveGuide()\" style=\"flex: 1; padding: 10px; background: #3b82f6; border: none; color: #fff; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s;\">\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- History Panel (right slide-in drawer) -->\n  <div class=\"annot-history-drawer\" [class.open]=\"showHistoryPanel\">\n    <div class=\"annot-history-drawer__backdrop\" (click)=\"showHistoryPanel = false\"></div>\n    <div class=\"annot-history-drawer__panel\">\n      <div class=\"annot-history-drawer__header\">\n        <span><ion-icon name=\"time-outline\"></ion-icon> \u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02</span>\n        <button (click)=\"showHistoryPanel = false\"><ion-icon name=\"close-outline\"></ion-icon></button>\n      </div>\n\n      <div class=\"annot-history-loading\" *ngIf=\"isLoadingHistory\">\n        <ion-spinner name=\"dots\"></ion-spinner>\n      </div>\n\n      <div class=\"annot-history-list\" *ngIf=\"!isLoadingHistory\">\n        <div class=\"annot-history-entry\" *ngFor=\"let h of historyEntries\">\n          <div class=\"annot-history-entry__icon\" [class]=\"'hi-' + h.action_type\">\n            <ion-icon [name]=\"getHistoryActionIcon(h.action_type)\"></ion-icon>\n          </div>\n          <div class=\"annot-history-entry__body\">\n            <div class=\"annot-history-entry__title\">\n              {{ getHistoryActionLabel(h.action_type) }}\n              <span class=\"annot-history-entry__page\" *ngIf=\"h.page_number > 0\">\u0E2B\u0E19\u0E49\u0E32 {{ h.page_number }}</span>\n            </div>\n            <div class=\"annot-history-entry__user\">{{ h.user_name || h.user_id || '\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49' }}</div>\n            <div class=\"annot-history-entry__time\">{{ h.created_at | date:'dd/MM/yyyy HH:mm' }}</div>\n          </div>\n        </div>\n        <div class=\"annot-history-empty\" *ngIf=\"historyEntries.length === 0\">\n          <ion-icon name=\"time-outline\"></ion-icon>\n          <p>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34</p>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Hidden file input for signature upload (always in DOM) -->\n  <input type=\"file\" #signatureFileInput accept=\"image/*\" style=\"display:none\"\n    (change)=\"onSignatureFileSelected($event)\">\n\n  <!-- Stamp Picker Modal -->\n  <div class=\"signature-picker-modal\" *ngIf=\"showStampPickerModal\">\n    <div class=\"signature-picker-modal__backdrop\" (click)=\"closeStampPicker()\"></div>\n    <div class=\"signature-picker-modal__content\">\n\n      <!-- Stamp List -->\n      <div *ngIf=\"!showStampGenerator\">\n        <h3>\u0E15\u0E23\u0E32\u0E22\u0E32\u0E07/\u0E15\u0E23\u0E32\u0E1B\u0E23\u0E30\u0E17\u0E31\u0E1A</h3>\n        <p class=\"signature-picker-modal__hint\">\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E15\u0E23\u0E32\u0E1B\u0E23\u0E30\u0E17\u0E31\u0E1A\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49 \u0E2B\u0E23\u0E37\u0E2D\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E43\u0E2B\u0E21\u0E48</p>\n\n        <div class=\"signature-picker-modal__loading\" *ngIf=\"isLoadingSignatures\">\n          <ion-spinner name=\"crescent\"></ion-spinner><span>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14...</span>\n        </div>\n\n        <div class=\"signature-picker-modal__list\" *ngIf=\"!isLoadingSignatures && savedStamps.length > 0\">\n          <div class=\"signature-item\" *ngFor=\"let stamp of savedStamps\" (click)=\"$event.stopPropagation()\">\n            <img [src]=\"stamp.dataUrl\" (click)=\"useSavedStamp(stamp)\" style=\"cursor:pointer; max-height:50px; width:auto; object-fit:contain;\">\n            <div class=\"signature-item__info\">\n              <div class=\"stamp-name-row\" *ngIf=\"stampEditingId !== stamp.id\" (click)=\"startStampRename(stamp, $event)\">\n                <span class=\"signature-item__name\">{{ stamp.name }}</span>\n                <ion-icon name=\"pencil-outline\" class=\"stamp-edit-icon\"></ion-icon>\n              </div>\n              <input class=\"stamp-name-input\" *ngIf=\"stampEditingId === stamp.id\"\n                type=\"text\" [(ngModel)]=\"stampEditingName\"\n                (keyup.enter)=\"saveStampRename(stamp)\"\n                (blur)=\"saveStampRename(stamp)\"\n                (click)=\"$event.stopPropagation()\" />\n              <span class=\"signature-item__badge\">{{ stamp.type === 'receive' ? '\u0E23\u0E31\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23' : '\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B' }}</span>\n            </div>\n            <div class=\"signature-item__actions\">\n              <button class=\"signature-item__btn\" (click)=\"useSavedStamp(stamp)\" title=\"\u0E43\u0E0A\u0E49\u0E15\u0E23\u0E32\u0E19\u0E35\u0E49\">\n                <ion-icon name=\"checkmark\"></ion-icon>\n              </button>\n              <button class=\"signature-item__btn signature-item__btn--delete\" (click)=\"deleteSavedStamp(stamp, $event)\" title=\"\u0E25\u0E1A\">\n                <ion-icon name=\"trash\"></ion-icon>\n              </button>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"signature-picker-modal__empty\" *ngIf=\"!isLoadingSignatures && savedStamps.length === 0\">\n          <ion-icon name=\"business-outline\"></ion-icon>\n          <p>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E15\u0E23\u0E32\u0E1B\u0E23\u0E30\u0E17\u0E31\u0E1A\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49 \u0E01\u0E14 \"\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E15\u0E23\u0E32\u0E22\u0E32\u0E07\u0E43\u0E2B\u0E21\u0E48\" \u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07</p>\n        </div>\n\n        <div class=\"signature-picker-modal__actions\">\n          <ion-button fill=\"outline\" color=\"medium\" (click)=\"closeStampPicker()\">\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01</ion-button>\n          <ion-button fill=\"outline\" color=\"secondary\" (click)=\"triggerStampUpload()\">\n            <ion-icon name=\"cloud-upload-outline\" slot=\"start\"></ion-icon>\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E44\u0E1F\u0E25\u0E4C\n          </ion-button>\n          <ion-button color=\"primary\" (click)=\"openStampGenerator()\">\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E15\u0E23\u0E32\u0E22\u0E32\u0E07\u0E43\u0E2B\u0E21\u0E48</ion-button>\n        </div>\n      </div>\n\n      <!-- Stamp Generator UI -->\n      <div *ngIf=\"showStampGenerator\" style=\"text-align: left;\">\n        <h3 style=\"text-align: center;\">\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E15\u0E23\u0E32\u0E1B\u0E23\u0E30\u0E17\u0E31\u0E1A\u0E43\u0E2B\u0E21\u0E48</h3>\n        <p class=\"signature-picker-modal__hint\" style=\"text-align: center;\">\u0E1B\u0E23\u0E31\u0E1A\u0E41\u0E15\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E25\u0E30\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A</p>\n\n        <div style=\"margin-bottom: 16px;\">\n          <ion-item lines=\"none\" class=\"input-item\" style=\"--background: #f8fafc; --color: #0f172a; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 2px;\">\n            <ion-icon name=\"options-outline\" slot=\"start\" color=\"medium\"></ion-icon>\n            <ion-select [(ngModel)]=\"stampGenType\" interface=\"popover\" placeholder=\"\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\">\n              <ion-select-option value=\"receive\">\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17: \u0E1B\u0E23\u0E30\u0E17\u0E31\u0E1A\u0E23\u0E31\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23 (\u0E21\u0E35 \u0E40\u0E25\u0E02\u0E23\u0E31\u0E1A/\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48/\u0E40\u0E27\u0E25\u0E32)</ion-select-option>\n              <ion-select-option value=\"custom\">\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17: \u0E15\u0E23\u0E32\u0E1B\u0E23\u0E30\u0E17\u0E31\u0E1A\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B (\u0E44\u0E21\u0E48\u0E21\u0E35\u0E0A\u0E48\u0E2D\u0E07\u0E01\u0E23\u0E2D\u0E01)</ion-select-option>\n            </ion-select>\n          </ion-item>\n\n          <ion-item lines=\"none\" class=\"input-item\" style=\"--background: #f8fafc; --color: #0f172a; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 2px;\">\n            <ion-label position=\"floating\" style=\"font-size:14px;\">\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E1A\u0E23\u0E23\u0E17\u0E31\u0E14\u0E17\u0E35\u0E48 1 (\u0E15\u0E31\u0E27\u0E2B\u0E19\u0E32\u0E1A\u0E19\u0E2A\u0E38\u0E14)</ion-label>\n            <ion-input type=\"text\" [(ngModel)]=\"stampGenText1\"></ion-input>\n          </ion-item>\n\n          <ion-item lines=\"none\" class=\"input-item\" style=\"--background: #f8fafc; --color: #0f172a; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 2px;\">\n            <ion-label position=\"floating\" style=\"font-size:14px;\">\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E1A\u0E23\u0E23\u0E17\u0E31\u0E14\u0E17\u0E35\u0E48 2 (\u0E23\u0E2D\u0E07\u0E25\u0E07\u0E21\u0E32)</ion-label>\n            <ion-input type=\"text\" [(ngModel)]=\"stampGenText2\"></ion-input>\n          </ion-item>\n\n          <ion-item lines=\"none\" class=\"input-item\" *ngIf=\"stampGenType !== 'receive'\" style=\"--background: #f8fafc; --color: #0f172a; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 2px;\">\n            <ion-label position=\"floating\" style=\"font-size:14px;\">\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E1A\u0E23\u0E23\u0E17\u0E31\u0E14\u0E17\u0E35\u0E48 3 (\u0E16\u0E49\u0E32\u0E21\u0E35)</ion-label>\n            <ion-input type=\"text\" [(ngModel)]=\"stampGenText3\"></ion-input>\n          </ion-item>\n\n          <ng-container *ngIf=\"stampGenType === 'receive'\">\n            <ion-item lines=\"none\" class=\"input-item\" style=\"--background: #f8fafc; --color: #0f172a; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 2px;\">\n              <ion-label position=\"floating\" style=\"font-size:14px; color:#3b82f6;\">\u0E40\u0E25\u0E02\u0E23\u0E31\u0E1A\u0E17\u0E35\u0E48 (\u0E1B\u0E25\u0E48\u0E2D\u0E22\u0E27\u0E48\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E15\u0E34\u0E21\u0E17\u0E35\u0E2B\u0E25\u0E31\u0E07)</ion-label>\n              <ion-input type=\"text\" [(ngModel)]=\"stampGenDocNo\" placeholder=\"\u0E40\u0E0A\u0E48\u0E19 1234/2569\"></ion-input>\n            </ion-item>\n            <ion-item lines=\"none\" class=\"input-item\" style=\"--background: #f8fafc; --color: #0f172a; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 2px;\">\n              <ion-label position=\"floating\" style=\"font-size:14px; color:#3b82f6;\">\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 (\u0E1B\u0E25\u0E48\u0E2D\u0E22\u0E27\u0E48\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E15\u0E34\u0E21\u0E17\u0E35\u0E2B\u0E25\u0E31\u0E07)</ion-label>\n              <ion-input type=\"text\" [(ngModel)]=\"stampGenDate\" placeholder=\"\u0E40\u0E0A\u0E48\u0E19 6 \u0E1E.\u0E04. 2569\"></ion-input>\n            </ion-item>\n            <ion-item lines=\"none\" class=\"input-item\" style=\"--background: #f8fafc; --color: #0f172a; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 2px;\">\n              <ion-label position=\"floating\" style=\"font-size:14px; color:#3b82f6;\">\u0E40\u0E27\u0E25\u0E32 (\u0E1B\u0E25\u0E48\u0E2D\u0E22\u0E27\u0E48\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E15\u0E34\u0E21\u0E17\u0E35\u0E2B\u0E25\u0E31\u0E07)</ion-label>\n              <ion-input type=\"text\" [(ngModel)]=\"stampGenTime\" placeholder=\"\u0E40\u0E0A\u0E48\u0E19 09.00\"></ion-input>\n            </ion-item>\n          </ng-container>\n\n          <div style=\"margin-top: 10px; display: flex; gap: 8px; justify-content: center;\">\n            <div class=\"color-dot\" style=\"background:#ef4444; width: 30px; height: 30px;\" (click)=\"stampGenColor='#ef4444'\" [class.active]=\"stampGenColor === '#ef4444'\"></div>\n            <div class=\"color-dot\" style=\"background:#3b82f6; width: 30px; height: 30px;\" (click)=\"stampGenColor='#3b82f6'\" [class.active]=\"stampGenColor === '#3b82f6'\"></div>\n            <div class=\"color-dot\" style=\"background:#10b981; width: 30px; height: 30px;\" (click)=\"stampGenColor='#10b981'\" [class.active]=\"stampGenColor === '#10b981'\"></div>\n            <div class=\"color-dot\" style=\"background:#000000; width: 30px; height: 30px;\" (click)=\"stampGenColor='#000000'\" [class.active]=\"stampGenColor === '#000000'\"></div>\n          </div>\n\n          <ion-item lines=\"none\" style=\"--background: transparent; --padding-start: 0; margin-top: 8px;\">\n            <ion-checkbox [(ngModel)]=\"stampGenNoBorder\" slot=\"start\" style=\"margin-right: 8px;\"></ion-checkbox>\n            <ion-label style=\"font-size: 14px; color: #64748b;\">\u0E44\u0E21\u0E48\u0E41\u0E2A\u0E14\u0E07\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A</ion-label>\n          </ion-item>\n        </div>\n\n        <div class=\"signature-picker-modal__actions\" style=\"justify-content: center;\">\n          <ion-button fill=\"outline\" color=\"medium\" (click)=\"cancelStampGenerator()\" style=\"margin-right: 8px;\">\u0E01\u0E25\u0E31\u0E1A</ion-button>\n          <ion-button color=\"primary\" (click)=\"saveGeneratedStamp()\"><ion-icon name=\"save-outline\" slot=\"start\"></ion-icon> \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E41\u0E25\u0E30\u0E19\u0E33\u0E44\u0E1B\u0E43\u0E0A\u0E49</ion-button>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Signature Pad Modal -->\n  <div class=\"signature-modal\" *ngIf=\"showSignaturePad\">\n    <div class=\"signature-modal__backdrop\" (click)=\"closeSignaturePad()\"></div>\n    <div class=\"signature-modal__content\">\n      <h3>\u0E25\u0E07\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19</h3>\n\n      <!-- Mode Tabs -->\n      <div class=\"sig-mode-tabs\">\n        <button class=\"sig-mode-tab\" [class.active]=\"sigMode === 'draw'\" (click)=\"switchSigMode('draw')\">\n          <ion-icon name=\"pencil-outline\"></ion-icon>\n          \u0E27\u0E32\u0E14\n        </button>\n        <button class=\"sig-mode-tab\" [class.active]=\"sigMode === 'type'\" (click)=\"switchSigMode('type')\">\n          <ion-icon name=\"text-outline\"></ion-icon>\n          \u0E1E\u0E34\u0E21\u0E1E\u0E4C\n        </button>\n      </div>\n\n      <p class=\"signature-modal__hint\" *ngIf=\"sigMode === 'draw'\">\u0E27\u0E32\u0E14\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E43\u0E19\u0E01\u0E23\u0E2D\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07 (\u0E22\u0E01\u0E1B\u0E32\u0E01\u0E01\u0E32\u0E41\u0E25\u0E49\u0E27\u0E27\u0E32\u0E14\u0E15\u0E48\u0E2D\u0E44\u0E14\u0E49)</p>\n      <p class=\"signature-modal__hint\" *ngIf=\"sigMode === 'type'\">\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E0A\u0E37\u0E48\u0E2D\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E41\u0E25\u0E49\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23</p>\n\n      <!-- Draw mode: Pen Options -->\n      <div class=\"signature-modal__pen-options\" *ngIf=\"sigMode === 'draw'\">\n        <div class=\"pen-option-group\">\n          <span class=\"pen-option-label\">\u0E2A\u0E35:</span>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setSignaturePenColor('#000000')\"\n              [class.active]=\"signaturePenColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setSignaturePenColor('#0000FF')\"\n              [class.active]=\"signaturePenColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setSignaturePenColor('#FF0000')\"\n              [class.active]=\"signaturePenColor === '#FF0000'\"></div>\n          </div>\n        </div>\n        <div class=\"pen-option-group\">\n          <span class=\"pen-option-label\">\u0E02\u0E19\u0E32\u0E14:</span>\n          <button class=\"pen-size-btn\" (click)=\"changeSignaturePenSize(-0.5)\" [disabled]=\"signaturePenSize <= 1\">\n            <ion-icon name=\"remove\"></ion-icon>\n          </button>\n          <span class=\"pen-size-val\">{{ signaturePenSize }}</span>\n          <button class=\"pen-size-btn\" (click)=\"changeSignaturePenSize(0.5)\" [disabled]=\"signaturePenSize >= 10\">\n            <ion-icon name=\"add\"></ion-icon>\n          </button>\n        </div>\n      </div>\n\n      <!-- Type mode: Text + Font Options -->\n      <div class=\"signature-modal__type-opts\" *ngIf=\"sigMode === 'type'\">\n        <div class=\"signature-modal__type-top\">\n          <input class=\"signature-modal__type-input\" type=\"text\"\n            placeholder=\"\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E0A\u0E37\u0E48\u0E2D\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13...\"\n            [(ngModel)]=\"typedText\"\n            (input)=\"onTypedInput()\" />\n          <div class=\"signature-modal__type-color\">\n            <span class=\"pen-option-label\">\u0E2A\u0E35:</span>\n            <div class=\"color-dots\">\n              <div class=\"color-dot\" style=\"background:#000\"\n                (click)=\"setSignaturePenColor('#000000'); renderTypedCanvas()\"\n                [class.active]=\"signaturePenColor === '#000000'\"></div>\n              <div class=\"color-dot\" style=\"background:#00f\"\n                (click)=\"setSignaturePenColor('#0000FF'); renderTypedCanvas()\"\n                [class.active]=\"signaturePenColor === '#0000FF'\"></div>\n              <div class=\"color-dot\" style=\"background:#f00\"\n                (click)=\"setSignaturePenColor('#FF0000'); renderTypedCanvas()\"\n                [class.active]=\"signaturePenColor === '#FF0000'\"></div>\n            </div>\n          </div>\n        </div>\n        <div class=\"signature-modal__type-fonts\">\n          <button class=\"type-font-btn\" *ngFor=\"let f of typedFontOptions; let i = index\"\n            [class.active]=\"typedFontIndex === i\"\n            [style.fontFamily]=\"f.family\"\n            [style.fontWeight]=\"f.weight\"\n            [style.fontStyle]=\"f.style\"\n            (click)=\"pickTypedFont(i)\">\n            {{ typedText || '\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19' }}\n          </button>\n        </div>\n      </div>\n\n      <canvas #signatureCanvas class=\"signature-modal__canvas\"\n        [class.signature-modal__canvas--preview]=\"sigMode === 'type'\"></canvas>\n\n      <div class=\"signature-modal__actions\">\n        <ion-button fill=\"outline\" color=\"medium\" (click)=\"clearSignaturePad()\" *ngIf=\"sigMode === 'draw'\">\n          <ion-icon name=\"refresh\" slot=\"start\"></ion-icon>\n          \u0E25\u0E49\u0E32\u0E07\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"danger\" (click)=\"closeSignaturePad()\">\n          <ion-icon name=\"close\" slot=\"start\"></ion-icon>\n          \u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"tertiary\" (click)=\"triggerSignatureUpload()\" *ngIf=\"sigMode === 'draw'\">\n          <ion-icon name=\"image-outline\" slot=\"start\"></ion-icon>\n          \u0E2D\u0E31\u0E1E\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E39\u0E1B\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"success\" (click)=\"saveSignatureToDatabase()\">\n          <ion-icon name=\"cloud-upload\" slot=\"start\"></ion-icon>\n          \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49\u0E43\u0E0A\u0E49\u0E20\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E07\n        </ion-button>\n        <ion-button color=\"primary\" (click)=\"saveSignature()\">\n          <ion-icon name=\"checkmark\" slot=\"start\"></ion-icon>\n          \u0E43\u0E0A\u0E49\u0E04\u0E23\u0E31\u0E49\u0E07\u0E19\u0E35\u0E49\n        </ion-button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Signature Picker Modal -->\n  <div class=\"signature-picker-modal\" *ngIf=\"showSignaturePicker\">\n    <div class=\"signature-picker-modal__backdrop\" (click)=\"closeSignaturePicker()\"></div>\n    <div class=\"signature-picker-modal__content\">\n      <h3>\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19</h3>\n      <p class=\"signature-picker-modal__hint\">\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49 \u0E2B\u0E23\u0E37\u0E2D\u0E27\u0E32\u0E14\u0E43\u0E2B\u0E21\u0E48</p>\n\n      <div class=\"signature-picker-modal__loading\" *ngIf=\"isLoadingSignatures\">\n        <ion-spinner name=\"crescent\"></ion-spinner>\n        <span>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14...</span>\n      </div>\n\n      <div class=\"signature-picker-modal__list\" *ngIf=\"!isLoadingSignatures\">\n        <div class=\"signature-item\" *ngFor=\"let sig of savedSignatures\" (click)=\"useSavedSignature(sig)\">\n          <img [src]=\"sig.signature_data\" [alt]=\"sig.signature_name\" />\n          <div class=\"signature-item__info\">\n            <span class=\"signature-item__name\">{{ sig.signature_name }}</span>\n            <span class=\"signature-item__badge\" *ngIf=\"sig.is_default\">\u0E2B\u0E25\u0E31\u0E01</span>\n          </div>\n          <div class=\"signature-item__actions\">\n            <button class=\"signature-item__btn\" (click)=\"setDefaultSignature(sig, $event)\"\n              [class.active]=\"sig.is_default\" title=\"\u0E15\u0E31\u0E49\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E2B\u0E25\u0E31\u0E01\">\n              <ion-icon name=\"star\"></ion-icon>\n            </button>\n            <button class=\"signature-item__btn signature-item__btn--delete\" (click)=\"deleteSavedSignature(sig, $event)\"\n              title=\"\u0E25\u0E1A\">\n              <ion-icon name=\"trash\"></ion-icon>\n            </button>\n          </div>\n        </div>\n\n        <div class=\"signature-picker-modal__empty\" *ngIf=\"savedSignatures.length === 0\">\n          <ion-icon name=\"create-outline\"></ion-icon>\n          <p>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49</p>\n        </div>\n      </div>\n\n      <div class=\"signature-picker-modal__actions\">\n        <ion-button fill=\"outline\" color=\"medium\" (click)=\"closeSignaturePicker()\">\n          <ion-icon name=\"close\" slot=\"start\"></ion-icon>\n          \u0E1B\u0E34\u0E14\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"secondary\" (click)=\"triggerSignatureUpload()\">\n          <ion-icon name=\"cloud-upload\" slot=\"start\"></ion-icon>\n          \u0E2D\u0E31\u0E1E\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E39\u0E1B\n        </ion-button>\n        <ion-button color=\"primary\" (click)=\"openSignaturePadFromPicker()\">\n          <ion-icon name=\"create\" slot=\"start\"></ion-icon>\n          \u0E27\u0E32\u0E14\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E43\u0E2B\u0E21\u0E48\n        </ion-button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Preview Overlay -->\n  <div class=\"preview-overlay\" *ngIf=\"showPreviewOverlay\">\n    <div class=\"preview-header\">\n      <div class=\"preview-title\">{{ isCancelMode ? '\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E19\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01' : '\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E19\u0E25\u0E07\u0E19\u0E32\u0E21' }}</div>\n      <div class=\"preview-actions\">\n        <ion-button fill=\"clear\" color=\"dark\" (click)=\"backToEdit()\">\n          <ion-icon slot=\"start\" name=\"arrow-back-outline\"></ion-icon>\n          \u0E01\u0E25\u0E31\u0E1A\u0E44\u0E1B\u0E41\u0E01\u0E49\u0E44\u0E02\n        </ion-button>\n        <ion-button color=\"success\" (click)=\"confirmSave()\">\n          <ion-icon slot=\"start\" name=\"checkmark-done-outline\"></ion-icon>\n          {{ isCancelMode ? '\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01' : '\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E41\u0E25\u0E30\u0E25\u0E07\u0E19\u0E32\u0E21' }}\n        </ion-button>\n      </div>\n    </div>\n    <div class=\"preview-scroll-area\">\n    <div class=\"preview-body\">\n      <div class=\"preview-filter-bar\" *ngIf=\"previewIsFiltered || isLoadingAllPreview\">\n        <ion-icon name=\"information-circle-outline\"></ion-icon>\n        <span>\u0E41\u0E2A\u0E14\u0E07\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E21\u0E35\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02 ({{ previewPages.length }} / {{ previewTotalPages }} \u0E2B\u0E19\u0E49\u0E32)</span>\n        <ion-button fill=\"clear\" size=\"small\" (click)=\"loadAllPreviewPages()\" [disabled]=\"isLoadingAllPreview\">\n          <ion-spinner *ngIf=\"isLoadingAllPreview\" name=\"crescent\" slot=\"start\"></ion-spinner>\n          <span *ngIf=\"!isLoadingAllPreview\">\u0E41\u0E2A\u0E14\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 {{ previewTotalPages }} \u0E2B\u0E19\u0E49\u0E32</span>\n          <span *ngIf=\"isLoadingAllPreview\">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14...</span>\n        </ion-button>\n      </div>\n      <div class=\"preview-pages\" *ngIf=\"previewPages.length > 0\">\n        <img *ngFor=\"let page of previewPages; let i = index\" [src]=\"page\" [alt]=\"'Page ' + (i + 1)\"\n          class=\"preview-page-img\">\n      </div>\n      <div *ngIf=\"previewPages.length === 0\" class=\"preview-loading\">\n        <ion-spinner name=\"crescent\"></ion-spinner>\n        <p>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14 Preview...</p>\n      </div>\n    </div>\n    </div>\n  </div>\n\n  <!-- Custom Context Menu -->\n  <div class=\"custom-context-menu\" *ngIf=\"contextMenu.show\" [style.left.px]=\"contextMenu.x\" [style.top.px]=\"contextMenu.y\">\n    <button class=\"menu-btn\" (click)=\"contextBringToFront()\">\n      <ion-icon name=\"arrow-up-circle-outline\"></ion-icon> \u0E19\u0E33\u0E44\u0E1B\u0E44\u0E27\u0E49\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E38\u0E14 (Bring to Front)\n    </button>\n    <button class=\"menu-btn\" (click)=\"contextBringForward()\">\n      <ion-icon name=\"chevron-up-outline\"></ion-icon> \u0E19\u0E33\u0E44\u0E1B\u0E02\u0E49\u0E32\u0E07\u0E2B\u0E19\u0E49\u0E32 (Bring Forward)\n    </button>\n    <button class=\"menu-btn\" (click)=\"contextSendBackward()\">\n      <ion-icon name=\"chevron-down-outline\"></ion-icon> \u0E2A\u0E48\u0E07\u0E44\u0E1B\u0E02\u0E49\u0E32\u0E07\u0E2B\u0E25\u0E31\u0E07 (Send Backward)\n    </button>\n    <button class=\"menu-btn\" (click)=\"contextSendToBack()\">\n      <ion-icon name=\"arrow-down-circle-outline\"></ion-icon> \u0E2A\u0E48\u0E07\u0E44\u0E1B\u0E44\u0E27\u0E49\u0E2B\u0E25\u0E31\u0E07\u0E2A\u0E38\u0E14 (Send to Back)\n    </button>\n    <div class=\"menu-divider\"></div>\n    <button class=\"menu-btn danger-btn\" (click)=\"deleteContextMenuTarget()\">\n      <ion-icon name=\"trash-outline\"></ion-icon> \u0E25\u0E1A (Delete)\n    </button>\n  </div>\n\n</ion-content>",
                styles: ["@charset \"UTF-8\";:host{display:block;height:100%}.annotator-content{--background: #f1f5f9;height:100%;overflow:hidden;position:relative}.annotator-content::part(scroll){display:flex;flex-direction:column;height:100%;overflow:hidden}ion-header{box-shadow:0 2px 8px #0000000d}ion-header ion-toolbar{--background: #fff;--color: #1e293b;--padding-top: 8px;--padding-bottom: 8px}.annotator-layout{display:flex;height:100%;width:100%;min-height:0;overflow:hidden;position:relative}.annotator-layout-v2{display:flex;flex-direction:column;height:100%;width:100%;min-height:0;overflow:hidden}.toolbar-row{display:flex;align-items:center;background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:6px 12px;grid-gap:8px;gap:8px;flex-shrink:0}.toolbar-row--nav{background:#fff}.toolbar-row--tools{background:#f1f5f9;flex-wrap:wrap}.toolbar-group{display:flex;align-items:center;grid-gap:4px;gap:4px}.toolbar-group--zoom,.toolbar-group--pager{grid-gap:2px;gap:2px}.toolbar-group--save{margin-left:auto}.ppv-select{height:28px;padding:0 6px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;color:#334155;font-size:12px;cursor:pointer;outline:none}.ppv-select:focus{border-color:#3b82f6}.toolbar-divider{width:1px;height:24px;background:#e2e8f0;margin:0 8px}.toolbar-spacer{flex:1}.toolbar-label{font-size:12px;color:#64748b;min-width:50px;text-align:center}.toolbar-btn{display:flex;align-items:center;justify-content:center;grid-gap:4px;gap:4px;background:transparent;border:1px solid transparent;border-radius:6px;padding:6px 10px;cursor:pointer;transition:all .15s ease;color:#475569;font-size:13px}.toolbar-btn ion-icon{font-size:18px}.toolbar-btn .zoom-icon{font-size:10px;margin-left:-4px}.toolbar-btn:hover:not(:disabled){background:#e2e8f0}.toolbar-btn:disabled{opacity:.4;cursor:not-allowed}.toolbar-btn.active{background:#3b82f6;color:#fff;border-color:#2563eb}.toolbar-btn--guide{background:rgba(14,165,233,.1);color:#0ea5e9;border:1px solid rgba(14,165,233,.3);padding:6px 12px}.toolbar-btn--guide:hover{background:rgba(14,165,233,.2)}.toolbar-btn--guide.active{background:#0ea5e9;color:#fff;border-color:#0284c7}.toolbar-btn--save{background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);color:#fff;padding:7px 16px;font-weight:700;font-size:14px;border-radius:8px;border:1px solid #16a34a;box-shadow:0 2px 8px #22c55e59;letter-spacing:.2px;transition:all .2s ease}.toolbar-btn--save ion-icon{font-size:17px}.toolbar-btn--save:hover:not(:disabled){background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);box-shadow:0 4px 14px #22c55e80;transform:translateY(-1px)}.toolbar-btn--save:active{transform:translateY(0);box-shadow:0 2px 6px #22c55e4d}.toolbar-btn--danger{color:#ef4444}.toolbar-btn--danger:hover{background:#fee2e2}.toolbar-btn--toggle{font-size:11px;padding:4px 6px;grid-gap:2px;gap:2px}.toolbar-btn--toggle ion-icon{font-size:14px}.toolbar-btn--toggle .toggle-label{font-size:9px;font-weight:600;letter-spacing:.5px}.tool-item{display:flex;align-items:center;grid-gap:4px;gap:4px}.tool-options{display:flex;align-items:center;grid-gap:4px;gap:4px;background:#f1f5f9;padding:4px 8px;border-radius:6px;border:1px solid #e2e8f0}.tool-options button{width:24px;height:24px;border:none;background:#fff;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center}.tool-options button:hover{background:#e2e8f0}.tool-options button:disabled{opacity:.4}.tool-options button ion-icon{font-size:14px}.tool-options span{font-size:11px;min-width:24px;text-align:center;color:#64748b}.color-dots{display:flex;grid-gap:4px;gap:4px;margin-left:4px}.color-dot{width:16px;height:16px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:all .15s ease;position:relative;overflow:hidden}.color-dot:hover{transform:scale(1.1)}.color-dot.active{border-color:#1e293b;box-shadow:0 0 0 2px #fff,0 0 0 4px currentColor}.color-dot--custom{box-shadow:0 0 0 1px #cbd5e1}.color-dot--custom input[type=color]{position:absolute;top:-10px;left:-10px;width:40px;height:40px;cursor:pointer;opacity:0}.color-dot--custom:hover{box-shadow:0 0 0 1.5px #94a3b8}.insert-page-tool{position:relative}.insert-page-tool .insert-badge-icon{font-size:11px!important;margin-left:-6px;margin-top:-8px;color:#22c55e}.insert-page-dropdown{position:absolute;top:calc(100% + 4px);right:0;z-index:500}.insert-page-backdrop{position:fixed;inset:0;z-index:499}.insert-page-menu{position:relative;z-index:500;background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:8px;box-shadow:0 6px 24px #00000024;min-width:220px;display:flex;flex-direction:column;grid-gap:4px;gap:4px}.insert-page-title{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;padding:2px 6px 6px;border-bottom:1px solid #f1f5f9;margin-bottom:2px}.insert-page-btn{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:9px 12px;border:1px solid transparent;border-radius:7px;background:transparent;cursor:pointer;color:#334155;font-size:13px;text-align:left;transition:all .15s}.insert-page-btn small{color:#94a3b8;font-size:11px}.insert-page-btn ion-icon{font-size:16px;color:#3b82f6;flex-shrink:0}.insert-page-btn:hover:not(:disabled){background:#eff6ff;border-color:#bfdbfe;color:#1e40af}.insert-page-btn:hover:not(:disabled) ion-icon{color:#1d4ed8}.insert-page-btn:active:not(:disabled){background:#dbeafe}.insert-page-btn:disabled{opacity:.35;cursor:not-allowed}.insert-page-btn--danger ion-icon{color:#ef4444}.insert-page-btn--danger:hover:not(:disabled){background:#fff1f2;border-color:#fecaca;color:#b91c1c}.insert-page-btn--danger:hover:not(:disabled) ion-icon{color:#dc2626}.insert-page-btn--danger:active:not(:disabled){background:#fee2e2}.insert-page-btn--undo ion-icon{color:#f59e0b}.insert-page-btn--undo:hover:not(:disabled){background:#fffbeb;border-color:#fde68a;color:#92400e}.insert-page-btn--undo:hover:not(:disabled) ion-icon{color:#d97706}.insert-page-btn--undo:active:not(:disabled){background:#fef3c7}.insert-orient-row{display:flex;align-items:center;grid-gap:8px;gap:8px;padding:4px 6px 8px}.insert-orient-label{font-size:12px;color:#64748b;white-space:nowrap;flex-shrink:0}.insert-orient-group{display:flex;grid-gap:4px;gap:4px;flex:1}.insert-orient-btn{display:flex;align-items:center;grid-gap:5px;gap:5px;flex:1;justify-content:center;padding:6px 8px;border:1.5px solid #e2e8f0;border-radius:7px;background:#f8fafc;cursor:pointer;font-size:12px;color:#475569;transition:all .15s}.insert-orient-btn ion-icon{font-size:15px}.insert-orient-btn:hover{background:#f1f5f9;border-color:#cbd5e1}.insert-orient-btn.active{background:#eff6ff;border-color:#3b82f6;color:#1e40af;font-weight:600}.insert-orient-btn.active ion-icon{color:#3b82f6}.insert-page-title--danger{color:#ef4444!important;background:#fff1f2;border-radius:5px;padding:3px 6px 6px!important}.insert-menu-divider{height:1px;background:#f1f5f9;margin:2px 0 4px}.shape-tool-item{position:relative;display:flex;align-items:flex-start;grid-gap:4px;gap:4px;flex-wrap:nowrap}.shape-chevron{font-size:10px!important;margin-left:-2px;opacity:.7}.mark-tool-item{position:relative;display:flex;align-items:flex-start}.mark-toolbar-btn{display:flex!important;flex-direction:row!important;align-items:center!important;grid-gap:4px!important;gap:4px!important;padding:0 8px!important;min-width:unset!important}.mark-btn-label{font-size:11px;font-weight:600;white-space:nowrap;letter-spacing:-.01em}.mark-chevron{font-size:10px!important;opacity:.7}.mark-popup{position:absolute;top:calc(100% + 6px);left:0;z-index:300;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 6px 24px #00000024;padding:12px 14px;min-width:210px;display:flex;flex-direction:column;grid-gap:8px;gap:8px}.mark-popup-section-label{font-size:11px;font-weight:600;color:#64748b;letter-spacing:.02em}.mark-popup-divider{height:1px;background:#f1f5f9;margin:0}.mark-quick-row{display:flex;grid-gap:8px;gap:8px;align-items:center}.mark-quick-btn{width:44px;height:44px;border:1.5px solid #e2e8f0;border-radius:8px;background:#f8fafc;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#1e293b;padding:0;transition:background .12s,border-color .12s}.mark-quick-btn:hover{background:#e2e8f0}.mark-quick-btn.active{background:#dbeafe;border-color:#3b82f6;color:#1d4ed8}.mark-form-list{display:flex;flex-direction:column;grid-gap:2px;gap:2px}.mark-form-row-btn{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:7px 8px;border:none;border-radius:7px;background:transparent;cursor:pointer;color:#1e293b;font-size:13.5px;text-align:left;transition:background .1s}.mark-form-row-btn:hover{background:#f1f5f9}.mark-form-row-btn.active{background:#dbeafe;color:#1d4ed8}.mark-form-row-icon{width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.mark-form-row-icon--text{font-size:14px;font-weight:700;color:inherit}.mark-controls-row{display:flex;align-items:center;grid-gap:4px;gap:4px}.mark-controls-row button{width:24px;height:24px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}.mark-controls-row button:hover{background:#e2e8f0}.mark-controls-row button:disabled{opacity:.4;cursor:default}.mark-size-val{min-width:22px;text-align:center;font-size:12px;font-weight:500}.mark-cancel-btn{width:100%;display:flex;align-items:center;justify-content:center;grid-gap:6px;gap:6px;padding:7px 0;border:none;border-radius:6px;background:#f1f5f9;color:#64748b;font-size:13px;font-weight:500;cursor:pointer;transition:background .15s,color .15s}.mark-cancel-btn ion-icon{font-size:16px}.mark-cancel-btn:hover{background:#fee2e2;color:#ef4444}.shape-dropdown{position:absolute;top:calc(100% + 4px);left:0;z-index:300;display:flex;flex-direction:column;grid-gap:2px;gap:2px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:6px;box-shadow:0 4px 16px #0000001f;min-width:46px}.shape-dropdown .shape-dd-btn{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid transparent;border-radius:6px;background:transparent;cursor:pointer;color:#475569;transition:all .15s}.shape-dropdown .shape-dd-btn ion-icon{font-size:18px}.shape-dropdown .shape-dd-btn:hover{background:#f1f5f9;color:#1e293b}.shape-dropdown .shape-dd-btn.active{background:#3b82f6;color:#fff;border-color:#2563eb}.shape-options-panel{display:flex;align-items:center;grid-gap:8px;gap:8px;flex-wrap:wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:5px 10px;margin-left:2px}.shape-opt-group{display:flex;align-items:center;grid-gap:5px;gap:5px}.shape-opt-label{font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap}.sopt-divider{width:1px;height:30px;background:#e2e8f0;flex-shrink:0}.sopt-btn{display:flex;align-items:center;justify-content:center;width:22px;height:22px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;color:#475569;transition:background .12s}.sopt-btn ion-icon{font-size:13px}.sopt-btn:hover:not(:disabled){background:#e2e8f0}.sopt-btn:disabled{opacity:.35;cursor:not-allowed}.sopt-val{font-size:11px;font-weight:600;color:#475569;min-width:18px;text-align:center}.sopt-fill-toggle{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border:1px solid #e2e8f0;border-radius:5px;background:#fff;cursor:pointer;color:#94a3b8;transition:all .15s}.sopt-fill-toggle ion-icon{font-size:15px}.sopt-fill-toggle:hover{background:#f1f5f9;color:#475569}.sopt-fill-toggle.active{background:#3b82f6;color:#fff;border-color:#2563eb}.mac-color-grid{display:grid;grid-template-columns:repeat(8,16px);grid-gap:2px;gap:2px;transition:opacity .15s}.mac-color-grid.disabled{opacity:.3;pointer-events:none}.mac-swatch{width:16px;height:16px;border-radius:3px;border:1.5px solid rgba(0,0,0,.18);cursor:pointer;transition:transform .1s,box-shadow .1s;flex-shrink:0}.mac-swatch:hover{transform:scale(1.25);z-index:2;box-shadow:0 2px 6px #0003}.mac-swatch.active{transform:scale(1.15);box-shadow:0 0 0 2px #fff,0 0 0 3.5px #3b82f6;z-index:3}.mac-swatch--current{width:22px;height:22px;border-radius:4px;border:2px solid #cbd5e1;cursor:default;pointer-events:none}.mac-swatch--current:hover{transform:none}.mac-custom-color{display:flex;align-items:center;grid-gap:3px;gap:3px;transition:opacity .15s}.mac-custom-color.disabled{opacity:.3;pointer-events:none}.mac-custom-color input[type=color]{width:22px;height:22px;border:2px solid #cbd5e1;border-radius:4px;padding:1px;cursor:pointer;background:none}.mac-custom-color input[type=color]::-webkit-color-swatch-wrapper{padding:0}.mac-custom-color input[type=color]::-webkit-color-swatch{border:none;border-radius:2px}@media (max-width: 767px){.shape-options-panel{padding:4px 6px;grid-gap:5px;gap:5px}.mac-color-grid{grid-template-columns:repeat(8,13px)}.mac-color-grid .mac-swatch{width:13px;height:13px}}.main-area{display:flex;flex:1;min-height:0;overflow:hidden}.thumbnails-sidebar{width:148px;min-width:148px;background:#1a2232;display:flex;flex-direction:column;overflow:visible;position:relative;z-index:10}.thumb-list{flex:1;overflow-y:auto;overflow-x:visible;display:flex;flex-direction:column;align-items:center;padding:8px 0 16px;grid-gap:0;gap:0;scrollbar-width:thin;scrollbar-color:#334155 #1a2232}.thumb-list::-webkit-scrollbar{width:5px}.thumb-list::-webkit-scrollbar-track{background:#1a2232}.thumb-list::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}.thumb-card-wrap{width:120px;display:flex;flex-direction:column;border-radius:10px;overflow:hidden;box-shadow:0 3px 12px #0000004d;flex-shrink:0;cursor:grab;transition:opacity .15s,transform .15s;position:relative}.thumb-card-wrap--dragging{opacity:.4;cursor:grabbing}.thumb-card-wrap--drop-top:before,.thumb-card-wrap--drop-bot:after{content:\"\";position:absolute;left:0;right:0;height:3px;background:#3b82f6;border-radius:2px;z-index:10}.thumb-card-wrap--drop-top:before{top:-6px}.thumb-card-wrap--drop-bot:after{bottom:-6px}.thumb-card{width:120px;background:#243044;border-radius:0;overflow:hidden;cursor:pointer;border:2.5px solid transparent;border-bottom:none;transition:border-color .15s}.thumb-card-wrap:hover>.thumb-card{border-color:#63b3ed66}.thumb-card-wrap:has(.thumb-card.active)>.thumb-card{border-color:#3b82f6}.thumb-card.active{border-color:#3b82f6}.thumb-card__img-wrap{padding:6px 6px 0;overflow:hidden;border-radius:8px 8px 0 0}.thumb-card__img-wrap img{width:100%;border-radius:5px;display:block;box-shadow:0 2px 8px #0006}.thumb-card__label{display:block;text-align:center;color:#94a3b8;font-size:11px;font-weight:500;padding:4px 0 3px}.thumb-card__actions{display:flex;align-items:center;justify-content:space-around;padding:5px 4px;background:#0f172a;border-top:1px solid #334155;border-radius:0 0 8px 8px}.thumb-action-btn{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border:1px solid #334155;border-radius:6px;background:#1e293b;color:#94a3b8;cursor:pointer;transition:all .15s;flex-shrink:0}.thumb-action-btn ion-icon{font-size:15px}.thumb-action-btn:hover:not(:disabled){background:#334155;color:#e2e8f0;border-color:#475569}.thumb-action-btn:disabled{opacity:.25;cursor:not-allowed}.thumb-action-btn--danger{color:#f87171;border-color:#7f1d1d;background:#1c0a0a}.thumb-action-btn--danger:hover:not(:disabled){background:#450a0a;border-color:#ef4444;color:#fca5a5}.thumb-insert-row{display:flex;align-items:center;justify-content:center;width:100%;padding:6px 0;position:relative;flex-shrink:0}.thumb-insert-slot{position:relative;display:flex;align-items:center;justify-content:center}.thumb-add-btn{width:32px;height:32px;border-radius:50%;border:2px solid #3b82f6;background:#1e40af;color:#93c5fd;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;box-shadow:0 2px 8px #3b82f666}.thumb-add-btn ion-icon{font-size:18px;font-weight:700}.thumb-add-btn:hover{background:#2563eb;color:#fff;transform:scale(1.1);box-shadow:0 4px 14px #3b82f680}.thumb-add-btn:active{transform:scale(.95)}.thumb-insert-dropdown,.thumb-insert-overlay{position:fixed;left:158px;z-index:2000;transform:translateY(-50%)}.thumb-insert-backdrop{position:fixed;inset:0;z-index:698}.thumb-insert-menu{position:relative;z-index:699;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:8px;box-shadow:0 8px 32px #0000002e;min-width:210px;display:flex;flex-direction:column;grid-gap:2px;gap:2px}.thumb-insert-menu:before{content:\"\";position:absolute;left:-8px;top:50%;transform:translateY(-50%);border:8px solid transparent;border-right-color:#fff;border-left:none}.thumb-insert-opt{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:10px 14px;border:1px solid transparent;border-radius:8px;background:transparent;cursor:pointer;color:#1e293b;font-size:14px;font-family:inherit;text-align:left;transition:all .15s}.thumb-insert-opt ion-icon{font-size:18px;color:#3b82f6;flex-shrink:0}.thumb-insert-opt:hover{background:#eff6ff;border-color:#bfdbfe;color:#1e40af}.thumb-insert-opt:hover ion-icon{color:#1d4ed8}.thumb-insert-opt:active{background:#dbeafe}.viewer-wrapper{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;position:relative}.viewer-container{flex:1;overflow-y:auto;overflow-x:auto;background:#f1f5f9;display:flex;flex-direction:column;align-items:center;padding:20px;grid-gap:20px;gap:20px}.page-container{position:relative;box-shadow:0 4px 12px #00000026;background:#fff;flex-shrink:0;transform-origin:center center}.page-container.flip-mode{transition:transform .18s ease}.page-container .pdf-canvas,.page-container .annot-canvas{display:block}.page-container .annot-canvas{position:absolute;top:0;left:0;touch-action:none}@media (max-width: 767px){.toolbar-row{padding:4px 8px;grid-gap:4px;gap:4px;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch}.toolbar-row::-webkit-scrollbar{display:none}.toolbar-row--tools{padding:6px 8px}.toolbar-btn{padding:4px 6px}.toolbar-btn ion-icon{font-size:16px}.toolbar-btn span{display:none}.toolbar-divider{margin:0 4px}.thumbnails-sidebar{width:80px;min-width:80px;padding:8px 4px}.thumbnail-item img{max-width:64px}.tool-options{display:flex;flex-shrink:0}.hint{display:none}}@media (max-width: 480px){.thumbnails-sidebar{display:none}.toolbar-label{min-width:30px;font-size:10px}}.sidebar{width:200px;min-width:200px;background:#1e293b;color:#fff;display:flex;flex-direction:column;padding:16px;z-index:100;box-shadow:4px 0 15px #0000001a;overflow-y:auto}.sidebar__section{margin-bottom:24px}.sidebar__section--nav{background:rgba(255,255,255,.05);padding:12px;border-radius:12px;margin-bottom:20px;display:flex;flex-direction:column;grid-gap:12px;gap:12px}.sidebar__section--save{margin-top:auto;padding-top:20px;border-top:1px solid rgba(255,255,255,.1)}.sidebar__title{font-size:11px;font-weight:700;color:#fff6;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}.sidebar__row{display:flex;grid-gap:8px;gap:8px;margin-bottom:8px}.sidebar__row--wrap{flex-wrap:wrap}.sidebar__btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;grid-gap:6px;gap:6px;padding:10px 4px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fffc;font-size:11px;cursor:pointer;transition:all .2s;box-shadow:0 2px 4px #0000001a}.sidebar__btn ion-icon{font-size:20px}.sidebar__btn:hover:not([disabled]){background:rgba(255,255,255,.15);color:#fff;transform:translateY(-1px);box-shadow:0 4px 8px #0003}.sidebar__btn.active{background:#3b82f6;color:#fff;border-color:#60a5fa;box-shadow:0 4px 12px #3b82f666}.sidebar__btn[disabled]{opacity:.3;cursor:not-allowed}.sidebar__btn--signature{background:rgba(139,92,246,.1);border-color:#8b5cf64d;color:#a78bfa}.sidebar__btn--signature.active,.sidebar__btn--signature:hover:not([disabled]){background:#8b5cf6;color:#fff}.sidebar__btn--date{background:rgba(16,185,129,.1);border-color:#10b9814d;color:#34d399}.sidebar__btn--date.active,.sidebar__btn--date:hover:not([disabled]){background:#10b981;color:#fff}.sidebar__btn--warning{background:rgba(239,68,68,.1);border-color:#ef44444d;color:#f87171}.sidebar__btn--warning:hover:not([disabled]){background:#ef4444;color:#fff}.sidebar__btn--save{background:#10b981;color:#fff;flex-direction:row;grid-gap:10px;gap:10px;font-size:14px;font-weight:600;padding:14px;box-shadow:0 4px 12px #10b98140}.sidebar__btn--save:hover:not([disabled]){background:#059669;box-shadow:0 6px 18px #10b98166}.sidebar__btn--small{flex:0 0 calc(50% - 4px);padding:8px}.sidebar__picker{display:flex;align-items:center;grid-gap:8px;gap:8px;padding:6px 8px;margin-bottom:6px;border-radius:6px;background:rgba(255,255,255,.05)}.sidebar__picker label{font-size:11px;color:#fff9;min-width:60px}.sidebar__picker input[type=color]{width:24px;height:24px;border:2px solid rgba(255,255,255,.2);border-radius:4px;cursor:pointer;padding:0}.sidebar__picker input[type=range]{flex:1;max-width:50px}.sidebar__picker span{font-size:11px;color:#ffffffb3;min-width:20px;text-align:right}.main-content{flex:1;display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;background:#cbd5e1}.topbar-desktop{display:flex;align-items:center;justify-content:center;padding:8px 20px;background:#fff;border-bottom:1px solid #e2e8f0;box-shadow:0 2px 4px #00000005;min-height:56px}.topbar-desktop__tools{display:flex;align-items:center;grid-gap:12px;gap:12px}.topbar-desktop__tool-btn{display:flex;align-items:center;grid-gap:6px;gap:6px;padding:8px 14px;border:none;border-radius:8px;background:#fff;color:#475569;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s ease;box-shadow:0 2px 5px #00000014}.topbar-desktop__tool-btn ion-icon{font-size:18px}.topbar-desktop__tool-btn:hover:not([disabled]){background:#f1f5f9;color:#1e293b;transform:translateY(-1px);box-shadow:0 4px 10px #0000001f}.topbar-desktop__tool-btn.active{background:#3b82f6;color:#fff}.topbar-desktop__tool-btn[disabled]{opacity:.4;cursor:not-allowed}.topbar-desktop .tool-option{display:flex;align-items:center;grid-gap:8px;gap:8px;background:#fff;padding:2px 8px;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 2px 5px #0000000d}.topbar-desktop .tool-option .size-controls{display:flex;align-items:center;grid-gap:4px;gap:4px;padding-left:8px;border-left:1px solid #e2e8f0}.topbar-desktop .tool-option .size-controls button{background:none;border:none;padding:4px;cursor:pointer;color:#64748b;display:flex;align-items:center}.topbar-desktop .tool-option .size-controls button:hover:not([disabled]){color:#3b82f6}.topbar-desktop .tool-option .size-controls button[disabled]{opacity:.3}.topbar-desktop .tool-option .size-controls .size-val{font-size:12px;font-weight:700;min-width:20px;text-align:center}.topbar-desktop .tool-option .size-controls .format-btn{background:none;border:none;border-radius:4px;padding:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#64748b;transition:all .2s}.topbar-desktop .tool-option .size-controls .format-btn:hover{background:#f1f5f9;color:#1e293b}.topbar-desktop .tool-option .size-controls .format-btn.active{color:#3b82f6;background:#eff6ff}.topbar-desktop .tool-option .size-controls .format-btn--text{font-family:serif;font-size:16px}.topbar-desktop .tool-option .size-controls .format-btn--text span{display:block;width:18px;text-align:center}.topbar-desktop .tool-option .size-controls .format-btn ion-icon{font-size:18px}.topbar-desktop .tool-option .size-controls .color-palette{display:flex;align-items:center;grid-gap:6px;gap:6px;margin-left:8px}.topbar-desktop .tool-option .size-controls .color-palette .color-dot{width:16px;height:16px;border-radius:50%;cursor:pointer;border:2px solid #e2e8f0;transition:transform .2s}.topbar-desktop .tool-option .size-controls .color-palette .color-dot:hover{transform:scale(1.2)}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.active{border-color:#3b82f6;transform:scale(1.1)}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.blue{background:#0000FF}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.red{background:#FF0000}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.black{background:#000000}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.green{background:#008000}.topbar-desktop__divider{width:1px;height:24px;background:#e2e8f0;margin:0 4px}.topbar-desktop__divider--small{height:16px;opacity:.6}.topbar-desktop .save-btn{background:#10b981;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-weight:600;display:flex;align-items:center;grid-gap:8px;gap:8px;cursor:pointer;box-shadow:0 2px 4px #10b98133;margin-left:20px}.topbar-desktop .save-btn:hover{background:#059669}.topbar-pager,.topbar-zoom{display:flex;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:2px 6px;grid-gap:8px;gap:8px;height:38px}.topbar-pager__btn,.topbar-zoom__btn{background:transparent;border:none;padding:6px;cursor:pointer;color:#64748b;display:flex;align-items:center;border-radius:4px;transition:all .2s}.topbar-pager__btn:hover:not([disabled]),.topbar-zoom__btn:hover:not([disabled]){background:#f1f5f9;color:#3b82f6}.topbar-pager__btn[disabled],.topbar-zoom__btn[disabled]{opacity:.3;cursor:not-allowed}.topbar-pager__btn ion-icon,.topbar-zoom__btn ion-icon{font-size:16px}.topbar-pager__info,.topbar-pager__val,.topbar-zoom__info,.topbar-zoom__val{font-size:13px;font-weight:700;color:#475569;min-width:45px;text-align:center;-webkit-user-select:none;user-select:none}.topbar-zoom .fit-btn{font-size:11px;font-weight:700;text-transform:uppercase;color:#3b82f6;background:transparent;border:none;padding:4px 10px;cursor:pointer;letter-spacing:.5px}.topbar-zoom .fit-btn:hover{color:#2563eb;text-decoration:underline}.viewer-container{flex:1;overflow:auto!important;position:relative;padding:40px 20px;background:#cbd5e1;scrollbar-width:thin;-webkit-overflow-scrolling:touch;touch-action:auto;text-align:center}.page-container{position:relative;display:inline-block;margin-bottom:30px;background:#fff;box-shadow:0 10px 30px #00000026;text-align:left}.page-container.single-page{margin-bottom:0}.pdf-canvas{display:block}.annot-canvas{position:absolute;top:0;left:0;z-index:10;touch-action:auto;pointer-events:none}.annot-canvas.tools-active{pointer-events:auto;touch-action:none!important;-webkit-touch-callout:none!important;-webkit-user-select:none!important;user-select:none!important}.text-box{position:absolute;pointer-events:auto;border-radius:2px;border:1.5px dashed transparent;background:transparent;display:flex;flex-direction:column;z-index:20;min-width:30px;min-height:20px;box-sizing:border-box;cursor:move;padding:3px;overflow:visible}.text-box:hover{border-color:#93c5fd}.text-box.active{border:2px dashed #3b82f6;background:transparent}.text-box textarea{width:100%;height:100%;border:none;background:transparent;padding:0 3px;resize:none;outline:none;font-family:inherit;font-size:inherit;font-weight:inherit;font-style:inherit;text-align:inherit;color:inherit;overflow:hidden;display:block;line-height:inherit;letter-spacing:inherit;box-sizing:border-box;cursor:text}.text-box .tb-handle{position:absolute;background:#1a73e8;border:2px solid #fff;border-radius:50%;cursor:ew-resize;z-index:27;display:none;box-shadow:0 1px 3px #00000040}.text-box .tb-handle--left{width:12px;height:12px;left:-6px;top:50%;transform:translateY(-50%)}.text-box .tb-handle--right{width:12px;height:12px;right:-6px;top:50%;transform:translateY(-50%)}.text-box .tb-handle--br{width:14px;height:14px;right:-7px;bottom:-7px;border-radius:3px;cursor:se-resize;background:#3b82f6}.text-box.active .tb-handle{display:block}.tb-floating-bar{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translate(-50%);display:flex;align-items:center;grid-gap:2px;gap:2px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 4px 16px #00000024;padding:4px 8px;white-space:nowrap;z-index:200;cursor:default;pointer-events:all}.tb-floating-bar.tb-bar--below{bottom:auto;top:calc(100% + 6px)}.tb-bar-btn{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border:none;border-radius:6px;background:transparent;color:#475569;font-size:14px;cursor:pointer;padding:0;transition:background .12s;flex-shrink:0}.tb-bar-btn:hover:not(:disabled){background:#f1f5f9}.tb-bar-btn:disabled{opacity:.35;cursor:not-allowed}.tb-bar-btn--active{background:#dbeafe;color:#2563eb}.tb-bar-btn--italic{font-style:italic}.tb-bar-btn--delete{color:#ef4444}.tb-bar-btn--delete:hover{background:#fee2e2}.tb-bar-btn b{font-size:15px;font-weight:700;line-height:1}.tb-bar-btn i{font-size:15px;font-style:italic;line-height:1}.tb-bar-btn ion-icon{font-size:15px}.tb-bar-btn svg{display:block}.tb-bar-sep{width:1px;height:20px;background:#e2e8f0;margin:0 3px;flex-shrink:0}.tb-bar-val{min-width:24px;text-align:center;font-size:13px;font-weight:600;color:#334155}.tb-bar-select{height:28px;padding:0 6px;border:1px solid #e2e8f0;border-radius:6px;background:#f8fafc;color:#334155;font-size:12px;cursor:pointer;outline:none;max-width:130px;-webkit-user-select:auto;user-select:auto;touch-action:auto}.tb-bar-select:focus{border-color:#3b82f6}.tb-bar-input{width:44px;height:28px;padding:0 4px;border:1px solid #e2e8f0;border-radius:6px;background:#f8fafc;color:#334155;font-size:12px;text-align:center;outline:none;-webkit-user-select:text;user-select:text;touch-action:auto;cursor:text}.tb-bar-input:focus{border-color:#3b82f6;background:#fff}.tb-bar-input--rot{width:36px}.tb-bar-input--ls{width:40px}.tb-bar-input::-webkit-outer-spin-button,.tb-bar-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.tb-bar-input{-moz-appearance:textfield}.tb-bar-rot-icon{font-size:11px;color:#94a3b8;margin-left:-2px}.tb-bar-label-icon{font-size:14px;color:#94a3b8;margin-right:2px}.tb-bar-btn--step{width:24px}.tb-bar-btn--step svg{opacity:.7}.tb-bar-btn--step:hover:not(:disabled) svg{opacity:1}.tb-bar-lbl{display:flex;align-items:center;font-size:11px;font-weight:700;color:#64748b;letter-spacing:.5px;padding:0 2px;flex-shrink:0}.tb-bar-lbl svg{display:block;color:#64748b}.tb-ls-wrap{position:relative;flex-shrink:0}.tb-ls-trigger{display:flex;align-items:center;grid-gap:3px;gap:3px;height:28px;padding:0 7px;border:1.5px solid #cbd5e1;border-radius:6px;background:#fff;color:#334155;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap}.tb-ls-trigger:hover{border-color:#94a3b8}.tb-ls-trigger svg{color:#94a3b8;flex-shrink:0}.tb-ls-drop{position:absolute;top:calc(100% + 4px);left:50%;transform:translate(-50%);background:#3d4556;border-radius:12px;padding:6px 0;min-width:90px;box-shadow:0 6px 24px #00000047;z-index:400}.tb-ls-opt{display:flex;align-items:center;justify-content:center;grid-gap:4px;gap:4px;width:100%;padding:7px 16px;background:none;border:none;color:#f1f5f9;font-size:14px;font-weight:500;cursor:pointer;border-radius:8px;margin:0 4px;width:calc(100% - 8px);box-sizing:border-box}.tb-ls-opt:hover{background:rgba(255,255,255,.12)}.tb-ls-opt--checked{font-weight:700}.tb-ls-opt ion-icon{font-size:14px;color:#f1f5f9;flex-shrink:0}.tb-ls-spacer{width:14px;flex-shrink:0}.tb-bar-stepper{display:flex;align-items:center;height:28px;border:1.5px solid #cbd5e1;border-radius:6px;overflow:hidden;background:#fff;flex-shrink:0}.tb-bar-stepper-val{min-width:34px;padding:0 6px 0 8px;font-size:13px;font-weight:600;color:#334155;line-height:28px;white-space:nowrap}.tb-bar-stepper-arrows{display:flex;flex-direction:column;border-left:1.5px solid #cbd5e1;height:100%}.tb-bar-stepper-up,.tb-bar-stepper-dn{flex:1;display:flex;align-items:center;justify-content:center;padding:0 4px;background:#f8fafc;border:none;cursor:pointer;color:#475569;line-height:1}.tb-bar-stepper-up:hover:not(:disabled),.tb-bar-stepper-dn:hover:not(:disabled){background:#e2e8f0;color:#1e293b}.tb-bar-stepper-up:disabled,.tb-bar-stepper-dn:disabled{opacity:.35;cursor:default}.tb-bar-stepper-up svg,.tb-bar-stepper-dn svg{display:block}.tb-bar-stepper-up{border-bottom:1px solid #e2e8f0}.tb-bar-color{position:relative;width:24px;height:24px;border-radius:5px;border:2px solid #fff;box-shadow:0 0 0 1px #e2e8f0;cursor:pointer;overflow:hidden;flex-shrink:0}.tb-bar-color input[type=color]{position:absolute;inset:-4px;width:calc(100% + 8px);height:calc(100% + 8px);opacity:0;cursor:pointer;border:none;padding:0}.image-stamp,.signature-stamp{position:absolute;pointer-events:auto;cursor:move;border:1px dashed transparent;z-index:20;touch-action:none}.image-stamp:hover,.signature-stamp:hover{border-color:#3b82f6}.image-stamp:hover .remove-btn,.signature-stamp:hover .remove-btn{opacity:1}.image-stamp img,.signature-stamp img{width:100%;height:100%;display:block;-webkit-user-select:none;user-select:none;pointer-events:none}.image-stamp.mark-stamp-active{outline:2px solid #3b82f6;outline-offset:2px;border-color:#3b82f6}.image-stamp.mark-stamp-active .resize-handle{opacity:1}.image-stamp.mark-stamp-active .remove-btn{opacity:1}.image-stamp .mark-options-bar{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translate(-50%);background:#1e293b;border:1px solid #334155;border-radius:8px;display:flex;align-items:center;grid-gap:1px;gap:1px;padding:3px 5px;z-index:50;white-space:nowrap;box-shadow:0 4px 14px #00000073;pointer-events:auto}.image-stamp .mark-options-bar .pff-opt-btn{width:24px;height:24px;border:none;background:transparent;color:#e2e8f0;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;padding:0;flex-shrink:0}.image-stamp .mark-options-bar .pff-opt-btn:hover{background:rgba(255,255,255,.1)}.image-stamp .mark-options-bar .pff-opt-btn.pff-opt-delete{color:#f87171}.image-stamp .mark-options-bar .pff-opt-btn.pff-opt-delete:hover{background:rgba(239,68,68,.2)}.image-stamp .mark-options-bar .pff-opt-btn[disabled]{opacity:.3;cursor:not-allowed;pointer-events:none}.image-stamp .mark-options-bar .pff-opt-val{font-size:11px;color:#e2e8f0;min-width:22px;text-align:center;font-weight:600;line-height:1}.image-stamp .mark-options-bar .pff-opt-label{font-size:11px;color:#94a3b8;margin:0 2px;display:flex;align-items:center}.image-stamp .mark-options-bar .pff-opt-label ion-icon{font-size:13px}.image-stamp .mark-options-bar .pff-opt-sep{width:1px;height:16px;background:#334155;margin:0 3px;flex-shrink:0}.shape-stamp{position:absolute;pointer-events:auto;cursor:move;border:1px dashed transparent;z-index:20;touch-action:none;overflow:visible}.shape-stamp svg{display:block;width:100%;height:100%;overflow:visible;pointer-events:none;-webkit-user-select:none;user-select:none}.shape-stamp:hover{border-color:#3b82f699}.shape-stamp:hover .remove-btn{opacity:1}.shape-stamp:hover .resize-handle{opacity:1}.signature-stamp img{mix-blend-mode:multiply}.signature-stamp .digital-id-label{position:absolute;left:100%;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;grid-gap:0;gap:0;pointer-events:none;white-space:nowrap;margin-left:6px}.signature-stamp .digital-id-label span{font-size:8px;color:#555;font-family:\"Courier New\",monospace;letter-spacing:.3px;line-height:1.4}.signature-stamp .remove-btn{position:absolute;top:-10px;left:-10px;width:20px;height:20px;background:#ef4444;color:#fff;border:none;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .2s;z-index:26}.pdf-form-field{position:absolute;pointer-events:auto;cursor:move;box-sizing:border-box;touch-action:none;z-index:20}.pdf-form-field.pff-mark{border:1.5px solid #3b82f6;border-radius:3px;background:transparent;min-width:10px;min-height:10px}.pdf-form-field.pff-text{border:1.5px solid #3b82f6;border-radius:3px;background:rgba(219,234,254,.25);min-width:40px;min-height:14px}.pdf-form-field.pff-checkbox{border:1.5px solid #3b82f6;border-radius:3px;background:rgba(219,234,254,.2);min-width:14px;min-height:14px}.pdf-form-field.pff-radio{border:1.5px solid #3b82f6;border-radius:50%;background:rgba(219,234,254,.2);min-width:14px;min-height:14px}.pdf-form-field:hover{border-color:#1d4ed8}.pdf-form-field:hover .remove-btn{opacity:1}.pdf-form-field .pff-inner{width:100%;height:100%;display:flex;align-items:center;justify-content:center;pointer-events:none}.pdf-form-field .pff-text-hint{font-size:10px;color:#3b82f6;font-weight:600;opacity:.8;-webkit-user-select:none;user-select:none}.pdf-form-field .remove-btn{position:absolute;top:-8px;right:-8px;width:16px;height:16px;background:#ef4444;color:#fff;border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;opacity:0;transition:opacity .15s;z-index:30;pointer-events:auto}.pdf-form-field .resize-handle{opacity:0}.pdf-form-field:hover .resize-handle{opacity:1}.pdf-form-field.pff-no-border{border-color:transparent!important;background:rgba(219,234,254,.08)}.pdf-form-field.pff-active{outline:2px solid #3b82f6;outline-offset:1px}.pdf-form-field.pff-active .pff-resize-handle{opacity:1}.pdf-form-field:hover .pff-resize-handle{opacity:1}.pdf-form-field .pff-resize-handle{position:absolute;width:8px;height:8px;background:#3b82f6;border:1.5px solid #fff;border-radius:50%;z-index:25;touch-action:none;opacity:0;transition:opacity .15s}.pdf-form-field .pff-resize-handle.rh-nw{top:-4px;left:-4px;cursor:nw-resize}.pdf-form-field .pff-resize-handle.rh-n{top:-4px;left:calc(50% - 4px);cursor:n-resize}.pdf-form-field .pff-resize-handle.rh-ne{top:-4px;right:-4px;cursor:ne-resize}.pdf-form-field .pff-resize-handle.rh-e{top:calc(50% - 4px);right:-4px;cursor:e-resize}.pdf-form-field .pff-resize-handle.rh-se{bottom:-4px;right:-4px;cursor:se-resize}.pdf-form-field .pff-resize-handle.rh-s{bottom:-4px;left:calc(50% - 4px);cursor:s-resize}.pdf-form-field .pff-resize-handle.rh-sw{bottom:-4px;left:-4px;cursor:sw-resize}.pdf-form-field .pff-resize-handle.rh-w{top:calc(50% - 4px);left:-4px;cursor:w-resize}.pdf-form-field .pff-options-bar{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translate(-50%);background:#1e293b;border:1px solid #334155;border-radius:8px;display:flex;align-items:center;grid-gap:1px;gap:1px;padding:3px 5px;z-index:50;white-space:nowrap;box-shadow:0 4px 14px #00000073;pointer-events:auto}.pdf-form-field .pff-options-bar .pff-opt-btn{width:24px;height:24px;border:none;background:transparent;color:#e2e8f0;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;padding:0;flex-shrink:0}.pdf-form-field .pff-options-bar .pff-opt-btn:hover{background:rgba(255,255,255,.1)}.pdf-form-field .pff-options-bar .pff-opt-btn.pff-opt-active{background:rgba(59,130,246,.3);color:#60a5fa}.pdf-form-field .pff-options-bar .pff-opt-btn.pff-opt-delete{color:#f87171}.pdf-form-field .pff-options-bar .pff-opt-btn.pff-opt-delete:hover{background:rgba(239,68,68,.2)}.pdf-form-field .pff-options-bar .pff-opt-btn[disabled]{opacity:.3;cursor:not-allowed;pointer-events:none}.pdf-form-field .pff-options-bar .pff-opt-val{font-size:11px;color:#e2e8f0;min-width:22px;text-align:center;font-weight:600;line-height:1}.pdf-form-field .pff-options-bar .pff-opt-label{font-size:11px;color:#94a3b8;margin:0 2px;font-style:italic;font-weight:700;display:flex;align-items:center}.pdf-form-field .pff-options-bar .pff-opt-label ion-icon{font-size:13px}.pdf-form-field .pff-options-bar .pff-opt-sep{width:1px;height:16px;background:#334155;margin:0 3px;flex-shrink:0}.date-stamp{position:absolute;pointer-events:auto;cursor:move;padding:4px 8px;background:rgba(255,255,255,.8);border:1px dashed #ccc;border-radius:4px;white-space:nowrap;font-family:\"THSarabunNew\",sans-serif;z-index:20;touch-action:none}.date-stamp:hover{border-color:#3b82f6}.date-stamp:hover .remove-btn{opacity:1}.date-stamp .remove-btn{position:absolute;top:-8px;right:-8px;width:16px;height:16px;background:#ef4444;color:#fff;border:none;border-radius:50%;font-size:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .2s}.resize-handle{position:absolute;width:10px;height:10px;background:#3b82f6;border:1px solid #fff;border-radius:50%;z-index:22;touch-action:none;display:none}.resize-handle.rh-nw{top:-5px;left:-5px;cursor:nw-resize}.resize-handle.rh-n{top:-5px;left:calc(50% - 5px);cursor:n-resize}.resize-handle.rh-ne{top:-5px;right:-5px;cursor:ne-resize}.resize-handle.rh-e{top:calc(50% - 5px);right:-5px;cursor:e-resize}.resize-handle.rh-se{bottom:-5px;right:-5px;cursor:se-resize}.resize-handle.rh-s{bottom:-5px;left:calc(50% - 5px);cursor:s-resize}.resize-handle.rh-sw{bottom:-5px;left:-5px;cursor:sw-resize}.resize-handle.rh-w{top:calc(50% - 5px);left:-5px;cursor:w-resize}.image-stamp:hover .resize-handle,.signature-stamp:hover .resize-handle,.shape-stamp:hover .resize-handle{display:block}@media (max-width: 991px){.topbar-desktop__tools{display:none}}@media (max-width: 767px){.annotator-layout{flex-direction:column}.sidebar{width:100%;height:auto;max-height:140px;min-width:0;order:2;flex-direction:row;flex-wrap:wrap;overflow-x:auto;overflow-y:auto;padding:8px 12px;grid-gap:8px;gap:8px;scrollbar-width:none;-ms-overflow-style:none;justify-content:center;align-items:flex-start}.sidebar::-webkit-scrollbar{display:none}.sidebar__section{margin-bottom:0;flex-shrink:0;display:flex;flex-direction:row;justify-content:center;align-items:center}.sidebar__section--nav,.sidebar__section--save,.sidebar__section .sidebar__title{display:none}.sidebar__row{margin-bottom:0;grid-gap:6px;gap:6px;display:flex;flex-wrap:wrap;justify-content:center}.sidebar__btn{width:48px;height:48px;flex:none;font-size:9px;padding:4px}.sidebar__btn ion-icon{font-size:20px}.sidebar__btn span{display:none}.topbar-desktop{display:flex;padding:8px 12px}.topbar-desktop .save-btn,.topbar-desktop .doc-title{display:none}.topbar-desktop .topbar-desktop__left{display:none}.topbar-desktop .topbar-desktop__center{margin:0 auto}.viewer{padding:10px}}.mobile-pager{display:none}@media (max-width: 767px){.mobile-pager{display:flex;position:absolute;top:60px;right:16px;z-index:10;background:rgba(0,0,0,.6);color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;backdrop-filter:blur(4px)}}.loading-overlay{position:fixed;inset:0;z-index:20003;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)}.loading-overlay .loading-content{background:#fff;padding:32px 48px;border-radius:16px;text-align:center}.loading-overlay .loading-content ion-spinner{--color: #3b82f6;width:48px;height:48px}.loading-overlay .loading-content .loading-msg{margin-top:16px;font-size:14px;color:#334155}.loading-overlay .loading-content--progress{min-width:300px;padding:28px 32px}.loading-overlay .loading-content--progress .save-progress-icon{display:flex;align-items:center;justify-content:center;grid-gap:10px;gap:10px;margin-bottom:16px}.loading-overlay .loading-content--progress .save-progress-icon ion-icon{font-size:36px;color:#3b82f6}.loading-overlay .loading-content--progress .save-progress-icon .save-progress-pct{font-size:32px;font-weight:800;color:#1e293b;letter-spacing:-1px;line-height:1;min-width:64px;text-align:left}.loading-overlay .loading-content--progress .save-progress-bar-track{width:100%;height:10px;background:#e2e8f0;border-radius:99px;overflow:hidden;margin-bottom:14px}.loading-overlay .loading-content--progress .save-progress-bar-track .save-progress-bar-fill{height:100%;background:linear-gradient(90deg,#3b82f6 0%,#06b6d4 100%);border-radius:99px;transition:width .3s ease,background .5s ease}.loading-overlay .loading-content--progress .save-progress-bar-track .save-progress-bar-fill--preview{background:linear-gradient(90deg,#06b6d4 0%,#22c55e 100%)}.loading-overlay .loading-content--progress .save-progress-bar-track .save-progress-bar-fill--serializing{background:linear-gradient(90deg,#3b82f6 0%,#8b5cf6 50%,#3b82f6 100%);background-size:200% 100%;animation:shimmerBar 1.5s linear infinite}.loading-overlay .loading-content--progress .save-progress-phases{display:flex;justify-content:space-between;grid-gap:8px;gap:8px;margin-bottom:12px}.loading-overlay .loading-content--progress .save-progress-phases span{display:flex;align-items:center;grid-gap:4px;gap:4px;font-size:11.5px;color:#94a3b8;transition:color .3s}.loading-overlay .loading-content--progress .save-progress-phases span ion-icon{font-size:13px}.loading-overlay .loading-content--progress .save-progress-phases span.active{color:#3b82f6;font-weight:600}.loading-overlay .loading-content--progress .loading-msg{font-size:13px;color:#64748b;margin-top:4px}.signature-modal,.signature-picker-modal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center}.signature-modal__backdrop,.signature-picker-modal__backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)}.signature-modal__content,.signature-picker-modal__content{position:relative;background:#fff;padding:28px 36px;border-radius:20px;box-shadow:0 24px 60px #00000040;text-align:center;width:95%;max-width:500px}@media (max-width: 500px){.signature-modal__content,.signature-picker-modal__content{padding:20px}}.signature-modal__content h3,.signature-picker-modal__content h3{margin:0 0 8px;font-size:22px;font-weight:600;color:#1e293b}.signature-modal__hint,.signature-picker-modal__hint{margin:0 0 20px;font-size:14px;color:#64748b}.signature-modal__canvas,.signature-picker-modal__canvas{display:block;width:100%;height:auto;aspect-ratio:2/1;border:2px solid #e2e8f0;border-radius:12px;background:#fff;cursor:crosshair;touch-action:none}.signature-modal__canvas--preview,.signature-picker-modal__canvas--preview{cursor:default;pointer-events:none}.signature-modal__type-opts,.signature-picker-modal__type-opts{margin-bottom:16px}.signature-modal__type-top,.signature-picker-modal__type-top{display:flex;align-items:center;grid-gap:12px;gap:12px;margin-bottom:12px}.signature-modal__type-input,.signature-picker-modal__type-input{flex:1;padding:10px 14px;font-size:16px;font-family:\"THSarabunNew\",sans-serif;border:2px solid #e2e8f0;border-radius:10px;outline:none;box-sizing:border-box;text-align:center}.signature-modal__type-input:focus,.signature-picker-modal__type-input:focus{border-color:#3b82f6}.signature-modal__type-color,.signature-picker-modal__type-color{display:flex;align-items:center;grid-gap:6px;gap:6px;flex-shrink:0}.signature-modal__type-fonts,.signature-picker-modal__type-fonts{display:flex;grid-gap:8px;gap:8px;overflow-x:auto;padding-bottom:4px}.signature-modal__actions,.signature-picker-modal__actions{display:flex;grid-gap:12px;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap}.signature-modal__pen-options,.signature-picker-modal__pen-options{display:flex;align-items:center;justify-content:center;grid-gap:20px;gap:20px;margin-bottom:16px;padding:8px 16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0}.signature-modal__pen-options .pen-option-group,.signature-picker-modal__pen-options .pen-option-group{display:flex;align-items:center;grid-gap:8px;gap:8px}.signature-modal__pen-options .pen-option-label,.signature-picker-modal__pen-options .pen-option-label{font-size:13px;color:#64748b;font-weight:500}.signature-modal__pen-options .pen-size-btn,.signature-picker-modal__pen-options .pen-size-btn{width:28px;height:28px;border:1px solid #e2e8f0;background:#fff;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}.signature-modal__pen-options .pen-size-btn:hover:not(:disabled),.signature-picker-modal__pen-options .pen-size-btn:hover:not(:disabled){background:#e2e8f0}.signature-modal__pen-options .pen-size-btn:disabled,.signature-picker-modal__pen-options .pen-size-btn:disabled{opacity:.4;cursor:not-allowed}.signature-modal__pen-options .pen-size-btn ion-icon,.signature-picker-modal__pen-options .pen-size-btn ion-icon{font-size:14px}.signature-modal__pen-options .pen-size-val,.signature-picker-modal__pen-options .pen-size-val{font-size:13px;font-weight:600;min-width:28px;text-align:center;color:#334155}.sig-mode-tabs{display:flex;grid-gap:4px;gap:4px;margin-bottom:12px;background:#f1f5f9;border-radius:10px;padding:4px}.sig-mode-tab{flex:1;display:flex;align-items:center;justify-content:center;grid-gap:6px;gap:6px;padding:8px 12px;border:none;border-radius:8px;background:transparent;color:#64748b;font-size:14px;font-weight:500;cursor:pointer;transition:all .15s}.sig-mode-tab ion-icon{font-size:16px}.sig-mode-tab.active{background:#fff;color:#1e293b;box-shadow:0 1px 3px #0000001a}.type-font-btn{flex-shrink:0;padding:8px 18px;border:2px solid #e2e8f0;border-radius:10px;background:#fff;font-size:18px;line-height:1.3;cursor:pointer;transition:all .15s;color:#1e293b;white-space:nowrap}.type-font-btn:hover{border-color:#93c5fd;background:#f0f9ff}.type-font-btn.active{border-color:#3b82f6;background:#eff6ff;color:#1d4ed8}.signature-picker-modal__list{flex:1;overflow-y:auto;max-height:40vh;padding:4px 0;margin:16px 0}.signature-item{display:flex;align-items:center;grid-gap:14px;gap:14px;padding:12px 14px;margin-bottom:8px;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;transition:all .15s}.signature-item:hover{border-color:#3b82f6;background:#f8fafc;transform:translate(4px)}.signature-item img{width:100px;height:50px;object-fit:contain;background:#fff;border-radius:6px;border:1px solid #e2e8f0}.signature-item__info{flex:1;display:flex;flex-direction:column;grid-gap:4px;gap:4px;text-align:left}.signature-item__name{font-size:14px;font-weight:500;color:#1e293b}.signature-item__badge{display:inline-block;padding:2px 8px;font-size:11px;font-weight:600;color:#3b82f6;background:#eff6ff;border-radius:10px;width:-moz-fit-content;width:fit-content}.signature-item__actions{display:flex;grid-gap:6px;gap:6px}.signature-item__btn{width:32px;height:32px;border:none;border-radius:8px;background:#f1f5f9;color:#64748b;display:flex;align-items:center;justify-content:center}.signature-item__btn:hover{background:#e2e8f0;color:#334155}.signature-item__btn.active{background:#fef3c7;color:#f59e0b}.signature-item__btn--delete:hover{background:#fee2e2;color:#ef4444}.hint{background:#f8fafc;padding:10px 20px;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0}.preview-overlay{position:fixed;top:0;left:0;width:100%;height:100dvh;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);z-index:20001;display:flex;flex-direction:column;overflow:hidden;animation:fadeIn .3s ease-out}.preview-overlay .preview-header{flex-shrink:0;position:relative;background:#fff;padding:14px 24px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 12px #0000001f;z-index:20002}.preview-overlay .preview-header .preview-title{font-size:1.1rem;font-weight:700;color:#1f2937;display:flex;align-items:center;grid-gap:8px;gap:8px}.preview-overlay .preview-header .preview-title:before{content:\"\";display:inline-block;width:4px;height:20px;background:linear-gradient(180deg,#22c55e,#16a34a);border-radius:2px}.preview-overlay .preview-header .preview-actions{display:flex;grid-gap:10px;gap:10px;align-items:center}.preview-overlay .preview-header .preview-actions ion-button[fill=clear]{--color: #64748b;font-weight:500;font-size:14px}.preview-overlay .preview-header .preview-actions ion-button[color=success]{--background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);--background-activated: #15803d;--background-hover: #16a34a;--color: #fff;--border-radius: 10px;--padding-start: 22px;--padding-end: 22px;--padding-top: 12px;--padding-bottom: 12px;--box-shadow: 0 4px 16px rgba(34, 197, 94, .45);font-weight:700;font-size:15px;letter-spacing:.3px;animation:confirmPulse 2.4s ease-in-out infinite}.preview-overlay .preview-scroll-area{flex:1;overflow-y:auto;overflow-x:hidden}.preview-overlay .preview-body{min-height:100%;padding:20px;display:flex;flex-direction:column;align-items:center}.preview-overlay .preview-body .preview-filter-bar{display:flex;align-items:center;grid-gap:8px;gap:8px;background:rgba(255,193,7,.15);border:1px solid rgba(255,193,7,.4);border-radius:8px;padding:8px 14px;margin-bottom:12px;width:100%;max-width:1100px;color:#ffe082;font-size:13px}.preview-overlay .preview-body .preview-filter-bar ion-icon{font-size:18px;flex-shrink:0}.preview-overlay .preview-body .preview-filter-bar span{flex:1}.preview-overlay .preview-body .preview-filter-bar ion-button{--color: #ffe082;--border-color: rgba(255, 193, 7, .5);border:1px solid rgba(255,193,7,.5);border-radius:6px;flex-shrink:0}.preview-overlay .preview-body iframe{width:100%;height:100%;max-width:1100px;background:white;border-radius:8px;box-shadow:0 10px 25px #0000004d}.preview-overlay .preview-body .preview-pages{display:flex;flex-direction:column;grid-gap:16px;gap:16px;max-width:1100px;width:100%}.preview-overlay .preview-body .preview-page-img{width:100%;background:white;border-radius:8px;box-shadow:0 4px 12px #00000026}.preview-overlay .preview-body .preview-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;grid-gap:16px;gap:16px}.preview-overlay .preview-body .preview-loading ion-spinner{--color: white;width:48px;height:48px}.preview-overlay .preview-body .preview-loading p{font-size:16px;margin:0}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes shimmerBar{0%{background-position:200% 0}to{background-position:-200% 0}}@keyframes confirmPulse{0%,to{box-shadow:0 4px 16px #22c55e73}50%{box-shadow:0 4px 24px #22c55ebf,0 0 0 4px #22c55e26}}::ng-deep .textLayer{position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;opacity:1;line-height:1;z-index:5;--scale-factor: 1}::ng-deep .textLayer>span,::ng-deep .textLayer>br{color:transparent!important;position:absolute;white-space:pre;cursor:text;transform-origin:0% 0%}::ng-deep .textLayer ::selection{background:rgba(59,130,246,.3);color:transparent!important}.annot-history-drawer,.user-guide-drawer{position:absolute;top:0;right:0;bottom:0;left:0;z-index:999;pointer-events:none}.annot-history-drawer.open,.user-guide-drawer.open{pointer-events:auto}.annot-history-drawer__backdrop,.user-guide-drawer__backdrop{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .3s}.annot-history-drawer.open .annot-history-drawer__backdrop,.user-guide-drawer.open .annot-history-drawer__backdrop,.annot-history-drawer.open .user-guide-drawer__backdrop,.user-guide-drawer.open .user-guide-drawer__backdrop{background:rgba(0,0,0,.45)}.annot-history-drawer__panel,.user-guide-drawer__panel{position:absolute;top:0;right:0;bottom:0;width:min(340px,92vw);background:#1e293b;border-left:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;transform:translate(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);box-shadow:-6px 0 28px #00000059}.annot-history-drawer.open .annot-history-drawer__panel,.user-guide-drawer.open .annot-history-drawer__panel,.annot-history-drawer.open .user-guide-drawer__panel,.user-guide-drawer.open .user-guide-drawer__panel{transform:translate(0)}.annot-history-drawer__header,.user-guide-drawer__header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 12px;border-bottom:1px solid rgba(255,255,255,.07);font-size:14px;font-weight:700;color:#e8eaf6}.annot-history-drawer__header ion-icon,.user-guide-drawer__header ion-icon{margin-right:6px;color:#6c8ef5;vertical-align:-2px}.annot-history-drawer__header button,.user-guide-drawer__header button{background:none;border:none;color:#8892b0;cursor:pointer;font-size:20px;display:flex;align-items:center}.annot-history-drawer__header button:hover,.user-guide-drawer__header button:hover{color:#e8eaf6}.annot-history-drawer__loading,.user-guide-drawer__loading{display:flex;align-items:center;justify-content:center;padding:40px;color:#8892b0}.annot-history-drawer__loading ion-spinner,.user-guide-drawer__loading ion-spinner{--color: #6c8ef5}.annot-history-list{flex:1;overflow-y:auto;padding:6px 0;scrollbar-width:thin;scrollbar-color:#334155 #1e293b}.annot-history-list::-webkit-scrollbar{width:5px}.annot-history-list::-webkit-scrollbar-track{background:#1e293b}.annot-history-list::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}.annot-history-entry{display:flex;align-items:flex-start;grid-gap:11px;gap:11px;padding:9px 14px;border-bottom:1px solid rgba(255,255,255,.04);transition:background .12s}.annot-history-entry:last-child{border-bottom:none}.annot-history-entry:hover{background:rgba(255,255,255,.03)}.annot-history-entry__icon{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;background:rgba(108,142,245,.15);color:#6c8ef5}.annot-history-entry__icon.hi-sign{background:rgba(74,222,128,.15);color:#4ade80}.annot-history-entry__icon.hi-save{background:rgba(251,191,36,.15);color:#fbbf24}.annot-history-entry__icon.hi-page_delete{background:rgba(255,77,109,.15);color:#ff4d6d}.annot-history-entry__icon.hi-page_insert{background:rgba(94,234,212,.15);color:#5eead4}.annot-history-entry__icon.hi-upload{background:rgba(167,139,250,.15);color:#a78bfa}.annot-history-entry__icon.hi-draw{background:rgba(251,113,133,.15);color:#fb7185}.annot-history-entry__icon.hi-highlight{background:rgba(251,191,36,.15);color:#fbbf24}.annot-history-entry__icon.hi-text{background:rgba(147,197,253,.15);color:#93c5fd}.annot-history-entry__body{flex:1;min-width:0}.annot-history-entry__title{font-size:13px;font-weight:600;color:#e8eaf6;display:flex;align-items:center;grid-gap:6px;gap:6px}.annot-history-entry__page{font-size:11px;background:rgba(108,142,245,.15);color:#6c8ef5;padding:1px 6px;border-radius:10px;font-weight:400}.annot-history-entry__user{font-size:12px;color:#8892b0;margin-top:2px}.annot-history-entry__time{font-size:11px;color:#8892b08c;margin-top:1px}.annot-history-empty{display:flex;flex-direction:column;align-items:center;padding:56px 24px;color:#8892b0;grid-gap:10px;gap:10px}.annot-history-empty ion-icon{font-size:36px;opacity:.4}.annot-history-empty p{font-size:13px;margin:0}.custom-context-backdrop{position:fixed;inset:0;z-index:99998;cursor:pointer;touch-action:none}.custom-context-menu{position:fixed;z-index:99999;background:rgba(255,255,255,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(0,0,0,.1);border-radius:8px;box-shadow:0 4px 16px #00000026;padding:4px;min-width:220px;display:flex;flex-direction:column}.custom-context-menu .menu-btn{display:flex;align-items:center;grid-gap:8px;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;cursor:pointer;font-size:13px;color:#334155;border-radius:4px;text-align:left;transition:background .1s}.custom-context-menu .menu-btn ion-icon{font-size:16px;color:#64748b}.custom-context-menu .menu-btn:hover{background:#3b82f6;color:#fff}.custom-context-menu .menu-btn:hover ion-icon{color:#fff}.custom-context-menu .menu-btn.danger-btn:hover{background:#ef4444;color:#fff}.custom-context-menu .menu-btn.danger-btn:hover ion-icon{color:#fff}.custom-context-menu .menu-divider{height:1px;background:rgba(0,0,0,.08);margin:4px 0}.user-guide-content-area{flex:1;overflow-y:auto;padding:20px;background:#0f172a}.guide-view-mode{display:flex;flex-direction:column;grid-gap:24px;gap:24px}.guide-banner{display:flex;grid-gap:12px;gap:12px;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:12px 14px;color:#eff6ff;font-size:13px;line-height:1.5}.guide-banner ion-icon{font-size:24px;color:#60a5fa;flex-shrink:0}.guide-banner code{background:rgba(255,255,255,.1);padding:2px 6px;border-radius:4px;font-size:11px;color:#93c5fd}.guide-section__title{display:flex;align-items:center;grid-gap:8px;gap:8px;font-size:15px;font-weight:600;color:#f8fafc;margin:0 0 12px}.guide-section__title ion-icon{font-size:18px}.guide-list{display:flex;flex-direction:column;grid-gap:12px;gap:12px}.guide-item{display:flex;grid-gap:10px;gap:10px;align-items:flex-start;background:rgba(255,255,255,.03);padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,.05)}.guide-item__icon{font-size:16px;color:#94a3b8;margin-top:2px;flex-shrink:0}.guide-item__text{font-size:13px;line-height:1.5;color:#cbd5e1}.guide-item__text strong{color:#f8fafc;font-weight:600}.guide-item__text code{background:rgba(0,0,0,.3);padding:2px 5px;border-radius:4px;font-size:11px;color:#cbd5e1;border:1px solid rgba(255,255,255,.1)}.guide-step{width:20px;height:20px;border-radius:50%;background:#334155;color:#fff;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;flex-shrink:0}.guide-raw-content{white-space:pre-wrap;color:#94a3b8;font-size:13px;line-height:1.6;background:rgba(0,0,0,.2);padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,.05)}.guide-edit-btn{width:100%;padding:10px;background:rgba(108,142,245,.1);color:#818cf8;border:1px solid rgba(129,140,248,.3);border-radius:8px;cursor:pointer;font-weight:500;transition:all .2s;display:flex;align-items:center;justify-content:center;grid-gap:8px;gap:8px}.guide-edit-btn:hover{background:rgba(108,142,245,.15);border-color:#818cf880}.guide-dot-demo{display:inline-block;width:10px;height:10px;background:#1a73e8;border:2px solid #fff;border-radius:50%;vertical-align:middle;box-shadow:0 1px 3px #0000004d}.guide-shortcuts-grid{display:grid;grid-template-columns:1fr 1fr;grid-gap:10px;gap:10px}.guide-shortcut-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;grid-gap:6px;gap:6px}.guide-shortcut-card__keys{display:flex;align-items:center;grid-gap:4px;gap:4px}.guide-shortcut-card__keys kbd{background:#1e293b;border:1px solid #334155;border-bottom:2px solid #475569;border-radius:5px;padding:3px 7px;font-size:11px;font-family:monospace;color:#e2e8f0;line-height:1.4}.guide-shortcut-card__keys span{color:#64748b;font-size:12px}.guide-shortcut-card__label{font-size:12px;color:#94a3b8;line-height:1.3}.guide-protip{display:flex;grid-gap:12px;gap:12px;background:linear-gradient(135deg,rgba(251,191,36,.08) 0%,rgba(245,158,11,.05) 100%);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:14px}.guide-protip__icon ion-icon{font-size:22px;color:#fbbf24;flex-shrink:0}.guide-protip__title{font-size:13px;font-weight:700;color:#fde68a;margin-bottom:8px;letter-spacing:.3px}.guide-protip__list{margin:0;padding-left:16px;display:flex;flex-direction:column;grid-gap:6px;gap:6px}.guide-protip__list li{font-size:12.5px;color:#cbd5e1;line-height:1.5}.guide-protip__list li code{background:rgba(0,0,0,.25);padding:1px 5px;border-radius:4px;font-size:11px;color:#fde68a;border:1px solid rgba(251,191,36,.2)}.stamp-place-banner{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:#1d4ed8;color:#fff;font-size:14px;font-weight:500;z-index:200;flex-shrink:0}.stamp-place-banner ion-icon{vertical-align:-2px;margin-right:6px}.stamp-place-banner button{display:flex;align-items:center;grid-gap:4px;gap:4px;padding:6px 12px;border:1px solid rgba(255,255,255,.4);border-radius:8px;background:transparent;color:#fff;font-size:13px;cursor:pointer}.stamp-place-banner button:hover{background:rgba(255,255,255,.15)}.stamp-place-mode{cursor:crosshair!important}.stamp-place-mode *{pointer-events:none}.stamp-ghost-img{position:absolute;pointer-events:none;opacity:.7;transform:translate(-50%,-50%);z-index:300;height:auto}.stamp-name-row{display:flex;align-items:center;grid-gap:5px;gap:5px;cursor:pointer;border-radius:5px;padding:2px 4px;margin:-2px -4px;transition:background .15s}.stamp-name-row:hover{background:#f1f5f9}.stamp-edit-icon{font-size:12px;color:#94a3b8;flex-shrink:0;opacity:0;transition:opacity .15s}.stamp-name-row:hover .stamp-edit-icon{opacity:1}.stamp-name-input{width:100%;padding:3px 8px;font-size:14px;font-weight:500;border:2px solid #3b82f6;border-radius:6px;outline:none;box-sizing:border-box;color:#1e293b}.stamp-gen-form{display:flex;flex-direction:column;grid-gap:12px;gap:12px;margin-bottom:20px}.stamp-gen-row{display:flex;flex-direction:column;grid-gap:4px;gap:4px;text-align:left}.stamp-gen-row label{font-size:12px;color:#64748b;font-weight:500}.stamp-gen-select,.stamp-gen-input{width:100%;padding:9px 12px;font-size:14px;border:1px solid #e2e8f0;border-radius:8px;outline:none;box-sizing:border-box;background:#f8fafc;color:#0f172a}.stamp-gen-select:focus,.stamp-gen-input:focus{border-color:#3b82f6;background:#fff}.stamp-gen-colors{display:flex;align-items:center;grid-gap:10px;gap:10px}.stamp-gen-colors span{font-size:13px;color:#64748b}.flip-tool-item{position:relative}.flip-panel{position:absolute;top:calc(100% + 6px);right:0;width:280px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 10px 30px #0000001f;z-index:1000;overflow:hidden}.flip-panel__header{background:#f8fafc;padding:10px 14px;font-size:13px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;grid-gap:6px;gap:6px}.flip-panel__close{margin-left:auto;background:none;border:none;cursor:pointer;font-size:15px;color:#64748b}.flip-panel__close:hover{color:#ef4444}.flip-panel__body{padding:12px 14px;display:flex;flex-direction:column;grid-gap:12px;gap:12px}.flip-scope{display:flex;grid-gap:6px;gap:6px}.flip-scope label{flex:1;display:flex;align-items:center;justify-content:center;grid-gap:4px;gap:4px;padding:6px 8px;font-size:11px;font-weight:500;color:#64748b;background:#f1f5f9;border:2px solid transparent;border-radius:6px;cursor:pointer;transition:all .15s}.flip-scope label.active{background:#eff6ff;border-color:#3b82f6;color:#1d4ed8}.flip-current-label{font-size:12px;color:#64748b;text-align:center}.flip-current-label strong{color:#3b82f6;font-size:14px}.flip-angle-btns{display:flex;grid-gap:6px;gap:6px}.flip-btn{flex:1;padding:8px 0;font-size:13px;font-weight:600;color:#475569;background:#f1f5f9;border:2px solid transparent;border-radius:6px;cursor:pointer;transition:all .15s}.flip-btn:hover{background:#e2e8f0}.flip-btn.active{background:#3b82f6;color:#fff;border-color:#2563eb}.flip-rotate-btns{display:flex;grid-gap:8px;gap:8px}.flip-action-btn{flex:1;display:flex;align-items:center;justify-content:center;grid-gap:4px;gap:4px;padding:8px 10px;font-size:12px;font-weight:500;color:#475569;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;cursor:pointer;transition:all .15s}.flip-action-btn:hover{background:#e2e8f0;color:#1e293b}.flip-action-btn ion-icon{font-size:16px}.wm-tool-item{position:relative}.wm-panel{position:absolute;top:calc(100% + 6px);right:0;width:320px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 10px 30px #0000001f;z-index:1000;display:flex;flex-direction:column;overflow:hidden}.wm-panel__header{background:#f8fafc;padding:12px 16px;font-size:14px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;grid-gap:8px;gap:8px}.wm-panel__close{margin-left:auto;background:none;border:none;cursor:pointer;font-size:16px;color:#64748b}.wm-panel__close:hover{color:#ef4444}.wm-panel__body{padding:12px 16px;display:flex;flex-direction:column;grid-gap:10px;gap:10px;max-height:60vh;overflow-y:auto}.wm-panel__footer{padding:10px 16px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;grid-gap:8px;gap:8px}.wm-row{display:flex;align-items:center;grid-gap:8px;gap:8px}.wm-row>label{font-size:12px;font-weight:500;color:#475569;min-width:70px;white-space:nowrap}.wm-section-title{font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;margin-top:6px;padding-bottom:4px;border-bottom:1px solid #e2e8f0}.wm-input{flex:1;border:1px solid #cbd5e1;border-radius:6px;padding:6px 10px;font-size:13px;color:#1e293b;background:#fff;outline:none}.wm-input:focus{border-color:#3b82f6;box-shadow:0 0 0 2px #3b82f61a}.wm-input--sm{max-width:70px}.wm-input--xs{max-width:55px}.wm-slider{flex:1;accent-color:#3b82f6;cursor:pointer}.wm-val{font-size:12px;font-weight:600;color:#3b82f6;min-width:36px;text-align:right}.wm-color-wrap{position:relative;width:36px;height:28px;border-radius:6px;overflow:hidden;cursor:pointer;border:2px solid #e2e8f0}.wm-color-wrap .wm-color-swatch{width:100%;height:100%}.wm-color-wrap input[type=color]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}.wm-radio-group{display:flex;grid-gap:12px;gap:12px}.wm-radio-group label{font-size:12px;color:#475569;display:flex;align-items:center;grid-gap:4px;gap:4px;cursor:pointer}.wm-radio-group label input[type=radio]{accent-color:#3b82f6}.wm-spacing-group{display:flex;align-items:center;grid-gap:6px;gap:6px}.wm-spacing-group span{font-size:12px;font-weight:600;color:#64748b}.wm-file-input{font-size:12px;color:#475569}.wm-img-preview{margin-top:6px;border:1px solid #e2e8f0;border-radius:6px;padding:4px;max-height:80px;overflow:hidden}.wm-img-preview img{max-width:100%;max-height:70px;object-fit:contain}.wm-btn{display:flex;align-items:center;grid-gap:4px;gap:4px;padding:6px 14px;border-radius:6px;border:none;cursor:pointer;font-size:13px;font-weight:500;transition:all .15s}.wm-btn--apply{background:#3b82f6;color:#fff}.wm-btn--apply:hover{background:#2563eb}.wm-btn--cancel{background:#f1f5f9;color:#64748b}.wm-btn--cancel:hover{background:#e2e8f0;color:#475569}.wm-btn ion-icon{font-size:16px}.wm-preview-overlay{position:absolute;inset:0;pointer-events:none;z-index:5;overflow:hidden}.wm-preview-content{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}.wm-text-center{white-space:nowrap;font-weight:600;-webkit-user-select:none;user-select:none}.wm-text-tiled{position:absolute;inset:-200%;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;grid-gap:40px 60px;gap:40px 60px;font-weight:600;-webkit-user-select:none;user-select:none;white-space:nowrap}.wm-preview-img{max-width:40%;max-height:40%;object-fit:contain}.pn-tool-item{position:relative}.pn-panel{position:absolute;top:calc(100% + 6px);right:0;width:300px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 10px 30px #0000001f;z-index:1000;overflow:hidden}.pn-panel__header{background:#f8fafc;padding:10px 14px;font-size:13px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;grid-gap:6px;gap:6px}.pn-panel__close{margin-left:auto;background:none;border:none;cursor:pointer;font-size:15px;color:#64748b}.pn-panel__close:hover{color:#ef4444}.pn-panel__body{padding:12px 14px;display:flex;flex-direction:column;grid-gap:10px;gap:10px}.pn-panel__footer{padding:10px 14px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;grid-gap:8px;gap:8px}.pn-section-title{font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;margin-top:2px}.pn-format-btns{display:flex;grid-gap:6px;gap:6px}.pn-format-btn{flex:1;padding:7px 10px;font-size:12px;font-weight:600;color:#475569;background:#f1f5f9;border:2px solid transparent;border-radius:8px;cursor:pointer;transition:all .15s;text-align:center}.pn-format-btn:hover{background:#e2e8f0}.pn-format-btn.active{background:#eff6ff;border-color:#3b82f6;color:#1d4ed8}.pn-pos-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-gap:4px;gap:4px}.pn-pos-btn{display:flex;align-items:center;justify-content:center;grid-gap:2px;gap:2px;padding:5px 4px;font-size:10px;font-weight:500;color:#64748b;background:#f1f5f9;border:2px solid transparent;border-radius:6px;cursor:pointer;transition:all .15s}.pn-pos-btn:hover{background:#e2e8f0}.pn-pos-btn.active{background:#3b82f6;color:#fff;border-color:#2563eb}.pn-pos-btn ion-icon{font-size:12px}.pn-row{display:flex;align-items:center;grid-gap:8px;gap:8px}.pn-row>label{font-size:12px;font-weight:500;color:#475569;min-width:40px}.pn-checkbox{display:flex;align-items:center;grid-gap:6px;gap:6px;font-size:12px;color:#475569;cursor:pointer}.pn-checkbox input[type=checkbox]{accent-color:#3b82f6}.pn-input{flex:1;border:1px solid #cbd5e1;border-radius:6px;padding:5px 8px;font-size:12px;color:#1e293b;background:#fff;outline:none}.pn-input:focus{border-color:#3b82f6}.pn-input--sm{max-width:60px}.pn-preview-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:8px 12px;font-size:12px;color:#64748b;text-align:center}.pn-preview-box strong{font-weight:600}.pn-preview{pointer-events:none;z-index:6;font-weight:500}.deskew-panel{position:absolute;top:10px;left:50%;transform:translate(-50%);background:#fff;border:1px solid #e2e8f0;border-radius:8px;box-shadow:0 10px 25px #0000001a;z-index:1000;width:380px;max-width:calc(100% - 24px);display:flex;flex-direction:column;overflow:hidden}.deskew-panel__header{background:#f8fafc;padding:10px 16px;font-size:14px;font-weight:600;color:#1e293b;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;grid-gap:8px;gap:8px}.deskew-panel__body{padding:16px;display:flex;align-items:center;grid-gap:12px;gap:12px}.deskew-panel__footer{padding:10px 16px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center}.deskew-slider-container{flex:1;display:flex;flex-direction:column;align-items:center}.deskew-angle{font-size:14px;font-weight:600;margin-bottom:6px;color:#3b82f6}.deskew-slider{width:100%;accent-color:#3b82f6}.deskew-slider-ticks{width:100%;display:flex;justify-content:space-between;font-size:10px;color:#64748b;margin-top:4px}.page-container.deskew-mode{transition:transform .1s linear;box-shadow:0 0 0 3px #3b82f6,0 20px 40px #0003!important;z-index:10;pointer-events:none}\n"]
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
    stampFileInputRef: [{ type: ViewChild, args: ['stampFileInput', { static: false },] }],
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
    closed: [{ type: Output }],
    saved: [{ type: Output }],
    loadError: [{ type: Output }],
    onDocumentPointerDown: [{ type: HostListener, args: ['document:pointerdown', ['$event'],] }],
    handleKeyboard: [{ type: HostListener, args: ['window:keydown', ['$event'],] }]
};

// HttpClient must be provided by the host application:
//   Angular 15+:  provideHttpClient()  in app.config.ts
//   Angular 12-14: HttpClientModule    in AppModule imports
class PdfAnnotatorModule {
    static forRoot(config) {
        return {
            ngModule: PdfAnnotatorModule,
            providers: [
                { provide: PDF_ANNOTATOR_CONFIG, useValue: config },
                PdfManagerService
            ]
        };
    }
}
PdfAnnotatorModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PdfAnnotatorModalComponent],
                imports: [CommonModule, FormsModule, IonicModule],
                exports: [PdfAnnotatorModalComponent],
                providers: [DatePipe, PdfManagerService],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            },] }
];

/*
 * Public API Surface of pdf-annotator
 */

/**
 * Generated bundle index. Do not edit.
 */

export { PDF_ANNOTATOR_CONFIG, PdfAnnotatorModalComponent, PdfAnnotatorModule, PdfManagerService };
//# sourceMappingURL=pdf-annotator.js.map
