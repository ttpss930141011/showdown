import { Card } from "../game/card";
import { Deck } from "../game/deck";
import { Exchanging } from "../game/exchanging";
import { Hands } from "../game/hands";
import { player } from ".";
import Showdown from "../game/showdown";
import { rl } from "../utils";

export class Human extends player {
  exchange!: Exchanging;
  hands!: Hands;
  name!: string;
  point!: number;
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
    const name = await rl.question("What's your name? "); // 手動輸入名字
    // 檢查名字是否重複
    const playerList = this.getShowdown().getPlayerList();
    const isNameExist = playerList.some((player) => player.getName() === name);
    if (isNameExist) {
      console.log("名字重複了，請重新輸入");
      await this.nameHimself();
    }
    this.setName(name);
  }

  drawCard(deck: Deck) {
    console.log(`Human player ${this.getName()} 抽了一張牌`);
    this.getHands().getACard(deck);
  }

  async takeATurn() {
    console.log(`換 Human player ${this.getName()} 的局`);
    console.log(
      `Human player ${this.getName()} 的牌： ${this.getHands().showCards()}`
    );

    if (!this.getExchange().getIsUsed()) {
      // 如果還沒有用過換牌功能，則可以選擇是否要換牌
      const answer = await rl.question("是否要換牌？ (y/n) ");
      if (answer === "y") await this.exchangeHands();
    }
    if (this.getExchange().getIsUsing()) await this.getExchange().countTurn(); // 如果已經開啟換牌功能，則要增加exchage類別內的回合數
    const resultCard = this.returnYourCard();
    return resultCard;
  }

  async exchangeHands() {
    console.log(`Human player ${this.getName()} 開啟換牌功能`);

    // 如果已經用過換牌功能，則不可以再換牌
    if (this.getExchange().getIsUsed()) {
      console.log(
        `Human player ${this.getName()} 請問你是可以這樣換了又換換了又換的嬤？`
      );

      return;
    }

    const playerList = this.getShowdown().getPlayerList(); // 選擇一個除了自己的player，並且換牌
    const otherPlayerList = playerList.filter(
      (player) => player.getName() !== this.getName()
    );

    console.log("選擇一個倒楣鬼來換牌：");
    otherPlayerList.forEach((player, index) => {
      console.log(index + 1 + ". " + player.getName());
    });
    const answer = parseInt(await rl.question("Choose a number: "));
    const randomPlayer = otherPlayerList[answer - 1];
    console.log(
      `Human player ${this.getName()} 選擇 ${randomPlayer.getName()} 來換牌`
    );
    this.getExchange().useExchanging(randomPlayer);
  }

  async returnYourCard() {
    if (this.getHands().cards.length === 0) {
      console.log(`Human player ${this.getName()} 沒有牌88`);
      return null;
    }

    console.log("選一張牌出牌：");
    this.getHands().cards.forEach((card, index) => {
      console.log(index + 1 + ". " + card.toString());
    });
    const answer = parseInt(await rl.question("Choose a number: "));
    const selectedCard = this.getHands().cards[answer - 1];
    this.getHands().cards = this.getHands().cards.filter(
      (c) => c !== selectedCard
    ); // 將出的牌從手牌中移除
    console.log(`Human player ${this.getName()} 回傳牌桌一張牌`);
    return selectedCard;
  }

  gainPoint() {
    console.log(`Human player ${this.getName()} 多一分`);
    this.setPoint(this.getPoint() + 1);
  }
}
