import { Component, Input, OnChanges, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ApiService } from 'src/app/core/services/api.service';
import { Arquivo, DefaultResponse } from '../../types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { debounce, finalize, interval } from 'rxjs';
import { NzButtonComponent } from 'ng-zorro-antd/button';

@Component({
	selector: 'app-upload-file',
	templateUrl: './upload-file.component.html',
	styleUrls: ['./upload-file.component.less'],
})
export class UploadFileComponent implements OnChanges {
	constructor(private api: ApiService, private readonly messageService: NzMessageService) {}

	@Input() send: boolean = false;
	@Input() origin?: number;
	@Input() max: number | null = 5;
	@Input() isUpdate = false;
	@Input() referenceId?: number;
	@Input() type: 'file' | 'avatar' = 'file';
	@Input() avatarUrl?: string;

	@Output() onFilesUploaded: EventEmitter<Arquivo[]> = new EventEmitter<Arquivo[]>();
	@Output() fileListObserver: EventEmitter<NzUploadFile[]> = new EventEmitter<NzUploadFile[]>();
	@Output() totalFiles: EventEmitter<number> = new EventEmitter<number>();

	fileList: NzUploadFile[] = [];
	descricaoList: string[] = [];
	isLoading = false;
	isSending = false;
	requestFile = false;

	@ViewChild('button', { static: true }) button!: NzButtonComponent;

	ngOnChanges() {
		if (!this.origin || !this.referenceId) return;

		if (this.send) {
			const data = new FormData();

			data.append('origin', this.origin.toString());
			data.append('reference_id', this.referenceId.toString());

			this.fileList.forEach((file: any) => {
				data.append('files', file);
			});

			data.append('descricao', JSON.stringify(this.descricaoList));

			if (!this.fileList?.length) {
				this.onFilesUploaded?.emit([]);
				return;
			}

			this.isSending = true;
			this.api
				.post('/uploads', data)
				.pipe(
					debounce(() => interval(50)),
					finalize(() => (this.fileList = [])),
				)
				.subscribe({
					next: (res: DefaultResponse<Arquivo[]>) => {
						this.onFilesUploaded.emit(res.data);
					},
					complete: () => {
						this.isSending = false;
					},
					error: () => {
						this.messageService.remove();
						this.messageService.error('Houve um erro ao anexar o(s) aquivo(s).');
						this.onFilesUploaded.emit([]);
					},
				});
		}
	}

	beforeUpload = (file: NzUploadFile): boolean => {
		this.isLoading = true;

		if (this.max != null && this.fileList.length >= this.max) {
			this.messageService.remove();
			this.messageService.warning(`A quantidade máxima de anexos permitida é ${this.max}`);

			return false;
		}

		// if (file?.size > 50) {
		// }

		if (this.type == 'avatar') {
			this.getBase64(file, (img: string) => {
				this.isLoading = false;
				this.avatarUrl = img;
			});

			this.fileList = [file];
		} else {
			this.isLoading = false;

			this.fileList = this.fileList.concat(file);
		}

		this.fileListObserver.emit(this.fileList);
		this.descricaoList.push('');

		return false;
	};

	uploadFile() {
		this.requestFile = true;

		this.button['elementRef'].nativeElement.click();
	}

	removeFile(index: number) {
		this.fileList.splice(index, 1);
		this.descricaoList.splice(index, 1);
	}

	private getBase64(img: any, callback: (img: string) => void): void {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result!.toString()));
		reader.readAsDataURL(img);
	}
}
