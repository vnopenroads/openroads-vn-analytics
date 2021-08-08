'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import T, {
  translate
} from '../components/t';

export default class TaskListItem extends React.Component {


  toggleSelect() {
    const { _id, toggleSelect } = this.props;
    toggleSelect(_id);
  }

  handleMouseOver() {
    const { _id, onMouseOver } = this.props;
    onMouseOver(_id);
  }

  handleMouseOut() {
    const { _id, onMouseOut } = this.props;
    onMouseOut(_id);
  }

  renderCheckbox() {
    const { _id, selected } = this.props;
    return (
      <label className='form__option form__option--custom-checkbox'>
        <input
          type='checkbox'
          name={`road-${_id}--checkbox`}
          id={`road-${_id}--checkbox`}
          value={`road-${_id}`}
          onChange={this.toggleSelect}
          checked={selected}
        />
        <span className='form__option__ui'></span>
        <span className='form__option__text visually-hidden'><T>Selected</T></span>
      </label>
    );
  }

  renderRadio() {
    const { _id, selected } = this.props;
    return (
      <label className='form__option form__option--custom-radio'>
        <input
          type='radio'
          name='road-group--radio'
          id={`road-${_id}--radio`}
          value={`road-${_id}`}
          onChange={this.toggleSelect}
          checked={selected}
        />
        <span className='form__option__ui'></span>
        <span className='form__option__text visually-hidden'><T>Selected</T></span>
      </label>
    );
  }

  render() {
    const { vpromm, language, type, isHighlighted, province } = this.props;

    return (
      <li className='road-list__item' onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        <article className={`road ${isHighlighted ? 'road--highlight' : ''}`} id='road-{_id}'>
          <header className='road__header'>
            <div className='road__headline'>
              <h1 className='road__title'>{vpromm || translate(language, 'No ID')}</h1>
              {vpromm && <p className='road__subtitle'>{province.name_en}</p>}
            </div>
            <div className='road__h-actions'>
              {type === 'checkbox' && this.renderCheckbox()}
              {type === 'radio' && this.renderRadio()}
            </div>
          </header>
        </article>
      </li>
    );
  }
};

TaskListItem.propTypes = {
  _id: PropTypes.string,
  vpromm: PropTypes.string,
  province: PropTypes.object,
  mode: PropTypes.string,
  type: PropTypes.string,
  language: PropTypes.string,
  selected: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  toggleSelect: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func
};
