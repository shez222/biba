import { Component, OnInit } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';

@Component({
  selector: 'app-multi-file-upload-identification-front',
  templateUrl: './multi-file-upload-identification-front.component.html',
  styleUrls: ['./multi-file-upload-identification-front.component.scss'],
})
export class MultiFileUploadIdentificationFrontComponent  implements OnInit 
{

  public uploader: FileUploader = new FileUploader({url:''});
  public hasBaseDropZoneOver: boolean = false;

  constructor() 
  {}

  ngOnInit() 
  {}

  getFiles(): FileLikeObject[] 
  {
    return this.uploader.queue.map((fileItem) => 
    {
      return fileItem.file;
    });
  }

  fileOverBase(ev:any): void 
  {
    this.hasBaseDropZoneOver = ev;
  }

  reorderFiles(reorderEvent: CustomEvent): void 
  {
    let element = this.uploader.queue.splice(reorderEvent.detail.from, 1)[0];
    this.uploader.queue.splice(reorderEvent.detail.to, 0, element);
  }

  clearObject()
  {
    this.uploader.cancelAll();
    this.uploader.clearQueue();
  }
}
