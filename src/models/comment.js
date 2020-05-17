export default class CommentModel {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.comment = data[`comment`];
    this.date = data[`date`] ? new Date(data[`date`]) : null;
    this.emotion = data[`emotion`]
  }

  toRAW() {
    return {
      "comment": this.comment,
      "date": this.date ? this.date.toISOString() : null,
      "emotion": this.emotion
    }
  }

  static parseComment(data) {
    return new CommentModel(data);
  }

  static parseComments(data) {
    return data.map(CommentModel.parseComment);
  }

  static clone(data) {
    return new CommentModel(data.toRAW());
  }
}
