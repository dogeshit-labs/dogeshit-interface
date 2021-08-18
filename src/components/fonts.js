import Box from "@material-ui/core/Box";

/**
 * A bold font wrapper for Material UI
 * @material
 * @example
 * <Bold>Bold Text</Bold>
 */
export const Bold = (props) => (
  <Box component="span" fontWeight="fontWeightBold">
    {props.children}
  </Box>
);

/**
 * An italics font wrapper for Material UI
 * @material
 * @example
 * <Italics>Bold Text</Italics>
 */
export const Italics = (props) => (
  <Box component="span" fontStyle="italic">
    {props.children}
  </Box>
);

/**
 * A wide font wrapper for Material UI
 * @material
 * @example
 * <Wide>Bold Text</Wide>
 */
export const Wide = (props) => (
  <Box component="span" letterSpacing={7}>
    {props.children}
  </Box>
);
