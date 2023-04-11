import { player } from ".";
import { Hands } from "../game/hands";
import { Deck } from "../game/deck";
import { Exchanging } from "../game/exchanging";
import { ranksObj, suitsObj } from "../config";
import Showdown from "../game/showdown";

export class AI extends player {
  name!: string;
  point!: number;
  hands!: Hands;
  exchange!: Exchanging;
  showdown!: Showdown;

  constructor(showdown: Showdown, name: string, point: number, hands: Hands) {
    super();
    this.setShowdown(showdown);
    this.setName(name);
    this.setPoint(point);
    this.setHands(hands);
    this.setExchange(new Exchanging(this));
  }

  async nameHimself() {
    // 取隨機名字 AI + 1~100
    const name = "AI" + Math.floor(Math.random() * 100 + 1);
    // 檢查名字是否重複
    const playerList = this.getShowdown().getPlayerList();
    const isNameExist = playerList.some((player) => player.getName() === name);
    if (isNameExist) {
      console.log("名字重複了，請重新輸入");
      await this.nameHimself();
    }
    this.setName(name);
    console.log(`Hi, I'm ${this.getName()}, an AI player.`);
  }

  drawCard(deck: Deck) {
    console.log(`AI player ${this.getName()} 抽了一張牌`);
    this.getHands().getACard(deck);
  }

  async takeATurn() {
    console.log(`換 AI player ${this.getName()} 的局`);
    // 如果手上的牌都小於7，就使用換牌功能
    const isSmallThanSeven = this.getHands().cards.every(
      (card) => ranksObj[card.rank as keyof typeof ranksObj] < 7
    );
    if (isSmallThanSeven && !this.getExchange().getIsUsed())
      await this.exchangeHands();
    if (this.getExchange().getIsUsing()) await this.getExchange().countTurn(); // 如果已經開啟換牌功能，則要增加exchage類別內的回合數
    const resultCard = this.returnYourCard();
    return resultCard;
  }

  async exchangeHands() {
    console.log(`AI player ${this.getName()} 開啟換牌功能`); // 是否有用過換牌功能
    if (this.getExchange().getIsUsed()) {
      console.log(
        `AI player ${this.getName()} 請問你是可以這樣換了又換換了又換的嬤？`
      );
      return;
    }
    const playerList = this.getShowdown().getPlayerList(); // 取得所有玩家的名單
    // 過濾掉自己
    const otherPlayerList = playerList.filter(
      (player) => player.getName() !== this.getName()
    );

    // 隨機選一個自己以外的player，並且換牌
    const randomPlayer =
      otherPlayerList[Math.floor(Math.random() * otherPlayerList.length)];
    console.log(
      `AI player ${this.getName()} 選擇換牌對象為 ${randomPlayer.getName()}`
    );
    this.getExchange().useExchanging(randomPlayer);
  }

  returnYourCard() {
    // 出最大的牌，先比數字，再比花色
    if (this.getHands().cards.length === 0) {
      console.log(`AI player ${this.getName()} 沒有牌了88`);
      return null; // 如果沒有牌了，就回傳null
    }
    const maxCard = this.getHands().cards.reduce((max, card) => {
      const cardRank = ranksObj[card.rank as keyof typeof ranksObj];
      const maxRank = ranksObj[max.rank as keyof typeof ranksObj];
      const cardSuit = suitsObj[card.suit as keyof typeof suitsObj];
      const maxSuit = suitsObj[max.suit as keyof typeof suitsObj];
      if (cardRank > maxRank) return card;
      if (cardRank === maxRank && cardSuit > maxSuit) return card;
      return max;
    });
    this.getHands().cards = this.getHands().cards.filter((c) => c !== maxCard); // 將出的牌從手牌中移除
    console.log(`AI player ${this.getName()} 回傳牌桌一張牌`);
    return maxCard;
  }

  gainPoint() {
    console.log(`AI player ${this.getName()} 多一分`);
    this.setPoint(this.getPoint() + 1);
  }
}
