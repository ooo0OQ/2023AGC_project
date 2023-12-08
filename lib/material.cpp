#include"material.h"
#include<vector>
#include "newclass.h"
using namespace std;
void Material::ANC(vector<Newclass>& A, int &B){
    int x=*((int *)&albedo_color[0]),y=*((int *)&albedo_color[1]),z=*((int *)&albedo_color[2]);
    ANCC(A,B,x); ANCC(A,B,y); ANCC(A,B,z); ANCC(A,B,material_type);
}