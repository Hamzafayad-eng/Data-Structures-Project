#ifndef REPAIR_QUEUE_H
#define REPAIR_QUEUE_H

#include "../Common/Models.h"
using namespace std;

extern RepairRequest repairQueue[MAX_QUEUE];
extern int front;
extern int rear;
extern int queueCount;

bool enqueue(RepairRequest request);
bool dequeue(RepairRequest& request);
bool peek(RepairRequest& request);
bool containsPoleId(int poleId);
int removeRequestsForPole(int poleId);
void displayQueue();
bool queueIsEmpty();
bool queueIsFull();
int queueSize();

#endif
