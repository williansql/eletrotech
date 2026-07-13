import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  faqs = [
    { q: 'Quanto custa trocar um chuveiro?', a: 'O valor da mão de obra varia de acordo com a infraestrutura existente (se há necessidade de trocar fios ou disjuntor), mas geralmente começa a partir de um valor base fixo. Solicite um orçamento rápido pelo WhatsApp.' },
    { q: 'Você atende emergência?', a: 'Sim! Temos atendimento de emergência prioritário para curtos-circuitos, quedas de energia parciais ou totais e cheiro de queimado.' },
    { q: 'Trabalha aos finais de semana?', a: 'Sim, atendemos com agendamento prévio aos sábados e mantemos plantão de emergências aos domingos e feriados.' },
    { q: 'Emite nota fiscal?', a: 'Sim, emitimos nota fiscal para todos os serviços realizados, tanto para pessoa física (CPF) quanto jurídica (CNPJ).' },
    { q: 'Tem garantia?', a: 'Todos os serviços possuem garantia documentada de acordo com as normas técnicas (NBR 5410) de instalações elétricas.' },
  ];
}
