#ifndef POLE_BST_H
#define POLE_BST_H

#include "../Common/Models.h"
using namespace std;

struct treeNode {
    int key;
    Streetlight* light;
    treeNode* left;
    treeNode* right;
};

extern treeNode* root;

void insertTreeNode(int key, Streetlight* light);
bool deleteTreeNode(int key);
Streetlight* searchTree(int key);
void inorder(treeNode* node);
void preorder(treeNode* node);
void displayInorder();
void displayPreorder();
bool treeIsEmpty();
void clearTree(treeNode* node);

#endif
