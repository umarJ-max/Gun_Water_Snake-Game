# First Successful project is Doneee

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
    if(computer == -1 and you == 1):
        print("You win!")
        
    elif(computer == -1 and you == 0):
        print("you Lose!")
        
    elif(computer == 1 and you == -1):
        print("you Lose!")
        
    elif(computer == 1 and you == 0):
        print("you win!")
        
    elif(computer == 0 and you == -1):
        print("you win!")
        
    elif(computer == 0 and you == 1):
        print("you Lose!")
        
    else:
        print("Something went wronge!")
        
