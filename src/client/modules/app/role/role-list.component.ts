// *****************************************************************************
// Imports
// *****************************************************************************

import { Component }  from '@angular/core';
import { OnInit }     from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Role }        from './';
import { RoleService } from './';

// *****************************************************************************
// Component
// *****************************************************************************

@Component({
  selector   : 'dl-role-list',
  templateUrl: './role-list.component.html',
  styleUrls  : ['./role-list.component.css'],
})
export class RoleListComponent implements OnInit {

  // *****************************************************************************
  // Public properties
  // *****************************************************************************

  err     : Error;
  arrRoles: Role[] = <Role[]>[];

  // *****************************************************************************
  // Public methods
  // *****************************************************************************

  constructor(
    private _roleService: RoleService
  ){}

  // *****************************************************************************
  // Private methods
  // *****************************************************************************

  ngOnInit() {
    this.doReadRoles();
  }

  // *****************************************************************************

  doReadRoles() {
    this._roleService.readRoles().subscribe(
      arrRoles_u => this.arrRoles = arrRoles_u && arrRoles_u.map(objRole_u => (new Role(objRole_u))),
      err        => this.err      = err,
    );
  }

  // *****************************************************************************

  doDeleteRole(strRoleID: String) {
    let isDeleteActive = window.confirm('Will you delete the user?');
    if (isDeleteActive) {
      this._roleService.deleteRole(strRoleID).subscribe(
        ()  => this.doReadRoles(),
        err => this.err = err
      );
    }
  }

  // *****************************************************************************

  getKeysOfAar(objAar: any) {
    objAar = objAar || {};
    return Object.keys(objAar);
  }

  // *****************************************************************************
}
