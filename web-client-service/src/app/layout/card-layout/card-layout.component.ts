import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChange,
} from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-card-layout',
  imports: [DialogModule, CardModule, ButtonModule],
  templateUrl: './card-layout.component.html',
  styleUrl: './card-layout.component.css',
})
export class CardLayoutComponent implements OnInit {
  @Input() cardData: any = {
    text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!`,
  };
  @Input() visible: boolean = false;

  @Output() dialogPanelCloseEvent = new EventEmitter();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  // ngOnChanges(changes: { [property: string]: SimpleChange }) {
  //   console.log(changes);
  //   // this.visible = changes['visible'].currentValue;
  // }

  dialogClosed() {
    // this.visible = false;
    this.dialogPanelCloseEvent.emit();
  }
}
