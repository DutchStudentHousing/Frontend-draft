import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MenuComponent} from './menu/menu.component';
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {PropertiesComponent} from './properties/properties.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {PropertyComponent} from './properties/property/property.component';
import {MatCardModule} from "@angular/material/card";
import {MatSidenavModule} from "@angular/material/sidenav";
import {FiltersComponent} from './filters/filters.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatInputModule} from "@angular/material/input";
import {MatBadgeModule} from "@angular/material/badge";
import {MatDividerModule} from "@angular/material/divider";
import {MatChipsModule} from "@angular/material/chips";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSliderModule} from "@angular/material/slider";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from "@angular/material/tooltip";
import {LoginComponent} from './login/login.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {MatStepperModule} from "@angular/material/stepper";
import {MatMenuModule} from "@angular/material/menu";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
	bootstrap: [AppComponent, MenuComponent, PropertiesComponent],
	declarations: [
		AppComponent,
		MenuComponent,
		PropertiesComponent,
		PropertyComponent,
		FiltersComponent,
		LoginComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
		MatButtonModule,
		MatGridListModule,
		MatCardModule,
		MatSidenavModule,
		MatExpansionModule,
		MatInputModule,
		MatBadgeModule,
		MatDividerModule,
		MatChipsModule,
		MatPaginatorModule,
		MatSliderModule,
		MatButtonToggleModule,
		MatSlideToggleModule,
		FormsModule,
		MatDatepickerModule,
		MatInputModule,
		MatNativeDateModule,
		MatTooltipModule,
		MatDialogModule,
		MatTabsModule,
		MatStepperModule,
		ReactiveFormsModule,
		MatMenuModule,
		MatListModule,
		MatSelectModule,
		MatCheckboxModule
	],
	providers: []
})

export class AppModule {
}