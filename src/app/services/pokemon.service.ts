import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon-main.interface';
import { PokemonListResponse } from '../interfaces/pokemon-list.interface';
import { DOCUMENT } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/';
  private url = 'https://pokeapi.co/api/v2/pokemon/';
  private temporal = '?limit=100&offset=0';

  private _allTypes = new BehaviorSubject<string[]>([]);

  get allTypes$(): Observable<string[]> {
    return this._allTypes.asObservable();
  }
  constructor(private http: HttpClient) {}

  getList(): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      this.baseUrl + 'pokemon' + this.temporal
    );
  }

  getByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(this.url + name);
  }

  getTypes(): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(this.baseUrl + 'type').pipe(
      tap((res) => {
        this._allTypes.next(res.results.map((type) => type.name));
      })
    );
  }

  getImage(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }
}
