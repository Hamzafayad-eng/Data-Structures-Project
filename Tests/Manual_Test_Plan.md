# Manual Test Plan

Run these cases in Visual Studio and capture the console output for the final report.

| ID | Scenario | Menu Input | Expected Result |
|---|---|---|---|
| T1 | Add a valid streetlight | 1, Pole ID 101, valid details | Record appears in Linked List and BST. |
| T2 | Add duplicate Pole ID | Add 101 twice | Program rejects duplicate ID. |
| T3 | Search an existing Pole ID | 7, 101 | Program displays the correct record. |
| T4 | Search a missing Pole ID | 7, 999 | Program displays a safe not-found message. |
| T5 | Empty queue | 3 before any report | Program says the repair queue is empty. |
| T6 | FIFO behavior | Report 101 then 102, process twice | Program processes 101 before 102. |
| T7 | Stack undo | Process a repair, then choose 4 | Program restores the previous working state and condition. |
| T8 | Empty stack | Choose 4 before processing a repair | Program displays a safe empty-stack message. |
| T9 | Linked List deletion | Add several records, delete first, middle, then last | Program safely deletes each record and updates the BST. |
| T10 | Root-only BST | Add one record, display inorder, delete it | Traversal works before deletion and BST becomes empty after deletion. |
| T11 | BST traversal | Add 30, 10, 20 as Pole IDs, choose 9 and 10 | Inorder prints 10, 20, 30. Preorder shows root-first order. |
| T12 | Non-numeric input | Type letters for a numeric menu choice | Program asks again without terminating. |
| T13 | Queue duplicate request | Report a fault twice for the same Pole ID | Program accepts the first request and rejects the second. |
| T14 | Sorting | Add records with priorities 1, 5, 3, choose 13 | Report prints priority 5, then 3, then 1. |
| T15 | Integration | Add a light, report its fault, process repair, undo it, delete it | Program maintains consistent Linked List, BST, Queue, and Stack state. |
| T16 | Queue front | Report a fault, choose 15 | Program shows the first request without removing it. |
| T17 | Stack peek | Process a repair, choose 16 | Program shows the latest completed repair without removing it. |

## Suggested Demonstration Data

| Pole ID | Location | Zone | Condition | Working | Priority |
|---|---|---|---|---|---|
| 30 | Main Gate | A | Broken lamp | No | 5 |
| 10 | Library Road | B | Flickering | No | 3 |
| 20 | Parking Area | C | Working | Yes | 1 |
