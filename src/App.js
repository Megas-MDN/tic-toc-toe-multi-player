import { collection, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
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
  const [winner, setWinner] = useState(false);

  const blocos = useRef(null);
  // console.log('blocos', blocos.current.childNodes[0].firstChild.textContent);

  // 012, 345, 678
  // 036, 147, 258
  // 048, 246

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
      setWinner(arrDBBlocks[0].win);
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

  const getCombinations = () => {
      // 012, 345, 678
  // 036, 147, 258
  // 048, 246
    const combinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [0,4,8], [2,5,8],[2,4,6]]

    const values = blocos.current.childNodes;
    const playerX = [];
    const playerO = [];

    values.forEach((e, i) => {
      if (e.textContent === 'X') playerX.push(i)
      if (e.textContent === 'O') playerO.push(i);
      // console.log('values', e.textContent)
    })

    console.log(combinations.includes(playerX || playerO))

    combinations.forEach(([i, j, k]) => {
      if (playerX.includes(i) && playerX.includes(j) && playerX.includes(k)) {
        console.log('player X wins');
         updateDoc(doc(db, 'player', player.id), {
          win: true,  
        })
      }

      if (playerO.includes(i) && playerO.includes(j) && playerO.includes(k)) {
        console.log('player O wins');
        updateDoc(doc(db, 'player', player.id), {
          win: true,  
        })
      }
    } )

    console.log('players:', playerX, playerO);
  };

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
    // console.log(player);
    
    getCombinations();

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
    setWinner(false);
    await updateDoc(doc(db, 'player', player.id), {
      turn: 'X',
      win: false,  
    })
  }

  return (
    <div>
      <h1>{winner && `The Player ${ player.turn === 'X' ? 'O' : 'X'} wins.`}</h1>
      <div className='btns-container'>
        <h1>{`${player.turn} to play`}</h1>
        <button type='button' onClick={resetAll}>Reset All</button>
      </div>
      <div  className="Toe-container" ref={ blocos }>
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
