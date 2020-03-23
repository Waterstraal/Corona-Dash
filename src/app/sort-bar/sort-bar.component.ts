import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

export type SortField = 'deaths' | 'recovered' | 'confirmed';
export type StatContainer = 'latestStats' | 'percentageIncrease';

export interface SortOptions {
  statContainer: StatContainer;
  statField: SortField;
}

export const FIELD_EMOJIS: Record<SortField, string> = {
  deaths: '💀',
  recovered: '😃',
  confirmed: '😷'
};

@Component({
  selector: 'app-sort-bar',
  template: `
    <div class="sort-bar">
      <mat-button-toggle-group class="stat-field-selector" [(value)]="statField">
        <mat-button-toggle value="deaths" aria-label="Deaths">{{fieldEmojis['deaths']}}</mat-button-toggle>
        <mat-button-toggle value="confirmed" aria-label="Confirmed">{{fieldEmojis['confirmed']}}</mat-button-toggle>
        <mat-button-toggle value="recovered" aria-label="Recovered">{{fieldEmojis['recovered']}}</mat-button-toggle>
      </mat-button-toggle-group>

      <mat-button-toggle-group class="stat-container-selector" [(value)]="statContainer">
        <mat-button-toggle value="latestStats" aria-label="Show total">Total</mat-button-toggle>
        <mat-button-toggle value="percentageIncrease" aria-label="Show percentage increase">Change</mat-button-toggle>
      </mat-button-toggle-group>
    </div>
  `,
  styles: [`
    .sort-bar {
      text-align: center;
      padding-top: 0.5em;
    }

    .stat-field-selector {
      margin-right: 2em;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortBarComponent implements OnInit, OnDestroy {
  @Output() sortOptions: EventEmitter<SortOptions> = new EventEmitter();
  private destroy$: Subject<boolean> = new Subject<boolean>();

  private _statField: BehaviorSubject<SortField> = new BehaviorSubject<SortField>('deaths');
  private statField$: Observable<SortField> = this._statField.pipe(filter(val => !!val));

  readonly fieldEmojis: typeof FIELD_EMOJIS = FIELD_EMOJIS;

  get statField(): SortField {
    return this._statField.getValue();
  }

  set statField(value: SortField) {
    this._statField.next(value);
  }

  private _statContainer: BehaviorSubject<StatContainer> = new BehaviorSubject<StatContainer>('percentageIncrease');
  private statContainer$: Observable<StatContainer> = this._statContainer.pipe(filter(val => !!val));

  get statContainer(): StatContainer {
    return this._statContainer.getValue();
  }

  set statContainer(value: StatContainer) {
    this._statContainer.next(value);
  }

  ngOnInit(): void {
    combineLatest([this.statContainer$, this.statField$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([statContainer, statField]) => {
        this.sortOptions.emit({statContainer, statField});
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
