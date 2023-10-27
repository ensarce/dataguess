import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private apollo: Apollo) {}

  getAllCountries() {
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

    return this.apollo.watchQuery<any>({
      query: query,
    }).valueChanges;
  }
}
