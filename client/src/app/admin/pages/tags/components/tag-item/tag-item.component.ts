import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { TagInterface } from '../../../../../shared/models/interfaces/tag.interface';
import { SvgIconComponent } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { BypassHtmlPipe } from '../../../../../shared/pipes/bypass-html.pipe';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-tag-item',
  standalone: true,
  imports: [SvgIconComponent, FormsModule, BypassHtmlPipe, NgClass, NgIf],
  templateUrl: './tag-item.component.html',
  styleUrl: './tag-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagItemComponent {
  @ViewChild('tagItem')
  public tagItem!: ElementRef;

  @Input() public tag!: TagInterface;

  @Output()
  public removeTag: EventEmitter<TagInterface> =
    new EventEmitter<TagInterface>();

  @Output()
  public updateTag: EventEmitter<TagInterface> =
    new EventEmitter<TagInterface>();

  public isEditable = false;

  public deleteTag(): void {
    this.removeTag.emit(this.tag);
  }

  public editTag(): void {
    this.isEditable = true;
  }

  public cancelEditTag(): void {
    this.isEditable = false;
    this.tagItem.nativeElement.innerHTML = this.tag.value;
  }

  public saveTag(): void {
    this.isEditable = false;
    const newTagValue = this.tagItem.nativeElement.innerHTML;
    this.updateTag.emit({ id: this.tag.id, value: newTagValue });
  }
}
