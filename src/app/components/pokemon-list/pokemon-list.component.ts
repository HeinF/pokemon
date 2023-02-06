import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
})
export class PokemonListComponent {
  @Input() pokemon: Pokemon[] = [];
  @Input() pageIndex: number = 15;
  @Output() listenParentHandler: EventEmitter<any> = new EventEmitter();
  @Output() loadMore: EventEmitter<any> = new EventEmitter();

  childClick(name: string) {
    this.listenParentHandler.emit(name);
  }

  loadMoreClick() {
    this.loadMore.emit();
  }
}
