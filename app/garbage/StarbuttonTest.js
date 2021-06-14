import React from 'react';
import StarButton from '../components/buttons/StarButton';
import { render} from '@testing-library/react-native';

it("renders default elements",() => {
    const{getByTestId} = render(<StarButton uid={"gbfBtH1XbDMYice2pM0zV7caEjn2"} 
    pid={"DArO3zBY8IqHQzOPLY8t"} />); 
    getByTestId("StarButton.addFavorite");  // shows star not clicked 
 });



