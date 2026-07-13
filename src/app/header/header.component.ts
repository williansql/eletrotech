import {Component} from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center gap-3 cursor-pointer" (click)="scrollTo('home')">
            <div class="w-10 h-12 relative">
              <svg viewBox="0 0 100 120" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-md">
                <defs>
                  <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fcd34d" />
                    <stop offset="50%" stop-color="#f59e0b" />
                    <stop offset="100%" stop-color="#d97706" />
                  </linearGradient>
                </defs>

                <g stroke="url(#logo-grad)">
                  <!-- Base -->
                  <path d="M38 98 L62 98 M40 105 L60 105 M45 112 L55 112" stroke-width="5" />
                  
                  <!-- Bulb Bottom -->
                  <path d="M38 92 C 38 85, 36 78, 32 72" stroke-width="5" />
                  <path d="M62 92 C 62 85, 64 78, 68 72" stroke-width="5" />

                  <!-- Bulb Top Right -->
                  <path d="M85 45 C 85 25, 70 10, 50 10 C 35 10, 22 18, 16 30" stroke-width="5" />

                  <!-- Top Trace -->
                  <path d="M8 42 Q 35 30, 65 20" stroke-width="8" />
                  <circle cx="68" cy="19" r="3.5" fill="#020617" stroke-width="4" />

                  <!-- Bottom Trace -->
                  <path d="M92 48 Q 65 60, 35 70" stroke-width="8" />
                  <circle cx="32" cy="71" r="3.5" fill="#020617" stroke-width="4" />
                </g>
              </svg>
            </div>
            <span class="font-display font-bold text-xl tracking-wide text-white">
              Eletro<span class="text-amber-500">Tech</span>
            </span>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <button (click)="scrollTo('services')" class="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
              Serviços
            </button>
            <button (click)="scrollTo('calculators')" class="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
              Ferramentas
            </button>
            <button (click)="scrollTo('simulator')" class="text-sm font-bold text-white bg-amber-500/20 border border-amber-500/50 px-4 py-2 rounded-full hover:bg-amber-500 hover:text-slate-900 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              Simulador QDC
            </button>
            <button (click)="scrollTo('diagnosis')" class="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
              Diagnóstico
            </button>
          </nav>
          
          <!-- Mobile Menu Button (Optional, omitted for simplicity if not strictly needed, but let's add a simple one) -->
          <div class="md:hidden flex items-center">
            <button class="text-slate-300 hover:text-white">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
