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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-new-tag',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-tag.component.html',
  styleUrl: './new-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTagComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public clearControl: { clear: boolean } = { clear: false };

  @Output()
  public addTag: EventEmitter<string> = new EventEmitter<string>();

  public tagCtrl: FormControl = new FormControl('');

  public tag = '';

  private destroy$: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this.initTag();
  }

  public ngOnChanges(): void {
    this.clearTag();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initTag(): void {
    this.tagCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value: string) => {
        this.tag = value;
      },
    });
  }

  public clearTag(): void {
    if (this.clearControl.clear) {
      this.tag = '';
      this.tagCtrl.setValue('');
      this.clearControl = { clear: false };
    }
  }

  public onAddTag(): void {
    this.tag = this.tagCtrl.getRawValue();
    this.addTag.emit(this.tag.trim());
  }
}
