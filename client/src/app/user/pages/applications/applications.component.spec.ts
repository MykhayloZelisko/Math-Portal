import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationsComponent } from './applications.component';
import { AppNameEnum } from '../../../shared/models/enums/app-name.enum';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { APP_NAMES } from '../../../shared/models/constants/app-names';

describe('ApplicationsComponent', () => {
  let component: ApplicationsComponent;
  let fixture: ComponentFixture<ApplicationsComponent>;
  let router: Router;
  const mockRouter = {
    url: '',
    navigateByUrl: jasmine.createSpy('navigateByUrl'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationsComponent],
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationsComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initApp and initRoute methods', () => {
      spyOn(component, 'initApp');
      spyOn(component, 'initRoute');
      component.ngOnInit();

      expect(component.initApp).toHaveBeenCalled();
      expect(component.initRoute).toHaveBeenCalled();
    });
  });

  describe('initApp', () => {
    it('should redirect to triangle app', () => {
      spyOn(component.appCtrl.valueChanges, 'pipe').and.returnValue(
        of({
          title: `Розв'язування трикутників`,
          value: AppNameEnum.SolvingTriangle,
        }),
      );
      component.initApp();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/applications/triangle',
      );
    });

    it('should redirect to linear system app', () => {
      spyOn(component.appCtrl.valueChanges, 'pipe').and.returnValue(
        of({
          title: 'Системи лінійних алгебраїчних рівнянь',
          value: AppNameEnum.SystemLinearEquations,
        }),
      );
      component.initApp();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/applications/linear-system',
      );
    });

    it('should redirect to linear system app', () => {
      spyOn(component.appCtrl.valueChanges, 'pipe').and.returnValue(
        of({
          title: '',
          value: null,
        }),
      );
      component.initApp();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/applications');
    });
  });

  describe('initRoute', () => {
    it('should set linear system to control', () => {
      mockRouter.url = '/applications/linear-system';
      component.initRoute();

      expect(component.appCtrl.value).toEqual(APP_NAMES[1]);
    });

    it('should set triangle to control', () => {
      mockRouter.url = '/applications/triangle';
      component.initRoute();

      expect(component.appCtrl.value).toEqual(APP_NAMES[0]);
    });
  });
});
