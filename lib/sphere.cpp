#include"sphere.h"
#include<vector>
#include "newclass.h"
using namespace std;
Sphere::Sphere(const glm::vec4 &origin_radius_)
      : origin_radius(origin_radius_) {
  }
Sphere::Sphere(const glm::vec3 &origin, float radius)
      : origin_radius({origin, radius}) {
}

void Sphere::ANC(vector<Newclass>& A, int &B){
    int x=*((int *)&origin_radius[0]),y=*((int *)&origin_radius[1]),z=*((int *)&origin_radius[2]),w=*((int *)&origin_radius[3]);
    ANCC(A,B,x); ANCC(A,B,y); ANCC(A,B,z); ANCC(A,B,w);
}