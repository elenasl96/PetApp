import React from "react";
import { render, fireEvent } from '@testing-library/react-native';
import SignInScreen from "../screens/SignInScreen";

it("renders default elements",() => {
   const{getAllByText,getByPlaceholderText} = render(<SignInScreen />);
   expect(getAllByText("Sign In with email").length).toBe(1);
   getByPlaceholderText("Password");
   getByPlaceholderText("Email");
})

it("shows invalid message",() => {
   const{getByTestId,getByText} = render(<SignInScreen />);
   fireEvent.press(getByTestId("SignIn.Button"));
   getByText("Fill in all the fields");
})
