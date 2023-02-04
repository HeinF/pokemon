import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, switchMap, map, Observable } from 'rxjs';
import { Trainer } from '../models/trainer.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private readonly http: HttpClient) {}

  public login(username: string): Observable<Trainer> {
    return this.checkTrainer(username).pipe(
      switchMap((trainer: Trainer | undefined) => {
        if (trainer === undefined) {
          return this.createTrainer(username);
        }
        return of(trainer);
      })
    );
  }

  private checkTrainer(username: string): Observable<Trainer | undefined> {
    return this.http
      .get<Trainer[]>(
        `https://assignmentapiheinf-production.up.railway.app/trainers?username=${username}`
      )
      .pipe(map((response: Trainer[]) => response.pop()));
  }

  private createTrainer(username: string): Observable<Trainer> {
    const trainer = {
      username,
      pokemon: [],
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key':
        '7mz8t776gopsz44n87oxhadtu92d8xf727m8rr9e5rphztdr7oh2y3uc89edszz9',
    });

    return this.http.post<Trainer>(
      `https://assignmentapiheinf-production.up.railway.app/trainers?username=${username}`,
      trainer,
      {
        headers,
      }
    );
  }
}
