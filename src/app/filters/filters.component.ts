import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
	selector: 'app-filters',
	styleUrls: ['./filters.component.css'],
	templateUrl: './filters.component.html'
})
export class FiltersComponent {
	// Property type
	propertyTypeFormGroup = new FormGroup({
		room: new FormControl(),
		apartment: new FormControl(),
		studio: new FormControl(),
		anti_squat: new FormControl(),
		student_residence: new FormControl()
	});

	// Rent input
	rentStep: number = 50;
	rentLimitMin: number = 50;
	rentLimitMax: number = 5000;
	rentMin: number = 500;
	rentMax: number = 1250;

	// Surface input
	surfaceStep: number = 5;
	surfaceLimitMin: number = 5;
	surfaceLimitMax: number = 100;
	surfaceMin: number = 10;
	surfaceMax: number = 75;

	// Facilities input
	countEnabledToggles = (section: string) => {
		const enabledCount = document.querySelectorAll(`#filter-${section} .mat-mdc-slide-toggle-checked, #filter-${section} .mat-mdc-checkbox-checked`).length;
		return enabledCount > 0 ? `${enabledCount} enabled` : '';
	};


	// City selector
	separatorKeysCodes = [ENTER, COMMA];
	citiesFormControl = new FormControl();
	filteredCities: Observable<string[]>;
	cities: string[] = [];
	allCities = ["'s-Graveland", "'s-Gravenzande", "'s-Heerenberg", "'t Goy", "'t Harde", "'t Waar", "Aadorp", "Aalsmeer", "Aalst", "Aarlanderveen", "Aarle-Rixtel", "Abcoude", "Achterveld (UT)", "Aduard", "Akkrum", "Albergen", "Alblasserdam", "Aldtsjerk", "Alkmaar", "Almelo", "Almere", "Alphen aan den Rijn", "Ambt Delden", "Ameide", "Amerongen", "Amersfoort", "Ammerzoden", "Amstelveen", "Amsterdam", "Angerlo", "Ankeveen", "Anloo", "Apeldoorn", "Appingedam", "Arnhem", "Assen", "Assendelft", "Asten", "Austerlitz", "Avenhorn", "Axel", "Baak", "Baarlo (LB)", "Baarn", "Bad Nieuweschans", "Badhoevedorp", "Bakel", "Barendrecht", "Barneveld", "Barsingerhorn", "Bavel", "Bedum", "Beek (LB)", "Beek (gem Ubbergen)", "Beekbergen", "Beilen", "Beinsdorp", "Belfeld", "Bemelen", "Bemmel", "Beneden-Leeuwen", "Bennekom", "Benschop", "Bentelo", "Benthuizen", "Bentveld", "Berg en Dal", "Berg en Terblijt", "Bergeijk", "Bergen (NH)", "Bergen op Zoom", "Berghem", "Bergschenhoek", "Berkel en Rodenrijs", "Berkel-Enschot", "Berlicum", "Berltsum", "Best", "Beuningen", "Beuningen Gld", "Beverwijk", "Biezenmortel", "Bilthoven", "Bitgummole", "Blaricum", "Bleiswijk", "Bleskensgraaf ca", "Blije", "Bocholtz", "Boekel", "Boksum", "Borger", "Born", "Borne", "Bosch en Duin", "Boskoop", "Bovenkarspel", "Boxmeer", "Boxtel", "Brakel", "Brantgum", "Breda", "Breukelen", "Breukeleveen", "Brielle", "Broekhuizenvorst", "Brunssum", "Budel", "Budel-Dorplein", "Buggenum", "Buitenkaag", "Buitenpost", "Bunde", "Bunnik", "Bunschoten-Spakenburg", "Burgerbrug", "Burgum", "Bussum", "Cadier en Keer", "Cadzand", "Callantsoog", "Capelle aan den IJssel", "Castricum", "Coevorden", "Colijnsplaat", "Cromvoirt", "Cuijk", "Culemborg", "Dalfsen", "De Bilt", "De Kwakel", "De Lier", "De Meern", "De Rijp", "De Steeg", "De Wilp", "Dedemsvaart", "Deest", "Deil", "Delden", "Delfgauw", "Delft", "Delfzijl", "Den Bosch", "Den Haag", "Den Ham (GR)", "Den Helder", "Den Hoorn (ZH)", "Den Horn", "Den Ilp", "Deurne", "Deursen-Dennenburg", "Deventer", "Didam", "Diemen", "Dieren", "Diessen", "Doesburg", "Doetinchem", "Dokkum", "Dongen", "Doorn", "Doorwerth", "Dordrecht", "Dorst", "Drachten", "Drempt", "Driebergen-Rijsenburg", "Drongelen", "Dronten", "Drunen", "Duiven", "Duivendrecht", "Dwingeloo", "Edam", "Ede", "Eelde", "Eemnes", "Eerbeek", "Eersel", "Eethen", "Egmond aan Zee", "Egmond aan den Hoef", "Eibergen", "Eijsden", "Eindhoven", "Elburg", "Elsloo", "Elst", "Elst Ut", "Emmen", "Enkhuizen", "Enschede", "Epe", "Epse", "Ermelo", "Escharen", "Est", "Etten", "Etten-Leur", "Ewijk", "Exloo", "Eygelshoven", "Farmsum", "Foxhol", "Franeker", "Gaanderen", "Galder", "Garderen", "Garmerwolde", "Geertruidenberg", "Geeuwenbrug", "Geffen", "Geldermalsen", "Geldrop", "Geleen", "Gemert", "Gendt", "Genemuiden", "Gennep", "Geulle", "Gieten", "Gilze", "Godlinze", "Goedereede", "Goes", "Goirle", "Gorinchem", "Gouda", "Goutum", "Grave", "Groenekan", "Groenlo", "Groesbeek", "Groet", "Groningen", "Gronsveld", "Groot-Ammers", "Grootebroek", "Grou", "Gulpen", "Haaften", "Haaksbergen", "Haarlem", "Haarlemmerliede", "Haarsteeg", "Haelen", "Halfweg", "Hall", "Hardenberg", "Harderwijk", "Hardinxveld-Giessendam", "Haren Gn", "Harkstede GN", "Harlingen", "Harmelen", "Harskamp", "Hasselt", "Hattem", "Hattemerbroek", "Haule", "Hazerswoude-Dorp", "Hedel", "Heel", "Heelsum", "Heemskerk", "Heemstede", "Heerde", "Heerenveen", "Heerewaarden", "Heerhugowaard", "Heerlen", "Heesch", "Heeswijk-Dinther", "Heeze", "Heiloo", "Heino", "Hellevoetsluis", "Helmond", "Hem", "Hendrik-Ido-Ambacht", "Hengelo", "Hengevelde", "Herkenbosch", "Herten", "Herveld", "Heteren", "Heumen", "Heusden", "Hillegom", "Hilvarenbeek", "Hilversum", "Hoek van Holland", "Hoenderloo", "Hoensbroek", "Hoevelaken", "Hoeven", "Hoofddorp", "Hooge Zwaluwe", "Hoogerheide", "Hoogeveen", "Hoogezand", "Hooghalen", "Hoogkarspel", "Hoogland", "Hooglanderveen", "Hoogmade", "Hoogvliet Rotterdam", "Hoorn", "Horn", "Houten", "Huis ter Heide", "Huisseling", "Huissen", "Huizen", "Hulshorst", "Hummelo", "Hurdegaryp", "IJmuiden", "IJsselmuiden", "IJsselstein", "Ingen", "Jorwert", "Kaatsheuvel", "Kamerik", "Kampen", "Kamperland", "Katwijk", "Katwijk NB", "Keijenborg", "Kerkdriel", "Kerkrade", "Kesteren", "Kiel-Windeweer", "Kimswerd", "Klarenbeek", "Klazienaveen", "Kloosterburen", "Klundert", "Knegsel", "Kockengen", "Koedijk", "Kolhorn", "Koog aan de Zaan", "Kortenhoef", "Koudekerk aan den Rijn", "Koudekerke", "Kraggenburg", "Krimpen aan de Lek", "Krimpen aan den IJssel", "Krommenie", "Kropswolde", "Kudelstaart", "Kwintsheul", "Lage Zwaluwe", "Landgraaf", "Landsmeer", "Langbroek", "Laren", "Lathum", "Leek", "Leende", "Leerdam", "Leersum", "Leeuwarden", "Leiden", "Leiderdorp", "Leidschendam", "Leimuiden", "Lelystad", "Lent", "Leusden", "Leuth", "Liempde", "Lierop", "Lieshout", "Liessel", "Lijnden", "Limmen", "Linden", "Lisse", "Lisserbroek", "Lith", "Lochem", "Loenen", "Loenen aan de Vecht", "Loenersloot", "Loon op Zand", "Loosdrecht", "Lopik", "Lopikerkapel", "Lunteren", "Luyksgestel", "Maarheeze", "Maarn", "Maarssen", "Maassluis", "Maastricht", "Made", "Malden", "Mander", "Mantinge", "Maren-Kessel", "Margraten", "Maria Hoop", "Markelo", "Marsum", "Marum", "Medemblik", "Meerkerk", "Meerssen", "Melick", "Meppel", "Merselo", "Meteren", "Middelburg", "Middenbeemster", "Middenmeer", "Mierlo", "Mijdrecht", "Mill", "Moergestel", "Molenhoek", "Monnickendam", "Montfoort", "Montfort", "Mook", "Moordrecht", "Musselkanaal", "Naaldwijk", "Naarden", "Nederhorst den Berg", "Nederweert", "Neerkant", "Netersel", "Nietap", "Nieuw-Balinge", "Nieuw-Vennep", "Nieuwe Niedorp", "Nieuwe Pekela", "Nieuwegein", "Nieuwerkerk a/d IJssel", "Nieuwersluis", "Nieuwkuijk", "Nieuwleusen", "Nieuwveen", "Nijensleek", "Nijeveen", "Nijkerk", "Nijmegen", "Nijverdal", "Nistelrode", "Noordbroek", "Noordscheschut", "Noordwijk", "Noordwijkerhout", "Nootdorp", "Nuenen", "Nuland", "Nunspeet", "Nuth", "Odijk", "Oegstgeest", "Oene", "Oirschot", "Oisterwijk", "Oldehove", "Oldenzaal", "Olst", "Ommen", "Onstwedde", "Oost West en Middelbeers", "Oost-Souburg", "Oosterbeek", "Oosterhout", "Oosthuizen", "Oostrum", "Oostvoorne", "Opmeer", "Ospel", "Oss", "Otterlo", "Oud Gastel", "Oud-Beijerland", "Oude Meer", "Oude Pekela", "Oudehaske", "Oudenbosch", "Ouderkerk aan de Amstel", "Oudeschip", "Oudkarspel", "Oudorp", "Overloon", "Overveen", "Papendrecht", "Peize", "Pernis Rotterdam", "Persingen", "Pijnacker", "Plasmolen", "Prinsenbeek", "Purmerend", "Purmerland", "Putten", "Puttershoek", "Raalte", "Raamsdonk", "Raamsdonksveer", "Randwijk", "Reeuwijk", "Rekken", "Renkum", "Ressen", "Reusel", "Rheden", "Rheezerveen", "Rhenen", "Rhenoy", "Rhoon", "Ridderkerk", "Riel", "Rijen", "Rijnsburg", "Rijpwetering", "Rijsbergen", "Rijsenhout", "Rijssen", "Rijswijk", "Rilland", "Rockanje", "Roden", "Roelofarendsveen", "Roermond", "Roosendaal", "Rosmalen", "Rotterdam", "Rozenburg", "Ruinerwold", "Rumpt", "Sappemeer", "Sassenheim", "Schagen", "Schaijk", "Schalkhaar", "Schalkwijk", "Schellinkhout", "Schermerhorn", "Scherpenzeel", "Schiedam", "Schijndel", "Schin op Geul", "Schinveld", "Schipluiden", "Schoonhoven", "Schoorl", "Serooskerke", "Simpelveld", "Sint Geertruid", "Sint Jansklooster", "Sint Odilienberg", "Sint Pancras", "Sint-Michielsgestel", "Sint-Oedenrode", "Sittard", "Sliedrecht", "Slochteren", "Smilde", "Sneek", "Soest", "Soesterberg", "Son en Breugel", "Spijkenisse", "Sprang-Capelle", "St. Willebrord", "Stadskanaal", "Staphorst", "Steensel", "Steenwijk", "Stein", "Stellendam", "Stevensweert", "Stieltjeskanaal", "Stiens", "Stolwijk", "Stoutenburg", "Surhuisterveen", "Surhuizum", "Swifterbant", "Tegelen", "Ten Post", "Ter Aar", "Terborg", "Terheijden", "Termunterzijl", "Terneuzen", "Teuge", "Thesinge", "Tiel", "Tiendeveen", "Tilburg", "Tolbert", "Tricht", "Tubbergen", "Twello", "Twijzel", "Tynaarlo", "Ubbena", "Ubbergen", "Uden", "Uitgeest", "Uithoorn", "Ulvenhout AC", "Utrecht", "Vaals", "Vaassen", "Valkenburg", "Valkenswaard", "Vasse", "Veendam", "Veenendaal", "Veenhuizen", "Veeningen", "Veghel", "Veldhoven", "Velp", "Velp (NB)", "Velsen-Noord", "Velserbroek", "Venhorst", "Venhuizen", "Venlo", "Venray", "Vessem", "Vianen", "Vierhouten", "Vijfhuizen", "Vijlen", "Vinkel", "Vinkeveen", "Visvliet", "Vlaardingen", "Vleuten", "Vlijmen", "Vlissingen", "Voerendaal", "Voorburg", "Voorhout", "Voorschoten", "Voorst", "Voorthuizen", "Vreeland", "Vries", "Vroomshoop", "Vrouwenparochie", "Vught", "Waalre", "Waalwijk", "Waardenburg", "Waarland", "Waddinxveen", "Wagenberg", "Wageningen", "Wamel", "Wanneperveen", "Wapenveld", "Warffum", "Warmenhuizen", "Warmond", "Warnsveld", "Wassenaar", "Wateringen", "Weert", "Weesp", "Wehl", "Wenum Wiesel", "Werkendam", "Werkhoven", "Wernhout", "Wervershoof", "Wesepe", "Wessem", "Westerbroek", "Westerland", "Westervoort", "Westzaan", "Weurt", "Wezep", "Wierden", "Wieringerwaard", "Wijchen", "Wijhe", "Wijk aan Zee", "Wijk bij Duurstede", "Wilnis", "Winkel", "Winschoten", "Winssen", "Winsum", "Wintelre", "Winterswijk", "Winterswijk Woold", "Wittem", "Woerden", "Woerdense Verlaat", "Wolvega", "Wormer", "Wormerveer", "Woubrugge", "Woudenberg", "Ysselsteyn", "Zaandam", "Zaandijk", "Zaltbommel", "Zandvoort", "Zeddam", "Zeegse", "Zeeland", "Zeewolde", "Zeist", "Zennewijnen", "Zevenaar", "Zevenbergen", "Zierikzee", "Zoetermeer", "Zoeterwoude", "Zuiderwoude", "Zuidhorn", "Zuidlaren", "Zuidwolde", "Zundert", "Zutphen", "Zwaag", "Zwammerdam", "Zwanenburg", "Zwartsluis", "Zwijndrecht", "Zwolle"];
	citiesCount = 0;
	@ViewChild('cityInput') cityInput!: ElementRef<HTMLInputElement>;

	countNumberOfCities = () => {
		return this.citiesCount <= 0 ? '' : `${this.citiesCount} cit${this.citiesCount === 1 ? 'y' : 'ies'}`;
	};

	constructor() {
		this.filteredCities = this.citiesFormControl.valueChanges.pipe(
			startWith(null),
			map((value) => {
				const filterValue = value ? value.toLowerCase().replace(/[,;.\s]+$/, '') : '';
				return this.allCities
					.filter((city) => !this.cities.includes(city) && city.toLowerCase().includes(filterValue))
					.sort();
			})
		);
	}

	removeCity(city: string): void {
		const index = this.cities.indexOf(city);

		if (index >= 0) {
			this.cities.splice(index, 1);
		}

		if (!this.allCities.includes(city)) {
			this.allCities.push(city);
			this.allCities.sort();
			this.citiesCount--;
		}

		this.filteredCities = this.citiesFormControl.valueChanges.pipe(startWith(null), map((value) => this.filterCities(value)));
	}

	selectedCity(event: MatAutocompleteSelectedEvent): void {
		const selectedCity = event.option.viewValue;

		if (!this.cities.includes(selectedCity) && this.allCities.includes(selectedCity)) {
			this.cities.push(selectedCity);
			const index = this.allCities.indexOf(selectedCity);
			this.allCities.splice(index, 1);
			this.citiesCount++;
		}

		this.cityInput.nativeElement.value = '';
		this.cityInput.nativeElement.focus();
		this.citiesFormControl.setValue(null);
	}

	private filterCities(value: string | null): string[] {
		const filterValue = value ? value.toLowerCase().replace(/[,;.\s]+$/, '') : '';
		return this.allCities.filter((city) => !this.cities.includes(city) && city.toLowerCase().includes(filterValue)).sort();
	}
}