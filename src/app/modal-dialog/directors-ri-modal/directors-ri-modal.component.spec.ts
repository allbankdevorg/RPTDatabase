import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorsRIModalComponent } from './directors-ri-modal.component';

describe('DirectorsRIModalComponent', () => {
  let component: DirectorsRIModalComponent;
  let fixture: ComponentFixture<DirectorsRIModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectorsRIModalComponent]
    });
    fixture = TestBed.createComponent(DirectorsRIModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
