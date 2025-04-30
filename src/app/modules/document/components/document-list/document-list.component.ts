import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentFormComponent } from '../document-form/document-form.component';
import { DocumentRecord, DocumentService } from 'src/app/core/services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})



export class DocumentListComponent implements OnInit {
  documents: DocumentRecord[] = [];
  displayedColumns: string[] = [
    'file', 'regNumber', 'regDate', 'outNumber', 'outDate',
    'correspondent', 'topic', 'actions'
  ];

  constructor(
    private documentService: DocumentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.documentService.documents$.subscribe(data => {
      this.documents = data;
    });
  }

  openForm(): void {
    this.dialog.open(DocumentFormComponent, {
      width: '650px',
      disableClose: true
    });
  }

  openFile(file: File): void {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }

  printDocument(document: DocumentRecord): void {
    const content = `
      <h2>Печатная форма документа</h2>
      <p><strong>Рег. №:</strong> ${document.regNumber}</p>
      <p><strong>Дата рег.:</strong> ${new Date(document.regDate).toLocaleDateString()}</p>
      <p><strong>№ исх. док-та:</strong> ${document.outNumber || '-'}</p>
      <p><strong>Дата исх. док-та:</strong> ${document.outDate ? new Date(document.outDate).toLocaleDateString() : '-'}</p>
      <p><strong>Корреспондент:</strong> ${document.correspondent}</p>
      <p><strong>Тема:</strong> ${document.topic}</p>
      <p><strong>Описание:</strong> ${document.description || '-'}</p>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html><body>${content}</body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
