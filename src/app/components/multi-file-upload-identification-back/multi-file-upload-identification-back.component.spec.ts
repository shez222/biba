import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultiFileUploadIdentificationBackComponent } from './multi-file-upload-identification-back.component';

describe('MultiFileUploadIdentificationBackComponent', () => {
  let component: MultiFileUploadIdentificationBackComponent;
  let fixture: ComponentFixture<MultiFileUploadIdentificationBackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiFileUploadIdentificationBackComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultiFileUploadIdentificationBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
