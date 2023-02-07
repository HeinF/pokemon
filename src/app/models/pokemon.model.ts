export interface Pokemon {
  name: string;
  id: number;
  url: string;
  order: Number;
  image: string;
  owned: boolean;
  loaded: boolean;
}

export interface PokeResult {
  results: PokeList[];
}

export interface PokeList {
  name: string;
  url: string;
}

export interface PokeDetail {
  id: number;
  name: string;
  order: number;
  sprites: Sprite;
}

export interface Sprite {
  front_default: string;
}
