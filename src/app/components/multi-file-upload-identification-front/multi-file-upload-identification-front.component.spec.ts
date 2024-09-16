import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultiFileUploadIdentificationFrontComponent } from './multi-file-upload-identification-front.component';

describe('MultiFileUploadIdentificationFrontComponent', () => {
  let component: MultiFileUploadIdentificationFrontComponent;
  let fixture: ComponentFixture<MultiFileUploadIdentificationFrontComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiFileUploadIdentificationFrontComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultiFileUploadIdentificationFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
