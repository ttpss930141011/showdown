import { AI } from "../player/ai";
import { Human } from "../player/human";
import { player } from "../player";
import { Deck } from "./deck";
import { rl, sleep } from "../utils";
import { Hands } from "./hands";
import { suitsObj, ranksObj } from "../config";
import { playersCards } from "../types";

export default class Showdown {
  playerList!: player[];
  deck!: Deck;
  turn = 0;

  constructor() {
    this.setPlayerList([]);
    this.setDeck(new Deck());
  }

  getPlayerList() {
    return this.playerList;
  }
  setPlayerList(playerList: player[]) {
    this.playerList = playerList;
  }
  getDeck() {
    return this.deck;
  }
  setDeck(deck: Deck) {
    this.deck = deck;
  }
  async start() {
    for (let i = 0; i < 4; i++) {
      const isHuman = await rl.question(
        `請輸入玩家${i + 1}是人類還是電腦(human/ai): `
      );
      if (isHuman === "human") {
        this.playerList.push(new Human(this, "", 0, new Hands()));
      } else if (isHuman === "ai") {
        this.playerList.push(new AI(this, "", 0, new Hands()));
      } else {
        console.log("請輸入正確的選項");
        i--;
      }
    }
    // 請 P1~P4 為自己取名 (Name himself)。
    for (let i = 0; i < this.playerList.length; i++) {
      console.log(`請輸入玩家${i + 1}的名字`);
      await this.playerList[i].nameHimself();
    }

    this.deck.shuffle(); // 牌堆會進行洗牌 (Shuffle)。
    // console.log(this.deck.cards);  // 看這個deck內所有的牌
    console.log(`牌堆內總共有${this.deck.cards.length}張牌`);
    // 抽牌階段：由 P1 開始，P1~P4 輪流從牌堆中抽牌 (Draw Card)，直到所有人都擁有手牌 (Hand) 13 張牌為止。
    while (this.playerList.every((player) => player.hands.cards.length < 13)) {
      for (let i = 0; i < this.playerList.length; i++) {
        this.playerList[i].drawCard(this.deck);
        await sleep(100);
      }
    }
    console.log("抽牌結束，遊戲開始");
    console.log("**************************************************");
    // 查看每個玩家手牌
    // this.playerList.forEach((player) => {
    //   console.log(player.name, "手牌", player.hands.cards);
    // });
    //
    // 抽完牌後，在接下來的 13 回合中，每一回合依序執行以下：
    // P1~P4 輪流 (Takes a turn) 依序執行以下：
    // 決定要不要使用 「交換手牌 (Exchange Hands)」 特權
    // 出 (Show) 一張牌（此步驟彼此皆無法知曉彼此出的牌）。

    // TODO:其實因為這邊有換牌策略，所以有可能會有一個玩家出完牌，但是其他玩家還沒出完牌的情況，但需求單上沒有寫，所以就先不處理
    while (this.turn < 13) {
      const playersCardsArr: playersCards[] = [];
      console.log(`第${this.turn + 1}回合`);
      for (let i = 0; i < this.playerList.length; i++) {
        await sleep(2000);
        const card = await this.playerList[i].takeATurn();
        console.log("**************************************************");
        playersCardsArr.push({
          card,
          player: this.playerList[i],
        });
      }

      console.log("開牌");

      for (let playerCard of playersCardsArr) {
        if (!playerCard.card) {
          console.log(playerCard.player.getName(), "沒有牌了");
        } else {
          console.log(
            `player ${playerCard.player.getName()} 出的牌是 ${playerCard.card.getSuit()} ${playerCard.card.getRank()}`
          );
        }
        await sleep(1000);
      }

      // console.log("playersCardsArr", playersCardsArr);
      // 比大小，先比大小，再比花色
      const maxCard = playersCardsArr.reduce((maxCard, playerCard) => {
        if (!maxCard.card) return playerCard;
        if (!playerCard.card) return maxCard;
        const maxCardRank =
          ranksObj[maxCard.card.rank as keyof typeof ranksObj];
        const maxCardSuit =
          suitsObj[maxCard.card.suit as keyof typeof suitsObj];
        const playerCardRank =
          ranksObj[playerCard.card.rank as keyof typeof ranksObj];
        const playerCardSuit =
          suitsObj[playerCard.card.suit as keyof typeof suitsObj];

        if (maxCardRank > playerCardRank) return maxCard; // 如果maxCard數字比較大，就回傳maxCard
        if (maxCardRank < playerCardRank) return playerCard; // 如果playerCard數字比較大，就回傳playerCard
        if (maxCardRank === playerCardRank && maxCardSuit > playerCardSuit)
          return maxCard; // 如果數字一樣，比花色
        return playerCard; // 如果數字一樣，但playerCard花色比較大，就回傳playerCard
      });
      maxCard.player.point++;
      await sleep(2000);
      console.log("此局勝利者", maxCard.player.name);
      console.log("**************************************************");
      this.turn++;
    }
    // 13回合結束，比player裡的point，看誰最多誰贏，如果有平手，則顯示所有平手的玩家
    const maxPoint = this.playerList.reduce((maxPoint, player) => {
      if (maxPoint > player.point) return maxPoint;
      return player.point;
    }, 0);
    const winnerList = this.playerList.filter(
      (player) => player.point === maxPoint
    );

    console.log("所有玩家的分數");
    for (let player of this.playerList) {
      console.log("玩家", player.name, "分數", player.point);
    }

    console.log("勝利者為以下玩家");
    for (let winner of winnerList) {
      console.log("玩家", winner.name, "分數", winner.point);
    }

    return;
  }
}
