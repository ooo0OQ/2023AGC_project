#version 450
#extension GL_GOOGLE_include_directive : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_debug_printf : enable

// clang-format off
#include "camera_object.glsl"
#include "hit_record.glsl"
#include "sphere.glsl"
#include "triangle.glsl"
#include "point_light.glsl"
#include "new_class.glsl"
// clang-format on

/*
#define NMax 207
Triangle triangles[NMax];
Sphere spheres[NMax];
Material triangle_materials[NMax];
Material sphere_materials[NMax];
PointLight point_lights[NMax];
*/
int Ltri,Ltrm,Lsph,Lspm,Lpoi;
int Utri,Utrm,Usph,Uspm,Upoi;
int Stri,Strm,Ssph,Sspm,Spoi;
uint Lnc;

layout(location = 0) out vec4 outColor;

layout(std140, binding = 0) readonly uniform camera_object_struct {
  CameraObject camera_object;
};
layout(std140, binding = 1) readonly buffer new_class_struct {
  Newclass nc[];
};

int ReadInt(int index){
  if(index%4==0)return nc[index/4].a;
  if(index%4==1)return nc[index/4].b;
  if(index%4==2)return nc[index/4].c;
  return nc[index/4].d;
}
float ReadFloat(int index){
  return intBitsToFloat(ReadInt(index));
}

Triangle triangles(int index){
  int cur=Utri+index*Stri;
  float x,y,z;
  x=ReadFloat(cur++); y=ReadFloat(cur++); z=ReadFloat(cur++);
  vec3 v0=vec3(x,y,z);
  x=ReadFloat(cur++); y=ReadFloat(cur++); z=ReadFloat(cur++);
  vec3 v1=vec3(x,y,z);
  x=ReadFloat(cur++); y=ReadFloat(cur++); z=ReadFloat(cur++);
  vec3 v2=vec3(x,y,z);
  return Triangle(v0,v1,v2);
}
Material triangle_materials(int index){
  int cur=Utrm+index*Strm;
  float x=ReadFloat(cur++); 
  float y=ReadFloat(cur++);
  float z=ReadFloat(cur++);
  vec3 albedo_color=vec3(x,y,z);
  return Material(albedo_color,uint(ReadInt(cur++)));
}
Sphere spheres(int index){
  int cur=Usph+index*Ssph;
  float x=ReadFloat(cur++), y=ReadFloat(cur++), z=ReadFloat(cur++), w=ReadFloat(cur++);
  return Sphere(vec3(x,y,z),w);
}
Material sphere_materials(int index){
  int cur=Uspm+index*Sspm;
  float x=ReadFloat(cur++); 
  float y=ReadFloat(cur++);
  float z=ReadFloat(cur++);
  vec3 albedo_color=vec3(x,y,z);
  return Material(albedo_color,uint(ReadInt(cur++)));
}
PointLight point_lights(int index){
  int cur=Upoi+index*Spoi;
  float x,y,z;
  x=ReadFloat(cur++); y=ReadFloat(cur++); z=ReadFloat(cur++);
  vec3 position=vec3(x,y,z);
  x=ReadFloat(cur++); y=ReadFloat(cur++); z=ReadFloat(cur++);
  vec3 power=vec3(x,y,z);
  return PointLight(position,power);
}
int ParseData(){
  Lnc=camera_object.num_point_light;
  Utri=1;
  Stri=9;
  Ltri=ReadInt(Utri-1);

  Utrm=Utri+Stri*Ltri+1;
  Strm=4;
  Ltrm=ReadInt(Utrm-1);
  
  Usph=Utrm+Strm*Ltrm+1;
  Ssph=4;
  Lsph=ReadInt(Usph-1);
  
  Uspm=Usph+Ssph*Lsph+1;
  Sspm=4;
  Lspm=ReadInt(Uspm-1);

  Upoi=Uspm+Sspm*Lspm+1;
  Spoi=6;
  Lpoi=ReadInt(Upoi-1);

  return Lpoi;
}

float Find(vec3 origin,vec3 direction){
  float dist=10000000;
    int id=0,tp=0;
    for(int i=0;i<Ltri;i++){
      Triangle tri=triangles(i);
      vec3 AB=tri.v1-tri.v0,BC=tri.v2-tri.v1,CA=tri.v0-tri.v2;
      vec3 n=normalize(cross(AB,-CA));
      if(abs(dot(direction,n))<0.0001)continue;
      float u=(dot(tri.v0,n)-dot(origin,n))/dot(direction,n);
      if(u<0)continue;
      vec3 P=origin+u*direction;
      if(dot(n,cross(AB,P-tri.v0))>=0&&dot(n,cross(BC,P-tri.v1))>=0&&dot(n,cross(CA,P-tri.v2))>=0){
        if(u>0.001)
        if(dist>u||(tp==0)){
          tp=1;
          id=i;
          dist=u;
        }
      }
    }
    for(int i=0;i<Lsph;i++){
      Sphere sph=spheres(i);
      float X=dot(sph.origin-origin,sph.origin-origin),Y=sph.radius*sph.radius;
      if(X<Y){
        float B=2.0*dot(direction,origin-sph.origin),C=X-Y;
        float u=(-B+sqrt(B*B-4*C))/2.0;
        if(u>0.001)if(dist>u||(tp==0)){
          tp=2;
          id=i;
          dist=u;
        }
        continue;
      }
      float D=dot(sph.origin,direction)-dot(origin,direction);
      if(D<0)continue;
      float u=D-sqrt(Y-(X-D*D));
      if(u>0.001){
        if(dist>u||(tp==0)){
        tp=2;
        id=i;
        dist=u;
      }
      }
    }
  return dist;
}
vec3 SampleRay(vec3 origin, vec3 direction,int key) {
  vec3 ambient_light=camera_object.ambient_light;
  vec3 result_color = vec3(0);
  vec3 ref=vec3(1.0,1.0,1.0);
  for(int i=0;i<16;i++){
    float dist=10000000;
    int id=0,tp=0;
    for(int i=0;i<Ltri;i++){
      Triangle tri=triangles(i);
      vec3 AB=tri.v1-tri.v0,BC=tri.v2-tri.v1,CA=tri.v0-tri.v2;
      vec3 n=normalize(cross(AB,-CA));
      if(abs(dot(direction,n))<0.0001)continue;
      float u=(dot(tri.v0,n)-dot(origin,n))/dot(direction,n);
      if(u<0)continue;
      vec3 P=origin+u*direction;
      if(dot(n,cross(AB,P-tri.v0))>=0&&dot(n,cross(BC,P-tri.v1))>=0&&dot(n,cross(CA,P-tri.v2))>=0){
        if(u>0.001)
        if(dist>u||(tp==0)){
          tp=1;
          id=i;
          dist=u;
        }
      }
    }
    for(int i=0;i<Lsph;i++){
      Sphere sph=spheres(i);
      float X=dot(sph.origin-origin,sph.origin-origin),Y=sph.radius*sph.radius;
      if(X<Y){
        float B=2.0*dot(direction,origin-sph.origin),C=X-Y;
        float u=(-B+sqrt(B*B-4*C))/2.0;
        if(u>0.001)if(dist>u||(tp==0)){
          tp=2;
          id=i;
          dist=u;
        }
        continue;
      }
      float D=dot(sph.origin,direction)-dot(origin,direction);
      if(D<0)continue;
      float u=D-sqrt(Y-(X-D*D));
      if(u>0.001)if(dist>u||(tp==0)){
        tp=2;
        id=i;
        dist=u;
      }
    }
    if(tp==0){
      vec3 am=ambient_light;
      am[0]=am[0]*ref[0];
      am[1]=am[1]*ref[1];
      am[2]=am[2]*ref[2];
      return am;
    }
    if(tp==1){
      Material trm=triangle_materials(id);
      if(trm.material_type==MaterialDiffuse){
        vec3 res=ambient_light;
        Triangle tri=triangles(id);
        vec3 n=normalize(cross(tri.v1-tri.v0,tri.v2-tri.v0));
        for(int j=0;j<Lpoi;j++){
          PointLight poi=point_lights(j);
          vec3 ori=origin+dist*direction;
          vec3 dir=normalize(poi.position-ori);
          if(abs(dot(dir,poi.position-ori)-Find(poi.position,-dir))<0.4){
            //return poi.power*0.000001;
            res=res+(abs(dot(n,normalize(poi.position-ori)))/dot(poi.position-ori,poi.position-ori))*poi.power;
          }
        }
        res[0]=res[0]*trm.albedo_color[0]*ref[0];
        res[1]=res[1]*trm.albedo_color[1]*ref[1];
        res[2]=res[2]*trm.albedo_color[2]*ref[2];
        return res;
      }
      else{
        Triangle tri=triangles(id);
        vec3 n=normalize(cross(tri.v1-tri.v0,tri.v2-tri.v0));
        vec3 new_origin=origin+dist*direction;
        vec3 new_direction=direction-2.0*dot(direction,n)*n;
        origin=new_origin+new_direction*0.01;
        direction=new_direction;
        ref[0]=ref[0]*trm.albedo_color[0];
        ref[1]=ref[1]*trm.albedo_color[1];
        ref[2]=ref[2]*trm.albedo_color[2];
      }
    }
    else{
      Sphere sph=spheres(id);
      Material spm=sphere_materials(id);
      if(spm.material_type==MaterialDiffuse){
        vec3 res=ambient_light;
        vec3 ori=origin+dist*direction;
        vec3 n=normalize(ori-sph.origin);
        for(int j=0;j<Lpoi;j++){
          PointLight poi=point_lights(j);
          vec3 dir=normalize(poi.position-ori);
          if(abs(dot(dir,poi.position-ori)-Find(poi.position,-dir))<0.4){
            res=res+abs(dot(n,normalize(poi.position-ori)))/dot(poi.position-ori,poi.position-ori)*poi.power;
          }
        }
        res[0]=res[0]*spm.albedo_color[0]*ref[0];
        res[1]=res[1]*spm.albedo_color[1]*ref[1];
        res[2]=res[2]*spm.albedo_color[2]*ref[2];
        return res;
      }else{
        vec3 new_origin=origin+dist*direction;
        vec3 n=normalize(new_origin-sph.origin);;
        vec3 new_direction=direction-2.0*dot(direction,n)*n;
        origin=new_origin+new_direction*0.01;
        direction=new_direction;
        ref[0]=ref[0]*spm.albedo_color[0];
        ref[1]=ref[1]*spm.albedo_color[1];
        ref[2]=ref[2]*spm.albedo_color[2];
      }
    }
  }
  /*
   * TODO: This function should return the color of the sampling ray.
   * @origin denote the ray's starting position.
   * @direction is a normalized vector denote the marching direction of the ray.
   * The result should consider all the geometries, materials, point
   * lights (with shadow), and ambient light. You can limit the number of light
   * bounces to 16.
   */
  return result_color;
}

void main() {
  int key=ParseData();
  vec3 color = vec3(0.0);
#define SUPER_SAMPLE_X 4
#define SUPER_SAMPLE_Y 4
  for (int x = 0; x < SUPER_SAMPLE_X; x++) {
    for (int y = 0; y < SUPER_SAMPLE_Y; y++) {
      vec2 pixel_offset = vec2((x + 0.5) * 1.0 / SUPER_SAMPLE_X,
                               (y + 0.5) * 1.0 / SUPER_SAMPLE_Y);
      vec4 direction =
          camera_object.projection * vec4(((gl_FragCoord.xy + pixel_offset) /
                                           camera_object.window_extent) *
                                                  2.0 -
                                              1.0,
                                          1.0, 1.0);
      vec3 subpixel_color = SampleRay(
          (camera_object.camera_to_world * vec4(0.0, 0.0, 0.0, 1.0)).xyz,
          (camera_object.camera_to_world * vec4(normalize(direction.xyz), 0.0))
              .xyz, key);
      subpixel_color = clamp(subpixel_color, 0.0, 1.0);
      color += subpixel_color;
    }
  }
  outColor = vec4(color / (SUPER_SAMPLE_X * SUPER_SAMPLE_Y), 1.0);
}
