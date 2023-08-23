import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewTagComponent } from './components/new-tag/new-tag.component';
import { TagInterface } from '../../../shared/models/interfaces/tag.interface';
import { TagsService } from '../../../shared/services/tags.service';
import { Subject, takeUntil } from 'rxjs';
import { TagItemComponent } from './components/tag-item/tag-item.component';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { DialogService } from '../../../shared/services/dialog.service';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';
import { UsersService } from '../../../shared/services/users.service';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule, FormsModule, NewTagComponent, TagItemComponent],
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent implements OnInit, OnDestroy {
  public tagList: TagInterface[] = [];

  public clearControl: { clear: boolean } = { clear: false };

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(
    private tagsService: TagsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private usersService: UsersService,
  ) {}

  public ngOnInit(): void {
    this.initTagList();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initTagList(): void {
    this.tagsService
      .getAllTags()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list: TagInterface[]) => {
          this.tagList = list;
          this.cdr.detectChanges();
        },
      });
  }

  public addTag(value: string) {
    this.tagsService
      .createTag(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tag: TagInterface) => {
          this.tagList = [...this.tagList, tag];
          this.clearControl = { clear: true };
          this.cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === HttpStatusCode.Conflict) {
            this.dialogService.openDialog(DialogTypeEnum.Alert, {
              title: 'ПОВІДОМЛЕННЯ',
              text: 'Такий тег вже існує.',
            });
          }
        },
      });
  }

  public removeTag(tag: TagInterface) {
    this.dialogService
      .openDialog(DialogTypeEnum.ConfirmDeleteTag, {
        title: 'ПОВІДОМЛЕННЯ',
        text: '',
        user: undefined,
        tag: tag,
      })
      .afterClosed()
      .subscribe({
        next: (id: string) => {
          if (id) {
            this.confirmRemoveTag(id);
          }
        },
      });
  }

  private confirmRemoveTag(id: string) {
    this.tagsService
      .removeTag(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.tagList = this.tagList.filter(
            (tag: TagInterface) => tag.id !== id,
          );
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Тег успішно видалено.',
          });
          this.cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          const user = this.usersService.user$.getValue();
          if (err.status === HttpStatusCode.Forbidden && user && user.isAdmin) {
            this.dialogService.openDialog(DialogTypeEnum.Alert, {
              title: 'ПОВІДОМЛЕННЯ',
              text: 'Тег не можна видалити поки він використовується і є єдиним тегом в статті.',
            });
          } else {
            this.dialogService.openDialog(DialogTypeEnum.Alert, {
              title: 'ПОВІДОМЛЕННЯ',
              text: 'Помилка видалення тега. Повторіть спробу пізніше.',
            });
          }
        },
      });
  }

  public updateTag(tag: TagInterface) {
    this.tagsService
      .updateTag(tag.id, tag.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tagItem: TagInterface) => {
          this.tagList = this.tagList.map((item: TagInterface) =>
            item.id === tagItem.id ? tagItem : item,
          );
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Тег успішно оновлено.',
          });
        },
        error: () => {
          this.dialogService.openDialog(DialogTypeEnum.Alert, {
            title: 'ПОВІДОМЛЕННЯ',
            text: 'Помилка оновлення тега. Повторіть спробу пізніше.',
          });
        },
      });
  }
}
