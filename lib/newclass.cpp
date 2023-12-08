#include"newclass.h"
#include<vector>
using namespace std;
Newclass::Newclass(int a,int b,int c,int d)
      : A(a),B(b),C(c),D(d) {}
void ANCC(vector<Newclass>& A, int &B, int C){
    if(B%4==0){
        Newclass D=Newclass(C,0,0,0);
        A.push_back(D);
    }
    else{
        if(B%4==1)A[B/4].B=C;
        if(B%4==2)A[B/4].C=C;
        if(B%4==3)A[B/4].D=C;
    }
    B++;
}