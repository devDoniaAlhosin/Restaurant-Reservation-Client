import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementPopUpComponent } from './advertisement-pop-up.component';

describe('AdvertisementPopUpComponent', () => {
  let component: AdvertisementPopUpComponent;
  let fixture: ComponentFixture<AdvertisementPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertisementPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
