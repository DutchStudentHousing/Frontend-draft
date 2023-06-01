import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Property, PropertyDetails, PropertyService} from "../api";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Location} from '@angular/common';

@Component({
	selector: 'app-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
	id!: string;
	details!: Observable<PropertyDetails>;
	loading: boolean = false;

	// Property details
	constructor(private route: ActivatedRoute, private router: Router, private location: Location, private propertyService: PropertyService) {
	}

	ngOnInit() {
		this.loading = true;
		this.route.queryParams.subscribe(params => {
			this.id = params['id'] || null;
		});

		this.getDetails(this.id);
	}

	getDetails(id: string): void {
		this.details = this.propertyService.propertyIdGet({id}).pipe(
			catchError((error: any) => {
				console.error(error);
				return throwError('An error occurred while loading the properties.');
			})
		);
	}

	// Navigate to section
	navigateToAnchor(anchorId: string) {
		this.router.navigate([], {fragment: anchorId, queryParamsHandling: 'merge'});
	}
}