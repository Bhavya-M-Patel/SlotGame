const fs = require('fs');


function matchPatterns(window,patterns){
    let winningLine = []
    patterns.forEach(pattern => {
        let max_count = 0;
        let count = 1;
        let current_Symbol;
        for(let i=1;i<pattern.length;i++){
            let prev = pattern[i-1]
            let curr = pattern[i];
            current_Symbol = window[prev[0]][prev[1]]
            if (window[curr[0]][curr[1]] == current_Symbol)
                count++;
            else 
                break;
            }
        
        if(count>2)
            winningLine.push({current_Symbol,pattern,count});
    });
    return winningLine;
}

module.exports = {matchPatterns}
