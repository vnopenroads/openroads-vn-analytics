'use strict';
import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { InfoCircle } from 'react-bootstrap-icons';

export default function HelpOverlay(props) {
    if (!props.helpText) { return props.children || ""; }
    var innerElement = props.children || <InfoCircle className='float-right' size={12} />;
    var helpOverlay = <Popover > <Popover.Body> {props.helpText} </Popover.Body> </Popover>;
    return <OverlayTrigger trigger={["hover", "focus"]} placement={props.placement || "right"} overlay={helpOverlay}>
        {innerElement}
    </OverlayTrigger>;
}