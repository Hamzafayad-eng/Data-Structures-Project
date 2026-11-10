#include "PoleBST.h"
#include <iostream>
using namespace std;

treeNode* root = NULL;

treeNode* createTreeNode(int key, Streetlight* light) {
    treeNode* newNode = new treeNode;
    newNode->key = key;
    newNode->light = light;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

treeNode* insertNode(treeNode* node, int key, Streetlight* light) {
    if (node == NULL) {
        return createTreeNode(key, light);
    }

    if (key < node->key) {
        node->left = insertNode(node->left, key, light);
    }
    else if (key > node->key) {
        node->right = insertNode(node->right, key, light);
    }

    return node;
}

void insertTreeNode(int key, Streetlight* light) {
    root = insertNode(root, key, light);
}

Streetlight* searchTree(int key) {
    treeNode* temp = root;

    while (temp != NULL) {
        if (key == temp->key) {
            return temp->light;
        }
        else if (key < temp->key) {
            temp = temp->left;
        }
        else {
            temp = temp->right;
        }
    }

    return NULL;
}

treeNode* findMinimum(treeNode* node) {
    while (node != NULL && node->left != NULL) {
        node = node->left;
    }
    return node;
}

treeNode* deleteNodeFromTree(treeNode* node, int key, bool& deleted) {
    if (node == NULL) {
        return NULL;
    }

    if (key < node->key) {
        node->left = deleteNodeFromTree(node->left, key, deleted);
    }
    else if (key > node->key) {
        node->right = deleteNodeFromTree(node->right, key, deleted);
    }
    else {
        deleted = true;

        if (node->left == NULL) {
            treeNode* temp = node->right;
            delete node;
            return temp;
        }
        else if (node->right == NULL) {
            treeNode* temp = node->left;
            delete node;
            return temp;
        }

        treeNode* successor = findMinimum(node->right);
        node->key = successor->key;
        node->light = successor->light;
        bool ignored = false;
        node->right = deleteNodeFromTree(node->right, successor->key, ignored);
    }

    return node;
}

bool deleteTreeNode(int key) {
    bool deleted = false;
    root = deleteNodeFromTree(root, key, deleted);
    return deleted;
}

void inorder(treeNode* node) {
    if (node == NULL) {
        return;
    }

    inorder(node->left);
    cout << "Pole ID: " << node->key
         << " | Location: " << node->light->location
         << " | Condition: " << node->light->condition << "\n";
    inorder(node->right);
}

void preorder(treeNode* node) {
    if (node == NULL) {
        return;
    }

    cout << "Pole ID: " << node->key
         << " | Location: " << node->light->location
         << " | Condition: " << node->light->condition << "\n";
    preorder(node->left);
    preorder(node->right);
}

void displayInorder() {
    if (treeIsEmpty()) {
        cout << "The BST is empty.\n";
        return;
    }

    cout << "\nBST inorder traversal (ascending Pole ID):\n";
    inorder(root);
}

void displayPreorder() {
    if (treeIsEmpty()) {
        cout << "The BST is empty.\n";
        return;
    }

    cout << "\nBST preorder traversal:\n";
    preorder(root);
}

bool treeIsEmpty() {
    return root == NULL;
}

void clearTree(treeNode* node) {
    if (node == NULL) {
        return;
    }

    clearTree(node->left);
    clearTree(node->right);
    delete node;
}
