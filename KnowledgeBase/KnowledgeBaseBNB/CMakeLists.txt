cmake_minimum_required(VERSION 3.16)

project(KnowledgeBase LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

find_package(Drogon CONFIG REQUIRED)
find_package(CppUnit CONFIG REQUIRED)

add_executable(${PROJECT_NAME}
    main.cpp
    BackendAPI.cpp
    Transformation.cpp
    ValidationCheck.cpp
    ArticleQueries.cpp
)

add_executable(KnowledgeBaseTests
    HelloTest.cpp
    BackendAPI.cpp
    Transformation.cpp
    ValidationCheck.cpp
    ArticleQueries.cpp
)

target_link_libraries(${PROJECT_NAME}
    PRIVATE
        Drogon::Drogon
        CppUnit
)

target_link_libraries(KnowledgeBaseTests
    PRIVATE
        Drogon::Drogon
        CppUnit
)