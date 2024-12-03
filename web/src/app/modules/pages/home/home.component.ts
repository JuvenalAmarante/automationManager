import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/shared/types';

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
