import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero-services/hero.service';
import { MessageService } from '../message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit{
  heroes: Hero[] = []; 
  isGetHeroes : boolean = false; 
  getHeroesText = "Get heroes"; 
  heroNameValue: string = ''; // The value of the "new-hero" input
  showError: boolean = false; // Indicates whether to show the error message


  constructor(private heroService: HeroService, private modalService: NgbModal){

  }
  ngOnInit(): void{
    this.getHeroes(); 
  }

  getHeroes(): void{
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes); 
  }
  add(name: string): void {
    name = name.trim();
    if (name === '') 
    { 
      this.showError = true; // Show the error message
    }
    else {
      this.showError = false; // Hide the error message
      this.heroService.addHero( { name } as Hero)
        .subscribe(hero => {
          this.heroes.push(hero);
        });
    }

  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }

  triggerGetHeroes(){
    this.isGetHeroes = !this.isGetHeroes; 
    if(this.isGetHeroes){
      this.getHeroesText = "Hide hero list";
    }
    else{
      this.getHeroesText = "Get heroes"; 
    }
  }

  openHeroModal(hero: Hero) {
    console.log(hero)
    const modalRef = this.modalService.open(HeroDetailComponent);
    modalRef.componentInstance.hero = hero; // Pass the hero data to the modal
  }



}
