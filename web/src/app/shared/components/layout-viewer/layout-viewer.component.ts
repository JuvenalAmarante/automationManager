import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { DefaultResponse, LayoutNotifications } from '../../types';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-layout-viewer',
  templateUrl: './layout-viewer.component.html',
  styleUrls: ['./layout-viewer.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutViewerComponent implements OnInit {
  id = inject(NZ_MODAL_DATA);
  html: any;

  constructor(private api: ApiService) { }
  ngOnInit(): void {
    this.api.get(`/layouts-notification/${this.id}`).subscribe({
      next: (res: DefaultResponse<LayoutNotifications>) => {
        this.html = res.data.modelo;
      },
    });
  }
}
