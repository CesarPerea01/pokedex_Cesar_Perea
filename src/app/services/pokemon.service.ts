import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  constructor(private http: HttpClient) {}

  getList(): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      this.baseUrl + 'pokemon' + this.temporal
    );
  }

  getByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(this.url + name);
  }
}
