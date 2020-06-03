//TODO - leaderboardsy - nicki oraz liczba ruchów
//Zmienne
var buttonTab = Array.prototype;
var gameTab = [], winTab = [], gameCreated = false, gameStarted = false, isAnimated = false;
var mieszanie, randomsMaked, rememberLos;
var wielkoscPlanszy, liczbaPol, xPos, yPos, xPusty, yPusty, toAdd;
var xPlayer, yPlayer;
var score;
var startTime, endTime, liczbaRuchow, win;
var timeRecords = [];
var timing, czas = "";
var imgCount = 0, imgs = 4;

var botMoves = [], kierunki = [0, 1, 2, 3];

//Główny Div
var mainDiv = document.createElement("div");
mainDiv.id = "main";

function ready() {
    //Grafika na górze + wybór zdjęcia
    var leftArrow = document.createElement("div");
    leftArrow.id = "leftArrow";
    leftArrow.onclick = leftPhoto;
    var zdjecieDiv = document.createElement("div");
    zdjecieDiv.id = "photoDiv";
    var photoHolder = document.createElement("div");
    photoHolder.id = "photoHolder";
    var zdjecieLeft = document.createElement("img");
    zdjecieLeft.id = "photoLeft";
    zdjecieLeft.src = "images/puzzle" + imgs + ".png";
    zdjecieLeft.width = 150;
    zdjecieLeft.style.left = 0;
    var zdjecie = document.createElement("img");
    zdjecie.id = "photo";
    zdjecie.src = "images/puzzle" + imgCount + ".png";
    zdjecie.width = 150;
    zdjecie.style.left = "150px";
    var zdjecieRight = document.createElement("img");
    zdjecieRight.id = "photoRight";
    zdjecieRight.src = "images/puzzle" + (imgCount + 1) + ".png";
    zdjecieRight.width = 150;
    zdjecieRight.style.left = "300px";
    // var zdjecieAnim = document.createElement("img");
    // zdjecieAnim.id = "photoAnim";
    // zdjecieAnim.width = 150;
    photoHolder.appendChild(zdjecieLeft);
    photoHolder.appendChild(zdjecie);
    photoHolder.appendChild(zdjecieRight);
    // photoHolder.appendChild(zdjecieAnim);
    zdjecieDiv.appendChild(leftArrow);
    zdjecieDiv.appendChild(photoHolder);
    var rightArrow = document.createElement("div");
    rightArrow.id = "rightArrow";
    rightArrow.onclick = rightPhoto;
    zdjecieDiv.appendChild(rightArrow);
    mainDiv.appendChild(zdjecieDiv);
    //Przyciski
    var buttonsDiv = document.createElement("div");
    buttonsDiv.id = "buttons";
    for (var i = 0; i < 5; i++) {
        var button = document.createElement("button");
        buttonTab.push(button);
        button.innerText = (i + 2) + "x" + (i + 2);
        button.style.width = "50px";
        button.addEventListener("click", tworzeniePlanszy);
        buttonsDiv.appendChild(button);
    }
    mainDiv.appendChild(buttonsDiv);
    var botBut = document.createElement("button");
    botBut.id = "bot";
    botBut.innerText = "Ułóż to za mnie! :>";
    botBut.addEventListener("click", solution);
    mainDiv.appendChild(botBut);
    //Overlay
    overlay = document.createElement("div");
    overlay.id = "overlay";
    var overlayDiv = document.createElement("div");
    overlayDiv.id = "overlayDiv";
    var overlayText = document.createElement("p");
    overlayText.id = "overlayText"
    var overlayTime = document.createElement("p");
    overlayTime.id = "overlayTime"
    var overlayForm = document.createElement("form");
    overlayForm.id = "overlayForm"
    var overlayNick = document.createElement("input");
    overlayNick.type = "text"
    overlayNick.name = "nick"
    overlayNick.placeholder = "Anonim"
    overlayNick.id = "overlayNick"
    var overlayMoves = document.createElement("p");
    overlayMoves.id = "overlayMoves"
    var overlayButton = document.createElement("button");
    overlayButton.innerText = "OK!";
    overlayButton.onclick = offOver;
    overlayDiv.appendChild(overlayText);
    overlayDiv.appendChild(overlayTime);
    overlayDiv.appendChild(overlayNick);
    overlayDiv.appendChild(overlayMoves);
    overlayDiv.appendChild(overlayButton);
    overlay.appendChild(overlayDiv);
    mainDiv.appendChild(overlay);
    //Zegar
    var clock = document.createElement("div");
    clock.id = "clock";
    var widthCounter = 0;
    for (var i = 0; i < 12; i++) {
        var clockEl = document.createElement("div");
        if (i != 2 && i != 5 && i != 8) {
            clockEl.style.backgroundImage = "url(images/clock/c0.gif)";
            clockEl.style.width = "16px";
            clockEl.style.height = "21px";
            widthCounter += 16;
        } else {
            if (i == 8) {
                clockEl.style.backgroundImage = "url(images/clock/dot.gif)";
            } else {
                clockEl.style.backgroundImage = "url(images/clock/colon.gif)";
            }
            clockEl.style.width = "9px";
            clockEl.style.height = "21px";
            widthCounter += 9;
        }
        clock.appendChild(clockEl);
    }
    clock.style.width = widthCounter + "px";
    mainDiv.appendChild(clock);
    //Dodanie wszystkiego do głównego diva
    document.getElementsByTagName("body")[0].appendChild(mainDiv);
    // console.log(document.getElementById("photoHolder"))
    window.addEventListener("load", scrollowanie);
    // document.getElementById("photoHolder").scrollLeft = 150
    // setTimeout(function () { document.getElementById("photoHolder").scrollLeft = 150 }, 60);
}

function scrollowanie() {
    document.getElementById("photoHolder").scrollLeft = 150;
    // window.removeEventListener("load", scrollowanie, true);
}

function readCookie() {
    timeRecords = [];
    var ciacho = document.cookie;
    var thisRecord = ciacho.indexOf("czas" + wielkoscPlanszy);
    if (thisRecord != -1) {
        ciacho = ciacho.substr(thisRecord, ciacho.length);
        var end = ciacho.indexOf(";");
        if (end == -1) {
            end = ciacho.length;
        }
        ciacho = ciacho.substr(0, end);
        ciacho = JSON.parse(ciacho.substr(ciacho.indexOf("["), ciacho.length));
        for (var i = 0; i < ciacho.length; i++) {
            timeRecords.push(ciacho[i]);
        }
    }
}

function leftPhoto() {
    if (!isAnimated) {
        isAnimated = true;
        if (imgCount > 0) {
            imgCount--;
        } else {
            imgCount = imgs;
        }
        //photoAnimation(-150, 1);
        photoAnimation(-1);
    }
    //document.getElementById("photoHolder").scrollLeft -= 50;
}

function rightPhoto() {
    if (!isAnimated) {
        isAnimated = true;
        if (imgCount < imgs) {
            imgCount++;
        } else {
            imgCount = 0;
        }
        //photoAnimation(150, -1);
        photoAnimation(1);
    }
    //document.getElementById("photoHolder").scrollLeft += 50;
}

/*function photoAnimation(startPos, speed) {
    document.getElementById("photoAnim").src = "images/puzzle" + imgCount + ".png";
    var leftCounter = startPos;
    document.getElementById("photoAnim").style.left = leftCounter + "px";
    document.getElementById("photoAnim").style.display = "block";
    var photoAnim = setInterval(function () {
        leftCounter += speed;
        document.getElementById("photoAnim").style.left = leftCounter + "px";
        if (leftCounter == 0) {
            document.getElementById("photoAnim").style.left = "0px";
            document.getElementById("photo").src = "images/puzzle" + imgCount + ".png";
            document.getElementById("photoAnim").style.display = "none";
            isAnimated = false;
            clearInterval(photoAnim);
        }
    }, 1)
}*/

function photoAnimation(direction) {
    var animCounter = 0;
    var photoAnim = setInterval(function () {
        document.getElementById("photoHolder").scrollLeft += direction;
        animCounter++;
        if (animCounter >= 150) {
            isAnimated = false;
            document.getElementById("photoHolder").children[1].src = "images/puzzle" + imgCount + ".png";
            document.getElementById("photoHolder").scrollLeft = 150;
            if (imgCount == 0) {
                document.getElementById("photoHolder").children[0].src = "images/puzzle" + imgs + ".png";
            } else {
                document.getElementById("photoHolder").children[0].src = "images/puzzle" + (imgCount - 1) + ".png";
            }
            if (imgCount == imgs) {
                document.getElementById("photoHolder").children[2].src = "images/puzzle0.png";
            } else {
                document.getElementById("photoHolder").children[2].src = "images/puzzle" + (imgCount + 1) + ".png";
            }
            clearInterval(photoAnim);
        }
    }, 1)
}

function tworzeniePlanszy(e) {
    win = false;
    liczbaRuchow = 0;
    botMoves = [];
    stopTimer();
    if (gameCreated) {
        document.getElementById("game").remove();
        document.getElementById("score").remove();
        document.getElementById("bot").style.display = "none";
        gameCreated = false;
    }
    if (!gameStarted) {
        clearInterval(mieszanie);
    }
    xPos = 0;
    yPos = 0;
    if (wielkoscPlanszy != buttonTab.indexOf(e.currentTarget) + 2) {
        timeRecords = [];
    }
    wielkoscPlanszy = buttonTab.indexOf(e.currentTarget) + 2;
    liczbaPol = wielkoscPlanszy * wielkoscPlanszy;
    readCookie();
    var nadPlanszaDiv = document.createElement("div");
    nadPlanszaDiv.id = "game";
    var planszaDiv = document.createElement("div");
    planszaDiv.style.width = "400px";
    planszaDiv.classList.add("plansza");
    toAdd = (parseInt(planszaDiv.style.width) / wielkoscPlanszy);
    for (var i = 0; i < wielkoscPlanszy + 2; i++) {
        gameTab[i] = new Array(wielkoscPlanszy + 2).fill("X");
        winTab[i] = new Array(wielkoscPlanszy + 2).fill("X");
    }
    for (var y = 1; y <= wielkoscPlanszy; y++) {
        for (var x = 1; x <= wielkoscPlanszy; x++) {
            var bloczek = document.createElement("div");
            gameTab[y][x] = bloczek;
            winTab[y][x] = bloczek;
            if (x != wielkoscPlanszy || y != wielkoscPlanszy) {
                bloczek.style.backgroundImage = "url(images/puzzle" + imgCount + ".png)";
                bloczek.style.backgroundSize = planszaDiv.style.width;
                bloczek.style.backgroundPosition = xPos + "px " + yPos + "px";
            } else {
                bloczek.id = "pusty";
            }
            bloczek.style.width = toAdd + "px";
            bloczek.style.height = toAdd + "px";
            bloczek.addEventListener("click", ruchGracza);
            xPos -= toAdd;
            planszaDiv.appendChild(bloczek);
        }
        yPos -= toAdd;
        xPos = 0;
    }
    scoreboard();
    //Dołączanie
    nadPlanszaDiv.appendChild(planszaDiv);
    // nadPlanszaDiv.appendChild(score);
    mainDiv.appendChild(score);
    mainDiv.appendChild(nadPlanszaDiv);
    gameCreated = true;
    losowanie();
    scoreboardGeneration();
}

function scoreboard() {
    score = document.createElement("div");
    score.id = "score";
}

function scoreboardGeneration() {
    for (var i = 0; i < timeRecords.length; i++) {
        var scoreTime = timeRecords[i].czas
        scoreTime = scoreTime.slice(0, 2) + ":" + scoreTime.slice(2, 4) + ":" + scoreTime.slice(4, 6) + "." + scoreTime.slice(6, 9)
        var el = document.createElement("p");
        el.innerText = (i + 1) + ") " + scoreTime + " - " + timeRecords[i].nick;
        document.getElementById("score").appendChild(el);
    }
}

function genBoardfromTab() {
    document.getElementById("game").remove();
    var nadPlanszaDiv = document.createElement("div");
    nadPlanszaDiv.id = "game";
    var planszaDiv = document.createElement("div");
    planszaDiv.style.width = "400px";
    planszaDiv.classList.add("plansza");
    for (var y = 1; y <= wielkoscPlanszy; y++) {
        for (var x = 1; x <= wielkoscPlanszy; x++) {
            var bloczek = gameTab[y][x];
            planszaDiv.appendChild(bloczek);
        }
    }
    //scoreboard();
    //nadPlanszaDiv.appendChild(score);
    nadPlanszaDiv.appendChild(planszaDiv);
    mainDiv.appendChild(nadPlanszaDiv);
    //scoreboardGeneration();
}

function losowanie() {
    xPusty = wielkoscPlanszy; yPusty = wielkoscPlanszy;
    randomsMaked = 0; gameStarted = false;
    mieszanie = setInterval(function () {
        var los = Math.floor(Math.random() * 4);
        while (Math.abs(rememberLos - los) == 2 || xPusty == wielkoscPlanszy && los == 1 || xPusty == 1 && los == 3 || yPusty == wielkoscPlanszy && los == 2 || yPusty == 1 && los == 0) {
            los = Math.floor(Math.random() * 4);
        }
        rememberLos = los;
        botMoves.push(los);
        switch (los) {
            case 0: //Góra
                zamianaLos(xPusty, 0, yPusty, -1);
                break;
            case 1: //Prawo
                zamianaLos(xPusty, 1, yPusty, 0);
                break;
            case 2: //Dół
                zamianaLos(xPusty, 0, yPusty, 1);
                break;
            case 3: //Lewo
                zamianaLos(xPusty, -1, yPusty, 0);
                break;
        }
        genBoardfromTab();
        randomsMaked++;
        if (randomsMaked >= liczbaPol * 4) {
            document.getElementById("bot").style.display = "block";
            timer();
            gameStarted = true;
            clearInterval(mieszanie);
        }
    }, 50);
}

function solution() {
    document.getElementById("bot").style.display = "none";
    for (var y = 1; y <= wielkoscPlanszy; y++) {
        for (var x = 1; x <= wielkoscPlanszy; x++) {
            if (gameTab[y][x].id == "pusty") {
                xPusty = x;
                yPusty = y;
            }
        }
    }
    var licznik = botMoves.length - 1
    var ukladanie = setInterval(function () {
        switch (botMoves[licznik]) {
            case 0: //Dół
                zamianaLos(xPusty, 0, yPusty, 1);
                break;
            case 1: //Lewo
                zamianaLos(xPusty, -1, yPusty, 0);
                break;
            case 2: //Góra
                zamianaLos(xPusty, 0, yPusty, -1);
                break;
            case 3: //Prawo
                zamianaLos(xPusty, 1, yPusty, 0);
                break;
        }
        genBoardfromTab();
        if (licznik == 0) {
            win = true;
            checkWin();
            clearInterval(ukladanie);
        } else {
            licznik--;
        }
    }, 50)
}

function zamianaLos(pustkaX, xBot, pustkaY, yBot) {
    if (gameTab[pustkaY + yBot][pustkaX + xBot] != "X") {
        var remember = gameTab[pustkaY + yBot][pustkaX + xBot];
        gameTab[pustkaY + yBot][pustkaX + xBot] = gameTab[pustkaY][pustkaX];
        gameTab[pustkaY][pustkaX] = remember;
        xPusty += xBot;
        yPusty += yBot;
    }
}

function zamiana(klikX, xPlayer, klikY, yPlayer, kierunek) {
    if (gameTab[klikY + yPlayer][klikX + xPlayer].id == "pusty") {
        var remember = gameTab[klikY + yPlayer][klikX + xPlayer];
        gameTab[klikY + yPlayer][klikX + xPlayer] = gameTab[klikY][klikX];
        gameTab[klikY][klikX] = remember;
        if (kierunek == 0 || kierunek == 1) {
            botMoves.push(kierunki[kierunek + 2])
        } else {
            botMoves.push(kierunki[kierunek - 2])
        }
        liczbaRuchow++;
    }
}

function ruchGracza(e) {
    if (gameStarted) {
        for (var y = 1; y <= wielkoscPlanszy; y++) {
            for (var x = 1; x <= wielkoscPlanszy; x++) {
                if (gameTab[y][x] == e.target) {
                    xPlayer = x;
                    yPlayer = y;
                }
            }
        }
        for (var i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                    zamiana(xPlayer, 0, yPlayer, -1, i);
                    break;
                case 1:
                    zamiana(xPlayer, 1, yPlayer, 0, i);
                    break;
                case 2:
                    zamiana(xPlayer, 0, yPlayer, 1, i);
                    break;
                case 3:
                    zamiana(xPlayer, -1, yPlayer, 0, i);
                    break;
            }
        }
        genBoardfromTab();
        checkWin();
    }
}

function checkWin() {
    win = true;
    for (var y = 1; y <= wielkoscPlanszy; y++) {
        for (var x = 1; x <= wielkoscPlanszy; x++) {
            if (gameTab[y][x] != winTab[y][x]) {
                win = false;
            }
        }
    }
    if (win) {
        stopTimer();
        document.getElementById("bot").style.display = "none";
        document.getElementById("pusty").style.backgroundImage = "url(images/puzzle" + imgCount + ".png)";
        document.getElementById("pusty").style.backgroundSize = document.getElementsByClassName("plansza")[0].style.width;
        document.getElementById("pusty").style.backgroundPosition = ((wielkoscPlanszy - 1) * toAdd * -1) + "px " + ((wielkoscPlanszy - 1) * toAdd * -1) + "px";
        onOver();
    }
}

function addToCookie() {
    var czasCookie = czas;
    czasCookie = czasCookie.replace(":", "");
    czasCookie = czasCookie.replace(":", "");
    czasCookie = czasCookie.replace(".", "");
    var nick = document.getElementById("overlayNick").value;
    if (nick == "") {
        nick = "Anonim";
    }
    timeRecords.push({ "czas": czasCookie, "nick": nick })
    timeRecords = sortByKey(timeRecords, "czas");
    if (timeRecords.length > 10) {
        timeRecords.pop();
    }
    console.log(timeRecords);
    var expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + 1000 * 60 * 60 * 24 * 30);
    document.cookie = "czas" + wielkoscPlanszy + "=" + JSON.stringify(timeRecords) + ";expires=" + expireDate.toUTCString();
    console.log(document.cookie)
}

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function onOver() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("overlayDiv").style.display = "block";
    document.getElementById("overlayText").innerText = "Gratulacje, udało Ci się ułożyć wspaniałą układankę " + wielkoscPlanszy + "x" + wielkoscPlanszy;
    document.getElementById("overlayTime").innerText = "Twój czas to: " + czas;
    document.getElementById("overlayMoves").innerText = "Liczba ruchów: " + liczbaRuchow;
    gameStarted = false;
}

function offOver() {
    addToCookie();
    document.getElementById("overlay").style.display = "none";
    document.getElementById("overlayDiv").style.display = "none";
    document.getElementById("score").innerText = "";
    scoreboardGeneration();
}

function timer() {
    startTime = new Date();
    var clockParts = document.getElementById("clock").children;
    timing = setInterval(function () {
        endTime = new Date();
        var timeDiff = endTime - startTime;
        var hours = Math.floor((timeDiff / 1000 / 60 / 60) % 24).toString();
        while (hours.length != 2) {
            hours = "0" + hours;
        }
        var minutes = Math.floor((timeDiff / 1000 / 60) % 60).toString();
        while (minutes.length != 2) {
            minutes = "0" + minutes;
        }
        var seconds = Math.floor((timeDiff / 1000) % 60).toString();
        while (seconds.length != 2) {
            seconds = "0" + seconds;
        }
        var miliseconds = (timeDiff % 1000).toString();
        while (miliseconds.length != 3) {
            miliseconds = "0" + miliseconds;
        }
        czas = hours + ":" + minutes + ":" + seconds + "." + miliseconds;
        for (var i = 0; i < czas.length; i++) {
            if (czas[i] != ":" && czas[i] != ".") {
                clockParts[i].style.backgroundImage = "url(images/clock/c" + czas[i] + ".gif)";
            }
        }
    }, 1)
}

function stopTimer() {
    clearInterval(timing);
    if (!win) {
        czas = "00:00:00.000";
        var clockParts = document.getElementById("clock").children;
        for (var i = 0; i < czas.length; i++) {
            if (czas[i] != ":" && czas[i] != ".") {
                clockParts[i].style.backgroundImage = "url(images/clock/c" + czas[i] + ".gif)";
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", ready);