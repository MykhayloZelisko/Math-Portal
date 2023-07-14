import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from 'mathjax-angular';

@Component({
  selector: 'app-article-content',
  standalone: true,
  imports: [CommonModule, AngularSvgIconModule, FormsModule, MathjaxModule],
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleContentComponent {
  public value: string = '';

  public isContentEditable: boolean = true;

  public showContent() {
    this.isContentEditable = false;
  }

  public editContent() {
    this.isContentEditable = true;
  }
}
