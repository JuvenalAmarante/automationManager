import { NgModule } from '@angular/core';

import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzTransButtonModule } from 'ng-zorro-antd/core/trans-button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
const antDesignIcons = AllIcons as {
	[key: string]: IconDefinition;
};

const icons: IconDefinition[] = Object.keys(antDesignIcons).map((key) => {
	const i = antDesignIcons[key];
	return i;
});

@NgModule({
	exports: [
		NzAffixModule,
		NzSpaceModule,
		NzDropDownModule,
		NzAlertModule,
		NzAnchorModule,
		NzAutocompleteModule,
		NzAvatarModule,
		NzBackTopModule,
		NzBadgeModule,
		NzButtonModule,
		NzBreadCrumbModule,
		NzCalendarModule,
		NzCardModule,
		NzIconModule,
		NzCarouselModule,
		NzCascaderModule,
		NzCheckboxModule,
		NzCollapseModule,
		NzCommentModule,
		NzDatePickerModule,
		NzDropDownModule,
		NzDescriptionsModule,
		NzDividerModule,
		NzEmptyModule,
		NzFormModule,
		NzGridModule,
		NzImageModule,
		NzInputModule,
		NzInputNumberModule,
		NzLayoutModule,
		NzListModule,
		NzMentionModule,
		NzMenuModule,
		NzMessageModule,
		NzModalModule,
		NzNoAnimationModule,
		NzNotificationModule,
		NzPageHeaderModule,
		NzPaginationModule,
		NzPopoverModule,
		NzProgressModule,
		NzPopconfirmModule,
		NzRadioModule,
		NzRateModule,
		NzResultModule,
		NzSelectModule,
		NzSkeletonModule,
		NzSpaceModule,
		NzSpinModule,
		NzStepsModule,
		NzSwitchModule,
		NzTableModule,
		NzTabsModule,
		NzTagModule,
		NzTimePickerModule,
		NzToolTipModule,
		NzTransButtonModule,
		NzTransferModule,
		NzUploadModule,
		NzResizableModule,
		NzPipesModule,
		NzSpaceModule,
		NzTreeModule,
		NzDropDownModule,
		NzTagModule,
		NzTimelineModule,
	],
	providers: [
		{
			provide: NZ_ICONS,
			useValue: icons,
		},
	],
})
export class NgZorroModule {}
