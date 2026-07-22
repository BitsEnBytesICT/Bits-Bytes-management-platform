cmake_minimum_required(VERSION 3.16)

project(KnowledgeBase LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(Drogon CONFIG REQUIRED)

add_executable(${PROJECT_NAME}
    main.cpp
    BackendAPI.cpp
    Transformation.cpp
    ValidationCheck.cpp
)

target_link_libraries(${PROJECT_NAME}
    PRIVATE
        Drogon::Drogon
)