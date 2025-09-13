import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { FormsModule } from '@angular/forms';
import { Listbox } from 'primeng/listbox';
import { TagsService } from '../../core/services';

@Component({
  selector: 'app-card-layout',
  imports: [DialogModule, CardModule, ButtonModule, FormsModule, Listbox],
  templateUrl: './card-layout.component.html',
  styleUrl: './card-layout.component.css',
})
export class CardLayoutComponent implements OnInit {
  @Input() cardData: any = {
    text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!`,
  };
  @Input() visible: boolean = false;

  @Output() dialogPanelCloseEvent = new EventEmitter();

  @Output() tagChangedEvent = new EventEmitter();

  constructor(
    private cd: ChangeDetectorRef,
    private tagsService: TagsService
  ) {}

  ngOnInit() {
    this.tagsService.getTags().subscribe((data) => {
      console.log('tags data: ', data);
    });
    this.items = Array.from({ length: 10 }, (_, i) => ({
      label: `Item #${i}`,
      value: i,
    }));
  }

  // ngOnChanges(changes: { [property: string]: SimpleChange }) {
  //   console.log(changes);
  //   // this.visible = changes['visible'].currentValue;
  // }

  dialogClosed() {
    // this.visible = false;
    this.dialogPanelCloseEvent.emit();
  }

  items: { label: string; value: number }[] = [];

  selectedItems!: any[];

  selectAll = false;

  onSelectAllChange(event: any) {
    this.selectedItems = event.checked ? [...this.items] : [];
    this.selectAll = event.checked;
    event.updateModel(this.selectedItems, event.originalEvent);
  }

  onChange(event: any) {
    const { originalEvent, value } = event;
    console.log('this.selectedItems: ', this.selectedItems);
    this.tagChangedEvent.emit();
    if (value) this.selectAll = value.length === this.items.length;
  }
}
