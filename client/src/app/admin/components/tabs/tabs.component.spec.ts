import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';
import { Subject } from 'rxjs';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  const eventsSubject = new Subject();
  const mockRouter = {
    events: eventsSubject.asObservable(),
  };
  const mockActiveRoute = {
    children: [
      {
        snapshot: {
          data: {
            path: '/',
          },
        },
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActiveRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call setActiveRoute 3 times', () => {
      spyOn(component, 'setActiveRoute');
      component.ngOnInit();
      eventsSubject.next(new NavigationEnd(0, '/', '/'));

      expect(component.setActiveRoute).toHaveBeenCalledTimes(3);
    });

    it('should call setActiveRoute once', () => {
      spyOn(component, 'setActiveRoute');
      component.ngOnInit();
      eventsSubject.next(new NavigationStart(0, '/', undefined));

      expect(component.setActiveRoute).toHaveBeenCalledTimes(1);
    });
  });

  describe('setActiveRoute', () => {
    it('should set activeRoute', () => {
      component.setActiveRoute();

      expect(component.activeRoute).toBe('/');
    });
  });
});
