import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCountryComponent } from './details-country.component';

describe('DetailsCountryComponent', () => {
  let component: DetailsCountryComponent;
  let fixture: ComponentFixture<DetailsCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsCountryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
