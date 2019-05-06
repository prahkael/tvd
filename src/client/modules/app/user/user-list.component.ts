// *****************************************************************************
// Imports
// *****************************************************************************

import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Observable';

import { User }        from './';
import { UserService } from './';
import { Role }        from '../role';

// *****************************************************************************
// Component
// *****************************************************************************

@Component({
  selector   : 'dl-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  arrUsers: User[];
  strError: string;

  // *****************************************************************************
  // Public properties
  // *****************************************************************************

  err      : Error;
  aarRoles = <Role>{};

  // *****************************************************************************
  // Public methods
  // *****************************************************************************

  constructor(
    private _userService: UserService,
  ){}

  // *****************************************************************************

  ngOnInit() {
    this.doReadUserMeta();
    this.doReadUsers();
  }

  // *****************************************************************************
  // CRUD methods
  // ************

  doReadUsers() {
    this._userService.readUsers().subscribe(
      arrUsers => this.arrUsers = arrUsers,
      strError => this.strError = strError
    );
  }

  // *****************************************************************************

  doDeleteUser(userId: string) {
    let isDeleteActive = window.confirm('Do you really want to delete the user?');
    if (isDeleteActive) {
      this._userService.deleteUser(userId).subscribe(
        ()              => this.doReadUsers(),
        (strError: any) => this.strError = strError
      );
    }
  }

  // *****************************************************************************
  // Misc methods
  // ************
    
  doReadUserMeta() {
    this._userService.readUserMeta().subscribe((objMeta_u: any) =>
          objMeta_u &&
          objMeta_u.roles &&
          objMeta_u.roles.forEach &&
          objMeta_u.roles.forEach((objRole: any) => {
            if (!objRole || !objRole._id) {
              return 'undefined';
            }
            this.aarRoles[objRole._id] = new Role(objRole) || []
          }),
      (err: any) => this.err = err
    );
  }

  // *****************************************************************************
}
