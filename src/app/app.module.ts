import {NgModule} from '@angular/core';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatBadgeModule} from "@angular/material/badge";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatChipsModule} from "@angular/material/chips";
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSliderModule} from "@angular/material/slider";
import {MatStepperModule} from "@angular/material/stepper";
import {MatTabsModule} from "@angular/material/tabs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FiltersComponent} from './filters/filters.component';
import {LoginComponent} from './login/login.component';

import {MenuComponent} from './menu/menu.component';
import {SearchGridComponent} from './search-grid/search-grid.component';
import {SearchComponent} from './search/search.component';
import {DetailComponent} from './detail/detail.component';
import {HomeComponent} from './home/home.component';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {SearchMapComponent} from './search-map/search-map.component';
import {FooterComponent} from './footer/footer.component';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {HttpClientModule} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ApiModule} from "./api";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
	bootstrap: [MenuComponent, AppComponent, FooterComponent],
	declarations: [
		AppComponent,
		MenuComponent,
		SearchComponent,
		FiltersComponent,
		LoginComponent,
		SearchGridComponent,
		DetailComponent,
		HomeComponent,
		SearchMapComponent,
		FooterComponent
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
		MatCheckboxModule,
		MatAutocompleteModule,
		MatRippleModule,
		LeafletModule,
		HttpClientModule,
		MatProgressSpinnerModule,
		ApiModule.forRoot({rootUrl: import.meta.env.NG_APP_BACKEND + '/api'}),
		MatProgressBarModule
	],
	providers: [
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: {appearance: 'outline', floatLabel: 'always', subscriptSizing: 'dynamic'}
		}
	]
})

export class AppModule {
}