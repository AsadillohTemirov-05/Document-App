import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DocumentService } from 'src/app/core/services/document.service';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss']
})
export class DocumentFormComponent {
  documentForm: FormGroup;
  fileError = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DocumentFormComponent>,
    private documentService: DocumentService
  ) {
    this.documentForm = this.fb.group({
      regNumber: ['', [Validators.required, Validators.pattern(/^(?=.*\d).+$/)]],
      regDate: [{ value: new Date(), disabled: true }, Validators.required],
      outNumber: ['', [Validators.pattern(/^(?=.*\d).+$/)]],
      outDate: [''],
      deliveryMethod: [''],
      correspondent: ['', Validators.required],
      topic: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(1000)],
      executionDate: [''],
      access: [false],
      control: [false],
      file: [null]
    });

    
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;





    
    
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 1024 * 1024;

    const isFormatValid = allowedTypes.includes(file.type);
    const isSizeValid = file.size <= maxSize;

    if (!isFormatValid && !isSizeValid) {
      this.fileError = 'Недопустимый формат и размер файла.';
    } else if (!isFormatValid) {
      this.fileError = 'Недопустимый формат.';
    } else if (!isSizeValid) {
      this.fileError = 'Размер файла превышает 1Мб.';
    } else {
      this.fileError = '';
      this.selectedFile = file;
      this.documentForm.patchValue({ file });
    }
  }

  validateExecutionDate(): boolean {
    const regDate = this.documentForm.get('regDate')?.value;
    const executionDate = this.documentForm.get('executionDate')?.value;

    if (executionDate && new Date(executionDate) < new Date(regDate)) {
      return false;
    }
    return true;
  }

  save(): void {
    if (!this.validateExecutionDate()) {
      this.fileError = 'Срок исполнения не может быть раньше даты регистрации документа.';
      return;
    }

    if (this.documentForm.valid && !this.fileError) {
      const rawData = {
        ...this.documentForm.getRawValue(),
        regDate: new Date()
      };
      this.documentService.addDocument(rawData);
      this.dialogRef.close();
    } else {
      this.documentForm.markAllAsTouched();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
