import { Injectable } from '@angular/core';
import { StorageKeys } from '../enums/storage-keys.enum';
import { Trainer } from '../models/trainer.model';
import { StorageUtil } from '../utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  private _trainer?: Trainer;

  // get trainer
  public get trainer(): Trainer | undefined {
    return this._trainer;
  }

  //Saves trainer to storage and them sets trainer in service
  public set trainer(trainer: Trainer | undefined) {
    StorageUtil.storageSave<Trainer>(StorageKeys.Trainer, trainer!);
    this._trainer = trainer;
  }

  //Clear storage on logout and set trainer to undefined
  public logOut(): void {
    StorageUtil.storageClear(StorageKeys.Trainer);
    this._trainer = undefined;
  }

  //Update trainer in session storage, used when a new pokemon is caught
  private updateStorage(trainer: Trainer) {
    StorageUtil.storageSave<Trainer>(StorageKeys.Trainer, trainer);
  }

  constructor() {
    this._trainer = StorageUtil.storageRead<Trainer>(StorageKeys.Trainer);
  }

  // Checks if the trainer owns a given pokemon
  public isOwned(name: string): boolean {
    if (this._trainer) {
      return Boolean(
        this.trainer?.pokemon.find((pokemon: string) => pokemon === name)
      );
    }
    return false;
  }
  //Add pokemon to trainer and then update session storage
  public addPokemon(name: string): void {
    if (this._trainer) {
      this._trainer.pokemon.push(name);
      this.updateStorage(this._trainer);
    }
  }

  //Removes a pokemon from the trainer and session storage
  public removePokemon(name: string): void {
    if (this._trainer) {
      this._trainer.pokemon = this._trainer.pokemon.filter(
        (poke: string) => poke !== name
      );
      this.updateStorage(this._trainer);
    }
  }
}
