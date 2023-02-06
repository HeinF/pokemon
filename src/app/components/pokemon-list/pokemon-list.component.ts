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
  @Output() listenOwnership: EventEmitter<any> = new EventEmitter();
  @Output() listenLoadMore: EventEmitter<any> = new EventEmitter();

  ownershipClick(name: string) {
    this.listenOwnership.emit(name);
  }

  loadMoreClick() {
    this.listenLoadMore.emit();
  }
}
