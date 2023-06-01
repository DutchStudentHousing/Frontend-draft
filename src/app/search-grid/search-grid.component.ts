import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MiscService, Property, PropertyService} from '../api';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Component({
	selector: 'app-search-grid',
	templateUrl: './search-grid.component.html',
	styleUrls: ['./search-grid.component.css']
})
export class SearchGridComponent implements OnInit {
	properties!: Observable<Property[]>;
	pageSize = 16;
	pageIndex = 0;
	totalItems: number | undefined = 0;
	loading: boolean = false;
	error!: string;

	constructor(
		private propertyService: PropertyService,
		private miscService: MiscService,
		private route: ActivatedRoute,
		private router: Router
	) {
	}

	ngOnInit(): void {
		// Subscribe to the query parameters in the URL
		this.route.queryParams.subscribe(params => {
			const page = Number(params['page']) || 1;
			const sort = params['sort'] + "," + params['direction'];
			this.pageIndex = page - 1;
			this.pageSize = params['size'] || this.pageSize;
			const minRent = params['minRent'];
			const maxRent = params['maxRent'];
			this.getProperties(page, this.pageSize, sort, minRent, maxRent);
		});

		// Fetch the total number of properties from the server
		this.miscService.getKnownValues().subscribe(
			response => {
				this.totalItems = response.propertyCount;
			},
			error => {
				console.error(error);
			}
		);
	}

	// Fetches the properties from the server based on the provided page, size, and sort parameters
	getProperties(page: number, size: number, sort?: string, min?: number, max?: number): void {
		this.loading = true;
		this.properties = this.propertyService.getProperties$Json({page, size, sort, min, max}).pipe(
			catchError((error: any) => {
				console.error(error);
				this.error = error;
				return throwError('An error occurred while loading the properties.');
			})
		);
	}

	// Handles the error when an image fails to load by setting a default image source
	handleImageError(event: any): void {
		event.target.src = "https://resources.kamernet.nl/Content/images/placeholder/no-pic-advert.png";
	}

	// Handles the pagination event when the page is changed
	onPageChange(event: any): void {
		const pageIndex = event.pageIndex;
		const nextPage = pageIndex + 1;

		// Update query params in the URL
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {page: nextPage, size: event.pageSize},
			queryParamsHandling: 'merge'
		});

		this.getProperties(nextPage, event.pageSize);
	}
}