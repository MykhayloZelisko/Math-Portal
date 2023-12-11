import { inject, Inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'bypassHtml',
  standalone: true,
})
export class BypassHtmlPipe implements PipeTransform {
  private sanitized = inject(DomSanitizer);

  public transform(value: string): SafeHtml | undefined {
    if (!value) {
      return;
    }
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
