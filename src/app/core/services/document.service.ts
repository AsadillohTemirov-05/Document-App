import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DocumentRecord {
  id: number;
  regNumber: string;
  regDate: Date;
  outNumber?: string;
  outDate?: Date;
  deliveryMethod?: string;
  correspondent: string;
  topic: string;
  description?: string;
  executionDate?: Date;
  access: boolean;
  control: boolean;
  file?: File;
}       

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private documents: DocumentRecord[] = [];
  private documentsSubject = new BehaviorSubject<DocumentRecord[]>([]);

  documents$ = this.documentsSubject.asObservable();

  addDocument(document: DocumentRecord) {
    this.documents.push({ ...document, id: Date.now() });
    this.documentsSubject.next(this.documents);
  }
}
