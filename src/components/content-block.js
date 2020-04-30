import AbstractComponent from "./abstract-component";

const createContentBlockTemplate = () => {
  return `<section class="films">
            <section class="films-list">
              <div class="films-list__container">
              </div>
            </section>
          </section>`;
};

export default class ContentBlock extends AbstractComponent {
  getTemplate() {
    return createContentBlockTemplate();
  }
}
