vcpkg_from_github(
    OUT_SOURCE_PATH SOURCE_PATH
    REPO eranpeer/FakeIt
    REF "${VERSION}"
    SHA512 3575dc2247a97ea6d3c584e9b933e32cc0d1936fec480b19caf8305e8ba39bb11b4437930a5343b343df66347354ef5aaa8d2811e0ff3119bfc619629a0c2b8b
    HEAD_REF master
)

file(COPY "${SOURCE_PATH}/single_header/" DESTINATION "${CURRENT_PACKAGES_DIR}/include")

file(INSTALL "${SOURCE_PATH}/LICENSE" DESTINATION "${CURRENT_PACKAGES_DIR}/share/${PORT}" RENAME copyright)