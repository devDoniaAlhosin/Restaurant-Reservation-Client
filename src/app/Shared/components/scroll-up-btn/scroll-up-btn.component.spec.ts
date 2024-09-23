import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollUpBtnComponent } from './scroll-up-btn.component';

describe('ScrollUpBtnComponent', () => {
  let component: ScrollUpBtnComponent;
  let fixture: ComponentFixture<ScrollUpBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollUpBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollUpBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
