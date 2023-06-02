import {Component} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';

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
	selectedSort!: string;
	direction = "Ascending";
	filters: Sort[] = [
		{value: 'name', label: 'Name'},
		{value: 'type', label: 'Type'},
		{value: 'city', label: 'City'},
		{value: 'date_published', label: 'Date added'},
		{value: 'rent', label: 'Rent per month'},
		{value: 'sqm', label: 'Surface'},
		{value: 'rentSurface', label: 'Rent per square metre'}
	];

	constructor(private route: ActivatedRoute, private router: Router) {
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.selectedSort = params['sort'] || 'rent';
			this.direction = params['direction'] === 'ASC' ? 'Ascending' : 'Descending';
		});
		this.updateQueryParams();
	}

	onSortChange(event: string): void {
		this.selectedSort = event;
		this.updateQueryParams();
	}

	updateQueryParams(): void {
		const sortDirection = this.direction === "Ascending" ? "ASC" : "DESC";
		const queryParams: NavigationExtras = {
			relativeTo: this.route,
			queryParams: {sort: this.selectedSort, direction: sortDirection},
			queryParamsHandling: 'merge'
		};

		this.router.navigate([], queryParams).then(() => {
		});
	}

	toggleIcon(event: MouseEvent): void {
		event.stopPropagation();
		this.direction = this.direction === "Ascending" ? "Descending" : "Ascending";
		this.updateQueryParams();
	}
}