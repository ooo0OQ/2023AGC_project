#include "scene.h"
#include<iostream>
using namespace std;
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

void Scene::GetTriangleBuffer(vector<Newclass>& A, int &b)  {
  int L=triangles_.size();
  ANCC(A,b,L);
  for(int i=0;i<L;i++)triangles_[i].ANC(A,b);
}

void Scene::GetTriangleMaterialBuffer(vector<Newclass>& A, int &b)  {
  int L=triangle_materials_.size();
  ANCC(A,b,L);
  for(int i=0;i<L;i++)triangle_materials_[i].ANC(A,b);
}

void Scene::GetSphereBuffer(vector<Newclass>& A, int &b)  {
  int L=spheres_.size();
  ANCC(A,b,L);
  for(int i=0;i<L;i++)spheres_[i].ANC(A,b);
}

void Scene::GetSphereMaterialBuffer(vector<Newclass>& A, int &b)  {
  int L=sphere_materials_.size();
  ANCC(A,b,L);
  for(int i=0;i<L;i++)sphere_materials_[i].ANC(A,b);
}

void Scene::GetPointLightBuffer(vector<Newclass>& A, int &b)  {
  int L=point_lights_.size();
  ANCC(A,b,L);
  for(int i=0;i<L;i++)point_lights_[i].ANC(A,b);
}

std::vector<Newclass> &Scene::GenerateData() {
  new_class_.clear();
  int current=0;
  GetTriangleBuffer(new_class_,current);
  GetTriangleMaterialBuffer(new_class_,current);
  GetSphereBuffer(new_class_,current);
  GetSphereMaterialBuffer(new_class_,current);
  GetPointLightBuffer(new_class_,current);
  /*
  cerr<<current<<"!!"<<endl;
  for(int i=0;i<27;i++)cerr<<new_class_[i].A<<" "<<new_class_[i].B<<" "<<new_class_[i].C<<" "<<new_class_[i].D<<"    ";
  cerr<<endl;
  */
  return new_class_;
}

const SceneSettings &Scene::GetSceneSettings() const {
  return scene_settings_;
}
