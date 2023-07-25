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
  selector: 'app-article-content',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    MathjaxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleContentComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public clearControl: { clear: boolean } = { clear: false };

  @Input() public content: string = '';

  @Output() public saveContent: EventEmitter<string> =
    new EventEmitter<string>();

  public isContentEditable: boolean = true;

  public contentCtrl: FormControl = new FormControl('');

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.changeContent();
  }

  public ngOnChanges() {
    this.clearContent();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private clearContent(): void {
    if (this.clearControl.clear) {
      this.content = '';
      this.contentCtrl.setValue('');
      this.clearControl = { clear: false };
    }
  }

  private changeContent(): void {
    this.contentCtrl.setValue(this.content);
    this.contentCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value: string) => {
        this.content = value;
        this.saveContent.emit(value);
      },
    });
  }

  public showContent() {
    this.isContentEditable = false;
  }

  public editContent() {
    this.isContentEditable = true;
  }
}
