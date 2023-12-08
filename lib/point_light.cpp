#include"point_light.h"
#include<vector>
#include "newclass.h"
using namespace std;
PointLight::PointLight(const glm::vec3 &position_, float power_)
      : position(position_), power(power_) {
}

PointLight::PointLight(const glm::vec3 &position_, const glm::vec3 &power_)
      : position(position_), power(power_) {
}
void PointLight::ANC(vector<Newclass>& A, int &B){
    int x=*((int *)&position[0]),y=*((int *)&position[1]),z=*((int *)&position[2]);
    ANCC(A,B,x); ANCC(A,B,y); ANCC(A,B,z);
    x=*((int *)&power[0]); y=*((int *)&power[1]); z=*((int *)&power[2]);
    ANCC(A,B,x); ANCC(A,B,y); ANCC(A,B,z);
}