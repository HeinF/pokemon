import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import {
  API_KEY,
  FETCH_LIMIT,
  PAGE_ITEM_LIMIT,
  POKEMON_API_URL,
  TRAINER_API_URL,
} from '../const/const';
import {
  PokeDetail,
  PokeList,
  Pokemon,
  PokeResult,
} from '../models/pokemon.model';
import { Trainer } from '../models/trainer.model';
import { TrainerService } from './trainer.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  // Error and loading is not currently used TODO
  private _error: string = '';
  private _loading: boolean = false;

  // Catalogue containing pokemon
  private _pokemonCatalogue: Pokemon[] = [];

  // Used to set the number of pokemon to display and fetch details of on first page load,
  // and the amount of additional pokemon to fetch every time a users asks for more pokemon.
  private _pageIndex: number = PAGE_ITEM_LIMIT;

  // getters
  public get pokemonCatalogue(): Pokemon[] {
    return this._pokemonCatalogue;
  }

  public get pageIndex(): number {
    return this._pageIndex;
  }

  public get error(): string {
    return this._error;
  }

  public get loading(): boolean {
    return this._loading;
  }

  constructor(
    private readonly http: HttpClient,
    private readonly trainerService: TrainerService
  ) {}

  // Fetches basic details in one request on a number of pokemon defined by FETCH_LIMIT up to all pokemon available in the API
  // Details include name and URL to call for information on specific pokemon
  public fetchPokemonCatalogue(): void {
    // Check if pokemonCatalogue has already been fetched to avoid unnecessary API calls
    if (this._pokemonCatalogue.length < 1) {
      this.http
        .get<PokeResult>(`${POKEMON_API_URL}?limit=${FETCH_LIMIT}`)
        .pipe(
          map((response: PokeResult) => {
            return response.results;
          })
        )
        .subscribe({
          next: (pokemonList: PokeList[]) => {
            // Create a placeholder pokemon and add it to pokemonCatalogue
            //Placeholder data is used for details not in the response
            for (const poke of pokemonList) {
              let pokemon: Pokemon = {
                name: poke.name,
                id: -1,
                url: poke.url,
                order: 9999,
                image: '',
                owned: false,
                // Boolean value to indicate that only basic data has been fetched
                // More data is required actually display the Pokemon
                loaded: false,
              };
              this._pokemonCatalogue.push(pokemon);
            }
            // This function will fetch full details so we can show the first page of Pokemon
            this.fetchFirstPage();
          },
        });
    } else {
      // Check for changes to owned Pokemon, even if catalogue has been fetched
      this.initOwned();
    }
  }

  // Fetches full details of the first batch of Pokemon so they can be displayed.
  public fetchFirstPage(): void {
    // Limits the number of pokemon we get full details for
    let indexEnd = PAGE_ITEM_LIMIT;
    // Prevent index out of bounds
    if (indexEnd >= this._pokemonCatalogue.length) {
      indexEnd = this._pokemonCatalogue.length;
    }
    // Loop over x amount of Pokemon in the Catalogue and fetch their details
    for (let i = 0; i < indexEnd; i++) {
      let poke = this._pokemonCatalogue[i];
      if (!poke.loaded) {
        this.http
          .get<PokeDetail>(poke.url)
          .pipe(
            map((response: PokeDetail) => {
              return response;
            })
          )
          .subscribe({
            next: (data: PokeDetail) => {
              this._pokemonCatalogue[i].id = data.id;
              this._pokemonCatalogue[i].order = data.order;
              this._pokemonCatalogue[i].image = data.sprites.front_default;
              this._pokemonCatalogue[i].loaded = true;
              // Check and fetch owned pokemon in last loop to avoid duplicate calls
              if (i === indexEnd - 1) {
                this.initOwned();
              }
            },
          });
      }
    }
  }

  // Check if the pokemon is owned by the trainer, and if so set the 'owned' flag in the catalogue
  public initOwned(): void {
    if (this.trainerService.trainer) {
      for (const poke of this._pokemonCatalogue) {
        if (this.trainerService.isOwned(poke.name)) {
          poke.owned = true;
        } else {
          poke.owned = false;
        }
      }
      // A user can have pokemon that are outside the bounds of the first page, so we ensure that we fetch
      // details for all owned Pokemon as these will be displayed on the trainer page.
      this.fetchOwned();
    }
  }
  // Ensure that we have fetched detailed data for all owned pokemon
  public fetchOwned(): void {
    for (const pokemon of this._pokemonCatalogue) {
      if (pokemon.owned && !pokemon.loaded) {
        this.http
          .get<PokeDetail>(pokemon.url)
          .pipe(
            map((response: PokeDetail) => {
              return response;
            })
          )
          .subscribe({
            next: (data: PokeDetail) => {
              pokemon.id = data.id;
              pokemon.order = data.order;
              pokemon.image = data.sprites.front_default;
              pokemon.loaded = true;
            },
          });
      }
    }
  }

  // Get details of another slice of pokemon on request by the user
  public fetchPokemonPage(): void {
    this._pageIndex = this._pageIndex + PAGE_ITEM_LIMIT;
    let indexEnd = this.pageIndex;

    if (indexEnd >= this._pokemonCatalogue.length) {
      indexEnd = this._pokemonCatalogue.length;
    }

    for (let i = 0; i < indexEnd; i++) {
      let poke = this._pokemonCatalogue[i];
      if (!poke.loaded) {
        this.http
          .get<PokeDetail>(poke.url)
          .pipe(
            map((response: PokeDetail) => {
              return response;
            })
          )
          .subscribe({
            next: (data: PokeDetail) => {
              this._pokemonCatalogue[i].id = data.id;
              this._pokemonCatalogue[i].order = data.order;
              this._pokemonCatalogue[i].image = data.sprites.front_default;
              this._pokemonCatalogue[i].loaded = true;
            },
          });
      }
    }
  }

  // Removes or adds a pokemon to the trainer when the user catches or releases a Pokemon
  public toggleOwned(name: string): void {
    for (const poke of this._pokemonCatalogue) {
      if (poke.name === name) {
        if (poke.owned) {
          this.trainerService.removePokemon(poke.name);
          poke.owned = false;
        } else {
          this.trainerService.addPokemon(poke.name);
          poke.owned = true;
        }

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        });

        this.http
          .patch<Trainer>(
            `${TRAINER_API_URL}/${this.trainerService.trainer?.id}`,
            {
              pokemon: [...this.trainerService.trainer!.pokemon],
            },
            { headers }
          )
          .pipe(
            map((response: Trainer) => {
              return response;
            })
          )
          .subscribe({
            next: (data: Trainer) => {
              this.trainerService.trainer = data;
            },
          });
      }
    }
  }
}
