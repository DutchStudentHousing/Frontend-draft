// src/app/auth/token.interceptor.ts
import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(public auth: AuthService) {}
	intercept(request: HttpRequest<any>, next: HttpHandler):
		Observable<HttpEvent<any>> {

		let token = this.auth.getToken();
		if(token) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${this.auth.getToken()}`
				}
			});
		}

		console.log(request)

		return next.handle(request);
	}
}