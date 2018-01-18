import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import JobListings from '../components/listings/jobListings';

describe('Job listings', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => {
      const mockListings = {
        Items: [
          { jobTitle: { S: 'Software Dev', },
            link: { S: 'http://nowhere.io', },
            listingId: { S: '123456', },
            sourceSite: { S: 'craigslist', },
            listingDate: { S: '454354095843', },
          },
          { jobTitle: { S: 'Python Engineer', },
            link: { S: 'http://nowhere.io', },
            listingId: { S: '7328732', },
            sourceSite: { S: 'indeed', },
            listingDate: { S: '897877832', },
          },
          { jobTitle: { S: 'Java Engineer', },
            link: { S: 'http://nowhere.io', },
            listingId: { S: '43853475', },
            sourceSite: { S: 'indeed', },
            listingDate: { S: '897877832', },
          },
        ]
      }
      return new Promise((resolve) => {
        resolve({
          authToken: 'testAuthToken',
          json: function() {
            return new Promise((resolve) => {
              resolve(mockListings);
            })
          },
        });
      })
    });
  });

  it('renders JobListings without crashing', async () => {
    const wrapper = shallow(<JobListings />, { disableLifecycleMethods: true });
    await wrapper.instance().getAllJobListings();
    expect(wrapper.state('jobListings')).toHaveLength(3);
    expect(wrapper.state('filteredListings')).toHaveLength(3);
  });

  it('filters listings by site', async () => {
    const mockEvent = {
      target: { value: 'indeed' },
      preventDefault: function() { console.log('SUP, FAKE EVENT HERE') },
    }
    const wrapper = shallow(<JobListings />, { disableLifecycleMethods: true });
    await wrapper.instance().getAllJobListings();
    wrapper.find('#indeed-filter-btn').simulate('click', mockEvent);
    expect(wrapper.state('filteredListings')).toHaveLength(2);
  });

  it('filters listings by job title', async () => {
    const mockEvent = {
      target: { value: 'python' },
      preventDefault: function() { console.log('SUP, FAKE EVENT HERE') },
    }
    const wrapper = shallow(<JobListings />, { disableLifecycleMethods: true });
    await wrapper.instance().getAllJobListings();
    wrapper.instance().inputFilter(mockEvent);
    expect(wrapper.state('filteredListings')).toHaveLength(1);
  });
})
