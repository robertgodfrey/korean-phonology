const isConsonant = (charCode) => {
    return (charCode >= LEADING_KIYEOK && charCode <= LEADING_HIEUH)
        || (charCode >= TRAILING_KIYEOK && charCode <= TRAILING_KIYEOK);
}

const starterCode = (charCode) => {
    // takes an 'trailing code' for a consonant and returns its corresponding 'leading code'
    switch (charCode) {
        case TRAILING_KIYEOK: // ᆨ
            return LEADING_KIYEOK; // ㄱ
        case TRAILING_NIEUN: // ᆫ
            return LEADING_NIEUN; // ㄴ
        case TRAILING_TIKEUT: // ᆮ
            return LEADING_TIKEUT; // ㄷ
        case TRAILING_RIEUL: // ᆯ
            return LEADING_RIEUL; // ㄹ
        case TRAILING_MIEUM: // ᆷ
            return LEADING_MIEUM; // ㅁ
        case TRAILING_PIEUP: // ᆸ
            return LEADING_PIEUP; // ㅂ
        case TRAILING_SIOS: // ᆺ
            return LEADING_SIOS; // ㅅ
        case TRAILING_CIEUC: // ᆽ
            return LEADING_CIEUC; // ㅈ
        case TRAILING_CHIEUCH: // ᆾ
            return LEADING_CIEUC; // ㅊ
        case TRAILING_KHIEUKH: // ᆿ
            return LEADING_KHIEUKH; // ㅋ
        case TRAILING_THIEUTH: // ᇀ
            return LEADING_THIEUTH; // ㅌ
        case TRAILING_PHIEUPH: // ᇁ
            return LEADING_PHIEUPH; // ㅍ
        case TRAILING_HIEUH: // ᇂ
            return LEADING_HIEUH; // ㅎ
        case TRAILING_SSANGSIOS: // ᆻ
            return LEADING_SSANGSIOS; // ㅆ
        case TRAILING_SSANGKIYEOK: // ᆩ
            return LEADING_SSANGCIEUC; // ㄲ
        default:
            return charCode;
    }
}

// fully splits a Korean string into its component characters (including double consonants)
function splitKoreanStr(input) {
    const trailingDoubleConsonants = [
        TRAILING_KIYEOKSIOS, TRAILING_NIEUNCIEUC, TRAILING_NIEUNHIEUH, TRAILING_RIEULKIYEOK, TRAILING_RIEULMIEUM,
        TRAILING_RIEULPIEUP, TRAILING_RIEULSIOS, TRAILING_RIEULTHIEUTH, TRAILING_RIEULPHIEUPH, TRAILING_RIEULHIEUH,
        TRAILING_PIEUPSIOS,
    ];

    // split string into array of characters (does not combine double consonants)
    const splitInput = Array.from(input.normalize('NFD'));

    // array for the fully split characters
    const fullySplit = [];

    // split double consonants into two separate characters and populate fullySplit
    splitInput.forEach((char) => {
        if (trailingDoubleConsonants.includes(char.codePointAt(0))) {
            const separatedChars = splitKoreanChar(char.codePointAt(0));
            fullySplit.push(separatedChars[0]);
            fullySplit.push(separatedChars[1]);
        } else {
            fullySplit.push(char.codePointAt(0));
        }
    });

    return fullySplit;
}

function splitKoreanChar(combinedChar) {
    // splits a combined Korean character into parts
    switch (combinedChar) {
        case TRAILING_KIYEOKSIOS: // ᆪ
            return [TRAILING_KIYEOK, LEADING_SIOS]; // ㄱㅅ
        case TRAILING_NIEUNCIEUC: // ᆬ
            return [TRAILING_NIEUN, LEADING_CIEUC]; // ㄴㅈ
        case TRAILING_NIEUNHIEUH: // ᆭ
            return [TRAILING_NIEUN, LEADING_HIEUH]; // ㄴㅎ
        case TRAILING_RIEULKIYEOK: // ᆰ
            return [TRAILING_RIEUL, LEADING_KIYEOK]; // ㄹㄱ
        case TRAILING_RIEULMIEUM: // ᆱ
            return [TRAILING_RIEUL, LEADING_MIEUM]; // ㄹㅁ
        case TRAILING_RIEULPIEUP: // ᆲ
            return [TRAILING_RIEUL, LEADING_PIEUP]; // ㄹㅂ
        case TRAILING_RIEULSIOS: // ᆳ
            return [TRAILING_RIEUL, LEADING_SIOS]; // ㄹㅅ
        case TRAILING_RIEULTHIEUTH: // ᆴ
            return [TRAILING_RIEUL, LEADING_THIEUTH]; // ㄹㅌ
        case TRAILING_RIEULPHIEUPH: // ᆵ
            return [TRAILING_RIEUL, LEADING_PHIEUPH]; // ㄹㅍ
        case TRAILING_RIEULHIEUH: // ᆶ
            return [TRAILING_RIEUL, LEADING_HIEUH]; // ㄹㅎ
        case TRAILING_PIEUPSIOS: // ᆹ
            return [TRAILING_PIEUP, LEADING_SIOS]; // ㅂㅅ
        default:
            return [combinedChar, combinedChar];
    }
}

function resyllabify(input) {
    const splitInput = splitKoreanStr(input);
    for (let i = 0; i < splitInput.length; i++) {
        if (isConsonant(splitInput[i]) && splitInput[i + 1] === LEADING_IEUNG) {
            splitInput.splice(i + 1, 1);
            splitInput[i] = starterCode(splitInput[i]);
        }
    }
    return String.fromCharCode(...splitInput);
}

function neutralizeCoda(input) {
    const splitBlocks = input.split('');
    const finalArray = [];
    for (let i = 0; i < splitBlocks.length; i++) {
        // split each block into separate letters
        splitBlocks[i] = Array.from(splitBlocks[i].normalize('NFD'));

        // convert each letter to its code point
        for (let j = 0; j < splitBlocks[i].length; j++) {
            splitBlocks[i][j] = splitBlocks[i][j].codePointAt(0);
        }

        // check for coda neutralization rules
        if (splitBlocks[i].length > 2) {
            switch(splitBlocks[i][2]) {
                case TRAILING_PHIEUPH: // ᇁ
                    splitBlocks[i][2] = TRAILING_PIEUP; // ᆸ
                    break;
                case TRAILING_THIEUTH: // ᇀ
                case TRAILING_SIOS: // ᆺ
                case TRAILING_CIEUC: // ᆽ
                case TRAILING_CHIEUCH: // ᆾ
                case TRAILING_HIEUH: // ᇂ
                    splitBlocks[i][2] = TRAILING_TIKEUT; // ᆮ
                    break;
                case TRAILING_KHIEUKH: // ᆿ
                case TRAILING_SSANGKIYEOK: // ᆩ
                    splitBlocks[i][2] = TRAILING_KIYEOK; // ᆨ
                    break;
            }
        }
        finalArray.push(...splitBlocks[i]);
    }
    return String.fromCharCode(...finalArray);
}


function handleSubmit() {
    const rawInput = document.getElementById('input').value;
    let output = '';
    output = neutralizeCoda(rawInput);
    output = resyllabify(output);
    document.getElementById('output').innerHTML = output;
}
