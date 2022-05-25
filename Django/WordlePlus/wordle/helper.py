import allWords


ALPHABET = list("abcdefghijklmnopqrstuvwxyz")
YELLOW_WEIGHT = 3
GREEN_WEIGHT = 1
DOUBLE_LETTER_WEIGHT = 3 / 4


def get_words():
    only_common = input_yes_or_no("Only common words [Y/n]? ")
    if only_common:
        return allWords.get_common_words()
    return allWords.get_all_words()


def input_yes_or_no(prompt):
    try:
        user_input = input(prompt)
        if user_input[0].lower() == "n":
            return False
    except:
        pass
    return True


def input_continue():
    try:
        user_input = input(
            "Would you like to [A]dd on to previous info, [r]estart, or [e]xit? "
        )
        if user_input[0].lower() == "r":
            return "restart"
        elif user_input[0].lower() == "e":
            return "exit"
    except:
        pass
    return "add"


def input_word_len():
    print("How many letters are in the word?")
    while True:
        try:
            user_input = input("Length: ")
            num = int(user_input)
            assert num > 0 and num <= len(ALPHABET)
            return num
        except:
            print("Hint: enter a positive number!")


def input_green_letters(word_len):
    print("Enter letters that you know the position of (aka the 'green' letters).")
    print(
        "First enter the letter, hit [enter] then enter the position of the letter where 1 is the first letter."
    )
    letters = []
    while True:
        try:
            user_input = input("Letter (leave blank to continue): ")
            if len(user_input) == 0:
                return letters
            letter = user_input.lower()[0]
            assert letter in ALPHABET
            user_input = input("Position: ")
            idx = int(user_input)
            assert idx > 0 and idx <= word_len
            letters.append([letter, idx - 1])
            print("")
        except:
            print("Hint: you are doing something wrong (maybe read the directions?)")


def input_letters(prompt):
    print(prompt)
    letters = []
    try:
        user_input = input("Letters (ex: 'dia' without the ''s): ")
        letters_input = user_input.lower()
        for letter in letters_input:
            assert letter in ALPHABET
            letters.append(letter)
        return letters
    except:
        print("Hint: you are doing something wrong (enter only letters)")


def has_double_letters(word):
    letters = []
    for letter in word:
        if letter in letters:
            return True
        else:
            letters.append(letter)
    return False


def bold_text(txt):
    print("#" * (len(txt) + 4))
    print("# " + txt + " #")
    print("#" * (len(txt) + 4))


def is_good_word(word, word_len, double_letters, gls, yls, dls):
    letter_lst = list(word)
    if len(word) != word_len or (not double_letters and has_double_letters(word)):
        return False, letter_lst
    for gl in gls:
        if word[gl[1]] == gl[0]:
            letter_lst.remove(gl[0])
        else:
            return False, letter_lst
    for yl in yls:
        if yl in letter_lst:
            letter_lst.remove(yl)
        else:
            return False, letter_lst
    for dl in dls:
        if dl in letter_lst:
            return False, letter_lst
    return True, letter_lst


def remove_dups(lst):
    no_dups = []
    for e in lst:
        if e not in no_dups:
            no_dups.append(e)
    no_dups.sort()
    return no_dups


def run(word_len, words, double_letters, letter_counts, gls, yls, dls):
    print("\nENTER INFORMATION...\n")

    gls += input_green_letters(word_len)
    print("\n")
    yls += input_letters(
        "Enter letters that you are are in the word (aka the 'yellow' letters)."
    )
    print("\n")
    dls += input_letters("Enter letters that are not in the word.")

    print("\nSEARCHING...")
    possible_words = calc_possible_words(
        words, word_len, double_letters, gls, yls, dls, letter_counts
    )
    print("FINISHED SEARCHING...\n")

    if len(possible_words) == 1:
        bold_text("The word is: %s" % possible_words[0][0])
        return False
    elif len(possible_words) > 0:
        bold_text("Possible Words:")

        extra_letters = []
        for i in range(len(possible_words) - 1, -1, -1):
            print("%i) %s" % (i + 1, possible_words[i][0]))
            extra_letters += possible_words[i][1]

        extra_letters = remove_dups(extra_letters)
        print("\nLetters worth finding out more (the white/unused letters):")
        letter_str = ""
        for letter in extra_letters:
            letter_str += "%s, " % letter
        letter_str = letter_str[:-2]
        print(letter_str)
    else:
        print("No words found. Did you mis-type or incorrectly enter information?")
    return True


def calc_letter_counts(word_len, words, double_letters):
    letter_counts = []
    for i in range(len(ALPHABET)):
        temp = [0] * word_len
        letter_counts.append([0, temp])

    for word in words:
        if is_good_word(word, word_len, double_letters, [], [], [])[0]:
            for i in range(len(word)):
                letter_counts[ALPHABET.index(word[i])][0] += 1
                letter_counts[ALPHABET.index(word[i])][1][i] += 1
    return letter_counts


def calc_possible_words(words, word_len, double_letters, gls, yls, dls, letter_counts):
    word_scores = []
    for word in words:
        good_word = is_good_word(word, word_len, double_letters, gls, yls, dls)
        if good_word[0]:
            score = 0
            for i in range(len(word)):
                score += letter_counts[ALPHABET.index(word[i])][0] * YELLOW_WEIGHT
                score += letter_counts[ALPHABET.index(word[i])][1][i] * GREEN_WEIGHT
            if has_double_letters(word):
                score *= DOUBLE_LETTER_WEIGHT
            word_scores.append([word, good_word[1], score])
    for i in range(len(word_scores)):
        for j in range(len(word_scores) - i - 1):
            if word_scores[j][2] < word_scores[j + 1][2]:
                word_scores[j], word_scores[j + 1] = word_scores[j + 1], word_scores[j]
    return word_scores


def calc_best_starting_word(word_len, words, letter_counts):
    print("\nSTARTING CALCULATIONS...")
    word_scores = calc_possible_words(words, word_len, False, [], [], [], letter_counts)
    print("CALCULATIONS DONE...\n")

    # TODO: remove these block/print statements
    print(word_scores[::-1])
    for i in range(len(word_scores)):
        if word_scores[i][0] in ["crane", "taser", "soare", "arose", "adieu", "audio"]:
            print("%i) %s" % (i, word_scores[i][0]))
    
    return word_scores[0]


def main():
    print("\nPROGRAM STARTING...\n")
    bold_text("Welcome to the wordle helper!")

    print("\n")
    word_len = input_word_len()
    print("\n")
    words = get_words()
    print("\n")
    double_letters = input_yes_or_no("Could there be double letters [Y/n]? ")

    letter_counts = calc_letter_counts(word_len, words, double_letters)

    print("\n")
    want_best_word = input_yes_or_no(
        "Would you like to know the best starting word [Y/n]? "
    )
    if want_best_word:
        best_starting_word = calc_best_starting_word(word_len, words, letter_counts)
        bold_text("Best starting word: %s" % best_starting_word[0].upper())

    gls = []
    yls = []
    dls = []

    running = True
    while running:
        running = run(word_len, words, double_letters, letter_counts, gls, yls, dls)
        print("\n")

        if running:
            loop_status = input_continue()
            running = loop_status != "exit"
            if loop_status == "restart":
                gls = []
                yls = []
                dls = []

    print("\nPROGRAM EXITING...\n")


main()
