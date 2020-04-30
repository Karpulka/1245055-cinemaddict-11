import AbstractComponent from "./abstract-component";

const createBlockAdditionTemplate = () => {
  return `<section class="films-list--extra">
            <h2 class="films-list__title"></h2>      
            <div class="films-list__container">
            </div>
          </section>`;
};

export default class AdditionBlock extends AbstractComponent {
  getTemplate() {
    return createBlockAdditionTemplate();
  }
}
