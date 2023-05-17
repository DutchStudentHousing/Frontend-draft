import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';

export interface LocationDetails {
	latLng: L.LatLng;
	icon: string;
	label: string;
	color: string;
	marker?: L.Marker;
}

@Component({
	selector: 'app-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
	options: L.MapOptions = {
		layers: [],
		preferCanvas: true
	};

	nearbyLocations: LocationDetails[] = [
		{
			latLng: new L.LatLng(53.1936303, 6.5556716),
			icon: 'home',
			label: 'Property',
			color: 'warn'
		},
		{
			latLng: new L.LatLng(53.1981888, 6.5613274),
			icon: 'shopping_cart',
			label: 'Supermarket',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(53.2109237, 6.5641028),
			icon: 'train',
			label: 'Train station',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(53.194488, 6.5556091),
			icon: 'directions_bus',
			label: 'Bus stop',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(53.19162995, 6.550999518154377),
			icon: 'local_hospital',
			label: 'Hospital',
			color: 'primary'
		},
		{
			latLng: new L.LatLng(53.1915289, 6.5507877),
			icon: 'medication',
			label: 'Pharmacy',
			color: 'primary'
		}
	];

	mapInstance!: L.Map;

	ngOnInit() {
		if (!this.mapInstance) {
			const map = L.map('map').setView([53.1936303, 6.5556716], 12);

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
			const propertyLocation = this.nearbyLocations.find(
				(location) => location.label === 'Property'
			);

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

				if (propertyLocation && markerData.latLng.distanceTo(propertyLocation.latLng) <= 750) {
					markerLatLngs.push(markerData.latLng);
				}

				leafletMarker.on('click', function () {
					console.log('Marker clicked!', markerData);
				});
			});

			map.addLayer(markersLayer);

			// Fit the map to the marker bounds
			const bounds = L.latLngBounds(markerLatLngs);
			map.fitBounds(bounds, {padding: [40, 40]});

			this.mapInstance = map;
		}

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const {latitude, longitude} = position.coords;
					const currentLatLng = new L.LatLng(latitude, longitude);
					const markerIcon = L.divIcon({
						html: `<button class="mdc-fab mdc-fab--mini mat-mdc-mini-fab mat-accent mat-mdc-button-base" title="Current Location"><mat-icon role="img" class="mat-icon notranslate material-icons mat-ligature-font mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font">my_location</mat-icon><span class="mdc-button__label"></span></button>`,
						className: 'current-location-marker-icon',
						iconSize: [40, 40],
						iconAnchor: [20, 40]
					});
					const leafletMarker = L.marker(currentLatLng, {
						icon: markerIcon
					});
					this.mapInstance.addLayer(leafletMarker);
				},
				(error) => {
					console.error('Error retrieving current location:', error);
				}
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
		}
	}

	calculateDistanceToProperty(location: LocationDetails): number | null {
		const propertyLocation = this.nearbyLocations.find(loc => loc.label === 'Property');
		if (propertyLocation) {
			const distance = location.latLng.distanceTo(propertyLocation.latLng);
			return Math.floor(distance);
		}
		return null;
	}
}