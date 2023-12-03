cmake_minimum_required(VERSION 3.22)

set(CMAKE_TOOLCHAIN_FILE ${CMAKE_CURRENT_SOURCE_DIR}/external/grassland/external/vcpkg/scripts/buildsystems/vcpkg.cmake)
set(CMAKE_CXX_STANDARD 17)

project(pro1)

add_subdirectory(external/googletest)
add_subdirectory(external/grassland)

file(GLOB SOURCES lib/*.h lib/*.cpp)
add_library(raytracing_lib ${SOURCES})
target_include_directories(raytracing_lib PRIVATE ${GRASSLAND_INCLUDE_DIRS})

add_executable(raytracing_gui gui/main.cpp)
target_include_directories(raytracing_gui PRIVATE ${GRASSLAND_INCLUDE_DIRS} ${CMAKE_CURRENT_SOURCE_DIR}/lib)

target_link_libraries(raytracing_gui PRIVATE raytracing_lib grassland)


add_executable(raytracing_test test/main.cpp)
target_include_directories(raytracing_test PRIVATE ${GRASSLAND_INCLUDE_DIRS} ${CMAKE_CURRENT_SOURCE_DIR}/lib)
target_link_libraries(raytracing_test PRIVATE raytracing_lib grassland gtest gtest_main)

target_compile_definitions(raytracing_test PRIVATE TEST_DATA_DIR="${CMAKE_CURRENT_SOURCE_DIR}/test/")
add_subdirectory(lib)
