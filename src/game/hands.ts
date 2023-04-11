// player的手牌
// 最多13張，需要去deck抽牌
import { Deck } from "./deck";
import { Card } from "./card";

export class Hands {
  cards: Card[] = [];
  constructor() {}
  getACard(deck: Deck) {
    if (this.cards.length >= 13) return;
    const card = deck.draw();
    if (!card) return;
    this.cards.push(card);
  }
  // 顯示手牌，用來debug
  showCards() {
    let cards = "";
    this.cards.forEach((card) => {
      cards += card.suit + card.rank + " ";
    });

    return cards;
  }
}
