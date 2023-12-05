import { Component } from '@angular/core';
import {NavItemsService} from '../../services/nav-items/nav-items.service';
// import { navItems } from './_nav';


// Functions Import
import {getNavi} from '../../functions-files/getFunctions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {

  public navItems = [];

  constructor(private nI: NavItemsService) {
   

  }

  ngOnInit() {
    
    this.getNav();
   
    // console.log(this.orgData);
  }




  getNav() {
    getNavi((navItems) => {
      // Process the data to count directors related to each company
        

        // Set the data source for your MatTable
        const navLink = navItems;
        this.navItems = navItems
        // console.log(navLink);
   

      
      });
  }

  

  
}
