import React from "react"
import Auth from "../utils/auth"

import "./app.css"

const auth = new Auth()

const MeetupContext = React.createContext()
const UserContext = React.createContext()

const initialState = {
  meetup: {
    title: "Gatsby Meetup",
    date: Date(),
    attendees: ["Jaykay", "Tolu", "William", "Ola"],
  },
  user: {
    name: "Idris",
  },
}

const reducer = (state, action) => {
  switch (action.type) {
    case "subscribeUser":
      return {
        ...state,
        attendees: [...state.attendees, action.payload],
        subscribed: true,
      }
    case "unSubscribeUser":
      return {
        ...state,
        attendees: state.attendees.filter(
          attendee => attendee !== action.payload
        ),
        subscribed: false,
      }

    case "loginUser":
      return {
        ...state,
        isAuthenticated: action.payload.authenticated,
        name: action.payload.user.name,
      }

    default:
      return state
  }
}

const UserContextProvider = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState.user)
  auth.handleAuthentication().then(() => {
    dispatch({
      type: "loginUser",
      payload: {
        authenticated: true,
        user: auth.getProfile(),
      },
    })
  })
  return (
    <UserContext.Provider
      value={{
        ...state,
        handleLogin: auth.signIn,
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}

const MeetupContextProvider = ({ user, ...props }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState.meetup)
  return (
    <MeetupContext.Provider
      value={{
        ...state,
        handleSubscribe: () =>
          dispatch({ type: "subscribeUser", payload: user.name }),
        handleUnSubscribe: () =>
          dispatch({ type: "unSubscribeUser", payload: user.name }),
      }}
    >
      {props.children}
    </MeetupContext.Provider>
  )
}

const App = () => {

    return (
        <UserContextProvider>
            <UserContext.Consumer>
            {user => (
                <MeetupContextProvider user={user}>
                <MeetupContext.Consumer>
                    {meetup => (
                    <div className="app__container">
                        <h1 className="app__title">{meetup.title}</h1>
                        <span className="app__date">{meetup.date}</span>
                        <div>
                        <h2 className="app__attendees">{`Attendees (${meetup.attendees.length})`}</h2>
                        <ol className="app__list">
                          {meetup.attendees.map(attendant => (
                            <li className="app__list--name" key={attendant}>{attendant}</li>
                          ))}
                        </ol>
                        <div>
                            {user.isAuthenticated ? (
                            !meetup.subscribed ? (
                                <button className="app__button subscribe" onClick={meetup.handleSubscribe}>
                                Subscribe
                                </button>
                            ) : (
                                <button className="app__button unsubscribe" onClick={meetup.handleUnSubscribe}>
                                Unsubscribe
                                </button>
                            )
                            ) : (
                            <button className="app__button login" onClick={user.handleLogin}>Login</button>
                            )}
                        </div>
                        </div>
                    </div>
                    )}
                </MeetupContext.Consumer>
                </MeetupContextProvider>
            )}
            </UserContext.Consumer>
        </UserContextProvider>
    )
}
  

export default App
