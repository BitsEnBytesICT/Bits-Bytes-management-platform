#include "Transformation.hpp"

#include <functional>
#include <sstream>

std::vector<std::string> TransformationLayer::GetArticlesPackage(std::string category, std::string keyString)
{
    validationLayer.GetValidatedArticles();
	return std::vector<std::string>();
}

std::vector<std::string> TransformationLayer::ReadData(const std::string& searchData)
{
    //std::cout << "Read Test, Data received : " << searchData << std::endl;
    std::vector<std::string> splittedValues = Split(searchData, ',');
    validationLayer.ValidateSearchKeys(splittedValues);
    return splittedValues;
}

std::vector<std::string> TransformationLayer::Split(const std::string& str, char delimiter)
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