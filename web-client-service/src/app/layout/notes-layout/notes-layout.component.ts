import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { NoteModel } from '../../core/domain';
import { NotesService } from '../../core/services';

@Component({
  selector: 'app-notes-layout',
  imports: [TableModule],
  templateUrl: './notes-layout.component.html',
  styleUrl: './notes-layout.component.css',
})
export class NotesLayoutComponent {
  notes!: NoteModel[];

  constructor(private notesService: NotesService) {}

  ngOnInit() {
    this.notesService.getNotes().subscribe((data) => {
      this.notes = data;
    });
  }
}
