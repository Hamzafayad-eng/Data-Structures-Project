#include "RepairQueue.h"
#include <iostream>
using namespace std;

RepairRequest repairQueue[MAX_QUEUE];
int front = -1;
int rear = -1;
int queueCount = 0;

bool enqueue(RepairRequest request) {
    if (queueIsFull()) {
        cout << "Queue Overflow.\n";
        return false;
    }

    if (front == -1) {
        front = 0;
    }

    rear++;
    repairQueue[rear] = request;
    queueCount++;
    return true;
}

bool dequeue(RepairRequest& request) {
    if (queueIsEmpty()) {
        cout << "Queue Underflow.\n";
        return false;
    }

    request = repairQueue[front];
    front++;
    queueCount--;

    if (front > rear) {
        front = -1;
        rear = -1;
    }

    return true;
}

bool peek(RepairRequest& request) {
    if (queueIsEmpty()) {
        return false;
    }

    request = repairQueue[front];
    return true;
}

bool containsPoleId(int poleId) {
    for (int i = front; i <= rear; i++) {
        if (repairQueue[i].poleId == poleId) {
            return true;
        }
    }

    return false;
}

int removeRequestsForPole(int poleId) {
    RepairRequest keptRequests[MAX_QUEUE];
    int keptCount = 0;
    int removedCount = 0;
    RepairRequest request;

    while (!queueIsEmpty()) {
        dequeue(request);
        if (request.poleId == poleId) {
            removedCount++;
        }
        else {
            keptRequests[keptCount] = request;
            keptCount++;
        }
    }

    for (int i = 0; i < keptCount; i++) {
        enqueue(keptRequests[i]);
    }

    return removedCount;
}

void displayQueue() {
    if (queueIsEmpty()) {
        cout << "The repair queue is empty.\n";
        return;
    }

    cout << "\nRepair requests (front to rear):\n";
    for (int i = front; i <= rear; i++) {
        cout << i - front + 1 << ". Pole ID: " << repairQueue[i].poleId
             << " | Reported by: " << repairQueue[i].reportedBy
             << " | Fault: " << repairQueue[i].faultDescription
             << " | Priority: " << repairQueue[i].priority << "\n";
    }
}

bool queueIsEmpty() {
    return front == -1 || front > rear;
}

bool queueIsFull() {
    return rear == MAX_QUEUE - 1;
}

int queueSize() {
    return queueCount;
}
