import { Component, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector:  'ngx-bad-phone-spinner',
  templateUrl: './ngx-bad-phone-spinner.component.html',
  styleUrls: [
    './ngx-bad-phone-spinner.component.scss'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxBadPhoneSpinnerComponent),
      multi: true
    }
  ]
})
export class NgxBadPhoneSpinnerComponent implements ControlValueAccessor {
  @Output('change') change: EventEmitter<string> = new EventEmitter();

  @Input('number')
  set number(digits: string) {
    const candidates = digits.split('');

    for (let i = 0; i < 10; i++) {
      this.digits[i] = typeof candidates[i] !== 'undefined' ? parseInt(candidates[i], 10) : 0;
    }
  }

  fullNumber: string = '0000000000';
  digits: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  locks: boolean[] = [false, false, false, false, false, false, false, false, false, false];

  disabled: boolean;

  _propagateChange:any = () => {};
  _onTouched: () => void;

  constructor() { }

  writeValue(value: string): void {
    this.fullNumber = value || '0000000000';
  }

  registerOnChange(fn: any): void {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleLock(i:number):void {
    this.locks[i] = !this.locks[i];

    this._onChange();
  }

  randomize():void {
    for (let i = 0; i < 10; i++) {
      if (this.locks[i] === false) {
        this.digits[i] = Math.round(Math.random() * 9);
      }
    }
  }

  private _onChange():void {
    this.fullNumber = '';
    for (let i = 0; i < 10; i++) {
      this.fullNumber += '' + this.digits[i];
    }

    this._propagateChange(this.fullNumber);
    this.change.emit(this.fullNumber);
  }
}
