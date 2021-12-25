const httpRequest = new XMLHttpRequest();

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
