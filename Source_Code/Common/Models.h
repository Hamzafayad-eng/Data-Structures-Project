#ifndef MODELS_H
#define MODELS_H

#include <string>
using namespace std;

const int MAX_QUEUE = 100;
const int MAX_STACK = 100;
const int MAX_STREETLIGHTS = 100;

struct Streetlight {
    int poleId;
    string location;
    string zone;
    string condition;
    bool isWorking;
    int priority;
};

struct RepairRequest {
    int poleId;
    string reportedBy;
    string faultDescription;
    int priority;
};

struct RepairAction {
    int poleId;
    string oldCondition;
    bool oldWorkingState;
    string technician;
};

#endif
