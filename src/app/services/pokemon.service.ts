import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  finalize,
  forkJoin,
  map,
  mergeMap,
  Observable,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { Pokemon, PokemonUrlList } from '../models/pokemon.model';
import { TrainerService } from './trainer.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private _pokemonList: Pokemon[] = [];
  private _error: string = '';
  private _loading: boolean = false;
  private _urlList: PokemonUrlList = { urlList: [] };
  private _pokemonCatalogue: Pokemon[] = [];
  private _pageIndex: number = 15;
  private _pageNumber: number = 1;

  public get pokemonList(): Pokemon[] {
    return this._pokemonList;
  }

  public get pokemonCatalogue(): Pokemon[] {
    return this._pokemonCatalogue;
  }

  public get pageIndex(): number {
    return this._pageIndex;
  }

  public get pageNumber(): number {
    return this._pageNumber;
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
    this.http
      .get<any>('https://pokeapi.co/api/v2/pokemon?limit=60')
      .pipe(
        map((response: any) => {
          return response.results;
        })
      )
      .subscribe({
        next: (pokemon: any) => {
          for (const poke of pokemon) {
            let pokimon: Pokemon = {
              name: poke.name,
              id: -1,
              url: poke.url,
              order: 9999,
              image: '',
              owned: false,
              loaded: false,
            };
            this._pokemonCatalogue.push(pokimon);
          }
          this.fetchFirstPage();
        },
      });
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
          .get<any>(poke.url)
          .pipe(
            map((response: any) => {
              return response;
            })
          )
          .subscribe({
            next: (data: any) => {
              this._pokemonCatalogue[i].id = data.id;
              this._pokemonCatalogue[i].order = data.order;
              this._pokemonCatalogue[i].image = data.sprites.front_default;
              this._pokemonCatalogue[i].loaded = true;
              this.initOwned();
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
          .get<any>(pokemon.url)
          .pipe(
            map((response: any) => {
              return response;
            })
          )
          .subscribe({
            next: (data: any) => {
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
          .get<any>(poke.url)
          .pipe(
            map((response: any) => {
              return response;
            })
          )
          .subscribe({
            next: (data: any) => {
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
          .patch(
            `https://assignmentapiheinf-production.up.railway.app/trainers/${this.trainerService.trainer?.id}`,
            {
              pokemon: [...this.trainerService.trainer!.pokemon],
            },
            { headers }
          )
          .pipe(
            map((response: any) => {
              return response;
            })
          )
          .subscribe({
            next: (data: any) => {
              this.trainerService.trainer = data;
            },
          });
      }
    }
  }

  // public catch(name: string): void {
  //   for (const poke of this._pokemonCatalogue) {
  //     if (poke.name === name && !poke.owned) {
  //       const headers = new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         'x-api-key':
  //           '7mz8t776gopsz44n87oxhadtu92d8xf727m8rr9e5rphztdr7oh2y3uc89edszz9',
  //       });

  //       this.http
  //         .patch(
  //           `https://assignmentapiheinf-production.up.railway.app/trainers/${this.trainerService.trainer?.id}`,
  //           {
  //             pokemon: [...this.trainerService.trainer!.pokemon, name],
  //           },
  //           { headers }
  //         )
  //         .subscribe({
  //           next: () => {
  //             poke.owned = true;
  //             this.trainerService.addPokemon(poke.name);
  //           },
  //         });
  //     }
  //   }
  // }

  // public fetchPokemonData(): void {
  //   for (const pokemon of this._pokemonCatalogue) {
  //     this.http
  //       .get<any>(pokemon.url)
  //       .pipe(
  //         map((response: any) => {
  //           return response;
  //         })
  //       )
  //       .subscribe({
  //         next: (data: any) => {
  //           for (const poke of this._pokemonCatalogue) {
  //             if (data.name === poke.name) {
  //               poke.id = data.id;
  //               poke.order = data.order;
  //               poke.image = data.sprites.front_default;
  //             }
  //           }
  //         },
  //       });
  //   }
  // }

  // public fetchPokemonData(increment: number): void {
  //   for (const pokemon of this._pokemonCatalogue) {
  //     this.http
  //       .get<any>(pokemon.url)
  //       .pipe(
  //         map((response: any) => {
  //           return response;
  //         })
  //       )
  //       .subscribe({
  //         next: (data: any) => {
  //           for (let i = 0; i < 15; i++) {
  //             const poke = this._pokemonCatalogue[i];
  //             if (data.name === poke.name) {
  //               poke.id = data.id;
  //               poke.order = data.order;
  //               poke.image = data.sprites.front_default;
  //             }
  //           }
  //         },
  //       });
  //   }
  // }

  // public fetchPokemonCatalogue(): void {
  //   this.http
  //     .get<any>('https://pokeapi.co/api/v2/pokemon')
  //     .pipe(
  //       map((response: any) => response.map((response: any) => )
  //     )
  // }

  // public fetchPokemon(): void {
  //   this._loading = true;
  //   this.http
  //     .get<Pokemon[]>('https://pokeapi.co/api/v2/pokemon')
  //     .pipe(
  //       finalize(() => {
  //         this._loading = false;
  //       })
  //     )
  //     .subscribe({
  //       next: (pokemonList: Pokemon[]) => {
  //         console.log(pokemonList);
  //         this._pokemonList = pokemonList;
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         this._error = error.message;
  //       },
  //     });
  // }

  // public fitchPokemon(): void {
  //   this.http
  //     .get<any>('https://pokeapi.co/api/v2/pokemon')
  //     .pipe(
  //       map((response) => {
  //         const pokeUrl = [];
  //         for (const element of response.results) {
  //           pokeUrl.push(element.url);
  //           this.http.get<any>('note');
  //           console.log(element.url);
  //         }
  //         return pokeUrl;
  //       })
  //     )
  //     .subscribe({});
  // }

  // public fetchUrlList(): Observable<PokemonUrlList> {
  //   return this.http.get<any>('https://pokeapi.co/api/v2/pokemon').pipe(
  //     map((response) => {
  //       const pokeUrl: PokemonUrlList = { urlList: [] };
  //       for (const element of response.results) {
  //         pokeUrl.urlList.push(element.url);
  //         console.log(pokeUrl.urlList);
  //       }
  //       return pokeUrl;
  //     })
  //   );
  // }

  // public test(): void {
  //   this.fetchUrlList().subscribe({});
  // }

  // public test2(): void {
  //   this.fetchUrlList()
  //     .pipe(
  //       mergeMap((response) =>
  //         response.urlList.map((urlList) => this.http.get<any>(urlList))
  //       )
  //     )
  //     .subscribe({});
  // }

  // public fitchPokemon(): void {
  //   this.http
  //     .get<PokemonUrlList>('https://pokeapi.co/api/v2/pokemon')
  //     .pipe(
  //       switchMap((test) =>
  //         forkJoin(test.map((obj) => this.http.get(`${obj.id}`)))
  //       )
  //     );
  // }
}
