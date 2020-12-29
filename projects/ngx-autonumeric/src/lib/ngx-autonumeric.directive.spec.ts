import { Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createDirectiveFactory, createHostFactory, SpectatorHost } from '@ngneat/spectator';
import AutoNumeric from 'autonumeric';
import { NgxAutonumericDirective } from './ngx-autonumeric.directive';

const EMPTY_CHANGE = {};

describe('directive', () => {

  const createDirective = createDirectiveFactory({
    directive: NgxAutonumericDirective,
    imports: [BrowserAnimationsModule]
  });

  it('should create an instance', () => {
    const host = createDirective(`<div autonumeric></div>`);
    expect(host.directive).toBeTruthy();
  });

  it('should pass correct autonumeri configuration', () => {
    const spectator = createDirective(`<input [autonumeric]="{decimalPlaces: 1}" value="1"/>`);
    const expectedOptions: AutoNumeric.Options = { decimalPlaces: 1 } as AutoNumeric.Options;
    expect(spectator.directive.configuration).toEqual(expectedOptions);
  });

  it('should format correctly', () => {
    const spectator = createDirective(`<input [autonumeric]="{decimalPlaces: 1}" value="1"/>`);
    expect(spectator.query('input')).toHaveProperty('value', '1.0');
  });

  it('should default format correctly', () => {
    const spectator = createDirective(`<input [autonumeric] value="1"/>`);
    expect(spectator.query('input')).toHaveProperty('value', '1.00');
  });

  it('should format with default configuration (with 2 decimal places) when configuration is null', () => {
    const spectator = createDirective(`<input [autonumeric]="null" value="1"/>`);
    expect(spectator.query('input')).toHaveProperty('value', '1.00');
  });

  it('should does not update when no configuration is changed', () => {
    const defaultSpectator = createDirective(`<input [autonumeric] value="1"/>`);
    const previousConfiguration = defaultSpectator.directive.configuration;
    defaultSpectator.directive.ngOnChanges(EMPTY_CHANGE);
    expect(defaultSpectator.directive.configuration).toEqual(previousConfiguration);
  });


});


describe('component usage', () => {

  @Component({
    selector: 'mock-component',
    template: `<input [autonumeric]="configuration" value="1"/>`
  })
  class MockComponent {
    @Input() configuration: AutoNumeric.Options | null = null;
  }

  const makeComponent = createHostFactory(
    {
      component: MockComponent,
      declarations: [NgxAutonumericDirective],
      imports: [BrowserAnimationsModule],
      detectChanges: true
    }
  )

  let spectator: SpectatorHost<MockComponent>;

  beforeEach(() => {
    spectator = makeComponent(`<mock-component [configuration]="configuration"></mock-component>`, {
      hostProps: {
        configuration: {
          decimalPlaces: 3
        }
      }
    });

  });

  it('should format number with default decimal places', () => {
    expect(spectator.query('input')).toHaveProperty('value', '1.000');
  });

  it('should change configuration when configuration change', () => {

    spectator.setHostInput({
      configuration: { decimalPlaces: 1 }
    });

    expect(spectator.query('input')).toHaveProperty('value', '1.0');
  });

});
