#pragma once

#include <vector>
#include <string>

class ValidationCheck
{
public:
	int ValidateSearchKeys(std::vector<std::string> searchKeys);
	int GetArticles();
private:
	int CollectArticleData();
	int ValidateArticles();
};