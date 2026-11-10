#ifndef STREETLIGHT_LIST_H
#define STREETLIGHT_LIST_H

#include "../Common/Models.h"
using namespace std;

// This follows the linked-list style used in Lab 5.
struct node {
    Streetlight data;
    node* next;
};

extern node* head;
extern node* current;
extern int listCount;

void insertAtEnd(Streetlight light);
bool deleteNode(int poleId);
Streetlight* searchNode(int poleId);
void displayList();
void traverseList();
int copyListToArray(Streetlight output[], int capacity);
bool listIsEmpty();
int listSize();
void clearList();

#endif
