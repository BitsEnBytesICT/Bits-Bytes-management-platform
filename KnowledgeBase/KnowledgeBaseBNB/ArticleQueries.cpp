#include <string>
#include "Query.hpp"

class ArticleQueries
{
public:
    static Query getByKeyword(std::string category, std::string keyword)
    {
        Query query;

        query.querySection.push_back({ "SELECT", "articles.*" });
        query.querySection.push_back({ "FROM", "articles" });
        query.querySection.push_back({ "INNER_JOIN", "keywords_to_articles ON articles.id = keywords_to_articles.article_id" });
        query.querySection.push_back({ "WHERE", "keywords.name = ?" });
        query.querySection.push_back({ "LIMIT", "10" });

        return query;
    }
};