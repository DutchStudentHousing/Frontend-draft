import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Property, PropertyDetails, PropertyService} from '../api';
import {Observable, switchMap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Location} from '@angular/common';

@Component({
	selector: 'app-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
	id: string | null = null;
	details!: Observable<PropertyDetails>;
	nearbyProperties!: Observable<Property[]>;
	lat: number | undefined; // Update to 'number | undefined'
	lon: number | undefined; // Update to 'number | undefined'
	loading = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private propertyService: PropertyService
	) {
	}

	ngOnInit() {
		this.loading = true;
		this.route.queryParams.subscribe(params => {
			this.id = params['id'] || null;
		});

		this.getDetails(this.id);
	}

	getDetails(id: string | null): void {
		if (id) {
			this.details = this.propertyService.propertyIdGet({id}).pipe(
				catchError((error: any) => {
					console.error(error);
					return throwError('An error occurred while loading the property details.');
				})
			);

			this.nearbyProperties = this.details.pipe(
				switchMap((details: PropertyDetails) => {
					this.lat = details.property_lat;
					this.lon = details.property_long;
					return this.propertyService.getProperties$Json({
						lat: this.lat,
						long: this.lon,
						size: 10,
						distance: 20,
						sort: 'lat,long'
					}).pipe(
						catchError((error: any) => {
							console.error(error);
							return throwError('An error occurred while loading the nearby properties.');
						})
					);
				})
			);
		}
	}

	handleImageError(event: any): void {
		event.target.src = "https://resources.kamernet.nl/Content/images/placeholder/no-pic-advert.png";
	}

	// Navigate to section
	navigateToAnchor(anchorId: string) {
		this.router.navigate([], {fragment: anchorId, queryParamsHandling: 'merge'});
	}

	navigateToProperty(newId: string | undefined) {
		const id = newId || '';
		const queryParams = {...this.route.snapshot.queryParams, id};
		this.router.navigate([], {queryParams, queryParamsHandling: 'merge'})
			.then(() => {
				this.getDetails(id);
			});
	}
}