import { Component, inject, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import {
  PokemonList,
  PokemonListResponse,
} from '../../interfaces/pokemon-list.interface';
import { MatCardFooter, MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-pokemon-list',
  imports: [MatCardModule, MatCardFooter, MatListModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent implements OnInit {
  private pokemonList: PokemonList[] = [];
  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    // this.pokemonService.getList().subscribe({
    //   next: (response: PokemonListResponse) => {
    //     this.pokemonList = response.results;
    //     console.log(this.pokemonList);
    //   },
    //   error: (error: any) => {
    //     console.log(error);
    //   },
    // });
  }
}
