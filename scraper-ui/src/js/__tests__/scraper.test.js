import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import Scraper from '../components/scraper/scraper';

describe('Scraper', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolve({
          authToken: 'testAuthToken',
          source: 'craigslist',
          json: function() {
            return new Promise((resolve) => {
              resolve('Listings successfully written to dynamo');
            })
          },
        });
      })
    })
  })

  it('Runs the Craigslist scraper methods successfully', () => {
    const mockEvent = {
      target: { value: 'craigslist' },
      preventDefault: function() { console.log('SUP, FAKE EVENT HERE') },
    }
    const spy = jest.spyOn(Scraper.prototype, 'scrape');
    const wrapper = shallow(<Scraper />);
    wrapper.find('#scraper-form').simulate('submit', mockEvent);
    expect(spy).toHaveBeenCalled();
  })
})
