# Streetlight Repair Desk Design Decisions

## Project Scope

Project 77 is a streetlight-repair desk. The system stores streetlight records, receives fault reports, serves reports in arrival order, keeps a repair history, and searches for a streetlight by its unique Pole ID.

The following roles come directly from the selected project idea:

- Stack: recent repairs.
- Queue: broken streetlights waiting for technicians.
- Linked List: streetlight inventory records.
- BST: Pole ID lookup.

## Data Ownership and Integration

The linked list owns every `Streetlight` record. Each BST node stores a pointer to the same record in the linked list. The system therefore avoids keeping two separate copies of a streetlight.

When the program updates location, zone, condition, working state, or priority, it changes the single linked-list record. The BST pointer still refers to that same record, so the search result stays correct.

Pole ID never changes in the update operation because it is the BST key. Changing it without deleting and reinserting the BST node would break the BST order. The program states this clearly to the user.

When the user deletes a streetlight, the program first removes its pending repair requests from the queue. It then deletes the BST node, then deletes the linked-list record. This order prevents the BST from holding a pointer to deleted memory.

## Additional Design Choices

These choices are added for this project implementation and are explained here for the live discussion.

### Circular array queue

The Queue uses an array of 100 requests and two indexes, `frontIndex` and `rearIndex`. After the rear reaches the end of the array, it returns to index zero through modulo arithmetic. This lets the queue reuse positions freed by dequeue operations.

The queue is still FIFO. The repair priority is stored as information for reports and sorting, but it does not change the service order. The first person who reports a fault is served first.

### Undo scope

When a technician processes a request, the program records the former condition and working state in the Stack. `Undo` restores these two fields for the most recently processed repair.

Undo does not return the request to the Queue. The action has already left the FIFO workflow. This limitation keeps the behavior simple and makes the Stack role clear. It must be stated honestly in the project report and discussion.

### Insertion Sort report

The linked list stays in insertion order because it owns the actual records. The BST stays ordered by Pole ID because that is its index. Sorting either structure would disturb its purpose.

For this reason, the program copies the records into a temporary array and applies Insertion Sort by priority from 5 to 1. This creates a priority report without changing the linked list or BST.

## Main Workflow

1. Add a streetlight. The system inserts it in the linked list and adds a BST node with the same Pole ID.
2. Report a fault. The system checks the BST, adds a Queue request, and marks the streetlight as awaiting repair.
3. Process the next request. The system reads the Queue front, saves the former state in the Stack, removes the request, and marks the streetlight as working.
4. Undo. The system pops the latest Stack action and restores the former streetlight state.
5. Delete. The system removes pending Queue requests, the BST node, and the linked-list record in that order.

## Classes and Important Functions

| Component | Main Functions | Purpose |
|---|---|---|
| `StreetlightList` | `insert`, `remove`, `search`, `traverse`, `copyToArray` | Manages dynamically allocated streetlight nodes. |
| `RepairQueue` | `enqueue`, `dequeue`, `front`, `containsPoleId`, `removeByPoleId` | Manages fault reports in arrival order. |
| `ActionStack` | `push`, `pop`, `peek` | Manages completed repairs in last-in first-out order. |
| `PoleBST` | `insert`, `remove`, `search`, `inorder`, `preorder` | Indexes records by unique Pole ID. |
| `StreetlightSorter` | `sortByPriority`, `displayPriorityReport` | Implements Insertion Sort for the required algorithm. |
| `StreetlightRepairDesk` | Menu functions | Integrates all structures into one application. |
| `InputHelper` | `readInt`, `readIntInRange`, `readText`, `readYesNo` | Prevents invalid menu and data input from stopping the program. |

## Complexity Analysis

| Operation | Complexity | Reason |
|---|---|---|
| Stack push, pop, peek | O(1) | Uses one array index at the top. |
| Queue enqueue, dequeue, front | O(1) | Uses circular array indexes. |
| Linked List search, delete, traversal | O(n) | May visit nodes one by one. |
| BST search, insert, delete | O(h) | `h` is the tree height. Average is O(log n), worst case is O(n) for an unbalanced BST. |
| Insertion Sort priority report | O(n^2) | Each record may shift across the temporary array. |

## Required Edge Cases

- Duplicate Pole ID: reject before adding a linked-list node.
- Missing Pole ID: show a message instead of using a null pointer.
- Empty Queue: do not dequeue.
- Empty Stack: do not pop or peek.
- Full Queue or Stack: stop the operation safely and show a message.
- One streetlight: support root-only BST and first/last linked-list deletion.
- Non-numeric input: clear `cin` and ask again.
- Pending request during deletion: remove the request before deleting the streetlight record.
