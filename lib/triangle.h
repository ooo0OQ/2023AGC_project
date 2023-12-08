#pragma once
#include "glm/glm.hpp"
#include "newclass.h"
#include<vector>
struct Triangle {
  Triangle(glm::vec3 v0_, glm::vec3 v1_, glm::vec3 v2_);
  void ANC(std::vector<Newclass>& A, int &B);
  glm::vec3 v0;
  glm::vec3 v1;
  glm::vec3 v2;
};
