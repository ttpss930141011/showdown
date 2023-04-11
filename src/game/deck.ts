// 牌堆
import { Card } from "./card";
import { suitsObj, ranksObj } from "../config";
export class Deck {
  cards: Card[] = [];

  constructor() {
    const suits = Object.keys(suitsObj);
    const ranks = Object.keys(ranksObj);
    const cards: Card[] = [];
    for (let suit of suits) {
      for (let rank of ranks) {
        cards.push(new Card(suit, rank));
      }
    }
    this.setCards(cards);
  }

  getCards() {
    return this.cards;
  }

  setCards(cards: Card[]) {
    this.cards = cards;
  }

  shuffle() {
    for (let i = 0; i < this.cards.length; i++) {
      const j = Math.floor(Math.random() * this.cards.length);
      const temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
    console.log("Shuffle the deck", this.cards.length);
  }

  draw() {
    if (this.cards.length === 0) throw new Error("No cards in the deck");
    return this.cards.pop();
  }
}
