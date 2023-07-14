import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';

@Component({
  selector: 'app-article-title',
  standalone: true,
  imports: [CommonModule, AngularSvgIconModule, FormsModule, MathjaxModule],
  templateUrl: './article-title.component.html',
  styleUrls: ['./article-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleTitleComponent {
  public value: string = '';

  public isTitleEditable: boolean = true;

  public showTitle() {
    this.isTitleEditable = false;
  }

  public editTitle() {
    this.isTitleEditable = true;
  }
}
