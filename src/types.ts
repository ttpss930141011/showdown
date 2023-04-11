import { Card } from "./game/card";
import { player } from "./player";

export interface playersCards {
  player: player;
  card: Card | null;
}
