import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ActivatedRoute, NavigationExtras, ParamMap, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Slider} from './slider';
import {MiscService} from "../api";
import {CheckboxOptions} from "./checkboxOptions";

@Component({
	selector: 'app-filters',
	styleUrls: ['./filters.component.css'],
	templateUrl: './filters.component.html'
})
export class FiltersComponent {
	// Property types
	propertyTypes: CheckboxOptions[] = [
		{key: 'Room', label: 'Room'},
		{key: 'Apartment', label: 'Apartment'},
		{key: 'Studio', label: 'Studio'},
		{key: 'AntiSquat', label: 'Anti-squat'},
		{key: 'StudentResidence', label: 'Student residence'}
	];

	// Facilities and rules
	facilitiesRules: CheckboxOptions[] = [
		{key: 'furnished', label: 'Furnished'},
		{key: 'internet', label: 'Internet included'},
		{key: 'utilities', label: 'Utilities included'},
		{key: 'pets', label: 'Pets allowed'},
		{key: 'smoking', label: 'Smoking allowed'}
	];

	// Energy label input
	energyLabels: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];

	rooms = [
		{
			name: 'Kitchen',
			controlName: 'kitchen',
			options: [
				{value: 'own', icon: 'face', label: 'Own', formControl: new FormControl(false)},
				{value: 'shared', icon: 'groups', label: 'Shared', formControl: new FormControl(false)}
			]
		},
		{
			name: 'Bathroom',
			controlName: 'bathroom',
			options: [
				{value: 'own', icon: 'face', label: 'Own', formControl: new FormControl(false)},
				{value: 'shared', icon: 'groups', label: 'Shared', formControl: new FormControl(false)}
			]
		},
		{
			name: 'Living room',
			controlName: 'living_room',
			options: [
				{value: 'own', icon: 'face', label: 'Own', formControl: new FormControl(false)},
				{value: 'shared', icon: 'groups', label: 'Shared', formControl: new FormControl(false)}
			]
		}
	];

	// Rent input
	rent: Slider = {
		step: 50,
		limitMin: 0,
		limitMax: 2500
	};

	// Surface input
	surface: Slider = {
		step: 5,
		limitMin: 5,
		limitMax: 100,
		min: 5,
		max: 100,
	};

	// City selector
	separatorKeysCodes = [ENTER, COMMA];
	selectedLabels: string[] = [];
	citiesFormControl = new FormControl();
	filteredCities!: Observable<string[]>;
	cities: string[] = [];
	allCities: string[] = [];
	citiesCount = 0;
	@ViewChild('cityInput') cityInput!: ElementRef<HTMLInputElement>;

	constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private miscService: MiscService) {
	}

	// Receive values from query parameters
	ngAfterViewInit(): void {
		this.route.queryParamMap.subscribe((params: ParamMap) => {
			const minRent = params.get('minRent');
			const maxRent = params.get('maxRent');
			const minSqm = params.get('minSqm');
			const maxSqm = params.get('maxSqm');
			const propertyTypes = params.get('type');
			const city = params.get('city');
			if (city !== null) {
				const cities = city.split(',');
				cities.forEach(cityValue => {
					if (!this.cities.includes(cityValue)) {
						this.cities.push(cityValue);
						this.citiesCount++;
					}
				});
			}

			this.rent = {
				...this.rent,
				min: minRent ? parseInt(minRent, 10) : (maxRent ? 0 : null),
				max: maxRent ? parseInt(maxRent, 10) : null,
			};

			this.surface = {
				...this.surface,
				min: minSqm ? parseInt(minSqm, 10) : (maxSqm ? 0 : null),
				max: maxSqm ? parseInt(maxSqm, 10) : null,
			};

			if (propertyTypes) {
				const selectedPropertyTypes = propertyTypes.split(',');
				this.propertyTypes.forEach(propertyType => {
					propertyType.selected = selectedPropertyTypes.includes(propertyType.key);
				});
			}
		});

		this.miscService.getKnownValues().subscribe(
			(response) => {
				this.rent = {
					...this.rent,
					limitMin: response.minRent ?? this.rent.limitMin,
					limitMax: response.maxRent ?? this.rent.limitMax,
				};

				this.surface = {
					...this.surface,
					limitMin: response.minSqm ?? 5,
					limitMax: response.maxSqm ?? 750,
				};

				if (response && response.cities) {
					this.allCities = response.cities.sort();
					this.filteredCities = this.citiesFormControl.valueChanges.pipe(
						startWith(null),
						map((value) => this.filterCities(value))
					);
				}
			},
			(error) => {
				console.error(error);
			}
		);
	}

	// Check filter status
	countEnabledCheckboxes = (panel: CheckboxOptions[]): string => {
		const enabledCount = panel.filter(option => option.selected).length;
		return enabledCount === 0 ? '' : `${enabledCount} selected`;
	};

	countNumberOfCities = (): string => {
		return this.citiesCount <= 0 ? '' : `${this.citiesCount} cit${this.citiesCount === 1 ? 'y' : 'ies'}`;
	};

	removeCity(city: string): void {
		const index = this.cities.indexOf(city);

		if (index >= 0) {
			this.cities.splice(index, 1);
			this.citiesCount--;
		}

		if (!this.allCities.includes(city)) {
			this.allCities.push(city);
			this.allCities.sort();
			(this.citiesFormControl.valueChanges as Subject<any>).next(this.citiesFormControl.value);
		}

		this.filteredCities = this.citiesFormControl.valueChanges.pipe(
			startWith(null),
			map((value) => this.filterCities(value))
		);
	}

	selectedCity(event: MatAutocompleteSelectedEvent): void {
		const selectedCity = event.option.viewValue;

		if (!this.cities.includes(selectedCity) && this.allCities.includes(selectedCity)) {
			this.cities.push(selectedCity);
			const index = this.allCities.indexOf(selectedCity);
			this.allCities.splice(index, 1);
			this.citiesCount++;
		}

		this.cityInput.nativeElement.value = '';
		this.cityInput.nativeElement.focus();
		this.citiesFormControl.setValue(null);
	}

	// Slider panels
	updatePanel = (panel: any) => {
		let {min, max, step, limitMin, limitMax} = panel;

		if (min === null && max === null) return;

		min = min !== null ? Number(min) : null;
		max = max !== null ? Number(max) : null;

		let newMin = min !== null ? Math.floor(min / step) * step : null;
		let newMax = max !== null ? Math.floor(max / step) * step : null;

		if (newMax !== null && newMin !== null && newMax < newMin) newMin = newMax - step;

		if (newMax !== null && newMin !== null && newMax - newMin < step) {
			newMin = Math.floor(newMin / step) * step;
			newMax = newMin + step;
		}

		panel.min = newMin !== null && limitMin !== null ? Math.max(newMin, limitMin) : newMin;
		panel.max = newMax !== null && limitMax !== null ? Math.min(newMax, limitMax) : newMax;
	};

	private filterCities(value: string | null): string[] {
		const filterValue = value ? value.toLowerCase().replace(/[,;.\s]+$/, '') : '';
		return this.allCities.filter((city) => !this.cities.includes(city) && city.toLowerCase().includes(filterValue)).sort();
	}

	update(): void {
		const selectedProperties = this.propertyTypes
			.filter(property => property.selected)
			.map(property => property.key)
			.join(',');

		const queryParams: any = {
			type: selectedProperties,
			minRent: this.rent.min,
			maxRent: this.rent.max,
			minSqm: this.surface.min,
			maxSqm: this.surface.max,
			city: this.cities.length > 0 ? this.cities.join(',') : null,
		};

		const navigationExtras: NavigationExtras = {
			relativeTo: this.route,
			queryParams,
			queryParamsHandling: 'merge',
			preserveFragment: true,
		};

		this.router.navigate([], navigationExtras);
	}
}