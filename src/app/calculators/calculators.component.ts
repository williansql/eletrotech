import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

type CalculatorTab = 'power' | 'consumption' | 'shower' | 'ac' | 'cable' | 'simulator';

@Component({
  selector: 'app-calculators',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './calculators.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorsComponent {
  activeTab = signal<CalculatorTab>('power');

  powerForm: FormGroup;
  consumptionForm: FormGroup;
  showerForm: FormGroup;
  acForm: FormGroup;
  cableForm: FormGroup;
  simulatorForm: FormGroup;

  powerResult = signal<{ current: number; breaker: number; wire: string } | null>(null);
  consumptionResult = signal<{ kwh: number; cost: number } | null>(null);
  showerResult = signal<{ current: number; breaker: number; wire: string } | null>(null);
  acResult = signal<{ current: number; breaker: number; wire: string } | null>(null);
  cableResult = signal<{ wire: string; drop: number } | null>(null);
  simulatorResult = signal<{ cost: number } | null>(null);

  constructor(private fb: FormBuilder) {
    this.powerForm = this.fb.group({
      voltage: ['220', Validators.required],
      power: [2200, [Validators.required, Validators.min(1)]],
    });

    this.consumptionForm = this.fb.group({
      device: ['Geladeira', Validators.required],
      qty: [1, [Validators.required, Validators.min(1)]],
      hours: [24, [Validators.required, Validators.min(1), Validators.max(24)]],
      days: [30, [Validators.required, Validators.min(1), Validators.max(31)]],
      kwhPrice: [0.95, [Validators.required, Validators.min(0.01)]],
      powerRating: [150],
    });

    this.showerForm = this.fb.group({
      power: ['5500', Validators.required],
      voltage: ['220', Validators.required],
    });

    this.acForm = this.fb.group({
      btu: ['9000', Validators.required],
      voltage: ['220'],
    });

    this.cableForm = this.fb.group({
      power: [1000, Validators.required],
      distance: [10, Validators.required],
      voltage: ['220', Validators.required],
    });

    this.simulatorForm = this.fb.group({
      outlets: [10],
      switches: [5],
      lights: [8],
      fans: [2],
      boards: [1],
      breakers: [10],
    });

    this.consumptionForm.get('device')?.valueChanges.subscribe(device => {
      let p = 150;
      switch(device) {
        case 'Geladeira': p = 150; break;
        case 'TV': p = 100; break;
        case 'Microondas': p = 1200; break;
        case 'Ar-condicionado': p = 1500; break;
        case 'Chuveiro': p = 5500; break;
        case 'Computador': p = 300; break;
        case 'Ferro': p = 1000; break;
        case 'Lampada': p = 9; break;
      }
      this.consumptionForm.patchValue({ powerRating: p });
    });
  }

  setTab(tab: CalculatorTab) {
    this.activeTab.set(tab);
  }

  calcPower() {
    if (this.powerForm.invalid) return;
    const { voltage, power } = this.powerForm.value;
    const current = power / parseInt(voltage, 10);
    const breaker = this.getBreaker(current);
    const wire = this.getWireSection(breaker);
    this.powerResult.set({ current: Number(current.toFixed(2)), breaker, wire });
  }

  calcConsumption() {
    if (this.consumptionForm.invalid) return;
    const { qty, hours, days, kwhPrice, powerRating } = this.consumptionForm.value;
    const monthlyKwh = ((powerRating / 1000) * hours * days) * qty;
    const cost = monthlyKwh * kwhPrice;
    this.consumptionResult.set({ kwh: Number(monthlyKwh.toFixed(2)), cost: Number(cost.toFixed(2)) });
  }

  calcShower() {
    if (this.showerForm.invalid) return;
    const { power, voltage } = this.showerForm.value;
    const current = parseInt(power, 10) / parseInt(voltage, 10);
    const breaker = this.getBreaker(current);
    const wire = this.getWireSection(breaker);
    this.showerResult.set({ current: Number(current.toFixed(2)), breaker, wire });
  }

  calcAc() {
    if (this.acForm.invalid) return;
    const btu = parseInt(this.acForm.value.btu, 10);
    let power = 0;
    switch(btu) {
      case 9000: power = 820; break;
      case 12000: power = 1080; break;
      case 18000: power = 1650; break;
      case 24000: power = 2200; break;
    }
    const current = power / 220;
    const breaker = this.getBreaker(current);
    const wire = this.getWireSection(breaker);
    this.acResult.set({ current: Number(current.toFixed(2)), breaker, wire });
  }

  calcCable() {
    if (this.cableForm.invalid) return;
    const { power, distance, voltage } = this.cableForm.value;
    const i = power / parseInt(voltage, 10);
    const v = parseInt(voltage, 10);
    const rho = 0.0172;
    const baseWireString = this.getWireSection(i);
    const baseWireNumber = parseFloat(baseWireString.replace(',', '.'));
    
    const dropV = (2 * rho * distance * i) / baseWireNumber;
    const dropPercent = (dropV / v) * 100;
    
    this.cableResult.set({ wire: baseWireString, drop: Number(dropPercent.toFixed(2)) });
  }

  calcSimulator() {
    const vals = this.simulatorForm.value;
    const cost = 
      vals.outlets * 50 + 
      vals.switches * 45 + 
      vals.lights * 60 + 
      vals.fans * 150 + 
      vals.boards * 300 + 
      vals.breakers * 30;
      
    this.simulatorResult.set({ cost });
  }

  private getBreaker(current: number): number {
    const sizes = [10, 16, 20, 25, 32, 40, 50, 63, 80, 100];
    return sizes.find(s => s >= current) || 100;
  }

  private getWireSection(breaker: number): string {
    if (breaker <= 16) return '2,5';
    if (breaker <= 25) return '4,0';
    if (breaker <= 32) return '6,0';
    if (breaker <= 40) return '10,0';
    if (breaker <= 63) return '16,0';
    return '25,0';
  }
}
