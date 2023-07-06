import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

const DEBOUNCE_TIME = 600;

@Component({
  selector: 'app-users-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFilterComponent implements OnInit {
  public searchUserCtrl = new FormControl();

  private destroy$: Subject<void> = new Subject<void>();

  @Output()
  public searchUser: EventEmitter<string> = new EventEmitter<string>();

  public ngOnInit(): void {
    this.initSearchValue();
  }

  private initSearchValue(): void {
    this.searchUserCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(DEBOUNCE_TIME),
      )
      .subscribe({
        next: (value) => {
          this.searchUser.emit(value)
        }
      })
  }
}
