import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagInterface } from '../../../../../shared/models/interfaces/tag.interface';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tag-item',
  standalone: true,
  imports: [CommonModule, AngularSvgIconModule, FormsModule],
  templateUrl: './tag-item.component.html',
  styleUrls: ['./tag-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagItemComponent {
  @Input() public tag!: TagInterface;

  @Output()
  public removeTag: EventEmitter<TagInterface> = new EventEmitter<TagInterface>();

  @Output()
  public cancelEdit: EventEmitter<void> = new EventEmitter<void>();

  public isEditable: boolean = false;

  public constructor(private cdr: ChangeDetectorRef) {
  }

  public deleteTag(): void {
    this.removeTag.emit(this.tag);
  }

  public editTag() {
    this.isEditable = true;
  }

  public cancelEditTag() {
    this.isEditable = false;
    this.cancelEdit.emit();
  }
}
