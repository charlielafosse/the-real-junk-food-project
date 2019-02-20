import React, { Component } from "react";
import { DRIVER, SUPPLIER } from "../../constants/userRoles.js";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import decode from "jwt-decode";
import Swal from "sweetalert2";
import Button from "../../styling/button.js";
import Input from "../../styling/form.js";
import FormStyle from "../../styling/fullForm.js";

class Form extends Component {
  state = {
    email: "",
    pin: "",
    userRole: DRIVER,
    loggedIn: false,
    redirectPath: ""
  };
  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const data = JSON.stringify(this.state);
    fetch("/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: data
    })
      .then(res => res.json())
      .then(returnedData => {
        if (returnedData.success === false) {
          Swal.fire({
            type: "error",
            title: "Incorrect login...",
            text: "Please try again!"
          });
        } else {
          localStorage.setItem("id_token", returnedData.token);
          Swal.fire({
            type: "success",
            title: "Successful Login!",
            text: "Woohoo"
          });
          const { userRole } = this.props.checkToken();
          this.setState({ loggedIn: true, redirectPath: userRole });
        }
      })
      .catch(err =>
        console.log(
          "Fetch error. Maybe check your node server is running?",
          err
        )
      );
  };

  render() {
    if (this.state.loggedIn && this.state.redirectPath === "Drivers") {
      return <Redirect to="/Drivers" />;
    } else if (this.state.loggedIn && this.state.redirectPath === "Suppliers") {
      return <Redirect to="/Suppliers" />;
    }
    return (
      <FormStyle>
        <label htmlFor="driver">
          <Input
            type="radio"
            name="userRole"
            id="driver"
            value={DRIVER}
            checked={this.state.userRole === DRIVER}
            onChange={this.handleChange}
          />
          Driver
        </label>
        <label htmlFor="supplier">
          <Input
            type="radio"
            name="userRole"
            id="supplier"
            value={SUPPLIER}
            checked={this.state.userRole === SUPPLIER}
            onChange={this.handleChange}
          />
          Supplier
        </label>
        <label htmlFor="email">Type your email here:</label>
        <Input
          type="email"
          id="email"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
          autoFocus
          required
        />
        <label htmlFor="pin">Type your PIN here:</label>
        <Input
          type="password"
          id="pin"
          name="pin"
          value={this.state.pin}
          onChange={this.handleChange}
          //suggested by React errors to include autoComplete attribute
          autoComplete="off"
          maxLength="4"
          required
        />
        <Link to={"/"}>
          <Button onClick={this.handleSubmit} type="submit">
            Submit
          </Button>
        </Link>
      </FormStyle>
    );
  }
}

export default Form;
