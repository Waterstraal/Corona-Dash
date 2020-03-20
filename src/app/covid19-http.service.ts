import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Covid19HttpService {

  constructor(private http: HttpClient) {
  }

  get() {
    return this.http.get<Covid19Stats>(`https://pomber.github.io/covid19/timeseries.json`);
  }
}

export class Covid19Stats {
  [key: string]: Covid19DayStats[];
}

export class Covid19DayStats {
  date: string;
  confirmed: number;
  deaths: number;
  recovered: number;
}
