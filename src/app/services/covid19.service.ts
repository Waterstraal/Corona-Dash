import { Injectable } from '@angular/core';
import { Covid19HttpService, Covid19Stats } from '../api/covid19-http.service';
import { CountryWithLatestStats } from './country-with-lateststats.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Covid19Service {
  public readonly covid19Stats$ = this.covid19HttpService.get().pipe(
    map((val: Covid19Stats) => {
      const result: CountryWithLatestStats[] = [];
      for (const [key, value] of Object.entries(val)) {
        result.push(new CountryWithLatestStats(key, value[value.length - 1], value[value.length - 2]));
      }
      return result;
    })
  );

  constructor(private covid19HttpService: Covid19HttpService) {
  }
}
