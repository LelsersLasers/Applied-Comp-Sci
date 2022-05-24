import allWords


alphabet = list("abcdefghijklmnopqrstuvwxyz")


def get_words():
    try:
        user_input = input("Only common words [Y/n]? ")
        if user_input[0].lower() == "n": return allWords.get_all_words()
    except: pass
    return allWords.get_common_words()

def input_double_letters():
    try:
        user_input = input("Could there be double letters [Y/n]? ")
        if user_input[0].lower() == "n": return False
    except: pass
    return True

def input_word_len():
    print("How many letters are in the word?")
    while True:
        try:
            user_input = input("Length: ")
            num = int(user_input)
            assert(num > 0)
            return num
        except:
            print("Hint: enter a positive number!")

def input_green_letters():
    print("Enter letters that you know the position of (aka the 'green' letters).")
    print("First enter the letter, hit [enter] then enter the position of the letter where 1 is the first letter.")
    letters = []
    while True:
        try:
            user_input = input("Letter (leave blank to continue): ")
            if len(user_input) == 0: return letters
            letter = user_input.lower()[0]
            assert(letter in alphabet)
            user_input = input("Position: ")
            idx = int(user_input)
            assert(idx > 0)
            letters.append([letter, idx - 1])
            print("")
        except:
            print("Hint: you are doing something wrong (maybe read the directions?)")

def input_letters(prompt):
    print(prompt)
    letters = []
    while True:
        try:
            user_input = input("Letter (leave blank to continue): ")
            if len(user_input) == 0: return letters
            letter = user_input.lower()[0]
            assert(letter in alphabet)
            letters.append(letter)
        except:
            print("Hint: you are doing something wrong (enter only letters)")

def only_neg(old, new):
    if not old: return old
    return new

def has_double_letters(word):
    letters = []
    for letter in word:
        if letter in letters: return True
        else: letters.append(letter)
    return False

def bold_text(txt):
    print("#" * (len(txt) + 4))
    print("# " + txt + " #")
    print("#" * (len(txt) + 4))


def main():

    print("\nSTARTING...\n")
    
    bold_text("Welcome to the wordle helper!")
    
    print("\n") 
    words = get_words()
    print("\n") 
    double_letters = input_double_letters()
    print("\n") 
    word_len = input_word_len()
    print("\n")
    green_letters = input_green_letters()
    print("\n")
    yellow_letters = input_letters("Enter letters that you are are in the word (aka the 'yellow' letters).")
    print("\n")
    dark_letters = input_letters("Enter letters that are not in the word.")


    print("\nSEARCHING...")
    possible_words = []
    for word in words:
        good = len(word) == word_len and not (not double_letters and has_double_letters(word))
        # letter_lst = list(word)
        for gl in green_letters:
            try: good = only_neg(good, word[gl[1]] == gl[0])
            except: continue
        for yl in yellow_letters:
            good = only_neg(good, yl in word)
        for dl in dark_letters:
            good = only_neg(good, dl not in word)
        if good: possible_words.append(word)
    print("FINISHED SEARCHING...\n")

    bold_text("Possible Words:")
    if len(possible_words) > 0:
        for i in range(len(possible_words)):
            print("%i) %s" % (i + 1, possible_words[i]))
    else:
        print("No words found. Did you mis-type or incorrectly enter information?")

    print("\nPROGRAM EXITING...\n")

main()
