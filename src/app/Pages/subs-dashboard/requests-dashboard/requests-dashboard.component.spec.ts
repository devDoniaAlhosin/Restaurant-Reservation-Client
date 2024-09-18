import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsDashboardComponent } from './requests-dashboard.component';

describe('RequestsDashboardComponent', () => {
  let component: RequestsDashboardComponent;
  let fixture: ComponentFixture<RequestsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
