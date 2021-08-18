import { useCallback } from "react";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

import { Container, Item } from "../components/core.js";

/**
 * Component for selecting an amount. Selection can happen from
 * either a number input or slider, which are both synced.
 *
 * @component
 * @example
 * let value = 0;
 * const setValue = val => value = val;
 * const sliderUnits = 'units';
 * const maxAmount = 3500;
 * return (
 *  <AmountSelectSlider
 *    value={value}
 *    setValue={setValue}
 *    sliderUnits={sliderUnits}
 *    maxAmount={maxAmount}
 *  />
 * )
 */
function AmountSelectSlider(props) {
  const { maxAmount, sliderUnits, value, setValue } = props;

  const handleMaxRequested = useCallback(() => {
    setValue(Number(maxAmount));
  }, [setValue, maxAmount]);

  const handleSliderChanged = useCallback(
    (event, newValue) => {
      const sliderVal = (newValue * maxAmount) / 100;
      setValue(Math.min(sliderVal.toFixed(4), maxAmount));
    },
    [setValue, maxAmount]
  );

  const handleInputChanged = useCallback(
    (event) => {
      console.log("InputChanged", event.target.value);
      setValue(event.target.value === "" ? "" : Number(event.target.value));
    },
    [setValue]
  );

  const handleBlur = useCallback(() => {
    if (value < 0) {
      setValue(0);
    } else if (value > maxAmount) {
      setValue(maxAmount);
    }
  }, [value, setValue, maxAmount]);

  return (
    <Container spacing={2} alignItems="center">
      <Item container xs={9} sm={10} justify="flex-end">
        <Item container xs={12} justify="flex-end">
          <Input
            value={value}
            onChange={handleInputChanged}
            onBlur={handleBlur}
            endAdornment={
              <InputAdornment position="end">{sliderUnits}</InputAdornment>
            }
            inputProps={{
              min: 0,
              max: maxAmount,
              step: maxAmount / 20,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Item>
        <Item container xs={12} sm={8} md={6} lg={6} xl={6} justify="flex-end">
          <Slider
            value={typeof value === "number" ? (value / maxAmount) * 100 : 0}
            onChange={handleSliderChanged}
            aria-labelledby="input-slider"
          />
        </Item>
      </Item>
      <Item xs={3} sm={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleMaxRequested}
        >
          Max
        </Button>
      </Item>
    </Container>
  );
}

AmountSelectSlider.propTypes = {
  /**
   * The largest value that can be selected.
   */
  maxAmount: PropTypes.number,
  /**
   * The variable to access the selected value from.
   * Often a state variable.
   */
  value: PropTypes.number.isRequired,
  /**
   * The function for setting the selected variable.
   * Often a setState method.
   */
  setValue: PropTypes.func.isRequired,
  /**
   * The string representing the units of the amount.
   */
  sliderUnits: PropTypes.string,
};

AmountSelectSlider.defaultProps = {
  maxAmount: 100,
  sliderUnits: "",
};

export default AmountSelectSlider;
