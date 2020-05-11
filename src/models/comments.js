export default class Comments {
  constructor(allComments) {
    this._allComments = allComments;
  }

  getComments(ids) {
    return this._allComments.filter((comment) => {
      return ids.includes(comment.id);
    });
  }

  addComment(comment) {
    this._allComments.push(comment);
  }
}
