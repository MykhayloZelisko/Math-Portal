import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TagInterface } from '../../../../../shared/models/interfaces/tag.interface';
import { startWith, Subject, takeUntil } from 'rxjs';
import { TagsService } from '../../../../../shared/services/tags.service';
import { MathjaxModule } from 'mathjax-angular';

@Component({
  selector: 'app-article-tags',
  standalone: true,
  imports: [
    CommonModule,
    MathjaxModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  templateUrl: './article-tags.component.html',
  styleUrls: ['./article-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleTagsComponent implements OnInit {
  @ViewChild('tagInput') public tagInput!: ElementRef<HTMLInputElement>;

  public tagCtrl: FormControl = new FormControl('');

  public filteredTags: TagInterface[] = [];

  public selectedTags: TagInterface[] = [];

  public allTags: TagInterface[] = [];

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(private tagsService: TagsService) {}

  public ngOnInit(): void {
    this.initTagList();
    this.initFilteredList();
  }

  private initTagList(): void {
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

  private initFilteredList(): void {
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
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    const tag = this.allTags.find((x) => x.value === event.option.viewValue);
    if (tag) {
      const selectedTag = this.selectedTags.find((item) => item.id === tag.id);
      if (!selectedTag) {
        this.selectedTags.push(tag);
      }
      this.tagInput.nativeElement.value = '';
      this.tagCtrl.setValue(null);
    }
  }
}
