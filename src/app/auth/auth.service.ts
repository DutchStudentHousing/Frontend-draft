import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";

interface JWTDecoded {
	aud: string,
	iat: number,
	exp: number
}

@Injectable()
export class AuthService {
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
		return decoded.exp > Date.now()
		// return tokenNotExpired(null, token);
	}
}