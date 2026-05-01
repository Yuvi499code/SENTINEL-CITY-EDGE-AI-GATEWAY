#ifndef SENTINEL_BUFFER_H
#define SENTINEL_BUFFER_H

#include <vector>

class SentinelBuffer {
private:
    std::vector<int> buffer;
    int head;
    int tail;
    int max_size;
    int current_count;

public:
    // Constructor
    SentinelBuffer(int size);

    // Methods
    void addData(int val);
    int readData();
    void printStatus();
};

#endif