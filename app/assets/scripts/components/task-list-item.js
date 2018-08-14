'use strict';
import React from 'react';
import T, {
  translate
} from '../components/t';

const TaskListItem = React.createClass({
  displayName: 'TaskListItem',
  propTypes: {
    _id: React.PropTypes.string,
    vpromm: React.PropTypes.string,
    province: React.PropTypes.object,
    mode: React.PropTypes.string,
    type: React.PropTypes.string,
    language: React.PropTypes.string,
    selected: React.PropTypes.bool,
    isHighlighted: React.PropTypes.bool,
    toggleSelect: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onMouseOut: React.PropTypes.func
  },

  toggleSelect: function () {
    const { _id, toggleSelect } = this.props;
    toggleSelect(_id);
  },

  handleMouseOver: function () {
    const { _id, onMouseOver } = this.props;
    onMouseOver(_id);
  },

  handleMouseOut: function () {
    const { _id, onMouseOut } = this.props;
    onMouseOut(_id);
  },

  renderCheckbox: function () {
    const { _id, selected } = this.props;
    return (
      <label className='form__option form__option--custom-checkbox'>
        <input
          type='checkbox'
          name={ `road-${_id}--checkbox` }
          id={ `road-${_id}--checkbox` }
          value={ `road-${_id}` }
          onChange={ this.toggleSelect }
          checked={ selected }
        />
        <span className='form__option__ui'></span>
        <span className='form__option__text visually-hidden'><T>Selected</T></span>
      </label>
    );
  },

  renderRadio: function () {
    const { _id, selected } = this.props;
    return (
      <label className='form__option form__option--custom-radio'>
        <input
          type='radio'
          name='road-group--radio'
          id={`road-${_id}--radio`}
          value={`road-${_id}`}
          onChange={ this.toggleSelect }
          checked={ selected }
        />
        <span className='form__option__ui'></span>
        <span className='form__option__text visually-hidden'><T>Selected</T></span>
      </label>
    );
  },

  render: function () {
    const { vpromm, language, type, isHighlighted, province } = this.props;

    return (
      <li className='road-list__item' onMouseOver={ this.handleMouseOver } onMouseOut={ this.handleMouseOut }>
        <article className={`road ${isHighlighted ? 'road--highlight' : ''}`} id='road-{_id}'>
          <header className='road__header'>
            <div className='road__headline'>
              <h1 className='road__title'>{ vpromm || translate(language, 'No ID')}</h1>
              { vpromm && <p className='road__subtitle'>{province.name_en}</p> }
            </div>
            <div className='road__h-actions'>
              { type === 'checkbox' && this.renderCheckbox() }
              { type === 'radio' && this.renderRadio() }
            </div>
          </header>
        </article>
      </li>
    );
  }
});

module.exports = TaskListItem;
