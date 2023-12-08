#pragma once
#include "glm/glm.hpp"
#include "newclass.h"
#include<vector>
enum MaterialType : uint32_t { kLambertian = 0, kSpecular };

struct Material {
  glm::vec3 albedo_color;
  MaterialType material_type;
  void ANC(std::vector<Newclass>& A, int &B);
};
