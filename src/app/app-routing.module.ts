import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DetailComponent} from "./detail/detail.component";
import {SearchComponent} from "./search/search.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'search', component: SearchComponent},
	{path: 'detail', component: DetailComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}