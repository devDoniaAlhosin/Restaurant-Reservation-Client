import { Component } from '@angular/core';
import { MenuService } from '../../../Core/services/menuService/menu.service';
import { Menu } from '../../../Models/menu.model';
import { PaginatorModule } from 'primeng/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MenuDialogComponent } from './menu-dialog/menu-dialog.component';

@Component({
  selector: 'app-menu-dashboard',
  standalone: true,
  imports: [PaginatorModule],
  templateUrl: './menu-dashboard.component.html',
  styleUrl: './menu-dashboard.component.css'
})
export class MenuDashboardComponent {
  menuItems: Menu[] = [];
  menuTiles : Array<string> = [
      "Id",
      "Image",
      "Name",
      "Description",
      "Category_name",
      "Price",
  ]

  totalRecords: number = 0;
  rows: number = 6;

  constructor(private menuService: MenuService , private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMenu(this.rows, 0);  // Initial load of page 1 (0 in PrimeNG terms).
  }

  onPageChange(event: any) {
    const page = event.page + 1;  // PrimeNG starts at 0, Laravel starts at 1
    this.getMenu(event.rows, page);
  }

  getMenu(perPage: number, page: number) {
    this.menuService.getMenu(perPage, page).subscribe((data) => {
      this.menuItems = data.data;
      this.totalRecords = data.total;  // Total records from the backend
    });
  }

  openDialog(menu?: Menu): void {
    const dialogRef = this.dialog.open(MenuDialogComponent, {
      data: menu || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (menu) {
          // Update existing author
          this.menuService.updateMenu(menu.id, result).subscribe(() => {
            this.getMenu(this.rows, 0); // Refresh menu list
          });
        } else {
          // Create new author
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
}
