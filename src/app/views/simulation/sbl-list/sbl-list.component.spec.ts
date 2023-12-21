import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SBLListComponent } from './sbl-list.component';

describe('SBLListComponent', () => {
  let component: SBLListComponent;
  let fixture: ComponentFixture<SBLListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SBLListComponent]
    });
    fixture = TestBed.createComponent(SBLListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
