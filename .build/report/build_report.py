from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor
from pathlib import Path


WORKSPACE = Path.cwd()
OUTPUT = WORKSPACE / "StreetlightRepairDesk" / "Report" / "Streetlight_Repair_Desk_Report.docx"

NAVY = "0B1F33"
BLUE = "1D4ED8"
TEAL = "0F766E"
PALE_BLUE = "E8F2FF"
PALE_TEAL = "E6FFFA"
PALE_GRAY = "F3F7FA"
WHITE = "FFFFFF"
GRAY = "52616B"


def set_cell_fill(cell, color):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), color)


def set_cell_border(cell, color="D9D9D9"):
    tc_pr = cell._tc.get_or_add_tcPr()
    borders = tc_pr.first_child_found_in("w:tcBorders")
    if borders is None:
        borders = OxmlElement("w:tcBorders")
        tc_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = "w:" + edge
        element = borders.find(qn(tag))
        if element is None:
            element = OxmlElement(tag)
            borders.append(element)
        element.set(qn("w:val"), "single")
        element.set(qn("w:sz"), "6")
        element.set(qn("w:color"), color)


def set_cell_margins(cell, top=90, start=110, bottom=90, end=110):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for margin_name, margin_value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn("w:" + margin_name))
        if node is None:
            node = OxmlElement("w:" + margin_name)
            tc_mar.append(node)
        node.set(qn("w:w"), str(margin_value))
        node.set(qn("w:type"), "dxa")


def set_font(run, size=11, bold=False, color="000000", name="Arial"):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:ascii"), name)
    run._element.rPr.rFonts.set(qn("w:hAnsi"), name)
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = RGBColor.from_string(color)


def add_text(paragraph, text, size=11, bold=False, color="000000"):
    run = paragraph.add_run(text)
    set_font(run, size, bold, color)
    return run


def set_paragraph(paragraph, before=0, after=7, line=1.08):
    paragraph.paragraph_format.space_before = Pt(before)
    paragraph.paragraph_format.space_after = Pt(after)
    paragraph.paragraph_format.line_spacing = line


def add_heading(doc, text, level=1):
    paragraph = doc.add_paragraph(style=f"Heading {level}")
    paragraph.paragraph_format.keep_with_next = True
    set_paragraph(paragraph, before=15 if level == 1 else 10, after=6, line=1.0)
    run = paragraph.add_run(text)
    set_font(run, 16 if level == 1 else 13, True, NAVY)
    return paragraph


def add_body(doc, text):
    paragraph = doc.add_paragraph()
    set_paragraph(paragraph, after=7)
    add_text(paragraph, text, 11, False, "000000")
    return paragraph


def add_bullet(doc, text):
    paragraph = doc.add_paragraph(style="List Bullet")
    set_paragraph(paragraph, after=3)
    add_text(paragraph, text, 11, False, "000000")
    return paragraph


def add_table(doc, headers, rows, widths=None):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    table.autofit = False
    header_cells = table.rows[0].cells
    for index, header in enumerate(headers):
        cell = header_cells[index]
        if widths:
            cell.width = Inches(widths[index])
        set_cell_fill(cell, NAVY)
        set_cell_border(cell)
        set_cell_margins(cell)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_paragraph(p, after=0, line=1.0)
        add_text(p, header, 9.5, True, WHITE)
    for row_index, row in enumerate(rows):
        cells = table.add_row().cells
        for index, value in enumerate(row):
            cell = cells[index]
            if widths:
                cell.width = Inches(widths[index])
            set_cell_fill(cell, PALE_GRAY if row_index % 2 == 0 else WHITE)
            set_cell_border(cell)
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            p = cell.paragraphs[0]
            set_paragraph(p, after=0, line=1.0)
            add_text(p, value, 9.5, False, "000000")
    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    return table


def add_code_block(doc, code, caption):
    table = doc.add_table(rows=1, cols=1)
    table.autofit = False
    cell = table.cell(0, 0)
    set_cell_fill(cell, "F6F8FA")
    set_cell_border(cell, "CBD5E1")
    set_cell_margins(cell, top=110, start=150, bottom=110, end=150)
    p = cell.paragraphs[0]
    set_paragraph(p, after=0, line=1.0)
    run = p.add_run(code)
    set_font(run, 8.5, False, "1F2937", "Consolas")
    caption_p = doc.add_paragraph()
    caption_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_paragraph(caption_p, before=3, after=10, line=1.0)
    add_text(caption_p, caption, 9, False, GRAY)


def add_page_break(doc):
    doc.add_page_break()


def configure_styles(doc):
    normal = doc.styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    normal.font.size = Pt(11)
    for name in ("Title", "Heading 1", "Heading 2", "List Bullet"):
        style = doc.styles[name]
        style.font.name = "Arial"
        style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")


def make_document():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = Document()
    configure_styles(doc)
    section = doc.sections[0]
    section.top_margin = Inches(0.7)
    section.bottom_margin = Inches(0.65)
    section.left_margin = Inches(0.75)
    section.right_margin = Inches(0.75)

    title = doc.add_paragraph(style="Title")
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title.paragraph_format.space_before = Pt(90)
    title.paragraph_format.space_after = Pt(16)
    add_text(title, "Streetlight Repair Desk", 27, True, "000000")
    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_paragraph(subtitle, after=22)
    add_text(subtitle, "CS212 Data Structures Course Project", 16, True, NAVY)
    add_text(subtitle, "\nProject Idea 77", 13, False, BLUE)
    cover = add_table(doc, ["Project Information", "Details"], [
        ["University", "Misr University for Science and Technology"],
        ["College", "College of Information Technology"],
        ["Course", "CS212 Data Structures"],
        ["Practical Section", "[Add registered section]"],
        ["Team Members", "[Add five or six names and university IDs]"],
    ], [2.0, 4.8])
    for row in cover.rows:
        set_cell_fill(row.cells[0], PALE_BLUE)
        for run in row.cells[0].paragraphs[0].runs:
            set_font(run, 9.5, True, NAVY)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_paragraph(p, before=28, after=0)
    add_text(p, "Fall 2026 to 2027", 12, False, GRAY)

    add_page_break(doc)
    add_heading(doc, "1 Problem Definition")
    add_body(doc, "Streetlight Repair Desk is a menu driven C++ console application for a city or campus maintenance office. It stores streetlight records, accepts reports about broken lights, manages waiting repair requests, records completed repair actions, and gives staff a direct search by unique Pole ID.")
    add_body(doc, "The system includes streetlight registration, update, deletion, search, display, fault reporting, repair processing, undo of the latest repair, structure status display, tree traversals, and a priority report. It does not include persistent files, user accounts, geographic maps, or automatic technician assignment.")

    add_heading(doc, "2 Project Objectives")
    for item in [
        "Manually implement Stack, Queue, Linked List, and Binary Search Tree in C++.",
        "Connect all structures through one realistic repair workflow.",
        "Validate invalid input, duplicate IDs, missing IDs, empty structures, and full fixed arrays.",
        "Implement Insertion Sort and explain its role and time complexity.",
        "Provide enough output and documentation for a live individual discussion.",
    ]:
        add_bullet(doc, item)

    add_heading(doc, "3 Data Structures Used")
    add_table(doc, ["Structure", "Actual Role", "Reason for Choice"], [
        ["Stack", "Stores completed repair actions. The top action can be undone.", "Undo must restore the newest completed repair first, which follows LIFO."],
        ["Queue", "Stores fault reports waiting for technicians.", "Reports are processed in arrival order, which follows FIFO."],
        ["Linked List", "Stores the actual Streetlight records.", "Records can be inserted and removed through dynamically allocated nodes."],
        ["BST", "Indexes streetlights by unique Pole ID.", "The key supports ordered search and required tree traversals."],
        ["Insertion Sort", "Sorts a temporary copy of records by priority.", "It satisfies the algorithm requirement without changing list or BST order."],
    ], [1.15, 2.85, 2.8])

    add_heading(doc, "4 System Features")
    add_body(doc, "The main menu contains sixteen operations plus Exit. It adds and manages streetlights, reports faults, processes the next request, undoes the latest completed repair, performs BST search and traversal, displays the Queue and Stack, produces the sorting report, and shows the current size and empty state of the structures.")
    add_table(doc, ["Workflow Step", "Structures Involved", "Result"], [
        ["Add streetlight", "Linked List then BST", "One record exists in the list and is indexed by Pole ID."],
        ["Report fault", "BST then Queue", "The light changes to Awaiting repair and a request enters the Queue."],
        ["Process repair", "Queue then Stack", "The first request leaves the Queue and its old state enters the Stack."],
        ["Undo repair", "Stack then Linked List record", "The latest action restores old condition and working state."],
        ["Delete streetlight", "Queue then BST then Linked List", "Pending requests and all record references are removed safely."],
    ], [1.3, 2.2, 3.3])

    add_page_break(doc)
    add_heading(doc, "5 Implementation Explanation")
    add_heading(doc, "5.1 Shared Data Model", 2)
    add_body(doc, "Streetlight holds the record fields: Pole ID, location, zone, condition, working state, and priority. RepairRequest stores the data needed while an item waits in the Queue. RepairAction stores the previous streetlight state before a repair so Undo can restore it.")
    add_code_block(doc, "struct Streetlight {\n    int poleId;\n    string location;\n    string zone;\n    string condition;\n    bool isWorking;\n    int priority;\n};", "Code excerpt 1: The record stored in the Linked List and accessed through the BST")

    add_heading(doc, "5.2 Linked List", 2)
    add_body(doc, "StreetlightList owns the Streetlight records. Every StreetlightNode contains a Streetlight object and a next pointer. The insert function appends a node, remove deletes a matching node, search returns a pointer to its record, and traverse prints all records.")
    add_code_block(doc, "struct StreetlightNode {\n    Streetlight data;\n    StreetlightNode* next;\n};", "Code excerpt 2: Singly linked node used by StreetlightList")

    add_heading(doc, "5.3 Binary Search Tree", 2)
    add_body(doc, "PoleBST stores a unique Pole ID key and a pointer to the Streetlight record inside the Linked List. It avoids duplicate copies of records. The insert operation rejects duplicate keys. Deletion handles leaf nodes, nodes with one child, and nodes with two children by replacing the node with its inorder successor.")
    add_code_block(doc, "if (key < current->key) {\n    current->left = insertNode(current->left, key, light, inserted);\n}\nelse if (key > current->key) {\n    current->right = insertNode(current->right, key, light, inserted);\n}\nelse {\n    inserted = false;\n}", "Code excerpt 3: BST insertion and duplicate-key handling")

    add_heading(doc, "5.4 Queue and Stack", 2)
    add_body(doc, "RepairQueue uses a circular array with frontIndex, rearIndex, and count. Modulo arithmetic allows the rear to return to the start of the array after a dequeue. ActionStack uses an array and topIndex. Process repair pushes the former state, and Undo pops the latest state.")
    add_code_block(doc, "rearIndex = (rearIndex + 1) % MAX_QUEUE;\nqueue[rearIndex] = request;\ncount++;", "Code excerpt 4: Circular Queue enqueue operation")

    add_heading(doc, "5.5 Sorting Algorithm", 2)
    add_body(doc, "The program copies Linked List records into a temporary array, then applies Insertion Sort from high priority to low priority. Copying is necessary because the linked list must preserve insertion order and the BST must preserve Pole ID order.")
    add_code_block(doc, "while (j >= 0 && lights[j].priority < current.priority) {\n    lights[j + 1] = lights[j];\n    j--;\n}\nlights[j + 1] = current;", "Code excerpt 5: Core insertion step of the priority sort")

    add_page_break(doc)
    add_heading(doc, "6 Validation and Error Handling")
    add_table(doc, ["Case", "Program Behavior"], [
        ["Invalid numeric input", "readInt clears cin, ignores invalid input, and asks again."],
        ["Duplicate Pole ID", "The BST search detects the key and prevents insertion."],
        ["Missing Pole ID", "Search, update, delete, and report operations show a safe message."],
        ["Empty Queue", "Processing or previewing reports displays an empty message."],
        ["Empty Stack", "Undo and peek display an empty message."],
        ["Full Queue or Stack", "The program blocks the operation before writing beyond the fixed array."],
        ["Delete with pending request", "The program removes pending Queue requests before deleting the BST and List record."],
    ], [2.1, 4.7])

    add_heading(doc, "7 Testing")
    add_body(doc, "The following manual tests must be run in Visual Studio. The final submission should contain genuine console screenshots for the normal workflow, an empty structure message, invalid input recovery, BST traversal, priority report, and the integrated workflow.")
    add_table(doc, ["Test", "Input or Scenario", "Expected Result", "Actual Result"], [
        ["T1", "Add Pole ID 101 with valid details", "Record appears in List and BST", "To be completed after execution"],
        ["T2", "Add Pole ID 101 again", "Duplicate ID is rejected", "To be completed after execution"],
        ["T3", "Process repair before a report exists", "Queue empty message", "To be completed after execution"],
        ["T4", "Report 101 then 102 and process twice", "101 processes before 102", "To be completed after execution"],
        ["T5", "Process a repair then Undo", "Old condition and state are restored", "To be completed after execution"],
        ["T6", "Sort priorities 1, 5, 3", "Report prints 5, 3, 1", "To be completed after execution"],
        ["T7", "Enter letters for menu choice", "Program asks again", "To be completed after execution"],
    ], [0.45, 2.15, 2.15, 2.05])
    add_body(doc, "Screenshot placeholders: Insert genuine images after running Tests T1 to T7. Label each image with its test number and describe the visible result below it.")

    add_heading(doc, "8 Complexity Analysis")
    add_table(doc, ["Operation", "Time Complexity", "Explanation"], [
        ["Stack push, pop, peek", "O(1)", "Each operation uses the top array index."],
        ["Queue enqueue, dequeue, front", "O(1)", "Each operation uses front or rear circular indexes."],
        ["Linked List search and remove", "O(n)", "The program may traverse every node."],
        ["BST search, insert, delete", "O(h)", "h is tree height. Average O(log n), worst O(n)."],
        ["Insertion Sort", "O(n^2)", "Each item may move through the temporary array."],
    ], [2.55, 1.3, 3.0])

    add_page_break(doc)
    add_heading(doc, "9 Team Contributions")
    add_body(doc, "Complete this table with actual contributions only. Every listed student must be in the same registered practical section.")
    add_table(doc, ["Member", "University ID", "Assigned Role", "Evidence"], [
        ["[Member 1]", "[ID]", "[Actual task]", "[Code file, test, or report section]"],
        ["[Member 2]", "[ID]", "[Actual task]", "[Code file, test, or report section]"],
        ["[Member 3]", "[ID]", "[Actual task]", "[Code file, test, or report section]"],
        ["[Member 4]", "[ID]", "[Actual task]", "[Code file, test, or report section]"],
        ["[Member 5]", "[ID]", "[Actual task]", "[Code file, test, or report section]"],
        ["[Member 6 if applicable]", "[ID]", "[Actual task]", "[Code file, test, or report section]"],
    ], [1.45, 1.2, 1.8, 2.4])

    add_heading(doc, "10 Conclusion")
    add_body(doc, "Streetlight Repair Desk satisfies the project design by integrating a Stack, Queue, Linked List, BST, and Insertion Sort in one C++ console application. The program keeps a single copy of each streetlight record in the Linked List and lets the BST point to it by unique Pole ID. This design keeps updates consistent while allowing each data structure to perform a meaningful role.")
    add_body(doc, "The current program has three realistic limitations. It keeps data only while the program is running, the BST does not self-balance, and Undo restores the former light state without returning the original request to the Queue. Future work could add file storage, an AVL tree, and a more complete undo transaction.")

    add_heading(doc, "Final Submission Checklist")
    for item in [
        "Fill all team names, IDs, and practical section fields.",
        "Build and run the project in Visual Studio.",
        "Complete actual result cells and add genuine console screenshots.",
        "Place code, report, presentation, screenshots, and tests in one shared repository or OneDrive folder.",
        "Check the shared link from another account or incognito window.",
        "Each member submits an individual text file with the same shared link on eLearning.",
    ]:
        add_bullet(doc, item)

    doc.save(OUTPUT)


if __name__ == "__main__":
    make_document()
