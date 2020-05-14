export default class Comments {
  constructor(comments) {
    this._allComments = comments;
    this._commentForDeleteIds = [];
  }

  getComments(ids) {
    return this._allComments.filter((comment) => {
      return ids.includes(comment.id);
    });
  }

  addComment(comment) {
    this._allComments = [].concat(this._allComments, comment);
  }

  deleteComments() {
    this._commentForDeleteIds.forEach((id) => {
      const deleteCommentIndex = this._allComments.findIndex((comment) => comment.id === id);
      if (deleteCommentIndex > -1) {
        this._allComments = [].concat(this._allComments.slice(0, deleteCommentIndex), this._allComments.slice(deleteCommentIndex + 1));
      }
    });
    this._commentForDeleteIds = [];
  }

  addCommentForDelete(id) {
    this._commentForDeleteIds.push(parseInt(id, 10));
  }

  getCommentsForDelete() {
    return this._commentForDeleteIds;
  }
}
