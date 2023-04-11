// 撲克牌

export class Card {
  suit!: string;
  rank!: string;
  constructor(suit: string, rank: string) {
    this.setRank(rank);
    this.setSuit(suit);
  }
  setSuit(suit: string) {
    this.suit = suit;
  }
  setRank(rank: string) {
    this.rank = rank;
  }
  getSuit() {
    return this.suit;
  }
  getRank() {
    return this.rank;
  }
  toString() {
    return this.suit + this.rank;
  }
}
