#include "ActionStack.h"
#include <iostream>
using namespace std;

RepairAction repairStack[MAX_STACK];
int top = -1;

bool push(RepairAction action) {
    if (stackIsFull()) {
        cout << "Stack Overflow.\n";
        return false;
    }

    top++;
    repairStack[top] = action;
    return true;
}

bool pop(RepairAction& action) {
    if (stackIsEmpty()) {
        cout << "Stack Underflow.\n";
        return false;
    }

    action = repairStack[top];
    top--;
    return true;
}

bool peek(RepairAction& action) {
    if (stackIsEmpty()) {
        return false;
    }

    action = repairStack[top];
    return true;
}

void displayStack() {
    if (stackIsEmpty()) {
        cout << "No completed repair actions are stored.\n";
        return;
    }

    cout << "\nCompleted repair history (most recent first):\n";
    for (int i = top; i >= 0; i--) {
        cout << "Pole ID: " << repairStack[i].poleId
             << " | Repaired by: " << repairStack[i].technician
             << " | Previous condition: " << repairStack[i].oldCondition
             << " | Previous working state: "
             << (repairStack[i].oldWorkingState ? "Working" : "Not working") << "\n";
    }
}

bool stackIsEmpty() {
    return top == -1;
}

bool stackIsFull() {
    return top == MAX_STACK - 1;
}

int stackSize() {
    return top + 1;
}
