import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent   {
  menuItems: any[] = [
    {
      image:"https://media.istockphoto.com/id/1295387240/photo/delicious-meal.jpg?s=2048x2048&w=is&k=20&c=ld0p-v7mVqcXhWIRIMdGsW5BgXDiQ6Fnj0pqHfvoONc=",
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce tossed with Caesar dressing, croutons, and Parmesan cheese.',
      price: 8.99,
      type: 'main'
    },
    {
      image:"https://media.istockphoto.com/id/1295387240/photo/delicious-meal.jpg?s=2048x2048&w=is&k=20&c=ld0p-v7mVqcXhWIRIMdGsW5BgXDiQ6Fnj0pqHfvoONc=",
      name: 'Grilled Chicken Breast',
      description: 'Served with roasted vegetables and a side of garlic mashed potatoes.',
      price: 14.99,
      type: 'main'
    },
    {
      image:"https://media.istockphoto.com/id/1295387240/photo/delicious-meal.jpg?s=2048x2048&w=is&k=20&c=ld0p-v7mVqcXhWIRIMdGsW5BgXDiQ6Fnj0pqHfvoONc=",
      name: 'Chocolate Lava Cake',
      description: 'Rich chocolate cake with a molten chocolate center, served with vanilla ice cream.',
      price: 6.99,
      type: 'dessert'
    },
    {
      image:"https://media.istockphoto.com/id/1295387240/photo/delicious-meal.jpg?s=2048x2048&w=is&k=20&c=ld0p-v7mVqcXhWIRIMdGsW5BgXDiQ6Fnj0pqHfvoONc=",
      name: 'falafel',
      description: 'Rich chocolate cake with a molten chocolate center, served with vanilla ice cream.',
      price: 6.99,
      type: 'breakfast'
    },
    {
      image:"https://media.istockphoto.com/id/1295387240/photo/delicious-meal.jpg?s=2048x2048&w=is&k=20&c=ld0p-v7mVqcXhWIRIMdGsW5BgXDiQ6Fnj0pqHfvoONc=",
      name: 'juice',
      description: 'Rich chocolate cake with a molten chocolate center, served with vanilla ice cream.',
      price: 6.99,
      type: 'drinks'
    }
  ];

  selectedMenuType: string = 'all';
  getFilteredMenuItems() {
    if(this.selectedMenuType === 'all') {
      return this.menuItems;
    }else{
      return this.menuItems.filter(item => item.type === this.selectedMenuType);
    }
  }

  fetchMenu(type: string) {
    this.selectedMenuType = type;
  }


}
