import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import App from '../App';
import Authorize from '../components/auth';
import Login from '../components/login';

it('renders App without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('renders Login without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Login />, div);
});

describe('Authorize Component', () => {
  beforeEach(() => {
    // Stupidly complicated mock so fetch works in the test
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
    await wrapper.instance().authorizeGithub(properties.search)
    expect(localStorage.getItem('authToken')).toBe('testAuthToken');
  });
})
