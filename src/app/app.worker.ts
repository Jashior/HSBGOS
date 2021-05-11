/// <reference lib="webworker" />
import { battle } from '../assets/js/battleSimulation'

addEventListener('message', ({ data }) => {
  console.log(`running`)
  const playerCards = data.playerCards
  const enemyCards = data.enemyCards 
  const result = battle(playerCards, enemyCards, true)
  postMessage(result);
});

