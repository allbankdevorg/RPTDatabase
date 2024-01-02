import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAddModalComponent } from './users-add-modal.component';

describe('UsersAddModalComponent', () => {
  let component: UsersAddModalComponent;
  let fixture: ComponentFixture<UsersAddModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersAddModalComponent]
    });
    fixture = TestBed.createComponent(UsersAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
