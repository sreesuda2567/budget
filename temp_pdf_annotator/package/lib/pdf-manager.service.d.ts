import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PdfAnnotatorConfig } from './tokens';
export interface PdfDocument {
    id: number;
    user_id: string;
    file_name: string;
    page_count: number;
    file_size: number;
    tags: string;
    created_at: string;
    updated_at: string;
    history_count?: number;
}
export interface PdfHistoryEntry {
    id: number;
    document_id: number;
    user_id: string;
    action_type: 'sign' | 'text' | 'draw' | 'highlight' | 'shape' | 'image' | 'page_insert' | 'page_delete' | 'page_move' | 'date_stamp' | 'save' | 'upload' | 'open';
    action_detail: any;
    page_number: number;
    user_name: string;
    user_position: string;
    ip_address: string;
    created_at: string;
    file_name?: string;
}
export interface LogActionPayload {
    documentId: number;
    userId: string;
    actionType: PdfHistoryEntry['action_type'];
    actionDetail?: any;
    pageNumber?: number;
    userName?: string;
    userPosition?: string;
}
export declare class PdfManagerService {
    private http;
    private readonly base;
    constructor(http: HttpClient, config: PdfAnnotatorConfig | null);
    listDocuments(userId: string, search?: string): Observable<{
        success: boolean;
        data: PdfDocument[];
    }>;
    uploadDocument(file: File, userId: string, userName?: string): Observable<{
        success: boolean;
        data: PdfDocument;
    }>;
    getPdfUrl(docId: number): string;
    saveAnnotatedPdf(docId: number, pdfBlob: Blob, userId: string, fileName: string, annotationSummary?: any, userName?: string): Observable<any>;
    getDocumentInfo(docId: number): Observable<{
        success: boolean;
        data: PdfDocument;
    }>;
    deleteDocument(docId: number): Observable<any>;
    logAction(payload: LogActionPayload): Observable<any>;
    getHistory(docId: number, limit?: number, offset?: number): Observable<{
        success: boolean;
        data: PdfHistoryEntry[];
        total: number;
    }>;
    getHistorySummary(docId: number): Observable<any>;
    getSignatures(userId: string): Observable<{
        success: boolean;
        data: any[];
    }>;
    saveSignature(userId: string, signatureData: string, signatureName?: string, isDefault?: boolean): Observable<any>;
    setDefaultSignature(sigId: number): Observable<any>;
    deleteSignature(sigId: number): Observable<any>;
}
