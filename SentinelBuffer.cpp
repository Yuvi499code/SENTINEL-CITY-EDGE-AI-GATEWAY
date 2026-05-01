#include "SentinelBuffer.h"
#include <iostream>

// Constructor Implementation
SentinelBuffer::SentinelBuffer(int size) {
    max_size = size;
    buffer.resize(max_size, 0);
    head = 0;
    tail = 0;
    current_count = 0;
}

void SentinelBuffer::addData(int val) {
    buffer[head] = val;
    head = (head + 1) % max_size;
    
    if (current_count < max_size) {
        current_count++;
    } else {
        tail = (tail + 1) % max_size; // Overwrite logic
    }
}

int SentinelBuffer::readData() {
    if (current_count == 0) {
        return -1; 
    }
    int val = buffer[tail];
    tail = (tail + 1) % max_size;
    current_count--;
    return val;
}

void SentinelBuffer::printStatus() {
    std::cout << "Items: " << current_count << " | Write Head: " << head << " | Read Tail: " << tail << std::endl;
}

