import { Injectable } from '@angular/core';
import { StorageKeys } from '../enums/storage-keys.enum';
import { Trainer } from '../models/trainer.model';
import { StorageUtil } from '../utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  private _trainer?: Trainer;

  public get trainer(): Trainer | undefined {
    return this._trainer;
  }

  public set trainer(trainer: Trainer | undefined) {
    StorageUtil.storageSave<Trainer>(StorageKeys.Trainer, trainer!);
    this._trainer = trainer;
  }

  public logOut(): void {
    StorageUtil.storageClear(StorageKeys.Trainer);
    this._trainer = undefined;
  }

  private updateStorage(trainer: Trainer) {
    StorageUtil.storageSave<Trainer>(StorageKeys.Trainer, trainer);
  }

  constructor() {
    this._trainer = StorageUtil.storageRead<Trainer>(StorageKeys.Trainer);
  }
  public isOwned(name: string): boolean {
    if (this._trainer) {
      return Boolean(
        this.trainer?.pokemon.find((pokemon: string) => pokemon === name)
      );
    }
    return false;
  }

  public addPokemon(name: string): void {
    if (this._trainer) {
      this._trainer.pokemon.push(name);
      this.updateStorage(this._trainer);
    }
  }

  public removePokemon(name: string): void {
    if (this._trainer) {
      this._trainer.pokemon = this._trainer.pokemon.filter(
        (poke: string) => poke !== name
      );
      this.updateStorage(this._trainer);
    }
  }
}
