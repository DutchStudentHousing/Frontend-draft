import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
//import {UserSearchComponent} from './usersearch/usersearch.component';
import {DetailComponent} from "./detail/detail.component";
import {SearchComponent} from "./search/search.component";
import {HomeComponent} from "./home/home.component";
import {SearchGridComponent} from "./search-grid/search-grid.component";
import {SearchMapComponent} from "./search-map/search-map.component";

const routes: Routes = [
	{path: '', component: HomeComponent},
	{
		path: 'search',
		component: SearchComponent,
		children: [
			{path: '', redirectTo: 'list', pathMatch: 'full'},
			{path: 'list', component: SearchGridComponent},
			{path: 'map', component: SearchMapComponent}
		]
	},
	{path: 'detail', component: DetailComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', scrollOffset: [24, 24]})],
	exports: [RouterModule]
})
export class AppRoutingModule {
}