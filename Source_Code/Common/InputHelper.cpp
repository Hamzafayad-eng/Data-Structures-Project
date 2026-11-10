#include "InputHelper.h"

using namespace std;

int readInt(const string& message) {
    int value;

    while (true) {
        cout << message;
        cin >> value;

        if (!cin.fail()) {
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            return value;
        }

        cout << "Invalid input. Please enter a whole number.\n";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }
}

int readIntInRange(const string& message, int minimum, int maximum) {
    int value;

    do {
        value = readInt(message);
        if (value < minimum || value > maximum) {
            cout << "Please enter a value from " << minimum << " to " << maximum << ".\n";
        }
    } while (value < minimum || value > maximum);

    return value;
}

string readText(const string& message) {
    string text;

    do {
        cout << message;
        getline(cin, text);
        if (text.empty()) {
            cout << "This field cannot be empty.\n";
        }
    } while (text.empty());

    return text;
}

bool readYesNo(const string& message) {
    char answer;

    while (true) {
        cout << message << " (y/n): ";
        cin >> answer;
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        if (answer == 'y' || answer == 'Y') {
            return true;
        }
        if (answer == 'n' || answer == 'N') {
            return false;
        }

        cout << "Please enter y or n.\n";
    }
}
