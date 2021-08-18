import { useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import { Container, Item } from "../components/core.js";

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default function TransactionStepper(props) {
  const {
    stepLabels,
    getStepContent,
    canProceed,
    canRevert,
    onReset,
    txState,
  } = props;

  const classes = useStyles();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentStep((prevStep) => prevStep + 1);
  }, [setCurrentStep]);

  const handleBack = useCallback(() => {
    setCurrentStep((prevStep) => prevStep - 1);
  }, [setCurrentStep]);

  const handleReset = useCallback(() => {
    onReset();
    setCurrentStep(0);
  }, [setCurrentStep, onReset]);

  return (
    <>
      <CardContent>
        <Container spacing={1}>
          <Item xs={12}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {stepLabels.map((label, i) => (
                <Step key={i}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Item>
          <Item xs={12}>
            <Divider variant="middle" />
          </Item>
          <Item xs={12}>
            <Typography className={classes.instructions}>
              {getStepContent(currentStep)}
            </Typography>
          </Item>
        </Container>
      </CardContent>
      <CardActions>
        <Button
          disabled={!canRevert(currentStep, txState)}
          onClick={handleBack}
          className={classes.backButton}
        >
          Back
        </Button>
        <Button
          disabled={!canProceed(currentStep, txState)}
          variant="contained"
          color="primary"
          onClick={
            currentStep === stepLabels.length - 1 ? handleReset : handleNext
          }
        >
          {currentStep === stepLabels.length - 1 ? "Finish" : "Next"}
        </Button>
      </CardActions>
    </>
  );
}
