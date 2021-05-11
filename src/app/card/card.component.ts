import { Component, OnInit, Input } from '@angular/core';
import {EventEmitter, Output} from '@angular/core';
import { CardItem } from '../model/CardItem'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() cardItem: any;
  @Input() loading: any;
  @Output() removeCardEvent = new EventEmitter<string>();
  @Output() cardNameChange = new EventEmitter<{id : string, newValue: string}>();
  @Output() cardAttackChange = new EventEmitter<{id: string, newValue: number}>();
  @Output() cardHealthChange = new EventEmitter<{id: string, newValue: number}>();
  @Output() effectToggle = new EventEmitter<{id: string, effect: string}>();

  constructor() { }

  ngOnInit(): void {
  }

  removeCard(){
    this.removeCardEvent.emit(this.cardItem.id)
  }

  outputInfo(){
    console.log(this.cardItem.name)
  }

  updateCardName(event: any){
    this.cardNameChange.emit({id: this.cardItem.id, newValue: event.target.value})
  }

  updateCardAttack(event: any){
    this.cardAttackChange.emit({id: this.cardItem.id, newValue: event.target.value})
  }

  updateCardHealth(event: any){
    this.cardHealthChange.emit({id: this.cardItem.id, newValue: event.target.value})
  }

  toggleDivineShield(){
    this.effectToggle.emit({id: this.cardItem.id, effect: 'Divine Shield'})
  }
  togglePoisonous(){
    this.effectToggle.emit({id: this.cardItem.id, effect: 'Poisonous'})
  }
  toggleReborn(){
    this.effectToggle.emit({id: this.cardItem.id, effect: 'Reborn'})
  }
  toggleTaunt(){
    this.effectToggle.emit({id: this.cardItem.id, effect: 'Taunt'})
  }
  toggleWindfury(){
    this.effectToggle.emit({id: this.cardItem.id, effect: 'Windfury'})
  }

}
