const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

function handleSlider(){ //reflects pass length to ui
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;

}

function setIndicator(){

    indicator.computedStyleMap.backgroundcColor = color;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; //floor - round off
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
    return String.fromCharCode(getRndInteger(97,123)); //number to string from ascii value
    
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length); //from symbols ki string
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");


    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str = str + el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special condition
    if(passwordLength< checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //non of the checkbox are checked
    if(checkCount== 0)
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider()
    }

    console.log("Start journey")
    //remove old pass
    password ="";

    //putting letters in password
    // if(uppercaseCheck.checked){
    //     password= password + generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password= password + generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password= password + generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password= password + generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    
     //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password = password + funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length)
        console.log("randIndex" + randIndex);
        password = funcArr[randIndex]();
    }
    console.log("Remaining adddition done");

    //now the letters will be in the order of the checkboxes but it should be random
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    //show in ui
    passwordDisplay.value = password;

    console.log("UI adddition done");
    //calculate strength
    calcStrength();
})