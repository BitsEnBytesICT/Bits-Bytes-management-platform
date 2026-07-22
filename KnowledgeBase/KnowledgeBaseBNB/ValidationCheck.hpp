#pragma once

#include <vector>
#include <string>

class ValidationCheck
{
public:
	int ValidateSearchKeys(std::vector<std::string> searchKeys);
	std::vector<std::string> GetValidatedArticles();
	int GetArticles();
private:
	int CollectArticleData();
	int ValidateArticles();
};