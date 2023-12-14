import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RatingType } from '../../../../../../../shared/models/types/rating.type';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent implements OnInit {
  @Input() public rating = 0;

  @Input() public votes = 0;

  @Input() public isActive = false;

  @Output() public activeRating: EventEmitter<RatingType> =
    new EventEmitter<RatingType>();

  public ratingForm!: FormGroup;

  private fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.ratingForm = this.fb.group({
      rating: [
        {
          value: 0,
          disabled: !this.isActive,
        },
      ],
    });
  }

  public changeRating(): void {
    const rating = +this.ratingForm.getRawValue().rating as RatingType;
    this.activeRating.emit(rating);
  }

  public svgGradient(rate: RatingType): string {
    if (rate <= this.rating) {
      return '100%';
    } else if (rate > this.rating && rate < this.rating + 1) {
      return `${100 - (rate - this.rating) * 100}%`;
    } else {
      return '0%';
    }
  }
}
