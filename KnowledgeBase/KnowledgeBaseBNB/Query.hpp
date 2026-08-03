#include <vector>
#include <string>

struct QuerySection {

	std::string queryName;
	std::string values;

};

struct Query {

	std::vector<QuerySection> querySection;

};

