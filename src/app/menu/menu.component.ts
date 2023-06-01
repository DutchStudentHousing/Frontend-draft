import {Component} from '@angular/core';
import {OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LoginComponent} from "../login/login.component";

@Component({
	selector: 'app-menu',
	templateUrl: 'menu.component.html',
	styleUrls: ['menu.component.css']
})
export class MenuComponent implements OnInit{
	token!: string | null;

	constructor(public dialog: MatDialog) {
	}
	 ngOnInit() {
        this.token = localStorage.getItem('jwt');
     }
	openLoginDialog() {
		const dialogRef = this.dialog.open(LoginComponent);
	}
	  logout() {

        localStorage.removeItem('jwt');

}
}