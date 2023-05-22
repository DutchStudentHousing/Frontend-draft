import {Component} from '@angular/core';
import {Router} from "@angular/router";

interface Sort {
	value: string;
	viewValue: string;
}

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent {
	constructor(private router: Router) {
	}

	isRouteActive(routePath: string): boolean {
		return this.router.url === routePath;
	}

	filters: Sort[] = [
		{value: 'name', viewValue: 'Name'},
		{value: 'added', viewValue: 'Date added'},
		{value: 'rent', viewValue: 'Rent per month'},
		{value: 'surface', viewValue: 'Surface'},
		{value: 'rentSurface', viewValue: 'Rent per square metre'},
	];

	icon = 'south';

	toggleIcon = () => {
		this.icon = this.icon === 'south' ? 'north' : 'south';
	};
}