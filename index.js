const isConsonant = (charCode) => {
    return (charCode >= 0x1100 && charCode <= 0x1112) || (charCode >= 0x11A8 && charCode <= 0x11C2);
}

const starterCode = (charCode) => {
    // takes an 'ending code' and returns the corresponding 'starter code'
    switch (charCode) {
        case 0x11A8: // ᆨ
            return 0x1100; // ㄱ
        case 0x11AB: // ᆫ
            return 0x1102; // ㄴ
        case 0x11AE: // ᆮ
            return 0x1103; // ㄷ
        case 0x11AF: // ᆯ
            return 0x1105; // ㄹ
        case 0x11B7: // ᆷ
            return 0x1106; // ㅁ
        case 0x11B8: // ᆸ
            return 0x1107; // ㅂ
        case 0x11BA: // ᆺ
            return 0x1109; // ㅅ
        case 0x11BD: // ᆽ
            return 0x110C; // ㅈ
        case 0x11BE: // ᆾ
            return 0x110E; // ㅊ
        case 0x11BF: // ᆿ
            return 0x110F; // ㅋ
        case 0x11C0: // ᇀ
            return 0x1110; // ㅌ
        case 0x11C1: // ᇁ
            return 0x1111; // ㅍ
        case 0x11C2: // ᇂ
            return 0x1112; // ㅎ
        case 0x11BB: // ᆻ
            return 0x110A; // ㅆ
        case 0x11A9: // ᆩ
            return 0x1101; // ㄲ
        default:
            return charCode;
    }
}
function splitKoreanStr(input) {
    const doubleConsonants = [
        0x11AA, 0x11AC, 0x11AD, 0x11B0, 0x11B1, 0x11B2, 0x11B3, 0x11B4, 0x11B5, 0x11B6, 0x11B9,
    ];

    // split string into array of characters (does not combine double consonants)
    const splitInput = Array.from(input.normalize('NFD'));

    // array for the fully split characters
    const fullySplit = [];

    // split double consonants into two separate characters and populate fullySplit
    splitInput.forEach((char) => {
        if (doubleConsonants.includes(char.codePointAt(0))) {
            const separatedChars = splitKoreanChar(char.codePointAt(0));
            fullySplit.push(separatedChars[0]);
            fullySplit.push(separatedChars[1]);
        } else {
            fullySplit.push(char.codePointAt(0));
        }
    });

    for (let i = 0; i < fullySplit.length; i++) {
        console.log(fullySplit[i].toString(16))
        if (isConsonant(fullySplit[i]) && fullySplit[i + 1] === 0x110B) {
            fullySplit.splice(i + 1, 1);
            fullySplit[i] = starterCode(fullySplit[i]);
        }
    }

    return fullySplit;
}

function splitKoreanChar(combinedChar) {
    // splits a combined Korean character into parts
    switch (combinedChar) {
        case 0x11AA: // ᆪ
            return [0x11A8, 0x1109]; // ㄱㅅ
        case 0x11AC: // ᆬ
            return [0x11AB, 0x110C]; // ㄴㅈ
        case 0x11AD: // ᆭ
            return [0x11AB, 0x1112]; // ㄴㅎ
        case 0x11B0: // ᆰ
            return [0x11AF, 0x1100]; // ㄹㄱ
        case 0x11B1: // ᆱ
            return [0x11AF, 0x1106]; // ㄹㅁ
        case 0x11B2: // ᆲ
            return [0x11AF, 0x1107]; // ㄹㅂ
        case 0x11B3: // ᆳ
            return [0x11AF, 0x1109]; // ㄹㅅ
        case 0x11B4: // ᆴ
            return [0x11AF, 0x1110]; // ㄹㅌ
        case 0x11B5: // ᆵ
            return [0x11AF, 0x1111]; // ㄹㅍ
        case 0x11B6: // ᆶ
            return [0x11AF, 0x1112]; // ㄹㅎ
        case 0x11B9: // ᆹ
            return [0x11B8, 0x1109]; // ㅂㅅ
        default:
            return [combinedChar, combinedChar];
    }
}


function handleSubmit() {
    const splitInput = splitKoreanStr(document.getElementById('input').value)
    splitInput.forEach((num) => console.log(String.fromCharCode(num)))
    document.getElementById('output').innerHTML = `${String.fromCharCode(...splitInput)}`;
}
