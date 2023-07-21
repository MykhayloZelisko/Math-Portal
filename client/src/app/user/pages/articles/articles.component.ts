import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TagsListComponent } from './components/tags-list/tags-list.component';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TagsListComponent],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent {}
