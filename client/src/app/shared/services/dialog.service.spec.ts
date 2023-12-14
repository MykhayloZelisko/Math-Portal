import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogTypeEnum } from '../models/enums/dialog-type.enum';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, BrowserAnimationsModule],
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openDialog', () => {
    it('should be open', () => {
      const spy = spyOn(service, 'openDialog').and.callThrough();
      service.openDialog(DialogTypeEnum.Alert);
      expect(spy).toHaveBeenCalled();
    });
  });
});
