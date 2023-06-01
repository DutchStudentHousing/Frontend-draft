import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Slider} from "../filters/slider";
import {MiscService} from "../api";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {
	totalItems: number | undefined = 0;
	allCities: string[] | undefined = [];

	search = new FormGroup({
		query: new FormControl(),
		minRent: new FormControl(),
		maxRent: new FormControl()
	});

	rent: Slider = {
		step: 50,
		limitMin: 50,
		limitMax: 5000,
		min: null,
		max: null
	};

	constructor(
		private miscService: MiscService,
	) {
	}

	ngOnInit(): void {
		this.miscService.getKnownValues().subscribe(
			response => {
				if (response) {
					this.totalItems = response.propertyCount;
				}
			},
			error => {
				console.error(error);
			}
		);
	}
}