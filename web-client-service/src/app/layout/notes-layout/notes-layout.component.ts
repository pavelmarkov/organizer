import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModel, NoteModel } from '../../core/domain';
import { NotesService } from '../../core/services';
import { DataService } from '../../shared/services/data.service';
import { CardLayoutComponent } from '../card-layout/card-layout.component';
import { ButtonModule } from 'primeng/button';
import { ActionsLayoutComponent } from '../actions-layout/actions-layout.component';
import { TreeTableLayoutComponent } from '../tree-table-layout/tree-table-layout.component';
import { TreeNode } from 'primeng/api';
import { SelectedNodesType } from '../../core/types';
import { PaginatorState } from 'primeng/paginator';

interface Column {
  field: keyof NoteModel | '';
  header: string;
}

@Component({
  selector: 'app-notes-layout',
  imports: [
    TableModule,
    CardLayoutComponent,
    ButtonModule,
    ActionsLayoutComponent,
    TreeTableLayoutComponent,
  ],
  templateUrl: './notes-layout.component.html',
  styleUrl: './notes-layout.component.css',
})
export class NotesLayoutComponent {
  dataKeyName: string = 'noteId';
  notes!: TreeNode<NoteModel>[];
  cols!: Column[];
  totalRecords!: number;
  loading: boolean = false;
  selectionKeys: SelectedNodesType = {};
  limit: number = 10;
  offset: number = 0;

  selected: string[] = [];

  dialogPanelVisible: boolean = false;

  cardData: CardModel = {
    rowIdentifier: null,
    tags: [],
  };

  constructor(
    private cd: ChangeDetectorRef,
    private notesService: NotesService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'type', header: 'Type' },
      { field: '', header: '' },
    ];

    this.totalRecords = 0;

    this.loading = false;

    this.loadNodes();

    this.dataService.currentProject.subscribe((data) => {
      this.loadNodes();
      this.loading = false;
    });
  }

  loadNodes(event?: any) {
    this.notesService
      .getNotes({}, { offset: this.offset, limit: this.limit })
      .subscribe((data) => {
        const nodes = this.mapNotesToNodes(data);
        this.loading = false;
        this.notes = [...nodes];
        this.cd.markForCheck();
      });
    this.getTotalCount();
  }

  getTotalCount() {
    this.notesService.count().subscribe((data) => {
      this.totalRecords = data;
    });
  }

  paginate($event: PaginatorState) {
    this.limit = $event.rows ?? 10;
    this.offset = $event.first ?? 0;
    this.loadNodes();
  }

  private mapNotesToNodes(notes: NoteModel[]): TreeNode[] {
    const nodes: TreeNode[] = [];

    notes.forEach((notesElement) => {
      let node: TreeNode = {
        data: notesElement,
        leaf: true,
        children: [],
      };

      nodes.push(node);
    });

    return nodes;
  }

  onNodeExpand(node: TreeNode) {
    return;
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
    this.loadNodes();
  }
}
