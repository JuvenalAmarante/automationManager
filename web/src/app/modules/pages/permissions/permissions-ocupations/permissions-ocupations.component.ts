import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { debounce } from 'src/app/shared/helpers';
import { Cargo, DefaultResponse, Permission, PermissionListMounted } from 'src/app/shared/types';

@Component({
	selector: 'app-permissions-ocupations',
	templateUrl: './permissions-ocupations.component.html',
	styleUrls: ['./permissions-ocupations.component.less'],
})
export class PermissionsOcupationsComponent implements OnInit {
	permissionList!: NzTreeNode[];
	validateForm: FormGroup;
	permissions: PermissionListMounted = {};
	cargos!: Cargo[];
	node: NzTreeNode[] = [];
	isSaving: boolean = false;
	invalidForm = false;

	constructor(private readonly fb: UntypedFormBuilder, private readonly api: ApiService) {
		this.validateForm = fb.group({
			cargo_id: [null, Validators.required],
		});
	}

	ngOnInit(): void {
		this.getOcupations();
	}

	getOcupations() {
		this.api.get('/ocupations/active').subscribe({
			next: (res: DefaultResponse<Cargo[]>) => {
				this.cargos = res.data;
			},
		});
	}

	getPermissions(cargo_id: Event) {
		if (this.validateForm.get('cargo_id')?.value)
			this.api.get('/permissions/cargo/' + cargo_id).subscribe({
				next: (res: DefaultResponse<Permission[]>) => {
					this.permissions = this.groupByKey(res.data, 'module');
					this.mountTreeNode();
				},
			});
	}

	mountTreeNode() {
		let parent: NzTreeNodeOptions = {
			title: 'Marcar todos',
			key: 'tudo',
			checked: false,
			expanded: true,
			children: [],
		};
		const array: NzTreeNodeOptions[] = [];
		Object.keys(this.permissions).forEach((key) => {
			array.push({
				checked: this.permissions[key].every((item) => !!item.cargos && !!item.cargos.length),
				title: key,
				key: key,
				isHalfChecked: true,
				children: this.permissions[key].map((item) => ({
					title: item.label,
					checked: !!item.cargos && !!item.cargos.length,
					key: item.id.toString(),
					isLeaf: true,
				})),
			});
		});

		parent.children = array;
		parent.checked = parent.children?.every((item) => item.checked);
		this.node = [new NzTreeNode(parent)];

		this.node[0].isHalfChecked = parent.children?.some((item) => item.checked) && !parent.children?.every((item) => item.checked);

		this.node[0].children.forEach(
			(item) => (item.isHalfChecked = item.children.some((perm) => perm.isChecked) && !item.children.every((perm) => perm.isChecked)),
		);
		this.permissionList = this.node;
	}

	groupByKey(array: Permission[], key: string): any {
		if (!array || !key) {
			return [];
		}

		return array.reduce((acc: any, obj: any) => {
			if (!obj || !obj[key]) {
				return acc;
			}

			(acc[obj[key]] = acc[obj[key]] || []).push(obj);
			return acc;
		}, {});
	}

	search(event: string) {
		debounce(() => {
			if (event.length) {
				this.invalidForm = true;
			} else {
				this.invalidForm = false;
			}
			let parent: NzTreeNodeOptions = {
				title: 'Marcar todos',
				key: 'tudo',
				checked: false,
				expanded: true,
				children: this.permissionList[0]?.origin?.children?.filter(
					(item) =>
						item.title.toLowerCase().includes(event.toLowerCase()) ||
						!!item.children?.filter((child) => child.title.toLowerCase().includes(event.toLowerCase())).length,
				),
			};

			this.node = [new NzTreeNode(parent)];
			this.node[0].isChecked = this.node[0].children.every((item) => item.isChecked);
			this.node[0].isHalfChecked = this.node[0].children?.some((item) => item.isChecked) && !parent.children?.every((item) => item.checked);

			this.node[0].children.forEach(
				(item) => (item.isHalfChecked = item.children.some((perm) => perm.isChecked) && !item.children.every((perm) => perm.isChecked)),
			);
		});
	}

	handleSubmit({ cargo_id }: { cargo_id: number }) {
		this.isSaving = true;
		let permissoes: number[] = [];
		this.node[0]?.children?.forEach((item) => {
			const children: NzTreeNodeOptions[] = !!item.children ? item.children.filter((item) => item.isChecked) : [];
			permissoes = [...permissoes, ...children.map((item) => +item.key)];
		});

		this.api
			.put('/permissions/cargo/' + cargo_id, { permissoes })
			.pipe(finalize(() => (this.isSaving = false)))
			.subscribe({
				next: (res: DefaultResponse<any>) => {},
			});
	}

	updateListBackup() {
		this.node.forEach((item) => {
			this.permissionList.forEach((permission) => {
				if (item.key == permission.key) {
					permission = item;
				}
			});
		});
	}

	resetForm() {
		this.validateForm.get('cargo_id')?.setValue(null);
	}
}
