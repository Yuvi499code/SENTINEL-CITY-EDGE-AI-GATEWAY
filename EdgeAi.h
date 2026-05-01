#ifndef EDGE_AI_H
#define EDGE_AI_H

#include <vector>
#include <iostream>

class EdgeAI {
public:
    EdgeAI() {
        std::cout << "[MLOps] Initializing Predictive AI Model..." << std::endl;
        std::cout << "[MLOps] AI Engine Ready. Awaiting Tensors." << std::endl;
    }

    // The SDE Bridge: Takes your buffer data and feeds it to the AI
    float runInference(const std::vector<int>& sensorData) {
        // Step 1: In the real version, we flatten data into an Input Tensor here
        
        // Step 2: In the real version, the TFLite Interpreter runs here
        
        // Step 3: Mock AI Logic (For today's software completion)
        // If the last few temperatures are rising aggressively, predict a failure
        int recentSum = 0;
        for (int temp : sensorData) {
            recentSum += temp;
        }
        float average = (float)recentSum / sensorData.size();

        // Return a "Confidence Score" between 0.0 (Safe) and 1.0 (Critical Failure)
        if (average > 85.0) return 0.95f; 
        if (average > 75.0) return 0.60f;
        return 0.10f; 
    }
};

#endif