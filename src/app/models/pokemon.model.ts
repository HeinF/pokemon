export interface Pokemon {
  name: string;
  id: number;
  url: string;
  order: Number;
  image: string;
  owned: boolean;
  loaded: boolean;
}

export interface PokemonUrlList {
  urlList: string[];
}
