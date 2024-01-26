import { Component } from '@angular/core';
import {NavItemsService} from '../../services/nav-items/nav-items.service';
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';
// import { navItems } from './_nav';
import { AuthSessionService } from '../../services/authentication/auth-session.service';


// Functions Import
// import {getNavi} from '../../functions-files/getFunctions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {

  public navItems = []; //Dynamic

  // public navItems = navItems; //Static

  constructor(private nI: NavItemsService,
    private get: FetchDataService,
    private authService: AuthSessionService) {
   

  }

  ngOnInit() {
    
    this.getNav();
   
  }

  getNav() {
    this.get.getNavi((navItems) => {
      const userRole = this.authService.getRole();
  
      // Filter menu items based on the user's role
      this.navItems = navItems.filter(item => {
        const url = item && item.url;
  
        // Exclude the "Maintenance" menu and its children for roles other than 4
        if (url.startsWith('/maintenance') && userRole !== '4') {
          return false;
        }
  
        // If the menu item has children, filter them based on the user's role
        if (item.children && item.children.length > 0) {
          item.children = item.children.filter(childItem => {
            const childUrl = childItem && childItem.url;
  
            // Exclude the child items under "Maintenance" for roles other than 4
            if (childUrl.startsWith('/maintenance') && userRole !== '4') {
              return false;
            }
  
            // Include all other child items
            return true;
          });
  
          // Include the parent item only if it still has children after filtering
          return item.children.length > 0;
        }
  
        // Include menu items without children
        return true;
      });
  
    });
  }
  
}
