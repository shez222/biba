import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPrefferedRequestsPage } from './my-preffered-requests.page';

describe('MyPrefferedRequestsPage', () => {
  let component: MyPrefferedRequestsPage;
  let fixture: ComponentFixture<MyPrefferedRequestsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyPrefferedRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
