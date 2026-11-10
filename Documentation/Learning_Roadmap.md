# What the Team Needs to Learn Before Submission

This list contains only the tools and knowledge needed to build, test, explain, and submit this CS212 project.

## 1 Visual Studio C++

You need to know how to open `StreetlightRepairDesk.sln`, build with `Ctrl + Shift + B`, run with `Ctrl + F5`, and read compile errors in the Error List.

Learn:

- [Create a C++ console application](https://learn.microsoft.com/en-us/cpp/build/vscpp-step-1-create?view=msvc-160)
- [Build and run a C++ console project](https://learn.microsoft.com/en-us/cpp/build/vscpp-step-2-build?view=msvc-160)
- [C++ console calculator walkthrough](https://learn.microsoft.com/en-us/visualstudio/ide/getting-started-with-cpp-in-visual-studio)

## 2 Debugging

You need breakpoints to follow a record through `reportFault`, `processNextRepair`, and `undoLastRepair`. Put a breakpoint by clicking left of a line or pressing F9, start with F5, then inspect variables such as `poleId`, `count`, `frontIndex`, `rearIndex`, and `topIndex`.

Learn:

- [Visual Studio breakpoints](https://learn.microsoft.com/en-us/visualstudio/debugger/get-started-with-breakpoints)

## 3 Pointers and Dynamic Memory

You need to explain `StreetlightNode*`, `PoleNode*`, `next`, `left`, `right`, `new`, `delete`, and `NULL`. These are fundamental to the Linked List and BST.

Key questions to practice:

- Why does a pointer store an address?
- Why must a node be deleted when removed?
- Why does `PoleBST` point to the Linked List record instead of copying it?
- What happens if a pointer refers to deleted memory?

Learn:

- [Pointers in C++](https://learn.microsoft.com/en-us/cpp/cpp/pointers-cpp?view=msvc-180)

## 4 Your Own Data Structures

Every member should be able to explain these distinctions.

| Topic | You must be able to say |
|---|---|
| Stack | Last-in first-out. In this project, latest completed repair is undone first. |
| Queue | First-in first-out. In this project, first fault report is served first. |
| Linked List | Nodes connect through `next`; search may visit records one by one. |
| BST | Left keys are smaller and right keys are larger; unique Pole ID is the key. |
| Insertion Sort | Takes the next item and shifts larger-priority-order items until it finds the right position. |

## 5 C++ Project Organization

You need to know the difference between:

- `.h`: declarations that tell other files what a class, struct, or function contains.
- `.cpp`: function definitions and executable implementation.
- `#include`: brings declarations into the current file.
- Include guards: prevent the same header from being included more than once.
- `using namespace std;`: lets the code write `string`, `cout`, and `cin` without prefixing them with `std::`.

## 6 Git and GitHub

The course requires one shared GitHub repository or OneDrive folder. GitHub is recommended because it preserves the project history and lets the team share code in one place.

Minimum GitHub vocabulary:

- Repository: online project folder.
- Commit: saved snapshot with a message explaining the change.
- Push: upload local commits to GitHub.
- Pull: download teammates' latest commits.
- Branch: separate work line. It is optional for this small project, but useful when several members edit code.
- README: the first file a reviewer reads to understand how to run the project.

Learn:

- [GitHub Hello World](https://docs.github.com/en/get-started/using-github/hello-world)
- [Creating a GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
- [About remote repositories](https://docs.github.com/en/get-started/git-basics/about-remote-repositories)

Recommended shared workflow:

1. One member creates a repository named `CS212-Streetlight-Repair-Desk`.
2. Add all team members as collaborators.
3. Upload the current project folder.
4. Each member makes changes only in files assigned to them, then commits with a clear message such as `Implement Queue operations`.
5. Before starting work, pull the latest changes. Before sending work, build and test the project.
6. Keep the repository viewable by the instructor before sharing its link.

## 7 Documentation and Presentation

You need to fill real team names, IDs, contributions, and test outcomes. Do not keep placeholders in the final report or presentation.

You need genuine screenshots from your own Visual Studio execution. Capture at least:

- Successful add and BST search.
- Queue FIFO process result.
- Stack Undo result.
- Linked List traversal.
- BST inorder traversal.
- Priority-sorted report.
- One invalid or empty-structure case.

## 8 Live Discussion Preparation

Every team member should practice answering:

1. Why is Queue FIFO and Stack LIFO in this project?
2. Why does the BST require unique Pole IDs?
3. How does deletion maintain consistency between the List, BST, and Queue?
4. What are the time complexities of each structure?
5. Why did we sort a copied array instead of the Linked List or BST?
6. What is one limitation and one reasonable improvement?
