import React from "react";
import c from 'classnames';
// import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/modal'
import config from '../../config'

import { Button, Modal } from 'react-bootstrap';

class TakeSnapshotModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            provinces: [],
            province: 0,
            snapshotName: ""
        }

        this.onSaveClick = this.onSaveClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
    }

    onCloseClick() {
        this.setState({ show: false });
    }

    onSaveClick() {
        this.setState({ show: false });
        console.log(this.state);

        var body = { name: this.state.snapshotName };
        if (this.state.province > 0) {
            body.province_id = this.state.province;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(body)
        };
        fetch(`${config.api}/cba/roads/snapshots/take`, requestOptions)
            .then(response => response.json())
            .then(data => { console.log(data); this.props.onSnapshotTaken(); });
    }

    onValueChange(what, event) {
        this.setState({ [what]: event.target.value });
    }

    componentDidMount() {
        fetch(`${config.api}/admin/province/units`)
            .then((res) => res.json())
            .then((res) => this.setProvinceOptions(res));
    }

    setProvinceOptions(res) {
        this.setState({ provinces: res.province });
    }

    render() {
        const processing = false;
        var provinceOptions_ = this.state.provinces.map((e) => { return <option key={e.id} value={e.id}>{e.name_en}</option> });
        var provinceOptions = [<option key={-1} value={- 1}> All</option >, ...provinceOptions_]

        return (
            <Modal show={this.state.show}
                size="lg"
                centered
                onHide={this.onCloseClick}>
                <Modal.Header closeButton>
                    <Modal.Title>Take an Asset Snapshot</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className='form'>
                        <div className='inner'>
                            <fieldset className='form__fieldset'>
                                <legend className='form__legend'>
                                    Select a province to snapshot only a subset of the total road assets
                                </legend>
                                <div className='form__group'>
                                    <label className='form__label' htmlFor='province'>Province</label>
                                    <select id="province" name="province" className='form__control' onChange={this.onValueChange.bind(this, 'province')}>
                                        {provinceOptions}
                                    </select>
                                    <label className='form__label' htmlFor='snapshotName'>Snapshot Name</label>
                                    <input type='text' id='snapshotName' name='snapshotName' className='form__control'
                                        value={this.state.snapshotName}
                                        onChange={this.onValueChange.bind(this, 'snapshotName')} />
                                </div>
                            </fieldset>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.onCloseClick}>Cancel</Button>
                    <Button variant="primary" onClick={this.onSaveClick}>Create</Button>
                </Modal.Footer>
            </Modal>
        );
        return (
            <Modal
                id='snapshot-create-modal'
                className='modal--medium'
                onCloseClick={this.onCloseClick}
                revealed={this.props.revealed} >

                <ModalHeader>
                    <div className='modal__headline'>
                        <h1 className='modal__title'>Take Snapshot</h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <p>This is some body content</p>
                </ModalBody>
                <ModalFooter>
                    <button className={c('mfa-xmark', { disabled: processing })} disabled={processing} type='button' onClick={this.onCloseClick}><span>Cancel</span></button>
                    <button className={c('mfa-main mfa-tick', { disabled: processing })} disabled={processing} type='submit' onClick={this.onSave}><span>Save</span></button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default TakeSnapshotModal;