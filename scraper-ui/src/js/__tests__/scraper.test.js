import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import { TestScraper } from '../components/scraper/scraper';

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
      preventDefault: function() { console.log('SUP, FAKE SCRAPE EVENT HERE') },
    }
    const props = { classes: {} };
    const spy = jest.spyOn(TestScraper.prototype, 'scrape');
    const wrapper = shallow(<TestScraper {...props}/>);

    wrapper.find('#scraper-form').simulate('submit', mockEvent);

    expect(spy).toHaveBeenCalled();

    spy.mockReset();
    spy.mockRestore();
  })
})
