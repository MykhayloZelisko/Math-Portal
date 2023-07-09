import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-tag',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-tag.component.html',
  styleUrls: ['./new-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTagComponent {
  public tag: string = '';

  @Output()
  public addTag: EventEmitter<string> = new EventEmitter<string>();

  public onAddTag() {
    this.addTag.emit(this.tag.trim());
  }
}
