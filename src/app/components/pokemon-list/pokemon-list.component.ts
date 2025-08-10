import { Component, inject, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import {
  PokemonList,
  PokemonListResponse,
} from '../../interfaces/pokemon-list.interface';
import { MatCardFooter, MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule, MatPrefix } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Observable, ReplaySubject } from 'rxjs';
import { AsyncPipe, CommonModule, TitleCasePipe } from '@angular/common';
import { Pokemon } from '../../interfaces/pokemon-main.interface';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { f } from '../../../../node_modules/@angular/material/icon-module.d-COXCrhrh';

@Component({
  selector: 'app-pokemon-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatCardFooter,
    MatListModule,
    MatChipsModule,
    AsyncPipe,
    TitleCasePipe,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    ReactiveFormsModule,
    MatIconModule,
    MatPrefix,
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent implements OnInit {
  searchControl = new FormControl('');
  unsubscribe$ = new ReplaySubject<void>();
  public allTypes$: Observable<string[]>;

  public pokemonList: PokemonList[] = [];
  public pokemonCompleteList: Pokemon[] = [];
  public pokemonFilteredByType: Pokemon[] = [];
  public completeListFiltered: Pokemon[] = [];
  constructor(private pokemonService: PokemonService) {
    this.allTypes$ = this.pokemonService.allTypes$;
  }

  ngOnInit() {
    this.loadMainPokemons();
    this.loadTypes();
    this.searchPokemon();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadMainPokemons() {
    this.pokemonService.getList().subscribe({
      next: (response: PokemonListResponse) => {
        this.pokemonList = response.results;
        this.pokemonList = this.shuffle(this.pokemonList);
        this.loadPokemonData(this.pokemonList);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  loadTypes() {
    this.pokemonService.getTypes().subscribe({
      next: (response: any) => {},
    });
  }

  loadPokemonData(pokemonList: PokemonList[]) {
    pokemonList.forEach((pokemon) => {
      this.pokemonService.getByName(pokemon.name).subscribe({
        next: (response: Pokemon) => {
          this.pokemonCompleteList.push(response);
        },
        error: (error: any) => {
          console.log(error);
        },
      });
      this.completeListFiltered = this.pokemonCompleteList;
    });
  }

  filterByType(typeToFilter: string) {
    if (typeToFilter === 'all') {
      this.pokemonFilteredByType = [...this.pokemonCompleteList];
    } else {
      this.pokemonFilteredByType = this.pokemonCompleteList.filter((pokemon) =>
        pokemon.types.find((type) => type.type.name === typeToFilter)
      );
    }

    this.completeListFiltered = [...this.pokemonFilteredByType];
    const currentSearch = this.searchControl.value || '';
    if (currentSearch) {
      this.completeListFiltered = this.pokemonFilteredByType.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(currentSearch.toLowerCase())
      );
    }
  }
  shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    let currentIndex = copy.length;
    let randomIndex: number;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [copy[currentIndex], copy[randomIndex]] = [
        copy[randomIndex],
        copy[currentIndex],
      ];
    }

    return copy;
  }

  searchPokemon() {
    this.searchControl.valueChanges.subscribe((value) => {
      const searchTerm = value?.toLowerCase() || '';
      this.completeListFiltered = this.pokemonFilteredByType.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm)
      );
    });
  }
}
