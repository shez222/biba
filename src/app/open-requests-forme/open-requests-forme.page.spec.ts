import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpenRequestsForMePage } from './open-requests-forme.page';

describe('OpenRequestsForMePage', () => {
  let component: OpenRequestsForMePage;
  let fixture: ComponentFixture<OpenRequestsForMePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OpenRequestsForMePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
