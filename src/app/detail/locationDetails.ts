import * as L from "leaflet";

export interface LocationDetails {
	latLng: L.LatLng;
	icon: string;
	label: string;
	brand?: string;
	color: string;
	marker?: L.Marker;
}