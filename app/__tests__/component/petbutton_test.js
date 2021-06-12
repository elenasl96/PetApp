import React from 'react';
import PetButton from '../../Components/Buttons/PetButton';
import Adapter from 'enzyme-adapter-react-16';
import {shallow,mount,configure} from 'enzyme';

let wrapper;

configure({adapter: new Adapter()});

beforeEach(() =>{
    var isEditable = true;
    var isAdoptable = true;
    var pid = "0dyQVP3GOGDKeMxuEBuA";
    pets = ["VPDkNUwktLgcANzdqBnu"];
    wrapper = shallow(
        <PetButton pets={pets} isEditable={isEditable} pid={pid} isAdoptable={isAdoptable} />);   
});

it('should render petbutton correctly' , async () => {
   expect(wrapper).toMatchSnapshot();
})