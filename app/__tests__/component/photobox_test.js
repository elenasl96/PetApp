import React from 'react';
import PhotoBox from '../../Components/Custom/PhotoBox';
import Adapter from 'enzyme-adapter-react-16';
import {shallow,mount,configure} from 'enzyme';

let wrapper;

configure({adapter: new Adapter()});

beforeAll(() =>{
    var isUpdate = false;
    var visible = true;
    wrapper = shallow(
        <PhotoBox isUpdate={isUpdate} visible={visible} />);   
});

it('should render photobox correctly' , async () => {
   expect(wrapper).toMatchSnapshot();
})

it('should set photobox state correctly' , async () => {  //tests that photobox is shown 
   expect(wrapper.state('visible')).toBeTruthy();
})