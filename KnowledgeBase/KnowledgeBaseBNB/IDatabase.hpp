#pragma once
#include <string>

class IDatabase
{
public:
    virtual ~IDatabase() = default;

    virtual bool Connect(const std::string& connectionString) = 0;
    virtual void Disconnect() = 0;

    virtual bool Execute(const std::string& query) = 0;
};