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
import { SvgIconComponent } from 'angular-svg-icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { Subject, takeUntil } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-article-title',
  standalone: true,
  imports: [SvgIconComponent, MathjaxModule, ReactiveFormsModule, NgIf],
  templateUrl: './article-title.component.html',
  styleUrl: './article-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleTitleComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public clearControl: { clear: boolean } = { clear: false };

  @Input() public title = '';

  @Output() public saveTitle: EventEmitter<string> = new EventEmitter<string>();

  public isTitleEditable = true;

  public titleCtrl: FormControl = new FormControl('');

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.changeTitle();
  }

  public ngOnChanges(): void {
    this.clearTitle();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public clearTitle(): void {
    if (this.clearControl.clear) {
      this.title = '';
      this.titleCtrl.setValue('');
      this.clearControl = { clear: false };
    }
  }

  public changeTitle(): void {
    this.titleCtrl.setValue(this.title);
    this.titleCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value: string) => {
        this.title = value;
        this.saveTitle.emit(value);
      },
    });
  }

  public showTitle(): void {
    this.isTitleEditable = false;
  }

  public editTitle(): void {
    this.isTitleEditable = true;
  }
}
