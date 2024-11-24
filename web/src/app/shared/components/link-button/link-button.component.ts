import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonType } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-link-button',
  templateUrl: './link-button.component.html',
  styleUrls: ['./link-button.component.less'],
})
export class LinkButtonComponent {
  linkEditButton: boolean = false;

  @Input() link?: { id: number[]; nome: string };
  @Input() icon: string = 'partition';
  @Input() selectedType: NzButtonType = 'primary';
  @Input() unselectedType: NzButtonType = 'primary';
  @Input() unselectedText: string = 'Vincular';
  @Output() onLinkSelect: EventEmitter<number[]> = new EventEmitter<number[]>();

  vinculate() {
    this.onLinkSelect.emit(this.link?.id);
  }
}
