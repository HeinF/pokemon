import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
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
  private _error: string = '';
  private _loading: boolean = false;
  private _pokemonCatalogue: Pokemon[] = [];
  private _pageIndex: number = 15;

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

  public fetchPokemonCatalogue(): void {
    if (this._pokemonCatalogue.length < 1) {
      this.http
        .get<PokeResult>('https://pokeapi.co/api/v2/pokemon?limit=60')
        .pipe(
          map((response: PokeResult) => {
            return response.results;
          })
        )
        .subscribe({
          next: (pokemonList: PokeList[]) => {
            for (const poke of pokemonList) {
              let pokemon: Pokemon = {
                name: poke.name,
                id: -1,
                url: poke.url,
                order: 9999,
                image: '',
                owned: false,
                loaded: false,
              };
              this._pokemonCatalogue.push(pokemon);
            }
            this.fetchFirstPage();
          },
        });
    }
  }

  public fetchFirstPage(): void {
    let indexEnd = 15;
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
              // Check and fetch owned pokemon in last loop to avoid duplicate calls
              if (i === indexEnd - 1) {
                this.initOwned();
              }
            },
          });
      }
    }
  }

  public initOwned(): void {
    if (this.trainerService.trainer) {
      for (const poke of this._pokemonCatalogue) {
        if (this.trainerService.isOwned(poke.name)) {
          poke.owned = true;
        }
      }
      this.fetchOwned();
    }
  }

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

  public fetchPokemonPage(): void {
    this._pageIndex = this._pageIndex + 15;
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
          'x-api-key':
            '7mz8t776gopsz44n87oxhadtu92d8xf727m8rr9e5rphztdr7oh2y3uc89edszz9',
        });

        this.http
          .patch<Trainer>(
            `https://assignmentapiheinf-production.up.railway.app/trainers/${this.trainerService.trainer?.id}`,
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
