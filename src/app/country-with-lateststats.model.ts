import { Covid19DayStats } from './covid19-http.service';

export class CountryWithLatestStats {
  public percentageIncrease: Covid19DayStats;

  constructor(public country: string, public latestStats: Covid19DayStats, public oneDayBeforeLatestStats: Covid19DayStats) {
    this.percentageIncrease = {
      deaths: oneDayBeforeLatestStats.deaths <= 0 ? 0 : (latestStats.deaths - oneDayBeforeLatestStats.deaths) / oneDayBeforeLatestStats.deaths,
      recovered: oneDayBeforeLatestStats.recovered <= 0 ? 0 : (latestStats.recovered - oneDayBeforeLatestStats.recovered) / oneDayBeforeLatestStats.recovered,
      confirmed: oneDayBeforeLatestStats.confirmed <= 0 ? 0 : (latestStats.confirmed - oneDayBeforeLatestStats.confirmed) / oneDayBeforeLatestStats.confirmed,
      date: latestStats.date
    };
  }
}
