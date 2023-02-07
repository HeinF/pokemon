import { HttpHeaders } from '@angular/common/http';

export const API_KEY: string =
  '7mz8t776gopsz44n87oxhadtu92d8xf727m8rr9e5rphztdr7oh2y3uc89edszz9';

export const TRAINER_API_URL: string =
  'https://assignmentapiheinf-production.up.railway.app/trainers';

export const POKEMON_API_URL: string = 'https://pokeapi.co/api/v2/pokemon';

// Number of Pokemon to fetch without details. Currently API holds 1279 pokemon
export const FETCH_LIMIT: number = 1300;

// Number of Pokemon to fetch complete data for. Taxes API, therefor limited number at a time
export const PAGE_ITEM_LIMIT: number = 20;
