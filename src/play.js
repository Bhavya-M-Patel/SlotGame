const fs = require('fs');
const random_number = require('random-number');
const readline = require('readline-sync');
const chalk = require('chalk');
const { Wallet } = require('./wallet')
const { matchPatterns } = require('./matchpatterns')

let setup;
let wallet;
let patterns;
let start = function () {
    // Loading setup and Patterns
    try {
        setup = fs.readFileSync('./setup.json', { encoding: 'utf-8' })
        setup = JSON.parse(setup);
        Object.freeze(setup)
        patterns = JSON.parse(fs.readFileSync('./Patterns/patterns.json'));
        wallet = new Wallet();

    }
    catch (e) {
        console.log(chalk.chalkStderr(e));
    }
}

let roll = function () {
    if (setup) {
        if (wallet.getAmount() >= setup.spinCost) {

            // Rolling slot machine and deducting cost
            wallet.debitAmount(setup.spinCost)
            let w = generate_window(setup.reels_count, setup.reel_size, setup.window_size, setup.reels);

            // fetching paylines from window
            let paylines = matchPatterns(w, patterns);

            // calculating profit
            let profit = CalculateProfit(paylines);

            wallet.creditAmount(profit)
            
            return { window: w, winningLines: paylines, profit };
        }
        else {
            return { err: 'Add more coins' }
        }
    }
    else {
        return { err: "Setup not loaded" }
    }
}
// generate window_size * reel_count window from reels
function generate_window(count, maximum, window_size, reels) {
    let window = []

    let mid = Math.floor(window_size / 2)

    for (let i = 0; i < count; i++) {
        let random = random_number({ min: 0, max: maximum - 1, integer: true })

        // find if generated random number is near to 0 or 19 to make reel circular
        let checkMin = (random - mid >= 0) ? false : true;
        let checkMax = (random + mid < maximum) ? false : true;

        let reel_window = []

        if (checkMin) {
            let ele_count = Math.abs(random - mid);
            let slice_index = maximum - ele_count;
            reel_window.push(...reels[i].slice(slice_index, maximum))
            reel_window.push(...reels[i].slice(0, random + mid + 1))
            window.push(reel_window);
        }
        else if (checkMax) {
            let ele_count = (random + mid) - maximum + 1;
            reel_window.push(...reels[i].slice(random - mid, maximum))
            reel_window.push(...reels[i].slice(0, ele_count))
            window.push(reel_window);
        }
        else
            window.push(reels[i].slice(random - mid, random + mid + 1))
    }

    let transposed_window = []
    // transposing the window
    for (let i = 0; i < window[0].length; i++) {
        let reel = [];
        for (let j = 0; j < window.length; j++) {
            reel.push(window[j][i]);
        }
        transposed_window.push(reel);
    }
    return transposed_window;
}
// calculating profit from matched paylines
function CalculateProfit(paylines) {
    if (paylines.length == 0) {
        return 0;
    }
    let profit = 0;
    paylines.forEach(({ current_Symbol: symbol, count }) => {
        for (let val in setup.payTable) {
            if (setup.payTable[val].includes(symbol)) {
                profit = profit + (val * count);
            }

        }
    });
    return profit;
}

// Functions for printing colored messages in terminal

function printMenu() {
    colorMsgs('1. Roll', 'info');
    colorMsgs('2. Check balance', 'info');
    colorMsgs('3. Add coins', 'info');
    colorMsgs('4. Exit', 'info');
}

function colorMsgs(msg, msgtype) {
    let colored_msg = "Error occured";
    switch (msgtype) {
        case 'err':
            colored_msg = chalk.bgRed.bold(msg);
            break;
        case 'info':
            colored_msg = chalk.blue(msg);
            break;
        case 'warn':
            colored_msg = chalk.bgYellow(msg);
            break;
        case 'msg':
            colored_msg = chalk.green(msg);
            break;
        default:
            colored_msg = chalk.inverse(msg);
    }
    console.log(colored_msg);
}

// Execution of Game
start()

while (true) {
    printMenu();
    let choice = parseInt(readline.question("Enter choice "))
    switch (choice) {
        case 1:
            let w = roll()
            if (!w.err) {
                console.log("window",w.window);
                console.log("winnig lines",w.winningLines);
                console.log("Total profit",w.profit);
            }
            else
                colorMsgs(w.err, 'err');
            break;
        case 2:
            colorMsgs('Wallet contains ' + wallet.getAmount() + ' coins', 'msg');
            break;
        case 3:
            // adding amount to wallet
            let amount = parseFloat(readline.question("Enter amount ")) || 0
            wallet.creditAmount(amount);
            colorMsgs('Amount added', 'msg');
            break;

        case 4: process.exit(0);

        default: console.log(colorMsgs('Enter valid choice', 'err'));
    }
}
