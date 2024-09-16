import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultiFileUploadProfileIncompleteComponent } from './multi-file-upload-profile-incomplete.component';

describe('MultiFileUploadProfileIncompleteComponent', () => {
  let component: MultiFileUploadProfileIncompleteComponent;
  let fixture: ComponentFixture<MultiFileUploadProfileIncompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiFileUploadProfileIncompleteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultiFileUploadProfileIncompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
