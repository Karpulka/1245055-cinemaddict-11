export default class CommentModel {
  constructor(comment) {
    this.id = comment[`id`];
    this.author = comment[`author`];
    this.comment = comment[`comment`];
    this.date = comment[`date`] ? new Date(comment[`date`]) : null;
    this.emotion = comment[`emotion`];
  }

  toRAW() {
    return {
      "comment": this.comment,
      "date": this.date ? this.date.toISOString() : null,
      "emotion": this.emotion
    };
  }

  static parseComment(comment) {
    return new CommentModel(comment);
  }

  static parseComments(comment) {
    return comment.map(CommentModel.parseComment);
  }
}
