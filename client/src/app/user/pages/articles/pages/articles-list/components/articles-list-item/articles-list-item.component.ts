import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleInterface } from '../../../../../../../shared/models/interfaces/article.interface';
import { MathjaxModule } from 'mathjax-angular';
import { Router } from '@angular/router';
import { BypassHtmlPipe } from '../../../../../../../shared/pipes/bypass-html.pipe';

@Component({
  selector: 'app-articles-list-item',
  standalone: true,
  imports: [CommonModule, MathjaxModule, BypassHtmlPipe],
  templateUrl: './articles-list-item.component.html',
  styleUrls: ['./articles-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesListItemComponent {
  @Input() public article!: ArticleInterface;

  public constructor(private router: Router) {}

  public openArticle(): void {
    this.router.navigateByUrl(`articles/${this.article.id}`);
  }
}
