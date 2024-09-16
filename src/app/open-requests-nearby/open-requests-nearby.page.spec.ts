import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpenRequestsNearbyPage } from './open-requests-nearby.page';

describe('OpenRequestsNearbyPage', () => {
  let component: OpenRequestsNearbyPage;
  let fixture: ComponentFixture<OpenRequestsNearbyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OpenRequestsNearbyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
