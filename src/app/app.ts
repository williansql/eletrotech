import {ChangeDetectionStrategy, Component} from '@angular/core';
import {HeaderComponent} from './header/header.component';
import {HeroComponent} from './hero/hero.component';
import {ServicesComponent} from './services/services.component';
import {CalculatorsComponent} from './calculators/calculators.component';
import {QdcSimulatorComponent} from './qdc-simulator/qdc-simulator.component';
import {DiagnosisComponent} from './diagnosis/diagnosis.component';
import {FooterComponent} from './footer/footer.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [HeaderComponent, HeroComponent, ServicesComponent, CalculatorsComponent, QdcSimulatorComponent, DiagnosisComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
