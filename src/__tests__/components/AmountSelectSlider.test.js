import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

import AmountSelectSlider from "../../components/AmountSelectSlider.js";

describe("AmountSelectSlider", () => {
  let container;
  let value;
  let maxAmount = 1500;
  let sliderUnits = "coins";

  const setValue = (val) => (value = val);

  beforeEach(() => {
    container = document.createElement("div");
    value = 0;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    value = 0;
  });

  const render = (component) => ReactDOM.render(component, container);

  it("renders without any props", () => {
    act(() => {
      render(<AmountSelectSlider />);
    });
    const input = container.querySelector("input");
    const slider = container.querySelector("input[type='hidden']");
    expect(input.value).toBe("");
    expect(slider.value).toBe("0");
  });

  it("renders with all props", () => {
    act(() => {
      render(
        <AmountSelectSlider
          maxAmount={maxAmount}
          sliderUnits={sliderUnits}
          value={value}
          setValue={setValue}
        />
      );
    });
    const input = container.querySelector("input");
    const slider = container.querySelector("input[type='hidden']");
    expect(input.value).toBe("0");
    expect(slider.value).toBe("0");
  });
});
