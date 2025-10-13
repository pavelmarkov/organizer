import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModel, NoteModel } from '../../core/domain';
import { NotesService } from '../../core/services';
import { DataService } from '../../shared/services/data.service';
import { CardLayoutComponent } from '../card-layout/card-layout.component';
import { ButtonModule } from 'primeng/button';
import { ActionsLayoutComponent } from '../actions-layout/actions-layout.component';

@Component({
  selector: 'app-notes-layout',
  imports: [
    TableModule,
    CardLayoutComponent,
    ButtonModule,
    ActionsLayoutComponent,
  ],
  templateUrl: './notes-layout.component.html',
  styleUrl: './notes-layout.component.css',
})
export class NotesLayoutComponent {
  notes!: NoteModel[];

  selected: string[] = [];

  dialogPanelVisible: boolean = false;

  cardData: CardModel = {
    rowIdentifier: null,
    tags: [],
  };

  constructor(
    private notesService: NotesService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getNotes();

    this.dataService.currentProject.subscribe((data) => {
      this.getNotes();
    });
  }

  getNotes() {
    this.notesService.getNotes().subscribe((data) => {
      this.notes = data;
    });
  }

  showDialog(note: NoteModel) {
    this.notesService.view(note.noteId).subscribe((viewData) => {
      this.cardData = viewData;
      this.dialogPanelVisible = true;
    });
  }

  nextItem(note: NoteModel) {
    if (!this.cardData.next) {
      return;
    }

    this.notesService.view(this.cardData.next).subscribe((viewData) => {
      this.cardData = viewData;
      this.dialogPanelVisible = true;
    });
  }

  closeDialog() {
    this.dialogPanelVisible = false;
  }

  tagChanged(selectedTags: string[]) {
    if (!this.cardData.rowIdentifier) {
      return;
    }

    this.notesService
      .update([
        {
          noteId: this.cardData.rowIdentifier,
          tags: selectedTags,
        },
      ])
      .subscribe((data) => {
        console.log(data);
        this.cardData.tags = selectedTags;
      });
  }

  importNotes(event: string) {}

  processNotes() {}

  searchNotes() {
    this.getNotes();
  }
}
