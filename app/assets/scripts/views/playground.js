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

              <div className='map__controls map__controls--top-right'>

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
                        <ul className='road-list'>
                          <li className='road-list__item'>
                            <article className='road'>
                              <header className='road__header'>
                                <div className='road__headline'>
                                  <h1 className='road__title'>213TX00018</h1>
                                  <p className='road__subtitle'>Thanh Hoa, Hau Loc</p>
                                </div>
                                <div className='road__h-actions'>
                                  <p>Action</p>
                                </div>
                              </header>
                            </article>
                          </li>
                        </ul>
                      </div>
                    </section>
                  </div>
                  <footer className='panel__footer'>
                    <div className='panel__f-actions'>
                      <button type='button' className='pfa-secondary' title='Jump to next task'><span>Skip task</span></button>
                      <button type='button' className='pfa-primary' title='Continue with the workflow'><span>Continue</span></button>
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
