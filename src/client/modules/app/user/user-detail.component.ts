// *****************************************************************************
// Imports
// *****************************************************************************

import { Component }      from '@angular/core';
import { OnInit }         from '@angular/core';
import { OnDestroy }      from '@angular/core';
import { Router }         from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable }     from 'rxjs/Observable';
import { User }           from './';
import { UserService }    from './';
import { Role }           from '../role';

// *****************************************************************************
// Component
// *****************************************************************************

@Component({
  selector: 'dl-user-detail',
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {

  // *****************************************************************************
  // Public properties
  // *****************************************************************************

  err     : Error;
  user    : User    = <User>{};
  arrRoles: Role[]  = <Role[]>[];
  isCopied: boolean = false;
  isUpdate: boolean = false;

  // *****************************************************************************
  // Public properties
  // *****************************************************************************

  private _err           : any;
  private _subRouteParams: any;

  // *****************************************************************************
  // Functions
  // *****************************************************************************

  constructor(
    private _userService : UserService,
    private _router      : Router,
    private _routeCurrent: ActivatedRoute,
  ){}

  // *****************************************************************************

  ngOnInit() {
    this.user       = new User();
    const objParams = this._routeCurrent.snapshot.params;
    this.isUpdate   = !!objParams['id'];
    this.doReadUserMeta();
    
    if (this.isUpdate) {
      this.doReadUser(objParams['id']);
    }
  }

  // *****************************************************************************
  // CRUD Methods
  // ************

  doReadUser(userId: string) {
    this._userService.readUser(userId).subscribe(
      user => this.user = new User(user),
      err  => this._err = err
    );
  }

  // *****************************************************************************

  doCreateUser(user: User, isReturnActive = false) {
    this._userService.createUser(user).subscribe(
      this._handleSubscription('user', isReturnActive).bind(this),
      this._handleSubscription('_err', false).bind(this)
    );
  }

  // *****************************************************************************

  doUpdateUser(user: User, isReturnActive = false) {
    this._userService.updateUser(user).subscribe(
      this._handleSubscription('user', isReturnActive).bind(this),
      this._handleSubscription('_err', false).bind(this)
    );
  }

  // *****************************************************************************

  doDeleteUser(userId: string) {
    let isDeleteActive = window.confirm('Will you delete the user?');
    if (isDeleteActive) {
      this._userService.deleteUser(userId).subscribe(
        this._handleSubscription(null, true).bind(this),
        this._handleSubscription('_err', false).bind(this)
      );
    }
  }

  // *****************************************************************************
  // Misc methods
  // ************
    
  doReadUserMeta() {
    this._userService.readUserMeta().subscribe((objMeta_u: any) => this.arrRoles =
          objMeta_u &&
          objMeta_u.roles &&
          objMeta_u.roles.map &&
          objMeta_u.roles.map((objRole: any) => new Role(objRole)) ||
          [],
      (err: any) => this.err = err
    );
  }

  // *****************************************************************************

  generatePassword() {
    let length  = 8;
    let retVal  = "";
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    this.isCopied = false;
    this.user.password = retVal;
  }

  // *****************************************************************************
  // Private methods
  // *****************************************************************************

  private _handleSubscription(field: string, isReturnActive: boolean) {
    return function(objUserOrErr: any) {
      if (field) {
        this[field] = objUserOrErr;
        this.isCopied = false;
        this.user.password = '';
      }
      if (this.isUpdate && isReturnActive) {
        this._router.navigate(['/users']);
      }
      else if (!this.isUpdate && !isReturnActive && objUserOrErr._id) {
        return this._router.navigate(['/users/', objUserOrErr._id]);
      }
    }
  }

  // *****************************************************************************
}
