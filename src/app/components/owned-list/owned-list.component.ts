import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';

@Component({
  selector: 'app-owned-list',
  templateUrl: './owned-list.component.html',
  styleUrls: ['./owned-list.component.css'],
})
export class OwnedListComponent {
  @Input() pokemon: Pokemon[] = [];
  @Output() listenRelease: EventEmitter<any> = new EventEmitter();

  // Emit that trainer has pressed release on a pokemon
  releaseClick(name: string) {
    this.listenRelease.emit(name);
  }
}
