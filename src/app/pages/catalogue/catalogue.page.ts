import { Component, OnInit } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.page.html',
  styleUrls: ['./catalogue.page.css'],
})
export class CataloguePage implements OnInit {
  get pokemonCatalogue(): Pokemon[] {
    return this.pokemonService.pokemonCatalogue;
  }

  get pageIndex(): number {
    return this.pokemonService.pageIndex;
  }

  get loading(): boolean {
    return this.pokemonService.loading;
  }

  get error(): string {
    return this.pokemonService.error;
  }

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly router: Router
  ) {}

  // Handle emitted event. Player has either pressed catch or release
  ownershipClick(name: string) {
    this.pokemonService.toggleOwned(name);
  }
  // Fetches details for more Pokemon and displays them
  loadMoreClick() {
    this.pokemonService.fetchPokemonPage();
  }
  // Ensure catalogue has been loaded
  ngOnInit(): void {
    this.pokemonService.fetchPokemonCatalogue();
  }
}
