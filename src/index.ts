import Showdown from "./game/showdown";

const showdown = new Showdown();
// 附註：AI player 交換牌的前提是發現手牌都小於7，且沒有使用過換牌功能
(async () => {
  await showdown.start();
  console.log("Showdown has ended.");
  return;
})();
