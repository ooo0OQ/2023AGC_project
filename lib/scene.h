#pragma once

#include <vector>

#include "material.h"
#include "point_light.h"
#include "scene_settings.h"
#include "sphere.h"
#include "triangle.h"
#include "newclass.h"
class Scene {
 public:
  void AddTriangle(const Triangle &triangle, const Material &material);
  void AddSphere(const Sphere &sphere, const Material &material);
  void AddPointLight(const PointLight &point_light);
  void AddNewclass(const Newclass &new_class);
  void SetSceneSettings(const SceneSettings &scene_settings);
  [[nodiscard]] void GetTriangleBuffer(std::vector<Newclass>& A, int &b);
  [[nodiscard]] void GetTriangleMaterialBuffer(std::vector<Newclass>& A, int &b) ;
  [[nodiscard]] void GetSphereBuffer(std::vector<Newclass>& A, int &b);
  [[nodiscard]] void GetSphereMaterialBuffer(std::vector<Newclass>& A, int &b);
  [[nodiscard]] void GetPointLightBuffer(std::vector<Newclass>& A, int &b);
  [[nodiscard]] void GenerateData(std::vector<Newclass>& A, int &b);
  [[nodiscard]] std::vector<Newclass> &Scene::GenerateData();
  [[nodiscard]] const SceneSettings &Scene::GetSceneSettings() const;
  SceneSettings scene_settings_{};
  std::vector<Triangle> triangles_;
  std::vector<Material> triangle_materials_;
  std::vector<Sphere> spheres_;
  std::vector<Material> sphere_materials_;
  std::vector<PointLight> point_lights_;
  std::vector<Newclass> new_class_;
};
