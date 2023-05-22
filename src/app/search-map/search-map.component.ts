import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import {LocationDetails} from "../detail/locationDetails";

@Component({
	selector: 'app-search-map',
	templateUrl: './search-map.component.html',
	styleUrls: ['./search-map.component.css']
})
export class SearchMapComponent implements OnInit {
	options: L.MapOptions = {
		layers: [],
		preferCanvas: true
	};

	nearbyLocations: LocationDetails[] = [
		{
			latLng: new L.LatLng(52.0065142, 4.3556781),
			icon: 'school',
			label: 'Delft University of Technology',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(51.4488437, 5.4906804),
			icon: 'school',
			label: 'Eindhoven University of Technology',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(51.9184853, 4.4770369),
			icon: 'school',
			label: 'Erasmus University Rotterdam',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(52.1561116, 4.4857),
			icon: 'school',
			label: 'Leiden University',
			color: 'primary'
		},
		/*		{
					latLng: new L.LatLng(50.8483876, 5.6888897),
					icon: 'school',
					label: 'Maastricht University',
					color: 'primary'
				},*/
		{
			latLng: new L.LatLng(51.9883572, 5.8951989),
			icon: 'school',
			label: 'Open University of the Netherlands',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(51.8315085, 5.8662356),
			icon: 'school',
			label: 'Radboud University Nijmegen',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(51.563337, 5.0808359),
			icon: 'school',
			label: 'Tilburg University',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(52.3590441, 4.9081717),
			icon: 'school',
			label: 'University of Amsterdam',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(53.2217179, 6.5620807),
			icon: 'school',
			label: 'University of Groningen',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(52.2789882, 6.8583589),
			icon: 'school',
			label: 'University of Twente',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(52.0799838, 5.1190424),
			icon: 'school',
			label: 'Utrecht University',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(52.3339291, 4.8658103),
			icon: 'school',
			label: 'Vrije Universiteit Amsterdam',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(51.9666427, 5.668853),
			icon: 'school',
			label: 'Wageningen University and Research',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(52.3797457, 4.9120797),
			icon: 'school',
			label: 'Amsterdam University of Applied Sciences',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(51.913991, 4.471373),
			icon: 'school',
			label: 'Rotterdam University of Applied Sciences',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(52.0704716, 4.3181782),
			icon: 'school',
			label: 'The Hague University of Applied Sciences',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(51.4522889, 5.4812186),
			icon: 'school',
			label: 'Fontys University of Applied Sciences',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(51.827574, 5.8704004),
			icon: 'school',
			label: 'HAN University of Applied Sciences',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(52.254088, 6.170986),
			icon: 'school',
			label: 'Saxion University of Applied Sciences',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(51.696947, 5.3119384),
			icon: 'school',
			label: 'Avans University of Applied Sciences',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(53.2195459, 6.5389826),
			icon: 'school',
			label: 'Hanze University of Applied Sciences',
			color: 'primary'
		}
	];

	mapInstance!: L.Map;

	ngOnInit() {
		if (!this.mapInstance) {
			const map = L.map('map');

			L.tileLayer('https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
				attribution: '&copy; OpenStreetMap contributors'
			}).addTo(map);

			const markersLayer = new L.MarkerClusterGroup({
				iconCreateFunction: (cluster) => {
					const childMarkers = cluster.getAllChildMarkers();
					const childColors = new Set(childMarkers.map(marker => this.nearbyLocations.find(location => location.latLng.equals(marker.getLatLng()))?.color ?? 'primary'));
					const clusterColor = childColors.has('warn') ? 'warn' : 'primary';
					const count = cluster.getChildCount();

					return L.divIcon({
						html: `<button class="mdc-fab mdc-fab--mini mat-mdc-mini-fab mat-${clusterColor} mat-mdc-button-base" title="${count} locations near each other"><span class="mdc-button__label">${count}</span></button>`,
						className: 'custom-cluster-icon',
						iconSize: [40, 40],
						iconAnchor: [20, 40]
					});
				}
			});

			const markerLatLngs: L.LatLng[] = [];

			this.nearbyLocations.forEach((markerData) => {
				const markerIcon = L.divIcon({
					html: `<button class="mdc-fab mdc-fab--mini mat-mdc-mini-fab mat-${markerData.color} mat-mdc-button-base" title="${markerData.label}"><mat-icon role="img" class="mat-icon notranslate material-icons mat-ligature-font mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font">${markerData.icon}</mat-icon><span class="mdc-button__label"></span></button>`,
					className: 'custom-marker-icon',
					iconSize: [40, 40],
					iconAnchor: [20, 40],
				});
				const leafletMarker = L.marker(markerData.latLng, {
					icon: markerIcon,
				});

				markerData.marker = leafletMarker;
				markersLayer.addLayer(leafletMarker);
				markerLatLngs.push(markerData.latLng);

				leafletMarker.on('click', () => {
					console.log('Marker clicked!', markerData);
				});
			});

			map.addLayer(markersLayer);

			// Fit the map to the marker bounds
			const bounds = L.latLngBounds(markerLatLngs);
			map.fitBounds(bounds, {padding: [50, 50]});

			// Add current location
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const currentLatLng = new L.LatLng(position.coords.latitude, position.coords.longitude);
						const markerIcon = L.divIcon({
							html: `<button class="mdc-fab mdc-fab--mini mat-mdc-mini-fab mat-accent mat-mdc-button-base" title="Current Location"><mat-icon role="img" class="mat-icon notranslate material-icons mat-ligature-font mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font">my_location</mat-icon><span class="mdc-button__label"></span></button>`,
							className: 'current-location-marker-icon',
							iconSize: [40, 40],
							iconAnchor: [20, 40]
						});
						const leafletMarker = L.marker(currentLatLng, {
							icon: markerIcon
						});

						markersLayer.addLayer(leafletMarker);
					},
					(error) => console.error('Error retrieving current location:', error)
				);
			} else {
				console.error('Geolocation is not supported by this browser.');
			}

			this.mapInstance = map;
		}
	}
}