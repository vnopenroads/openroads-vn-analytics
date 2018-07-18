'use strict';
import React from 'react';
import config from '../config';
import T from '../components/t';


var Playground = React.createClass({
  render: function () {
    return (
      <section className='inpage inpage--alt'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'><T>Playground</T></h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>

            <figure className='map'>

              <div className='map__controls map__controls--column-right'>

                <article className='panel task-panel'>
                  <header className='panel__header'>
                    <div className='panel__headline'>
                      <h1 className='panel__sectitle'>Task #408</h1>
                      <p className='panel__subtitle'><time dateTime='2018-07-15T16:00'>Updated 2 days ago</time></p>
                      <h2 className='panel__title'>Prepare workflow</h2>
                    </div>
                  </header>
                  <div className='panel__body'>

                    <section className='task-group'>
                      <header className='task-group__header'>
                        <h1 className='task-group__title'>Select action to perform</h1>
                      </header>
                      <div className='task-group__body'>
                        <form className='form task-group__actions'>
                          <div className='form__group'>
                            <label className='form__label visually-hidden'>Actions</label>
                            <select className='form__control'>
                              <option value='remove-duplicates'>Remove duplicates</option>
                              <option value='create-intersection'>Create intersection</option>
                            </select>
                          </div>
                        </form>
                      </div>
                    </section>

                    <section className='task-group'>
                      <header className='task-group__header'>
                        <h1 className='task-group__title'>Select roads to work on</h1>
                      </header>
                      <div className='task-group__body'>
                        <ul className='road-list'>
                          <li className='road-list__item'>
                            <article className='road' id='road-213TX00018'>
                              <header className='road__header'>
                                <div className='road__headline'>
                                  <h1 className='road__title'>213TX00018</h1>
                                  <p className='road__subtitle'>Thanh Hoa, Hau Loc</p>
                                </div>
                                <div className='road__h-actions'>
                                <label className='form__option form__option--custom-checkbox'>
                                  <input type='checkbox' name='road-213TX00018--checkbox' id='road-213TX00018--checkbox' value='road-213TX00018--checkbox' />
                                  <span className='form__option__ui'></span>
                                  <span className='form__option__text visually-hidden'>Selected</span>
                                </label>
                                </div>
                              </header>
                            </article>
                          </li>
                          <li className='road-list__item'>
                            <article className='road' id='road-213TX00019'>
                              <header className='road__header'>
                                <div className='road__headline'>
                                  <h1 className='road__title'>213TX00019</h1>
                                  <p className='road__subtitle'>Thanh Hoa, Hau Loc</p>
                                </div>
                                <div className='road__h-actions'>
                                <label className='form__option form__option--custom-checkbox'>
                                  <input type='checkbox' name='road-213TX00019--checkbox' id='road-213TX00019--checkbox' value='road-213TX00019--checkbox' />
                                  <span className='form__option__ui'></span>
                                  <span className='form__option__text visually-hidden'>Selected</span>
                                </label>
                                </div>
                              </header>
                            </article>
                          </li>
                        </ul>
                      </div>
                    </section>

                    <section className='task-group'>
                      <header className='task-group__header'>
                        <h1 className='task-group__title'>Select road to intersect with</h1>
                      </header>
                      <div className='task-group__body'>
                        <ul className='road-list'>
                          <li className='road-list__item'>
                            <article className='road' id='road-213TX00020'>
                              <header className='road__header'>
                                <div className='road__headline'>
                                  <h1 className='road__title'>213TX00020</h1>
                                  <p className='road__subtitle'>Thanh Hoa, Hau Loc</p>
                                </div>
                                <div className='road__h-actions'>
                                <label className='form__option form__option--custom-radio'>
                                  <input type='radio' name='road-group--radio' id='road-213TX00020--radio' value='road-213TX00020--radio' />
                                  <span className='form__option__ui'></span>
                                  <span className='form__option__text visually-hidden'>Selected</span>
                                </label>
                                </div>
                              </header>
                            </article>
                          </li>
                          <li className='road-list__item'>
                            <article className='road' id='road-213TX00020'>
                              <header className='road__header'>
                                <div className='road__headline'>
                                  <h1 className='road__title'>213TX00021</h1>
                                  <p className='road__subtitle'>Thanh Hoa, Hau Loc</p>
                                </div>
                                <div className='road__h-actions'>
                                <label className='form__option form__option--custom-radio'>
                                  <input type='radio' name='road-group--radio' id='road-213TX00021--radio' value='road-213TX00021--radio' />
                                  <span className='form__option__ui'></span>
                                  <span className='form__option__text visually-hidden'>Selected</span>
                                </label>
                                </div>
                              </header>
                            </article>
                          </li>
                        </ul>
                      </div>
                    </section>

                    <section className='task-group'>
                      <header className='task-group__header'>
                        <h1 className='task-group__title'>Select VPROMMID to Apply</h1>
                      </header>
                      <div className='task-group__body'>
                        <form className='form task-group__actions'>
                          <div className='form__group'>
                            <label className='form__label visually-hidden'>Actions</label>
                            <select className='form__control'>
                              <option value='vprommid-213TX00021'>213TX00021</option>
                              <option value='vprommid-213TX00022'>213TX00022</option>
                            </select>
                          </div>
                        </form>
                      </div>
                    </section>

                    <div className='prose task-prose'>
                      <p>2 roads were removed and submitted to the system for review.</p>
                      <p>Do you want to continue to work on this task or move to the next one?</p>
                    </div>

                  </div>
                  <footer className='panel__footer'>
                    <div className='panel__f-actions'>
                      <button type='button' className='pfa-secondary' title='Jump to next task'><span>Skip task</span></button>
                      <button type='button' className='pfa-primary' title='Continue to next step'><span>Continue</span></button>
                    </div>
                  </footer>
                </article>

              </div>

            </figure>

          </div>
        </div>
      </section>
    );
  }
});

module.exports = Playground;
