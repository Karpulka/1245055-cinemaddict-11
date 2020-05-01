const POSITION = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const render = (container, component, position) => {
  const element = component.getElement();
  switch (position) {
    case POSITION.AFTERBEGIN:
      container.prepend(element);
      break;
    case POSITION.AFTEREND:
      container.after(element);
      break;
    case POSITION.BEFOREEND:
      container.append(element);
      break;
  }
};

const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

const toggleElement = (container, component, action) => {
  const element = component.getElement();
  switch (action) {
    case `show`:
      container.appendChild(element);
      break;
    case `hide`:
      if (container.contains(element)) {
        container.removeChild(element);
      }
      break;
  }
};

export {createElement, render, POSITION, remove, toggleElement};