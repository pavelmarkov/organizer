import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DataService } from '../../shared/services/data.service';

import { TooltipModule } from 'primeng/tooltip';

import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actions-layout',
  imports: [
    ButtonModule,
    DividerModule,

    ToolbarModule,
    InputTextModule,
    IconField,
    InputIcon,

    FileUpload,

    TooltipModule,

    FormsModule,
  ],
  templateUrl: './actions-layout.component.html',
  styleUrl: './actions-layout.component.css',
  providers: [],
})
export class ActionsLayoutComponent implements OnInit {
  searchValue: string | undefined;

  @Output() processEvent = new EventEmitter();
  @Output() importEvent = new EventEmitter<string>();
  @Output() searchEvent = new EventEmitter();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.searchValue = undefined;
    this.dataService.setSearchValue(this.searchValue ?? '');
  }

  choose(event: MouseEvent, callback: VoidFunction) {
    callback();
  }

  process(event: MouseEvent) {
    this.processEvent.emit();
  }

  import(event: FileUploadHandlerEvent) {
    event.files.forEach((file) => {
      const reader: FileReader = new FileReader();

      reader.onload = () => {
        const fileContent = reader.result;
        if (typeof fileContent === 'string') {
          this.importEvent.emit(fileContent);
        }
      };

      reader.readAsText(file);
    });
  }

  search($event: Event) {
    this.dataService.setSearchValue(this.searchValue ?? '');
    this.searchEvent.emit();
  }
}
