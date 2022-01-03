const httpRequest = new XMLHttpRequest();

let lastFrameTimeInMillis = 0;
let blueCircle;
let orangeCircle;
let blueCircleDiv;
let orangeCircleDiv;
let isAnimationDone = false;
let isClosed = false;

let technicalParameters = {};


class Circle {
    constructor(x, y, xSpeed, ySpeed, radius, color) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.radius = radius;
        this.color = color;
        console.log(xSpeed, ySpeed);
    }

    draw(c, ctx, delta) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;

        // check for wall collisions
        if (this.x + technicalParameters.circleRadius > c.width || this.x - technicalParameters.circleRadius < 0) {
            this.xSpeed = -this.xSpeed;
            showStatus(this.color + " circle hit a wall", true);
        }
        if (this.y + technicalParameters.circleRadius > c.height || this.y - technicalParameters.circleRadius < 0) {
            this.ySpeed = -this.ySpeed;
            showStatus(this.color + " circle hit a wall", true);
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    revertDirection() {
        this.xSpeed = -this.xSpeed;
        this.ySpeed = -this.ySpeed;
    }

    isWithinRectangle(x, y, width, height) {
        return this.x - this.radius >= x
            && this.x + this.radius <= x + width
            && this.y + this.radius <= y + height
            && this.y - this.radius >= y;
    }
}

class DivCircle {
    constructor(id, x, y, xSpeed, ySpeed, radius, color) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.radius = radius;
        this.color = color;
        console.log(xSpeed, ySpeed);

        console.log(id, x, y);
        this.div = document.getElementById(id);
        this.div.style.color = this.color;
        this.div.style.width = 2 * radius + "px";
        this.div.style.height = 2 * radius + "px";
        this.div.style.left = this.x - this.radius + "px";
        this.div.style.top = this.y - this.radius + "px";
    }

    draw(c, delta) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;

        // check for wall collisions
        if (this.x + technicalParameters.circleRadius > c.offsetWidth || this.x - technicalParameters.circleRadius < 0) {
            this.xSpeed = -this.xSpeed;
            showStatusDivs(this.color + " circle hit a wall", true);
        }
        if (this.y + technicalParameters.circleRadius > c.offsetHeight || this.y - technicalParameters.circleRadius < 0) {
            this.ySpeed = -this.ySpeed;
            showStatusDivs(this.color + " circle hit a wall", true);
        }

        this.div.style.left = this.x - this.radius + "px";
        this.div.style.top = this.y - this.radius + "px";
    }

    revertDirection() {
        this.xSpeed = -this.xSpeed;
        this.ySpeed = -this.ySpeed;
    }

    isWithinRectangle(x, y, width, height) {
        return this.x - this.radius >= x
            && this.x + this.radius <= x + width
            && this.y + this.radius <= y + height
            && this.y - this.radius >= y;
    }
}

window.onload = function () {
    let borderColor = localStorage.getItem("borderColor");
    if (borderColor != null && borderColor.length > 0) {
        changeBorderColors(borderColor);
    }
    let reversedCookie = getCookie("reversed");
    if (reversedCookie.length > 0) {
        alert("Reading cookie " + reversedCookie + ". Press OK to clear the cookies");
        document.cookie = "reversed=;";
        alert("Cookies were cleared. Press OK to reload the document");
        window.location.reload(false);
        return;
    }
    swapSecondAndFifthParagraphChildren();
    calculatePentagonArea(12);
}


function swapSecondAndFifthParagraphChildren() {
    const two = document.getElementById("two");
    const five = document.getElementById("five");

    const twoClone = two.cloneNode(true);
    two.replaceChildren(...five.children);
    five.replaceChildren(...twoClone.childNodes);
}

function calculatePentagonArea(side) {
    const area = 0.25 * Math.sqrt(5 * (5 + 2 * Math.sqrt(5))) * side * side;

    const four = document.getElementById("four");
    const paragraph = document.createElement("p");
    const text = document.createTextNode("Calculated area of a pentagon: " + area);
    paragraph.appendChild(text);
    four.appendChild(paragraph);
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function reverseNumber() {
    const number = document.forms["numberInput"]["number"].value;
    let reversed = reverseString(number);
    alert(reversed);
    document.cookie = "reversed=" + reversed;
    return false;
}

function setBorderColor() {
    const color = document.forms["borderColor"]["color"].value;
    alert(color);
    localStorage.setItem('borderColor', color);
    changeBorderColors(color);
}

function changeBorderColors(color) {
    document.getElementsByClassName("one")[0].style.border = "1px solid " + color;
    document.getElementsByClassName("two")[0].style.border = "1px solid " + color;
    document.getElementsByClassName("three")[0].style.border = "1px solid " + color;
    document.getElementsByClassName("four")[0].style.border = "1px solid " + color;
    document.getElementsByClassName("five")[0].style.border = "1px solid " + color;
    document.getElementsByClassName("six")[0].style.border = "1px solid " + color;
    document.getElementsByClassName("seven")[0].style.border = "1px solid " + color;
    for (let elementsByClassNameElement of document.getElementsByClassName("rectangle")) {
        elementsByClassNameElement.style.border = "1px solid " + color;
    }
}

function showFormInputs() {
    document.querySelectorAll("form input").forEach(value => {
        applyCSSFor(value);
    });
    document.querySelectorAll("form button").forEach(value => {
        applyCSSFor(value);
    });
}

function applyCSSFor(element) {
    element.style.visibility = "visible";
}

function disableCSSFor(element) {
    element.style.visibility = "hidden";
    document.cookie = "CSSInstruction=;";
}

function saveCSSInstruction(element) {
    document.cookie = "CSSInstruction=" + "value.style.visibility = \"visible\"";
    applyCSSFor(element);
}

function reverseString(str) {
    let result = "";
    for (var i = str.length - 1; i >= 0; i--) {
        result += str[i];
    }
    return result;
}

function createDropdowns() {
    let tabTitle = document.forms["dropdowns"]["tabTitle"].value;
    let content = document.forms["dropdowns"]["dropdownContent"].value;
    content = content.split(",");
    for (let i = 0; i < content.length; i++) {
        content[i] = content[i].trimStart();
    }
    console.log(tabTitle);
    console.log(content);

    const four = document.getElementById("four");

    const div = document.createElement("div");
    div.className = "dropdown";

    let p = document.createElement("p");
    p.appendChild(document.createTextNode(tabTitle));
    p.className = "dropdown-title";
    div.appendChild(p);

    const dropdownContent = document.createElement("div");
    dropdownContent.className = "dropdown-content";

    const ul = document.createElement("ul");

    for (let i = 0; i < content.length; i++) {
        let li = document.createElement("li");
        let a = document.createElement("a");
        let text = document.createTextNode(content[i]);
        a.appendChild(text);
        li.appendChild(a);
        ul.appendChild(li);
    }

    dropdownContent.appendChild(ul);
    div.appendChild(dropdownContent);
    four.appendChild(div);

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.onreadystatechange = displayServerResult;
    httpRequest.open('POST', 'saveDropdown');
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.send('title=' + tabTitle + '&content=' + content + '&html=' + div.outerHTML);

    return false;
}

function displayServerResult() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            console.log(httpRequest.responseText);
        } else {
            alert('There was a problem with the request.');
        }
    }
}

function adjustCanvasSize() {
    const parent = document.getElementById("anim");
    const canvas = document.getElementById("canvas");

    canvas.setAttribute('height', parent.clientHeight + "px");
    canvas.setAttribute('width', parent.clientWidth + "px");
}


function showWork() {
    document.getElementById("work").style.display = "flex";
    adjustCanvasSize();

    initCanvas();
    showStatus("Popup is displayed", false);
}

function showWorkDivs() {
    document.getElementById("work_divs").style.display = "flex";

    initCanvasDivs();
    showStatusDivs("Popup is displayed", false);
}

function initCanvas() {
    isClosed = false;
    const c = document.getElementById("canvas");
    const width = c.width;
    const height = c.height;

    const blueVectorAngle = getRandomAngle();
    blueCircle = new Circle(
        (width - technicalParameters.circleRadius * 2) * Math.random() + technicalParameters.circleRadius,
        technicalParameters.circleRadius,
        getXSpeed(blueVectorAngle, technicalParameters.circleSpeed),
        getYSpeed(blueVectorAngle, technicalParameters.circleSpeed),
        technicalParameters.circleRadius,
        "blue"
    );
    const orangeVectorAngle = getRandomAngle();
    orangeCircle = new Circle(
        (width - technicalParameters.circleRadius * 2) * Math.random() + technicalParameters.circleRadius,
        height - technicalParameters.circleRadius,
        getXSpeed(orangeVectorAngle, technicalParameters.circleSpeed),
        getYSpeed(orangeVectorAngle, technicalParameters.circleSpeed),
        technicalParameters.circleRadius,
        "orange"
    );

    lastFrameTimeInMillis = 0;
    draw(false);
}

function initCanvasDivs() {
    isClosed = false;
    const c = document.getElementById("canvas_divs");
    const width = c.offsetWidth;
    const height = c.offsetHeight;
    console.log("check ", width, height)

    const blueVectorAngle = getRandomAngle();
    blueCircleDiv = new DivCircle(
        "circle_one",
        (width - technicalParameters.circleRadius * 2) * 1 + technicalParameters.circleRadius,
        technicalParameters.circleRadius,
        getXSpeed(blueVectorAngle, technicalParameters.circleSpeed),
        getYSpeed(blueVectorAngle, technicalParameters.circleSpeed),
        technicalParameters.circleRadius,
        "blue"
    );
    const orangeVectorAngle = getRandomAngle();
    orangeCircleDiv = new DivCircle(
        "circle_two",
        (width - technicalParameters.circleRadius * 2) * Math.random() + technicalParameters.circleRadius,
        height - technicalParameters.circleRadius,
        getXSpeed(orangeVectorAngle, technicalParameters.circleSpeed),
        getYSpeed(orangeVectorAngle, technicalParameters.circleSpeed),
        technicalParameters.circleRadius,
        "orange"
    );

    lastFrameTimeInMillis = 0;
    drawDivs(false);
}

function getXSpeed(angle, maxSpeed) {
    return Math.cos(angle) * maxSpeed;
}

function getYSpeed(angle, maxSpeed) {
    return Math.sin(angle) * maxSpeed;
}

function getRandomAngle() {
    return Math.random() * (Math.PI * 2);
}

function draw(shouldAnimate) {
    const time = new Date();
    const delta = lastFrameTimeInMillis !== 0
        ? (time.getTime() - lastFrameTimeInMillis) / 1000
        : 0;

    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    blueCircle.draw(c, ctx, delta);
    orangeCircle.draw(c, ctx, delta);

    // check circles for collisions
    const catet1 = Math.abs(blueCircle.x - orangeCircle.x);
    const catet2 = Math.abs(blueCircle.y - orangeCircle.y);
    const distance = Math.hypot(catet1, catet2);
    if (distance < technicalParameters.circleRadius * 2) {
        blueCircle.revertDirection();
        orangeCircle.revertDirection();
        showStatus("Circle collision detected", true);
    }

    // check for full placement
    if (blueCircle.isWithinRectangle(0, c.height / 2, c.width, c.height / 2)
        && orangeCircle.isWithinRectangle(0, 0, c.width, c.height / 2)) {
        showStatus("Full placement reached", true);
        isAnimationDone = true;
        document.getElementById("start_animation").disabled = false;
        document.getElementById("start_animation").innerText = technicalParameters.reloadButtonText;
    }

    lastFrameTimeInMillis = time.getTime();

    if (shouldAnimate && !isClosed && !isAnimationDone) {
        window.requestAnimationFrame(draw);
    }
}

function drawDivs(shouldAnimate) {
    const time = new Date();
    const delta = lastFrameTimeInMillis !== 0
        ? (time.getTime() - lastFrameTimeInMillis) / 1000
        : 0;

    const c = document.getElementById("canvas_divs");

    blueCircleDiv.draw(c, delta);
    orangeCircleDiv.draw(c, delta);

    // check circles for collisions
    const catet1 = Math.abs(blueCircleDiv.x - orangeCircleDiv.x);
    const catet2 = Math.abs(blueCircleDiv.y - orangeCircleDiv.y);
    const distance = Math.hypot(catet1, catet2);
    if (distance < technicalParameters.circleRadius * 2) {
        blueCircleDiv.revertDirection();
        orangeCircleDiv.revertDirection();
        showStatusDivs("Circle collision detected", true);
    }

    // check for full placement
    if (blueCircleDiv.isWithinRectangle(0, c.offsetHeight / 2, c.offsetWidth, c.offsetHeight / 2)
        && orangeCircleDiv.isWithinRectangle(0, 0, c.offsetWidth, c.offsetHeight / 2)) {
        showStatusDivs("Full placement reached", true);
        isAnimationDone = true;
        document.getElementById("start_animation_divs").disabled = false;
        document.getElementById("start_animation_divs").innerText = technicalParameters.reloadButtonText;
    }

    lastFrameTimeInMillis = time.getTime();

    if (shouldAnimate && !isClosed && !isAnimationDone) {
        window.requestAnimationFrame(drawDivs);
    }
}

function startAnimation() {
    if (isAnimationDone) {
        document.getElementById("start_animation").innerText = technicalParameters.startButtonText;
        isAnimationDone = false;
        initCanvas();
        showStatus("Reset animation clicked", true);
    } else {
        document.getElementById("start_animation").disabled = true;
        lastFrameTimeInMillis = new Date().getTime();
        window.requestAnimationFrame(function () {
            draw(true);
        });
        showStatus("Animation started", true);
    }
}

function startAnimationDivs() {
    if (isAnimationDone) {
        document.getElementById("start_animation_divs").innerText = technicalParameters.startButtonText;
        isAnimationDone = false;
        initCanvasDivs();
        showStatusDivs("Reset animation clicked", true);
    } else {
        document.getElementById("start_animation_divs").disabled = true;
        lastFrameTimeInMillis = new Date().getTime();
        window.requestAnimationFrame(function () {
            drawDivs(true);
        });
        showStatusDivs("Animation started", true);
    }
}

function hideWork() {
    showStatus("Animation popup is hidden", false);
    document.getElementById("work").style.display = "none";
    isClosed = true;
    document.getElementById("start_animation").innerText = technicalParameters.startButtonText;
    document.getElementById("start_animation").disabled = false;
    displayAnimationLogs();
}

function hideWorkDivs() {
    showStatusDivs("Animation popup is hidden", false);
    document.getElementById("work_divs").style.display = "none";
    isClosed = true;
    document.getElementById("start_animation_divs").innerText = technicalParameters.startButtonText;
    document.getElementById("start_animation_divs").disabled = false;
    displayAnimationLogs();
}

function displayAnimationLogs() {
    let animationLogs = localStorage.getItem("animationLogs");
    animationLogs = localStorage.getItem("animationLogs");
    if (animationLogs == null) {
        animationLogs = [];
    } else {
        animationLogs = JSON.parse(animationLogs);
    }

    const animationLogsDiv = document.getElementById("animationLogs");
    const list = document.createElement("ul");
    animationLogsDiv.innerHTML = "";

    animationLogs.forEach(function (item) {
        let li = document.createElement("li");
        let d = document.createElement("div");
        let text = document.createTextNode(new Date(item.time) + " " + item.status);
        d.appendChild(text);
        li.appendChild(d);
        list.appendChild(li);
    });

    animationLogsDiv.appendChild(list);
}

function showStatus(status, displayInPopup) {
    if (status == null) {
        document.getElementById("status").innerText = "";
    } else {
        if (displayInPopup) {
            document.getElementById("status").innerText = status;
        }
        let animationLogs = localStorage.getItem("animationLogs");
        if (animationLogs == null) {
            animationLogs = [];
        } else {
            animationLogs = JSON.parse(animationLogs);
        }
        animationLogs.push({
            time: new Date().getTime(),
            status: status
        });
        localStorage.setItem("animationLogs", JSON.stringify(animationLogs));
    }
}

function showStatusDivs(status, displayInPopup) {
    if (status == null) {
        document.getElementById("status_divs").innerText = "";
    } else {
        if (displayInPopup) {
            document.getElementById("status_divs").innerText = status;
        }
        let animationLogs = localStorage.getItem("animationLogs");
        if (animationLogs == null) {
            animationLogs = [];
        } else {
            animationLogs = JSON.parse(animationLogs);
        }
        animationLogs.push({
            time: new Date().getTime(),
            status: status
        });
        localStorage.setItem("animationLogs", JSON.stringify(animationLogs));
    }
}