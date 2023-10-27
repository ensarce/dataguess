import {Component, OnInit} from '@angular/core';
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";



@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit {
  countries: any[] = [];
  filterText: string = ''; // Kullanıcının girdiği metin
  selectedCountry: any = null; // Seçilen ülke
  groupBy: string = ''; // Gruplama ölçütü
  groupedCountries: any = {}; // Gruplanmış ülkeler
  filteredCountries: any[] = [];
  groupedCountryKeys: string[] = [];

  constructor(private apollo: Apollo) {

  }

  ngOnInit(): void {
    // GraphQL sorgusunu tanımlayın
    const query = gql`
      query GetAllCountries {
        countries {
          code
          name
          capital
          currency
          languages {
            name
          }
        }
      }
    `;

    // Apollo Client'i kullanarak sorguyu API'ye gönderin
    this.apollo.query<any>({
      query: query
    }).subscribe(response => {
      // API'den gelen tüm ülke verilerini alın
      this.countries = response.data.countries.map((country: any) => {
        const languageNames = country.languages.map((lang: any) => lang.name).join(', ');
        return { ...country, languageNames };
      });
    });

  }

  onFilterChange(): void {
    // Metin sorgusu değiştiğinde bu işlev çağrılır
    // Ülkeleri filtrelemek için filterText'i kullanabilirsiniz
    this.filterCountries();
  }

  filterCountries(): void {
    const searchText = this.filterText.toLowerCase();
    this.filteredCountries = this.countries.filter((country: any) => {
      return country.name.toLowerCase().includes(searchText);
    });

    this.groupedCountries = this.groupBy
      ? this.groupCountriesBy(this.filteredCountries, this.groupBy)
      : {};
    this.groupedCountryKeys = Object.keys(this.groupedCountries);
  }

  groupCountriesBy(countries: any[], key: string): any {
    // Belirtilen özellikle ülkeleri gruplayan bir işlev
    return countries.reduce((groups, country) => {
      const groupKey = country[key] || 'Diğer'; // Eksik veya boş özelliği olanları "Diğer" grubuna ekler
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(country);
      return groups;
    }, {});
  }

  selectCountry(country: any): void {
    // Seçilen ülkeyi işaretle ve arka plan rengini ayarla
    this.selectedCountry = country;
    this.filteredCountries.forEach(item => {
      item.isSelected = item === country;
    });
  }

  setAutomaticSelection(): void {
    // Otomatik olarak 10. veya son ülkeyi seç
    const index = Math.min(9, this.filteredCountries.length - 1);
    this.selectCountry(this.filteredCountries[index]);
  }

}


