/*
 * Create a list that holds all of your cards
 */
var cards = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb',
'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb'];
var openCards = [];
var matchNum = 0;
var count = 0;
var second = 0;
var isCounting = false;
var timerID = null;
var starNum = 3;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function getHtml() {
	shuffle(cards);
	$(".card").each(function(index){
        $(this).attr("class","card");  //restart的时候把牌面背过去
		$(this).children().attr("class",cards[index]);
	});
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function click() {
    $(".card").click(function(){   
        //防止每次点击的时候计时发生紊乱
        if (!isCounting) {
            timerBegin();
            isCounting = true;
        }

        if (openCards.length === 0) {
            openCards.push($(this).children().attr("class"));
            $(this).addClass("open show");
        }  
        else if (openCards.length === 1) {
            openCards.push($(this).children().attr("class"));
            $(this).addClass("open show");
            match(openCards);
        }
        else {
            return false;
        }
    });    
}

function match(array) {
    if (array[0] === array[1]) {
        matchSuccess(array[0]);
    }
    else {
        matchFailure(array);
    }
}

function matchSuccess(classname) {
    $(".card").each(function(){
         if($(this).children().attr("class") === classname) {
            $(this).addClass("match");
        }
    });
    openCards = [];
    $(".moves").html(++count);
    matchNum++;
    countSteps();
    if (matchNum === 8) {
        congratulation();
    }
}

function matchFailure(classname) {
    $(".card").each(function() {
        if($(this).children().attr("class") === classname[0] && $(this).hasClass("open")) {
            $(this).addClass("errorShake");
            setTimeout('$(this).attr("class","card")',1000);
        } else if ($(this).children().attr("class") === classname[1] && $(this).hasClass("open")) {
            $(this).addClass("errorShake");
            setTimeout('$(this).attr("class","card")',1000);
        }
    });

    //卡片翻转要设置延迟，不然前面的匹配失败效果就没有了。
    setTimeout(function() {
        $(".card").each(function() {
            if($(this).children().attr("class") === classname[0] && $(this).hasClass("open")) {
                $(this).attr("class","card");
            } else if ($(this).children().attr("class") === classname[1] && $(this).hasClass("open")) {
                $(this).attr("class","card");
            }
        });
    },1000);
    openCards = [];
    $(".moves").html(++count);
    countSteps();

}

function countSteps() {
    switch(count) {
        case 3:
        starRemove();
        starNum--;
        break;
        case 7:
        starRemove();
        starNum--;
        break;
        case 10:
        starRemove();
        starNum--;         
        break;
    }
}

function starRemove() {
    $(".stars li:first").remove();

} 

function congratulation() {
    var star = null;
    clearInterval(timerID);
    var second = $(".timer").html();
    if (starNum === 1) {
        star = ' star';
    } else {
        star = ' stars';
    }
    setTimeout(function complete() {
        alert('Congratulation! You win!' + ' With' + starNum + star + ' and use ' + 
            second + ' seconds'+ ' and ' + count + ' moves!' );
    },1000);

}

function restart() {
    $(".restart").click(function() {
        getHtml();
        clearInterval(timerID);
        count = 0;
        second = 0;
        isCounting = false;
        $(".moves").html(0);
        $(".timer").html(0); 
        $(".stars").empty();
        $(".stars").append("<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>");
    });
   
}

function timerBegin() {
    timerID = setInterval(function() {
        second += 1;
        $(".timer").html(second);
    }, 1000);
}

click();
restart();
