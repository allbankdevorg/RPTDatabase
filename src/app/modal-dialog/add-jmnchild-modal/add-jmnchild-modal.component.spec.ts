import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJMNChildModalComponent } from './add-jmnchild-modal.component';

describe('AddJMNChildModalComponent', () => {
  let component: AddJMNChildModalComponent;
  let fixture: ComponentFixture<AddJMNChildModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddJMNChildModalComponent]
    });
    fixture = TestBed.createComponent(AddJMNChildModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
