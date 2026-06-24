import { InjectionToken } from '@angular/core';
export interface PdfAnnotatorConfig {
    pdfApiUrl: string;
    signaturesApiUrl?: string;
    /**
     * Endpoint for stamp persistence (load/save/rename/delete). Uses the same
     * `aksi`-style POST body as the host app's PHP proses API. Optional — if
     * omitted, stamps still work client-side but are not persisted server-side.
     */
    stampsApiUrl?: string;
    /**
     * Path to the pdf.js worker script, copied into the host app's assets.
     * pdfjs-dist >=4 ships ESM-only workers (pdf.worker.min.mjs);
     * pdfjs-dist 2.x/3.x ship pdf.worker.min.js.
     * Default: '/assets/pdf.worker.min.mjs'
     */
    pdfWorkerSrc?: string;
    /**
     * URL of the regular Thai TTF used when baking text (page numbers, watermark,
     * text boxes) into the exported PDF. Must be reachable via fetch().
     * Default: '/assets/fonts/THSarabunNew.ttf'
     */
    fontUrl?: string;
    /**
     * URL of the bold Thai TTF used for bold baked text.
     * Default: '/assets/fonts/THSarabunNew Bold.ttf'
     */
    fontBoldUrl?: string;
}
export declare const PDF_ANNOTATOR_CONFIG: InjectionToken<PdfAnnotatorConfig>;
