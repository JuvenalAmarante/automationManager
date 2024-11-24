import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApexNonAxisChartSeries, ChartComponent } from 'ng-apexcharts';
import { DonutChartOptions } from 'src/app/shared/types';

@Component({
	selector: 'app-donut-chart',
	templateUrl: './donut-chart.component.html',
	styleUrls: ['./donut-chart.component.less'],
})
export class DonutChartComponent implements OnInit {
	@ViewChild('chart') chart!: ChartComponent;
	chartOptions!: DonutChartOptions;
	@Input() options!: { labels: string[]; series: ApexNonAxisChartSeries; width: string; height: number };

	constructor() {}
	ngOnInit(): void {
		this.chartOptions = {
			series: this.options.series,
			chart: {
				type: 'donut',
				width: this.options.width,
				height: this.options.height,
			},
			dataLabels: {
				enabled: false,
			},
			labels: this.options.labels,
			responsive: [],
			legend: { position: 'bottom' },
			colors: ['#33A1FD', '#7A918D'],
		};
	}
}
