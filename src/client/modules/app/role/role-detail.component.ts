// *****************************************************************************
// Imports
// *****************************************************************************

import { Component }            from '@angular/core';
import { OnInit }               from '@angular/core';
import { OnDestroy }            from '@angular/core';
import { Route }                from '@angular/router';
import { Router }               from '@angular/router';
import { ActivatedRoute }       from '@angular/router';
import { Observable }           from 'rxjs/Observable';

import { Role }                 from './';
import { Resource }             from './';
import { FabrHeader }           from './';
import { OrdrHeader }           from './';
import { FabrHeadersAndValues } from './';
import { OrdrHeadersAndValues } from './';
import { MetaResult }           from './';
import { RoleService }          from './';

// *****************************************************************************
// Component
// *****************************************************************************

@Component({
  selector   : 'dl-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls  : ['./role-detail.component.css'],
})
export class RoleDetailComponent implements OnInit {

  // *****************************************************************************
  // Public properties
  // *****************************************************************************

  err                        : any;
  role                       : Role                 = <Role>{};
  roleCopy                   : Role                 = <Role>{};
  fabrHeaderToBeAdded        : FabrHeader           = '';
  fabrHeaderForValueToBeAdded: FabrHeader           = '';
  fabrValueToBeAdded         : string               = '';
  ordrHeaderToBeAdded        : OrdrHeader           = '';
  ordrHeaderForValueToBeAdded: OrdrHeader           = '';
  ordrValueToBeAdded         : string               = '';
  arrResourcesAll            : Resource[]           = [];
  arrFabrHeadersAll          : FabrHeader[]         = [];
  arrOrdrHeadersAll          : OrdrHeader[]         = [];
  arrResourcesAggregations   : { [strKey: string]: string } = {};

  isUpdate = false;

  // *****************************************************************************
  // Private methods
  // *****************************************************************************

  private _strURLRoles = '/roles';

  // *****************************************************************************
  // Public methods
  // *****************************************************************************

  constructor(
    private _router      : Router,
    private _roleService : RoleService,
    private _routeCurrent: ActivatedRoute,
  ) {}

  // *****************************************************************************

  ngOnInit() {
    this.role       = new Role();
    const objParams = this._routeCurrent.snapshot.params;
    this.isUpdate   = !!objParams['id'];

    if (this.isUpdate) {
      this.doReadRole(objParams['id']);
    }
    this._doReadRoleMeta();
  }

  // *****************************************************************************

  doCreateOrUpdateRole(isReturnActive?: boolean) {
    if (this.isUpdate) {
      this.doUpdateRole(isReturnActive);
    }
    else {
      this.doCreateRole(isReturnActive);
    }
  }

  // *****************************************************************************

  doCreateRole(isReturnActive?: boolean) {
    if (!this.role.isRoleValid()) {
      return;
    }
    isReturnActive = isReturnActive || false;

    this._roleService.createRole(this.role).subscribe(objRole => {
      if (!objRole) {
        console.log('Unhandled error!!!!!');
      }
      if (isReturnActive) {
        return this._router.navigate([this._strURLRoles]);
      }
      if (!isReturnActive && objRole._id) {
        return this._router.navigate([this._strURLRoles, objRole._id]);
      }
    }, err  => this.err  = err);
  }

  // *****************************************************************************

  doReadRole(strID: string) {
    this._roleService.readRole(strID).subscribe(
      objRole_u => {
        this.role     = new Role(objRole_u);
        this.roleCopy = new Role(objRole_u);
      }, err => this.err = err);
  }

  // *****************************************************************************

  doUpdateRole(isReturnActive?: boolean) {
    this._roleService.updateRole(this.role).subscribe(objRole => {
      if (!objRole) {
        console.log('Unhandled error!!!!!');
      }
      if (isReturnActive) {
        return this._router.navigate([this._strURLRoles]);
      }
      if (!isReturnActive && this.role._id) {
        return this._router.navigate([this._strURLRoles, this.role._id]);
      }
    }, err  => this.err  = err);
  }

  // *****************************************************************************

  doDeleteRole() {
    let isDeleteActive = window.confirm('Will you delete the user?');
    if (isDeleteActive) {
      this._roleService.deleteRole(this.role._id).subscribe(
        ()  => this._router.navigate([this._strURLRoles]),
        err => this.err = err
      );
    }
  }

  // *****************************************************************************
  // Fabrication header methods
  // **************************

  doAddFabrHeader() {
    this.role.addFabrHeader(this.fabrHeaderToBeAdded);
    setTimeout(() => this.fabrHeaderToBeAdded = '');
  }

  // *****************************************************************************
  // Fabrication header and value methods
  // ************************************

  doAddFabrHeaderAndValue() {
    const fabrHeader = this.fabrHeaderForValueToBeAdded;
    const fabrValue  = this.fabrValueToBeAdded.trim();
    if (!fabrHeader || !fabrValue) {
      return;
    }

    this.role.addFabrHeaderAndValue(fabrHeader, fabrValue);

    setTimeout(() => {
      this.fabrHeaderForValueToBeAdded = '';
      this.fabrValueToBeAdded          = '';
    });
  }

  // *****************************************************************************

  doAddFabrHeaderAndValueByEnterKey($event: any) {
    if ($event && ($event.which === 13 || $event.keyCode === 13)) {
      $event.preventDefault();
      this.doAddFabrHeaderAndValue();
    }
  }

   // *****************************************************************************
  // Order header methods
  // **************************

  doAddOrdrHeader() {
    this.role.addOrdrHeader(this.ordrHeaderToBeAdded);
    setTimeout(() => this.ordrHeaderToBeAdded = '');
  }

  // *****************************************************************************
  // Order header and value methods
  // ************************************

  doAddOrdrHeaderAndValue() {
    const ordrHeader = this.ordrHeaderForValueToBeAdded;
    const ordrValue  = this.ordrValueToBeAdded.trim();
    if (!ordrHeader || !ordrValue) {
      return;
    }

    this.role.addOrdrHeaderAndValue(ordrHeader, ordrValue);

    setTimeout(() => {
      this.ordrHeaderForValueToBeAdded = '';
      this.ordrValueToBeAdded          = '';
    });
  }

  // *****************************************************************************

  doAddOrdrHeaderAndValueByEnterKey($event: any) {
    if ($event && ($event.which === 13 || $event.keyCode === 13)) {
      $event.preventDefault();
      this.doAddOrdrHeaderAndValue();
    }
  }


  // *****************************************************************************
  // Other public methods
  // ********************

  doResetForm(objForm: any) {
    this.role.resetRole();
    this.fabrHeaderToBeAdded         = '';
    this.fabrHeaderForValueToBeAdded = '';
    this.fabrValueToBeAdded          = '';
    this.ordrHeaderToBeAdded         = '';
    this.ordrHeaderForValueToBeAdded = '';
    this.ordrValueToBeAdded          = '';
    objForm.markAsPristine();
  }

  // *****************************************************************************

  doResetRole() {
    this.role = new Role(this.roleCopy);
  }

  // *****************************************************************************

  hasRoleChanged(): boolean {
    return !this.role.isEqualTo(this.roleCopy);
  }

  // *****************************************************************************
  // Private methods
  // *****************************************************************************

  private _correctRole() {
    if (this.role.isAdmin) {
      this.role.arrResources            = [];
      this.role.arrFabrHeaders          = [];
      this.role.aarFabrHeadersAndValues = {};
      this.role.arrOrdrHeaders          = [];
      this.role.aarOrdrHeadersAndValues = {};
    }
  }

  // *****************************************************************************

  private _doReadRoleMeta() {
    this._roleService
      .readRoleMeta()
      .subscribe((objMeta_u: MetaResult) => {
        this.arrResourcesAll   = objMeta_u.resources;
        this.arrFabrHeadersAll = objMeta_u.fabrHeaders;
        this.arrOrdrHeadersAll = objMeta_u.ordrHeaders;
      });
  }

  // *****************************************************************************
}
