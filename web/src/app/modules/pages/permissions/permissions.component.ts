import { Component, OnInit } from '@angular/core';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.less']
})
export class PermissionsComponent implements OnInit {
  disabledTabs = { cargos: true, usuarios: true }
  constructor(private readonly permissionService: PermissionValidateService) { }

  ngOnInit(): void {
    this.permissionService.validateManyWithoutModal(['permissoes-cargos-conceder', 'permissoes-cargos-listar'], () => this.disabledTabs.cargos = false, () => this.disabledTabs.cargos = true);
    this.permissionService.validateManyWithoutModal(['permissoes-usuarios-conceder', 'permissoes-usuarios-listar'], () => this.disabledTabs.usuarios = false, () => this.disabledTabs.usuarios = true);
  }
}
