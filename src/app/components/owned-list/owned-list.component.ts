import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';

@Component({
  selector: 'app-owned-list',
  templateUrl: './owned-list.component.html',
  styleUrls: ['./owned-list.component.css'],
})
export class OwnedListComponent {
  @Input() pokemon: Pokemon[] = [];
  @Output() listenParentHandler: EventEmitter<any> = new EventEmitter();

  childClick(name: string) {
    this.listenParentHandler.emit(name);
  }
}
