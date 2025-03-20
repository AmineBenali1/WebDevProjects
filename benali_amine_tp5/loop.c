#include <stdio.h>

int main() {
    int i = 0;          // x5
    int result = 0;     // x6
    int MemArray[100];  // Array to store values

    // Initialize array with some values (for demonstration)
    for (int j = 0; j < 100; j++) {
        MemArray[j] = j;
    }

    // The translated loop
    for (result = 0; result < 100; result++) {  // x6 and x29
        i += MemArray[result * 2];      // Load and add value (8 bytes forward)
    }

    printf("Final sum: %d\n", i);
    return 0;
} 