import { Component, OnInit } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';
import { Trainer } from 'src/app/models/trainer.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { TrainerService } from 'src/app/services/trainer.service';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.page.html',
  styleUrls: ['./trainer.page.css'],
})
export class TrainerPage implements OnInit {
  get pokemonCatalogue(): Pokemon[] {
    return this.pokemonService.pokemonCatalogue;
  }

  get trainer(): Trainer | undefined {
    return this.trainerService.trainer;
  }

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly trainerService: TrainerService
  ) {}
  ngOnInit(): void {
    // Ensure that the catalogue has been fetched
    this.pokemonService.fetchPokemonCatalogue();
  }
  // Remove Pokemon from trainer if he chooses to release it
  releaseClick(name: string) {
    this.pokemonService.toggleOwned(name);
  }
}
