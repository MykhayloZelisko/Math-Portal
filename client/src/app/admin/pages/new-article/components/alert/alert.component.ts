import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, AngularSvgIconModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  public isAlertVisible: boolean = true;

  public toggleAlert(): void {
    this.isAlertVisible = !this.isAlertVisible;
  }
}
