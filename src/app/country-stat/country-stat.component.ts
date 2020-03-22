import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CountryWithLatestStats } from '../country-with-lateststats.model';
import { FIELD_EMOJIS } from '../sort-bar/sort-bar.component';

@Component({
  selector: 'app-country-stat',
  template: `
    <mat-card [class.death]="countryStat.latestStats.deaths > 0">
      <mat-card-title>{{ countryStat.country }}</mat-card-title>
      <h2>
        <span [class.selected]="statField === 'deaths'">
          <app-single-stat [countryStat]="countryStat" [statContainer]="statContainer" statField="deaths"></app-single-stat>
        </span>
        <span [class.selected]="statField === 'confirmed'">
          <app-single-stat [countryStat]="countryStat" [statContainer]="statContainer" statField="confirmed"></app-single-stat>
        </span>
        <span [class.selected]="statField === 'recovered'">
          <app-single-stat [countryStat]="countryStat" [statContainer]="statContainer" statField="recovered"></app-single-stat>
        </span>
      </h2>
    </mat-card>`,
  styles: [`
    mat-card {
      border-left: 5px solid green;
    }

    mat-card.death {
      border-left-color: red;
    }

    h2 {
      display: flex;
    }

    h2 span {
      flex-grow: 1;
      flex-basis: 0;
      filter: grayscale(100%);
    }

    h2 span.selected {
      filter: none;
      font-size: 1.3em;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryStatComponent {
  @Input() countryStat: CountryWithLatestStats;
  @Input() statContainer: 'percentageIncrease' | 'latestStats';
  @Input() statField: 'deaths' | 'recovered' | 'confirmed';

  readonly fieldEmojis: typeof FIELD_EMOJIS = FIELD_EMOJIS;
}
