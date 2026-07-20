#include "drogon\drogon.h"
#include "BackendAPI.hpp"

void BackendAPI::RunBackend()
{
    /*drogon::app().registerHandler(
        "/",
        [](const drogon::HttpRequestPtr&,
            std::function<void(const drogon::HttpResponsePtr&)>&& callback)
        {
            auto resp = drogon::HttpResponse::newHttpResponse();
            resp->setBody("Hello World!");
            callback(resp);
        });*/
    RegisterArticlesRoute();
    RegisterArticleRoute();
    RegisterHierarchyRoute();
    RegisterCreateRoute();
    RegisterUpdateRoute();
    RegisterDeleteRoute();

    drogon::app().addListener("0.0.0.0", 8080);
    drogon::app().run();
}

void BackendAPI::RegisterArticlesRoute()
{
    drogon::app().registerHandler(
        backendPath + "client/articles",
        [this](const drogon::HttpRequestPtr& req,
            std::function<void(const drogon::HttpResponsePtr&)>&& callback)
        {
            auto resp = drogon::HttpResponse::newHttpResponse();            
            auto keys = req->getParameters();
            std::string category = this->ReadData(keys["category"])[0];
            std::vector<std::string> splittedValues = this->ReadData(keys["keys"]);
            std::string values = "";
            values += "\nCategory : " + category + "\nKeys : ";
            for (int i = 0; i < splittedValues.size();i++) {
                values += splittedValues[i] + " ";
            }
            resp->setBody("Client articles : " + values);
            callback(resp);
        },
    { drogon::Get }
    );
}

std::vector<std::string> BackendAPI::ReadData(const std::string& searchData)
{
    std::cout << "Read Test, Data received : " << searchData << std::endl;
    std::vector<std::string> splittedValues = Split(searchData, ',');
    validation.ValidateSearchKeys(splittedValues);
    return splittedValues;
}

std::vector<std::string> BackendAPI::Split(const std::string& str, char delimiter)
{
    std::vector<std::string> result;
    std::stringstream ss(str);
    std::string item;

    while (std::getline(ss, item, delimiter))
    {
        result.push_back(item);
    }

    return result;
}

void BackendAPI::RegisterArticleRoute()
{
    drogon::app().registerHandler(
        backendPath + "client/article",
        [this](const drogon::HttpRequestPtr&,
            std::function<void(const drogon::HttpResponsePtr&)>&& callback)
        {
            auto resp = drogon::HttpResponse::newHttpResponse();
            resp->setBody("Get article");
            //this->ReadData("");
            callback(resp);
        },
        { drogon::Get }
    );
}

void BackendAPI::RegisterHierarchyRoute()
{
    drogon::app().registerHandler(
        backendPath + "client/hierarchy",
        [this](const drogon::HttpRequestPtr& req,
            std::function<void(const drogon::HttpResponsePtr&)>&& callback)
        {
            auto resp = drogon::HttpResponse::newHttpResponse();
            auto keys = req->getParameters();
            std::string category = this->ReadData(keys["category"])[0];
            std::string values = "";
            values += "\nCategory : " + category;
            resp->setBody("Hierarchy lookup : " + values);
            callback(resp);
        },
        { drogon::Get }
    );
}

void BackendAPI::RegisterCreateRoute()
{
    drogon::app().registerHandler(
        backendPath + "admin/create",
        [this](const drogon::HttpRequestPtr&,
            std::function<void(const drogon::HttpResponsePtr&)>&& callback)
        {
            auto resp = drogon::HttpResponse::newHttpResponse();
            resp->setBody("Post Create");
            this->CreateData("");
            callback(resp);
        },
        { drogon::Post }
    );
}

void BackendAPI::RegisterUpdateRoute()
{
    drogon::app().registerHandler(
        backendPath + "admin/update",
        [this](const drogon::HttpRequestPtr&,
            std::function<void(const drogon::HttpResponsePtr&)>&& callback)
        {
            auto resp = drogon::HttpResponse::newHttpResponse();
            resp->setBody("Put update");
            this->UpdateData(0, "");
            callback(resp);
        },
        { drogon::Put }
    );
}

void BackendAPI::RegisterDeleteRoute()
{
    drogon::app().registerHandler(
        backendPath + "admin/delete",
        [this](const drogon::HttpRequestPtr&,
            std::function<void(const drogon::HttpResponsePtr&)>&& callback)
        {
            auto resp = drogon::HttpResponse::newHttpResponse();
            resp->setBody("Delete");
            this->DeleteData(0);
            callback(resp);
        },
        { drogon::Delete }
    );
}

int BackendAPI::CreateData(const std::string& data)
{
    std::cout << "Create Test" << std::endl;
    return 0;
}

int BackendAPI::UpdateData(int key, const std::string& data)
{
    std::cout << "Update Test" << data << std::endl;
    return 0;
}

int BackendAPI::DeleteData(int key)
{
    std::cout << "Delete Test" << std::endl;
    return 0;
}