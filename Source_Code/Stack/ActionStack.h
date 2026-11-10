#ifndef ACTION_STACK_H
#define ACTION_STACK_H

#include "../Common/Models.h"
using namespace std;

extern RepairAction repairStack[MAX_STACK];
extern int top;

bool push(RepairAction action);
bool pop(RepairAction& action);
bool peek(RepairAction& action);
void displayStack();
bool stackIsEmpty();
bool stackIsFull();
int stackSize();

#endif
