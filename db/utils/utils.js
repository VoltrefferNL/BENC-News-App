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

exports.formatComments = (comments, articleRef) => {
  if (!comments.length) return [];
  return comments.map((comment) => {
    return (formattedComment = {
      body: comment.body,
      article_id: articleRef[comment.belongs_to],
      author: comment.created_by,
      votes: comment.votes,
      created_at: new Date(comment.created_at),
    });
  });
};
