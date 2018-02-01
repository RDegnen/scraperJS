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
  // Have to call mount and get the child component because of material-ui's
  // withStyles
  it('renders JobListings without crashing', async () => {
    const wrapper = mount(<JobListings />, { disableLifecycleMethods: true });
    const componentWrapper = wrapper.find('JobListings').instance();
    await componentWrapper.getJobListings();
    expect(componentWrapper.state.jobListings.length).toBe(3);
    expect(componentWrapper.state.filteredListings.length).toBe(3);
  });

  it('filters listings by site', async () => {
    const wrapper = mount(<JobListings />, { disableLifecycleMethods: true });
    const componentWrapper = wrapper.find('JobListings').instance();
    await componentWrapper.getJobListings();
    componentWrapper.sourceSiteFilter('indeed');
    expect(componentWrapper.state.filteredListings.length).toBe(2);
  });

  it('filters listings by job title', async () => {
    const mockEvent = {
      target: { value: 'python' },
      preventDefault: function() { console.log('SUP, FAKE EVENT HERE') },
    }
    const wrapper = mount(<JobListings />, { disableLifecycleMethods: true });
    const componentWrapper = wrapper.find('JobListings').instance();
    await componentWrapper.getJobListings();
    componentWrapper.inputFilter(mockEvent);
    expect(componentWrapper.state.filteredListings.length).toBe(1);
  });
})
