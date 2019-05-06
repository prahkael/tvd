// *****************************************************************************
// Imports
// *****************************************************************************

import { URLSearchParams } from '@angular/http';

// *****************************************************************************
// Request data options class
// *****************************************************************************

export class RequestDataOptions {

  // *****************************************************************************
  // Public properties
  // *****************************************************************************

  strSort       : string;
  strSortDefault: string;
  strSearch     : string;
  numStart      : number;
  numLimit      : number;
  numStartDiff  = 50;

  // *****************************************************************************
  // Private properties
  // *****************************************************************************

  // Public properties
  private _objFilters    : { [strKey: string]: string } = {};

  // *****************************************************************************
  // Public methods
  // *****************************************************************************

  constructor(_strSortDefault?: string) {
    if (_strSortDefault) {
      this.strSortDefault = _strSortDefault;
      this.resetOptions();
    }
  }

  // *****************************************************************************
  // Formats
  // *****************************************************************************

  getRequestFormat() {
    return {
      filters: this._objFilters,
      sort   : this.strSort,
      search : this.strSearch,
      limit  : this.numLimit,
      start  : this.numStart,
    };
  }

  // *****************************************************************************

  getURLFormat() {
    const params  = new URLSearchParams();
    const arrKeys = Object.keys(this._objFilters);

    if (arrKeys.length > 0) {
      arrKeys.forEach(strKey => params.set(strKey, this._objFilters[strKey]));
    }
    if (this.strSort) {
      params.set('sort', this.strSort);
    }
    if (this.strSearch) {
      params.set('search', this.strSearch);
    }
    if (this.numLimit) {
      params.set('limit', this.numLimit + '');
    }
    if (this.numStart) {
      params.set('start', this.numStart + '');
    }

    return params;
  }

  // *****************************************************************************

  resetOptions() {
    this.resetFilters();
    this.resetSort();
    this.resetSearch();
    this.resetStart();
    this.resetLimit();
  }

  // *****************************************************************************
  // Filter methods
  // **************

  getKeysOfFilters() {
    return Object.keys(this._objFilters);
  }

  // *****************************************************************************

  getFilterValue(strKey: string) {
    return this._objFilters[strKey];
  }

  // *****************************************************************************

  setFilter(strFilterKey: string, strFilterValue: string) {
    this._objFilters[strFilterKey] = strFilterValue;
  }

  // *****************************************************************************

  unsetFilter(strKeyForFilter: string) {
    if (this._objFilters[strKeyForFilter]) {
      delete this._objFilters[strKeyForFilter];
    }
  }

  // *****************************************************************************

  unsetAllFilters() {
    Object.keys(this._objFilters).forEach(strKey => delete this._objFilters[strKey]);
  }

  // *****************************************************************************

  resetFilters() {
    this._objFilters = {};
  }

  // *****************************************************************************

  isInFilters(strKey: string): boolean {
    return !!this._objFilters[strKey];
  }

  // *****************************************************************************
  // Sort methods
  // ************

  setSortDefault(strSort: string) {
    this.strSortDefault = strSort;
  }

  // *****************************************************************************

  getSortKey() {
    return this.strSort.replace(/^-/, '');
  }

  // *****************************************************************************

  getSortDirection(): number {
    return (this.strSort + '').indexOf('-') === 0 ? -1 : 1;
  };

  // *****************************************************************************

  toggleSort(strKey?: string) {
    strKey = strKey || this.strSort.replace(/^-/, '');

    const strKeyAsc    = strKey;
    const strKeyDesc   = '-' + strKey;

    if (this.strSort === strKeyDesc) {
      return (this.strSort = strKeyAsc);
    }
    if (this.strSort === strKeyAsc) {
      return (this.strSort = strKeyDesc);
    }
    this.strSort = strKeyAsc;
  }

  // *****************************************************************************

  resetSort() {
    this.strSort = this.strSortDefault;
  }

  // *****************************************************************************

  isSortDefault(): boolean {
    return (this.strSort === this.strSortDefault);
  };

  // *****************************************************************************
  // Search methods
  // **************

  resetSearch() {
    this.strSearch = '';
  }

  // *****************************************************************************
  // Start and limit methods
  // ***********************

  increaseStart() {
    this.numStart += this.numStartDiff;
  }

  // *****************************************************************************

  resetStart() {
    this.numStart = 0;
  }

  // *****************************************************************************

  resetLimit() {
    this.numLimit = this.numStartDiff;
  }

  // *****************************************************************************
}

// *****************************************************************************
