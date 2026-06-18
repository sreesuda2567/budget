import { InjectionToken } from '@angular/core';
export interface PdfAnnotatorConfig {
    pdfApiUrl: string;
    signaturesApiUrl?: string;
    /**
     * Path to the pdf.js worker script, copied into the host app's assets.
     * pdfjs-dist >=4 ships ESM-only workers (pdf.worker.min.mjs);
     * pdfjs-dist 2.x/3.x ship pdf.worker.min.js.
     * Default: '/assets/pdf.worker.min.mjs'
     */
    pdfWorkerSrc?: string;
}
export declare const PDF_ANNOTATOR_CONFIG: InjectionToken<PdfAnnotatorConfig>;
