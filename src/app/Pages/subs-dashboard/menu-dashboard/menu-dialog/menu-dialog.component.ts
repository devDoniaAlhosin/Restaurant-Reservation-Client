import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatOption } from '@angular/material/core';
@Component({
  selector: 'app-menu-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    CommonModule,
    MatOption
  ],
  templateUrl: './menu-dialog.component.html',
  styleUrl: './menu-dialog.component.css'
})
export class MenuDialogComponent {
  MenuForm: FormGroup;
  categories: string[] = ['Beverages', 'Snacks', 'Main Course', 'Desserts'];
  constructor(
    private dialogRef: MatDialogRef<MenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.MenuForm = this.fb.group({
      image: [data?.image || ''],
      name: [data?.name || ''],
      description: [data?.description || ''],
      price: [data?.price || ''],
      category_name : [data?.category_name || '']
    });
  }

  onSubmit(): void {
    if (this.MenuForm.valid) {
      this.dialogRef.close({ ...this.data, ...this.MenuForm.value });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
