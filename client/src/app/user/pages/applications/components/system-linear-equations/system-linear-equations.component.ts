import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-linear-equations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-linear-equations.component.html',
  styleUrls: ['./system-linear-equations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemLinearEquationsComponent {}
