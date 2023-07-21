import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-article-title',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    MathjaxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './article-title.component.html',
  styleUrls: ['./article-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleTitleComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public clearControl: { clear: boolean } = { clear: false };

  @Output() public saveTitle: EventEmitter<string> = new EventEmitter<string>();

  public title: string = '';

  public isTitleEditable: boolean = true;

  public titleCtrl: FormControl = new FormControl('');

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.changeTitle();
  }

  public ngOnChanges() {
    this.clearTitle();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private clearTitle(): void {
    if (this.clearControl.clear) {
      this.title = '';
      this.titleCtrl.setValue('');
      this.clearControl = { clear: false };
    }
  }

  private changeTitle(): void {
    this.titleCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value: string) => {
        this.title = value;
        this.saveTitle.emit(value);
      },
    });
  }

  public showTitle() {
    this.isTitleEditable = false;
  }

  public editTitle() {
    this.isTitleEditable = true;
  }
}
