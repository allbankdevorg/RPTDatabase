import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorsModalComponent } from './directors-modal.component';

describe('DirectorsModalComponent', () => {
  let component: DirectorsModalComponent;
  let fixture: ComponentFixture<DirectorsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectorsModalComponent]
    });
    fixture = TestBed.createComponent(DirectorsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
