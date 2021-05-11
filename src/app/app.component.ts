import { IcuPlaceholder } from '@angular/compiler/src/i18n/i18n_ast';
import { Component } from '@angular/core';
import { CardItem } from './model/CardItem'
import {v4 as uuidv4} from 'uuid';
// import { battle } from './battleSimulation';
import { battle } from '../assets/js/battleSimulation'
import { getAllCombinations } from '../assets/js/allCombinations'
import { Observable, of } from 'rxjs';

// import {default as battle} from '../assets/js/battle.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // cards = [{name: "Alagator", attack: 3, health: 5}, {name: "Raven", attack: 7, health: 8}, {name: "Dusk", attack: 1, health: 3}]
  enemyCards: CardItem[] = []
  playerCards: CardItem[] = []
  randomNames = ['Crocodile', 'Eagle', 'Tiger', 'Bird', 'Giraffe', 'Lion', 'Frog', 'Snake', 'Panda', 'Emu']
  value = 0 
  winRate = 0
  lossRate = 0
  drawRate = 0
  bestOrderingOrder: string[] = [];
  bestOrderingValue = 0;
  bestOrderingWinRate = 0;
  bestOrderingDrawRate = 0;
  bestOrderingLossRate = 0;
  numberOfOrderingSimulations = 1000;
  loading = false;

  ngOnInit() {
  }

  
  printArray = () => {
    for (let i = 0 ; i < this.enemyCards.length; i++){
      console.log(this.enemyCards[i])
    }
  }

  onRemoveEnemyCard = (id: string) => {
    this.enemyCards = this.enemyCards.filter(card => card.id !== id)
    console.log(`Removing ${id}`)
  }

  updateEnemyCardName(event : {id : string, newValue: string}){
    // gets reference of object to be changed
    let cardToChange = this.enemyCards.filter(a => a.id == event.id)[0]
    cardToChange.name = event.newValue;
  }

  updateEnemyCardAttack(event : {id: string, newValue: number}){
     let cardToChange = this.enemyCards.filter(a => a.id == event.id)[0]
     cardToChange.attack = event.newValue;
  }
  updateEnemyCardHealth(event : {id: string, newValue: number}){
     let cardToChange = this.enemyCards.filter(a => a.id == event.id)[0]
     cardToChange.health = event.newValue
  }

  onRemovePlayerCard = (id: string) => {
    this.playerCards = this.playerCards.filter(card => card.id !== id)
  }

  updatePlayerCardName(event : {id : string, newValue: string}){
    // gets reference of object to be changed
    let cardToChange = this.playerCards.filter(a => a.id == event.id)[0]
    cardToChange.name = event.newValue;
  }

  updatePlayerCardAttack(event : {id: string, newValue: number}){
     let cardToChange = this.playerCards.filter(a => a.id == event.id)[0]
     cardToChange.attack = event.newValue
  }
  updatePlayerCardHealth(event : {id: string, newValue: number}){
     let cardToChange = this.playerCards.filter(a => a.id == event.id)[0]
     cardToChange.health = event.newValue
  }

  

  togglePlayerCardEffect(event : {id: string, effect: string}){
    console.log(`Attempting to toggle ${event.effect} of player card ${event.id}`)
    let cardToChange: any = this.playerCards.filter(a => a.id == event.id)[0] 
  
    cardToChange.effects[event.effect] = !cardToChange.effects[event.effect];

  }


  toggleEnemyCardEffect(event : {id: string, effect: string}){
    console.log(`Attempting to toggle ${event.effect} of enemy card ${event.id}`)
    let cardToChange: any = this.enemyCards.filter(a => a.id == event.id)[0]

    cardToChange.effects[event.effect] = !cardToChange.effects[event.effect];

  }

  addEnemyCard = () => {
    // Check if Max board size
    if (this.enemyCards.length >= 7){
      return
    }

    // Random name generation
    let currentlyUsedNames = this.enemyCards.map(x => x.name)
    let availableNames = this.randomNames.filter(x => !currentlyUsedNames.includes(x))
    let randomName = availableNames[Math.floor(Math.random()*(availableNames.length-1))]



    let card = new CardItem(randomName || "Shark", Math.floor(Math.random()*9)+1, Math.floor(Math.random()*9)+1, uuidv4())
    this.enemyCards.push(card)
  }


  addPlayerCard = () => {
    // Check if Max board size
    if (this.playerCards.length >= 7){
      return
    }

   // Random name generation
    let currentlyUsedNames = this.playerCards.map(x => x.name)
    let availableNames = this.randomNames.filter(x => !currentlyUsedNames.includes(x))
    let randomName = availableNames[Math.floor(Math.random()*(availableNames.length-1))]


    let card = new CardItem(randomName || "Zebra", Math.floor(Math.random()*9)+1, Math.floor(Math.random()*9)+1, uuidv4())
    this.playerCards.push(card)
  }


  runBattle = () => {
    let result = battle(this.playerCards, this.enemyCards, false)
    console.log(result);
    this.value = result[0]
    this.winRate = result[1]
    this.lossRate = result[2]
    this.drawRate = result[3]
  }



  testObservable = () => {
    return of(battle(this.playerCards, this.enemyCards, true));
  }

  testObservableButton = () => {
    this.testObservable().subscribe((a) => {
      console.log(`returned`)
      console.log(a)
    })
  }

  fetchBestOrderingResults = () => {
    return of(battle(this.playerCards, this.enemyCards, true));
  }

  runBestOrdering = () => {
    this.loading = true;

    this.runBattle();

    this.fetchBestOrderingResults().subscribe((bestOrderingResults) => {
     
      console.log(`returned LOADING  = ${this.loading}`)

      this.bestOrderingValue = bestOrderingResults[0][0]
      this.bestOrderingWinRate = bestOrderingResults[0][1]
      this.bestOrderingLossRate = bestOrderingResults[0][2]
      this.bestOrderingDrawRate = bestOrderingResults[0][3]
      this.bestOrderingOrder = bestOrderingResults[1]
      this.numberOfOrderingSimulations = bestOrderingResults[2]
      this.loading = false;
      console.log(`AFTER LODDUNG  = ${this.loading}`)
    })

    // let bestOrderingResults = battle(this.playerCards, this.enemyCards, true)
    // this.bestOrderingValue = bestOrderingResults[0][0]
    // this.bestOrderingWinRate = bestOrderingResults[0][1]
    // this.bestOrderingLossRate = bestOrderingResults[0][2]
    // this.bestOrderingDrawRate = bestOrderingResults[0][3]
    // this.bestOrderingOrder = bestOrderingResults[1]
    // this.numberOfOrderingSimulations = bestOrderingResults[2]


    //  console.log(bestOrderingResults);

    //  console.log(`Best order: ${this.bestOrderingOrder}`)

  }
}
