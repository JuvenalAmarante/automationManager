import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexXAxis, ChartComponent } from 'ng-apexcharts';
import { ApiService } from 'src/app/core/services/api.service';
import { DefaultResponse, Profile } from 'src/app/shared/types';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
	profile?: Profile;
	
	ngOnInit(): void {
		this.profile = JSON.parse(localStorage.getItem('profileData') || '{}');
	}
}
