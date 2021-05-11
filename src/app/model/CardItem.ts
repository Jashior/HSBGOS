export class CardItem {

    name: string = 'hello';
    effects: object;
    attack: number;
    health: number;
    id: string; 

    constructor(name: string, attack: number, health: number, id: string){
        this.name = name;
        this.attack = attack;
        this.health = health;
        this.id = id;
        this.effects = {'Divine Shield': false, 'Poisonous': false, 'Reborn': false, 'Taunt': false, 'Windfury': false};
    }

}