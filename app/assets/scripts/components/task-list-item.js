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
    mode: React.PropTypes.string,
    language: React.PropTypes.string,
    selected: React.PropTypes.bool,
    toggleSelect: React.PropTypes.func,
    onMouseover: React.PropTypes.func,
    onMouseout: React.PropTypes.func
  },

  toggleSelect: function() {
    const { _id, toggleSelect } = this.props;
    toggleSelect(_id);
  },

  render: function() {
    const { _id, vpromm, language, mode } = this.props;
    return (
      <li className='road-list__item'>
        <article className='road' id='road-{_id}'>
          <header className='road__header'>
            <div className='road__headline'>
              <h1 className='road__title'>{ vpromm || translate(language, 'No ID')}</h1>
            { vpromm &&
              <p className='road__subtitle'>Fixme: Get Province</p>
            }
            </div>
            <div className='road__h-actions'>
            <label className='form__option form__option--custom-checkbox'>
              <input type='checkbox' name='road-{ _id }--checkbox' id='road-{ _id }--checkbox' value='road-{ _id }' onChange={this.toggleSelect} />
              <span className='form__option__ui'></span>
              <span className='form__option__text visually-hidden'><T>Selected</T></span>
            </label>
            </div>
          </header>
        </article>
      </li>
    );
  }
})

module.exports = TaskListItem;
