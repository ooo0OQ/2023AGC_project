#pragma once
#include "grassland/grassland.h"

struct CameraObject {
  glm::mat4 screen_to_camera;
  glm::mat4 camera_to_world;
};

class RayTracingApp {
 public:
  RayTracingApp(uint32_t width, uint32_t height);
  void Run();

 private:
  void OnInit();
  void OnLoop();
  void OnClose();

  void OnUpdate();
  void OnRender();

  std::unique_ptr<grassland::vulkan_legacy::framework::Core> core_;
  std::unique_ptr<grassland::vulkan_legacy::framework::TextureImage>
      frame_texture_;
  std::unique_ptr<
      grassland::vulkan_legacy::raytracing::BottomLevelAccelerationStructure>
      bottom_level_acceleration_structure_;
  std::unique_ptr<
      grassland::vulkan_legacy::raytracing::TopLevelAccelerationStructure>
      top_level_acceleration_structure_;
  std::unique_ptr<
      grassland::vulkan_legacy::framework::StaticBuffer<CameraObject>>
      camera_object_buffer_;
  std::unique_ptr<grassland::vulkan_legacy::framework::RayTracingRenderNode>
      ray_tracing_render_node_;
};
