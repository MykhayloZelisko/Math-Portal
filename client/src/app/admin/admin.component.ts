import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabsComponent } from './components/tabs/tabs.component';
import { RouterOutlet } from '@angular/router';
import { TabItemInterface } from '../shared/models/interfaces/tab-item.interface';
import { AdminRouteNameEnum } from '../shared/models/enums/admin-route-name.enum';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TabsComponent, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  public tabs: TabItemInterface[] = [
    {
      label: 'Користувачі',
      route: AdminRouteNameEnum.Users,
    },
    {
      label: 'Теги',
      route: AdminRouteNameEnum.Tags,
    },
    {
      label: 'Нова стаття',
      route: AdminRouteNameEnum.NewArticle,
    },
  ];
}
