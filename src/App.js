import React, { Component } from 'react';
import { Post } from './components/Post/Post';
import { Button } from './components/Button/Button';
import { allPosts, sortingTypes } from './constants';
import { SortingContext, ThemeContext, UserContext } from './context';
import { BtnMenu } from './components/BtnMenu/BtnMenu';
import { PostsList } from './components/PostsList/PostsList';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Form } from './components/Form/Form';
import { Input } from './components/Input/Input';
import { SortingOptionsPanel } from './components/SortingOptionsPanel/SortingOptionsPanel';
import AddUserForm from './components/AddUserForm/AddUserForm';

import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      selectedPostId: allPosts[0].id,
      isPostHidden: false,
      usersList: []
    };
  }

  hidePost = () => {
    this.setState({
      isPostHidden: !this.state.isPostHidden
    });
  };

  saveInputValue = value => {
    this.setState({
      ...this.state,
      inputValue: value
    });
  };

  addUser = (newUser) => {
    const { usersList } = this.state;

    this.setState({
      usersList: [...usersList, newUser]
    })
  };

  onPostSelect = postId => {
    this.setState({
      selectedPostId: postId
    });
  };

  render() {
    return (
      <SortingContext.Consumer>
        {sortConfig => {
          const { sortType, onSortingChange, posts, addPost } = sortConfig;

          const { selectedPostId } = this.state;
          const neededIndex = posts.findIndex(
            item => item.id === selectedPostId
          );
          return (
            <ThemeContext.Consumer>
              {value => {
                console.log(value); // достаем значение темы из контекста и используем ниже в className
                return (
                  <div className={`App ${value}`}>
                    <div className="d-flex">
                      <div>
                        <Button label="HIDE POST!" onClick={this.hidePost}/>
                        <PostsList posts={posts} onPostSelect={this.onPostSelect}/>
                      </div>
                      <ErrorBoundary>
                        {!this.state.isPostHidden &&
                        neededIndex !== -1 && (
                          <Post post={posts[neededIndex]}/>
                        )}
                      </ErrorBoundary>
                    </div>

                    {/* todo: обратите внимание - пример инпута (controlled input) */}
                    <div className="card input-example">
                      <label className="custom-label">Input example:</label>
                      <Input
                        value={this.state.inputValue}
                        onValueChange={this.saveInputValue}
                      />
                      <p>{this.state.inputValue}</p>
                    </div>
                    <div>
                      {
                        this.state.usersList.map((user) => {
                          return <div key={user.id}>{`${user.name} ${user.lastName}`}</div>
                        })
                      }
                    </div>
                    <AddUserForm addUser={this.addUser}/>

                    <UserContext.Consumer>
                      {({ user }) => (
                        <Form
                          addPost={addPost}
                          user={user}
                          post={posts[neededIndex]}
                        />
                      )}
                    </UserContext.Consumer>

                  </div>
                );
              }}
            </ThemeContext.Consumer>
          );
        }}
      </SortingContext.Consumer>
    );
  }
}

export default App;
