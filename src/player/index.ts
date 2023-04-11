import { Card } from "../game/card";
import { Deck } from "../game/deck";
import { Exchanging } from "../game/exchanging";
import { Hands } from "../game/hands";
import Showdown from "../game/showdown";

export abstract class player {
  abstract name: string;
  abstract point: number;
  abstract hands: Hands;
  abstract exchange: Exchanging;
  abstract showdown: Showdown;

  abstract nameHimself(): Promise<void>;
  abstract drawCard(deck: Deck): void;
  abstract takeATurn(): Promise<Card | null>;
  abstract exchangeHands(): Promise<void>;
  abstract returnYourCard(): void;
  abstract gainPoint(): void;

  public getName(): string {
    return this.name;
  }
  public setName(name: string): void {
    this.name = name;
  }
  public getPoint(): number {
    return this.point;
  }
  public setPoint(point: number): void {
    this.point = point;
  }
  public getHands(): Hands {
    return this.hands;
  }
  public setHands(hands: Hands): void {
    this.hands = hands;
  }
  public getExchange(): Exchanging {
    return this.exchange;
  }
  public setExchange(exchange: Exchanging): void {
    this.exchange = exchange;
  }
  public getShowdown(): Showdown {
    return this.showdown;
  }
  public setShowdown(showdown: Showdown): void {
    this.showdown = showdown;
  }
}
