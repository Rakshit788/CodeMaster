#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>&, int);

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);

    if (result == vector<int>{0, 1}) {
        cout << "PASS\n";
        return 0;
    } else {
        cout << "FAIL\n";
        return 1;
    }
}
