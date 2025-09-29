import { Link } from "@remix-run/react";

// Temporary mock data - will be replaced with real data later
const articles = [
  { id: 1, title: "Getting Started with Remix", slug: "getting-started-with-remix" },
  { id: 2, title: "Building a CMS with Remix", slug: "building-a-cms-with-remix" },
];

export default function ArticlesIndex() {
  return (
    <div className="articles">
      <div className="header">
        <h2>Articles</h2>
        <Link to="/articles/new" className="button">
          Create New Article
        </Link>
      </div>
      
      <div className="article-list">
        {articles.map((article) => (
          <div key={article.id} className="article-item">
            <h3>
              <Link to={`/articles/${article.slug}`}>{article.title}</Link>
            </h3>
            <div className="actions">
              <Link to={`/articles/${article.slug}/edit`} className="button">
                Edit
              </Link>
              <button className="button danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
