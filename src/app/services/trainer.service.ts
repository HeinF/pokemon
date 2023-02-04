import { Injectable } from '@angular/core';
import { Trainer } from '../models/trainer.model';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  private _trainer?: Trainer;

  constructor() {}
}
