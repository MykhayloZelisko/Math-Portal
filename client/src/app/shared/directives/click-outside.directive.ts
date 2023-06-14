import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
} from '@angular/core';
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
  @Output()
  public clickOutside = new EventEmitter<void>();

  private destroy$: Subject<void> = new Subject<void>();

  public constructor(private element: ElementRef, @Inject(DOCUMENT) private document: Document) {}

  public ngAfterViewInit(): void {
    fromEvent(this.document, 'click')
      .pipe(
        takeUntil(this.destroy$),
        filter((event: Event) => !this.inside(event.target as HTMLElement)),
      )
      .subscribe(() => this.clickOutside.emit());
  }

  public inside(element: HTMLElement): boolean {
    return element === this.element.nativeElement || this.element.nativeElement.contains(element);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
