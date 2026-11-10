import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = process.cwd();
const skillDir = "C:/Users/VICTUS/.codex/plugins/cache/openai-primary-runtime/presentations/26.1105.12137/skills/presentations";
const runtimePython = "C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1105-1297-0_26.1105.1297.0_x64__3k8sg7r9htsxt/dependencies/python/python.exe";
const buildDir = path.join(workspaceDir, "StreetlightRepairDesk", ".build", "presentation");
const finalPath = path.join(workspaceDir, "StreetlightRepairDesk", "Presentation", "Streetlight_Repair_Desk_Presentation_Final_Reviewed.pptx");
const stagingDir = path.join(workspaceDir, "StreetlightRepairDesk", ".build", "presentation-finalizer");

const COLORS = {
  night: "#0B1F33",
  blue: "#1D4ED8",
  teal: "#0F766E",
  amber: "#D97706",
  red: "#B91C1C",
  ink: "#102A43",
  muted: "#52616B",
  pale: "#F3F7FA",
  line: "#CBD5E1",
  white: "#FFFFFF",
  green: "#15803D",
};

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

function addBox(slide, left, top, width, height, fill, radius = "rounded-lg") {
  return slide.shapes.add({
    geometry: "roundRect",
    position: { left, top, width, height },
    fill,
    line: { style: "solid", fill, width: 0 },
    borderRadius: radius,
  });
}

function addText(slide, text, left, top, width, height, size = 20, color = COLORS.ink, bold = false, align = "left") {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left, top, width, height },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontSize: size,
    fontFamily: "Aptos",
    color,
    bold,
    align,
    valign: "middle",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
  };
  return shape;
}

function addTitle(slide, title, subtitle = "") {
  addText(slide, title, 64, 42, 1148, 50, 32, COLORS.ink, true);
  if (subtitle) addText(slide, subtitle, 64, 94, 1148, 28, 15, COLORS.muted);
  const rule = slide.shapes.add({
    geometry: "rect",
    position: { left: 64, top: 128, width: 1152, height: 3 },
    fill: COLORS.blue,
    line: { style: "solid", fill: COLORS.blue, width: 0 },
  });
  return rule;
}

// A slightly lower version of the standard heading.  It gives the renderer
// additional space on dense reference slides, so no heading text is clipped.
function addSafeTitle(slide, title, subtitle = "") {
  addText(slide, "FUNCTION REFERENCE", 64, 30, 400, 18, 11, COLORS.blue, true);
  addText(slide, title, 64, 58, 1148, 50, 32, COLORS.ink, true);
  if (subtitle) addText(slide, subtitle, 64, 108, 1148, 28, 15, COLORS.muted);
  return slide.shapes.add({
    geometry: "rect",
    position: { left: 64, top: 142, width: 1152, height: 3 },
    fill: COLORS.blue,
    line: { style: "solid", fill: COLORS.blue, width: 0 },
  });
}

function addFooter(slide, number) {
  addText(slide, "CS212 Data Structures", 64, 684, 260, 18, 11, COLORS.muted);
  addText(slide, String(number), 1175, 684, 38, 18, 11, COLORS.muted, false, "right");
}

function addSectionLabel(slide, text, color = COLORS.blue) {
  addText(slide, text.toUpperCase(), 64, 18, 400, 18, 11, color, true);
}

function addList(slide, items, left, top, width, size = 20, color = COLORS.ink, gap = 39) {
  items.forEach((item, index) => {
    addText(slide, "-", left, top + index * gap, 18, 24, size, COLORS.blue, true);
    addText(slide, item, left + 26, top + index * gap, width - 26, 30, size, color);
  });
}

function addFlowStep(slide, number, title, detail, left, top, color) {
  addBox(slide, left, top, 210, 188, COLORS.white);
  addBox(slide, left + 20, top + 18, 42, 42, color, "rounded-full");
  addText(slide, String(number), left + 20, top + 20, 42, 38, 18, COLORS.white, true, "center");
  addText(slide, title, left + 20, top + 77, 170, 29, 19, COLORS.ink, true);
  addText(slide, detail, left + 20, top + 112, 170, 58, 14, COLORS.muted);
}

function buildDeck() {
  const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });

  let slide = presentation.slides.add();
  slide.background.fill = COLORS.night;
  addText(slide, "CS212 Data Structures", 76, 70, 430, 28, 18, "#BFDBFE", true);
  addText(slide, "Streetlight\nRepair Desk", 76, 130, 600, 190, 55, COLORS.white, true);
  addText(slide, "Project 77", 80, 340, 210, 30, 24, "#FCD34D", true);
  addText(slide, "A menu driven C++ application for streetlight records and repair requests", 80, 393, 560, 54, 20, "#D6E4F0");
  addText(slide, "Team Members: [Add names and IDs]\nPractical Section: [Add section]", 80, 560, 560, 58, 15, "#D6E4F0");
  addBox(slide, 790, 135, 330, 330, "#123B5D", "rounded-2xl");
  addBox(slide, 858, 198, 18, 205, "#64748B", "rounded-md");
  addBox(slide, 876, 178, 172, 34, "#FCD34D", "rounded-md");
  addBox(slide, 896, 230, 130, 16, "#FEF3C7", "rounded-md");
  addText(slide, "77", 900, 275, 120, 82, 60, COLORS.white, true, "center");
  addText(slide, "Streetlight pole concept", 820, 488, 270, 24, 14, "#BFDBFE", false, "center");

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Project overview");
  addTitle(slide, "Problem Definition and Scope", "Streetlight Repair Desk manages reports from the moment a fault is registered until repair completion.");
  addText(slide, "Problem", 80, 184, 260, 38, 24, COLORS.blue, true);
  addText(slide, "A city or campus needs a clear way to store streetlight records, receive faults, and track repair work.", 80, 232, 475, 105, 23, COLORS.ink);
  addText(slide, "System Scope", 650, 184, 260, 38, 24, COLORS.teal, true);
  addList(slide, ["Register, update, delete, search, and display streetlights", "Receive repair requests in arrival order", "Process repairs and undo the latest completed repair", "Show BST traversals and a priority-sorted report"], 650, 238, 500, 18);
  addBox(slide, 80, 457, 1070, 120, COLORS.pale);
  addText(slide, "The application uses manual data-structure implementations. It does not use ready-made stack, queue, list, map, or tree classes.", 108, 490, 1015, 64, 22, COLORS.ink, true, "center");
  addFooter(slide, 2);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Course requirements");
  addTitle(slide, "Requirement Coverage", "Each required structure has an actual role in the same integrated application.");
  const requirements = [
    ["Stack", "Completed repairs and Undo", COLORS.red],
    ["Queue", "Waiting fault reports", COLORS.amber],
    ["Linked List", "Streetlight record storage", COLORS.teal],
    ["BST", "Pole ID index and search", COLORS.blue],
  ];
  requirements.forEach((entry, index) => {
    const left = 82 + index * 284;
    addBox(slide, left, 204, 246, 220, COLORS.pale);
    addBox(slide, left, 204, 246, 14, entry[2], "rounded-none");
    addText(slide, entry[0], left + 24, 246, 190, 36, 25, COLORS.ink, true);
    addText(slide, entry[1], left + 24, 300, 190, 62, 18, COLORS.muted);
  });
  addText(slide, "Additional required evidence", 82, 478, 320, 32, 22, COLORS.ink, true);
  addList(slide, ["Insertion Sort report", "Input validation and edge cases", "Big O analysis and manual test cases", "README, report, screenshots, and shared repository"], 82, 528, 1020, 17, COLORS.ink, 33);
  addFooter(slide, 3);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Architecture");
  addTitle(slide, "Integrated Data Flow", "The linked list owns records. The BST points to those same records by Pole ID.");
  addBox(slide, 84, 206, 235, 250, "#E8F2FF");
  addText(slide, "Linked List", 110, 236, 185, 36, 25, COLORS.blue, true, "center");
  addText(slide, "Owns every Streetlight record\nInsert, remove, search, traverse", 110, 300, 185, 85, 17, COLORS.ink, false, "center");
  addBox(slide, 378, 206, 235, 250, "#E6FFFA");
  addText(slide, "PoleBST", 402, 236, 186, 36, 25, COLORS.teal, true, "center");
  addText(slide, "Stores Pole ID and a pointer\nto the linked-list record", 402, 300, 186, 85, 17, COLORS.ink, false, "center");
  addBox(slide, 672, 206, 235, 250, "#FFF7E6");
  addText(slide, "RepairQueue", 696, 236, 186, 36, 25, COLORS.amber, true, "center");
  addText(slide, "Stores fault reports\nin first-in first-out order", 696, 300, 186, 85, 17, COLORS.ink, false, "center");
  addBox(slide, 966, 206, 235, 250, "#FEECEC");
  addText(slide, "ActionStack", 990, 236, 186, 36, 25, COLORS.red, true, "center");
  addText(slide, "Stores completed repairs\nfor last-in first-out Undo", 990, 300, 186, 85, 17, COLORS.ink, false, "center");
  addText(slide, "Add streetlight: Linked List then BST. Delete streetlight: Queue requests then BST node then Linked List record.", 115, 526, 1030, 52, 22, COLORS.ink, true, "center");
  addFooter(slide, 4);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Data model");
  addTitle(slide, "Shared Records", "The project keeps only the fields required for the repair workflow.");
  const records = [
    ["Streetlight", "poleId, location, zone, condition, isWorking, priority"],
    ["RepairRequest", "poleId, reportedBy, faultDescription, priority"],
    ["RepairAction", "poleId, oldCondition, oldWorkingState, technician"],
  ];
  records.forEach((entry, index) => {
    const top = 193 + index * 128;
    addBox(slide, 118, top, 1044, 96, index === 0 ? "#E8F2FF" : index === 1 ? "#FFF7E6" : "#FEECEC");
    addText(slide, entry[0], 152, top + 27, 250, 34, 24, COLORS.ink, true);
    addText(slide, entry[1], 432, top + 25, 670, 44, 19, COLORS.muted);
  });
  addText(slide, "Pole ID is unique because the BST uses it as the search key.", 118, 596, 1040, 32, 20, COLORS.blue, true, "center");
  addFooter(slide, 5);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Linked List");
  addTitle(slide, "StreetlightList", "A singly linked list stores the actual streetlight records.");
  addBox(slide, 80, 198, 396, 350, "#E6FFFA");
  addText(slide, "Node structure", 110, 228, 300, 33, 23, COLORS.teal, true);
  addText(slide, "StreetlightNode\n  data: Streetlight\n  next: StreetlightNode*", 130, 286, 290, 96, 21, COLORS.ink, false);
  addText(slide, "head points to the first node\ncount stores the current size", 130, 415, 280, 60, 17, COLORS.muted);
  addText(slide, "Functions", 585, 203, 220, 35, 24, COLORS.blue, true);
  addList(slide, ["insert: appends a new record", "remove: deletes a node by Pole ID", "search: returns a pointer to matching data", "traverse: displays every record", "copyToArray: supports the sorted report"], 585, 258, 525, 19, COLORS.ink, 48);
  addText(slide, "Why this structure fits: the inventory changes over time and each record uses dynamic node allocation.", 95, 595, 1070, 35, 19, COLORS.ink, true, "center");
  addFooter(slide, 6);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Binary Search Tree");
  addTitle(slide, "PoleBST", "The BST gives a direct index for each unique Pole ID.");
  addBox(slide, 90, 202, 410, 328, "#E8F2FF");
  addText(slide, "PoleNode", 121, 230, 160, 34, 24, COLORS.blue, true);
  addText(slide, "key: Pole ID\nlight: Streetlight*\nleft and right child pointers", 121, 284, 300, 95, 20, COLORS.ink);
  addText(slide, "The node points to the linked-list record instead of copying it.", 121, 415, 320, 55, 17, COLORS.muted);
  addText(slide, "Required operations", 570, 205, 300, 36, 24, COLORS.blue, true);
  addList(slide, ["insert: rejects a duplicate Pole ID", "search: follows left or right branches", "remove: handles leaf, one-child, and two-child nodes", "inorder: prints Pole IDs in ascending order", "preorder: prints root before children"], 570, 260, 570, 18, COLORS.ink, 47);
  addFooter(slide, 7);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Queue");
  addTitle(slide, "RepairQueue", "A circular array queue processes fault reports in arrival order.");
  addBox(slide, 80, 207, 1110, 116, "#FFF7E6");
  ["front", "Report 101", "Report 102", "Report 103", "rear"].forEach((label, index) => {
    const left = 122 + index * 210;
    addBox(slide, left, 244, 150, 45, index === 0 || index === 4 ? "#FDE68A" : COLORS.white);
    addText(slide, label, left + 4, 253, 142, 25, 15, COLORS.ink, true, "center");
  });
  addText(slide, "Circular indexes reuse array positions after dequeue operations.", 126, 348, 1000, 35, 20, COLORS.amber, true, "center");
  addText(slide, "Functions", 100, 435, 180, 34, 24, COLORS.amber, true);
  addList(slide, ["enqueue: adds a new fault report at the rear", "dequeue: removes the first waiting report", "front: previews the next report without removing it", "isEmpty, isFull, and size: handle queue state", "containsPoleId: prevents duplicate pending reports"], 100, 485, 1000, 18, COLORS.ink, 35);
  addFooter(slide, 8);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Stack");
  addTitle(slide, "ActionStack", "The Stack stores completed repairs and enables Undo for the latest repair.");
  const stackLabels = ["Older repair", "Repair 102", "Repair 101", "TOP Latest repair"];
  stackLabels.forEach((label, index) => {
    const top = 425 - index * 55;
    addBox(slide, 182, top, 270, 44, index === 3 ? "#FCA5A5" : "#FEECEC");
    addText(slide, label, 196, top + 10, 242, 22, 15, COLORS.ink, index === 3, "center");
  });
  addText(slide, "Functions", 590, 205, 180, 34, 24, COLORS.red, true);
  addList(slide, ["push: saves the state before marking a repair as completed", "pop: removes the latest action and restores the old state", "peek: previews the latest action without removing it", "isEmpty, isFull, and size: prevent invalid actions"], 590, 267, 540, 19, COLORS.ink, 52);
  addText(slide, "Undo restores the streetlight condition and working state. It does not put the request back in the Queue.", 570, 525, 550, 55, 17, COLORS.muted);
  addFooter(slide, 9);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Required algorithm");
  addTitle(slide, "Insertion Sort Priority Report", "The sort creates a report without changing the linked list or BST.");
  addBox(slide, 88, 202, 1055, 110, COLORS.pale);
  ["Priority 1", "Priority 5", "Priority 3", "Priority 5"].forEach((label, index) => {
    const left = 130 + index * 230;
    addBox(slide, left, 238, 170, 42, "#FFFFFF");
    addText(slide, label, left, 248, 170, 20, 15, COLORS.ink, true, "center");
  });
  addText(slide, "Copy list records to a temporary array", 100, 370, 420, 31, 22, COLORS.blue, true);
  addText(slide, "Apply Insertion Sort from priority 5 to priority 1", 100, 425, 680, 31, 22, COLORS.teal, true);
  addText(slide, "Display the sorted array as a priority report", 100, 480, 600, 31, 22, COLORS.amber, true);
  addBox(slide, 790, 358, 335, 172, "#E8F2FF");
  addText(slide, "Why a copy?", 815, 384, 270, 30, 22, COLORS.blue, true, "center");
  addText(slide, "The linked list preserves insertion order.\nThe BST preserves Pole ID order.", 815, 432, 270, 55, 17, COLORS.ink, false, "center");
  addFooter(slide, 10);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "End to end scenario");
  addTitle(slide, "Fault Report Workflow", "One report moves through several data structures while record consistency remains protected.");
  addFlowStep(slide, 1, "Register", "Add record to the Linked List and PoleBST.", 70, 218, COLORS.teal);
  addFlowStep(slide, 2, "Report fault", "Validate Pole ID, enqueue request, mark awaiting repair.", 300, 218, COLORS.amber);
  addFlowStep(slide, 3, "Process", "Read Queue front, push old state, dequeue request.", 530, 218, COLORS.blue);
  addFlowStep(slide, 4, "Complete", "Mark streetlight working and show stack history.", 760, 218, COLORS.red);
  addFlowStep(slide, 5, "Undo", "Pop stack action and restore the old state.", 990, 218, COLORS.teal);
  addText(slide, "Deleting a record first removes any pending request, then removes its BST node, then removes its linked-list node.", 90, 540, 1090, 46, 20, COLORS.ink, true, "center");
  addFooter(slide, 11);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Validation");
  addTitle(slide, "Input Validation and Edge Cases", "The application prevents errors instead of stopping unexpectedly.");
  const edgeCases = [
    ["Duplicate Pole ID", "Reject before inserting into the Linked List and BST"],
    ["Missing Pole ID", "Show a safe not-found message"],
    ["Empty Queue or Stack", "Do not dequeue, pop, or peek"],
    ["Full Queue or Stack", "Stop the operation with a clear message"],
    ["Invalid text for a number", "Clear cin and ask for valid input again"],
  ];
  edgeCases.forEach((entry, index) => {
    const top = 188 + index * 77;
    addBox(slide, 90, top, 1038, 58, index % 2 === 0 ? COLORS.pale : "#FFFFFF");
    addText(slide, entry[0], 120, top + 15, 295, 25, 18, COLORS.ink, true);
    addText(slide, entry[1], 455, top + 15, 630, 25, 17, COLORS.muted);
  });
  addFooter(slide, 12);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Code organization");
  addTitle(slide, "Classes and Helper Functions", "Code components use the simple array and pointer logic used in the labs.");
  const classes = [
    ["StreetlightRepairDesk", "Menu and integrated operations"],
    ["StreetlightList", "Records and linked nodes"],
    ["PoleBST", "Pole ID index"],
    ["RepairQueue", "Waiting reports"],
    ["ActionStack", "Completed repairs"],
    ["StreetlightSorter", "Insertion Sort report"],
    ["InputHelper", "Safe integer, text, and yes-no input"],
  ];
  classes.forEach((entry, index) => {
    const col = index < 4 ? 0 : 1;
    const row = index < 4 ? index : index - 4;
    const left = col === 0 ? 100 : 655;
    const top = 190 + row * 100;
    addBox(slide, left, top, 480, 72, col === 0 ? "#E8F2FF" : "#E6FFFA");
    addText(slide, entry[0], left + 20, top + 14, 220, 26, 18, COLORS.ink, true);
    addText(slide, entry[1], left + 245, top + 14, 210, 36, 15, COLORS.muted);
  });
  addFooter(slide, 13);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Function reference");
  addTitle(slide, "StreetlightList Functions", "The list owns all Streetlight records and returns pointers to them when needed.");
  const listFunctions = [
    ["Constructor and destructor", "Start head at NULL, then delete every node when the program ends."],
    ["insert", "Create a node, append it at the end, and increase count."],
    ["remove", "Find the target and reconnect the previous node to the next node."],
    ["search", "Traverse until Pole ID matches, then return a pointer to its Streetlight data."],
    ["traverse", "Print every node from head to NULL."],
    ["copyToArray", "Copy list data to a temporary array for Insertion Sort."],
    ["isEmpty and size", "Report empty state and current node count."],
  ];
  listFunctions.forEach((entry, index) => {
    const col = index < 4 ? 0 : 1;
    const row = index < 4 ? index : index - 4;
    const left = col === 0 ? 94 : 650;
    const top = 180 + row * 96;
    addBox(slide, left, top, 500, 68, col === 0 ? "#E6FFFA" : COLORS.pale);
    addText(slide, entry[0], left + 20, top + 12, 190, 25, 16, COLORS.teal, true);
    addText(slide, entry[1], left + 220, top + 12, 255, 38, 13.5, COLORS.ink);
  });
  addFooter(slide, 14);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSafeTitle(slide, "RepairQueue Functions", "The Queue is a fixed-size circular array with capacity 100.");
  const queueFunctions = [
    ["Constructor", "Sets frontIndex to 0, rearIndex to -1, and count to 0."],
    ["enqueue", "Moves rear with modulo, saves request, then increases count."],
    ["dequeue", "Reads front request, moves front with modulo, then decreases count."],
    ["front", "Copies the first request without removing it."],
    ["containsPoleId", "Scans waiting requests to reject a second pending fault for one Pole ID."],
    ["removeByPoleId", "Rebuilds the Queue without requests for a deleted streetlight."],
    ["display, isEmpty, isFull, size", "Show Queue content and validate its state."],
  ];
  queueFunctions.forEach((entry, index) => {
    const col = index < 4 ? 0 : 1;
    const row = index < 4 ? index : index - 4;
    const left = col === 0 ? 94 : 650;
    const top = 180 + row * 96;
    addBox(slide, left, top, 500, 68, col === 0 ? "#FFF7E6" : COLORS.pale);
    addText(slide, entry[0], left + 20, top + 12, 190, 25, 16, COLORS.amber, true);
    addText(slide, entry[1], left + 220, top + 12, 255, 38, 13.5, COLORS.ink);
  });
  addFooter(slide, 15);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Function reference");
  addTitle(slide, "ActionStack Functions", "The Stack stores the old state before the program completes a repair.");
  const stackFunctions = [
    ["Constructor", "Sets topIndex to -1, which represents an empty stack."],
    ["push", "Increases topIndex and stores one RepairAction."],
    ["pop", "Copies the top RepairAction, then decreases topIndex."],
    ["peek", "Copies the top RepairAction without changing topIndex."],
    ["display", "Prints actions from top to bottom so newest appears first."],
    ["isEmpty and isFull", "Protect pop from underflow and push from overflow."],
    ["size", "Returns topIndex plus one."],
  ];
  stackFunctions.forEach((entry, index) => {
    const col = index < 4 ? 0 : 1;
    const row = index < 4 ? index : index - 4;
    const left = col === 0 ? 94 : 650;
    const top = 180 + row * 96;
    addBox(slide, left, top, 500, 68, col === 0 ? "#FEECEC" : COLORS.pale);
    addText(slide, entry[0], left + 20, top + 12, 190, 25, 16, COLORS.red, true);
    addText(slide, entry[1], left + 220, top + 12, 255, 38, 13.5, COLORS.ink);
  });
  addFooter(slide, 16);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSafeTitle(slide, "PoleBST Functions", "Public functions support the course requirements. Private helpers perform recursive tree work.");
  const bstFunctions = [
    ["insert and insertNode", "Add a new key recursively. Duplicate key returns false."],
    ["search and searchNode", "Compare Pole ID then move left or right recursively."],
    ["remove and deleteNode", "Delete leaf, one-child, or two-child node."],
    ["findMinimum", "Find leftmost node. It becomes successor for two-child deletion."],
    ["inorder and inorderNode", "Visit left, current, then right for ascending Pole IDs."],
    ["preorder and preorderNode", "Visit current, left, then right for root-first output."],
    ["clearNode and destructor", "Delete every tree node when the program ends."],
  ];
  bstFunctions.forEach((entry, index) => {
    const col = index < 4 ? 0 : 1;
    const row = index < 4 ? index : index - 4;
    const left = col === 0 ? 94 : 650;
    const top = 180 + row * 96;
    addBox(slide, left, top, 500, 68, col === 0 ? "#E8F2FF" : COLORS.pale);
    addText(slide, entry[0], left + 20, top + 12, 190, 25, 16, COLORS.blue, true);
    addText(slide, entry[1], left + 220, top + 12, 255, 38, 13.5, COLORS.ink);
  });
  addFooter(slide, 17);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Function reference");
  addTitle(slide, "Algorithm and Input Functions", "These functions make the program safe to use and satisfy the sorting requirement.");
  const supportFunctions = [
    ["sortByPriority", "Uses Insertion Sort to move higher priorities before lower priorities."],
    ["displayPriorityReport", "Copies List data, sorts temporary array, and prints the result."],
    ["readInt", "Repeats input until cin receives a valid integer."],
    ["readIntInRange", "Uses readInt then checks a minimum and maximum value."],
    ["readText", "Repeats input when the user enters an empty line."],
    ["readYesNo", "Accepts y or n and repeats any other answer."],
  ];
  supportFunctions.forEach((entry, index) => {
    const top = 180 + index * 72;
    addBox(slide, 112, top, 1050, 52, index % 2 === 0 ? COLORS.pale : "#FFFFFF");
    addText(slide, entry[0], 140, top + 14, 270, 22, 16, COLORS.teal, true);
    addText(slide, entry[1], 440, top + 14, 680, 22, 15, COLORS.ink);
  });
  addFooter(slide, 18);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSafeTitle(slide, "StreetlightRepairDesk Functions", "This class coordinates the structures through menu operations.");
  const appFunctions = [
    ["run and displayMenu", "Repeat the menu, read choice, and call correct function."],
    ["addStreetlight", "Validate unique key, add to List, then add to BST."],
    ["reportFault", "Validate Pole ID, enqueue request, update light state."],
    ["processNextRepair", "Read Queue front, push old state, dequeue, mark working."],
    ["undoLastRepair", "Pop latest action and restore old condition and working state."],
    ["updateStreetlight", "Change fields except Pole ID because it is the BST key."],
    ["deleteStreetlight", "Remove related Queue requests then BST node then List node."],
    ["search and preview functions", "Display BST search result, Queue front, or Stack top."],
  ];
  appFunctions.forEach((entry, index) => {
    const col = index < 4 ? 0 : 1;
    const row = index < 4 ? index : index - 4;
    const left = col === 0 ? 94 : 650;
    const top = 180 + row * 96;
    addBox(slide, left, top, 500, 68, col === 0 ? "#E8F2FF" : "#E6FFFA");
    addText(slide, entry[0], left + 20, top + 12, 195, 25, 15.5, COLORS.blue, true);
    addText(slide, entry[1], left + 220, top + 12, 255, 38, 13.5, COLORS.ink);
  });
  addFooter(slide, 19);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Discussion guide");
  addTitle(slide, "Important Design Decisions", "These choices should be explained honestly in the live discussion.");
  const decisions = [
    ["One record owner", "Linked List owns Streetlight data. BST points to it, so update changes one record only."],
    ["Stable Pole ID", "Update does not change Pole ID because it is the BST key."],
    ["Circular Queue", "Modulo arithmetic reuses freed positions in the fixed array."],
    ["Sort a copy", "Sorting does not disturb List insertion order or BST key order."],
    ["Undo limitation", "Undo restores the old light state but does not return request to the Queue."],
  ];
  decisions.forEach((entry, index) => {
    const top = 183 + index * 78;
    addBox(slide, 102, top, 1060, 58, index === 4 ? "#FFF7E6" : COLORS.pale);
    addText(slide, entry[0], 130, top + 17, 240, 22, 17, COLORS.ink, true);
    addText(slide, entry[1], 390, top + 17, 720, 24, 15, COLORS.muted);
  });
  addFooter(slide, 20);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Complexity");
  addTitle(slide, "Big O Analysis", "The project discusses the cost of each major operation.");
  const complexity = [
    ["Stack push pop peek", "O(1)", "One top index"],
    ["Queue enqueue dequeue front", "O(1)", "Circular indexes"],
    ["Linked List search remove", "O(n)", "Visits nodes one by one"],
    ["BST search insert delete", "O(h)", "Average O(log n), worst O(n)"],
    ["Insertion Sort", "O(n^2)", "Moves records within a temporary array"],
  ];
  addBox(slide, 94, 174, 1092, 51, COLORS.night);
  addText(slide, "Operation", 120, 188, 390, 20, 17, COLORS.white, true);
  addText(slide, "Cost", 570, 188, 140, 20, 17, COLORS.white, true);
  addText(slide, "Reason", 760, 188, 360, 20, 17, COLORS.white, true);
  complexity.forEach((entry, index) => {
    const top = 225 + index * 67;
    addBox(slide, 94, top, 1092, 67, index % 2 === 0 ? COLORS.pale : COLORS.white);
    addText(slide, entry[0], 120, top + 21, 395, 20, 17, COLORS.ink);
    addText(slide, entry[1], 570, top + 21, 140, 20, 17, COLORS.blue, true);
    addText(slide, entry[2], 760, top + 21, 360, 20, 16, COLORS.muted);
  });
  addFooter(slide, 21);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Testing and demonstration");
  addTitle(slide, "Manual Test Plan", "Run the test cases in Visual Studio and use genuine console screenshots in the final report.");
  const tests = [
    ["Normal flow", "Add, search, report, process, and display the record"],
    ["Empty structures", "Attempt Queue and Stack operations before any data exists"],
    ["Boundary cases", "First and last List node, root-only BST, full arrays"],
    ["Invalid input", "Letters for numeric input, duplicate and missing IDs"],
    ["Integration", "Track one Pole ID through all structures"],
  ];
  tests.forEach((entry, index) => {
    const top = 185 + index * 78;
    addBox(slide, 108, top, 1020, 60, index === 4 ? "#E6FFFA" : COLORS.pale);
    addText(slide, entry[0], 136, top + 17, 255, 22, 18, COLORS.ink, true);
    addText(slide, entry[1], 405, top + 17, 680, 25, 17, COLORS.muted);
  });
  addText(slide, "Suggested demo: Pole IDs 30, 10, and 20. Report faults for 30 then 10 to demonstrate FIFO. Process 30, then Undo to demonstrate LIFO.", 110, 605, 1015, 42, 18, COLORS.blue, true, "center");
  addFooter(slide, 22);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.white;
  addSectionLabel(slide, "Team contribution record");
  addTitle(slide, "Team Responsibilities", "Replace placeholders with the actual work completed by each team member before submitting.");
  addBox(slide, 88, 178, 1105, 55, COLORS.night);
  addText(slide, "Member", 112, 194, 250, 20, 16, COLORS.white, true);
  addText(slide, "University ID", 382, 194, 180, 20, 16, COLORS.white, true);
  addText(slide, "Actual contribution", 590, 194, 540, 20, 16, COLORS.white, true);
  for (let i = 0; i < 6; i++) {
    const top = 233 + i * 59;
    addBox(slide, 88, top, 1105, 59, i % 2 === 0 ? COLORS.pale : COLORS.white);
    addText(slide, `[Member ${i + 1} Name]`, 112, top + 18, 250, 20, 15, COLORS.ink);
    addText(slide, "[ID]", 382, top + 18, 180, 20, 15, COLORS.ink);
    addText(slide, "[Describe verified work]", 590, top + 18, 540, 20, 15, COLORS.muted);
  }
  addFooter(slide, 23);

  slide = presentation.slides.add();
  slide.background.fill = COLORS.night;
  addText(slide, "Streetlight Repair Desk", 80, 90, 760, 58, 42, COLORS.white, true);
  addText(slide, "Final Demonstration", 82, 162, 360, 33, 24, "#FCD34D", true);
  addList(slide, ["Demonstrate Linked List insertion, deletion, and traversal", "Demonstrate BST search, inorder traversal, and preorder traversal", "Demonstrate Queue enqueue, front, and dequeue", "Demonstrate Stack push, peek, pop, and Undo", "Explain Insertion Sort and the Big O table"], 88, 260, 770, 20, "#D6E4F0", 53);
  addBox(slide, 904, 220, 185, 185, "#123B5D", "rounded-2xl");
  addText(slide, "Q and A", 922, 277, 148, 45, 30, COLORS.white, true, "center");
  addText(slide, "Be ready to explain every structure and every edge case.", 84, 610, 860, 28, 18, "#BFDBFE", true);

  return presentation;
}

async function main() {
  await fs.mkdir(buildDir, { recursive: true });
  await fs.mkdir(stagingDir, { recursive: true });
  await fs.mkdir(path.dirname(finalPath), { recursive: true });

  const presentation = buildDeck();
  for (const [index, currentSlide] of presentation.slides.items.entries()) {
    const png = await presentation.export({ slide: currentSlide, format: "png", scale: 1 });
    await writeBlob(path.join(buildDir, `slide-${String(index + 1).padStart(2, "0")}.png`), png);
  }

  const candidatePath = path.join(stagingDir, "candidate.pptx");
  const draft = await PresentationFile.exportPptx(presentation);
  await draft.save(candidatePath);

  const { finalizePresentation } = await import(pathToFileURL(path.join(skillDir, "container_tools", "artifact_tool_utils.mjs")).href);
  const result = await finalizePresentation({
    workspaceDir,
    candidatePath,
    finalPath,
    pythonExecutable: runtimePython,
    integrityValidatorPath: path.join(skillDir, "container_tools", "inspect_presentation_package_integrity.py"),
    layoutValidatorPath: path.join(skillDir, "container_tools", "inspect_presentation_layout_geometry.py"),
    layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-bullet-geometry", "--validate-heading-fit"],
    requiredNativeTableOwnerSlides: [],
    fontPolicy: { basis: "design", families: ["Arial"] },
    verifyArtifactToolImport: true,
    receiptPath: path.join(stagingDir, "validation-reviewed.json"),
  });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
