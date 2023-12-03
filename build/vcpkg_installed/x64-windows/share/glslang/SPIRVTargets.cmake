get_filename_component(VCPKG_IMPORT_PREFIX "${CMAKE_CURRENT_LIST_DIR}/../../" ABSOLUTE)

        message(WARNING "Using `SPIRVTargets.cmake` is deprecated: use `find_package(glslang)` to find glslang CMake targets.")

        if (NOT TARGET glslang::SPIRV)
            include("${VCPKG_IMPORT_PREFIX}/lib/cmake/glslang/glslang-targets.cmake")
        endif()

        add_library(SPIRV ALIAS glslang::SPIRV)
    