import allWords


alphabet = list("abcdefghijklmnopqrstuvwxyz")


def get_words():
    only_common = input_yes_or_no("Only common words [Y/n]? ")
    if only_common:
        return allWords.get_all_words()
    return allWords.get_common_words()


def input_yes_or_no(prompt):
    try:
        user_input = input(prompt)
        if user_input[0].lower() == "n":
            return False
    except:
        pass
    return True


def input_word_len():
    print("How many letters are in the word?")
    while True:
        try:
            user_input = input("Length: ")
            num = int(user_input)
            assert num > 0
            return num
        except:
            print("Hint: enter a positive number!")


def input_green_letters():
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
            assert letter in alphabet
            user_input = input("Position: ")
            idx = int(user_input)
            assert idx > 0
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
            assert letter in alphabet
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
    if len(word) != word_len or (not double_letters and has_double_letters(word)):
        if len(word) == word_len:
            print("1 - %s" % word)
        if not(not double_letters and has_double_letters(word)):
            print("2 - %s" % word)
        return False
    for dl in dls:
        if dl in word:
            return False
    letter_lst = list(word)
    for gl in gls:
        try:
            if word[gl[1]] == gl[0]:
                letter_lst.remove(gl[0])
            else:
                return False
        except:
            continue
    for yl in yls:
        if yl in letter_lst:
            letter_lst.remove(yl)
        else:
            return False


def run(word_len, words, double_letters):
    print("\nENTER INFORMATION...\n")

    gls = input_green_letters()
    print("\n")
    yls = input_letters(
        "Enter letters that you are are in the word (aka the 'yellow' letters)."
    )
    print("\n")
    dls = input_letters("Enter letters that are not in the word.")

    print("\nSEARCHING...")
    possible_words = []
    for word in words:
        if is_good_word(word, word_len, double_letters, gls, yls, dls):
            possible_words.append([word, letter_lst])
    print("FINISHED SEARCHING...\n")

    bold_text("Possible Words:")
    if len(possible_words) > 0:
        extra_letters = []
        for i in range(len(possible_words)):
            print("%i) %s" % (i + 1, possible_words[i][0]))
            extra_letters += possible_words[i][1]
        
        no_dups = []
        for letter in extra_letters:
            if letter not in no_dups:
                no_dups.append(letter)
        bold_text(no_dups)
    else:
        print("No words found. Did you mis-type or incorrectly enter information?")


def main():
    print("\nPROGRAM STARTING...\n")
    bold_text("Welcome to the wordle helper!")

    print("\n")
    word_len = input_word_len()
    print("\n")
    words = get_words()
    print("\n")
    double_letters = input_yes_or_no("Could there be double letters [Y/n]? ")

    running = True
    while running:
        run(word_len, words, double_letters)
        print("\n")
        running = input_yes_or_no("Run again [Y/n]? ")

    print("\nPROGRAM EXITING...\n")


main()
