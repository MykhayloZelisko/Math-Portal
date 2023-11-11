import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';
import { SvgIconRegistryService } from 'angular-svg-icon';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let mockSvgIconRegistryService: jasmine.SpyObj<SvgIconRegistryService>;

  beforeEach(async () => {
    mockSvgIconRegistryService = jasmine.createSpyObj(
      'SvgIconRegistryService.iconReg',
      ['loadSvg'],
    );

    await TestBed.configureTestingModule({
      imports: [AlertComponent],
      providers: [
        {
          provide: SvgIconRegistryService,
          useValue: mockSvgIconRegistryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleAlert', () => {
    it('should set true isAlertVisible value', () => {
      component.isAlertVisible = false;
      component.toggleAlert();

      expect(component.isAlertVisible).toBe(true);
    });
  });
});
