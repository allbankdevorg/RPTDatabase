import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DRIComponent } from './dri.component';

describe('DRIComponent', () => {
  let component: DRIComponent;
  let fixture: ComponentFixture<DRIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DRIComponent]
    });
    fixture = TestBed.createComponent(DRIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
