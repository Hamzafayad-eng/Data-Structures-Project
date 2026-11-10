#include "StreetlightSorter.h"
#include "../LinkedList/StreetlightList.h"
#include <iostream>
using namespace std;

void sortByPriority(Streetlight lights[], int size) {
    for (int i = 1; i < size; i++) {
        Streetlight key = lights[i];
        int j = i - 1;

        while (j >= 0 && (lights[j].priority < key.priority ||
               (lights[j].priority == key.priority && lights[j].poleId > key.poleId))) {
            lights[j + 1] = lights[j];
            j--;
        }

        lights[j + 1] = key;
    }
}

void displayPriorityReport() {
    Streetlight lights[MAX_STREETLIGHTS];
    int size = copyListToArray(lights, MAX_STREETLIGHTS);

    if (size == 0) {
        cout << "No streetlights are registered.\n";
        return;
    }

    sortByPriority(lights, size);

    cout << "\nStreetlights sorted by priority (high to low):\n";
    for (int i = 0; i < size; i++) {
        cout << i + 1 << ". Pole ID: " << lights[i].poleId
             << " | Priority: " << lights[i].priority
             << " | Location: " << lights[i].location
             << " | Condition: " << lights[i].condition << "\n";
    }
}
