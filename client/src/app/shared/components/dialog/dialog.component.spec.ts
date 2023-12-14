import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogDataInterface } from '../../models/interfaces/dialog-data.interface';
import { DialogTypeEnum } from '../../models/enums/dialog-type.enum';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  const dialogMock: DialogDataInterface = {
    data: {
      title: '',
    },
    dialogType: DialogTypeEnum.Alert,
  };
  const mockMethod = jasmine.createSpyObj('mockDialogRef', ['close']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMethod },
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.data = dialogMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('should close dialog', () => {
      component.close();
      expect(mockMethod.close).toHaveBeenCalled();
    });
  });
});
