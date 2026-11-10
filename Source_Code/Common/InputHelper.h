#ifndef INPUT_HELPER_H
#define INPUT_HELPER_H

#include <iostream>
#include <string>
#include <limits>
using namespace std;

int readInt(const string& message);
int readIntInRange(const string& message, int minimum, int maximum);
string readText(const string& message);
bool readYesNo(const string& message);

#endif
