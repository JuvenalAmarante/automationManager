import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Arquivo } from '../../types';

@Component({
  selector: 'app-file-viewer-item-list',
  templateUrl: './file-viewer-item-list.component.html',
  styleUrls: ['./file-viewer-item-list.component.less'],
})
export class FileViewerItemListComponent {
  @Input() file?: Arquivo;
  @Input() canEdit: boolean = false;
  @Output() onChangeFile: EventEmitter<number> = new EventEmitter<number>();

  changeFile(id?: number) {
    if (this.canEdit) this.onChangeFile.emit(id);
  }
}
