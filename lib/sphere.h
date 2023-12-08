#pragma once
#include "glm/glm.hpp"
#include "newclass.h"
#include<vector>
struct Sphere {
  explicit Sphere(const glm::vec4 &origin_radius_);
  Sphere(const glm::vec3 &origin, float radius);
  void ANC(std::vector<Newclass>& A, int &B);
  glm::vec4 origin_radius;
};
