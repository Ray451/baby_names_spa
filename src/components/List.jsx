import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { useState, useEffect, useRef } from "react";
import { babyAdded, babyUpdated, fetchList,babyUpdatedCross } from "../store/babyListSlice";
export function List() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const { babies, babyError } = useSelector((state) => state.babyList);
  const { list_id } = useParams()
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  useEffect(()=>{
    dispatch(fetchList(list_id))
  },[])
  const handleName = (e) => setName(e.target.value);
  const handleAdd = () => {
    console.log('--handleadd--', name)
    if(name === "")  setError("Need to input correctly");
    else if (/^([a-zA-Z]+\s)*[a-zA-Z]+$/g.test(name) === false) 
    {
        console.log("falsename")
        setError('You need to input correct name');
    }
    else {
        dispatch(
            babyAdded({
                babyName: name,
                listID: list_id
            })
        );
    }
    setName("");
  }
  const handleSort = () => {
    let _babies = [...babies];
    _babies.sort(function(a,b) {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
    });
    dispatch(
        babyUpdated([..._babies])
    );
  }
  const handleMove = () => {
    let _babies = [...babies];
    const draggedItemContent = _babies.splice(dragItem.current, 1)[0];
    _babies.splice(dragOverItem.current, 0, draggedItemContent)
    dispatch(
        babyUpdated([..._babies])
    );
    dragItem.current = null;
    dragOverItem.current = null;
  }
  return (
    <div className="container">
        <div className="input-form">
            <input type="text" value={name} onChange={handleName} />
            <button onClick={handleAdd}>Add Baby</button>
            <button onClick={handleSort}>Sort</button> 
        </div>
     
        {error && <p>{error}</p>}
        {babyError && <p>{babyError}</p>}
        
        <div className="list-container">
            {babies.map(((baby, index) => {
                return (
                    <div
                        key={index}
                        className="list-item"
                        draggable
                        onDragStart={e => dragItem.current = index }
                        onDragEnter={e => dragOverItem.current = index}
                        onDragEnd={handleMove}
                        onClick = {() => {
                            dispatch(babyUpdatedCross({position:index}));
                        }}
                        >
                       <h3 className={!baby.status ? 'cross' : ''}>{baby.name}</h3>
                    </div>
                )
            }))}
        </div>
    </div>
  );
}