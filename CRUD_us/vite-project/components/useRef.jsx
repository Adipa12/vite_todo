import { useState, useRef, useEffect } from "react"
import axios from "axios"
import "../style/todo-container.css"

export const UseRef = () => {

     let URL ="https://ferc-mock-default-rtdb.asia-southeast1.firebasedatabase.app/todos"
    const todo = useRef("")
    const userName = useRef("")
    const email = useRef("")
    const admin = useRef(false)

    let [data, setData] = useState({})    // here we use the useState for getting the data from database
   const [flag,setFlag] = useState(false)

    function handleSubmit(e){
        e.preventDefault()
        let obj = {
            todo : todo.current.value,
            userName : userName.current.value,
            email : email.current.value,
            admin : admin.current.checked
        }
        console.log(obj);

        axios.post(`${URL}.json`, obj)
        .then(()=>{
            todo.current.value = ""
            userName.current.value = ""
            email.current.value = ""
            admin.current.checked = false

            alert("data saved in db")
            todo.current.focus()
            setFlag(!flag);
        })
        .catch(err=>console.log("error to save data:",err));

    }
function handleUpdate(id){
    let todo = prompt("update the todo")
    let user = prompt("update the user")
    let email = prompt("update the email")
    let obj ={
        todo,
        user,
        email
    }

    axios.patch(`${URL}/${id}.json`, obj)
    .then(()=>{
        alert("todo list updated")
        setFlag(!flag)
    })
    .catch(error=> console.log("error updating todos:",error)); // Error handling
}
function handleDelete(id){
    axios.delete(`${URL}/${id}.json`)
    .then(()=>{
        alert("todo data deleted")
        setFlag(!flag)
    })
    .catch(err=>console.log("error to deleting:",err));
}

    // here i use the eseEffect to keep focus on my todo input box on page load
    useEffect(()=>{
        todo.current.focus()

        axios.get(`${URL}.json`)
        .then((res)=>{
            setData(res.data)
        })
        .catch(error=> console.error("Error fetching data:",error));
    },[flag])


    return (
        <>
        <form onSubmit={handleSubmit}>
        <h2>Todo List With useRef conditions</h2>
        <input ref={todo} placeholder="Enter the todos" />
        <input ref={userName} placeholder="Enter UserName" />
        <input ref={email} placeholder="Enter EmailId" />
        <input type="checkbox" ref={admin} placeholder="IsAdmin" />
        <input type="submit" />
        </form>
        <div>
             {/* if data get in object form and to convert it to array use object.entries */}
            {
                data && typeof data === "object" && Object.entries(data).map(([id, value], i, array)=>{
                    return (
                        <div key={i} className="todo-container">
                             <p><b>Todo : </b>{value.todo}</p>
                             <p><b>Username : </b>{value.user}</p>
                             <p><b>Email : </b>{value.email}</p>
                             {
                                value.admin ?
                                <div>
                                    <button onClick={()=>handleUpdate(id)}>Update</button>
                                    <button onClick={()=>handleDelete(id)}>Delete</button>
                                </div>
                                :
                                <h3>Read Only</h3>
                             }
                        </div>
                    )

                })
            }
        </div>
        </>
    )
}