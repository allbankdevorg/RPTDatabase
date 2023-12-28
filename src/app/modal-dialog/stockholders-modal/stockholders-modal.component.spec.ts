import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockholdersModalComponent } from './stockholders-modal.component';

describe('StockholdersModalComponent', () => {
  let component: StockholdersModalComponent;
  let fixture: ComponentFixture<StockholdersModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockholdersModalComponent]
    });
    fixture = TestBed.createComponent(StockholdersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
