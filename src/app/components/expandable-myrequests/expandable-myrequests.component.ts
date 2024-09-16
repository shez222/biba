import { Component, OnInit, Input, ViewChild,  ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-expandable-myrequests',
  templateUrl: './expandable-myrequests.component.html',
  styleUrls: ['./expandable-myrequests.component.scss'],
})

export class ExpandableMyrequestsComponent  implements OnInit 
{
  @ViewChild("expandWrapper", { read: ElementRef }) expandWrapper: ElementRef | undefined;
  @Input("expanded") expanded: boolean = false;
  @Input("expandHeight") expandHeight: string = "150px";
  constructor(public renderer: Renderer2)
  { }

  ngOnInit()
  { }

  ionViewDidEnter()
  {
    this.renderer.setStyle(this.expandWrapper!.nativeElement, "max-height", this.expandHeight);
  }
}
