import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosriModalComponent } from './dosri-modal.component';

describe('DosriModalComponent', () => {
  let component: DosriModalComponent;
  let fixture: ComponentFixture<DosriModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DosriModalComponent]
    });
    fixture = TestBed.createComponent(DosriModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
