// *****************************************************************************
// Imports
// *****************************************************************************

import { Component, HostListener } from '@angular/core';
import { OnInit }                  from '@angular/core';
import { OnDestroy }               from '@angular/core';
import { Inject }                  from '@angular/core';
import { TranslateService }        from '@ngx-translate/core';

import { Order }                   from '.';
import { OrderService }            from '.';
import { RequestDataOptions }      from '../shared';
import { LoadingSpinnerService }   from '../shared';
import { Role }                    from '../app/role';
import { OrdrHeader }              from '../app/role';
import { OrdrHeadersAndValues }    from '../app/role';

// *****************************************************************************
// Local variables
// *****************************************************************************

const objTranslationsDE: any = require('../../../assets/i18n/de-DE.yaml');
const objTranslationsTR: any = require('../../../assets/i18n/tr-TR.yaml');
const PRIORITIES             = ['immediate', 'major', 'average', 'minor']

// *****************************************************************************
// Local types
// *****************************************************************************

type objOrdrHeadersData = { primary: string[], secondary: string[], all: string[] };
type tPriority          = { [orderId: string]: string };

// *****************************************************************************
// Component
// *****************************************************************************

@Component({
  selector   : 'dl-order-list',
  templateUrl: './order-list.pug',
  styleUrls  : ['./order-list.css']
})
export class OrderListComponent implements OnInit, OnDestroy {

  // *****************************************************************************
  // public properties
  // *****************************************************************************

  strError               : string;
  arrOrdrs               : Order[] = [];
  arrOrdrsOpen           : number[]      = [];
  arrOrdrHeaders         : string[]      = [];
  arrOrdrHeadersPrimary  : string[]      = [];
  arrOrdrHeadersSecondary: string[]      = [];
  aarOrdrFilters         : any           = {};
  aarPrioritiesSelected  : tPriority     = {};
  strSearch                              = '';
  hasNoMoreRows                          = true;
  arrPriorities                          = PRIORITIES;
  strPriorityDefault                     = PRIORITIES[3];
  strPrioritySelectorOpen: string        = null;
  isFastFilterOpen                       = false;

  arrOrdrHeadersToExclude               = <OrdrHeader[]>[];
  aarOrdrHeadersAndValuesToFilterBy     = <OrdrHeadersAndValues>{};
  arrKeysOrdrHeadersAndValuesToFilterBy = <OrdrHeader[]>[];
  aarOrdrSidebarFilters                 = <{ [key: string]: string[] }>{};
  arrOrdrSidebarFilters                 = <string[]>[];

  // *****************************************************************************
  // Private properties
  // *****************************************************************************

  private _requestDataOptions: RequestDataOptions;
  private _timeoutRefresh    : any;
  private _intervalRefresh   : any;
  private _isAutoloadActive  : boolean;
  private _isLoading         = false;

  // *****************************************************************************
  // Public methods
  // *****************************************************************************

  constructor(
    private _orderService: OrderService,
    private _translateService  : TranslateService,
    @Inject('OMP_SETTINGS') public settings: any,
  ) {
    this._requestDataOptions = new RequestDataOptions();

    // set the translation object initially
    this._translateService.setTranslation('de', objTranslationsDE);
    this._translateService.setTranslation('tr', objTranslationsTR);

    // this language will be used as a fallback when a translation isn't found in the current language
    this._translateService.setDefaultLang('de');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this._translateService.use('de');
  }

  // *****************************************************************************

  ngOnInit() {
    this.doReadOrderHeaders();
    this.doReadOrderFilters();
    this._requestDataOptions.setSortDefault(this.settings.orders.sortDefault);
    this.doRefreshOrders();
    this._initScrollEvent();
    this._loadOrdrHeadersToExclude();
    this._loadOrdrHeadersAndValuesToFilterBy();
    this._startInterval();

    setTimeout(() => {
      this._isAutoloadActive = localStorage.isAutoloadActive === 'true';
    });
  }

  // *****************************************************************************

  ngOnDestroy() {
    clearTimeout(this._timeoutRefresh);
    clearInterval(this._intervalRefresh);
  }

  // *****************************************************************************

  getPriority(orderId: string) {
    return this.aarPrioritiesSelected[orderId] || this.strPriorityDefault;
  }

  // *****************************************************************************

  setPriority(orderId: string, prio: string) {
    console.log(`::: orderId: `, orderId);
    console.log(`::: prio: `, prio);
    if (this.aarPrioritiesSelected[orderId] && this.strPriorityDefault === prio) {
      delete this.aarPrioritiesSelected[orderId];
    }
    else if (this.strPriorityDefault !== prio) {
      this.aarPrioritiesSelected[orderId] = prio;
    }

    console.log(`::: this.aarPrioritiesSelected[orderId]: `, this.aarPrioritiesSelected[orderId]);
  }

  // *****************************************************************************

  @HostListener('document:click', ['$event'])
  togglePrioritySelector(event: Event, orderId?: string) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!orderId) {
      this.strPrioritySelectorOpen = null;
      return;
    }

    if (this.strPrioritySelectorOpen === orderId) {
      this.strPrioritySelectorOpen = null;
    } else {
      this.strPrioritySelectorOpen = orderId;
    }
  }

  // *****************************************************************************

  doReadOrders(withDebounceTime = false) {
    this._isLoading       = true;
    this.isFastFilterOpen = false;
    return this._orderService
      .readOrders(this._requestDataOptions)
      .debounceTime(withDebounceTime ? 300 : 0)
      .subscribe(
        this._doReadOrdersSuccess.bind(this),
        this._doReadOrdersError.bind(this)
      );
  }

  // *****************************************************************************

  doReadOrderHeaders() {
    this._isLoading = true;
    return this._orderService
      .readOrderHeaders()
      .subscribe(
        this._doReadOrderHeadersSuccess.bind(this),
        this._doReadOrdersError.bind(this)
      );
  }

  // *****************************************************************************

  doReadOrderFilters() {
    this._isLoading = true;
    return this._orderService
      .readOrderFilters()
      .subscribe(
        this._doReadOrderFiltersSuccess.bind(this),
        this._doReadOrdersError.bind(this)
      );
  }

  // *****************************************************************************

  doReadOrdersToAdd() {
    this._requestDataOptions.increaseStart()
    this.doReadOrders();
  }

  // *****************************************************************************

  doReadOrdersWithSearch(strSearch: string) {
    this.strSearch = strSearch;
    this._requestDataOptions.resetStart();
    this._requestDataOptions.strSearch = strSearch;
    this.doToggleAllOrders(false);
    this.doReadOrders(true)
  }

  // *****************************************************************************

  doRefreshOrders() {
    this.strSearch = '';
    this._requestDataOptions.resetOptions();
    this.doToggleAllOrders(false);
    this.doReadOrders();
  }

  // *****************************************************************************

  set isAutoloadActive(isActive: boolean) {
    this._isAutoloadActive        = isActive;
    localStorage.isAutoloadActive = isActive;
  }

  // *****************************************************************************

  get isAutoloadActive(): boolean {
    return this._isAutoloadActive;
  }

  // *****************************************************************************
  // Fast filters
  // ************

  doToggleFastFilters() {

  }

  // *****************************************************************************
  // Display methods
  // ***************

  doToggleOpenOrder(numIndexOpen: number) {
    const numIndex = this.arrOrdrsOpen.indexOf(numIndexOpen);
    if (numIndex >= 0) {
      this.arrOrdrsOpen.splice(numIndex, 1);
    } else {
      this.arrOrdrsOpen.push(numIndexOpen);
    }
  }

  // *****************************************************************************

  doToggleAllOrders(isOpen: boolean) {
    this.arrOrdrsOpen = isOpen ? Object.keys(this.arrOrdrs).map(s => +s) : [];
  }

  // *****************************************************************************

  isOrderOpen(numIndex: number): boolean {
    return this.arrOrdrsOpen.indexOf(numIndex) >= 0;
  }

  // *****************************************************************************
  // Filter methods
  // **************

  doGetFilterValue(strKey: string) {
    return this._requestDataOptions.getFilterValue(strKey);
  };

  // *****************************************************************************

  doGetKeysForFilters() {
    return this._requestDataOptions.getKeysOfFilters();
  }

  // *****************************************************************************

  doSetFilter($event: Event, strFilterKey: string, strFilterValue: string) {
    $event.stopPropagation();
    this._requestDataOptions.resetStart();
    this._requestDataOptions.resetSort();
    this._requestDataOptions.resetLimit();
    this._requestDataOptions.setFilter(strFilterKey, strFilterValue);
    this.doToggleAllOrders(false);
    this.doReadOrders();
  }

  // *****************************************************************************

  doUnsetFilter(strKey: string) {
    this._requestDataOptions.unsetFilter(strKey);
    this._requestDataOptions.resetStart();
    this.doToggleAllOrders(false);
    this.doReadOrders();
  }

  // *****************************************************************************

  doUnsetAllFilters() {
    this.doToggleAllOrders(false);
    this._requestDataOptions.resetStart();
    this._requestDataOptions.unsetAllFilters();
    this.doReadOrders();
  }

  // *****************************************************************************

  isInFilters(strKey: string): boolean {
    return this._requestDataOptions.isInFilters(strKey);
  }

  // *****************************************************************************

  isFilterSecondaryKey(): boolean {
    return this._requestDataOptions.getKeysOfFilters().filter(strKey =>
        this.arrOrdrHeadersSecondary.indexOf(strKey) >= 0).length > 0;
  }

  // *****************************************************************************
  // Special filter methods
  // **********************

  doSetSpecialFilterKey(strKey: string) {

  }

  // *****************************************************************************

  doUnsetAllSpecialFilters() {

  }

  // *****************************************************************************
  // Sort methods
  // ************

  doGetSortKey() {
    return this._requestDataOptions.getSortKey();
  }

  // *****************************************************************************

  doGetSortDirection() {
    return this._requestDataOptions.getSortDirection();
  }

  // *****************************************************************************

  doToggleSort(strKey?: string) {
    this._requestDataOptions.resetStart();
    this._requestDataOptions.toggleSort(strKey);
    this.doToggleAllOrders(false);
    this.doReadOrders();
  }

  // *****************************************************************************

  doResetSort() {
    this._requestDataOptions.resetSort();
    this.doRefreshOrders();
  }

  // *****************************************************************************

  isSortSecondaryKey(): boolean {
    const strSortKey = this._requestDataOptions.getSortKey();
    return (this.arrOrdrHeadersSecondary.indexOf(strSortKey) >= 0);
  }

  // *****************************************************************************

  isSortKeyEqual(strSortKey: string) {
    return strSortKey === this._requestDataOptions.strSort;
  }

  // *****************************************************************************

  isSortDefault() {
    return this._requestDataOptions.isSortDefault();
  }

  // *****************************************************************************
  // Search methods
  // **************

  doResetSearch() {
    this.strSearch = '';
    this._requestDataOptions.resetStart();
    this._requestDataOptions.resetSearch();
    this.doReadOrders();
  }

  // *****************************************************************************

  isSearchActive() {
    return this._requestDataOptions.strSearch.trim() !== '';
  }

  // *****************************************************************************

  isSearchKeyInValue(strValue: string): boolean {
    if (!this.strSearch) {
      return;
    }

    return strValue.toLowerCase().indexOf(this.strSearch.toLowerCase()) >= 0;
  }

  // *****************************************************************************
  // Private methods
  // *****************************************************************************

  private _doReadOrdersSuccess(objResult: { data: Order[], meta: any }) {
    const arrOrdrs  = objResult.data || [];
    const objMeta_u = objResult.meta || {};

    if (this._requestDataOptions.numStart > 0) {
      this.arrOrdrs.push.apply(this.arrOrdrs, arrOrdrs);
    } else {
      this.arrOrdrs = arrOrdrs;
    }

    this.hasNoMoreRows = objMeta_u.hasNoMoreRows;
    this._isLoading    = false;
    this._readSidebarFilters();
  }

  // *****************************************************************************

  private _doReadOrderHeadersSuccess(objResult: { data: objOrdrHeadersData, meta: any }) {
    this.arrOrdrHeadersPrimary   = objResult.data.primary;
    this.arrOrdrHeadersSecondary = objResult.data.secondary;
    this.arrOrdrHeaders          = objResult.data.all;
  }

  // *****************************************************************************

  private _doReadOrderFiltersSuccess(objResult: { data: any, meta: any }) {
    this.aarOrdrFilters = objResult.data;
  }

  // *****************************************************************************

  private _doReadOrdersError(strError: string) {
    this.strError   = strError;
    this._isLoading = false;
  }

  // *****************************************************************************

  private _readSidebarFilters() {
    const arrSidebarFilters = <string[]>[
      'machineGroup',
    ];

    this.arrOrdrs.forEach((order: Order) => {
      arrSidebarFilters.forEach(strFilter => {
        if (!this.aarOrdrSidebarFilters[strFilter]) {
          this.aarOrdrSidebarFilters[strFilter] = [];
        }
        if (this.aarOrdrSidebarFilters[strFilter].indexOf(order[strFilter]) < 0) {
          this.aarOrdrSidebarFilters[strFilter].push(order[strFilter]);
        }
      });
    });

    this.arrOrdrSidebarFilters = Object.keys(this.aarOrdrSidebarFilters);
  }

  // *****************************************************************************

  private _initScrollEvent() {
    const self = this;

    return window.addEventListener('scroll', event => {
      const numHeightWindow = window.innerHeight;
      const elScrollEnd     = document.getElementById('order-list-scroll-end');
      const numScrollLimit  = elScrollEnd && elScrollEnd.getBoundingClientRect().top;

      if (self.isAutoloadActive &&
          !self._isLoading &&
          !this.hasNoMoreRows &&
          elScrollEnd &&
          numScrollLimit < numHeightWindow) {
        self.doReadOrdersToAdd();
      }
    });
  }

  // *****************************************************************************

  private _loadOrdrHeadersToExclude() {
    const strRole                = localStorage.role || '{}';
    const role: Role             = new Role(JSON.parse(strRole));
    this.arrOrdrHeadersToExclude = role.arrOrdrHeaders || [];
  }

  // *****************************************************************************

  private _loadOrdrHeadersAndValuesToFilterBy() {
    const strRole                              = localStorage.role || '{}';
    const role: Role                           = new Role(JSON.parse(strRole));
    this.aarOrdrHeadersAndValuesToFilterBy     = role.aarOrdrHeadersAndValues || {};
    this.arrKeysOrdrHeadersAndValuesToFilterBy = Object.keys(role.aarOrdrHeadersAndValues);
  }

  // *****************************************************************************

  private _startInterval() {
    const numTimeGap      = 5 * 1000;
    const numTimeNextHour = Math.floor(((new Date()).getTime() + numTimeGap) / 1000) * 1000;
    const numTimeInt      = 1000 * 60 + numTimeGap;
    const numTimeToStart  = numTimeNextHour + numTimeGap;

    this._timeoutRefresh = setTimeout(() => {
      this.doReadOrders();
      this._intervalRefresh = setInterval(() => {
        this.doReadOrders();
      }, numTimeInt);
    }, numTimeToStart);
  }

  // *****************************************************************************
}

// *****************************************************************************
