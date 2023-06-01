import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Slider} from './slider';
import {MiscService} from "../api";

@Component({
	selector: 'app-filters',
	styleUrls: ['./filters.component.css'],
	templateUrl: './filters.component.html'
})
export class FiltersComponent implements OnInit {
	propertyTypes: { key: string; label: string }[] = [
		{key: 'Room', label: 'Room'},
		{key: 'Apartment', label: 'Apartment'},
		{key: 'Studio', label: 'Studio'},
		{key: 'AntiSquat', label: 'Anti-squat'},
		{key: 'StudentResidence', label: 'Student residence'}
	];
	facilitiesRules: { key: string; label: string }[] = [
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

	propertyTypeFG: FormGroup = this.createFormGroup(this.propertyTypes);
	facilitiesRulesFG: FormGroup = this.createFormGroup(this.facilitiesRules);

	// Rent input
	rent: Slider = {
		step: 50,
		limitMin: 50,
		limitMax: 2500,
		min: null,
		max: null,
	};

	// Surface input
	surface: Slider = {
		step: 5,
		limitMin: 5,
		limitMax: 100,
		min: null,
		max: null,
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

	ngOnInit(): void {

	}

	// Receive values from query parameters
	ngAfterViewInit(): void {
		this.route.queryParamMap.subscribe((params: ParamMap) => {
			const minRent = params.get('minRent');
			const maxRent = params.get('maxRent');

			this.rent = {
				...this.rent,
				min: minRent ? parseInt(minRent, 10) : this.rent.min,
				max: maxRent ? parseInt(maxRent, 10) : this.rent.max,
			};
		});

		this.miscService.getKnownValues().subscribe(
			(response) => {
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
	countEnabledCheckboxes = (formGroup: FormGroup): string => {
		const enabledCount = Object.values(formGroup.value).filter((value) => value).length;
		return enabledCount > 0 ? `${enabledCount} selected` : '';
	};

	allCheckboxesUnselected = (formGroup: FormGroup): boolean => {
		const checkboxes = formGroup.controls;
		return !Object.values<any>(checkboxes).some((control) => control.value);
	};

	countNumberOfCities = (): string => {
		return this.citiesCount <= 0 ? '' : `${this.citiesCount} cit${this.citiesCount === 1 ? 'y' : 'ies'}`;
	};

	removeCity(city: string): void {
		const index = this.cities.indexOf(city);

		if (index >= 0) {
			this.cities.splice(index, 1);
		}

		if (!this.allCities.includes(city)) {
			this.allCities.push(city);
			this.allCities.sort();
			this.citiesCount--;
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
		const {min, max, step, limitMin, limitMax} = panel;

		let newMin = Math.floor(min / step) * step;
		let newMax = Math.floor(max / step) * step;

		if (newMax < newMin) {
			newMin = newMax - step;
		}

		if (newMax - newMin < step) {
			newMin = Math.floor(newMin / step) * step;
			newMax = newMin + step;
		}

		if (newMin === newMax) {
			newMax += step;
		}

		panel.min = Math.max(newMin, limitMin);
		panel.max = Math.min(newMax, limitMax);
	};

	private filterCities(value: string | null): string[] {
		const filterValue = value ? value.toLowerCase().replace(/[,;.\s]+$/, '') : '';
		return this.allCities.filter((city) => !this.cities.includes(city) && city.toLowerCase().includes(filterValue)).sort();
	}

	private createFormGroup(options: { key: string; label: string }[]): FormGroup {
		const formGroupConfig = options.reduce((controls: { [key: string]: any }, option) => {
			controls[option.key] = this.formBuilder.control(false);
			return controls;
		}, {});

		return this.formBuilder.group(formGroupConfig);
	}
}