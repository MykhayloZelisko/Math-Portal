import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
@Directive({
  selector: '[appIsAuth]',
  standalone: true
})
export class IsAuthDirective implements OnInit {
  public constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
  ) { }

  public ngOnInit(): void {
    this.isAuthenticated();
  }

  private isAuthenticated(): void {
    if (sessionStorage.getItem('token')) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
