#include "StreetlightList.h"
#include <iostream>
using namespace std;

node* head = NULL;
node* current = NULL;
int listCount = 0;

void insertAtEnd(Streetlight light) {
    node* newNode = new node;
    newNode->data = light;
    newNode->next = NULL;

    if (head == NULL) {
        head = newNode;
    }
    else {
        current = head;
        while (current->next != NULL) {
            current = current->next;
        }
        current->next = newNode;
    }

    listCount++;
}

bool deleteNode(int poleId) {
    node* temp = head;
    node* previous = NULL;

    while (temp != NULL && temp->data.poleId != poleId) {
        previous = temp;
        temp = temp->next;
    }

    if (temp == NULL) {
        return false;
    }

    if (previous == NULL) {
        head = head->next;
    }
    else {
        previous->next = temp->next;
    }

    delete temp;
    listCount--;
    return true;
}

Streetlight* searchNode(int poleId) {
    current = head;

    while (current != NULL) {
        if (current->data.poleId == poleId) {
            return &current->data;
        }
        current = current->next;
    }

    return NULL;
}

void displayList() {
    if (head == NULL) {
        cout << "No streetlights are registered.\n";
        return;
    }

    cout << "\nStreetlights in linked-list order:\n";
    current = head;
    while (current != NULL) {
        cout << "Pole ID: " << current->data.poleId
             << " | Location: " << current->data.location
             << " | Zone: " << current->data.zone
             << " | Condition: " << current->data.condition
             << " | Working: " << (current->data.isWorking ? "Yes" : "No")
             << " | Priority: " << current->data.priority << "\n";
        current = current->next;
    }
}

void traverseList() {
    displayList();
}

int copyListToArray(Streetlight output[], int capacity) {
    int index = 0;
    current = head;

    while (current != NULL && index < capacity) {
        output[index] = current->data;
        index++;
        current = current->next;
    }

    return index;
}

bool listIsEmpty() {
    return head == NULL;
}

int listSize() {
    return listCount;
}

void clearList() {
    while (head != NULL) {
        node* temp = head;
        head = head->next;
        delete temp;
    }
    listCount = 0;
}
