import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { CountryWithLatestStats, sortCountryWithLatestStats } from './country-with-lateststats.model';
import { Covid19Service } from './covid19.service';

export type SortField = 'deaths' | 'recovered' | 'confirmed';
export type StatContainer = 'latestStats' | 'percentageIncrease';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <mat-button-toggle-group class="stat-field-selector" [(value)]="statField">
        <mat-button-toggle value="deaths" aria-label="Deaths">💀</mat-button-toggle>
        <mat-button-toggle value="confirmed" aria-label="Confirmed">😷</mat-button-toggle>
        <mat-button-toggle value="recovered" aria-label="Recovered">😃</mat-button-toggle>
      </mat-button-toggle-group>

      <mat-button-toggle-group class="stat-container-selector" [(value)]="statContainer">
        <mat-button-toggle value="latestStats" aria-label="Show total">Total</mat-button-toggle>
        <mat-button-toggle value="percentageIncrease" aria-label="Show percentage increase">Percentage</mat-button-toggle>
      </mat-button-toggle-group>
    </div>
    <ng-container *ngIf="sortedCovid19Stats$ | async as covid19Stats; else loading">
      <app-country-stat *ngFor="let countryStat of covid19Stats" [countryStat]="countryStat" [statContainer]="statContainer"
                        [statField]="statField"></app-country-stat>
    </ng-container>
    <ng-template #loading>
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    </ng-template>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private _statField: BehaviorSubject<SortField> = new BehaviorSubject<SortField>('deaths');
  private statField$: Observable<SortField> = this._statField.pipe(filter(val => !!val));

  get statField(): SortField {
    return this._statField.getValue();
  }

  set statField(value: SortField) {
    this._statField.next(value);
  }

  private _statContainer: BehaviorSubject<StatContainer> = new BehaviorSubject<StatContainer>('latestStats');
  private statContainer$: Observable<StatContainer> = this._statContainer.pipe(filter(val => !!val));

  get statContainer(): StatContainer {
    return this._statContainer.getValue();
  }

  set statContainer(value: StatContainer) {
    this._statContainer.next(value);
  }

  private covid19Stats$: Observable<CountryWithLatestStats[]> = this.covid19Service.covid19Stats$.pipe(shareReplay(1));

  sortedCovid19Stats$: Observable<CountryWithLatestStats[]> = combineLatest([this.covid19Stats$, this.statContainer$, this.statField$])
    .pipe(
      map(([val, statContainer, statField]) => val.sort(sortCountryWithLatestStats(statContainer, statField))),
      shareReplay(1)
    );

  constructor(private covid19Service: Covid19Service) {
  }
}


