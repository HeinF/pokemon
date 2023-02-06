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
  get pokemonList(): Pokemon[] {
    return this.pokemonService.pokemonList;
  }

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

  buttonClick(name: string) {
    console.log(name);
    this.pokemonService.toggleOwned(name);
  }

  loadMoreHandler() {
    this.pokemonService.fetchPokemonPage();
  }

  handleCatch = (name: string): void => {
    //this.pokemonService.catch(name);
  };

  trainer = (): void => {
    this.router.navigateByUrl('/trainer');
  };

  ngOnInit(): void {
    // this.pokemonService.fetchPokemon();
    this.pokemonService.fetchPokemonCatalogue();
  }
}
