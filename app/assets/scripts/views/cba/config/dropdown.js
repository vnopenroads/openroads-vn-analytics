'use strict';
import React from 'react';
import { Form } from 'react-bootstrap';

export const FormDropdown = ({ options, label, description, onChange }) => {

    let optFn = (e) => { return <option key={e['id']} value={e['id']}>{e['name']}</option> }
    let labelC = label ? <Form.Label>{label}</Form.Label> : "";
    let descriptionC = description ? <Form.Text className="text-muted fw-lighter"> {text} </Form.Text> : "";

    return (
        <div className="pl-5">
            {labelC}
            <Form.Select aria-label="Select CBA Configuration" onChange={onChange}>
                {options.map(optFn)}
            </Form.Select>
            {descriptionC}
        </div>

    )
}
