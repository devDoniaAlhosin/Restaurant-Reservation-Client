import { Component } from '@angular/core';
import { MenuService } from '../../../Core/services/menuService/menu.service';
import { Menu } from '../../../Models/menu.model';
import { PaginatorModule } from 'primeng/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MenuDialogComponent } from './menu-dialog/menu-dialog.component';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';  // RxJS operator for debouncing
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-menu-dashboard',
  standalone: true,
  imports: [PaginatorModule,CommonModule,ReactiveFormsModule ],
  templateUrl: './menu-dashboard.component.html',
  styleUrls: ['./menu-dashboard.component.css']
})
export class MenuDashboardComponent {
  menuItems: Menu[] = [];
  searchControl = new FormControl('');  // Using FormControl for search
  searchValue = '';
  showPaginator = true;  // To conditionally hide paginator

  menuTiles: Array<string> = [
    "Id",
    "Image",
    "Name",
    "Description",
    "Category_name",
    "Price",
  ];

  totalRecords: number = 0;
  rows: number = 6;

  constructor(private menuService: MenuService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMenu(this.rows, 0);  // Initial load of page 1 (0 in PrimeNG terms)

    // Listen for search value changes and apply debounce
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.searchValue = value || '';
      this.showPaginator = !this.searchValue;  // Hide paginator if search is active
      this.getMenu(this.rows, 0);  // Trigger search on type hinting
    });
  }

  onPageChange(event: any) {
    const page = event.page + 1;  // PrimeNG starts at 0, Laravel starts at 1
    this.getMenu(event.rows, page);
  }

  getMenu(perPage: number, page: number) {
    this.menuService.getMenu(perPage, page).subscribe((data) => {
      if (this.searchValue) {
        this.menuItems = data.data.filter((item: any) =>
          item.name.toLowerCase().includes(this.searchValue.toLowerCase())
        );
      } else {
        this.menuItems = data.data;
        this.totalRecords = data.total;  // Total records from the backend
      }
    });
  }

  openDialog(menu?: Menu): void {
    const dialogRef = this.dialog.open(MenuDialogComponent, {
      data: menu || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (menu) {
          // Update
          this.menuService.updateMenu(menu.id, result).subscribe(() => {
            this.getMenu(this.rows, 0); // Refresh menu list
          });
        } else {
          // Create
          this.menuService.createMenu(result).subscribe(() => {
            this.getMenu(this.rows, 0);
          });
        }
      }
    });
  }

  deleteMenu(menuId: number): void {
    this.menuService.deleteMenu(menuId).subscribe(() => {
      this.menuItems = this.menuItems.filter((menu) => menu.id !== menuId);
    });
  }

  // Trigger search on Enter key press
  searchOnEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.showPaginator = false;  // Hide paginator when Enter is pressed
      this.getMenu(this.rows, 0);  // Trigger search
    }
  }
}
