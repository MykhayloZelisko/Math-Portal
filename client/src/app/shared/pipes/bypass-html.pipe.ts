import { Inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'bypassHtml',
  standalone: true
})
export class BypassHtmlPipe implements PipeTransform  {
  constructor(@Inject(DomSanitizer) private readonly sanitized: DomSanitizer) {}

  transform(value: string): SafeHtml {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
