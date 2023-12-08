#pragma once

#include "glm/glm.hpp"
#include "newclass.h"
#include<vector>
struct PointLight {
  PointLight(const glm::vec3 &position_, float power_);
  PointLight(const glm::vec3 &position_, const glm::vec3 &power_);
  void ANC(std::vector<Newclass>& A, int &B);
  glm::vec3 position;
  glm::vec3 power;
};
