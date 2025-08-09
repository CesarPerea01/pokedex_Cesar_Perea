import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Observable, ReplaySubject } from 'rxjs';
import { Pokemon } from '../../interfaces/pokemon-main.interface';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  PokemonList,
  PokemonListResponse,
} from '../../interfaces/pokemon-list.interface';
import { f } from '../../../../node_modules/@angular/material/icon-module.d-COXCrhrh';
import { MatIcon } from '@angular/material/icon';
import {
  PokemonEvolutionChain,
  Species,
} from '../../interfaces/pokemon-evolution-chain';

interface PokemonEvoChainImages {
  name: string;
  front_default: string;
}

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    AsyncPipe,
    MatChipsModule,
    MatProgressBarModule,
    MatIcon,
    RouterModule,
  ],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
})
export class PokemonDetailComponent implements OnInit, OnDestroy {
  unsubscribe$ = new ReplaySubject<void>();
  public weaknesses$: Observable<PokemonList[]>;

  public cry: string = '';
  public story: string = '';
  public showSiny: boolean = false;
  public evolutionChain: PokemonEvolutionChain = {} as PokemonEvolutionChain;
  public evolutionChainList: any[] = [];
  public evolutionChainImages: PokemonEvoChainImages[] = [];
  pokemon: Pokemon = {} as Pokemon;

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute
  ) {
    this.weaknesses$ = this.pokemonService.weaknesses$;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPokemonData(id);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadPokemonData(id: string | number) {
    this.pokemonService.getByName(id).subscribe({
      next: (response: Pokemon) => {
        this.pokemon = response;
        this.cry = this.pokemon.cries['latest'];
        this.loadWeaknesses(this.pokemon.types[0].type.name);
        this.loadStory(this.pokemon.name);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  loadWeaknesses(type: string) {
    this.pokemonService.getTypeWeaknesses(type).subscribe({
      next: (response: any) => {},
    });
  }

  loadStory(pokemon: string | number) {
    this.pokemonService.getSpecies(pokemon).subscribe({
      next: (response: any) => {
        this.story = response.flavor_text_entries[0].flavor_text;
        this.loadEvolutionChain(response.evolution_chain.url);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  loadEvolutionChain(url: string) {
    this.pokemonService.getEvolutionChain(url).subscribe({
      next: (response: any) => {
        this.evolutionChain = response;
        this.loadEvolutionChainList();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  loadEvolutionChainList() {
    this.evolutionChainList.push(this.evolutionChain.chain.species);
    this.evolutionChainList.push(
      this.evolutionChain.chain.evolves_to[0]?.species
    );
    this.evolutionChainList.push(
      this.evolutionChain.chain.evolves_to[0]?.evolves_to[0]?.species
    );
    this.evolutionChainList.forEach((pokemon) => {
      console.log(pokemon.name);
      this.pokemonService.getByName(pokemon.name).subscribe({
        next: (response: Pokemon) => {
          this.evolutionChainImages.push({
            name: pokemon.name,
            front_default: response.sprites.front_default,
          });
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });
  }
}
