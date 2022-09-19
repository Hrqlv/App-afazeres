import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  novaTarefa: string = '';
  tarefas: string[] = [];
  tarefasBackup: string[] = [];

  constructor(
    private storage: Storage,
    private toast: ToastController 
    ) {
    this.iniciarBanco();
  }

  async desfazer(tarefaExcluida){
    const t = await this.toast.create({
      message: 'Você excluiu ' +tarefaExcluida,
      duration: 3000,
      color: 'dark',
      buttons: [
        {
        text: 'Desfazer',
        handler: async () => {
        this.tarefas = [...this.tarefasBackup];
        await this.storage.set('tarefas', this.tarefas);

        }
        }
      ]
    });
    t.present();
  }

async iniciarBanco(){
  await this.storage.create();
  this.tarefas = await this.storage.get('tarefas') ?? [];
}

  async apagarTarefa(indice){
    this.desfazer(this.tarefas[indice]);
    this.tarefasBackup = [...this.tarefas];
    this.tarefas.splice(indice, 1);
    await this.storage.set('tarefas', this.tarefas);
  }

  async adicionarTarefa(){
    this.tarefas.push(this.novaTarefa);
    this.novaTarefa = '';
    await this.storage.set('tarefas', this.tarefas);
  }
}
