#include "StreetlightRepairDesk.h"
#include "../Algorithms/StreetlightSorter.h"
#include "../BST/PoleBST.h"
#include "../Common/InputHelper.h"
#include "../LinkedList/StreetlightList.h"
#include "../Queue/RepairQueue.h"
#include "../Stack/ActionStack.h"
#include <iostream>
using namespace std;

void printStreetlight(Streetlight light) {
    cout << "\nPole ID: " << light.poleId
         << "\nLocation: " << light.location
         << "\nZone: " << light.zone
         << "\nCondition: " << light.condition
         << "\nWorking: " << (light.isWorking ? "Yes" : "No")
         << "\nPriority: " << light.priority << "\n";
}

void addStreetlight() {
    Streetlight light;
    light.poleId = readInt("Enter unique pole ID: ");

    if (searchTree(light.poleId) != NULL) {
        cout << "Duplicate pole ID. No streetlight was added.\n";
        return;
    }

    if (listSize() == MAX_STREETLIGHTS) {
        cout << "The linked list is full for this project.\n";
        return;
    }

    light.location = readText("Enter location: ");
    light.zone = readText("Enter zone: ");
    light.condition = readText("Enter current condition: ");
    light.isWorking = readYesNo("Is the streetlight working");
    light.priority = readIntInRange("Enter priority (1 = low, 5 = urgent): ", 1, 5);

    insertAtEnd(light);
    Streetlight* addedLight = searchNode(light.poleId);
    insertTreeNode(light.poleId, addedLight);

    cout << "Streetlight added successfully to the linked list and BST index.\n";
}

void reportFault() {
    RepairRequest request;
    request.poleId = readInt("Enter pole ID to report: ");
    Streetlight* light = searchTree(request.poleId);

    if (light == NULL) {
        cout << "Pole ID not found. Add the streetlight before reporting a fault.\n";
        return;
    }
    if (containsPoleId(request.poleId)) {
        cout << "This streetlight already has a pending repair request.\n";
        return;
    }
    if (queueIsFull()) {
        cout << "Repair queue is full. The request was not added.\n";
        return;
    }

    request.reportedBy = readText("Enter reporter name: ");
    request.faultDescription = readText("Enter fault description: ");
    request.priority = readIntInRange("Enter repair priority (1 = low, 5 = urgent): ", 1, 5);

    if (enqueue(request)) {
        light->isWorking = false;
        light->condition = "Awaiting repair";
        light->priority = request.priority;
        cout << "Fault report added to the repair queue.\n";
    }
}

void processNextRepair() {
    RepairRequest request;

    if (queueIsEmpty()) {
        cout << "The repair queue is empty.\n";
        return;
    }
    if (stackIsFull()) {
        cout << "Repair history stack is full. Undo one action before processing another repair.\n";
        return;
    }
    if (!peek(request)) {
        return;
    }

    Streetlight* light = searchTree(request.poleId);
    if (light == NULL) {
        dequeue(request);
        cout << "The queued streetlight no longer exists. Its request was removed.\n";
        return;
    }

    RepairAction action;
    action.poleId = light->poleId;
    action.oldCondition = light->condition;
    action.oldWorkingState = light->isWorking;
    action.technician = readText("Enter technician name: ");

    push(action);
    dequeue(request);
    light->isWorking = true;
    light->condition = "Working";

    cout << "Repair processed. Pole " << light->poleId
         << " is now marked as working.\n";
}

void undoLastRepair() {
    RepairAction action;

    if (!pop(action)) {
        cout << "No completed repair is available to undo.\n";
        return;
    }

    Streetlight* light = searchTree(action.poleId);
    if (light == NULL) {
        cout << "The streetlight was deleted, so its old state cannot be restored.\n";
        return;
    }

    light->condition = action.oldCondition;
    light->isWorking = action.oldWorkingState;
    cout << "Last repair was undone. Pole " << light->poleId
         << " was restored to its previous state.\n";
}

void updateStreetlight() {
    int poleId = readInt("Enter pole ID to update: ");
    Streetlight* light = searchTree(poleId);

    if (light == NULL) {
        cout << "Pole ID not found.\n";
        return;
    }

    cout << "Pole ID is the BST key and cannot be changed in this operation.\n";
    light->location = readText("Enter new location: ");
    light->zone = readText("Enter new zone: ");
    light->condition = readText("Enter new condition: ");
    light->isWorking = readYesNo("Is the streetlight working");
    light->priority = readIntInRange("Enter new priority (1 = low, 5 = urgent): ", 1, 5);
    cout << "Streetlight updated. The BST key remains consistent.\n";
}

void deleteStreetlight() {
    int poleId = readInt("Enter pole ID to delete: ");

    if (searchTree(poleId) == NULL) {
        cout << "Pole ID not found.\n";
        return;
    }

    int cancelledRequests = removeRequestsForPole(poleId);
    deleteTreeNode(poleId);
    deleteNode(poleId);

    cout << "Streetlight deleted from the BST index and linked list.\n";
    if (cancelledRequests > 0) {
        cout << cancelledRequests << " pending repair request(s) were cancelled.\n";
    }
}

void searchStreetlight() {
    int poleId = readInt("Enter pole ID to search: ");
    Streetlight* light = searchTree(poleId);

    if (light == NULL) {
        cout << "Pole ID not found in the BST index.\n";
        return;
    }

    printStreetlight(*light);
}

void previewNextRepair() {
    RepairRequest request;

    if (!peek(request)) {
        cout << "The repair queue is empty.\n";
        return;
    }

    cout << "\nNext repair request:\n"
         << "Pole ID: " << request.poleId
         << "\nReported by: " << request.reportedBy
         << "\nFault: " << request.faultDescription
         << "\nPriority: " << request.priority << "\n";
}

void peekLastRepair() {
    RepairAction action;

    if (!peek(action)) {
        cout << "Completed repair history stack is empty.\n";
        return;
    }

    cout << "\nMost recent completed repair:\n"
         << "Pole ID: " << action.poleId
         << "\nTechnician: " << action.technician
         << "\nPrevious condition: " << action.oldCondition
         << "\nPrevious working state: "
         << (action.oldWorkingState ? "Working" : "Not working") << "\n";
}

void displayMenu() {
    cout << "\n========== Streetlight Repair Desk =========="
         << "\n1. Add streetlight"
         << "\n2. Report a fault (enqueue)"
         << "\n3. Process next repair (dequeue)"
         << "\n4. Undo last completed repair (stack pop)"
         << "\n5. Update streetlight"
         << "\n6. Delete streetlight"
         << "\n7. Search streetlight by Pole ID (BST)"
         << "\n8. Display all streetlights (linked-list traversal)"
         << "\n9. Display BST inorder traversal"
         << "\n10. Display BST preorder traversal"
         << "\n11. Display waiting repair queue"
         << "\n12. Display completed repair history stack"
         << "\n13. Display priority report (insertion sort)"
         << "\n14. Display structure sizes"
         << "\n15. Preview next repair request (queue front)"
         << "\n16. Peek last completed repair (stack top)"
         << "\n0. Exit"
         << "\n==============================================\n";
}

void runProgram() {
    int choice;

    do {
        displayMenu();
        choice = readInt("Enter your choice: ");

        switch (choice) {
            case 1: addStreetlight(); break;
            case 2: reportFault(); break;
            case 3: processNextRepair(); break;
            case 4: undoLastRepair(); break;
            case 5: updateStreetlight(); break;
            case 6: deleteStreetlight(); break;
            case 7: searchStreetlight(); break;
            case 8: traverseList(); break;
            case 9: displayInorder(); break;
            case 10: displayPreorder(); break;
            case 11: displayQueue(); break;
            case 12: displayStack(); break;
            case 13: displayPriorityReport(); break;
            case 14:
                cout << "Linked list size: " << listSize()
                     << " | Empty: " << (listIsEmpty() ? "Yes" : "No")
                     << "\nQueue size: " << queueSize()
                     << " | Empty: " << (queueIsEmpty() ? "Yes" : "No")
                     << "\nStack size: " << stackSize()
                     << " | Empty: " << (stackIsEmpty() ? "Yes" : "No") << "\n";
                break;
            case 15: previewNextRepair(); break;
            case 16: peekLastRepair(); break;
            case 0: cout << "Exiting program.\n"; break;
            default: cout << "Invalid choice. Please try again.\n";
        }
    } while (choice != 0);

    clearTree(root);
    root = NULL;
    clearList();
}
