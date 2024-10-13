import re
import pandas as pd
from os import path
from underthesea import word_tokenize

root_dir = path.dirname(path.abspath(__file__))
teencodes_data_path = path.normpath(path.join(root_dir, 'data', 'Vietnamese_Teencodes.txt'))
stopwords_data_path = path.normpath(path.join(root_dir, 'data', 'Vietnamese_Stopwords.txt'))

accented_chars = 'àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴÂĂĐÔƠƯ'
unaccented_chars = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAAEEEEEEEEEEEDIIIOOOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYAADOOU'
accented_vowels_table = [
    ['a', 'à', 'á', 'ả', 'ã', 'ạ', 'a'],
    ['ă', 'ằ', 'ắ', 'ẳ', 'ẵ', 'ặ', 'aw'],
    ['â', 'ầ', 'ấ', 'ẩ', 'ẫ', 'ậ', 'aa'],
    ['e', 'è', 'é', 'ẻ', 'ẽ', 'ẹ', 'e'],
    ['ê', 'ề', 'ế', 'ể', 'ễ', 'ệ', 'ee'],
    ['i', 'ì', 'í', 'ỉ', 'ĩ', 'ị', 'i'],
    ['o', 'ò', 'ó', 'ỏ', 'õ', 'ọ', 'o'],
    ['ô', 'ồ', 'ố', 'ổ', 'ỗ', 'ộ', 'oo'],
    ['ơ', 'ờ', 'ớ', 'ở', 'ỡ', 'ợ', 'ow'],
    ['u', 'ù', 'ú', 'ủ', 'ũ', 'ụ', 'u'],
    ['ư', 'ừ', 'ứ', 'ử', 'ữ', 'ự', 'uw'],
    ['y', 'ỳ', 'ý', 'ỷ', 'ỹ', 'ỵ', 'y'],
]


def generate_charset_conversion_dict():
    """
    Loads a dictionary mapping characters in Windows-1252 encoding
    to their corresponding UTF-8 characters.
    """

    dic = {}
    windows_1252_chars = 'à|á|ả|ã|ạ|ầ|ấ|ẩ|ẫ|ậ|ằ|ắ|ẳ|ẵ|ặ|è|é|ẻ|ẽ|ẹ|ề|ế|ể|ễ|ệ|ì|í|ỉ|ĩ|ị|ò|ó|ỏ|õ|ọ|ồ|ố|ổ|ỗ|ộ|ờ|ớ|ở|ỡ|ợ|ù|ú|ủ|ũ|ụ|ừ|ứ|ử|ữ|ự|ỳ|ý|ỷ|ỹ|ỵ|À|Á|Ả|Ã|Ạ|Ầ|Ấ|Ẩ|Ẫ|Ậ|Ằ|Ắ|Ẳ|Ẵ|Ặ|È|É|Ẻ|Ẽ|Ẹ|Ề|Ế|Ể|Ễ|Ệ|Ì|Í|Ỉ|Ĩ|Ị|Ò|Ó|Ỏ|Õ|Ọ|Ồ|Ố|Ổ|Ỗ|Ộ|Ờ|Ớ|Ở|Ỡ|Ợ|Ù|Ú|Ủ|Ũ|Ụ|Ừ|Ứ|Ử|Ữ|Ự|Ỳ|Ý|Ỷ|Ỹ|Ỵ'.split(
        '|'
    )
    utf8_chars = 'à|á|ả|ã|ạ|ầ|ấ|ẩ|ẫ|ậ|ằ|ắ|ẳ|ẵ|ặ|è|é|ẻ|ẽ|ẹ|ề|ế|ể|ễ|ệ|ì|í|ỉ|ĩ|ị|ò|ó|ỏ|õ|ọ|ồ|ố|ổ|ỗ|ộ|ờ|ớ|ở|ỡ|ợ|ù|ú|ủ|ũ|ụ|ừ|ứ|ử|ữ|ự|ỳ|ý|ỷ|ỹ|ỵ|À|Á|Ả|Ã|Ạ|Ầ|Ấ|Ẩ|Ẫ|Ậ|Ằ|Ắ|Ẳ|Ẵ|Ặ|È|É|Ẻ|Ẽ|Ẹ|Ề|Ế|Ể|Ễ|Ệ|Ì|Í|Ỉ|Ĩ|Ị|Ò|Ó|Ỏ|Õ|Ọ|Ồ|Ố|Ổ|Ỗ|Ộ|Ờ|Ớ|Ở|Ỡ|Ợ|Ù|Ú|Ủ|Ũ|Ụ|Ừ|Ứ|Ử|Ữ|Ự|Ỳ|Ý|Ỷ|Ỹ|Ỵ'.split(
        '|'
    )

    for i in range(len(windows_1252_chars)):
        dic[windows_1252_chars[i]] = utf8_chars[i]

    return dic


def generate_vowel_indexes_dict():
    """
    Loads a dictionary mapping accented vowels
    to their corresponding position in the accented_vowels_table.
    """

    vowel_indexes_dict = {}

    for i in range(len(accented_vowels_table)):
        for j in range(len(accented_vowels_table[i]) - 1):
            accented_vowel = accented_vowels_table[i][j]
            vowel_indexes_dict[accented_vowel] = (i, j)

    return vowel_indexes_dict


utf8_chars_dict = generate_charset_conversion_dict()
accented_vowel_indexes_dict = generate_vowel_indexes_dict()


def remove_special_characters(original_string: str):
    """
    Remove special characters from the input string,
    keeping only letters, digits, whitespace, and accented Latin characters.
    """

    return re.sub(r'[^\s\dA-Za-zà-ỹĐ]', ' ', original_string)


def remove_redundant_white_spaces(original_string: str):
    """
    Remove redundant white spaces at the start, at the end of the string and between words.
    """

    return re.sub(r'\s+', ' ', original_string).strip()


def remove_duplicate_characters(original_string: str):
    """
    Remove consecutive intentionally duplicated characters in each word (ignoring case),
    any consecutive group of duplicated characters will be replaced by the first occurrence.
    """

    return re.sub(r'([A-Z])\1+', lambda m: m.group()[0], original_string, flags=re.IGNORECASE)


def convert_to_unicode_string(original_string: str):
    """
    Convert accented characters from Windows-1252 encoding to UTF-8,
    despite looking the same, they can represent different underlying byte sequences.
    """

    return re.sub(
        r'à|á|ả|ã|ạ|ầ|ấ|ẩ|ẫ|ậ|ằ|ắ|ẳ|ẵ|ặ|è|é|ẻ|ẽ|ẹ|ề|ế|ể|ễ|ệ|ì|í|ỉ|ĩ|ị|ò|ó|ỏ|õ|ọ|ồ|ố|ổ|ỗ|ộ|ờ|ớ|ở|ỡ|ợ|ù|ú|ủ|ũ|ụ|ừ|ứ|ử|ữ|ự|ỳ|ý|ỷ|ỹ|ỵ|À|Á|Ả|Ã|Ạ|Ầ|Ấ|Ẩ|Ẫ|Ậ|Ằ|Ắ|Ẳ|Ẵ|Ặ|È|É|Ẻ|Ẽ|Ẹ|Ề|Ế|Ể|Ễ|Ệ|Ì|Í|Ỉ|Ĩ|Ị|Ò|Ó|Ỏ|Õ|Ọ|Ồ|Ố|Ổ|Ỗ|Ộ|Ờ|Ớ|Ở|Ỡ|Ợ|Ù|Ú|Ủ|Ũ|Ụ|Ừ|Ứ|Ử|Ữ|Ự|Ỳ|Ý|Ỷ|Ỹ|Ỵ',
        lambda match: utf8_chars_dict[match.group()],
        original_string,
    )


def convert_to_lowercase(original_string: str):
    """
    Convert original string to lowercase.
    """

    return original_string.lower()


def is_valid_vietnamese_word(word: str):
    """
    Check whether a word is a valid Vietnamese word.
    """

    characters = list(word)
    current_vowel_index = -1
    default_indexes = (-1, -1)

    for index, char in enumerate(characters):
        x, _ = accented_vowel_indexes_dict.get(char, default_indexes)

        # Valid Vietnamese accented vowel check (ignore consonants and invalid characters)
        if x == -1:
            continue

        # Ignore the 1st vowel of the word
        # If the second vowel is not placed right after the previous one => Invalid Vietnamese word
        if current_vowel_index != -1 and index - current_vowel_index != 1:
            return False

        current_vowel_index = index

    # If the word has no vowel => Invalid Vietnamese word
    return current_vowel_index != -1


def normalize_tone_mark_in_word(original_word: str):
    """
    Put tone mark of the word in the correct position according to Vietnamese rules.
    """

    # Ignore invalid Vietnamese word, including abbreviations, foreign languagues, misspelled words, etc
    if not is_valid_vietnamese_word(original_word):
        return original_word

    characters = list(original_word)
    vowel_indexes = []
    tone_mark_index = 0
    default_indexes = (-1, -1)
    startswith_gi_or_qu_consonant = False

    # Removing tone mark of the word, tracking tone mark and vowels positions
    for index, char in enumerate(characters):
        x, y = accented_vowel_indexes_dict.get(char, default_indexes)

        # Valid Vietnamese accented vowel check (ignore consonants and invalid characters)
        if x == -1:
            continue

        # Special case "gi"
        if x == 5 and index != 0 and characters[index - 1] == 'g':
            characters[index] = 'i'
            startswith_gi_or_qu_consonant = True

        # Special case "qu"
        if x == 9 and index != 0 and characters[index - 1] == 'q':
            characters[index] = 'u'
            startswith_gi_or_qu_consonant = True

        # Tracking the tone mark's index (if any)
        if y != 0:
            tone_mark_index = y
            unaccented_vowel = accented_vowels_table[x][0]
            characters[index] = unaccented_vowel

        # Tracking the indexes of all vowels
        # Ignore "i" and "u" in "gi" and "qu" compound consonants
        if not startswith_gi_or_qu_consonant or index >= 2:
            vowel_indexes.append(index)

    # Handle less than 2 vowels
    # Eg: "gì", "giờ", "gìn", "tá", "tan", etc
    if len(vowel_indexes) < 2:
        if not startswith_gi_or_qu_consonant or len(characters) == 2:
            return original_word

        # Having "gi" or "qu" compound consonant and length >= 3
        x, y = accented_vowel_indexes_dict.get(characters[2], default_indexes)

        # If the word still has a vowel => that vowel will carry the tone mark
        # Else: that "gi" or "qu" will carry the tone mark => same as original word
        if x != -1:
            characters[2] = accented_vowels_table[x][tone_mark_index]
        else:
            return original_word

        return ''.join(characters)

    # Handle 2+ vowels
    if len(vowel_indexes) >= 2:
        x, _ = accented_vowel_indexes_dict.get(characters[-1], default_indexes)

        # Ends with a consonant  => last vowel will carry tone mark
        # Eg: "quyến", "tiếng", "việt", "ngoan", "hiền", "nghiêng", etc
        if x == -1:
            tone_mark_position = vowel_indexes[-1]
        # Ends without a consonant => 2nd last vowel will carry tone mark
        # Eg: "giời", "quái", "quầy", "hòa", "người", "cái", "tưới", etc
        else:
            tone_mark_position = vowel_indexes[-2]

        x, _ = accented_vowel_indexes_dict.get(characters[tone_mark_position])
        characters[tone_mark_position] = accented_vowels_table[x][tone_mark_index]
        return ''.join(characters)


def normalize_tone_marks_in_sentence(original_sentence: str):
    """
    Put tone marks in the correct positions according to Vietnamese rules.
    """

    words = original_sentence.split()
    normalized_words = [normalize_tone_mark_in_word(word) for word in words]
    normalized_sentence = ' '.join(normalized_words)

    return normalized_sentence


teencodes_df = pd.read_csv(teencodes_data_path, names=['teencode', 'standard'], sep='\t')
teencodes_list = teencodes_df['teencode'].to_list()
stardards_list = teencodes_df['standard'].to_list()


def search_stardard_of_teencode(word: str):
    """
    Find the corresponding standard words of a teencode,
    if the word isn't a teencode, "None" will be returned.
    """

    try:
        index = teencodes_list.index(word)
        return stardards_list[index]
    except ValueError:
        return None


def replace_teencodes(original_string: str):
    """
    Replace teencodes in the sentence with standard words.
    """

    # Special case: starts with "ok" => "ok", "oke", "okeeee", "okay", etc
    original_string = re.sub(r'\bok\w*\b', 'ok', original_string)

    tokens_list = word_tokenize(original_string)
    teencodes_replaced_tokens_list = [
        (search_stardard_of_teencode(token) or token) for token in tokens_list
    ]

    return ' '.join(teencodes_replaced_tokens_list)


def convert_to_word_phrares_string(original_string: str):
    """
    Convert original string to string with word phrases.
    """

    return word_tokenize(original_string, format='text')


stopwords_df = pd.read_csv(stopwords_data_path, names=['word'])
stopwords_list = stopwords_df['word'].tolist()


def remove_stopwords(original_string: str):
    """
    Remove stopwords in the string.
    """

    words = original_string.split()
    non_stopwords = []

    for word in words:
        if word not in stopwords_list:
            non_stopwords.append(word)

    return ' '.join(non_stopwords)


def preprocess_string(document: str):
    """
    Apply transformations to orginal string,
    the modified string will be suitable for training models.
    """

    # Removing emojis, special characters, commas, dots, etc
    document = remove_special_characters(document)

    # Remove redundant white spaces
    document = remove_redundant_white_spaces(document)

    # Convert string to lowercase
    document = convert_to_lowercase(document)

    # Remove consecutive duplicated characters
    document = remove_duplicate_characters(document)

    # Convert string to unicode standard before applying further transformations
    document = convert_to_unicode_string(document)

    # Put tone marks in the correct positions
    document = normalize_tone_marks_in_sentence(document)

    # Replace teencodes with standard words
    document = replace_teencodes(document)

    # Convert to string with word phrases
    document = convert_to_word_phrares_string(document)

    # Remove stopwords
    document = remove_stopwords(document)

    return document
