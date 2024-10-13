const formValidator = {
    isEmpty: (value) => value.trim() === '',

    isCorrectLength: (value, min = 0, max = 100) =>
        value.length >= min && value.length <= max,

    isMatching: (value1, value2) => value1 === value2
}

export const { isEmpty, isCorrectLength, isMatching } = formValidator
