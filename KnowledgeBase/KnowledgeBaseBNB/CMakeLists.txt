cmake_minimum_required(VERSION 3.16)
project(MyDrogonProject)

find_package(Drogon CONFIG REQUIRED)

add_executable(${PROJECT_NAME} main.cpp)

target_link_libraries(${PROJECT_NAME}
    PRIVATE Drogon::Drogon)