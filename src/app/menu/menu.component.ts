import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LoginComponent} from "../login/login.component";

@Component({
	selector: 'app-menu',
	templateUrl: 'menu.component.html',
	styleUrls: ['menu.component.css']
})
export class MenuComponent {
	constructor(public dialog: MatDialog) {
	}

	openLoginDialog() {
		const dialogRef = this.dialog.open(LoginComponent);
	}
}