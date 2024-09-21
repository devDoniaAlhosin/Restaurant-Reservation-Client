import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../Core/services/menuService/menu.service';
import { Menu } from '../../Models/menu.model';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  menuItems: Menu[] = [];
  selectedMenuType: string = 'all';


  constructor(private menuService:MenuService){}

  ngOnInit(): void {
    this.getMenu();
  }

  getMenu() {
    this.menuService.getMenu().subscribe((data:any) => {
      this.menuItems = data.data;
      console.log(data);
    });
  }


  getFilteredMenuItems() {
    if(this.selectedMenuType === 'all') {
      return this.menuItems;
    }else{
      return this.menuItems.filter(item => item.category_name === this.selectedMenuType);
    }
  }

  fetchMenu(type: string) {
    this.selectedMenuType = type;
  }


}
