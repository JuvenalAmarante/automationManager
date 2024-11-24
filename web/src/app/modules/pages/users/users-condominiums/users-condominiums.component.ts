import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { debounce } from 'src/app/shared/helpers';
import { Condominio, DefaultResponse, Departamentos, Usuario, UsuarioCondominiosVinculados } from 'src/app/shared/types';

type data = { isModal?: boolean; userId: number };

@Component({
	selector: 'app-users-condominiums',
	templateUrl: './users-condominiums.component.html',
	styleUrls: ['./users-condominiums.component.less'],
})
export class UsersCondominiumsComponent implements OnInit {
	form: FormGroup;
	list: TransferItem[] = [];
	readonly #modal = inject(NzModalRef);
	private nzData: data = inject(NZ_MODAL_DATA);
	$asTransferItems = (data: unknown): TransferItem[] => data as TransferItem[];
	isLoadingSave: boolean = false;
	isLoadingCondominiums: boolean = false;
	isLoadingDepartment: boolean = false;
	busca = '';

	indexPage = 1;
	pages: number[] = [];
	totalRegistros: any = { left: 0, right: 0 };

	userName: string = '';

	errorList: string[] = [];

	condominiumsList: Condominio[] = [];
	departmentsList: Departamentos[] = [];

	condominios_ids: number[] = [];

	@ViewChild('inputSearch') inputSearch!: ElementRef;

	constructor(private readonly fb: UntypedFormBuilder, private readonly api: ApiService, private readonly modalService: NzModalService) {
		this.form = fb.group({
			busca: [null],
			departamento_id: [0, Validators.required],
		});

		this.#modal.updateConfig({
			nzOkDisabled: true,
			nzOnOk: async () => await this.submitForm(),
		});
	}

	ngOnInit() {
		this.onSearchDepartments();
		this.getUserLinks();
		this.getUser();
	}

	getUser() {
		this.api.get(`/users/${this.nzData.userId}`).subscribe({
			next: (res: DefaultResponse<Usuario>) => {
				this.userName = res.data.pessoa.nome;
			},
		});
	}

	getUserLinks(page: number = 1) {
		this.isLoadingCondominiums = true;
		this.indexPage = 1;
		this.#modal.updateConfig({
			nzOkDisabled: true,
		});
		this.api
			.post(`/users/${this.nzData.userId}/condominiums?page=${page}`, {
				busca: this.busca,
				departamento_id: this.form.get('departamento_id')?.value,
				condominios_ids_ingnore: this.condominios_ids,
			})
			.pipe(finalize(() => (this.isLoadingCondominiums = false)))
			.subscribe({
				next: (res: DefaultResponse<UsuarioCondominiosVinculados>) => {
					const listRight = this.list.filter((item) => item.direction == 'right');
					this.list = [];
					if (page > 1) {
						this.list = [
							...this.list,
							...res.data.condominios.map<TransferItem>((cond) => ({
								title: cond.nome,
								id: cond.id,
								direction: 'left',
								page: page,
							})),
						];
						this.pages.push(page);
					} else {
						this.list = [];
						this.pages = [];
						this.list = res.data.condominios.map((cond) => ({
							title: cond.nome,
							id: cond.id,
							direction: 'left',
							page: 1,
						}));

						this.pages.push(1);
					}

					this.list = [
						...this.list,
						...res.data.condominiosCarteira.map<TransferItem>((cond) => ({ title: cond.nome, direction: 'right', id: cond.id })),
					];

					this.totalRegistros.left = res.total_pages || 0;
					this.totalRegistros.right = 1;
					this.#modal.updateConfig({
						nzOkDisabled: false,
					});
				},
				error: (err) => {
					this.modalService.warning({
						nzContent: err.error.message.toString(),
						nzTitle: 'Atenção',
						nzOnOk: () => this.#modal.close(),
					});
				},
			});
	}

	submitForm(): Promise<boolean> {
		this.isLoadingSave = true;

		return new Promise((res, rej) => {
			this.api
				.put(`/users/${this.nzData.userId}/condominiums`, {
					...this.form.value,
					condominios_ids: this.list.filter((item) => item.direction == 'right').map((item) => item['id']),
				})
				.pipe(
					finalize(() => {
						this.isLoadingSave = false;
					}),
				)
				.subscribe({
					next: () => res(true),
					error: (res) => {
						if (Array.isArray(res.error.message)) this.errorList = res.error.message;
						else this.errorList = [res.error.message];
						rej(false);
					},
				});
		});
	}

	onSearchDepartments(value: string = '') {
		debounce(() => {
			this.isLoadingDepartment = true;
			this.api
				.get(`/departments/active`, {
					busca: value,
					usuario_id: this.nzData.userId,
				})
				.subscribe({
					next: (res: DefaultResponse<Departamentos[]>) => {
						this.departmentsList = res.data;
					},
					error: () => {
						this.isLoadingDepartment = false;
					},
					complete: () => {
						this.isLoadingDepartment = false;
					},
				});
		}, 2);
	}

	addCondominium(id: number, checked: boolean) {
		if (!this.form.value.condominios_ids?.includes(id)) {
			if (checked) {
				this.form.patchValue({
					condominios_ids: this.form.value.condominios_ids ? [...this.form.value.condominios_ids, id] : [id],
				});
			}
		} else {
			if (!checked) {
				this.form.patchValue({
					condominios_ids: this.form.value.condominios_ids.filter((condominio_id: number) => condominio_id !== id),
				});
			}
		}
	}

	emptyListCondominiums() {
		this.form.patchValue({
			condominios_ids: [],
		});
	}

	closeErrorAlert(error: string) {
		this.errorList = this.errorList.filter((err) => err !== error);
	}

	closeModal() {
		this.#modal.close();
	}

	paginate(index: number) {
		this.getUserLinks(index);

		this.indexPage = index;
	}

	search(search: any) {
		debounce(() => {
			if (search.direction == 'left') {
				this.busca = search.value;
				this.getUserLinks();
			}
		}, 1);
	}

	filterOption(inputValue: string, item: any): boolean {
		return item.title.toLowerCase().indexOf(inputValue.toLocaleLowerCase()) > -1;
	}

	transferItems() {
		this.condominios_ids = this.list.filter((item) => item.direction == 'right').map((item) => item['id']);
	}
}
