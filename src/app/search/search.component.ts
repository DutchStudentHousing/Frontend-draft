import {Component} from '@angular/core';
import {Router} from "@angular/router";

interface Sort {
	value: string;
	label: string;
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
		{value: 'name', label: 'Name'},
		{value: 'added', label: 'Date added'},
		{value: 'rent', label: 'Rent per month'},
		{value: 'surface', label: 'Surface'},
		{value: 'rentSurface', label: 'Rent per square metre'},
	];

	// Sorting direction
	icon: string = "south";
	direction: string = "Ascending";

	toggleIcon(event: MouseEvent): void {
		event.stopPropagation();
		this.icon = this.icon === "south" ? "north" : "south";
		this.direction = this.direction === "Ascending" ? "Descending" : "Ascending";
	}
}