import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	login!: FormGroup;
	registerStepOne!: FormGroup;
	secondFormGroup = this.formBuilder.group({
		secondCtrl: ['', Validators.required],
	});

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit() {
		this.login = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
		this.registerStepOne = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
			email: ['', Validators.required, Validators.email]
		});
	}
}