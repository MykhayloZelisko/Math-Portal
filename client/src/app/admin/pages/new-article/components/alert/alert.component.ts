import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [AngularSvgIconModule, NgIf],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  public isAlertVisible: boolean = true;

  public toggleAlert(): void {
    this.isAlertVisible = !this.isAlertVisible;
  }
}
