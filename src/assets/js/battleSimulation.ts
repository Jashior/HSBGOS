import {CardItem} from "../../app/model/CardItem"
import {getAllCombinations} from "./allCombinations"

export function battle(playerMinions: CardItem[], enemyMinions: CardItem[], checkBestOrdering: boolean) {
    console.log(`BATTLE RUNNING`);
    // console.log(`${playerMinions}`)
    // console.log(`${enemyMinions}`)
    var playerCurrentBoard: CardItem[] = [];
    var enemyCurrentBoard: CardItem[] = [];
    let indexOfPlayerAttacker = 0;
    let indexOfEnemyAttacker = 0;
    let playerTurn = 0;
    let numberOfSimulations = 1000;
  
    function resetBoards(seed: any) {

      playerCurrentBoard = [];
      enemyCurrentBoard = [];
  
      if (seed.length > 0) {
        for (let i = 0; i < playerMinions.length; i++) {
          playerCurrentBoard[i] = JSON.parse(
            JSON.stringify(playerMinions[seed[i]])
          );
        }
      } else {
        for (let i = 0; i < playerMinions.length; i++) {
          playerCurrentBoard[i] = JSON.parse(JSON.stringify(playerMinions[i]));
        }
      }
  
      for (let i = 0; i < enemyMinions.length; i++) {
        enemyCurrentBoard[i] = JSON.parse(JSON.stringify(enemyMinions[i]));
      }
    }
  
    function printBoards() {
      console.log(`Player Board:`);
      for (let i = 0; i < playerCurrentBoard.length; i++) {
        console.log(playerCurrentBoard[i]);
      }
      console.log(`Enemy Board:`);
      for (let i = 0; i < enemyCurrentBoard.length; i++) {
        console.log(enemyCurrentBoard[i]);
      }
      console.log(`------`);
    }
  
    function runCombat() {
      let playerTurn = Math.random() >= 0.5;
      while (bothAlive()) {
        if (playerTurn) {
          attack(playerCurrentBoard, enemyCurrentBoard, indexOfPlayerAttacker);
          incrementIndexOfPlayerAttacker();
        } else {
          attack(enemyCurrentBoard, playerCurrentBoard, indexOfEnemyAttacker);
          incrementIndexOfEnemyAttacker();
        }
  
        playerTurn = !playerTurn;
      }
    }
  
    function checkPlayerWin() {
      return playerCurrentBoard.length > 0 && enemyCurrentBoard.length == 0;
    }
  
    function checkPlayerLoss() {
      return playerCurrentBoard.length == 0 && enemyCurrentBoard.length > 0;
    }
  
    function checkDraw() {
      return playerCurrentBoard.length == 0 && enemyCurrentBoard.length == 0;
    }
  
    function incrementIndexOfPlayerAttacker() {
      if (playerCurrentBoard.length == 0) {
        return;
      }
      indexOfPlayerAttacker =
        (indexOfPlayerAttacker + 1) % playerCurrentBoard.length;
    }
  
    function incrementIndexOfEnemyAttacker() {
      if (enemyCurrentBoard.length == 0) {
        return;
      }
      indexOfEnemyAttacker =
        (indexOfEnemyAttacker + 1) % enemyCurrentBoard.length;
    }
  
    function normaliseIndices() {
      if (indexOfPlayerAttacker >= playerCurrentBoard.length) {
        indexOfPlayerAttacker = 0;
      }
      if (indexOfEnemyAttacker >= enemyCurrentBoard.length) {
        indexOfEnemyAttacker = 0;
      }
    }
  
    function getTauntMinions(board: any) {
      // return board
      //   .filter((minion: any) =>
      //     minion.effects.some((attribute:any ) => attribute.item_text == "Taunt")
      //   )
      //   .map((x: any) => board.indexOf(x));
      return board.filter((minion: any) => minion.effects['Taunt']).map((x: any) => board.indexOf(x))
    }
  
    function isMinionPoisonous(minion: any) {
      // return minion.effects.some(
      //   (attribute: any) => attribute.item_text == "Poisonous"
      // );
      return minion.effects['Poisonous']
    }
  
    function isMinionDivineShield(minion: any) {
      // return minion.effects.some(
      //   (attribute: any) => attribute.item_text == "Divine Shield"
      // );
      return minion.effects['Divine Shield']
    }
  
    function attack(attackerBoard: any, defenderBoard: any, indexOfAttacker: any) {
      var indicesOfDefenderTauntMinions = getTauntMinions(defenderBoard);
  
      var indexOfDefender = Math.floor(Math.random() * defenderBoard.length);
  
      if (indicesOfDefenderTauntMinions.length > 0) {
        indexOfDefender =
          indicesOfDefenderTauntMinions[
            Math.floor(Math.random() * indicesOfDefenderTauntMinions.length)
          ];
      }
  
      var attackerAttack = attackerBoard[indexOfAttacker].attack;
      var attackerHealth = attackerBoard[indexOfAttacker].health;
  
      var defenderAttack = defenderBoard[indexOfDefender].attack;
      var defenderHealth = defenderBoard[indexOfDefender].health;
  
      if (isMinionPoisonous(attackerBoard[indexOfAttacker])) {
        attackerAttack = Number.POSITIVE_INFINITY;
      }
  
      if (isMinionPoisonous(defenderBoard[indexOfDefender])) {
        defenderAttack = Number.POSITIVE_INFINITY;
      }
  
      let divineShieldAttackerFlag = false;
      let divineShieldDefenderFlag = false;
  
      if (isMinionDivineShield(attackerBoard[indexOfAttacker])) {
        // attackerBoard[indexOfAttacker].effects = attackerBoard[
        //   indexOfAttacker
        // ].effects.filter((effect: any) => effect.item_text !== "Divine Shield");
        // divineShieldAttackerFlag = true;

        attackerBoard[indexOfAttacker].effects['Divine Shield'] = false;
          divineShieldAttackerFlag = true;

      }
  
      if (isMinionDivineShield(defenderBoard[indexOfDefender])) {
        // defenderBoard[indexOfDefender].effects = defenderBoard[
        //   indexOfDefender
        // ].effects.filter((effect: any) => effect.item_text !== "Divine Shield");
        // divineShieldDefenderFlag = true;
        defenderBoard[indexOfDefender].effects['Divine Shield'] = false
        divineShieldDefenderFlag = true;
      }
  
      if (!divineShieldDefenderFlag) {
        inflictDamage(defenderBoard, indexOfDefender, attackerAttack);
      }
  
      if (!divineShieldAttackerFlag) {
        inflictDamage(attackerBoard, indexOfAttacker, defenderAttack);
      }
    }
  
    function inflictDamage(recipientBoard: any, recipientIndex: any, damage: any) {
      if (damage >= recipientBoard[recipientIndex].health) {
        kill(recipientBoard, recipientIndex);
        return;
      }
  
      recipientBoard[recipientIndex].health -= damage;
    }
  
    function kill(recipientBoard: any, recipientIndex: any) {
      recipientBoard.splice(recipientIndex, 1);
      normaliseIndices();
    }
  
    function bothAlive() {
      return playerCurrentBoard.length > 0 && enemyCurrentBoard.length > 0;
    }
  
    function asPercentage(tally: any) {
      return ((100 * tally) / numberOfSimulations).toFixed(2);
    }
  
    function simulateCombats(orderingSeed: any) {
      var winTally = 0;
      var lossTally = 0;
      var drawTally = 0;
  
      for (let i = 0; i < numberOfSimulations; i++) {
        resetBoards(orderingSeed);
        runCombat();
  
        if (checkDraw()) {
          drawTally++;
          continue;
        }
  
        if (checkPlayerWin()) {
          winTally++;
          continue;
        }
  
        lossTally++;
      }
      
      var value = (winTally - lossTally) / numberOfSimulations;
      let winPercentage = asPercentage(winTally);
      let lossPercentage = asPercentage(lossTally);
      let drawPercentage = asPercentage(drawTally);
  
      return [value, winPercentage, lossPercentage, drawPercentage];
    }
  
    function generateAllPossibleOrderings(n: number) {
      return getAllCombinations(n);

      // let combsArr: any = [];
      // let arrStart = [];
      // for (let i = 0; i < n; i++) {
      //   arrStart[i] = i;
      // }
      // function combs(arr: any, build: any) {
      //   if (arr.length > 0) {
      //     for (let i = 0; i < arr.length; i++) {
      //       let ele = arr[i];
      //       let newArr = arr.filter((j: any) => j !== arr[i]);
      //       combs(newArr, build.concat(ele));
      //     }
      //   } else {
      //     combsArr.push(build);
      //   }
      // }
      // combs(arrStart, []);
      // return combsArr;
    }
  
    function calculateBestBoardOrdering() {
      let orderings = generateAllPossibleOrderings(playerMinions.length);
  
      numberOfSimulations = 1000
      if(playerMinions.length == 7){
        numberOfSimulations = 100
      }
      if(playerMinions.length == 6){
        numberOfSimulations = 500
      }

      let highestValue = -1;
      let bestOrdering = [];
      // let bestOrderingValue = [];
      let bestResult: any = [];
  
      for (let i = 0; i < orderings.length; i++) {
        let currentOrdering = orderings[i];
        // console.log(`current ordering: ${currentOrdering}`)
        let results = simulateCombats(currentOrdering);
        // console.log(`results for ordering ${currentOrdering} = ${results}`);
        if (results[0] > highestValue) {
          bestOrdering = currentOrdering;
          // let bestOrderingValue = results[0];
          bestResult = results;
          highestValue = bestResult[0];
        }
      }
  
      // Name combination Best Array
      let bestNameArray = [];
  
      for (let i = 0; i < bestOrdering.length; i++) {
        bestNameArray.push(playerMinions[bestOrdering[i]].name);
      }
  
      return [bestResult, bestNameArray, numberOfSimulations];
    }
  
    return checkBestOrdering ? calculateBestBoardOrdering() : simulateCombats([]);
  }
  