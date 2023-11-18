import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFilterComponent } from './users-filter.component';
import { of } from 'rxjs';

describe('UsersFilterComponent', () => {
  let component: UsersFilterComponent;
  let fixture: ComponentFixture<UsersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initSearchValue method', () => {
      spyOn(component, 'initSearchValue');
      component.ngOnInit();

      expect(component.initSearchValue).toHaveBeenCalled();
    });
  });

  describe('initSearchValue', () => {
    it('should emit search value', () => {
      spyOn(component.searchUserCtrl.valueChanges, 'pipe').and.returnValue(of('search'));
      spyOn(component.searchUser, 'emit');
      component.initSearchValue();

      expect(component.searchUser.emit).toHaveBeenCalledWith('search');
    });
  });
});
