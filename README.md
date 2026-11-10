# Streetlight Repair Desk

CS212 Data Structures course project based on project idea 77. The program manages streetlight records and repair requests through a menu-driven C++ console application.

## Required Data Structures

- **Stack**: keeps completed repairs in last-in first-out order. The user can undo the most recently completed repair.
- **Queue**: keeps fault reports in first-in first-out order until a technician processes them.
- **Linked List**: owns the streetlight records and supports insertion, deletion, search, and traversal.
- **Binary Search Tree**: indexes streetlights by their unique Pole ID for faster lookup, insert, delete, inorder traversal, and preorder traversal.
- **Insertion Sort**: creates a separate report sorted by repair priority without changing the linked-list order or the BST index.

The project manually implements all assessed structures. It does not use `std::stack`, `std::queue`, `std::list`, `std::map`, or ready-made tree classes.

## Folder Structure

```text
Source_Code/
  Algorithms/        Insertion Sort report
  Application/       Integrated menu and project operations
  BST/               Pole ID index
  Common/            Shared models and safe input functions
  LinkedList/        Streetlight records
  Queue/             Waiting repair requests
  Stack/             Completed repair history
  main.cpp
Tests/
  Manual_Test_Plan.md
```

## Run in Visual Studio

1. Open `StreetlightRepairDesk.sln` in Visual Studio.
2. If Visual Studio asks to install C++ support, install **Desktop development with C++**.
3. Select `Debug` and `x64` from the top toolbar.
4. Build with **Ctrl + Shift + B**.
5. Run without debugging with **Ctrl + F5**.

The solution contains every `.cpp` and `.h` file already. No file needs to be added manually.

No external libraries are needed.

## Main Menu Features

1. Add a streetlight.
2. Report a fault and add it to the FIFO repair queue.
3. Process the next repair request.
4. Undo the most recent completed repair.
5. Update a streetlight while keeping the Pole ID index unchanged.
6. Delete a streetlight from both the linked list and BST.
7. Search by unique Pole ID through the BST.
8. Traverse the linked list.
9. Display BST inorder traversal.
10. Display BST preorder traversal.
11. Display waiting repair requests.
12. Display completed repair history.
13. Display the insertion-sort priority report.
14. Display sizes and empty states.
15. Preview the next repair request without removing it.
16. Peek at the most recent completed repair without removing it.

## Important Rules

- Pole ID must be unique because it is the BST key.
- A streetlight with a pending request cannot receive another pending request.
- Deleting a streetlight also removes any pending request for that Pole ID.
- The repair queue and action stack each hold at most 100 elements, so full-capacity handling can be demonstrated.
- Undo restores only the old streetlight state. It does not put the request back into the queue. This is a documented project limitation.
