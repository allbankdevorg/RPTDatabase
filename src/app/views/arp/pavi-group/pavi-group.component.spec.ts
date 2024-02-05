import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaviGroupComponent } from './pavi-group.component';

describe('PaviGroupComponent', () => {
  let component: PaviGroupComponent;
  let fixture: ComponentFixture<PaviGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaviGroupComponent]
    });
    fixture = TestBed.createComponent(PaviGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
