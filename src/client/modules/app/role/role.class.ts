// *****************************************************************************
// Role types
// *****************************************************************************

export const HEADER_ALL          = 'ALL';
export type Resource             = string;
export type FabrHeader           = string;
export type OrdrHeader           = string;
export type FabrHeadersAndValues = { [strKey: string]: string[] };
export type OrdrHeadersAndValues = { [strKey: string]: string[] };
export type MetaResult           = {
  fabrHeaders: FabrHeader[],
  ordrHeaders: OrdrHeader[],
  resources  : string[]
};

// *****************************************************************************
// Role class
// *****************************************************************************

export class Role {

  // *****************************************************************************
  // Private properties
  // *****************************************************************************

  private _isAdmin = false;

  // *****************************************************************************
  // Public properties
  // *****************************************************************************

  readonly _id               : string;
  strName                    : string;
  arrResources               : Resource[];
  arrFabrHeaders             : FabrHeader[];
  arrOrdrHeaders             : OrdrHeader[];
  aarFabrHeadersAndValues    : FabrHeadersAndValues;
  aarOrdrHeadersAndValues    : OrdrHeadersAndValues;

  // *****************************************************************************
  // Public methods
  // *****************************************************************************

  constructor(objRole?: any) {
    this.resetRole();
    let strName, isAdmin, arrResources, arrFabrHeaders, arrOrdrHeaders, aarFabrHeadersAndValues, aarOrdrHeadersAndValues;

    if (!objRole) {
      return;
    }
    if (objRole._id) {
      this._id = objRole._id;
    }
    if ((strName = objRole.strName || objRole.name)) {
      this.strName = strName;
    }
    if (objRole.isAdmin) {
      this.isAdmin = objRole.isAdmin;
    }
    if ((arrResources = objRole.arrResources || objRole.resources) &&
        arrResources &&
        arrResources.length > 0) {
      this.arrResources = Object.assign([], arrResources);
    }
    if ((arrFabrHeaders = objRole.arrFabrHeaders || objRole.fabrHeaders) &&
        arrFabrHeaders &&
        arrFabrHeaders.length > 0) {
      this.arrFabrHeaders = Object.assign([], arrFabrHeaders);
    }
    if ((arrOrdrHeaders = objRole.arrOrdrHeaders || objRole.ordrHeaders) &&
        arrOrdrHeaders &&
        arrOrdrHeaders.length > 0) {
      this.arrOrdrHeaders = Object.assign([], arrOrdrHeaders);
    }
    if ((aarFabrHeadersAndValues =
        objRole.aarFabrHeadersAndValues ||
        objRole.fabrHeadersAndValues) &&
        aarFabrHeadersAndValues &&
        aarFabrHeadersAndValues instanceof Object &&
        Object.keys(aarFabrHeadersAndValues).length > 0) {
      this.aarFabrHeadersAndValues = Object.assign({}, aarFabrHeadersAndValues);
    }
    if ((aarOrdrHeadersAndValues =
      objRole.aarOrdrHeadersAndValues ||
      objRole.ordrHeadersAndValues) &&
      aarOrdrHeadersAndValues &&
      aarOrdrHeadersAndValues instanceof Object &&
      Object.keys(aarOrdrHeadersAndValues).length > 0) {
    this.aarOrdrHeadersAndValues = Object.assign({}, aarOrdrHeadersAndValues);
  }
  }

  // *****************************************************************************

  get isAdmin() {
    return this._isAdmin;
  }

  set isAdmin(_isAdmin: boolean) {
    this._isAdmin = _isAdmin;
    this._correctRole();
  }

  // *****************************************************************************

  getRequestFormat() {
    const objRequest: any = {
      name   : this.strName,
      isAdmin: this.isAdmin
    };
    if (this._id) {
      objRequest._id = this._id;
    }
    if (!this.isAdmin) {
      objRequest.resources            = this.arrResources;
      objRequest.fabrHeaders          = this.arrFabrHeaders;
      objRequest.ordrHeaders          = this.arrOrdrHeaders;
      objRequest.fabrHeadersAndValues = this.aarFabrHeadersAndValues
      objRequest.ordrHeadersAndValues = this.aarOrdrHeadersAndValues;
    }
    return objRequest;
  }

  // *****************************************************************************

  resetRole() {
    this.strName = '';
    this.isAdmin = false;
    this.removeAllResources();
    this.removeAllFabrHeaders();
    this.removeAllOrdrHeaders();
    this.removeAllHeadersAndValues();
  }

  // *****************************************************************************

  isRoleValid() {
    const hasName = !!this.strName;
    return hasName;
  }

  // *****************************************************************************

  isEqualTo(role: Role): boolean {
    const areNamesEqual =
        this.strName === role.strName;
    const areAdminsEqual =
        this.isAdmin === role.isAdmin;
    const areArrResourcesEqual =
        JSON.stringify(this.arrResources) ===
        JSON.stringify(role.arrResources);
    const areArrFabrHeadersEqual =
        JSON.stringify(this.arrFabrHeaders) ===
        JSON.stringify(role.arrFabrHeaders);
    const areArrOrdrHeadersEqual =
        JSON.stringify(this.arrOrdrHeaders) ===
        JSON.stringify(role.arrOrdrHeaders);
    const areAarFabrHeadersAndValues =
        JSON.stringify(this.aarFabrHeadersAndValues) ===
        JSON.stringify(role.aarFabrHeadersAndValues);
    const areAarOrdrHeadersAndValues =
        JSON.stringify(this.aarOrdrHeadersAndValues) ===
        JSON.stringify(role.aarOrdrHeadersAndValues);

    return (
      areNamesEqual              &&
      areAdminsEqual             &&
      areArrResourcesEqual       &&
      areArrFabrHeadersEqual     &&
      areArrOrdrHeadersEqual     &&
      areAarFabrHeadersAndValues &&
      areAarOrdrHeadersAndValues &&
    true);
  }

  // *****************************************************************************
  // Resource methods
  // ****************

  toggleResource(resource: Resource) {
    const numIndex = this.arrResources.indexOf(resource);

    if (numIndex >= 0) {
      this.arrResources.splice(numIndex, 1);
    } else {
      this.arrResources.push(resource);
    }
  }

  // *****************************************************************************

  removeAllResources() {
    this.arrResources = <Resource[]>[];
  }

  // *****************************************************************************

  isResourceInRole(resource: Resource): boolean {
    return this.arrResources.indexOf(resource) >= 0;
  }

  // *****************************************************************************
  // Fabrication header methods
  // **************************

  addFabrHeader(fabrHeader: FabrHeader) {
    if (this.arrFabrHeaders.indexOf(fabrHeader) < 0) {
      this.arrFabrHeaders.push(fabrHeader);
    }
  }

  // *****************************************************************************

  removeFabrHeader(fabrHeader: FabrHeader) {
    this.arrFabrHeaders.splice(this.arrFabrHeaders.indexOf(fabrHeader), 1);
  }

  // *****************************************************************************

  removeAllFabrHeaders() {
    this.arrFabrHeaders = <FabrHeader[]>[];
  }

  // *****************************************************************************

  isFabrHeaderInRole(fabrHeader: FabrHeader) {
    return this.arrFabrHeaders.indexOf(fabrHeader) >= 0;
  }

  // *****************************************************************************
  // Fabrication header and value methods
  // ************************************

  getFabrHeadersOfValues() {
    return Object.keys(this.aarFabrHeadersAndValues);
  }

  // *****************************************************************************

  addFabrHeaderAndValue(fabrHeader: FabrHeader, fabrValue: string) {
    fabrHeader = fabrHeader || HEADER_ALL;

    if (!this.aarFabrHeadersAndValues[fabrHeader]) {
      this.aarFabrHeadersAndValues[fabrHeader] = [];
    }
    if (this.aarFabrHeadersAndValues[fabrHeader].indexOf(fabrValue) < 0) {
      this.aarFabrHeadersAndValues[fabrHeader].push(fabrValue);
    }
  }

  // *****************************************************************************

  removeFabrHeaderAndValue(fabrHeader: FabrHeader, fabrValue: string) {
    if (!this.aarFabrHeadersAndValues[fabrHeader]) {
      return;
    }
    const numIndex = this.aarFabrHeadersAndValues[fabrHeader].indexOf(fabrValue);
    if (numIndex >= 0) {
      this.aarFabrHeadersAndValues[fabrHeader].splice(numIndex, 1);
    }
    if (this.aarFabrHeadersAndValues[fabrHeader].length === 0) {
      delete this.aarFabrHeadersAndValues[fabrHeader];
    }
  }

  // *****************************************************************************
  // Order header methods
  // **************************

  addOrdrHeader(ordrHeader: OrdrHeader) {
    if (this.arrOrdrHeaders.indexOf(ordrHeader) < 0) {
      this.arrOrdrHeaders.push(ordrHeader);
    }
  }

  // *****************************************************************************

  removeOrdrHeader(ordrHeader: OrdrHeader) {
    this.arrOrdrHeaders.splice(this.arrOrdrHeaders.indexOf(ordrHeader), 1);
  }

  // *****************************************************************************

  removeAllOrdrHeaders() {
    this.arrOrdrHeaders = <OrdrHeader[]>[];
  }

  // *****************************************************************************

  isOrdrHeaderInRole(ordrHeader: OrdrHeader) {
    return this.arrOrdrHeaders.indexOf(ordrHeader) >= 0;
  }

  // *****************************************************************************
  // Order header and value methods
  // ************************************

  getOrdrHeadersOfValues() {
    return Object.keys(this.aarOrdrHeadersAndValues);
  }

  // *****************************************************************************

  addOrdrHeaderAndValue(ordrHeader: OrdrHeader, ordrValue: string) {
    ordrHeader = ordrHeader || HEADER_ALL;

    if (!this.aarOrdrHeadersAndValues[ordrHeader]) {
      this.aarOrdrHeadersAndValues[ordrHeader] = [];
    }
    if (this.aarOrdrHeadersAndValues[ordrHeader].indexOf(ordrValue) < 0) {
      this.aarOrdrHeadersAndValues[ordrHeader].push(ordrValue);
    }
  }

  // *****************************************************************************

  removeOrdrHeaderAndValue(ordrHeader: OrdrHeader, ordrValue: string) {
    if (!this.aarOrdrHeadersAndValues[ordrHeader]) {
      return;
    }
    const numIndex = this.aarOrdrHeadersAndValues[ordrHeader].indexOf(ordrValue);
    if (numIndex >= 0) {
      this.aarOrdrHeadersAndValues[ordrHeader].splice(numIndex, 1);
    }
    if (this.aarOrdrHeadersAndValues[ordrHeader].length === 0) {
      delete this.aarOrdrHeadersAndValues[ordrHeader];
    }
  }

  // *****************************************************************************

  removeAllHeadersAndValues() {
    this.aarFabrHeadersAndValues = <FabrHeadersAndValues>{};
    this.aarOrdrHeadersAndValues = <OrdrHeadersAndValues>{};
  }

  // *****************************************************************************
  // Private methods
  // *****************************************************************************

  private _correctRole() {
    if (this.isAdmin) {
      this.removeAllResources();
      this.removeAllFabrHeaders();
      this.removeAllFabrHeaders();
      this.removeAllHeadersAndValues();
    }
  }

  // *****************************************************************************
}

// *****************************************************************************
