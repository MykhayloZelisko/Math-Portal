import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter, inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TagInterface } from '../../models/interfaces/tag.interface';
import { startWith, Subject, takeUntil } from 'rxjs';
import { TagsService } from '../../services/tags.service';
import { MathjaxModule } from 'mathjax-angular';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-article-tags',
  standalone: true,
  imports: [
    MathjaxModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgForOf,
  ],
  templateUrl: './article-tags.component.html',
  styleUrl: './article-tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleTagsComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('tagInput') public tagInput!: ElementRef<HTMLInputElement>;

  @Input() public selectedTags: TagInterface[] = [];

  @Input() public clearControl: { clear: boolean } = { clear: false };

  @Output() public saveTagsIds: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();

  public tagCtrl: FormControl = new FormControl('');

  public filteredTags: TagInterface[] = [];

  public allTags: TagInterface[] = [];

  private destroy$: Subject<void> = new Subject<void>();

  private tagsService = inject(TagsService);

  public ngOnInit(): void {
    this.selectedTags = [...this.selectedTags];
    this.initTagList();
    this.initFilteredList();
  }

  public ngOnChanges(): void {
    this.clearTags();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public clearTags(): void {
    if (this.clearControl.clear) {
      this.selectedTags = [];
      this.tagInput.nativeElement.value = '';
      this.tagCtrl.setValue('');
      this.clearControl = { clear: false };
    }
  }

  public initTagList(): void {
    this.tagsService
      .getAllTags()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tagList: TagInterface[]) => {
          this.allTags = tagList;
          this.filteredTags = this.allTags;
        },
      });
  }

  public initFilteredList(): void {
    this.tagCtrl.valueChanges
      .pipe(startWith(null), takeUntil(this.destroy$))
      .subscribe({
        next: (tagValue: string | null) => {
          if (tagValue) {
            const filterValue = tagValue.toLowerCase();
            this.filteredTags = this.allTags.filter((tag) =>
              tag.value.toLowerCase().includes(filterValue),
            );
          } else {
            this.filteredTags = [...this.allTags];
          }
        },
      });
  }

  public remove(tag: TagInterface): void {
    const index = this.selectedTags.indexOf(tag);
    this.selectedTags = this.selectedTags.filter(
      (item, itemIndex) => itemIndex !== index,
    );
    this.saveTags(this.selectedTags);
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    const tag = this.allTags.find(
      (item) => item.value === event.option.viewValue,
    );
    if (tag) {
      const selectedTag = this.selectedTags.find((item) => item.id === tag.id);
      if (!selectedTag) {
        this.selectedTags.push(tag);
        this.saveTags(this.selectedTags);
      }
      this.tagInput.nativeElement.value = '';
      this.tagCtrl.setValue('');
    }
  }

  public saveTags(tags: TagInterface[]): void {
    const tagsIds = tags.map((tag: TagInterface) => tag.id);
    this.saveTagsIds.emit(tagsIds);
  }
}
