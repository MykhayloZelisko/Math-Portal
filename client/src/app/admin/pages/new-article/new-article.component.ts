import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleTagsComponent } from './components/article-tags/article-tags.component';
import { MathjaxModule } from 'mathjax-angular';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ArticleTitleComponent } from './components/article-title/article-title.component';
import { ArticleContentComponent } from './components/article-content/article-content.component';

@Component({
  selector: 'app-new-article',
  standalone: true,
  imports: [
    CommonModule,
    ArticleTagsComponent,
    ArticleTitleComponent,
    ArticleContentComponent,
  ],
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewArticleComponent {

}
