import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatesRpmodalDetailsComponent } from './affiliates-rpmodal-details.component';

describe('AffiliatesRpmodalDetailsComponent', () => {
  let component: AffiliatesRpmodalDetailsComponent;
  let fixture: ComponentFixture<AffiliatesRpmodalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliatesRpmodalDetailsComponent]
    });
    fixture = TestBed.createComponent(AffiliatesRpmodalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
