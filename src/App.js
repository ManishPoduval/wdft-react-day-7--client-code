import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNav from './components/MyNav';
import { Route, Switch, withRouter } from 'react-router-dom';
import TodoList from './components/TodoList'
import axios from 'axios';
import config from './config'
import TodoDetail from './components/TodoDetail';
import AddForm from './components/AddForm'
import EditForm from './components/EditForm';
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import MyMap from './components/MyMap'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./components/CheckoutForm";


class App extends Component {

  state = {
    todos: [],
    loggedInUser: null,
    error: null,
  }

  // Make sure all the initial data that you show to the user is fetched here
  componentDidMount(){
    axios.get(`${config.API_URL}/api/todos`)
      .then((response) => {
        console.log(response.data)
        this.setState({ todos: response.data})
      })
      .catch(() => {
        console.log('Fecthing failed')
      })

    if (!this.state.loggedInUser) {
      axios.get(`${config.API_URL}/api/user`, {withCredentials: true})
        .then((response) => {
            this.setState({
              loggedInUser: response.data
            })
        })
        .catch(() => {

        })
    }  
  }

  handleSubmit = (event) => {
    event.preventDefault()
    let name = event.target.name.value
    let description = event.target.description.value

    //1. Make an API call to the server side Route to create a new todo
    axios.post(`${config.API_URL}/api/create`, {
      name: name,
      description: description,
      completed: false,
    })
      .then((response) => {
          // 2. Once the server has successfully created a new todo, update your state that is visible to the user
          this.setState({
            todos: [response.data, ...this.state.todos]
          }, () => {
            //3. Once the state is update, redirect the user to the home page
            this.props.history.push('/')
          })

      })
      .catch((err) => {
        console.log('Create failed', err)
      })
 }

 handleDelete = (todoId) => {

  //1. Make an API call to the server side Route to delete that specific todo
    axios.delete(`${config.API_URL}/api/todos/${todoId}`)
      .then(() => {
         // 2. Once the server has successfully created a new todo, update your state that is visible to the user
          let filteredTodos = this.state.todos.filter((todo) => {
            return todo._id !== todoId
          })

          this.setState({
            todos: filteredTodos
          }, () => {
            this.props.history.push('/')
          })
      })
      .catch((err) => {
        console.log('Delete failed', err)
      })

 }

 handleEditTodo = (todo) => {
    axios.patch(`${config.API_URL}/api/todos/${todo._id}`, {
      name: todo.name,
      description: todo.description,
      completed: todo.completed,
    })
      .then(() => {
          let newTodos = this.state.todos.map((singleTodo) => {
              if (todo._id === singleTodo._id) {
                singleTodo.name  = todo.name
                singleTodo.description = todo.description
              }
              return singleTodo
          })
          this.setState({
            todos: newTodos
          }, () => {
            this.props.history.push('/')
          })

          
      })
      .catch((err) => {
        console.log('Edit failed', err)
      })

 }

 handleSignUp = (event) => {
    event.preventDefault()
    let user = {
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value
    } 

    axios.post(`${config.API_URL}/api/signup`, user)
      .then((response) => {
          this.setState({
            loggedInUser: response.data
          }, () => {
            this.props.history.push('/')
          })
      })
      .catch((err) => {
          this.setState({
            error: err.response.data
          })
      })
 }

 handleSignIn = (event) => {
  event.preventDefault()
  let user = {
    email: event.target.email.value,
    password: event.target.password.value
  } 

  axios.post(`${config.API_URL}/api/signin`, user, {withCredentials: true})
    .then((response) => {
        this.setState({
          loggedInUser: response.data
        }, () => {
          this.props.history.push('/')
        })
    })
    .catch((err) => {
        console.log('Something went wrong', err)
    })
 }

 handleLogout = () => {
  
  axios.post(`${config.API_URL}/api/logout`, {}, {withCredentials: true})
  .then(() => {
      this.setState({
        loggedInUser: null
      }, () => {
        this.props.history.push('/')
      })
  })

 }


  render() {
    const {todos, loggedInUser, error} = this.state
    console.log(loggedInUser)
    const promise = loadStripe("pk_test_51HJ0c0BfOEj3QZ8feuSBtbYIRg1Jz8vYESZmvp1SweikDC6I0M4OkpHmZjwj2A7qXVayZr5fS07Sz9mBZZb1O0fA00GrlcvlMN");


    return (
      <div>
        <MyNav onLogout={this.handleLogout} user={loggedInUser}/>
        <h1>Shopping List</h1>
        {/* <Elements stripe={promise}>
          <CheckoutForm />
        </Elements> */}
        {/* Invoke Map here */}
        {/* <MyMap /> */}

        <Switch>
            <Route exact path="/" render={() => {
                return <TodoList todos={todos} />
            }} />
            <Route  path="/todos/:todoId" render={(routeProps) => {
                return <TodoDetail  user={loggedInUser} onDelete={this.handleDelete} {...routeProps} />
            }} />
             <Route path="/add-form" render={() => {
                return <AddForm onAdd={this.handleSubmit} />
            }} />
            <Route  path="/todo/:todoId/edit" render={(routeProps) => {
                return <EditForm onEdit={this.handleEditTodo} {...routeProps}/>
            }} />
            <Route  path="/signin"  render={(routeProps) => {
              return  <SignIn onSignIn={this.handleSignIn} {...routeProps}  />
            }}/>
            <Route  path="/signup"  render={(routeProps) => {
              return  <SignUp error={error} onSignUp={this.handleSignUp} {...routeProps}  />
            }}/>
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)







