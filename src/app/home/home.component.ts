import {Component} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {Slider} from "../filters/slider";
import {MiscService} from "../api";
import {Observable, of} from "rxjs";
import {Router} from "@angular/router";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {
	totalItems: number | undefined = 0;
	cities: Observable<string[]> | undefined;

	search = new FormGroup({
		query: new FormControl(''),
		minRent: new FormControl(''),
		maxRent: new FormControl('')
	}, {
		validators: [this.validateRentRange.bind(this) as ValidatorFn]
	});
	rent: Slider = {
		step: 50,
		limitMin: 0,
		limitMax: 5000,
		min: null,
		max: null
	};

	constructor(private router: Router, private miscService: MiscService) {
	}

	ngOnInit(): void {
		this.miscService.getKnownValues().subscribe(
			response => {
				if (response) {
					this.totalItems = response.propertyCount;
					this.cities = response.cities ? of(response.cities.sort()) : undefined;
					this.rent = {
						...this.rent,
						limitMin: response.minRent ?? 50,
						limitMax: response.maxRent ?? 5000,
					};
				}
			},
			error => {
				console.error(error);
			}
		);
	}

	updateRentInputs() {
		const minRentValue = this.search.controls.minRent.value;
		const maxRentValue = this.search.controls.maxRent.value;

		if (minRentValue === '' || maxRentValue === '') {
			// Handle empty fields
			return;
		}

		const minRent = Number(minRentValue);
		const maxRent = Number(maxRentValue);
		const step = Number(this.rent.step);
		const limitMin = Number(this.rent.limitMin);
		const limitMax = Number(this.rent.limitMax);

		if (maxRent - minRent < step && minRent + step <= limitMax) {
			const newMaxRent = Math.min(Math.ceil((minRent + step) / step) * step, limitMax);
			this.search.controls.maxRent.setValue(newMaxRent.toString());
		}

		if (minRent + step > maxRent && maxRent - step >= limitMin) {
			const newMinRent = Math.max(Math.floor((maxRent - step) / step) * step, limitMin);
			this.search.controls.minRent.setValue(newMinRent.toString());
		}
	}


	validateRentRange(formGroup: FormGroup) {
		const minRent = formGroup.get('minRent')?.value;
		const maxRent = formGroup.get('maxRent')?.value;
		const step = this.rent?.step;

		if (typeof minRent === 'number' && typeof maxRent === 'number' && typeof step === 'number') {
			if (minRent > maxRent || maxRent - minRent < step || !Number.isInteger((maxRent - minRent) / step)) {
				return {rentDifference: true};
			}
		}

		return null;
	}

	submit() {
		const cities = Object.values(this.search?.value?.query ?? {}).join(',');

		this.router.navigate(['/search'], {
			queryParams: {
				city: cities || null,
				minRent: this.search?.value?.minRent || null,
				maxRent: this.search?.value?.maxRent || null
			},
			queryParamsHandling: 'merge'
		});
	}
}