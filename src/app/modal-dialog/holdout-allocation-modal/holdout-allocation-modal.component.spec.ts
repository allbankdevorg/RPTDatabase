import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldoutAllocationModalComponent } from './holdout-allocation-modal.component';

describe('HoldoutAllocationModalComponent', () => {
  let component: HoldoutAllocationModalComponent;
  let fixture: ComponentFixture<HoldoutAllocationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HoldoutAllocationModalComponent]
    });
    fixture = TestBed.createComponent(HoldoutAllocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
