import {Injectable, OnInit} from '@angular/core';
import jwt_decode from "jwt-decode";
import {BehaviorSubject, Observable} from "rxjs";

interface JWTDecoded {
	aud: string,
	iat: number,
	exp: number,
	role: [string]
}


@Injectable()
export class AuthService {

	private loggedInSubj: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public loggedIn: Observable<boolean> = this.loggedInSubj.asObservable();

	constructor() {
		this.updateLoggedIn()
	}

	public getToken(): string|null {
		return localStorage.getItem('jwt');
	}
	public isAuthenticated(): boolean {
		// get the token
		let token : string | null = this.getToken();
		if(token === null) return false;
		// return a boolean reflecting
		// whether or not the token is expired
		let decoded  = jwt_decode<JWTDecoded>(token);
		return decoded.exp > Date.now().valueOf()/1000
		// return tokenNotExpired(null, token);
	}

	public getUser() : string|undefined {
		let token = this.getToken();
		if(token && this.isAuthenticated()) return jwt_decode<JWTDecoded>(token).aud;
		return undefined;
	}

	public setToken(token: string) : void {
		localStorage.setItem('jwt', token)
		this.updateLoggedIn()
	}

	public clearToken(): void {
		localStorage.removeItem('jwt')
		this.updateLoggedIn()
	}

	private updateLoggedIn() : void {
		console.log(this.isAuthenticated())
		this.loggedInSubj.next(this.isAuthenticated())
	}
}