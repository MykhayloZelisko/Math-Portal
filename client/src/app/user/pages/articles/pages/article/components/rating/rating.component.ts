import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RatingType } from '../../../../../../../shared/models/types/rating.type';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent implements OnInit {
  @Input() public rating: number = 0;

  @Input() public votes: number = 0;

  @Input() public isActive: boolean = false;

  @Output() public activeRating: EventEmitter<RatingType> =
    new EventEmitter<RatingType>();

  public ratingForm!: FormGroup;

  public constructor(private fb: FormBuilder) {}

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
    const rating = this.ratingForm.get('rating')?.value;
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
