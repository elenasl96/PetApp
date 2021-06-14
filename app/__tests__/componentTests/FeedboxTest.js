import React from 'react';
import FeedBox from '../../components/custom/FeedBox';
import Adapter from 'enzyme-adapter-react-16';
import {shallow,mount,configure} from 'enzyme';
import Feed from '../../firebase/database/objects/Feed';

let wrapper;

configure({adapter: new Adapter()});

beforeAll(() =>{
    feeds = [ new Feed("title","text","Age")
            ];
    wrapper = shallow(
        <FeedBox feeds={feeds}  />);   
});

it('should render feedbox correctly' , async () => {
   expect(wrapper).toMatchSnapshot();
})

it('should set state correctly' , async () => {
    expect(wrapper.state('feeds')).toHaveLength(1);
 })

