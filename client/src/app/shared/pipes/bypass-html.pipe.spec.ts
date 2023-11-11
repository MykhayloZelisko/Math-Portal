import { BypassHtmlPipe } from './bypass-html.pipe';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

describe('BypassHtmlPipe', () => {
  let pipe: BypassHtmlPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BypassHtmlPipe],
      providers: [
        BypassHtmlPipe,
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (value: string) => value,
          },
        },
      ],
    });
    pipe = TestBed.inject(BypassHtmlPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform html', () => {
    const htmlElm = `<div>Hello, world!</div>`;
    const str = pipe.transform(htmlElm);
    expect(str).toEqual(htmlElm);
  });

  it('should return undefined', () => {
    const str = pipe.transform('');
    expect(str).toBe(undefined);
  });
});
