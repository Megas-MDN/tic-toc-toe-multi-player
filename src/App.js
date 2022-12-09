import { collection, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import './App.css';
import './components/Block';
import Block from './components/Block';
import { db } from './firebase';

// const NUM_BLOCKS = 9;


function App() {
  // const [arrBlocks, setArrBlocks] = useState([]);
  const [player, setPlayer] = useState({});
  const [reset, setReset] = useState(false);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    // arrEmpty();
    // setArrBlocks([...arrEmpty()]);
    loadingPlayer();
    const showData = loadingData();
    return () => showData();
  },[]);

  useEffect(() => {
    console.log('apaga nao comedia')
    // setBlocks(arrEmpty());
  }, [reset]);

  const loadingData = () => {
    const q = query(collection(db, 'grid'));
    const showData = onSnapshot(q, (el) => {
      let arrDBBlocks = [];
      el.forEach((doc) => {
        arrDBBlocks.push({...doc.data(), id: doc.id})
      });
      // arrDBBlocks.forEach((el) => {
      //     updateDoc(doc(db, 'grid', el.id), {
      //     disabled: false,
      //     content: '',  
      //   })
      // })
      setBlocks(arrDBBlocks)
      console.log(arrDBBlocks);
    });

    return showData;
  }

  const loadingPlayer = () => {
    const q_player = query(collection(db, 'player'));
    const showDataPlayer = onSnapshot(q_player, (el) => {
      let arrDBBlocks = [];
      el.forEach((doc) => {
        arrDBBlocks.push({...doc.data(), id: doc.id})
      });
      // setBlocks(arrDBBlocks)
      setPlayer(arrDBBlocks[0]);
      console.log(arrDBBlocks);
    });
    return showDataPlayer;
  }

  // const arrEmpty = () => { // criação dinamica de blocks
  //   // let arr = [];
  //   // await deleteDoc(doc(db, 'grid',));
  //   for (let i = 0; i < NUM_BLOCKS; i += 1) {
  //     addDoc(collection(db, 'grid'), {
  //       content: '',
  //       disabled: false,
  //       gridid: i,
  //     });
  //   }
  //   // return arr;
  // }


  const handleClick = async ({id, _gridid}) => {
    await updateDoc(doc(db, 'grid', id), {
      disabled: true,
      content: player.turn,  
    })
    if (player.turn === 'X') {
      await updateDoc(doc(db, 'player', player.id), {
        turn: 'O',  
      })
    } else {
      await updateDoc(doc(db, 'player', player.id), {
        turn: 'X',  
      })
    }
    // console.log(player);
    console.log(player);
  }

  const resetAll = async () => {
    // setBlocks([]);
    blocks.forEach((el) => {
          updateDoc(doc(db, 'grid', el.id), {
          disabled: false,
          content: '',  
        })
      })
    setReset(!reset);
    await updateDoc(doc(db, 'player', player.id), {
      turn: 'X',  
    })
  }

  return (
    <div>
      <div className='btns-container'>
        <h1>{`${player.turn} to play`}</h1>
        <button type='button' onClick={resetAll}>Reset All</button>
      </div>
      <div  className="Toe-container">
    {
      blocks.map((_, i)=> <Block 
      key={blocks[i].id}
      id={blocks[i].id}
      gridid={i} 
      name={blocks[i].gridid}
      player={blocks[i].content}
      handleClick={handleClick}
      disabled={blocks[i].disabled}
      />)
    }
      </div>
    </div>
  );
}

export default App;
