import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type Question = { q: string; cause: string; tip: string };

@Component({
  selector: 'app-diagnosis',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './diagnosis.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagnosisComponent {
  questions: Question[] = [
    { q: 'Meu disjuntor cai constantemente.', cause: 'Sobrecarga no circuito, curto-circuito ou disjuntor defeituoso.', tip: 'Evite ligar muitos aparelhos na mesma tomada. O disjuntor pode precisar ser redimensionado junto com a fiação.' },
    { q: 'Minha tomada esquenta ao uso.', cause: 'Mau contato interno ou fiação subdimensionada para o aparelho.', tip: 'Desligue o aparelho imediatamente. Risco alto de incêndio e derretimento do material plástico.' },
    { q: 'Meu chuveiro desarma no inverno.', cause: 'O chuveiro na posição quente puxa mais corrente que o disjuntor suporta.', tip: 'Não troque apenas o disjuntor! A fiação inteira deve ser verificada e trocada se necessário.' },
    { q: 'Minha luz pisca do nada.', cause: 'Conexões frouxas no quadro, variações da rede ou retorno de neutro.', tip: 'Pode ser sintoma de um problema na entrada de energia. Agende uma revisão geral no quadro.' },
    { q: 'Meu ventilador gira lento.', cause: 'Capacitor fraco ou problema na tensão de alimentação.', tip: 'Geralmente a troca do capacitor do motor resolve de forma rápida e barata.' },
  ];

  selectedQ = signal<Question | null>(null);

  selectQuestion(q: Question) {
    this.selectedQ.set(q);
  }
}
