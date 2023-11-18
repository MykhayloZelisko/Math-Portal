import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsComponent } from './tags.component';
import { TagsService } from '../../../shared/services/tags.service';
import { TagInterface } from '../../../shared/models/interfaces/tag.interface';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';
import { UsersService } from '../../../shared/services/users.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { HttpStatusCode } from '@angular/common/http';
import { DialogTypeEnum } from '../../../shared/models/enums/dialog-type.enum';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { UserInterface } from '../../../shared/models/interfaces/user.interface';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;
  let mockTagsService: jasmine.SpyObj<TagsService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogComponent>>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  const mockTagsList: TagInterface[] = [
    {
      id: '0102e249-26cd-4a9c-b23c-a9ad96ad3dd1',
      value: 'Tag 1',
    },
    {
      id: '6e532d02-325f-4f37-b6ae-fc7c7aa36980',
      value: 'Tag 2',
    },
  ];
  const mockNewTag: TagInterface = {
    id: '6e532d02-325f-4f37-b6ae-fc7c7aa36981',
    value: 'New tag',
  };
  const mockUpdTag: TagInterface = {
    id: '6e532d02-325f-4f37-b6ae-fc7c7aa36980',
    value: 'Tag 2 updated',
  };
  const mockUser: UserInterface = {
    id: '35c90c0b-ba58-46f3-a091-bcdf66f514a8',
    email: 'mail@mail.mail',
    password: 'Pa$$word094',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    isAdmin: false,
    photo: null,
  };
  const mockAdmin: UserInterface = {
    ...mockUser,
    isAdmin: true,
  };

  beforeEach(async () => {
    mockTagsService = jasmine.createSpyObj('TagsService', [
      'getAllTags',
      'createTag',
      'removeTag',
      'updateTag',
    ]);
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );
    mockDialogRef = jasmine.createSpyObj('DialogRef', ['afterClosed']);
    mockUsersService = jasmine.createSpyObj('UsersService', [], {
      user$: new BehaviorSubject<UserInterface | null>(null)
    })

    await TestBed.configureTestingModule({
      imports: [TagsComponent],
      providers: [
        { provide: TagsService, useValue: mockTagsService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: UsersService, useValue: mockUsersService },
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    mockTagsService.getAllTags.and.returnValue(of(mockTagsList));

    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initTagList', () => {
      spyOn(component, 'initTagList');
      component.ngOnInit();

      expect(component.initTagList).toHaveBeenCalled();
    });
  });

  describe('initTagList', () => {
    it('should call initTagList', () => {
      component.initTagList();

      expect(component.tagList).toEqual(mockTagsList);
    });
  });

  describe('addTag', () => {
    it('should add new tag into tagList', () => {
      mockTagsService.createTag.and.returnValue(of(mockNewTag));
      component.addTag(mockNewTag.value);

      expect(component.tagList).toEqual([...mockTagsList, mockNewTag]);
    });

    it('should open error dialog', () => {
      mockTagsService.createTag.and.returnValue(
        throwError(() => ({ status: HttpStatusCode.Conflict }))
      );
      component.addTag(mockNewTag.value);

      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.Alert, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Такий тег вже існує.',
      });
    })
  })

  describe('removeTag', () => {
    it('should call confirmRemoveTag method', () => {
      spyOn(component, 'confirmRemoveTag');
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(mockNewTag.id));
      component.removeTag(mockNewTag);

      expect(component.confirmRemoveTag).toHaveBeenCalledWith(mockNewTag.id)
    });

    it('should not call confirmRemoveTag method', () => {
      spyOn(component, 'confirmRemoveTag');
      mockDialogService.openDialog.and.returnValue(mockDialogRef);
      mockDialogRef.afterClosed.and.returnValue(of(undefined));
      component.removeTag(mockNewTag);

      expect(component.confirmRemoveTag).not.toHaveBeenCalledWith(mockNewTag.id)
    });
  });

  describe('confirmRemoveTag', () => {
    it('should remove tag and open success dialog', () => {
      mockTagsService.removeTag.and.returnValue(of(void 0));
      component.confirmRemoveTag(mockTagsList[0].id);

      expect(component.tagList).toEqual([mockTagsList[1]]);
      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.Alert, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Тег успішно видалено.',
      })
    })

    it('should open error dialog about the last tag', () => {
      mockUsersService.user$.next(mockAdmin);
      mockTagsService.removeTag.and.returnValue(throwError(() => ({ status: HttpStatusCode.Forbidden })));
      component.confirmRemoveTag(mockTagsList[0].id);

      expect(component.tagList).toEqual(mockTagsList);
      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.Alert, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Тег не можна видалити поки він використовується і є єдиним тегом в статті.',
      })
    });

    it('should open error dialog with general message', () => {
      mockUsersService.user$.next(mockUser);
      mockTagsService.removeTag.and.returnValue(throwError(() => ({ status: HttpStatusCode.Forbidden })));
      component.confirmRemoveTag(mockTagsList[0].id);

      expect(component.tagList).toEqual(mockTagsList);
      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.Alert, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Помилка видалення тега. Повторіть спробу пізніше.',
      })
    });
  });

  describe('updateTag', () => {
    it('should update tag and open success dialog', () => {
      mockTagsService.updateTag.and.returnValue(of(mockUpdTag));
      component.updateTag(mockUpdTag);

      expect(component.tagList).toEqual([component.tagList[0], mockUpdTag]);
      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.Alert, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Тег успішно оновлено.',
      })
    });

    it('should not update tag and open error dialog', () => {
      mockTagsService.updateTag.and.returnValue(throwError(() => {}));
      component.updateTag(mockUpdTag);

      expect(component.tagList).toEqual(mockTagsList);
      expect(mockDialogService.openDialog).toHaveBeenCalledWith(DialogTypeEnum.Alert, {
        title: 'ПОВІДОМЛЕННЯ',
        text: 'Помилка оновлення тега. Повторіть спробу пізніше.',
      })
    });
  });
});
