import allWords


alphabet = list("abcdefghijklmnopqrstuvwxyz")


def get_words():
    while True:
        try:
            user_input = input("Only common words [y/n]? ")
            choice = user_input[0].lower()
            if choice == "y":
                return allWords.get_common_words()
            return allWords.get_all_words()
        except:
            print("Hint: enter 'y' or 'n'")


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
            if len(user_input) == 0:
                return letters
            letter = user_input.lower()[0]
            user_input = input("Position: ")
            idx = int(user_input)
            assert(idx > 0)
            letters.append([letter, idx - 1])
            print("")
        except:
            print("Hint: you are doing something wrong (maybe read the directions?)")

def input_yellow_letters():
    print("Enter letters that you are are in the word (aka the 'yellow' letters).")
    letters = []
    while True:
        try:
            user_input = input("Letter (leave blank to continue): ")
            if len(user_input) == 0:
                return letters
            letter = user_input.lower()[0]
            letters.append(letter)
        except:
            print("Hint: you are doing something wrong (maybe read the directions?)")

def only_neg(old, new):
    if not old:
        return old
    return new

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
    word_len = input_word_len()
    print("\n")
    green_letters = input_green_letters()
    print("\n")
    yellow_letters = input_yellow_letters()

    print("\nSEARCHING...")
    possible_words = []
    for word in words:
        good = len(word) == word_len
        for gl in green_letters:
            try:
                good = only_neg(good, word[gl[1]] == gl[0])
            except:
                continue
        for yl in yellow_letters:
            try:
                temp = word.index(yl)
            except:
                good = False
        if good:
            possible_words.append(word)
    print("FINISHED SEARCHING...\n")

    bold_text("Possible Words:")
    for i in range(len(possible_words)):
        print("%i) %s" % (i + 1, possible_words[i]))

    print("\nPROGRAM EXITING...\n")

main()
