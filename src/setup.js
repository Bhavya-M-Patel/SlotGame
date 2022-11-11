const random_number = require("random-number");
const shuffle = require('secure-shuffle');
const fs = require('fs');

class slotGame {

  constructor(reel_size) {
    // setting default values if not matching with criteria
    if (!reel_size || reel_size < 10) {
      reel_size = 10
    }

    this.window_size = 3;
    this.reel_size = reel_size;
    this.reels_count = 5;
    this.spinCost = 10
    
    this.payTable = {
      // paying value : [elements]
      2: ["A", "B", "C"],
      5: ["J", "K",],
      10: ["P"],
    }

    this.paytable_prob_ratio = {
      // paying value : probablity
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
    for (let key in this.paytable_prob_ratio) {
      // getting count of items to inserted in reel based on probablity 
      let N = this.get_item_count(this.paytable_prob_ratio[key]);
      // fetching symbols having key in pay_table as key 
      let items = this.payTable[key];
      let total_items = items.length - 1;

      // generating random elements and pushing to reel
      for (let i = 0; i < N; i++) {
        reel.push(items[random_number({ min: 0, max: total_items, integer: true })]);
      }
    }
    shuffle(reel);
    return reel;
  }

  // returns item count for probablity ratio
  get_item_count(probablity) {
    return parseInt(this.reel_size * probablity);
  }

  //  saves the setup in JSON file
  saveSetup() {
    fs.writeFileSync("setup.json", JSON.stringify(this));
    console.log("Setup created");
  }

}


let game = new slotGame(50)
game.create_game()