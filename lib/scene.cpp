#include "scene.h"

void Scene::AddTriangle(const Triangle &triangle, const Material &material) {
  triangles_.push_back(triangle);
  triangle_materials_.push_back(material);
}

void Scene::AddSphere(const Sphere &sphere, const Material &material) {
  spheres_.push_back(sphere);
  sphere_materials_.push_back(material);
}

void Scene::AddPointLight(const PointLight &point_light) {
  point_lights_.push_back(point_light);
}

void Scene::AddNewclass(const Newclass &new_class){
  new_class_.push_back(new_class);
}
void Scene::SetSceneSettings(const SceneSettings &scene_settings) {
  scene_settings_ = scene_settings;
}

const std::vector<Triangle> &Scene::GetTriangleBuffer() const {
  return triangles_;
}

const std::vector<Material> &Scene::GetTriangleMaterialBuffer() const {
  return triangle_materials_;
}

const std::vector<Sphere> &Scene::GetSphereBuffer() const {
  return spheres_;
}

const std::vector<Material> &Scene::GetSphereMaterialBuffer() const {
  return sphere_materials_;
}

const std::vector<PointLight> &Scene::GetPointLightBuffer() const {
  return point_lights_;
}

const std::vector<Newclass> &Scene::GetNewclassBuffer() const {
  return new_class_;
}

const SceneSettings &Scene::GetSceneSettings() const {
  return scene_settings_;
}
