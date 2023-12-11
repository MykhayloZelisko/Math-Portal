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
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';
import { Subject, takeUntil } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-article-content',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    MathjaxModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './article-content.component.html',
  styleUrl: './article-content.component.scss',
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

  public ngOnChanges(): void {
    this.clearContent();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public clearContent(): void {
    if (this.clearControl.clear) {
      this.content = '';
      this.contentCtrl.setValue('');
      this.clearControl = { clear: false };
    }
  }

  public changeContent(): void {
    this.contentCtrl.setValue(this.content);
    this.contentCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value: string) => {
        this.content = value;
        this.saveContent.emit(value);
      },
    });
  }

  public showContent(): void {
    this.isContentEditable = false;
  }

  public editContent(): void {
    this.isContentEditable = true;
  }
}
