import { Component, ChangeDetectionStrategy, signal, computed, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type CircuitType = 'iluminacao' | 'tug' | 'chuveiro' | 'ar';

interface Circuit {
  id: number;
  type: CircuitType;
  current: number;
  name: string;
}

interface Wire {
  id: string;
  from: string;
  to: string;
  color: string;
  waypoints: {x: number, y: number}[];
}

interface WirePathData {
  id: string;
  d: string;
  color: string;
}

@Component({
  selector: 'app-qdc-simulator',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './qdc-simulator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QdcSimulatorComponent implements AfterViewInit {
  @ViewChild('qdcContainer') qdcContainer!: ElementRef<HTMLDivElement>;
  
  networkType = signal<'mono' | 'bi' | 'tri'>('mono');
  voltage = signal<'127' | '220'>('127');

  hasGeral = signal<boolean>(true);
  hasDR = signal<boolean>(false);
  hasDPS = signal<boolean>(false);
  
  circuits = signal<Circuit[]>([]);
  
  activeTerminal = signal<string | null>(null);
  activeWaypoints = signal<{x: number, y: number}[]>([]);
  activeTerminalStartCoords = signal<{x: number, y: number} | null>(null);
  mousePos = signal<{x: number, y: number} | null>(null);
  
  wires = signal<Wire[]>([]);
  layoutRefresh = signal(0);
  showValidation = signal<boolean>(false);
  
  private nextId = 1;

  phases = computed(() => {
    const type = this.networkType();
    if (type === 'mono') return ['f1'];
    if (type === 'bi') return ['f1', 'f2'];
    return ['f1', 'f2', 'f3'];
  });

  ngAfterViewInit() {
    setTimeout(() => this.layoutRefresh.update(v => v + 1), 100);
  }

  @HostListener('window:resize')
  onResize() {
    this.layoutRefresh.update(v => v + 1);
  }

  @HostListener('document:keydown.escape')
  onKeydownHandler() {
    if (this.activeTerminal()) {
      this.activeTerminal.set(null);
      this.activeWaypoints.set([]);
      this.activeTerminalStartCoords.set(null);
    }
  }

  onNetworkTypeChange(e: Event) {
    this.networkType.set((e.target as HTMLSelectElement).value as any);
    this.clearWires();
    setTimeout(() => this.layoutRefresh.update(v => v + 1), 50);
  }

  onVoltageChange(e: Event) {
    this.voltage.set((e.target as HTMLSelectElement).value as any);
  }

  toggleGeral() { 
    this.hasGeral.update(v => !v); 
    if (!this.hasGeral()) this.removeComponentWires('geral');
    this.showValidation.set(false);
    setTimeout(() => this.layoutRefresh.update(v => v + 1), 50);
  }
  
  toggleDR() { 
    this.hasDR.update(v => !v); 
    if (!this.hasDR()) this.removeComponentWires('dr');
    this.showValidation.set(false);
    setTimeout(() => this.layoutRefresh.update(v => v + 1), 50);
  }
  
  toggleDPS() { 
    this.hasDPS.update(v => !v); 
    if (!this.hasDPS()) this.removeComponentWires('dps');
    this.showValidation.set(false);
    setTimeout(() => this.layoutRefresh.update(v => v + 1), 50);
  }

  addCircuit(type: CircuitType) {
    let name = '';
    let current = 10;
    
    switch (type) {
      case 'iluminacao': name = 'Iluminação'; current = 10; break;
      case 'tug': name = 'Tomadas (TUG)'; current = 16; break;
      case 'chuveiro': name = 'Chuveiro'; current = 40; break;
      case 'ar': name = 'Ar Condicionado'; current = 20; break;
    }

    this.circuits.update(c => [...c, { id: this.nextId++, type, current, name }]);
    this.showValidation.set(false);
    setTimeout(() => this.layoutRefresh.update(v => v + 1), 50);
  }

  removeCircuit(id: number, event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.circuits.update(c => c.filter(x => x.id !== id));
    this.removeComponentWires('circuit_in_' + id);
    this.showValidation.set(false);
    setTimeout(() => this.layoutRefresh.update(v => v + 1), 50);
  }

  removeComponentWires(prefix: string) {
    this.wires.update(ws => ws.filter(w => !w.from.startsWith(prefix) && !w.to.startsWith(prefix)));
  }

  removeWire(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.wires.update(ws => ws.filter(w => w.id !== id));
    this.showValidation.set(false);
  }

  clearWires() {
    this.wires.set([]);
    this.activeTerminal.set(null);
    this.activeWaypoints.set([]);
    this.activeTerminalStartCoords.set(null);
    this.showValidation.set(false);
  }

  getTerminalColor(id: string): string {
    if (id.includes('neutral') || id.includes('_n')) return '#3b82f6';
    if (id.includes('ground') || id.includes('pe') || id.includes('dps_out')) return '#22c55e';
    if (id.includes('f1')) return '#ef4444';
    if (id.includes('f2')) return '#f8fafc';
    if (id.includes('f3')) return '#0f172a';
    return '#ef4444'; 
  }

  isConnected(id: string) {
    return this.wires().some(w => w.from === id || w.to === id);
  }

  getTerminalCoords(id: string) {
    if (!this.qdcContainer) return null;
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const contRect = this.qdcContainer.nativeElement.getBoundingClientRect();
    return {
      x: rect.left - contRect.left + rect.width / 2,
      y: rect.top - contRect.top + rect.height / 2
    };
  }

  onTerminalClick(id: string, event: MouseEvent) {
    event.stopPropagation();
    const active = this.activeTerminal();
    
    if (active === null) {
      this.activeTerminal.set(id);
      this.activeWaypoints.set([]);
      this.activeTerminalStartCoords.set(this.getTerminalCoords(id));
      this.showValidation.set(false);
    } else if (active === id) {
      this.activeTerminal.set(null);
      this.activeWaypoints.set([]);
      this.activeTerminalStartCoords.set(null);
    } else {
      const exists = this.wires().some(w => (w.from === active && w.to === id) || (w.from === id && w.to === active));
      if (exists) {
        this.wires.update(ws => ws.filter(w => !((w.from === active && w.to === id) || (w.from === id && w.to === active))));
      } else {
        const color = this.getTerminalColor(active);
        this.wires.update(ws => [...ws, {
          id: active + '_' + id + '_' + Date.now(),
          from: active,
          to: id,
          color,
          waypoints: [...this.activeWaypoints()]
        }]);
      }
      this.activeTerminal.set(null);
      this.activeWaypoints.set([]);
      this.activeTerminalStartCoords.set(null);
      this.showValidation.set(false);
    }
  }

  onBoardClick(event: MouseEvent) {
    if (this.activeTerminal()) {
       const rect = this.qdcContainer.nativeElement.getBoundingClientRect();
       const x = event.clientX - rect.left;
       const y = event.clientY - rect.top;
       this.activeWaypoints.update(w => [...w, {x, y}]);
    }
  }
  
  onMouseMove(event: MouseEvent) {
    if (this.activeTerminal()) {
       const rect = this.qdcContainer.nativeElement.getBoundingClientRect();
       this.mousePos.set({x: event.clientX - rect.left, y: event.clientY - rect.top});
    }
  }

  wirePaths = computed<WirePathData[]>(() => {
    this.layoutRefresh(); 
    return this.wires().map(wire => {
      const start = this.getTerminalCoords(wire.from);
      const end = this.getTerminalCoords(wire.to);
      if (!start || !end) return null;
      let d = `M ${start.x} ${start.y}`;
      for (const wp of wire.waypoints) {
        d += ` L ${wp.x} ${wp.y}`;
      }
      d += ` L ${end.x} ${end.y}`;
      return { id: wire.id, d, color: wire.color };
    }).filter(x => x !== null) as WirePathData[];
  });

  activeWirePath = computed(() => {
    const start = this.activeTerminalStartCoords();
    const mouse = this.mousePos();
    const active = this.activeTerminal();
    this.layoutRefresh();
    
    if (!start || !mouse || !active) return null;
    
    let d = `M ${start.x} ${start.y}`;
    for (const wp of this.activeWaypoints()) {
      d += ` L ${wp.x} ${wp.y}`;
    }
    d += ` L ${mouse.x} ${mouse.y}`;
    return { d, color: this.getTerminalColor(active) };
  });

  hasPath(start: string, end: string, ignoreInternalOf?: string, visited = new Set<string>()): boolean {
    if (start === end) return true;
    visited.add(start);
    
    const internalConnections: {from: string, to: string}[] = [];
    
    if (this.hasGeral() && ignoreInternalOf !== 'geral') {
       this.phases().forEach(p => {
          internalConnections.push({from: 'geral_in_' + p, to: 'geral_out_' + p});
          internalConnections.push({from: 'geral_out_' + p, to: 'geral_in_' + p});
       });
    }
    if (this.hasDR() && ignoreInternalOf !== 'dr') {
       ['f1', 'f2', 'f3'].forEach(p => {
          internalConnections.push({from: 'dr_in_' + p, to: 'dr_out_' + p});
          internalConnections.push({from: 'dr_out_' + p, to: 'dr_in_' + p});
       });
       internalConnections.push({from: 'dr_in_n', to: 'dr_out_n'});
       internalConnections.push({from: 'dr_out_n', to: 'dr_in_n'});
    }
    
    const edges = [
       ...this.wires().flatMap(w => [{from: w.from, to: w.to}, {from: w.to, to: w.from}]),
       ...internalConnections
    ];
    
    const connected = edges.filter(e => e.from === start).map(e => e.to);
      
    for (const node of connected) {
      if (!visited.has(node)) {
        if (this.hasPath(node, end, ignoreInternalOf, visited)) return true;
      }
    }
    return false;
  }

  hasLightingAndOutlets = computed(() => {
    const circs = this.circuits();
    return circs.some(c => c.type === 'iluminacao') && circs.some(c => c.type === 'tug');
  });

  diagGeralWired = computed(() => {
    if (!this.hasGeral()) return false;
    return this.phases().every(p => this.hasPath('grid_' + p, 'geral_in_' + p, 'geral'));
  });

  diagDrPhaseWired = computed(() => {
    if (!this.hasDR()) return false;
    return this.phases().every(p => this.hasPath('grid_' + p, 'dr_in_' + p, 'dr'));
  });
  
  diagDrNeutralWired = computed(() => {
    if (!this.hasDR()) return false;
    return this.hasPath('grid_n', 'dr_in_n', 'dr') && this.hasPath('dr_out_n', 'bus_neutral', 'dr');
  });

  diagDpsWired = computed(() => {
    if (!this.hasDPS()) return false;
    return this.phases().every(p => 
      this.hasPath('grid_' + p, 'dps_in_' + p) && 
      this.hasPath('dps_out_' + p, 'bus_ground')
    );
  });
  
  diagGroundWired = computed(() => this.hasPath('grid_pe', 'bus_ground'));
  
  diagCircuitsWired = computed(() => {
    const circs = this.circuits();
    if (circs.length === 0) return false;
    return circs.every(c => this.phases().some(p => this.hasPath('grid_' + p, 'circuit_in_' + c.id)));
  });

  validateQdc() {
    this.showValidation.set(true);
  }

  safetyScore = computed(() => {
    let score = 10;
    
    if (this.hasGeral()) {
      score += 10;
      if (this.diagGeralWired()) score += 10;
    }
    
    if (this.hasDR()) {
      score += 15;
      if (this.diagDrPhaseWired() && this.diagDrNeutralWired()) score += 15;
    }
    
    if (this.hasDPS()) {
      score += 10;
      if (this.diagDpsWired()) score += 10;
    }
    
    if (this.hasLightingAndOutlets()) score += 10;
    
    if (this.circuits().length > 0 && this.diagCircuitsWired()) {
      score += 10;
    }
    
    return Math.min(100, score);
  });
}

