import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherRelatedPartiesComponent } from './other-related-parties.component';

describe('OtherRelatedPartiesComponent', () => {
  let component: OtherRelatedPartiesComponent;
  let fixture: ComponentFixture<OtherRelatedPartiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherRelatedPartiesComponent]
    });
    fixture = TestBed.createComponent(OtherRelatedPartiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
