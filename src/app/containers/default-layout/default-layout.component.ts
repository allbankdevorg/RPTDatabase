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
   
    // console.log(this.orgData);
  }

  getNav() {
    this.get.getNavi((navItems) => {
      const userRole = this.authService.getRole();
      // console.log('User Role:', userRole);
  
      // Filter menu items based on the user's role
      this.navItems = navItems.filter(item => {
        const url = item && item.url;
        // console.log(url);
  
        // Exclude the "Maintenance" menu and its children for roles other than 4
        if (url.startsWith('/maintenance') && userRole !== '4') {
          // console.log('Excluding Maintenance for User Role:', userRole);
          return false;
        }
  
        // If the menu item has children, filter them based on the user's role
        if (item.children && item.children.length > 0) {
          item.children = item.children.filter(childItem => {
            const childUrl = childItem && childItem.url;
            // console.log(childUrl);
  
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
  
      // console.log(this.navItems);
    });
  }
  
  
  
  
  
  
 

  
  // getNav() {
  //   this.get.getNavi((navItems) => {
  //     const userRole = this.authService.getRole();
  //     console.log(userRole);
  //     // Define that only role 4 is allowed for the Maintenance menu
  //     const allowedRoles = {
  //       '/maintenance': [4],
  //       // Add more mappings as needed
  //     };
  
  //     // Filter menu items based on the user's role and allowed roles
  //     this.navItems = navItems.filter(item => {
  //       const url = item && item.url;
  //       const allowedRolesForItem = allowedRoles[url] || [];
  
  //       // If the URL is '/maintenance' or has children, include it only for role 4
  //       const isRoleAllowed = allowedRolesForItem.length === 0 || allowedRolesForItem.includes(userRole);
        
  //       return isRoleAllowed;
  //     });
  
  //     console.log(this.navItems);
  //   });
  // }
  


  // getNav() {
  //   this.get.getNavi((navItems) => {
  //     // Process the data to count directors related to each company
        

  //       // Set the data source for your MatTable
  //       const navLink = navItems;
  //       this.navItems = navItems
  //       // console.log(navLink);
   

      
  //     });
  // }

  

  
}
