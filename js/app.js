/*
 * Create a list that holds all of your cards
 */
var cards = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb',
    'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb'
];
//该数组存储即将进行匹配的卡片
var openCards = [];
//已匹配的卡片对数
var matchNum = 0;
//玩家已走的步数（匹配一次记一步）
var count = 0;
//开始游戏之后的秒数计时
var second = 0;
//计时状态
var isCounting = false;
//setInterval的返回值
var timerID = null;
//初始化星星数量
var starNum = 3;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//洗牌、翻牌、抓牌
function getHtml() {
    shuffle(cards);
    $(".card").each(function(index) {
        $(this).attr("class", "card"); //翻牌
        $(this).children().attr("class", cards[index]);
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

//点击事件
function click() {
    $(".card").click(function() {
        //防止每次点击的时候计时发生紊乱
        //第一次点击时开始计时，此后的点击均不重新计时。
        if (!isCounting) {
            timerBegin();
            isCounting = true;
        }
        //当牌已经翻开或者已经匹配时，不执行点击事件
        if ($(this).hasClass("open") || $(this).hasClass("match")) {
            return;
        }
        //翻开两张牌，第一张牌存入openCards数组，第二张牌存入openCards数组并与第一张牌进行比对。
        if (openCards.length === 0) {
            openCards.push($(this).children().attr("class"));
            $(this).addClass("open show");
        } else if (openCards.length === 1) {
            openCards.push($(this).children().attr("class"));
            $(this).addClass("open show");
            $(".moves").html(++count);
            countSteps();
            match(openCards);
        } else {
            return false;
        }
    });
}
//比对函数
function match(array) {
    //如果openCards中两个元素相同则执行比对成功函数，失败则执行比对失败函数。
    if (array[0] === array[1]) {
        matchSuccess(array[0]);
    } else { 
        matchFailure(array);
    }
}
//比对成功函数
function matchSuccess(classname) {
    //将匹配的卡片添加match类
    $(".card").each(function() {
        if ($(this).children().attr("class") === classname) {
            $(this).addClass("match");
        }
    });
    openCards = [];
    matchNum++;
    if (matchNum === 8) {
        congratulation();
    }
}
//比对失败函数
function matchFailure(classname) {
    //找到翻开的卡片并添加动画效果
    $(".card").each(function() {
        if ($(this).children().attr("class") === classname[0] && $(this).hasClass("open")) {
            $(this).addClass("errorShake");
        } else if ($(this).children().attr("class") === classname[1] && $(this).hasClass("open")) {
            $(this).addClass("errorShake");
        }
    });

    //一秒之后翻牌（要设置延迟，不然第二张牌就翻不开了）
    setTimeout(function() {
        $(".card").each(function() {
            if ($(this).children().attr("class") === classname[0] && $(this).hasClass("open")) {
                $(this).attr("class", "card");
            } else if ($(this).children().attr("class") === classname[1] && $(this).hasClass("open")) {
                $(this).attr("class", "card");
            }
        });
    }, 1000);
    openCards = [];
}
//掉血逻辑
function countSteps() {
    switch (count) {
        case 10:
            starRemove();
            starNum--;
            break;
        case 20:
            starRemove();
            starNum--;
            break;
        case 30:
            starRemove();
            starNum--;
            break;
    }
}
//掉血
function starRemove() {
    $(".stars li:first").remove();
}
//游戏成功
function congratulation() {
    var star = null;
    //停止计时
    clearInterval(timerID);
    //获取玩家游戏时间
    var second = $(".timer").html();
    //显示小星星
    for (var i = starNum - 1; i >= 0; i--) {
        $(".starShow").append("<span><i class='fa fa-star'></i></span>"); 
    }
    //显示玩家游戏信息，优雅的模板字符串呢~ 划重点：反引号 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings
    $(".successInfo").text(`With ${second} seconds and ${count} moves!`);
    //显示congratulation页面
    $(".congratulation").show();
}
//点击重置按钮
function reset() {
    $(".restart").click(function() {
        restart();
    });
}
//点击再玩一次
function tryAgain() {
    $(".tryAgain").click(function() {
        $(".congratulation").hide();
        restart();
    });
}
//重置游戏
function restart() {
    getHtml();
    clearInterval(timerID);
    count = 0;
    second = 0;
    isCounting = false;
    openCards = [];
    $(".moves").html(0);
    $(".timer").html(0);
    $(".stars").empty();
    $(".stars").append("<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>");
}
//开始计时
function timerBegin() {
    timerID = setInterval(function() {
        second += 1;
        $(".timer").html(second);
    }, 1000);
}

click();
reset();
tryAgain();
