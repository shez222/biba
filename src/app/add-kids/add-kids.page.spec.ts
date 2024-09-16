import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddKidsPage } from './add-kids.page';

describe('AddKidsPage', () => {
  let component: AddKidsPage;
  let fixture: ComponentFixture<AddKidsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddKidsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
