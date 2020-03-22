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

function compareOnStatContainerAndField(a: CountryWithLatestStats,
                                        b: CountryWithLatestStats,
                                        statContainer: 'percentageIncrease' | 'latestStats',
                                        field: 'deaths' | 'recovered' | 'confirmed') {
  const fieldCompareResult = a[statContainer][field] - b[statContainer][field];
  if (fieldCompareResult < 0) {
    return 1;
  }
  if (fieldCompareResult > 0) {
    return -1;
  }
  return 0;
}

export function sortCountryWithLatestStats(statContainer: 'percentageIncrease' | 'latestStats', field: 'deaths' | 'recovered' | 'confirmed') {
  return (a: CountryWithLatestStats, b: CountryWithLatestStats) => {

    const fieldCompareResult = compareOnStatContainerAndField(a, b, statContainer, field);
    if (fieldCompareResult !== 0) {
      return fieldCompareResult;
    }

    const deathComparison = compareOnStatContainerAndField(a, b, 'latestStats', 'deaths');
    if (deathComparison !== 0) {
      return deathComparison;
    }

    const confirmedComparison = compareOnStatContainerAndField(a, b, 'latestStats', 'confirmed');
    if (confirmedComparison !== 0) {
      return confirmedComparison;
    }

    if (a.country < b.country) {
      return -1;
    }
    if (a.country > b.country) {
      return 1;
    }

    return 0;
  };
}
