import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, AbstractControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

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
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.css']
})
export class MenuDialogComponent {
  MenuForm: FormGroup;
  categories: string[] = ['main_dish', 'breakfast', 'drink', 'dessert'];

  constructor(
    private dialogRef: MatDialogRef<MenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.MenuForm = this.fb.group({
      image: [data?.image || '', [Validators.required]],
      name: [data?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [data?.description || '', [Validators.required]],
      price: [data?.price || '', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      category_name: [data?.category_name || '', Validators.required]
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


  get f(): { [key: string]: AbstractControl } {
    return this.MenuForm.controls;
  }
}
