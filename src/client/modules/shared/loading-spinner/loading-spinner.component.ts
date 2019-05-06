// *****************************************************************************
// Imports
// *****************************************************************************

import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingSpinnerService }        from './';

// *****************************************************************************
// Component
// *****************************************************************************

@Component({
  selector: 'dl-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  isSpinning: boolean = false;
  private _subscriptionSpinning: any;

  constructor(
    private _loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngOnInit() {
    this._subscriptionSpinning = this._loadingSpinnerService.observableSpinning$.subscribe(
      isSpinning => this.toggleLoadingSpinner(isSpinning));
  }

  ngOnDestroy() {
    this._subscriptionSpinning.unsubscribe();
  }

  toggleLoadingSpinner(isSpinning: boolean) {
    this.isSpinning = isSpinning;
  }
}

// *****************************************************************************
