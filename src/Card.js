import React from 'react';

const Card = React.forwardRef(({ item }, ref) => {
  return <div id={`${item.title}-${item.id}`} className="card" ref={ref}>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
    </div>;
});

export default Card;
