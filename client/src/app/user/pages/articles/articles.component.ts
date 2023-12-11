import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TagsListComponent } from './components/tags-list/tags-list.component';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [RouterOutlet, TagsListComponent],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent {}
