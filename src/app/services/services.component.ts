import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  services = [
    { icon: 'electrical_services', title: 'Instalação elétrica', desc: 'Residencial e comercial completa.' },
    { icon: 'lightbulb', title: 'Instalação de luminárias', desc: 'Spots, lustres, fitas LED e mais.' },
    { icon: 'shower', title: 'Chuveiro elétrico', desc: 'Instalação, troca de resistência e fiação.' },
    { icon: 'power', title: 'Tomadas e interruptores', desc: 'Troca, reparo e novas instalações.' },
    { icon: 'developer_board', title: 'Quadro de distribuição', desc: 'Montagem e balanceamento de carga.' },
    { icon: 'warning', title: 'Correção de curto-circuito', desc: 'Diagnóstico e reparo de falhas.' },
    { icon: 'mode_fan', title: 'Ventilador de teto', desc: 'Instalação segura e balanceamento.' },
    { icon: 'videocam', title: 'Câmeras', desc: 'CFTV e monitoramento residencial.' },
    { icon: 'settings_phone', title: 'Interfone', desc: 'Sistemas de comunicação e portaria.' },
    { icon: 'door_sliding', title: 'Portão eletrônico', desc: 'Instalação e manutenção de motores.' },
  ];
}
