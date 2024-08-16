cmake_minimum_required(VERSION 3.28)
project(ControlArduino)

set(CMAKE_CXX_STANDARD 17)

add_executable(ControlArduino main.cpp)

# Liên kết thư viện ODBC
target_link_libraries(ControlArduino PRIVATE odbc32)

