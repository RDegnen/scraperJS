import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import App from '../App';
import Authorize from '../components/auth/auth';

it('renders App without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

describe('Checking App state', () => {
  beforeEach(() => {
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

  // it('updates isAuthorized state', async () => {
  //   const appWrapper = shallow(<App />);
  //   const spy = jest.spyOn(appWrapper.instance(), 'setAuthorized')
  //   const authWrapper = shallow(<Authorize location={ properties } setAuthorized={ spy }/>, { disableLifecycleMethods: true });
  //   await authWrapper.instance().authorizeGithub(properties.search);
  //   expect(spy).toHaveBeenCalled();
  //   expect(appWrapper.state('isAuthorized')).toBe(true);
  // });
})
