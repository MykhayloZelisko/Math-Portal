import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './components/tabs/tabs.component';
import { RouterOutlet } from '@angular/router';
import { TabItemInterface } from '../shared/models/interfaces/tab-item.interface';
import { AdminRouteNameEnum } from '../shared/models/enums/admin-route-name.enum';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, TabsComponent, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
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
