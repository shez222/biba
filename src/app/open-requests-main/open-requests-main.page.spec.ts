import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpenRequestsMainPage } from './open-requests-main.page';

describe('OpenRequestsMainPage', () => {
  let component: OpenRequestsMainPage;
  let fixture: ComponentFixture<OpenRequestsMainPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OpenRequestsMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
