import { ClickOutsideDirective } from './click-outside.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from '../../layout/components/header/header.component';
import { UsersService } from '../services/users.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let directive: ClickOutsideDirective;
  let mockUsersService: jasmine.SpyObj<UsersService>;

  beforeEach(() => {
    mockUsersService = jasmine.createSpyObj('UsersService', ['']);
    TestBed.configureTestingModule({
      imports: [HeaderComponent, ClickOutsideDirective, RouterTestingModule],
      providers: [
        { provide: Document, useExisting: DOCUMENT },
        { provide: UsersService, useValue: mockUsersService },
      ],
    });

    fixture = TestBed.createComponent(HeaderComponent);
    const element = fixture.elementRef;
    directive = new ClickOutsideDirective(element, document);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
