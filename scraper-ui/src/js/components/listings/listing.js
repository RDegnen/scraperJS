import React from 'react';

function Listing(props) {
  return (
    <div>
      <h3>{props.listing.jobTitle.S} - <a href={props.listing.link.S}>{props.listing.link.S}</a></h3>
      <h4>{`Source: ${props.listing.sourceSite.S}`}</h4>
    </div>
  )
}

export default Listing;
