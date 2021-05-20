import React from 'react';
import StarButton from '../Components/Buttons/StarButton';
import Adapter from 'enzyme-adapter-react-16';
import {shallow,mount,configure} from 'enzyme';

let wrapper;
let mockAddFavorite;

configure({adapter: new Adapter()});

beforeEach(() =>{
    var uid = "gbfBtH1XbDMYice2pM0zV7caEjn2";
    var pid = "0dyQVP3GOGDKeMxuEBuA";
    mockAddFavorite = jest.fn();
    wrapper = shallow(
        <StarButton  pid={pid} uid={uid} addFavorite={mockAddFavorite} />);   
});

it('should render starbutton correctly' , async () => {
   expect(wrapper).toMatchSnapshot();
})

it('should set starbutton state correctly' , async () => {  //tests that photobox is shown 
    expect(wrapper.state('favorite')).toBeFalsy();
 })

 it("Click", () => {
    const button = getByTestId(wrapper, 'button_fav');
    fireEvent.click(button);
});
