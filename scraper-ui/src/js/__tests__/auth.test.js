import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import { MemoryRouter, withRouter } from 'react-router-dom'
import Authorize from '../components/auth/auth';
import Login from '../components/auth/login';
import Logout from '../components/auth/logout';

it('renders Login without crashing', () => {
  const div = document.createElement('div');
  const wrapper = shallow(<Login />);
  ReactDOM.render(<Login />, div);
  expect(wrapper.find('#github-auth-btn').exists()).toEqual(true);
});

describe('Authorize Component', () => {
  beforeEach(() => {
    // Need to mock fetch here and resolve with the data
    // expected in the response
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolve({
          authToken: 'testAuthToken',
          json: function() {
            return new Promise((resolve) => {
              resolve(this);
            })
          },
        });
      })
    });
  });

  const properties = {
     search: 'auth?code=testcode&state=teststate',
  };

  it('renders Authorize without crashing', async () => {
    const wrapper = shallow(<Authorize location={ properties }/>, { disableLifecycleMethods: true });
    await wrapper.instance().authorizeGithub(properties.search);
    expect(localStorage.getItem('authToken')).toBe('testAuthToken');
  });
})

describe('Logout Component', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'testAuthToken');
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolve('User Logged Out');
      })
    });
  });
  // Had to first call mount and then find child component as a string
  // to be able to access an instance of it
  it('Removes the token from localStorage', async () => {
    const wrapper = mount(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );
    const componentWrapper = wrapper.find('Logout');
    await componentWrapper.find('#sign-out-btn').simulate('click');
    expect(localStorage.getItem('authToken')).toBe(null);
    // Example for getting a child components instance for reference
    // const component = wrapper.find('Logout').instance();
    // const spy = jest.spyOn(component, 'logout');
  });
});
