import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PDF_ANNOTATOR_CONFIG, PdfAnnotatorConfig } from './tokens';

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
  action_type: 'sign' | 'text' | 'draw' | 'highlight' | 'shape' | 'image' |
    'page_insert' | 'page_delete' | 'page_move' | 'date_stamp' | 'save' | 'upload' | 'open';
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

@Injectable({ providedIn: 'root' })
export class PdfManagerService {

  private readonly base: string;

  constructor(
    private http: HttpClient,
    @Optional() @Inject(PDF_ANNOTATOR_CONFIG) config: PdfAnnotatorConfig | null
  ) {
    this.base = config?.pdfApiUrl ?? 'http://localhost:3500/api';
  }

  listDocuments(userId: string, search?: string): Observable<{ success: boolean; data: PdfDocument[] }> {
    let params = new HttpParams().set('userId', userId);
    if (search) params = params.set('search', search);
    return this.http.get<any>(`${this.base}/pdf/list`, { params });
  }

  uploadDocument(file: File, userId: string, userName?: string): Observable<{ success: boolean; data: PdfDocument }> {
    const form = new FormData();
    form.append('pdf', file);
    form.append('userId', userId);
    if (userName) form.append('userName', userName);
    return this.http.post<any>(`${this.base}/pdf/upload`, form);
  }

  getPdfUrl(docId: number): string {
    return `${this.base}/pdf/${docId}`;
  }

  saveAnnotatedPdf(
    docId: number,
    pdfBlob: Blob,
    userId: string,
    fileName: string,
    annotationSummary?: any,
    userName?: string
  ): Observable<any> {
    const form = new FormData();
    form.append('pdf', pdfBlob, fileName);
    form.append('userId', userId);
    if (userName) form.append('userName', userName);
    if (annotationSummary) form.append('annotationSummary', JSON.stringify(annotationSummary));
    return this.http.post<any>(`${this.base}/pdf/${docId}/save`, form);
  }

  getDocumentInfo(docId: number): Observable<{ success: boolean; data: PdfDocument }> {
    return this.http.get<any>(`${this.base}/pdf/${docId}/info`);
  }

  deleteDocument(docId: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/pdf/${docId}`);
  }

  logAction(payload: LogActionPayload): Observable<any> {
    return this.http.post<any>(`${this.base}/history`, payload);
  }

  getHistory(docId: number, limit = 100, offset = 0): Observable<{ success: boolean; data: PdfHistoryEntry[]; total: number }> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<any>(`${this.base}/history/${docId}`, { params });
  }

  getHistorySummary(docId: number): Observable<any> {
    return this.http.get<any>(`${this.base}/history/${docId}/summary`);
  }

  getSignatures(userId: string): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<any>(`${this.base}/signatures/${userId}`);
  }

  saveSignature(userId: string, signatureData: string, signatureName?: string, isDefault?: boolean): Observable<any> {
    return this.http.post<any>(`${this.base}/signatures`, {
      userId, signatureData, signatureName, isDefault,
    });
  }

  setDefaultSignature(sigId: number): Observable<any> {
    return this.http.put<any>(`${this.base}/signatures/${sigId}/default`, {});
  }

  deleteSignature(sigId: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/signatures/${sigId}`);
  }
}
