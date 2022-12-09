import React from 'react';

function Block({player, handleClick, id, gridid, disabled, name}) {
  // const [content, setContent] = useState('');
  // const [disabled, setDisabled] = useState(false);

  return <div className='block-container'>
    <button 
    type='button'  onClick={() => {
      // setDisabled(true);
      // setContent(player);
      handleClick({id, gridid});
    }}
    disabled={disabled}
    id={gridid}
    name={name}
    >{player}</button>
  </div>;
}

export default Block;
