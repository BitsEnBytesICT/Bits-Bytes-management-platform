#pragma once

#include "ValidationCheck.hpp"

#include <vector>
#include <string>

class TransformationLayer
{
	ValidationCheck validationLayer;

	std::vector<std::string> GetArticlesPackage(std::string category, std::string keyString);
	std::vector<std::string> ReadData(const std::string& searchData);
	std::vector<std::string> Split(const std::string& str, char delimiter);
};