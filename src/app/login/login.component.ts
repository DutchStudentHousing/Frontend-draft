import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService, Token} from '../api'


import jwt_decode from 'jwt-decode';
import {AuthService} from "../auth/auth.service";

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

	constructor(private formBuilder: FormBuilder,
				private accountService: AccountService,
				private auth : AuthService) {
	}

	ngOnInit() {
		this.login = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
		this.registerStepOne = this.formBuilder.group({
			new_username: ['', Validators.required],
			new_password: ['', Validators.required],
			new_email: ['', [Validators.required, Validators.email]]
		});
	}

	handleLogin($event: any) : void {
		console.log($event);
		let loginReq = {
			email: this.login.get("username")?.value,
			password: this.login.get("password")?.value
		}
		this.accountService.login$Json({body: loginReq})
			.subscribe((token: Token) => {
				if(token.token !== undefined) {
					this.auth.setToken(token.token);
					console.log(jwt_decode(token.token));
				} else {
					console.log("couldn't log in!")
				}
			})
	}
}