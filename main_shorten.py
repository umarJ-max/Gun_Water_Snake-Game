'''' its the logic program of main.py and its now in short 
form also as copmare to main.py leanthy program
'''


print("""THe GAme is water Snake Gun
Here How We Will use name
^^^^^^^^^^^^^^^^^^^^
Snake = s
Water = w
gun = g
^^^^^^^^^^^^^^^^^^^^""")
import random
computer = random.choice([-1, 0, 1])
youstr = input("Enter you choice: ")
youDict = {"s": 1, "w": -1, "g": 0}
you = youDict[youstr]

reverseDict = {1: "Snake", -1: "Water", 0: "Gun"}

print(f"You chose {reverseDict[you]}\nComputer chose {reverseDict[computer]}")

if(computer == you):
    print("its a Draw!")
else:
    if((computer-you) == -1 or (computer-you) == 2):
        print("You Lose!")
    else:
        print("You win!")