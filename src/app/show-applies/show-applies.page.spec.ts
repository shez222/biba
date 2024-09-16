import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowAppliesPage } from './show-applies.page';

describe('ShowAppliesPage', () => {
  let component: ShowAppliesPage;
  let fixture: ComponentFixture<ShowAppliesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShowAppliesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
