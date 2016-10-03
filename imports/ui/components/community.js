import React from 'react';
import { Row, Col, ListGroupItem, FormControl, Button } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { updateCommunity, removeCommunity } from '../../api/communities/methods.js';

const handleUpdateCommunity = (documentId, event) => {
  const name = event.target.value.trim();
  if (name !== '' && event.keyCode === 13) {
    updateCommunity.call({
      _id: documentId,
      update: { name },
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Community updated!', 'success');
      }
    });
  }
};

const handleRemoveCommunity = (documentId, event) => {
  event.preventDefault();
  // this should be replaced with a styled solution so for now we will
  // disable the eslint `no-alert`
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure? This is permanent.')) {
    removeCommunity.call({
      _id: documentId,
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Community removed!', 'success');
      }
    });
  }
};

export const Community = ({ community }) => (
  <div className='ui image big label'>
  <img src={"/communities_logo/"+community.picture} />
{community.name}

Ceci est ma super community détail!

</div>);
