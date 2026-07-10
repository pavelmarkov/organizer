import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModel, TagModel } from '../../core/domain';
import { TagsService } from '../../core/services';
import { DataService } from '../../shared/services/data.service';
import { SelectedNodesType } from '../../core/types';
import { TreeNode } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { ActionsLayoutComponent } from '../actions-layout/actions-layout.component';
import { TreeTableLayoutComponent } from '../tree-table-layout/tree-table-layout.component';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { CardLayoutComponent } from '../card-layout/card-layout.component';

interface Column {
  field: keyof TagModel | '';
  header: string;
}

@Component({
  selector: 'app-tags-layout',
  imports: [
    TableModule,
    ActionsLayoutComponent,
    TreeTableLayoutComponent,

    CardLayoutComponent,

    ButtonModule,
    TextareaModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    DialogModule,

    SelectModule,
  ],
  templateUrl: './tags-layout.component.html',
  styleUrl: './tags-layout.component.css',
})
export class TagsLayoutComponent {
  dataKeyName = 'tagId';
  tags!: TreeNode<TagModel>[];
  cols!: Column[];
  totalRecords!: number;
  loading: boolean = false;
  selectionKeys: SelectedNodesType = {};

  limit: number = 10;
  offset: number = 0;

  createDialogVisible: boolean = false;
  tag: Partial<TagModel> = {};
  submitted: boolean = false;

  attachToParentDialogVisible: boolean = false;
  selectedParentTagId: string | undefined = undefined;
  parentTagsList: TagModel[] = [];

  cardData: CardModel = {
    rowIdentifier: null,
    tags: [],
    attachments: [],
  };
  dialogPanelVisible: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private tagsService: TagsService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: '', header: '' },
    ];

    this.totalRecords = 0;

    this.loading = false;

    this.dataService.currentProject.subscribe((data) => {
      this.loadNodes();
    });
  }

  private mapTagsToNodes(tags: TagModel[]): TreeNode<TagModel>[] {
    const nodes: TreeNode[] = [];

    tags.forEach((tagsElement) => {
      let node: TreeNode = {
        data: tagsElement,
        leaf: true,
        children: [],
      };

      nodes.push(node);
    });

    return nodes;
  }

  searchTags() {
    this.loadNodes();
  }

  onNodeExpand(node: TreeNode<TagModel>) {
    throw new Error('Not implemented');
  }

  showDialog(tag: TagModel) {
    this.tagsService.view(tag.tagId).subscribe((viewData) => {
      this.cardData = viewData;
      this.dialogPanelVisible = true;
    });
  }
  nextItem(tag: TagModel) {
    if (!this.cardData.next) {
      return;
    }

    this.tagsService.view(this.cardData.next).subscribe((viewData) => {
      this.cardData = viewData;
      this.dialogPanelVisible = true;
    });
  }
  previousItem(tag: TagModel) {
    if (!this.cardData.previous) {
      return;
    }

    this.tagsService.view(this.cardData.previous).subscribe((viewData) => {
      this.cardData = viewData;
      this.dialogPanelVisible = true;
    });
  }

  closeDialog() {
    this.dialogPanelVisible = false;
  }

  loadNodes(event?: any) {
    this.tagsService
      .getTags({}, { offset: this.offset, limit: this.limit })
      .subscribe((data) => {
        const nodes = this.mapTagsToNodes(data);
        this.loading = false;
        this.tags = [...nodes];
        this.cd.markForCheck();
      });
    this.getTotalCount();
  }
  paginate($event: PaginatorState) {
    this.limit = $event.rows ?? 10;
    this.offset = $event.first ?? 0;
    this.loadNodes();
  }
  getTotalCount() {
    this.tagsService.count().subscribe((data) => {
      this.totalRecords = data;
    });
  }

  removeTag(tag: TagModel) {
    throw new Error('Not implemented');
  }

  hideCreateDialog() {
    this.createDialogVisible = false;
    this.submitted = false;
  }
  editTag(tag: TagModel) {
    this.tag = {};

    this.tag.tagId = tag.tagId;
    this.tag.name = tag.name;
    this.tag.description = tag.description;

    this.submitted = false;
    this.createDialogVisible = true;
  }
  saveTag() {
    const callback = (newTags: Partial<TagModel>[]) => {
      this.submitted = true;
      this.createDialogVisible = false;
      this.tag = {};
      this.loadNodes();
    };

    this.tagsService.update([this.tag]).subscribe(callback);
  }

  attachToParentDialog() {
    this.attachToParentDialogVisible = true;
  }
  hideAttachToParentDialog() {
    this.attachToParentDialogVisible = false;
  }
  onSelectParentClick($event: MouseEvent) {
    this.tagsService.getTags({}, {}).subscribe((data) => {
      this.parentTagsList = data;
    });
  }
  attachToParent() {
    const selectedTagGuids = Object.keys(this.selectionKeys).filter(
      (guid) => this.selectionKeys[guid].checked,
    );

    const selectedParentTagGuid = this.selectedParentTagId ?? null;

    if (!selectedTagGuids.length) {
      this.attachToParentDialogVisible = false;
      return;
    }

    const updateTagsData: Pick<TagModel, 'tagId' | 'parentId'>[] =
      selectedTagGuids.map((selectedTagGuid) => {
        return {
          tagId: selectedTagGuid,
          parentId: selectedParentTagGuid,
        };
      });

    this.tagsService.update(updateTagsData).subscribe((data) => {
      this.attachToParentDialogVisible = false;
      this.loadNodes();
    });

    this.selectionKeys = {};

    this.attachToParentDialogVisible = false;
  }
}
