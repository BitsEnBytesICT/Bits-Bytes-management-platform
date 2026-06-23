#pragma once

#include <string>
#include <vector>
#include "ValidationCheck.hpp"

class BackendAPI
{
public:
	void RunBackend();
private:
	ValidationCheck validation;

	void RegisterArticlesRoute();
	void RegisterArticleRoute();
	void RegisterCreateRoute();
	void RegisterUpdateRoute();
	void RegisterDeleteRoute();

	int CreateData(const std::string& data);
	std::vector<std::string> ReadData(const std::string& searchData);
	std::vector<std::string> Split(const std::string& str, char delimiter);
	int UpdateData(int key, const std::string& data);
	int DeleteData(int key);
};