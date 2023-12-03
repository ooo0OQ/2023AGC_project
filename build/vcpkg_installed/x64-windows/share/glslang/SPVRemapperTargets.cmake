get_filename_component(VCPKG_IMPORT_PREFIX "${CMAKE_CURRENT_LIST_DIR}/../../" ABSOLUTE)

            message(WARNING "Using `SPVRemapperTargets.cmake` is deprecated: use `find_package(glslang)` to find glslang CMake targets.")

            if (NOT TARGET glslang::SPVRemapper)
                include("${VCPKG_IMPORT_PREFIX}/lib/cmake/glslang/glslang-targets.cmake")
            endif()

            add_library(SPVRemapper ALIAS glslang::SPVRemapper)
        