#include"triangle.h"
#include<vector>
#include "newclass.h"
using namespace std;
Triangle::Triangle(glm::vec3 v0_, glm::vec3 v1_, glm::vec3 v2_)
      : v0(v0_), v1(v1_), v2(v2_){
  }
void Triangle::ANC(vector<Newclass>& A, int &B){
    int x=*((int *)&v0[0]),y=*((int *)&v0[1]),z=*((int *)&v0[2]);
    ANCC(A,B,x); ANCC(A,B,y); ANCC(A,B,z);
    x=*((int *)&v1[0]); y=*((int *)&v1[1]); z=*((int *)&v1[2]);
    ANCC(A,B,x); ANCC(A,B,y); ANCC(A,B,z);
    x=*((int *)&v2[0]); y=*((int *)&v2[1]); z=*((int *)&v2[2]);
    ANCC(A,B,x); ANCC(A,B,y); ANCC(A,B,z);
}