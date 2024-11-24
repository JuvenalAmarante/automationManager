import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexXAxis, ChartComponent } from 'ng-apexcharts';
import { BarChartOptions } from 'src/app/shared/types';

@Component({
	selector: 'app-bar-chart',
	templateUrl: './bar-chart.component.html',
	styleUrls: ['./bar-chart.component.less'],
})
export class BarChartComponent implements OnInit {
	@ViewChild('chart') chart!: ChartComponent;
	chartOptions!: BarChartOptions;
	@Input() options!: { series: ApexAxisChartSeries; width: string; height: number; xaxis: ApexXAxis };

	ngOnInit(): void {
		this.chartOptions = {
			series: this.options.series,
			chart: {
				type: 'bar',
				height: this.options.height,
				width: this.options.width,
				toolbar: { tools: { download: undefined } },
			},
			plotOptions: {
				bar: {
					horizontal: false,
					borderRadius: 2,
					borderRadiusApplication: 'end',
				},
			},
			xaxis: this.options.xaxis,
			tooltip: {
				y: {
					formatter: function (val) {
						return val + '';
					},
				},
			},
			dataLabels: { enabled: false },
			colors: ['#F3B415', '#F27036'],
		};
	}
}
