exports.formatDates = (unFormattedArticles) => {
  return unFormattedArticles.map(({ created_at, ...rest }) => {
    return { created_at: new Date(created_at), ...rest };
  });
};

exports.makeRefObj = (list) => {
  const authorRef = {};
  if (!list.length) return authorRef;
  list.forEach((article) => {
    authorRef[article.title] = article.article_id;
  });
  return authorRef;
};

exports.formatComments = (comments, articleRef) => {};
