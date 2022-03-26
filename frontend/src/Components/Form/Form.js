import React from "react";
import { useMutation } from "@apollo/client";
import { FormButton, HeaderText } from "../StyledComponents";
import VoteBar from "./VoteBar";
import { setCookie } from "../../utils";
import { CREATE_SUBMISSION } from "../../utils/graphql";


export default function Form({ setOpen, setVoted, setSubmitterId }) {
  const [score, setScore] = React.useState(10);

  const [createSubmission] = useMutation(CREATE_SUBMISSION);

  const handleOnChange = (event, value) => {
    setScore(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createSubmission({
      variables: {
        score: score,
      },
    })
      .then((response) => {
        var expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        setCookie(
          "id",
          response.data.createSubmission._id,
          expiryDate.toGMTString()
        );
        setVoted(true);
        setSubmitterId(response.data.createSubmission._id);
      })
      .then(() => {
        setOpen(true);
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} data-testid="submit-form">
      <HeaderText>
        On a scale of 0 to 10, how likely are you to recommend Santosh Kalwar as
        Teacher?
      </HeaderText>
      <VoteBar score={score} handleOnChange={handleOnChange} />
      <div>
        <FormButton type="submit" color="primary" variant="contained" data-testid="submit-bttn">
          Submit
        </FormButton>
      </div>
    </form>
  );
}
