import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon-main.interface';
import {
  PokemonList,
  PokemonListResponse,
} from '../interfaces/pokemon-list.interface';
import { DOCUMENT } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/';
  private url = 'https://pokeapi.co/api/v2/pokemon/';
  private temporal = '?limit=100&offset=0';

  private _allTypes = new BehaviorSubject<string[]>([]);
  private _weaknesses = new BehaviorSubject<PokemonList[]>([]);

  get allTypes$(): Observable<string[]> {
    return this._allTypes.asObservable();
  }

  get weaknesses$(): Observable<PokemonList[]> {
    return this._weaknesses.asObservable();
  }
  constructor(private http: HttpClient) {}

  getList(): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      this.baseUrl + 'pokemon' + this.temporal
    );
  }

  getByName(param: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(this.url + param);
  }

  getTypes(): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(this.baseUrl + 'type').pipe(
      tap((res) => {
        this._allTypes.next(res.results.map((type) => type.name));
      })
    );
  }

  getTypeWeaknesses(type: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'type/' + type).pipe(
      tap((res) => {
        this._weaknesses.next(res.damage_relations.double_damage_from);
      })
    );
  }

  getFlavourText(pokemon: string | number): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'pokemon-species/' + pokemon);
  }
}
