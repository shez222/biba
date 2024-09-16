import { Injectable } from '@angular/core';

export interface UserAddress {
  address: string;
  street: string;
  zip: string;
  city: string;
  country_code: string;
  latitude: string;
  longitude: string;
}

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class AddressSearchService {

  constructor() { }

  async SelectSearchResult(item: any): Promise<UserAddress | null> {
    let PlaceID = item.place_id;
    if (PlaceID != null && PlaceID != '') {
      let geocoder = new google.maps.Geocoder();
      return new Promise<UserAddress | null>((resolve, reject) => {
        geocoder.geocode({ 'address': item.description }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            let AddressSelected: string = '';
            let Street: string = '';
            let StreetNumber: string = '';
            let PostCode: string = '';
            let City: string = '';
            let CountryCode: string = '';
            for (const object of results[0].address_components) {
              if (object.types.includes("street_number") || object.types.includes("intersection")) {
                StreetNumber = object.long_name;
              }
              if (object.types.includes("route") || object.types.includes("sublocality")) {
                Street = object.long_name;
              }
              if (object.types.some((type: string) => type === 'locality' || type === 'administrative_area_level_3')) {
                City = object.long_name;
              }
              if (object.types.includes('country')) {
                CountryCode = object.short_name;
              }
              if (object.types.includes("postal_code")) {
                PostCode = object.long_name;
              }
            }
            Street += (StreetNumber) ? " " + StreetNumber : "";
            AddressSelected = results[0].formatted_address;
            let Latitude = results[0].geometry.location.lat();
            let Longitude = results[0].geometry.location.lng();
            resolve({
              address: AddressSelected,
              street: Street,
              zip: PostCode,
              city: City,
              country_code: CountryCode,
              latitude: Latitude,
              longitude: Longitude,
            });
          } else {
            resolve(null);
          }
        });
      });
    } else {
      return Promise.resolve(null);
    }
  }
}
