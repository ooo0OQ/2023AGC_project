get_filename_component(VCPKG_IMPORT_PREFIX "${CMAKE_CURRENT_LIST_DIR}/../../" ABSOLUTE)

            message(WARNING "Using `glslangTargets.cmake` is deprecated: use `find_package(glslang)` to find glslang CMake targets.")

            if (NOT TARGET glslang::glslang)
                include("${VCPKG_IMPORT_PREFIX}/lib/cmake/glslang/glslang-targets.cmake")
            endif()

            if(OFF)
                add_library(glslang ALIAS glslang::glslang)
            else()
                add_library(glslang ALIAS glslang::glslang)
                add_library(MachineIndependent ALIAS glslang::MachineIndependent)
                add_library(GenericCodeGen ALIAS glslang::GenericCodeGen)
            endif()
        