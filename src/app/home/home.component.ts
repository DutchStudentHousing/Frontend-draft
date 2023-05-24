import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Slider} from "../filters/slider";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {
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
}