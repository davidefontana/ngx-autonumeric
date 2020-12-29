import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import AutoNumeric from 'autonumeric';
import { SELECTOR } from './ngx-autonumeric.constants';

@Directive({
  selector: `[${SELECTOR}]`
})
export class NgxAutonumericDirective implements OnInit, OnChanges {

  private formatter;

  private readonly DEFAULT_OPTIONS = AutoNumeric.getPredefinedOptions();

  @Input(SELECTOR) configuration: AutoNumeric.Options = this.DEFAULT_OPTIONS;

  constructor(private element: ElementRef) {
    this.formatter = new AutoNumeric(this.element.nativeElement, null, this.DEFAULT_OPTIONS);
  }

  ngOnInit(): void {
    this.formatFrom(this.configuration);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newconfiguration = changes.configuration;
    if (newconfiguration?.currentValue != null) {
      this.formatFrom(newconfiguration.currentValue);
    }
  }

  private formatFrom(configuration: AutoNumeric.Options) {
    this.formatter.update(configuration);
  }

}
