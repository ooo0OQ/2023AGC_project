#pragma once

#include "glm/glm.hpp"
#include<vector>

struct Newclass {
  Newclass(int a,int b,int c,int d);
  int A;
  int B;
  int C;
  int D;
};

void ANCC(std::vector<Newclass>& A, int &B, int C);