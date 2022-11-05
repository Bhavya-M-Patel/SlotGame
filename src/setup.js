const rn = require("random-number");
const shuffle = require('secure-shuffle');
const fs = require('fs');

class slotGame {

  constructor(reel_size, reels_count, window_size) {
    if (!reel_size || reel_size < 10) {
      reel_size = 10
    }
    if (!reels_count || reels_count < 3) {
      reels_count = 3
    }
    this.window_size = window_size;
    this.reel_size = reel_size;
    this.reels_count = reels_count;
    this.spinCost = 10
    this.payTable = {
      2: ["A", "B", "C"],
      5: ["J", "K",],
      10: ["P","Q"],
    }
    this.paytable_prob_ratio = {
      10: 0.1,
      5: 0.4,
      2: 0.5,
    };
    this.reels = []
  }

  create_game() {

    for (let i = 0; i < this.reels_count; i++) {
      let reel = this.generate_single_reel();
      this.reels.push(reel);
    }

    this.saveSetup();
  }


  generate_single_reel() {
    let reel = [];
    for (let x in this.paytable_prob_ratio) {
      let N = this.get_item_count(this.reel_size, this.paytable_prob_ratio[x]);
      let items = this.payTable[x];
      let total_items = items.length - 1;

      for (let i = 0; i < N; i++) {
        reel.push(items[rn({ min: 0, max: total_items, integer: true })]);
      }
    }
    shuffle(reel);
    return reel;
  }

  // returns item count for probablity ratio
  get_item_count(probablity, reel_size) {
    return parseInt(reel_size * probablity);
  }

  //  saves the setup in JSON file
  saveSetup() {
    fs.writeFileSync("setup.json", JSON.stringify(this));
    console.log("Setup created");
  }

}


let game = new slotGame(50, 5, 3)
game.create_game()