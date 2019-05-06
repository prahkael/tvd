// *****************************************************************************
// Imports
// *****************************************************************************

import { Injectable }          from '@angular/core';
import { Observable, Subject } from 'rxjs';

// *****************************************************************************
// Component
// *****************************************************************************

@Injectable()
export class LoadingSpinnerService {

  // *****************************************************************************
  // Public properties
  // *****************************************************************************

  observableSpinning$: Observable<boolean>;

  // *****************************************************************************
  // Private properties
  // *****************************************************************************

  private _subjectIsSpinning : Subject<boolean>;
  private _numCounter        = 0;

  // *****************************************************************************
  // Public methods
  // *****************************************************************************

  constructor() {
    this._subjectIsSpinning = new Subject<boolean>();
    this.observableSpinning$ = this._subjectIsSpinning.asObservable();
  }

  // *****************************************************************************

  add() {
    this._numCounter += 1;
    this.toggle(this._numCounter > 0);
  }

  // *****************************************************************************

  remove() {
    if (this._numCounter > 0) {
      this._numCounter -= 1;
    }
    this.toggle(this._numCounter > 0);
  }

  // *****************************************************************************

  toggle(isSpinning: boolean) {
    if (this._subjectIsSpinning) {
      this._subjectIsSpinning.next(isSpinning);
    }
  }

  // *****************************************************************************

  on(ignored?: any) {
    this.toggle(true);
  }

  // *****************************************************************************

  off(ignored?: any) {
    this.toggle(false);
  }

  // *****************************************************************************
}

// *****************************************************************************
