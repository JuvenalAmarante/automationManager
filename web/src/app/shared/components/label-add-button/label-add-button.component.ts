import { NzModalService } from "ng-zorro-antd/modal";
import { PermissionValidateService } from "src/app/core/services/permission-validate.service";
import { UsersCreateComponent } from "src/app/modules/pages/users/users-create/users-create.component";
import { OcupationsCreateComponent } from "src/app/modules/pages/ocupations/ocupations-create/ocupations-create.component";
import { DocumentTypeCreateComponent } from "src/app/modules/pages/documents/document-type-create/document-type-create.component";
import { ContractTypesCondominiumCreateComponent } from "src/app/modules/pages/contract-types-condominium/contract-types-condominium-create/contract-types-condominium-create.component";
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  Type,
} from "@angular/core";

@Component({
  selector: "app-label-add-button",
  templateUrl: "./label-add-button.component.html",
  styleUrls: ["./label-add-button.component.less"],
})
export class LabelAddButtonComponent implements OnChanges {
  @Input() title: string = "";
  @Input() width: string = "40%";
  @Input() modalData: object = {};
  @Input() permission: string = "";
  @Input() tooltipText: string = "";
  @Input() onClose: Function | undefined = () => {};
  @Input() type?:
    | "department"
    | "contract-type"
    | "subsidiary"
    | "infraction"
    | "ocupation"
    | "protocol-document-type"
    | "physical-package"
    | "package-route"
    | "user";

  component: string | TemplateRef<any> | Type<unknown> | undefined;
  hasPermission: boolean = false;

  constructor(
    private readonly modalService: NzModalService,
    private readonly permissionService: PermissionValidateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.permissionService.validate(
      this.permission,
      () => {
        this.hasPermission = true;
      },
      () => {},
      false
    );

    switch (this.type) {
      case "contract-type":
        this.component = ContractTypesCondominiumCreateComponent;
        break;

      case "ocupation":
        this.component = OcupationsCreateComponent;
        break;

      case "protocol-document-type":
        this.component = DocumentTypeCreateComponent;
        break;

      case "user":
        this.component = UsersCreateComponent;
        break;

      default:
        break;
    }
  }

  showModal() {
    this.permissionService.validate(this.permission, () => {
      this.modalService
        .create({
          nzContent: this.component,
          nzTitle: this.title,
          nzData: { ...this.modalData, isModal: true },
          nzWidth: this.width,
          nzFooter: null,
        })
        .afterClose.subscribe((res) => {
          if(this.onClose)
          this.onClose("");
        });
    });
  }
}
