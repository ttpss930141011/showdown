import { player } from "../player";
import { sleep } from "../utils";

// 每輪中，玩家在出牌前都能選擇要不要使用 「交換手牌 (Exchange Hands)」 特權（此特權每場遊戲各玩家皆只能使用一次）
// 三回合後，雙方的手牌會交換回來，所以要紀錄已經經過幾個回合，如果是第三回合，就要交換回來
export class Exchanging {
  turnCount!: number;
  player!: player; // 自己
  exchangeTo: player | undefined; // 交換的對象
  isUsed: boolean = false;
  isUsing: boolean = false;

  constructor(player: player) {
    this.setPlayer(player);
    this.setTurnCount(0);
  }

  setPlayer(player: player) {
    this.player = player;
  }
  setTurnCount(turnCount: number) {
    this.turnCount = turnCount;
  }

  getTurnCount(): number {
    return this.turnCount;
  }

  useExchanging(exchangeTo: player) {
    if (this.isUsed) return;
    this.isUsed = true;
    this.isUsing = true;
    this.exchangeTo = exchangeTo;
    this.exchange(this.player, exchangeTo);
  }

  // 計算回合數
  async countTurn() {
    if (!this.isUsing) return;
    console.log(
      `剩下 ${
        3 - this.getTurnCount()
      } 回合，player ${this.player.getName()} 就要與${this.exchangeTo?.getName()}交換手牌`
    );

    await sleep(1000);

    if (this.getTurnCount() === 3) {
      this.isUsing = false;
      this.exchange(this.player, this.exchangeTo!);
      await sleep(1000);
      console.log(
        `player ${this.player.getName()} 的手牌已經與${this.exchangeTo?.getName()}交換回來`
      );
      await sleep(1000);
    }
    this.setTurnCount(this.getTurnCount() + 1);
  }

  exchange(player: player, exchangeTo: player) {
    const temp = player.hands.cards;
    player.hands.cards = exchangeTo.hands.cards;
    exchangeTo.hands.cards = temp;
  }

  getIsUsed(): boolean {
    return this.isUsed;
  }

  getIsUsing(): boolean {
    return this.isUsing;
  }
}
