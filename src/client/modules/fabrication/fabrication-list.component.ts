// *****************************************************************************
// Imports
// *****************************************************************************

import { Component}              from '@angular/core';
import { HostListener }          from '@angular/core';
import { OnInit }                from '@angular/core';
import { OnDestroy }             from '@angular/core';
import { Inject }                from '@angular/core';
import { TranslateService }      from '@ngx-translate/core';

import { Fabrication }           from './';
import { FabricationService }    from './';
import { RequestDataOptions }    from '../shared';
import { LoadingSpinnerService } from '../shared';
import { Role }                  from '../app/role';
import { FabrHeader }            from '../app/role';
import { FabrHeadersAndValues }  from '../app/role';

// *****************************************************************************
// Local variables
// *****************************************************************************

const objTranslationsDE: any = require('../../../assets/i18n/de-DE.yaml');
const objTranslationsTR: any = require('../../../assets/i18n/tr-TR.yaml');
const PRIORITIES             = ['immediate', 'major', 'average', 'minor']

// *****************************************************************************
// Local types
// *****************************************************************************

type objFabrHeadersData = { primary: string[], secondary: string[], all: string[] };
type tPriority          = { [orderId: string]: string };

// *****************************************************************************
// Component
// *****************************************************************************

@Component({
  selector   : 'dl-fabrication-list',
  templateUrl: './fabrication-list.pug',
  styleUrls  : ['./fabrication-list.css']
})
export class FabricationListComponent implements OnInit, OnDestroy {

  // *****************************************************************************
  // public properties
  // *****************************************************************************

  strError               : string;
  arrFabrs               : Fabrication[] = [];
  arrFabrsOpen           : number[]      = [];
  arrFabrHeaders         : string[]      = [];
  arrFabrHeadersPrimary  : string[]      = [];
  arrFabrHeadersSecondary: string[]      = [];
  aarFabrFilters         : any           = {};
  aarFabrMeta            : any           = {};
  aarPrioritiesSelected  : tPriority     = {};
  strSearch                              = '';
  hasNoMoreRows                          = true;
  arrPriorities          : Array<string> = [];
  strPriorityDefault     : string        = null;
  strPrioritySelectorOpen: string        = null;
  isFastFilterOpen                       = false;
  aarFabrMetaCommentTmp  : any           = {};
  aarFabrMetaCommentTmpRows: any         = {};

  arrFabrHeadersToExclude                = <FabrHeader[]>[];
  aarFabrHeadersAndValuesToFilterBy      = <FabrHeadersAndValues>{};
  arrKeysFabrHeadersAndValuesToFilterBy  = <FabrHeader[]>[];
  aarFabrSidebarFilters                  = <{ [key: string]: string[] }>{};
  arrFabrSidebarFilters                  = <string[]>[];

  // *****************************************************************************
  // Private properties
  // *****************************************************************************

  private _requestDataOptions: RequestDataOptions;
  private _timeoutRefresh    : any;
  private _intervalRefresh   : any;
  private _isAutoloadActive  : boolean;
  private _timeoutComment    : any;
  private _isLoading         = false;

  // *****************************************************************************
  // Public methods
  // *****************************************************************************

  constructor(
    private _fabricationService: FabricationService,
    private _translateService  : TranslateService,
    @Inject('OMP_SETTINGS') public settings: any,
  ) {
    this._requestDataOptions = new RequestDataOptions();

    // priorities
    this.arrPriorities      = settings.priorities;
    this.strPriorityDefault = settings.priorities[3];

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
    this.doReadFabricationHeaders();
    this.doReadFabricationFilters();
    this.doGetAllFabricationMeta();
    this._requestDataOptions.setSortDefault(this.settings.fabrications.sortDefault);
    this.doRefreshFabrications();
    this._initScrollEvent();
    this._loadFabrHeadersToExclude();
    this._loadFabrHeadersAndValuesToFilterBy();
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
    console.log(`::: falsely called!!!`);
  }

  // *****************************************************************************

  setPriority(_id: string, priority: string) {
    return this.doSetOneFabricationMeta(_id, { priority });
  }

  // *****************************************************************************

  setComment(comment: string, workorderId: string) {
    this.aarFabrMeta[workorderId]         = this.aarFabrMeta[workorderId] || {};
    this.aarFabrMeta[workorderId].comment = comment;

    if (this._timeoutComment) {
      clearTimeout(this._timeoutComment);
    }

    this._timeoutComment = setTimeout(() => {
      this.doSetOneFabricationMeta(workorderId, { comment });
    }, 600);
  }

  // *****************************************************************************

  getCommentLines(comment?: string) {
    if (!comment) {
      return 1;
    }

    return Math.max(1, comment.split(/\r\n|\r|\n/).length);
  }

  // *****************************************************************************

  toggleRework(event: Event, workorderId: string) {
    event.stopPropagation();

    const rework = !(this.aarFabrMeta[workorderId] &&
        this.aarFabrMeta[workorderId].rework);
    this.doSetOneFabricationMeta(workorderId, { rework });
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

  doReadFabrications(withDebounceTime = false) {
    this._isLoading       = true;
    this.isFastFilterOpen = false;
    return this._fabricationService
      .readFabrications(this._requestDataOptions)
      .debounceTime(withDebounceTime ? 300 : 0)
      .subscribe(
        this._doReadFabricationsSuccess.bind(this),
        this._doReadFabricationsError.bind(this)
      );
  }

  // *****************************************************************************

  doReadFabricationHeaders() {
    this._isLoading = true;
    return this._fabricationService
      .readFabricationHeaders()
      .subscribe(
        this._doReadFabricationHeadersSuccess.bind(this),
        this._doReadFabricationsError.bind(this)
      );
  }

  // *****************************************************************************

  doReadFabricationFilters() {
    this._isLoading = true;
    return this._fabricationService
      .readFabricationFilters()
      .subscribe(
        this._doReadFabricationFiltersSuccess.bind(this),
        this._doReadFabricationsError.bind(this)
      );
  }

  // *****************************************************************************

  doReadFabricationsToAdd() {
    this._requestDataOptions.increaseStart()
    this.doReadFabrications();
  }

  // *****************************************************************************

  doReadFabricationsWithSearch(strSearch: string) {
    console.log(':: "asfasdf"', "asfasdf");
    this.strSearch = strSearch;
    this._requestDataOptions.resetStart();
    this._requestDataOptions.strSearch = strSearch;
    this.doToggleAllFabrications(false);
    this.doReadFabrications(true)
  }

  // *****************************************************************************

  doGetAllFabricationMeta() {
    this._isLoading = true;
    return this._fabricationService
      .getAllFabricationMeta()
      .subscribe(
        this._doGetFabricationMetaSuccess.bind(this),
        this._doReadFabricationsError.bind(this)
      );
  }

  // *****************************************************************************

  doSetOneFabricationMeta(_id: string, meta: any) {
    this._isLoading = true;
    return this._fabricationService
        .setOneFabricationMeta(_id, meta)
        .subscribe(
            this._doGetFabricationMetaSuccess.bind(this),
            this._doReadFabricationsError.bind(this)
        );
  }

  // *****************************************************************************

  doUnsetOneFabricationMeta(_id: string) {
    this._isLoading = true;
    return this._fabricationService
      .unsetOneFabricationMeta(_id)
      .subscribe(
        this._doGetFabricationMetaSuccess.bind(this),
        this._doReadFabricationsError.bind(this)
      );
  }

  // *****************************************************************************

  doRefreshFabrications() {
    this.strSearch = '';
    this._requestDataOptions.resetOptions();
    this.doToggleAllFabrications(false);
    this.doReadFabrications();
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

  doToggleOpenFabrication(numIndexOpen: number) {
    const numIndex = this.arrFabrsOpen.indexOf(numIndexOpen);
    if (numIndex >= 0) {
      this.arrFabrsOpen.splice(numIndex, 1);
    } else {
      this.arrFabrsOpen.push(numIndexOpen);
    }
  }

  // *****************************************************************************

  doToggleAllFabrications(isOpen: boolean) {
    this.arrFabrsOpen = isOpen ? Object.keys(this.arrFabrs).map(s => +s) : [];
  }

  // *****************************************************************************

  isFabricationOpen(numIndex: number): boolean {
    return this.arrFabrsOpen.indexOf(numIndex) >= 0;
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
    this.doToggleAllFabrications(false);
    this.doReadFabrications();
  }

  // *****************************************************************************

  doUnsetFilter(strKey: string) {
    this._requestDataOptions.unsetFilter(strKey);
    this._requestDataOptions.resetStart();
    this.doToggleAllFabrications(false);
    this.doReadFabrications();
  }

  // *****************************************************************************

  doUnsetAllFilters() {
    this.doToggleAllFabrications(false);
    this._requestDataOptions.resetStart();
    this._requestDataOptions.unsetAllFilters();
    this.doReadFabrications();
  }

  // *****************************************************************************

  isInFilters(strKey: string): boolean {
    return this._requestDataOptions.isInFilters(strKey);
  }

  // *****************************************************************************

  isFilterSecondaryKey(): boolean {
    return this._requestDataOptions.getKeysOfFilters().filter(strKey =>
        this.arrFabrHeadersSecondary.indexOf(strKey) >= 0).length > 0;
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
    this.doToggleAllFabrications(false);
    this.doReadFabrications();
  }

  // *****************************************************************************

  doResetSort() {
    this._requestDataOptions.resetSort();
    this.doRefreshFabrications();
  }

  // *****************************************************************************

  isSortSecondaryKey(): boolean {
    const strSortKey = this._requestDataOptions.getSortKey();
    return (this.arrFabrHeadersSecondary.indexOf(strSortKey) >= 0);
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
    this.doReadFabrications();
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

  private _doReadFabricationsSuccess(objResult: { data: Fabrication[], meta: any }) {
    const arrFabrs  = objResult.data || [];
    const objMeta_u = objResult.meta || {};

    if (this._requestDataOptions.numStart > 0) {
      this.arrFabrs.push.apply(this.arrFabrs, arrFabrs);
    } else {
      this.arrFabrs = arrFabrs;
    }

    this.hasNoMoreRows = objMeta_u.hasNoMoreRows;
    this._isLoading    = false;
    this._readSidebarFilters();
  }

  // *****************************************************************************

  private _doGetFabricationMetaSuccess(arrResult: Array<any>) {
    if (!arrResult || arrResult.length <= 0 ||
        'function' !== typeof arrResult.reduce ||
        'function' !== typeof arrResult.filter) {
      this.aarFabrMeta = {};
      return;
    }
    this.aarFabrMeta = arrResult.reduce((acc: any, result: any) =>
        ({ ...acc, [result._id]: result }), {});
    this.aarFabrMetaCommentTmp = arrResult
        .filter(result => !!result.comment)
        .reduce((acc, result) => {
          return { ...acc, [result._id]: result.comment };
        }, {});
  }

  // *****************************************************************************

  private _doReadFabricationHeadersSuccess(objResult:
      { data: objFabrHeadersData, meta: any }) {
    this.arrFabrHeadersPrimary   = objResult.data.primary;
    this.arrFabrHeadersSecondary = objResult.data.secondary;
    this.arrFabrHeaders          = objResult.data.all;
  }

  // *****************************************************************************

  private _doReadFabricationFiltersSuccess(objResult: { data: any, meta: any }) {
    this.aarFabrFilters = objResult.data;
  }

  // *****************************************************************************

  private _doReadFabricationsError(strError: string) {
    this.strError   = strError;
    this._isLoading = false;
  }

  // *****************************************************************************

  private _readSidebarFilters() {
    const arrSidebarFilters = <string[]>[
      'machineGroup',
    ];

    this.arrFabrs.forEach((fabrication: Fabrication) => {
      arrSidebarFilters.forEach(strFilter => {
        if (!this.aarFabrSidebarFilters[strFilter]) {
          this.aarFabrSidebarFilters[strFilter] = [];
        }
        if (this.aarFabrSidebarFilters[strFilter].indexOf(fabrication[strFilter]) < 0) {
          this.aarFabrSidebarFilters[strFilter].push(fabrication[strFilter]);
        }
      });
    });

    this.arrFabrSidebarFilters = Object.keys(this.aarFabrSidebarFilters);
  }

  // *****************************************************************************

  private _initScrollEvent() {
    const self = this;

    return window.addEventListener('scroll', event => {
      const numHeightWindow = window.innerHeight;
      const elScrollEnd     = document.getElementById('fabrication-list-scroll-end');
      const numScrollLimit  = elScrollEnd && elScrollEnd.getBoundingClientRect().top;

      if (self.isAutoloadActive &&
          !self._isLoading &&
          !this.hasNoMoreRows &&
          elScrollEnd &&
          numScrollLimit < numHeightWindow) {
        self.doReadFabricationsToAdd();
      }
    });
  }

  // *****************************************************************************

  private _loadFabrHeadersToExclude() {
    const strRole                = localStorage.role || '{}';
    const role: Role             = new Role(JSON.parse(strRole));
    this.arrFabrHeadersToExclude = role.arrFabrHeaders || [];
  }

  // *****************************************************************************

  private _loadFabrHeadersAndValuesToFilterBy() {
    const strRole                              = localStorage.role || '{}';
    const role: Role                           = new Role(JSON.parse(strRole));
    this.aarFabrHeadersAndValuesToFilterBy     = role.aarFabrHeadersAndValues || {};
    this.arrKeysFabrHeadersAndValuesToFilterBy = Object.keys(role.aarFabrHeadersAndValues);
  }

  // *****************************************************************************

  private _startInterval() {
    const numTimeGap      = 5 * 1000;
    const numTimeNextHour = Math.floor(((new Date()).getTime() + numTimeGap) / 1000) * 1000;
    const numTimeInt      = 1000 * 60 + numTimeGap;
    const numTimeToStart  = numTimeNextHour + numTimeGap;

    this._timeoutRefresh = setTimeout(() => {
      this.doReadFabrications();
      this._intervalRefresh = setInterval(() => {
        this.doReadFabrications();
      }, numTimeInt);
    }, numTimeToStart);
  }

  // *****************************************************************************
}

// *****************************************************************************
