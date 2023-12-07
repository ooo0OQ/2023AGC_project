#version 450
#extension GL_GOOGLE_include_directive : require
#extension GL_EXT_nonuniform_qualifier : require
#extension GL_EXT_debug_printf : enable

// clang-format off
struct CameraObject {
  mat4 projection;
  mat4 camera_to_world;
  vec2 window_extent;
  uint num_triangle;
  uint num_sphere;
  vec3 ambient_light;
  uint num_point_light;
};



struct Material {
  vec3 albedo_color;
  uint material_type;
};

#define MaterialDiffuse 0
#define MaterialSpecular 1


struct HitRecord {
  Material material;
  vec3 normal;
  float t_min;
  float t_max;
};


struct Sphere {
  vec3 origin;
  float radius;
};

struct Triangle {
  vec3 v0;
  float padding0;
  vec3 v1;
  float padding1;
  vec3 v2;
  float padding2;
  vec3 v3;
  float padding3;
};


struct PointLight {
  vec3 position;
  float padding0;
  vec3 power;
  float padding1;
};


struct Newclass {
  int a,b,c;
  float d;
};

// clang-format on

layout(location = 0) out vec4 outColor;

layout(std140, binding = 0) readonly uniform camera_object_struct {
  CameraObject camera_object;
};
layout(std140, binding = 1) readonly buffer triangle_struct {
  Triangle triangles[];
};
layout(std140, binding = 2) readonly buffer triangle_material_struct {
  Material triangle_materials[];
};
layout(std140, binding = 3) readonly buffer sphere_struct {
  Sphere spheres[];
};
layout(std140, binding = 4) readonly buffer sphere_material_struct {
  Material sphere_materials[];
};
layout(std140, binding = 5) readonly buffer point_light_struct {
  PointLight point_lights[];
};
layout(std140, binding = 6) readonly buffer new_class_struct {
  Newclass nc[];
};
float Find(vec3 origin,vec3 direction){
  uint Ltri=camera_object.num_triangle;
  uint Lsph=camera_object.num_sphere;
  float dist=10000000;
    int id=0,tp=0;
    for(int i=0;i<Ltri;i++){
      vec3 AB=triangles[i].v1-triangles[i].v0,BC=triangles[i].v3-triangles[i].v1,CA=triangles[i].v0-triangles[i].v2;
      vec3 n=normalize(cross(AB,-CA));
      if(abs(dot(direction,n))<0.0001)continue;
      float u=(dot(triangles[i].v0,n)-dot(origin,n))/dot(direction,n);
      if(u<0)continue;
      vec3 P=origin+u*direction;
      if(dot(n,cross(AB,P-triangles[i].v0))>=0&&dot(n,cross(BC,P-triangles[i].v1))>=0&&dot(n,cross(CA,P-triangles[i].v2))>=0){
        if(u>0.001)
        if(dist>u||(tp==0)){
          tp=1;
          id=i;
          dist=u;
        }
      }
    }
    for(int i=0;i<Lsph;i++){
      float X=dot(spheres[i].origin-origin,spheres[i].origin-origin),Y=spheres[i].radius*spheres[i].radius;
      if(X<Y){
        float B=2.0*dot(direction,origin-spheres[i].origin),C=X-Y;
        float u=(-B+sqrt(B*B-4*C))/2.0;
        if(u>0.001)if(dist>u||(tp==0)){
          tp=2;
          id=i;
          dist=u;
        }
        continue;
      }
      float D=dot(spheres[i].origin,direction)-dot(origin,direction);
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
vec3 SampleRay(vec3 origin, vec3 direction) {
  vec3 ambient_light=vec3(intBitsToFloat(nc[0].a),intBitsToFloat(nc[0].b),intBitsToFloat(nc[0].c));
  //vec3 ambient_light=camera_object.ambient_light;
  vec3 result_color = vec3(0);
  vec3 ref=vec3(1.0,1.0,1.0);
  uint Ltri=camera_object.num_triangle;
  uint Lsph=camera_object.num_sphere;
  for(int i=0;i<16;i++){
    float dist=10000000;
    int id=0,tp=0;
    for(int i=0;i<Ltri;i++){
      vec3 AB=triangles[i].v1-triangles[i].v0,BC=triangles[i].v2-triangles[i].v1,CA=triangles[i].v0-triangles[i].v2;
      vec3 n=normalize(cross(AB,-CA));
      if(abs(dot(direction,n))<0.0001)continue;
      float u=(dot(triangles[i].v0,n)-dot(origin,n))/dot(direction,n);
      if(u<0)continue;
      vec3 P=origin+u*direction;
      if(dot(n,cross(AB,P-triangles[i].v0))>=0&&dot(n,cross(BC,P-triangles[i].v1))>=0&&dot(n,cross(CA,P-triangles[i].v2))>=0){
        if(u>0.001)
        if(dist>u||(tp==0)){
          tp=1;
          id=i;
          dist=u;
        }
      }
    }
    for(int i=0;i<Lsph;i++){
      float X=dot(spheres[i].origin-origin,spheres[i].origin-origin),Y=spheres[i].radius*spheres[i].radius;
      if(X<Y){
        float B=2.0*dot(direction,origin-spheres[i].origin),C=X-Y;
        float u=(-B+sqrt(B*B-4*C))/2.0;
        if(u>0.001)if(dist>u||(tp==0)){
          tp=2;
          id=i;
          dist=u;
        }
        continue;
      }
      float D=dot(spheres[i].origin,direction)-dot(origin,direction);
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
      if(triangle_materials[id].material_type==MaterialDiffuse){
        vec3 res=ambient_light;
        vec3 n=normalize(cross(triangles[id].v1-triangles[id].v0,triangles[id].v2-triangles[id].v0));
        for(int j=0;j<camera_object.num_point_light;j++){
          vec3 ori=origin+dist*direction;
          vec3 dir=normalize(point_lights[j].position-ori);
          if(abs(dot(dir,point_lights[j].position-ori)-Find(point_lights[j].position,-dir))<0.4){
            //return point_lights[j].power*0.000001;
            res=res+(abs(dot(n,normalize(point_lights[j].position-ori)))/dot(point_lights[j].position-ori,point_lights[j].position-ori))*point_lights[j].power;
          }
        }
        res[0]=res[0]*triangle_materials[id].albedo_color[0]*ref[0];
        res[1]=res[1]*triangle_materials[id].albedo_color[1]*ref[1];
        res[2]=res[2]*triangle_materials[id].albedo_color[2]*ref[2];
        return res;
      }
      else{
        vec3 n=normalize(cross(triangles[id].v1-triangles[id].v0,triangles[id].v2-triangles[id].v0));
        vec3 new_origin=origin+dist*direction;
        vec3 new_direction=direction-2.0*dot(direction,n)*n;
        origin=new_origin+new_direction*0.01;
        direction=new_direction;
        ref[0]=ref[0]*sphere_materials[id].albedo_color[0];
        ref[1]=ref[1]*sphere_materials[id].albedo_color[1];
        ref[2]=ref[2]*sphere_materials[id].albedo_color[2];
      }
    }
    else{
      if(sphere_materials[id].material_type==MaterialDiffuse){
        vec3 res=ambient_light;
        vec3 ori=origin+dist*direction;
        vec3 n=normalize(ori-spheres[id].origin);
        for(int j=0;j<camera_object.num_point_light;j++){
          vec3 dir=normalize(point_lights[j].position-ori);
          if(abs(dot(dir,point_lights[j].position-ori)-Find(point_lights[j].position,-dir))<0.4){
            res=res+abs(dot(n,normalize(point_lights[j].position-ori)))/dot(point_lights[j].position-ori,point_lights[j].position-ori)*point_lights[j].power;
          }
        }
        res[0]=res[0]*sphere_materials[id].albedo_color[0]*ref[0];
        res[1]=res[1]*sphere_materials[id].albedo_color[1]*ref[1];
        res[2]=res[2]*sphere_materials[id].albedo_color[2]*ref[2];
        return res;
      }else{
        vec3 new_origin=origin+dist*direction;
        vec3 n=normalize(new_origin-spheres[id].origin);;
        vec3 new_direction=direction-2.0*dot(direction,n)*n;
        origin=new_origin+new_direction*0.01;
        direction=new_direction;
        ref[0]=ref[0]*sphere_materials[id].albedo_color[0];
        ref[1]=ref[1]*sphere_materials[id].albedo_color[1];
        ref[2]=ref[2]*sphere_materials[id].albedo_color[2];
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
              .xyz);
      subpixel_color = clamp(subpixel_color, 0.0, 1.0);
      color += subpixel_color;
    }
  }
  outColor = vec4(color / (SUPER_SAMPLE_X * SUPER_SAMPLE_Y), 1.0);
}
