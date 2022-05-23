import allWords


alphabet = list("abcdefghijklmnopqrstuvwxyz")


def get_words():
    while True:
        try:
            user_input = input("Only common words [y/n]? ")
            choice = user_input[0].lower()
            if choice == "y":
                return allWords.get_all_words()
            return allWords.get_common_words()
        except:
            print("Hint: enter 'y' or 'n'")


def input_word_len():
    while True:
        try:
            user_input = input("Word Length: ")
            num = int(user_input)
            assert(num > 0)
            return num
        except:
            print("Hint: enter a positive number!")

def input_green_letters():
    letters = []
    while True:
        try:
            user_input = input("Enter a known letter (aka green in game) ('0' once all know letters are know): ")
            if user_input[0] == "0":
                return letters
            letter = user_input.lower()[0]
            user_input = input("Enter the location of the letter (1 for if its the first letter): ")
            idx = int(user_input)
            assert(idx > 0)
            letters.append([letter, idx - 1])
        except:
            print("Hint: you are doing something wrong")

def input_yellow_letters():
    letters = []
    while True:
        try:
            user_input = input("Enter a sort of known letter (aka yellow in game) ('0' once all know letters are know): ")
            if user_input[0] == "0":
                return letters
            letter = user_input.lower()[0]
            letters.append(letter)
        except:
            print("Hint: you are doing something wrong")

def only_neg(old, new):
    if not old:
        return old
    return new


def main():

    print("START")
    
    txt = "Welcome to the wordle helper!"
    print("#" * (len(txt) + 4))
    print("# " + txt + " #")
    print("#" * (len(txt) + 4))
    print("\n")

    words = get_words()
    print("\n")
    
    word_len = input_word_len()
    print("\n")
    
    green_letters = input_green_letters()
    print("\n")
    
    yellow_letters = input_yellow_letters()
    print("\n")
    

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
            print(word)

main()
